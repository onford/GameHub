<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./../css/personalCenter.css">
</head>
<body>
    <div class="flex-container" id="background_container">
        <div class="lefter">
            <img src="./../../src/images/test_icon.webp" alt="" class="profile_pic">
            <div>
                <p class="option" onclick="jumpHandle1(event)">消息中心</p>
            </div>
            <div>
                <p class="option" onclick="jumpHandle2(event)">创作中心</p>
            </div>
            <div>
                <p class="option" onclick="jumpHandle3(event)">账号管理</p>
            </div>
            <div>
                <p class="option">
                    <a href="./gamepage.php">返回首页</a>
                </p>
            </div>
        </div>
        <div class="main">
        </div>
    </div>
</body>
<script>
    function jumpHandle1(event) {
        event.preventDefault();
        console.log("跳转页面事件触发");
        window.location.href = "./messageCenter.php";
    }

    function jumpHandle2(event) {
        event.preventDefault();
        console.log("跳转页面事件触发");
        window.location.href = "./codeUpload.php";
    }

    function jumpHandle3(event) {
        event.preventDefault();
        console.log("跳转页面事件触发");
        window.location.href = "./accountManager.php";
    }
</script>
</html>
