# Rapport des fichiers — quoi garder, quoi alléger

Audit du 4 novembre 2026 — version `6ab6572`.

## Mon avis, simplement

Je ne vois pas de gros fichier de code entier à jeter. Les 44 scripts JavaScript de la racine sont chargés par le jeu et ont une fonction identifiable. Les supprimer au hasard ferait perdre des morceaux du jeu.

Le nettoyage le plus utile serait de remettre les documents à jour, de réparer l’export des textes et d’étiqueter les vieux packs. Les quelques éléments de code sans lecteur se retireraient **à l’intérieur** des fichiers, pas en supprimant les fichiers eux-mêmes.

Un fichier qui n’apparaît pas pendant une partie peut quand même servir à refaire une image, vérifier une animation ou préparer le chapitre suivant. J’ai donc distingué « pas utilisé dans le jeu actuel » et « sans utilité identifiée ».

## Le poids du projet

| Ensemble | Nombre de fichiers | Poids approximatif | Lecture simple |
|---|---:|---:|---|
| Tous les fichiers suivis | 523 | 54,35 Mio | Le contenu actuel du dépôt, hors historique Git. |
| Documentation et ressources de travail (`docs/`) | 262 | 51,14 Mio | C’est là que se trouve presque tout le poids. |
| Dont images, aperçus et fiches (`docs/art/`) | 257 | 50,84 Mio | Ce sont surtout les matériaux qui servent à fabriquer le jeu. |
| Ressources légères (`assets/`) | 209 | 2,61 Mio | Mélange d’images du jeu, de vieux aperçus et de ressources à venir. |
| Images demandées par les chargeurs du jeu | 108 | 1,64 Mio | Demandes captées au démarrage dans une simulation locale. |
| Ressources transparentes préparées pour les chapitres 7–9 | 78 | 0,74 Mio | Pas demandées par les chargeurs actuels. |

Un Mio vaut 1 048 576 octets. Les poids ci-dessus décrivent les fichiers, pas le trafic réseau réel, la mémoire une fois les images décodées, ni les performances sur téléphone.

**Important :** supprimer une image de `docs/art/` ne rendra généralement pas le jeu plus rapide : le jeu ne la charge pas. Cela allège la copie actuelle des fichiers, mais ne retire pas les versions déjà enregistrées dans l’historique Git. Aucune purge de l’historique n’est proposée ici.

## Ce que je traiterais en premier

### F01 — Réparer la copie de relecture des textes

**Fichiers :** [docs/outils/exporter-textes.cjs](../../docs/outils/exporter-textes.cjs) et [docs/TEXTES.md](../../docs/TEXTES.md).

**Pourquoi :** le générateur demande séparément plusieurs scènes qui contiennent déjà leur suite. Par exemple, `runEndScript()` inclut Marterey, qui inclut le comptoir, puis Sous-gare, le 4B et les chapitres suivants. Le générateur redemande ensuite ces mêmes étapes une à une. Résultat : le début de l’appartement d’Izzy apparaît **huit fois** dans les 2 983 lignes du document.

**Image simple :** on photocopie le livre entier, puis encore ses derniers chapitres à chaque onglet.

**Conseil :** garder l’outil et le document. Faire exporter chaque scène une seule fois, avec les bons titres, puis régénérer la copie. Ne pas supprimer les répétitions à la main dans `TEXTES.md`, elles reviendraient au prochain export. Ne pas retirer les suites dans les fonctions du jeu pour corriger seulement un problème de document.

**Ce qui casserait si on supprimait :** pas forcément le jeu, mais ta copie de relecture et le moyen de la remettre à jour. Les répétitions du document ne prouvent pas des répétitions pendant une partie.

### F02 — Actualiser le README et le bilan

**Fichiers :** [README.md](../../README.md), [BILAN.md](../../BILAN.md).

Le README annonce encore une fin après la rencontre avec Ishara. Le « point actuel » du bilan dit que le trajet, l’appartement et le 4B ne sont pas jouables. Pourtant le jeu continue jusqu’au chapitre 6. Le bilan conserve aussi des affirmations historiques comme « Pas de sauvegarde ».

