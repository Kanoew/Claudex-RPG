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

def alpha_cells(rgba, boxes, scale):
    """Découpe des cases dans une image détourée, garde la plus grande forme de chacune."""
    cells = []
    for x0, y0, x1, y1 in boxes:
        cell = rgba[y0:y1, x0:x1].copy()
        keep = largest(cell[..., 3] > 24)
        cell[..., 3] = np.where(keep, cell[..., 3], 0)
        ys, xs = np.nonzero(cell[..., 3] > 24)
        left, right = xs.min(), xs.max() + 1
        cells.append((cell[:, left:right], ys.min(), ys.max() + 1, xs.mean() - left))
    return cells

def place(cells, ref_height, cell_w, cell_h, anchor, dst, colors=96):
    """Met chaque case à l'échelle commune (la première case fait ref_height de haut), pieds sur l'ancre, centre de masse sur l'ancre."""
    scale = ref_height / (cells[0][2] - cells[0][1])
    sheet = Image.new('RGBA', (cell_w * len(cells), cell_h), (0, 0, 0, 0))
    for i, (cell, top, bottom, cx) in enumerate(cells):
        crop = Image.fromarray(cell[top:bottom], 'RGBA')
        crop = crop.resize((max(1, round(crop.width * scale)), max(1, round(crop.height * scale))), Image.LANCZOS)
        px = round(i * cell_w + anchor[0] - cx * scale)
        py = anchor[1] - crop.height
        sheet.alpha_composite(crop, (max(i * cell_w, px), max(0, py)))
    arr = np.asarray(sheet).copy()
    arr[..., 3] = np.where(arr[..., 3] <= 24, 0, arr[..., 3])
    Image.fromarray(arr, 'RGBA').quantize(colors=colors, method=Image.FASTOCTREE, dither=Image.NONE).save(dst, optimize=True)
    print(dst)

def export_chapter2b(art):
    sheet = key(art + 'ch2b/ishara-course-feuille.webp')
    h, w = sheet.shape[:2]
    cw, rh = w // 4, h // 7
    names = ['idle', 'walk-left', 'walk-right', 'walk-down', 'walk-up', 'run-left', 'run-right']
    idle = alpha_cells(sheet, [(c * cw, 0, (c + 1) * cw, rh) for c in range(4)], 1)
    ref = (idle[0][2] - idle[0][1])
    for r, name in enumerate(names):
        cells = alpha_cells(sheet, [(c * cw, r * rh, (c + 1) * cw, (r + 1) * rh) for c in range(4)], 1)
        # une seule échelle pour toutes les bandes : la case de repos mesure 104 px
        scale = 104 / ref
        cells[0] = cells[0]
        place_scaled(cells, scale, 140, 115, (70, 111), 'assets/npcs/ishara/course/' + name + '.png')
    for name, cell_w in [('remi-comptoir', 120), ('felix-bureau', 120)]:
        rgba = key(art + 'ch2b/' + name.replace('remi-comptoir', 'remi-comptoir').replace('felix-bureau', 'felix-bureau') + '.webp')
        cells = alpha_cells(rgba, [(c * 500, 0, (c + 1) * 500, 667) for c in range(4)], 1)
        place(cells, 118, cell_w, 124, (cell_w // 2, 120), 'assets/npcs/' + ('remi' if name.startswith('remi') else 'felix') + '/' + name + '.png')
    lineup = key(art + 'ch2b/lineup-ishara-remi-felix.webp')
    for name, (x0, x1) in [('remi', (790, 1160)), ('felix', (1420, 1790))]:
        part = lineup[0:340, x0:x1].copy()
        keep = largest(part[..., 3] > 24)
        part[..., 3] = np.where(keep, part[..., 3], 0)
        ys, xs = np.nonzero(part[..., 3] > 24)
        side = int(xs.max() - xs.min()) + 12
        left = max(0, int(xs.min()) - 6)
        top = max(0, int(ys.min()) - 6)
        square = Image.fromarray(part[top:top + side, left:left + side], 'RGBA').resize((144, 144), Image.LANCZOS)
        arr = np.asarray(square).copy()
        arr[..., 3] = np.where(arr[..., 3] <= 24, 0, arr[..., 3])
        Image.fromarray(arr, 'RGBA').quantize(colors=96, method=Image.FASTOCTREE, dither=Image.NONE).save('assets/portraits/' + name + '-neutre.png', optimize=True)
        print('assets/portraits/' + name + '-neutre.png')

def place_scaled(cells, scale, cell_w, cell_h, anchor, dst, colors=96):
    sheet = Image.new('RGBA', (cell_w * len(cells), cell_h), (0, 0, 0, 0))
    for i, (cell, top, bottom, cx) in enumerate(cells):
        crop = Image.fromarray(cell[top:bottom], 'RGBA')
        crop = crop.resize((max(1, round(crop.width * scale)), max(1, round(crop.height * scale))), Image.LANCZOS)
        px = round(i * cell_w + anchor[0] - cx * scale)
        sheet.alpha_composite(crop, (max(i * cell_w, px), max(0, anchor[1] - crop.height)))
    arr = np.asarray(sheet).copy()
    arr[..., 3] = np.where(arr[..., 3] <= 24, 0, arr[..., 3])
    import os
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    Image.fromarray(arr, 'RGBA').quantize(colors=colors, method=Image.FASTOCTREE, dither=Image.NONE).save(dst, optimize=True)
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
    export_chapter2b(art)
