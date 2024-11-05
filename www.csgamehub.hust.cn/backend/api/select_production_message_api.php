<?php
$rest = [
    "code" => 0,
    "msg" => "",
    "data" => [
        "message_titles" => [],
        "message_status" => [],
        "timestamps" => [],
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

// function die_with_ok()
// {
//     global $rest;
//     echo json_encode($rest);
//     die();
// }

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

//从消息中心取出消息类型为作品上传的消息(message_type=0)
$tablename = "message_list";

$sql = "
    select *
    from $tablename
    where message_type=0;
";

$res = $conn->query($sql);
if ($res) {
    while ($row = $res->fetch_assoc()) {
        array_push($rest["data"]["message_titles"], $row["message_title"]);
        array_push($rest["data"]["message_status"], $row["message_status"]);
        array_push($rest["data"]["timestamps"], $row["timestamps"]);
        array_push($rest["data"]["accountnumbers"], $row["receive_accountnumber"]);
    }
} else {
    $conn->close();
    error_and_die($conn->error);
}

$conn->close();
echo json_encode($rest);
