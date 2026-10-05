#!/usr/bin/env python3
"""Gera docs/LINE_E_BELL_PENDENCIAS.md: só o que falta fazer na arte, mais todas as regras combinadas.

A lista de animações vem do inventário do jogo (o mesmo da documentação completa); o resto (itens,
armaduras, mapas) vem do mundo exportado. Rode depois de tools/exportar_inventario.js:

    python3 tools/gerar_pendencias.py inventario.json
"""
import datetime
import json
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(RAIZ, "docs")
GAME = os.path.join(RAIZ, "game")
inv = json.load(open(sys.argv[1], encoding="utf-8"))
M = inv["mundo"]
grupos = {g["nome"]: g["itens"] for g in inv["grupos"]}
sprites = json.loads(open(os.path.join(GAME, "assets", "sprites.js"), encoding="utf-8").read().split("window.SPRITES = ", 1)[1].split(";\nwindow.RETRATOS", 1)[0])

linhas = []


def w(texto=""):
    linhas.append(texto)



def img(nome, legenda):
    w(f"![{legenda}](imagens/{nome}.jpg)")
    w(f"*{legenda}*")
    w()


def existe(rel):
    return os.path.exists(os.path.join(GAME, rel))


def tabela(cab, filas):
    w("| " + " | ".join(cab) + " |")
    w("|" + "---|" * len(cab))
    for f in filas:
        w("| " + " | ".join(str(c) for c in f) + " |")
    w()


hoje = datetime.date.today().strftime("%d/%m/%Y")
w("# Line & Bell — o que falta (pendências de arte)")
w()
w(f"*Atualizado em {hoje}. Este documento lista só o que **falta fazer ou refazer**. O que já está pronto fica na documentação completa (`LINE_E_BELL_DOCUMENTACAO.md`). As regras da seção 1 valem para tudo e não mudam.*")
w()
w("**Como usar:** cada linha tem o **código** exato que a arte precisa ter (o jogo procura a imagem pelo código). Quando a arte chega com o código certo, ela entra no jogo sozinha, no lugar da provisória. ✅ = já chegou · 🔁 = o jogo usa uma substituta até chegar · ✏️ = falta e nada substitui · ♻️ = existe, mas precisa refazer.")
w()

