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
- Petits changements : une fonctionnalité par commit.
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
| 2 | implémentée, à relire et à valider | Salle fermée, quatre murs et deux blocs neutres solides. Collisions du disque avec les murs et glissement le long des parois. Syntaxe et tests de simulation validés (limites, blocs, diagonales, annulation tactile, 30 000 déplacements aléatoires). Rendu navigateur et test Android à valider. Branche et PR dédiées ; publication après fusion par Jordan. |

