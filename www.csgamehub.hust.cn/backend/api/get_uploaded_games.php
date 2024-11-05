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

$gamename = $_POST['gamename'];
$username = $_POST['username'];
$tablename = "newgame_list";
if($gamename)
    $sql = "select * from $tablename where newgame_name = '$gamename' and username = '$username';"; // 选取特定游戏
else $sql = "select * from $tablename where username = '$username'"; // 选取所有游戏

$res = $conn->query($sql);
if ($res) {
    while ($row = $res->fetch_assoc()) {
        $new_node = [
            "newgame_id" => $row["newgame_id"],
            "gamename" => $row["newgame_name"],
            "version" => $row["version"],
            "uploadtime" => $row["uploadtime"],
            "status" => $row["status"],
        ];
        array_push($rest["data"], $new_node); // $new_node不能用json_encode转成json格式的对象, js认不出来
    }
} else {
    $conn->close();
    error_and_die($conn->error);
}

$conn->close();
echo json_encode($rest);
