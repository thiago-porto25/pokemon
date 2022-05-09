// Initial canvas setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

// Variables
const movables = [];
const collisionsMap = [];
const battleZonesMap = [];
const boundaries = [];
const battleZoneBoundaries = [];
const playerVelocity = 1;
let lastKey = '';
const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
};
const offset = { x: 139, y: 142 };

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

// Battle zones
for (let i = 0; i < battleZones.length; i += 70) {
  battleZonesMap.push(battleZones.slice(i, i + 70));
}

battleZonesMap.forEach((row, i) => {
  row.forEach((battleZone, j) => {
    if (battleZone === 1025) {
      return battleZoneBoundaries.push(
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

const playerDownImg = new Image();
playerDownImg.src = './img/playerDown.png';

const playerUpImg = new Image();
playerUpImg.src = './img/playerUp.png';

const playerRightImg = new Image();
playerRightImg.src = './img/playerRight.png';

const playerLeftImg = new Image();
playerLeftImg.src = './img/playerLeft.png';

const foreImg = new Image();
foreImg.src = './img/foreground.png';

// Instantiating objects
const background = new Sprite({
  img: bgImg,
  position: { x: offset.x, y: offset.y },
});

const player = new Sprite({
  img: playerDownImg,
  position: {
    x: canvas.width / 2 - 192 / 30,
    y: canvas.height / 2 - 68 / 6,
  },
  frames: { max: 4 },
  sprites: {
    up: playerUpImg,
    right: playerRightImg,
    left: playerLeftImg,
    down: playerDownImg,
  },
});

const foreground = new Sprite({
  img: foreImg,
  position: { x: offset.x, y: offset.y },
});

// Populating movables
movables.push(background);
movables.push(...boundaries);
movables.push(foreground);
movables.push(...battleZoneBoundaries);

// Animation loop
function animate() {
  window.requestAnimationFrame(animate);

  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  battleZoneBoundaries.forEach((battleZone) => {
    battleZone.draw();
  });
  player.draw();
  foreground.draw();

  if (keys.w.pressed || keys.s.pressed || keys.a.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZoneBoundaries.length; i++) {
      const battleZone = battleZoneBoundaries[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y));

      if (
        rectangularCollision(player, battleZone) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.03
      ) {
        console.log('battle zone');
        break;
      }
    }
  }

  let moving = true;
  player.moving = false;

  if (keys.w.pressed && lastKey === 'w') {
    player.moving = true;
    player.img = player.sprites.up;

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
    player.moving = true;
    player.img = player.sprites.down;

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
    player.moving = true;
    player.img = player.sprites.left;

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
    player.moving = true;
    player.img = player.sprites.right;

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
