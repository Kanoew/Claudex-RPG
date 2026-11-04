'use strict';

// Décors peints : un fond par zone dans assets/decors/<id de zone>.jpg, posé sur le rectangle de la zone (mêmes unités que le jeu, 2 pixels par unité).
// Les obstacles, collisions, portes et personnages restent ceux du jeu. Sans le fichier, l'ancien dessin en code sert de secours.
// Pour ajouter une zone : déposer son image dans assets/decors/ et l'ajouter ici ; `hide` liste les obstacles que l'image contient déjà (non dessinés).
const paintedDecor = {
  zones: { quartier: { hide: ['facade'] } },
  images: {}
};

function loadPaintedDecor() {
  if (typeof Image === 'undefined') return;
  for (const id of Object.keys(paintedDecor.zones)) {
    const image = new Image();
    image.onload = () => { paintedDecor.images[id] = image; };
    image.onerror = () => { paintedDecor.images[id] = null; };
    image.src = `assets/decors/${id}.jpg?v=1`;
  }
}

// Dessine le fond peint de la zone ; renvoie faux si la zone n'en a pas (ou s'il n'est pas chargé).
function drawPaintedDecor(zone, offsetX, offsetY) {
  const image = paintedDecor.images[zone.id];
  if (!image) return false;
  ctx.drawImage(image, zone.room.x + offsetX, zone.room.y + offsetY, zone.room.width, zone.room.height);
  return true;
}

const paintedDecorHides = (zone, wall) => !!(paintedDecor.images[zone.id] && (paintedDecor.zones[zone.id].hide || []).includes(wall.kind));

loadPaintedDecor();
