import rectangularCollision from './rectangularCollision';

function movePlayer(
  player,
  boundaries,
  velocity,
  sprite,
  keyPressed,
  callback
) {
  player.animate = true;
  player.img = sprite;

  for (let i = 0; i < boundaries.length; i++) {
    const boundary = boundaries[i];
    let positionObj;

    switch (keyPressed) {
      case 'w':
        positionObj = {
          x: boundary.position.x,
          y: boundary.position.y + velocity,
        };
        break;
      case 'a':
        positionObj = {
          x: boundary.position.x + velocity,
          y: boundary.position.y,
        };
        break;
      case 's':
        positionObj = {
          x: boundary.position.x,
          y: boundary.position.y - velocity,
        };
        break;
      case 'd':
        positionObj = {
          x: boundary.position.x - velocity,
          y: boundary.position.y,
        };
        break;
    }

    if (
      rectangularCollision(player, {
        ...boundary,
        position: positionObj,
      })
    ) {
      callback();
      break;
    }
  }
}

export default movePlayer;
