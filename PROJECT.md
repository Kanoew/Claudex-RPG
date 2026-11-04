# PROJECT.md — « Le Sang de Tiamat » (RPG narratif Yarden)

> Fichier de contexte. À lire EN ENTIER au début de chaque session, par Claude comme par ChatGPT/Codex.
> Si une consigne de ce fichier contredit une demande orale, on le signale avant de coder.

## État actuel (4 novembre 2026)

- **Le jeu** : RPG narratif en Canvas 2D (HTML, JavaScript, GitHub Pages), jouable sur téléphone. Chapitres 1 à 6 jouables d'un bout à l'autre, mode libre (failles au hasard) après la fin, sac et crédits, points de VIT, sauvegarde par points de passage dans le navigateur. Combat en temps réel.
- **Décors** : dessinés en code par défaut, remplacés par des décors peints (GPT) quand l'image existe : rue du quartier (nuit et jour), Sous-gare, Marterey, ruelle, square, Flon (`decors.js`, `assets/decors/`). Les autres zones sont à brancher une à une.
- **Pas dans le jeu** : chapitres 7 à 9 (canon aux sections 37 et 38, images prêtes dans `assets/npcs/ch7-9/`), musiques en fichier (la musique en code joue en attendant), tour par tour.
- **Archivé** (branches, rien de perdu) : `archive/roguelite-v1` (essai de roguelite : runs, récompenses, boutique), `archive/anciens-packs` (anciennes images de travail).
- **Où lire quoi** : règles et canon dans ce fichier ; historique dans `docs/JOURNAL.md` (inutile en début de session) ; textes du jeu dans `docs/TEXTES.md` (généré) ; commandes d'images dans `docs/COMMANDES-*.md`.

## Règle de style des personnages (décidée avec Jordan le 29 octobre 2026)

- **Chibi** (grosse tête, corps court, trait épais, aplats) pour les **personnages nommés qui comptent dans l'histoire** : Yarden, Ishara et, plus tard, d'autres personnages récurrents.
- **Semi-réaliste simple** (trait sombre épais, aplats, peu de détails) pour les **monstres**. Nouvelle livraison demandée : les deux hommes anonymes de la ruelle et les deux danseurs sont désormais en **chibi**, à la même échelle que Yarden ; leurs anciennes silhouettes semi-réalistes servent seulement de référence de tenue.
- Ainsi, à l'écran, le regard va vers ce qui est chibi. Les figurants restent génériques et secondaires (les deux hommes de la ruelle) et les monstres gardent leur style validé.
- Tailles de référence (Yarden = 1,0) : Ishara environ 1,05 ; le grand environ 1,4 et le compact environ 1,17 ; gobelin 0,9, ogre 1,25, Troll environ 2,0.
- Avant de produire de nouvelles images, vérifier à quelle catégorie appartient le personnage.

## Cadre canonique — identité, ton et apparence (précisions du 28 octobre 2026)

Ces consignes de Jordan priment sur les anciennes hypothèses de conception. Le jeu adapte le roman dark fantasy **Le Sang de Tiamat**. Ne pas inventer de lore manquant : demander à Jordan.

- **Un seul personnage, deux noms.** Jordan est son vrai nom dans le roman et sa voix intérieure : ancien boss de donjon millénaire, tué puis réincarné sur Terre en jeune femme humaine par Tiamat. Pour être protégée de ce qui l’a tuée, elle prend la fausse identité **Yarden Weiss, 22 ans**.
- **Dans le jeu, à l’écran et dans le code : Yarden, elle.** Ne jamais afficher son ancien nom au joueur. L’explication ci-dessus est une note interne de conception, pas un texte à révéler dans la scène. Dans ce document, les mentions de Jordan comme auteur, testeur et propriétaire du projet désignent l’utilisateur.
- **Ton :** dark fantasy mature et sobre, sans humour lourd. Yarden est froide, observatrice, cynique par petites touches et parle peu.
- **Visage et cheveux :** yeux bleu-gris, peau pâle, cheveux noirs avec mèches gris-lavande réunis en gros chignon désordonné, lunettes rondes dorées, maquillage violet sombre.
- **Tenue :** veste noire courte à détails argentés, crop top noir, pantalon cargo noir, bottes épaisses. Aucun collier, aucune boucle d’oreille.
- **Asymétrie :** un seul gant noir sans doigts, sur la main **gauche anatomique**. Main **droite nue**, avec des plumes tatouées. Ne pas retourner les sprites pour fabriquer l’autre direction.
- **Arme :** faux manifestée par intention ; « pas de dégâts de départ, juste un effet de coup ». Cette précision est conservée telle quelle ; aucune valeur de combat existante n’est modifiée par cette mise à jour documentaire.

## 1. Objectif (un mois, test de faisabilité)
Un seul donjon jouable de bout en bout : Yarden y entre, obtient son arme, affronte des ennemis en temps réel, en sort.
Fin de test : soit ce donjon est jouable, soit on sait précisément pourquoi c'est trop lourd. Les deux sont un succès.

