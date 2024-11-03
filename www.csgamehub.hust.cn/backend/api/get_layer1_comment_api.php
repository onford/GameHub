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

// 参数: 一个layer为0的评论, 需要这个评论的id
// 遍历所有的评论看哪个评论的root_id等于传入评论的id

// 子评论无论在什么情况都是按时间排序的

$layer_0_comment_id = intval($_POST["id"]);
$username = $_POST["username"];
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
    where root_id=$layer_0_comment_id
    order by `timestamps` asc;
";
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
        array_push($rest["data"], $new_node);
    }
} else {
    $conn->close();
    error_and_die($conn->error);
}

$conn->close();
echo json_encode($rest);
