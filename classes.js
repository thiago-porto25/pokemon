// Classes
class Boundary {
  static width = 12;
  static height = 12;

  constructor({ position }) {
    this.position = position;
    this.height = 12;
    this.width = 12;
  }

  draw() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0)';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Sprite {
  constructor({ img, position, velocity, frames = { max: 1 }, sprites }) {
    this.img = img;
    this.position = position;
    this.velocity = velocity;
    this.frames = { ...frames, current: 0, elapsed: 0 };
    this.moving = false;
    this.sprites = sprites;
    this.img.onload = () => {
      this.width = this.img.width / this.frames.max / this.frames.max;
      this.height = this.img.height / this.frames.max;
    };
  }

  draw() {
    ctx.drawImage(
      this.img,
      this.frames.current * this.width * this.frames.max,
      0,
      this.img.width / this.frames.max,
      this.img.height,
      this.position.x,
      this.position.y,
      this.img.width / this.frames.max / this.frames.max,
      this.img.height / this.frames.max
    );

    if (!this.moving) return;

    if (this.frames.max > 1) this.frames.elapsed += 1;
    if (this.frames.elapsed % 10 === 0) {
      if (this.frames.current < this.frames.max - 1) this.frames.current += 1;
      else this.frames.current = 0;
    }
  }
}
