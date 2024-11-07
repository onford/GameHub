<?php
$rest = [
    "code" => 0,
    "msg" => "",
    "data" => [
        "message_ids" => [],
        "message_titles" => [],
        "timestampss" => [],
        "recognize_ids" => [],
        "statuss" => [],
        "receive_accountnumbers" => [],
        "judge_statuss" => [],
        "contents" => [],
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

$accountnumber = $_POST["accountnumber"];

$sql = "
    select *
    from message_list
    where receive_accountnumber='$accountnumber';
";

$res = $conn->query($sql);
if ($res) {
    while ($row = $res->fetch_assoc()) {
        array_push($rest["data"]["message_ids"], intval($row["message_id"]));
        array_push($rest["data"]["message_titles"], $row["message_title"]);
        array_push($rest["data"]["timestampss"], $row["timestamps"]);
        $recognize_id = intval($row["recognize_id"]);
        array_push($rest["data"]["recognize_ids"], $recognize_id);
        array_push($rest["data"]["statuss"], intval($row["status"]));

        // $recognize_id = intval($row["recognize_id"]);
        $sql2 = "
            select status
            from newgame_list
            where newgame_id=$recognize_id;
        ";

        $res2 = $conn->query($sql2);
        if ($res2) {
            $status = intval($res2->fetch_assoc()["status"]);
            array_push($rest["data"]["judge_statuss"], $status);
            if ($status != 0) {
                $sql3 = "
                    select message_content
                    from content_list
                    where recognize_id=$recognize_id;
                ";
                $res3 = $conn->query($sql3);
                if ($res3) {
                    $content = $res3->fetch_assoc()["message_content"];
                    array_push($rest["data"]["contents"], $content);
                } else {
                    $conn->close();
                    error_and_die($conn->error);
                }
            } else {
                array_push($rest["data"]["contents"], null);
            }
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
