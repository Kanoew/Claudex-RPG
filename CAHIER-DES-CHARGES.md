# CAHIER-DES-CHARGES.md — Yarden, V1 « mini-Hadès »

> Brouillon du 2 novembre 2026, rédigé avec Jordan. **À valider par Jordan avant toute étape.**
> À lire avec `PROJECT.md`. Si une consigne de ce fichier contredit `PROJECT.md` (sections 1, 2, 31 et 32 en particulier), on le signale avant de coder : ce fichier prime sur le périmètre, `PROJECT.md` reste la référence pour le canon et les styles de personnages.
> Les points marqués **(proposition)** ne sont pas décidés. Ceux de la section 8 attendent une réponse de Jordan.

## 0. Contexte et objectif

La V1 du prototype devait seulement montrer ce que Jordan pouvait faire avec du code. Elle est devenue plus grosse que prévu : chapitres 1 à 6 jouables, mode libre, sac, dette, deux systèmes de combat. Il manque une direction.

**Objectif :** un petit jeu **fini**, vendable à 1 ou 2 € (Steam ou Play Store), dont la boucle de jeu s'inspire de *Hadès* (seule référence 2D de Jordan) : des runs en temps réel dans des failles, un retour au hub après chaque run, une histoire qui avance par petits morceaux entre les runs.

**Pourquoi ça colle au roman** (`Le Sang de Tiamat`) : Yarden entre dans des failles, ramène du butin, le vend à Rémi ou au comptoir Est, rembourse sa dette. La boucle est déjà dans l'histoire.

**Principes**
- Un seul chantier ouvert à la fois. Les trucs commencés mais pas finis sont listés, puis finis ou gelés (étape 1).
- La boucle de jeu passe avant le texte.
- Aucun lore inventé : demander à Jordan. Les entorses au canon se valident à deux (Jordan et Karina) et ne remontent jamais dans le roman.
- Le moteur reste HTML / JavaScript / Canvas. Pas de migration (Godot écarté le 28 octobre).

## 1. Boucle de run

- Une **faille = un run**. Entrée depuis le hub, sortie au hub.
- Un run enchaîne **3 à 5 salles puis un chef** (proposition : 3 salles + chef pour la première version).
- Les salles réutilisent les générateurs du mode libre (`dungeon.js`, `libre.js`) et les monstres existants (`enemies.js`).
- Paliers de difficulté tirés du canon : faille sous le niveau 20 = une salle plate, des obstacles, 10 à 20 créatures ; faille de niveau 30 et plus = architecture riche, créatures protégées (plus tard).
- Fin de run : victoire sur le chef, ou **KO** (voir section 8, question 1).
- **Pas de « mort » ni de « game over »** dans les textes : Yarden perd connaissance et se réveille au hub (déjà canon pour l'araignée). Les textes du mode libre qui parlent de « mort » sont à renommer.

## 2. Combat

- **Temps réel, en solo.** Faux gratuite, Fauchage à 20 mana, esquive gratuite : valeurs actuelles conservées.
- Stats FOR / DEX / AGI / VIT / INT ; la VIT récupère **en combat**, pas au repos (règle canon, à utiliser comme mécanique).
- **Tour par tour : gelé.** Le code (`combat-tour.js`, `docs/COMBAT-TOUR-PAR-TOUR.md`) est conservé. L'option « Combat » est retirée des Paramètres tant que le sujet n'est pas rouvert. Il ne se déclenchait que dans la première salle de l'Abysse (gobelin et ogre) ; tout le reste est déjà en temps réel.
- À rouvrir seulement si des compagnons deviennent jouables (chapitre 8 et suivants du roman).
- Boss existants conservés tels quels : Troll, araignée de cristal, chefs du mode libre.
- Critère : un run complet jouable sur Android (ROG Phone 8 Pro), lisible et sans blocage du joystick. L'équilibrage se juge sur une vraie partie, pas en simulation.

## 3. Récompenses et progression

- **Entre deux salles : 3 récompenses au choix** (proposition d'effets : dégâts de faux, portée ou rapidité de l'esquive, mana, vie, effet de Fauchage). Valeurs à définir étape par étape.
- **Butin** : ramassé pendant le run, mis dans le sac, **vendu au hub**. Choix de vente tiré du canon : Rémi (au noir) ou le comptoir Est (légal, environ ×2 mais avec provenance).
- **Dette** : objectif de run visible (la dette de Félix ou les 320 du chapitre 10 selon la scène choisie ; à décider).
- **Niveau et points de stats** : 2 points par niveau (règle canon). Ce point demande une décision sur l'XP (section 8, question 2).
- **Décisions de Jordan du 2 novembre 2026 (après validation des étapes 2 à 4)** :
  - La règle « aucune amélioration permanente » est **levée**. Rémi tient une boutique au hub : buffs permanents et potions, payés en crédits, ouverte quand sa scène d'histoire a été découverte.
  - **L'histoire avance d'un morceau par run** : les scènes déjà dans le jeu (chapitres 1 à 6) sont découpées et débloquées dans l'ordre. Aucune scène nouvelle à écrire ; le découpage est à valider par Jordan.
  - **Plusieurs hubs** à terme, avec des personnages du lore (Izzy, Céleste, Ishara). Pas dans la première version.
  - **Étages** : l'Abysse se parcourt en étages (182 dans l'idée de Jordan). La V1 en livre un petit nombre ; la structure doit pouvoir en accueillir 182.
  - **Équipement** : objets à raretés de couleur classique (gris, vert, bleu, violet, orange), avec un bonus de statistique. Pour l'instant seulement la couleur, pas de dessin (à générer plus tard).
  - **Structure du jeu** : les chapitres 1 à 6 ne sont plus un parcours linéaire séparé. Le chapitre 1 sert de tutoriel, les autres alimentent le hub (voir section 4).

