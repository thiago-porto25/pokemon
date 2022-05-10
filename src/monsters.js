import attacks from './data/attacks';

const draggleImg = new Image();
draggleImg.src = '/img/draggleSprite.png';

const embyImg = new Image();
embyImg.src = '/img/embySprite.png';

const monsters = {
  Emby: {
    img: embyImg,
    position: { x: 280, y: 325 },
    frames: { max: 4, hold: 30 },
    animate: true,
    name: 'Emby',
    attacks: [attacks.Tackle, attacks.Fireball],
  },
  Draggle: {
    img: draggleImg,
    position: { x: 800, y: 100 },
    frames: { max: 4, hold: 30 },
    animate: true,
    isEnemy: true,
    name: 'Draggle',
    attacks: [attacks.Tackle, attacks.Fireball],
  },
};

export default monsters;