# =====================================================================================
w("## 1. Regras (valem para toda arte)")
w()
w("### 1.1 Estilo")
w()
w("1. **Pixel art.** Tudo em pixel art, no mesmo traço, nas mesmas cores e na mesma proporção dos **20 primeiros itens** (`LINE_BELL_ITEM_01` a `20`: a Line e a Bell paradas, andando e correndo). Eles são a **referência oficial** de proporção: cabeça, corpo, pernas e altura.")
w("2. **A Line** usa boné preto, moletom e calça pretos, tênis pretos de sola branca e o colar laranja; cabelo comprido escuro. **A Bell** usa óculos redondos, cropped azul-claro ou blusa branca, short jeans e tênis brancos; cabelo comprido castanho. A identidade nunca muda entre animações.")
w("3. **Theo:** a arte atual do jogo é o layout oficial; só melhorar, sem perder os traços.")
w("4. **Mesma altura sempre:** a Line tem **1,60 m**, que no jogo são **62 unidades** (≈ 85% do quadro de 74). A Bell fica com 96% da altura da Line. Uma animação nova não pode deixar a personagem maior ou menor do que nas 20 primeiras.")
w()
w("### 1.2 Quadros e entrega")
w()
w("1. **Fundo transparente de verdade** (PNG com alfa). Nada de quadriculado, fundo cinza, cenário, sombra no chão ou rótulo dentro do quadro: o jogo desenha a sombra.")
w("2. **Todos os quadros de uma animação do mesmo tamanho**, com **os pés sempre na mesma linha**. Quadros de **1254×1254** (personagens) estão ótimos; o mínimo é 400×400.")
w("3. **Animações de lado viradas para a direita** (o jogo espelha para a esquerda), a não ser que a lista peça as duas.")
w("4. **Quatro direções** quando a ação acontece andando ou lutando: `_FRONT` (de frente, para baixo na tela), `_BACK` (de costas, para cima), `_RIGHT` e, se diferente, `_LEFT`.")
w("5. **Quantidade de quadros:** andar e correr com **8 a 12** quadros; cenas (conversa, abraço, comer) com **pelo menos 10 a 12** quadros diferentes, para não ficarem corridas; golpes com **6 a 10**. Animações de andar ou correr com menos de 3 quadros diferentes são recusadas pelo jogo.")
w("6. **Regra das pernas (andar e correr de lado):** a perna de trás começa o avanço, passa pela posição do meio e termina esticada à frente, enquanto a outra transfere o peso, impulsiona e dobra para trás. Ciclo: contato → absorção do peso → apoio → passagem da perna de trás → impulso → pé subindo → avanço completo → novo contato → o mesmo com a outra perna. Os braços cruzam com as pernas; cabelo, roupa e colar acompanham.")
w("7. **Formatos aceitos:** HTML de item (`LINE_BELL_ITEM_NN.html`, com as imagens **dentro** do HTML, até 25 MB, sem dividir uma animação no meio), pasta `arte/<grupo>/<CODIGO>/00.png…` com `config.json`, ou **zip com as pastas e os PNGs** (o HTML de prévia sozinho não serve: as imagens precisam vir junto). Um PNG por quadro ou por peça, com o nome do código.")
w("8. **Numeração:** cada lote continua a numeração do anterior; se um número se repetir, as peças são chamadas pelo código.")
w()
w("### 1.3 Objetos, cenário e mapas")
w()
w("1. **Uma peça por PNG**, recortada no contorno, com transparência, na perspectiva **de cima em 3/4** do jogo.")
w("2. **Régua de tamanho real:** cada objeto entra pelo tamanho de verdade em relação à Line de 1,60 m (cadeira ≈ 0,9 m, porta ≈ 2,05 m, casa ≈ 7×5 tiles; 1 tile = 32 unidades).")
w("3. **Direção:** sofá, banco, estante, lareira, cômoda e guarda-roupa são vistos **de frente** e ficam encostados na parede do fundo ou ao norte do que olham. Poltrona e cadeira de balanço têm lado (virada para a esquerda, o jogo espelha para a direita).")
w("4. **Nada solto no ar:** sem lustre pendurado, janela, porta ou placa soltas no chão. Coisa de parede vem já presa numa parede.")
w("5. **Dia e noite:** o que acende vem em dois PNGs (`_ON` e `_OFF`, ou `_DAY` e `_NIGHT`).")
w("6. **Mapas das fases:** vista **de cima**, sem céu nem horizonte, desenhados **em cima do gabarito** da fase (`arte/referencias/gabaritos/<fase>.png`), na escala de **128 px por tile**, entregues em **blocos de 2048×2048**. O que é alto (árvore, casa, pilar) vai numa camada da frente, com transparência.")
w("7. **Cenas em pé (prólogo):** base 360×640 (9:16), entrega **2160×3840**; chão e teto numa base vazia e cada móvel/loja à parte, mais um **guia de posicionamento**.")
w("8. **Telas cheias:** 3840×2160 (16:9), nada importante a menos de 10% da borda.")
w()

# =====================================================================================
w("## 2. Animações que precisam de ajuste (refazer)")
w()
w("### 2.1 Ataque nas quatro direções ⚔️")
w()
w("Hoje toda arte de ataque é **de lado**. O golpe já funciona para cima e para baixo no jogo (a área de acerto e o rastro da espada seguem a direção, e a mira vira para o inimigo mais perto), mas a Line continua desenhada de lado. Faltam as versões de **frente** e **de costas** de cada golpe (o `_RIGHT` é o desenho que já existe):")
w()
golpes = [("LINE_ATTACK_HORIZONTAL", "golpe 1 (horizontal)"), ("LINE_ATTACK_VERTICAL", "golpe 2 (de cima para baixo)"), ("LINE_ATTACK_COMBO", "golpe 3 (combo)"),
          ("LINE_ATTACK_DIAGONAL", "investida"), ("LINE_PUNCH", "soco sem espada (hoje vem do soco na máquina)"), ("LINE_CAST_SPELL", "Raio de Luz"),
          ("BELL_ATTACK_STAR", "estrela da Bell"), ("BELL_ATTACK_SPREAD", "leque de estrelas da Bell")]
filas = []
for cod, o in golpes:
    tem = [d for d in ("FRONT", "BACK") if (cod + "_" + d) in sprites]
    filas.append((f"`{cod}_FRONT`", f"`{cod}_BACK`", o, "✅" if len(tem) == 2 else "✏️ falta"))
tabela(["De frente", "De costas", "Golpe", "Situação"], filas)
w("Mesmos quadros e mesmo tempo da versão de lado, para o golpe acertar no mesmo instante. A espada (ou o punho) aponta para baixo da tela no `_FRONT` e para cima no `_BACK`.")
w()

