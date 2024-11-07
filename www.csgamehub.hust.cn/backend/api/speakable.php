<?php
$message = "";
$rest = [
    "code" => 0,
    "msg" => $message,
    "data" => 1,
    "available" => "",
];

function assign(&$var, $value)
{
    if ($var == "") {
        $var = $value;
    }
}

function error_and_die($msg)
{
    global $rest;
    $rest["code"] = 1;
    $rest["msg"] = $msg;
    echo json_encode($rest);
    die();
}

// 连接数据库
$db_setting = require __DIR__ . "./../database/config.php";
$serverName = $db_setting["serverName"];
$username = $db_setting["username"];
$password = $db_setting["password"];
$dbName = $db_setting["databaseName"];
$conn = new mysqli($serverName, $username, $password, $dbName);

if ($conn->connect_error) {
    assign($message, "数据库连接错误");
}

if ($message != "") {
    $rest["code"] = 1;
    $rest["msg"] = $message;
    echo json_encode($rest);
    die();
}

$table_name = "userlist";
$account = $_POST["account"];


$now_timestamps = date('Y-m-d H:i:s');
$sql = "
    select available_time from $table_name where accountnumber = '$account' and available_time > '$now_timestamps';
";

$res = $conn->query($sql);

if ($res) {
    $dt = $res->fetch_assoc();
    if($dt){
        $rest["data"] = 0;
        $rest["available"] = $dt["available_time"];
    }
} else {
    assign($message, $conn->error);
}

$conn->close();

echo json_encode($rest);
