# Les 12 musiques du Sang de Tiamat

Douze pistes suffisent pour les lieux des chapitres jouables et le mode libre.
Plusieurs rues partagent une musique ; chaque pièce n’a pas besoin de son morceau.
Les noms ci-dessous sont déjà reconnus par le jeu sur la branche `codex/musiques-ambiances`.

Tu peux produire les morceaux dans cet ordre : **1, 3, 4, 6, 8, 9**, puis les six
autres. Les versions composées en code prennent le relais tant qu’un fichier manque.

| # | Fichier à fournir | Où on l’entend | Couleur musicale |
|---|---|---|---|
| 1 | `titre.mp3` | Écran d’accueil | Thème sombre, mémorable, retenu |
| 2 | `ruelle.mp3` | Réveil et retour dans la ruelle | Nuit urbaine, solitude |
| 3 | `ville.mp3` | Quartier, Marterey, comptoir, Sous-gare, Flon, impasse | Ville vivante, mystère discret |
| 4 | `appartement.mp3` | Chez Ishara, arrivée et matin | Chaleur, maladresse, refuge |
| 5 | `nuit.mp3` | Chez Ishara, le soir et la nuit | Intimité, pensées, présence intérieure |
| 6 | `abysse.mp3` | Donjon, premier run, failles du mode libre | Exploration dangereuse, pulsation |
| 7 | `antre.mp3` | Antre de l’araignée | Cristal, menace silencieuse |
| 8 | `combat.mp3` | Troll et créature du square | Urgence, précision, danger |
| 9 | `quatreb.mp3` | Cour, escalier et intérieur du 4B | Ordre ancien, étrangeté, papier |
| 10 | `dossier.mp3` | Square hors combat, préau du chapitre 6 | Surveillance, dette, calcul |
| 11 | `ouchy.mp3` | Hall et appartement d’Izzy | Luxe calme, distance, fragilité |
| 12 | `fete.mp3` | Passage de la fête dans la ruelle | Club entendu depuis la rue |

**Tiamat n’a pas besoin d’une treizième piste pour chaque réplique.** Sa présence
peut passer par quelques notes froides dans les morceaux du 4B, de la nuit et de
l’antre. Cela évite de changer de musique à chaque bulle.

## Pour toute la série

Garder une même famille sonore : piano feutré, touches électriques, cordes graves,
textures cristallines et électronique discrète. Le jeu raconte une dark fantasy
urbaine adulte ; la musique doit laisser de la place à la lecture.

Viser **60 à 90 secondes par boucle**, sans paroles ni voix. Si Gemini ne propose
qu’un extrait plus court, garde-le : on vérifiera sa répétition avant intégration.
Le résultat peut nécessiter une petite retouche pour raccorder parfaitement la fin
au début. Les tonalités et tempos proposés sont des directions, pas des contraintes
qui obligent à jeter une bonne génération.

Conserver l’original WAV si disponible. Pour le jeu : MP3 ou OGG, environ 1 à
1,5 Mo par piste, volume homogène, sans saturation. Tu peux me fournir les
originaux ; la conversion et le raccord de boucle pourront être faits ensuite.

## 1. Accueil — `titre`

```text
Crée une musique instrumentale originale pour l’écran d’accueil d’un RPG narratif de dark fantasy urbaine intitulé « Le Sang de Tiamat ». Atmosphère nocturne, élégante et inquiétante, avec une force contenue. 76 BPM, la mineur. Un petit motif descendant la–mi–do, joué sur un piano feutré et doublé ponctuellement d’un timbre cristallin. Cordes graves tenues, basse ronde, pulsation électronique légère. Une seconde partie développe le motif sans devenir triomphale, puis revient naturellement au début. Boucle de 60 à 90 secondes, immédiatement installée, sans introduction longue ni conclusion. Mix aéré, utilisable sous du texte. Aucun chant, aucune parole, aucun chœur, aucun bruitage. Éviter les grands impacts et les montées de bande-annonce.
```

## 2. Ruelle — `ruelle`

```text
Compose une boucle instrumentale originale pour une jeune femme qui se réveille seule, de nuit, dans une ruelle d’une ville contemporaine. Dark fantasy urbaine, calme tendu et sensation de décalage. 72 BPM, fa dièse mineur. Piano électrique étouffé, basse profonde mais audible sur téléphone, percussion sourde très espacée, nappes fines et petites résonances métalliques lointaines. Une mélodie courte apparaît puis laisse du silence ; quelques détails évoluent toutes les quatre mesures. La ville semble continuer à vivre sans remarquer le personnage. Boucle de 60 à 90 secondes, fin raccordable au début. Aucun chant, aucune parole, aucun chœur, aucune sirène ni bruit de rue. Dynamique douce, sans sursaut sonore, compatible avec de longs dialogues.
```

## 3. Ville — `ville`

