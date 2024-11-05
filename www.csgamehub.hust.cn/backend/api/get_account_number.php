<?php
$rest = [
    "code" => 0,
    "msg" => "",
    "data" => [ "accountnumber" => "null",],
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

$username = $_POST["username"];

$tablename = "userlist";
$sql = "select accountnumber from $tablename where username = '$username';";

$res = $conn->query($sql);
if ($res) {
    $rest["data"]["accountnumber"] = $res->fetch_assoc()["accountnumber"];
} else {
    $conn->close();
    error_and_die($conn->error);
}

$conn->close();
echo json_encode($rest);
