<?php
$message = "";
$rest = [
    "code" => 0,
    "msg" => $message,
    "data" => ["timestamp" => [], "comment_id" => [],],
];

function assign(&$var, $value)
{
    if ($var == "") {
        $var = $value;
    }
}

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
    assign($message, "数据库连接错误");
}

if ($message != "") {
    $rest["code"] = 1;
    $rest["msg"] = $message;
    echo json_encode($rest);
    die();
}

$table_name = "comment_list";
$comment_text = $_POST["reply_text"];
$user_name = $_POST["username"];
$game_name = $_POST["gamename"];
$reference_id = $_POST["reference_id"];
$root_id = $_POST["root_id"];

//检查评论内容是否为空
if ($comment_text == "") {
    assign($message, "评论内容不能为空");
}

if ($message != "") {
    $rest["code"] = 1;
    $rest["msg"] = $message;
    $conn->close();
    echo json_encode($rest);
    die();
}

$now_timestamps = date('Y-m-d H:i:s');
$sql = "
    insert into $table_name (username, gamename, comment,timestamps,reference_id,root_id)
    values ('$user_name', '$game_name', '$comment_text','$now_timestamps','$reference_id','$root_id');
";
$res = $conn->query($sql);

if ($res) {
    array_push($rest["data"]["timestamp"],$now_timestamps);
} else {
    assign($message, $conn->error);
}

$sql = "select last_insert_id() as last_id;"; // 获取新插入的评论的id
$res = $conn->query($sql);

if($res){
    array_push($rest["data"]["comment_id"],$res->fetch_assoc()["last_id"]);
} else {
    assign($message, $conn->error);
}


if ($message != "") {
    $rest["code"] = 1;
    $rest["msg"] = $message;
    $conn->close();
    echo json_encode($rest);
    die();
}

$conn->close();

echo json_encode($rest);
