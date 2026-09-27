#!/usr/bin/env python3
"""Extrai os frames dos HTMLs de animação e gera as folhas de sprites do jogo.

Lê os *_ITEM_*.html (animações da Line), os *LABORATORIO*.html (Bell e cenas das
duas) e os *PRIMEIRO_ENCONTRO*.html (retratos para os diálogos).

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


# ---------------------------------------------------------------------------
# Laboratório (Bell & Line): cada animação é uma lista de PNGs de tamanhos variados.
# `altura_line` é a altura (em px da fonte) que a Line teria naquela animação; serve
# para deixar todas na mesma escala do resto do jogo. Direções: 0 frente, 2 esquerda,
# 4 costas, 6 direita (1, 3, 5 e 7 são diagonais, não usadas por enquanto).
ALTURA_LINE_MUNDO = 62.4     # altura da Line no mundo do jogo (unidades)
CELULA_LINE_MUNDO = 74       # tamanho da célula da Line no mundo
PX_POR_UNIDADE = 3.5
DIRECOES_LAB = {0: "FRONT", 2: "LEFT", 4: "BACK", 6: "RIGHT"}
LABORATORIO = {
    "bell": {"por_direcao": 8, "codigo": "BELL_WALK", "parado": "BELL_IDLE", "altura_line": 167},
    "hands": {"por_direcao": 10, "codigo": "LINE_BELL_WALK_HANDS", "altura_line": 115},
    "laugh": {"codigo": "BELL_LAUGH", "altura_line": 411},
    "kiss": {"codigo": "LINE_BELL_KISS", "altura_line": 394},
    "eat": {"codigo": "LINE_BELL_EAT", "altura_line": 347},
    "punch": {"codigo": "LINE_PUNCH_MACHINE", "altura_line": 281},
    "special": {"quadros": {0: "LINE_BELL_RESCUE_HUG", 2: "LINE_BELL_HOLD_HANDS"}, "altura_line": 438},
}


def quadrado(im):
    """Centraliza na horizontal e encosta embaixo, num quadrado transparente."""
    lado = max(im.size)
    q = Image.new("RGBA", (lado, lado), (0, 0, 0, 0))
    q.paste(im, ((lado - im.size[0]) // 2, lado - im.size[1]))
    return q


def processar_lista(codigo, urls, altura_line, origem, rotulo):
    unicos, sequencia, indice = [], [], {}
    for u in urls:
        if u not in indice:
            indice[u] = len(unicos)
            unicos.append(u)
        sequencia.append(indice[u])
    fontes = [quadrado(decodificar(u)) for u in unicos]
    lado = fontes[0].size[0]
    mundo = lado * ALTURA_LINE_MUNDO / altura_line
    celula = int(min(lado, round(mundo * PX_POR_UNIDADE)))
    celulas = [f.resize((celula, celula), Image.LANCZOS) for f in fontes]
    folha = Image.new("RGBA", (celula * len(celulas), celula), (0, 0, 0, 0))
    for i, c in enumerate(celulas):
        folha.paste(c, (i * celula, 0))
    folha.save(os.path.join(SAIDA, f"{codigo}.webp"), "WEBP", quality=88, method=6)
    return {
        "src": f"assets/sprites/{codigo}.webp",
        "cell": celula,
        "count": len(celulas),
        "seq": sequencia,
        "ground": base_dos_pes(celulas[sequencia[0]]),
        "groundEnd": base_dos_pes(celulas[sequencia[-1]]),
        "escala": round(mundo / CELULA_LINE_MUNDO, 4),
        "label": rotulo,
        "item": origem,
    }


def extrair_laboratorio(caminho, manifesto):
    with open(caminho, encoding="utf-8") as f:
        html = f.read()
    achado = re.search(r"const sources=(\{.*?\});", html, re.S)
    if not achado:
        print(f"  aviso: formato de laboratório não reconhecido em {os.path.basename(caminho)}")
        return
    fontes = json.loads(achado.group(1))
    nome = os.path.basename(caminho)
    for chave, cfg in LABORATORIO.items():
        lista = fontes.get(chave)
        if not lista:
            continue
        h = cfg["altura_line"]
        if "quadros" in cfg:
            for i, codigo in cfg["quadros"].items():
                if i < len(lista):
                    manifesto[codigo] = processar_lista(codigo, [lista[i]], h, nome, codigo)
                    print(f"  {codigo}: 1 quadro")
        elif "por_direcao" in cfg:
            n = cfg["por_direcao"]
            for d, sufixo in DIRECOES_LAB.items():
                trecho = lista[d * n:(d + 1) * n]
                if len(trecho) < n:
                    continue
                codigo = f"{cfg['codigo']}_{sufixo}"
                manifesto[codigo] = processar_lista(codigo, trecho, h, nome, codigo)
                print(f"  {codigo}: {n} quadros")
                if cfg.get("parado"):
                    parado = f"{cfg['parado']}_{sufixo}"
                    manifesto[parado] = processar_lista(parado, trecho[:1], h, nome, parado)
        else:
            manifesto[cfg["codigo"]] = processar_lista(cfg["codigo"], lista, h, nome, cfg["codigo"])
            print(f"  {cfg['codigo']}: {len(lista)} quadros")


def extrair_pastas(manifesto):
    """arte/<qualquer>/<CODIGO>/NN.png + config.json {"unidades_por_px": ...}.

    Todos os quadros de um código têm o mesmo tamanho e o mesmo ponto de apoio.
    """
    for pasta in sorted(glob.glob(os.path.join(RAIZ, "arte", "*", "*"))):
        cfg_arq = os.path.join(pasta, "config.json")
        quadros = sorted(glob.glob(os.path.join(pasta, "*.png")))
        if not quadros or not os.path.exists(cfg_arq):
            continue
        with open(cfg_arq, encoding="utf-8") as f:
            cfg = json.load(f)
        codigo = os.path.basename(pasta)
        fontes = [quadrado(Image.open(q).convert("RGBA")) for q in quadros]
        lado = fontes[0].size[0]
        mundo = lado * cfg["unidades_por_px"]
        celula = int(min(lado, round(mundo * 2.2)))
        celulas = [f.resize((celula, celula), Image.LANCZOS) for f in fontes]
        folha = Image.new("RGBA", (celula * len(celulas), celula), (0, 0, 0, 0))
        for i, c in enumerate(celulas):
            folha.paste(c, (i * celula, 0))
        folha.save(os.path.join(SAIDA, f"{codigo}.webp"), "WEBP", quality=88, method=6)
        manifesto[codigo] = {
            "src": f"assets/sprites/{codigo}.webp",
            "cell": celula,
            "count": len(celulas),
            "seq": list(range(len(celulas))),
            "ground": base_dos_pes(celulas[0]),
            "groundEnd": base_dos_pes(celulas[-1]),
            "mundo": round(mundo, 2),
            "label": cfg.get("rotulo", codigo),
            "item": os.path.relpath(pasta, RAIZ),
        }
        print(f"  {codigo}: {len(celulas)} quadros")


def extrair_retratos(caminho):
    """Retratos (3x2 expressões) da Line e da Bell usados nos diálogos."""
    with open(caminho, encoding="utf-8") as f:
        html = f.read()
    destino = os.path.join(RAIZ, "game", "assets", "retratos")
    os.makedirs(destino, exist_ok=True)
    retratos = {}
    for chave, quem in (("lp", "line"), ("bp", "bell")):
        achado = re.search(chave + r":'(data:image/\w+;base64,[A-Za-z0-9+/=]+)'", html)
        if not achado:
            continue
        im = decodificar(achado.group(1))
        im.save(os.path.join(destino, f"{quem}.webp"), "WEBP", quality=90, method=6)
        retratos[quem] = {"src": f"assets/retratos/{quem}.webp", "cell": im.size[0] // 3, "colunas": 3}
        print(f"  retrato {quem}: {im.size}")
    return retratos


def extrair_retratos_extras(retratos):
    """Rostos avulsos em arte/retratos/<quem>/<expressao>.png viram uma tira extra."""
    destino = os.path.join(RAIZ, "game", "assets", "retratos")
    for pasta in sorted(glob.glob(os.path.join(RAIZ, "arte", "retratos", "*"))):
        quem = os.path.basename(pasta)
        arquivos = sorted(glob.glob(os.path.join(pasta, "*.png")))
        if not arquivos or quem not in retratos:
            continue
        cel = retratos[quem]["cell"]
        tira = Image.new("RGBA", (cel * len(arquivos), cel), (0, 0, 0, 0))
        for i, arq in enumerate(arquivos):
            tira.paste(Image.open(arq).convert("RGBA").resize((cel, cel), Image.LANCZOS), (i * cel, 0))
        tira.save(os.path.join(destino, f"{quem}_extra.webp"), "WEBP", quality=90, method=6)
        rostos = [os.path.splitext(os.path.basename(a))[0] for a in arquivos]
        retratos[quem]["extras"] = {"src": f"assets/retratos/{quem}_extra.webp", "rostos": rostos}
        print(f"  retratos extras {quem}: {', '.join(rostos)}")


def main():
    os.makedirs(SAIDA, exist_ok=True)
    arquivos = sorted(glob.glob(os.path.join(RAIZ, "*_ITEM_*.html")))
    if not arquivos:
        sys.exit("Nenhum HTML *_ITEM_*.html encontrado na raiz do repositório.")

    manifesto = {}
    retratos = {}
    if "--so-arte" in sys.argv:
        # Refaz só as pastas de arte/, mantendo o resto do manifesto atual.
        with open(MANIFESTO, encoding="utf-8") as f:
            texto = f.read()
        antigo = json.loads(texto.split("window.SPRITES = ", 1)[1].split(";\nwindow.RETRATOS", 1)[0])
        retratos = json.loads(texto.split("window.RETRATOS = ", 1)[1].rstrip().rstrip(";"))
        manifesto = {k: v for k, v in antigo.items() if not v.get("item", "").startswith("arte")}
        extrair_pastas(manifesto)
        extrair_retratos_extras(retratos)
        return gravar(manifesto, retratos)
    for caminho in sorted(glob.glob(os.path.join(RAIZ, "*LABORATORIO*.html"))):
        print(os.path.basename(caminho))
        extrair_laboratorio(caminho, manifesto)
    print("arte/")
    extrair_pastas(manifesto)
    for caminho in sorted(glob.glob(os.path.join(RAIZ, "*PRIMEIRO_ENCONTRO*.html"))):
        print(os.path.basename(caminho))
        retratos.update(extrair_retratos(caminho))
    for caminho in arquivos:
        nome = os.path.basename(caminho)
        print(nome)
        for codigo, dados in ler_animacoes(caminho).items():
            manifesto[codigo] = processar(codigo, dados, nome)
            m = manifesto[codigo]
            print(f"  {codigo}: {len(m['seq'])} frames ({m['count']} únicos)")

    extrair_retratos_extras(retratos)
    gravar(manifesto, retratos)


def gravar(manifesto, retratos):
    with open(MANIFESTO, "w", encoding="utf-8") as f:
        f.write("// Gerado por tools/extrair_sprites.py. Não edite à mão.\n")
        f.write("window.SPRITES = ")
        json.dump(manifesto, f, ensure_ascii=False, indent=1)
        f.write(";\nwindow.RETRATOS = ")
        json.dump(retratos, f, ensure_ascii=False)
        f.write(";\n")
    print(f"\n{len(manifesto)} animações registradas em {os.path.relpath(MANIFESTO, RAIZ)}")


if __name__ == "__main__":
    main()
