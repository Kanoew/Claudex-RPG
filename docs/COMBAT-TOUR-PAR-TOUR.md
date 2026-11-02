# Combat au tour par tour — page de design (essai)

> **GELÉ le 2 novembre 2026** (`CAHIER-DES-CHARGES.md`, section 2) : le réglage « Combat » n'est plus dans les paramètres, le jeu reste en temps réel. Le code est conservé ; à rouvrir si des compagnons deviennent jouables.

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
- Réponse des monstres : intentions annoncées et dégâts fixes dans cet essai. Le gobelin frappe (1 dégât) un tour sur deux ; l'ogre prépare une charge, frappe (2 dégâts), puis récupère, sur trois tours.
- Valeurs d'essai : Yarden garde ses PV et son mana actuels ; le gobelin a 4 PV et l'ogre 6. Ces valeurs sont portées par des copies propres au combat. Les modèles du temps réel, leurs niveaux et leurs statistiques restent identiques. Un garde déjà blessé entre avec une proportion de PV équivalente. À la victoire seulement, les gardes du monde sont marqués vaincus.
- Yarden joue en premier. Une intention disparaît si son auteur tombe avant sa réponse. Aucun tirage aléatoire pour toucher.
- Pause, perte de focus et onglet masqué figent l'horloge des impacts et des animations. Revenir au point de passage annule toute action en attente. Les touches du temps réel sont bloquées pendant la rencontre.
- Les trois actions se distinguent par leur couleur et leur coût. Une cible possède un anneau doré et un bouton sélectionné ; les intentions restent lisibles sous le terrain, ou à droite en paysage court. Pause reste accessible ; Tab est confiné à la fenêtre, Échap ouvre Pause.

## Proposition sur la branche `codex/combat-tour-ruelle`

Cette rencontre reste une proposition à tester sur Android. Exemple de parcours prudent à partir de 5 PV et 30 mana : Fauchage, Esquive, Faux, Faux, Esquive, Fauchage, Faux, Faux. Conserver le gobelin comme cible jusqu'à sa défaite ; l'ogre est ensuite sélectionné automatiquement. La victoire conserve 3 PV. D'autres choix de cible et de dépenses sont possibles : comparer leur confort et leur lisibilité avant de modifier encore les valeurs.

Le fond de combat reprend le motif de pierre de la salle explorée. Les bandes existantes de Yarden (dont l'esquive) et des monstres sont conservées, sans miroir de Yarden. Les images absentes ont un secours simple.

Vérification logique supplémentaire sans dépendance : `node tests/combat-tour.cjs` (pause/onglet, reprise, coûts, double appui, annulation, victoire et défaite). La suite `node tests/smoke.cjs` conserve les contrôles du jeu en temps réel. Le contrôle visuel et les interactions demandent aussi un navigateur et un véritable téléphone.

## Questions pour Jordan

1. **Ordre des tours** : garder Yarden en premier pendant la validation de cette rencontre ; examiner l'AGI ensuite ?
2. **Compagnons** : Ishara (dague, finisseuse aux chapitres 7 à 9) et Izzy jouent-elles dans le combat, avec leurs propres boutons, ou en renfort automatique ?
3. **Boss** : le Troll et l'araignée restent-ils en temps réel (motifs d'esquive) ou deviennent-ils tour par tour (attaque annoncée un tour à l'avance pour se protéger) ?
4. **Mode libre** : failles de 5 à 8 monstres. Combat unique avec tous les monstres, ou un combat par monstre touché ?
5. **Hasard** : conserver les dégâts fixes proposés après l'essai sur téléphone ?
6. **Stats** : FOR, DEX, AGI, VIT, INT entrent dans les formules ? (vie et dégâts aujourd'hui en petits nombres entiers).

## Étapes si le prototype te plaît

1. Valider cette rencontre en portrait et paysage sur Android : intentions, sélection, pause et rythme.
2. Concevoir un seul boss avec ses particularités existantes (notamment la ruse de l'araignée), avant toute généralisation.
3. Décider d'une direction principale de combat avant d'entretenir deux systèmes complets.
4. Préparer les compagnons, puis le mode libre et les chapitres suivants, avec leur canon propre.
