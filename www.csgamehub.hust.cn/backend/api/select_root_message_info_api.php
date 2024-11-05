<?php
$rest = [
    "code" => 0,
    "msg" => "",
    "data" => [
        "timestampss" => [],
        // "recognize_ids" => [], 不需要了
        "statuss" => [],
        "usernames" => [],
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

$tablename1 = "message_list";

$sql1 = "
    select *
    from $tablename1
    where message_type = 0;
";

$res1 = $conn->query($sql1);

if ($res1) {
    while ($row1 = $res1->fetch_assoc()) {
        array_push($rest["data"]["timestampss"], $row1["timestamps"]);
        // array_push($rest["data"]["recognize_ids"], $row1["recognize_id"]); // 已经不需要这个数据了
        // 利用recognize_id在newgame_list再进行一次查询

        $tablename2 = "newgame_list";
        $recognize_id = $row1["recognize_id"];

        $sql2 = "
            select *
            from $tablename2
            where newgame_id = $recognize_id;
        ";

        $res2 = $conn->query($sql2);

        if ($res2) {
            $row2 = $res2->fetch_assoc();
            array_push($rest["data"]["usernames"], $row2["username"]);
            array_push($rest["data"]["statuss"], intval($row2["status"]));
            array_push($rest["data"]["newgame_names"], $row2["newgame_name"]);
            array_push($rest["data"]["versions"], intval($row2["version"]));
        } else {
            $conn->close();
            error_and_die($conn->error);
        }
    }
} else {
    $conn->close();
    error_and_die($conn->error);
}

$conn->close();
echo json_encode($rest);
