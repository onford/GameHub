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

function die_with_ok()
{
    global $rest;
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

$username = $_POST["username"];
$option = $_POST['forbidden-time'];

// array_push($rest["data"], $option);

if ($option == "0") { //什么都不要做就好了
    // array_push($rest["data"], $option);
    die_with_ok();
}

$now_timestamps = date('Y-m-d H:i:s');
$datetime = new DateTime($now_timestamps);

if ($option == "1") { //封禁十分钟
    $datetime->modify("+10 minutes");
} else if ($option == "2") { //封禁一小时
    $datetime->modify("+1 hour");
} else if ($option == "3") { //封禁一天
    $datetime->modify("+1 day");
} else if ($option == '4') { //啥也不干, 等同于设为现在的时间, 即撤销禁言
}

$new_timestamps = $datetime->format("Y-m-d H:i:s");

$tablename = "userlist";

//把得到的新时间戳进行update
$sql = "
    update $tablename
    set available_time='$new_timestamps'
    where username='$username';
";

$res = $conn->query($sql);

if ($res) {

} else {
    $conn->close();
    error_and_die($conn->error);
}

array_push($rest["data"], $new_timestamps);
array_push($rest["data"], $username);

$conn->close();
echo json_encode($rest);
