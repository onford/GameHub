<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>login</title>
    <link rel="stylesheet" href="./../css/login.css">
    <!-- <link rel="stylesheet" href="//unpkg.com/element-plus/dist/index.css" /> -->
</head>

<body>
    <form action="" onsubmit="submitForm(event)" id="loginForm">
        <ul>
            <li class="line">
                <span>用户名: </span>
                <input type="text" name="username">
            </li>
            <li class="line">
                <span>密码: </span>
                <input type="password" name="password">
            </li>
            <li class="line">
                <input type="submit" value="登录" class="login_button">
                <a href="./register.php" style="font-size: 14px;">没有账号?注册</a>
            </li>
        </ul>
    </form>
</body>

<script>
function submitForm(event) {
    event.preventDefault();
    console.log("表单被提交了");
    var loginForm = document.getElementById("loginForm");
    var formData = new FormData(loginForm);
    var url = "./../../backend/api/loginApi.php";
    fetch(url, {
        method: "POST",
        body: formData
    }).then(response => response.json())
    .then(data => { // data是从api传过来转成json格式的数据
        console.log(data);
        if (data.code != 0) {
            alert(data.msg);
        } else {
            console.log("登录成功");
            console.log(data.data[0]);

            // 保存在localStorage用于后续界面用户名显示
            localStorage.setItem("username", data.data[0]);
            console.log(localStorage.getItem("username"));
            window.location.href = "./gamepage.php";
        }
    }).catch(error => {
        console.log("error: " + error);
    })
}

</script>

</html>
