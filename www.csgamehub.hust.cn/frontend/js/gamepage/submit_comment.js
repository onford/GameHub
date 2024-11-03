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
                    document.getElementById("commentText").value, data.data.timestamp[0], 0, 0, 0));
                document.getElementById("commentText").value = "";
            }
        }).catch(error => {
            console.error(error);
        });
}


// 生成评论项目
function comment_item(id, user, comment, timestamp, likes, liked, unliked) {
    liked = parseInt(liked);
    unliked = parseInt(unliked);
    var new_item = document.createElement("div");
    new_item.className = "list-group-item";
    new_item.id = id;
    new_item.style = "border-left:0;border-right:0;border-radius:0;"
    new_item.innerHTML = "<div><strong style=\"color:#FB7299\">" + user + "</strong><br><p style=\"margin-top:10px;\">" + comment + "</p></div>";
    // 评论的详细信息，包括时间戳、点赞数、点踩数、回复按钮和删除按钮
    var detailed = document.createElement("div");
    // 放置时间戳
    detailed.innerHTML = "<div style=\"color:gray;font-size=16px;margin-top:-2px;display: inline-block; \">" + timestamp + "</div>";
    // 生成点赞数
    var likes_div = document.createElement("div");
    likes_div.className = "comment_component";
    likes_div.onclick = commit_like_and_unlike;
    if (liked) {
        likes_div.innerHTML = "<div><i class=\"fa-solid fa-thumbs-up\"></i><div class=\"thumb_number\">" + likes + "</div></div>";
    }
    else {
        likes_div.innerHTML = "<div><i class=\"fa-regular fa-thumbs-up\"></i><div class=\"thumb_number\">" + likes + "</div></div>"
    }
    detailed.appendChild(likes_div);

    // 生成点踩数
    var unlikes_div = document.createElement("div");
    unlikes_div.className = "comment_component";
    unlikes_div.onclick = commit_like_and_unlike;
    if (unliked) {
        unlikes_div.innerHTML = "<i class=\"fa-solid fa-thumbs-down\"></i>";
    }
    else {
        unlikes_div.innerHTML = "<i class=\"fa-regular fa-thumbs-down\"></i>";
    }
    detailed.appendChild(unlikes_div);

    // 生成回复
    var reply_div = document.createElement("div");
    reply_div.className = "comment_component";
    reply_div.innerHTML = "回复";
    reply_div.onclick = function () { reply_area(0, this); }; // 0 表示当前层级

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

function commit_like_and_unlike() {
    var target = this.querySelector('i');
    var temp_form_data = new FormData();
    temp_form_data.append("username", localStorage.getItem("username"));
    if (target.classList.contains('fa-thumbs-up')) {
        temp_form_data.append("comment_id", target.parentElement.parentElement.parentElement.parentElement.id);
        var thumb_number = this.querySelector(".thumb_number");
        if (target.classList.contains('fa-solid')) {
            temp_form_data.append("operation", 0); // 取消点赞
            thumb_number.innerHTML = parseInt(thumb_number.innerHTML) - 1;
        }
        else {
            temp_form_data.append("operation", 1); // 点赞
            thumb_number.innerHTML = parseInt(thumb_number.innerHTML) + 1;
        }
    }
    else {
        temp_form_data.append("comment_id", target.parentElement.parentElement.parentElement.id);
        if (target.classList.contains('fa-solid'))
            temp_form_data.append("operation", 2); // 取消点踩
        else
            temp_form_data.append("operation", 3); // 点踩
    }
    target.classList.toggle('fa-solid');
    target.classList.toggle('fa-regular');
    fetch("./../../backend/api/handle_like_and_unlike.php", {
        method: "POST",
        body: temp_form_data
    }).then(response => response.json())
        .then(data => {
            if (data.code != 0) {
                alert(data.msg);
            } else {
                console.log("赞踩操作成功");
                console.log(data.data);
            }
        })
        .catch(error => {
            console.error(error);
        })
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

function reply_area(layer, reply_div) {
    removeReplyBox();
    box = document.createElement("textarea");
    box.name = "reply_text";
    box.addEventListener('input', adjustTextareaHeight);
    box.addEventListener('keyup', adjustTextareaHeight);
    box.classList.add("form-control");
    box.rows = "1";
    box.style = "resize: none;box-sizing:border-box;padding-top:5px;padding-bottom:5px;padding-left:10px;padding-right:10px;margin-bottom:10px;border-radius:5px;border-width:2px;width:100%";
    reply_user = reply_div.parentElement.parentElement.querySelector("strong").innerHTML;
    box.placeholder = "回复 @" + reply_user + ' :';
    var seal_div = document.createElement("form");
    if (layer == 0)
        seal_div.onsubmit = handle_reply0;
    else {
        // layer = 1
    }
    seal_div.style = "padding-left:40px;padding-top:10px;padding-bottom:10px;";
    seal_div.class = "form-group";
    seal_div.id = "reply_box";
    seal_div.appendChild(box);

    reply_button = document.createElement("button");
    reply_button.style = "float:right;";
    reply_button.type = "submit";
    reply_button.classList.add("btn");
    reply_button.classList.add("btn-primary");
    reply_button.innerHTML = "回复";


    seal_div.appendChild(reply_button);

    reply_div.parentElement.parentElement.appendChild(seal_div);
}

// 回复第 0 层的评论
function handle_reply0(event) {
    event.preventDefault(); // 提交表单之后好像会重新跳转页面？所以要这样
    var comment_form = document.getElementById("reply_box");
    var form_data = new FormData(comment_form);// 有 key = "reply_text" 的元素
    form_data.append("username", localStorage.getItem("username"));
    form_data.append("gamename", localStorage.getItem("cur_game"));
    form_data.append("reference_id", this.parentElement.id);
    form_data.append("root_id", this.parentElement.id);

    fetch("./../../backend/api/post_reply_to_layer0.php", {
        method: "POST",
        body: form_data
    }).then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.code == 1) {
                alert(data.msg);
            } else {
                alert("回复发表成功");
                comment_form.parentElement.appendChild(reply_item(data.data.comment_id[0], form_data.get("username"), form_data.get("reply_text"), data.data.timestamp[0], 0, 0, 0));
                removeReplyBox();
            }
        }).catch(error => {
            console.error(error);
        });
}

