'use strict';

// Sources déjà présentes dans les décors. Ni lampe ajoutée, ni lumière portée par Yarden.
// Quelques dégradés Canvas suffisent ; pas de pixels lus ni de filtre sur les sprites.
function sceneLights() {
  const lights = [];
  const add = (x, y, radius, color, strength = .12) => lights.push({ x, y, radius, color, strength });
  const warm = [255, 207, 138], blue = [90, 150, 255];
  if (currentZone.id === 'exterieur') {
    for (const prop of currentZone.props) {
      if (prop.kind === 'lampe') add(prop.x, prop.y, 160, warm);
      if (prop.kind === 'residence') add(prop.x, prop.y, 200, warm, .15);
    }
    if (riftShown && !encounter.complete) {
      const grow = Math.min(1, Math.max(0, (mirrorNow() - riftOpenedAt) / 1.3));
      add(0, room.y + room.height - 74, 130, blue, .16 * grow);
    }
  } else if (currentZone.id === 'quartier') add(100, -30, 170, warm);
  else if (currentZone.id === 'appartement') add(-200, -290, 250, warm, .1);
  else if (currentZone.id === 'comptoir') add(0, -85, 120, [190, 255, 214]);
  else if (currentZone.id === 'quatreb') add(0, -110, 230, warm, .13);
  else if (currentZone.id === 'escalier') add(0, -600, 110, warm, .1);
  else if (currentZone.id === 'antre') {
    // Quatre points de mana des câbles existants, aux mêmes positions que leur dessin.
    const spider = spiderEnemy();
    for (let i = 0; i < antreCables.length; i += Math.ceil(antreCables.length / 4)) {
      const cable = antreCables[i], t = (cable.phase + elapsed * cable.speed) % 1;
      add(cable.x + (spider.x - cable.x) * t, cable.y + (spider.y - cable.y) * t, 80, [174, 191, 214], .07);
    }
  }
  if (freeMode.active) {
    const spot = freeSpots[currentZone.id] || (currentZone.id === 'faille' && freeMode.done ? zones.faille.start : null);
    if (spot) add(spot.x, spot.y - 34, 130, blue, .16);
  }
  return lights;
}

// Une ombre courte s'éloigne de la source proche ; elle est dessinée sous les personnages.
function lightAt(x, y, lights) {
  let nearest = null, influence = 0;
  for (const light of lights) {
    const distance = Math.hypot(x - light.x, y - light.y);
    const value = Math.max(0, 1 - distance / light.radius) * light.strength;
    if (value > influence) { nearest = light; influence = value; }
  }
  return { source: nearest, influence };
}

function drawLightShadows(offsetX, offsetY, lights) {
  const actors = [player, ...Object.values(sceneActors).filter(actor => actor.visible), ...activeEnemies().filter(enemy => enemy.hp > 0)];
  ctx.save();
  ctx.beginPath(); ctx.rect(room.x + offsetX, room.y + offsetY, room.width, room.height); ctx.clip();
  for (const actor of actors) {
    const { source, influence } = lightAt(actor.x, actor.y, lights);
    if (!source || influence < .015) continue;
    const x = actor.x + offsetX, y = actor.y + offsetY;
    if (x < -50 || x > width + 50 || y < -50 || y > height + 50) continue;
    ctx.save(); ctx.translate(x, y);
    ctx.rotate(Math.atan2(actor.y - source.y, actor.x - source.x));
    const size = Math.min(28, actor.radius || 15);
    ctx.fillStyle = `rgba(5, 6, 12, ${Math.min(.18, influence * 1.5)})`;
    ctx.beginPath(); ctx.ellipse(size * .6, 0, size * 1.5, size * .5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawSceneLighting(offsetX, offsetY, lights) {
  if (scene.mirror || scene.metro || scene.card || scene.dark) return;
  ctx.save();
  // La teinte touche aussi les personnages, puis les repères et textes sont dessinés au-dessus.
  ctx.beginPath(); ctx.rect(room.x + offsetX, room.y + offsetY, room.width, room.height); ctx.clip();
  const warmRoom = ['appartement', 'comptoir', 'quatreb'].includes(currentZone.id);
  ctx.fillStyle = warmRoom ? 'rgba(54, 28, 14, .06)' : 'rgba(8, 12, 24, .06)';
  ctx.fillRect(0, 0, width, height);
  // Le mélange éclaircit sans effacer les silhouettes, dégâts ou annonces d'attaque.
  ctx.globalCompositeOperation = 'screen';
  for (const light of lights) {
    const x = light.x + offsetX, y = light.y + offsetY, r = light.radius;
    if (light.strength <= 0 || x + r < 0 || x - r > width || y + r < 0 || y - r > height) continue;
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r);
    glow.addColorStop(0, `rgba(${light.color.join(',')}, ${light.strength})`);
    glow.addColorStop(1, `rgba(${light.color.join(',')}, 0)`);
    ctx.fillStyle = glow;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  ctx.restore();
}
