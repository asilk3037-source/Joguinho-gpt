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
# Dragão dos itens (81 em diante): célula maior (é grande na tela) e tamanho fixo no mundo.
CELULA_DRAGAO = 448
MUNDO_DRAGAO = 215
# Itens a partir deste número trazem mais quadros que a arte antiga: o jogo mantém a duração
# de cada animação (que está sincronizada com os golpes) em vez da velocidade do catálogo.
ITEM_RITMO = 50


def ler_animacoes(caminho):
    """Dois formatos de item:
    - const animations={CODIGO: {frames: [dataURL...], label}}
    - const payload={images: [dataURL...], animations: {CODIGO: {frames: [índices], fps, description}}}
    """
    with open(caminho, encoding="utf-8") as f:
        html = f.read()
    achado = PADRAO_ANIMACOES.search(html)
    if achado and not achado.group(1).startswith("{'"):
        return json.loads(achado.group(1))
    if 'const animations={"' in html:
        # Item 137 reenviado: const animations={"CODIGO":["data:...", ...]} e descriptions em JSON,
        # tudo na mesma linha do resto do script.
        inicio = html.index("const animations=") + len("const animations=")
        anims, _ = json.JSONDecoder().raw_decode(html[inicio:])
        desc = {}
        if "const descriptions=" in html:
            d = html.index("const descriptions=") + len("const descriptions=")
            desc, _ = json.JSONDecoder().raw_decode(html[d:])
        saida = {}
        for codigo, valor in anims.items():
            quadros = valor["frames"] if isinstance(valor, dict) else valor
            quadros = [q for q in quadros if len(q.split(",", 1)[-1]) >= 100]
            if quadros:
                rotulo = valor.get("label") if isinstance(valor, dict) else desc.get(codigo, codigo)
                saida[RENOMEAR.get(codigo, codigo)] = {"frames": quadros, "label": rotulo or codigo}
        return saida
    if "const payload=" in html:
        inicio = html.index("const payload=") + len("const payload=")
        payload, _ = json.JSONDecoder().raw_decode(html[inicio:])
        imagens = payload["images"]
        vazias = {i for i, u in enumerate(imagens) if len(u.split(",", 1)[-1]) < 100}
        saida = {}
        for codigo, a in payload["animations"].items():
            quadros = [imagens[i] for i in a["frames"] if i not in vazias]
            perdidos = sorted({i for i in a["frames"] if i in vazias})
            if perdidos:
                print(f"  aviso: {os.path.basename(caminho)} {codigo}: imagem vazia no quadro {perdidos} (pulado)")
            if quadros:
                saida[codigo] = {"frames": quadros, "label": a.get("description", codigo), "fps": a.get("fps")}
        return saida
    if "const animations={'" in html:
        # Itens 132 em diante: const animations={'CODIGO':['data:...', ...]} e descriptions à parte.
        inicio = html.index("const animations={'")
        bloco = html[inicio:html.index("};", inicio)]
        desc = {}
        if "const descriptions={" in html:
            d = html[html.index("const descriptions={"):]
            d = d[:d.index("};")]
            desc = {RENOMEAR.get(k, k): v for k, v in re.findall(r"'?([A-Z0-9_]+)'?:'((?:[^'\\]|\\.)*)'", d)}
        saida = {}
        for codigo, dentro in re.findall(r"'([A-Z0-9_]+)':\[(.*?)\]", bloco, re.S):
            codigo = RENOMEAR.get(codigo, codigo)
            quadros = [q for q in re.findall(r"'(data:[^']+)'", dentro) if len(q.split(",", 1)[-1]) >= 100]
            if quadros:
                saida[codigo] = {"frames": quadros, "label": desc.get(codigo, codigo)}
        if saida:
            return saida
    print(f"  aviso: nenhuma animação encontrada em {os.path.basename(caminho)}")
    return {}


