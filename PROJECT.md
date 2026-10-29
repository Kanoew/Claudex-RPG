# PROJECT.md — Prototype RPG « Yarden » (Chapitre 1)

> Fichier de contexte. À lire EN ENTIER au début de chaque session, par Claude comme par ChatGPT/Codex.
> Si une consigne de ce fichier contredit une demande orale, on le signale avant de coder.

## Règle de style des personnages (décidée avec Jordan le 29 octobre 2026)

- **Chibi** (grosse tête, corps court, trait épais, aplats) pour les **personnages nommés qui comptent dans l'histoire** : Yarden, Ishara et, plus tard, d'autres personnages récurrents.
- **Semi-réaliste simple** (trait sombre épais, aplats, peu de détails) pour les **figurants humains anonymes** et pour les **monstres**.
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

29 octobre 2026 — Complément visuel : courses de face et de dos d’Ishara chibi, quatre images chacune, et une pose immobile gauche par homme. Sources vertes, manifestes et aperçus dans `docs/art/ruelle/chibi/` et `docs/art/ruelle/hommes/`. La scène `scene.js` est déjà présente sur main ; cette livraison ne modifie pas son déroulement et ne raccorde pas encore ces quatre nouvelles ressources. Les exports transparents et leur raccordement restent à réaliser.

29 octobre 2026 — Ishara reprise en chibi à partir du repos approuvé : sept bandes de quatre images (repos, quatre marches, deux courses), sources vertes et aperçu autonome dans `docs/art/ruelle/chibi/`. Dessins gauche/droite générés séparément. Les anciens sprites transparents restent en place ; ce nouveau pack ne modifie pas la ruelle jouable. Les sources vertes ne sont pas encore des exports transparents prêts pour le jeu ; raccords et asymétries à contrôler avant intégration.

