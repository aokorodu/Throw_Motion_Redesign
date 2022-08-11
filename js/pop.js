class Pop {
    constructor(ctx, x, y) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.started = false;
      this.r = 10;
      this.maxR = 50;
      this.opacity = 0.8;
    }
  
    fire(x, y) {
      this.x = x;
      this.y = y;
      this.started = true;
    }
  
    reset() {
      this.started = false;
      this.r = 10;
      this.maxR = 50;
      this.opacity = 0.8;
    }
  
    draw() {
      this.ctx.globalAlpha = this.opacity;
      this.ctx.fillStyle = "black";
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
      this.ctx.fillStyle = "red";
      this.ctx.fill();
    }
  
    update() {
      if (!this.started) return;
  
      this.draw();
  
      this.r *= 1.2;
      this.opacity -= 0.095;
  
      if (this.opacity <= 0) {
        this.reset();
      }
    }
  }

  export default Pop;