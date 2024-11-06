<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
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
    // 设置上传目录
    $targetDirectory = "../user_icon/";
    $uploadOk = 1;

    // 创建上传目录（如果它不存在）
    if (!file_exists($targetDirectory)) {
        mkdir($targetDirectory, 0777, true);
    }

    // 处理每个文件
    foreach ($_FILES['file']['tmp_name'] as $key => $tmp_name) {
        $fileName = basename($_FILES['file']['name'][$key]);

        // 仅允许特定的文件类型
        $fileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $allowedTypes = ['jpg', 'png']; // 添加您允许的文件类型
        if (!in_array($fileType, $allowedTypes)) {
            error_and_die("抱歉，只允许上传 JPG, PNG 文件。");
            $uploadOk = 0;
        }

        $targetFilePath = $targetDirectory . $_POST["account"] . ".jpg";

        // 检查上传状态
        if ($uploadOk == 1) {
            // 尝试上传文件
            if (move_uploaded_file($tmp_name, $targetFilePath)) {} else {
                error_and_die("抱歉，上传文件发生错误。");
            }
        }
    }
    $conn->close();
    echo json_encode($rest);
} else {
    error_and_die("无效的请求方式。");
}