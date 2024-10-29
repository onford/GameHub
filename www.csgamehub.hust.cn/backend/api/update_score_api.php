<?php
$msg = "";
$rest = [
    "code" => 0,
    "msg" => $msg,
    "data" => [],
];

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
    assign($msg, "数据库连接错误");
}

if ($msg != "") {
    $rest["code"] = 1;
    $rest["msg"] = $msg;
    echo json_encode($rest);
    die();
}

//首先检查用户有没有玩过这个游戏,就是是否存在(username,gamename)
$db_highest_score = -1;
$score = $_POST['score'];

$username = $_POST['username'];
$gamename = $_POST['gamename'];
$sql = "
    select highest_score
    from $tablename
    where username='$username' and gamename='$gamename';
";
$res = $conn->query($sql);
if ($res) {
    while ($row = $res->fetch_assoc()) {
        $db_highest_score = $row["highest_score"];
    }
} else {
    $assign($msg, $conn->error);
}

if ($db_highest_score == -1) { //用户没有玩过这个游戏
    $insert_sql = "
        insert into $tablename
        values ('$username','$gamename','$score');
    ";
    $res2 = $conn->query($insert_sql);
    if ($res2) {

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
}

if ($score > $db_highest_score) { //更新最高分数
    $update_sql = "
        update $tablename
        set $db_highest_score=$score
        where username='$username' and gamename='$gamename';
    ";
    $res3 = $conn->query($update_sql);
    if (res3) {

    } else {
        $assign($msg, $conn->error);
    }
    if ($msg != "") {
        $rest["code"] = 1;
        $rest["msg"] = $msg;
        $conn->close();
        echo json_encode($rest);
        die();
    }
}

$conn->close();
echo json_encode($rest);
