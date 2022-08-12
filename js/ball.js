class Ball {
  constructor(ctx, x, y, w, h, onCrash, onScore) {
    this.onCrash = onCrash;
    this.onScore = onScore;
    this.ctx = ctx;
    this.r = 30;
    this.w = w;
    this.h = h;
    this.max = h - this.r - 20;
    this.accel = {
      x: 0,
      y: 1,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.startPosition = {
      x: x,
      y: y,
    };
    this.position = {
      x: x,
      y: y,
    };

    this.dragging = false;
    this.dropped = false;
    this.scored = false;
    this.count = 0;
    this.decay = 0.995;
    this.maxYIncrement = 4;
    this.yIncrement = 4;
    this.totalIncrement = 0;
    this.targetDistance = 325;
    this.tau = 2 * Math.PI;
  }

  init() {}

  setMaxSpeed(newMax){
    this.maxYIncrement = newMax;
  }

  setSpeed(percentage) {
    this.yIncrement = percentage * this.maxYIncrement;
    if(this.yIncrement < 2) this.yIncrement = 2
    console.log('yIncrement: ', this.yIncrement)
  }

  pickUpBall() {
    if(this.scored) return;
    if(this.dropped) return;
    this.dragging = true;
    this.dropped = false;
  }

  dragBall(position) {
    if (!this.dragging || this.dropped) return;
    this.position = position;

    this.draw();
  }

  dropBall() {
    this.dragging = false;
    this.dropped = true;
  }

  releaseBall() {
    this.dragging = false;
    this.dropped = false;
  }

  pushBall(force) {
    if (this.dragging || !this.dropped) return;

    this.accel.x += force.x;
    this.accel.y += force.y;
    console.log(this.accel.y)
  }

  draw() {
    this.ctx.globalAlpha = 0.1;
    this.ctx.fillStyle = "black";
    this.ctx.beginPath();
    this.ctx.ellipse(
      this.position.x,
      this.max + this.r - 5,
      this.r,
      this.r / 2,
      0,
      0,
      this.tau
    );
    this.ctx.fill();

    this.ctx.globalAlpha = 1;
    this.ctx.beginPath();
    this.ctx.arc(this.position.x, this.position.y, this.r, 0, this.tau);
    this.ctx.fillStyle = "red";
    this.ctx.fill();
  }

  update() {
    if (this.dragging) return;
    if (this.position.y > 550) {
      return;
    }

    if (this.dropped) {
      
      this.yIncrement *= this.decay;
      this.totalIncrement += this.yIncrement;
      this.r = (512 - (this.totalIncrement*1.25))/512 * 30;
      if (!this.scored) this.ctx.translate(0, -this.yIncrement);

      if (this.totalIncrement > this.targetDistance) {
        const xpos = 250;
        const eh = 20;
        const ew = 40;
        const x_originTarget = 250;

        const cx = this.position.x;
        const y_originTarget = this.max;
        const val =
          Math.pow(cx - x_originTarget, 2) / Math.pow(ew, 2) +
          Math.pow(this.position.y - y_originTarget, 2) / Math.pow(eh, 2);
        console.log(val);

        if (val <= 1) {
          console.log("hole in one!");
          this.scored = true;
          this.max = 600;
          this.ctx.beginPath();
          this.ctx.ellipse(250, 450, 40, 20, 0, 0, this.tau);
          this.ctx.clip();
        } else {
          if (!this.scored) {
            this.onCrash(this.position.x, this.position.y);
            this.reset();
          }
        }
      }
      if (this.position.x < -(2 * this.r)) this.reset();
      if (this.position.x > this.w + 2 * this.r) this.reset();
    }

    this.velocity.x += this.accel.x;
    this.velocity.y += this.accel.y;

    this.position.x += this.velocity.x;

    this.position.y += this.velocity.y;

    if (this.position.y > this.max) {
      this.position.y = this.max;
      this.velocity.y *= -0.8;
    }

    this.velocity.y *= 0.99;
    if (Math.abs(this.velocity.y) < 0.18) this.velocity.y = 0;

    // if(this.count < 400) console.log(this.velocity.y)
    this.accel = {
      x: 0,
      y: 0.9,
    };
    this.draw();
    //this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  reset() {
    console.log("reset");
    this.accel = {
      x: 0,
      y: 1,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.position = {
      x: this.startPosition.x,
      y: this.startPosition.y,
    };

    this.r = 30;
    this.yIncrement = 8;
    this.totalIncrement = 0;

    this.dragging = false;
    this.dropped = false;
    this.count = 0;

    this.max = this.h - this.r - 20;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

export default Ball;
