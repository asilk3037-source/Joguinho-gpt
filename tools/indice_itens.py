#!/usr/bin/env python3
"""Regera a tabela de LINE_BELL_INDICE_PARTES.md a partir dos HTMLs de item na raiz.

Lê os códigos de cada item (os dois formatos: `const animations` e `const payload`) e marca
os itens que chegaram com imagens vazias. Uso: python3 tools/indice_itens.py
"""
import glob
import json
import os
import re

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARQ = os.path.join(RAIZ, "LINE_BELL_INDICE_PARTES.md")


def conteudo(caminho):
    html = open(caminho, encoding="utf-8").read()
    m = re.search(r"const animations=(\{.*?\});\s*\n", html, re.S)
    if m:
        a = json.loads(m.group(1))
        vazias = sum(1 for v in a.values() for u in v["frames"] if len(u.split(",", 1)[-1]) < 100)
        return list(a), vazias
    if "const animations={'" in html:
        # Itens 132 em diante: const animations={'CODIGO':['data:...', ...]}.
        bloco = html[html.index("const animations={'"):]
        bloco = bloco[:bloco.index("};")]
        codigos = re.findall(r"'([A-Z0-9_]+)':\[", bloco)
        vazias = sum(1 for u in re.findall(r"'(data:[^']*)'", bloco) if len(u.split(",", 1)[-1]) < 100)
        return codigos, vazias
    i = html.index("const payload=") + len("const payload=")
    p, _ = json.JSONDecoder().raw_decode(html[i:])
    vazias = sum(1 for u in p["images"] if len(u.split(",", 1)[-1]) < 100)
    return list(p["animations"]), vazias


def main():
    itens = sorted(glob.glob(os.path.join(RAIZ, "LINE_BELL_ITEM_*.html")), key=lambda c: int(re.search(r"(\d+)\.html$", c).group(1)))
    linhas = ["| Item | Arquivo | Tamanho | Animações incluídas |", "|---:|---|---:|---|"]
    numeros = []
    for c in itens:
        n = int(re.search(r"(\d+)\.html$", c).group(1))
        numeros.append(n)
        codigos, vazias = conteudo(c)
        mb = f"{os.path.getsize(c) / 1048576:.2f}".replace(".", ",")
        aviso = f" ⚠️ {vazias} imagem(ns) vazia(s): reenviar" if vazias else ""
        linhas.append(f"| {n} | `{os.path.basename(c)}` | {mb} MB | " + ", ".join(f"`{k}`" for k in codigos) + aviso + " |")
    faltam = [n for n in range(1, max(numeros) + 1) if n not in numeros]
    texto = open(ARQ, encoding="utf-8").read()
    inicio = texto.index("| Item |")
    fim = texto.index("\n\n", inicio)
    extra = f"\n\nItens que ainda não chegaram: {', '.join(map(str, faltam))}." if faltam else ""
    texto = texto[:inicio] + "\n".join(linhas) + extra + texto[fim:]
    texto = re.sub(r"\n\nItens que ainda não chegaram: [^\n]*\.(?=\n\nItens que ainda)", "", texto)
    open(ARQ, "w", encoding="utf-8").write(texto)
    print(f"{len(itens)} itens; faltam: {faltam}")


if __name__ == "__main__":
    main()
