'use strict';

// Vérifications logiques sans navigateur ni dépendance externe.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');

function game(imageMode) {
  const listeners = {};
  const elements = {};
  let patterns = 0;
  for (const id of ['game', 'joystick', 'stick', 'attack', 'skill', 'dodge', 'status', 'objective', 'result', 'result-text', 'result-details', 'retry', 'hp-meter', 'mana-meter', 'hp-value', 'mana-value', 'boss-panel', 'boss-meter', 'boss-state', 'boss-value', 'opponents', 'attack-hint', 'skill-hint', 'dodge-hint']) {
    elements[id] = {
      hidden: id === 'result', style: { setProperty(name, value) { this[name] = value; } }, offsetWidth: 54, textContent: '', attributes: {},
      classList: { toggle() {} }, setAttribute(name, value) { this.attributes[name] = value; }, blur() {},
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 366, height: 500 }),
      addEventListener: (name, fn) => (listeners[id + ':' + name] ??= []).push(fn),
      hasPointerCapture: () => false, setPointerCapture() {}, releasePointerCapture() {}
    };
  }
  const calls = [];
  elements.game.getContext = () => new Proxy({}, { get: (_, name) => name === 'createRadialGradient' ? () => ({ addColorStop() {} }) : name === 'createPattern' ? () => { patterns++; return {}; } : (...args) => { calls.push([name, ...args]); } });
  const document = { hidden: false, getElementById: id => elements[id], addEventListener: (name, fn) => (listeners['document:' + name] ??= []).push(fn) };
  const context = vm.createContext({
    document, window: { devicePixelRatio: 1, addEventListener: (name, fn) => (listeners['window:' + name] ??= []).push(fn) },
    Image: imageMode ? class { set src(value) { if (imageMode === 'error') this.onerror(); else this.onload(); } } : undefined,
    ResizeObserver: class { observe() {} }, requestAnimationFrame() {}
  });
  // Même ordre et portées globales que les scripts defer de la page.
  for (const file of ['enemies.js', 'dungeon.js', 'hud.js', 'yarden-sprite.js', 'render.js', 'game.js']) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
  const state = vm.runInContext('({ player, enemies, boss, attack, skill, dodge, keys, input, room, walls, startAttack, startDodge, update, updateEnemy, draw, hurtPlayer, resetInput, bossMarker, yardenSprite, yardenArt, yardenFrame, yardenProgressFrame, yardenPose, yardenCell, get stage(){return stage}, get over(){return combatOver}, get exitOpen(){return exitOpen}, get elapsed(){return elapsed} })', context);
  return Object.assign(state, { elements, document, patterns, calls, fire(name, event = {}) { for (const fn of listeners[name] || []) fn(event); } });
}
function armed(mode) {
  const g = game(mode);
  g.player.y = 144;
  g.update(.01);
  assert(g.player.armed);
  return g;
}
function bossFight() {
  const g = armed();
  g.enemies[0].hp = 0;
  g.enemies[1].hp = 0;
  g.update(.01);
  assert.equal(g.stage, 'boss');
  g.update(1.2);
  return g;
}
function solid(g, body) {
  for (const wall of g.walls) {
    const dx = Math.max(wall.x - body.x, 0, body.x - wall.x - wall.width);
    const dy = Math.max(wall.y - body.y, 0, body.y - wall.y - wall.height);
    assert(dx * dx + dy * dy >= body.radius ** 2 - 1e-6, 'Traversée d’un obstacle');
  }
}
const tests = [
  ['Décor avec textures ou secours, sans modification du monde', () => {
    for (const mode of ['loaded', 'error', undefined]) {
      const g = game(mode);
      assert.equal(g.patterns, mode === 'loaded' ? 2 : 0);
      const before = JSON.stringify({ player: g.player, enemies: g.enemies, walls: g.walls });
      g.draw();
      g.draw();
      assert.equal(JSON.stringify({ player: g.player, enemies: g.enemies, walls: g.walls }), before);
    }
  }],
  ['Barres lisibles et repère du Gardien dès l’apparition', () => {
    const g = armed();
    g.hurtPlayer();
    assert.equal(g.elements['hp-value'].textContent, '4 / 5');
    assert.equal(g.elements['hp-meter'].attributes['aria-valuenow'], '4');
    assert.equal(g.elements['hp-meter'].style['--fill'], '80%');
    g.startAttack(true);
    assert.equal(g.elements['mana-value'].textContent, '18 / 30');
    const b = bossFight();
    assert.equal(b.elements['boss-panel'].hidden, false);
    assert.equal(b.elements['boss-value'].textContent, '8 / 8');
    const marker = b.bossMarker(-1000, -1000);
    assert(marker && marker.x >= 0 && marker.y >= 0);
    assert.equal(b.bossMarker(180 - b.boss.x, 200 - b.boss.y), null);
    b.boss.hp = 0;
    b.update(.01);
    assert.equal(b.elements['boss-panel'].hidden, true);
  }],
  ['Entrée sûre et prise gratuite de la faux', () => {
    const g = game();
    g.startAttack(true);
    g.update(.05);
    assert.equal(g.player.mana, 30);
    assert.equal(g.enemies[0].y, -200);
    assert.equal(g.attack.remaining, 0);
    g.keys.add('w');
    for (let i = 0; i < 8; i++) g.update(.05);
    assert(g.player.armed);
    assert.equal(g.stage, 'guards');
    assert.equal(g.player.mana, 30);
  }],
  ['Fauchage : coût, deux cibles, un seul impact et récupération', () => {
    const g = armed();
    Object.assign(g.enemies[0], { x: -15, y: g.player.y - 50, speed: 0 });
    Object.assign(g.enemies[1], { x: 15, y: g.player.y - 50, speed: 0 });
    g.startAttack(true);
    assert.equal(g.player.mana, 18);
    g.update(.01);
    assert.equal(g.enemies[0].hp, 1);
    assert.equal(g.enemies[1].hp, 0);
    for (let i = 0; i < 15; i++) g.update(.01);
    assert.equal(g.enemies[0].hp, 1);
    const mana = g.player.mana;
    g.startAttack(true);
    assert.equal(g.player.mana, mana);
    g.attack.cooldown = 0;
    g.skill.cooldown = 0;
    g.player.mana = 11.99;
    g.startAttack(true);
    assert.equal(g.player.mana, 11.99);
  }],
  ['Esquive, invulnérabilité, murs et commandes à deux doigts', () => {
    const g = armed();
    g.player.x = 460;
    g.keys.add('d');
    g.startDodge();
    g.hurtPlayer(2);
    assert.equal(g.player.hp, 5);
    for (let i = 0; i < 4; i++) g.update(.05);
    assert.equal(g.player.x, 467);
    solid(g, g.player);
    g.resetInput();
    g.dodge.cooldown = 0;
    g.fire('joystick:pointerdown', { pointerId: 1, pointerType: 'touch', clientX: 250, clientY: 250, preventDefault() {} });
    g.fire('dodge:pointerdown', { pointerId: 2, pointerType: 'touch', isPrimary: false, preventDefault() {} });
    assert.equal(g.input.pointerId, 1);
    assert(g.dodge.remaining > 0);
  }],
  ['Charge : collision continue, un dégât et dégagement après un choc', () => {
    const g = armed(), e = g.enemies[1];
    Object.assign(g.player, { x: 0, y: 0 });
    Object.assign(e, { x: 0, y: -60, dirX: 0, dirY: 1, charge: .32 });
    g.updateEnemy(e, .2);
    g.updateEnemy(e, .1);
    assert.equal(g.player.hp, 4);
    Object.assign(e, { x: 460, y: 0, dirX: 1, dirY: 0, charge: .32 });
    g.updateEnemy(e, .05);
    assert.equal(e.charge, 0);
    for (let i = 0; i < 1200; i++) { g.updateEnemy(e, .016); solid(g, e); }
    assert(Math.hypot(e.x, e.y) < 160);
  }],
  ['Gardien : apparition, annonce, mi-vie, dégâts et esquive', () => {
    const g = bossFight();
    assert(g.boss.active);
    Object.assign(g.boss, { x: 0, y: g.player.y - 80 });
    g.updateEnemy(g.boss, .01);
    assert.equal(g.boss.windup, .8);
    g.updateEnemy(g.boss, .8);
    assert.equal(g.player.hp, 3);
    g.boss.hp = 4;
    g.boss.cooldown = 0;
    g.updateEnemy(g.boss, .01);
    assert.equal(g.boss.windup, .6);
    g.startDodge();
    g.updateEnemy(g.boss, .6);
    assert.equal(g.player.hp, 3);
  }],
  ['Porte scellée, ouverture, victoire et redémarrage complet', () => {
    const g = armed();
    Object.assign(g.player, { x: 0, y: -320 });
    g.update(.01);
    assert(!g.exitOpen && !g.over);
    Object.assign(g.player, { x: 0, y: 0 });
    g.enemies[0].hp = g.enemies[1].hp = 0;
    g.update(.01);
    g.update(1.2);
    g.boss.hp = 0;
    g.update(.01);
    assert(g.exitOpen && !g.over);
    g.player.y = -280;
    g.keys.add('w');
    for (let i = 0; i < 4; i++) g.update(.05);
    assert(g.over && g.stage === 'escaped');
    assert(g.elements['result-details'].textContent.includes('Temps de jeu'));
    g.fire('retry:click');
    assert(!g.over && !g.exitOpen && !g.player.armed);
    assert.equal(g.player.y, 240);
    assert.equal(g.player.mana, 30);
    assert.equal(g.elapsed, 0);
    assert.equal(g.attack.hits.size, 0);
    assert(!g.boss.active);
  }],
  ['Défaite, pause et arrêt du chronomètre hors du jeu', () => {
    const g = armed();
    const elapsed = g.elapsed;
    const y = g.enemies[0].y;
    g.fire('window:blur');
    g.update(1);
    g.startDodge();
    assert.equal(g.elapsed, elapsed);
    assert.equal(g.enemies[0].y, y);
    assert.equal(g.dodge.remaining, 0);
    g.fire('window:focus');
    g.update(.05);
    assert(g.elapsed > elapsed);
    g.hurtPlayer(5);
    assert(g.over && g.player.hp === 0);
    const frozen = g.elapsed;
    g.update(1);
    assert.equal(g.elapsed, frozen);
    g.fire('retry:click');
    assert.equal(g.player.hp, 5);
    g.draw();
  }],
  ['Joystick maintenu pendant l’apparition du Gardien et après sa défaite', () => {
    const g = armed();
    const touch = { pointerId: 1, pointerType: 'touch', clientX: 300, clientY: 66, preventDefault() {} };
    g.fire('joystick:pointerdown', touch);
    g.enemies[0].hp = 0;
    g.enemies[1].hp = 0;
    g.update(.01);
    assert.equal(g.stage, 'boss');
    assert.equal(g.input.pointerId, 1);
    const bossX = g.boss.x, bossY = g.boss.y, hp = g.player.hp, before = g.player.x;
    g.update(.3);
    assert(g.player.x > before, 'Yarden doit pouvoir bouger pendant l’apparition');
    assert.deepEqual([g.boss.x, g.boss.y, g.player.hp], [bossX, bossY, hp]);
    g.update(1);
    const x = g.player.x;
    g.update(.1);
    assert(g.player.x > x, 'Le pouce posé doit continuer à déplacer Yarden');
    g.boss.hp = 0;
    g.update(.01);
    assert.equal(g.stage, 'exit');
    assert.equal(g.input.pointerId, 1);
  }],
  ['Sprite de Yarden : course, marche verticale, dessin sans retournement et disque de secours', () => {
    // Durées du manifeste : repos de 6 images, courses de 8 images.
    const g = game('loaded');
    assert.equal(g.yardenFrame('idle', 0), 0);
    assert.equal(g.yardenFrame('idle', .29), 1);
    assert.equal(g.yardenFrame('idle', 1.1), 0);
    assert.equal(g.yardenFrame('running-left', .84), 7);
    assert.equal(g.yardenFrame('walk-down', .89), 0);
    // Toutes les bandes chargées : une seule image dessinée, sans retournement, collisions inchangées.
    assert(Object.keys(g.yardenArt.strips).length === 11 && Object.values(g.yardenArt.strips).every(Boolean));
    const hitbox = JSON.stringify([g.player.x, g.player.y, g.player.radius]);
    g.calls.length = 0;
    g.draw();
    const sprite = g.calls.filter(call => call[0] === 'drawImage');
    assert.equal(sprite.length, 1);
    assert.deepEqual(sprite[0].slice(2, 6), [0, 0, 96, 104]);
    assert(!g.calls.some(call => ['scale', 'transform'].includes(call[0])), 'Aucun retournement du sprite');
    assert.equal(JSON.stringify([g.player.x, g.player.y, g.player.radius]), hitbox);
    // Côté de course, marche verticale, puis retour à la course latérale.
    const g2 = armed('loaded');
    const clip = () => g2.yardenPose().clip;
    g2.keys.add('d'); g2.update(.05);
    assert.equal(clip(), 'running-right');
    g2.keys.delete('d'); g2.keys.add('a'); g2.update(.05);
    assert.equal(clip(), 'running-left');
    g2.keys.delete('a'); g2.keys.add('w'); g2.update(.05);
    assert.equal(clip(), 'walk-up');
    g2.keys.delete('w'); g2.keys.add('s'); g2.update(.05);
    assert.equal(clip(), 'walk-down');
    g2.keys.add('d'); g2.update(.05);
    assert.equal(clip(), 'walk-down', 'La diagonale franche ne fait pas osciller le sprite');
    g2.keys.delete('s'); g2.update(.05);
    assert.equal(clip(), 'running-right');
    g2.keys.delete('d'); g2.update(.05);
    assert.equal(clip(), 'idle');
    // Temps figé en pause.
    const time = g2.yardenSprite.time;
    g2.fire('window:blur');
    g2.update(1);
    assert.equal(g2.yardenSprite.time, time);
    // Images absentes : disque de secours, aucune image, faux provisoire dessinée pendant le coup.
    for (const mode of ['error', undefined]) {
      const bare = armed(mode);
      bare.startAttack();
      bare.calls.length = 0;
      bare.draw();
      assert(!bare.calls.some(call => call[0] === 'drawImage'));
      assert(bare.calls.some(call => call[0] === 'arc'));
      assert(bare.calls.some(call => call[0] === 'quadraticCurveTo'), 'Faux provisoire sans sprite');
    }
  }],
  ['Sprite de Yarden : faux, esquive, dégâts et défaite calés sur le jeu', () => {
    // Faux vers la droite : images 0 à 5 sur la durée du coup, impact aux images 3 et 4.
    const g = armed('loaded');
    g.startAttack();
    assert.deepEqual([g.yardenPose().clip, g.yardenPose().frame], ['scythe-right', 0]);
    g.update(.11);
    assert.deepEqual([g.yardenPose().clip, g.yardenPose().frame], ['scythe-right', 3]);
    g.update(.12);
    assert.notEqual(g.yardenPose().clip, 'scythe-right');
    g.calls.length = 0;
    g.startAttack(true);
    assert.equal(g.attack.remaining, 0, 'Pas de second coup pendant la récupération');
    g.update(.5);
    g.keys.add('a'); g.update(.05); g.keys.delete('a');
    g.startAttack(true);
    assert.equal(g.yardenPose().clip, 'scythe-left');
    g.calls.length = 0;
    g.draw();
    assert(!g.calls.some(call => call[0] === 'quadraticCurveTo'), 'La faux dessinée par le jeu disparaît quand le sprite la porte');
    assert.equal(g.calls.filter(call => call[0] === 'drawImage').length, 1);
    // Esquive vers la gauche.
    const d = armed('loaded');
    d.keys.add('a');
    d.startDodge();
    assert.equal(d.yardenPose().clip, 'dash-left');
    d.update(.1);
    assert.equal(d.yardenPose().frame, 3);
    // Dégâts : réaction courte, sans effet sur la logique de combat.
    const h = armed('loaded');
    h.hurtPlayer();
    assert.deepEqual([h.yardenPose().clip, h.yardenPose().frame], ['hurt', 0]);
    assert.equal(h.player.hp, 4);
    h.update(.31);
    assert.equal(h.yardenPose().clip, 'idle');
    // Défaite : elle tombe, reste au sol, puis le message apparaît.
    const f = armed('loaded');
    f.hurtPlayer(5);
    assert(f.over);
    assert.equal(f.elements.result.hidden, true);
    assert.deepEqual([f.yardenPose().clip, f.yardenPose().frame], ['defeat', 0]);
    const elapsed = f.elapsed;
    f.update(.5);
    assert.equal(f.yardenPose().clip, 'defeat');
    assert(f.yardenPose().frame > 0 && f.yardenPose().frame < 5);
    assert.equal(f.elements.result.hidden, true);
    f.update(.6);
    assert.equal(f.yardenPose().frame, 5);
    assert.equal(f.player.flash, 0, 'Le flash blanc ne reste pas collé sur Yarden à terre');
    assert.equal(f.elements.result.hidden, false);
    assert.equal(f.elapsed, elapsed, 'Le chronomètre reste figé pendant la chute');
    f.fire('retry:click');
    assert.equal(f.elements.result.hidden, true);
    assert.equal(f.yardenPose().clip, 'idle');
    // Une bande absente retombe sur une pose existante, la défaite sur le disque.
    const m = armed('loaded');
    m.yardenArt.strips['scythe-right'] = null;
    m.startAttack();
    assert.equal(m.yardenPose().clip, 'idle');
    m.yardenArt.strips.defeat = null;
    m.hurtPlayer(5);
    assert.equal(m.yardenPose().clip, 'idle');
    m.draw();
  }]
];
for (const [name, run] of tests) { run(); console.log('OK — ' + name); }
console.log(`${tests.length} scénarios logiques réussis. Le rendu Canvas est simulé ; test navigateur/Android nécessaire.`);
