# Combat au tour par tour — page de design (essai)

Statut : prototype jouable, derrière le réglage **Paramètres → Combat → Tour par tour (essai)**. Par défaut, le combat reste en temps réel. À valider par Jordan avant de généraliser.

## Principe

- **Exploration en temps réel** (inchangée). Le contact avec un monstre ouvre un **écran de combat** tour par tour ; les animations existantes (faux, dégâts, défaite de Yarden ; annonce, coup, dégâts des monstres) y sont rejouées.
- Le temps réel reste pour la fuite, les boss à motifs (Troll, araignée) tant que leur version tour par tour n'est pas dessinée.

## Prototype (ce qui est codé)

Fichier `combat-tour.js`. Déclenchement : dans l'Abysse, première salle, à moins de 170 px des gardes (gobelin et ogre). À la fin, les gardes sont vaincus et le jeu continue comme avant (le Troll s'éveille). En cas de défaite : même écran de défaite qu'en temps réel.

| Action | Effet |
|---|---|
| Faux | 1 dégât à la cible choisie (gratuit) |
| Fauchage | 2 dégâts à tous, 20 mana |
| Esquive | aucun dégât ce tour ; impossible deux tours de suite |

- Mana : +4 par tour. Vie et mana de Yarden gardés après le combat (comme en temps réel).
- Réponse des monstres : chacun attaque à son tour, 70 % de chance de toucher ; gobelin 1 dégât, ogre 2.
- Les chiffres sont provisoires : Yarden a 5 de vie et les monstres 2 à 3, ce qui rend l'équilibrage très serré.

## Questions pour Jordan

1. **Ordre des tours** : Yarden joue toujours en premier (actuel), ou selon l'AGI (ordre affiché) ?
2. **Compagnons** : Ishara (dague, finisseuse aux chapitres 7 à 9) et Izzy jouent-elles dans le combat, avec leurs propres boutons, ou en renfort automatique ?
3. **Boss** : le Troll et l'araignée restent-ils en temps réel (motifs d'esquive) ou deviennent-ils tour par tour (attaque annoncée un tour à l'avance pour se protéger) ?
4. **Mode libre** : failles de 5 à 8 monstres. Combat unique avec tous les monstres, ou un combat par monstre touché ?
5. **Hasard** : garder 70 % de chance de toucher, ou aucun hasard (dégâts fixes, plus lisibles) ?
6. **Stats** : FOR, DEX, AGI, VIT, INT entrent dans les formules ? (vie et dégâts aujourd'hui en petits nombres entiers).

## Étapes si le prototype te plaît

1. Même écran pour les gardes du mode libre et l'araignée.
2. Compagnons et finisseuse à la dague.
3. Équilibrage des chapitres 4 à 9 (niveaux 15 à 28).
4. Boss à attaques annoncées.