```text
Crée une musique instrumentale originale d’exploration pour les rues de Lausanne dans un RPG de dark fantasy contemporaine. La ville doit paraître vivante, humaine et légèrement mystérieuse. 94 BPM, léger swing, harmonie autour de do majeur et la mineur avec accords enrichis. Piano électrique chaleureux, basse mélodique souple, batterie feutrée, petits motifs de synthétiseur et quelques touches de guitare propre. Groove discret mais entraînant, variations de batterie et réponses mélodiques toutes les quatre ou huit mesures. Rester sobre, ni comédie ni musique d’ascenseur. Boucle de 60 à 90 secondes, sans introduction longue ni fin définitive. Aucun chant, aucune parole, aucun chœur, aucun bruitage. Mélodie assez espacée pour accompagner la lecture.
```

## 4. Chez Ishara — `appartement`

```text
Compose une boucle instrumentale originale pour un petit appartement chaleureux, un peu en désordre : plantes, livres, deux tasses et la présence rassurante d’une nouvelle amie. Le récit reste une dark fantasy urbaine adulte. 78 BPM, do majeur avec passages en la mineur et accords de septième ou de neuvième. Piano doux, touches de piano électrique, basse ronde, balais très légers, quelques harmoniques de guitare. Une mélodie simple évoque un refuge encore inhabituel, avec un peu de pudeur et de mélancolie. La musique respire, sans sentimentalisme appuyé. Boucle naturelle de 60 à 90 secondes. Aucun chant, aucune parole, aucun chœur, aucun bruitage domestique. Mix intime, doux et lisible sous les dialogues.
```

## 5. Nuit — `nuit`

```text
Crée une musique instrumentale originale pour une scène nocturne intime : une héroïne dort sur le parquet d’un appartement et échange avec une présence intérieure froide. 60 BPM, la mineur, sensation suspendue. Quelques notes de piano feutré, résonances de verre très discrètes, cordes graves presque immobiles et nappe sombre douce. Pas de batterie régulière. Laisser beaucoup d’espace entre les phrases, avec de petites modifications harmoniques qui maintiennent l’attention. Une pointe d’étrangeté, sans horreur démonstrative ni effet de surprise. Boucle de 60 à 90 secondes, début et fin compatibles. Aucun chant, aucune parole, aucun murmure, aucun chœur, aucun bruitage. Volume et dynamique stables pour lire une conversation longue au casque.
```

## 6. Abysse — `abysse`

```text
Compose une boucle instrumentale originale pour explorer un donjon de cristal noir dans un RPG de dark fantasy. 86 BPM, ré mineur. Ostinato discret de cordes pincées ou de synthétiseur organique, basse profonde, percussion grave amortie et notes cristallines espacées. Faire sentir la profondeur, la matière froide et un danger qui n’est pas encore lancé à pleine vitesse. Le rythme avance vraiment, avec des variations de basse et de petites réponses mélodiques, mais laisse entendre les coups et les esquives du jeu. Boucle de 60 à 90 secondes, sans introduction lente ni finale. Aucun chant, aucune parole, aucun chœur, aucun bruitage de monstre. Pas de saturation massive ; garder une énergie contenue et une bonne lisibilité sur téléphone.
```

## 7. Araignée — `antre`

```text
Crée une musique instrumentale originale pour l’antre d’une immense araignée de cristal noir. Menace silencieuse, tension précise, présence qui écoute. 92 BPM, ré mineur avec de rares frottements de seconde mineure. Petits motifs irréguliers de verre et de métal, cordes graves tendues, basse pulsée, percussions sèches légères. La musique doit évoquer un réseau de fils qui transmet chaque mouvement, sans imiter littéralement les pattes. Construire de petites vagues de tension, puis relâcher avant de recommencer. Boucle de 60 à 90 secondes, continuité de la pulsation au raccord. Aucun chant, aucune parole, aucun chœur, aucun cri ni bruitage. Éviter les aigus perçants, les infrabasses seules et les impacts soudains.
```

## 8. Combat — `combat`

```text
Compose une boucle instrumentale originale de combat pour un RPG de dark fantasy urbaine. Combat rapide, tactique et dangereux, avec une héroïne précise plutôt que triomphante. 124 BPM, ré mineur. Cordes courtes en ostinato, basse électronique ferme, percussion hybride acoustique et synthétique, motif mélodique bref et reconnaissable. Donner de l’élan dès les premières secondes ; alterner quatre mesures tendues et quatre mesures plus ouvertes, avec des variations rythmiques qui soutiennent l’action. Boucle de 60 à 90 secondes sans intro ni coup final. Aucun chant, aucune parole, aucun chœur, aucun bruitage d’arme. Mix énergique mais non saturé, avec de l’espace pour les sons du combat. Pas de rupture silencieuse ni de montée interminable.
```

## 9. Le 4B — `quatreb`

