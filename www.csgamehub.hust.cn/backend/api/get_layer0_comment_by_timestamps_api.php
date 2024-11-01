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
$tablename = "comment_list";
$sql = "
    select *
    from $tablename
    where gamename='$gamename' and root_id is NULL
    order by timestamps;
";

$res = $conn->query($sql);
if ($res) {
    while ($row = $res->fetch_assoc()) {
        $new_node = [
            "id" => $row["id"],
            "comment" => $row["comment"],
            "post_id" => $row["post_id"],
            "username" => $row["username"],
            "likes" => $row["likes"],
            "unlikes" => $row['unlikes'],
            "timestamps" => $row['timestamps'],
            'reference_id' => $row['reference_id'],
        ];
        array_push($rest["data"], $new_node); // $new_node不能用json_encode转成json格式的对象, js认不出来
    }
} else {
    $conn->close();
    error_and_die($conn->error);
}

$conn->close();
echo json_encode($rest);
