'use strict';

// Vérifications logiques sans navigateur ni dépendance externe.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');

function game(imageMode, keepOpening, store) {
  const audioLog = { contexts: 0, started: 0, timers: [] };
  const listeners = {};
  const elements = {};
  let patterns = 0;
  for (const id of ['game', 'joystick', 'stick', 'attack', 'skill', 'dodge', 'status', 'objective', 'result', 'result-text', 'result-details', 'retry', 'hp-meter', 'mana-meter', 'hp-value', 'mana-value', 'boss-panel', 'boss-meter', 'boss-state', 'boss-value', 'opponents', 'attack-hint', 'skill-hint', 'dodge-hint', 'interact', 'story-panel', 'story-text', 'story-card', 'story-portrait', 'story-name', 'story-next', 'app', 'pause-button', 'menu-panel', 'menu-title', 'menu-note', 'menu-continue', 'menu-new', 'menu-resume', 'menu-restart', 'menu-music', 'menu-effects', 'menu-music-volume', 'menu-effects-volume', 'menu-settings', 'menu-back', 'menu-main', 'menu-settings-view', 'menu-vignette', 'level-chip', 'menu-stats', 'stats-panel', 'stats-body', 'stats-close', 'menu-free', 'map-panel', 'map-list', 'map-close', 'map-button', 'free-button', 'bag-panel', 'bag-body', 'bag-close', 'bag-button', 'credit-chip', 'loot-toast']) {
    elements[id] = {
      hidden: id === 'result', style: { setProperty(name, value) { this[name] = value; } }, offsetWidth: 54, textContent: '', attributes: {},
      classList: { toggle() {}, add() {}, remove() {} }, setAttribute(name, value) { this.attributes[name] = value; }, blur() {}, focus() {},
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
    ResizeObserver: class { observe() {} }, requestAnimationFrame() {}, setInterval: fn => { audioLog.timers.push(fn); return 1; },
    AudioContext: class {
      constructor() { this.currentTime = 0; this.state = 'running'; this.destination = {}; audioLog.contexts++; }
      createGain() { const param = () => ({ value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} }); return { gain: param(), connect() {} }; }
      createOscillator() { const f = { value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} }; return { type: '', frequency: f, connect() {}, start() { audioLog.started++; }, stop() {} }; }
      createBiquadFilter() { const f = { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} }; return { type: '', Q: { value: 0 }, frequency: f, connect() {} }; }
      createBufferSource() { return { connect() {}, start() { audioLog.started++; }, stop() {}, loop: false }; }
      createBuffer(channels, length) { return { getChannelData: () => new Float32Array(length) }; }
      resume() { this.state = 'running'; } suspend() { this.state = 'suspended'; }
    },
    localStorage: store || { data: {}, getItem(k) { return k in this.data ? this.data[k] : null; }, setItem(k, v) { this.data[k] = String(v); }, removeItem(k) { delete this.data[k]; } }
  });
  // Même ordre et portées globales que les scripts defer de la page.
  for (const file of ['enemies.js', 'dungeon.js', 'hud.js', 'zones.js', 'state.js', 'yarden-sprite.js', 'monster-sprite.js', 'encounter.js', 'scene.js', 'chapitre2b.js', 'chapitre3.js', 'dialogue.js', 'metro.js', 'night.js', 'mirror.js', 'apartment.js', 'levelup.js', 'stats.js', 'bag.js', 'libre.js', 'save.js', 'audio.js', 'opening.js', 'render-antre.js', 'weapon-art.js', 'render-ch2b.js', 'render-quartier.js', 'render-appart.js', 'render.js', 'combat.js', 'input.js', 'movement.js', 'menu.js', 'game.js']) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
  vm.runInContext(keepOpening === 'title' ? '0' : keepOpening ? 'closeMenu(); startOpening()' : 'closeMenu(); skipOpening()', context);
  const state = vm.runInContext('({ player, enemies, boss, attack, skill, dodge, keys, input, room, walls, startAttack, startDodge, update, updateEnemy, draw, hurtPlayer, resetInput, bossMarker, zones, zoneEnemies, activeEnemies, allEnemies, makeEnemy, loadZone, doorAtPlayer, enterZone, encounter, story, advanceStory, useCrystal, hitSpider, tickVenom, segmentTouchesPlayer, canUseCrystal, doorIsOpen, get zoneFade(){return zoneFade}, get currentZone(){return currentZone}, mirrorStep, mirrorScript, mirrorArt, audio, unlockAudio, playSfx, scheduleMusic, setMusic, setEffects, setMusicVolume, setEffectsVolume, musicLabel, effectsLabel, syncMusic, home, nearSpot, useInteract, canInteract, apartmentSpots, enterApartment, stats, yardenStats, openStats, closeStats, statsText, statsRows, statsHtml, drawMenuVignette, menu, openMenu, closeMenu, menuContinue, menuNewGame, readSave, applyCheckpoint, saveCheckpoint, clearSave, scene, sceneActors, nightScript, levelUp, startOpening, skipOpening, restoreAfterCombat, startScene, get credits(){return credits}, freeMode, freeSpots, startFreeMode, updateFree, failleRemaining, freeReturn, openMap, closeMap, finishCombat, freeUnlocked, get combatOverFlag(){return combatOver}, get debt(){return debt}, get identityName(){return identityName}, quatrebScript, bag, scytheSealed, get scytheFreed(){return scytheFreed}, get isharaOutfit(){return isharaOutfit}, chapter2b, impasseScript, runEndScript, followIshara, ch2b, zones, get abyssReached(){return abyssReached}, get riftShown(){return riftShown}, sceneArt, loadSceneArt, sceneActorPose, resetScene, parseStoryLine, weaponArt, drawAttackArc, drawWeaponPickup, sceneActor, loadWeaponArt, loadPortraits, portraitArt, antreResonanceLevel, antreShake, yardenSprite, yardenArt, yardenFrame, yardenProgressFrame, yardenPose, yardenCell, monsterPose, monsterArt, monsterClips, get stage(){return stage}, get over(){return combatOver}, get exitOpen(){return exitOpen}, get elapsed(){return elapsed} })', context);
  return Object.assign(state, { audioLog, elements, document, patterns, calls, fire(name, event = {}) { for (const fn of listeners[name] || []) fn(event); } });
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
function beginSpider(g) {
  g.keys.clear();
  g.enterZone('antre', 'south');
  g.player.y = 190;
  g.update(.01);
  assert(g.story.active);
  g.advanceStory();
  g.advanceStory();
  assert.equal(g.encounter.phase, 'combat');
  return g;
}
function winSpider(g) {
  beginSpider(g);
  const crystal = g.zones.antre.crystal;
  Object.assign(g.player, crystal);
  g.useCrystal();
  assert.equal(g.encounter.phase, 'blinded');
  const spider = g.zoneEnemies.antre[0];
  Object.assign(g.player, { x: spider.x - 60, y: spider.y });
  g.keys.add('d'); g.update(.01); g.keys.clear();
  g.player.mana = g.player.maxMana;
  g.startAttack(true);
  g.update(.01);
  assert.equal(g.encounter.phase, 'falling');
  g.update(1.3);
  assert(g.story.active);
  g.advanceStory(); g.advanceStory();
  assert.equal(g.currentZone.id, 'exterieur');
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
    assert.equal(g.elements['mana-value'].textContent, '10 / 30');
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
  ['Faux gratuite : frappe à zéro mana, dégâts uniques et récupération conservés', () => {
    const g = game();
    g.player.mana = 0;
    g.player.y = 144;
    g.update(0);
    assert(g.player.armed && g.player.mana === 0, 'L’invocation reste gratuite à zéro mana');
    assert.equal(g.elements.attack.attributes['aria-disabled'], 'false');
    assert.equal(g.elements['attack-hint'].textContent, 'Espace');
    Object.assign(g.enemies[0], { x: 0, y: g.player.y - 50, speed: 0 });
    g.startAttack();
    assert(g.attack.remaining > 0);
    assert.equal(g.player.mana, 0);
    g.update(0);
    assert.equal(g.enemies[0].hp, 2);
    g.update(0);
    assert.equal(g.enemies[0].hp, 2, 'Un seul dégât par coup');
    g.attack.remaining = 0;
    g.startAttack();
    assert.equal(g.attack.remaining, 0, 'La récupération du coup reste obligatoire');
    g.attack.cooldown = 0;
    g.startAttack(true);
    assert.equal(g.attack.remaining, 0, 'Fauchage reste payant');
    g.player.mana = 20;
    g.startAttack(true);
    assert(g.attack.remaining > 0 && g.player.mana === 0);
  }],
  ['Fauchage : coût, deux cibles, un seul impact et récupération', () => {
    const g = armed();
    Object.assign(g.enemies[0], { x: -15, y: g.player.y - 50, speed: 0 });
    Object.assign(g.enemies[1], { x: 15, y: g.player.y - 50, speed: 0 });
    g.startAttack(true);
    assert.equal(g.player.mana, 10);
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
    assert(!g.over, 'La sortie du donjon mène à la deuxième salle');
    assert.equal(g.currentZone.id, 'antre');
    winSpider(g);
    // Dans la ruelle, la faux ne répond plus : elle se réveille avec les tatouages.
    assert(g.scytheSealed(), 'Faux scellée après le premier donjon');
    g.startAttack(false);
    assert.equal(g.attack.remaining, 0, 'Aucun coup tant que la faux est scellée');
    assert.equal(g.isharaOutfit, 'soiree');
    // Yarden remonte la ruelle : la scène du chapitre 2 se joue, puis c'est la fin du prototype.
    Object.assign(g.player, { x: 0, y: -45 });
    g.update(.05);
    for (let guard = 0; guard < 20000 && !(g.currentZone.id === 'appartement' && !g.scene.active); guard++) {
      if (g.story.active) g.advanceStory(); else if (g.stats.open) g.closeStats(); else { if (g.scene.free && g.currentZone.id === 'quartier') Object.assign(g.player, { x: 0, y: -50 }); g.update(.05); }
    }
    assert.equal(g.currentZone.id, 'appartement');
    // Chez Ishara : le miroir et le soutien-gorge, la première nuit sur le parquet (agents divins, tatouages), puis le matin.
    const pump = until => { for (let guard = 0; guard < 800 && !until(); guard++) { if (g.story.active) g.advanceStory(); else g.update(.05); } };
    Object.assign(g.player, { x: 290, y: 28 });
    g.useInteract();
    pump(() => g.home.stage === 'nuit' && !g.scene.active && !g.story.active);
    assert.equal(g.home.stage, 'nuit');
    Object.assign(g.player, { x: -170, y: 90 });
    g.useInteract();
    // Le lendemain matin : impasse, run (sept gobelins), comptoir (280 crédits), 4B.
    const seen = new Set();
    let maxBag = 0;
    for (let guard = 0; guard < 6000 && !g.over; guard++) {
      seen.add(g.currentZone.id);
      maxBag = Math.max(maxBag, g.bag.length);
      if (g.story.active) { g.advanceStory(); continue; }
      if (g.scene.free) {
        if (g.currentZone.id === 'impasse') Object.assign(g.player, { x: 41, y: -150 });
        else if (g.currentZone.id === 'escalier') Object.assign(g.player, { x: 0, y: g.player.y - 40 });
        else if (g.currentZone.id === 'quartier') Object.assign(g.player, { x: 0, y: -50 });
      }
      if (g.currentZone.id === 'run' && !g.scene.active) for (const enemy of g.zoneEnemies.run) enemy.hp = 0;
      g.update(.05);
    }
    for (const zone of ['impasse', 'run', 'marterey', 'comptoir', 'sousgare', 'cour', 'escalier']) assert(seen.has(zone), zone);
    assert.equal(g.credits, 0, 'Acompte de 280 versé à Félix');
    assert.equal(g.debt, 520);
    assert.equal(g.identityName, 'Yarden Weiss');
    assert(seen.has('quatreb'));
    assert(g.scytheFreed && !g.scytheSealed(), 'Faux libérée par les tatouages');
    assert.equal(maxBag, 6, 'Quatre fragments et deux bourses dans le sac');
    assert.equal(g.bag.length, 0, 'Butin vendu chez Rémi');
    assert.equal(g.isharaOutfit, 'course', 'Ishara garde sa tenue de course');
    assert(g.over && g.stage === 'escaped');
    assert(!g.elements['free-button'].hidden, 'Mode libre proposé à la fin du prototype');
    assert(g.freeUnlocked !== undefined);
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
    assert(Object.keys(g.yardenArt.strips).length === 12 && Object.values(g.yardenArt.strips).every(Boolean));
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
    assert.equal(g.allEnemies().length, Object.values(g.zoneEnemies).reduce((sum, list) => sum + list.length, 0));
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
    assert(ext.props.filter(p => p.kind === 'lampe').length === 2);
    assert(ext.props.some(p => p.kind === 'lampe-eteinte') && ext.props.some(p => p.kind === 'grille'));
    assert(ext.props.length >= 60 && ext.props.filter(p => p.kind !== 'lampe' && p.kind !== 'grille').every(p => !hits(p.x, p.y, 8)));
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
    // La faille de la ruelle ramène au point de départ du donjon (c'est aussi l'aspiration du chapitre 1) ; monstres vaincus.
    Object.assign(s.player, { x: 0, y: 500 });
    s.update(.02);
    assert.equal(s.currentZone.id, 'donjon');
    assert.equal(JSON.stringify([s.player.x, s.player.y]), JSON.stringify([0, 240]));
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
  }],
  ['Antre : récit en pause, entrée verrouillée pendant le combat, carapace et ruse', () => {
    const g = armed('loaded');
    g.enterZone('antre', 'south');
    assert.equal(g.currentZone.theme, 'cristal');
    const spider = g.zoneEnemies.antre[0];
    assert.equal(g.activeEnemies().length, 1);
    assert(g.doorIsOpen(g.currentZone.doors[0]));
    g.player.y = 190; g.update(.01);
    assert(g.story.active && g.encounter.phase === 'intro');
    const elapsed = g.elapsed, mana = g.player.mana;
    g.update(2); g.startAttack(); g.startDodge();
    assert.equal(g.elapsed, elapsed, 'Pas de temps de combat pendant un dialogue');
    assert.equal(g.player.mana, mana);
    assert.equal(g.dodge.remaining, 0);
    g.advanceStory(); g.advanceStory();
    assert(!g.story.active && g.encounter.phase === 'combat');
    assert(!g.doorIsOpen(g.currentZone.doors[0]));
    g.hitSpider(true);
    assert.equal(spider.hp, spider.maxHp, 'Fauchage seul ne perce pas la carapace');
    const crystal = g.zones.antre.crystal;
    assert(!g.canUseCrystal(), 'Le cristal exige de s’approcher');
    Object.assign(g.player, crystal);
    g.fire('window:blur'); g.useCrystal();
    assert.equal(g.encounter.phase, 'combat', 'Pas de ruse en pause');
    g.fire('window:focus'); g.useCrystal();
    assert.equal(g.encounter.phase, 'blinded');
    assert.equal(g.monsterPose(spider).frame, 7);
    const blind = g.encounter.blind;
    g.fire('window:blur'); g.update(10);
    assert.equal(g.encounter.blind, blind);
    g.fire('window:focus'); g.update(5.1);
    assert.equal(g.encounter.phase, 'combat', 'L’ouverture expire sans coup final');
    assert(g.canUseCrystal(), 'La ruse peut être retentée');
  }],
  ['Araignée : venin annoncé, collision continue, murs, esquive et territoire', () => {
    const g = beginSpider(armed('loaded'));
    const spider = g.zoneEnemies.antre[0];
    Object.assign(g.player, { x: 0, y: 120 });
    g.updateEnemy(spider, .01);
    assert.equal(spider.windup, .9);
    g.updateEnemy(spider, .86);
    g.updateEnemy(spider, .05);
    assert.equal(g.encounter.projectiles.length, 1);
    assert.equal(g.monsterPose(spider).frame, 5);
    Object.assign(g.player, { x: 0, y: 100 });
    g.encounter.projectiles = [{ x: 0, y: -100, dx: 0, dy: 1, life: 3 }];
    const hp = g.player.hp;
    g.tickVenom(.5);
    assert.equal(g.player.hp, hp - 1, 'Le trajet complet touche, même sur une image lente');
    assert.equal(g.encounter.slow, 3);
    assert.equal(g.encounter.projectiles.length, 0);
    g.dodge.remaining = .2;
    g.encounter.projectiles = [{ x: 0, y: 50, dx: 0, dy: 1, life: 3 }];
    g.tickVenom(.2);
    assert.equal(g.player.hp, hp - 1, 'L’esquive protège du venin');
    g.dodge.remaining = 0;
    Object.assign(g.player, { x: -180, y: -140 });
    g.encounter.projectiles = [{ x: -400, y: -140, dx: 1, dy: 0, life: 3 }];
    g.tickVenom(.5);
    assert.equal(g.encounter.projectiles.length, 0);
    assert.equal(g.player.hp, hp - 1, 'Le pilier intercepte le fil');
    Object.assign(g.player, { x: 450, y: 300 });
    for (let i = 0; i < 100; i++) { g.updateEnemy(spider, .05); solid(g, spider); }
    const area = g.currentZone.territory;
    assert(spider.x <= area.x + area.width - spider.radius);
    assert(spider.y <= area.y + area.height - spider.radius);
    for (const mode of ['loaded', 'error', undefined]) {
      const fallback = beginSpider(armed(mode));
      fallback.draw();
    }
  }],
  ['Araignée : incapacitation vivante et réveil dans la ruelle', () => {
    const g = armed('loaded');
    winSpider(g);
    const spider = g.zoneEnemies.antre[0];
    assert(spider.incapacitated && spider.hp === 1);
    assert.equal(g.monsterPose(spider).frame, 8);
    assert(g.encounter.complete && !g.over);
    assert(!g.yardenSprite.defeated);
    assert.equal(g.activeEnemies().length, 0);
    assert(!g.currentZone.npcs, 'Plus de passants provisoires');
    Object.assign(g.player, { x: 0, y: 500 });
    assert.equal(g.doorAtPlayer(), null, 'La faille se ferme après le réveil');
    g.draw();
    assert(!g.scene.active && !g.scene.done);
  }],
  ['Scène de la rue : déclenchement, déroulé canon, fin du prototype', () => {
    const g = armed('loaded');
    winSpider(g);
    g.loadSceneArt();
    g.keys.clear();
    Object.assign(g.player, { x: 0, y: 300 });
    g.update(.05);
    assert(!g.scene.active, 'La scène attend que Yarden remonte la ruelle');
    g.player.y = -45;
    g.update(.05);
    assert(g.scene.active);
    const said = [];
    let metroSeen = false;
    for (let guard = 0; guard < 20000 && !(g.currentZone.id === 'appartement' && !g.scene.active); guard++) {
      if (g.story.active) { said.push(g.story.current); if (g.scene.metro) { metroSeen = true; g.draw(); } g.advanceStory(); continue; }
      if (g.stats.open) { g.closeStats(); continue; }
      if (g.scene.free && g.currentZone.id === 'quartier') Object.assign(g.player, { x: 0, y: -50 });
      g.update(.05);
      if (g.scene.metro) metroSeen = true;
      if (guard % 40 === 0) g.draw();
    }
    assert(g.scene.done && !g.scene.active && g.currentZone.id === 'appartement', 'La scène mène à l’appartement');
    assert(said.some(line => line.includes('Troisième étage')));
    assert(metroSeen, 'Le métro est montré');
    assert(said.some(line => line.includes('Éveillés')) && said.some(line => line.includes('Tu aurais pu entrer')));
    assert(said.every(line => !/donjon/i.test(line)), 'Ishara et le récit disent faille et Abysse, jamais donjon');
    assert(said.some(line => line.includes('Pardon, désolée')));
    assert(said.some(line => /^Inconnu 1(\[\w+\])? :/.test(line)) && said.some(line => /^Inconnu 2(\[\w+\])? :/.test(line)), 'Inconnu 1 et Inconnu 2');
    assert(said.every(line => !/grand|compact/i.test(line)));
    assert(said.some(line => line.includes('Self-défense')));
    assert(said.every(line => !/sang|faux|mana/i.test(line)), 'Ni faux, ni mana, ni sang');
    assert(said.indexOf(said.find(l => l.includes('Hé.'))) < said.indexOf(said.find(l => l.includes('Aïe'))));
    assert.equal(Object.keys(g.sceneActors).length, 1, 'Seule Ishara reste');
    assert(!g.over);
    assert.equal(g.player.hp, g.player.maxHp, 'Aucun dégât pendant la scène');
    assert.equal(g.scene.log.join(' ').includes('Passant'), false);
  }],
  ['Appartement : plan praticable, objets canon examinables, nuit puis matin', () => {
    const g = armed('loaded');
    winSpider(g);
    g.levelUp.active = false;
    g.enterApartment('arrive');
    assert.equal(g.currentZone.id, 'appartement');
    assert.equal(g.currentZone.theme, 'appart');
    g.draw();
    // Chaque objet du canon est examinable, avec un texte qui reprend le canon.
    const ids = g.apartmentSpots.map(s => s.id);
    for (const id of ['fenetre', 'livres', 'tablebasse', 'canape', 'table', 'comptoir', 'porte-ishara', 'placard', 'lit', 'parquet', 'shampoings', 'radiateur', 'miroir']) assert(ids.includes(id), id);
    const texts = g.apartmentSpots.map(s => (s.lines() || []).join(' ')).join(' ');
    for (const part of ['plantes', 'deux tasses', 'Pas de télé', 'mange debout', 'bouilloire', 'La porte est fermée', 'shampoings', 'serviettes', 'trente secondes']) assert(texts.toLowerCase().includes(part.toLowerCase()), part);
    assert(!/bleu/i.test(texts));
    // Chaque point examinable a une place libre, à portée, pour un disque de la taille de Yarden.
    const blocked = (x, y) => g.walls.some(w => x > w.x - 13 && x < w.x + w.width + 13 && y > w.y - 13 && y < w.y + w.height + 13);
    for (const spot of g.apartmentSpots) {
      let free = false;
      for (let dx = -spot.r; dx <= spot.r && !free; dx += 6) for (let dy = -spot.r; dy <= spot.r && !free; dy += 6) free = Math.hypot(dx, dy) <= spot.r && !blocked(spot.x + dx, spot.y + dy);
      assert(free, `Place libre près de ${spot.id}`);
    }
    Object.assign(g.player, { x: 285, y: -95 });
    assert(!g.canInteract(), 'Rien à examiner à l’entrée');
    Object.assign(g.player, { x: -185, y: -108 });
    assert(g.canInteract() && g.nearSpot());
    g.useInteract();
    assert(g.story.active);
    while (g.story.active) g.advanceStory();
    // Les murs bloquent : on ne traverse pas la cloison entre le salon et la salle de bain.
    Object.assign(g.player, { x: 150, y: -50 });
    g.keys.add('s');
    for (let i = 0; i < 20; i++) g.update(.05);
    g.keys.clear();
    assert(g.player.y < -10, 'La cloison arrête Yarden');
    // Le chemin du salon à la chambre d'appoint existe : couloir, puis première porte à gauche.
    Object.assign(g.player, { x: 0, y: -50 });
    g.keys.add('s');
    for (let i = 0; i < 20; i++) g.update(.05);
    g.keys.clear();
    assert(g.player.y > 40, 'Le couloir est ouvert');
    Object.assign(g.player, { x: -30, y: 80 });
    g.keys.add('a');
    for (let i = 0; i < 30; i++) g.update(.05);
    g.keys.clear();
    assert(g.player.x < -150, 'La porte de la chambre d’appoint est franchissable');
    // Le parquet ne sert à dormir qu'après la douche et le miroir.
    Object.assign(g.player, { x: -170, y: 90 });
    g.useInteract();
    assert(g.story.active && !g.scene.active, 'Avant la douche, le parquet est seulement décrit');
    while (g.story.active) g.advanceStory();
  }],
  ['Miroir : texte court adapté, portrait, ni dragon ni collier', () => {
    const g = armed('loaded');
    winSpider(g);
    g.levelUp.active = false;
    g.enterApartment('arrive');
    Object.assign(g.player, { x: 290, y: 28 });
    g.useInteract();
    const said = [];
    let framed = false;
    for (let guard = 0; guard < 900 && !(g.home.stage === 'nuit' && !g.scene.active && !g.story.active); guard++) {
      if (g.story.active) { said.push(g.story.current); if (g.scene.mirror) { framed = true; g.draw(); } g.advanceStory(); } else g.update(.05);
    }
    assert(g.home.stage === 'nuit' && g.scene.mirror === null && framed);
    assert(said.some(line => line.includes('problème de géométrie angulaire')) && said.some(line => line.includes('Demain matin, on voit')), 'Le soutien-gorge, sans rien montrer');
    assert(!said.some(line => /soutien|crochet/i.test(line)), 'Rien d’explicite : seulement le problème de géométrie angulaire');
    const all = said.join('\n');
    assert(all.includes('« ...C’est acceptable. »'));
    assert(all.includes('des yeux violets'), 'Yeux violets dans la version jeu');
    for (const banned of ['Jordan', 'bleu-gris', 'septum', 'piercing', 'Angel', 'ear cuff', 'dragon', 'collier', 'chaîne']) assert(!all.includes(banned), banned);
    assert(!all.includes('—') && !all.includes('–'), 'Pas de tiret cadratin');
    assert.equal(said.filter(line => /^Tiamat : /.test(line)).length, 4);
  }],
  ['Première nuit : parquet, agents divins, tatouages et fin du matin', () => {
    const g = armed('loaded');
    winSpider(g);
    g.levelUp.active = false;
    g.enterApartment('nuit');
    Object.assign(g.player, { x: -170, y: 90 });
    g.useInteract();
    const said = [];
    let dark = false, tattoo = false;
    for (let guard = 0; guard < 600 && !(g.scene.free && g.currentZone.id === 'impasse'); guard++) {
      if (g.story.active) { said.push(g.story.current); if (g.scene.dark) dark = true; if (g.scene.tattoo) { tattoo = true; g.draw(); } g.advanceStory(); } else g.update(.05);
    }
    assert(g.currentZone.id === 'impasse' && dark && tattoo && g.scene.dark === null && g.scene.tattoo === null);
    const all = said.join('\n');
    for (const part of ['Pathétique', 'Ergonomique', 'Plusieurs organisations', 'Coût d’invocation : zéro', 'parquet']) assert(all.includes(part), part);
    assert(!all.includes('Jordan'));
  }],
  ['Run en Abysse : sept gobelins de niveau 15 à 19, sauteur, fuyard, Ishara derrière, aucune expérience', () => {
    const g = armed('loaded');
    winSpider(g);
    g.levelUp.active = false;
    const run = g.zoneEnemies.run;
    assert.equal(run.length, 7);
    assert(run.every(e => e.level >= 15 && e.level <= 19));
    assert.equal(run[2].kind, 'sauteur', 'Le troisième est un sauteur');
    assert(run[2].charger);
    assert.equal(run[6].kind, 'fuyard', 'Le septième fuit');
    g.startScene(g.impasseScript());
    for (let guard = 0; guard < 80 && !(g.scene.free && g.currentZone.id === 'impasse'); guard++) { if (g.story.active) g.advanceStory(); else g.update(.05); }
    Object.assign(g.player, { x: 41, y: -150 });
    for (let guard = 0; guard < 80 && g.currentZone.id !== 'run'; guard++) { if (g.story.active) g.advanceStory(); else g.update(.05); }
    assert.equal(g.currentZone.id, 'run');
    assert(g.player.armed && g.scene.active === false);
    // Ishara suit Yarden à trois mètres au plus.
    Object.assign(g.player, { x: 0, y: 150 });
    for (let i = 0; i < 80; i++) g.update(.05);
    const ishara = g.sceneActors.ishara;
    assert(Math.hypot(ishara.x - g.player.x, ishara.y - g.player.y) <= 112, 'Ishara reste à portée');
    // Le fuyard court vers son refuge au fond du couloir.
    const fuyard = run[6];
    Object.assign(g.player, { x: 0, y: -100 });
    for (let i = 0; i < 160 && !fuyard.cornered; i++) { g.update(.05); g.player.hp = g.player.maxHp; }
    assert(fuyard.cornered && fuyard.x > 330, 'Le fuyard est acculé dans le couloir sans issue');
    // Tous tombés : le butin, puis la rue Marterey ; l'expérience n'augmente pas.
    const level = g.player.maxHp;
    for (const enemy of run) enemy.hp = 0;
    g.update(.05);
    assert(g.scene.active, 'Le butin se raconte');
    assert.equal(g.player.maxHp, level);
    assert(!g.player.exp && !g.xp);
  }],
  ['Scène de la rue : Yarden fige ses actions, reprise remet la scène à zéro', () => {
    const g = armed('loaded');
    winSpider(g);
    g.keys.add('KeyW');
    g.player.y = -45;
    g.update(.05);
    assert(g.scene.active);
    g.startAttack(false);
    assert.equal(g.attack.remaining, 0, 'Pas d’attaque pendant la scène');
    g.resetScene();
    assert(!g.scene.active && Object.keys(g.sceneActors).length === 0);
  }],
  ['Antre : la vibration pulse les câbles et fait trembler l’image très légèrement, sans attaquer', () => {
    const g = beginSpider(armed('loaded'));
    g.draw();
    assert.equal(g.antreResonanceLevel(), 0);
    assert.equal(JSON.stringify(g.antreShake()), JSON.stringify({ x: 0, y: 0 }));
    g.hitSpider(false);
    assert(g.antreResonanceLevel() > .9);
    const shake = g.antreShake();
    assert(Math.abs(shake.x) <= 2 && Math.abs(shake.y) <= 1.5, 'Tremblement de deux pixels au plus');
    g.draw();
    g.update(.6);
    assert.equal(g.antreResonanceLevel(), 0, 'La vibration est brève');
  }],
  ['Ouverture : réveil dans la ruelle, faille, marche libre, aspiration vers le donjon', () => {
    const g = game('loaded', true);
    assert.equal(g.currentZone.id, 'exterieur');
    assert(!g.abyssReached && !g.riftShown && g.story.active);
    assert.equal(g.activeEnemies().length, 0);
    assert.equal(g.elements.objective.textContent, 'Écoute');
    g.draw();
    const lines = [];
    const next = () => { lines.push(g.story.current); g.advanceStory(); };
    for (let i = 0; i < 7; i++) next();
    assert(!g.story.active && !g.riftShown, 'La caméra va regarder la faille avant qu’elle s’ouvre');
    for (let i = 0; i < 120 && !g.story.active; i++) g.update(.05);
    assert(g.riftShown && g.story.active);
    for (let i = 0; i < 3; i++) next();
    assert(!g.story.active && g.scene.free, 'Le joueur marche librement jusqu’à la faille');
    assert(lines.join(' ').includes('Tiamat'));
    assert(lines.every(line => !line.includes('Jordan')), 'Jamais « Jordan » à l’écran');
    g.update(.05);
    assert(g.elements.objective.textContent.includes('faille'));
    const y = g.player.y;
    g.keys.add('s');
    g.update(.2);
    assert(g.player.y > y, 'Yarden se déplace pendant le tutoriel');
    g.keys.clear();
    g.draw();
    Object.assign(g.player, { x: 0, y: 440 });
    for (let i = 0; i < 40 && !g.story.active; i++) g.update(.05);
    assert(g.story.active, 'La faille l’aspire');
    g.advanceStory();
    assert.equal(g.currentZone.id, 'donjon');
    assert(g.abyssReached && !g.scene.active && !g.player.armed);
    assert.equal(JSON.stringify([g.player.x, g.player.y]), JSON.stringify([0, 240]));
  }],
  ['Fin de combat : la vie et le mana remontent après le Troll', () => {
    const s = armed();
    s.enemies[0].hp = s.enemies[1].hp = 0;
    s.update(.01); s.update(1.2);
    Object.assign(s.player, { hp: 2, mana: 4 });
    s.boss.hp = 0;
    s.update(.01);
    assert(s.exitOpen);
    assert.equal(s.player.hp, s.player.maxHp);
    assert.equal(s.player.mana, s.player.maxMana);
  }],
  ['Montée de niveau : 7 PV et 40 mana au réveil dans la ruelle, effet bref, retour à 5 PV au recommencement', () => {
    const g = armed('loaded');
    assert.equal(g.player.maxHp, 5);
    assert.equal(g.player.maxMana, 30);
    g.player.hp = 2;
    winSpider(g);
    assert(g.levelUp.active);
    assert.equal(g.player.maxHp, 7);
    assert.equal(g.player.maxMana, 40);
    assert.equal(g.player.hp, 7);
    assert.equal(g.player.mana, 40);
    assert(g.elements['hp-value'].textContent.includes('7 / 7'));
    assert.equal(g.yardenPose().clip, 'celebration', 'Yarden saute de joie');
    assert.equal(g.yardenPose().frame, 0);
    g.update(.5);
    assert(g.yardenPose().frame > 2);
    g.draw();
    const y = g.player.y;
    g.keys.add('w'); g.update(.2); g.keys.clear();
    assert.equal(g.player.y, y, 'Yarden attend la fin de l’effet');
    for (let i = 0; i < 60 && g.levelUp.active; i++) g.update(.05);
    assert(!g.levelUp.active);
    assert(g.story.active, 'Elle ouvre son interface');
    assert(!g.stats.open);
    g.advanceStory();
    assert(g.stats.open && !g.elements['stats-panel'].hidden);
    const text = g.statsText();
    assert(g.statsRows().length === 7 && g.statsRows().find(row => row.label === 'INT').value === '∞');
    for (const part of ['Niveau 24', 'FOR 20', 'DEX 18', 'AGI 12', 'VIT 5', 'INT : infinie', 'VIE 7', 'MANA 40', 'Fauchage Circulaire : 20 pts de Mana', 'Crédits : 0']) assert(text.includes(part), part);
    assert(!/franc/i.test(text), 'Des crédits, pas des francs');
    g.keys.add('w'); g.update(.2); g.keys.clear();
    assert.equal(g.player.y, y, 'Le jeu attend la fermeture de l’interface');
    g.closeStats();
    g.keys.add('w'); g.update(.2); g.keys.clear();
    assert(g.player.y < y, 'Elle bouge de nouveau');
    g.openMenu('pause');
    assert(!g.elements['menu-stats'].hidden, 'Statistiques accessibles depuis la pause');
    g.closeMenu();
    g.loadZone('exterieur');
    g.fire('retry:click');
    assert.equal(g.player.maxHp, 5);
    assert.equal(g.player.maxMana, 30);
    assert.equal(g.player.hp, 5);
  }],
  ['Menu : écran titre au lancement, pause qui fige le jeu, reprise', () => {
    const g = game('loaded', 'title');
    g.openMenu('title');
    assert(g.menu.open && !g.elements['menu-panel'].hidden);
    assert(g.elements['menu-continue'].hidden, 'Pas de reprise sans sauvegarde');
    assert.equal(g.elements['menu-new'].textContent, 'Commencer');
    g.fire('menu-new:click');
    assert(!g.menu.open && g.currentZone.id === 'exterieur' && g.story.active, 'Commencer lance l’ouverture');
    const h = armed();
    h.openMenu('pause');
    assert(h.menu.open && !h.elements['menu-resume'].hidden);
    const y = h.player.y;
    h.keys.add('w'); h.update(.3); h.keys.clear();
    assert.equal(h.player.y, y, 'Le jeu est figé en pause');
    h.startAttack(false);
    assert.equal(h.attack.remaining, 0);
    h.fire('menu-resume:click');
    assert(!h.menu.open);
    h.keys.add('w'); h.update(.2); h.keys.clear();
    assert(h.player.y < y);
  }],
  ['Menu : titre « Le Sang de Tiamat », paramètres, niveau et monstres dans l’interface', () => {
    const g = game('loaded', 'title');
    g.openMenu('title');
    assert.equal(g.elements['menu-title'].textContent, 'Le Sang de Tiamat');
    assert(g.elements['pause-button'].hidden, 'Pas de pause sur l’écran titre');
    g.fire('menu-settings:click');
    assert.equal(g.elements['menu-title'].textContent, 'Paramètres');
    assert(g.elements['menu-main'].hidden && !g.elements['menu-settings-view'].hidden);
    g.fire('menu-back:click');
    assert(!g.elements['menu-main'].hidden && g.elements['menu-title'].textContent === 'Le Sang de Tiamat');
    g.drawMenuVignette();
    const h = armed();
    h.update(.05);
    assert.equal(h.elements['level-chip'].textContent, 'NIV. 1');
    assert(h.elements.opponents.textContent.includes('Niv. 8-12') && h.elements.opponents.textContent.includes('Niv. 25'));
    h.enemies[0].hp = h.enemies[1].hp = 0; h.update(.01); h.update(1.2);
    assert(h.elements['boss-state'].textContent.includes('NIV. 32'));
    const a = armed('loaded');
    winSpider(a);
    assert.equal(a.elements['level-chip'].textContent, 'NIV. 24');
  }],
  ['Sauvegarde : trois points de passage, reprise, nouvelle partie confirmée', () => {
    const store = { data: {}, getItem(k) { return k in this.data ? this.data[k] : null; }, setItem(k, v) { this.data[k] = String(v); }, removeItem(k) { delete this.data[k]; } };
    const g = game('loaded', true, store);
    for (let guard = 0; guard < 100 && !g.readSave(); guard++) {
      if (g.story.active) g.advanceStory(); else { if (g.scene.free) Object.assign(g.player, { x: 0, y: 440 }); g.update(.05); }
    }
    assert.equal(g.readSave().checkpoint, 'abysse');
    const a = game('loaded', 'title', store);
    a.openMenu('title');
    assert(!a.elements['menu-continue'].hidden && a.elements['menu-continue'].textContent.includes('Entrée dans l’Abysse'));
    a.fire('menu-continue:click');
    assert.equal(a.currentZone.id, 'donjon');
    assert(a.abyssReached && !a.player.armed);
    const b = armed(undefined);
    b.enemies[0].hp = b.enemies[1].hp = 0;
    b.update(.01); b.update(1.2);
    b.boss.hp = 0;
    b.update(.01);
    assert.equal(JSON.parse(store.data['yarden-sauvegarde-1']).checkpoint, 'abysse', 'Autre partie, autre stockage');
    const c = game('loaded', false, store);
    c.player.y = 144; c.update(.01);
    c.enemies[0].hp = c.enemies[1].hp = 0;
    c.update(.01); c.update(1.2);
    c.boss.hp = 0;
    c.update(.01);
    assert.equal(c.readSave().checkpoint, 'antre');
    const d = game('loaded', 'title', store);
    d.openMenu('title');
    d.fire('menu-continue:click');
    assert.equal(d.currentZone.id, 'antre');
    assert(d.player.armed && d.exitOpen && d.activeEnemies().length === 1 && d.encounter.phase === 'waiting');
    const e = game('loaded', false, store);
    e.player.y = 144; e.update(.01);
    winSpider(e);
    assert.equal(e.readSave().checkpoint, 'rue');
    const f = game('loaded', 'title', store);
    f.openMenu('title');
    f.fire('menu-continue:click');
    assert.equal(f.currentZone.id, 'exterieur');
    assert.equal(f.player.maxHp, 7);
    assert(f.encounter.complete && f.player.armed && !f.scene.active);
    f.player.y = -45; f.update(.05);
    assert(f.scene.active, 'La scène de la rue se joue après la reprise');
    // Nouvelle partie : deux appuis, puis la sauvegarde est effacée.
    const n = game('loaded', 'title', store);
    n.openMenu('title');
    n.fire('menu-new:click');
    assert(n.menu.open && n.readSave());
    n.fire('menu-new:click');
    assert(!n.menu.open && !n.readSave() && n.currentZone.id === 'exterieur');
    // Sans stockage disponible, le jeu continue.
    const m = game('loaded', false, { getItem() { throw new Error('refusé'); }, setItem() { throw new Error('refusé'); }, removeItem() {} });
    assert.equal(m.saveCheckpoint('abysse'), false);
    assert.equal(m.readSave(), null);
  }],
  ['Pause : le récit et le cristal ne changent pas sous le menu', () => {
    const g = game(undefined, true);
    const text = g.story.current;
    const lines = g.story.lines.length;
    g.openMenu('pause');
    g.advanceStory();
    g.fire('window:keydown', { key: 'Enter', code: 'Enter', preventDefault() {} });
    assert.equal(g.story.current, text);
    assert.equal(g.story.lines.length, lines);
    g.closeMenu(); g.advanceStory();
    assert.equal(g.story.lines.length, lines - 1);
    const h = beginSpider(armed());
    Object.assign(h.player, h.zones.antre.crystal);
    h.encounter.projectiles.push({ x: 0, y: 0, dx: 1, dy: 0, life: 1 });
    h.openMenu('pause');
    assert(!h.canUseCrystal());
    h.useCrystal();
    h.fire('window:keydown', { key: 'f', code: 'KeyF', preventDefault() {} });
    assert.equal(h.encounter.phase, 'combat');
    assert.equal(h.encounter.projectiles.length, 1);
    h.closeMenu(); h.useCrystal();
    assert.equal(h.encounter.phase, 'blinded');
  }],
  ['Sauvegarde : retour au point de passage dans la même partie', () => {
    for (const checkpoint of ['abysse', 'antre', 'rue']) {
      const g = armed('loaded');
      g.update(2);
      g.saveCheckpoint(checkpoint);
      const savedTime = g.readSave().elapsed;
      for (const enemy of g.allEnemies()) { enemy.hp = 0; enemy.windup = .5; }
      g.zoneEnemies.antre[0].incapacitated = true;
      Object.assign(g.player, { hp: 1, mana: 1 });
      Object.assign(g.attack, { remaining: .2, cooldown: .4 });
      g.skill.cooldown = 2;
      g.dodge.cooldown = 1;
      g.yardenSprite.defeated = true;
      g.openMenu('pause');
      g.fire('menu-restart:click');
      assert(!g.menu.open && !g.over && !g.story.active && !g.scene.active);
      assert.equal(g.elapsed, savedTime);
      assert.equal(g.player.hp, checkpoint === 'rue' ? 7 : 5);
      assert.equal(g.player.mana, checkpoint === 'rue' ? 40 : 30);
      assert.equal(g.attack.remaining, 0);
      assert.equal(g.attack.cooldown, 0);
      assert.equal(g.skill.cooldown, 0);
      assert.equal(g.dodge.cooldown, 0);
      assert(!g.yardenSprite.defeated);
      assert.equal(g.currentZone.id, {abysse: 'donjon', antre: 'antre', rue: 'exterieur'}[checkpoint]);
      assert.equal(g.player.armed, checkpoint !== 'abysse');
      assert.equal(g.enemies[0].hp, checkpoint === 'abysse' ? 3 : 0);
      assert.equal(g.boss.hp, checkpoint === 'abysse' ? 8 : 0);
      assert.equal(g.stage, checkpoint === 'abysse' ? 'entry' : 'exit');
      assert.equal(g.zoneEnemies.antre[0].hp, checkpoint === 'rue' ? 1 : 12);
      assert.equal(g.zoneEnemies.antre[0].incapacitated, checkpoint === 'rue');
      assert.equal(g.encounter.phase, checkpoint === 'rue' ? 'complete' : 'waiting');
    }
  }],
  ['Son : rien avant un geste, musique douce, coup de faux, réglage gardé', () => {
    const store = { data: {}, getItem(k) { return k in this.data ? this.data[k] : null; }, setItem(k, v) { this.data[k] = String(v); }, removeItem(k) { delete this.data[k]; } };
    const g = armed('loaded');
    const a = game('loaded', false, store);
    assert.equal(a.audioLog.contexts, 0, 'Aucun son avant un geste du joueur');
    a.player.y = 144; a.update(.01);
    a.startAttack(false);
    assert.equal(a.audioLog.started, 0);
    a.fire('window:pointerdown');
    assert.equal(a.audioLog.contexts, 1);
    a.fire('window:pointerdown');
    assert.equal(a.audioLog.contexts, 1, 'Un seul moteur sonore');
    a.syncMusic();
    a.audio.next = 0;
    a.audioLog.timers[0]();
    assert(a.audioLog.started >= 2, 'La musique se programme');
    a.update(1.2);
    a.attack.cooldown = 0; a.attack.remaining = 0;
    a.startAttack(false);
    assert(a.audio.played.includes('slash'), 'Le coup de faux fait un bruit de lame');
    a.hurtPlayer();
    assert(a.audio.played.includes('hurt'));
    // Deux réglages séparés, gardés dans le navigateur : la musique et les effets.
    assert.equal(a.musicLabel(), 'Musique : activée');
    assert.equal(a.effectsLabel(), 'Effets : activés');
    a.setEffects(false);
    assert.equal(a.effectsLabel(), 'Effets : coupés');
    const before = a.audio.played.length;
    a.playSfx('slash');
    assert.equal(a.audio.played.length, before, 'Plus de bruitages');
    assert(Math.abs(a.audio.music.gain.value - .072) < 1e-9, 'La musique continue');
    a.setMusic(false);
    assert.equal(a.audio.music.gain.value, 0);
    // Curseurs de volume : gardés, relus, et appliqués aux deux circuits sonores.
    a.setMusic(true); a.setEffects(true);
    a.setMusicVolume(.3); a.setEffectsVolume(1);
    assert(Math.abs(a.audio.music.gain.value - .036) < 1e-9, 'La musique suit son curseur');
    assert(Math.abs(a.audio.sfx.gain.value - .8) < 1e-9, 'Les effets suivent leur curseur');
    a.elements['menu-music-volume'].value = '40';
    a.fire('menu-music-volume:input');
    assert.equal(a.audio.musicVolume, .4);
    a.setMusic(false);
    assert.equal(a.audio.music.gain.value, 0);
    a.setEffects(false);
    const b = game('loaded', false, store);
    assert.equal(b.audio.musicVolume, .4);
    assert.equal(b.audio.effectsVolume, 1);
    assert.equal(b.audio.effectsOn, false);
    assert.equal(b.audio.musicOn, false);
    a.fire('menu-effects:click');
    assert.equal(a.audio.effectsOn, true);
    // Musique selon le lieu.
    g.syncMusic();
    assert.equal(g.audio.theme, 'abysse');
    g.loadZone('exterieur'); g.syncMusic();
    assert.equal(g.audio.theme, 'ville');
    // Sans moteur sonore disponible, le jeu continue.
    g.playSfx('slash'); g.startAttack(false);
  }],
  ['Pack visuel : portraits, arcs de la faux, hommes chibi et danseurs', () => {
    const p = game('loaded').parseStoryLine('Yarden[agacee] : « Hé. »');
    assert.equal(p.who, 'Yarden'); assert.equal(p.expression, 'agacee'); assert.equal(p.text, 'Hé.');
    const q = game('loaded').parseStoryLine('Tiamat (voix intérieure) : « Ce n’est pas ton problème. »');
    assert.equal(q.who, 'Tiamat'); assert.equal(q.expression, 'neutre');
    assert.equal(game('loaded').parseStoryLine('Elle regarde encore.').who, null);
    const g = armed('loaded');
    g.loadWeaponArt(); g.loadPortraits(); g.loadSceneArt();
    assert(g.weaponArt.glow && g.weaponArt.base && g.weaponArt.empowered, 'Images de la faux chargées');
    assert(Object.keys(g.portraitArt).length === 16 && Object.values(g.portraitArt).every(Boolean));
    g.calls.length = 0;
    g.startAttack(false);
    g.draw();
    assert(g.calls.some(c => c[0] === 'drawImage' && c[1] === g.weaponArt.base), 'Arc violet dessiné');
    g.attack.cooldown = 0; g.attack.remaining = 0; g.skill.cooldown = 0;
    g.player.mana = g.player.maxMana;
    g.startAttack(true);
    g.calls.length = 0;
    g.draw();
    assert(g.calls.some(c => c[0] === 'drawImage' && c[1] === g.weaponArt.empowered), 'Arc cyan dessiné');
    const failing = game('error');
    failing.loadWeaponArt();
    failing.draw();
    // Hommes chibi et danseurs : chaque pose a son image.
    g.sceneActor('a', 'grand', 0, 0); g.sceneActor('b', 'compact', 0, 0); g.sceneActor('c', 'danseuse', 0, 0); g.sceneActor('d', 'danseur', 0, 0);
    const poses = id => g.sceneActorPose(g.sceneActors[id]);
    assert(poses('a').strip && poses('c').strip && poses('d').strip);
    Object.assign(g.sceneActors.b, { mode: 'stumble' });
    assert.equal(poses('b').strip, [...Object.values(g.sceneArt.strips)].find(x => x === poses('b').strip));
    assert.deepEqual(Array.from(poses('b').cell), [211, 148]);
    assert.deepEqual(Array.from(poses('c').cell), [128, 148]);
  }],
  ['Mode libre : carte, faille au hasard, 5 à 8 monstres et un chef, retour en ville', () => {
    const g = game('loaded');
    g.skipOpening();
    if (g.menu.open) g.closeMenu();
    let seed = 7;
    g.freeMode.rng = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    g.startFreeMode();
    assert(g.freeMode.active && g.currentZone.id === 'quartier');
    assert(!g.elements['map-button'].hidden, 'Bouton Carte visible');
    g.openMap();
    assert(!g.elements['map-panel'].hidden && g.stats.open);
    g.closeMap();
    assert(g.elements['map-panel'].hidden && !g.stats.open);
    const seen = new Set();
    for (let round = 0; round < 6; round++) {
      Object.assign(g.player, { x: g.freeSpots.quartier.x, y: g.freeSpots.quartier.y });
      g.updateFree();
      assert.equal(g.currentZone.id, 'faille');
      seen.add(g.currentZone.theme);
      const list = g.zoneEnemies.faille;
      assert(list.length >= 6 && list.length <= 9, 'Cinq à huit monstres puis le chef');
      assert.equal(list[list.length - 1].kind, 'chef');
      for (const enemy of list) assert(!g.walls.some(w => enemy.x > w.x && enemy.x < w.x + w.width && enemy.y > w.y && enemy.y < w.y + w.height), 'Aucun monstre dans un mur');
      assert(!g.walls.some(w => g.player.x > w.x && g.player.x < w.x + w.width && g.player.y > w.y && g.player.y < w.y + w.height), 'Départ libre');
      g.update(.05);
      for (const enemy of list) enemy.hp = 0;
      g.update(.05);
      assert(g.freeMode.done);
      Object.assign(g.player, g.zones.faille.start);
      g.update(.05);
      assert.equal(g.currentZone.id, 'faille', 'Le passage ne s’ouvre pas tout de suite');
      g.update(1.2);
      assert.equal(g.currentZone.id, 'quartier', 'Retour en ville');
    }
    assert(seen.size >= 2, 'Plusieurs décors tirés');
    assert.equal(g.freeMode.clears, 6);
    // Mort dans une faille : retour en ville, soignée.
    Object.assign(g.player, { x: g.freeSpots.quartier.x, y: g.freeSpots.quartier.y });
    g.updateFree();
    g.hurtPlayer(99);
    g.update(2);
    g.fire('retry:click');
    assert(!g.over && g.currentZone.id === 'quartier' && g.player.hp === g.player.maxHp);
  }],
  ['Antre : reprendre après une mort réinitialise le combat sans refaire le Troll', () => {
    const g = beginSpider(armed());
    g.enemies[0].hp = g.enemies[1].hp = g.boss.hp = 0;
    g.encounter.projectiles.push({ x: 0, y: 0, dx: 1, dy: 0, life: 1 });
    g.encounter.slow = 3;
    g.hurtPlayer(5);
    assert(g.over);
    assert.equal(g.elements.retry.textContent, 'Reprendre l’antre');
    g.fire('retry:click');
    assert.equal(g.currentZone.id, 'antre');
    assert.equal(g.encounter.phase, 'waiting');
    assert.equal(g.encounter.projectiles.length, 0);
    assert.equal(g.encounter.slow, 0);
    assert(!g.over && g.player.hp === 5 && g.player.mana === 30 && g.player.armed);
    assert.equal(g.boss.hp, 0, 'Le Troll reste vaincu');
    assert.equal(g.zoneEnemies.antre[0].hp, 12);
    assert(!g.zoneEnemies.antre[0].incapacitated);
  }]
];
for (const [name, run] of tests) { run(); console.log('OK — ' + name); }
console.log(`${tests.length} scénarios logiques réussis. Le rendu Canvas est simulé ; test navigateur/Android nécessaire.`);
