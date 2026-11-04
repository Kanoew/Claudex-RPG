'use strict';

// Décors peints : un fond par zone dans assets/decors/<id de zone>.jpg, posé sur le rectangle de la zone (2 pixels par unité), et des objets peints
// (assets/decors/objets/) posés sur leurs rectangles de collision. Les collisions, portes et personnages restent ceux du jeu.
// Sans l'image, l'ancien dessin en code sert de secours. Les images sont fabriquées par docs/art/outils/decors.py.
// `hide` : obstacles que l'image contient déjà (non dessinés) ; `objects` : sorte d'obstacle -> objet peint (ou fonction de l'obstacle) ;
// `variant` : version du fond à utiliser (par exemple « jour »), vide pour la version de base.
const paintedDecor = {
  zones: {
    quartier: {
      hide: ['facade'],
      sprites: ['voiture-bordeaux', 'voiture-bleue', 'velos', 'arbre', 'fleurs', 'poubelle'],
      objects: { voiture: wall => wall.tint === '#7a2f3a' ? 'voiture-bordeaux' : 'voiture-bleue', velos: 'velos', arbre: 'arbre', fleurs: 'fleurs', poubelle: 'poubelle' },
      // Le matin du chapitre 2, la rue est de jour ; le reste du temps, de nuit (à affiner selon les scènes).
      variant: () => (typeof home !== 'undefined' && home.stage === 'matin') ? 'jour' : ''
    },
    sousgare: { hide: ['belle-epoque'] },
    // Les objets dépassent leur rectangle de collision (vue en trois quarts) : largeur ou hauteur voulue, en unités du jeu.
    square: { hide: ['immeuble-sq'], sprites: ['banc', 'arbre-square', 'lampadaire'], objects: { banc: { name: 'banc', width: 96 }, arbre: { name: 'arbre-square', height: 118 }, lampadaire: { name: 'lampadaire', height: 92 } } },
    flon: { hide: ['facade-flon', 'bar'], sprites: ['table-a', 'table-b', 'table-c', 'bar'], objects: { bar: { name: 'bar', width: 230 }, table: wall => ({ name: ['table-a', 'table-b', 'table-c'][Math.abs(wall.x) % 3], width: 64 }) } },
    marterey: { hide: ['kebab', 'porte-marron', 'laverie'] },
    exterieur: { sprites: ['benne', 'caisses', 'poubelles', 'scooter'], objects: { benne: 'benne', caisses: 'caisses', poubelles: 'poubelles', scooter: 'scooter' }, noProps: true }
  },
  images: {},
  objects: {}
};

function loadPaintedDecor() {
  if (typeof Image === 'undefined') return;
  const load = (store, key, path) => {
    const image = new Image();
    image.onload = () => { store[key] = image; };
    image.onerror = () => { store[key] = null; };
    image.src = path;
  };
  for (const [id, config] of Object.entries(paintedDecor.zones)) {
    load(paintedDecor.images, id, `assets/decors/${id}.jpg?v=3`);
    if (config.variant) load(paintedDecor.images, `${id}-jour`, `assets/decors/${id}-jour.jpg?v=3`);
    for (const name of config.sprites || []) load(paintedDecor.objects, name, `assets/decors/objets/${name}.png?v=3`);
  }
}

function paintedDecorImage(zone) {
  const config = paintedDecor.zones[zone.id];
  if (!config) return null;
  const variant = config.variant ? config.variant() : '';
  return (variant && paintedDecor.images[`${zone.id}-${variant}`]) || paintedDecor.images[zone.id] || null;
}

// Dessine le fond peint de la zone ; renvoie faux si la zone n'en a pas (ou s'il n'est pas chargé).
function drawPaintedDecor(zone, offsetX, offsetY) {
  const image = paintedDecorImage(zone);
  if (!image) return false;
  ctx.drawImage(image, zone.room.x + offsetX, zone.room.y + offsetY, zone.room.width, zone.room.height);
  return true;
}

const paintedDecorActive = zone => !!paintedDecorImage(zone);
const paintedDecorHides = (zone, wall) => paintedDecorActive(zone) && (paintedDecor.zones[zone.id].hide || []).includes(wall.kind);

// Objet peint posé sur son rectangle de collision : calé en bas, centré, il dépasse un peu vers le haut (vue en trois quarts).
function drawPaintedObject(zone, wall, x, y) {
  if (!paintedDecorActive(zone)) return false;
  const rule = (paintedDecor.zones[zone.id].objects || {})[wall.kind];
  const value = typeof rule === 'function' ? rule(wall) : rule;
  const spec = typeof value === 'string' ? { name: value } : value;
  const art = spec && paintedDecor.objects[spec.name];
  if (!art) return false;
  const w = wall.width, h = wall.height;
  const scale = spec.height ? spec.height / art.height : spec.width ? spec.width / art.width : Math.min(w / art.width, h * 1.7 / art.height);
  const dw = art.width * scale, dh = art.height * scale;
  ctx.save();
  ctx.fillStyle = '#05080e88';
  ctx.beginPath(); ctx.ellipse(x + w / 2 + 3, y + h - 2, dw / 2, Math.max(4, dh * .08), 0, 0, Math.PI * 2); ctx.fill();
  ctx.drawImage(art, x + (w - dw) / 2, y + h - dh, dw, dh);
  ctx.restore();
  return true;
}

loadPaintedDecor();
