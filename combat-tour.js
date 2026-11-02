'use strict';

// Combat au tour par tour (essai, réglage « Combat » des paramètres). Quand Yarden s'approche des gardes de la première salle de l'Abysse,
// l'exploration s'arrête et un écran de combat s'ouvre : on choisit une action, puis les monstres répondent. Les animations des bandes existantes
// sont réutilisées. Sans le réglage, rien ne change : le combat reste en temps réel. Page de design : docs/COMBAT-TOUR-PAR-TOUR.md.
const battle = { active: false, foes: [], target: 0, busy: false, lastDodge: false, dodging: false, round: 1, el: null, ctx: null, raf: 0, time: 0, you: { pose: 'idle', since: 0 }, message: '' };
let combatMode = (() => { try { return localStorage.getItem('combatMode') === 'tour' ? 'tour' : 'reel'; } catch (error) { return 'reel'; } })();

function battleShouldStart() {
  if (combatMode !== 'tour' || battle.active || combatOver || currentZone.id !== 'donjon' || stage !== 'guards') return false;
  return enemies.some(enemy => !enemy.boss && enemy.hp > 0 && Math.hypot(enemy.x - player.x, enemy.y - player.y) < 170);
}

const battleWait = ms => new Promise(resolve => setTimeout(resolve, ms));
function battleSet(object, pose) { object.pose = pose; object.since = battle.time; }

function startBattle() {
  resetInput();
  attack.remaining = 0; dodge.remaining = 0;
  battle.foes = enemies.filter(enemy => !enemy.boss && enemy.hp > 0).map(enemy => ({ enemy, pose: 'idle', since: 0 }));
  Object.assign(battle, { active: true, target: 0, busy: false, lastDodge: false, dodging: false, round: 1, time: 0, message: 'Un combat commence.' });
  battleSet(battle.you, 'idle');
  const el = document.createElement('div');
  el.id = 'battle';
  el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Combat au tour par tour');
  el.style.cssText = 'position:fixed;inset:0;z-index:70;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:12px;background:#0b0816f5;color:#f4effc;font:16px system-ui;';
  el.innerHTML = '<div id="battle-top" style="width:min(96vw,520px);display:flex;justify-content:space-between;font-weight:700"></div>'
    + '<canvas id="battle-canvas" width="360" height="220" style="width:min(96vw,520px);height:calc(min(96vw,520px) * 220 / 360);flex:none;border:1px solid #8b78c9;border-radius:14px;background:#1a1530"></canvas>'
    + '<div id="battle-targets" style="width:min(96vw,520px);display:flex;gap:8px;flex-wrap:wrap"></div>'
    + '<p id="battle-message" style="width:min(96vw,520px);min-height:2.6em;margin:0;color:#e6d9ff"></p>'
    + '<div id="battle-actions" style="width:min(96vw,520px);display:grid;grid-template-columns:repeat(3,1fr);gap:8px"></div>';
  document.body.appendChild(el);
  battle.el = el; battle.ctx = el.querySelector('#battle-canvas').getContext('2d');
  const actions = el.querySelector('#battle-actions');
  for (const [id, label] of [['faux', 'Faux<br><small>gratuit</small>'], ['fauchage', 'Fauchage<br><small>20 mana · tous</small>'], ['dodge', 'Esquive<br><small>aucun dégât</small>']]) {
    const button = document.createElement('button');
    button.type = 'button'; button.id = 'battle-' + id; button.innerHTML = label;
    button.style.cssText = 'min-height:56px;border:1px solid #8b78c9;border-radius:12px;background:#2b2141;color:#f4effc;font:inherit;font-weight:700';
    button.addEventListener('click', () => battleAct(id));
    actions.appendChild(button);
  }
  battleRender();
  battle.raf = requestAnimationFrame(battleLoop);
}

