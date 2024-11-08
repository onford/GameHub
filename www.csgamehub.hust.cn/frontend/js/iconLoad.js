const url = "./../../backend/user_icon/" + localStorage.getItem("cur_accountnumber") + ".jpg";
fetch(url, { method: 'HEAD' })
    .then(response => {
        var icon_path = "./../../backend/user_icon/default/default.jpg";
        if (response.ok) {
            icon_path = url;
        }
        console.log("path", icon_path);
        document.querySelectorAll(".iconImg").forEach((e) => { e.src = icon_path; });
    })
    .catch(() => {
        alert('发生错误');
        return false;
    });

const unread = document.createElement("span");
Array.from(["position-absolute", "top-0", "start-100", "translate-middle", "badge", "rounded-pill", "bg-danger"]).forEach((e) => {
    unread.classList.add(e);
})

const append_unread = setInterval(() => {
    if (document.querySelector(".option")) {
        document.querySelector(".option").classList.add("position-relative");
        document.querySelector(".option").appendChild(unread);
        clearInterval(append_unread);
        var temp_form_data = new FormData();
        temp_form_data.append("account", localStorage.getItem("cur_accountnumber")); // 用来查询用户是否给它点赞了
        fetch("./../../backend/api/get_total_unread.php", {
            method: "POST", //理论上要用GET, 但是这里我还需要传一个gamename, GET方法不能添加body, 所以这里我用了POST方法
            body: temp_form_data
        }).then(response => response.json())
            .then(data => {
                if (data.code != 0) {
                    alert(data.msg);
                } else if (data.data != 0) {
                    unread.innerHTML = data.data;
                }
            })
            .catch(error => {
                console.error(error);
            })
    }
}, 10);
