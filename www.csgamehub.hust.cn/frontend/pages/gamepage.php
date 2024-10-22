<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>gamepage</title>
    <link rel="stylesheet" href="./../css/gamepage.css">
</head>

<body>
    <div class="container" id="background_container">
        <div class="lefter">
            <img src="./../../src/images/test_icon.webp" alt="" class="profile_pic">
            <p class="username"></p>
            <p class="gamename"></p>
            <p class="history_best">历史最佳: 0</p>
        </div>

        <div class="main">
            <div class="container" id="screen_container">
                <div class="screen">
                    <div class="item">
                        <span id="score"></span>
                        <!-- <span id="history"></span> -->
                        <button id="btn">New Game</button>
                    </div>
                    <canvas id="canvas"></canvas>
                    <script src="./../game/2048.js"></script>
                </div>
            </div>
            <div class="container" id="gametable_container" onclick="game_icon_click_handle(event)">
                <!-- 这里面的元素由init函数插入 -->
            </div>
        </div>

        <div class="righter">
            <h1 class="rank_title">
                排行榜
            </h1>
        </div>

        <div class="commentarea">
            <!-- 评论区 -->
            <div class="comment_box container">
                <textarea name="comment_textarea" placeholder="请输入你的评论..."></textarea>
                <button class="post_btn">发布</button>
            </div>
        </div>
    </div>
</body>

<script>
    function init() {
        // 游戏列表的生成
        var gametable = document.getElementById("gametable_container");

        for (var i = 1; i <= 5; i++) {
            var new_game_icon_table = document.createElement("div");
            var new_game_icon = document.createElement("img");
            new_game_icon.src = "./../../src/images/test_game_icon.webp";
            var new_game_name = document.createElement("p");
            new_game_icon_table.classList.add("game_icon_table");
            new_game_icon.classList.add("game_icon");
            new_game_name.classList.add("game_name");
            new_game_name.innerHTML = "game" + i;
            new_game_icon_table.appendChild(new_game_icon);
            new_game_icon_table.appendChild(new_game_name);
            gametable.appendChild(new_game_icon_table);
        }

        // 用户名显示
        var username = document.getElementsByClassName("username")[0];
        username.innerHTML = "用户名: " + localStorage.getItem("username");

        // 游戏名显示
        var gamename = document.getElementsByClassName("gamename")[0];
        gamename.innerHTML = "正在游玩: " + "2048";
    }

    function game_icon_click_handle(event) {
        event.preventDefault();
        console.log("事件触发");
        // window.location.href = "https://ys.mihoyo.com/";
        window.open("https://ys.mihoyo.com/", "_blank");
    }

    function init_rank_list() {
        event.preventDefault();
    }

    window.onload = init();

    var profile_pic = document.getElementsByClassName("profile_pic")[0];
    profile_pic.onclick = function() {
        console.log("头像点击事件触发");
        window.location.href = "./messageCenter.php";
    }
</script>

</html>
