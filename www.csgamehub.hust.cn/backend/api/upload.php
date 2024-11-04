<?php
// 上传文件实现（但是好像fetch不到）
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // -----------------------更新数据库-----------------------
    $rest = [
        "code" => 0,
        "msg" => "",
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

    $tablename = "newgame_list";
    $username = $_POST["username"];
    $newgame_name = $_POST["newgame_name"];
    $sql = "select * from $tablename where newgame_name = '$newgame_name';";
    if($conn->query($sql)->fetch_assoc()){
        $sql = "select * from $tablename where newgame_name = '$newgame_name' and `status` = 0;";
        $res = $conn->query($sql)->fetch_assoc();
        if($res){
            $zip_name = $res["newgame_id"];
        } else {
            $sql = "select 1 + max(version) as nv from $tablename where newgame_name = '$newgame_name';";
            $next_version = $conn->query($sql)->fetch_assoc()["nv"];
            $sql = "insert into $tablename (username,newgame_name,status,version) values ('$username','$newgame_name',0,$next_version);";
            $conn->query($sql);
            $zip_name = $conn->query("select last_insert_id() as id")->fetch_assoc()["id"];
        }
    } else {
        $next_version = 0;
        $sql = "insert into $tablename (username,newgame_name,status,version) values ('$username','$newgame_name',0,0);";
        $conn->query($sql);
        $zip_name = $conn->query("select last_insert_id() as id")->fetch_assoc()["id"];
    }

    // -----------------------上传文件-----------------------


    // 设置上传目录
    $targetDirectory = "../uploads/";
    $uploadOk = 1;

    // 创建上传目录（如果它不存在）
    if (!file_exists($targetDirectory)) {
        mkdir($targetDirectory, 0777, true);
    }

    // 处理每个文件
    foreach ($_FILES['file']['tmp_name'] as $key => $tmp_name) {
        $fileName = basename($_FILES['file']['name'][$key]);

        // 允许覆盖，如何正确命名，避免错误的覆盖，是另一个 php 应该做的事情。

        // 检查文件是否已存在
        // if (file_exists($targetFilePath)) {
        //     echo "文件 $fileName 已存在。";
        //     $uploadOk = 0;
        // }

        // 仅允许特定的文件类型
        $fileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $allowedTypes = ['jpg', 'png', 'gif', 'pdf', 'zip', 'txt']; // 添加您允许的文件类型
        if (!in_array($fileType, $allowedTypes)) {
            error_and_die("抱歉，只允许上传 JPG, PNG, GIF, PDF, ZIP 和 TXT 文件。");
            $uploadOk = 0;
        }

        $targetFilePath = $targetDirectory . $zip_name . "." . $fileType;

        // 检查上传状态
        if ($uploadOk == 1) {
            // 尝试上传文件
            if (move_uploaded_file($tmp_name, $targetFilePath)) {} else {
                error_and_die("抱歉，上传文件发生错误。");
            }
        }
    }
} else {
    error_and_die("无效的请求方式。");
}

$conn->close();
echo json_encode($rest);