
var score_timer, game_icon_timer;
var score_ready = false, game_icon_ready = false;

function init() {
    // 游戏列表的生成
    var gametable = document.getElementById("gametable_container");

    //评论区表单用户名和游戏名的初始化
    var user_name = document.getElementById("ivsb_user_name");
    var game_name = document.getElementById("ivsb_game_name");
    user_name.value = localStorage.getItem("username");
    game_name.value = localStorage.getItem("cur_game");

    // 游戏列表的插入
    var game_select_api = "./../../backend/api/game_select_api.php";
    fetch(game_select_api, {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            if (data.code != 0) {
                alert(data.msg);
            } else {
                console.log("游戏列表查询成功");
                console.log(data);
                var game_icon_ok = new Array(data.data.length).fill(false);
                for (var i = 0; i < data.data.length; i++) {
                    var new_game_icon_table = document.createElement("div");
                    var new_game_icon = document.createElement("img");
                    new_game_icon.src = "./../../src/images/" + data.data[i] + "_icon.jpg";
                    new_game_icon.name = data.data[i];
                    var new_game_name = document.createElement("p");
                    new_game_icon_table.classList.add("game_icon_table");
                    new_game_icon.classList.add("game_icon");
                    new_game_icon.onclick = game_icon_click_handle;
                    var set_icon_ok = (seq) => { game_icon_ok[seq] = true; }
                    new_game_icon.onload = set_icon_ok(i);
                    new_game_name.classList.add("game_name");
                    new_game_name.innerHTML = data.data[i];
                    new_game_icon_table.appendChild(new_game_icon);
                    new_game_icon_table.appendChild(new_game_name);
                    gametable.appendChild(new_game_icon_table);
                }
                game_icon_timer = setInterval(() => {
                    game_icon_ready = game_icon_ok.every(element => element === true);
                    if (game_icon_ready)
                        clearInterval(game_icon_timer);
                }, 10);
            }
        })
        .catch(error => {
            console.error(error);
        })

    // 用户名显示
    document.getElementsByClassName("username")[0].innerHTML = "用户名: " + user_name.value;

    // 游戏名显示
    document.getElementsByClassName("gamename")[0].innerHTML = "正在游玩: " + game_name.value;

    //评论加载
    init_comment_list();
    // 游戏排名加载
    init_rank_list();

    // 历史最佳显示
    // document.getElementsByClassName("history_best")[0].innerHTML = "历史最佳: 0";
    score_timer = setInterval(() => {
        if (game_icon_ready && score_ready) {
            $(".loader-wrapper").fadeOut("slow");
            clearInterval(score_timer);
        }
    }, 10);
}
function init_comment_list() {
    var comment_list = document.getElementById("commentList");
    comment_list.innerHTML = "";
    var get_comment_api = "./../../backend/api/get_layer0_comment_by_timestamps_api.php"; // 默认策略
    var temp_form_data = new FormData();
    temp_form_data.append("gamename", localStorage.getItem("cur_game"));
    fetch(get_comment_api, {
        method: "POST", //理论上要用GET, 但是这里我还需要传一个gamename, GET方法不能添加body, 所以这里我用了POST方法
        body: temp_form_data
    }).then(response => response.json())
        .then(data => {
            if (data.code != 0) {
                alert(data.msg);
            } else {
                console.log("评论查询成功");
                console.log(data);
                var len = data.data.length;
                for (var i = 0; i < len; i++)
                    comment_list.appendChild(comment_item(data.data[i].id, data.data[i].username, data.data[i].comment, data.data[i].timestamps, data.data[i].likes));
            }
        })
        .catch(error => {
            console.error(error);
        })
}
