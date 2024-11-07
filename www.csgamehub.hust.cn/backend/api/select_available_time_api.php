<?php
$rest = [
    "code" => 0,
    "msg" => "",
    "data" => "",
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

$message_id = intval($_POST["message_id"]);
$sql = "
    select receive_accountnumber
    from message_list
    where message_id=$message_id;
";
$res = $conn->query($sql);
if ($res) {
    $accountnumber = $res->fetch_assoc()["receive_accountnumber"];
    $sql2 = "
        select available_time
        from userlist
        where accountnumber='$accountnumber';
    ";
    $res2 = $conn->query($sql2);
    if ($res2) {
        $rest["data"] = $res2->fetch_assoc()["available_time"];
    } else {
        $conn->close();
        error_and_die($conn->error);
    }
} else {
    $conn->close();
    error_and_die($conn->error);
}
$conn->close();
echo json_encode($rest);
