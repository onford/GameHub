<?php
$rest = [
    "code" => 0,
    "msg" => "",
    "data" => [ "code" => 3,],
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

function check_empty_and_assign($sql,$val){
    global $rest;
    global $conn;
    $res = $conn->query($sql);
    if ($res) {
        if($res->fetch_assoc()){
            $rest["data"]["code"] = $val;
            $conn->close();
            echo json_encode($rest);
            die();
        }
    } else {
        $conn->close();
        error_and_die($conn->error);
    }
}

$newgamename = $_POST["gamename"];
$username = $_POST["username"];
$sql = "select * from game_list where gamename = '$newgamename';";

check_empty_and_assign($sql,0);

$sql = "select * from newgame_list where newgame_name = '$newgamename' and username <> '$username';";

check_empty_and_assign($sql,0);

$sql = "select * from newgame_list where newgame_name = '$newgamename' and username = '$username' and `status` = 0;";

check_empty_and_assign($sql,1);

$conn->close();
echo json_encode($rest);
