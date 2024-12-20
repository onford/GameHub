
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
    init_comment_list(0); // 默认策略：最新
    // 游戏排名加载
    init_rank_list();

    // 历史最佳显示
    // document.getElementsByClassName("history_best")[0].innerHTML = "历史最佳: 0";
    score_timer = setInterval(() => {
        if (game_icon_ready && score_ready) {
            $(".loader-wrapper").fadeOut("slow");
            clearInterval(score_timer);
            setTimeout(() => {
                // 从消息中心跳转过来
                const check_id = new URLSearchParams(window.location.search).get('check_id');
                var targetAtComment = setInterval(() => { // 为什么要这样呢，以防评论还没加载出来就锚过去导致没锚到
                    if (document.getElementById(check_id)) {
                        console.log("Come from messageCenter.");
                        document.getElementById(check_id).scrollIntoView({ behavior: 'smooth', block: 'center' });
                        clearInterval(targetAtComment);
                        setTimeout(() => {
                            document.getElementById(check_id).classList.add("blue-fade");
                            setTimeout(() => { document.getElementById(check_id).classList.remove("blue-fade"); }, 1000);
                        }, 300);
                    }
                }, 10);
            }, 1000);
        }
    }, 10);
}
function init_comment_list(option) {
    var comment_list = document.getElementById("commentList");
    comment_list.innerHTML = "";
    var get_comment_api = "";
    if (option)
        get_comment_api = "./../../backend/api/get_layer0_comment_by_popularity_api.php";
    else
        get_comment_api = "./../../backend/api/get_layer0_comment_by_timestamps_api.php"; // 默认策略
    var temp_form_data = new FormData();
    temp_form_data.append("gamename", localStorage.getItem("cur_game"));
    temp_form_data.append("username", localStorage.getItem("username")); // 用来查询用户是否给它点赞了
    fetch(get_comment_api, {
        method: "POST", //理论上要用GET, 但是这里我还需要传一个gamename, GET方法不能添加body, 所以这里我用了POST方法
        body: temp_form_data
    }).then(response => response.json())
        .then(data => {
            if (data.code != 0) {
                alert(data.msg);
            } else {
                console.log("评论查询成功");
                console.log(data.data);
                var len = data.data.length;
                for (var i = 0; i < len; i++) {
                    layer0_item = comment_item(data.data[i].id, data.data[i].username, data.data[i].comment, data.data[i].timestamps, data.data[i].likes, data.data[i].liked, data.data[i].unliked);
                    comment_list.appendChild(layer0_item);
                    init_reply_list(layer0_item, i == len - 1);
                }
            }
        })
        .catch(error => {
            console.error(error);
        })
}

var cur_mode = 0;

function requestComment(code) {
    if (code != cur_mode) {
        if (code) {
            console.log("请求最热评论");
            document.getElementById("newest").style.fontWeight = "";
            document.getElementById("hotest").style.fontWeight = "bold";
        }
        else {
            console.log("请求最新评论");
            document.getElementById("hotest").style.fontWeight = "";
            document.getElementById("newest").style.fontWeight = "bold";
        }
        cur_mode = code;
        init_comment_list(code);
    }
}

function init_reply_list(layer0_item, final_item) {
    var temp_form_data = new FormData();
    temp_form_data.append("id", layer0_item.id);
    temp_form_data.append("username", localStorage.getItem("username"));
    fetch("./../../backend/api/get_layer1_comment_api.php", {
        method: "POST",
        body: temp_form_data
    }).then(response => response.json())
        .then(data => {
            if (data.code != 0) {
                alert(data.msg);
            } else {
                console.log("评论查询成功");
                var len = data.data.length;
                var layer1_item;
                for (var i = 0; i < len; i++) {
                    layer1_item = reply_item(data.data[i].id, data.data[i].username, data.data[i].comment, data.data[i].timestamps, data.data[i].likes, data.data[i].liked, data.data[i].unliked, data.data[i].root_id == data.data[i].reference_id ? null : data.data[i].reference_id);
                    layer0_item.appendChild(layer1_item);
                }
            }
        })
        .catch(error => {
            console.error(error);
        })

}

// 随机句子数组
const randomSentences = [
    "欢迎来到GameHub！\n祝你在这里找到心仪的游戏！",
    "在GameHub你不仅可以体验到游戏的快乐\n还可以成为开发者的一员\n进入个人中心即可上载你的游戏代码喵！",
    "如果对游戏有任何建议，欢迎进入评论区友善讨论！",
    "2048是一款简单却令人上瘾的数字益智游戏，它将考验你的策略思维和运算能力。在这款游戏中，玩家需要通过滑动方块，将相同数字的方块合并，从而创造出更高的数字，最终目标是得到2048这个神奇的数字！如何进行游戏？ 游戏开始时，棋盘上会随机出现两个数字方块（通常是2或4）。玩家可以通过上下左右的滑动手势，使相邻的方块合并。每次合并后，新的数字方块将出现在棋盘的空白位置。随着数字的不断增大，棋盘上的挑战也随之增加，你需要不断思考和计划下一步的移动，尽可能获得更高分吧！",
    "senpai是一款简单的追逐游戏，玩家控制逃亡者，而先辈会自动追逐逃亡者。游戏的目标是尽可能长时间地避免被先辈抓住，同时获得高分。",
    "redenveloperain是一款仿支付宝红包雨游戏，屏幕上会随机掉落大量移动速度不同的红包图案。在倒计时内点击屏幕上的红包图案来抢夺红包，获取更高的分数吧！",
];

// 随机选择一条句子
function displayRandomText() {
    const randomIndex = Math.floor(Math.random() * randomSentences.length);
    const randomTextElement = document.getElementById("randomText");
    randomTextElement.innerText = randomSentences[randomIndex];
}

// 调用函数来显示随机句子
displayRandomText();

function speakInit() {
    const formData = new FormData();
    formData.append("account", localStorage.getItem("cur_accountnumber"));
    fetch("./../../backend/api/speakable.php", {
        method: "POST",
        body: formData
    }).then(response => response.json())
        .then(data => {
            if (data.code != 0) {
                alert(data.msg);
            } else {
                if (data.data == 0) {
                    document.getElementById("commentText").innerHTML = "您已被禁言，请等待禁言解除。GameHub的良好氛围需要你我共同打造~";
                    document.getElementById("commentText").disabled = true;
                }
                document.getElementById("commentForm").hidden = false;
            }
        })
        .catch(error => {
            console.error(error);
        })
}

speakInit();