28 octobre 2026 — Cadre canonique de Yarden consigné : identité unique, nom utilisé par le jeu, pronoms, ton et apparence. Anciennes hypothèses de la rencontre et fiche visuelle corrigées. Mise à jour documentaire uniquement ; aucune modification des images ni du combat.
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
| 10 | implémentée, bilan Android à compléter | Nettoyage ciblé des styles et de la remise à zéro des impacts ; pause à la perte de focus, chronomètre de jeu et résumé de fin, barre de PV du boss lisible. Guide dans `README.md`, état et essais restants dans `BILAN.md`, sept scénarios logiques sans dépendance dans `tests/smoke.cjs`. Syntaxe et tests réussis ; rendu réel, fluidité, équilibrage et parcours complet Android à valider. Scripts `?v=14`. Correctif (retour de Jordan) : le joystick n’est plus relâché à l’apparition du Gardien ni à sa défaite, ce qui bloquait Yarden pouce posé ; scripts `?v=15`, test ajouté. Ensuite : Yarden peut bouger pendant l’apparition du Gardien (1,2 s) au lieu d’être figée ; mode diagnostic `?debug` ; scripts `?v=17`. |

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
- Toujours interdits : monde ouvert, quêtes, inventaire, économie, niveaux, multijoueur, sauvegarde. Les PNJ restent limités à Ishara et aux deux hommes de la scène du chapitre 2, sans dialogue canon inventé ni quête. Ajoutés comme autorisés : images dans `assets/`, découpage de `game.js` en plusieurs fichiers au-delà de ~500 lignes.
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
| Étape | Statut | Notes |
|---|---|---|
| 11 | implémentée, à relire et à valider sur Android | Barres de vie et de mana avec valeurs numériques, objectif court, boutons avec coûts et récupérations. Barre du Gardien dès son apparition et flèche quand il est hors champ. Affichage extrait dans `hud.js` et `render.js` ; corrections de maintien du joystick et diagnostic conservés. Neuf scénarios logiques passent. Vérification visuelle locale bloquée par le sandbox du navigateur ; test portrait/paysage sur Android restant. Scripts `?v=19`. |
| 12 | implémentée, à relire et à valider sur Android | Sol en dalles, murs maçonnés, blocs habillés en piliers, portes d’entrée et de sortie dessinées, voile sombre sous les personnages et annonces. Deux SVG originaux dédiés CC0 dans `assets/` (1 276 octets au total), chargés une seule fois en motifs ; dessin de secours en cas d’échec. Dimensions et collisions conservées. Dix scénarios logiques passent, dont textures chargées/absentes et maintien du joystick. Vérification visuelle et fluidité Android restantes. Scripts et images `?v=22`. |
| 13 | implémentée, à relire et à valider sur Android | Yarden remplace le disque par ses sprites : repos et course gauche/droite (planche d’origine), marche vers le haut et vers le bas, coup de faux gauche/droite, esquive gauche/droite, dégâts et défaite (pack v2, 8 bandes dans `assets/yarden/`, environ 150 Ko, cases de 211 × 148, manifeste `actions.json`). Les actions sont calées sur la durée réelle du jeu (coup de 0,22 s ou 0,3 s pour Fauchage, esquive de 0,2 s) sans changer les dégâts ; l’arc du coup reste l’indicateur de portée et la faux provisoire n’est dessinée que si les images manquent. Dégâts : réaction de 0,3 s. Défaite : Yarden tombe et le message de fin attend 1 s (nouveau délai à l’écran de défaite, la victoire n’attend pas). Ombre sous les pieds, flash blanc quand elle est touchée, teinte verte pendant l’esquive ; les bandes ne sont jamais retournées. Marche verticale choisie quand le mouvement est plus vertical que latéral ; coup et esquive vers le haut ou le bas utilisent le dernier côté gauche ou droit. Repli sur le repos, la course ou le disque si une image ne charge pas. Collisions, combat, caméra et commandes inchangés. Douze scénarios logiques passent ; essai dans Chromium sans erreur avec toutes les poses. Fluidité, taille et lisibilité Android à valider. Scripts et images `?v=24`. |
| 14 | implémentée, à relire et à valider sur Android | Renommage dans le jeu : Rôdeur en Gobelin, Chargeur en Ogre, Gardien en Troll (textes, barre du boss, repère hors champ). Les trois monstres ont leurs sprites (`monster-sprite.js`, `assets/monsters/troll.png`, `goblin.png`, `ogre.png`, environ 75 Ko, manifeste `monsters.json`) : marche en quatre images, pose d’annonce pendant l’annonce du jeu, pose de coup ou de charge à l’impact (0,3 s pour le Troll, 0,2 s pour le gobelin, pendant toute la charge pour l’ogre), flash blanc quand ils sont touchés, retournement pour regarder Yarden (leurs images regardent à gauche), ombre sous les pieds, barre de vie au-dessus de la tête. Tailles : gobelin 0,9, ogre 1,25 et Troll environ 2,0 fois Yarden ; collisions (rayons 14 et 24), PV, vitesses, annonces et dégâts inchangés. Le disque rose, le carré jaune et le disque violet restent en secours si une image ne charge pas. Pas de disparition animée : un monstre vaincu disparaît d’un coup. L’araignée de cristal est livrée en images mais n’est pas dans le donjon. Quatorze scénarios logiques passent ; essai dans Chromium sans erreur avec marche, annonce, coup, charge, regard et flash des trois monstres. Fluidité et lisibilité Android à valider. Scripts et images `?v=26`. |
| 15 | implémentée, à relire et à valider sur Android | Le jeu lit ses salles dans des données (`zones.js` : dimensions, blocs solides, portes avec leurs libellés et leur condition d’ouverture, point de départ, liste de monstres par type et position). `room` et `walls` sont remplis en place par `loadZone()` et gardent les mêmes références ; les modèles de monstres (`enemyKinds`, `makeEnemy`) sont dans `enemies.js`. Seuls les monstres de la zone courante bougent, se dessinent et reçoivent des coups. Aucun contenu nouveau : le donjon a les mêmes murs, blocs, portes, monstres, valeurs et message de sortie qu’avant, vérifiés par un test qui compare les valeurs exactes. Quinze scénarios logiques passent. Scripts `?v=27`. |
| 16 | implémentée puis reprise selon le canon, à relire et à valider sur Android | Première zone extérieure (`zones.js`, thème `ruelle`), d’abord dessinée comme une zone de terre et de rochers, reprise après la fourniture du canon : c’est la ruelle d’Helvara où s’ouvre la faille. Salle de 400 × 1040, bitume (`sol-bitume.svg`) et murs de briques (`mur-brique.svg`, originaux, CC0, déclarés dans `assets/LICENCE.md`), façades de briques avec fenêtres allumées de chaque côté, nuit d’été, trois lampadaires qui éclairent des cercles de bitume, flaques, papiers, mégots et fissures sans collision, sept obstacles en slalom (bennes, caisses, poubelles, scooter) dessinés à l’intérieur de leurs rectangles de collision. La porte nord du donjon, ouverte après le Troll, mène à la faille au sud de la ruelle (déchirure verticale bleue lumineuse, libellé « ABYSSE ») ; elle ramène au donjon (porte nord, monstres restés vaincus, porte ouverte). Le bout nord, côté « RUE » avec la lumière de la ville, termine le prototype (« Yarden a rejoint la rue. Fin du prototype ! »). Aucun monstre dehors, aucun PNJ (les humains ne voient pas la faille). Fondu de 0,4 s à l’arrivée. Seuls les monstres de la zone courante agissent. Un monstre peut avoir un éveil limité (`aggro`), prévu pour de futures zones et testé. Seize scénarios logiques passent, dont un test qui vérifie qu’un chemin libre existe entre la faille et la rue pour un disque de la taille de Yarden ; essai dans Chromium sans erreur. Fluidité et lisibilité Android à valider. Scripts et images `?v=29`. |
| 16b | implémentée, à relire et à valider sur Android | Scène du chapitre 2 (`scene.js`, qui remplace `npc.js` et les deux passants provisoires). Déclenchée quand Yarden, réveillée dans la ruelle, remonte jusqu'au milieu. Moitié sud de la ruelle : lampadaire éteint au coin, façade aveugle à gauche, grille fermée à droite. Déroulé du canon de Jordan : Ishara court et heurte Yarden, les deux hommes la suivent, Tiamat (voix intérieure) dit « Ce n'est pas ton problème », Yarden suit sans courir, « Hé », le poignet saisi puis lâché, aucune faux, aucun mana, aucun sang, les hommes partent au nord, Ishara adossée à la grille. Ishara se présente et le lit en trop sont racontés en narration, sans réplique inventée. Ishara entend « Yarden » (adaptation voulue par Jordan). Fin : « Fin du prototype ! ». Hypothèses à confirmer : les hommes repartent vers le nord ; la course verticale d'Ishara réutilise la marche accélérée ; les hommes sont retournés pour regarder à droite. Scripts et images `?v=31`. |
| 16c | implémentée, à valider | Ménage autorisé par Jordan : `game.js` (421 lignes) est découpé sans changer le comportement en `state.js` (état partagé), `combat.js` (coups, fauchage, esquive, boutons), `input.js` (taille, joystick, clavier, pause), `movement.js` (collisions) et `game.js` (boucle, fin de combat, reprise). Les 22 scénarios passent et un essai Chromium charge le jeu sans erreur. Scripts nouveaux et `game.js` en `?v=32`. Les courses verticales d'Ishara et les poses immobiles des hommes (sources vertes dans `docs/art/ruelle/`) ne sont pas encore converties pour le jeu. |
| 16d | implémentée, à relire et à valider sur Android | Décor de l'antre selon le canon de Jordan (`render-antre.js`, section 12). Sol de cristal noir au nord de la frontière, pierre brute du couloir au sud ; poudre de cristal noir d'environ 30 cm (11 px) le long des murs ; murs de cristal noir ; câbles translucides tendus des parois vers l'araignée, avec un point de mana clair qui glisse lentement ; dominante noire et froide, aucune couleur chaude ajoutée. Les deux colonnes sont des colonnes de cristal noir (adaptation, non canon). Aucune collision modifiée. Reflets en blanc bleuté pâle : couleur provisoire, à confirmer par Jordan. Scripts `?v=33`. |
| 17 | à lancer | Bilan de la phase 2 : fluidité mesurée sur téléphone, poids des images, décision sur Godot. Soumis à validation de Jordan. |

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
| Deux habitants de la ruelle | emplacements et silhouettes provisoires | Identités et dialogues encore à fournir ; aucun nouveau rôle canonique attribué. |

