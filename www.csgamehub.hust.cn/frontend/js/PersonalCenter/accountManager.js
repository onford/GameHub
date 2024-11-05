
function submitForm(event) {
    event.preventDefault();
    console.log("表单已被提交");
    const url = "./../../backend/api/change_password_api.php";
    var formData = new FormData(update_form);
    formData.append("username", localStorage.getItem("username"));
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
                // 清空输入框内容
                update_form.reset();
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function logoutHandle(event) {
    event.preventDefault();
    console.log("登出事件触发");
    const flag = confirm("确定登出账号吗?");
    if (flag == true) {
        window.location.href = "./login.html";
    }
}

//表单不允许输入空格
Array.from(document.getElementsByClassName('fill_in')).forEach(function (input) {
    input.addEventListener('keypress', function (event) {
        if (event.key === ' ') {
            event.preventDefault();
        }
    });
});

var old_password_ready = false, new_password_ready = false, re_new_password_ready = false;
var confirm_button = document.getElementsByClassName("confirm_button")[0];

Array.from(document.getElementsByClassName("fill_in")).forEach(element => {
    element.addEventListener('input', function () {
        if (this.name == "old_password") {
            old_password_ready = this.value !== '';
        }
        if (this.name == "new_password") {
            new_password_ready = this.value !== '';
        }
        if (this.name == "re_new_password") {
            re_new_password_ready = this.value !== '';
        }
        confirm_button.disabled = !(old_password_ready && new_password_ready && re_new_password_ready);
    });
});

const account = document.getElementById("accountnumber");
const user = document.getElementById("username");
const hint = document.getElementById("hint");
const username_btn = document.getElementById("username_chg");
init_info();


function init_info() {
    user.value = localStorage.getItem("username");
    var form_data = new FormData();
    form_data.append("username", localStorage.getItem("username"));
    fetch("./../../backend/api/get_account_number.php", {
        method: "POST",
        body: form_data
    }).then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.code == 1) {
                alert(data.msg);
            } else {
                account.value = data.data.accountnumber;
            }
        }).catch(error => {
            console.error(error);
            alert('发生未知错误');
        });
}



document.getElementById("username").addEventListener('input', () => {
    var form_data = new FormData();
    form_data.append("username", document.getElementById("username").value);
    form_data.append("account", account.value);

    fetch("./../../backend/api/check_new_username.php", {
        method: "POST",
        body: form_data
    }).then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.code == 1) {
                alert(data.msg);
            } else {
                console.log("newname status: ", data.data.result);
                if (data.data.result == 0) {
                    // 可用
                    hint.style.color = "green";
                    hint.innerHTML = "用户名可用";
                    username_btn.disabled = false;
                } else if (data.data.result == 1) {
                    // 不可用
                    hint.style.color = "red";
                    hint.innerHTML = "用户名被占用";
                    username_btn.disabled = true;
                } else {
                    // 未更改
                    hint.style.color = "gray";
                    hint.innerHTML = "这是您当前的用户名";
                    username_btn.disabled = true;
                }
            }
        }).catch(error => {
            console.error(error);
            alert('发生未知错误');
        });
})

var listenerAdded = false;
username_btn.onclick = () => {
    const overlay = document.getElementsByClassName('confirm_overlay')[0];
    const confirm_box = document.getElementsByClassName('confirm')[0];
    var hint_text = document.getElementById("hint_text");
    hint_text.innerHTML = "确认更改用户名为 <div style='display:inline-block;color:pink;'>" + user.value + "</div> 吗？";
    overlay.style.display = 'block';
    confirm_box.style.display = 'block';
    const confirmAction = () => {
        hint_text.style = "color:green;margin-bottom:0;";
        hint_text.innerHTML = "更改成功！";
        document.getElementById('confirmButton').hidden = true;
        document.getElementById('cancelButton').hidden = true;

        setTimeout(() => {
            overlay.style.display = 'none';
            confirm_box.style.display = 'none';

            hint_text.style = "color:#212529;margin-bottom:1rem;";
            document.getElementById('confirmButton').hidden = false;
            document.getElementById('cancelButton').hidden = false;
            document.getElementById('confirmButton').removeEventListener('click', confirmAction);
        }, 2000);
        change_username();
    }
    document.getElementById('confirmButton').addEventListener('click', confirmAction);

    if (!listenerAdded) {
        document.getElementById('cancelButton').addEventListener('click', function () {
            overlay.style.display = 'none';
            confirm_box.style.display = 'none';
        });
        listenerAdded = true;
    }
}

function change_username() {
    var formData = new FormData();
    formData.append("username", user.value);
    formData.append("account", account.value);
    fetch("./../../backend/api/change_username.php", {
        method: "POST",
        body: formData
    }).then(response => response.json())
        .then(data => {
            if (data.code != 0) {
                alert(data.msg);
            }
            else {
                localStorage.setItem("username", user.value);
            }
        })
        .catch(error => {
            console.log(error);
        });
}