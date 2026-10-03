#!/usr/bin/env python3
"""Seções 23 a 26 da documentação completa (tudo o que antes ficava em arquivos soltos).

- 23. O que falta criar (antes `ANIMACOES_PENDENTES.md`)
- 24. Índice dos itens de arte recebidos (antes `LINE_BELL_INDICE_PARTES.md`)
- 25. Plano de criação das animações por item (antes `LINE_BELL_PLANO_ANIMACOES_POR_ITEM.md`)
- 26. Como rodar, publicar e editar o jogo (antes `game/README.md`)

Chamado por `tools/gerar_documentacao.py`; não gera arquivo separado.
"""
import contextlib
import glob
import io
import json
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import extrair_sprites  # noqa: E402

SECOES = ["23. O que falta criar", "24. Índice dos itens de arte recebidos",
          "25. Plano de criação das animações por item", "26. Como rodar, publicar e editar o jogo"]


def numero(caminho):
    return int(re.search(r"(\d+)\.html$", caminho).group(1))


def vazia(u):
    return len(u.split(",", 1)[-1]) < 100


def conteudo(caminho):
    """Códigos do item (como vieram no arquivo) e quantas imagens vazias ele trouxe."""
    html = open(caminho, encoding="utf-8").read()
    m = re.search(r"const animations=(\{.*?\});\s*\n", html, re.S)
    if m and not m.group(1).startswith("{'"):
        a = json.loads(m.group(1))
        return list(a), sum(1 for v in a.values() for u in v["frames"] if vazia(u)), {}
    if "const animations={'" in html:
        # Itens 132 em diante: const animations={'CODIGO':['data:...', ...]}.
        bloco = html[html.index("const animations={'"):]
        bloco = bloco[:bloco.index("};")]
        codigos = re.findall(r"'([A-Z0-9_]+)':\[", bloco)
        return codigos, sum(1 for u in re.findall(r"'(data:[^']*)'", bloco) if vazia(u)), {}
    if 'const animations={"' in html:
        # Itens 137 a 139: const animations={"CODIGO":["data:...", ...]} (lista ou {frames}).
        i = html.index('const animations={"') + len("const animations=")
        a, _ = json.JSONDecoder().raw_decode(html[i:])
        quadros = [u for v in a.values() for u in (v if isinstance(v, list) else v.get("frames", []))]
        return list(a), sum(1 for u in quadros if isinstance(u, str) and vazia(u)), {}
    if "const payload=" not in html:
        # Itens de cenário e móveis (140 em diante): imagens soltas, sem animação.
        nomes = [re.sub(r"(_\d+x\d+)?\.[a-z]+$", "", n) for n in re.findall(r'data-name="([^"]+)"', html)]
        nomes = nomes or re.findall(r"<code>([A-Z0-9_]+)</code>", html)
        return list(dict.fromkeys(nomes)), 0, {}
    i = html.index("const payload=") + len("const payload=")
    p, _ = json.JSONDecoder().raw_decode(html[i:])
    vazias = {k for k, u in enumerate(p["images"]) if vazia(u)}
    afetadas = {cod: len(set(a["frames"]) & vazias) for cod, a in p["animations"].items() if set(a["frames"]) & vazias}
    return list(p["animations"]), len(vazias), afetadas


def manifesto():
    """Animações que estão no jogo hoje e de qual arquivo vieram (game/assets/sprites.js)."""
    t = open(os.path.join(RAIZ, "game", "assets", "sprites.js"), encoding="utf-8").read()
    return json.loads(t.split("window.SPRITES = ", 1)[1].split(";\nwindow.RETRATOS", 1)[0])


def itens_recebidos():
    """Lê todos os LINE_BELL_ITEM_*.html da raiz (demora uns segundos: são arquivos grandes)."""
    itens, jogo = [], manifesto()
    for c in sorted(glob.glob(os.path.join(RAIZ, "LINE_BELL_ITEM_*.html")), key=numero):
        n, nome = numero(c), os.path.basename(c)
        codigos, vazias, afetadas = conteudo(c)
        parados = []
        if n not in extrair_sprites.ITENS_CENARIO:
            with contextlib.redirect_stdout(io.StringIO()):
                anims = extrair_sprites.ler_animacoes(c)
            parados = [cod for cod, d in anims.items() if extrair_sprites.movimento_parado(cod, d)]
        # Parados que entraram antes da regra dos 3 quadros: estão no jogo, com pouco movimento.
        poucos = [cod for cod in parados if jogo.get(cod, {}).get("item") == nome]
        parados = [cod for cod in parados if cod not in poucos]
        recusados = [(cod, mot) for (arq, cod), mot in extrair_sprites.RECUSADAS.items() if arq == nome]
        itens.append({"n": n, "arquivo": nome, "mb": os.path.getsize(c) / 1048576, "codigos": codigos,
                      "vazias": vazias, "afetadas": afetadas, "parados": parados, "poucos": poucos,
                      "recusados": recusados, "no_jogo": jogo})
    return itens


