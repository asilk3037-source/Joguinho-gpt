#!/usr/bin/env python3
"""Refaz as pernas de uma caminhada/corrida de bicho que chegou com as pernas paradas.

A galinha dos itens 131 e 132 veio com os 12 quadros de andar e correr com as duas pernas
quase na mesma posição: só o corpo balança, e no jogo ela parece deslizar. Aqui as pernas são
recortadas do 1º quadro e giradas no quadril, uma depois da outra (a que avança sobe um pouco
o pé; a que apoia fica no chão e o corpo desce de leve nas pontas do passo).

Uso pelo extrator: `quadros, passo = refazer(imagem, quadros=12, amplitude=28, erguer=0.12)`.
`passo` é quanto o bicho anda (em px da imagem recebida) num ciclo completo, para o jogo casar
a animação com o deslocamento e o pé não escorregar.
"""
import math

import numpy as np
from PIL import Image
from scipy import ndimage


def _pernas(img):
    """Máscaras das duas pernas (laranja + contorno + brilho perto do laranja) e o quadril de cada uma."""
    a = np.asarray(img.convert("RGBA")).astype(np.int32)
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    opaco = al > 60
    ys, _ = np.nonzero(opaco)
    topo, base = ys.min(), ys.max()
    alt = base - topo
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    sat = (mx - mn) / np.maximum(mx, 1)
    baixo = np.arange(a.shape[0])[:, None] > topo + 0.62 * alt
    laranja = opaco & baixo & (r > 120) & (sat > 0.7) & (r >= g) & (b < 80)
    rot, n = ndimage.label(ndimage.binary_dilation(laranja, iterations=3))
    if n < 2:
        raise ValueError("não achei as duas pernas")
    tam = ndimage.sum(laranja, rot, range(1, n + 1))
    ids = [int(i) + 1 for i in np.argsort(tam)[::-1][:2]]
    k = max(4, round(alt * 0.03))
    pernas = []
    for i in ids:
        nucleo = laranja & (rot == i)
        py, px = np.nonzero(nucleo)
        quadril_y = py.min()
        topo_px = px[py <= quadril_y + max(2, round(alt * 0.02))]
        quadril = (float(topo_px.mean()), float(quadril_y))
        # Tudo o que tem alguma cor perto do laranja (inclui o contorno e a borda meio transparente).
        mascara = (al > 0) & ndimage.binary_dilation(nucleo, iterations=k) & (np.arange(a.shape[0])[:, None] >= quadril_y - k)
        meio = px[(py > quadril_y) & (py < quadril_y + 0.4 * (py.max() - quadril_y))]
        inclinacao = abs(float(meio.mean()) - quadril[0]) / max(1, py.max() - quadril_y) if meio.size else 0
        pernas.append({"mascara": mascara, "quadril": quadril, "inclinacao": inclinacao, "comprimento": float(py.max() - quadril_y)})
    pernas.sort(key=lambda p: p["quadril"][0])
    return a.astype(np.uint8), pernas


def refazer(img, quadros=12, amplitude=28.0, erguer=0.12, frente=-1):
    """Gera `quadros` imagens com as pernas alternando. `frente` = -1 se o bicho olha para a esquerda."""
    a, pernas = _pernas(img)
    corpo = a.copy()
    for p in pernas:
        corpo[p["mascara"], 3] = 0
    # Sobras soltas do contorno dos pés antigos: fica só o corpo (o maior pedaço) e o que é grande.
    rot, n = ndimage.label(corpo[..., 3] > 0)
    if n > 1:
        tam = ndimage.sum(np.ones(rot.shape), rot, range(1, n + 1))
        pequenos = [i + 1 for i, t in enumerate(tam) if t < 0.02 * tam.max()]
        corpo[np.isin(rot, pequenos), 3] = 0
    corpo = Image.fromarray(corpo, "RGBA")
    # Molde: a perna mais reta, usada nos dois quadris (as duas iguais alternam melhor).
    molde_p = min(pernas, key=lambda p: p["inclinacao"])
    m = np.zeros_like(a)
    m[molde_p["mascara"]] = a[molde_p["mascara"]]
    molde = Image.fromarray(m, "RGBA")
    mq = molde_p["quadril"]
    comp = molde_p["comprimento"]
    # A perna de trás (mais longe da cabeça) fica um pouco mais escura: é a do outro lado.
    longe = pernas[1] if frente < 0 else pernas[0]
    escura = Image.fromarray(np.dstack([(m[..., :3] * 0.82).astype(np.uint8), m[..., 3]]), "RGBA")
    w, h = img.size
    ordem = [(j, p) for j, p in enumerate(pernas) if p is longe] + [(j, p) for j, p in enumerate(pernas) if p is not longe]
    saida = []
    for i in range(quadros):
        fase = 2 * math.pi * i / quadros
        quadro = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        descida = 0.0
        # Ordem: perna de longe, perna de perto e o corpo por cima.
        for j, p in ordem:
            f = fase + j * math.pi
            teta = amplitude * math.sin(f)
            if math.cos(f) > 0:
                sobe = erguer * comp * math.cos(f)       # perna avançando: o pé sai do chão
            else:
                sobe = 0.0                                  # perna de apoio: o corpo desce nas pontas
                descida = max(descida, comp * (1 - math.cos(math.radians(teta))))
            fonte = escura if p is longe else molde
            dx, dy = p["quadril"][0] - mq[0], p["quadril"][1] - mq[1] - sobe
            movida = fonte.transform((w, h), Image.AFFINE, (1, 0, -dx, 0, 1, -dy), resample=Image.NEAREST)
            # rotate() gira no sentido anti-horário: com `frente` = -1, ângulo negativo leva o pé para a esquerda.
            quadro.alpha_composite(movida.rotate(teta * frente, resample=Image.BICUBIC,
                                                 center=(p["quadril"][0], p["quadril"][1] - sobe)))
        quadro.alpha_composite(corpo)
        # Pé de apoio sempre no chão: o bicho inteiro desce o quanto a perna inclinada encurtou.
        final = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        final.alpha_composite(quadro, (0, int(round(descida))))
        saida.append(final)
    passo = 4 * comp * math.sin(math.radians(amplitude))
    return saida, passo
