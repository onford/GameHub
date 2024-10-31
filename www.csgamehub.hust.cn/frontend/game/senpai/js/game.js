// Create the canvas
// var canvas = document.createElement("canvas");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 450;
canvas.height = 450;
// document.body.appendChild(canvas);

var highest_score = 0;

// Create the audios
var bgAudio = document.createElement("audio");
bgAudio.src = "./../game/senpai/music/bgmusic.mp3";
bgAudio.type = "audio/mpeg";
bgAudio.loop = true;
document.body.appendChild(bgAudio);
var caughtAudio = document.createElement("audio");
caughtAudio.src = "./../game/senpai/music/caught.mp3";
caughtAudio.type = "audio/mpeg";
document.body.appendChild(caughtAudio);
var failAudio = document.createElement("audio");
failAudio.src = "./../game/senpai/music/fail.mp3";
failAudio.type = "audio.mpeg";
document.body.appendChild(failAudio);

var score = 0., punish = 1145.;
var lastCaught = false, nowCaught = false;
var timer, then, now;
var bgReady = false;
var escaperReady = false;
var senpaiReady = false;
var lossReady = false;

var bgImage = new Image();
var escaperImage = new Image();
var senpaiImage = new Image();
var lossImage = new Image();

bgImage.onload = function () {
    bgReady = true;
}
escaperImage.onload = function () {
    escaperReady = true;
}
senpaiImage.onload = function () {
    senpaiReady = true;
}
lossImage.onload = function () {
    lossReady = true;
}

bgImage.src = "./../game/senpai/image/VIP_canteen.png";
escaperImage.src = "./../game/senpai/image/escaper.gif";
senpaiImage.src = "./../game/senpai/image/senpai.jpg";
lossImage.src = "./../game/senpai/image/loss.jpg";


var epsilon = 1e-6;
var size = 40;
var ratio = 0.7;
var escaper = { speed: 256., x: 0., y: 0. }
var senpai = { x: 270., y: 360., dx: -0.6, dy: -0.8, speed: 114. }

function changeDirection() {
    senpai.dx = (escaper.x - senpai.x) / Math.hypot(escaper.x - senpai.x + epsilon, escaper.y - senpai.y + epsilon);
    senpai.dy = (escaper.y - senpai.y) / Math.hypot(escaper.x - senpai.x + epsilon, escaper.y - senpai.y + epsilon);
    score += 114;
    if (score > highest_score) {
        highest_score = score;
    }
    console.log("highest_score: " + highest_score);
    senpai.speed = Math.min(senpai.speed + 11.4, 1145.);
}


var endTag = false, beginTag = false;
// Update yourself
var update = function (modifier) {
    if (38 in keysDown || 87 in keysDown) { // Player holding up
        escaper.y -= escaper.speed * modifier;
        if (escaper.y < 0) escaper.y = 0;
    }
    if (40 in keysDown || 83 in keysDown) { // Player holding down
        escaper.y += escaper.speed * modifier;
        if (escaper.y > canvas.height - size) escaper.y = canvas.height - size;
    }
    if (37 in keysDown || 65 in keysDown) { // Player holding left
        escaper.x -= escaper.speed * modifier;
        if (escaper.x < 0) escaper.x = 0;
    }
    if (39 in keysDown || 68 in keysDown) { // Player holding right
        escaper.x += escaper.speed * modifier;
        if (escaper.x > canvas.width - size) escaper.x = canvas.width - size;
    }
    senpai.x += senpai.speed * senpai.dx * modifier;
    senpai.y += senpai.speed * senpai.dy * modifier;
    if (senpai.x < 0 || senpai.x > canvas.width - size) {
        if (senpai.x < 0) senpai.x = 0;
        else senpai.x = canvas.width - size;
        changeDirection();
    }

    if (senpai.y < 0 || senpai.y > canvas.height - size) {
        if (senpai.y < 0) senpai.y = 0;
        else senpai.y = canvas.height - size;
        changeDirection();
    }

    // Are they touching?
    lastCaught = nowCaught;
    nowCaught = escaper.x - senpai.x <= ratio * size && escaper.x - senpai.x >= -ratio * size && escaper.y - senpai.y <= ratio * size && escaper.y - senpai.y >= -ratio * size;
    if (nowCaught && !lastCaught) {
        score -= punish;
        punish += 514.;
        senpai.speed = Math.max(senpai.speed - 11.4, 114.);
        if (score < 0) {
            score = 0;
            bgAudio.pause();
            caughtAudio.pause();
            caughtAudio.currentTime = 0;
            failAudio.play();
            endTag = true;
        }
        else {
            if (caughtAudio.paused)
                caughtAudio.play();
            else caughtAudio.currentTime = 0;
        }
    }
};


