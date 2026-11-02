'use strict';

// Rencontre de référence limitée aux gardes. Valeurs isolées du temps réel.
const battle = { active: false, foes: [], target: 0, busy: false, lastDodge: false, dodging: false, round: 1, el: null, ctx: null, raf: 0, time: 0, lastFrame: null, wait: null, you: { pose: 'idle', since: 0 }, message: '' };
let combatMode = (() => { try { return localStorage.getItem('combatMode') === 'tour' ? 'tour' : 'reel'; } catch (error) { return 'reel'; } })();

function battleShouldStart() {
  if (combatMode !== 'tour' || battle.active || combatOver || currentZone.id !== 'donjon' || stage !== 'guards') return false;
  return enemies.some(enemy => !enemy.boss && enemy.hp > 0 && Math.hypot(enemy.x - player.x, enemy.y - player.y) < 170);
}
function battlePaused() { return paused || menu.open || stats.open || document.hidden; }
function battleSet(object, pose) { object.pose = pose; object.since = battle.time; }
function battleWait(ms) { return new Promise(resolve => { battle.wait = { left: ms / 1000, resolve }; }); }

// Une horloge commune aux animations et aux actions, arrêtée sous Pause et hors onglet.
function tickBattle(seconds) {
  if (!battle.active || battlePaused()) return;
  battle.time += seconds; elapsed += seconds;
  if (battle.wait) {
    battle.wait.left -= seconds;
    if (battle.wait.left <= 0) { const done = battle.wait.resolve; battle.wait = null; done(true); }
  }
}
function battleIntent(foe) {
  if (foe.enemy.art === 'ogre') return [
    { label: 'Prépare sa charge', damage: 0, pose: 'windup' },
    { label: 'Charge · 2 dégâts', damage: 2, pose: 'strike' },
    { label: 'Récupère', damage: 0, pose: 'idle' }
  ][(battle.round - 1) % 3];
  return battle.round % 2 ? { label: 'Frappe · 1 dégât', damage: 1, pose: 'strike' } : { label: 'Récupère', damage: 0, pose: 'idle' };
}
function startBattle() {
  if (battle.active) return;
  resetInput();
  battle.foes = enemies.filter(enemy => !enemy.boss && enemy.hp > 0).map(enemy => {
    const maxHp = enemy.art === 'ogre' ? 6 : 4;
    return { source: enemy, enemy: { ...enemy, maxHp, hp: Math.max(1, Math.ceil(maxHp * enemy.hp / enemy.maxHp)) }, pose: 'idle', since: 0 };
  });
  if (!battle.foes.length) return;
  Object.assign(battle, { active: true, target: 0, busy: false, lastDodge: false, dodging: false, round: 1, time: 0, lastFrame: null, message: 'Observe leurs intentions, puis choisis ta cible et ton action.' });
  battleSet(battle.you, 'idle');
  const el = document.createElement('section'); el.id = 'battle';
  el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'battle-title');
  el.innerHTML = '<div class="battle-heading"><div><small>ABYSSE · SALLE 1</small><h2 id="battle-title">Les gardes</h2></div><button id="battle-pause" type="button">Pause</button></div>'
    + '<div id="battle-top"></div><div class="battle-stage"><canvas id="battle-canvas" width="480" height="260" aria-label="Yarden face aux gardes. La cible et les intentions sont détaillées à côté."></canvas></div>'
    + '<div class="battle-decision"><p class="battle-caption">CIBLE · INTENTION CE TOUR</p><div id="battle-targets" role="group" aria-label="Choisir la cible"></div>'
    + '<p id="battle-message" role="status" aria-live="polite"></p><div id="battle-actions" role="group" aria-label="Choisir une action"></div>'
    + '<p id="battle-hint">Yarden joue en premier · +4 mana après chaque tour</p></div>';
  document.getElementById('app').appendChild(el);
  battle.el = el; battle.ctx = el.querySelector('#battle-canvas').getContext('2d');
  el.querySelector('#battle-pause').addEventListener('click', () => openMenu('pause'));
  const targets = el.querySelector('#battle-targets');
  battle.foes.forEach((foe, index) => {
    const chip = document.createElement('button'); chip.type = 'button'; chip.id = 'battle-target-' + index;
    chip.innerHTML = '<strong></strong><span class="foe-life"></span><small></small>';
    chip.addEventListener('click', () => { if (!battle.busy && !battlePaused()) { battle.target = index; battleRender(); } });
    targets.appendChild(chip);
  });
  const actions = el.querySelector('#battle-actions');
  for (const [id, label] of [['faux', 'Faux<small>1 dégât · gratuit</small>'], ['fauchage', 'Fauchage<small>2 à tous · 20 mana</small>'], ['dodge', 'Esquive<small>Évite les coups du tour</small>']]) {
    const button = document.createElement('button'); button.type = 'button'; button.id = 'battle-' + id; button.innerHTML = label;
    button.addEventListener('click', () => battleAct(id)); actions.appendChild(button);
  }
  battleRender();
  if (typeof updateUxLayout === 'function') updateUxLayout();
  el.querySelector('#battle-faux').focus();
  battle.raf = requestAnimationFrame(battleLoop);
}
function battleRender() {
  if (!battle.el) return;
  if (!battle.foes[battle.target] || battle.foes[battle.target].enemy.hp <= 0) battle.target = Math.max(0, battle.foes.findIndex(foe => foe.enemy.hp > 0));
  battle.el.querySelector('#battle-top').innerHTML = `<span>VIE <b>${player.hp}/${player.maxHp}</b></span><span>MANA <b>${Math.floor(player.mana)}/${player.maxMana}</b></span><span>TOUR <b>${battle.round}</b></span>`;
  battle.foes.forEach((foe, index) => {
    const chip = battle.el.querySelector('#battle-target-' + index), alive = foe.enemy.hp > 0;
    chip.disabled = battle.busy || !alive;
    chip.setAttribute('aria-pressed', String(index === battle.target && alive));
    chip.querySelector('strong').textContent = foe.enemy.name;
    chip.querySelector('.foe-life').textContent = alive ? `${foe.enemy.hp}/${foe.enemy.maxHp} PV` : 'À terre';
    chip.querySelector('small').textContent = alive ? battleIntent(foe).label : 'Vaincu';
    chip.dataset.threat = alive && battleIntent(foe).damage > 0 ? 'yes' : 'no';
  });
  battle.el.querySelector('#battle-message').textContent = battle.message;
  const alive = battle.foes.some(foe => foe.enemy.hp > 0);
  battle.el.querySelector('#battle-faux').disabled = battle.busy || !alive;
  battle.el.querySelector('#battle-fauchage').disabled = battle.busy || player.mana < skill.cost || !alive;
  battle.el.querySelector('#battle-dodge').disabled = battle.busy || battle.lastDodge || !alive;
  battle.el.querySelector('#battle-hint').textContent = battle.lastDodge ? 'Esquive indisponible ce tour · +4 mana après chaque tour' : player.mana < skill.cost ? 'Mana insuffisant pour Fauchage · +4 mana après chaque tour' : 'Yarden joue en premier · +4 mana après chaque tour';
}
function battleSay(text) { battle.message = text; battleRender(); }
async function battleAct(kind) {
  if (!battle.active || battle.busy || battlePaused() || !['faux', 'fauchage', 'dodge'].includes(kind)) return;
  if ((kind === 'fauchage' && player.mana < skill.cost) || (kind === 'dodge' && battle.lastDodge)) return;
  const target = battle.foes[battle.target]; if (!target || target.enemy.hp <= 0) return;
  battle.busy = true; battle.dodging = kind === 'dodge'; battleRender();
  if (battle.dodging) {
    battleSet(battle.you, 'dodge'); battleSay('Yarden se tient prête à esquiver les coups de ce tour.');
    if (!await battleWait(350)) return;
  } else {
    const all = kind === 'fauchage'; if (all) player.mana -= skill.cost;
    const targets = all ? battle.foes.filter(foe => foe.enemy.hp > 0) : [target];
    battleSay(all ? 'Fauchage circulaire · 2 dégâts à chaque garde.' : `Yarden frappe ${target.enemy.name.toLowerCase()} · 1 dégât.`);
    battleSet(battle.you, 'attack'); playSfx('slash'); if (!await battleWait(330)) return;
    for (const foe of targets) { foe.enemy.hp = Math.max(0, foe.enemy.hp - (all ? 2 : 1)); battleSet(foe, foe.enemy.hp > 0 ? 'hurt' : 'dead'); }
    playSfx('hit'); battleRender(); if (!await battleWait(350)) return;
    battleSet(battle.you, 'idle');
  }
  if (battle.foes.every(foe => foe.enemy.hp <= 0)) {
    battleSay('Les gardes sont à terre.'); if (await battleWait(600)) endBattle(true); return;
  }
  for (const foe of battle.foes) {
    if (foe.enemy.hp <= 0) continue;
    const intent = battleIntent(foe);
    if (!intent.damage) {
      battleSet(foe, intent.pose); battleSay(`${foe.enemy.name} ${intent.pose === 'windup' ? 'prépare sa charge.' : 'récupère.'}`);
      if (!await battleWait(300)) return; continue;
    }
    battleSay(`${foe.enemy.name} attaque.`);
    battleSet(foe, 'windup'); if (!await battleWait(300)) return;
    battleSet(foe, 'strike'); if (!await battleWait(120)) return;
    if (battle.dodging) battleSay(`${foe.enemy.name} : coup esquivé.`);
    else { player.hp = Math.max(0, player.hp - intent.damage); battleSet(battle.you, 'hurt'); playSfx('hurt'); battleSay(`${foe.enemy.name} touche Yarden : −${intent.damage} vie.`); }
    if (!await battleWait(380)) return;
    battleSet(foe, 'idle'); if (battle.you.pose === 'hurt') battleSet(battle.you, 'idle');
    if (player.hp <= 0) { battleSet(battle.you, 'defeat'); if (await battleWait(850)) endBattle(false); return; }
  }
  battle.lastDodge = kind === 'dodge'; battle.round++;
  player.mana = Math.min(player.maxMana, player.mana + 4);
  battle.busy = false; battle.dodging = false; battleSet(battle.you, 'idle');
  battleSay('À toi. Les intentions sont mises à jour.'); battle.el.querySelector('#battle-faux').focus();
}
function resetBattle() {
  const pending = battle.wait;
  if (battle.raf && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(battle.raf);
  if (battle.el) battle.el.remove();
  Object.assign(battle, { active: false, el: null, ctx: null, busy: false, wait: null, raf: 0, lastFrame: null });
  if (pending) pending.resolve(false);
}
function endBattle(won) {
  if (won) for (const foe of battle.foes) foe.source.hp = 0;
  resetBattle(); resetInput(); if (typeof updateUxLayout === 'function') updateUxLayout();
  canvas.focus(); updateStatus(); updateAttackButton();
  if (!won) { playYardenReaction('defeat'); finishCombat('Yarden est tombée. Réessaie !', 1); }
}
function battleDraw(strip, clip, frame, x, ground, scale, alpha = 1) {
  const c = battle.ctx;
  if (!strip || !clip) { c.save(); c.globalAlpha = alpha; c.fillStyle = '#b5a0d6'; c.beginPath(); c.arc(x, ground - 24, 20, 0, Math.PI * 2); c.fill(); c.restore(); return; }
  const [w, h] = clip.cell, [ax, ay] = clip.anchor;
  c.save(); c.globalAlpha = alpha;
  c.drawImage(strip, frame * w, 0, w, h, x - ax * scale, ground - ay * scale, w * scale, h * scale); c.restore();
}
function battleLoop(now) {
  if (!battle.active) return;
  const seconds = battle.lastFrame === null ? 0 : Math.max(0, Math.min(.05, (now - battle.lastFrame) / 1000));
  battle.lastFrame = now; tickBattle(seconds); battle.raf = requestAnimationFrame(battleLoop);
  const c = battle.ctx, ground = 205;
  c.fillStyle = '#17212c'; c.fillRect(0, 0, 480, 260);
  // Pierre de la salle explorée, sans ressource supplémentaire.
  if (roomArt.floor) { c.fillStyle = roomArt.floor; c.fillRect(0, 0, 480, 260); }
  c.fillStyle = '#0d1025aa'; c.fillRect(0, 0, 480, 260);
  c.fillStyle = '#283341'; c.fillRect(0, 25, 480, 12); c.fillStyle = '#0c111a'; c.fillRect(0, 37, 480, 7);
  const t = battle.time - battle.you.since, pose = battle.you.pose;
  const wanted = pose === 'attack' ? 'scythe-right' : pose === 'hurt' ? 'hurt' : pose === 'defeat' ? 'defeat' : pose === 'dodge' ? 'dash-right' : 'idle';
  const clip = yardenClips[wanted], strip = yardenArt.strips[wanted];
  const frame = clip && clip.weights ? yardenProgressFrame(wanted, t / (pose === 'attack' ? .33 : pose === 'hurt' ? .3 : .8)) : yardenFrame('idle', battle.time);
  c.fillStyle = '#00000066'; c.beginPath(); c.ellipse(98, ground + 2, 25, 7, 0, 0, Math.PI * 2); c.fill();
  battleDraw(strip, clip, frame, pose === 'attack' ? 112 : 98, ground, 1.12);
  battle.foes.forEach((foe, index) => {
    const art = foe.enemy.art, mc = monsterClips[art], ms = monsterArt.strips[art], ft = battle.time - foe.since, x = 300 + index * 108;
    let frame = mc ? mc.walk[Math.floor(battle.time / .25) % mc.walk.length] : 0, alpha = 1;
    if (mc && foe.pose === 'windup') frame = mc.windup;
    else if (mc && foe.pose === 'strike') frame = mc.strike;
    else if (foe.pose === 'hurt' || foe.pose === 'dead') { frame = mc && mc.hurt !== undefined ? mc.hurt : 0; alpha = foe.pose === 'dead' ? Math.max(0, 1 - ft / .4) : Math.floor(ft * 20) % 2 ? .5 : 1; }
    if (foe.enemy.hp > 0 && index === battle.target) {
      c.strokeStyle = '#ffe3a8'; c.lineWidth = 2; c.beginPath(); c.ellipse(x, ground + 2, 31, 9, 0, 0, Math.PI * 2); c.stroke();
      c.fillStyle = '#ffe3a8'; c.font = 'bold 12px system-ui'; c.textAlign = 'center'; c.fillText('CIBLE', x, 64);
    }
    c.fillStyle = '#00000066'; c.beginPath(); c.ellipse(x, ground + 2, 25, 7, 0, 0, Math.PI * 2); c.fill();
    battleDraw(ms, mc, frame, x + (foe.pose === 'strike' ? -20 : 0), ground, .9 * (foe.enemy.scale || 1), alpha);
  });
}