## 11. Ruelle — Ishara et les deux hommes (précisions de Jordan)

Ces précisions concernent la rencontre du chapitre 2. La bible et le texte publié restent les références. Elles remplacent l’hypothèse de deux simples passants pour la conception de cette scène : **Ishara et deux hommes anonymes** sont trois personnages distincts. Le jeu affiche encore les deux silhouettes provisoires de la section 10 ; leur remplacement et la scène ne sont pas encore raccordés.

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

Le lien entre les deux noms est désormais précisé dans le cadre canonique en tête de document. Le travail continue sur les mouvements réutilisables d’Ishara, qui restera présente dans la suite de l’histoire. Les deux passants actuels ne sont pas transformés en acteurs de cette rencontre et aucune nouvelle réplique de scène n’est écrite.

### Version chibi d'Ishara et deux hommes (29 octobre 2026)
Ishara est passée en **chibi**, comme Yarden (règle de style en tête de document). Nouveau pack dans `assets/npcs/ishara/chibi/` : sept bandes de quatre cases de 86 × 115 px, ancrées en (43, 111), même grossissement pour toutes, hauteur debout d'environ 1,05 fois Yarden, environ 65 Ko avec le manifeste `animations.json`. Les directions sont dessinées séparément. Le pack semi-réaliste ci-dessous est remplacé et gardé en attendant la validation de Jordan ; ne plus s'en servir.

