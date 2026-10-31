# Interface PC et mobile

Les paramètres proposent des commandes automatiques, tactiles ou clavier/souris, ainsi qu'une taille de dialogue de 16 à 24 px. Ces préférences restent dans ce navigateur, sans modifier la sauvegarde de l'histoire.

En automatique, le type de pointeur initial sélectionne la disposition. Un toucher active les commandes tactiles ; une touche de déplacement active la disposition clavier hors des fenêtres. Le choix manuel convient aux appareils hybrides.

Les dialogues occupent une zone séparée du terrain : au-dessus de la ruelle pour préserver les animations, sous le terrain dans les autres scènes. La prise du poignet et le recul gardent un cadrage centré sur Yarden et l'inconnu. Les fenêtres de sac, statistiques, carte et paramètres utilisent toute la surface de l'application ; leur contenu défile, leur fermeture reste accessible. Échap ferme la fenêtre active ou ouvre Pause pendant un dialogue.

## Vérifications

- `node tests/smoke.cjs` : 41 scénarios de logique réussis au 31 octobre 2026.
- Carte, session du 31 octobre : vérification navigateur tentée mais bloquée au lancement de Chromium par le sandbox (`Operation not permitted`). Les quatre formats 360 × 640, 390 × 844, 844 × 390 et 1440 × 900 restent à contrôler pour cette modification, y compris la vraie scène du poignet et le miroir. Les vérifications Chromium ci-dessous concernent les livraisons précédentes.
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

Essai complémentaire après intégration : Carte → Sous-gare → « Y aller » depuis le Quartier étudiant ; suivre la flèche à travers Marterey sans téléportation. Revenir plusieurs fois, pouce maintenu puis relâché, et vérifier l'arrêt immédiat. Entrer dans une faille, consulter la carte et vérifier que « Y aller » est désactivé ; vaincre les ennemis et ressortir. Recharger une sauvegarde de l'histoire, rejouer le poignet puis le miroir et tourner l'écran pendant un dialogue. Vérifier que les animations restent dégagées et qu'aucun flash n'apparaît. Ces essais restent à faire sur téléphone réel.

La mise en page ne constitue pas une certification d'accessibilité. Les contrastes de tous les états, les lecteurs d'écran, les encoches et les gestes système demandent des vérifications dédiées.

## Corrections ajoutées après contrôle (Claude, 30 octobre 2026)

- Grand écran : le décor est agrandi jusqu'à ×2 quand le terrain mesure au moins 620 px de large (`resize` dans `input.js`) ; jamais sur téléphone.
- Paysage téléphone avec dialogue : le panneau passe à droite du terrain (`ux.css`, fin du fichier).
- Grand écran : jauges et objectif limités à 640 px.
