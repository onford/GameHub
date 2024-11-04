<?php
$minLength = 6; // 密码最小长度

$message = ""; // 报错信息

// 主要是用来给报错信息赋值的, 仅当$message没有被赋过值的时候才赋值
// 也就是说报错信息其实是请求过程当中碰到的第一个错误
// 函数不能直接修改外部变量, 只能通过引用传递进来
function assign(&$var, $value)
{
    if ($var == "") {
        $var = $value;
    }
}

//// 检查表单数据
// 检查是否存在未填项
foreach (["accountnumber", "password"] as $key) {
    if ($_POST[$key] == "") {
        if ($key == "accountnumber") {
            assign($message, "账号名为必填项");
        } else {
            assign($message, "密码为必填项");
        }
        break;
    }
}

// 检查密码长度
if (strlen($_POST["password"]) < $minLength) {
    assign($message, "密码不能小于" . $minLength . "位");
}

// 响应报文
$result = [
    "code" => 0, // 0代表无错误, 1代表有错误
    "msg" => $message,
    "data" => [],
];
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

$tableName = "userlist"; // 表名

// 查询用户名是否存在
$input_account = $_POST["accountnumber"];
$sql = "
    select * from $tableName
    where accountnumber = '$input_account';
";
$res = $conn->query($sql);
$real_password = "";
$cnt = 0;
if ($res) {
    while ($row = $res->fetch_assoc()) {
        $real_password = $row["password"];
        $cnt++;
    }
} else {
    assign($message, $conn->error);
}

if ($real_password == "") {
    assign($message, "账号名不存在");
}

// 检查密码是否正确
$input_password = $_POST["password"];
if ($input_password != $real_password) {
    assign($message, "密码不正确");
}

if ($message != "") {
    $result["msg"] = $message;
    $result["code"] = 1;
    echo json_encode($result);
    $conn->close();
    die();
}

$conn->close();

$result["data"] = [$_POST["accountnumber"]];

// 以json格式返回报文
echo json_encode($result);
