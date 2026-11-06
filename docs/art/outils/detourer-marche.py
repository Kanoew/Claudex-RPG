# Détoure une planche GPT de 8 poses sur fond vert (4 de dos puis 4 de face) et la recale sur la grille de Yarden :
# cases de 96×104, ancre (48,101), hauteur du personnage 102 px. Usage : python3 detourer-marche.py planche.png dossier-de-sortie
import sys
import numpy as np
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
a = np.asarray(Image.open(src).convert('RGB')).astype(np.int32)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
greenness = g - np.maximum(r, b)
alpha = np.clip((90 - greenness) * 255 / 60, 0, 255).astype(np.uint8)  # >90 transparent, <30 opaque
# despill: clamp green to max(r,b) where green dominant
g2 = np.where(g > np.maximum(r, b), np.maximum(r, b), g)
rgba = np.dstack([r, g2, b, alpha]).astype(np.uint8)
img = Image.fromarray(rgba, 'RGBA')
mask = alpha > 40
cols = mask.sum(axis=0) > 6
# find column runs
runs, inside = [], False
for x, c in enumerate(cols):
    if c and not inside: start, inside = x, True
    if not c and inside: runs.append((start, x)); inside = False
if inside: runs.append((start, len(cols)))
runs = [r_ for r_ in runs if r_[1] - r_[0] > 40]
print('blobs', runs)
assert len(runs) == 8, len(runs)
frames = []
for x0, x1 in runs:
    rows = mask[:, x0:x1].sum(axis=1) > 3; ys = np.where(rows)[0]
    frames.append(img.crop((x0, ys[0], x1, ys[-1] + 1)))
H = max(f.size[1] for f in frames)
scale = 102 / H
print('scale', scale, 'H', H)
for name, group in (('walk-up', frames[:4]), ('walk-down', frames[4:])):
    sheet = Image.new('RGBA', (96 * 4, 104), (0, 0, 0, 0))
    for i, f in enumerate(group):
        w, h = round(f.size[0] * scale), round(f.size[1] * scale)
        f2 = f.resize((w, h), Image.LANCZOS)
        sheet.alpha_composite(f2, (i * 96 + 48 - w // 2, 103 - h))
    sheet.save(f'{out}/{name}.png')
