var canvas = document.getElementById('canvas');
var containner = document.getElementById('container');
var show=document.getElementById('show');
var again=document.getElementById('again');
var ctx = canvas.getContext('2d');
var width = ctx.canvas.width;
var height = ctx.canvas.height;
var path=[];
var k=0;
var flag=false;
var imgs=[];
var score=0;

function updateScore() {
  score++;
}
			      
		 for(var i=0;i<6;i++){
		      var img=new Image();
			  img.src="images/"+(i+1)+".png";
			  imgs.push(img);
		}
				  
		 window.onload = function(){
		          draw();					
		 }	       
	
		 function draw(){
			 for(var i=0;i<400;i=i+40){
			 	for(var j=0;j<400;j=j+40){
				var a=Math.floor(Math.random()*6);
				path[k++]=a;  //记录图片信息
				ctx.drawImage(imgs[a],j,i,40,40);
		      }
		    }
		 }

//消图
containner.onclick=function(e){
    var x=Math.ceil(e.clientY/40)-1;  //拿到点击的坐标
    var y=Math.ceil(e.clientX/40)-1;
    var dic=x*10+y;
    var begin=x*10;
         
     if(path[dic]==-1){
         alert("图片已被消除")
         return;
     }
     for(var i=begin;i<begin+10;i++){
           
       if(path[i]==path[dic]){   //对比图片路径进行消除
                if(path[i]!=-1){
                 updateScore();
                 ctx.beginPath();
                 ctx.clearRect(40*(i%10),40*x,40,40);
                 ctx.stroke();
                 if(i!=dic){
                     path[i]=-1;  //标记为清除
                 }
                 }
             }
          }
          
     begin=y;
     for(var i=y;i<100;i=i+10){
         if(path[i]==path[dic]){   //对比图片路径进行消除
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
           show.innerHTML=score;
         
         };	
again.onclick=function(){
 window.location="index.html";
}
