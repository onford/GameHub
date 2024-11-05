//var canvas = document.getElementById('rainCanvas');
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var gameDuration = 10000; // 游戏持续10秒
var envelopes = []; //信封集合
var score = 0;
var startTime = Date.now();
var timer;
//document.body.appendChild(canvas);


canvas.width = 450; // 设置canvas的宽度
canvas.height = 450; // 设置canvas的高度
canvas.style.backgroundColor = 'orange';
// 设置canvas的边框
canvas.style.border = '2px solid #000000'; // 设置边框为2像素宽，黑色


// 游戏结束音乐
const endAudio = document.createElement("audio");
endAudio.id = 'endAudio';
endAudio.src = "music/gameover.mp3";
endAudio.type = "audio/mpeg";
endAudio.loop = false;
document.body.appendChild(endAudio);


// 设计红包类
class Envelope {
  constructor() {
    this.x = Math.random() * (canvas.width - 50);
    this.y = 0;
    this.width = 50;
    this.height = 60;
    this.speed = Math.random() * 4 + 1;
  }
  //绘画
  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = 'yellow';
    ctx.fillRect(this.x,this.y+15,this.width,this.height/12);
    ctx.fillStyle = 'gold';
    ctx.fillRect(this.x+15,this.y+10,20,20);
  }
  //更新位置
  update() {
    this.y += this.speed;
  }
}

function createEnvelope() {
  const envelope = new Envelope();
  envelopes.push(envelope);
}

function drawEnvelopes() {
  envelopes.forEach(envelope => {
    envelope.draw();
  });
}

function updateEnvelopes() {
  envelopes.forEach((envelope, index) => {
    envelope.update();
    if (envelope.y > canvas.height) {
      envelopes.splice(index, 1);
    }
  });
}

//处理鼠标点击事件
function handleClick(event) {
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;
  
  for (let i = envelopes.length - 1; i >= 0; i--) {
    const envelope = envelopes[i];
    if (
      clickX > envelope.x &&
      clickX < envelope.x + envelope.width &&
      clickY > envelope.y &&
      clickY < envelope.y + envelope.height
    ) {
      envelopes.splice(i, 1);
      score++;
      updateScore();
      break;
    }
  }
}


// 开始游戏的函数
function startGame() {
  score=0;
  startTime = Date.now();
  timer = setInterval(createEnvelope, 500); // 每0.5秒生成一个红包
  canvas.addEventListener('click', handleClick);
  gameLoop = setInterval(() => {
    // 游戏逻辑
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawEnvelopes();
    updateEnvelopes();

    // 检查游戏是否结束
    if (Date.now() - startTime >= gameDuration) {
      clearInterval(gameLoop);
      clearInterval(timer);
      canvas.removeEventListener('click', handleClick);
      //showGameOver();
    }
  }, 1000 / 60); // 以60帧/秒更新游戏
}

startGame();