# Itens de cenário: NÃO passam pelo recorte de animação (quadros de 1254×1254 viram células de
# 256). Cada cenário tem medida própria combinada antes (ver docs, seção 22.11) e entra à mão.
ITENS_CENARIO = {140: "Minas Shopping", 141: "Playground", 142: "máquina de soco", 143: "Túnel",
                 144: "terreno da Fazendinha", 145: "casa da fazenda por dentro", 146: "objetos da Fazendinha",
                 147: "cercas, porteira, flores e mato", 148: "cozinha", 149: "sala, quarto e banheiro",
                 150: "lareira e sala", 151: "quarto", 152: "banheiro",
                 154: "cozinha: ilha, despensa, prateleira de temperos e banqueta",
                 155: "vaso de planta, quadro, vaso de flores e relógio", 156: "porta e janela",
                 157: "arandela e luminária pendente"}
# Itens 158 a 187: um objeto da fazenda cada (tools/extrair_objetos.py).
ITENS_CENARIO.update({n: "objeto da fazenda" for n in range(158, 188)})


# Andar e correr precisam se mexer: com menos quadros diferentes que isso a animação do item é
# ignorada (fica a anterior) e aparece um aviso para reenviar.
QUADROS_MINIMOS_MOVIMENTO = 3
MOVIMENTO = re.compile(r"_(WALK|RUN|MOVE)(_|$)")


# Animações que chegaram erradas e esperam reenvio: o jogo continua com a anterior.
RECUSADAS = {
    ("LINE_BELL_ITEM_137.html", "SHEEP_IDLE"): "reenvio com rascunho simples (bolinhas e patas de palito); fica a ovelha anterior",
    ("LINE_BELL_ITEM_118.html", "DRAGON_SLEEP"): "não é o dragão dormindo (poses de voo)",
    ("LINE_BELL_ITEM_113.html", "LINE_BELL_DANCE"): "a Line some em alguns quadros",
}

# Arte que saiu do jogo de vez (o jogo usa a substituta do catálogo, o `alt`).
DESCARTADAS = {
    "LINE_HAPPY": "é uma corrida que termina com a Line caída para a frente, e não a Line feliz (no lugar, o jogo usa `LINE_VICTORY`)",
}


def recusada(nome, codigo):
    motivo = RECUSADAS.get((nome, codigo))
    if motivo:
        print(f"  aviso: {codigo} de {nome} recusado ({motivo}): mantida a anterior, reenviar")
    return bool(motivo)


def movimento_parado(codigo, dados):
    return bool(MOVIMENTO.search(codigo)) and len(set(dados["frames"])) < QUADROS_MINIMOS_MOVIMENTO


# Códigos que chegam com outro nome nos itens → nome usado no jogo.
RENOMEAR = {"MAGE_IDLE": "MAGO_IDLE", "MAGE_CAST": "MAGO_CAST", "MAGE_TALK": "MAGO_TALK",
            "SPIRIT_POSE_A": "SPIRIT_IDLE", "SPIRIT_POSE_B": "SPIRIT_TALK"}


def numero_item(nome):
    achado = re.search(r"ITEM_(\d+)", nome)
    return int(achado.group(1)) if achado else 0


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


# Andar/correr que chegaram com as pernas paradas (só o corpo balança): as pernas são refeitas
# girando no quadril, uma depois da outra (tools/pernas_alternadas.py). (amplitude em graus, quanto o pé sobe)
PERNAS_ALTERNADAS = {"CHICKEN_WALK": (30, 0.14), "HEN_BROWN_WALK": (30, 0.14),
                     "CHICKEN_RUN": (40, 0.22), "HEN_BROWN_RUN": (40, 0.22)}


# Animações com um objeto parado desenhado junto que hoje tem arte própria (item 142: a máquina de
# soco nova). O objeto é o que não muda entre os quadros; sai da animação e o jogo desenha a arte nova.
SEM_MAQUINA = {"LINE_PUNCH_MACHINE"}


