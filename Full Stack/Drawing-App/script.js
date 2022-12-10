function DrawCircle(x,y){
    ctx.beginPath();
    ctx.arc(x,y,size,0,Math.PI*2);
    ctx.fillStyle = color;
    ctx.fill();
}

function DrawLine(x1,y1,x2,y2){
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = size*2;
    ctx.stroke();
}

function ClearCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

//MAIN
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const ind = document.getElementById("ind");
const pickColor = document.getElementById("color");

let x;
let y;
let isPressed = false;
let size = 5;
let color;

pickColor.addEventListener("change",(e)=>{
    color=e.target.value; 
});

ind.addEventListener("change",(e)=>{
   size=e.target.value; 
});

window.addEventListener("mousedown",(e)=>{
    isPressed=true;
    x=e.offsetX;
    y=e.offsetY;
    DrawCircle(x, y);
});

window.addEventListener("mouseup",(e)=>{
    isPressed=false;
    x=undefined;
    y=undefined;
});

canvas.addEventListener("mousemove",(e)=>{
    if(isPressed){
        const x2 = e.offsetX;
        const y2 = e.offsetY;
        DrawCircle(x2, y2);
        DrawLine(x,y,x2,y2);
        x=x2;
        y=y2;
    }
});

//DrawCircle(e.offsetX,e.offsetY);
    