**Conseil :** mettre en haut un état actuel très court : chapitres 1–6, mode libre, sauvegarde locale, contrôles. Garder les anciennes validations sous une date. Ces fichiers sont utiles, mais leur début peut induire en erreur.

### F03 — Ranger PROJECT.md sans perdre le canon

**Fichier :** [PROJECT.md](../../PROJECT.md), 538 lignes.

Il contient des décisions essentielles, puis des états qui se contredisent à mesure que le projet avance : chapitre 6 « pas implémenté » au §34 et « dans le jeu » au §39 ; interdictions initiales de sauvegarde/inventaire, puis autorisations et implémentation ; ancienne position du miroir au matin, puis ordre révisé le soir.

**Conseil :** préparer un bloc « état actuel et décisions en vigueur », puis isoler le journal ancien. Garder les décisions et leurs dates. Un déplacement de sections demanderait aussi d’actualiser les renvois « section 34 », etc. Ce n’est pas un fichier inutile : c’est un classeur dont les fiches anciennes et actuelles sont mélangées.

### F04 — Dater les guides devenus anciens

**Fichiers :** [docs/TOPO-TEST.md](../../docs/TOPO-TEST.md), [docs/art/yarden/README.md](../../docs/art/yarden/README.md), [docs/COMMANDES-IMAGES-CH7-9.md](../../docs/COMMANDES-IMAGES-CH7-9.md) et commentaires en tête de plusieurs scripts.

- Le topo annonce une fin au chapitre 5, puis ajoute le chapitre 6 plus bas ; son dernier titre dit encore « chapitres 6 à 9… pas encore dans le jeu ».
- La fiche Yarden dit que les images ne sont pas intégrées, que les marches verticales manquent et que les yeux sont bleu-gris. Ces informations ne décrivent plus la version actuelle.
- Les commandes d’images 7–9 demandent des packs déjà livrés. Elles restent utiles pour comprendre ce qui a été commandé, à condition de les marquer « reçus ».
- [save.js](../../save.js) parle encore de trois points de passage alors que sa liste en contient seize ; [chapitre2b.js](../../chapitre2b.js) dit que la tenue de combat n’existe pas ; [scene.js](../../scene.js) annonce une scène sans répliques ajoutées alors qu’elle a depuis évolué.

**Conseil :** corriger le statut de ces documents et commentaires. Pas besoin de jeter les fichiers.

## Ce qui peut sortir du dossier du jeu, avec ses liens

### F05 — L’ancien pack semi-réaliste d’Ishara

**Dossier complet :** `assets/npcs/ishara/soiree/` — 9 fichiers, environ 88 Kio.

La scène utilise désormais `assets/npcs/ishara/chibi/`, même quand la tenue porte le nom « soiree » dans le code. L’ancien pack ne fait pas partie des 108 images demandées. Il sert encore à [docs/art/ruelle/ishara.html](../../docs/art/ruelle/ishara.html).

**Conseil :** candidat à une archive d’anciens designs, avec l’aperçu et ses références. **Ne pas supprimer les neuf fichiers seuls** : l’aperçu se retrouverait vide. Le manifeste chibi indique aussi que sa conservation jusqu’à validation était volontaire ; ton GO pour cet audit ne vaut pas suppression de cette sauvegarde.

**Gain attendu :** très petit sur le dépôt, aucun sur le chargement actuel du jeu.

### F06 — Huit poses de Yarden réservées à la démonstration

**Fichiers :** [assets/yarden/failed.png](../../assets/yarden/failed.png), `jumping.png`, `look-10.png`, `look-9.png`, `review.png`, `running.png`, `waiting.png`, `waving.png`.

Ces huit fichiers ne sont pas demandés par le chargeur du jeu. Ils sont décrits dans [assets/yarden/animations.json](../../assets/yarden/animations.json) et utilisés par [docs/art/yarden/index.html](../../docs/art/yarden/index.html) / `preview.js`. Attention : `running.png` est une pose de réflexion ; les vraies courses sont `running-left.png` et `running-right.png`, chargées par le jeu.

**Conseil :** les garder tant que l’aperçu est utile, ou archiver ensemble les poses, l’aperçu et sa fiche. Ne pas remplacer `defeat.png` par `failed.png` : ce sont deux actions différentes.

### F07 — GIF et vidéo de contrôle de Yarden

