<?php
$message = "";
$rest = [
    "code" => 0,
    "msg" => $message,
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

$table_name = "comment_list";
$remove_id = $_POST["id"];

$sql = "
    delete from $table_name
    where id = $remove_id;
";
$res = $conn->query($sql);

if ($res) {} else {
    assign($message, $conn->error);
}

if ($message != "") {
    $rest["code"] = 1;
    $rest["msg"] = $message;
    $conn->close();
    echo json_encode($rest);
    die();
}

$conn->close();

echo json_encode($rest);