PLANO = """### 25.1 Como os itens funcionarão

- Cada item corresponde a um arquivo HTML autossuficiente.
- Cada HTML deve ter no máximo 25 MB.
- Nenhuma animação pode ser dividida no meio apenas para caber no arquivo.
- Animações grandes ficam sozinhas em um item.
- Animações curtas só podem compartilhar um item quando pertencem ao mesmo bloco de movimento.
- Cada frame continua sendo produzido como PNG independente.
- A produção deve seguir uma animação por vez e um frame por vez.
- Só avançamos após assistir à animação lentamente, na velocidade normal, frame a frame e em loop.

### 25.2 Regra obrigatória para caminhada e corrida

Nas caminhadas e corridas laterais, a perna que está atrás deve iniciar o avanço, passar pela posição intermediária e terminar esticada à frente. Ao mesmo tempo, a outra perna transfere o peso, impulsiona o corpo e dobra para trás.

O ciclo precisa conter:

1. contato;
2. absorção do peso;
3. apoio;
4. passagem da perna traseira;
5. impulso;
6. elevação do pé;
7. avanço completo;
8. novo contato;
9. repetição equivalente com a outra perna.

Os braços trabalham de forma cruzada com as pernas. Cabelo, roupa, colar e tronco acompanham o movimento sem mudar a identidade da personagem.

### 25.3 Itens 1 a 14 — pacote básico da Line

| Item | Arquivo | Animações | Situação |
|---:|---|---|---|
| 1 | `LINE_BELL_ITEM_01.html` | `LINE_IDLE_FRONT` | Criado; revisar loop e estabilidade |
| 2 | `LINE_BELL_ITEM_02.html` | `LINE_LOOK_SIDES_FRONT` | Criado; revisar sutileza do rosto |
| 3 | `LINE_BELL_ITEM_03.html` | `LINE_BLINK_FRONT`, `LINE_IDLE_LEFT` | Criado; revisar rosto e perfil |
| 4 | `LINE_BELL_ITEM_04.html` | `LINE_IDLE_RIGHT`, `LINE_IDLE_BACK` | Criado; revisar perfis e costas |
| 5 | `LINE_BELL_ITEM_05.html` | `LINE_WALK_RIGHT` | Criado; aplicar e revisar regra das pernas |
| 6 | `LINE_BELL_ITEM_06.html` | `LINE_WALK_LEFT` | Criado; aplicar e revisar regra das pernas |
| 7 | `LINE_BELL_ITEM_07.html` | `LINE_WALK_FRONT`, `LINE_WALK_BACK` | Criado; revisar alternância e pés |
| 8 | `LINE_BELL_ITEM_08.html` | `LINE_RUN_START_RIGHT` | Criado; revisar transferência de peso |
| 9 | `LINE_BELL_ITEM_09.html` | `LINE_RUN_RIGHT` | Criado; aplicar e revisar regra das pernas |
| 10 | `LINE_BELL_ITEM_10.html` | `LINE_RUN_LEFT` | Criado; aplicar e revisar regra das pernas |
| 11 | `LINE_BELL_ITEM_11.html` | `LINE_RUN_FRONT`, `LINE_RUN_BACK` | Criado; revisar alternância e fase aérea |
| 12 | `LINE_BELL_ITEM_12.html` | `LINE_RUN_STOP_RIGHT`, `LINE_RUN_STOP_LEFT` | Criado; revisar frenagem e inércia |
| 13 | `LINE_BELL_ITEM_13.html` | `LINE_RUN_START_LEFT`, `LINE_RUN_START_FRONT`, `LINE_RUN_START_BACK`, `LINE_RUN_STOP_FRONT` | Criado; revisar transições |
| 14 | `LINE_BELL_ITEM_14.html` | `LINE_RUN_STOP_BACK` | Criado; revisar transição para idle |

### 25.4 Próximos itens — movimentos da Line

| Item | Animação | Código planejado | Observação principal |
|---:|---|---|---|
| 15 | Pular para a direita | `LINE_JUMP_RIGHT` | Criado: 12 frames com preparação, impulso, subida, ápice, descida, aterrissagem e recuperação |
| 16 | Aterrissar para a direita | `LINE_LAND_RIGHT` | Criado: 10 frames com descida, aproximação, contato, compressão e recuperação |
| 17 | Agachar | `LINE_CROUCH` | Criado: 10 frames com transferência gradual de peso e sustentação no agachamento profundo |
| 18 | Levantar do agachamento | `LINE_CROUCH_STAND` | Criado: 10 frames com retorno contínuo do agachamento profundo ao idle |
| 19 | Tropeçar | `LINE_STUMBLE` | Criado: 12 frames com perda gradual de equilíbrio e mãos buscando o chão |
| 20 | Cair | `LINE_FALL` | Criado: 12 frames conectados ao tropeço, com contato das mãos, descida aos antebraços e posição final no chão |
| 21 | Levantar do chão | `LINE_GROUND_STAND` | Criado: 14 frames com apoio nos antebraços, mãos e joelhos, agachamento e recuperação até o idle |

### 25.5 Combate da Line

| Item | Animação | Código planejado | Observação principal |
|---:|---|---|---|
| 22 | Sacar espada | `LINE_SWORD_DRAW` | Criado: 12 frames com mão no cabo, saque parcial, retirada completa e postura pronta |
| 23 | Guardar espada | `LINE_SWORD_SHEATHE` | Revisado: 14 frames com duas etapas adicionais da lâmina ainda visivelmente para fora do coldre |
| 24 | Postura de combate | `LINE_COMBAT_IDLE` | Criado: 16 frames em loop com respiração discreta, ajuste de peso e pés fixos |
| 25 | Ataque horizontal | `LINE_ATTACK_HORIZONTAL` | Criado: 16 frames com guarda, preparação, corte horizontal, extensão e recuperação |
| 26 | Ataque vertical | `LINE_ATTACK_VERTICAL` | Revisado: 18 frames com elevação, início, meio e fim do golpe descendente e recuperação gradual |
| 27 | Ataque diagonal | `LINE_ATTACK_DIAGONAL` | Revisado: 22 frames; as duas mãos permanecem fechadas no mesmo cabo e o arco diagonal recebeu novos intermediários |
| 28 | Combo | `LINE_ATTACK_COMBO` | Revisado: 22 frames com novos intermediários na preparação, no corte horizontal, no redirecionamento e no final descendente |
| 29 | Ataque giratório | `LINE_ATTACK_SPIN` | Criado: 18 frames com preparação, pivô, rotação corporal, corte circular e recuperação; espada e cabelo contínuos |
| 30 | Ataque aéreo | `LINE_ATTACK_AIR` | Criado: 20 frames com preparação, impulso, subida, ápice, golpe descendente, queda e aterrissagem |
| 31 | Bloquear | `LINE_BLOCK` | Criado: 16 frames com entrada da guarda, firmeza, impacto comprimido, recuo e saída |
| 32 | Esquivar | `LINE_DODGE` | Criado: 16 frames com antecipação, impulso lateral, evasão aérea, aterrissagem e recuperação |
| 33 | Dash | `LINE_DASH` | Corrigido: 16 frames; anatomia esquerda/direita revisada na guarda, arrancada e frenagem, com calçados espelhados corretamente |
| 34 | Receber dano leve | `LINE_HIT_LIGHT` | Corrigido: 16 frames; pernas e calçados diferenciados no contato, recuo, recuperação e retorno à guarda |
| 35 | Receber golpe forte | `LINE_HIT_HEAVY` | Refeito: 14 frames no pixel art dos itens 1–20, com impacto maior, recuo amplo, perda progressiva do apoio e ponte direta ao arremesso |
| 36 | Ser arremessada | `LINE_THROWN` | Refeito: 14 frames no pixel art dos itens 1–20, com saída do último apoio, subida, ápice, rotação e descida antes do impacto no chão |
| 37 | Cair após golpe | `LINE_KNOCKDOWN` | Refeito: 24 frames no pixel art dos itens 1–20, com descida, compressão do impacto, rebote, rotação e acomodação dolorida no chão |
| 38 | Levantar machucada | `LINE_INJURED_STAND` | Refeito: 28 frames no pixel art dos itens 1–20, com apoio dos braços, transferência de peso, ajoelhamento, subida e estabilização dolorida |
| 39 | Exausta | `LINE_EXHAUSTED_IDLE` | Refeito: 20 frames no pixel art dos itens 1–20, em loop com respiração, perda breve de força, recuperação, espada rígida e dedão para dentro |
| 40 | Ataque final contra o dragão | `LINE_DRAGON_FINAL_ATTACK` | Refeito: 32 frames no pixel art dos itens 1–20, com foco, arrancada, salto, golpe, passagem, aterrissagem, espada rígida e pegada corrigida |

### 25.6 Emoções da Line

| Item | Animação | Código planejado | Observação principal |
|---:|---|---|---|
| 41 | Feliz | `LINE_HAPPY` | Refeito: 20 frames no pixel art dos itens 1–20, com sorriso progressivo, gesto, impulso leve e retorno suave |
| 42 | Rindo | `LINE_LAUGH` | Refeito: 24 frames no pixel art dos itens 1–20, com início, dois pulsos de risada, pico, alívio e retorno sorrindo |
| 43 | Determinada | `LINE_DETERMINED` | Refeito: 20 frames no pixel art dos itens 1–20, com foco crescente, postura firme, avanço curto e retorno controlado |
| 44 | Brava | `LINE_ANGRY` | Refeito: 20 frames no pixel art dos itens 1–20, com irritação crescente, punhos fechados, explosão curta e retorno tenso |
| 45 | Assustada | `LINE_SCARED` | Concluída: 20 frames em pixel art alinhada aos itens 1–20 |
| 46 | Triste | `LINE_SAD` | Concluída: 20 frames em pixel art alinhada aos itens 1–20 |
| 47 | Chorando | `LINE_CRY` | |
| 48 | Gritando por Bell | `LINE_CALL_BELL` | |
| 49 | Aliviada | `LINE_RELIEVED` | |

### 25.7 Pacote da Bell

| Item | Animações | Códigos planejados |
|---:|---|---|
| 50 | Idle frontal, piscar e olhar para os lados | `BELL_IDLE_FRONT`, `BELL_BLINK_FRONT`, `BELL_LOOK_SIDES_FRONT` |
| 51 | Idle esquerda, direita e costas | `BELL_IDLE_LEFT`, `BELL_IDLE_RIGHT`, `BELL_IDLE_BACK` |
| 52 | Caminhar para a direita | `BELL_WALK_RIGHT` |
| 53 | Caminhar para a esquerda | `BELL_WALK_LEFT` |
| 54 | Caminhar para frente e costas | `BELL_WALK_FRONT`, `BELL_WALK_BACK` |
| 55 | Correr para a direita | `BELL_RUN_RIGHT` |
| 56 | Correr para a esquerda | `BELL_RUN_LEFT` |
| 57 | Correr para frente e costas | `BELL_RUN_FRONT`, `BELL_RUN_BACK` |
| 58 | Pular, aterrissar e levantar | `BELL_JUMP`, `BELL_LAND`, `BELL_GROUND_STAND` |
| 59 | Assustada e fugir | `BELL_SCARED`, `BELL_FLEE` |
| 60 | Cair | `BELL_FALL` |
| 61 | Ser capturada | `BELL_CAPTURED` |
| 62 | Ser carregada pelo dragão | `BELL_DRAGON_CARRIED` |
| 63 | Presa e tentar escapar | `BELL_TRAPPED`, `BELL_ESCAPE_ATTEMPT` |
| 64 | Conseguir se libertar | `BELL_BREAK_FREE` |
| 65 | Chamar Line | `BELL_CALL_LINE` |
| 66 | Ajudar Line | `BELL_HELP_LINE` |
| 67 | Feliz, aliviada e chorando | `BELL_HAPPY`, `BELL_RELIEVED`, `BELL_CRY` |

### 25.8 Interações entre Line e Bell

| Item | Animações | Códigos planejados |
|---:|---|---|
| 68 | Andando lado a lado | `LINE_BELL_WALK_TOGETHER` |
| 69 | Andando de mãos dadas | `LINE_BELL_WALK_HANDS` |
| 70 | Correndo juntas | `LINE_BELL_RUN_TOGETHER` |
| 71 | Conversando e rindo juntas | `LINE_BELL_TALK`, `LINE_BELL_LAUGH` |
| 72 | Bell encostando na Line | `BELL_LEAN_ON_LINE` |
| 73 | Segurando as mãos | `LINE_BELL_HOLD_HANDS` |
| 74 | Abraço do resgate | `LINE_BELL_RESCUE_HUG` |
| 75 | Separação do abraço | `LINE_BELL_HUG_RELEASE` |
| 76 | Comemorando a vitória | `LINE_BELL_CELEBRATE` |
| 77 | Sentando juntas | `LINE_BELL_SIT_DOWN` |
| 78 | Bell apoiando a cabeça na Line | `BELL_HEAD_ON_LINE` |
| 79 | Idle das duas sentadas | `LINE_BELL_SIT_IDLE` |

### 25.9 Dragão

| Item | Animações | Códigos planejados |
|---:|---|---|
| 80 | Idle, respiração e piscar | `DRAGON_IDLE`, `DRAGON_BLINK` |
| 81 | Andar e virar | `DRAGON_WALK`, `DRAGON_TURN` |
| 82 | Abrir asas e decolar | `DRAGON_WINGS_OPEN`, `DRAGON_TAKEOFF` |
| 83 | Voar e planar | `DRAGON_FLY`, `DRAGON_GLIDE` |
| 84 | Pousar | `DRAGON_LAND` |
| 85 | Rugir | `DRAGON_ROAR` |
| 86 | Morder | `DRAGON_BITE` |
| 87 | Ataque de garra | `DRAGON_CLAW_ATTACK` |
| 88 | Golpe de cauda | `DRAGON_TAIL_ATTACK` |
| 89 | Preparar e cuspir fogo | `DRAGON_FIRE_CHARGE`, `DRAGON_FIRE_BREATH` |
| 90 | Fogo contínuo | `DRAGON_FIRE_STREAM` |
| 91 | Ataque aéreo | `DRAGON_AIR_ATTACK` |
| 92 | Receber dano e ponto fraco atingido | `DRAGON_HIT`, `DRAGON_WEAK_POINT_HIT` |
| 93 | Atordoado | `DRAGON_STUNNED` |
| 94 | Ataque desesperado | `DRAGON_DESPERATE_ATTACK` |
| 95 | Receber golpe final | `DRAGON_FINAL_HIT` |
| 96 | Cair e ficar derrotado | `DRAGON_FALL`, `DRAGON_DEFEATED` |
| 97 | Abrir um olho no final | `DRAGON_EYE_OPEN_END` |

### 25.10 Efeitos independentes

| Item | Efeitos | Códigos planejados |
|---:|---|---|
| 98 | Fogo, brasas e iluminação | `FX_FIRE`, `FX_EMBERS`, `FX_FIRE_LIGHT` |
| 99 | Fumaça e poeira | `FX_SMOKE`, `FX_DUST` |
| 100 | Impacto, faíscas e explosão | `FX_IMPACT`, `FX_SPARKS`, `FX_EXPLOSION` |
| 101 | Rastro da espada e ponto fraco | `FX_SWORD_TRAIL`, `FX_DRAGON_WEAK_POINT` |
| 102 | Lágrimas, corações e partículas ambientais | `FX_TEARS`, `FX_HEARTS`, `FX_AMBIENT_PARTICLES` |

### 25.11 Ordem real de execução a partir de agora

1. Revisar os itens 5, 6, 9 e 10 como um conjunto, corrigindo a alternância completa das pernas.
2. Revisar os itens 7 e 11 nas direções frente e costas.
3. Revisar as transições de começar e parar de correr nos itens 8, 12, 13 e 14.
4. Fazer uma revisão final dos itens 1 a 4.
5. Item 15 concluído e pronto para aprovação.
6. Item 16 concluído e pronto para aprovação.
7. Item 17 concluído e pronto para aprovação.
8. Item 18 concluído e pronto para aprovação.
9. Item 19 concluído e pronto para aprovação.
10. Item 20 concluído e pronto para aprovação.
11. Item 21 concluído e pronto para aprovação.
12. Item 22 concluído e pronto para aprovação.
13. Item 23 concluído e pronto para aprovação.
14. Item 24 concluído e pronto para aprovação.
15. Item 25 concluído e pronto para aprovação.
16. Item 26 concluído e pronto para aprovação.
17. Item 27 concluído e pronto para aprovação.
18. Item 28 concluído e pronto para aprovação.
19. Item 29 concluído e pronto para aprovação.
20. Item 30 concluído e pronto para aprovação.
21. Item 31 concluído e pronto para aprovação.
22. Item 32 concluído e pronto para aprovação.
23. Item 33 concluído e pronto para aprovação.
24. Item 34 concluído e pronto para aprovação.
25. Item 35 concluído e pronto para aprovação.
26. Item 36 concluído e pronto para aprovação.
27. Item 37 concluído e pronto para aprovação.
28. Item 38 concluído e pronto para aprovação.
29. Item 39 concluído e pronto para aprovação.
30. Item 40 concluído e pronto para aprovação.
31. Item 45 concluído com 20 frames e retomada do visual pixel art dos itens 1 a 20.
32. Item 46 concluído com 20 frames e retomada do visual pixel art dos itens 1 a 20.

### 25.12 Regra para alteração futura dos itens

Se um HTML ultrapassar 25 MB, o item deve ser desmembrado antes de iniciar os seguintes. A numeração posterior será deslocada e este documento deverá ser atualizado imediatamente. Nenhuma animação já aprovada será comprimida, reduzida ou cortada apenas para preservar a numeração antiga.
"""


