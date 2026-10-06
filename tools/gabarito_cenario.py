#!/usr/bin/env python3
"""Gera o gabarito do Minas Shopping (item 140): grade, área andável, pontos da história, closes
e a Line em escala, por cima da base do shopping (chão e teto). Uso: python3 tools/gabarito_cenario.py"""
import json
import os

from PIL import Image, ImageDraw, ImageFont

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = 6  # 1 px da base 360×640 = 6 px no gabarito (2160×3840)
W, H = 360 * F, 640 * F


def main():
    fundo = Image.open(os.path.join(RAIZ, 'game/assets/cenario/shopping_base.webp')).convert('RGB').resize((W, H), Image.LANCZOS)
    img = Image.blend(Image.new('RGB', (W, H), (22, 18, 30)), fundo, 0.35).convert('RGBA')
    ov = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    fonte = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 44)
    peq = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 34)
    P = lambda x, y: (x * F, y * F)
    # Grade: 1 tile do jogo = 32 unidades do mundo = 24 px da base = 144 px aqui.
    T = 24 * F
    for x in range(0, W + 1, T):
        d.line([(x, 0), (x, H)], fill=(255, 255, 255, 40), width=2)
    for y in range(0, H + 1, T):
        d.line([(0, y), (W, y)], fill=(255, 255, 255, 40), width=2)
    d.rectangle([0, 0, W, 200 * F], fill=(120, 150, 255, 40))
    d.text(P(10, 8), 'TETO E LOJAS (y 0–200): ninguém anda aqui', font=fonte, fill=(200, 215, 255, 255))
    x0, y0, x1, y1 = P(28, 200) + P(332, 545)
    d.rectangle([x0, y0, x1, y1], outline=(120, 255, 150, 230), width=8)
    d.text((x0 + 20, y0 + 16), 'CHÃO ANDÁVEL: x 28–332, y 200–545 (base 360×640), menos as mesas', font=fonte, fill=(150, 255, 170, 255))
    d.text((x0 + 20, y0 + 70), f'= x {x0}–{x1}, y {y0}–{y1} neste gabarito ({W}×{H})', font=peq, fill=(150, 255, 170, 255))
    d.rectangle([0, 545 * F, W, H], fill=(255, 150, 120, 35))
    d.text(P(10, 560), 'FRENTE (y 545–640): borda de baixo', font=fonte, fill=(255, 190, 170, 255))
    # Closes (zoom 1,6×): numa tela 16:9 a câmera mostra 250 unidades de altura = 187,5 px da base.
    for nome, (cx, cy) in [('CLOSE 1: o encontro', (159, 325)), ('CLOSE 2: lanche do BK', (180, 416))]:
        hh, ww = 187.5 / 2, 187.5 * 16 / 9 / 2
        r = [max(0, (cx - ww) * F), (cy - hh) * F, min(W - 4, (cx + ww) * F), (cy + hh) * F]
        d.rectangle(r, outline=(255, 120, 200, 220), width=6)
        d.text((r[0] + 16, r[1] + 12), nome + ' (zoom 1,6×): o mais detalhado', font=peq, fill=(255, 170, 220, 255))
    texto = open(os.path.join(RAIZ, 'game/assets/sprites.js'), encoding='utf-8').read()
    man = json.loads(texto.split('window.SPRITES = ', 1)[1].split(';\nwindow.RETRATOS', 1)[0])

    def boneca(codigo, x, y, flip=False):
        m = man[codigo]
        folha = Image.open(os.path.join(RAIZ, 'game', m['src'])).convert('RGBA')
        c = m['cell']
        q = folha.crop((m['seq'][0] * c, 0, m['seq'][0] * c + c, c))
        if flip:
            q = q.transpose(Image.FLIP_LEFT_RIGHT)
        esc = 74 * (m.get('escala') or 1) / c * 0.75 * F  # célula 74 do mundo = 55,5 px da base
        q = q.resize((round(c * esc), round(c * esc)), Image.LANCZOS)
        ov.alpha_composite(q, (round(x * F - q.width / 2), round(y * F - m['ground'] * esc)))

    pontos = [('Line começa aqui', (178, 528), 'LINE_IDLE_BACK'), ('Bell espera aqui', (182, 355), 'BELL_WAIT'),
              ('Line no lanche', (142, 446), 'LINE_IDLE_FRONT'), ('Bell no lanche', (218, 446), 'BELL_IDLE_FRONT'), ('saída das duas', (180, 610), None)]
    for nome, (x, y), cod in pontos:
        if cod and cod in man:
            boneca(cod, x, y, cod == 'BELL_WAIT')
        d.ellipse([x * F - 18, y * F - 18, x * F + 18, y * F + 18], fill=(255, 230, 120, 230))
        d.text((x * F + 26, y * F - 10), f'{nome} ({x},{y})', font=peq, fill=(255, 235, 150, 255))
    d.ellipse([180 * F - 30, 446 * F - 30, 180 * F + 30, 446 * F + 30], outline=(255, 230, 120, 255), width=6)
    d.text(P(150, 454), 'LANCHE DO BK (180,446)', font=peq, fill=(255, 235, 150, 255))
    linhas = ['ESCALA', 'Line de pé: 47 px da base = 281 px aqui', '1 tile (32 do mundo) = 24 px da base = 144 px aqui',
              'Base 360×640 · entregue 2160×3840 (×6)', 'ou 2880×5120 (×8) para 4K']
    d.rectangle([W - 1060, H - 330, W - 30, H - 30], fill=(20, 16, 30, 220))
    for i, t in enumerate(linhas):
        d.text((W - 1030, H - 312 + i * 54), t, font=peq if i else fonte, fill=(255, 255, 255, 255))
    img.alpha_composite(ov)
    saida = os.path.join(RAIZ, 'arte/referencias/gabarito_minas_shopping_2160x3840.png')
    img.convert('RGB').save(saida, optimize=True)
    img.convert('RGB').resize((540, 960), Image.LANCZOS).save(os.path.join(RAIZ, 'docs/imagens/gabarito-minas-shopping.jpg'), quality=85)
    print(saida)


if __name__ == '__main__':
    main()
