'use strict';

function hudText(id, text) {
  const node = document.getElementById(id);
  if (node.textContent !== text) node.textContent = text;
}

function hudMeter(id, value, max) {
  const node = document.getElementById(id);
  const shown = Math.max(0, Math.min(max, value));
  const fraction = shown / max;
  node.style.setProperty('--fill', `${fraction * 100}%`);
  node.setAttribute('aria-valuenow', String(Math.floor(shown)));
  node.setAttribute('aria-valuemax', String(max));
}

function updateHud() {
  hudMeter('hp-meter', player.hp, player.maxHp);
  hudMeter('mana-meter', player.mana, player.maxMana);
  hudText('hp-value', `${player.hp} / ${player.maxHp}`);
  hudText('mana-value', `${Math.floor(player.mana)} / ${player.maxMana}`);
  hudText('status', `Yarden : ${player.hp} PV, ${Math.floor(player.mana)} mana.`);
  const bossVisible = boss.active && boss.hp > 0 && !combatOver;
  document.getElementById('boss-panel').hidden = !bossVisible;
  hudMeter('boss-meter', boss.hp, boss.maxHp);
  hudText('boss-value', `${boss.hp} / ${boss.maxHp}`);
  hudText('boss-state', bossDelay > 0 ? 'APPARITION' : boss.windup > 0 ? 'ÉCARTE-TOI' : 'TROLL');
  hudText('opponents', stage === 'guards' ? `Gobelin ${enemies[0].hp}/3 · Ogre ${enemies[1].hp}/2` : stage === 'entry' ? 'Chapitre 1' : stage === 'boss' ? 'Le Troll de l’Abysse' : 'Donjon parcouru');
  const goal = paused && !combatOver ? 'En pause — reviens au jeu' : !player.armed ? 'Rejoins la faux violette ↑' : bossDelay > 0 ? 'Le Troll apparaît' : stage === 'guards' ? 'Vaincs le gobelin et l’ogre' : stage === 'boss' ? 'Vaincs le Troll' : stage === 'exit' ? 'Rejoins la porte verte ↑' : 'Tu as quitté l’Abysse';
  hudText('objective', goal);
}

function updateButtonHints() {
  const wait = time => `${time.toFixed(1).replace('.', ',')} s`;
  hudText('attack-hint', !player.armed ? 'À récupérer' : attack.cooldown > 0 ? wait(attack.cooldown) : player.mana < 3 ? 'Mana insuffisant' : '3 mana · Espace');
  hudText('skill-hint', !player.armed ? 'À récupérer' : skill.cooldown > 0 ? wait(skill.cooldown) : player.mana < skill.cost ? 'Mana insuffisant' : '12 mana · E');
  hudText('dodge-hint', dodge.cooldown > 0 ? wait(dodge.cooldown) : 'Gratuite · Maj');
}
