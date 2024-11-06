<?php
$rest = [
    "code" => 0,
    "msg" => "",
    "data" => [

    ],
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

$message_id = intval($_POST["message_id"]);
$tablename = "message_list";

$sql = "
    delete from $tablename
    where message_id=$message_id;
";

$res = $conn->query($sql);

if (!$res) {
    $conn->close();
    error_and_die($conn->error);
}

$conn->close();
echo json_encode($rest);