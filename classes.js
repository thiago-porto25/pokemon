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
  constructor({
    img,
    position,
    velocity,
    frames = { max: 1, hold: 10 },
    sprites,
    scale = 1,
    animate = false,
    isEnemy = false,
    rotation = 0,
  }) {
    this.img = img;
    this.position = position;
    this.velocity = velocity;
    this.health = 100;
    this.frames = { ...frames, current: 0, elapsed: 0 };
    this.animate = false;
    this.sprites = sprites;
    this.scale = scale;
    this.animate = animate;
    this.opacity = 1;
    this.isEnemy = isEnemy;
    this.rotation = rotation;
    this.img.onload = () => {
      this.width = this.img.width / this.frames.max / this.frames.max;
      this.height = this.img.height / this.frames.max;
    };
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    ctx.rotate(this.rotation);
    ctx.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );
    ctx.drawImage(
      this.img,
      this.frames.current * this.width * this.frames.max,
      0,
      this.img.width / this.frames.max,
      this.img.height,
      this.position.x,
      this.position.y,
      this.img.width / this.frames.max / this.scale,
      this.img.height / this.scale
    );
    ctx.restore();

    if (!this.animate) return;

    if (this.frames.max > 1) this.frames.elapsed += 1;
    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.current < this.frames.max - 1) this.frames.current += 1;
      else this.frames.current = 0;
    }
  }

  attack(attack, recipient, renderedSprites) {
    switch (attack.name) {
      case 'Tackle':
        tackleAtkAnim(this.position, this.isEnemy, () => {
          recipient.takeDamage(attack.damage);
        });
        break;
      case 'Fireball':
        fireballAtkAnim(this.position, renderedSprites, recipient, () => {
          recipient.takeDamage(attack.damage);
        });
        break;
    }
  }

  takeDamage(damage) {
    this.health -= damage;
    tackleDefAnim(this, damage);
  }
}
