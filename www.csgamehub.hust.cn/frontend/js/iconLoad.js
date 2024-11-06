const url = "./../../backend/user_icon/" + localStorage.getItem("cur_accountnumber") + ".jpg";
fetch(url, { method: 'HEAD' })
    .then(response => {
        var icon_path = "./../../backend/user_icon/default/default.jpg";
        if (response.ok) {
            icon_path = url;
        }
        console.log("path", icon_path);
        document.querySelectorAll(".iconImg").forEach((e) => { e.src = icon_path; })
    })
    .catch(() => {
        alert('发生错误');
        return false;
    });