## 4. Hub et histoire

- **Hub** : lieux déjà dessinés dans le jeu (appartement d'Ishara, 4B, comptoir de Rémi, etc.). Chaque personnage a un rôle simple : Céleste (estimation de la valeur), Rémi (comptoir au noir), Félix (papiers), Ishara (soutien).
- **L'histoire avance entre les runs**, par scènes courtes débloquées. Les chapitres 1 à 6 déjà jouables servent de matière (proposition : le chapitre 1 est le tutoriel ; les autres alimentent le hub). Le choix des scènes est à trancher avec Jordan (section 8, question 4).
- **Textes** : relecture **chapitre par chapitre, dans l'ordre du jeu**, une session à la fois. Source de relecture : `docs/TEXTES.md` (généré par `node docs/outils/exporter-textes.cjs`, ne pas l'éditer à la main).
- Règle de longueur (proposition) : une réplique de 25 mots au plus ; au-delà, on coupe ou on scinde en deux écrans. Les gros blocs (discours du chef, terrasse d'Izzy) sont traités en priorité.
- Pas de nouvelle scène écrite sans validation de Jordan. Les textes écrits par l'IA sont relus par lui (voir `docs/TOPO-TEST.md`, section 9).

## 5. Gel : hors V1

Rien de ce qui suit ne se touche tant que Jordan n'a pas rouvert le sujet :
- Combat au tour par tour et compagnons jouables ; combat à mains nues du chapitre 8.
- Chapitres 7 à 10 de la Saison 2 (canon lu, rien d'implémenté).
- Nouveaux lieux, nouveaux personnages, nouveaux sprites, sauf ce qu'exige un jalon de la section 7.
- Multijoueur, traductions, migration de moteur.
- Le chapitre 6 et le mode libre actuel restent dans le dépôt tels quels ; ils seront reliés à la boucle (étape 5), pas réécrits.

## 6. Vente (à préparer après la boucle validée, pas avant)

Le jeu n'existe aujourd'hui que comme page web (GitHub Pages) : pas d'emballage Android ni PC dans le dépôt. À étudier **plus tard** : emballage pour le Play Store et pour Steam, déclaration du contenu généré par IA exigée sur ces plateformes, jeu en français seulement. **Aucune de ces règles n'est vérifiée dans ce brouillon** : à contrôler avant de promettre quoi que ce soit.

## 7. Étapes (une seule à la fois, validée par Jordan avant la suivante)

1. **Inventaire et gel.** Lister tout ce qui est commencé mais pas fini (une ligne chacun : à finir, à geler, à jeter). Retirer l'option de combat au tour par tour des Paramètres. Fin : liste validée par Jordan.
2. **Boucle minimale.** Depuis le hub, entrer dans une faille, traverser 3 salles, vaincre un chef, revenir au hub. Le KO ramène au hub. Fin : un run complet joué par Jordan sur Android.
3. **Récompenses.** Choix de 3 effets entre les salles (3 effets d'abord). Fin : le choix change visiblement le jeu.
4. **Butin et vente.** Reprise du sac, des crédits et de la dette existants, reliés à la fin de run. Fin : un run rapporte, la vente a un effet.
5. **Hub.** Relier les scènes existantes aux runs. Fin : l'histoire avance quand on rejoue.
6. **Relecture et coupe des textes**, chapitre par chapitre. Fin de chaque chapitre : fiche cochée par Jordan.
7. **Essai Android complet et équilibrage.** Fin : la durée de jeu et la difficulté conviennent à Jordan.
8. **Décision d'emballage** (section 6).

## 8. Questions ouvertes pour Jordan

1. **KO** : Yarden perd connaissance et se réveille au hub. Que perd-elle ? Idée, pas du canon : le KO coûte une petite dette (au Ch11 du roman, elle est sauvée par Izzy et se retrouve endettée).
2. **XP** : le mode libre a été décidé sans butin, sans vente et sans XP (`PROJECT.md`, section 31). Cette décision est-elle levée pour la boucle ? Le canon donne de l'XP aux kills.
3. **Taille d'un run** : 3 salles et un chef pour commencer, d'accord ?
4. **Scènes du hub** : lesquelles des chapitres 1 à 6 reviennent entre les runs, et dans quel ordre ?
5. **Longueur des textes** : on coupe (moins de répliques) ou on change l'affichage ? Une capture du dialogue sur téléphone aiderait.
6. **Compagnons** : confirmer qu'ils ne combattent pas avant le chapitre 8 (donc pas dans la V1).

## Règles pour les IA (Claude, ChatGPT/Codex)

- Lire `PROJECT.md` puis ce fichier en entier avant toute tâche.
- Une étape à la fois ; ne pas commencer la suivante sans validation de Jordan.
- Ne pas inventer de lore ; poser la question à Jordan.
- Si une demande contredit ce fichier ou `PROJECT.md`, le signaler avant de coder.
- Après chaque étape : mettre à jour le journal de `PROJECT.md` et lancer `node tests/smoke.cjs`.