**Dossier :** `docs/art/yarden/previews/` — 13 fichiers, environ 1,78 Mio.

Ils montrent des animations déjà consultables dans l’aperçu HTML. C’est une autre façon de vérifier les poses, pas un doublon exact des fichiers.

**Conseil :** archive facultative si l’aperçu HTML te suffit. Mettre à jour les liens du README avant tout retrait. Le jeu n’en dépend pas.

### F08 — Anciennes propositions et références visuelles

**Exemples :** [docs/art/ruelle/proposition-npc.png](../../docs/art/ruelle/proposition-npc.png), `docs/art/ruelle/hommes/`, `docs/art/personnages-a-venir/`.

Leur rôle dans le jeu a été remplacé par d’autres packs. Ils peuvent encore servir à retrouver les vêtements ou à comprendre l’évolution du design. Les deux références « personnages-a-venir » occupent environ 2,20 Mio, alors qu’Izzy et Céleste sont maintenant présentes.

**Conseil :** étiqueter « anciennes références » ou déplacer vers une archive, en gardant les liens et manifestes cohérents. Aucune suppression sûre à l’unité n’est justifiée par la seule absence dans le chargeur du jeu.

## Ce qui n’est pas encore joué, mais reste utile

### F09 — Les packs des chapitres 7 à 9

**Chemins :** `docs/art/ch7-9/`, `assets/npcs/ch7-9/`, `assets/objets/` et onze portraits associés listés dans l’inventaire.

Le §17m du journal indique qu’ils sont reçus et convertis, mais pas branchés. Il s’agit de la vieille femme, du concierge, de Vasseur, des tenues, de Yarden à mains nues et d’objets pour les chapitres suivants.

**Conseil :** conserver comme réserve clairement nommée. Une image prête pour le prochain chapitre n’est pas une erreur à nettoyer. Le concierge du chapitre 6 réutilise encore un figurant ; le pack réservé existe mais n’est pas sélectionné par le chargeur actuel. Cela peut devenir une petite intégration future, pas une raison de le supprimer.

### F10 — Les grandes images dans docs/art

Ce dossier pèse environ 50,84 Mio. La seule série `docs/art/ruelle/chibi/` contient plusieurs bandes proches de 1,8 Mo chacune ; [docs/art/yarden/yarden-source.png](../../docs/art/yarden/yarden-source.png) pèse 3,17 Mo décimaux.

**Pourquoi elles sont là :** le convertisseur fabrique les petites images transparentes de `assets/` à partir des ressources de travail. Le projet documente aussi ta décision de garder des sources pour pouvoir les retrouver si le dossier local disparaît.

**Conseil :** les conserver tant qu’il n’existe pas une archive vérifiée et accessible. Déplacer au hasard les entrées du convertisseur casserait la réexportation. Ne pas comprimer en écrasant les originaux : on perdrait la possibilité de refaire proprement un découpage.

## Les petits bouts de code qui ne servent pas aujourd’hui

### F11 — textIsTyping

**Emplacement :** `dialogue.js:41`.

La fonction renvoie si le texte s’écrit encore. Je n’ai trouvé aucun appel dans le code ou les tests ; `advanceStory()` utilise directement `finishTextTyping()`.

**Conseil :** suppression possible de cette seule fonction si on n’en prévoit pas d’usage. Gain minuscule. Garder tout le reste de [dialogue.js](../../dialogue.js), qui sert au jeu.

### F12 — izzyContract

**Emplacements :** `chapitre5.js:12` et `chapitre5.js:50`.

L’objet est créé, puis `active` devient vrai. Rien ne lit cette information, et le remboursement ne la remet pas à faux. Le récit du contrat fonctionne par les scènes, pas par cet objet.

**Conseil :** soit retirer la déclaration et son affectation, soit lui donner un rôle réel lors d’une future mécanique. Ne pas supprimer le versement des 520 ni le texte du contrat avec l’affectation : ils sont sur la même ligne.

### F13 — resetPoints

**Emplacement :** `points.js:58`.

La fonction remet la fenêtre des points à zéro, mais n’est appelée nulle part dans les scripts et tests inspectés.

**Conseil :** vérifier d’abord si elle devait être branchée au redémarrage. C’est peut-être un branchement oublié, pas du code à jeter. Sa présence ne justifie surtout pas de supprimer [points.js](../../points.js).

