<?php
$rest = [
    "code" => 0,
    "msg" => "",
    "data" => [
        "usernames" => [],
        "statuss" => [],
        "newgame_names" => [],
        "versions" => [],
    ],
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

$recognize_id = intval($_POST["recognize_id"]);
$tablename = "newgame_list";

$sql = "
    select *
    from $tablename;
";

$res = $conn->query($sql);

if ($res) {
    // $row = $res->fetch_assoc();
    // $rest["data"]["username"] = $row["username"];
    // $rest["data"]["status"] = intval($row["status"]);
    // $rest["data"]["newgame_name"] = $row["newgame_name"];
    // $rest["data"]["version"] = intval($row["version"]);
    while ($row = $res->fetch_assoc()) {
        array_push($rest["data"]["usernames"], $row["username"]);
        array_push($rest["data"]["statuss"], intval($row["status"]));
        array_push($rest["data"]["newgame_names"], intval($row["newgame_name"]));
        array_push($rest["data"]["versions"], intval($row["version"]));
    }
} else {
    $conn->close();
    error_and_die($conn->error);
}

$conn->close();
echo json_encode($rest);