w("### 2.2 Cenas do shopping e do prólogo: poucos quadros ♻️")
w()
w("Estas cenas têm só 3 a 7 quadros diferentes e ficavam corridas. O jogo já toca mais devagar (4 a 6 quadros por segundo), mas o certo é **refazer com 10 a 12 quadros diferentes**, sem mudar o código:")
w()
filas = []
for cod, o in [("LINE_ADMIRE", "a Line vê a Bell de longe"), ("BELL_WAIT", "a Bell esperando no shopping"), ("LINE_BELL_MEET", "conversa frente a frente"),
               ("LINE_BELL_GREET_HUG", "abraço de chegada"), ("LINE_BELL_BK", "comendo BK (sem a mesa: as duas sentadas nas poltronas)"),
               ("LINE_BELL_TUNNEL_KISS", "o beijo no túnel"), ("BELL_LAUGH_AT_LINE", "a Bell rindo do soco"), ("LINE_BELL_WALK_HANDS", "saindo de mãos dadas")]:
    s = sprites.get(cod)
    filas.append((f"`{cod}`", o, s["count"] if s else "—", "10 a 12"))
tabela(["Código", "Cena", "Quadros hoje", "Pedido"], filas)
w("Também faltam as duas sentadas comendo: `LINE_SIT_CHAIR_EAT` (Line virada para a direita) e `BELL_SIT_CHAIR_EAT` (Bell virada para a esquerda), sem mesa e sem poltrona no desenho.")
w()

w("### 2.3 Pôr do sol, felizes e a Line girando a Bell: desproporcionais ♻️")
w()
w("Estas cenas saíram com a cabeça e o corpo **maiores** que a Line e a Bell das 20 primeiras, e a dança (a Line girando a Bell) está **borrada** (é uma arte antiga pequena, ampliada). Precisam ser **refeitas do zero**, em pixel art, com a Line e a Bell exatamente do tamanho da referência (linha tracejada da imagem):")
w()
img("pendencias-proporcao", "Comparação com a referência: a Line e a Bell dos 20 primeiros itens à esquerda; as cenas desproporcionais à direita")
filas = [("`LINE_BELL_HOLD_HANDS`", "de mãos dadas olhando o pôr do sol (de lado, as duas viradas para a esquerda)", "10 a 12"),
         ("`LINE_BELL_DANCE`", "a Line girando a Bell pela mão (giro completo, a Bell rodando e o cabelo acompanhando)", "12 a 16"),
         ("`LINE_BELL_KISS`", "a bitoquinha no lago", "10 a 12"),
         ("`LINE_BELL_CELEBRATE`", "as duas felizes comemorando (toca aqui)", "10 a 12"),
         ("`LINE_BELL_HIGH_FIVE`", "toca aqui com brilho", "8 a 10"),
         ("`LINE_HAPPY`", "a Line feliz (a atual foi descartada: era uma corrida que terminava caída)", "8 a 10"),
         ("`BELL_HAPPY`", "a Bell feliz", "8 a 10")]
tabela(["Código", "Cena", "Quadros"], filas)

w("### 2.4 Outras para refazer")
w()
w("- `LINE_BELL_WALK_HANDS_FRONT`: as duas de mãos dadas andando de frente ainda é a arte pequena do laboratório, ampliada (fica borrada).")
w("- `BELL_DRAGON_CARRIED`: veio com o dragão antigo desenhado junto. Reenviar só a Bell pendurada, de braços para cima, sem dragão.")
w("- **Máquina de soco com o placar 000:** só chegou a de 038; o 000 é feito no jogo a partir dela. Mandar `PLAYGROUND_MAQUINA_SOCO_000` desenhado.")
w()

# =====================================================================================
w("## 3. Animações pendentes (ainda não existem)")
w()
w("Agrupadas como no jogo. 🔁 = o jogo usa a substituta indicada até a arte chegar.")
w()
ORDEM = [n for n in grupos if any(not i["existe"] for i in grupos[n])]
for nome in ORDEM:
    itens = [i for i in grupos[nome] if not i["existe"]]
    w(f"### {nome} ({len(itens)})")
    w()
    filas = []
    for i in itens:
        st = f"🔁 usa `{i['via']}`" if i["via"] else "✏️ falta"
        q = i.get("quadrosPedidos") or ""
        filas.append((f"`{i['codigo']}`", (i.get("desc") or "").replace("|", "/"), q, st))
    tabela(["Código", "O que mostra", "Quadros", "Situação"], filas)

