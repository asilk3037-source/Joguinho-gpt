#!/usr/bin/env python3
"""Extrai os objetos avulsos (móveis e objetos da fazenda) dos itens em HTML.

Cada item traz PNGs com transparência em <img data-name="CODIGO_LxA.png">. O objeto é recortado
no contorno (sem a margem transparente), mantido na resolução original e salvo em WEBP:
  FARMHOUSE_* → game/assets/moveis/farmhouse_*.webp   (móveis da casa)
  FARM_*      → game/assets/cenario/farm_*.webp       (objetos do terreno)
  SHOP_*      → game/assets/cenario/shop_*.webp       (peças do Minas Shopping)
A lista vai para game/js/objetos.js (LB.OBJETOS: nome → caminho), que o catálogo de imagens lê.

Uso: python3 tools/extrair_objetos.py [arquivos.html ...]   (sem argumento: todos os LINE_BELL_ITEM_*.html da raiz)
"""
import base64
import glob
import io
import json
import os
import re
import sys

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA_JS = os.path.join(RAIZ, "game", "js", "objetos.js")
IMG = re.compile(r'<img[^>]*?src="data:image/png;base64,([A-Za-z0-9+/=]+)"[^>]*?data-name="([^"]+)"', re.S)


def objetos(caminho):
    html = open(caminho, encoding="utf-8").read()
    for b64, nome in IMG.findall(html):
        codigo = re.sub(r"(_\d+x\d+)?\.png$", "", nome)
        if codigo.startswith(("FARMHOUSE_", "FARM_", "SHOP_")):
            yield codigo, Image.open(io.BytesIO(base64.b64decode(b64))).convert("RGBA")


def destino(codigo):
    pasta = "moveis" if codigo.startswith("FARMHOUSE_") else "cenario"
    return f"assets/{pasta}/{codigo.lower()}.webp"


def main():
    arquivos = sys.argv[1:] or sorted(glob.glob(os.path.join(RAIZ, "LINE_BELL_ITEM_*.html")))
    lista = {}
    if os.path.exists(SAIDA_JS):
        lista = json.loads(open(SAIDA_JS, encoding="utf-8").read().split("LB.OBJETOS = ", 1)[1].rstrip().rstrip(";"))
    for caminho in arquivos:
        for codigo, im in objetos(caminho):
            caixa = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
            if not caixa:
                print(f"  aviso: {codigo} veio vazio")
                continue
            im = im.crop(caixa)
            rel = destino(codigo)
            im.save(os.path.join(RAIZ, "game", rel), "WEBP", quality=92, method=6)
            lista[codigo.lower()] = rel
            print(f"{os.path.basename(caminho)}: {codigo} {im.size}")
    with open(SAIDA_JS, "w", encoding="utf-8") as f:
        f.write("// Gerado por tools/extrair_objetos.py. Não edite à mão.\nwindow.LB = window.LB || {};\nLB.OBJETOS = ")
        json.dump(dict(sorted(lista.items())), f, ensure_ascii=False, indent=1)
        f.write(";\n")
    print(len(lista), "objetos em", os.path.relpath(SAIDA_JS, RAIZ))


if __name__ == "__main__":
    main()
