# Interface PC et mobile

Les paramètres proposent des commandes automatiques, tactiles ou clavier/souris, ainsi qu'une taille de dialogue de 16 à 24 px. Ces préférences restent dans ce navigateur, sans modifier la sauvegarde de l'histoire.

En automatique, le type de pointeur initial sélectionne la disposition. Un toucher active les commandes tactiles ; une touche de déplacement active la disposition clavier hors des fenêtres. Le choix manuel convient aux appareils hybrides.

Les dialogues occupent une zone séparée du terrain : au-dessus de la ruelle pour préserver les animations, sous le terrain dans les autres scènes. La prise du poignet et le recul gardent un cadrage centré sur Yarden et l'inconnu. Les fenêtres de sac, statistiques, carte et paramètres utilisent toute la surface de l'application ; leur contenu défile, leur fermeture reste accessible. Échap ferme la fenêtre active ou ouvre Pause pendant un dialogue.

## Vérifications

- `node tests/smoke.cjs` : 48 scénarios de logique réussis au 31 octobre 2026.
- Carte et transitions, session du 31 octobre : vérification navigateur tentée mais bloquée au lancement de Chromium par le sandbox (`Operation not permitted`). Les quatre formats 360 × 640, 390 × 844, 844 × 390 et 1440 × 900 restent à contrôler pour cette modification, y compris la vraie scène du poignet et le miroir. Les vérifications Chromium ci-dessous concernent les livraisons précédentes.
- Chromium : 390 × 844, 360 × 640, 844 × 390, 1440 × 900 ; fenêtres, titre, sac, statistiques, carte du mode libre et véritable scène du poignet. Navigation Tab confinée, pause puis retour à la même réplique, texte de 24 px et commandes choisies manuellement.
- Vérifications complémentaires : paysage 667 × 375, dialogue long défilant, déplacement et attaque par deux contacts tactiles simultanés.
- Ces essais émulent les entrées mobiles ; ils ne mesurent pas la fluidité ni le confort des pouces sur un téléphone réel.

## Essai sur téléphone après intégration

1. Ouvrir le jeu et les paramètres en portrait puis paysage : atteindre les derniers réglages par défilement et revenir avec Retour.
2. Afficher le sac et les statistiques : parcourir le contenu et fermer sans devoir viser une petite cible.
3. Reprendre la ruelle : vérifier que les personnages et la prise du poignet restent visibles sous les dialogues, puis Pause/Reprendre sans perdre la réplique.
4. Pendant un combat, maintenir le joystick et attaquer ou esquiver avec l'autre pouce ; vérifier la libération du joystick et la rotation du téléphone.
5. En mode libre, ouvrir la carte et changer de quartier ; sur PC, vérifier les raccourcis et l'absence de joystick en mode clavier.

## Carte et transitions (31 octobre 2026)

La grande carte représente les liaisons déjà jouables entre Quartier étudiant, Rue Marterey et Sous-gare. C'est un schéma, sans échelle ni géographie canonique ajoutée. La position actuelle et le quartier sélectionné ont des repères distincts. Sélectionner un quartier affiche le niveau actuel de ses failles et le trajet ; « Y aller » ferme la carte et indique la direction dans l'objectif et le mini-plan. On continue à marcher par les bords des rues. Dans une faille, la carte reste consultable et le départ est désactivé. Le niveau des failles, les crédits, la dette et les sauvegardes ne changent pas.

Les transitions mélangent brièvement la dernière vue affichée avec l'arrivée, en conservant une seule capture en mémoire. Première visite dans la partie : 0,4 s ; visite répétée : 0,18 s ; passage entre rues : 0,1 s. Le nom du lieu apparaît brièvement hors dialogues et scènes. Le déplacement reste actif pendant le fondu, sans attendre un nouvel appui ; l'attaque et l'esquive en cours sont annulées. Aucun changement aux transitions sonores : les quartiers partagent déjà le thème ville, et l'entrée en Abysse change de thème par le système existant. Le Canvas principal n'est pas redimensionné par le fondu ; le correctif de redimensionnement dans `input.js` reste intact.

