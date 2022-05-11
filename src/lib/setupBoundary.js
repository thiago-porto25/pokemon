import { Boundary } from '../classes';

function setupBoundary(map, data, boundaries, offset) {
  for (let i = 0; i < data.length; i += 70) {
    map.push(data.slice(i, i + 70));
  }

  map.forEach((row, i) => {
    row.forEach((item, j) => {
      if (item === 1025) {
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
}

export default setupBoundary;