// Handle keyboard controls
var keysDown = {}, pauseTag = false;
addEventListener("keydown", function (e) {
    beginTag = true;
    if (bgAudio.paused && !endTag) bgAudio.play();
    keysDown[e.keyCode] = true;
    if (e.keyCode == 80) pauseTag = !pauseTag;
}, false);
addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

var newGame = function () {
    now = Date.now();
    var delta = now - then;
    if (pauseTag) {
        bgAudio.pause();
        ctx.fillStyle = "#897064";
        ctx.font = "96px Helvetica";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("PAUSE", canvas.width / 2, canvas.height / 2);
    }
    else {
        bgAudio.play();
        update(delta / 1000);
    }
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(escaperImage, escaper.x, escaper.y, size, size);
    ctx.drawImage(senpaiImage, senpai.x, senpai.y, size, size);
    then = now;
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("臭分: " + score, 11.4, 11.4);
    if (endTag) {
        clearInterval(timer);
        ctx.fillStyle = "#EEDDC0";
        ctx.font = "32px Helvetica";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#897064";
        ctx.fillText("野兽先辈\r\n雷普了你（喜）！", canvas.width / 2, canvas.height / 2);
        ctx.drawImage(lossImage, canvas.width / 2 - 75., canvas.height / 2 - 200., 150., 150.);
        //创建一个临时表单提交给接口
        var temp_score_form = document.createElement("form");
        var temp_username_inputer = document.createElement("input");
        temp_username_inputer.name = "username";
        temp_username_inputer.value = localStorage.getItem("username");
        var temp_gamename_inputer = document.createElement("input");
        temp_gamename_inputer.name = "gamename";
        temp_gamename_inputer.value = localStorage.getItem("cur_game");
        var temp_score_inputer = document.createElement("input");
        temp_score_inputer.name = "score";
        temp_score_inputer.value = highest_score;
        temp_score_form.appendChild(temp_username_inputer);
        temp_score_form.appendChild(temp_gamename_inputer);
        temp_score_form.appendChild(temp_score_inputer);
        const update_score_api = "./../../backend/api/update_score_api.php";
        const temp_form_data = new FormData(temp_score_form);
        fetch(update_score_api, {
            method: "POST",
            body: temp_form_data
        })
            .then(response => response.json())
            .then(data => {
                if (data.code != 0) {
                    alert(data.msg);
                } else {
                    console.log("游戏分数更新接口返回结果");
                    console.log(data);
                    // localStorage.setItem("highest_score", data.data);
                }
            })
            .catch(error => {
                console.error(error);
            })
        highest_score = 0;
    }
}

var render = function () {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(escaperImage, escaper.x, escaper.y, size, size);
    ctx.drawImage(senpaiImage, senpai.x, senpai.y, size, size);
    if (bgReady && escaperReady && senpaiReady && beginTag && lossReady) {
        clearInterval(timer);
        then = Date.now();
        timer = setInterval(newGame, 1);
    }
};

var main = function () {
    timer = setInterval(render, 50);
};
main();