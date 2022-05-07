// Initial canvas setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Loading and positioning images
const bgImg = new Image();
bgImg.src = './img/pokemon_map.png';

const playerImg = new Image();
playerImg.src = './img/playerDown.png';
playerImg.width = 12;
playerImg.height = 12;

// Keys
let lastKey = '';
const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
};

// Classes
class Sprite {
  constructor({ img, position, velocity }) {
    this.img = img;
    this.position = position;
    this.velocity = velocity;
  }

  draw() {
    ctx.drawImage(this.img, this.position.x, this.position.y);
  }
}

const background = new Sprite({
  img: bgImg,
  position: { x: 139, y: 142 },
  velocity: 1,
});

// Animation loop
function animate() {
  window.requestAnimationFrame(animate);

  background.draw();
  ctx.drawImage(
    playerImg,
    0,
    0,
    playerImg.width * 4,
    playerImg.height * 8,
    canvas.width / 2 - playerImg.width / 2,
    canvas.height / 2 - playerImg.height / 2,
    playerImg.width,
    playerImg.height * 2
  );

  if (keys.w.pressed && lastKey === 'w') {
    background.position.y += background.velocity;
  } else if (keys.s.pressed && lastKey === 's') {
    background.position.y -= background.velocity;
  } else if (keys.a.pressed && lastKey === 'a') {
    background.position.x += background.velocity;
  } else if (keys.d.pressed && lastKey === 'd') {
    background.position.x -= background.velocity;
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
