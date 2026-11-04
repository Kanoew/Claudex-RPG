#!/usr/bin/env python3
"""Fabrique les décors du jeu à partir de docs/art/decors/ : fonds recadrés sur le rectangle de chaque zone (2 pixels par unité) et objets détourés.
Usage : python3 docs/art/outils/decors.py   (depuis la racine du dépôt ; demande Pillow et numpy)
Chaque fond est ancré sur la ligne basse de la façade (`face`, part de la hauteur de l'image) : elle tombe sur le bas du bloc de collision de la façade
(`bloc`, ordonnée du monde), et le fond du bas de l'image sur le bas de la zone. `cx` : centre horizontal de l'image gardé. Voir `assets/decors/`."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
from collections import deque
from PIL import Image

SRC = 'docs/art/decors/sources/'
# nom : (zone x, y, largeur, hauteur) ; ancrage : (part de l'image où finit la façade, ordonnée du bas du bloc de façade, part horizontale du centre)
ZONES = {
    'quartier': ((-260, -200, 520, 420), (0.459, -80, 0.505)),
    'quartier-jour': ((-260, -200, 520, 420), (0.459, -80, 0.505)),
    'sousgare': ((-260, -330, 520, 510), (0.565, -70, 0.50)),
    'marterey': ((-260, -180, 520, 340), (0.50, -70, 0.50)),
    'square': ((-300, -230, 600, 450), (0.32, -130, 0.50)),
    'flon': ((-300, -200, 600, 420), (0.43, -160, 0.50)),
    'exterieur': ((-200, -520, 400, 1040), None),
}

def background(name, room, anchor):
    im = Image.open(SRC + name.replace('-jour', '-jour') + '.jpg').convert('RGB')
    W, H = im.size
    rx, ry, rw, rh = room
    if anchor is None:  # ruelle : toute la hauteur, bande centrale
        cw = int(rh and H * rw / rh)
        x0 = max(0, min(W - cw, int(W * 0.5 - cw / 2)))
        crop = im.crop((x0, 0, x0 + cw, H))
    else:
        face, bloc, cx = anchor
        sy = (ry + rh - bloc) / (H * (1 - face))           # unités par pixel, vertical
        top = face * H - (bloc - ry) / sy                  # première ligne de l'image gardée
        cw = rw / sy                                       # largeur gardée à la même échelle
        if top < 0 or cw > W:                              # image trop courte ou trop étroite : on étire
            print('  ! ancrage approché', name, round(top), round(cw), W)
            top = max(0, top); cw = min(W, cw)
        x0 = max(0, min(W - cw, W * cx - cw / 2))
        crop = im.crop((int(x0), int(top), int(x0 + cw), H))
    crop.resize((rw * 2, rh * 2), Image.LANCZOS).save(f'assets/decors/{name}.jpg', quality=85, optimize=True)
    print('fond', name, crop.size)

# --- objets : détourage du fond vert, une forme = un objet, rangées de gauche à droite puis de haut en bas
def key(path):
    a = np.asarray(Image.open(path).convert('RGB')).astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    dom = g - np.maximum(r, b)
    alpha = np.clip((70 - dom) / 45, 0, 1)
    g2 = np.where(dom > 0, np.maximum(r, b), g)
    return np.dstack([r, g2, b, alpha * 255]).astype(np.uint8)

def boxes(alpha, step=4, minimum=60):
    small = alpha[::step, ::step] > 24
    h, w = small.shape
    seen = np.zeros_like(small, bool); found = []
    for y0 in range(h):
        for x0 in np.nonzero(small[y0] & ~seen[y0])[0]:
            if seen[y0, x0]: continue
            queue = deque([(y0, x0)]); seen[y0, x0] = True; ys = [y0]; xs = [x0]; count = 0
            while queue:
                y, x = queue.popleft(); count += 1
                for dy in (-2, -1, 0, 1, 2):
                    for dx in (-2, -1, 0, 1, 2):
                        yy, xx = y + dy, x + dx
                        if 0 <= yy < h and 0 <= xx < w and small[yy, xx] and not seen[yy, xx]:
                            seen[yy, xx] = True; queue.append((yy, xx)); ys.append(yy); xs.append(xx)
            if count >= minimum: found.append((min(xs) * step, min(ys) * step, (max(xs) + 1) * step, (max(ys) + 1) * step))
    return found

def merge(found, gap=40):
    changed = True
    while changed:
        changed = False
        for i in range(len(found)):
            for j in range(i + 1, len(found)):
                a, b = found[i], found[j]
                if a[0] - gap <= b[2] and b[0] - gap <= a[2] and a[1] - gap <= b[3] and b[1] - gap <= a[3]:
                    found[i] = (min(a[0], b[0]), min(a[1], b[1]), max(a[2], b[2]), max(a[3], b[3])); del found[j]; changed = True; break
            if changed: break
    return found

def sheet(name, names, width=360, single=False, gap=-1):
    rgba = key(f'docs/art/decors/planches/{name}.png')
    found = merge(boxes(rgba[..., 3]), gap) if gap >= 0 else boxes(rgba[..., 3])
    # rangées : on regroupe par ordonnée du centre
    found.sort(key=lambda b: (b[1] + b[3]) / 2)
    bands = []
    for b in found:
        if bands and abs((b[1] + b[3]) / 2 - bands[-1][0][1] / 1) < 1e9 and (b[1] + b[3]) / 2 - (bands[-1][-1][1] + bands[-1][-1][3]) / 2 < (rgba.shape[0] / 6): bands[-1].append(b)
        else: bands.append([b])
    ordered = sorted(found, key=lambda t: t[0]) if single else [b for band in bands for b in sorted(band, key=lambda t: t[0])]
    if len(ordered) != len(names): print('  ! planche', name, len(ordered), 'formes pour', len(names), 'noms', ordered)
    for box, label in zip(ordered, names):
        x0, y0, x1, y1 = box
        cell = rgba[y0:y1, x0:x1]
        img = Image.fromarray(cell, 'RGBA')
        img = img.resize((width, max(1, round(img.height * width / img.width))), Image.LANCZOS)
        a = np.asarray(img).copy(); a[..., 3] = np.where(a[..., 3] <= 24, 0, a[..., 3]); img = Image.fromarray(a, 'RGBA')
        img.quantize(colors=160, method=Image.FASTOCTREE, dither=Image.NONE).save(f'assets/decors/objets/{label}.png', optimize=True)
        print('objet', label, img.size)

if __name__ == '__main__':
    os.makedirs('assets/decors/objets', exist_ok=True)
    for name, (room, anchor) in ZONES.items(): background(name, room, anchor)
    sheet('quartier', ['voiture-bordeaux', 'voiture-bleue', 'velos', 'arbre', 'fleurs', 'poubelle'])
    sheet('square', ['banc', 'arbre-square', 'lampadaire'], single=True)
    sheet('flon', ['table-a', 'table-b', 'table-c', 'bar'], single=True, gap=40)
    sheet('exterieur', ['benne', 'caisses', 'poubelles', 'poubelles-b', 'scooter'])