# =====================================================================================
w("## 4. Armaduras e itens (arte nova para o que já existe no jogo)")
w()
w("As armaduras e os itens já funcionam no jogo, mas aparecem com **emoji** no lugar da arte, e a Line e a Bell continuam com a roupa normal quando vestem uma armadura. A seção 3 lista todas as animações de cada armadura; aqui fica o que falta de **ícone** e de **visual**:")
w()
w("### 4.1 Armaduras")
w()
filas = []
for k, a in M["armaduras"].items():
    quem = "Bell" if a.get("bell") else "Line"
    pref = ("BELL_" if a.get("bell") else "LINE_") + {"tunica": "TUNICA", "malha": "MALHA", "brasa": "BRASA", "vestido": "VESTIDO", "estelar": "ESTELAR", "aurora": "AURORA"}.get(k, k.upper())
    filas.append((a["nome"], quem, a.get("icone", ""), f"`ICON_ARMOR_{k.upper()}`", f"`{pref}_*` (parada, andar, correr, golpes, dano: seção 3)", a.get("desc", "").replace("|", "/")))
tabela(["Armadura", "De quem", "Hoje", "Ícone (128×128)", "Personagem vestida", "Como é no jogo"], filas)
w("Cada armadura precisa: o **ícone** (loja, mochila e HUD), a **personagem vestida** em todas as animações de movimento e luta (mesmo quadro e mesmos pés da versão sem armadura) e, se quiser, a armadura **exposta na ferraria** do Seu Bento.")
w()
w("### 4.2 Ícones dos itens (128×128, transparentes)")
w()
filas = []
for k in M.get("ordemItens") or list(M["itens"]):
    it = M["itens"].get(k)
    if not it:
        continue
    filas.append((it["nome"], it.get("icone", ""), f"`ICON_ITEM_{k.upper()}`", (it.get("desc") or "").replace("|", "/")[:120]))
tabela(["Item", "Hoje", "Código do ícone", "Para que serve"], filas)
w("Também: **moeda** (`ICON_COIN`, parada e girando em 6 quadros), **documento** de cada tipo (`ICON_DOC_<TIPO>`: " + ", ".join(f"`{t}`" for t in (M.get("tiposDoc") or {})) + "), **coração** cheio, metade e vazio (`ICON_HEART_FULL/HALF/EMPTY`), **escudo** cheio e vazio, **gota de magia** cheia e vazia.")
w()

# =====================================================================================
w("## 5. Botões e controles")
w()
img("pendencias-controles", "Controles do celular hoje: molduras da arte (botões, joystick, HUD e selo) já no jogo; os ícones dentro dos botões ainda são emoji")
w("**Já chegou e está no jogo ✅:** moldura dos botões redondos (`UI_ACTION_BUTTON_FRAME`), base e botão do joystick (`UI_JOYSTICK_BASE`, `UI_JOYSTICK_KNOB`) e o selo de novidade (`UI_NOTIFICATION_BADGE`).")
w()
w("**Falta o ícone de dentro de cada botão** (PNG 192×192, transparente, só o símbolo; a moldura dourada fica por fora):")
w()
BOTOES = [("⚔", "UI_ICON_ATTACK", "Atacar (espada; sem espada, soco) — segurar faz o giro"), ("✊", "UI_ICON_PUNCH", "Atacar sem espada (soco)"),
          ("🛡", "UI_ICON_DEFEND", "Defender"), ("💨", "UI_ICON_DODGE", "Esquivar"), ("⤴", "UI_ICON_JUMP", "Pular"), ("✨", "UI_ICON_MAGIC", "Magia (Raio de Luz / canção da Bell)"),
          ("💣", "UI_ICON_ITEM", "Item do atalho (mostra o ícone do item equipado)"), ("🔄", "UI_ICON_SWAP", "Trocar de heroína"), ("🎒", "UI_ICON_BAG", "Mochila e mapa"),
          ("⏸", "UI_ICON_PAUSE", "Pausa"), ("Abrir", "UI_BUTTON_INTERACT", "Botão de ação do lugar (Abrir, Falar, Entrar, Tentar!): moldura retangular que estica, 3 fatias")]
tabela(["Hoje", "Código", "Botão"], [(f"{a}", f"`{b}`", c) for a, b, c in BOTOES])