function battleRender() {
  if (!battle.el) return;
  const alive = battle.foes.filter(foe => foe.enemy.hp > 0);
  if (battle.target >= battle.foes.length || battle.foes[battle.target].enemy.hp <= 0) battle.target = Math.max(0, battle.foes.findIndex(foe => foe.enemy.hp > 0));
  battle.el.querySelector('#battle-top').innerHTML = `<span>YARDEN · Vie ${player.hp}/${player.maxHp}</span><span>Mana ${Math.floor(player.mana)}/${player.maxMana}</span><span>Tour ${battle.round}</span>`;
  const targets = battle.el.querySelector('#battle-targets');
  targets.innerHTML = '';
  battle.foes.forEach((foe, index) => {
    if (foe.enemy.hp <= 0) return;
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.textContent = `${foe.enemy.name} ${foe.enemy.hp}/${foe.enemy.maxHp}`;
    chip.style.cssText = `padding:8px 12px;border-radius:999px;border:1px solid ${index === battle.target ? '#e0c58f' : '#5b4c85'};background:${index === battle.target ? '#4a3a78' : '#241b3a'};color:#f4effc;font:inherit`;
    chip.addEventListener('click', () => { if (!battle.busy) { battle.target = index; battleRender(); } });
    targets.appendChild(chip);
  });
  battle.el.querySelector('#battle-message').textContent = battle.message;
  const disabled = battle.busy;
  battle.el.querySelector('#battle-faux').disabled = disabled;
  battle.el.querySelector('#battle-fauchage').disabled = disabled || player.mana < skill.cost || alive.length === 0;
  battle.el.querySelector('#battle-dodge').disabled = disabled || battle.lastDodge;
}

function battleSay(text) { battle.message = text; battleRender(); }

async function battleAct(kind) {
  if (battle.busy || !battle.active) return;
  battle.busy = true; battle.dodging = false;
  battleRender();
  if (kind === 'dodge') {
    battle.dodging = true;
    battleSay('Yarden se tient prête à esquiver.');
    await battleWait(500);
  } else {
    const all = kind === 'fauchage';
    if (all) player.mana -= skill.cost;
    const targets = all ? battle.foes.filter(foe => foe.enemy.hp > 0) : [battle.foes[battle.target]];
    battleSay(all ? 'Fauchage circulaire !' : 'Yarden frappe.');
    battleSet(battle.you, 'attack'); playSfx('slash');
    await battleWait(330);
    for (const foe of targets) {
      foe.enemy.hp = Math.max(0, foe.enemy.hp - (all ? 2 : 1));
      battleSet(foe, foe.enemy.hp > 0 ? 'hurt' : 'dead'); playSfx('hit');
    }
    battleRender();
    await battleWait(520);
    battleSet(battle.you, 'idle');
  }
  if (battle.foes.every(foe => foe.enemy.hp <= 0)) { battleSay('Les gardes sont à terre.'); await battleWait(700); return endBattle(true); }
  // Réponse des monstres, l'un après l'autre.
  for (const foe of battle.foes) {
    if (foe.enemy.hp <= 0) continue;
    battleSay(`${foe.enemy.name} attaque.`);
    battleSet(foe, 'windup'); await battleWait(380);
    battleSet(foe, 'strike'); await battleWait(160);
    if (battle.dodging) battleSay('Esquivé !');
    else if (Math.random() < .7) {
      const damage = foe.enemy.art === 'ogre' ? 2 : 1;
      player.hp = Math.max(0, player.hp - damage);
      battleSet(battle.you, 'hurt'); playSfx('hurt');
      battleSay(`${foe.enemy.name} touche Yarden : −${damage} vie.`);
      battleRender();
    } else battleSay(`${foe.enemy.name} manque Yarden.`);
    await battleWait(480);
    battleSet(foe, 'idle'); if (battle.you.pose === 'hurt') battleSet(battle.you, 'idle');
    if (player.hp <= 0) { battleSet(battle.you, 'defeat'); await battleWait(900); return endBattle(false); }
  }
  battle.lastDodge = kind === 'dodge';
  battle.round++;
  player.mana = Math.min(player.maxMana, player.mana + 4);
  battle.busy = false; battle.dodging = false;
  battleSay('À toi.');
}

