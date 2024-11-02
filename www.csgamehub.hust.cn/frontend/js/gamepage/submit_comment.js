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
    new_item.innerHTML = "<div><strong style=\"color:#FB7299\">" + user + "</strong><br><p style=\"margin-top:10px;\">" + comment + "</p></div><div><div style=\"color:gray;font-size=16px;margin-top:-2px;display: inline-block; \">" + timestamp + "</div><div class=\"comment_component\"><div><i class=\"fa-solid fa-thumbs-up\"></i><div style=\"display: inline-block;margin-left:5px;\">" + likes + "</div></div></div><div class=\"comment_component\"><i class=\"fa-solid fa-thumbs-down\"></i></div><div class=\"comment_component\">回复</div>";
    return new_item;
}