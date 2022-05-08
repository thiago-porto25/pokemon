// Initial canvas setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

// Variables
const movables = [];
const collisionsMap = [];
const boundaries = [];
const playerVelocity = 1;
let lastKey = '';
const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
};
const offset = { x: 139, y: 142 };

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
  constructor({ img, position, velocity, frames = { max: 1 } }) {
    this.img = img;
    this.position = position;
    this.velocity = velocity;
    this.frames = frames;

    this.img.onload = () => {
      this.width = this.img.width / this.frames.max / this.frames.max;
      this.height = this.img.height / this.frames.max;
    };
  }

  draw() {
    ctx.drawImage(
      this.img,
      0,
      0,
      this.img.width / this.frames.max,
      this.img.height,
      this.position.x,
      this.position.y,
      this.img.width / this.frames.max / this.frames.max,
      this.img.height / this.frames.max
    );
  }
}

// Functions
function rectangularCollision(rect1, rect2) {
  return (
    rect1.position.x + rect1.width >= rect2.position.x &&
    rect1.position.x <= rect2.position.x + rect2.width &&
    rect1.position.y + rect1.height >= rect2.position.y &&
    rect1.position.y <= rect2.position.y + rect2.height
  );
}

// Collisions
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70));
}

collisionsMap.forEach((row, i) => {
  row.forEach((collision, j) => {
    if (collision === 1025) {
      return boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

// Loading and positioning images
const bgImg = new Image();
bgImg.src = './img/pokemon_map.png';

const playerImg = new Image();
playerImg.src = './img/playerDown.png';

// Instantiating objects
const background = new Sprite({
  img: bgImg,
  position: { x: offset.x, y: offset.y },
});

const player = new Sprite({
  img: playerImg,
  position: {
    x: canvas.width / 2 - 192 / 32,
    y: canvas.height / 2 - 68 / 6,
  },
  frames: { max: 4 },
});

// Populating movables
movables.push(background);
movables.push(...boundaries);

// Animation loop
function animate() {
  window.requestAnimationFrame(animate);

  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  player.draw();

  let moving = true;

  if (keys.w.pressed && lastKey === 'w') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision(player, {
          ...boundary,
          position: {
            x: boundary.position.x,
            y: boundary.position.y + playerVelocity,
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => (movable.position.y += playerVelocity));
    }
  } else if (keys.s.pressed && lastKey === 's') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision(player, {
          ...boundary,
          position: {
            x: boundary.position.x,
            y: boundary.position.y - playerVelocity,
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => (movable.position.y -= playerVelocity));
    }
  } else if (keys.a.pressed && lastKey === 'a') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision(player, {
          ...boundary,
          position: {
            x: boundary.position.x + playerVelocity,
            y: boundary.position.y,
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => (movable.position.x += playerVelocity));
    }
  } else if (keys.d.pressed && lastKey === 'd') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision(player, {
          ...boundary,
          position: {
            x: boundary.position.x - playerVelocity,
            y: boundary.position.y,
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => (movable.position.x -= playerVelocity));
    }
  }
}

animate();

// Event listeners
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'W':
    case 'w':
      keys.w.pressed = true;
      lastKey = 'w';
      break;
    case 'A':
    case 'a':
      keys.a.pressed = true;
      lastKey = 'a';
      break;
    case 'S':
    case 's':
      keys.s.pressed = true;
      lastKey = 's';
      break;
    case 'D':
    case 'd':
      keys.d.pressed = true;
      lastKey = 'd';
      break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'W':
    case 'w':
      keys.w.pressed = false;
      break;
    case 'A':
    case 'a':
      keys.a.pressed = false;
      break;
    case 'S':
    case 's':
      keys.s.pressed = false;
      break;
    case 'D':
    case 'd':
      keys.d.pressed = false;
      break;
  }
});