> **État (phase 1 terminée, phase 2 en préparation) :** le donjon du prototype est jouable de bout en bout sur Android (conclusion de Jordan : jouable, mais l'interface et le décor sont à améliorer). La suite est décrite en section 9, qui prime sur les sections 1 et 2 pour ce qu'elle autorise.

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
- Arme : faux manifestée par les tatouages. Invocation et coup de base gratuits (confirmation de Jordan le 29 octobre 2026) ; Fauchage coûte 20 mana.
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
- Phase 2 : Jordan autorise les étapes 11 et 12 ensemble, avec un commit par étape. L’étape 13 reste réservée à sa prochaine session ; aucun sprite n’est ajouté ici.
- Suite autorisée par Jordan dans cette session : reprendre les actions de l’araignée, préparer la deuxième salle et son combat, et placer deux habitants dans la ruelle existante. Les identités de ces personnages restent à préciser : deux silhouettes de passants sans dialogue servent de préparation. Godot reste un apprentissage séparé pour plus tard.
- Petits changements : une fonctionnalité par commit.
- À chaque modification de `game.js`, augmenter le numéro dans son URL de chargement dans `index.html` (`game.js?v=3`, puis `?v=4`, etc.). Le numéro doit être supérieur à celui de la version précédente, même pour un correctif au sein d’une même étape : le navigateur recharge ainsi le script actualisé après ouverture ou actualisation de la page, sans vider le cache manuellement.
- Appliquer aussi ce principe aux fichiers JavaScript extraits : `enemies.js` est chargé avant `game.js`, avec une URL versionnée.
- Aucune attribution automatique : pas de mention « Co-authored-by », « écrit avec Codex / ChatGPT / Claude », ni de signature ou de crédit d’IA dans les messages de commit, descriptions de PR, le code ou l’interface. Cette règle s’applique à tous les outils utilisés sur le projet.
- Après chaque tâche, donner : (a) les fichiers touchés, (b) comment tester sur téléphone (« ouvre le lien, fais X, tu dois voir Z »).
- Ne pas ajouter de bibliothèque ou de dépendance sans demander.
- Le jeu doit rester fluide sur téléphone : pas de calculs lourds, pas d'images énormes.
- En cas d'erreur signalée par Jordan : expliquer la cause en une phrase, puis corriger.
- Ne jamais réécrire un fichier entier « pour nettoyer » sans demande.
- Mettre à jour le journal (`docs/JOURNAL.md`) à la fin de chaque étape.

### Travail à plusieurs IA (Codex + Claude Code)
- Une seule IA travaille à la fois sur une étape, sinon leurs changements entrent en conflit.
- Chaque tâche = une branche (`codex/etape-2`, `claude/etape-2`). Personne ne pousse directement sur `main`.
- Codex écrit une étape ; Claude Code la relit ensuite : « Relis la branche `codex/etape-2` par rapport à `PROJECT.md`, corrige seulement les vrais bugs ».
- Jordan teste sur téléphone, puis fusionne lui-même dans `main` (Create PR, puis Merge). GitHub Pages publie `main` : c'est la fusion qui met le jeu à jour.
- Celui qui termine met à jour le journal (`docs/JOURNAL.md`).

## 7. Rôles
- Codex / ChatGPT : écrit le code et commit dans le repo
- Claude : relit chaque commit (bugs, cas oubliés, écarts avec ce fichier) et rapporte à Jordan
- Jordan : teste sur téléphone, valide, décide de passer à l'étape suivante

## 8. Journal

Déplacé dans [`docs/JOURNAL.md`](docs/JOURNAL.md) (notes datées et tableau des étapes). Ne pas le lire en début de session. Ajouter les nouvelles lignes là-bas.

## 9. Phase 2 : habillage et première zone extérieure (proposée, à valider par Jordan)

### Constat de départ
- Le donjon est complet : entrée, faux, deux types d'ennemis, Gardien, porte, écran de fin. 8 scénarios logiques passent (`node tests/smoke.cjs`). Détails dans `BILAN.md`.
- Points faibles relevés par Jordan : interface peu lisible (ligne de statut longue, boutons basiques), décor en blocs gris, personnage et ennemis en formes simples.
- Le mode `?debug` (à ajouter à la fin du lien du jeu) affiche l'état interne. Il sert à diagnostiquer un blocage sur téléphone.

### Décisions
- On reste sur le jeu web (HTML, JavaScript, Canvas 2D, GitHub Pages). Godot 4 n'est pas nécessaire pour des sprites ni pour un décor habillé. On rouvre la question à la fin de la phase 2, seulement si on veut plusieurs salles, une vraie carte, du son ou un export Android.
- Les images sont autorisées dans un dossier `assets/` : PNG avec fond transparent pour les sprites, formats légers (viser moins de 100 Ko par image, moins de 1 Mo au total pour la phase). Toujours prévoir un affichage de secours en formes simples si une image ne se charge pas.
- Les illustrations de Yarden de Jordan (pleine hauteur, 4 vues, 8 expressions) ne vont pas telles quelles dans le jeu : elles servent de référence et de portraits (écran de fin, futurs dialogues). Le sprite en jeu est une version réduite, vue du dessus ou de trois quarts.
- Le décor ne change pas la logique : murs, blocs et collisions restent des rectangles, seul le dessin évolue.
- Monstres (canon fourni par Jordan) : le Rôdeur devient le **gobelin éclaireur** (niveau 8 à 12), le Chargeur devient l'**ogre** (un des jumeaux, niveau 25) et le Gardien devient le **Troll** (niveau 32, pierre vivante, peau grise, yeux jaunes, environ 3 m). L'araignée de cristal (niveau 41) fait l’objet d’une première version jouable simplifiée dans la deuxième salle (voir section 10) ; son tir de venin et la ruse restent à valider sur Android. Le canon ne donne aucun physique aux ogres et aux gobelins : leur apparence (gobelin bleu-gris, ogre rouge brique) est un choix de design provisoire, à corriger si la bible dit autre chose. Les monstres n'ont pas de détail asymétrique canon : leurs sprites sont dessinés vers la gauche et le jeu les retourne. Style des monstres : volontairement plus réaliste que le chibi de Yarden, validé par Jordan.
- **Obsolète depuis :** le sac, les crédits, la dette, les niveaux, les points de VIT et la sauvegarde par points de passage existent maintenant (voir le journal). Toujours interdits : monde ouvert, multijoueur. Les PNJ restent limités à Ishara et aux deux hommes de la scène du chapitre 2, sans dialogue canon inventé ni quête. Ajoutés comme autorisés : images dans `assets/`, découpage de `game.js` en plusieurs fichiers au-delà de ~500 lignes.
- Les règles de la section 6 restent valables (une étape à la fois, branche par tâche, numéro de version des scripts, aucune mention d'IA dans les commits, PR et fichiers).

### Canon utile pour la suite (résumé fourni par Jordan, issu de la session d'écriture du chapitre 1 ; la bible et le chapitre publié font foi)
- **L'entrée de l'Abysse** n'est pas un bâtiment : c'est une faille qui s'ouvre sans prévenir dans le mur de briques d'une ruelle étroite d'Helvara (bitume, murs de briques), une nuit d'été, sous un ciel étouffé par les lumières de la ville, à environ trente mètres d'une résidence universitaire où une fête bat son plein. La faille est une déchirure verticale en forme de bouche, aux bords luminescents d'un bleu profond, qui aspire l'air avec un bruit sourd. Les humains ne la voient pas. À l'intérieur, l'Abysse est un niveau 38 fait de cristal noir. La faille se referme au bout d'un temps limité (« huit minutes » annoncées à la fin du combat). À la fin, le héros perd connaissance dans l'Abysse et se réveille dans la ruelle.
- **L'araignée de cristal** (niveau 41) est le grand combat du chapitre : très rapide, silencieuse, territoriale (elle ne suit pas hors de son antre), huit pattes et huit yeux à paupières de cristal, carapace de cristal, vibration infrasonore qui fait mal aux dents, fil de venin à vitesse balistique (neurotoxine qui court-circuite les circuits de mana : paralysie complète en environ quatre minutes). Le héros perd à chaque échange (pattes, venin, côtes), puis gagne par la ruse : poudre de cristal noir lancée dans les huit yeux quand elle franchit la frontière de ses fils, auto-chirurgie pour percer le « bouchon » de venin, puis lame lancée avec tout le mana restant dans la membrane molle de la bouche. Elle est incapacitée, pas morte.
- **Pistes pour une araignée jouable** (première adaptation simplifiée en section 10, détails encore à valider par Jordan) : un fil de venin à distance qui ralentit ou paralyse, une zone d'antre qu'elle ne quitte pas, des vibrations qui annoncent une attaque, une phase où l'on gagne par la ruse (poudre de cristal dans les yeux) plutôt que par les coups seuls. Le Troll reste le boss de la première salle ; l’araignée occupe la deuxième salle dans cette adaptation.

### Étapes (une seule à la fois, validée par Jordan)
Ordre voulu : d'abord ce qui rend le jeu agréable, ensuite ce qui l'agrandit.

| # | Étape | Contenu | Critère de validation sur téléphone |
|---|---|---|---|
| 11 | Interface | Barres de PV et de mana à la place de la ligne de texte, objectif court, boutons plus lisibles, Gardien visible dès son apparition | Tout se lit d'un coup d'œil, sans chercher |
| 12 | Décor de la salle | Sol en dalles, murs et blocs habillés (pierre, piliers, rochers), voile sombre autour de Yarden, porte d'entrée et de sortie dessinées. Images libres de droits (CC0) ou fournies par Jordan | La salle ressemble à un donjon, les collisions n'ont pas changé |
| 13 | Sprite de Yarden | Petit sprite : 4 directions, marche à 2 images, coup de faux. Disque conservé comme secours | Yarden se reconnaît et reste lisible en combat |
| 14 | Sprites des ennemis | Rôdeur, chargeur, Gardien, avec leurs annonces d'attaque toujours lisibles | On identifie chaque ennemi et son attaque sans lire le texte |
| 15 | Structure en zones | Le jeu lit ses salles dans une liste de données (taille, murs, portes), sans nouveau contenu : le donjon actuel doit jouer à l'identique | Aucun changement visible, les tests passent |
| 16 | Zone extérieure | Une seule zone dehors, reliée à la sortie du donjon : décor, quelques obstacles, au plus un type d'ennemi existant, pas de PNJ ni de quête | On sort du donjon, on explore, on peut revenir ou finir |
| 17 | Bilan phase 2 | Fluidité mesurée sur téléphone, poids des images, décision sur Godot | Conclusion écrite dans `BILAN.md` |

La zone extérieure vient en dernier et en deux temps (structure, puis contenu) : elle change la façon dont le jeu stocke ses salles, donc on ne la mélange pas avec l'habillage.

### Rôles pour la phase 2
- Jordan : fournit ou génère les images (sprite réduit, tuiles), teste sur téléphone, valide chaque étape et fusionne.
- Codex / ChatGPT ou Claude Code : une seule IA par étape, branche dédiée, relecture croisée avant fusion, comme en section 6.
- Les images produites par Jordan sont à nommer simplement (`yarden-bas-1.png`, `sol.png`, …) et à lister dans `README.md`.

### Journal de la phase 2

Voir [`docs/JOURNAL.md`](docs/JOURNAL.md).

## 10. Suite — antre de l’araignée et réveil dans la ruelle

Jordan confirme que le jeu tourne bien sur son Android. Cela confirme son essai de fonctionnement, sans mesure de fréquence d’images. Il souhaite préparer l’araignée et deux habitants de la ruelle avant son apprentissage de Godot.

Première interprétation jouable du canon, à relire et à valider :
- La porte après le Troll conduit à une deuxième salle (`zones.antre`), avec deux piliers et un territoire limité. Le retour est libre avant de franchir les fils, puis fermé pendant la rencontre.
- Un court texte avec « Continuer » introduit le combat. Le temps, les déplacements et les attaques sont suspendus pendant ce texte ; les contrôles sont remis à zéro à sa fermeture.
- L’araignée annonce sa direction de tir pendant 0,9 s, puis émet un fil de venin rectiligne à 460 px/s. Il est bloqué par les piliers et peut être esquivé. Un impact retire 1 PV et ralentit à 70 % pendant 3 s. Ces valeurs sont provisoires : ce ralentissement ne reproduit pas la paralysie en quatre minutes du chapitre.
- Les coups seuls ne percent pas la carapace. Le joueur s’approche du cristal noir et utilise le bouton « Cristal » ou F pour aveugler l’araignée 5 s, puis l’atteint avec Fauchage pendant cette ouverture. L’usage du cristal peut être retenté après l’expiration de l’ouverture, sans inventaire.
- L’araignée reste vivante et immobilisée (1 PV). Yarden tombe, un texte accompagne la perte de connaissance, puis le joueur poursuit dans la ruelle existante. La faille est alors fermée. Il n’y a pas de défaite automatique au terme d’un timer : l’issue suit ici la victoire par la ruse du canon.
- Une mort ordinaire dans l’antre permet de reprendre à l’entrée de cette salle, avec 5 PV et 30 mana, sans refaire le Troll. Le temps de jeu total reste cumulé ; le combat de l’antre est réinitialisé.
- Les deux silhouettes provisoires (`npc.js`) ont été supprimées : la ruelle accueille la scène du chapitre 2 (`scene.js`, voir journal, étape 16b).

Limites de ce premier raccordement : pas de système d’inventaire, pas de poudre ciblant séparément les huit yeux, pas de simulation d’auto-chirurgie ni de lame lancée à distance. Le cristal et Fauchage représentent la ruse avec les commandes existantes. Les deux textes de transition sont de simples résumés des événements, pas des citations du chapitre. Le déroulement détaillé et les valeurs de combat restent à ajuster avec Jordan.

| Travail | Statut | Vérifications |
|---|---|---|
| Actions de l’araignée | préparées et raccordées | Bande transparente de neuf cases : quatre marches, préparation, tir, dégâts, aveuglement, incapacitation. Découpe et repère au sol dans `assets/monsters/monsters.json`. Aspect et continuité à valider sur téléphone. |
| Deuxième salle et bataille | première version jouable, à relire | Vingt scénarios logiques passent, dont venin continu/murs/esquive, territoire, récit figé, ruse et réveil, reprise de l’antre. Chromium charge les images et traverse le récit, la ruse, l’incapacitation et le réveil sans exception JavaScript ; affichage contrôlé en portrait et paysage. Cela ne remplace pas Android. |
| Rencontre de la ruelle | intégrée, à valider sur Android | Ishara et deux hommes anonymes dans `scene.js` ; sources complémentaires de mouvement et de repos encore à raccorder. |

## 11. Ruelle — Ishara et les deux hommes (précisions de Jordan)

Ces précisions concernent la rencontre du chapitre 2. La bible et le texte publié restent les références. Elles remplacent l’hypothèse de deux simples passants pour la conception de cette scène : **Ishara et deux hommes anonymes** sont trois personnages distincts. La scène est désormais raccordée dans `scene.js` (étape 16b). Les sources complémentaires de course verticale et de pose immobile ne sont pas encore exportées pour le jeu.

### Ishara, au moment de la rencontre
- Niveau 11, éveillée depuis environ six mois, quelques runs en groupe, aucune guilde.
- Joyeuse, directe et bavarde, avec une prudence réelle derrière son énergie ouverte. Elle évalue vite, n’est pas naïve et respecte les limites posées.
- Elle court depuis un moment, essoufflée. Sa peur est visible dans son état et son regard, sans être formulée dans ses paroles. Elle s’excuse en passant et part dans la direction opposée à la fête.
- Tenue de soirée : courte robe noire à fines bretelles, ourlet haut, longues jambes ; cheveux mi-longs châtain foncé légèrement défaits ; petites boucles d’oreilles argentées ; sac à bandoulière compact, serré trop fort à l’arrêt.
- Maquillage légèrement abîmé : eyeliner, rouge à lèvres un peu étalé à un coin de la bouche, mascara descendu d’environ un millimètre sous l’œil droit anatomique. Les yeux ne sourient pas, même quand la bouche s’ouvre.
- Elle habite au troisième étage d’un appartement du quartier étudiant, jamais Sous-gare. Sa colocataire Céleste est absente à ce stade.
- La tenue de combat est réservée à plus tard : jean sombre dans des boots à semelle épaisse, blouson léger sur t-shirt uni sombre, petit sac à dos, queue haute sans mèches libres, courte dague en acier renforcé de mana à la ceinture. Ne pas utiliser cette tenue pour la rencontre de rue.

**Informations de conception, à ne pas révéler dans les textes ou effets de cette scène :** sa bénédiction de support défensif passif apporte de la résilience dans un rayon de 5 m, avec un léger shimmer doré, et n’est pas encore déclarée. Son « bon instinct pour les gens » est une corde de témoin : quelqu’un regarde par ses yeux, révélation du chapitre 3. Cela la pousse à faire confiance à Jordan et à l’héberger. Ne pas ajouter de symbole dans ses yeux ni d’annonce de ce secret ; la première référence visuelle de rue reste sans effet de bénédiction.

### Les deux hommes anonymes
- Le grand porte une veste de club trop grande ; sa démarche tangue légèrement à droite.
- Le compact affiche une fausse assurance dans les épaules, qui compense son état.
- Niveaux 3 et 5 au maximum, non éveillés, alcoolisés, « avec une idée fixe ». Ils restent ordinaires, sans allure de prédateurs sophistiqués ni de nouveaux boss.
- Le texte ne précise ni visage, ni coiffure, ni couleur, ni nom. Toutes ces décisions visuelles restent des propositions, sans valeur canonique avant validation de Jordan.
- Fin de la scène du texte : le personnage principal tord le poignet de l’un (« géométrie articulaire ») et dit « Elle est pas intéressée ». Dans l’adaptation, elle se nomme Yarden. Le grand part le premier, le compact suit en marmonnant. Le raccordement jouable de cette scène reste à réaliser, sans réplique supplémentaire inventée.

### Cadrage et lieu
Un coin de trottoir sous un lampadaire éteint, dans un cul-de-sac partiel : façade aveugle à gauche, grille fermée à droite. C’est le décor de cette rencontre ; ne pas déplacer toute la ruelle existante pour lui correspondre sans définir le raccordement. Dans une poursuite, garder les hommes génériques, peu détaillés et secondaires à l’image. Ishara concentre l’attention.

### Première proposition de design (à valider)
Référence de travail dans `docs/art/ruelle/`, sans chargement dans le jeu. Ishara garde sa tenue de soirée. Les hommes ont des palettes discrètes et des silhouettes contrastées : veste bleu-gris trop grande pour le grand, veste brun-charbon pour le compact. Coiffures sombres simples, chaussures et traits génériques sont des choix de travail. La couleur des yeux et les chaussures d’Ishara, non précisées par le lore fourni, restent elles aussi provisoires. Pas de noms ajoutés, pas d’arme pour les hommes, pas de tenue de combat ni d’effet magique pour Ishara.

Le lien entre les deux noms est désormais précisé dans le cadre canonique en tête de document. Le travail continue sur les mouvements réutilisables d’Ishara, qui restera présente dans la suite de l’histoire. La scène a depuis été intégrée à l’étape 16b ; ne pas ajouter de nouvelle réplique au canon fourni.

### Version chibi d'Ishara et deux hommes (29 octobre 2026)
Ishara est passée en **chibi**, comme Yarden (règle de style en tête de document). Nouveau pack dans `assets/npcs/ishara/chibi/` : sept bandes de quatre cases de 86 × 115 px, ancrées en (43, 111), même grossissement pour toutes, hauteur debout d'environ 1,05 fois Yarden, environ 65 Ko avec le manifeste `animations.json`. Les directions sont dessinées séparément. Le pack semi-réaliste ci-dessous est remplacé et gardé en attendant la validation de Jordan ; ne plus s'en servir.

Les **deux hommes** sont dans `assets/npcs/hommes/` (`grand.png` et `compact.png`, cases de 134 × 151 px, ancrées en (67, 147), quatre pas de marche vers la gauche et un recul déséquilibré, manifeste `hommes.json`). Ils sont semi-réalistes et simples, sans nom ni arme ; le grand mesure environ 1,4 fois Yarden et le compact environ 1,17. Ils peuvent être retournés. Les sources vertes des deux hommes et d'Ishara sont conservées dans `docs/art/ruelle/hommes/` et `docs/art/ruelle/chibi/` (environ 16 Mo) : décision de Jordan, pour retrouver les originaux depuis le dépôt si son dossier local est perdu. Ishara chibi et les deux hommes sont branchés dans `scene.js` depuis l’étape 16b. Les nouvelles courses verticales et poses immobiles restent à exporter et à raccorder.

### Mouvements préparés pour Ishara
Premier pack de soirée dans `assets/npcs/ishara/soiree/` : repos avec respiration et clignement, marche dans les quatre directions et course à gauche/droite. Sept bandes transparentes de quatre images (28 cases de 128 × 160, ancrage 64 × 140, environ 71 Kio pour les PNG), avec manifeste et aperçu dans `docs/art/ruelle/ishara.html`. Les directions ont été dessinées séparément, sans miroir. Le sac à gauche anatomique est un choix de continuité visuelle encore à valider ; son côté n’est pas fixé par le lore fourni.

Ces ressources préparent sa présence dans la suite de l’histoire, sans lui attribuer le rôle de Yarden et sans déclencher la rencontre. Aspect, cou sans accessoire non canonique, raccords des poses et détails asymétriques restent à valider avant intégration. Les courses de face/de dos ont désormais leurs sources chibi dans `docs/art/ruelle/chibi/` ; leur export et leur raccordement restent à réaliser. La tenue de combat n’est pas encore préparée. Aucun changement du comportement du jeu dans cette livraison de design et de mouvements.

## 12. Canon de l'antre de l'araignée (fourni par Jordan)

**Canon, à respecter.** Salle de l'araignée, Abysse niveau 38. On y arrive par un long couloir de pierre brute dont les parois sont déjà tapissées de fils de cristal ; la frontière de l'antre est le point où le sol de pierre devient cristal. Caverne naturelle agrandie, très grande, plafond d'environ 15 m ; l'araignée traverse 20 m en moins de 2 s, donc au moins 20 m de profondeur. Murs entièrement recouverts de fils de cristal noir : des câbles tendus entre les parois, épais comme un pouce, translucides, avec du mana pur qui circule lentement (comme un flux sanguin), tous convergents vers l'araignée au centre. Espacement : environ 50 cm entre les plus écartés, 30 cm entre les autres ; certains à hauteur de chevilles, d'autres de poitrine ; toucher un fil prévient l'araignée. Les parois de sa zone ne sont pas du cristal d'Abysse normal mais de l'excrétion solidifiée : elle a refait les murs depuis 19 ans. Sol de cristal noir, avec le long des murs une couche d'environ 30 cm de poudre de cristal noir (sable et cendre). Aucune source de lumière visible : les fils captent la lumière et la redistribuent en milliers de reflets froids ; dominante noire, froide, sans couleur chaude. Mana épais et « collant ». Au centre : l'araignée, environ 2 m au garrot, corps de cristal noir translucide (organes en ombre), huit yeux en arc, pattes qui effleurent à peine le sol, qui ne dort jamais. Vibration infrasonore qui fait trembler les murs et résonner tous les fils.

**Non canon, adaptation de jeu.** Les piliers de pierre du roman sont dans la salle du Troll, pas dans l'antre : ceux de l'antre sont donc des colonnes de cristal noir, jamais de la pierre. La faille d'entrée au sud est un choix de mise en page : dans le roman, la sortie de l'Abysse est loin de l'antre.

**À demander à Jordan, sans l'inventer.** Couleur exacte des reflets ; forme précise des colonnes.

Réponses de Jordan : les reflets restent en blanc bleuté très pâle ; les colonnes restent des pointes de cristal noir, plus larges à la base, de hauteurs variées, avec deux ou trois facettes plus claires. La vibration infrasonore n'est pas une attaque : elle se produit quand l'araignée est touchée ou aveuglée (câbles qui résonnent ensemble) ; le tremblement d'écran reste très léger et court. Détail canon à garder pour plus tard : toucher un fil prévient l'araignée avant même que le pied quitte le sol, ce qui pourrait devenir une alerte de jeu (non décidé).

## 13. Canon de l'ouverture du jeu (chapitre 1, fourni par Jordan)

**Nom.** À l'écran, le personnage s'appelle Yarden, « elle ». Ne jamais afficher « Jordan ».

**Canon.** Elle se réveille de nuit dans une ruelle d'Helvara, adossée à un mur. Une fête bat son plein dans une résidence étudiante à environ 30 m (musique, rires). Les gens ne la voient pas. Elle est niveau 1, dans un corps qu'elle ne connaît pas (plus petit, voix plus haute), avec une mémoire de combat fragmentée : elle comprend vite, mais pas tout. Une chaîne fine avec un pendentif de dragon et une pierre bleue marbrée qui pulse est autour de son cou : c'est le canal de Tiamat. Tiamat parle en voix intérieure : froide, calme, légèrement amusée, jamais chaleureuse ; elle dit être « partout », pas derrière elle. Une faille s'ouvre dans le mur de briques à environ trois mètres : déchirure verticale en forme de bouche, aux bords bleu profond, qui aspire l'air avec un bruit sourd ; seule Yarden la voit. Tiamat dit l'avoir ouverte, mais que la traverser a été le choix de Yarden ; elle ajoute que l'Abysse est trop dangereux pour une niveau 1 et qu'elle l'accompagne.

**Adaptation pour le jeu.** La ruelle est courte et sert de tutoriel de déplacement : le joueur marche jusqu'à la faille (attiré dedans, ou simple réveil dans la faille : non tranché). Les répliques de Tiamat s'affichent en texte, courtes ; elle parle peu. À la fin du chapitre, Yarden se réveille dans cette même ruelle, transformée.

**Contraintes.** Pas de monstres dans la ruelle, pas de combat. Si une information manque, demander à Jordan.

## 14. Canon du chapitre 2, grandes lignes (fourni par Jordan)

**Prudence de l'auteur** : l'ordre exact de quelques scènes (douche, tatouages, run) a bougé pendant la refonte ; seul ce qui est marqué sûr est à respecter à la lettre.

**Niveau et stats pendant tout le chapitre 2.** Niveau 24, qui ne bouge pas : le run du chapitre 2 ne donne aucun gain d'XP (courbe logarithmique). FOR 20, DEX 18, AGI 12, VIT 5, INT infinie mais au plafond de son niveau ; Yarden a plus de mana que quelqu'un de son niveau. Faux invoquée par les tatouages : invocation et coup de base à coût zéro (confirmation de Jordan le 29 octobre 2026) ; Fauchage coûte 20 mana. Pas d'identité administrative, 0 franc en début de chapitre.

**Déroulé.** 1) Après la ruelle, elle ouvre son interface et découvre les points donnés par Tiamat. 2) La rue : elle suit Ishara et règle l'affaire du poignet (déjà dans le jeu). 3) Le trajet : Ishara explique le monde en marchant (Éveillés, niveaux, failles) ; au seuil de l'immeuble, elle s'arrête pour parler à Tiamat. 4) L'appartement : thé, puis café, courbatures, première nuit. 5) La douche et le miroir : elle voit son visage pour la première fois ; la marque du flanc gauche devient le canal de Tiamat. 6) Les tatouages : ils sont le vecteur de la faux, coût zéro. 7) Premier run en Abysse avec Ishara : 7 créatures de niveau 15 à 19. 8) Vente au comptoir de la rue Marterey : 280 francs (la moitié d'un lot de 560). 9) Direction le 4B pour les papiers : le chapitre se termine devant la porte.

**Appartement d'Ishara.** Immeuble haussmannien un peu fatigué, façade encore belle, cage d'escalier entre charme ancien et humidité, troisième étage, quartier étudiant près du métro. Petit, chaud, en désordre vivant : le contraste voulu avec l'Abysse et la froideur de Tiamat. Salon : plantes au rebord de la fenêtre, pile de livres à la logique d'Ishara, deux tasses sur la table basse (une vide, une à moitié pleine), canapé face à la table basse, comptoir de cuisine ouvert sur le salon, bouilloire visible depuis le canapé, clés jetées sur le comptoir. Chambre d'appoint (celle de la colocataire absente) : première porte à gauche dans le couloir, lit simple, draps propres, placard avec les affaires de la coloc, fenêtre sur cour intérieure, parquet sous un tapis fin. La chambre d'Ishara reste fermée et non décrite. Salle de bain : en face, petite et encombrée par les affaires de deux personnes ; robinet froid pendant 30 s avant d'être chaud ; shampoing violet (Ishara) et rouge (la coloc) ; serviettes sur le radiateur ; miroir au-dessus du lavabo pour la scène du miroir.

**Le 4B (fin du chapitre).** Immeuble Belle Époque « trop normal », façade impeccable, digicode, géraniums au 2e étage. Cour intérieure : pavés sans une herbe, lierre taillé au millimètre, deux arbustes en symétrie parfaite. Escalier de pierre aux marches creusées au centre ; l'air devient plus lourd et plus chargé à chaque étage. Porte du 4B entrouverte, lumière chaude ; papier sur tous les murs, étagères du sol au plafond avec des objets qui ne sont pas que des livres, bocaux de matériaux organiques, crânes (ni décoratifs, ni en résine). L'ensemble « ne vit pas tout à fait de la bonne façon ». La voix de Félix, grave et paisible : « je vous attendais », sans avoir répondu à l'interphone. Le canon situe tout à Lausanne, quartier Sous-gare (la première version disait Paris).

**Abysse du run.** Décor exact non retrouvé. Règle du monde pour un Abysse sous le niveau 20 : une salle plate, des obstacles neutres, un élément d'ambiance, aucune protection sur les carcasses. Référence seulement, pas décor du chapitre 2 : l'Abysse du chapitre 8 est une salle plate, piliers, lumière verte, plafond à quatre mètres.

**Comptoir de la rue Marterey.** Le comptoir au noir de Rémi, avec une ardoise à la craie. Aucun autre détail fourni.

## 15. Canon de l'appartement d'Ishara (chapitre 2, fourni par Jordan)

**Canon, à respecter.** Immeuble haussmannien légèrement fatigué, façade encore belle, cage d'escalier entre charme ancien et humidité, troisième étage, quartier étudiant près d'une ligne de métro. Ambiance petite, chaude, vivante, en désordre « de la bonne façon » (quelqu'un qui habite vraiment les lieux) : le contraste voulu avec l'Abysse et la froideur de Tiamat. Salon : plantes sur le rebord de la fenêtre (c'est par là qu'entre la lumière), pile de livres avec sa logique à elle, deux tasses sur la table basse (une vide, une à moitié pleine), canapé face à la table basse, pas de télé mentionnée, une table que personne n'utilise (on mange debout au comptoir). Cuisine : comptoir ouvert sur le salon, bouilloire visible depuis le canapé, clés jetées sur le comptoir en rentrant. Vue : les toits de Lausanne, qui virent à l'orange sale en fin de journée (bruits : mouette, scooter). Lumière chaude ; en journée, la lumière de juillet tombe en oblique sur le mur du salon. Couloir vers les chambres et la salle de bain ; du canapé, on entend la douche. Chambre d'appoint (celle de la colocataire absente) : première porte à gauche dans le couloir, lit simple, draps propres, placard avec les affaires de la coloc, fenêtre sur cour intérieure, parquet sous un tapis fin ; Yarden y dort la première nuit. Chambre d'Ishara : porte fermée, jamais décrite. Salle de bain : en face de la chambre d'appoint, petite, propre, encombrée par les affaires de deux personnes, robinet qui met 30 s à chauffer, shampoing violet (Ishara) et rouge (la coloc), serviettes sur le radiateur, miroir au-dessus du lavabo : lieu de la scène du miroir.

**Non canon, adaptation de jeu.** Dimensions et plan exact (qui est à gauche ou à droite du salon) : à décider selon le code. Couleurs précises, matière du sol (hors le parquet de la chambre d'appoint), forme du canapé et des meubles : à inventer au minimum, dans une palette chaude. Pas de couleur froide : le bleu est réservé à la faille et à l'Abysse.

## 16. Canon du 4B (chapitre 3, appartement de Félix, quartier Sous-gare ; fourni par Jordan)

**Canon, à respecter.** Immeuble Belle Époque « trop normal » : façade impeccable, digicode, géraniums au 2e étage ; quatrième étage. Cour intérieure : pavés sans une herbe, lierre taillé au millimètre, deux arbustes en symétrie parfaite (l'ordre extérieur sert à tenir sa cohérence). Escalier de pierre, marches creusées au centre ; l'air devient plus lourd et plus chargé à chaque étage. Arrivée : la porte du 4B s'ouvre toute seule, sans réponse à l'interphone, lumière intérieure chaude. Murs couverts de papier punaisé en couches : documents jaunis avec tampons et filigranes, écritures dans des alphabets inconnus. Étagères du sol au plafond : des livres, mais aussi des bocaux contenant des choses qui ont été vivantes. Crânes alignés, propres, tournés vers la pièce « comme un public patient » (ni décoratifs, ni en résine). Au fond, Félix, assis derrière une table de travail couverte d'encriers, de plumes et de lampes à bras articulés éteintes ; il ne se lève pas. Félix : environ 50 ans, cheveux poivre et sel coupés net, chemise grise aux manches roulées, tablier d'artisan taché d'encre, lunettes de lecture remontées sur le front, « posé » comme du mobilier, aucun micro-mouvement de corps vivant. L'appartement vit « pas tout à fait de la bonne façon » : il est lié à Félix, dont il est une part ; il lit les liens (serments, dettes) mais aucun niveau.

**Non canon, adaptation de jeu.** Plan, dimensions, forme de la pièce et matière du sol : à décider selon le code. Tout mouvement des murs ou du papier : le canon n'en décrit aucun ; s'il y en a, très discret et présenté comme un choix de mise en scène.

Note : le chapitre 2 se termine devant la porte du 4B (section 14) ; la scène intérieure avec Félix relève du chapitre 3.

## 17. À fournir par Jordan avant le trajet avec Ishara (étape B)

Le canon donne le déroulé (Ishara explique le monde en marchant : Éveillés, niveaux, failles ; au seuil de l'immeuble, Yarden s'arrête pour parler à Tiamat) mais aucun texte. Pour ne pas inventer de lore, attendre : ce que dit Ishara sur les Éveillés, les niveaux et les failles ; ce que Yarden répond ; ce que Tiamat dit au seuil. Le trajet à jouer (rue, métro éventuel, immeuble) est aussi à préciser.

## 18. Suite D — miroir et tatouages (confirmation du 29 octobre 2026)

Jordan demande un **portrait rapproché du visage** de Yarden, pas une illustration de salle de bain ou de reflet. Ressource transparente préparée dans `docs/art/yarden/miroir/visage.png` : visage de face, yeux bleu-gris, lunettes dorées, cheveux et maquillage selon la fiche visuelle. Elle ne contient ni faux ni tatouages ajoutés au visage. Pas de nouvelle scène écrite : dans l’état actuel, le jeu se termine encore à la rencontre avec Ishara. Le miroir et les tatouages viendront dans la continuité de l’appartement selon la section 14.

**Règle de combat confirmée par Jordan : l’invocation ET le coup de base sont gratuits.** Fauchage conserve son coût de 20 mana. La gratuité ne retire ni la récupération entre les coups ni les règles de dégâts existantes. Le vecteur d’invocation reste les tatouages ; ne pas inventer de mécanisme de tatouage ou de révélation de Tiamat supplémentaire.

Relecture de l’état actuel dans `BILAN.md`, avec les limites de vérification.

## 19. Canon du trajet et de l'arrivée au 4B (fourni par Jordan ; répliques à ajuster)

**Sens des mots (canon).** Niveau : mesure du potentiel brut d'un être ; tout être vivant en a un, mais seuls les Éveillés le voient ; les gens ordinaires vont de 1 à environ 8. Éveillé : quelqu'un qui a reçu une bénédiction divine ou a été exposé à l'énergie des Abysses ; il a l'interface (une fenêtre mentale), perçoit les failles et est bien plus efficace en Abysse qu'un non-éveillé de même niveau. Faille : ouverture qui apparaît au hasard dans le monde ordinaire ; les non-éveillés ne la voient pas et ne peuvent pas y entrer. Abysse : l'intérieur de la faille, espace autonome avec ses créatures, ses ressources et un temps légèrement décalé ; il laisse une trace après le passage, légère à bas niveau. Estimer un niveau : un Éveillé expérimenté lit la pression de l'Abysse (Yarden la sent contre la mâchoire). Valeur : les cristaux, matériaux et pièces se revendent dans le milieu des Éveillés. Vocabulaire : Ishara dit « faille » et « Abysse », jamais « donjon » (mot de Valstygheim, donc de Yarden et de Tiamat).

**Répliques fournies.** Ishara : « Un niveau, tout le monde en a un. Mais nous, on peut le voir. » ; « Une faille, c'est une porte. Les gens normaux passent à côté sans la voir. » ; « Dedans, c'est un autre endroit. Le temps y va un peu de travers. » ; « Ce qu'on ramène, ça se revend. C'est comme ça que je paye mon loyer. » Yarden joue la nouvelle en ville : « T'as fui quelque chose ? » / « On pourrait dire ça. » ; « Tu veux en parler ? » / « Non. » ; réponses de trois ou quatre mots (« D'accord. », « Je vois. », « Continue. »). Sur l'arme : « Ce n'est pas gratuit. Ça consomme du mana. » / « Coût zéro. » / « Je sais. » / « Elle se réinvoque. » (pas encore utilisées). Tiamat au seuil de la fête : « Tu aurais pu entrer. » / « La chaleur humaine… » / « Bien. » ; sur sa forme : « C'est pour ça que j'ai choisi cette forme. Entre autres raisons. » / « Tu n'es pas encore prêt pour les autres raisons. » ; sur son silence : « Je gère effectivement un inventaire limité. » (pas encore utilisées).

**Trajet.** Une marche, puis le métro (ligne M2 de Lausanne, sans noms de stations fournis) : Yarden découvre le métro (« ce fut une expérience »), debout près de la porte, dos à la paroi ; Ishara regarde son téléphone, elles ne parlent pas, mais c'est confortable. Dans le jeu : courte marche et carte « Dans le métro ».

**Devant le 4B (fin du chapitre 2).** Sur le trottoir, devant la façade : Ishara sonne au 4B, la porte se déverrouille sans réponse. Yarden : « T'as l'air bizarre. » ; Ishara : « L'endroit est bizarre. » ; « Félix est excentrique. » ; Yarden : « C'est pas de l'excentricité que je sens. » Son buff frémit un instant, puis Ishara admet : « C'est peut-être un peu bizarre. » Tiamat : « Oui. Je sens. » / « Quelque chose qui vit pas tout à fait de la bonne façon. Pas hostile, juste… décalé. » La cage d'escalier est la scène suivante (voir section 16). Le brouillon plaçait l'immeuble à Paris (19e) : le canon final est Lausanne, Sous-gare.

**Yeux de Yarden : entorse assumée au canon (décision de Jordan).** Le canon du roman est bleu-gris et perçants (prompt du projet, bible personnages v12, chapitre 1 : « Les yeux bleu-gris s'ouvrent »). Dans le jeu, les yeux sont **violets**, comme sur les sprites, le saut de joie et le portrait du miroir (`assets/yarden/visage.png`, source `docs/art/yarden/miroir/visage-yeux-violets.png`) ; à 96 px la différence ne se voit pas et le violet va avec le maquillage et la marque du flanc. Pour le roman, rien ne change. Ne pas « corriger » les yeux du jeu en bleu-gris : c'est volontaire. Dans les textes du jeu, écrire « violets » là où le roman dit « bleu-gris ». L'ancien portrait aux yeux bleu-gris reste dans `docs/art/yarden/miroir/visage.png` comme source.

## 20. Réponses de Jordan sur l'appartement (bible du canon)

Le thé vient en premier : Ishara le propose dès l'entrée et Yarden le prend noir (« Thé ? », « Lait ? Sucre ? », « Noir. », « Femme de goût. »). Le café et les courbatures viennent au matin (placement exact non retrouvé). Au récapitulatif du chapitre 2, la nuit se passe sur le parquet, pas dans le lit : la raison n'est pas connue, ne pas l'inventer (la chambre d'appoint a un parquet sous un tapis fin). La scène du miroir ne passe pas avant le thé ; elle tombe probablement le matin, avant la sortie. Ishara est au maximum de ce qu'elle est dans l'appartement : bavarde, directe, chaleureuse. Répliques fournies : « La chambre en trop, c'est la première à gauche. Y'a des trucs dans le placard si t'as besoin, ma coloc met des années à récupérer ses affaires. » ; « Salle de bain en face. Le robinet froid met trente secondes à devenir chaud, c'est normal. » Elle jette ses clés sur le comptoir et lance une serviette sans vérifier si Yarden l'attrape (il l'attrape). Au chapitre 2 le brouillon l'appelle encore « Jordan » (le nom Yarden n'arrive qu'au chapitre 3) ; dans le jeu, tout le monde dit Yarden. Le son de la douche depuis le canapé est une scène du chapitre 4 (Céleste) : ne pas l'utiliser au chapitre 2. La bouilloire, visible depuis le canapé, sert à la phrase « Thé ? ».

## 21. Scène du miroir (chapitre 2, section V du roman ; fournie par Jordan)

Texte repris du début du miroir jusqu'à la dissolution du collier, avec ces adaptations pour le jeu (écarts avec le roman, non des corrections) : « Jordan » devient « Yarden » et « il » devient « elle » ; les yeux sont violets au lieu de bleu-gris ; le paragraphe des piercings (deux points argentés au-dessus de la lèvre, un anneau au septum) est retiré car le portrait n'en a pas ; le dragon d'oreille et le collier sont montrés puis dissous par un dessin ajouté sur le portrait. La phrase « C'est acceptable. » reste telle quelle. La nuit du chapitre 2 est passée sur le parquet ; le miroir tombe le matin. Texte « tatouage du chest » conservé tel quel.

**Catégories de monstres à fournir à GPT (conseil de l'auteur).** Canon : troll, araignée (ne pas toucher). Canon vague : créatures « charnels » du chapitre 2, carapaces du chapitre 8, la bête du chapitre 4 (niveau 28) : il y a un cadre, on complète dedans. Libre : le niveau 40 du chapitre 11, pas encore écrit ; préférer des créatures génériques d'Abysse adaptables. Jordan choisit par quel groupe commencer.

## 22. Jordan, ancien maître de donjon (résumé des bibles fourni par Jordan)

Avant d'être Yarden, Jordan régnait sur un donjon de 182 étages à Valstygheim. Son niveau avait dépassé l'échelle mesurable, et les divinités ont voté sa mort parce qu'elles ne pouvaient plus le mesurer. Les bibles ne disent rien du comment : ni scène, ni méthode, ni lieu de sa mort. **Règles** : son ancien niveau ne se chiffre jamais ; aucune mort n'est montrée ni inventée dans le jeu (un prologue qui la montrerait demanderait d'abord un canon écrit dans les bibles) ; le seul visuel de sa forme d'origine est la vision de la couverture (Jordan « auteur », chignon brun foncé, barbe, perfecto), un dispositif méta et non un design de boss. **Dans le jeu** : au réveil, Tiamat dit « Tu régnais sur un donjon de 182 étages, à Valstygheim. », « Tu étais trop grand pour qu'ils te comptent. » puis « Ils ont voté ta mort. Bienvenue à Helvara. » (piste choisie ; l'alternative « Bienvenue à Helvara. Et ils ont voté ta descente aux enfers. » a été écartée : « descente aux enfers » ajoute une image absente du canon). Cela prépare la phrase du miroir « Personne ne cherche un boss de donjon sous du liner ».

## 23. Izzy et Céleste : tenues canon et premières références chibi (fournies par Jordan)

Références de travail dans `docs/art/personnages-a-venir/` (`izzy-facade-chibi.png`, `celeste-ch4-chibi.png`), non chargées dans le jeu. Aucune scène du jeu ne les utilise encore. Les images ont un contour lilas de type autocollant, qui n'est pas le halo d'Izzy.

**Izzy, façade (fiche validée v4 du 17 juillet).** Robe ajustée bordeaux ou rouge cerise, tissu satiné, fente latérale haute. Veste en cuir noir par-dessus, col relevé, coupe ajustée. Talons dorés. Longues boucles d'oreilles dorées, chevalière à l'auriculaire gauche. Tatouage floral doré sur la clavicule gauche, visible.

**Izzy, combat.** Crop top bordeaux ou rouge cerise satiné, décolleté sweetheart. Veste en cuir noir courte, col relevé, manches retroussées, entrouverte. Short en cuir noir taille haute, très court, bas résilles noirs. Bottes cuissardes noires à talons épais. Manchettes dorées fines aux deux avant-bras, qui vibrent quand le pouvoir monte. Cheveux entièrement lâchés et ondulés. Halo doré, circulaire, derrière la tête et les épaules, qui grandit avec la puissance utilisée.

**Izzy, cosy.** Débardeur bordeaux ou rouge cerise ajusté, fines bretelles, tissu légèrement satiné, décolleté modéré. Short noir taille haute, très échancré sur les côtés. Chaussettes hautes noires jusqu'aux genoux. Seulement la chevalière : pas de manchettes, pas d'or en plus. Clavicule dorée dégagée. Ongles longs bordeaux, deux coupés ras.

**Céleste, tenue du chapitre 4 (retour de soirée de guilde).** Robe midi noire, matière fluide, décolleté en V sobre, fente latérale droite jusqu'à mi-cuisse. Veste en cuir noir courte, col légèrement structuré, deux boutons dorés, pas d'autre quincaillerie. Bottines en cuir noir mat, talon bloc, tige courte (elle marche vite et peut courir). Chaîne fine dorée avec un minuscule pendentif de guilde, petites créoles dorées. Rouge à lèvres légèrement estompé sur les bords, eye-liner encore net. Cheveux mi-longs châtains, partiellement défaits d'une coiffure du soir, quelques mèches libres. Aucune tenue du quotidien n'existe dans les bibles : à inventer avec Jordan si besoin.

**Points de vigilance.** Céleste est la colocataire d'Ishara : leurs silhouettes se ressemblent (châtain, robe noire). À distinguer par le métal (or pour Céleste, argent pour Ishara), la veste (Céleste en porte une ; Ishara n'en porte pas dans sa tenue de rue), la longueur de la robe (midi pour Céleste, courte pour Ishara) et la teinte des cheveux. Les chaussures d'Ishara ne sont pas fixées par le lore : ne pas s'en servir pour les distinguer.

**Corrections à demander avant le premier pack (relecture du 30 octobre).**
- Céleste : fente sur sa droite anatomique (à gauche de l'image de face) ; décolleté remonté pour retrouver le « V sobre ».
- Izzy et Céleste : corps raccourcis et têtes agrandies proportionnellement pour rejoindre Ishara (une simple réduction à 100 px ne corrige pas les proportions).
- Retirer le contour autocollant lilas ; fond vert uniforme.
- Izzy façade : garder tatouage à gauche, bijoux, palette rouge, noir, or. Le halo et les manchettes dorées appartiennent à la tenue de combat.

**Premier pack à demander** : pour chacune, trois portraits (neutre, sourire, une expression forte, à choisir par Jordan) et un repos de face. Les références sont sur la branche `ccr-7c0e09b8-1rbfts`, pas encore sur `main` tant que la pull request n'est pas fusionnée.

## 24. Premier pack d'Izzy et de Céleste (livré par Codex, 30 octobre 2026)

Exports et fiche dans `docs/art/izzy-celeste/` (les originaux haute résolution ne sont pas copiés dans le dépôt : ils sont dans le ZIP de Jordan). Contenu : un repos de face par personnage (211 × 148, ancrage 105,132, environ 100 px de haut) et six portraits de dialogue 256 × 256, sur fond vert. Izzy : neutre, sourire, narquoise (sourire en coin, un sourcil levé). Céleste : neutre, sourire, alerte (inquiétude pressée). Les corrections de la section 23 sont appliquées (proportions de la tête rapprochées d'Ishara, fond vert, fente de Céleste à droite anatomique, décolleté remonté, ni halo ni manchettes pour Izzy). Pas encore détourés ni branchés dans le jeu : aucune scène n'en a besoin pour l'instant (Céleste est absente de l'appartement au chapitre 2). Pour les utiliser : ajouter « Izzy » et « Céleste » aux noms de `dialogue.js`, exporter avec `docs/art/outils/convertir-packs.py`, puis écrire la scène.

Pack de mouvement livré le 30 octobre 2026 (`docs/art/izzy-celeste/mouvements-izzy/` et `mouvements-celeste/`, exports seulement ; les originaux restent dans les ZIP de Jordan pour garder le dépôt léger). Cases 211 × 148, ancrage (105,132), bandes de quatre images, fond vert, sans miroir. Izzy (tenue façade) : repos (1000, 500, 140, 1000 ms), marches gauche, droite, haut, bas (180 ms par image). Céleste (tenue du chapitre 4) : repos, marches (150 ms) et courses gauche et droite (100 ms). Pas encore détourés ni branchés : ils attendent une scène avec ces personnages. À vérifier au branchement : la teinte des cheveux de Céleste dans les bandes de mouvement tire plus vers le roux que sur ses portraits (châtain).

**Règle de poids décidée avec Jordan** : dans le dépôt, seulement les exports (bandes, portraits, fiches) ; les originaux haute résolution restent dans les ZIP, hors du dépôt. Le dossier `docs/art` n'est pas vidé : cela n'allégerait pas l'historique.

## 25. Allègement du dossier `docs/art` (30 octobre 2026, décidé avec Jordan)

Jordan garde une copie complète du dépôt en ZIP. Les dossiers `sources/` (originaux haute résolution des packs de la faux, des portraits, des danseurs et des hommes chibi) et le doublon `docs/art/yarden/saut-joie/` (identique à `docs/art/yarden/celebration/`) sont retirés du dépôt : `docs/art` passe de 65 Mo à environ 43 Mo. L'historique Git garde les anciens fichiers (téléchargement du dépôt : environ 26 Mo) ; une purge de l'historique n'est pas faite, car elle réécrit tous les commits pour un gain faible. Le script `docs/art/outils/convertir-packs.py` n'utilise que les exports, pas les `sources/`. Règle pour la suite : dans le dépôt, seulement les exports, jamais les originaux.

## 26. Suite du chapitre 2 après le miroir (résumé fourni par Jordan, ordre déjà modifié)

1. **Le soutien-gorge.** Jordan sort de la douche en serviette et n'arrive pas à refermer les crochets. Il va voir Ishara avec un « problème de géométrie angulaire ». Elle les ferme en deux secondes, puis lui demande, plus doucement, s'il va vraiment bien. Il répond que tout est récent et qu'il n'a rien anticipé. Elle lui donne un t-shirt gris et un short, lui dit que le lit est propre et « demain matin on voit », sans le presser. (Dans le jeu : dialogue seulement, rien n'est montré.)
2. **La première nuit.** Le lit est trop mou, donc Jordan dort par terre, sur le parquet, avec l'oreiller. Tiamat appelle ça pathétique, il répond « ergonomique ».
3. **Les agents divins.** Dans le noir, Jordan interroge Tiamat sur les agents des dieux dans Helvara. Elle répond qu'il y a plusieurs organisations, et reste évasive sur la divinité d'Ishara.
4. **Les tatouages.** Jordan comprend que ses tatouages servent de vecteur à la faux, avec un coût d'invocation de 0. Révélation déplacée dans la première nuit pour que le milieu du chapitre respire.
5. **Le premier run.** Jordan et Ishara font un Abysse de niveau 15 à 19 avec 7 créatures. Pas d'XP (courbe logarithmique).
6. **Le comptoir.** Comptoir de la rue Marterey (celui de Rémi) ; Jordan repart avec 280 francs (« crédits » dans le jeu). Il finit niveau 24, sans identité administrative.
7. **La fin du chapitre.** Direction Félix et le 4B, porte entrouverte sur des crânes. Le chapitre 3 enchaîne avec les papiers et le nom Yarden Weiss.

Ordre entre les points 3 et 4 reconstitué par l'auteur depuis les notes de patch, pas depuis le texte final. Dans le jeu, l'ordre du soir est : thé, salle de bain et miroir, soutien-gorge, nuit sur le parquet, matin.

## 27. Le premier run en Abysse (canon fourni par Jordan, 30 octobre 2026)

**Canon** : le matin, impasse derrière un pressing fermé le dimanche ; la faille est un rectangle d'air distordu ; tunnels puis salle plate ocre ; sept créatures de niveau 15 à 19, la troisième saute, la septième fuit dans un couloir sans issue ; aucun XP ; Ishara (niveau 11) donne un buff passif de 5 m, reste derrière à 3 m maximum et ne combat jamais ; butin de quatre fragments et deux bourses, le plus gros fragment est de niveau 19 avec une coupe propre.

**Entorses voulues** : les sept créatures sont des gobelins (sauteur et fuyard compris) ; Yarden et « elle » ; lumière mêlant vert et ocre (décision de Jordan) ; Ishara passe à sa tenue de course dès ce matin et la garde. **Non modélisés, abandonnés** : coup au flanc du 19, 70 % de mana, Ishara qui recule en criant.

## 28. Le comptoir de Rémi (canon fourni par Jordan)

Rue Marterey, porte marron entre un kebab et une laverie, interphone à presser deux fois, le kebab ouvre ses rideaux. Couloir étroit, encens, lampe à spectre, balance, ardoise à la craie. Rémi, 40 à 45 ans. « Le type qui coupe. » ; 280 sur l'ardoise, supplément pour le 19 propre ; « Dites-moi quel type de lame fait des coupes comme ça. » Tiamat : une trace laissée. Dans le jeu : 560 payés, partagés, 280 crédits pour Yarden (confirmé par Jordan). Rémi : dessin chibi à la caisse (cheveux bruns, mèche grise), `assets/npcs/remi/`.

## 29. Le 4B (canon fourni par Jordan)

M2, quartier Sous-gare, façade Belle Époque « trop normale », digicode, géraniums au deuxième étage, cour (pavés sans herbe, lierre taillé, deux arbustes symétriques), escalier de pierre aux marches creusées, air plus lourd à chaque étage, porte du 4B entrouverte sur une lumière chaude, le buff d'Ishara se déclenche, Félix : « Je vous attendais. » Le jeu s'arrête là (« Le chapitre 3 arrive »). Félix : dessin chibi assis au bureau, plumes et tablier tâché d'encre (`assets/npcs/felix/`), pas encore montré dans le jeu.

**Dialogues** : les répliques de ces trois scènes sont des brouillons à relire dans `docs/TEXTES.md`.

## 30. Chapitre 3, « Ce qui obéit aux murs » : papiers, nom, 4B (canon fourni par Jordan, 30 octobre 2026)

**Canon.** Nom fabriqué : Yarden Weiss (Yarden = Jordan en hébreu, le Jourdain, racine « descendre, chuter » ; Weiss choisi par Félix pour sa banalité). Couverture : Suisse par un grand-parent, née ailleurs, arrivée jeune ; 22 ans sur le papier (le corps en paraît 20). Prix total 800 : 280 d'acompte, 520 en dette, papiers récupérables trois jours après ; prix en deux parts (de l'argent pour le nom, « ne pas avoir à le regretter » pour le silence) ; « Un nom qu'on n'a pas fini de payer est un nom qu'on ne trahit pas. » Yarden refuse de signer avant de connaître le prix du silence. Ishara est la seule à connaître le nom à voix haute. Les 520 sont réglés au chapitre 5 avec l'argent d'Izzy (520 exacts). Le 4B : la porte cède sans résistance, l'air change de densité (pas de température), papier punaisé en couches, étagères, bocaux, crânes en public patient, table de travail au fond ; Félix ne se lève pas, aucun niveau lisible ; « Vous êtes récente… Deux jours. Peut-être moins. Et soigneusement rangée sous quelque chose. » ; le 4B n'est pas la maison de Félix, c'est Félix (résidu de Mithra) ; il attend le oui explicite d'Ishara avant de lire sa corde ; Tiamat parle par la bouche de Yarden et nomme Mithra (« ton résidu scelle, moi je masque, deux vieux métiers différents, dans deux maisons différentes ; nous pouvons travailler côte à côte sans nous toucher ») ; corde de témoin tendue vers Yarden, signature du dieu effacée volontairement ; fil ouvert : Ishara mentionne un détail de l'araignée de niveau 41 qu'on ne lui a jamais raconté.

**Adaptation du jeu.** Yarden reste Yarden : le nom s'ajoute (Yarden Weiss) et les papiers la rendent « réelle ». Crédits à la place des francs. Choix de Jordan sur l'argent : le seul usage des 280 crédits est l'acompte ; le sac et la pastille affichent « 280 → 0 » et « Dette : 520 ». Le détail de l'araignée n'est pas précisé : Ishara parle seulement du niveau 41 et Yarden relève qu'elle n'en a jamais entendu parler. **Non canon** : toutes les répliques de liaison (texte exact du roman manquant), plan et décor du 4B, voix de Félix hors de sa phrase d'accueil.

**Texte exact fourni par Jordan (extraits du roman) : scène du 4B intégrée.** Règles de dialogue : Félix vouvoie tout le monde, y compris Ishara, et parle de Yarden au féminin ; Yarden tutoie Félix ; Ishara ne dit jamais « Jordan » dans le 4B (elle dit « Attends. ») ; le décalage de Félix : ses yeux rattrapent parfois en retard le mouvement de sa tête, et suivent à temps « par courtoisie » quand il fait l'homme. Beats : seuil, Félix, prix du silence, Tiamat par la bouche de Yarden, corde d'Ishara (« …Vas-y. Je veux savoir. »), nom et prix, descente (escalier plus léger, cour symétrique, fil de l'araignée, pâtes, niveau 24, Yarden Weiss). Dans le jeu, « francs » devient « crédits » (entorse). L'araignée : cristalline, niveau 41, Abysse de niveau 38 du chapitre 1, Ishara n'y était pas ; sa réplique exacte est inconnue, le jeu garde seulement « niveau 41 ». **Reste proposé** : la phrase d'Ishara sur l'araignée et celle des pâtes. Pas de « mademoiselle » (invention retirée).

**Effet du papier (ajouté à la demande de Jordan).** Dans le 4B, les documents des murs bruissent doucement (léger tremblement) ; quand Tiamat parle, une lueur violette passe sur le mur et le papier s'immobilise net, puis la narration dit que le bruissement s'est arrêté (`ch2b.paperStillAt`, `render-ch2b.js`).

## 31. Mode libre (décidé avec Jordan, 30 octobre 2026)

Hors histoire, ouvert à la fin du prototype pour passer le temps : une carte de Lausanne, des failles dans les rues, un donjon différent à chaque entrée. **Décisions de Jordan** : pas de butin, pas de vente, pas d'XP ; accès par un menu « Mode libre » à la fin du prototype ; la dette de Félix (520) reste réglée au chapitre 5 avec l'argent d'Izzy. **Monstres** : l'insecte ailé, le rampant gris et le crabe sont animés et dans le jeu (pack de Jordan, `assets/monsters/`) ; l'homme rouge, le golem de pierre et le tatou ont leur pack de 12 cases (pack de Jordan). Le boss du mode libre est le Troll existant en version simple (`chef`, 10 PV), pas un nouveau boss.

## 32. Suite du jeu : « Saison 2 », chapitres 4 à 10 (résumé grossier fourni par Jordan, 31 octobre 2026)

**Statut** : plan d'ensemble seulement, pas un canon exact. Rien n'est implémenté. Le jeu s'arrête à la fin du chapitre 3 (sortie du 4B, niveau 24, dette de 520). Les noms, chiffres et ordre de ce résumé sont à vérifier avec le texte du roman avant d'écrire une scène. Les montants sont en francs dans le résumé (« CHF ») ; dans le jeu, ce sont des crédits (entorse déjà en place).

**Acte II : La Signature (chapitres 4 et 5)**
- **Ch4** : nuit blanche sur le parquet ; chasse à l'aube ; rupture urbaine de niveau 28 (combat de rue sale, fuite de gaz) ; l'équipe au carnet (Thot, qui archive sans poser de questions) ; retour en sang et rencontre avec Céleste dans son propre lit ; Ishara « se souvient » de l'araignée (fil ouvert au chapitre 3).
- **Ch5** : attribution de 6 points en VIT ; descente en ville ; Izzy (niveau 70) à Saint-François, qui lit une page blanche ; retrait des 520 au bancomat ; récupération des papiers chez Félix (Yarden Weiss existe) ; piège à la sortie : trois costumes devant le 4B.

**Acte III : Deux Cages (chapitres 6 et 7)**
- **Ch6** : l'enveloppe rendue par le chef de Thot (exactement 520) ; déduction du bancomat ; traque d'Izzy au Flon par l'anneau d'évitement ; remboursement cash ; montée au 16e étage d'Ouchy ; Jordan pose la boîte.
- **Ch7** : visite de la maison marchande ; cours d'économie légale (la provenance, le ratio ×2) ; 104 000 sur la table ; Céleste à l'intake rapporte le faux souvenir de la cuisine ; Izzy brise sa règle et demande « T'es qui » ; Jordan refuse.

**Acte IV : Ce qu'on emprunte et ce qu'on signe (chapitres 8 à 10)**
- **Ch8** : Jordan sème Izzy dans les escaliers ; run en Abysse niveau 15 à 19 avec Ishara, combat à mains nues pour salir la marque (mains en sang) ; Ishara prend deux niveaux (niveau 13) mais explose (« T'avais qu'à demander. Et toi t'as préféré me l'acheter. ») ; Céleste accepte d'être garante.
- **Ch9** : nuit à Ouchy ; Izzy en t-shirt gris pose l'ultimatum du 40 (12 à 13 000, elle ne prend rien, elle regarde) ; bascule de Tiamat (« Dis non », Jordan ne dit pas non) ; lundi : Céleste signe garante, Ishara vend au comptoir Est (640, moins 60 pour l'état), Vasseur note l'écrasement dans la colonne état.
- **Ch10** : stand de nouilles (Jordan repousse ses 320 au 15) ; seul à Ouchy (inspection tactique, chambre sans fenêtre, livre de cuisine dédicacé, désastre du risotto) ; retour d'Izzy : contrat de parrainage marraine/nièce (10 %, 6 mois) ; clause de sortie unilatérale ; Jordan donne son nom complet (Yarden Weiss) ; bascule de point de vue sur Izzy, seule dans sa chambre aveugle.

**Ce qui est déjà prêt côté jeu** : packs de portraits et mouvements d'Izzy et de Céleste (`docs/art/izzy-celeste/`), sac et crédits, dette, mode libre, système de scènes, décors réutilisables. **Ce qui manquerait** : lieux (appartement de Céleste, Saint-François, bancomat, Flon, tour d'Ouchy et son 16e étage, maison marchande, stand de nouilles, comptoir Est), personnages (Thot et son chef, Vasseur, les trois costumes), mécaniques (écran d'attribution des points de statistiques, combat à mains nues, combat de rue niveau 28), et les textes exacts de chaque chapitre.

## 33. Chapitre 4, « La trace » (canon fourni par Jordan, 31 octobre 2026)

**Canon.** État de départ : niveau 24, 0 crédit, dette de 520, papiers dans trois jours, 0 point à distribuer ; Ishara niveau 11 ; Céleste, sa coloc, rentre « demain matin, peut-être ce soir tard ». **I. Les pâtes** : il cuisine pour la première fois de lui-même, il bégaie un peu ; « Pas donnée. Faite. » ; Ishara et la marque de pâtes supérieure ; « Ma coloc rentre. Demain matin, je crois. Peut-être ce soir tard. Faudra que je lui explique pourquoi y'a quelqu'un dans son lit. » ; « Points disponibles : 0 » ; « Il me faut du niveau. Vite. » **II. La pression** : sur le parquet, mains croisées sur la poitrine ; il lui faut une faille de niveau 28-30 ; Tiamat : « Une faille de ce niveau ne s'ouvre pas quand tu la commandes. Tu vas devoir chasser. » puis « Et le niveau que tu cherches laissera une trace. » ; il répond par la dette et les trois jours ; Tiamat se tait (premier désaccord laissé passer). **III. La rupture** : un square, le matin ; la faille se déchire d'un coup (tympans, éclair bleu-noir, lampadaires qui explosent) ; un jogger à trente mètres, une fenêtre qui s'allume au deuxième étage ; créature niveau 28, chitine sombre, basse sur pattes, membres qui plient dans le mauvais sens, sans yeux visibles ; elle vise le jogger ; la lame courte (serpe noire) pour que les civils voient un reflet, le Voile grince ; « ISHARA. Le jogger. Fais-le partir. » ; « COURS ! GAZ ! FUITE DE GAZ ! COURS ! » ; blessure à l'épaule (trois entailles) ; « Elle est plus rapide que l'araignée. Et toi, tu es plus lent qu'hier. » ; le banc scellé ; 24 → 27 ; Ishara gagne zéro niveau. **IV. L'équipe au carnet** : six opérateurs, aucun écusson, aucune électronique ; « T'es affiliée à qui ? / Personne. / Ton nom. » ; « On remballe. On a ce qu'on est venus chercher. » ; la carcasse emportée, la dette reste à 520 ; « C'est bon, là ? C'est… fini ? / Non. » **V. Le retour** : épaule ouverte, côtes fissurées ; Ishara soigne à mains nues, mains tremblantes ; « Tu as sorti une variable de ton calcul… / Je sais. / Non. Tu l'apprends. » **VI. Céleste (14 h)** : niveau 22, robe midi noire, veste cropped, chaîne dorée avec pendentif de guilde ; croit à un cadavre pendant cinq secondes ; se met devant Ishara ; « Dans ma chambre. / Techniquement c'est la chambre d'appoint quand t'es pas là. / Le mot appoint fait pas ce que tu crois qu'il fait. » **VII.** « Yarden » donné à Céleste pour la deuxième fois, avant tout registre. **VIII. L'araignée** : « L'araignée de cristal. Niveau quarante et un. Sept pour cent de mana. » ; « Regarde-la. Elle ne ment pas. » ; dernière réplique : « …Je croyais que tu me l'avais dit. Jordan. Je me souviens que tu me l'as dit. » **État d'arrivée** : niveau 27, épaule ouverte, côtes fissurées, dette 520, papiers à récupérer.

**Adaptations du jeu.** Yarden et « elle » ; crédits ; « Jordan » dans la dernière réplique d'Ishara devient « Yarden » (le jeu ne dit pas le vrai nom) ; « hier soir, dans le métro / l'escalier du M2 » devient « hier soir, dans la cour du 4B » (c'est là qu'Ishara le dit dans le jeu) ; la créature, le jogger, le chef et les opérateurs utilisent le pack de Jordan (voir 17i) ; le combat est jouable et libre (le truc du banc n'est pas imposé) ; Céleste utilise ses portraits et ses marches du pack. **Non canon (propositions à relire)** : « Y'a une marque de pâtes, la supérieure… », le discours de Yarden au chef (« Vous arrivez quatre minutes trop tard… »), « Elle est qui, elle ? », « Et toi, tu t'appelles comment ? », la scène de nuit et les objectifs affichés. **À trancher** : le titre exact des sections IV à VII ; l'ordre de IV à VII suit les notes ; la longueur de la faux n'est jamais affichée en chiffres.

## 34. Chapitre 6, « Ce qu'on écrit à ta place » (canon fourni par Jordan, 1er novembre 2026) : implémenté (voir la section 39)

**Pourquoi en réserve** : il suppose le chapitre 5 (6 points en VIT, Izzy à Saint-François, retrait de 520 au bancomat, papiers récupérés chez Félix, trois costumes devant le 4B), que le jeu n'a pas encore. À implémenter après lui.

**État de départ** : niveau 27, 6 points en VIT, 0 crédit, papiers en main (boîte sous le bras), trois jours vendus à Izzy.

1. **L'enveloppe** (devant la porte cochère du 4B) : le chef (costume sombre) vient seul, les deux autres restent contre leurs murs ; voix normale. « Vous étiez difficile à joindre. On aurait pu déposer ça chez vous. Vous n'avez pas de chez vous. On aurait pu le déposer là où vous dormez. On a jugé que non. » Il tend l'enveloppe sans la baisser (trois secondes de rue tranquille) ; main droite non gantée, tatouages à découvert ; il ne regarde pas les tatouages, ce qui est pire. Contenu : 520 exactement, billets usagés, coupures mélangées ; à la main, encre noire : « Yarden ». « Les services rendus se paient. C'est tout ce que c'est. / Je n'ai rien facturé. / Non. Vous n'avez rien facturé. » puis « La dette est honorée. De notre côté, le dossier est fermé. Bonne continuation, mademoiselle Weiss. » Ils repartent sans carnet. Tiamat : « Tu as payé huit cents francs pour être une ligne. Tu es une ligne. » et sur le chef : « Celui-là n'attaque pas. Il note, il archive, et de temps en temps il fait un geste correct. Et le geste correct te coûte plus cher que la menace. »
2. **Le préau désaffecté** : il compte l'argent et comprend : Izzy a retiré les billets à un bancomat, la machine écrit avant que l'argent sorte (borne, compte, montant) ; Izzy est désormais dans l'archive (elle ne le sait pas, lui si ; jamais dit en texte).
3. **La recherche d'Izzy** : trois faux positifs dans la ville ; il ne touche pas à l'enveloppe, n'a pas mangé depuis la veille (non commenté). Tiamat : « Trois. » puis « Je sais. Je voulais le dire. »
4. **La terrasse du Flon** : il retrouve Izzy sur une terrasse de bar ; elle reprend les 520 en trois gestes, sans compter ; dette Izzy = 0, dette Félix = 0 (premier moment sans dette chiffrable). Elle l'invite chez elle (Ouchy). Répliques exactes inconnues.
5. **L'ascenseur** (Ouchy, soir) : l'homme de l'entrée regarde une seconde entière (boîte, veste, tatouages) : « Bien sûr. » Ascenseur en miroir sur trois côtés ; quinze étages, un sous-sol, un bouton sans numéro (non commenté). Izzy passe une carte, le seizième s'allume. « Y a pas de seizième. / Si. / Le tableau dit quinze. / Le tableau dit ce qu'on lui a demandé de dire. »
6. **L'appartement d'Izzy** (16e) : les portes s'ouvrent dans le salon ; trente mètres de baie sur le lac, sol de pierre pâle, plafond à quatre mètres ; cuisine jamais salie ; trois canapés bas autour d'une table en marbre ; bibliothèque aux livres alignés par taille ; terrasse en bois clair, transats, bar, oliviers en pots, piscine au sud. Tiamat : « Voilà une adresse. » Sorties : ascenseur, escalier de service (porte grise derrière la cuisine), peut-être une porte au bout du couloir nord : « Deux. » Izzy : « Ah. J'ai jamais regardé. » Couloir : un bureau, des chambres d'amis, au bout du sud la chambre principale sans aucune trace de personne. **L'aveu** : la troisième porte du couloir nord est entrouverte (« ça c'est rien », trop tard) : petite chambre sans vue, lit simple défait, verre d'eau par terre, livre ouvert à l'envers, chargeur, lunettes pliées ; sur la pierre devant le seuil, trente centimètres plus mats : Izzy dort là. À Tiamat : « Parce qu'elle m'a montré tout le reste. Et pas ça. »
7. **L'invitation** : la deuxième chambre d'amis, salle de bain privée. « Je te demande rien. Le contrat est fermé. Tu me dois rien, je t'achète rien, je pose pas de question. Reste le temps que tu veux. / C'est une phrase dangereuse. / Ouais. J'ai remarqué en la disant. » Elle tape deux fois le montant de la porte, repart pieds nus vers le couloir nord.
8. **La boîte posée** : sur la commode (huit cents grammes) : une carte d'identité, un permis, deux extraits, une attestation, trois relevés, un bail à Renens, une carte de bibliothèque expirée, un formulaire à rature volontaire. « Vingt-deux ans de vie qui n'avait jamais eu lieu. » Première chose posée quelque part depuis le réveil. Tiamat : « Tu peux la reprendre demain. / Je sais. / Ce n'est pas ce que je te demande. » Dernière image : le chef range son carnet : un nom, puis le numéro d'une carte bancaire, la borne et le montant exact d'une dette récupérée sur une terrasse.

**État d'arrivée** : niveau 27, VIT 11, 0 crédit, aucune dette ; logé au seizième, chambre d'amis. Ishara et Céleste absentes.

**Points à trancher pour le jeu** : (a) l'enveloppe : la laisser à Yarden (endroit naturel pour la règle des potions) ou la lui faire rendre à Izzy comme dans le roman ; (b) « mademoiselle Weiss » (le chef) et « monsieur Weiss » (le 4B au chapitre 5) sont voulus : chaque agent lit une couche différente (le registre pour Thot, le dessous pour Mithra) ; à respecter ; (c) aucune durée chiffrée dans les dialogues du chef.

## 35. Chapitre 5, « Le poids d'une dette » (canon fourni par Jordan, 1er novembre 2026)

**Canon** (dossier « créature L28, équipe au carnet, chapitre 5 », sections 1 à 4). **Équipe du chapitre 4** : six personnes en tout, chef compris (deux au monde, trois aux angles, un chef) ; deux véhicules sans marquage, square couvert en onze secondes ; veste technique sombre, chaussures de marche, aucun écusson ; archivage manuscrit ; le chef, quarantaine passée, lit la carcasse avant de regarder la personne, aucun niveau lisible. Au chapitre 5, ils reviennent en costumes sombres (changement voulu, jamais expliqué). **Créature** : chitine sombre, basse, membres qui plient dans le mauvais sens, sans yeux visibles ; plus rapide que l'araignée ; point faible : la jonction molle entre la tête et le premier segment ; elle percute le banc scellé, ses membres s'emmêlent, il frappe de dessous vers le haut. **Jogger** : aucune description canon. **Barème des points** : deux par niveau, sans exception ; 24 → 27 = 6 points, tous en VIT (5 → 11) ; FOR 20, DEX 18, AGI 12 ne bougent pas ; l'exception « Abysse auto-généré, 1 point par niveau » est supprimée et ne s'affiche pas. **Déroulé du jour 4** : inventaire du matin (0, dette de 520, le parquet) ; Céleste : « Je ne te sers pas, mais tu peux. » ; Ishara ne lui parle plus depuis le dîner ; « Je le range. C'est pas pareil. » ; calcul sous la douche (pas de rupture, pas de terrain subi, pas de civils) puis écran des six points ; il examine et refuse la guilde du quartier ; un « 70 » dans une rue commerçante (Tiamat arrive une demi-seconde trop tard) ; Izzy : niveau 70, Xochiquetzal, fleur d'or, talons dorés, rouge laqué, lit le désir des gens et ne lit rien sur lui ; studio à Ouchy refusé, puis « Je t'achète trois jours. » ; contrat : « Tu marches où je marche, t'es là quand je suis là. Tu réponds à aucune question. », 520, retrait de 600 au distributeur, 80 rendus, échéance au jour 7 ; « Yarden. » (troisième fois, à une inconnue, contre de l'argent) ; « J'ai pas besoin de ton numéro. T'as accepté mon argent. Tu crois que tu peux disparaître dans cette ville ? » ; au 4B : il pose les 520, Félix prend sans compter, papiers prêts depuis la veille (une nuit à écrire le nom 340 fois), rature volontaire (« un dossier sans faute est un dossier fabriqué »), « Les gens qui paient tout d'un coup paient rarement avec leur propre argent. Vous êtes venu couper une laisse. Je vous demande juste de savoir avec quoi vous l'avez coupée. », « Bonne journée, monsieur Weiss. » ; midi, porte cochère : le chef et deux inconnus en costumes sombres, à une dizaine de mètres sur la gauche, mains dans les poches ; le chef n'ouvre pas le carnet et incline la tête (une confirmation) ; ils étaient là avant. **État d'arrivée** : niveau 27, VIT 11, 0 argent, dette de Félix 0, papiers en main, dette de trois jours envers Izzy, aucun mana dépensé.

**Choix pour le jeu.** L'argent d'Izzy est dans le jeu comme dans le roman (520 crédits remis par Izzy, aussitôt versés à Félix : Yarden n'en garde rien). La règle des potions et ce que Yarden fait de ses crédits restent à définir (section 34). L'équipe du jeu compte six personnes (chef compris) : c'est bien le canon. Aucun chiffre pour la longueur de la faux. « Monsieur Weiss » (Félix) contre « mademoiselle Weiss » (le chef, chapitre 6) : voulu. **Adaptations** : Yarden et « elle » ; crédits ; « Je te vois » du jeu remplacé par des lignes courtes ; le studio d'Izzy et la phrase de la guilde sont des propositions. **Non canon, à relire** : « J'ai un studio à Ouchy. Il est vide. Il est à toi. », « Ton nom. », l'ordre des gestes au distributeur, le texte de Félix sur la rature (« Des impressions non vérifiables, et une rature volontaire… »).

## 36. Contrôle de continuité : jeu contre le roman (chapitres 3 à 6), 1er novembre 2026

**Verrouillages du roman à respecter** (notes de fin du chapitre 6) : saison juillet ; **Jour 1 = mercredi 1er juillet 2026, Jour 4 = samedi 4 juillet 2026** ; âge du dossier 22 ans (né en 2004), corps de 20 ; scellement (le nom n'entre dans les registres publics qu'à la remise des papiers, vers 12 h 06) ; 520 retirés exactement par Izzy ; « mademoiselle » (Thot, lit le registre) contre « monsieur » (le 4B, lit le dessous) ; le chef n'émet aucun niveau (ne jamais chiffrer les occurrences) ; ne plus parler de « verre du square » au chapitre 6, mais du « chignon défait » ; deux lampadaires cassés au chapitre 4 ; la corde d'Ishara reste un fil ouvert ; **Ishara et Céleste ne reviennent qu'au chapitre 7** (Jordan quitte l'appartement sans un mot, « pas de facture », traité au chapitre 7).

**À trancher avec Jordan** : (1) le calendrier verrouillé donne **jeudi 2 juillet** pour le Jour 2, alors que le jeu (carte « Dimanche matin », « c'est dimanche », pressing fermé) dit dimanche : changer la carte et la ligne, ou revoir le calendrier ; (2) le jeu n'a pas encore la scène du banc scellé du chapitre 4 ; (3) le chapitre 5 du roman est bien plus long que celui du jeu (la scène d'Izzy fait environ 360 lignes : lecture du désir, studio d'Ouchy, contrat) : le jeu en garde une version condensée.

## 37. Chapitres 7 à 9 (romans fournis par Jordan, 1er novembre 2026) : lus, pas implémentés

**Calendrier verrouillé par le roman** : Jour 1 mercredi 1er juillet 2026 ; Jour 4 samedi 4 ; Jour 5 dimanche 5 ; Jour 6 lundi 6 ; échéance mercredi 8. Le chapitre 7 se déroule le **dimanche 5 juillet**, la maison marchande recevant même le dimanche.

**Chapitre 7, « Ce que valent les choses »** (Jour 5, matin). Jordan se réveille à Ouchy, inventaire vide fait deux fois, la boîte intacte sur la commode, un sac en papier agrafé dans la cuisine ; Izzy sort pour une vente, **il demande à venir** (« Parce que je ne sais pas comment on transforme un cadavre en argent dans ce pays. ») ; cours d'Izzy dans la côte (le noir paie le prix du silence, la maison paie le double mais demande la **provenance** : numéro de brèche, date, secteur, heures, affiliation, garant, déclaration ; légal complet 100 %, noir 50 %, légal incomplet 33 %) ; **le chiffre faux** : il annonce 280 au lieu de 560, Izzy cote 1100-1200 et dit « quatre fois », il corrige en silence (« deux ») et ne dit rien pour ne pas nommer Ishara ; la maison marchande (hall en pierre, porte de soixante centimètres, quatre issues dont trois devant quelqu'un, onze pièces sur du feutre dont quatre inconnues, 104 000 francs, la vieille femme qui ne touche rien, l'homme en costume gris, **Céleste à l'intake**) ; Céleste rapporte le **faux souvenir** d'Ishara (« prévenue le matin, dans la cuisine », alors qu'il n'a rien dit), Tiamat : « Elle ne ment pas. Elle s'en souvient. » ; 520 contre 104 000, un demi pour cent ; paiement la semaine suivante, jamais de liquide ; sur le trottoir Izzy demande « T'es qui. » (la seule question de sa vie), il refuse, premier rire vrai ; elle ne lâche pas.

**Chapitre 8, « Ce qu'on emprunte »** (Jour 5, après-midi → nuit). Coupure sur les escaliers publics (point de vue d'Izzy, seule) ; traversée à pied, l'appartement d'Ishara, l'accord ; le **fil des vingt-deux** (messagerie fermée d'Éveillés non affiliés, sans hiérarchie) ; le **garant** (une signature, aucun flux d'argent) ; **salle type sous le niveau 20** : une seule salle plate, piliers, dix centimètres d'eau et écho décalé, 10 à 20 créatures ; le run : **quatorze créatures niveau 15-19**, une seule invocation de la faux à 80 cm puis main refermée, tout le reste **à mains nues** pour salir la marque (onze secondes par créature), **Ishara finit à la dague courte, niveau 11 → 13** ; la lame s'est allongée à partir du niveau 27 (valeur jamais chiffrée) ; « Le vingt-quatre périmé » d'Ishara et « le seul mec… / Je ne suis pas un mec » (la corde) ; Ishara : « T'avais qu'à demander… Et toi t'as préféré me l'acheter. » ; Céleste accepte d'être **garante** en étant furieuse ; lot vendu lundi (cotation noire 350, légale 700-750, plus bas qu'au chapitre 2 faute de fragment niveau 19 et à cause des carcasses abîmées).

**Chapitre 9, « Ce qu'on laisse »** (nuit du 5 au 6, lundi 6). Le concierge d'Ouchy lit « Yarden » sur sa liste manuscrite (Izzy l'a ajouté) ; seize étages montés gratuitement ; Izzy en t-shirt gris trop grand, maquillage estompé, sans façade ; dispute (« T'es parti comme un voleur. » / « Tu es riche. ») ; Izzy : huit ans pour passer la porte, l'appartement est à elle ; elle propose un **quarante** (faille repérée samedi, secteur nord, mercredi 16 h, elle regarde sans toucher, douze à treize mille francs) ; Tiamat : « Non… Dis non. », il ne dit pas non, Tiamat : « Ah. Alors c'est comme ça. » (bascule de registre : elle ne referme plus) ; **§IV du point de vue de Céleste, seule**, qui signe la déclaration de provenance à côté d'Ishara ; **§V comptoir Est** (Vasseur, 640 francs le lot, moins 60 pour l'état, 320 chacune, paiement mercredi) ; Vasseur pose la question de l'**écrasement**, Ishara répond « le décor », il écrit quand même un mot dans la colonne état (nouveau fil ouvert).

**Ce qu'il faudrait pour les implémenter** : lieux (appartement d'Izzy et sa chambre de bonne, hall d'Ouchy et concierge, maison marchande intérieur et extérieur, comptoir Est, salle noyée du run) ; personnages (la vieille femme, l'homme en costume gris, Vasseur, le concierge) ; sprites d'Izzy en robe rouge et en t-shirt gris ; **combat à mains nues avec alliée qui achève** ; salle type plate à eau et piliers ; scène du point de vue de Céleste. Le chapitre 6, lui, n'a besoin que de ce qui existe déjà (décor de rue, Izzy, chef en costume) plus l'appartement d'Izzy.

