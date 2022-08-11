import Ball from './ball.js';
import Pop from './pop.js';

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const tau = Math.PI * 2;
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

canvas.addEventListener("mousedown", mousedownHandler);
canvas.addEventListener("mouseup", mouseupHandler);
animate();

function mousedownHandler(e) {
  mousePos_old = getPosition(e);
  mousePos = getPosition(e);
  ball.pickUpBall();
  canvas.addEventListener("mousemove", mousemoveHandler);
}

function mouseupHandler(e) {
  const throwVelocity = getThrowVelocity();
  const speed = Math.abs(throwVelocity.y);
  let rollSpeed = speed/20 * 8;
  if(rollSpeed < 2) rollSpeed = 2;
  console.log('rollSpeed: ', rollSpeed)
  speed > 0.1 ? ball.dropBall() : ball.releaseBall();
  ball.setSpeed(rollSpeed)
  ball.pushBall(throwVelocity);
  canvas.removeEventListener("mousemove", mousemoveHandler);
}

function getThrowVelocity() {
  let xvel = mousePos.x - mousePos_old.x;
  let yvel = mousePos.y - mousePos_old.y;
  if(yvel < -20) yvel = -20;
  return {
    x: xvel / 2,
    y: yvel < -20 ? -20 : yvel
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
  //ball.pushBall({x:.025, y:0})
  ball.update();
  pop.update();
  window.requestAnimationFrame(animate);
}
