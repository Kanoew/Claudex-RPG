'use strict';

// Vérifications logiques sans navigateur ni dépendance externe.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');

function game() {
  const listeners = {};
  const elements = {};
  for (const id of ['game', 'joystick', 'stick', 'attack', 'skill', 'dodge', 'status', 'objective', 'result', 'result-text', 'result-details', 'retry']) {
    elements[id] = {
      hidden: id === 'result', style: {}, offsetWidth: 54, textContent: '',
      classList: { toggle() {} }, setAttribute() {}, blur() {},
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 366, height: 500 }),
      addEventListener: (name, fn) => (listeners[id + ':' + name] ??= []).push(fn),
      hasPointerCapture: () => false, setPointerCapture() {}, releasePointerCapture() {}
    };
  }
  elements.game.getContext = () => new Proxy({}, { get: () => () => {} });
  const document = { hidden: false, getElementById: id => elements[id], addEventListener: (name, fn) => (listeners['document:' + name] ??= []).push(fn) };
  const context = vm.createContext({
    document, window: { devicePixelRatio: 1, addEventListener: (name, fn) => (listeners['window:' + name] ??= []).push(fn) },
    ResizeObserver: class { observe() {} }, requestAnimationFrame() {}
  });
  // Même ordre et portées globales que les scripts defer de la page.
  for (const file of ['enemies.js', 'dungeon.js', 'game.js']) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
  const state = vm.runInContext('({ player, enemies, boss, attack, skill, dodge, keys, input, room, walls, startAttack, startDodge, update, updateEnemy, draw, hurtPlayer, resetInput, get stage(){return stage}, get over(){return combatOver}, get exitOpen(){return exitOpen}, get elapsed(){return elapsed} })', context);
  return Object.assign(state, { elements, document, fire(name, event = {}) { for (const fn of listeners[name] || []) fn(event); } });
}
function armed() {
  const g = game();
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
    g.update(1.2);
    const x = g.player.x;
    g.update(.1);
    assert(g.player.x > x, 'Le pouce posé doit continuer à déplacer Yarden');
    g.boss.hp = 0;
    g.update(.01);
    assert.equal(g.stage, 'exit');
    assert.equal(g.input.pointerId, 1);
  }]
];
for (const [name, run] of tests) { run(); console.log('OK — ' + name); }
console.log(`${tests.length} scénarios logiques réussis. Le rendu Canvas est simulé ; test navigateur/Android nécessaire.`);
