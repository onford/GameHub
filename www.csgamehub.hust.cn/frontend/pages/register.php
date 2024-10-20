<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>register</title>
    <link rel="stylesheet" href="./../css/register.css">
</head>
<body>
    <form action="" onsubmit="submitForm(event)" id="register_form">
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
                <span>确认密码: </span>
                <input type="password" name="re_password">
            </li>
            <li class="line">
                <input type="submit" value="注册" class="register_button">
                <a href="./login.php" style="font-size: 14px;">已有账号?登录</a>
            </li>   
        </ul>
    </form>
</body>

<script>
function submitForm(event) {
    event.preventDefault();
    console.log("表单提交了");
    var url = "./../../backend/api/registerApi.php";
    var register_form = document.getElementById("register_form");
    var formData = new FormData(register_form);
    fetch(url, {
        method: "POST",
        body: formData
    }).then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.code != 0) {
            alert(data.msg);
        } else {
            // console.log("注册成功");
            alert("注册成功");
            window.location.href="./login.php";
        }
    }).catch(error => {
        console.log("error: " + error);
    })
}
</script>

</html>