Trois autres noms apparaissaient une seule fois dans une recherche automatique : `buildParty`, `buildConfetti`, `buildAntre`. **Ils sont exécutés immédiatement à leur définition. Ils sont utiles.** Une recherche de noms sans lecture du code les aurait classés à tort comme inutilisés.

## Les faux doublons à garder

- [AGENTS.md](../../AGENTS.md) et [CLAUDE.md](../../CLAUDE.md) ont la même courte consigne, mais s’adressent à deux outils différents.
- Les `animations.json` décrivent les packs ; les `animations-data.js` permettent à des aperçus de fonctionner sans serveur. Même donnée, usages différents.
- Quatre pages HTML sont identiques octet par octet : les aperçus de `docs/art/faux/`, `portraits-dialogue/`, `ruelle/danseurs/` et `ruelle/hommes-chibi/`. Elles chargent les données relatives à leur propre dossier. En supprimer trois casserait trois entrées d’aperçu. Un modèle commun est possible, mais le gain ne justifie pas un chantier pendant cet audit.
- Une grande image verte dans `docs/art/` et son petit export transparent dans `assets/` ne sont pas des doublons interchangeables. Aucun groupe d’images strictement identiques n’a été trouvé par empreinte SHA-256 parmi les 523 fichiers suivis.
- Les dessins simples de secours protègent le jeu quand une image manque. Ce n’est pas du code inutile juste parce qu’on ne le voit pas lorsque tout charge.

## Vérifications et limites

- Inventaire des **523 fichiers suivis par Git**, avec taille, rôle, conseil et risque dans `03-INVENTAIRE-523-FICHIERS.csv`. Les dossiers internes de Git et les autres branches n’ont pas été audités. La branche d’archive du roguelite n’a pas été modifiée ni utilisée comme contenu actuel.
- Empreintes SHA-256 sur ces 523 fichiers, pour chercher de vrais doublons.
- Contrôle du chargement des 44 scripts de la racine, inspection de leurs rôles et recherche de références. Cela ne prouve pas que chaque ligne de chaque script est atteignable dans toutes les parties ; aucun fichier entier n’a été déclaré supprimable sur cette seule base.
- Chargeurs d’images exécutés dans un environnement JavaScript simulé : **108 chemins distincts, tous présents**. La liste est dans `ressources-demandees.json`. Les chemins construits dynamiquement ont ainsi été pris en compte ; une simple recherche de noms les aurait manqués. Le lecteur audio peut tenter des fichiers de musique absents et utilise alors sa musique de secours ; ce n’est pas une image manquante.
- **48 scénarios logiques réussis** avec `node tests/smoke.cjs`. La suite utilise sa propre liste de scripts et ne charge pas [ux.js](../../ux.js) ; elle n’est donc pas la preuve d’un contrôle complet de l’interface réelle, ni des dialogues des chapitres récents.
- Lecture des textes narratifs et du canon disponible ; les images ont été inventoriées selon leur usage et leurs métadonnées, pas jugées artistiquement image par image. Aucun navigateur ni téléphone n’a servi à une partie complète pendant cet audit.

**Résultat concret :** je recommande d’abord F01–F04. F05–F08 sont des choix d’archivage, F09–F10 sont à préserver, F11–F13 sont de très petits nettoyages à décider séparément. Aucun fichier existant n’a été modifié, supprimé, commité ou poussé.

## Annexe : rôle de chaque fichier du jeu

Tous les fichiers suivants sont chargés par la page actuelle. « Chargé » ne signifie pas que chaque fonction interne est utile ; les candidats internes sont détaillés plus haut.

