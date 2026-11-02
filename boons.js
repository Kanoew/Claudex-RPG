'use strict';

// Récompenses de run (CAHIER-DES-CHARGES.md, étape 3) : après chacune des trois premières salles, trois effets tirés au hasard, un seul au choix.
// Ils durent jusqu'à la fin du run (chef vaincu, ou KO) puis tout revient à la normale. Aucun nom ne vient du roman : ce sont des effets de jeu.
const boon = { open: false, el: null, offers: [] };
const runBoons = {};
const boonBaseline = { dodgeRecovery: 1.1, skillCost: 20 };
const boonCatalog = {
  faux: { name: 'Faux affûtée', text: '+1 dégât au coup de faux', max: 2, apply: () => {} },
  fauchage: { name: 'Fauchage renforcé', text: '+1 dégât au Fauchage', max: 2, apply: () => {} },
  portee: { name: 'Faux déployée', text: 'Portée des coups +25 %', max: 2, apply: () => {} },
  esquive: { name: 'Esquive vive', text: 'Esquive disponible 30 % plus vite', max: 2, apply: () => { dodge.recovery = Math.max(.4, dodge.recovery * .7); } },
  mana: { name: 'Réserve de mana', text: '+10 mana maximum, 10 mana rendus', max: 2, apply: () => { player.maxMana += 10; player.mana = Math.min(player.maxMana, player.mana + 10); } },
  vie: { name: 'Cœur solide', text: '+1 vie maximum et 2 vies rendues', max: 3, apply: () => { player.maxHp += 1; player.hp = Math.min(player.maxHp, player.hp + 2); } },
  allege: { name: 'Fauchage allégé', text: 'Fauchage : 5 mana de moins', max: 2, apply: () => { skill.cost = Math.max(5, skill.cost - 5); } }
};

const boonStacks = id => runBoons[id] || 0;
const boonDamage = empowered => boonStacks(empowered ? 'fauchage' : 'faux');
const boonRange = () => 1 + .25 * boonStacks('portee');

// Remet tout à la normale : début de run, fin de run ou KO.
function resetBoons() {
  for (const key of Object.keys(runBoons)) delete runBoons[key];
  dodge.recovery = boonBaseline.dodgeRecovery;
  skill.cost = boonBaseline.skillCost;
  if (typeof levelStats !== 'undefined') { player.maxHp = levelStats.maxHp; player.maxMana = levelStats.maxMana; }
  player.hp = Math.min(player.hp, player.maxHp); player.mana = Math.min(player.mana, player.maxMana);
  closeBoon();
}

function boonOffers() {
  const available = Object.keys(boonCatalog).filter(id => boonStacks(id) < boonCatalog[id].max);
  const picks = [];
  while (picks.length < 3 && available.length) picks.push(available.splice(Math.floor((freeMode.rng ? freeMode.rng() : Math.random()) * available.length), 1)[0]);
  return picks;
}

function openBoon() {
  if (boon.open || typeof document.createElement !== 'function') return;
  resetInput();
  boon.offers = boonOffers();
  if (!boon.offers.length) return;
  boon.open = true;
  const el = document.createElement('section');
  el.id = 'boon-panel';
  el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'boon-title');
  el.style.cssText = 'position:absolute;inset:0;z-index:70;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:16px;background:#0b0816f0;color:#f4effc;font:16px system-ui;';
  el.innerHTML = `<h2 id="boon-title" style="margin:0;font:700 22px Georgia,serif">Salle ${freeMode.room}/${freeRun.rooms} vaincue</h2><p style="margin:0;color:#cfc4e6">Choisis un effet pour la suite du run.</p>`;
  boon.offers.forEach((id, index) => {
    const info = boonCatalog[id], stack = boonStacks(id);
    const button = document.createElement('button');
    button.type = 'button'; button.id = 'boon-' + index;
    button.style.cssText = 'width:min(92vw,420px);min-height:72px;padding:10px 14px;text-align:left;border:1px solid #8b78c9;border-radius:14px;background:#2b2141;color:#f4effc;font:inherit';
    button.innerHTML = `<strong>${info.name}${stack ? ` · niveau ${stack + 1}` : ''}</strong><br><small style="color:#cfc4e6">${info.text}</small>`;
    button.addEventListener('click', () => chooseBoon(index));
    el.appendChild(button);
  });
  (document.getElementById('app') || document.body).appendChild(el);
  boon.el = el;
  el.querySelector('#boon-0').focus();
}

function closeBoon() {
  boon.open = false;
  if (boon.el) { boon.el.remove(); boon.el = null; }
}

function chooseBoon(index) {
  const id = boon.offers[index];
  if (!boon.open || !id) return;
  runBoons[id] = boonStacks(id) + 1;
  boonCatalog[id].apply();
  closeBoon();
  resetInput();
  lootToast(boonCatalog[id].name);
  updateStatus(); updateAttackButton();
  if (boon.el === null && typeof canvas !== 'undefined' && canvas.focus) canvas.focus();
}
