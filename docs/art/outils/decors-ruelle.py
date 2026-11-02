#!/usr/bin/env python3
"""Découpe la planche d'objets de la ruelle (docs/art/decors/objets-ruelle.png, fond vert) en quatre PNG détourés dans assets/decors/.
Usage : python3 docs/art/outils/decors-ruelle.py   (depuis la racine du dépôt)"""
import importlib.util, numpy as np
from PIL import Image
spec = importlib.util.spec_from_file_location('cp', 'docs/art/outils/convertir-packs.py')
src = open('docs/art/outils/convertir-packs.py').read().split('def export(')[0]
ns = {}; exec(src, ns)
key, largest = ns['key'], ns['largest']
sheet = key('docs/art/decors/objets-ruelle.png')
# zones de la planche (repères pour 2000 x 1116, mis à l'échelle) : x0, y0, x1, y1
k = sheet.shape[1] / 2000
regions0 = {'benne': (0, 0, 1000, 780), 'caisses': (1000, 0, 2000, 620), 'poubelles': (500, 560, 1260, 1116), 'scooter': (1260, 560, 2000, 1116)}
regions = {n: tuple(round(v * k) for v in r) for n, r in regions0.items()}
for name, (x0, y0, x1, y1) in regions.items():
    cell = sheet[y0:y1, x0:x1].copy()
    keep = largest(cell[..., 3] > 24)
    cell[..., 3] = np.where(keep, cell[..., 3], 0)
    ys, xs = np.nonzero(cell[..., 3] > 24)
    cell = cell[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    img = Image.fromarray(cell, 'RGBA')
    scale = 320 / img.width
    img = img.resize((320, round(img.height * scale)), Image.LANCZOS)
    arr = np.asarray(img).copy(); arr[..., 3] = np.where(arr[..., 3] <= 24, 0, arr[..., 3]); img = Image.fromarray(arr, 'RGBA')
    img.quantize(colors=128, method=Image.FASTOCTREE, dither=Image.NONE).save(f'assets/decors/{name}.png', optimize=True)
    print(name, img.size)
