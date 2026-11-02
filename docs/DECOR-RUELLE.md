# Ruelle : proposition du 2 novembre 2026

La branche `codex/combat-tour-ruelle` remplace l'export `assets/decors/ruelle.jpg` par un nouveau fond peint orthographique. Vue du dessus et échelle constante entre les deux extrémités : pas de perspective plongeante ou de point de fuite. Asphalte nocturne, fissures, débris discrets, flaques et caniveaux ; aucune silhouette ni grand obstacle intégré à l'image.

Le moteur place le fond dans le rectangle existant de 400 × 1040 unités. L'export est un JPEG de 800 × 2080 pixels, environ 269 Kio, sans métadonnées, chargé une fois avec `?v=2`. L'original de production reste hors du dépôt (`/workspace/generated_images/exec-6c0c0202-eebf-4494-9f12-3e9b92717a90.png` dans l'environnement de création). Les captures de contrôle restent également hors du dépôt.

Les bennes, caisses, poubelles et le scooter gardent leurs exports et leurs positions de collision. Les façades périphériques et les bordures passent à des tons charbon proches du fond peint. La résidence de la fête, les lampadaires existants, le lampadaire éteint et la grille sont dessinés en code par-dessus le fond ; ils étaient masqués par le premier raccordement du décor peint. Aucun nouvel éclairage ni nouveau lieu n'est ajouté. Les petits débris du dessin en code sont évités quand le fond peint est disponible.

Le fond sert aussi à l'écran titre, avec un voile sombre pour conserver le contraste du texte. Le motif de pierre existant reste employé pour l'essai de combat dans l'Abysse : la ruelle n'est pas utilisée comme décor de cette rencontre.

Si le JPEG manque, le sol et les murs dessinés en code restent disponibles. Les positions, collisions, déplacements de scène, dialogues, caméras, transitions et sauvegardes ne changent pas. Le cadrage du poignet et le correctif de redimensionnement du Canvas sont conservés.

Avant fusion : comparer le rendu en portrait et paysage sur téléphone réel, les bords de la voie, la lisibilité de Yarden, le poignet et le recul ; vérifier que les obstacles visibles correspondent toujours aux zones solides. Aucun essai Android réel n'est revendiqué par cette livraison.
