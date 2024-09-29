<?php
$msg = "";

function assign(&$var, $value)
{
    if ($var=="") {
        $var == $value;
    }
}

$result = [
    "code" => 0,
    "msg" => $msg,
    "data" => $_POST,
];

echo json_encode($result);

// 数据库连接
// $db_setting = require __DIR__ . "./../database/config.php";
// $serverName = $db_setting["serverName"];
// $username = $db_setting["username"];
// $password = $db_setting["password"];
// $dbName = $db_setting["databaseName"];
// $conn = new mysqli($serverName, $username, $password, $dbName);
// if ($conn->connect_error) {
//     assign($message, "数据库连接错误");
// }
