<?php
$min_len = 6; //新密码的长度
$msg = "";
$rest = [
    "code" => 0,
    "msg" => $msg,
    "data" => [],
];
function assign(&$var, $value)
{
    if ($var == "") {
        $var = $value;
    }
}
//检查一下有没有空项
foreach (["old_password", "new_password", "re_new_password"] as $key) {
    if ($_POST[$key] == "") {
        assign($msg, "表单有未填项");
        break;
    }
}
if ($msg != "") {
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
    assign($msg, "数据库连接错误");
}
//检查输入的旧密码是否正确
$table_name = "userlist";
$old_pass = $_POST["old_password"];
$sql = "
    select * from $table_name
    where password='$old_pass';
";
$res = $conn->query($sql);
$flag = 0;
if ($res) {
    while ($row = $res->fetch_assoc()) {
        $flag = 1;
        break;
    }
} else {
    assign($msg, $conn->error);
}
if ($flag == 0) {
    assign($msg, "旧密码输入错误");
}
if ($msg != "") {
    $rest["code"] = 1;
    $rest["msg"] = $msg;
    echo json_encode($rest);
    $conn->close();
    die();
}
//检查新密码的长度
$new_pass = $_POST["new_password"];
if (strlen($new_pass) < $min_len) {
    assign($msg, "新密码长度至少要有6位");
}
if ($msg != "") {
    $rest["code"] = 1;
    $rest["msg"] = $msg;
    echo json_encode($rest);
    $conn->close();
    die();
}
//检查两次输入的密码是否相同
$re_pass = $_POST["re_new_password"];
if ($re_pass != $new_pass) {
    assign($msg, "两次输入的新密码不相同");
}
if ($msg != "") {
    $rest["code"] = 1;
    $rest["msg"] = $msg;
    echo json_encode($rest);
    $conn->close();
    die();
}
//看新密码和旧密码是否相同
if ($new_pass == $old_pass) {
    assign($msg, "新密码不能和旧密码相同");
}
if ($msg != "") {
    $rest["code"] = 1;
    $rest["msg"] = $msg;
    echo json_encode($rest);
    $conn->close();
    die();
}
//开始更新密码
$username = $_POST["username"];
$sql = "
    update $table_name
    set password='$new_pass'
    where username='$username';
";
$res = $conn->query($sql);
if ($res) {} else {
    assign($msg, $conn->error);
}
if ($msg != "") {
    $rest["code"] = 1;
    $rest["msg"] = $msg;
    echo json_encode($rest);
    $conn->close();
    die();
}
echo json_encode($rest);
