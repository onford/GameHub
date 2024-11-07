// 上传新游戏

const header = document.querySelectorAll(".header")[0];
const dropZone = document.getElementById('dropZone');
const uploadedFilesDiv = document.getElementById('uploadedFiles');
const fileInput = document.getElementById('fileInput');
const uploadText = dropZone.querySelector("p");
const uploadImg = dropZone.querySelector("i");
const hoverHTML = "松开鼠标以上传文件";
const blurHTML = "将文件拖放到这里或点击上传<br>支持 zip/rar等压缩包形式";

const gamenameText = document.createElement("textarea");
gamenameText.name = "newgamename";
gamenameText.placeholder = "给新游戏起个名吧！不要超过 30 个字哦~";
gamenameText.maxLength = "30";
gamenameText.rows = "1";
gamenameText.style = "resize: none;box-sizing:border-box;padding-top:5px;padding-bottom:5px;padding-left:10px;padding-right:10px;margin-bottom:10px;border-radius:5px;border-width:2px;width:100%;"

const seal_div = document.createElement("form");
seal_div.style = "padding-left:10px;padding-top:10px;padding-bottom:10px;";
seal_div.class = "form-group";
seal_div.id = "seal_div";
seal_div.appendChild(gamenameText);

const dragoverListener = (event) => {
    event.preventDefault();
    dropZone.classList.add('hover');
    uploadText.classList.add('blue-fade');
    uploadImg.classList.add('blue-fade');
    uploadText.innerHTML = hoverHTML;
};
dropZone.addEventListener('dragover', dragoverListener);

const dragleaveListener = () => {
    dropZone.classList.remove('hover');
    uploadText.classList.remove('blue-fade');
    uploadImg.classList.remove('blue-fade');
    uploadText.innerHTML = blurHTML;
};
dropZone.addEventListener('dragleave', dragleaveListener);

const dropListener = (event) => {
    event.preventDefault();
    dropZone.classList.remove('hover');
    uploadText.classList.remove('blue-fade');
    uploadImg.classList.remove('blue-fade');
    uploadText.innerHTML = blurHTML;
    const files = event.dataTransfer.files;
    handleFiles(files);
};
dropZone.addEventListener('drop', dropListener);

const clickListner = () => {
    fileInput.click();
};
dropZone.addEventListener('click', clickListner);

fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    handleFiles(files);
});


function fileSize(size) {
    size = parseFloat(size);
    if (size <= 1000)
        return size.toFixed(2) + 'B';
    else if (size <= 1000000)
        return (size / 1024).toFixed(2) + 'KB';
    else if (size <= 1000000000)
        return (size / 1024 / 1024).toFixed(2) + 'MB';
    else if (size <= 1024 * 1024 * 1024)
        return (size / 1024 / 1024 / 1024).toFixed(2) + 'GB';
    else return ">1GB";
}

