<?php
$rest = [
    "code" => 0,
    "msg" => "",
    "data" => [ "result" => 2,],
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
$account = $_POST["account"];

$tablename = "userlist";
if($conn->query("select * from $tablename where username = '$username';")->fetch_assoc() == null){
    $rest["data"]["result"] = 0;
}
else if($conn->query("select accountnumber from $tablename where username = '$username';")->fetch_assoc()["accountnumber"] != $account){
    $rest["data"]["result"] = 1;
}

$conn->close();
echo json_encode($rest);
