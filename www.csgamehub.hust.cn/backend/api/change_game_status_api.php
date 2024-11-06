<?php
$rest = [
    "code" => 0,
    "msg" => "",
    "data" => [],
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
$content = $_POST["content"];

//检查评语是否为空
if ($content == "") {
    $conn->close();
    error_and_die("评语不能为空");
}

$status = intval($_POST["status"]);
$tablename1 = "message_list";
$tablename2 = "content_list";
$sql1 = "
    select recognize_id
    from $tablename1
    where message_id=$message_id;
";

$res = $conn->query($sql1);

$recognize_id = 0;

//找出newgame_id
if ($res) {
    $recognize_id = $res->fetch_assoc()["recognize_id"];
} else {
    $conn->close();
    error_and_die($conn->error);
}

//在content表里面插入评语
$sql2 = "
    insert into $tablename2
    values ($recognize_id,'$content');
";

$res = $conn->query($sql2);

$tablename3 = "newgame_list";

//更新游戏状态
if ($res) {} else {
    $conn->close();
    error_and_die($conn->error);
}

$sql3 = "
    update $tablename3
    set status=$status
    where newgame_id=$recognize_id;
";

$res = $conn->query($sql3);
if ($res) {
} else {
    $conn->close();
    error_and_die($conn->error);
}

$conn->close();
echo json_encode($rest);
