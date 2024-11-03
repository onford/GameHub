<?php
$rest = [
    "code" => 0,
    "msg" => "",
    "newgame_id" => 0,
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

$newgamename = $_POST["gamename"];
$sql = "select count(*) as OK from game_list where gamename = $newgamename;";

$res = $conn->query($sql);
if ($res) {
    if($res->fetch_assoc()["OK"]){
        error_and_die("存在已注册的游戏名");
    }
} else {
    $conn->close();
    error_and_die($conn->error);
}

$sql = "select count(*) as OK from newgame_list where newgame_name = $newgamename;";

$res = $conn->query($sql);
if ($res) {
    if($res->fetch_assoc()["OK"]){
        error_and_die("审核数据库中存在该游戏名");
    }
} else {
    $conn->close();
    error_and_die($conn->error);
}

// $sql = "select count(*) as OK from newgame_list where newgame_name = $newgamename;";

$conn->close();
echo json_encode($rest);
