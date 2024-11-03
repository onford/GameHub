<?php
// 上传文件实现（但是好像fetch不到）
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
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
        $targetFilePath = $targetDirectory . $fileName;

        // 检查文件是否已存在
        if (file_exists($targetFilePath)) {
            echo "文件 $fileName 已存在。";
            $uploadOk = 0;
        }

        // 仅允许特定的文件类型
        $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
        $allowedTypes = ['jpg', 'png', 'gif', 'pdf', 'zip', 'txt']; // 添加您允许的文件类型
        if (!in_array($fileType, $allowedTypes)) {
            echo "抱歉，只允许上传 JPG, PNG, GIF, PDF, ZIP 和 TXT 文件。";
            $uploadOk = 0;
        }

        // 检查上传状态
        if ($uploadOk == 1) {
            // 尝试上传文件
            if (move_uploaded_file($tmp_name, $targetFilePath)) {
                echo "文件 $fileName 上传成功。";
            } else {
                echo "抱歉，上传文件发生错误。";
            }
        }
    }
} else {
    echo "无效的请求方式。";
}