Les **deux hommes** sont dans `assets/npcs/hommes/` (`grand.png` et `compact.png`, cases de 134 × 151 px, ancrées en (67, 147), quatre pas de marche vers la gauche et un recul déséquilibré, manifeste `hommes.json`). Ils sont semi-réalistes et simples, sans nom ni arme ; le grand mesure environ 1,4 fois Yarden et le compact environ 1,17. Ils peuvent être retournés. Les sources vertes des deux hommes et d'Ishara sont conservées dans `docs/art/ruelle/hommes/` et `docs/art/ruelle/chibi/` (environ 16 Mo) : décision de Jordan, pour retrouver les originaux depuis le dépôt si son dossier local est perdu. Ni Ishara chibi ni les hommes ne sont encore branchés dans le jeu : les deux silhouettes provisoires de la ruelle restent en place et la scène du chapitre 2 n'est pas raccordée.

### Mouvements préparés pour Ishara
Premier pack de soirée dans `assets/npcs/ishara/soiree/` : repos avec respiration et clignement, marche dans les quatre directions et course à gauche/droite. Sept bandes transparentes de quatre images (28 cases de 128 × 160, ancrage 64 × 140, environ 71 Kio pour les PNG), avec manifeste et aperçu dans `docs/art/ruelle/ishara.html`. Les directions ont été dessinées séparément, sans miroir. Le sac à gauche anatomique est un choix de continuité visuelle encore à valider ; son côté n’est pas fixé par le lore fourni.

Ces ressources préparent sa présence dans la suite de l’histoire, sans lui attribuer le rôle de Yarden et sans déclencher la rencontre. Aspect, cou sans accessoire non canonique, raccords des poses et détails asymétriques restent à valider avant intégration. Les courses de face/de dos ont désormais leurs sources chibi dans `docs/art/ruelle/chibi/` ; leur export et leur raccordement restent à réaliser. La tenue de combat n’est pas encore préparée. Aucun changement du comportement du jeu dans cette livraison de design et de mouvements.

## 12. Canon de l'antre de l'araignée (fourni par Jordan)

**Canon, à respecter.** Salle de l'araignée, Abysse niveau 38. On y arrive par un long couloir de pierre brute dont les parois sont déjà tapissées de fils de cristal ; la frontière de l'antre est le point où le sol de pierre devient cristal. Caverne naturelle agrandie, très grande, plafond d'environ 15 m ; l'araignée traverse 20 m en moins de 2 s, donc au moins 20 m de profondeur. Murs entièrement recouverts de fils de cristal noir : des câbles tendus entre les parois, épais comme un pouce, translucides, avec du mana pur qui circule lentement (comme un flux sanguin), tous convergents vers l'araignée au centre. Espacement : environ 50 cm entre les plus écartés, 30 cm entre les autres ; certains à hauteur de chevilles, d'autres de poitrine ; toucher un fil prévient l'araignée. Les parois de sa zone ne sont pas du cristal d'Abysse normal mais de l'excrétion solidifiée : elle a refait les murs depuis 19 ans. Sol de cristal noir, avec le long des murs une couche d'environ 30 cm de poudre de cristal noir (sable et cendre). Aucune source de lumière visible : les fils captent la lumière et la redistribuent en milliers de reflets froids ; dominante noire, froide, sans couleur chaude. Mana épais et « collant ». Au centre : l'araignée, environ 2 m au garrot, corps de cristal noir translucide (organes en ombre), huit yeux en arc, pattes qui effleurent à peine le sol, qui ne dort jamais. Vibration infrasonore qui fait trembler les murs et résonner tous les fils.

**Non canon, adaptation de jeu.** Les piliers de pierre du roman sont dans la salle du Troll, pas dans l'antre : ceux de l'antre sont donc des colonnes de cristal noir, jamais de la pierre. La faille d'entrée au sud est un choix de mise en page : dans le roman, la sortie de l'Abysse est loin de l'antre.

**À demander à Jordan, sans l'inventer.** Couleur exacte des reflets ; forme précise des colonnes.
