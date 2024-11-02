<?php
$rest = [
    "code" => 0,
    "msg" => "",
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

$comment_id = $_POST['comment_id'];
$username = $_POST['username'];

if ($_POST['operation'] == 0) {
    $tablename = "likelist";
    $sql = "delete from $tablename where username = '$username' and comment_id = $comment_id;";
} else if ($_POST['operation'] == 1) {
    $tablename = "likelist";
    $sql = "insert into $tablename values('$username',$comment_id);";
} else if ($_POST['operation'] == 2) {
    $tablename = "unlikelist";
    $sql = "delete from $tablename where username = '$username' and comment_id = $comment_id;";
} else {
    $tablename = "unlikelist";
    $sql = "insert into $tablename values('$username',$comment_id);";
}

$res = $conn->query($sql);
if ($res) {} else {
    $conn->close();
    error_and_die($conn->error);
}

$conn->close();
echo json_encode($rest);
