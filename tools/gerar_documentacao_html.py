#!/usr/bin/env python3
"""Gera docs/LINE_E_BELL_DOCUMENTACAO.html (com as imagens embutidas) a partir do .md.

Uso: python3 tools/gerar_documentacao_html.py   (precisa de: pip install markdown)
"""
import base64
import os
import re

import markdown

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(RAIZ, "docs")
src = open(os.path.join(DOCS, "LINE_E_BELL_DOCUMENTACAO.md"), encoding="utf-8").read()
html = markdown.markdown(src, extensions=["tables", "toc", "sane_lists"])


def embutir(m):
    dados = open(os.path.join(DOCS, m.group(1)), "rb").read()
    return 'src="data:image/jpeg;base64,' + base64.b64encode(dados).decode() + '"'


html = re.sub(r'src="(imagens/[^"]+)"', embutir, html)
CSS = """
:root{--bg:#fbf6f1;--fg:#2d2433;--mut:#6b5d70;--card:#fff;--line:#e8dcd6;--acc:#c2507a;--q:#f4e8ee}
@media (prefers-color-scheme:dark){:root{--bg:#1c1622;--fg:#efe6ee;--mut:#b3a4b6;--card:#271f2e;--line:#3d3145;--acc:#f08bb0;--q:#2f2437}}
body{background:var(--bg);color:var(--fg);font:16px/1.6 system-ui,-apple-system,Segoe UI,sans-serif;margin:0}
main{max-width:900px;margin:0 auto;padding:24px 16px 80px}
h1{color:var(--acc);font-size:2rem}h2{border-bottom:2px solid var(--line);padding-bottom:6px;margin-top:2.4em;color:var(--acc)}
a{color:var(--acc)}img{max-width:100%;border-radius:10px;display:block;margin:12px 0 2px}
blockquote{background:var(--q);border-left:4px solid var(--acc);margin:12px 0;padding:8px 14px;border-radius:6px}
table{border-collapse:collapse;display:block;overflow-x:auto;font-size:.9rem;margin:12px 0}
th,td{border:1px solid var(--line);padding:6px 8px;vertical-align:top}th{background:var(--card)}
code{background:var(--card);border:1px solid var(--line);border-radius:4px;padding:0 4px;font-size:.85em}
em{color:var(--mut)}
"""
saida = os.path.join(DOCS, "LINE_E_BELL_DOCUMENTACAO.html")
open(saida, "w", encoding="utf-8").write(
    '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">'
    '<meta name="viewport" content="width=device-width,initial-scale=1">'
    f"<title>Line & Bell — Documentação</title><style>{CSS}</style></head>"
    f"<body><main>{html}</main></body></html>")
print(saida)
