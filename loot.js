'use strict';

// Butin et vente (CAHIER-DES-CHARGES.md, étape 4). Chaque monstre vaincu dans une faille rapporte son niveau en crédits (le chef : trois fois plus).
// Le butin du run reste « sur elle » : il entre dans le sac seulement si le run va jusqu'au chef. Un KO le perd et coûte une petite dette.
// La vente se fait depuis le sac, dans la rue, chez Rémi (au noir, prix simple). Une vente rembourse d'abord la dette de Yarden.
// Valeurs provisoires ; le comptoir Est (prix plus haut avec provenance) n'est pas encore branché : décision à prendre avec Jordan.
const runLoot = { value: 0, kills: 0 };
const lootRules = { perLevel: 1, chiefMultiplier: 3, koDebt: 10 };

function resetRunLoot() { runLoot.value = 0; runLoot.kills = 0; }

function collectLoot() {
  for (const enemy of zoneEnemies.faille || []) {
    if (enemy.hp > 0 || enemy.looted) continue;
    enemy.looted = true;
    runLoot.value += (enemy.level || 5) * lootRules.perLevel * (enemy.chief ? lootRules.chiefMultiplier : 1);
    runLoot.kills++;
  }
}

// Chef vaincu : le butin passe dans le sac.
function bankRunLoot() {
  if (runLoot.value > 0) {
    const spot = freeSpots[freeMode.from] ? freeSpots[freeMode.from].short : 'Faille';
    bag.push({ name: `Butin · ${spot}`, display: `${runLoot.value} ¢ à vendre`, value: runLoot.value, loot: true });
    saveMeta();
    lootToast(`Butin rangé : ${runLoot.value} ¢`);
  }
  resetRunLoot();
}

// KO ou retour en rue sans avoir fini : butin du run perdu ; KO = petite dette.
function loseRunLoot(knockedOut) {
  if (knockedOut) debt += lootRules.koDebt;
  resetRunLoot();
  saveMeta();
  updateBagHud();
}

const bagLootTotal = () => bag.filter(item => item.loot).reduce((sum, item) => sum + item.value, 0);
const canSellLoot = () => freeMode.active && !!freeSpots[currentZone.id] && bagLootTotal() > 0;

// Vente chez Rémi : prix simple ; la dette est remboursée en premier.
function sellLoot() {
  if (!canSellLoot()) return 0;
  const total = bagLootTotal();
  for (let i = bag.length - 1; i >= 0; i--) if (bag[i].loot) bag.splice(i, 1);
  const repaid = Math.min(debt, total);
  debt -= repaid;
  credits += total - repaid;
  saveMeta();
  updateBagHud();
  lootToast(repaid ? `Vendu ${total} ¢ · dette −${repaid}` : `Vendu ${total} ¢`);
  return total;
}