LEGENDA = [
    ("Chão e natureza", "`.` grama · `,` mato alto · `F` flores · `:` caminho · `r` raízes (correr derruba) · `T` árvore · `R` pedra · `X` espinheiro (corta com a espada) · `w` riacho (dá para pular) · `~` água funda · `u` lama (deixa lenta)"),
    ("Fazenda", "`H` casa · `D` porta · `B` celeiro · `K` galinheiro · `f` cerca · `h`/`c` horta · `P` poço · `M` moinho · `n` feno · `k` casinha do Theo · `m` mesa · `v` varal"),
    ("Vilarejo", "`b` barraca da feira · `W` bigorna da ferraria"),
    ("Caverna, gruta e minas", "`#` parede · `_` chão · `o` estalagmite · `q` cogumelo luminoso · `%` parede ou pedra rachada (bomba) · `E` estação do carrinho · `=` trilho"),
    ("Ruínas e montanha", "`Q` cristal · `Y` tocha · `U` fonte · `Z` barreira · `A` altar · `I` pilar · `L` lava · `l` brasa rasa (queima sem a Armadura de Brasa) · `j` fenda (nos picos, abismo de céu) · `p` poste do gancho"),
    ("Objetos", "`C` baú · `S` placa · `g` porta trancada (chave antiga)"),
    ("Parte 2", "`>` `<` corrente de vento (empurra para o lado)"),
]


