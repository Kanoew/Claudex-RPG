# PROJECT.md — Prototype RPG « Yarden » (Chapitre 1)

> Fichier de contexte. À lire EN ENTIER au début de chaque session, par Claude comme par ChatGPT/Codex.
> Si une consigne de ce fichier contredit une demande orale, on le signale avant de coder.

## 1. Objectif (un mois, test de faisabilité)
Un seul donjon jouable de bout en bout : Yarden y entre, obtient son arme, affronte des ennemis en temps réel, en sort.
Fin de test : soit ce donjon est jouable, soit on sait précisément pourquoi c'est trop lourd. Les deux sont un succès.

## 2. Hors périmètre (interdit pendant le mois)
- Monde ouvert, villes, PNJ, quêtes, inventaire complexe, économie, système de niveaux complet
- Multijoueur, sauvegarde complexe, menus élaborés, traductions
- Tout asset graphique final. Placeholders uniquement (formes simples ou assets libres de droits type CC0)

## 3. Stack (jeu web, jouable sur téléphone)
- Jeu HTML5 : `index.html` + JavaScript + Canvas 2D, vue du dessus
- AUCUN outil de build, aucun npm, aucun framework lourd. Fichiers simples, ouverts directement par le navigateur
- Fichiers prévus : `index.html`, `game.js` (découpés en plusieurs fichiers `.js` seulement si `game.js` dépasse ~500 lignes)
- Publication : GitHub Pages (branche principale, dossier racine). Chaque commit met le jeu à jour, Jordan l'ouvre par un lien sur son téléphone
- Appareil de test principal : téléphone Android (écran tactile). Le clavier reste un contrôle secondaire pour le PC
- Contrôles : joystick virtuel à gauche, boutons à droite (attaque, esquive, capacité), tailles adaptées au pouce
- Version : un seul dépôt, un commit par fonctionnalité qui marche
- Jordan ne programme pas : tout code doit être expliqué en 2-3 lignes, sans jargon inutile

## 4. Design du Chapitre 1 (issu du canon, à valider avant d'élargir)
- Héroïne : Yarden. Départ dans un donjon (Abysse), arme obtenue sur place.
- Arme : une faux manifestée par intention. Invocation gratuite, usage coûte du mana.
- Stats de base : FOR, DEX, AGI, VIT (INT absente du prototype).
- Combat : temps réel. Proposition de départ (à valider) : attaque de base, esquive avec courte invulnérabilité, une capacité qui consomme du mana.
- Ennemis : 2 types maximum + 1 boss de fin de donjon.
- Ambiance d'Abysse bas niveau : une salle principale, obstacles neutres, peu de créatures.

## 5. Étapes (une seule à la fois, validée par Jordan avant la suivante)
1. Page qui s'affiche sur téléphone + personnage qui bouge avec le joystick virtuel, jeu en ligne via GitHub Pages
2. Salle avec murs et collisions
3. Attaque à la faux (bouton + zone de dégâts)
4. Un ennemi qui poursuit et attaque, avec points de vie
5. Mana + une capacité
6. Esquive
7. Deuxième ennemi
8. Boss
9. Porte de sortie / écran de fin
10. Nettoyage et bilan

## 6. Règles pour les IA
- Une étape à la fois. Ne jamais coder l'étape suivante sans validation.
- Exception autorisée par Jordan pour cette livraison : étapes 6 et 7 regroupées dans une même PR, avec un commit distinct par étape. Les étapes suivantes restent soumises à validation.
- Jordan autorise ensuite les étapes 8, 9 et 10 dans une même PR, avec un commit par étape : boss, sortie, puis nettoyage et bilan. Cette autorisation reste limitée au prototype décrit ici.
- Petits changements : une fonctionnalité par commit.
- À chaque modification de `game.js`, augmenter le numéro dans son URL de chargement dans `index.html` (`game.js?v=3`, puis `?v=4`, etc.). Le numéro doit être supérieur à celui de la version précédente, même pour un correctif au sein d’une même étape : le navigateur recharge ainsi le script actualisé après ouverture ou actualisation de la page, sans vider le cache manuellement.
- Appliquer aussi ce principe aux fichiers JavaScript extraits : `enemies.js` est chargé avant `game.js`, avec une URL versionnée.
- Aucune attribution automatique : pas de mention « Co-authored-by », « écrit avec Codex / ChatGPT / Claude », ni de signature ou de crédit d’IA dans les messages de commit, descriptions de PR, le code ou l’interface. Cette règle s’applique à tous les outils utilisés sur le projet.
- Après chaque tâche, donner : (a) les fichiers touchés, (b) comment tester sur téléphone (« ouvre le lien, fais X, tu dois voir Z »).
- Ne pas ajouter de bibliothèque ou de dépendance sans demander.
- Le jeu doit rester fluide sur téléphone : pas de calculs lourds, pas d'images énormes.
- En cas d'erreur signalée par Jordan : expliquer la cause en une phrase, puis corriger.
- Ne jamais réécrire un fichier entier « pour nettoyer » sans demande.
- Mettre à jour le journal (section 8) à la fin de chaque étape.