def tirar_maquina(fontes, lado):
    import numpy as np
    from scipy import ndimage
    A = np.stack([np.asarray(f.convert("RGBA")).astype(np.int32) for f in fontes])
    dif = np.abs(A[..., :3] - A[0:1, ..., :3]).sum(-1).max(0)
    parado = (dif < 30) & (A[..., 3] > 0).all(0)
    rot, n = ndimage.label(parado)
    tam = ndimage.sum(parado, rot, range(1, n + 1))
    objs = ndimage.find_objects(rot)
    w = parado.shape[1]
    # O maior pedaço parado na metade direita é a máquina (a Line soca para a direita).
    cand = [i for i in range(n) if (objs[i][1].start + objs[i][1].stop) / 2 > 0.55 * w]
    i = max(cand, key=lambda k: tam[k])
    maquina = ndimage.binary_dilation(rot == i + 1, iterations=3)
    saida = []
    for a in A:
        a = a.copy(); a[maquina, 3] = 0
        saida.append(Image.fromarray(a.astype(np.uint8), "RGBA").resize((lado, lado), Image.LANCZOS))
    print(f"  máquina tirada da animação (região x {objs[i][1].start}–{objs[i][1].stop}, y {objs[i][0].start}–{objs[i][0].stop} de {w})")
    return saida


