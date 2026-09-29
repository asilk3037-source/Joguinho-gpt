#!/usr/bin/env python3
"""Regera ANIMACOES_PENDENTES.md a partir do inventário exportado do jogo.

Uso: node tools/exportar_inventario.js inventario.json && python3 tools/gerar_pendentes.py inventario.json
"""
import json
import os
import re
import sys
import glob

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
inv = json.load(open(sys.argv[1], encoding="utf-8"))
grupos = inv["grupos"]
tot = sum(len(g["itens"]) for g in grupos)
prontas = sum(i["existe"] for g in grupos for i in g["itens"])
subst = sum(1 for g in grupos for i in g["itens"] if not i["existe"] and i["via"])

# Itens com imagens vazias (precisam ser reenviados) e itens que ainda não chegaram.
defeitos, numeros = [], []
for c in glob.glob(os.path.join(RAIZ, "LINE_BELL_ITEM_*.html")):
    n = int(re.search(r"(\d+)\.html$", c).group(1))
    numeros.append(n)
    html = open(c, encoding="utf-8").read()
    if "const payload=" in html:
        i = html.index("const payload=") + len("const payload=")
        p, _ = json.JSONDecoder().raw_decode(html[i:])
        vazias = [k for k, u in enumerate(p["images"]) if len(u.split(",", 1)[-1]) < 100]
        if vazias:
            afetadas = [cod for cod, a in p["animations"].items() if set(a["frames"]) & set(vazias)]
            defeitos.append((n, len(vazias), afetadas))
faltam = [n for n in range(1, max(numeros) + 1) if n not in numeros]

L = []
w = L.append
w("# Line & Bell — o que falta criar")
w("")
w("> Lista gerada a partir do jogo (`tools/gerar_pendentes.py`). A lista completa, com todas as animações e o status de cada uma, está na seção 10 da **[documentação](docs/LINE_E_BELL_DOCUMENTACAO.md)** e no próprio jogo, em **Menu → Animações**. Toda a arte atual é temporária até a criação completa.")
w("")
w(f"**Status:** {prontas} de {tot} animações com arte · {subst} usando uma substituta · {tot - prontas - subst} desenhadas no código.")
w("")
if defeitos or faltam:
    w("## ⚠️ Reenviar ou mandar")
    w("")
    for n, q, afetadas in sorted(defeitos):
        w(f"- **Item {n}**: chegou com {q} imagem(ns) vazia(s) em {', '.join(f'`{a}`' for a in afetadas)}. As animações funcionam sem esses quadros, mas ficam incompletas.")
    if faltam:
        w(f"- **Itens que ainda não chegaram:** {', '.join(map(str, faltam))}.")
    if any(i["codigo"] == "DRAGON_IDLE" for g in grupos for i in g["itens"]):
        w("- **`DRAGON_IDLE`** está provisório: usa o 1º quadro do rugido (`DRAGON_ROAR`) até chegar a arte do dragão parado.")
    w("")
w("## Ainda sem arte")
w("")
w("| Grupo | Código | O que é | Hoje usa |")
w("|---|---|---|---|")
for g in grupos:
    for i in g["itens"]:
        if i["existe"]:
            continue
        w(f"| {g['nome']} | `{i['codigo']}` | {i.get('desc') or ''} | {('`' + i['via'] + '`') if i['via'] else 'desenho no código'} |")
w("")
w("## Como mandar arte nova")
w("")
w("Qualquer um destes formatos funciona:")
w("")
w("1. **HTML de item** (`LINE_BELL_ITEM_NN.html`), nos dois formatos já usados: `const animations` (PNG por quadro) ou `const payload` (lista de imagens e, para cada animação, a ordem dos quadros, o fps e uma descrição). Quadros 1254×1254 com fundo transparente.")
w("2. **HTML de laboratório** (`*LABORATORIO*.html`).")
w("3. **Pasta em `arte/`**: `arte/<grupo>/<CODIGO>/00.png, 01.png…` com um `config.json` (`{\"unidades_por_px\": 0.62}`).")
w("")
w("Depois, `python3 tools/extrair_sprites.py` gera as folhas e registra tudo no jogo. O código de cada animação precisa ser **exatamente** o da lista. Animações de lado podem vir só viradas para a **direita**: o jogo espelha. O tamanho de cada personagem é igualado sozinho entre as animações.")
w("")
w("## ⭐ Theo: layout oficial")
w("")
w("A arte do Theo que está hoje no jogo (`arte/referencias/theo_shihtzu.png`) é o **layout oficial** para a arte final: só melhorar, sem perder os traços. Detalhes na seção 2 da [documentação](docs/LINE_E_BELL_DOCUMENTACAO.md).")
open(os.path.join(RAIZ, "ANIMACOES_PENDENTES.md"), "w", encoding="utf-8").write("\n".join(L) + "\n")
print(f"ANIMACOES_PENDENTES.md: {prontas}/{tot}, {len(defeitos)} itens com defeito, faltam {faltam}")
