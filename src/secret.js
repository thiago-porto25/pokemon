import { Sprite } from './classes';
import { canvas } from './canvasSetup';
import {
  secretImg,
  playerDownImg,
  playerLeftImg,
  playerRightImg,
  playerUpImg,
  secretFore,
} from './data/images';
import movePlayer from './lib/movePlayer';
import setupBoundary from './lib/setupBoundary';
import { keys, lastKey, playerVelocity } from './index';
import { secretCollisions } from './data/secretCollisions';

const movables = [];
const collisionsMap = [];
const boundaries = [];
const offset = {
  x: 255,
  y: -50,
};

setupBoundary(collisionsMap, secretCollisions, boundaries, offset);

const secretBackground = new Sprite({
  img: secretImg,
  position: { x: offset.x, y: offset.y },
});

const foreground = new Sprite({
  img: secretFore,
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

movables.push(secretBackground);
movables.push(...boundaries);
movables.push(foreground);

export function animateSecret() {
  window.requestAnimationFrame(animateSecret);

  secretBackground.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  player.draw();
  foreground.draw();

  let moving = true;
  player.animate = false;

  function resetMoving() {
    moving = false;
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
