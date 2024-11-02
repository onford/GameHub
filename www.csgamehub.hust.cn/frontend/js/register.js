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
                document.getElementById("errormsg").innerHTML = data.msg;
            } else {
                // console.log("注册成功");
                document.getElementById("errormsg").style.color = "green";
                document.getElementById("errormsg").innerHTML = "注册成功!<br>1 秒后自动跳转登录界面";
                setTimeout(function () {
                    window.location.href = "./login.html";
                }, 1000);
            }
        }).catch(error => {
            console.log("error: " + error);
        })
}

// 账号和密码不准输入空格
Array.from(document.getElementsByClassName('fill_in')).forEach(function (input) {
    input.addEventListener('keypress', function (event) {
        // 现代浏览器通常只使用event.key，但为了兼容旧版浏览器，这里仍然保留了event.keyCode的检查  
        // 但实际上，你应该只使用event.key，因为keyCode已被弃用  
        if (event.key === ' ') {
            event.preventDefault();
        }
    });
});

//表单没填完不准注册
var account_ready = false;
var password_ready = false;
var confirm_ready = false;
document.getElementsByName("username")[0].addEventListener('input', function () {
    account_ready = this.value !== '';
    if (account_ready && password_ready && confirm_ready) document.querySelector('.register_button').disabled = false;
    else document.querySelector('.register_button').disabled = true;
});
document.getElementsByName("password")[0].addEventListener('input', function () {
    password_ready = this.value !== '';
    if (account_ready && password_ready && confirm_ready) document.querySelector('.register_button').disabled = false;
    else document.querySelector('.register_button').disabled = true;
});
document.getElementsByName("re_password")[0].addEventListener('input', function () {
    confirm_ready = this.value !== '';
    if (account_ready && password_ready && confirm_ready) document.querySelector('.register_button').disabled = false;
    else document.querySelector('.register_button').disabled = true;
});