<?php
$rest = [
    "code" => 0,
    "msg" => "",
    "data" => [
        "usernames" => [],
        "accountnumbers" => [],
    ],
];

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
    error_and_die("数据库连接失败");
}

$tablename = "userlist";
$page_no = $_POST["page_no"];
$offset = ($page_no - 1) * 9;
$sql = "
    select username,accountnumber
    from $tablename
    limit $offset,9;
";
$res = $conn->query($sql);

if ($res) {
    while ($row = $res->fetch_assoc()) {
        array_push($rest["data"]["usernames"], $row["username"]);
        array_push($rest["data"]["accountnumbers"], $row["accountnumber"]);
    }
} else {
    $conn->close();
    error_and_die($conn->error);
}

$conn->close();
echo json_encode($rest);
