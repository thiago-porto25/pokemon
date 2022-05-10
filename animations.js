const tackleAtkAnim = (position, isEnemy, callback) => {
  const tl = gsap.timeline();

  let distance = 20;
  if (isEnemy) distance = -20;

  tl.to(position, {
    x: position.x - distance,
    y: position.y + distance / 2,
  })
    .to(position, {
      x: position.x + distance * 2,
      y: position.y - distance,
      duration: 0.1,
      onComplete() {
        audio.tackleHit.play();
        callback();
      },
    })
    .to(position, {
      x: position.x,
      y: position.y,
    });
};

const tackleDefAnim = (recipient, damage) => {
  const tl = gsap.timeline();

  let distance = 10;
  let elementSelector = '#enemyHealthBar';

  if (!recipient.isEnemy) {
    distance = -10;
    elementSelector = '#allyHealthBar';
  }

  tl.to(recipient.position, {
    x: recipient.position.x + distance,
    y: recipient.position.y - distance,
    duration: 0.1,
    onComplete() {
      gsap.to(recipient, {
        opacity: 0.5,
        duration: 0.08,
        yoyo: true,
        repeat: 5,
      });

      gsap.to(elementSelector, {
        width: recipient.health + '%',
      });
    },
  }).to(recipient.position, {
    x: recipient.position.x,
    y: recipient.position.y,
  });
};

const fireballAtkAnim = (position, renderedSprites, recipient, callback) => {
  const fireballImg = new Image();
  fireballImg.src = './img/fireball.png';
  const fireball = new Sprite({
    img: fireballImg,
    position: {
      x: position.x + 30,
      y: position.y,
    },
    frames: { max: 4, hold: 10 },
    animate: true,
    rotation: 1,
  });
  audio.fireballInit.play();
  renderedSprites.splice(1, 0, fireball);
  gsap.to(fireball.position, {
    x: recipient.position.x,
    y: recipient.position.y,
    onComplete() {
      audio.fireballHit.play();
      callback();
      renderedSprites.splice(1, 1);
    },
  });
};