```text
Crée une boucle instrumentale originale pour un appartement ancien trop ordonné, couvert de papiers, de livres et d’objets étranges. Son occupant est calme, courtois et profondément anormal. Dark fantasy urbaine, mystère administratif et rituel ancien. 66 BPM, la mineur avec un déplacement harmonique occasionnel d’un demi-ton. Piano préparé délicat, cordes graves, timbre de verre ou de célesta, percussion sèche très rare évoquant une mécanique précise. Une mélodie parcimonieuse revient avec une note modifiée, comme si la pièce corrigeait ce qu’on vient d’entendre. Boucle de 60 à 90 secondes. Aucun chant, aucune parole, aucun chœur, aucun bruitage de papier ni tic-tac réel. Étrangeté sobre, sans caricature de maison hantée, adaptée aux dialogues.
```

## 10. Surveillance et dette — `dossier`

```text
Compose une musique instrumentale originale de tension psychologique pour une ville contemporaine. Une héroïne comprend que ses achats, ses dettes et ses déplacements peuvent être suivis. La menace reste polie et méthodique. 80 BPM, mi mineur. Motif répété de trois ou quatre notes au piano électrique sombre, basse régulière, petites percussions sèches, cordes discrètes et textures électroniques fines. Introduire quelques décalages harmoniques sans accélérer. Impression de calcul et d’observation, jamais de panique. Boucle de 60 à 90 secondes, dynamique stable, sans crescendo de bande-annonce. Aucun chant, aucune parole, aucun chœur, aucune sirène, aucun bruitage. La musique doit soutenir un raisonnement et une conversation sans détourner l’attention.
```

## 11. Ouchy et Izzy — `ouchy`

```text
Crée une boucle instrumentale originale pour un appartement luxueux au-dessus du lac, au seizième étage. La propriétaire paraît très sûre d’elle, mais une fragilité intime affleure derrière la façade. Dark fantasy contemporaine élégante. 82 BPM, accords majeurs de septième et passages mineurs, centre tonal autour de fa. Piano électrique velouté, basse souple, balais légers, guitare claire rare et nappe aérienne. Mélodie retenue, légèrement sensuelle, avec une note mélancolique qui revient. Évoquer l’espace, le calme et la distance ; éviter le cliché lounge impersonnel. Boucle de 60 à 90 secondes, sans introduction longue ni fin définitive. Aucun chant, aucune parole, aucun chœur, aucun bruitage de lac ou d’ascenseur. Rester assez discret pour les dialogues.
```

## 12. Fête — `fete`

```text
Compose une boucle instrumentale originale de house nocturne entendue depuis la rue, derrière les murs d’une résidence étudiante. 118 BPM, la mineur, énergie vivante mais distante. Grosse caisse régulière, basse ronde, accords de synthétiseur courts, charleston léger et arpège accrocheur. Filtrer légèrement les aigus et adoucir les transitoires pour donner l’impression d’être dehors, tout en gardant le groove reconnaissable sur un téléphone. Quelques petites variations toutes les quatre mesures, sans montée ni drop. Boucle de 60 à 90 secondes, immédiatement en rythme et raccordable. Aucun chant, aucune parole, aucune voix de foule, aucun chœur, aucun bruitage. Cette musique accompagne un court passage narratif et ne doit pas écraser les dialogues.
```

## Ce qui est déjà amélioré dans le jeu

Les douze partitions en code ont chacune leur harmonie, leur motif et leur rythme.
Touches synthétiques douces, cloches, basses, nappes et percussions remplacent les
anciennes lignes carrées de style 8 bits. Les motifs varient sur seize mesures.
Les changements d’ambiance utilisent de courts fondus et la musique baisse
légèrement pendant les dialogues ; les bruitages gardent leur volume.

Les timbres restent synthétiques : les prompts ci-dessus visent des productions
plus riches avec les instruments décrits. Ils ne sont pas une transcription note
à note des versions en code.

[Écouter un montage de quatre ambiances](audio/extrait-ambiances.mp3) :
accueil **0:00**, ville **0:12**, 4B **0:24**, combat **0:36**.
L’extrait est présenté à un volume d’écoute plus élevé que la musique de fond du jeu.

La [page d’écoute des douze ambiances](audio/apercu.html) fonctionne depuis une
copie du dépôt servie dans un navigateur, ou après publication de la branche.
GitHub affiche le code HTML ; le lien du jeu habituel publie seulement `main`.

## Intégration et vérification

Déposer les fichiers dans `assets/musique/` avec les noms du tableau. Un MP3 est
essayé en premier, puis un OGG. Sans fichier utilisable, la partition en code joue.
Le jeu ne télécharge que l’ambiance demandée et garde au plus deux fichiers
décodés en mémoire. Les fichiers ne sont pas stockés dans la sauvegarde.

Après un ajout ou remplacement, augmenter `musicFileVersion` dans `audio.js` et
la version de `audio.js` dans `index.html`, pour éviter un ancien fichier en cache.

Pour tester sur téléphone : commencer une partie, écouter la ruelle, entrer dans
l’Abysse, comparer avec l’appartement à une sauvegarde ultérieure, puis vérifier
Pause → Paramètres → Musique et volume. Le son doit s’arrêter lorsque l’onglet est
masqué et reprendre au retour. Le confort et la fluidité restent à valider sur un
vrai appareil Android.
