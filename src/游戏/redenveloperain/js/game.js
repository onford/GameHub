var canvas = document.getElementById('rainCanvas');
var ctx = canvas.getContext('2d');
var gameDuration = 10000; // 游戏持续10秒
var envelopes = []; //信封集合
var score = 0;
var startTime = Date.now();
var timer;
document.body.appendChild(canvas);

canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.width = 800; // 设置canvas的宽度
canvas.height = 600; // 设置canvas的高度
// 设置canvas的边框
canvas.style.border = '2px solid #000000'; // 设置边框为2像素宽，黑色

// 得分元素
const scoreElement = document.createElement('div');
scoreElement.id = 'score';
scoreElement.style.position = 'absolute';
scoreElement.style.top = '20px';
scoreElement.style.left = '20px';
scoreElement.style.color = 'black';
scoreElement.style.fontSize = '24px';
scoreElement.style.fontWeight = 'bold';
document.body.appendChild(scoreElement);
// 更新得分显示的函数
function updateScore() {
  scoreElement.textContent = `得分: ${score}`;
}

// 游戏剩余时间元素
const timeRemainingElement = document.createElement('div');
timeRemainingElement.id = 'timeRemaining';
timeRemainingElement.style.position = 'absolute';
timeRemainingElement.style.top = '60px'; // 放在得分元素下方
timeRemainingElement.style.left = '20px'; // 与得分元素对齐
timeRemainingElement.style.color = 'black';
timeRemainingElement.style.fontSize = '18px';
timeRemainingElement.style.fontWeight = 'bold';
document.body.appendChild(timeRemainingElement);
// 更新游戏剩余时间的函数
function updateTimeRemaining() {
  const remainingTime = gameDuration - (Date.now() - startTime);
  const seconds = Math.ceil(remainingTime / 1000);
  timeRemainingElement.textContent = `剩余时间: ${seconds}s`;
}


// 游戏结束音乐
const endAudio = document.createElement("audio");
endAudio.id = 'endAudio';
endAudio.src = "music/gameover.mp3";
endAudio.type = "audio/mpeg";
endAudio.loop = false;
document.body.appendChild(endAudio);

// 显示游戏结束界面的函数
function showGameOver() {
  const gameOverElement = document.createElement('div');
  gameOverElement.style.position = 'absolute';
  gameOverElement.style.width = canvas.width + 'px';
  gameOverElement.style.height = canvas.height + 'px';
  gameOverElement.style.top = canvas.offsetTop + 'px';
  gameOverElement.style.left = canvas.offsetLeft + 'px';
  gameOverElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  gameOverElement.style.display = 'flex';
  gameOverElement.style.justifyContent = 'center';
  gameOverElement.style.alignItems = 'center';
  gameOverElement.style.color = 'red';
  gameOverElement.style.fontSize = '48px';
  gameOverElement.textContent = `游戏结束！得分: ${score}`;
  endAudio.play();
  document.body.appendChild(gameOverElement);
}

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
    ctx.font = '20px Arial';
    ctx.fillText('红包', this.x + 5, this.y + 30);
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
  startTime = Date.now();
  updateScore();
  updateTimeRemaining();
  timer = setInterval(createEnvelope, 500); // 每0.5秒生成一个红包
  canvas.addEventListener('click', handleClick);
  gameLoop = setInterval(() => {
    // 游戏逻辑
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawEnvelopes();
    updateEnvelopes();
    updateScore();
    updateTimeRemaining();

    // 检查游戏是否结束
    if (Date.now() - startTime >= gameDuration) {
      clearInterval(gameLoop);
      clearInterval(timer);
      canvas.removeEventListener('click', handleClick);
      showGameOver();
    }
  }, 1000 / 60); // 以60帧/秒更新游戏
}

startGame();
