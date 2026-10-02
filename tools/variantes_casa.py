#!/usr/bin/env python3
"""Variações da casa em pixel art (game/assets/cenario/casa.webp) para as casas do vilarejo e das outras fases.

Só o telhado muda de cor (pixels vermelho-alaranjados e saturados); paredes de pedra, madeira, porta,
janelas e plantas ficam iguais. Grava game/assets/cenario/casa_<cor>.webp.
Uso: python3 tools/variantes_casa.py
"""
import colorsys
import os

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PASTA = os.path.join(RAIZ, "game", "assets", "cenario")
# cor: (giro do matiz em graus, multiplica saturação, multiplica brilho)
CORES = {"azul": (205, 0.85, 0.95), "roxo": (275, 0.8, 0.95), "verde": (105, 0.75, 0.9),
         "mostarda": (32, 0.95, 1.08), "cabana": (18, 0.55, 0.62)}


def telhado(h, s, v):
    return (h < 18 / 360 or h > 345 / 360) and s > 0.42 and v > 0.22


def main():
    base = Image.open(os.path.join(PASTA, "casa.webp")).convert("RGBA")
    px = base.load()
    for cor, (giro, ks, kv) in CORES.items():
        out = base.copy()
        po = out.load()
        for y in range(base.height):
            for x in range(base.width):
                r, g, b, a = px[x, y]
                if not a:
                    continue
                h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
                if not telhado(h, s, v):
                    continue
                h = (h + giro / 360) % 1
                rr, gg, bb = colorsys.hsv_to_rgb(h, min(1, s * ks), min(1, v * kv))
                po[x, y] = (round(rr * 255), round(gg * 255), round(bb * 255), a)
        dest = os.path.join(PASTA, f"casa_{cor}.webp")
        out.save(dest, "WEBP", quality=92, method=6)
        print(dest)


if __name__ == "__main__":
    main()
