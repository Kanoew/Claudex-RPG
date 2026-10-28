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
  elements.game.getContext = () => new Proxy({}, { get: (_, name) => name === 'createRadialGradient' || name === 'createLinearGradient' ? () => ({ addColorStop() {} }) : name === 'createPattern' ? () => { patterns++; return {}; } : (...args) => { calls.push([name, ...args]); } });
  const document = { hidden: false, getElementById: id => elements[id], addEventListener: (name, fn) => (listeners['document:' + name] ??= []).push(fn) };
  const context = vm.createContext({
    document, window: { devicePixelRatio: 1, addEventListener: (name, fn) => (listeners['window:' + name] ??= []).push(fn) },
    Image: imageMode ? class { set src(value) { if (imageMode === 'error') this.onerror(); else this.onload(); } } : undefined,
    ResizeObserver: class { observe() {} }, requestAnimationFrame() {}
  });
  // Même ordre et portées globales que les scripts defer de la page.
  for (const file of ['enemies.js', 'dungeon.js', 'hud.js', 'zones.js', 'yarden-sprite.js', 'monster-sprite.js', 'render.js', 'game.js']) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
  const state = vm.runInContext('({ player, enemies, boss, attack, skill, dodge, keys, input, room, walls, startAttack, startDodge, update, updateEnemy, draw, hurtPlayer, resetInput, bossMarker, zones, zoneEnemies, activeEnemies, allEnemies, makeEnemy, loadZone, doorAtPlayer, enterZone, get zoneFade(){return zoneFade}, get currentZone(){return currentZone}, yardenSprite, yardenArt, yardenFrame, yardenProgressFrame, yardenPose, yardenCell, monsterPose, monsterArt, monsterClips, get stage(){return stage}, get over(){return combatOver}, get exitOpen(){return exitOpen}, get elapsed(){return elapsed} })', context);
  return Object.assign(state, { elements, document, patterns, calls, fire(name, event = {}) { for (const fn of listeners[name] || []) fn(event); } });
}
function armed(mode) {
  const g = game(mode);
  g.player.y = 144;
  g.update(.01);
  assert(g.player.armed);
  return g;
}
function bossFight(mode) {
  const g = armed(mode);
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
      assert.equal(g.patterns, mode === 'loaded' ? 4 : 0);
      const before = JSON.stringify({ player: g.player, enemies: g.enemies, walls: g.walls });
      g.draw();
      g.draw();
      assert.equal(JSON.stringify({ player: g.player, enemies: g.enemies, walls: g.walls }), before);
    }
  }],
  ['Barres lisibles et repère du Troll dès l’apparition', () => {
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
  ['Troll : apparition, annonce, mi-vie, dégâts et esquive', () => {
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
    assert(!g.over, 'La sortie du donjon mène dehors, elle ne termine plus la partie');
    assert.equal(g.currentZone.id, 'exterieur');
    // Au bout de la ruelle, côté rue, au nord de la zone extérieure : fin du prototype.
    Object.assign(g.player, { x: 0, y: -495 });
    for (let i = 0; i < 4; i++) g.update(.05);
    assert(g.over && g.stage === 'escaped');
    assert(g.elements['result-text'].textContent.includes('Fin du prototype'));
    assert(g.elements['result-details'].textContent.includes('Temps de jeu'));
    g.fire('retry:click');
    assert(!g.over && !g.exitOpen && !g.player.armed);
    assert.equal(g.currentZone.id, 'donjon', 'Recommencer ramène au donjon');
    assert.equal(g.room.width, 960);
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
  ['Joystick maintenu pendant l’apparition du Troll et après sa défaite', () => {
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
    // Les monstres dessinés avant Yarden peuvent se retourner ; elle, jamais.
    const sprite = g.calls.filter(call => call[0] === 'drawImage' && call[4] === 96 && call[5] === 104);
    assert.equal(sprite.length, 1);
    assert.deepEqual(sprite[0].slice(2, 6), [0, 0, 96, 104]);
    const afterShadow = g.calls.slice(g.calls.map(call => call[0]).lastIndexOf('ellipse'));
    assert(!afterShadow.some(call => ['scale', 'transform'].includes(call[0])), 'Aucun retournement du sprite de Yarden');
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
    assert.equal(g.calls.filter(call => call[0] === 'drawImage' && call[4] === 211 && call[5] === 148).length, 1);
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
  }],
  ['Troll : sprite de marche, annonce, coup, retournement et repli sur le disque', () => {
    const g = bossFight('loaded');
    const troll = g.boss;
    assert.equal(troll.art, 'troll');
    assert.equal(g.monsterArt.strips.troll !== undefined, true);
    // Au repos : première image de marche ; en marche : les quatre images à tour de rôle.
    troll.windup = 0; troll.charge = 0; troll.sprite.strike = 0; troll.sprite.moving = false;
    assert.equal(g.monsterPose(troll).frame, 0);
    troll.sprite.moving = true;
    const walk = [0, .14, .27, .4, .53].map(time => { troll.sprite.time = time; return g.monsterPose(troll).frame; });
    assert.deepEqual(walk, [0, 1, 2, 3, 0]);
    // Annonce : poings levés ; coup : poings au sol ; le coup est prioritaire.
    troll.windup = .5;
    assert.equal(g.monsterPose(troll).frame, 4);
    troll.sprite.strike = .2;
    assert.equal(g.monsterPose(troll).frame, 5);
    troll.windup = 0; troll.sprite.strike = 0;
    // Fin de l'annonce : la pose de coup démarre, même si Yarden est esquivée ou hors de portée.
    Object.assign(g.player, { x: troll.x + 400, y: troll.y });
    troll.windup = .01; troll.cooldown = 5;
    g.updateEnemy(troll, .02);
    assert(troll.sprite.strike > .25, 'Pose de coup après la fin de l’annonce');
    assert.equal(g.monsterPose(troll).frame, 5);
    // Regard et retournement : Yarden à droite, le sprite est retourné ; à gauche, il ne l'est pas.
    for (const [dx, flipped] of [[300, true], [-300, false]]) {
      troll.windup = 0; troll.sprite.strike = 0; troll.flash = 0;
      Object.assign(g.player, { x: troll.x + dx, y: troll.y });
      g.updateEnemy(troll, .02);
      g.calls.length = 0;
      g.draw();
      assert.equal(g.calls.some(call => call[0] === 'scale' && call[1] === -1), flipped);
      assert.equal(g.calls.filter(call => call[0] === 'drawImage').length >= 2, true);
    }
    // Collision et zone d'attaque du boss inchangées.
    assert.equal(troll.radius, 24);
    assert.equal(troll.maxHp, 8);
    // Image absente : disque violet de secours et barre de vie à sa place d'origine.
    const bare = bossFight('error');
    assert.equal(bare.monsterPose(bare.boss), null);
    bare.calls.length = 0;
    bare.draw();
    assert(bare.calls.some(call => call[0] === 'arc'));
    assert(!bare.calls.some(call => call[0] === 'scale' && call[1] === -1));
    // Noms affichés : gobelin, ogre et Troll.
    const named = armed('loaded');
    assert.equal(JSON.stringify(named.enemies.map(enemy => enemy.name)), JSON.stringify(['Gobelin', 'Ogre', 'Troll']));
  }],
  ['Gobelin et ogre : sprites, annonce, coup, charge et repli sur les formes provisoires', () => {
    const g = armed('loaded');
    const [goblin, ogre] = g.enemies;
    assert.equal(goblin.art, 'goblin');
    assert.equal(ogre.art, 'ogre');
    for (const enemy of [goblin, ogre]) {
      assert(g.monsterArt.strips[enemy.art], 'Bande chargée');
      Object.assign(enemy.sprite, { moving: false, strike: 0, time: 0 });
      enemy.windup = 0; enemy.charge = 0;
      assert.equal(g.monsterPose(enemy).frame, 0);
      enemy.sprite.moving = true;
      const step = g.monsterClips[enemy.art].walkSeconds;
      const frames = [0, 1, 2, 3, 4].map(k => { enemy.sprite.time = step * k + step / 2; return g.monsterPose(enemy).frame; });
      assert.equal(JSON.stringify(frames), JSON.stringify([0, 1, 2, 3, 0]));
      enemy.windup = .3;
      assert.equal(g.monsterPose(enemy).frame, 4, 'Pose d’annonce');
      enemy.windup = 0;
    }
    // Ogre : la pose de charge dure tant que la charge dure, puis il reprend sa marche.
    ogre.charge = .2;
    assert.equal(g.monsterPose(ogre).frame, 5);
    ogre.charge = 0;
    assert.notEqual(g.monsterPose(ogre).frame, 5);
    // Gobelin : le coup de dague s'affiche après la fin de l'annonce, qu'il touche ou non.
    Object.assign(g.player, { x: goblin.x + 300, y: goblin.y });
    goblin.windup = .01; goblin.cooldown = 5;
    g.updateEnemy(goblin, .02);
    assert(goblin.sprite.strike > .15);
    assert.equal(g.monsterPose(goblin).frame, 5);
    // Collisions, points de vie et vitesses inchangés.
    assert.equal(JSON.stringify([goblin.radius, goblin.maxHp, goblin.speed, ogre.radius, ogre.maxHp, ogre.speed]), JSON.stringify([14, 3, 95, 14, 2, 80]));
    // Gobelin, ogre et Yarden : trois images de personnage sont dessinées.
    g.calls.length = 0;
    g.draw();
    assert.equal(g.calls.filter(call => call[0] === 'drawImage').length >= 3, true);
    // Sans image : retour aux formes provisoires (disque rose, carré jaune) et aux barres de vie.
    const bare = armed('error');
    assert.equal(bare.monsterPose(bare.enemies[0]), null);
    assert.equal(bare.monsterPose(bare.enemies[1]), null);
    bare.calls.length = 0;
    bare.draw();
    assert(bare.calls.some(call => call[0] === 'arc'));
    assert(bare.calls.some(call => call[0] === 'fillRect'));
  }],
  ['Zones : le donjon est lu dans des données et se joue à l’identique', () => {
    const g = game();
    const same = (a, b) => assert.equal(JSON.stringify(a), JSON.stringify(b));
    // Mêmes dimensions, mêmes murs et mêmes blocs qu’avant la mise en données.
    same(g.room, { x: -480, y: -336, width: 960, height: 672 });
    same(g.walls, [
      { x: -504, y: -360, width: 1008, height: 24 }, { x: -504, y: 336, width: 1008, height: 24 },
      { x: -504, y: -336, width: 24, height: 672 }, { x: 480, y: -336, width: 24, height: 672 },
      { x: -192, y: -96, width: 72, height: 144 }, { x: 120, y: 48, width: 96, height: 72 }
    ]);
    assert.equal(g.currentZone.id, 'donjon');
    // Monstres : mêmes types, positions, points de vie, vitesses et rayons.
    same(g.enemies.map(e => [e.name, e.x, e.y, e.hp, e.maxHp, e.speed, e.radius, Boolean(e.charger), Boolean(e.boss)]), [
      ['Gobelin', 0, -200, 3, 3, 95, 14, false, false], ['Ogre', 220, -160, 2, 2, 80, 14, true, false], ['Troll', 0, -220, 8, 8, 65, 24, false, true]
    ]);
    assert.equal(g.enemies[2].active, false);
    assert.equal(g.boss, g.enemies[2]);
    assert.equal(g.activeEnemies(), g.enemies);
    assert.equal(g.allEnemies().length, g.enemies.length + g.zoneEnemies.exterieur.length);
    // Chargement d’une zone : les références de room et de walls restent valables.
    const room = g.room, walls = g.walls;
    g.zones.test = { id: 'test', title: 'TEST', theme: 'pierre', room: { x: -100, y: -80, width: 200, height: 160 }, blocks: [{ x: 0, y: 0, width: 20, height: 20 }], start: { x: 0, y: 0 }, doors: [], enemies: [] };
    g.loadZone('test');
    assert.equal(g.room, room);
    assert.equal(g.walls, walls);
    assert.equal(walls.length, 5);
    assert.equal(g.room.width, 200);
    assert.equal(g.currentZone.id, 'test');
    assert.equal(g.activeEnemies().length, 0, 'Une zone sans monstres n’en réveille aucun');
    g.loadZone('donjon');
    assert.equal(walls.length, 6);
    assert.equal(g.room.width, 960);
    // Porte de sortie : fermée tant que le Troll vit, puis détectée devant le mur du nord.
    const p = armed();
    Object.assign(p.player, { x: 0, y: -330 });
    assert.equal(p.doorAtPlayer(), null, 'Porte scellée tant que le Troll vit');
  }],
  ['Ruelle : données, chemin libre, passages, aucune menace et fondu', () => {
    const ext = game().zones.exterieur;
    assert.equal(ext.theme, 'ruelle');
    assert.equal(ext.enemies.length, 0, 'Pas de monstre dehors : les humains ne voient pas la faille, rien n’en sort');
    // Rien ne bouche les portes ni les points d'arrivée, et les obstacles restent dans la ruelle.
    const hits = (x, y, margin) => ext.blocks.some(b => x > b.x - margin && x < b.x + b.width + margin && y > b.y - margin && y < b.y + b.height + margin);
    assert.equal(hits(0, ext.room.y + ext.room.height - 90, 30), false);
    assert.equal(hits(0, ext.room.y + 90, 30), false);
    assert(ext.blocks.every(b => b.x >= ext.room.x && b.x + b.width <= ext.room.x + ext.room.width && b.y > ext.room.y && b.y + b.height < ext.room.y + ext.room.height));
    assert(ext.blocks.every(b => ['benne', 'caisses', 'poubelles', 'scooter'].includes(b.kind)));
    assert(ext.props.filter(p => p.kind === 'lampe').length === 3);
    assert(ext.props.length >= 60 && ext.props.filter(p => p.kind !== 'lampe').every(p => !hits(p.x, p.y, 8)));
    // Il existe un chemin de la faille à la rue pour un disque de la taille de Yarden.
    const g = game();
    g.loadZone('exterieur');
    const cell = 8, r = g.room;
    const cols = Math.ceil(r.width / cell), rows = Math.ceil(r.height / cell);
    const free = (cx, cy) => {
      const x = r.x + cx * cell, y = r.y + cy * cell;
      return !g.walls.some(w => x > w.x - 13 && x < w.x + w.width + 13 && y > w.y - 13 && y < w.y + w.height + 13);
    };
    const start = [Math.round((0 - r.x) / cell), Math.round((r.height - 90) / cell)];
    const goal = [Math.round((0 - r.x) / cell), Math.round((-495 - r.y) / cell)];
    const seen = new Set([start.join()]), queue = [start];
    let reached = false;
    while (queue.length && !reached) {
      const [cx, cy] = queue.shift();
      if (cx === goal[0] && cy === goal[1]) reached = true;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy, key = nx + ',' + ny;
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows || seen.has(key) || !free(nx, ny)) continue;
        seen.add(key); queue.push([nx, ny]);
      }
    }
    assert(reached, 'La rue est accessible depuis la faille');
    // Sortie du donjon : arrivée devant la faille, fondu, aucun monstre.
    const s = armed();
    s.enemies[0].hp = s.enemies[1].hp = 0;
    s.update(.01); s.update(1.2);
    s.boss.hp = 0;
    s.update(.01);
    assert(s.exitOpen);
    const bossBefore = JSON.stringify([s.boss.x, s.boss.y]);
    s.enterZone('exterieur', 'south');
    assert.equal(s.currentZone.id, 'exterieur');
    assert.equal(s.room.width, 400);
    assert.equal(s.walls.length, 4 + ext.blocks.length);
    assert.equal(JSON.stringify([s.player.x, s.player.y]), JSON.stringify([0, 430]));
    assert(s.zoneFade > .3);
    s.update(.5);
    assert.equal(s.zoneFade, 0);
    assert.equal(s.activeEnemies().length, 0);
    assert.equal(s.doorAtPlayer(), null, 'Arrivée à bonne distance de la porte');
    assert.equal(s.elements.opponents.textContent, 'Ruelle calme');
    assert(s.elements.objective.textContent.includes('rue'));
    // Les monstres du donjon ne bougent pas pendant que Yarden est dehors.
    for (let i = 0; i < 10; i++) s.update(.05);
    assert.equal(JSON.stringify([s.boss.x, s.boss.y]), bossBefore);
    // Retour par la faille : arrivée devant la porte nord du donjon, porte restée ouverte, monstres vaincus.
    Object.assign(s.player, { x: 0, y: 500 });
    s.update(.02);
    assert.equal(s.currentZone.id, 'donjon');
    assert.equal(JSON.stringify([s.player.x, s.player.y]), JSON.stringify([0, -246]));
    assert(s.exitOpen);
    assert.equal(s.activeEnemies().length, 3);
    assert(s.activeEnemies().every(enemy => enemy.hp === 0));
    assert.equal(s.stage, 'exit');
    // Dessin des deux zones, avec ou sans images, sans modifier le monde.
    for (const mode of ['loaded', 'error', undefined]) {
      const d = game(mode);
      for (const id of ['donjon', 'exterieur', 'donjon']) {
        d.loadZone(id);
        const before = JSON.stringify({ p: d.player, w: d.walls });
        d.draw();
        assert.equal(JSON.stringify({ p: d.player, w: d.walls }), before);
      }
    }
    // Un monstre à éveil limité reste immobile loin de Yarden, puis la poursuit définitivement (sert aux futures zones).
    const w = armed();
    const sleeper = w.makeEnemy({ kind: 'goblin', x: 0, y: -300, aggro: 320 });
    Object.assign(w.player, { x: 0, y: 100 });
    w.updateEnemy(sleeper, .5);
    assert.equal(JSON.stringify([sleeper.x, sleeper.y]), JSON.stringify([0, -300]));
    Object.assign(w.player, { x: 0, y: -100 });
    w.updateEnemy(sleeper, .5);
    assert(sleeper.engaged && sleeper.y > -300);
    Object.assign(w.player, { x: 0, y: 300 });
    const before = sleeper.y;
    w.updateEnemy(sleeper, .5);
    assert(sleeper.y !== before, 'Une fois éveillé, il continue même loin');
    // Recommencer depuis l'extérieur ramène au donjon.
    s.loadZone('exterieur');
    s.fire('retry:click');
    assert.equal(s.currentZone.id, 'donjon');
  }]
];
for (const [name, run] of tests) { run(); console.log('OK — ' + name); }
console.log(`${tests.length} scénarios logiques réussis. Le rendu Canvas est simulé ; test navigateur/Android nécessaire.`);
