<?php
$msg = "";
$data = [
    "usernames" => [],
    "comments" => [],
];
$rest = [
    "code" => 0,
    "msg" => $msg,
    "data" => $data,
];

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

if ($msg != "") {
    $rest["code"] = 1;
    $rest["msg"] = $msg;
    echo json_encode($rest);
    die();
}

$table_name = "comment_list";
$game_name = $_POST["gamename"];
$sql = "
    select username, comment
    from $table_name
    where gamename='$game_name';
";

$res = $conn->query($sql);

if ($res) {
    while ($row = $res->fetch_assoc()) {
        array_push($data["usernames"], $row["username"]);
        array_push($data["comments"], $row["comment"]);
    }
} else {
    assign($msg, $conn->error);
}

if ($msg != "") {
    $rest["code"] = 1;
    $rest["msg"] = $msg;
    echo json_encode($rest);
    die();
}

$rest["data"] = $data;

echo json_encode($rest);
