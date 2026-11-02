'use strict';

// Boutique de Rémi (CAHIER-DES-CHARGES.md, étape 4b) : des effets permanents et des potions, payés en crédits, depuis le sac dans la rue.
// Les crédits, la dette, les achats et le butin non vendu se gardent dans le navigateur entre deux visites. Prix et effets provisoires.
// La boutique ne s'ouvre qu'après la scène d'histoire de Rémi (`hubstory.js`, première scène du hub).
const metaKey = 'yarden-meta';
const meta = { credits: 0, debt: 0, vie: 0, mana: 0, esquive: 0, potions: 0, loot: [], remiMet: false, unlocked: 0, seen: [] };
const shopItems = {
  vie: { name: 'Cœur d’acier', text: '+1 vie au départ de chaque run', max: 5, price: n => 150 + 50 * n },
  mana: { name: 'Souffle long', text: '+5 mana au départ de chaque run', max: 5, price: n => 150 + 50 * n },
  esquive: { name: 'Pas léger', text: 'L’esquive revient 10 % plus vite', max: 4, price: n => 200 + 50 * n },
  potion: { name: 'Potion de soin', text: 'Rend 3 vies (à boire depuis le sac, en faille). 3 au maximum.', max: 3, price: () => 40 }
};
const potionHeal = 3;

function shopOwned(id) { return id === 'potion' ? meta.potions : meta[id]; }
function shopBonus(id) { return id === 'potion' ? 0 : meta[id]; }
const shopOpen = () => freeMode.active && !!freeSpots[currentZone.id] && meta.remiMet;

function saveMeta() {
  meta.credits = credits; meta.debt = debt;
  meta.loot = bag.filter(item => item.loot).map(({ name, value }) => ({ name, value }));
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(metaKey, JSON.stringify(meta)); } catch (error) { /* pas de stockage : tout reste valable jusqu'à la fermeture */ }
}

function loadMeta() {
  let saved = null;
  try { if (typeof localStorage !== 'undefined') saved = JSON.parse(localStorage.getItem(metaKey) || 'null'); } catch (error) { saved = null; }
  if (!saved) return;
  for (const key of ['credits', 'debt', 'vie', 'mana', 'esquive', 'potions']) if (Number.isFinite(saved[key])) meta[key] = saved[key];
  if (Number.isFinite(saved.unlocked)) meta.unlocked = saved.unlocked;
  if (Array.isArray(saved.seen)) meta.seen = saved.seen.filter(id => typeof id === 'string');
  // Un joueur qui a déjà acheté chez Rémi garde sa boutique.
  meta.remiMet = saved.remiMet === true || meta.vie + meta.mana + meta.esquive + meta.potions > 0;
  credits = meta.credits; debt = meta.debt;
  for (let i = bag.length - 1; i >= 0; i--) if (bag[i].loot) bag.splice(i, 1);
  for (const item of Array.isArray(saved.loot) ? saved.loot : []) if (Number.isFinite(item.value)) bag.push({ name: item.name, display: `${item.value} ¢ à vendre`, value: item.value, loot: true });
}

function buyShopItem(id) {
  const item = shopItems[id];
  if (!item || !shopOpen()) return false;
  const owned = shopOwned(id), price = item.price(owned);
  if (owned >= item.max || credits < price) return false;
  credits -= price;
  if (id === 'potion') meta.potions++; else meta[id]++;
  saveMeta(); updateBagHud();
  lootToast(`${item.name} acheté · ${price} ¢`);
  return true;
}

function drinkPotion() {
  if (meta.potions <= 0 || currentZone.id !== 'faille' || player.hp >= player.maxHp || player.hp <= 0) return false;
  meta.potions--;
  player.hp = Math.min(player.maxHp, player.hp + potionHeal);
  saveMeta(); updateStatus();
  lootToast(`Potion : +${potionHeal} vie`);
  return true;
}

function shopHtml() {
  const potion = meta.potions > 0 && currentZone.id === 'faille' ? `<button type="button" class="bag-sell" data-potion="1" ${player.hp >= player.maxHp ? 'disabled' : ''}>Boire une potion (${meta.potions}) · +${potionHeal} vie</button>` : '';
  if (!shopOpen()) return potion;
  const rows = Object.entries(shopItems).map(([id, item]) => {
    const owned = shopOwned(id), full = owned >= item.max, price = item.price(owned);
    return `<div class="bag-row"><span><strong>${item.name}</strong> · ${owned}/${item.max}<br><small>${item.text}</small></span><button type="button" class="shop-buy" data-buy="${id}" ${full || credits < price ? 'disabled' : ''}>${full ? 'Complet' : `${price} ¢`}</button></div>`;
  }).join('');
  return `<div class="bag-credits" style="margin-top:14px"><span>BOUTIQUE DE RÉMI</span></div>${rows}`;
}