def fica(item, codigos):
    """O que o jogo usa no lugar das animações que ficaram de fora."""
    if all(c in item["no_jogo"] for c in codigos):
        return "O jogo segue com a versão anterior."
    return "O jogo usa a substituta (seção 23.3) até chegar a arte certa."


def escrever(w, inv, itens=None):
    itens = itens if itens is not None else itens_recebidos()
    grupos = inv["grupos"]
    tot = sum(len(g["itens"]) for g in grupos)
    prontas = sum(i["existe"] for g in grupos for i in g["itens"])
    subst = sum(1 for g in grupos for i in g["itens"] if not i["existe"] and i["via"])
    numeros = [i["n"] for i in itens]
    faltam = [n for n in range(1, max(numeros) + 1) if n not in numeros] if numeros else []

    # ============================ 23 ============================
    w("## 23. O que falta criar")
    w()
    w("> Esta seção junta o que antes ficava em arquivos soltos (`ANIMACOES_PENDENTES.md`, `LINE_BELL_INDICE_PARTES.md`, `LINE_BELL_PLANO_ANIMACOES_POR_ITEM.md`, `docs/ARTES_NECESSARIAS.md`, `arte/theo/LAYOUT_OFICIAL.md` e `game/README.md`). Agora **tudo fica só neste documento**: o que falta está aqui, o índice dos itens na seção 24, o plano por item na 25, como rodar e editar o jogo na 26, a lista completa de arte na 22 e o layout oficial do Theo na 2.")
    w()
    w(f"**Status:** {prontas} de {tot} animações com arte · {subst} usando uma substituta · {tot - prontas - subst} desenhadas no código. A lista com todas, e o status de cada uma, está na seção 10 e no próprio jogo, em **Menu → Animações**. Toda a arte atual é temporária até a criação completa.")
    w()
    w("### 23.1 Reenviar ou mandar")
    w()
    linhas = []
    for i in itens:
        if i["vazias"]:
            onde = (" em " + ", ".join(f"`{c}`" for c in i["afetadas"])) if i["afetadas"] else ""
            linhas.append(f"- **Item {i['n']}**: chegou com {i['vazias']} imagem(ns) vazia(s){onde}. As animações funcionam sem esses quadros, mas ficam incompletas.")
        if i["parados"]:
            linhas.append(f"- **Item {i['n']}**: " + ", ".join(f"`{c}`" for c in i["parados"]) + (" vieram com todos os quadros iguais (parados) e ficaram" if len(i["parados"]) > 1 else " veio com todos os quadros iguais (parado) e ficou") + " de fora. " + fica(i, i["parados"]))
        if i["poucos"]:
            linhas.append(f"- **Item {i['n']}**: " + ", ".join(f"`{c}`" for c in i["poucos"]) + (" estão" if len(i["poucos"]) > 1 else " está") + " no jogo, mas com só 2 quadros diferentes (quase sem movimento). Vale reenviar com o ciclo completo.")
        for cod, mot in i["recusados"]:
            linhas.append(f"- **Item {i['n']}**: `{cod}` foi recusado: {mot}. " + fica(i, [cod]))
    refeitas = sorted(extrair_sprites.PERNAS_ALTERNADAS)
    if refeitas:
        linhas.append("- **Pernas paradas:** " + ", ".join(f"`{c}`" for c in refeitas) + " chegaram com as duas pernas quase na mesma posição em todos os quadros (só o corpo balança), e a galinha parecia deslizar. O jogo refaz as pernas girando no quadril, uma depois da outra, e casa o passo com o chão percorrido. Vale reenviar com o ciclo de passos desenhado.")
    if "BELL_DRAGON_CARRIED" in manifesto():
        linhas.append("- **Item 62**: `BELL_DRAGON_CARRIED` traz o dragão vermelho antigo desenhado junto com a Bell; no rapto, com o dragão do jogo, apareciam dois dragões. O jogo não usa mais essa arte (a Bell fica pendurada nas garras com `BELL_ESCAPE_ATTEMPT`). Para reenviar: só a Bell pendurada, de braços para cima, sem dragão.")
    for codigo, motivo in extrair_sprites.DESCARTADAS.items():
        linhas.append(f"- `{codigo}` saiu do jogo: {motivo}. Para reenviar.")
    linhas.append("- **Item 140 (Minas Shopping), em peças:** o jogo precisa de uma base **só com o chão e o teto** e de cada móvel, loja e enfeite como **arte individual** (lista completa na seção 22.11.1). Enquanto isso, no lanche do BK o jogo usa uma cópia do fundo sem a mesa redonda do meio.")
    linhas.append("- `LINE_BELL_WALK_HANDS_FRONT` (as duas de mãos dadas andando de frente) ainda é a arte pequena do laboratório, ampliada: fica borrada perto das outras. Para reenviar no tamanho e no traço dos itens novos.")
    if faltam:
        linhas.append(f"- **Itens que ainda não chegaram:** {', '.join(map(str, faltam))}.")
    for l in linhas or ["Nada para reenviar agora."]:
        w(l)
    w()
    w("### 23.5 Anotações do teste no celular (1º de outubro)")
    w()
    w("O que apareceu jogando no celular, o que foi feito e o que ainda depende de arte:")
    w()
    w("| # | O que aconteceu | O que foi feito | Falta |")
    w("|---|---|---|---|")
    for linha in [
        ("1", "Perto do Mago, ao pegar a espada, a Line fazia um movimento estranho e parecia cair.", "A arte de “Feliz” (`LINE_HAPPY`, item 41) é, na verdade, uma corrida que termina com a Line caída para a frente. Ela saiu do jogo; no lugar entra a comemoração (`LINE_VICTORY`).", "Reenviar `LINE_HAPPY`: a Line parada, feliz, sorrindo, sem sair do lugar."),
        ("2", "Andando de mãos dadas até o lago, Line e Bell ficavam minúsculas.", "De frente, o par usa a arte antiga do laboratório (`LINE_BELL_WALK_HANDS_FRONT`), muito pequena dentro do quadro: ela foi ampliada para a Line do par ficar da altura da Line sozinha. A dança do pôr do sol (`LINE_BELL_DANCE`) também estava pequena e foi igualada.", "Reenviar `LINE_BELL_WALK_HANDS_FRONT` no traço dos itens novos (a ampliada fica borrada)."),
        ("3", "Andando até a casinha do Theo, a casa da fazenda sumia do terreno.", "O jogo deixava de desenhar objetos cujo canto esquerdo saía da tela, e a casa é larga. Agora a folga leva em conta a largura e a altura de cada objeto (casa, celeiro).", "—"),
        ("4", "No shopping, as duas apareciam sentadas numa mesa gigante em cima da mesa.", "A animação do BK já traz a mesa delas, e o fundo do shopping (item 140) tem uma mesa redonda desenhada no mesmo lugar. No lanche, o jogo troca para uma cópia do fundo sem a mesa redonda e as cadeiras (`tools/shopping_sem_mesa.py`).", "Shopping em peças: base só com chão e teto e cada item em arte individual (seção 22.11.1)."),
    ]:
        w("| " + " | ".join(linha) + " |")
    w()
    w("### 23.6 Revisão geral de design (2 de outubro)")
    w()
    w("Revisão do jogo inteiro como designer e engenheira: tamanho de cada arte, organização de cada mapa, moradores, botões e biblioteca.")
    w()
    w("**1. Régua de tamanhos.** Todo objeto e móvel tem uma medida real em `tools/extrair_objetos.py` (`MEDIDAS`): altura em metros ou, para o que fica deitado ou é visto em profundidade (cama, mesa, cocho, tapete), largura. A Line tem 1,60 m e 62 unidades de altura; os objetos usam 15% a mais para ficarem legíveis, e nada fica com menos de 12 unidades de largura. A largura no mundo sai da medida × a proporção da imagem e vai para `LB.LARGURA_OBJETOS` (`game/js/objetos.js`). Nas listas `moveis` dos mapas, largura `0` quer dizer \"pela régua\". Prédios (casas, celeiro) seguem a escala da arte oficial da fazenda, um pouco compacta, como é comum em jogos de fazenda em pixel art. Ajustes feitos com a régua: postes de lampião, espantalho, treliça, roda de carroça, silo, taboas, sela, mesa da sala, cama, poltronas e pia ficaram no tamanho certo em relação à Line.")
    w()
    w("**2. Cada mapa organizado por zonas** (nada encosta nos caminhos de terra; objetos grandes ocupam o chão e a Line contorna):")
    w()
    w("| Mapa | Zonas |")
    w("|---|---|")
    for zona in [
        ("Fazenda", "(refeita em 3/10 para desafogar as passagens) entrada norte com arco e placa · casa (lenha, caixa de correio, varanda com sapateira, galochas, cadeira de balanço e sino, capacho) · colmeia com mel e fumigador · jardim da frente (bancada de mudas, floreiras, banho e casinha de passarinho) · varal com cesto de prendedores · galinheiro (ninho, ovos, comedouro, bebedouro) · faixa de trabalho da horta (ferramentas, sementes, poço, regador, mangueira, treliça) · horta com espantalho e colheita · celeiro (composteira, barril, roda, ferraduras, latão, silo, cata-vento) · pasto (canto do cavalo, canto das vacas, bebedouro e sal, tosquia) · lago (banco, fogueira, taboas, vitórias-régias, píer) · postes de lampião nos caminhos · dragão da Parte 2 dormindo no gramado ao sul do pasto (antes ficava em cima do celeiro)"),
        ("Vilarejo", "praça com fonte, postes nas quatro esquinas, dois bancos virados para a fonte e floreiras · feira na frente da loja (barracas, frutas, abóboras, caixotes, carrinho de flores) · ferraria (lenha, barril, ferradura, balde, bigorna, feno) · casas com caixa de correio e capacho · placa de boas-vindas na entrada oeste · taboas na beira do riacho"),
        ("Interiores", "corredor livre da porta até o meio; cada cômodo num canto; móveis encostados nas paredes; luminária sobre a mesa; a loja e a ferraria com balcão no meio"),
        ("Floresta, vale e lago", "casas em pixel art; lenha e ferramentas na cabana do caçador; cesto, regador e sementes na horta da Dona Cora; corda e caixote do pescador Tião; pontezinha no riacho do lago"),
    ]:
        w(f"| {zona[0]} | {zona[1]} |")
    w()
    w("**3. Moradores.** Quem trabalha numa casa fica **dentro dela**: a Dona Rosa atrás do balcão da loja e o Seu Bento atrás do balcão da ferraria. Para falar com eles, a Line entra e para na frente do balcão. À noite as lojas fecham (a porta mostra \"Loja fechada\"). No mapa da mochila, o ícone da loja fica na porta. Os outros moradores (Zé, Lurdes, Pedrinho, Cora, Tião, Brisa, Tobias) ficam na rua, longe das portas.")
    w()
    w("**4. Casas em pixel art.** As casas do vilarejo, a cabana da floresta, a casa da Cora e a do Tião usam a casa da fazenda em pixel art, cada uma com uma cor de telhado (`tools/variantes_casa.py`: roxo na loja, azul na ferraria, verde, mostarda, vermelho e marrom-escuro na cabana). A porta da imagem cai exatamente na porta do mapa, e a colisão de cada casa foi refeita no tamanho da arte.")
    w()
    w("**5. Botões do celular.** Ficam num arco em volta do ⚔: pular à esquerda, magia na diagonal, esquivar em cima; defender no arco de fora; o item do atalho e a troca de heroína no topo do arco; o botão de interagir acima de todos (seção 8.1).")
    w()
    w("**6. Biblioteca limpa.** Saíram as pastas de `arte/` cuja arte já veio nos itens (vaca, cavalo, porco, galinhas, Theo, dragão antigo, Bell e casal antigos: 88 pastas), as referências do dragão antigo, 9 imagens de cenário sem uso (arbustos, cachoeira, fases de milho e trigo, pedra) e 11 fotos antigas da documentação. As fotos dos mapas, da fazenda, do vilarejo, das lojas e dos interiores foram refeitas. As regras (pernas, tamanho pela cabeça, ritmo, layout do Theo, medidas do Minas Shopping) continuam.")
    w()
    w("**7. Arte que ainda falta, mapa por mapa** (hoje desenhada no código):")
    w()
    w("| Mapa | O que ainda é desenhado no código |")
    w("|---|---|")
    for linha in [
        ("Todos", "os moradores (Rosa, Bento, Zé, Lurdes, Pedrinho, Tobias, Cora, Tião, Brisa) em todas as poses; a fonte da praça e a fonte das fases; placas; baús; corações e moedas no chão"),
        ("Vilarejo", "chão em tiles (grama e terra), poço, barracas da feira, bigorna, estação e trilhos do carrinho, riacho"),
        ("Floresta", "chão em tiles, raízes, espinhos, riacho, pedra rachada, postes do gancho, lago com ilha"),
        ("Gruta e Minas", "paredes e chão, cogumelos luminosos, cristais, portas trancadas, paredes rachadas, abismo"),
        ("Ruínas", "paredes, pilares, cristais, barreiras de luz, altar, lagos"),
        ("Montanha e Covil", "rocha, lava, brasa, tochas, portão de fogo, jaula"),
        ("Parte 2 (sete fases)", "chão de cada fase (lama, vento, abismo de céu, chuva), cristais de terra, pérolas, faróis, ninho do Grifo; os sete chefes"),
        ("Minas Shopping", "o pedido em peças (seção 22.11.1)"),
    ]:
        w(f"| {linha[0]} | {linha[1]} |")
    w()
    w("### 23.2 Animações com poucos quadros diferentes")
    w()
    w("O jogo já toca cada animação no ritmo certo (andar e correr no mesmo passo para a Line, a Bell e as duas juntas; cenas e emoções no fps da artista, sem passar de 12 quadros por segundo). Mas estas têm **4 desenhos diferentes ou menos** e repetem quadros, então o movimento fica \"picado\". Vale reenviar com o ciclo completo (8 a 12 desenhos diferentes):")
    w()
    w("| Personagem | Animações (desenhos diferentes) |")
    w("|---|---|")
    poucos = {}
    for cod, sp in sorted(manifesto().items()):
        if cod.startswith(("LINE_", "BELL_")) and sp.get("count", 99) <= 4 and not sp.get("mundo"):
            quem = "Line e Bell juntas" if cod.startswith("LINE_BELL_") else ("Line" if cod.startswith("LINE_") else "Bell")
            poucos.setdefault(quem, []).append(f"`{cod}` ({sp['count']})")
    for quem in ("Line", "Bell", "Line e Bell juntas"):
        if quem in poucos:
            w(f"| {quem} | {', '.join(poucos[quem])} |")
    w()
    w("### 23.3 Animações ainda sem arte")
    w()
    w("| Grupo | Código | O que é | Hoje usa |")
    w("|---|---|---|---|")
    for g in grupos:
        for i in g["itens"]:
            if i["existe"]:
                continue
            desc = (i.get("desc") or "").replace("|", "/")
            w(f"| {g['nome']} | `{i['codigo']}` | {desc} | {('`' + i['via'] + '`') if i['via'] else 'desenho no código'} |")
    w()
    w("### 23.4 Como mandar arte nova")
    w()
    w("Qualquer um destes formatos funciona (detalhes e regras de desenho na seção 14; tamanhos na seção 22.0):")
    w()
    w("1. **HTML de item** (`LINE_BELL_ITEM_NN.html`), nos formatos já usados: `const animations` (PNG por quadro, em JSON ou com aspas simples) ou `const payload` (lista de imagens e, para cada animação, a ordem dos quadros, o fps e uma descrição). Quadros 1254×1254 com fundo transparente.")
    w("2. **HTML de laboratório** (`*LABORATORIO*.html`).")
    w("3. **Pasta em `arte/`**: `arte/<grupo>/<CODIGO>/00.png, 01.png…` com um `config.json` (`{\"unidades_por_px\": 0.62}`).")
    w()
    w("Depois, `python3 tools/extrair_sprites.py` (ou `--apenas 138,139` para só alguns itens) gera as folhas e registra tudo no jogo. O código de cada animação precisa ser **exatamente** o da lista. Animações de lado podem vir só viradas para a **direita**: o jogo espelha. O tamanho de cada personagem é igualado sozinho entre as animações. Animações de andar e correr com menos de 3 quadros diferentes são recusadas sozinhas, e a anterior fica.")
    w()
    w("**Theo:** a arte que está no jogo é o **layout oficial** para a arte final: só melhorar, sem perder os traços (lista completa na seção 2).")
    w()

    # ============================ 24 ============================
    w("## 24. Índice dos itens de arte recebidos")
    w()
    w("Cada item é um HTML autossuficiente na raiz do repositório, com menos de 25 MB e com animações completas: nenhuma animação é dividida entre arquivos. A tabela é gerada lendo os próprios arquivos.")
    w()
    w("| Item | Arquivo | Tamanho | Animações incluídas |")
    w("|---:|---|---:|---|")
    for i in itens:
        mb = f"{i['mb']:.2f}".replace(".", ",")
        avisos = []
        if i["vazias"]:
            avisos.append(f"⚠️ {i['vazias']} imagem(ns) vazia(s): reenviar")
        if i["parados"]:
            avisos.append("⚠️ " + ", ".join(f"`{c}`" for c in i["parados"]) + " parado(s): reenviar")
        if i["poucos"]:
            avisos.append("↻ " + ", ".join(f"`{c}`" for c in i["poucos"]) + " com pouco movimento")
        for cod, _ in i["recusados"]:
            avisos.append(f"⚠️ `{cod}` recusado: reenviar")
        if i["n"] in extrair_sprites.ITENS_CENARIO:
            avisos.append(f"🏙️ cenário ({extrair_sprites.ITENS_CENARIO[i['n']]}), fora do recorte de animação")
        w(f"| {i['n']} | `{i['arquivo']}` | {mb} MB | " + ", ".join(f"`{k}`" for k in i["codigos"]) + (" " + " · ".join(avisos) if avisos else "") + " |")
    w()
    if faltam:
        w(f"Itens que ainda não chegaram: {', '.join(map(str, faltam))}.")
        w()
    w(f"Os itens 140 a 227 são cenário, móveis e objetos: não passam pelo recorte de animação e entram no jogo pelas ferramentas da seção 26.6. O item 137 reenviado (ovelha) foi recusado e o jogo segue com a ovelha anterior. O item 153 não veio (os lotes foram de 154 a 187, 188 a 202, 203 a 217 e 218 a 227).")
    w()
    w("**Regra de continuidade das pernas:** nas caminhadas e corridas laterais para a direita e para a esquerda, a perna que está atrás deve iniciar o avanço, passar pela posição intermediária e terminar esticada à frente, enquanto a outra perna dobra para trás. Essa alternância deve permanecer contínua entre os frames, sem travar a perna traseira (ciclo completo na seção 25.2).")
    w()

    # ============================ 25 ============================
    w("## 25. Plano de criação das animações por item")
    w()
    w("> Plano original de produção, quadro a quadro. Os números dos itens depois do 102 (Parte 2, bichos, Mago, Espírito, Theo e cenários) seguem a lista da seção 22 e o índice da seção 24.")
    w()
    for l in PLANO.rstrip("\n").split("\n"):
        w(l)
    w()

    # ============================ 26 ============================
    w("## 26. Como rodar, publicar e editar o jogo")
    w()
    w("### 26.1 Rodar no computador")
    w()
    w("O jogo não precisa de instalação. Qualquer servidor simples serve:")
    w()
    w("```bash")
    w("cd game")
    w("python3 -m http.server 8000")
    w("# abra http://localhost:8000")
    w("```")
    w()
    w("### 26.2 Publicar")
    w()
    w("A pasta `game/` é publicada na Vercel: **https://line-e-bell.vercel.app**. Também dá para publicar a mesma pasta no GitHub Pages ou no Netlify e jogar pelo link, inclusive no celular (de preferência na horizontal).")
    w()
    w("O progresso fica salvo no navegador ao entrar em cada área, e o botão **Continuar** retoma dali. Os controles de teclado, controle e celular estão na seção 8.1.")
    w()
    w("### 26.3 Editar os mapas")
    w()
    w("Os mapas ficam em `game/js/mapas.js`, como texto: cada letra é um tile de 32 unidades do mundo. As medidas de cada mapa e o tamanho da arte de cenário estão na seção 22.12.")
    w()
    w("| Tipo | Letras |")
    w("|---|---|")
    for a, b in LEGENDA:
        w(f"| {a} | {b} |")
    w()
    w("### 26.4 Como a arte nova entra no jogo")
    w()
    w("1. Coloque o HTML novo na raiz do repositório (`*_ITEM_*.html` ou `*LABORATORIO*.html`) ou crie uma pasta `arte/<grupo>/<CODIGO>/` com os PNGs e um `config.json`.")
    w("2. Rode, na raiz: `pip install pillow` e `python3 tools/extrair_sprites.py`.")
    w("3. O script gera `game/assets/sprites/<CODIGO>.webp` e atualiza `game/assets/sprites.js`. Toda animação cujo código esteja no catálogo (`game/js/animacoes.js`) passa a aparecer no lugar do desenho provisório.")
    w()
    w("No menu, a tela **Animações** mostra o que já existe, o que falta e uma prévia de cada uma. A organização dos arquivos do código e os testes automatizados estão na seção 15.")
    w()
    w("### 26.5 Tamanho e ritmo iguais em todas as animações")
    w()
    w("- **Tamanho:** o extrator iguala a altura de cada animação à da pose parada. Nas poses inclinadas, agachadas ou sentadas, isso deixava a Line e a Bell com a cabeça maior ou menor. Por isso cada animação também tem um **ajuste pela cabeça**: `tools/medir_cabecas.py` compara a cabeça de cada animação com a das poses paradas (em vários tamanhos e inclinações), e o fator conferido a olho vai para `tools/ajuste_cabeca.json`. O jogo multiplica a escala por esse fator (campo `ajuste` em `sprites.js`).")
    w("- **Ritmo:** andar (~1,1 s por passo) e correr (~0,8 s) têm o mesmo ciclo para a Line, a Bell e as duas juntas, tenha a arte quantos quadros tiver. Golpes, pulos, magias, esquivas e o dragão seguem o tempo do jogo. As cenas e emoções usam o fps que a artista mandou e nunca passam de 12 quadros por segundo.")
    w()
    w("### 26.6 Cenário em imagem, móveis e casas por dentro")
    w()
    w("- **Mapa com imagem de base:** um mapa pode ter `base` (o nome de uma imagem do catálogo, 2 px por unidade do mundo, 64 px por tile). O jogo desenha essa imagem no lugar dos tiles do chão; o texto do mapa continua valendo para colisão, saídas e objetos. Com `sobreBase`, as letras listadas (na fazenda, `u`, o mato alto) ainda são desenhadas por cima da imagem. A fazenda usa o terreno oficial (item 144) e a casa da fazenda usa a planta do item 145.")
    w("- **Móveis:** cada mapa pode ter uma lista `moveis` com `[nome, x, y, largura, pegada, alto, espelhar]`. O móvel vira um objeto desenhado por profundidade (a Line passa na frente e atrás), e a `pegada` (em tiles) vira chão sólido. As imagens ficam em `game/assets/moveis/` (itens 148 a 152, na resolução original) e os objetos da fazenda (casinha do Theo, tigela cheia e vazia, varal, mesa de piquenique, cerca, porteira, flores e mato, itens 146 e 147) em `game/assets/cenario/`.")
    w("- **Portas (`entradas`):** perto de uma porta aparece **Entrar**. Colada na porta, ela ganha da conversa com quem está de frente (Dona Rosa, Seu Bento); um bilhete ainda não lido na porta vem antes (cabana do caçador). Para sair, basta descer pelo caminho de pedra. A Bell, se estiver acompanhando, entra junto.")
    w("- **Régua de tamanhos:** a largura de cada objeto vem da medida real em `MEDIDAS` (`tools/extrair_objetos.py`); depois de mudar uma medida, rode `python3 tools/extrair_objetos.py --so-medidas`. Nas listas `moveis`, largura `0` usa a régua (seção 23.6).")
    w("- **Objetos avulsos (itens 146 a 227):** `python3 tools/extrair_objetos.py LINE_BELL_ITEM_NNN.html ...` lê as imagens de cada item (`data-name`), recorta no contorno, mantém a resolução original e grava `game/assets/moveis/farmhouse_*.webp` (casa) ou `game/assets/cenario/farm_*.webp` (fazenda). A lista vai para `game/js/objetos.js`, e qualquer mapa pode usar o objeto pelo nome em `moveis`. Peças com versão de dia e de noite (`_off`/`_on`, `_day`/`_night`) trocam sozinhas: lareira, luminárias, arandelas, janela e fogueira acendem à noite; a porta do corredor abre quando a Line chega perto.")
    w("- **Interiores das outras casas:** `python3 tools/gerar_interiores.py` monta o interior de cada casa com pedaços da planta da casa da fazenda (parede do fundo, janelas, vigas, piso de madeira, terracota, azulejo ou lajota, base de pedra e porta com degraus). Ele grava `game/assets/cenario/base_<casa>.webp` e `game/js/interiores_gerados.js` (colisão e saída). As portas e os móveis de cada casa ficam em `game/js/interiores.js`.")
    w()
    w("### 26.7 Como regerar esta documentação")
    w()
    w("Com o jogo servido na porta 8765 (`cd game && python3 -m http.server 8765`), na raiz:")
    w()
    w("```bash")
    w("node tools/exportar_inventario.js inventario.json   # animações, mapas, baús, itens, documentos, loja, chefes")
    w("python3 tools/extrair_roteiro.py roteiro.json        # falas e cenas")
    w("python3 tools/gabaritos_mapas.py                     # plantas de cada mapa (seção 22.12)")
    w("python3 tools/gerar_documentacao.py inventario.json roteiro.json   # este documento (seções 1 a 26)")
    w("python3 tools/gerar_documentacao_html.py             # a versão HTML")
    w("```")
    w()
    w("As capturas das partes novas saem de `node tools/fotos_documentacao.js pasta` e são convertidas para JPG em `docs/imagens/`.")
    w()