## 38. Décisions de Jordan du 1er novembre 2026 (continuité)

- **Calendrier** : on garde « Jour 1, Jour 2… » sans nommer lundi, mardi, etc., dans le jeu. Plus aucun nom de jour (carte « Jour 2 », pressing « rideau baissé »). Pour les chapitres à venir : remplacer « mercredi », « dimanche », etc. par « Jour N » ou une formule vague (« dans trois jours »).
- **Âge d'Ishara et de Yarden** : l'âge officiel est 22 ans (Yarden : dossier de Félix) ; tant que l'âge n'est pas établi, on écrit « une fille qui a l'air de vingt ans ». Ne pas corriger les chapitres 3 et 9 : l'écart est voulu.
- **Décompte du nom donné** : le premier « Yarden Weiss » (chez Félix, chapitre 3) est un choix, pas un don ; les trois dons (Ishara, Céleste, Izzy) sont canon.
- **Relecture des dialogues** : après un nouveau test complet du jeu par Jordan.
- **Musique** : en cours de production, fichiers attendus dans `assets/musique/`.

## 39. Chapitre 6 dans le jeu (1er novembre 2026)

Canon : section 34 et le roman (chapitre 6). **Entorses** : francs → crédits ; Yarden et « elle » ; plus aucun nom de jour (« un préau d'école désaffecté », sans « samedi ») ; aucune durée chiffrée dans les paroles du chef ; le seizième étage est dessiné en un seul décor (salon, couloir, chambres) au lieu d'un plan fidèle ; le concierge et les hommes de l'anneau réutilisent les silhouettes d'inconnus ; Izzy est en tenue façade (elle jette ses talons dans le roman, le jeu ne le montre pas). **À relire** : toutes les répliques du préau (j'ai condensé les pensées de Jordan en narration), les trois faux trous du Flon, le tour de l'appartement. **Manque** : portrait du chef en costume, sprite du concierge, sprites d'Izzy pieds nus.

