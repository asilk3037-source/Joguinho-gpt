#!/usr/bin/env python3
"""Extrai os frames dos HTMLs LINE_BELL_ITEM_*.html e gera as folhas de sprites do jogo.

Uso (na raiz do repositório):
    pip install pillow
    python3 tools/extrair_sprites.py

Rode de novo sempre que chegarem HTMLs novos: toda animação encontrada vira
game/assets/sprites/<CODIGO>.webp e é registrada em game/assets/sprites.js.
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
SAIDA = os.path.join(RAIZ, "game", "assets", "sprites")
MANIFESTO = os.path.join(RAIZ, "game", "assets", "sprites.js")
CELULA = 256
PADRAO_ANIMACOES = re.compile(r"const animations=(\{.*?\});\s*\n", re.S)


def ler_animacoes(caminho):
    with open(caminho, encoding="utf-8") as f:
        html = f.read()
    achado = PADRAO_ANIMACOES.search(html)
    if not achado:
        print(f"  aviso: nenhuma animação encontrada em {os.path.basename(caminho)}")
        return {}
    return json.loads(achado.group(1))


def decodificar(data_url):
    return Image.open(io.BytesIO(base64.b64decode(data_url.split(",", 1)[1]))).convert("RGBA")


def base_dos_pes(celula):
    """Linha mais baixa com pelo menos 4 pixels opacos (ignora pixels soltos)."""
    alfa = celula.getchannel("A").point(lambda v: 255 if v > 128 else 0)
    largura, altura = alfa.size
    dados = alfa.tobytes()
    for y in range(altura - 1, -1, -1):
        if dados[y * largura:(y + 1) * largura].count(255) >= 4:
            return y + 1
    return altura


def processar(codigo, dados, origem):
    frames = dados["frames"]
    unicos, sequencia, indice = [], [], {}
    for fr in frames:
        if fr not in indice:
            indice[fr] = len(unicos)
            unicos.append(fr)
        sequencia.append(indice[fr])

    celulas = [decodificar(u).resize((CELULA, CELULA), Image.LANCZOS) for u in unicos]

    # Chão = altura dos pés no primeiro e no último quadro. O jogo usa o primeiro por padrão,
    # pois é nele que a animação emenda na anterior.
    chao = base_dos_pes(celulas[sequencia[0]])
    chao_final = base_dos_pes(celulas[sequencia[-1]])

    folha = Image.new("RGBA", (CELULA * len(celulas), CELULA), (0, 0, 0, 0))
    for i, c in enumerate(celulas):
        folha.paste(c, (i * CELULA, 0))
    folha.save(os.path.join(SAIDA, f"{codigo}.webp"), "WEBP", quality=88, method=6)

    return {
        "src": f"assets/sprites/{codigo}.webp",
        "cell": CELULA,
        "count": len(celulas),
        "seq": sequencia,
        "ground": chao,
        "groundEnd": chao_final,
        "label": dados.get("label", codigo),
        "item": origem,
    }


def main():
    os.makedirs(SAIDA, exist_ok=True)
    arquivos = sorted(glob.glob(os.path.join(RAIZ, "*_ITEM_*.html")))
    if not arquivos:
        sys.exit("Nenhum HTML *_ITEM_*.html encontrado na raiz do repositório.")

    manifesto = {}
    for caminho in arquivos:
        nome = os.path.basename(caminho)
        print(nome)
        for codigo, dados in ler_animacoes(caminho).items():
            manifesto[codigo] = processar(codigo, dados, nome)
            m = manifesto[codigo]
            print(f"  {codigo}: {len(m['seq'])} frames ({m['count']} únicos)")

    with open(MANIFESTO, "w", encoding="utf-8") as f:
        f.write("// Gerado por tools/extrair_sprites.py. Não edite à mão.\n")
        f.write("window.SPRITES = ")
        json.dump(manifesto, f, ensure_ascii=False, indent=1)
        f.write(";\n")
    print(f"\n{len(manifesto)} animações registradas em {os.path.relpath(MANIFESTO, RAIZ)}")


if __name__ == "__main__":
    main()
