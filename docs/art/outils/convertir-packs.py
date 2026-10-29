#!/usr/bin/env python3
"""Détoure les packs à fond vert de docs/art/ et écrit les PNG du jeu dans assets/ (palette de 64 à 128 couleurs, alpha binaire sous 24).

Usage : python3 docs/art/outils/convertir-packs.py   (depuis la racine du dépôt ; demande Pillow et numpy)
Détourage : alpha = rampe sur « vert moins le plus fort de rouge et bleu » (g - max(r, b)), puis dévert des bords.
Pour les personnages, seule la plus grande forme de chaque case est gardée (efface les miettes de fond).
"""
import sys
from collections import deque
import numpy as np
from PIL import Image

def key(path):
    a = np.asarray(Image.open(path).convert('RGB')).astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    dom = g - np.maximum(r, b)
    alpha = np.clip((70 - dom) / 45, 0, 1)
    g2 = np.where(dom > 0, np.maximum(r, b), g)
    return np.dstack([r, g2, b, alpha * 255]).astype(np.uint8)

def largest(mask):
    h, w = mask.shape
    seen = np.zeros_like(mask, bool)
    best, size = None, 0
    for y0 in range(h):
        for x0 in np.nonzero(mask[y0] & ~seen[y0])[0]:
            if seen[y0, x0]:
                continue
            comp, queue = [], deque([(y0, x0)])
            seen[y0, x0] = True
            while queue:
                y, x = queue.popleft()
                comp.append((y, x))
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        yy, xx = y + dy, x + dx
                        if 0 <= yy < h and 0 <= xx < w and mask[yy, xx] and not seen[yy, xx]:
                            seen[yy, xx] = True
                            queue.append((yy, xx))
            if len(comp) > size:
                size, best = len(comp), comp
    out = np.zeros_like(mask)
    for y, x in best:
        out[y, x] = True
    return out

def export(src, dst, frames=1, colors=128, clean=True, size=None):
    rgba = key(src)
    h, w = rgba.shape[:2]
    cw = w // frames
    if clean:
        for i in range(frames):
            cell = rgba[:, i * cw:(i + 1) * cw]
            keep = largest(cell[..., 3] > 24)
            cell[..., 3] = np.where(keep, cell[..., 3], 0)
    rgba[..., 3] = np.where(rgba[..., 3] <= 24, 0, rgba[..., 3])
    image = Image.fromarray(rgba, 'RGBA')
    if size:
        image = image.resize(size, Image.LANCZOS)
        arr = np.asarray(image).copy()
        arr[..., 3] = np.where(arr[..., 3] <= 24, 0, arr[..., 3])
        image = Image.fromarray(arr, 'RGBA')
    image.quantize(colors=colors, method=Image.FASTOCTREE, dither=Image.NONE).save(dst, optimize=True)
    print(dst)

if __name__ == '__main__':
    art = 'docs/art/'
    export(art + 'faux/ramassage-lueur.png', 'assets/faux/ramassage-lueur.png', 4, clean=False)
    export(art + 'faux/arc-base.png', 'assets/faux/arc-base.png', 6, clean=False)
    export(art + 'faux/arc-fauchage.png', 'assets/faux/arc-fauchage.png', 6, clean=False)
    for name in ['inconnu-1-repos', 'inconnu-1-marche-gauche', 'inconnu-2-repos', 'inconnu-2-marche-gauche', 'inconnu-2-poignet', 'inconnu-2-recul']:
        frames = 4 if 'marche' in name else 1 if 'poignet' in name else 2
        export(art + 'ruelle/hommes-chibi/' + name + '.png', 'assets/npcs/inconnus/' + name + '.png', frames)
    for name in ['danseur', 'danseuse']:
        export(art + 'ruelle/danseurs/' + name + '.png', 'assets/npcs/fete/' + name + '.png', 6)
    for name in ['yarden-neutre', 'yarden-souriante', 'yarden-agacee', 'yarden-surprise', 'ishara-neutre', 'ishara-sourire', 'ishara-inquiete', 'inconnu-1-neutre', 'inconnu-1-menacant', 'inconnu-2-neutre', 'inconnu-2-menacant']:
        export(art + 'portraits-dialogue/' + name + '.png', 'assets/portraits/' + name + '.png', 1, colors=96, size=(144, 144))