function handleFiles(files) {
    if (Array.from(files).length > 1) {
        alert('请上传单个文件压缩包！');
        fileInput.value = "";
    }
    else for (const file of files) {
        if (file.name.endsWith(".zip") || file.name.endsWith(".rar")) {
            const fileItem = document.createElement('li');
            fileItem.className = 'list-group-item';
            fileItem.innerHTML = "<strong>已上传文件：</strong><div style=\"margin-right:20px;display:inline-block;\"> " + file.name + "</div><div style=\"color:gray;display:inline-block;\">" + fileSize(file.size) + "</div>";

            const cancelButton = document.createElement('button');
            cancelButton.textContent = '取消选择';
            cancelButton.style = "float:right;margin-left:20px;";
            cancelButton.classList.add('btn');
            cancelButton.classList.add('btn-outline-danger');
            cancelButton.onclick = (e) => {
                e.stopPropagation();
                uploadedFilesDiv.innerHTML = '';
                fileInput.value = "";
                restoreUpload();
                header.removeChild(seal_div);
                gamenameText.value = "";
            }
            const confirmButton = document.createElement('button');
            confirmButton.textContent = '确认上传';
            confirmButton.classList.add('btn');
            confirmButton.style = "float:right;";
            confirmButton.classList.add('btn-outline-success');
            confirmButton.onclick = (e) => {
                e.stopPropagation();
                if (gamenameText.value == "") {
                    alert("请输入游戏名！");
                    return;
                }
                nameStatus(file);
            }
            const downloadButton = document.createElement('button');
            downloadButton.textContent = '下载文件';
            downloadButton.classList.add('btn');
            downloadButton.style = "float:right;margin-right:20px;";
            downloadButton.classList.add('btn-outline-primary');
            downloadButton.onclick = () => {
                var url = URL.createObjectURL(file); // 创建指向文件的URL
                var a = document.createElement('a'); // 创建一个<a>元素  
                a.style.display = 'none'; // 隐藏<a>元素  
                a.href = url; // 设置<a>元素的href属性为文件的URL  
                a.download = file.name; // 设置<a>元素的download属性为文件名  

                document.body.appendChild(a); // 将<a>元素添加到文档中（虽然它是隐藏的）  
                a.click(); // 触发<a>元素的点击事件以下载文件  
                setTimeout(function () {
                    document.body.removeChild(a); // 从文档中移除<a>元素  
                    window.URL.revokeObjectURL(url); // 释放URL对象  
                }, 0); // 使用setTimeout是为了确保在下载开始后再移除元素和释放URL
            }
            fileItem.appendChild(cancelButton);
            fileItem.appendChild(confirmButton);
            fileItem.appendChild(downloadButton);

            uploadedFilesDiv.appendChild(fileItem);

            forbidUpload();
            header.appendChild(seal_div);
        }
        else alert("请上传压缩包文件！");
    }
}

function forbidUpload() {
    dropZone.removeEventListener('dragover', dragoverListener);
    dropZone.removeEventListener('dragleave', dragleaveListener);
    dropZone.removeEventListener('drop', dropListener);
    dropZone.removeEventListener('click', clickListner);
    dropZone.style = "border:none;";
    dropZone.querySelector("i").classList.remove("fa-cloud-arrow-up");
    dropZone.querySelector("i").classList.add("fa-circle-check");
    dropZone.querySelector("p").innerHTML = "已上传压缩文件";
}

function restoreUpload() {
    dropZone.addEventListener('dragover', dragoverListener);
    dropZone.addEventListener('dragleave', dragleaveListener);
    dropZone.addEventListener('drop', dropListener);
    dropZone.addEventListener('click', clickListner);
    dropZone.style = "";
    dropZone.querySelector("i").classList.remove("fa-circle-check");
    dropZone.querySelector("i").classList.add("fa-cloud-arrow-up");
    dropZone.querySelector("p").innerHTML = blurHTML;
}

async function nameStatus(file) {
    // 被其他用户抢占返回 0，存在待审核版本返回 1，发生错误返回 2，正常返回 3
    var form_data = new FormData();
    form_data.append("gamename", gamenameText.value);
    form_data.append("username", localStorage.getItem("username"));
    fetch("./../../backend/api/check_repeated_name.php", {
        method: "POST",
        body: form_data
    }).then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.code == 1) {
                alert(data.msg);
                alert('发生未知错误'); // 发生错误
            } else {
                console.log("check_repeated_name: " + data.data.code);
                console.log("status: " + data.data.code);
                if (data.data.code == 0) {
                    alert("该游戏名已被其他用户抢占，请换一个游戏名");
                    gamenameText.value = "";
                } else if (data.data.code == 1) {
                    alert_overwrite(file);
                }
                else {
                    uploadGame(file);

                }
            }
        }).catch(error => {
            console.error(error);
            alert('发生未知错误');
        });

}

var listenerAdded = false;

