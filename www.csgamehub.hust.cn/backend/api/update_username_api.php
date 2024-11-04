<?php
$rest = [
    "code" => 0,
    "msg" => "",
    "data" => [],
];

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
    error_and_die("数据库连接失败");
}

$accountnumber = $_POST["accountnumber"];
$username = $_POST["username"];
$new_username = $_POST["new_username"];

//新用户名不能为空
if ($new_username == "") {
    $conn->close();
    error_and_die("新用户名不能为空");
}
$tablename = "userlist";

//新用户名不能重复
$sql = "
    select username
    from $tablename
    where username='$new_username';
";

$res = $conn->query($sql);
if ($res) {
    if ($res->fetch_assoc()) {
        error_and_die("用户名已存在");
    }
} else {
    error_and_die($conn->error);
}

$sql = "
    update $tablename
    set username='$new_username'
    where accountnumber='$accountnumber';
";

$res = $conn->query($sql);

if ($res) {

} else {
    $conn->close();
    error_and_die($conn->error);
}

$conn->close();
echo json_encode($rest);
