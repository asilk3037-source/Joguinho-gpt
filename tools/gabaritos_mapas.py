#!/usr/bin/env python3
"""Gera um gabarito (planta) de cada cenário a partir do jogo: grade de tiles, o que é chão,
parede, água, lava, abismo e objeto, as saídas e os blocos de entrega de 2048×2048 px.

Uso: python3 tools/gabaritos_mapas.py inventario.json
Saída: arte/referencias/gabaritos/<area>.png (32 px por tile) e docs/imagens/gabarito-<area>.jpg
"""
import json
import os
import sys

from PIL import Image, ImageDraw, ImageFont

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PX = 32            # px por tile no gabarito (1/4 da entrega recomendada de 128 px por tile)
BLOCO = 16         # tiles por bloco de entrega (16 × 128 px = 2048 px)

COR = {
    '#': (40, 34, 52), 'T': (38, 70, 40), 'R': (110, 104, 96), 'o': (110, 104, 96), 'I': (150, 150, 170),
    '.': (120, 150, 100), ',': (110, 145, 90), 'F': (130, 160, 105), '_': (100, 110, 120), ':': (200, 175, 120),
    'r': (140, 110, 70), 'u': (110, 80, 50), 'w': (90, 160, 220), '~': (40, 100, 180), 'L': (255, 110, 40),
    'l': (160, 60, 30), 'j': (15, 12, 20), '>': (220, 235, 250), '<': (220, 235, 250), '=': (140, 130, 120),
    'H': (170, 110, 70), 'D': (120, 70, 40), 'B': (180, 60, 50), 'K': (200, 160, 110), 'c': (140, 100, 60),
    'h': (140, 100, 60), 'f': (170, 130, 90),
}
OBJ = {'C': ('baú', (255, 210, 90)), 'S': ('placa', (220, 170, 100)), 'U': ('fonte', (120, 220, 255)),
       'Q': ('cristal', (150, 255, 240)), 'Y': ('tocha', (255, 170, 60)), 'Z': ('barreira', (190, 140, 255)),
       'g': ('porta trancada', (230, 180, 60)), '%': ('rachada', (170, 120, 90)), 'p': ('poste do gancho', (200, 200, 210)),
       'E': ('estação', (180, 170, 150)), 'A': ('altar', (230, 250, 255)), 'X': ('espinhos', (120, 60, 120)),
       'W': ('bigorna', (120, 120, 130)), 'b': ('barraca', (230, 120, 150)), 'P': ('poço', (150, 150, 160)),
       'M': ('moinho', (200, 190, 170)), 'n': ('feno', (230, 200, 90)), 'k': ('casinha', (200, 80, 70)), 'm': ('mesa', (200, 90, 90)),
       'q': ('cogumelo', (120, 200, 255)), 'v': ('varal', (230, 230, 230))}


def gerar(id_, m, nomes, saida_dir):
    L = m['linhas']
    w, h = max(len(l) for l in L), len(L)
    topo = 70
    img = Image.new('RGB', (w * PX, h * PX + topo), (20, 16, 30))
    d = ImageDraw.Draw(img)
    fonte = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
    peq = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 14)
    mini = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 11)
    d.text((10, 8), f"{m['nome']}  ·  {w}×{h} tiles  ·  mundo {w * 32}×{h * 32}  ·  entrega {w * 128}×{h * 128} px (128/tile)", font=fonte, fill=(255, 255, 255))
    d.text((10, 40), 'Grade = 1 tile · linhas rosa = blocos de entrega de 2048×2048 px (16×16 tiles) · setas = saídas', font=peq, fill=(220, 200, 230))
    for y, l in enumerate(L):
        for x in range(w):
            c = l[x] if x < len(l) else '.'
            x0, y0 = x * PX, y * PX + topo
            if c in OBJ:
                d.rectangle([x0, y0, x0 + PX - 1, y0 + PX - 1], fill=COR['.'])
                d.rectangle([x0 + 4, y0 + 4, x0 + PX - 5, y0 + PX - 5], fill=OBJ[c][1])
            else:
                d.rectangle([x0, y0, x0 + PX - 1, y0 + PX - 1], fill=COR.get(c, (120, 150, 100)))
            d.rectangle([x0, y0, x0 + PX, y0 + PX], outline=(0, 0, 0))
    # Blocos de entrega.
    for bx in range(0, w, BLOCO):
        for by in range(0, h, BLOCO):
            x0, y0 = bx * PX, by * PX + topo
            d.rectangle([x0, y0, min(w, bx + BLOCO) * PX - 1, min(h, by + BLOCO) * PX + topo - 1], outline=(255, 110, 190), width=3)
            d.text((x0 + 6, y0 + 4), f'{id_}_{bx // BLOCO}_{by // BLOCO}', font=mini, fill=(255, 170, 220))
    # Saídas.
    for s in m.get('saidas', []):
        x0, y0 = s['x'] * PX, s['y'] * PX + topo
        d.rectangle([x0, y0, (s['x'] + s['w']) * PX - 1, (s['y'] + s['h']) * PX + topo - 1], outline=(120, 255, 150), width=4)
        rot = '→ ' + nomes.get(s['para'], s['para']) + (' (depois)' if s.get('requer') else '')
        tx = min(max(4, x0 - 40), w * PX - 10 * len(rot) - 4)
        ty = y0 + (PX + 4 if s['y'] == 0 else -20)
        d.rectangle([tx - 3, ty - 2, tx + 9 * len(rot) + 3, ty + 16], fill=(20, 16, 30))
        d.text((tx, ty), rot, font=mini, fill=(150, 255, 170))
    if m.get('inicio'):
        ix, iy = m['inicio']['x'] * PX, m['inicio']['y'] * PX + topo
        d.ellipse([ix - 8, iy - 8, ix + 8, iy + 8], fill=(255, 111, 159))
    os.makedirs(saida_dir, exist_ok=True)
    img.save(os.path.join(saida_dir, f'{id_}.png'), optimize=True)
    pequena = img.copy()
    pequena.thumbnail((960, 960))
    pequena.save(os.path.join(RAIZ, 'docs', 'imagens', f'gabarito-{id_}.jpg'), quality=82)
    return w, h


def main():
    inv = json.load(open(sys.argv[1], encoding='utf-8'))
    mapas = inv['mundo']['mapas']
    nomes = {k: v['nome'] for k, v in mapas.items()}
    for id_, m in mapas.items():
        w, h = gerar(id_, m, nomes, os.path.join(RAIZ, 'arte', 'referencias', 'gabaritos'))
        print(id_, w, h)


if __name__ == '__main__':
    main()
