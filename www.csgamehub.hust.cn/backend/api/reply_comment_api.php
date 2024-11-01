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

$db_setting = require __DIR__ . "./../database/config.php";
$serverName = $db_setting["serverName"];
$username = $db_setting["username"];
$password = $db_setting["password"];
$dbName = $db_setting["databaseName"];
$conn = new mysqli($serverName, $username, $password, $dbName);
if ($conn->connect_error) {
    error_and_die("数据库连接错误");
}

// 传入的参数, 要回复的评论的id以及对应的root_id, 还有评论的内容, username,
$username = $_POST["username"];
$gamename = $_POST["gamename"];
$comment = $_POST["comment"];
$reference_id = $_POST["reference_id"];
if (is_string($reference_id)) {
    $reference_id = intval($reference_id);
}

$root_id = $_POST["root_id"];
if (is_string($root_id)) {
    $root_id = intval($root_id);
}
$tablename = "comment_list";
$sql = "
    insert into $tablename (username,gamename,comment,reference_id,root_id)
    values ('$username','$gamename','$comment',$reference_id,$root_id);
";

$res = $conn->query($sql);
if ($res) {

} else {
    error_and_die($conn->error);
}

$conn->close();
echo json_encode($rest);
