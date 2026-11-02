'use strict';

// Régressions de l'essai : horloge, annulation, coûts et issue, sans dépendance.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function harness() {
  const elements = new Map();
  function element() {
    const children = new Map();
    return { dataset: {}, textContent: '', disabled: false, innerHTML: '', appendChild() {}, remove() {}, setAttribute() {}, addEventListener() {}, focus() {},
      getContext: () => ({}), querySelector(selector) { if (!children.has(selector)) children.set(selector, element()); return children.get(selector); } };
  }
  const context = vm.createContext({ console, Promise,
    document: { hidden: false, createElement: element, getElementById(id) { if (!elements.has(id)) elements.set(id, element()); return elements.get(id); } },
    localStorage: { getItem: () => null }, requestAnimationFrame: () => 1, cancelAnimationFrame() {},
    resetInput() {}, playSfx() {}, updateStatus() {}, updateAttackButton() {}, playYardenReaction() {}, openMenu() {},
    finishCombat() { context.lost = true; }, canvas: { focus() {} }
  });
  vm.runInContext(`const player = { hp: 5, maxHp: 5, mana: 30, maxMana: 30, x: 0, y: 0 };
    const enemies = [{ name: 'Gobelin', art: 'goblin', hp: 3, maxHp: 3, x: 0, y: 0 }, { name: 'Ogre', art: 'ogre', hp: 2, maxHp: 2, x: 0, y: 0 }];
    const skill = { cost: 20 }; const menu = { open: false }; const stats = { open: false };
    let paused = false, elapsed = 0, combatOver = false, stage = 'guards'; const currentZone = { id: 'donjon' };`, context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../combat-tour.js'), 'utf8'), context);
  const run = code => vm.runInContext(code, context);
  run('combatMode = "tour"; startBattle()');
  const snapshot = () => JSON.parse(run('JSON.stringify({hp:player.hp,mana:player.mana,round:battle.round,time:battle.time,busy:battle.busy,active:battle.active,foes:battle.foes.map(f=>f.enemy.hp)})'));
  async function drain() {
    for (let i = 0; i < 300 && run('battle.busy'); i++) { run('tickBattle(.05)'); await Promise.resolve(); }
    assert.equal(run('battle.busy'), false, 'Une action doit se terminer');
  }
  return { run, snapshot, drain, context };
}

(async () => {
  let g = harness();
  assert.deepEqual(g.snapshot().foes, [4, 6]);
  assert.equal(g.run('enemies[0].hp'), 3, 'Les PV du temps réel restent isolés');
  g.run('battleAct("fauchage")');
  const started = g.snapshot();
  g.run('menu.open=true');
  for (let i = 0; i < 60; i++) { g.run('tickBattle(.05)'); await Promise.resolve(); }
  assert.deepEqual(g.snapshot(), started, 'Pause doit figer impact, PV, mana, tours et animation');
  g.run('menu.open=false; document.hidden=true; tickBattle(20)');
  assert.deepEqual(g.snapshot(), started, 'Un onglet masqué doit figer le combat');
  g.run('document.hidden=false'); await g.drain();
  assert.deepEqual(g.snapshot().foes, [2, 4]);
  assert.equal(g.snapshot().hp, 4); assert.equal(g.snapshot().mana, 14);
  assert.equal(g.run('battleIntent(battle.foes[1]).damage'), 2, 'Charge annoncée au tour 2');
  console.log('OK — Pause et onglet masqué figent exactement le combat ; reprise à la même action');

  g.run('battleAct("dodge")'); await g.drain();
  assert.equal(g.snapshot().hp, 4, 'Esquive protège de la charge');
  const afterDodge = g.snapshot(); g.run('battleAct("dodge")'); await Promise.resolve();
  assert.deepEqual(g.snapshot(), afterDodge, 'Pas deux esquives consécutives');
  g.run('player.mana=0'); const noMana = g.snapshot();
  g.run('battleAct("fauchage"); battleAct("invalide")'); await Promise.resolve();
  assert.deepEqual(g.snapshot(), noMana, 'Un appel invalide ne doit pas consommer de tour ni de mana');
  console.log('OK — Intention déterministe, esquive, coûts et validation des actions');

  g = harness(); g.run('battleAct("fauchage"); battleAct("fauchage")');
  assert.equal(g.snapshot().mana, 10, 'Un double appui ne paie qu’une fois');
  const cancelledFoes = g.snapshot().foes;
  g.run('resetBattle(); player.hp=5; player.mana=30');
  await Promise.resolve(); g.run('startBattle(); tickBattle(10)'); await Promise.resolve();
  assert.equal(g.snapshot().hp, 5); assert.equal(g.snapshot().mana, 30);
  assert.deepEqual(g.snapshot().foes, [4, 6]);
  assert.deepEqual(cancelledFoes, [4, 6], 'Le premier impact était encore en attente');
  console.log('OK — Double appui et reprise : aucune ancienne action ne touche une nouvelle partie');

  g = harness();
  for (const action of ['fauchage', 'dodge', 'faux', 'faux', 'dodge', 'fauchage', 'faux', 'faux']) {
    g.run(`battleAct('${action}')`); await g.drain();
  }
  assert.equal(g.snapshot().active, false); assert.equal(g.snapshot().hp, 3);
  assert.equal(g.run('enemies.every(enemy=>enemy.hp===0)'), true);
  console.log('OK — Parcours tactique gagnant, PV conservés et gardes du monde vaincus');

  g = harness(); g.run('player.hp=1; battleAct("faux")'); await g.drain();
  assert.equal(g.snapshot().active, false); assert.equal(g.context.lost, true);
  assert.equal(g.run('enemies[0].hp'), 3);
  console.log('OK — Défaite propre sans marquer les gardes vaincus');
})().catch(error => { console.error(error); process.exitCode = 1; });
