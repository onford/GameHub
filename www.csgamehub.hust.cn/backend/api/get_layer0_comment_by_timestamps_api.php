<?php

$rest = [
    "code" => 0,
    "msg" => "",
    "data" => [],
];

function error_and_die($msg)
{
    global $rest; // 函数作用域内无法访问外部变量, 需要加上global来访问
    $rest["code"] = 1;
    $rest["msg"] = $msg;
    echo json_encode($rest);
    die();
}

$db_setting = require __DIR__ . "./../database/config.php";
$serverName = $db_setting["serverName"];
$username = $db_setting["username"];
$password = $db_setting["password"];
$dbName = $db_setting["databaseName"];
$conn = new mysqli($serverName, $username, $password, $dbName);
if ($conn->connect_error) {
    error_and_die("数据库连接失败");
}

// 传入参数gamename
$gamename = $_POST['gamename'];
$username = $_POST['username'];
$tablename = "comment_list";
$liketable = "likelist";
$unliketable = "unlikelist";
$sql = "
    select *,
        (select count(*) from $liketable where $tablename.id = $liketable.comment_id and $liketable.username = '$username') as liked,
        (select count(*) from $unliketable where $tablename.id = $unliketable.comment_id and $unliketable.username = '$username') as unliked,
        (select count(*) from $liketable where $tablename.id = $liketable.comment_id) as likes,
        (select count(*) from $unliketable where $tablename.id = $unliketable.comment_id) as unlikes 
    from $tablename
    where gamename='$gamename' and root_id is NULL
    order by timestamps;
";
// liked: 用户是否点赞过这个评论 unliked: 用户是否点踩过这个评论 保证 liked,unliked in {0,1}

$res = $conn->query($sql);
if ($res) {
    while ($row = $res->fetch_assoc()) {
        $new_node = [
            "id" => $row["id"],
            "comment" => $row["comment"],
            "root_id" => $row["root_id"],
            "username" => $row["username"],
            "likes" => $row["likes"],
            "unlikes" => $row['unlikes'],
            "timestamps" => $row['timestamps'],
            'reference_id' => $row['reference_id'],
            "liked" => $row['liked'],
            "unliked" => $row['unliked'],
        ];
        array_push($rest["data"], $new_node); // $new_node不能用json_encode转成json格式的对象, js认不出来
    }
} else {
    $conn->close();
    error_and_die($conn->error);
}

$conn->close();
echo json_encode($rest);
