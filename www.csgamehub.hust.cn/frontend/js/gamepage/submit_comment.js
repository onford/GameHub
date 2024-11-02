function commentHandle(event) {
    event.preventDefault();
    console.log("评论区表单被提交了");
    var url = "./../../backend/api/post_comment.php";
    var comment_form = document.getElementById("commentForm");
    var form_data = new FormData(comment_form);
    fetch(url, {
        method: "POST",
        body: form_data
    }).then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.code == 1) {
                alert(data.msg);
            } else {
                alert("评论发表成功");
                console.log(data.data);
                document.getElementById("commentList").appendChild(comment_item(data.data.comment_id[0], document.getElementById("ivsb_user_name").value,
                    document.getElementById("commentText").value, data.data.timestamp[0], 0));
                document.getElementById("commentText").value = "";
            }
        }).catch(error => {
            console.error(error);
        });
}


// 生成评论项目
function comment_item(id, user, comment, timestamp, likes) {
    var new_item = document.createElement("div");
    new_item.className = "list-group-item";
    new_item.id = id;
    new_item.style = "border-left:0;border-right:0;border-radius:0;"
    new_item.innerHTML = "<div><strong style=\"color:#FB7299\">" + user + "</strong><br><p style=\"margin-top:10px;\">" + comment + "</p></div>";
    // 评论的详细信息，包括时间戳、点赞数、点踩数、回复按钮和删除按钮
    var detailed = document.createElement("div");
    // 放置时间戳
    detailed.innerHTML = "<div style=\"color:gray;font-size=16px;margin-top:-2px;display: inline-block; \">" + timestamp + "</div>"; "<div class=\"comment_component\"><div class=\"comment_component\"><i class=\"fa-solid fa-thumbs-down\"></i></div><div class=\"comment_component\">回复</div>"
    // 生成点赞数
    var likes_div = document.createElement("div");
    likes_div.className = "comment_component";
    likes_div.innerHTML = "<div><i class=\"fa-solid fa-thumbs-up\"></i><div style=\"display: inline-block;margin-left:5px;\">" + likes + "</div></div>";
    detailed.appendChild(likes_div);

    // 生成点踩数
    var unlikes_div = document.createElement("div");
    unlikes_div.className = "comment_component";
    unlikes_div.innerHTML = "<i class=\"fa-solid fa-thumbs-down\"></i>";
    detailed.appendChild(unlikes_div);

    // 生成回复
    var reply_div = document.createElement("div");
    reply_div.className = "comment_component";
    reply_div.innerHTML = "回复";
    detailed.appendChild(reply_div);

    new_item.appendChild(detailed);

    // 生成删除 div
    if (document.getElementById("ivsb_user_name").value == user) {
        var delete_div = document.createElement("div");
        delete_div.className = "comment_component_deleter";
        delete_div.innerHTML = "删除";
        detailed.appendChild(delete_div);
        delete_div.onclick = alert_delete;
    }

    return new_item;
}

function alert_delete() {
    const id = this.parentElement.parentElement.id;
    const comment_to_be_removed = this;
    var overlay = document.getElementsByClassName('delete_confirm_overlay')[0];
    var confirm_box = document.getElementsByClassName('delete_confirm')[0];
    var hint_text = document.getElementById("hint_text");
    overlay.style.display = 'block';
    confirm_box.style.display = 'block';
    if (!listenerAdded) {
        document.getElementById('confirmButton').addEventListener('click', function () {
            hint_text.style = "color:green;margin-bottom:0;";
            hint_text.innerHTML = "删除成功";
            document.getElementById('confirmButton').hidden = true;
            document.getElementById('cancelButton').hidden = true;

            setTimeout(() => {
                overlay.style.display = 'none';
                confirm_box.style.display = 'none';
                hint_text.innerHTML = "确定删除该条评论？";
                hint_text.style = "color:#212529;margin-bottom:1rem;";
                document.getElementById('confirmButton').hidden = false;
                document.getElementById('cancelButton').hidden = false;

            }, 2000);
            execute_delete(id, comment_to_be_removed);
        });

        document.getElementById('cancelButton').addEventListener('click', function () {
            overlay.style.display = 'none';
            confirm_box.style.display = 'none';
        });
        listenerAdded = true;
    }
}

function execute_delete(id, node) {
    var delete_comment_api = "./../../backend/api/delete_comment_api.php";
    var temp_form_data = new FormData();
    temp_form_data.append("id", id);
    fetch(delete_comment_api, {
        method: "POST", //理论上要用GET, 但是这里我还需要传一个gamename, GET方法不能添加body, 所以这里我用了POST方法
        body: temp_form_data
    }).then(response => response.json())
        .then(data => {
            if (data.code != 0) {
                alert(data.msg);
            } else {
                console.log("删除评论成功");
                var rnode = node.parentElement.parentElement;
                rnode.parentElement.removeChild(rnode);
            }
        })
        .catch(error => {
            console.error(error);
        })
}

var listenerAdded = false;