### Travail à plusieurs IA (Codex + Claude Code)
- Une seule IA travaille à la fois sur une étape, sinon leurs changements entrent en conflit.
- Chaque tâche = une branche (`codex/etape-2`, `claude/etape-2`). Personne ne pousse directement sur `main`.
- Codex écrit une étape ; Claude Code la relit ensuite : « Relis la branche `codex/etape-2` par rapport à `PROJECT.md`, corrige seulement les vrais bugs ».
- Jordan teste sur téléphone, puis fusionne lui-même dans `main` (Create PR, puis Merge). GitHub Pages publie `main` : c'est la fusion qui met le jeu à jour.
- Celui qui termine met à jour le journal (section 8).

## 7. Rôles
- Codex / ChatGPT : écrit le code et commit dans le repo
- Claude : relit chaque commit (bugs, cas oubliés, écarts avec ce fichier) et rapporte à Jordan
- Jordan : teste sur téléphone, valide, décide de passer à l'étape suivante

## 8. Journal (à compléter après chaque étape)
| Étape | Statut | Notes / bugs connus |
|---|---|---|
| 1 | validée par Jordan | Jeu publié sur GitHub Pages ; déplacement testé et jouable sur téléphone. |
| 2 | passage à l’étape 3 validé par Jordan | Salle avec murs et collisions fusionnée ; ajout de `?v=2` après un ancien script conservé en cache. |
| 3 | passage à l’étape 4 validé par Jordan | Attaque à la faux fusionnée ; bouton tactile, Espace et zone de contact. Script `?v=3`. |
| 4 | passage à l’étape 5 validé par Jordan | Premier ennemi fusionné : poursuite, contournement, coups annoncés, PV et relance du duel. Script `?v=5`. |
| 5 | passage aux étapes 6 et 7 validé par Jordan | Valeurs de test : 30 mana, régénération de 3/s pendant le duel ; Faux coûte 3 mana. Capacité provisoire Fauchage : bouton tactile et touche E, coût 12 mana, deux dégâts, portée 110 pixels, récupération de 2,5 s et verrou commun de 0,8 s. Secteur bleu, coûts affichés et boutons grisés si indisponibles. Mana et récupérations réinitialisés à la relance. Tests logiques validés : coûts, seuils, régénération plafonnée, dégâts uniques, récupérations, murs, multitouch, clavier, pause et relance. Rendu navigateur et Android à valider. Script `?v=7` après correction d’un arrondi au seuil de mana. Publication après fusion par Jordan. |
| 6 | passage aux étapes 8–10 validé par Jordan | Esquive gratuite : bouton tactile ou Maj, direction du déplacement ou du regard à l’arrêt ; durée et invulnérabilité de 0,2 s, vitesse de 500 pixels/s et récupération de 1,1 s. Respecte murs et blocs, interrompt le coup courant et interdit de frapper pendant l’esquive. Tests logiques validés ; rendu Android à vérifier. Script `?v=8`. |
| 7 | passage aux étapes 8–10 validé par Jordan | Deux types simultanés : rôdeur rose de 3 PV et chargeur carré jaune de 2 PV. Charge annoncée 0,55 s par une ligne orange, direction figée, vitesse de 420 pixels/s pendant 0,32 s et récupération de 1,8 s. Murs et blocs arrêtent la charge ; reprise de poursuite après un choc. Un impact maximum par charge, esquivable. Faux/Fauchage touchent chaque cible une seule fois par coup ; fin du duel après les deux morts. Logique des ennemis extraite dans `enemies.js` car l’ajout dépassait 500 lignes. Deux scripts `?v=11`. Tests logiques : collisions et poursuite près des obstacles, charge, invulnérabilité, multi-cibles, morts et relance ; rendu réel et Android à valider. |
| 8 | implémentée, à relire et à valider | Gardien provisoire : 8 PV, rayon 24, vitesse 65 pixels/s. Apparaît à distance sûre après les deux gardes, avec une pause de 1,2 s. Attaque de zone de rayon 105, annoncée 0,8 s (0,6 s à mi-vie), deux dégâts, récupération de 2,1 s. Esquive et obstacles respectés. Tests logiques validés : apparition, annonce, dégâts, mi-vie, esquive, poursuite et relance. Scripts `?v=12`. |
| 9 | implémentée, à relire et à valider | Entrée au sud, faux à manifester gratuitement sur place ; les ennemis attendent la prise de l’arme. Gardes puis Gardien, puis ouverture de la porte au nord. Traverser la porte verte déclenche l’écran de fin. Mort ou victoire permettent de recommencer tout le donjon. Progression et décor simple dans `dungeon.js`. Tests de parcours logique validés, test réel Android restant. Scripts `?v=13`. |
| 10 | implémentée, bilan Android à compléter | Nettoyage ciblé des styles et de la remise à zéro des impacts ; pause à la perte de focus, chronomètre de jeu et résumé de fin, barre de PV du boss lisible. Guide dans `README.md`, état et essais restants dans `BILAN.md`, sept scénarios logiques sans dépendance dans `tests/smoke.cjs`. Syntaxe et tests réussis ; rendu réel, fluidité, équilibrage et parcours complet Android à valider. Scripts `?v=14`. |