w("## 6. HUD do jogador")
w()
img("pendencias-hud", "HUD hoje com as molduras da arte: retrato, barras de vida e magia, moedas e item, minimapa e o painel de objetivo")
w("**Já chegou e está no jogo ✅:** moldura do retrato (`UI_HUD_PORTRAIT_FRAME`), barra de status (`UI_HUD_STATUS_BAR_FRAME`, usada na vida e na magia), contador (`UI_HUD_RESOURCE_COUNTER_FRAME`, moedas e item), minimapa (`UI_MINIMAP_FRAME`), painel de objetivo (`UI_MISSION_PANEL_FRAME`) e selo (`UI_NOTIFICATION_BADGE`).")
w()
w("**Falta:**")
w()
tabela(["Código", "Peça", "Tamanho", "Observação"], [
    ("`UI_HUD_PORTRAIT_LINE` / `UI_HUD_PORTRAIT_BELL`", "rosto de cada heroína para o retrato do HUD", "512×512", "hoje usa o retrato do diálogo; com 3 expressões: normal, machucada, caída"),
    ("`UI_BAR_FILL_HP` / `UI_BAR_FILL_MANA`", "o miolo das barras (vida vermelha, magia azul), com brilho", "1600×64", "o jogo corta no tamanho certo"),
    ("`UI_BOSS_BAR_FRAME`", "barra de vida dos chefes, embaixo da tela", "1600×128", "com espaço para o nome do chefe"),
    ("`UI_CLOCK_FRAME`", "moldura do relógio (hora e dia) no topo", "512×128", "com sol e lua (dia e noite)"),
    ("`UI_DIALOG_BOX`", "caixa de diálogo com o espaço do retrato", "1600×400", "estica na largura (3 fatias)"),
    ("`UI_TOAST_FRAME`", "aviso de item novo (canto direito)", "800×128", "estica na largura"),
    ("`UI_HINT_BAR`", "faixa de dica (modo Fácil)", "1600×96", ""),
    ("`UI_PROMPT_KEY`", "teclinha das dicas do teclado (E, I, M, F, H, T)", "128×128", "em branco: o jogo escreve a letra"),
])

w("## 7. Telas")
w()
w("Telas cheias em **3840×2160** (mínimo 1920×1080), com o importante longe das bordas. Cada janela (mochila, loja, pausa) precisa da moldura e do fundo; os textos e botões o jogo escreve.")
w()
tabela(["Código", "Tela", "O que precisa"], [
    ("`SCREEN_TITLE`", "Título e menu inicial", "logo **Line & Bell**, fundo com as duas na fazenda, botões Novo jogo / Continuar / Controles / Galeria"),
    ("`SCREEN_LOADING`", "Carregando", "fundo simples com uma animação pequena (o Theo correndo, por exemplo)"),
    ("`SCREEN_PAUSE`", "Pausa", "moldura do painel e fundo escurecido"),
    ("`SCREEN_BAG`", "Mochila", "moldura com 3 abas (Itens, Documentos, Mapa), grade dos itens, folha de documento"),
    ("`SCREEN_WORLD_MAP`", "Mapa do mundo", "pergaminho **2400×1500** com as 7 áreas da Parte 1 e as da Parte 2"),
    ("`SCREEN_SHOP`", "Loja da Dona Rosa e ferraria do Seu Bento", "balcão, prateleira e moldura dos produtos"),
    ("`SCREEN_TRAVEL`", "Viagem de carrinho", "escolha da estação"),
    ("`SCREEN_DEFEAT`", "A heroína caiu", "fundo e botões Tentar de novo / Voltar"),
    ("`SCREEN_CHAPTER`", "Título de capítulo", "faixa decorada para \"Capítulo 1 — Nossa vidinha\" e os outros"),
    ("`SCREEN_PART2`", "Abertura da Parte 2", "ilustração de abertura"),
    ("`SCREEN_END`", "Fim e créditos", "ilustração final das duas"),
    ("`SCREEN_CONTROLS`", "Controles", "teclado e celular, com os ícones dos botões da seção 5"),
    ("`SCREEN_GALLERY`", "Galeria", "moldura das miniaturas"),
])

# =====================================================================================
w("## 8. Mapas e cenários")
w()
w("### 8.1 Fases")
w()
w("Cada fase precisa do chão em imagem (seguindo o gabarito) e das peças altas por cima. A fazenda e os interiores das casas já têm arte; o resto ainda é desenhado no código.")
w()
filas = []
for id_, m in M["mapas"].items():
    if id_.startswith("casa_") or m.get("tema") == "encontro":
        continue
    tw, th = m["w"], m["h"]
    pronto = id_ == "fazenda"
    filas.append((m["nome"], f"{tw}×{th}", f"**{tw * 128}×{th * 128}**", f"`gabaritos/{id_}.png`", "✅ terreno pronto" if pronto else "✏️ falta"))
