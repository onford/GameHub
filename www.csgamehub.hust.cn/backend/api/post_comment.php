<?php
$message = "";
$rest = [
    "code" => 0,
    "msg" => $message,
    "data" => [],
];
// echo json_encode($rest);

array_push($rest["data"], $_POST);

function assign(&$var, $value)
{
    if ($var == "") {
        $var = $value;
    }
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
$comment_text = $_POST["comment_text"];
$user_name = $_POST["username"];
$game_name = $_POST["gamename"];

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

$sql = "
    insert into $table_name (username, gamename, comment,timestamps)
    values ('$user_name', '$game_name', '$comment_text',NOW());
";
$res = $conn->query($sql);

if ($res) {

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
