const canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var path=[]; //存储单元格
var cnt=0;
var flag=false;
var imgs=[]; //图片元素存储
var score=0; //得分

canvas.width = 450;
canvas.height = 450;
// 设置canvas的边框
canvas.style.border = '2px solid #000000'; // 设置边框为2像素宽，黑色
//初始化imgs数组
for(var i=0;i<6;i++){
    var img=new Image();
    img.src="./../game/clearall/images/"+(i+1)+".png";
    imgs.push(img);
}

//在画布上画单元格图片
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
    path = []; // 清空 path
    cnt = 0; // 重新计数
    for(var i=0;i<400;i=i+40){
        for(var j=0;j<400;j=j+40){
            var a=Math.floor(Math.random()*6);
            path[cnt++]=a;  //记录图片信息
            ctx.drawImage(imgs[a],j,i,40,40);
        }
    }
}

//判断游戏是否结束
function isGameOver() {
    if(path.length==0)
        return false;
    for(var i=0;i<path.length;i++){
        if(path[i]!=-1){
            return false;
        }
    }
    return true;
}

//游戏结束逻辑
function endGame() {
    ctx.fillStyle = "grey";
    ctx.font = "32px Helvetica";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillText("游戏结束！得分："+score, canvas.width / 2, canvas.height / 2);
}


//游戏开始函数
function startGame() {
    window.onload=function(){
        draw();
    };
    canvas.addEventListener('click',function(event){
        //消图，处理点击事件
        var x=Math.ceil((event.clientY-canvas.offsetTop)/40)-1;  //拿到点击的坐标
        var y=Math.ceil((event.clientX-canvas.offsetLeft)/40)-1; //警钟长鸣，绝对位置转相对位置
        // 检查边界
        if (x < 0 || x >= 10 || y < 0 || y >= 10) {
            return;
        }
        var dic=x*10+y;
        var begin=x*10;
        //不能清除已经消去的元素
        if(path[dic]==-1){
            return;
        }
        //清除行列
        for (var i = dic + 10; i < path.length; i += 10) {
            if (path[i] == path[dic]) {
                path[i] = -1; //标记清除位置
                ctx.clearRect(i % 10 * 40, Math.floor(i / 10) * 40, 40, 40); //清除图片元素
            }
        }
        for(var i=begin;i<begin+10;i++){
            if(path[i]==path[dic]){ //对比图片路径进行消除
                if(path[i]!=-1){
                    score+=1;
                    ctx.beginPath();
                    ctx.clearRect(40*(i%10),40*x,40,40); //清除图片元素
                    ctx.stroke();
                    if(i!=dic){
                        path[i]=-1; //标记为清除
                    }
                }
            }
        }
        begin=y;
        for(var i=y;i<100;i=i+10){
            if(path[i]==path[dic]){ //对比图片路径进行消除
                if(path[i]!=-1){
                    score+=1;
                    ctx.beginPath();
                    ctx.clearRect(40*y,40*parseInt(i/10),40,40);
                    ctx.stroke();
                    path[i]=-1;
                }
            }
        }
        score-=1; //消除横、竖排重复部分
        if(isGameOver()){
            endGame();
            recordScore(score);
        }
    });
}

startGame();