tabela(["Fase", "Grade (tiles)", "Pintura (128 px/tile)", "Gabarito", "Situação"], filas)
w("**Bases recebidas (itens 218 a 223):** Vilarejo do Riacho, Floresta Sussurrante, Ruínas Encantadas, Montanha de Brasa e Minas Shopping estão guardadas em `arte/referencias/bases_cenarios/`, mas **precisam de ajuste** para virar chão: vieram com **1536×1024** (precisam do tamanho da tabela), **em perspectiva com céu e horizonte** (precisam ser vistas de cima) e **sem seguir o gabarito** (o riacho, as matas, os muros e a lava precisam estar onde a fase tem). A da **Gruta e Minas** (item 223) não veio.")
w()
w("### 8.2 Minas Shopping em peças")
w()
w("O playground já está pronto em peças. O shopping ainda usa a ilustração inteira até chegarem a **base em pé** (2160×3840: só o chão e o teto; a que veio é deitada, 1774×887), o **guia de posicionamento** (item 234) e as peças abaixo:")
w()
PECAS = ["SHOP_BURGER_KING", "SHOP_CONFEITARIA", "SHOP_VITRINE_BOLOS", "SHOP_CAFETERIA", "SHOP_ESCADA_ROLANTE", "SHOP_MEZANINO", "SHOP_PILAR", "SHOP_CORACAO_NEON",
         "SHOP_ARVORE_CANTEIRO", "SHOP_CANTEIRO_RETANGULAR", "SHOP_CANTEIRO_QUADRADO", "SHOP_CANTEIRO_CANTO", "SHOP_LANTERNA", "SHOP_LUMINARIA", "SHOP_MESA_REDONDA",
         "SHOP_VASO_MESA", "SHOP_BANDEJA_BK", "SHOP_POLTRONA_ROSA", "SHOP_CADEIRA_VERDE", "SHOP_SOFA_MEIA_LUA", "SHOP_PUFE", "SHOP_LIXEIRA", "SHOP_PLACA", "SHOP_BANCO_ESPERA"]
faltam = [p for p in PECAS if not any(existe(f"assets/cenario/{p.lower()}{suf}.webp") for suf in ("", "_frame_01", "_on", "_front"))]
chegaram = [p for p in PECAS if p not in faltam]
w("- **Já chegaram ✅:** " + (", ".join(f"`{p}`" for p in chegaram) or "nenhuma"))
w("- **Faltam ✏️:** " + ", ".join(f"`{p}`" for p in faltam))
w("- A poltrona rosa e a cadeira verde em **4 lados** (`_FRONT`, `_BACK`, `_LEFT`, `_RIGHT`); o coração neon `_ON` e `_OFF`.")
w()
w("### 8.3 Túnel")
w()
w("A ilustração do túnel (onde acontece o beijo) ainda é a do HTML do primeiro encontro: falta a **versão final em 2160×3840**, em peças como o playground (base vazia + lampiões, trepadeiras e corações de luz à parte).")
w()

# =====================================================================================
w("## 9. Ordem sugerida")
w()
for n, t in enumerate([
    "**Ataque nas quatro direções** (seção 2.1): é o que a jogadora mais sente jogando.",
    "**Pôr do sol, felizes e a dança** refeitas na proporção certa (seção 2.3).",
    "**Cenas do shopping** com 10 a 12 quadros (seção 2.2) e as peças do shopping com o guia (seção 8.2).",
    "**Ícones dos botões e do HUD** (seções 5 e 6) e os **ícones dos itens e das armaduras** (seção 4).",
    "**Telas** (seção 7), começando pelo título e pela mochila.",
    "**Bell jogável e armaduras vestidas** (seção 3).",
    "**Mapas das fases** em cima dos gabaritos (seção 8.1).",
    "**Chefes e moradores** da Parte 2 (seção 3).",
], 1):
    w(f"{n}. {t}")
w()

saida = os.path.join(DOCS, "LINE_E_BELL_PENDENCIAS.md")
open(saida, "w", encoding="utf-8").write("\n".join(linhas) + "\n")
print(saida, len(linhas), "linhas")
