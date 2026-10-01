#!/usr/bin/env python3
"""Monta o interior de cada casa a partir de pedaços da planta da casa da fazenda (item 145).

A planta tem 128 px por tile. Daqui saem: a faixa da parede do fundo (viga, parede creme, lambri
e janela), as vigas laterais, o piso (madeira, terracota ou azulejo), a base de pedra e a porta
com degraus e caminho de pedra. Cada casa ganha uma imagem `base_<id>.webp` (2 px por unidade do
mundo, 64 px por tile) e o mapa de colisão vai para `game/js/interiores_gerados.js`.

Uso: python3 tools/gerar_interiores.py caminho/para/145.png
(sem argumento, lê a planta de dentro de LINE_BELL_ITEM_145.html)
"""
import base64
import io
import json
import os
import re
import sys

from PIL import Image, ImageEnhance, ImageOps

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T = 128          # px por tile na planta
SAIDA_T = 64     # px por tile na imagem salva (2 px por unidade)

# id, nome, largura e fundo do piso (tiles), piso, janelas (posição em tiles a partir da esquerda)
CASAS = [
    ("casa_floresta", "Cabana da floresta", 10, 7, "madeira", [2, 7]),
    ("casa_loja", "Loja da Rosa", 12, 7, "terracota", [2, 9]),
    ("casa_ferraria", "Ferraria do Bento", 12, 7, "pedra", [4]),
    ("casa_vila_a", "Casa do vilarejo", 10, 6, "madeira", [3]),
    ("casa_vila_b", "Casa do vilarejo", 10, 6, "terracota", [6]),
    ("casa_vila_c", "Casa do vilarejo", 10, 6, "madeira", [2, 7]),
    ("casa_vale", "Casa da Cora", 10, 7, "terracota", [3, 7]),
    ("casa_lago", "Casa do Tião", 10, 6, "azulejo", [4]),
]


def planta():
    if len(sys.argv) > 1:
        return Image.open(sys.argv[1]).convert("RGB")
    html = open(os.path.join(RAIZ, "LINE_BELL_ITEM_145.html"), encoding="utf-8").read()
    b64 = re.search(r"data:image/png;base64,([A-Za-z0-9+/=]+)", html).group(1)
    return Image.open(io.BytesIO(base64.b64decode(b64))).convert("RGB")


def corte(p, x0, y0, x1, y1):
    return p.crop((round(x0 * T), round(y0 * T), round(x1 * T), round(y1 * T)))


def ladrilhar(textura, w, h):
    out = Image.new("RGB", (w, h))
    for y in range(0, h, textura.height):
        for x in range(0, w, textura.width):
            out.paste(textura, (x, y))
    return out


def montar(p, wf, hf, piso, janelas):
    # Peças da planta (em tiles). Faixa do fundo: cozinha, colunas 7 a 9 (sem janela), linhas 0 a 5.
    faixa_lisa = corte(p, 7, 0, 9, 5)
    janela = corte(p, 3.7, 0, 6.3, 5)
    viga_esq = corte(p, 1, 0, 2, 20)
    viga_dir = viga_esq.transpose(Image.FLIP_LEFT_RIGHT)   # a da direita da planta tem o banheiro ao lado
    pisos = {
        "madeira": corte(p, 12, 6, 20, 12),
        "terracota": corte(p, 3, 6, 9, 12),
        "azulejo": corte(p, 24.3, 10.6, 29.3, 14.6),
        # Ferraria: a terracota sem cor e mais escura vira lajota de pedra.
        "pedra": ImageEnhance.Brightness(ImageOps.grayscale(corte(p, 3, 6, 9, 12)).convert("RGB")).enhance(0.85),
    }
    base_fundo = corte(p, 2, 18.7, 9, 21.9)        # viga de baixo + fundação de pedra
    porta = corte(p, 13, 18.75, 19, 24)             # batentes, porta, degraus e caminho de pedra
    W = (wf + 2) * T
    H = round((5 + hf + 5.25) * T)
    img = Image.new("RGB", (W, H), (13, 15, 28))
    # Piso
    tex = pisos[piso]
    img.paste(ladrilhar(tex, wf * T, hf * T), (T, 5 * T))
    # Parede do fundo com janelas
    img.paste(ladrilhar(faixa_lisa, wf * T, 5 * T), (T, 0))
    for jx in janelas:
        img.paste(janela, (T + round(jx * T), 0))
    # Base (viga + pedra) e porta no meio
    y_base = (5 + hf) * T - round(0.3 * T)
    img.paste(ladrilhar(base_fundo, wf * T, base_fundo.height), (T, y_base))
    px = T + (wf * T - porta.width) // 2
    img.paste(porta, (px, (5 + hf) * T - round(0.05 * T)))
    # Vigas laterais por cima de tudo
    img.paste(viga_esq.crop((0, 0, T, (5 + hf + 1) * T)), (0, 0))
    img.paste(viga_dir.crop((0, 0, T, (5 + hf + 1) * T)), (W - T, 0))
    # Colisão
    linhas = []
    pc = 1 + (wf - 6) // 2           # primeira coluna do bloco da porta (6 tiles)
    total_h = 5 + hf + 5
    for ty in range(total_h):
        row = []
        for tx in range(wf + 2):
            if 5 <= ty < 5 + hf and 1 <= tx <= wf:
                c = "_"
            elif ty in (5 + hf, 5 + hf + 1) and tx in (pc + 2, pc + 3):
                c = "_"                      # porta
            elif ty == 5 + hf + 2 and pc + 1 <= tx <= pc + 4:
                c = "_"                      # degraus
            elif ty >= 5 + hf + 3 and pc <= tx <= pc + 5:
                c = "_"                      # caminho de pedra (saída)
            else:
                c = "#"
            row.append(c)
        linhas.append("".join(row))
    return img, linhas, pc


def main():
    p = planta()
    dados = {}
    for cid, nome, wf, hf, piso, janelas in CASAS:
        img, linhas, pc = montar(p, wf, hf, piso, janelas)
        img = img.resize((img.width * SAIDA_T // T, img.height * SAIDA_T // T), Image.LANCZOS)
        img = img.crop((0, 0, (wf + 2) * SAIDA_T, len(linhas) * SAIDA_T))
        dest = os.path.join(RAIZ, "game", "assets", "cenario", f"base_{cid}.webp")
        img.save(dest, "WEBP", quality=85, method=6)
        dados[cid] = {"nome": nome, "linhas": linhas, "largura": wf, "fundo": hf, "porta": pc + 2.5, "saida": {"x": pc, "y": len(linhas) - 1, "w": 6}}
        print(cid, img.size, os.path.getsize(dest) // 1024, "KB")
    js = os.path.join(RAIZ, "game", "js", "interiores_gerados.js")
    with open(js, "w", encoding="utf-8") as f:
        f.write("// Gerado por tools/gerar_interiores.py. Não edite à mão.\n")
        f.write("window.LB = window.LB || {};\nLB.INTERIORES_GERADOS = ")
        json.dump(dados, f, ensure_ascii=False, indent=1)
        f.write(";\n")
    print(js)


if __name__ == "__main__":
    main()
