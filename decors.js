'use strict';

// Décors peints : un fond par zone dans assets/decors/<id de zone>.jpg, posé sur le rectangle de la zone (2 pixels par unité), et des objets peints
// (assets/decors/objets/) posés sur leurs rectangles de collision. Les collisions, portes et personnages restent ceux du jeu.
// Sans l'image, l'ancien dessin en code sert de secours. Fonds : docs/art/outils/decors.py ; planche de raccords : docs/RACCORDS-DECORS.md.
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
    impasse: { hideBorder: true, hide: ['pressing', 'mur'], sprites: ['impasse-poubelle', 'impasse-poubelle-metal', 'impasse-velo'], objects: { poubelles: { name: 'impasse-poubelle-metal', height: 80 }, velo: { name: 'impasse-velo', width: 74 } } },
    cour: { hide: ['lierre', 'arbuste'] },
    comptoir: { hide: ['mur-int', 'comptoir-remi'] },
    quatreb: { hideBorder: true, hide: ['etagere', 'papier'], objects: { bureau: { patch: 'bureau', rise: 20 } } },
    preau: { hideBorder: true, hide: ['mur-ecole', 'colonne'], objects: { 'banc-pierre': { patch: 'banc', rise: 10 } } },
    hall: { hide: ['comptoir-hall', 'ascenseur-hall'] },
    // Les objets peints couvrent toute l'emprise bloquante ; seul leur relief dépasse vers le nord.
    donjon: { hideBorder: true, objects: { 'pilier-pierre': wall => ({ patch: wall.height > wall.width ? 'pierre-longue' : 'pierre-large', rise: 8 }) } },
    run: { hideBorder: true, objects: { pilier: { patch: 'pilier-ocre', rise: 32 }, roc: wall => ({ patch: wall.width > wall.height ? 'rochers-larges' : 'rochers-longs', rise: 0 }) } },
    // Lot 4 : les trois dernières zones. Les cloisons et la baie sont dans l'image ; les meubles viennent de planches à fond vert.
    appartement: {
      hide: ['cloison'],
      sprites: ['assiette-oeufs', 'app-canape', 'app-tablebasse', 'app-livres', 'app-table', 'app-comptoir', 'app-cuisine', 'app-lit', 'app-placard', 'app-radiateur', 'app-douche', 'app-lavabo'],
      objects: {
        canape: { name: 'app-canape', width: 130 }, tablebasse: { name: 'app-tablebasse', width: 100 }, livres: { name: 'app-livres', width: 52 },
        table: { name: 'app-table', width: 62 }, comptoir: { name: 'app-comptoir', width: 240 }, cuisine: { name: 'app-cuisine', width: 240 },
        lit: { name: 'app-lit', height: 140 }, placard: { name: 'app-placard', width: 70 }, radiateur: { name: 'app-radiateur', width: 100 },
        douche: { name: 'app-douche', width: 60 }, lavabo: { name: 'app-lavabo', width: 56 }
      }
    },
    penthouse: {
      hide: ['baie', 'cloison-i'],
      sprites: ['pent-canape-a', 'pent-canape-b', 'pent-ilot', 'pent-marbre'],
      objects: {
        'cuisine-i': { name: 'pent-ilot', width: 150 }, marbre: { name: 'pent-marbre', width: 80 },
        'canape-i': wall => ({ name: wall.y < -100 ? 'pent-canape-a' : 'pent-canape-b', width: 200 })
      }
    },
    escalier: {},
    antre: { hideBorder: true, sprites: ['amas-cristal'], objects: { 'amas-cristal': { name: 'amas-cristal', patch: 'cristaux', rise: 20 } } },
    // Les objets dépassent leur rectangle de collision (vue en trois quarts) : largeur ou hauteur voulue, en unités du jeu.
    square: { hide: ['immeuble-sq'], sprites: ['banc', 'arbre-square', 'lampadaire'], objects: { banc: { name: 'banc', width: 96 }, arbre: { name: 'arbre-square', height: 118 }, lampadaire: { name: 'lampadaire', height: 92 } } },
    flon: { hide: ['facade-flon', 'bar'], sprites: ['table-a', 'table-b', 'table-c', 'bar'], objects: { bar: { name: 'bar', width: 230 }, table: wall => ({ name: ['table-a', 'table-b', 'table-c'][Math.abs(wall.x) % 3], width: 64 }) } },
    marterey: { hide: ['kebab', 'porte-marron', 'laverie'] },
    exterieur: { hide: ['facade-residence'], sprites: ['benne', 'caisses', 'poubelles', 'scooter'], objects: { benne: 'benne', caisses: 'caisses', poubelles: 'poubelles', scooter: 'scooter' }, noProps: true }
  },
  // Rectangles source dans raccords.png (1086 × 1448), sauf cristaux dans amas-cristal.png (1122 × 1402).
  // Les sept autres objets partagent une seule image ; le Canvas lit directement ces rectangles.
  patches: {
    bureau: [62, 39, 428, 284], banc: [583, 111, 461, 184],
    'pierre-longue': [190, 373, 164, 339], 'pierre-large': [586, 451, 453, 201],
    'pilier-ocre': [178, 747, 188, 301], 'rochers-larges': [554, 775, 507, 229],
    'rochers-longs': [173, 1089, 200, 335], cristaux: [174, 91, 773, 1178]
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
  load(paintedDecor.objects, 'raccords', 'assets/decors/objets/raccords.png?v=1');
  for (const [id, config] of Object.entries(paintedDecor.zones)) {
    load(paintedDecor.images, id, `assets/decors/${id}.jpg?v=4`);
    if (config.variant) load(paintedDecor.images, `${id}-jour`, `assets/decors/${id}-jour.jpg?v=4`);
    for (const name of config.sprites || []) load(paintedDecor.objects, name, `assets/decors/objets/${name}.png?v=4`);
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
  if (!image) {
    if (!paintedDecor.zones[zone.id] || paintedDecor.images[zone.id] !== undefined) return false;
    ctx.fillStyle = '#0b0c12';
    ctx.fillRect(zone.room.x + offsetX, zone.room.y + offsetY, zone.room.width, zone.room.height);
    return true;
  }
  ctx.drawImage(image, zone.room.x + offsetX, zone.room.y + offsetY, zone.room.width, zone.room.height);
  return true;
}

// Murs d'enceinte (les quatre premiers) : l'image les contient déjà ; sans eux, le bord reste sombre.
const paintedBorderHidden = (zone, index) => paintedDecorActive(zone) && !!paintedDecor.zones[zone.id].hideBorder && index < 4;
const paintedDecorActive = zone => !!paintedDecorImage(zone);
const paintedDecorHides = (zone, wall) => paintedDecorActive(zone) && (paintedDecor.zones[zone.id].hide || []).includes(wall.kind);

// Objet peint posé sur son rectangle de collision : calé en bas, centré, il dépasse un peu vers le haut (vue en trois quarts).
function drawPaintedObject(zone, wall, x, y) {
  if (!paintedDecorActive(zone)) return false;
  const rule = (paintedDecor.zones[zone.id].objects || {})[wall.kind];
  const value = typeof rule === 'function' ? rule(wall) : rule;
  const spec = typeof value === 'string' ? { name: value } : value;
  const part = spec && spec.patch && paintedDecor.patches[spec.patch];
  const art = spec && paintedDecor.objects[spec.name || (part ? 'raccords' : '')];
  if (!art) return false;
  const w = wall.width, h = wall.height;
  const scale = spec.height ? spec.height / art.height : spec.width ? spec.width / art.width : Math.min(w / art.width, h * 1.7 / art.height);
  const dw = part ? w : art.width * scale, dh = part ? h + (spec.rise || 0) : art.height * scale;
  ctx.save();
  ctx.fillStyle = part ? '#05080e30' : '#05080e99';
  ctx.beginPath(); ctx.ellipse(x + w / 2, y + h - 3, dw * .46, Math.max(3, dw * .09), 0, 0, Math.PI * 2); ctx.fill();
  if (part) ctx.drawImage(art, ...part, x, y + h - dh, dw, dh);
  else ctx.drawImage(art, x + (w - dw) / 2, y + h - dh, dw, dh);
  ctx.restore();
  return true;
}

loadPaintedDecor();
