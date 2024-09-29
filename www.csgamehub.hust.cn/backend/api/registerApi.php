<?php
$minLength = 6; // 密码最小长度
$message = "";
$result = [
    "code" => 0,
    "msg" => "",
    "data" => $_POST,
];

function assign(&$var, $value)
{
    if ($var == "") {
        $var = $value;
    }
}

// 检查表单是否有空项
foreach (["username", "password", "re_password"] as $key) {
    array_push($result["data"], $_POST[$key]);
    if ($_POST[$key] == "") {
        assign($message, "表单有未填项");
        break;
    }
}

if ($message != "") {
    $result["msg"] = $message;
    $result["code"] = 1;
    echo json_encode($result);
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
    $result["msg"] = $message;
    $result["code"] = 1;
    echo json_encode($result);
    $conn->close();
    die();
}

$table_name = "userlist";

// 检查用户名是否已被使用
$input_username = $_POST["username"];
$sql = "
    select * from $table_name
    where username = '$input_username';
";

$res = $conn->query($sql);
if ($res) {
    while ($row = $res->fetch_assoc()) {
        assign($message, "用户名已被使用");
        break;
    }
} else {
    assign($message, $conn->error);
}

if ($message != "") {
    $result["code"] = 1;
    $result["msg"] = $message;
    echo json_encode($result);
    $conn->close();
    die();
}

// 判断密码长度是否合法
$input_password = $_POST["password"];
if (strlen($input_password) < $minLength) {
    assign($message, "密码过短");
}

// 判断两次密码输入是否一样
$input_re_password = $_POST["re_password"];
if ($input_password != $input_re_password) {
    assign($message, "两次输入密码不同");
}

if ($message != "") {
    $result["code"] = 1;
    $result["msg"] = $message;
    $conn->close();
    echo json_encode($result);
    die();
}

// 将用户数据插入到用户表当中
$sql = "
    insert into $table_name
    values ('$input_username', '$input_password');
";
$res = $conn->query($sql);
if (!$res) {
    assign($message, $conn->error);
}

if ($message != "") {
    $result["code"] = 1;
    $result["msg"] = $message;
    $conn->close();
    echo json_encode($result);
    die();
}

$conn->close();
echo json_encode($result);