function alert_overwrite(file) {
    const overlay = document.getElementsByClassName('confirm_overlay')[0];
    const confirm_box = document.getElementsByClassName('confirm')[0];
    var hint_text = document.getElementById("hint_text");
    hint_text.innerHTML = "游戏 <div style='display:inline-block;color:pink;'>" + gamenameText.value + "</div> 的最新版正在送审，确认要覆盖这一版吗？";
    overlay.style.display = 'block';
    confirm_box.style.display = 'block';
    const confirmAction = () => {
        hint_text.style = "color:green;margin-bottom:0;";
        hint_text.innerHTML = "覆盖成功";
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
        uploadGame(file);
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

function uploadGame(file) {
    restoreUpload();
    const formData = new FormData();
    formData.append("file[]", file);
    formData.append("newgame_name", gamenameText.value);
    formData.append("username", localStorage.getItem("username"));

    fetch('../../backend/api/upload.php', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.code == 1) {
                alert(data.msg);
                return 2; // 发生错误
            } else {
                alert("文件已提交给管理员审核！");
                fileInput.value = "";
                gamenameText.value = "";
                uploadedFilesDiv.innerHTML = '';
                document.getElementById("nogame").hidden = true;
                getAllGamesByName(null);
                restoreUpload();
            }
        })
        .catch(error => {
            console.error('上传失败:', error);
        });
}

// 已上传的游戏

const tablebody = document.querySelector("tbody");
getAllGamesByName(null);

function getAllGamesByName(gamename) {
    var form_data = new FormData();
    form_data.append("username", localStorage.getItem("username"));
    form_data.append("gamename", gamename ? gamename : "");

    fetch("./../../backend/api/get_uploaded_games.php", {
        method: "POST",
        body: form_data
    }).then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.code == 1) {
                alert(data.msg);
            } else {
                if (gamename)
                    console.log("成功获取游戏 ", gamename, " 的所有上传记录");
                else console.log("成功获取所有游戏的上传记录");
                tablebody.innerHTML = "";
                for (var i = 0; i < data.data.length; i++) {
                    tablebody.appendChild(newgameRecord(data.data[i].newgame_id, data.data[i].gamename, data.data[i].version, data.data[i].uploadtime, data.data[i].status));
                }
                tablebody.querySelectorAll(".btn-primary").forEach((element) => { element.onclick = getGameZip; });
                console.log("记录条数", data.data.length);
                if (data.data.length)
                    tablebody.parentElement.hidden = false;
                else
                    document.getElementById("nogame").hidden = false;
            }
        }).catch(error => {
            console.error(error);
        });
}

function newgameRecord(newgame_id, gamename, version, uploadtime, status) {
    const tr = document.createElement("tr");
    const createTd = (val) => {
        const td = document.createElement("td");
        td.innerHTML = val;
        return td;
    };
    tr.appendChild(createTd(newgame_id));
    tr.appendChild(createTd(gamename));
    tr.appendChild(createTd(1 + parseInt(version) + ".0"));
    tr.appendChild(createTd("<span class='message-time ms-2'><i class='bi bi-clock' style='font-size: 1rem;'></i> " + uploadtime + "</span>"));
    tr.appendChild(createTd(statusGenerator(status)));
    tr.appendChild(createTd("<button type='button' class='btn btn-primary' onclick=getGameZip>下载</button>"));
    return tr;
}

function statusGenerator(status) {
    if (status == 0)
        return "<div style='color:gray;'>待审核</div>";
    else if (status == 1)
        return "<div style='color:green;'>已通过</div>";
    else
        return "<div style='color:red;'>未通过</div>";
}

function getGameZip() {
    const id = this.parentElement.parentElement.querySelector("td").innerHTML;
    const url = "./../../backend/uploads/" + id;
    fetch(url + ".rar", { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                window.location.href = url + ".rar";
                return true;
            } else {
                window.location.href = url + ".zip";
                return false;
            }
        })
        .catch(() => {
            alert('发生错误');
            return false;
        });
}