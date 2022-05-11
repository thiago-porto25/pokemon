import gsap from 'gsap';
import { audio } from './data/audio';
import { battleBgImg } from './data/images';
import { Sprite, Monster } from './classes';
import { animate, battle } from './index';
import attacks from './data/attacks';
import monsters from './data/monsters';

let renderedSprites;
let queue;
let battleAnimationId;
let draggle;
let emby;

const battleBackground = new Sprite({
  img: battleBgImg,
  position: { x: 0, y: 0 },
});

function endBattle() {
  gsap.to('.flashing', {
    opacity: 1,
    onComplete() {
      cancelAnimationFrame(battleAnimationId);
      document.querySelector('canvas').style.transform = 'scale(4)';
      battle.initiated = false;
      audio.map.play();
      animate();
      document.querySelector('.battle-ui').style.display = 'none';
      gsap.to('.flashing', {
        opacity: 0,
      });
    },
  });
}

export function initBattle() {
  document.querySelector('canvas').style.transform = 'scale(1)';
  document.querySelector('.battle-ui').style.display = 'block';
  document.querySelector('.battle-overlay').style.display = 'none';
  document.querySelector('#enemyHealthBar').style.width = '100%';
  document.querySelector('#allyHealthBar').style.width = '100%';
  document.querySelector('.atk-type-container').textContent = 'Attack Type';
  document.querySelector('.atk-btn-container').replaceChildren();

  draggle = new Monster(monsters.Draggle);
  emby = new Monster(monsters.Emby);

  renderedSprites = [draggle, emby];
  queue = [];

  emby.attacks.forEach((attack) => {
    const button = document.createElement('button');
    button.className = 'atk-btn';
    button.textContent = attack.name;

    button.addEventListener('mouseenter', () => {
      const typeText = document.querySelector('.atk-type-container');
      typeText.textContent = attack.type;
      typeText.style.color = attack.color;
    });

    document.querySelector('.atk-btn-container').append(button);
  });

  // Event listeners
  document.querySelectorAll('.atk-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      emby.attack(
        attacks[e.currentTarget.textContent],
        draggle,
        renderedSprites
      );

      if (draggle.health - attacks[e.currentTarget.textContent].damage <= 0) {
        queue.push(() => {
          draggle.faint();
        });
        queue.push(() => {
          endBattle();
        });
        return;
      }

      const randomAtk =
        draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];

      queue.push(() => {
        draggle.attack(randomAtk, emby, renderedSprites);
      });

      if (emby.health - randomAtk.damage <= 0) {
        queue.push(() => {
          emby.faint();
        });
        queue.push(() => {
          endBattle();
        });
        return;
      }
    });
  });
}

export function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);

  battleBackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}

document.querySelector('.battle-overlay').addEventListener('click', (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else {
    e.currentTarget.style.display = 'none';
  }
});
