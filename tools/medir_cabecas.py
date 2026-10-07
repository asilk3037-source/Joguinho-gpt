#!/usr/bin/env python3
"""Mede o tamanho da cabeça da Line e da Bell em cada animação, comparando com a cabeça das poses
paradas (_IDLE_*), para achar animações em que elas aparecem maiores ou menores.

Busca a cabeça de referência em vários tamanhos e inclinações (OpenCV, `pip install opencv-python-headless`)
e imprime, para cada animação, o acerto e o tamanho relativo `s` (0,8 = cabeça 20% menor). O ajuste a
aplicar é 1/s, conferido a olho, em tools/ajuste_cabeca.json. Acertos abaixo de ~0,72 não são confiáveis.

Uso (na raiz): python3 tools/medir_cabecas.py LINE saida.json LINE_WALK_LEFT,LINE_ANGRY
"""
import json, sys
import numpy as np, cv2
from PIL import Image

K = 2.5
t = open("game/assets/sprites.js").read()
m = json.loads(t.split("window.SPRITES = ", 1)[1].split(";\nwindow.RETRATOS", 1)[0])


def quadro_mundo(c, i):
    v = m[c]; f = Image.open("game/" + v["src"]).convert("RGBA"); cel = v["cell"]
    esc = (v.get("mundo") or 74 * v.get("escala", 1)) / cel * K
    im = f.crop((i * cel, 0, (i + 1) * cel, cel)); sz = max(8, int(round(cel * esc)))
    im = im.resize((sz, sz), Image.LANCZOS)
    bg = Image.new("RGBA", im.size, (128, 128, 128, 255)); bg.alpha_composite(im)
    g = np.asarray(bg.convert("RGB")); al = np.asarray(im)[..., 3]
    ys, xs = np.nonzero(al > 60)
    top, bot = ys.min(), ys.max(); x0, x1 = xs.min(), xs.max()
    corte = g[max(0, top - 10):top + int(0.75 * (bot - top)) + 10, max(0, x0 - 10):x1 + 10]
    return corte, g, al


def cabeca(c, alt=22):
    v = m[c]; _, rgb, al = quadro_mundo(c, v["seq"][0])
    ys, xs = np.nonzero(al > 60); top = ys.min()
    faixa = al[top:top + int(alt * K)] > 60
    cols = np.nonzero(faixa.any(0))[0]
    return rgb[top:top + int(alt * K), max(0, cols.min() - 2):cols.max() + 3]


def rot(img, ang):
    if not ang:
        return img
    h, w = img.shape[:2]; M = cv2.getRotationMatrix2D((w / 2, h / 2), ang, 1.0)
    return cv2.warpAffine(img, M, (w, h), borderMode=cv2.BORDER_CONSTANT, borderValue=(128, 128, 128))


def busca(alvo, refs, escalas, angulos):
    melhor = (-1, None, None, None)
    for nome, ref0 in refs.items():
        for ang in angulos:
            ref = rot(ref0, ang)
            for s in escalas:
                r = cv2.resize(ref, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
                if r.shape[0] >= alvo.shape[0] or r.shape[1] >= alvo.shape[1]:
                    continue
                sc = cv2.matchTemplate(alvo, r, cv2.TM_CCOEFF_NORMED).max()
                if sc > melhor[0]:
                    melhor = (sc, s, nome, ang)
    return melhor


def medir_quadro(alvo, refs):
    b = busca(alvo, refs, np.arange(0.6, 1.72, 0.08), [0])
    if b[0] < 0.8:
        b2 = busca(alvo, refs, np.arange(0.6, 1.72, 0.08), [-30, -15, 15, 30])
        if b2[0] > b[0]:
            b = b2
    if b[1] is None:
        return b
    nome, ang = b[2], b[3]
    f = busca(alvo, {nome: refs[nome]}, np.arange(b[1] - 0.08, b[1] + 0.09, 0.02), [ang - 8, ang, ang + 8] if ang else [-6, 0, 6])
    return f if f[0] >= b[0] else b


if __name__ == "__main__":
    pers, saida, lista = sys.argv[1], sys.argv[2], sys.argv[3].split(",")
    base = {"LINE": ["LINE_IDLE_FRONT", "LINE_IDLE_LEFT", "LINE_IDLE_BACK", "LINE_IDLE_RIGHT"],
            "BELL": ["BELL_IDLE_FRONT", "BELL_IDLE_LEFT", "BELL_IDLE_BACK", "BELL_IDLE_RIGHT"]}[pers]
    refs = {}
    for c in base:
        h = cabeca(c); refs[c] = h; refs[c + "~"] = h[:, ::-1].copy()
    res = {}
    for c in lista:
        v = m[c]; uniq = sorted(set(v["seq"])); passo = max(1, len(uniq) // 3)
        r = [medir_quadro(quadro_mundo(c, i)[0], refs) for i in uniq[::passo][:3]]
        boas = [x for x in r if x[0] > 0.6]
        s = float(np.median([x[1] for x in boas])) if boas else None
        res[c] = {"s": s, "r": [(round(float(a), 2), round(float(b), 2) if b else None, n, int(g or 0)) for a, b, n, g in r]}
        print(f"{c:28} s={s and round(s, 2)} {[(round(float(a), 2), b and round(float(b), 2), int(g or 0)) for a, b, _, g in r]}", flush=True)
        json.dump(res, open(saida, "w"), indent=1)
