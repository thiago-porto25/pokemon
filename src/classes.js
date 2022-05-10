import gsap from 'gsap';
import { audio } from './audio';
import { fireballAtkAnim, tackleAtkAnim, tackleDefAnim } from './animations';
import ctx from './canvasSetup';

export class Boundary {
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

export class Sprite {
  constructor({
    img,
    position,
    velocity,
    frames = { max: 1, hold: 10 },
    sprites,
    scale = 1,
    animate = false,
    rotation = 0,
  }) {
    this.img = new Image();
    this.position = position;
    this.velocity = velocity;
    this.frames = { ...frames, current: 0, elapsed: 0 };
    this.animate = false;
    this.sprites = sprites;
    this.scale = scale;
    this.animate = animate;
    this.opacity = 1;
    this.rotation = rotation;
    this.img.onload = () => {
      this.width = this.img.width / this.frames.max / this.frames.max;
      this.height = this.img.height / this.frames.max;
    };
    this.img.src = img.src;
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
}

export class Monster extends Sprite {
  constructor({
    isEnemy = false,
    name,
    img,
    position,
    velocity,
    frames = { max: 1, hold: 10 },
    sprites,
    scale = 1,
    animate = false,
    rotation = 0,
    attacks,
  }) {
    super({
      img,
      position,
      velocity,
      frames,
      sprites,
      scale,
      animate,
      rotation,
    });
    this.name = name;
    this.health = 100;
    this.isEnemy = isEnemy;
    this.attacks = attacks;
  }

  attack(attack, recipient, renderedSprites) {
    const dialog = document.querySelector('.battle-overlay');
    dialog.style.display = 'block';
    dialog.children[0].textContent = `${this.name} used ${attack.name}`;

    switch (attack.name) {
      case 'Tackle':
        tackleAtkAnim(this.position, this.isEnemy, () => {
          recipient.takeDamage(attack.damage);
        });
        break;
      case 'Fireball':
        audio.fireballInit.play();
        fireballAtkAnim(this.position, renderedSprites, recipient, () => {
          recipient.takeDamage(attack.damage);
        });
        break;
    }
  }

  takeDamage(damage) {
    this.health -= damage;
    tackleDefAnim(this);
  }

  faint() {
    const dialog = document.querySelector('.battle-overlay');
    dialog.children[0].textContent = `${this.name} fainted`;

    gsap.to(this.position, {
      y: this.position.y + 50,
      onComplete: () => {
        gsap.to(this.position, {
          y: this.position.y - 50,
        });
      },
    });
    gsap.to(this, {
      opacity: 0,
    });
    audio.battle.stop();
    audio.victory.play();
  }
}
