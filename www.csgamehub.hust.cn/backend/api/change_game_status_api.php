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

//判断是否没有选择审核状态
if ($status == 0) {
    $conn->close();
    error_and_die("请选择审核结果");
}

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
    $recognize_id = intval($res->fetch_assoc()["recognize_id"]);
} else {
    $conn->close();
    error_and_die($conn->error);
}

$content_header = "";
$sql4 = "
    select newgame_name,version
    from newgame_list
    where newgame_id=$recognize_id;
";

$res = $conn->query($sql4);
if ($res) {
    $row = $res->fetch_assoc();
    $content_header = "游戏名: " . $row['newgame_name'];
    $content_header = $content_header . " 版本号: " . (intval($row["version"]) + 1) . ".0\n";
} else {
    $conn->close();
    error_and_die($conn->error);
}

if ($status == 1) {
    $content_header = $content_header . "<br>评语: ";
} else {
    $content_header = $content_header . "<br>原因: ";
}
$content = $content_header . $content;

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

//在newgamelist里面找到用户名
$sql = "
    select username
    from newgame_list
    where newgame_id=$recognize_id;
";

$res = $conn->query($sql);
$username = "";
if ($res) {
    $username = $res->fetch_assoc()['username'];
} else {
    $conn->close();
    error_and_die($conn->error);
}

//用用户名在userlist找到accountnumber
$sql = "
    select accountnumber
    from userlist
    where username='$username';
";

$res = $conn->query($sql);
$accountnumber = "";

if ($res) {
    $accountnumber = $res->fetch_assoc()["accountnumber"];
} else {
    $conn->close();
    error_and_die($conn->error);
}

//在消息中心插入一条转发给对应用户的消息
$message_title = "";
if ($status == 1) {
    $message_title = "你的游戏审核已通过";
} else {
    $message_title = "你的游戏审核已驳回";
}
$sql = "
    insert into message_list (message_type,message_title,timestamps,recognize_id,status,receive_accountnumber)
    values (0,'$message_title',NOW(),$recognize_id,0,'$accountnumber');
";

$res = $conn->query($sql);
if ($res) {} else {
    $conn->close();
    error_and_die($conn->error);
}

$conn->close();
echo json_encode($rest);
