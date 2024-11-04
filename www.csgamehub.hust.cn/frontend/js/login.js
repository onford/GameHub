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
                document.getElementById("errormsg").innerHTML = data.msg;
            } else {
                document.getElementById("errormsg").innerHTML = "";
                console.log("登录成功");
                console.log(data.data[0]);

                // 保存在localStorage用于后续界面用户名显示
                localStorage.setItem("username", data.data[0]);
                console.log(localStorage.getItem("username"));
                localStorage.setItem("cur_game", "2048");
                window.location.href = "./gamepage.html";
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

// 没有输入账号密码不准登录
var account_ready = false;
var password_ready = false;
document.getElementsByName("accountnumber")[0].addEventListener('input', function () {
    account_ready = this.value !== '';
    if (account_ready && password_ready) document.querySelector('.login_button').disabled = false;
    else document.querySelector('.login_button').disabled = true;
});
document.getElementsByName("password")[0].addEventListener('input', function () {
    password_ready = this.value !== '';
    if (account_ready && password_ready) document.querySelector('.login_button').disabled = false;
    else document.querySelector('.login_button').disabled = true;
});
