import Ball from './ball.js';
import Pop from './pop.js';

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const speedText = document.querySelector("#speed-text");
const breezeText = document.querySelector("#breeze-text");
let breeze = 0;
let r = 30;
let w = 512;
let h = 512;
const ball = new Ball(ctx, w / 2, 470, w, h, crash, crash);
const pop = new Pop(ctx, 0, 0);
let mousePos = {
  x: 0,
  y: 0
};
let mousePos_old = {
  x: 0,
  y: 0
};

function init(){
    ball.setMaxSpeed(document.querySelector("#speed-slider").value)
}

function initListeners(){
    canvas.addEventListener("mousedown", mousedownHandler);
    canvas.addEventListener("mouseup", mouseupHandler);
    const speedSlider = document.querySelector("#speed-slider");
    speedSlider.addEventListener("input", (e)=>{
        console.log(e.target.value);
        speedText.textContent = e.target.value;
        ball.setMaxSpeed(e.target.value)
    })

    const breezeSlider = document.querySelector("#breeze-slider");
    breezeSlider.addEventListener("input", (e)=>{
        const val = e.target.value;
        breezeText.textContent = val;
        breeze = val * 1;
    })
}

init();
initListeners();
animate();

function mousedownHandler(e) {
  mousePos_old = getPosition(e);
  mousePos = getPosition(e);
  ball.pickUpBall();
  canvas.addEventListener("mousemove", mousemoveHandler);
  canvas.addEventListener("mouseout", mouseupHandler);
}

function mouseupHandler(e) {
  const throwVelocity = getThrowVelocity();
  console.log('throwVelocity', throwVelocity.y)
  let speed = Math.abs(throwVelocity.y);
  if(speed < 1) speed = 1;
  speed > 0.1 ? ball.dropBall() : ball.releaseBall();
  let speedPercentage = speed/20;
  console.log('1 speed %', speedPercentage)
  if(speedPercentage < .3) speedPercentage = .3;
  console.log('2 speed %', speedPercentage)
  ball.setSpeed(speedPercentage)
  ball.pushBall(throwVelocity);
  canvas.removeEventListener("mousemove", mousemoveHandler);
  canvas.removeEventListener("mouseout", mouseupHandler);
}

function getThrowVelocity() {
  let xvel = (mousePos.x - mousePos_old.x) * .667;
  let yvel = mousePos.y - mousePos_old.y;
  if(yvel < -20) yvel = -20;
  return {
    x: xvel,
    y: yvel
  };
}


function mousemoveHandler(e) {
  mousePos_old.x = mousePos.x;
  mousePos_old.y = mousePos.y;
  mousePos = getPosition(e);
  //ball.dragBall(ballPos)
}

function getPosition(event) {
  let mouseX = event.clientX - canvas.getBoundingClientRect().left;
  let mouseY = event.clientY - canvas.getBoundingClientRect().top;
  return {
    x: mouseX,
    y: mouseY
  };
}

function crash(x, y) {
  console.log("crash");
  pop.fire(x, y - this.targetDistance);
}

function animate() {
  ctx.clearRect(0, 0, 512, 512);
  ball.dragBall(mousePos);
  ball.pushBall({x:breeze, y:0})
  ball.update();
  pop.update();
  window.requestAnimationFrame(animate);
}
