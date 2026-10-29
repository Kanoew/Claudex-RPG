'use strict';

// Déplacement de Yarden et des monstres, avec collisions contre les murs.

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function moveAxis(axis, distance, body = player) {
  if (distance === 0) return;
  const other = axis === 'x' ? 'y' : 'x';
  const size = axis === 'x' ? 'width' : 'height';
  const otherSize = axis === 'x' ? 'height' : 'width';
  let target = body[axis] + distance;
  for (const wall of walls) {
    const gap = body[other] - clamp(body[other], wall[other], wall[other] + wall[otherSize]);
    if (Math.abs(gap) >= body.radius) continue;
    // La distance au coin tient compte du disque visible de Yarden.
    const reach = Math.sqrt(body.radius ** 2 - gap ** 2);
    const min = wall[axis] - reach;
    const max = wall[axis] + wall[size] + reach;
    if (target > min && target < max) {
      target = distance > 0 ? min : max;
    }
  }
  body[axis] = target;
}

function movePlayer(dx, dy, body = player) {
  // Petits pas pour ne pas traverser un mur, même lors d’une image lente.
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / (body.radius / 2)));
  for (let step = 0; step < steps; step++) {
    moveAxis('x', dx / steps, body);
    moveAxis('y', dy / steps, body);
  }
}
