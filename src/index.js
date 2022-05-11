import gsap from 'gsap';
import { audio } from './data/audio';
import { Sprite } from './classes';
import { canvas } from './canvasSetup';
import { animateBattle, initBattle } from './battle';
import collisions from './data/collisions';
import battleZones from './data/battleZones';
import {
  bgImg,
  foreImg,
  playerDownImg,
  playerLeftImg,
  playerRightImg,
  playerUpImg,
} from './data/images';
import rectangularCollision from './lib/rectangularCollision';
import setupBoundary from './lib/setupBoundary';
import movePlayer from './lib/movePlayer';

// Variables
let musicStarted = false;
const movables = [];
const collisionsMap = [];
const battleZonesMap = [];
const boundaries = [];
const battleZoneBoundaries = [];
const playerVelocity = 1;
const offset = { x: 139, y: 142 };
let lastKey = '';
const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
};
export const battle = {
  initiated: false,
};

// Collisions
setupBoundary(collisionsMap, collisions, boundaries, offset);

// Battle zones
setupBoundary(battleZonesMap, battleZones, battleZoneBoundaries, offset);

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
  frames: { max: 4, hold: 10 },
  sprites: {
    up: playerUpImg,
    right: playerRightImg,
    left: playerLeftImg,
    down: playerDownImg,
  },
  scale: 4,
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
export function animate() {
  const animationId = window.requestAnimationFrame(animate);

  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  battleZoneBoundaries.forEach((battleZone) => {
    battleZone.draw();
  });
  player.draw();
  foreground.draw();

  let moving = true;
  player.animate = false;

  function resetMoving() {
    moving = false;
  }

  if (battle.initiated) return;

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
        Math.random() < 0.02
      ) {
        window.cancelAnimationFrame(animationId);

        battle.initiated = true;
        audio.map.stop();
        audio.initBattle.play();

        gsap.to('.flashing', {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to('.flashing', {
              opacity: 1,
              duration: 0.4,
              onComplete() {
                initBattle();
                animateBattle();
                audio.battle.play();
                gsap.to('.flashing', {
                  opacity: 0,
                  duration: 0.4,
                });
              },
            });
          },
        });

        break;
      }
    }
  }

  if (keys.w.pressed && lastKey === 'w') {
    movePlayer(
      player,
      boundaries,
      playerVelocity,
      player.sprites.up,
      'w',
      resetMoving
    );

    if (moving) {
      movables.forEach((movable) => (movable.position.y += playerVelocity));
    }
  } else if (keys.s.pressed && lastKey === 's') {
    movePlayer(
      player,
      boundaries,
      playerVelocity,
      player.sprites.down,
      's',
      resetMoving
    );

    if (moving) {
      movables.forEach((movable) => (movable.position.y -= playerVelocity));
    }
  } else if (keys.a.pressed && lastKey === 'a') {
    movePlayer(
      player,
      boundaries,
      playerVelocity,
      player.sprites.left,
      'a',
      resetMoving
    );

    if (moving) {
      movables.forEach((movable) => (movable.position.x += playerVelocity));
    }
  } else if (keys.d.pressed && lastKey === 'd') {
    movePlayer(
      player,
      boundaries,
      playerVelocity,
      player.sprites.right,
      'd',
      resetMoving
    );

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

window.addEventListener('click', () => {
  if (!musicStarted) {
    audio.map.play();
    musicStarted = true;
  }
});
