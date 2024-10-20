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
        <div class="main flex-container">
            <form action="" onsubmit=submitForm(event) class="flex-container" id="update_password_form">
                <ul>
                    <li class="line line-container">
                        <span class="input_title">旧密码: </span>
                        <input type="password" name="old_password" class="input_box">
                    </li>
                    <li class="line line-container">
                        <span class="input_title">新密码: </span>
                        <input type="password" name="new_password" class="input_box">
                    </li>
                    <li class="line line-container">
                        <span class="input_title">确认密码: </span>
                        <input type="password" name="re_new_password" class="input_box">
                    </li>
                    <li id="invisible_line">
                        <input type="text" name="username" id="invisible_input_box">
                    </li>
                    <li class="line">
                        <input type="submit" value="确认" class="confirm_button btn">
                        <!-- <input type="button" value="登出" class="logout_button btn"> -->
                        <button class="logout_button btn" onclick="logoutHandle(event)">登出</button>
                    </li>
                </ul>
            </form>
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

    function submitForm(event) {
        event.preventDefault();
        console.log("表单已被提交");
        const url = "./../../backend/api/change_password_api.php";
        var update_form = document.getElementById("update_password_form");
        var formData = new FormData(update_form);
        fetch(url, {
            method: "POST",
            body: formData
        }).then(response => response.json())
            .then(data => {
                if (data.code != 0) {
                    alert(data.msg);
                }
                else {
                    alert("修改成功");
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    function init() {
        var sp_input = document.getElementById("invisible_input_box");
        sp_input.value = localStorage.getItem("username");
    }

    window.onload = init();

    function logoutHandle(event) {
        event.preventDefault();
        console.log("登出事件触发");
        const flag = confirm("确定登出账号吗?");
        if (flag == true) {
            window.location.href = "./login.php";
        }
    }
</script>

</html>