function endBattle(won) {
  cancelAnimationFrame(battle.raf);
  if (battle.el) battle.el.remove();
  Object.assign(battle, { active: false, el: null, ctx: null, busy: false });
  updateStatus(); updateAttackButton();
  if (!won) { playYardenReaction('defeat'); finishCombat('Yarden est tombée. Réessaie !', 1); }
}

function battleDraw(strip, clip, frame, x, ground, scale, flip, alpha) {
  if (!strip) return;
  const [w, h] = clip.cell, [ax, ay] = clip.anchor;
  const c = battle.ctx;
  c.save(); c.globalAlpha = alpha; c.translate(x, 0);
  if (flip) c.scale(-1, 1);
  c.drawImage(strip, frame * w, 0, w, h, -ax * scale, ground - ay * scale, w * scale, h * scale);
  c.restore();
}

function battleLoop(now) {
  if (!battle.active) return;
  battle.raf = requestAnimationFrame(battleLoop);
  battle.time = now / 1000;
  const c = battle.ctx, ground = 175;
  const sky = c.createLinearGradient(0, 0, 0, 220); sky.addColorStop(0, '#1b1633'); sky.addColorStop(1, '#2a2548');
  c.fillStyle = sky; c.fillRect(0, 0, 360, 220);
  c.fillStyle = '#17142b'; c.fillRect(0, ground - 6, 360, 60);
  c.fillStyle = '#00000055';
  // Yarden : bandes de la salle (repos, coup, dégâts, défaite).
  const t = battle.time - battle.you.since;
  const pose = battle.you.pose;
  const wanted = pose === 'attack' ? 'scythe-right' : pose === 'hurt' ? 'hurt' : pose === 'defeat' ? 'defeat' : 'idle';
  const clip = yardenClips[wanted], strip = yardenArt.strips[wanted];
  if (clip && strip) {
    const frame = clip.weights ? yardenProgressFrame(wanted, wanted === 'scythe-right' ? t / .33 : wanted === 'hurt' ? t / .3 : t / .8) : yardenFrame(wanted, battle.time);
    c.beginPath(); c.ellipse(90, ground + 2, 22, 6, 0, 0, Math.PI * 2); c.fill();
    battleDraw(strip, clip, frame, 90, ground, 1.2, false, 1);
  }
  // Monstres, tournés vers la gauche (sens d'origine des bandes).
  const alive = battle.foes.length;
  battle.foes.forEach((foe, index) => {
    const art = foe.enemy.art, mc = monsterClips[art], ms = monsterArt.strips[art];
    if (!mc || !ms) return;
    const ft = battle.time - foe.since;
    let frame = mc.walk[0], alpha = 1, shake = 0;
    if (foe.pose === 'windup') frame = mc.windup;
    else if (foe.pose === 'strike') { frame = mc.strike; shake = -18; }
    else if (foe.pose === 'hurt') { frame = mc.hurt !== undefined ? mc.hurt : mc.walk[0]; alpha = Math.floor(ft * 20) % 2 ? .45 : 1; }
    else if (foe.pose === 'dead') { frame = mc.hurt !== undefined ? mc.hurt : mc.walk[0]; alpha = Math.max(0, 1 - ft / .5); }
    else frame = mc.walk[Math.floor(battle.time / .25) % 2];
    const x = 250 + index * 62 + shake, scale = .95 * (foe.enemy.scale || 1);
    c.fillStyle = '#00000055'; c.beginPath(); c.ellipse(x, ground + 2, 24, 6, 0, 0, Math.PI * 2); c.fill();
    battleDraw(ms, mc, frame, x, ground, scale, false, alpha);
    if (foe.enemy.hp > 0) {
      c.fillStyle = '#2a1830'; c.fillRect(x - 22, ground - mc.stand * scale - 14, 44, 5);
      c.fillStyle = index === battle.target ? '#f08ab2' : '#c75a86'; c.fillRect(x - 22, ground - mc.stand * scale - 14, 44 * foe.enemy.hp / foe.enemy.maxHp, 5);
    }
  });
}