function removeReplyBox() {
    var box = document.getElementById("reply_box");
    if (box != null) {
        box.parentElement.removeChild(box);
        const replyarea = box.querySelector("textarea");
        replyarea.removeEventListener('input', adjustTextareaHeight);
        replyarea.removeEventListener('keyup', adjustTextareaHeight);
    }
}

function reply_item(id, user, comment, timestamp, likes, liked, unliked) {
    liked = parseInt(liked);
    unliked = parseInt(unliked);
    var new_item = document.createElement("div");
    new_item.className = "list-group-item";
    new_item.id = id;
    new_item.style = "border:0;margin-left:60px;";
    new_item.innerHTML = "<div><strong style=\"color:#FB7299;display: inline-block; \">" + user + "</strong><p style=\"display: inline-block;margin-top:10px;margin-left:20px;\">" + comment + "</p></div>";
    // 评论的详细信息，包括时间戳、点赞数、点踩数、回复按钮和删除按钮
    var detailed = document.createElement("div");
    // 放置时间戳
    detailed.innerHTML = "<div style=\"color:gray;font-size=16px;margin-top:-2px;display: inline-block; \">" + timestamp + "</div>";
    // 生成点赞数
    var likes_div = document.createElement("div");
    likes_div.className = "comment_component";
    likes_div.onclick = commit_like_and_unlike;
    if (liked) {
        likes_div.innerHTML = "<div><i class=\"fa-solid fa-thumbs-up\"></i><div class=\"thumb_number\">" + likes + "</div></div>";
    }
    else {
        likes_div.innerHTML = "<div><i class=\"fa-regular fa-thumbs-up\"></i><div class=\"thumb_number\">" + likes + "</div></div>"
    }
    detailed.appendChild(likes_div);

    // 生成点踩数
    var unlikes_div = document.createElement("div");
    unlikes_div.className = "comment_component";
    unlikes_div.onclick = commit_like_and_unlike;
    if (unliked) {
        unlikes_div.innerHTML = "<i class=\"fa-solid fa-thumbs-down\"></i>";
    }
    else {
        unlikes_div.innerHTML = "<i class=\"fa-regular fa-thumbs-down\"></i>";
    }
    detailed.appendChild(unlikes_div);

    // 生成回复
    var reply_div = document.createElement("div");
    reply_div.className = "comment_component";
    reply_div.innerHTML = "回复";
    // 暂时先不写
    // reply_div.onclick = function () { reply_area(0, this); }; // 0 表示当前层级

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