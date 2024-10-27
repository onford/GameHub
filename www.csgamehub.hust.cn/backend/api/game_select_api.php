<?php
$msg = "";
$data = [];

$rest = [
    "code" => 0,
    "msg" => $msg,
    "data" => $data
];

function assign(&$var, $value) {
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
    assign($msg, "数据库连接错误");
}

if ($msg != "") {
    $rest["code"] = 1;
    $rest["msg"] = $msg;
    echo json_encode($rest);
    die();
}

// 查询最多前五条记录
$table_name = "game_list";
$sql = "
    select game_name
    from $table_name
    limit 5;
";

$res = $conn->query($sql);
if ($res) {
    while ($row = $res->fetch_assoc()) {
        array_push($data, $row["game_name"]);
    }
} else {
    assign($msg, $conn->error);
}

if ($msg != "") {
    $rest["code"] = 1;
    $rest["msg"] = $msg;
    $conn->close();
    echo json_encode($rest);
    die();
}

$rest["data"] = $data;
$conn->close();

echo json_encode($rest);