def processar(codigo, dados, origem):
    frames = dados["frames"]
    unicos, sequencia, indice = [], [], {}
    for fr in frames:
        if fr not in indice:
            indice[fr] = len(unicos)
            unicos.append(fr)
        sequencia.append(indice[fr])

    dragao = codigo.startswith("DRAGON_")
    lado = CELULA_DRAGAO if dragao else CELULA
    celulas = [decodificar(u).resize((lado, lado), Image.LANCZOS) for u in unicos]
    passo = None
    if codigo in SEM_MAQUINA:
        celulas = tirar_maquina([decodificar(u) for u in unicos], lado)
    if codigo in PERNAS_ALTERNADAS:
        import pernas_alternadas
        fonte = decodificar(unicos[0])
        amplitude, erguer = PERNAS_ALTERNADAS[codigo]
        quadros, passo = pernas_alternadas.refazer(fonte, 12, amplitude, erguer, frente=-1)
        celulas = [q.resize((lado, lado), Image.LANCZOS) for q in quadros]
        sequencia = list(range(len(celulas)))
        # Quanto o bicho anda num ciclo, em px da célula: o jogo casa o quadro com o deslocamento.
        passo = round(passo * lado / fonte.size[0], 1)
        print(f"  {codigo}: pernas refeitas (uma depois da outra), passo de {passo} px por ciclo")

    # Chão = altura dos pés no primeiro e no último quadro. O jogo usa o primeiro por padrão,
    # pois é nele que a animação emenda na anterior.
    chao = base_dos_pes(celulas[sequencia[0]])
    chao_final = base_dos_pes(celulas[sequencia[-1]])

    folha = Image.new("RGBA", (lado * len(celulas), lado), (0, 0, 0, 0))
    for i, c in enumerate(celulas):
        folha.paste(c, (i * lado, 0))
    folha.save(os.path.join(SAIDA, f"{codigo}.webp"), "WEBP", quality=88, method=6)

    extra = {}
    if dragao:
        extra["mundo"] = MUNDO_DRAGAO
    if passo:
        extra["passo"] = passo
    if numero_item(origem) >= ITEM_RITMO:
        extra["ritmo"] = 1
        if dados.get("fps"):
            extra["fpsArte"] = dados["fps"]
    return {
        **extra,
        "src": f"assets/sprites/{codigo}.webp",
        "cell": lado,
        "count": len(celulas),
        "seq": sequencia,
        "ground": chao,
        "groundEnd": chao_final,
        # Chão de cada quadro (para quedas, em que o corpo deitado muda de altura).
        "bases": [base_dos_pes(c) for c in celulas],
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


def extrair_pastas(manifesto, pular=()):
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
        if any(os.path.relpath(pasta, RAIZ).startswith(p) for p in pular):
            continue
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
    arquivos = sorted(glob.glob(os.path.join(RAIZ, "*_ITEM_*.html")), key=lambda a: (numero_item(os.path.basename(a)), a))
    if not arquivos:
        sys.exit("Nenhum HTML *_ITEM_*.html encontrado na raiz do repositório.")

    manifesto = {}
    retratos = {}
    if "--so-escala" in sys.argv:
        # Só recalcula as escalas a partir das folhas já geradas (rápido).
        with open(MANIFESTO, encoding="utf-8") as f:
            texto = f.read()
        manifesto = json.loads(texto.split("window.SPRITES = ", 1)[1].split(";\nwindow.RETRATOS", 1)[0])
        retratos = json.loads(texto.split("window.RETRATOS = ", 1)[1].rstrip().rstrip(";"))
        return gravar(manifesto, retratos)
    if "--apenas" in sys.argv:
        # Só os itens dados (ex.: --apenas 132,133,134), mantendo o resto do manifesto atual.
        numeros = {int(n) for n in sys.argv[sys.argv.index("--apenas") + 1].split(",")}
        with open(MANIFESTO, encoding="utf-8") as f:
            texto = f.read()
        manifesto = json.loads(texto.split("window.SPRITES = ", 1)[1].split(";\nwindow.RETRATOS", 1)[0])
        retratos = json.loads(texto.split("window.RETRATOS = ", 1)[1].rstrip().rstrip(";"))
        for caminho in arquivos:
            nome = os.path.basename(caminho)
            if numero_item(nome) not in numeros:
                continue
            if numero_item(nome) in ITENS_CENARIO:
                print(f"{nome}: cenário ({ITENS_CENARIO[numero_item(nome)]}), fica de fora do recorte de animação")
                continue
            print(nome)
            for codigo, dados in ler_animacoes(caminho).items():
                if movimento_parado(codigo, dados) or recusada(nome, codigo):
                    print(f"  aviso: {codigo} veio parado ({len(set(dados['frames']))} quadro(s) diferente(s)): mantida a anterior, reenviar")
                    continue
                manifesto[codigo] = processar(codigo, dados, nome)
                print(f"  {codigo}: {len(manifesto[codigo]['seq'])} frames ({manifesto[codigo]['count']} únicos)")
        return gravar(manifesto, retratos)
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
    # Se os itens já trazem o dragão novo, o dragão antigo (arte/dragao) não entra: os dois
    # desenhos são diferentes e não podem se misturar na mesma luta.
    dragao_novo = any(c.startswith("DRAGON_") for a in arquivos for c in ler_animacoes(a))
    print("arte/" + (" (sem arte/dragao: chegou o dragão dos itens)" if dragao_novo else ""))
    extrair_pastas(manifesto, ("arte/dragao",) if dragao_novo else ())
    for caminho in sorted(glob.glob(os.path.join(RAIZ, "*PRIMEIRO_ENCONTRO*.html"))):
        print(os.path.basename(caminho))
        retratos.update(extrair_retratos(caminho))
    for caminho in arquivos:
        nome = os.path.basename(caminho)
        print(nome)
        if numero_item(nome) in ITENS_CENARIO:
            print(f"  cenário ({ITENS_CENARIO[numero_item(nome)]}): fica de fora do recorte de animação")
            continue
        for codigo, dados in ler_animacoes(caminho).items():
            if movimento_parado(codigo, dados) or recusada(nome, codigo):
                print(f"  aviso: {codigo} veio parado ({len(set(dados['frames']))} quadro(s) diferente(s)): mantida a anterior, reenviar")
                continue
            manifesto[codigo] = processar(codigo, dados, nome)
            m = manifesto[codigo]
            print(f"  {codigo}: {len(m['seq'])} frames ({m['count']} únicos)")

    # Provisório até chegar a arte: o dragão parado usa o 1º quadro do rugido.
    if dragao_novo and "DRAGON_IDLE" not in manifesto and "DRAGON_ROAR" in manifesto:
        for caminho in arquivos:
            animacoes = ler_animacoes(caminho)
            if "DRAGON_ROAR" in animacoes:
                dados = {"frames": animacoes["DRAGON_ROAR"]["frames"][:1], "label": "Dragão parado (provisório: 1º quadro do rugido)"}
                manifesto["DRAGON_IDLE"] = processar("DRAGON_IDLE", dados, os.path.basename(caminho))
                manifesto["DRAGON_IDLE"]["provisorio"] = "DRAGON_ROAR"
                print("  DRAGON_IDLE: provisório (1º quadro do rugido)")
                break

    extrair_retratos_extras(retratos)
    gravar(manifesto, retratos)


# Altura de cada personagem de pé no mundo. Nos itens, cada animação foi desenhada com um
# tamanho um pouco diferente (a Line parada ocupa 85% do quadro, a Line feliz 67%): a escala
# de cada uma é ajustada pela altura do primeiro quadro (a pose neutra), para ninguém encolher
# ou crescer ao trocar de animação. Se o primeiro quadro começa deitado ou agachado, vale a
# maior altura.
ALTURA_ALVO = {"LINE_BELL_": ALTURA_LINE_MUNDO, "LINE_": ALTURA_LINE_MUNDO, "BELL_": ALTURA_LINE_MUNDO * 0.96,
               "MAGO_": ALTURA_LINE_MUNDO * 1.08, "SPIRIT_": ALTURA_LINE_MUNDO * 1.1}
# Poses sentadas (itens 77 a 79): pela altura da pessoa sentada, não pelo primeiro quadro.
SENTADAS = {"LINE_BELL_SIT_IDLE": 0.75}
MESMA_ESCALA = {"LINE_BELL_SIT_DOWN": "LINE_BELL_SIT_IDLE", "BELL_HEAD_ON_LINE": "LINE_BELL_SIT_IDLE",
                "SPIRIT_APPEAR": "SPIRIT_IDLE", "SPIRIT_TALK": "SPIRIT_IDLE", "MAGO_TALK": "MAGO_IDLE", "MAGO_CAST": "MAGO_IDLE"}
# Bichos que chegaram como item (132 em diante): ficam do mesmo tamanho na tela que a arte
# antiga do pacote da fazenda (altura do bicho de pé, em pixels do mundo).
# Altura da pose parada (1º quadro do _IDLE) quando não há arte antiga para comparar.
# Os bichos ficaram pequenos perto da Line com a altura da arte antiga: cada espécie cresce assim.
AUMENTO_BICHO = {"COW_": 1.8, "HEN_BROWN_": 1.8, "CHICKEN_": 1.8, "CHICK_": 1.9, "DUCK_": 1.7, "CAT_": 1.7,
                 "SHEEP_": 1.8, "PIG_": 1.8, "HORSE_": 1.55, "THEO_": 1.2}
ALTURA_BICHO = {"COW_": 39.5, "HEN_BROWN_": 26.3, "CHICKEN_": 26.3, "CHICK_": 14.1, "DUCK_": 20, "CAT_": 18,
                "SHEEP_": 26, "PIG_": 27, "HORSE_": 58, "THEO_": 30}
# Altura de cada pose na arte antiga do pacote da fazenda (tools/alturas_bichos.json): a escala de
# cada espécie é a mediana das comparações pose a pose (bolhas e “Zzz” não atrapalham).
ALTURAS_ANTIGAS = os.path.join(RAIZ, "tools", "alturas_bichos.json")


def normalizar_escala(manifesto):
    fracoes = {}
    for codigo, m in manifesto.items():
        bicho = next((v for k, v in ALTURA_BICHO.items() if codigo.startswith(k)), None)
        alvo = next((v for k, v in ALTURA_ALVO.items() if codigo.startswith(k)), None)
        if (alvo is None and bicho is None) or "ITEM" not in m.get("item", "") or (m.get("mundo") and not m.get("bicho")):
            continue
        folha = Image.open(os.path.join(RAIZ, "game", m["src"])).convert("RGBA")
        cel = m["cell"]
        alturas = []
        for i in range(m["count"]):
            alfa = folha.crop((i * cel, 0, (i + 1) * cel, cel)).getchannel("A").point(lambda v: 255 if v > 60 else 0)
            dados = alfa.tobytes()
            # Linhas com pelo menos 6 pixels: ignora pontinhos soltos.
            linhas = [y for y in range(cel) if dados[y * cel:(y + 1) * cel].count(255) >= 6]
            alturas.append(linhas[-1] - linhas[0] + 1 if linhas else 0)
        if not max(alturas):
            continue
        primeiro = alturas[m["seq"][0]]
        altura = primeiro if primeiro >= 0.75 * max(alturas) else max(alturas)
        if bicho is not None:
            fracoes[codigo] = (primeiro / cel, cel)
            continue
        if codigo in SENTADAS:
            # Sentada, a pessoa tem uns 75% da altura de pé (vale a pose mais alta da animação).
            altura_mundo = max(alturas) / cel * CELULA_LINE_MUNDO
            m["escala"] = round(alvo * SENTADAS[codigo] / altura_mundo, 4)
            continue
        altura_mundo = altura / cel * CELULA_LINE_MUNDO
        m["escala"] = round(max(0.8, min(1.35, alvo / altura_mundo)), 4)
    escala_bichos(manifesto, fracoes)
    # As poses sentadas que emendam umas nas outras usam a mesma escala (ninguém muda de tamanho).
    for codigo, base in MESMA_ESCALA.items():
        if codigo in manifesto and base in manifesto and "escala" in manifesto[base]:
            manifesto[codigo]["escala"] = manifesto[base]["escala"]


def escala_bichos(manifesto, fracoes):
    """Bichos dos itens: um tamanho no mundo por espécie, o da arte antiga vezes o AUMENTO_BICHO."""
    antigas = json.load(open(ALTURAS_ANTIGAS, encoding="utf-8")) if os.path.exists(ALTURAS_ANTIGAS) else {}
    for prefixo, alvo in ALTURA_BICHO.items():
        codigos = [c for c in fracoes if c.startswith(prefixo)]
        if not codigos:
            continue
        candidatos = sorted(antigas[c] / fracoes[c][0] for c in codigos if c in antigas and fracoes[c][0] > 0)
        if candidatos:
            lado = candidatos[len(candidatos) // 2] if len(candidatos) % 2 else (candidatos[len(candidatos) // 2 - 1] + candidatos[len(candidatos) // 2]) / 2
            mundo = lado
        else:
            parado = next((c for c in codigos if c == prefixo + "IDLE"), codigos[0])
            mundo = alvo / fracoes[parado][0]
        mundo *= AUMENTO_BICHO.get(prefixo, 1)
        for c in codigos:
            manifesto[c]["mundo"] = round(mundo, 2)
            manifesto[c]["bicho"] = True


def preferir_itens(manifesto):
    """Quando um item traz uma animação sem direção (ex.: LINE_BELL_WALK_HANDS, de lado), ela
    vale para a esquerda e a direita no lugar das versões antigas do laboratório; frente e costas
    continuam do laboratório até chegar arte nova para elas."""
    for codigo, m in list(manifesto.items()):
        if "ITEM" not in m.get("item", "") or re.search(r"_(FRONT|BACK|LEFT|RIGHT)$", codigo):
            continue
        for lado in ("_LEFT", "_RIGHT"):
            antigo = manifesto.get(codigo + lado)
            if antigo and "ITEM" not in antigo.get("item", ""):
                del manifesto[codigo + lado]
                arq = os.path.join(RAIZ, "game", antigo["src"])
                if os.path.exists(arq):
                    os.remove(arq)
                print(f"  {codigo + lado}: substituído por {codigo} (item)")


# Ajuste de tamanho por animação (medido pela cabeça e conferido a olho): a Line e a Bell ficam do
# mesmo tamanho em todas as animações. Vai no campo `ajuste`, que o jogo multiplica na escala.
AJUSTE_CABECA = os.path.join(RAIZ, "tools", "ajuste_cabeca.json")


def aplicar_ajustes(manifesto):
    fatores = json.load(open(AJUSTE_CABECA, encoding="utf-8"))["fatores"] if os.path.exists(AJUSTE_CABECA) else {}
    for codigo, m in manifesto.items():
        m.pop("ajuste", None)
        if codigo in fatores:
            m["ajuste"] = fatores[codigo]


def gravar(manifesto, retratos):
    for codigo, motivo in DESCARTADAS.items():
        if manifesto.pop(codigo, None):
            print(f"  aviso: {codigo} descartado ({motivo})")
        arq = os.path.join(RAIZ, "game", "assets", "sprites", codigo + ".webp")
        if os.path.exists(arq):
            os.remove(arq)
    preferir_itens(manifesto)
    normalizar_escala(manifesto)
    aplicar_ajustes(manifesto)
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