Essai complémentaire après intégration : Carte → Sous-gare → « Y aller » depuis le Quartier étudiant ; suivre la flèche à travers Marterey sans téléportation. Revenir plusieurs fois, pouce maintenu puis relâché, et vérifier l'arrêt immédiat. Entrer dans une faille, consulter la carte et vérifier que « Y aller » est désactivé ; vaincre les ennemis et ressortir. Recharger une sauvegarde de l'histoire, rejouer le poignet puis le miroir et tourner l'écran pendant un dialogue. Vérifier que les animations restent dégagées et qu'aucun flash n'apparaît. Ces essais restent à faire sur téléphone réel.

La mise en page ne constitue pas une certification d'accessibilité. Les contrastes de tous les états, les lecteurs d'écran, les encoches et les gestes système demandent des vérifications dédiées.

## Corrections ajoutées après contrôle (Claude, 30 octobre 2026)

- Grand écran : le décor est agrandi jusqu'à ×2 quand le terrain mesure au moins 620 px de large (`resize` dans `input.js`) ; jamais sur téléphone.
- Paysage téléphone avec dialogue : le panneau passe à droite du terrain (`ux.css`, fin du fichier).
- Grand écran : jauges et objectif limités à 640 px.

## Dialogues et éclairage (31 octobre 2026)

Dans la ruelle, la zone de dialogue reste au-dessus du terrain pendant les répliques et les animations sans texte. Elle occupe la place libérée par les commandes de scène, pour conserver de la hauteur au terrain. L'en-tête est mesuré pour placer le panneau sans le recouvrir. En paysage court, la disposition reste latérale. Le cadrage du poignet et le redessin immédiat lors d'un vrai redimensionnement restent actifs. Le panneau mesure 184 px en portrait et sur PC ; son contenu défile, les actions restent accessibles et chaque nouvelle réplique revient au début du texte.

La narration porte un libellé sobre sans portrait ; la parole garde le nom et le portrait ; Tiamat garde son œil stylisé et le libellé de voix intérieure, avec bordure violette et texte en italique. Les textes et leur ordre restent inchangés. Le bouton « Historique » ouvre les 40 dernières répliques affichées dans une fenêtre défilante ; « Retour au dialogue » ou Échap revient à la réplique en cours. L'historique ne rejoue aucune action, ne révèle aucune ligne à venir et n'est pas enregistré ; une reprise de point de passage le remet à zéro. L'apparition progressive du texte n'est pas ajoutée.

La lumière reprend uniquement les sources existantes et leur palette. Une passe légère de couleur éclaire aussi les personnages ; des ombres courtes s'orientent selon la source proche. Les repères, le mini-plan et les textes passent au-dessus. Les plans du miroir, du métro et de la nuit restent indépendants. Ni lecture des pixels, ni filtre appliqué à chaque sprite, ni image supplémentaire. Le lampadaire éteint de la ruelle n'éclaire pas la scène du poignet.

Validation logique : distinction des voix, portrait de repli, historique sans texte futur ni effet sur la sauvegarde ou la progression, limite de 40 répliques, sources et palettes, dessin sans changement du monde, exclusion des plans narratifs. Chromium refuse toujours de démarrer dans le sandbox (`Operation not permitted`) : aucune nouvelle vérification visuelle aux quatre formats demandés n'est revendiquée.

À tester avant fusion : ruelle en portrait puis paysage (poignet et recul entièrement visibles), plusieurs répliques courtes puis longues à 24 px, Historique → Retour → Continuer, Échap et Tab sur PC, Pause/Reprendre, puis miroir et nuit. Comparer l'appartement chaud et l'antre froid, vérifier les annonces des ennemis et les failles du mode libre. Répéter sur téléphone réel : une émulation ne suffit pas pour juger la fluidité et le confort.