| Fichier | À quoi il sert | Conseil |
|---|---|---|
| [apartment.js](../../apartment.js) | Appartement, objets à examiner et première nuit. | Conserver. |
| [audio.js](../../audio.js) | Musique de secours et effets sonores. | Conserver. |
| [bag.js](../../bag.js) | Sac, crédits et dette. | Conserver. |
| [chapitre2b.js](../../chapitre2b.js) | Run, vente chez Rémi et arrivée au 4B. | Conserver. |
| [chapitre3.js](../../chapitre3.js) | Félix, identité et corde d’Ishara. | Conserver. |
| [chapitre4.js](../../chapitre4.js) | Pâtes, square, équipe, Céleste et faux souvenir. | Conserver. |
| [chapitre5.js](../../chapitre5.js) | Points de VIT, Izzy, paiement et papiers. | Conserver. |
| [chapitre6.js](../../chapitre6.js) | Enveloppe, Flon, remboursement et logement. | Conserver. |
| [combat.js](../../combat.js) | Attaques et esquive. | Conserver. |
| [dialogue.js](../../dialogue.js) | Bulles, portraits, texte progressif et historique. | Conserver. |
| [dungeon.js](../../dungeon.js) | Progression du premier donjon et portes. | Conserver. |
| [encounter.js](../../encounter.js) | Combat de l’araignée et système de récit. | Conserver. |
| [enemies.js](../../enemies.js) | Comportement et attaques des ennemis. | Conserver. |
| [game.js](../../game.js) | Boucle principale, redémarrage et fin de partie. | Conserver. |
| [hud.js](../../hud.js) | Jauges, objectifs et boutons. | Conserver. |
| [index.html](../../index.html) | Page d’entrée, interface et ordre de chargement. | Conserver. |
| [input.js](../../input.js) | Clavier, joystick, pause et taille du Canvas. | Conserver. |
| [levelup.js](../../levelup.js) | Montée au niveau 24 et effet visuel. | Conserver. |
| [libre.js](../../libre.js) | Mode libre, failles aléatoires, carte et itinéraires. | Conserver. |
| [lighting.js](../../lighting.js) | Lumières et ombres. | Conserver. |
| [menu.js](../../menu.js) | Titre, pause et paramètres. | Conserver. |
| [metro.js](../../metro.js) | Plan animé du métro. | Conserver. |
| [mirror.js](../../mirror.js) | Portrait et scène du miroir. | Conserver. |
| [monster-sprite.js](../../monster-sprite.js) | Chargement et dessin des monstres. | Conserver. |
| [movement.js](../../movement.js) | Déplacement et collisions. | Conserver. |
| [night.js](../../night.js) | Nuit et lueur des tatouages. | Conserver. |
| [opening.js](../../opening.js) | Ouverture, faille et entrée dans l’Abysse. | Conserver. |
| [points.js](../../points.js) | Attribution des six points en VIT. | Conserver. |
| [render-antre.js](../../render-antre.js) | Décor de l’antre. | Conserver. |
| [render-appart.js](../../render-appart.js) | Décor de l’appartement d’Ishara. | Conserver. |
| [render-ch2b.js](../../render-ch2b.js) | Décors du run, de Rémi et du 4B. | Conserver. |
| [render-ch4.js](../../render-ch4.js) | Décor du square et déchirure. | Conserver. |
| [render-ch6.js](../../render-ch6.js) | Préau, Flon, hall et appartement d’Izzy. | Conserver. |
| [render-quartier.js](../../render-quartier.js) | Rue devant l’immeuble. | Conserver. |
| [render.js](../../render.js) | Dessin général, caméra et décor de base. | Conserver. |
| [save.js](../../save.js) | Sauvegardes par points de passage. | Conserver. |
| [scene.js](../../scene.js) | Moteur des scènes, acteurs et rencontre avec Ishara. | Conserver. |
| [sheets.js](../../sheets.js) | Découpage des personnages du chapitre 4. | Conserver. |
| [state.js](../../state.js) | État partagé et objets du moteur. | Conserver. |
| [stats.js](../../stats.js) | Fenêtre des statistiques et identité. | Conserver. |
| [transitions.js](../../transitions.js) | Fondus entre lieux. | Conserver. |
| [ux.css](../../ux.css) | Disposition de l’interface sur mobile et PC. | Conserver. |
| [ux.js](../../ux.js) | Disposition mobile/PC, réglages et navigation des fenêtres. | Conserver. |
| [weapon-art.js](../../weapon-art.js) | Images de la faux et de ses arcs. | Conserver. |
| [yarden-sprite.js](../../yarden-sprite.js) | Animations et tenues de Yarden. | Conserver. |
| [zones.js](../../zones.js) | Lieux, obstacles, monstres et départs. | Conserver. |
