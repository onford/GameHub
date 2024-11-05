const url = "./../../backend/user_icon/" + localStorage.getItem("cur_accountnumber");
fetch(url + ".png", { method: 'HEAD' })
    .then(response => {
        var icon_path = "";
        if (response.ok) {
            icon_path = url + ".png";
        }
        fetch(url + ".jpg", { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    icon_path = url + ".jpg";
                } else if (icon_path == "") {
                    icon_path = "./../../backend/user_icon/default/default.jpg";
                }
                console.log("path", icon_path);
                document.querySelectorAll(".iconImg").forEach((e) => { e.src = icon_path; })
            })
            .catch(() => {
                alert('发生错误');
                return false;
            });
    })
    .catch(() => {
        alert('发生错误');
        return false;
    });