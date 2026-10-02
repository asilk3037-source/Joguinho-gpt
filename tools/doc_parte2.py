"""Seções da Parte 2 e a lista completa de arte necessária.

Usado por tools/gerar_documentacao.py (seções 16 a 22 do documento principal).
"""
import os

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECOES = ["16. Parte 2 — O Coração dos Elementos", "17. As fases da Parte 2", "18. Relógio: dia e noite",
          "19. Bell jogável e as armaduras das duas", "20. Chefes elementais", "21. Dicas do modo Fácil",
          "22. Arte necessária — lista completa"]

ANCORAS = {s: s.lower() for s in SECOES}


def ancora(s):
    a = s.lower().replace(" ", "-")
    for x in ".,():—“”":
        a = a.replace(x, "")
    for x, y in (("ã", "a"), ("á", "a"), ("â", "a"), ("é", "e"), ("ê", "e"), ("í", "i"), ("ó", "o"), ("ô", "o"), ("õ", "o"), ("ú", "u"), ("ç", "c")):
        a = a.replace(x, y)
    return a.replace("--", "-")


def status_grupo(g):
    tot = len(g["itens"])
    ok = sum(1 for i in g["itens"] if i["existe"])
    via = sum(1 for i in g["itens"] if not i["existe"] and i.get("via"))
    return tot, ok, via


# ---------------------------------------------------------------------------------------------
# Descrições visuais (para quem desenha)
# ---------------------------------------------------------------------------------------------
ARMADURAS_VISUAL = {
    "tunica": ("Line", "Túnica Acolchoada", "1 escudo · 40 moedas",
               "Túnica de linho bege acolchoada (costuras em losango marrom-claro) por cima da roupa de sempre, cinto de couro com fivela de latão, ombreiras macias de tecido. Mantém o cabelo, o rosto e as botas da Line. Deve parecer caseira, feita no vilarejo."),
    "malha": ("Line", "Cota de Malha", "2 escudos · 90 moedas",
              "Camisa de anéis de ferro até o meio da coxa, gola alta, cinto largo de couro escuro, braçadeiras de couro. Brilho metálico prateado frio (2 tons de cinza-azulado + 1 reflexo branco). Os anéis podem ser sugeridos por um padrão de pontinhos, não precisa desenhar anel por anel."),
    "brasa": ("Line", "Armadura de Brasa", "3 escudos · 160 moedas · atravessa chão em brasa",
              "Placas de cobre avermelhado sobre malha temperada, com frestas nas juntas mostrando brasa laranja por dentro (pode pulsar devagar, 2 quadros de brilho). Uma ombreira feita com uma escama vermelha do dragão. Bota com biqueira de cobre. É a armadura mais pesada: postura um pouco mais firme, mas a mesma silhueta da Line."),
    "vestido": ("Bell", "Vestido Reforçado", "1 escudo · 60 moedas",
                "O vestido de sempre da Bell em duas camadas, com bordado de fio de prata na barra e no decote, corpete acolchoado e mangas bufantes curtas. Saia até o joelho, para correr. Mantém os óculos e o cabelo. Costurado pela Dona Rosa."),
    "estelar": ("Bell", "Manto Estelar", "2 escudos · 130 moedas",
                "Capa azul-noite até os tornozelos, presa por um broche de estrela dourada, com estrelinhas bordadas que brilham (1 quadro extra de brilho quando ela canta ou atira). Capuz abaixado nas costas. Por baixo, o vestido reforçado."),
    "aurora": ("Bell", "Armadura da Aurora", "3 escudos · 220 moedas · atravessa brasa e lama",
               "Armadura leve de placas iridescentes feitas com as escamas dos guardiões: verde-musgo (terra) no peito, azul-água nos braços, branco-perolado (ar) nos ombros, com reflexo de arco-íris que muda devagar. Saia de placas curtas por cima de uma calça justa, botas altas que não afundam na lama, tiara com uma pedrinha de cada cor. Brilho suave, não metálico."),
}

CHEFES_VISUAL = {
    "colosso": "Gigante de terra e madeira do tamanho de uma casa: tronco de árvore como corpo, braços de raízes grossas, musgo nos ombros e uma **flor no peito** (o núcleo) que se abre quando ele cansa. **Corrompido:** folhas pretas nas costas, olhos roxos e fumaça colorida saindo das rachaduras. **Libertado (`COLOSSO_FREED`):** folhas verdes, flores brancas brotando, olhos âmbar, sorriso tranquilo.",
    "serpente": "Serpente-marinha longa, azul com barriga turquesa, barbatanas translúcidas nas costas e uma crista de coral. Mergulha e só a cabeça e parte do corpo aparecem. **Corrompida:** água turva marrom escorrendo, manchas escuras nas escamas, olhos brancos sem pupila. **Libertada:** escamas brilhando como espelho, olhos azul-claro.",
    "grifo": "Águia-leão cinza e branca com asas enormes (abertas ocupam 2× o corpo), penas das asas com faíscas elétricas nas pontas, garras douradas. Voa a maior parte da luta e pousa quando cansa. **Corrompido:** penas eriçadas cinza-chumbo, olhos vermelhos, raios roxos. **Libertado:** penas brancas, olhos dourados, brisa suave em volta.",
    "magma": "Titã de pedra do Guardião (mesmo estilo das ruínas) todo rachado, com **lava escorrendo pelas rachaduras** e um **coração de fogo** no peito (o núcleo). Braços de rocha que batem no chão, pedaços de pedra flutuando nos ombros. Cheio de brasas subindo. Quando cansa, a casca se abre e o coração fica exposto, pulsando.",
    "hidra": "Três cabeças de serpente feitas de lama e raízes saindo de um charco. O corpo fica afundado; as cabeças se mexem separadas (uma cospe lama, outra água, a do meio morde). Olhos amarelos, bocas escorrendo lama. Quando cansa, as três cabeças afundam e só o núcleo (uma bolha de lama brilhante) aparece.",
    "tempestade": "Uma nuvem escura com rosto (olhos brancos brilhantes e boca de trovão), braços de vento em espiral, chuva caindo por baixo e raios entre as nuvens. Paira no ar. No centro fica o **olho da tempestade**, um redemoinho claro que é o núcleo. Quando cansa, desce ao chão e o olho abre.",
    "quimera": "A fera final, feita de pedaços roubados de todos os guardiões: corpo de pedra com rachaduras de lava (pedra + fogo), juba de raízes e folhas pretas (terra), cauda de serpente d’água (água), asas de grifo (ar) e um **núcleo no peito que muda de cor** a cada fase — cinza/laranja (pedra e fogo), verde/azul (terra e água) e arco-íris pulsando (todos). Maior que o dragão. No final, acalmada (`QUIMERA_CALM`), encolhe e fica parecendo um filhote triste, quase fofo.",
}

NPCS_VISUAL = [
    ("Dona Cora", "cora", "Parte 2 · Vale das Raízes", "Jardineira idosa, irmã do Seu Zé. Coque branco, chapéu de palha, vestido marrom com avental cor de trigo sujo de terra, pele morena, sorriso largo. Segura uma pá pequena."),
    ("Seu Tião", "tiao", "Parte 2 · Lago Espelhado", "Pescador de barba grisalha, chapéu de palha claro, camisa azul arregaçada, vara de pescar no ombro, balde ao lado. Fala alto e ri fácil."),
    ("Vó Brisa", "brisa", "Parte 2 · Picos do Vento", "Pastora bem velhinha e firme, cabelo branco solto voando com o vento, xale lilás-claro, avental branco, cajado de pastor. Ovelhas por perto (pode reaproveitar `SHEEP_*`)."),
    ("Dona Rosa", "rosa", "Vilarejo · loja", "Mercadora de coque grisalho, vestido rosa com avental creme. Barraca com potes de poção."),
    ("Seu Bento", "bento", "Vilarejo · ferraria", "Ferreiro de barba escura, avental de couro, martelo na mão, braços fortes."),
    ("Seu Zé", "ze", "Vilarejo", "Idoso de cabelo branco, chapéu de palha, bengala, camisa verde."),
    ("Dona Lurdes", "lurdes", "Vilarejo", "Mulher do caçador, vestido lilás com avental, cabelo castanho preso."),
    ("Pedrinho", "pedro", "Vilarejo", "Menino de camiseta amarela, cabelo escuro bagunçado, corre o tempo todo."),
    ("Tobias", "tobias", "Montanha de Brasa", "Caçador de barba, chapéu marrom, colete de couro, pé enfaixado."),
]

TEMAS = [
    ("Vale das Raízes (Terra)", "vale", "Grama dourada-esverdeada de fim de verão, caminhos de terra batida, bosque de árvores largas.",
     ["chão de grama do vale (3 variações) e caminho de terra", "raízes grossas atravessando o chão (tile `r`, correr derruba)", "lama (tile `u`, deixa lenta): charco marrom com reflexo",
      "casa da Dona Cora (telhado de sapê, chaminé) e a horta de raízes", "3 **cristais de terra** (apagado: pedra verde opaca; aceso: verde-limão brilhando)", "anel de pedras do ninho do Colosso e a **barreira de raízes** (raízes entrelaçadas que recolhem ao abrir)",
      "fonte do vale", "placas", "baús", "pedra rachada do recanto sudeste (bomba)", "flores do campo, mato alto, árvores do vale"],
     "borboletas, pássaros, folhas caindo; à noite, vaga-lumes e a janela da casa da Cora acesa"),
    ("Fenda de Magma (Pedra + Fogo)", "fenda", "Caverna vulcânica: rocha escura avermelhada, rios de lava nas bordas.",
     ["chão de rocha vulcânica e paredes", "lava (tile `L`) e **brasa rasa** (tile `l`)", "estalagmites", "fonte das brasas", "placa"], "brasas subindo, calor tremendo o ar, vinheta vermelha"),
    ("Lago Espelhado (Água)", "lago", "Margens verdes, água azul muito limpa (depois da vitória) ou turva (antes), uma ilha no meio.",
     ["grama da margem e areia da beira d’água", "água rasa (riacho `w`, pula) e funda (`~`)", "ponte de madeira até a ilha", "**parede de água** da ponte (barreira que cai como cachoeira ao abrir)",
      "3 **pérolas-cristal** (conchas com pérola; apagada: cinza; acesa: azul brilhando)", "casa e píer do Seu Tião, barco, redes", "fonte do lago", "placas, baús, flores"],
     "reflexos animados na água, patos (`DUCK_*`), bolhas onde a Serpente nada; à noite, estrelas refletidas no lago"),
    ("Pântano Sombrio (Terra + Água)", "pantano", "Charco verde-escuro, árvores mortas, névoa baixa.",
     ["grama escura encharcada", "lama (tile `u`)", "água parada verde-escura", "árvores retorcidas sem folhas", "fonte, placa, baú"], "garoa constante, vaga-lumes verdes, névoa, sapos (arte opcional)"),
    ("Picos do Vento (Ar)", "picos", "Platôs de pedra clara acima das nuvens, abismo de céu entre eles.",
     ["chão de pedra clara e bordas de penhasco", "**abismo de céu** (tile `j`): nuvens lá embaixo, céu azul", "**corrente de vento** (tiles `>` e `<`): riscos brancos animados no chão",
      "3 **faróis do vento** (tocha alta; apagado: pedra; aceso: chama branco-azulada)", "muro do ninho do Grifo e a barreira", "pedras, estalagmites, fonte, placas, baús", "ninho do Grifo (galhos e penas)"],
     "nuvens passando por baixo, pássaros, penas voando; ovelhas da Vó Brisa"),
    ("Olho da Tempestade (Água + Ar)", "tempestade", "Ilha de pedra escura cercada de céu de tempestade.",
     ["chão de lajes azul-escuras molhadas", "abismo de céu escuro com nuvens de chuva", "fonte, placa"], "chuva forte inclinada, relâmpagos que clareiam a tela, poças"),
    ("Coração dos Elementos (todos)", "coracao", "Salão de cristal roxo no alto dos picos, com cinco pilares, um por elemento.",
     ["chão de lajes roxas", "paredes de cristal escuro", "5 **pilares dos elementos** (pedra, fogo, terra, água, ar — cada um com o símbolo e a cor)", "fonte, placa", "portal de entrada (abre depois das três junções)"],
     "partículas das cinco cores flutuando, vinheta roxa; no final, as cinco luzes subindo ao céu"),
]

TEMAS_P1 = [
    ("Fazendinha", "casa, celeiro, galinheiro, moinho, poço, árvores e frutíferas, cerejeiras, horta, feno, carroça, lampiões, píer, barco, girassóis, milho, trigo, arbustos, pedras, placa", "chão de grama, caminho, água do lago, cercas, flores pequenas, mato, varal, mesa, casinha do Theo, tigela; **dragão dormindo enrolado perto da casa** (Parte 2)"),
    ("Vilarejo do Riacho", "—", "chão, casas coloridas, barraca da feira, bigorna, fonte da praça, quadro de avisos, riacho, estação do carrinho, trilhos, **estrada nova para o leste (Parte 2)**, janelas acesas e lampiões à noite"),
    ("Floresta Sussurrante", "pinheiros e árvores", "chão, raízes, riacho, espinheiros, baú, placas, pedras, cabana do caçador, lago com ilha, postes do gancho, pedra rachada"),
    ("Gruta dos Ecos e Minas", "—", "chão e paredes azuladas, água funda, estalagmites, cogumelos luminosos, fonte, porta de ferro, baús, trilhos, estação, abismo"),
    ("Ruínas Encantadas", "—", "chão de lajes, paredes, pilares, cristais (apagado e aceso), altar com orbe, fonte, barreira de luz, lagos, baú"),
    ("Montanha de Brasa", "—", "chão vulcânico, paredes, fendas, lava, tochas (apagada e acesa), portão de fogo, bigorna da forja, brasa rasa, estação"),
    ("Covil do Dragão", "—", "chão, paredes, lava, estalagmites, jaula da Bell"),
]


# ---------------------------------------------------------------------------------------------
def escrever(w, img, inv, rot, roteiro):
    M = inv["mundo"]
    P2 = M.get("parte2", {})
    CH = M.get("chefes", {})
    ELEM = M.get("elementos", {})
    mapas = M["mapas"]

    # ============================ 16 ============================
    w("## 16. Parte 2 — O Coração dos Elementos")
    w()
    w("> A Parte 2 começa quando a jogadora aperta **Continuar** depois do “Fim?” da Parte 1 (o olho do dragão se abrindo). O save continua o mesmo: moedas, itens, documentos e armaduras vão junto.")
    w()
    w("### 16.1 A história")
    w()
    w("Na manhã seguinte ao pôr do sol do epílogo, o chão tremeu a noite inteira e o céu amanheceu verde e roxo. O dragão pousa na fazenda — mas desta vez para **pedir ajuda**. Há mil anos, cinco guardiões cuidavam dos elementos: **Pedra** (o Guardião das ruínas), **Fogo** (o próprio dragão), **Terra**, **Água** e **Ar**. Quando a Line venceu os dois primeiros *sem ódio*, as luzes deles ficaram soltas, e uma coisa velha e sem forma bebeu o que sobrou: a **Quimera**.")
    w()
    w("A Quimera morde os guardiões, envenena, rouba a luz deles e, com o que rouba de dois elementos, faz nascer uma fera nova. Agora ela vai atrás dos três que faltam: o **Colosso** (Terra), a **Serpente** (Água) e o **Grifo** (Ar). Se juntar todos, o mundo esfria de vez.")
    w()
    w("Quando a Line dividiu a luz com o dragão no covil, uma parte ficou na Bell. Agora ela **atira estrelas** e a **canção dela acalma qualquer fera** — e dessa vez ela não fica esperando em gaiola nenhuma: **a Bell vira jogável**, e as duas partem juntas.")
    w()
    w("O tema da Parte 1 volta no fim: a Quimera não é má, é **sozinha**. Ela rouba porque acha que só assim deixa de sentir frio. As duas respondem com a frase do jogo: *luz não se rouba, se divide*.")
    w()
    w("### 16.2 Ordem da aventura")
    w()
    w("| # | Fase | Chefe | Tipo | Abre |")
    w("|---|---|---|---|---|")
    ordem = [("1", "vale", "colosso"), ("2", "fenda", "magma"), ("3", "lago", "serpente"), ("4", "pantano", "hidra"), ("5", "picos", "grifo"), ("6", "tempestade", "tempestade"), ("7", "coracao", "quimera")]
    abre = {"colosso": "estrada da Fenda de Magma", "magma": "estrada do Lago Espelhado", "serpente": "estrada do Pântano Sombrio", "hidra": "estrada dos Picos do Vento",
            "grifo": "passagem do Olho da Tempestade", "tempestade": "portal do Coração dos Elementos", "quimera": "final da Parte 2"}
    for n, area, ch in ordem:
        c = CH.get(ch, {})
        tipo = "guardião" if len(c.get("elementos", [])) == 1 else ("chefe final (todos os elementos)" if c.get("final") else "junção " + " + ".join(ELEM[e]["nome"] for e in c.get("elementos", [])))
        w(f"| {n} | {mapas[area]['nome']} | {c.get('nome', ch)} | {tipo} | {abre[ch]} |")
    w()
    w("Cada fase segue o mesmo ritmo, para ser **longa sem cansar**: chegada com uma conversinha das duas → um morador que conta o que aconteceu → explorar e acender três fontes de luz (cristais, pérolas ou faróis) espalhadas pelo mapa → o chefe da fase → a sombra que sai dele foge para uma arena pequena ao lado → o chefe de **junção** → caminho aberto para a próxima fase. Cada fase grande leva uns **15 a 20 minutos**, e as arenas de junção uns 5.")
    w()
    w("### 16.3 Roteiro da Parte 2")
    w()
    w("#### Abertura: o dragão pede ajuda (fazenda)")
    roteiro("parte2Abertura")
    w("#### Chegadas (primeira vez em cada lugar)")
    w()
    for area, falas in P2.get("chegadas", {}).items():
        w(f"**{mapas[area]['nome']}**")
        w()
        for quem, txt, *r in falas:
            w(f"> **{quem}**: {txt}  ")
        w()
    w("#### Apresentação de cada chefe")
    w()
    w("Ao entrar na arena, a câmera vai até o chefe, aparece o nome e o título dele e eles falam:")
    w()
    for ch, falas in P2.get("intro", {}).items():
        c = CH.get(ch, {})
        w(f"**{c.get('nome', ch)}** — *{c.get('titulo', '')}*")
        w()
        for quem, txt, *r in falas:
            w(f"> **{quem}**: {txt}  ")
        w()
    w("#### Guardiões libertados")
    w()
    w("Vencido, cada guardião volta às cores verdadeiras (animação `*_FREED`), agradece e dá **+1 coração** (vale para as duas) e uma **escama** — com duas escamas, o Seu Bento forja a Armadura da Aurora da Bell.")
    w()
    for ch, lib in P2.get("libertos", {}).items():
        w(f"**{CH.get(ch, {}).get('nome', ch)}**")
        w()
        for quem, txt, *r in lib["falas"]:
            w(f"> **{quem}**: {txt}  ")
        w(f"> 💡 *Dica na tela:* {lib['proxima']}  ")
        w()
    w("#### Junções desfeitas")
    roteiro("chefeVencido")
    w("#### Final da Parte 2")
    roteiro("finalParte2")
    w("#### Moradores novos (primeira conversa)")
    w()
    for id_, falas in P2.get("falas", {}).items():
        for quem, txt, *r in falas or []:
            w(f"> **{quem}**: {txt}  ")
        w()
    w("Os moradores do vilarejo também ganham uma fala nova na Parte 2 (a Dona Rosa vê as duas juntas, o Seu Bento oferece armaduras para a Bell, o Seu Zé conta que a estrada do leste abriu sozinha e que a irmã dele, a Cora, mora no vale).")
    w()
    w("### 16.4 Documentos novos")
    w()
    w("| Documento | Tipo | Onde | Marca no mapa |")
    w("|---|---|---|---|")
    for pid in ("diarioCora", "cancaoLago", "penaGrifo"):
        p = M["pistas"][pid]
        marca = p.get("marca", {}).get("rotulo", "—")
        w(f"| {p['icone']} {p['titulo']} | {M['tiposDoc'].get(p['tipo'], p['tipo'])} | {p['onde']} | {marca} |")
    w()
    conc = next((c for c in M["conclusoes"] if c["id"] == "quimera"), None)
    if conc:
        w(f"**Conclusão nova:** juntando os três, a Line entende: *{conc['texto']}* **Efeito:** {conc['efeito']}")
        w()

    # ============================ 17 ============================
    w("## 17. As fases da Parte 2")
    w()
    w("| Fase | Tamanho | Baús | Inimigos | Chefe | Saídas |")
    w("|---|---|---|---|---|---|")
    nomes_inim = {"sombra": "sombras", "terra": "fogos-fátuos de terra", "agua": "fogos-fátuos de água", "ar": "fogos-fátuos de ar"}
    for area in ("vale", "fenda", "lago", "pantano", "picos", "tempestade", "coracao"):
        m = mapas[area]
        ini = ", ".join(f"{n} {nomes_inim.get(t, t)}" for t, n in m["inimigos"].items()) or "só o chefe"
        chefe = CH[{"vale": "colosso", "fenda": "magma", "lago": "serpente", "pantano": "hidra", "picos": "grifo", "tempestade": "tempestade", "coracao": "quimera"}[area]]["nome"]
        saidas = ", ".join(mapas[s["para"]]["nome"] + (f" (depois de `{s['requer']}`)" if s["requer"] else "") for s in m["saidas"])
        w(f"| {m['nome']} | {m['w']} × {m['h']} | {len(m['baus'])} | {ini} | {chefe} | {saidas} |")
    w()
    w("A estrada nova sai do **leste do Vilarejo do Riacho** e só abre na Parte 2. O mapa do mundo ganhou sete regiões, que só aparecem depois que o dragão acorda.")
    w()
    for titulo, area, geral, objetos, amb in TEMAS:
        m = mapas[area]
        w(f"### {titulo}")
        w(geral)
        w()
        if area == "vale":
            w("- **Casa da Dona Cora (noroeste):** a jardineira, a horta e o primeiro cristal de terra.")
            w("- **Campo de raízes (sudoeste):** raízes que derrubam quem corre, o segundo cristal e um baú.")
            w("- **Lamaçal (centro-sul):** lama que deixa lenta e um baú no meio.")
            w("- **Bosque do leste:** o terceiro cristal e o **recanto de pedra rachada** (bomba) com um baú escondido.")
            w("- **Ninho do Colosso (nordeste):** anel de pedras fechado pela barreira de raízes; abre com os três cristais acesos.")
            w("- **Saídas:** oeste → vilarejo; leste → Fenda de Magma (depois do Colosso); norte → Lago Espelhado (depois do Titã de Magma).")
        elif area == "lago":
            w("- **O grande lago** com a **ilha da Serpente** no meio, ligada por uma ponte fechada por uma parede de água.")
            w("- **Três pérolas-cristal:** no píer do Seu Tião (sudoeste), na margem oeste (norte) e no bosque do leste.")
            w("- **Riachos para pular** e a estrada que contorna o lago pela margem oeste até o norte.")
            w("- **Saídas:** sul → vale; leste → Pântano Sombrio (depois da Serpente); norte → Picos do Vento (depois da Hidra).")
        elif area == "picos":
            w("- **Platôs separados por abismos de céu** (pulando até 3 tiles) e **pontes de vento**: o vento empurra para o lado enquanto se atravessa, com abismo dos dois lados.")
            w("- **Platô oeste:** a Vó Brisa, um farol e a ponte de vento que sobe até o ninho do Grifo.")
            w("- **Platô leste:** outro farol, a pena de tempestade e a ponte de vento para o pico nordeste (terceiro farol e saída da Tempestade).")
            w("- **Centro:** uma ponte de vento vinda da chegada, baú e a passagem norte para o Coração dos Elementos (abre depois das três junções).")
        w()
        img(f"p2-{area}", f"{m['nome']}")
    w("**Chão novo:** lama (`u`) deixa as duas mais lentas (a Armadura da Aurora da Bell ignora); as correntes de vento (`>` e `<`) empurram mesmo parada; o abismo de céu (`j` nos picos) derruba e devolve para a beirada com um tombo.")
    w()
    w("**Ambientação:** chuva no Olho da Tempestade (forte, com relâmpagos que clareiam a tela) e garoa no pântano; brasas na fenda; vaga-lumes verdes no pântano e roxos no Coração; nuvens, pássaros e folhas nas áreas abertas; cada fase tem uma vinheta de cor própria.")
    w()

    # ============================ 18 ============================
    w("## 18. Relógio: dia e noite")
    w()
    w("- **1 segundo de jogo = 1 minuto no relógio**, ou seja, **1 minuto real = 1 hora**, e um dia inteiro passa em **24 minutos**.")
    w("- O relógio aparece no topo da tela (☀️ de dia, 🌅 ao amanhecer e ao entardecer, 🌙 à noite) com a hora e o **dia** da aventura.")
    w("- Só anda durante o jogo: para na pausa, na mochila, na loja e nas cenas.")
    w("- A aventura começa às **19h30** do dia 1, logo depois do rapto. Saves antigos começam às 8h.")
    w("- **Amanhecer** das 5h às 7h (tom rosado), **dia** das 7h às 17h, **entardecer** das 17h às 20h (tom laranja) e **noite** das 20h às 5h (azul-escuro, com um círculo de luz em volta da heroína; a lanterna aumenta o círculo).")
    w("- Cada lugar escurece de um jeito: áreas abertas escurecem tudo, a montanha e as ruínas só um pouco, e as cavernas (gruta, covil, fenda, Coração) não mudam.")
    w("- À noite aparecem **vaga-lumes** nas áreas abertas e os **moradores do vilarejo vão dormir** (a loja e a ferraria fecham: “Loja fechada, volte de manhã”).")
    w("- Em qualquer **fonte**, à noite, dá para **descansar até de manhã**: pula para as 7h do dia seguinte com a vida e a magia cheias (das duas, na Parte 2).")
    w()
    img("p2-noite", "O vilarejo às 22h: céu escuro, vaga-lumes e os moradores dormindo")

    # ============================ 19 ============================
    w("## 19. Bell jogável e as armaduras das duas")
    w()
    w("### 19.1 Trocando de heroína")
    w("- **T** no teclado, **L3** no controle ou o botão **🔄** no celular troca entre a Line e a Bell a qualquer momento fora das cenas.")
    w("- A outra heroína anda junto, logo atrás.")
    w("- **Cada uma tem a própria vida e magia.** Um mini-painel embaixo das moedas mostra a vida de quem está descansando.")
    w("- Quando a heroína ativa **cai**, a outra **assume na hora**. Só é derrota quando as duas caem. Quem caiu só volta depois de beber numa fonte (ou descansar).")
    w("- A heroína que está descansando recupera magia devagar.")
    w()
    w("### 19.2 Como a Bell luta")
    w()
    w("| Botão | Bell | Line |")
    w("|---|---|---|")
    w("| ⚔ Atacar (J) | **Estrela**: atira uma estrela rosa à distância (1 de dano). Apertando de novo, atira em sequência | combo de espada |")
    w(f"| Especial (K; no celular, segurar ⚔) | **Leque de estrelas**: três estrelas de luz em leque ({M.get('herois', {}).get('custoLeque', 1)} de magia). Acendem cristais, faróis e pérolas e **abrem a guarda dos chefes** | giro |")
    w(f"| ✨ Magia (Q) | **Canção** ({M.get('herois', {}).get('custoCancao', 2)} de magia): acalma todos os inimigos em volta por uns 2 s (eles param e ficam ouvindo, com notinhas), cura 1 de vida das duas; nos chefes, segura o ataque por 1,4 s, ou deixa o núcleo exposto por mais tempo se ele estiver cansado | Raio de Luz / Chuva de Estrelas |")
    w("| 🛡 Defender (V) | escudo de luz rosa | defesa com a espada |")
    w("| 💨 Esquivar, ⤴ Pular | iguais às da Line | |")
    w()
    w("A Bell é um pouco mais rápida e luta **de longe**; a Line bate mais forte **de perto**. Contra os chefes, o jeito mais fácil é a Bell abrir a guarda com o leque e a Line entrar com a espada.")
    w()
    img("p2-bell", "Jogando com a Bell: a Line vem atrás")
    w("### 19.3 Armaduras")
    w()
    w("A ferraria do Seu Bento passa a vender três armaduras **da Bell** na Parte 2. Cada heroína veste a sua: comprar uma armadura da Bell jogando com a Line guarda para ela.")
    w()
    w("| Heroína | Armadura | Escudos e efeito | Como é (para a arte) |")
    w("|---|---|---|---|")
    for id_, (quem, nome, ef, desc) in ARMADURAS_VISUAL.items():
        w(f"| {quem} | **{nome}** | {ef} | {desc} |")
    w()
    w("A **Armadura da Aurora** só aparece depois de libertar **dois guardiões** (as escamas deles viram as placas).")
    w()
    w("**Como a arte da armadura entra no jogo:** o jogo procura primeiro a animação com o nome da armadura no meio do código e, se ela não existir, usa a normal. Exemplo: com a Cota de Malha, `LINE_WALK_RIGHT` vira `LINE_MALHA_WALK_RIGHT`; com o Manto Estelar, `BELL_ATTACK_STAR` vira `BELL_ESTELAR_ATTACK_STAR`. Assim dá para mandar a arte aos poucos, animação por animação. A lista de códigos está na seção 22.2.")
    w()

    # ============================ 20 ============================
    w("## 20. Chefes elementais")
    w()
    w("**Regra comum:** todo ataque tem aviso antes (círculo no chão, anel para pular, bolhas, sombra). Depois de alguns ataques o chefe **se cansa**: o núcleo fica exposto (barra ciano) e aí a espada e as estrelas machucam de verdade. Fora disso, a espada só faz “clang”. A **luz** (Raio de Luz da Line ou leque da Bell) abre a guarda na hora, e a **canção** da Bell segura os ataques. No Fácil, o chefe cansa um ataque mais cedo, e a espada ainda arranha um pouco.")
    w()
    desc_atk = {"pisao": "pisão com onda no chão (pular)", "rocha": "arremessa rochas", "chuvaFogo": "chuva de fogo que deixa poças de lava", "lequeFogo": "leque de bolas de fogo",
                "raizes": "raízes saindo do chão em linha", "espinhosAnel": "anel de espinhos (pular)", "lama": "cuspe de lama que deixa lenta", "invocar": "chama duas sombras",
                "mergulho": "mergulha (fica intocável) e sai embaixo das bolhas", "jatos": "jatos de água em leque", "onda": "onda que precisa ser pulada",
                "rajada": "rajada de vento que empurra para longe", "penas": "leque de penas afiadas", "raios": "raios caindo em círculos brancos"}
    for ch in ("colosso", "serpente", "grifo", "magma", "hidra", "tempestade", "quimera"):
        c = CH[ch]
        els = " + ".join(ELEM[e]["icone"] + " " + ELEM[e]["nome"] for e in c["elementos"])
        w(f"### {c['nome']} — {c['titulo']}")
        w(f"- **Elementos:** {els} · **Vida:** {c['hp']} no Normal · **Cansa depois de:** {c['cansaApos']} ataques · **Onde:** {mapas[{'colosso': 'vale', 'serpente': 'lago', 'grifo': 'picos', 'magma': 'fenda', 'hidra': 'pantano', 'tempestade': 'tempestade', 'quimera': 'coracao'}[ch]]['nome']}")
        if c.get("fases"):
            w("- **Três fases:** " + " → ".join(" + ".join(ELEM[e]["nome"] for e in f) for f in c["fases"]) + ". Na última, bate 2 de uma vez (menos no Fácil).")
            w("- **Ataques:** todos os dos elementos da fase.")
        else:
            w("- **Ataques:** " + "; ".join(desc_atk[a] for a in c["ataques"]) + ".")
        if c.get("pocas"):
            w(f"- **Poças:** deixa poças de {c['pocas']} pelo chão por alguns segundos.")
        w("- **Dicas do Fácil:** " + " / ".join(c["dicas"]))
        w(f"- **Aparência:** {CHEFES_VISUAL[ch]}")
        w()
    img("p2-chefes", "Os sete chefes na versão provisória (desenhados no código até a arte chegar)")

    # ============================ 21 ============================
    w("## 21. Dicas do modo Fácil")
    w()
    w("No **Fácil**, além de chefes mais fracos, o jogo ajuda a jogadora a não se perder:")
    w()
    w("Tudo é **bem discreto**, em branco-creme transparente, para ajudar sem poluir a tela:")
    w()
    w("- **Trilha no chão:** pontinhos claros e fracos só nos próximos passos, com um brilho suave que corre na direção certa. Eles seguem **o caminho de verdade**, contornando paredes, água e árvores (contam pulos, espinhos para cortar e o gancho).")
    w("- **Setinha nos pés:** um “›” transparente perto da heroína mostra para onde a trilha segue.")
    w("- **No objetivo:** uma estrelinha piscando devagar e um anel fino no chão. O nome (“Cristal apagado (1/3 acesos)”, “Ovo escondido”…) só aparece quando a heroína está perto.")
    w("- **Legenda embaixo da tela:** texto pequeno e transparente com o que procurar, quantos passos faltam e, se for o caso, “pule por cima”, “corte os espinhos” ou “use o gancho no poste”.")
    w("- **Outra área:** a trilha leva até a saída certa pelo caminho mais curto entre as saídas já abertas.")
    w("- **Caminho fechado:** se uma barreira de luz está no meio, a trilha leva primeiro até a tocha ou o cristal que abre a passagem.")
    w("- **Tarefas da fazenda:** a trilha leva à tarefa mais perto (ovo escondido, regador, horta, ração do Theo, tigela ou o bichinho que ainda não ganhou carinho).")
    w("- **Coisas para achar:** baús fechados e documentos por perto têm uma estrelinha clara bem fraca.")
    w("- **Mapa (M):** tracejado claro com o caminho e uma estrela no objetivo, e todos os baús aparecem (como a Bússola do Mago). No mapa do mundo, a região do objetivo ganha um anel e 🧭.")
    w("- **Dicas de chefe:** ao acordar, quando cansa pela primeira vez e quando muda de fase, aparece um balão com a dica daquele chefe (seção 20).")
    w("- **Vida baixa:** com 1 coração ou menos, lembra de usar poção, trocar de heroína ou voltar a uma fonte (uma vez por área).")
    w("- **Tela de derrota:** mostra uma dica do que fazer diferente, conforme onde a heroína caiu (o chefe da luta, o dragão, o Guardião ou uma dica geral).")
    w()
    img("p2-dica", "A seta do Fácil apontando o caminho")

    escrever_arte(w, img, inv)


# ---------------------------------------------------------------------------------------------
def escrever_arte(w, img, inv):
    M = inv["mundo"]
    grupos = inv["grupos"]
    w("## 22. Arte necessária — lista completa")
    w()
    w("> Esta é a lista de **tudo o que precisa de arte** no jogo, das duas partes: personagens, armaduras, moradores, inimigos, chefes, cenário de cada fase, objetos, itens, interface, efeitos e dia/noite. Tudo que está hoje no jogo é **temporário** (emojis, desenhos no código ou arte provisória) e é trocado sozinho quando a arte com o código certo chega.")
    w()
    escrever_tamanhos(w)
    w("### 22.1 Resumo das animações")
    w()
    w("| Grupo | Animações | Com arte | Usando substituta | Faltando |")
    w("|---|---|---|---|---|")
    T = [0, 0, 0]
    for g in grupos:
        tot, ok, via = status_grupo(g)
        T[0] += tot; T[1] += ok; T[2] += via
        w(f"| {g['nome']} | {tot} | {ok} | {via} | {tot - ok - via} |")
    w(f"| **Total** | **{T[0]}** | **{T[1]}** | **{T[2]}** | **{T[0] - T[1] - T[2]}** |")
    w()
    w("A lista com cada código está na seção 10 e, só com o que falta, na seção 23.")
    w()

    w("### 22.2 Line e Bell (personagens principais)")
    w()
    w("- **Line:** todas as animações `LINE_*` da seção 10 (andar, correr, combate, magia, emoções, cenas).")
    w("- **Bell:** as animações `BELL_*` de antes (cenas, jaula, emoções) **e as novas da Bell jogável**: guarda, estrela, leque, estrela no ar, canção, escudo de luz, esquiva, arrancada, dano, queda, cansada, agachar, decidida, comemoração e falando (grupo *Bell jogável (Parte 2)*). Enquanto não chegam, o jogo usa outras poses dela (ex.: o “toca aqui” para atirar a estrela, a dança para o leque).")
    w("- **Retratos dos diálogos:** as 9 expressões de cada uma (seção 11) — faltam Bell brava, Bell chorando e Line envergonhada. **Opcional:** um retrato de cada com armadura.")
    w()
    w("**Com armadura** — cada armadura precisa do mesmo conjunto de animações principais, com o nome da armadura no código (ex.: `LINE_MALHA_WALK_RIGHT`). Primeiro as de andar/correr/parada nas 4 direções, depois as de combate:")
    w()
    w("| Heroína | Armadura | Prefixo | Animações pedidas |")
    w("|---|---|---|---|")
    roupa = M.get("roupa", {})
    for id_, (quem, nome, ef, desc) in ARMADURAS_VISUAL.items():
        pref = f"{quem.upper()}_{roupa.get(id_, id_.upper())}_"
        g = next((x for x in grupos if x["nome"].endswith(nome)), None)
        n = len(g["itens"]) if g else 0
        base = sorted({i["codigo"].replace(pref, "").replace("_FRONT", "").replace("_BACK", "").replace("_LEFT", "").replace("_RIGHT", "") for i in (g["itens"] if g else [])})
        w(f"| {quem} | {nome} | `{pref}…` | {n}: " + ", ".join(f"`{b}`" for b in base) + " |")
    w()
    w("Descrição visual de cada armadura: seção 19.3. **Ícones** de cada armadura para a loja e o HUD (6 ícones).")
    w()

    w("### 22.3 Moradores e personagens de apoio")
    w()
    w("| Personagem | Onde | Como é | Animações |")
    w("|---|---|---|---|")
    for nome, id_, onde, desc in NPCS_VISUAL:
        w(f"| **{nome}** | {onde} | {desc} | `{id_.upper()}_IDLE`, `{id_.upper()}_TALK`, `{id_.upper()}_SLEEP` (+ extras na seção 10) · retrato |")
    w("| **Mago** | Floresta | (Parte 1) | `MAGO_*` · retrato |")
    w("| **Espírito das Ruínas** | Ruínas | (Parte 1) | `SPIRIT_*` · retrato |")
    w("| **Dragão amigo** | Fazenda (Parte 2) | O mesmo dragão, com olhar calmo | `DRAGON_TALK`, `DRAGON_BOW`, `DRAGON_CURL_SLEEP` · retrato |")
    w("| **Guardiões libertados** | Vale, lago, picos | Colosso, Serpente e Grifo nas cores verdadeiras | `COLOSSO_FREED`, `SERPENTE_FREED`, `GRIFO_FREED` · retratos |")
    w()
    w("**Retratos que faltam (personagens):** Mago, Espírito, Guardião de Pedra, Dragão, Dona Rosa, Seu Bento, Seu Zé, Dona Lurdes, Pedrinho, Tobias, Dona Cora, Seu Tião, Vó Brisa, Colosso, Serpente, Grifo, Titã de Magma, Hidra, Tempestade Viva e Quimera.")
    w()

    w("### 22.4 Inimigos")
    w()
    w("| Inimigo | Onde | Arte |")
    w("|---|---|---|")
    w("| Sombra | floresta, ruínas, montanha, vale, lago, picos (e as que o Colosso chama) | `SHADOW_*` |")
    w("| Fogo-fátuo azul e de fogo | ruínas, gruta, montanha | `WISP_*` |")
    w("| **Fogo-fátuo de terra** (verde-musgo, cospe torrão) | Vale das Raízes | `WISP_EARTH_IDLE/ATTACK/DEATH` |")
    w("| **Fogo-fátuo de água** (azul, cospe gota) | Lago Espelhado | `WISP_WATER_IDLE/ATTACK/DEATH` |")
    w("| **Fogo-fátuo de ar** (branco, atira pena) | Picos do Vento | `WISP_AIR_IDLE/ATTACK/DEATH` |")
    w("| Morcego | Minas | desenhado no código (sem código de arte ainda) |")
    w()

    w("### 22.5 Chefes")
    w()
    w("Cada chefe tem: dormindo, parado, acordando, um ataque genérico, **uma animação por golpe**, cansado (núcleo exposto), dano, derrota e — nos guardiões — libertado. Tamanho sugerido: quadros de 512×512 com o corpo ocupando uns 400 px (como o dragão); a Quimera pode ser maior. Não precisa desenhar sombra no chão: o jogo desenha (inclusive a dos chefes voadores).")
    w()
    w("| Chefe | Códigos | Aparência |")
    w("|---|---|---|")
    for g in grupos:
        if not g["nome"].startswith("Chefe: "):
            continue
        nome = g["nome"][7:].replace(" (Parte 2)", "")
        chave = next((k for k, c in M["chefes"].items() if c["nome"] == nome), None)
        cods = ", ".join(f"`{i['codigo']}`" for i in g["itens"])
        w(f"| **{nome}** | {cods} | {CHEFES_VISUAL.get(chave, '')} |")
    w("| Guardião de Pedra (Parte 1) | `GOLEM_*` | já catalogado |")
    w("| Dragão Vermelho (Parte 1) | `DRAGON_*` | arte nova recebida |")
    w()

    w("### 22.6 Cenário de cada fase")
    w()
    w("Chão, paredes e objetos. Cada tile é de 32×32 no jogo (pode vir em 64×64). Objetos com altura (casas, árvores, pilares, faróis) vêm como imagem inteira, com a base na linha de baixo.")
    w()
    w("**Parte 1:**")
    w()
    w("| Área | Já tem arte (temporária) | Precisa de arte |")
    w("|---|---|---|")
    for area, tem, falta in TEMAS_P1:
        w(f"| {area} | {tem} | {falta} |")
    w()
    w("**Parte 2 (tudo novo, tudo desenhado no código hoje):**")
    w()
    w("| Fase | Visual geral | Tiles e objetos | Ambientação |")
    w("|---|---|---|---|")
    for titulo, area, geral, objetos, amb in TEMAS:
        w(f"| **{titulo}** | {geral} | " + "; ".join(objetos) + f" | {amb} |")
    w()
    w("**Objetos que aparecem em várias fases:** baú (fechado/aberto), placa, fonte (e o brilho de descanso à noite), barreira de luz (e as variações de raízes, parede de água e muro de vento), porta de ferro, parede/pedra rachada, poste do gancho, trilhos e estação, bigorna, documentos no chão, moedas no chão, coração e cristal de magia caídos.")
    w()

    w("### 22.7 Itens, moedas e documentos")
    w()
    w("| Item | Hoje | Precisa |")
    w("|---|---|---|")
    for it in M["ordemItens"]:
        d = M["itens"][it]
        w(f"| {d['nome']} | {d['icone']} (emoji) | ícone 32×32 e 64×64 para a mochila; {'desenho no chão/na mão' if d.get('tipo') == 'consumivel' else 'ícone na lista'} |")
    w("| Moedas | desenho no código | moeda girando (4 quadros) e o saquinho do HUD |")
    w()
    w(f"**Documentos ({len(M['ordemPistas'])}):** um ícone para cada (hoje emoji) e, se possível, uma **ilustração do papel** para a tela de leitura (carta dobrada, pergaminho, cartaz, diário, relatório, receita, mapa rasgado, fita, escama, pena…): " + ", ".join(M["pistas"][p]["titulo"] for p in M["ordemPistas"]) + ".")
    w()

    w("### 22.8 Interface (HUD, menus e telas)")
    w()
    for linha in [
        "**Corações** (cheio, meio, vazio), **escudos** (cheio e vazio) e **gotas de magia**.",
        "**Relógio:** moldura do topo, ícones de sol, sol nascendo/se pondo e lua, e o número do dia.",
        "**Vida da outra heroína:** mini-retrato da Line e da Bell para o painel pequeno.",
        "**Botões de toque:** atacar (segurar = giro/leque), esquivar, pular, defender, magia/canção, poção, item, mochila, pausa e **🔄 trocar heroína** (com a cara de quem entra).",
        "**Seta guia do Fácil** (dourada) e o balão de dica 💡.",
        "**Barra de chefe** com moldura e o ícone do elemento (pedra, fogo, terra, água, ar e o da Quimera), e a versão “núcleo exposto”.",
        "**Mapa do mundo:** ilustração em pergaminho com as 14 regiões (7 da Parte 1 e 7 da Parte 2), cada uma com um brasão: 🏡 🏘️ 🌲 🕳️ 🏛️ 🌋 🐉 🌾 🌋 🌊 🐸 🏔️ ⛈️ 💠.",
        "**Mapa da área:** cores/ícones de baú, fonte, placa, altar, cristal, tocha, farol, pérola, porta, estação, morador e alfinete.",
        "**Telas:** título do jogo, título “Parte 2 — O Coração dos Elementos”, títulos de capítulo, tela de derrota (“As duas caíram…”), loja e ferraria (fundo de balcão), leitor de documentos, “Fim da Parte 2”.",
    ]:
        w(f"- {linha}")
    w()

    w("### 22.9 Efeitos")
    w()
    for linha in [
        "**Bell:** estrela rosa (projétil + brilho ao sair), leque de três estrelas de luz, **notas musicais coloridas** da canção, anel rosa da canção, escudo de luz, brilho da troca de heroína.",
        "**Chefes:** projéteis de lama, água, pena, rocha e bola de fogo; **avisos no chão** de cada estilo (raiz rachando a terra, bolha de água, círculo de raio, anel de espinhos, poça de lava, poça de lama); rajada de vento; relâmpago; poça borbulhando; núcleo exposto brilhando; guardião libertado (luz da cor do elemento); mudança de fase da Quimera; as cinco luzes subindo no final.",
        "**Fases:** riscos de vento no chão (animado), chuva e respingos, relâmpago na tela, névoa do pântano, brasas da fenda, nuvens passando embaixo dos picos, partículas das cinco cores no Coração.",
        "**Dia e noite:** vaga-lumes (amarelos, verdes e roxos), estrelas no céu, janelas e lampiões acesos à noite, brilho da fonte ao descansar, tons de amanhecer e entardecer.",
        "Os efeitos da Parte 1 continuam na seção 13 (`FX_*`).",
    ]:
        w(f"- {linha}")
    w()

    w("### 22.11 Cenário do Minas Shopping (item 140) — medidas combinadas")
    w()
    w("> 🔒 **Trava:** cenário **não** passa pelo recorte de animação (os quadros de 1254×1254 que viram células de 256). O extrator deixa o item 140 de fora de propósito; ele entra à mão, com as medidas abaixo.")
    w()
    w("**Como o Minas Shopping funciona no jogo:** é **uma ilustração inteira** (não é feita de tiles), em pé, na proporção **9:16**. Tudo no jogo foi posicionado numa **base de 360×640** (a tela do HTML do primeiro encontro): onde a Line começa, onde a Bell espera, a mesa do BK, a saída e os dois closes. Por isso a nova arte precisa manter **exatamente essa proporção**, só que maior.")
    w()
    w("| Medida | Valor |")
    w("|---|---|")
    w("| Base de coordenadas | 360×640 (proporção 9:16, em pé) |")
    w("| Tamanho no mundo do jogo | 480×853 unidades (mapa de 15×27 tiles de 32) |")
    w("| **Entrega recomendada** | **2160×3840** (6× a base): nítido em tela cheia 1440p e nos closes em 1080p |")
    w("| Para 4K | 2880×5120 (8× a base) |")
    w("| Mínimo | 1440×2560 (4× a base): nítido em tela cheia 1080p sem close |")
    w("| Grade de referência | 1 tile do jogo = 24 px da base = **144 px** na entrega de 2160×3840 (15 colunas; a altura não fecha em tiles inteiros, não precisa) |")
    w("| Escala das personagens | a Line de pé tem **47 px da base = 281 px** na entrega de 2160×3840; a mesa, as cadeiras e as portas seguem essa medida |")
    w("| Área andável (chão livre) | x 28–332, y 130–545 na base (**x 168–1992, y 780–3270** na entrega de 2160×3840): nada alto no chão dentro dela |")
    w("| Fundo (vitrines, escada rolante, andar de cima) | faixa de cima, y 0–130 da base |")
    w("| Pontos da história (base) | Line começa (48,520) · Bell espera (274,300) · Line na mesa (142,397) · Bell na mesa (218,397) · mesa do BK (180,397) · saída (280,500) |")
    w("| Closes (câmera 1,6×) | o encontro, perto de (251,270), e a mesa do BK, perto de (180,367): os lugares com mais detalhe |")
    w("| Telas largas | o jogo preenche os lados com a própria imagem borrada: as bordas esquerda e direita devem continuar o cenário naturalmente (sem moldura) |")
    w()
    w("**Formato da entrega (o “recorte”):**")
    w()
    w("1. **Fundo:** uma imagem única, PNG ou WebP, **sem transparência**, sem grade e sem textos, na perspectiva de cima em 3/4 como o resto do jogo.")
    w("2. **Camada da frente (opcional):** o que deve passar **na frente** das personagens (pilares, vasos, grade do mezanino, encosto das cadeiras) vem num PNG separado, **do mesmo tamanho do fundo**, com transparência em todo o resto. O jogo desenha essa camada por cima das duas.")
    w("3. **Partes animadas (opcional):** luzes piscando, escada rolante e fonte vêm como animação separada, só do pedaço que mexe, com a posição (x, y) no fundo.")
    w("4. **Não** entregar em sequência de quadros de 1254×1254 nem como prancha de tiles.")
    w()
    w("O **gabarito** `arte/referencias/gabarito_minas_shopping_2160x3840.png` já está no tamanho certo, com a grade, a área andável, os pontos da história, os closes e a Line e a Bell em escala, por cima da ilustração atual, para desenhar em cima (gerado por `tools/gabarito_cenario.py`).")
    w()
    img("gabarito-minas-shopping", "Gabarito do Minas Shopping: área andável (verde), closes (rosa), pontos da história (amarelo) e a Line e a Bell em escala")
    w("#### 22.11.1 Novo pedido: o shopping em peças (chão e teto + cada item separado)")
    w()
    w("> 🧩 **Decisão:** o Minas Shopping deixa de ser uma ilustração única. A ilustração atual (item 140) continua no jogo até as peças chegarem, mas tem o problema da mesa desenhada no fundo: as personagens não conseguem passar atrás de nada, e a mesa do BK ficava em cima da mesa redonda (seção 23.5). Com as peças separadas, o jogo monta o shopping como monta a casa da fazenda: a Line e a Bell passam na frente e atrás de cada móvel, e cada coisa pode mudar de lugar.")
    w()
    w("**1. A base: só o chão e o teto.** Mesmo tamanho e mesma proporção de hoje (entrega de **2160×3840**, 144 px por tile), sem nenhuma loja, móvel, planta ou enfeite:")
    w()
    w("- o **piso** inteiro (o xadrez de losangos rosa e creme, com os reflexos de luz), cobrindo toda a área andável;")
    w("- o **teto** e a estrutura do alto, na faixa de cima (y 0 a 130 da base): vigas, luzes embutidas e o vão do andar de cima, sem as lojas do fundo;")
    w("- sem sombras de objetos no chão (cada peça traz a própria sombra).")
    w()
    w("**2. Cada item em arte individual.** Um PNG por peça, com transparência, recortado no contorno, na mesma escala da base (1 tile = 144 px; a Line de pé = 281 px) e na mesma perspectiva de cima em 3/4. Pode vir num HTML de item com `data-name=\"SHOP_NOME.png\"`, igual aos itens 154 a 187 (o `tools/extrair_objetos.py` já lê o prefixo `SHOP_`).")
    w()
    w("| # | Código | Peça | Tamanho aproximado (tiles) | Observação |")
    w("|---|---|---|---|---|")
    for n, linha in enumerate([
        ("SHOP_BURGER_KING", "Fachada do Burger King: letreiro, toldo, balcão e cardápio luminoso", "3 × 3", "é para onde as duas olham antes do lanche"),
        ("SHOP_CONFEITARIA", "Fachada da confeitaria: placa de cupcake, toldo listrado", "3,5 × 4,5", "sem a vitrine (vem separada)"),
        ("SHOP_VITRINE_BOLOS", "Vitrine refrigerada de bolos e doces", "2,5 × 1,5", "com luz por dentro"),
        ("SHOP_CAFETERIA", "Fachada da cafeteria: placa da xícara, balcão, máquinas de café", "3 × 5", ""),
        ("SHOP_ESCADA_ROLANTE", "Escada rolante dupla (subindo e descendo)", "2 × 4", "de preferência animada: 4 a 6 quadros dos degraus andando"),
        ("SHOP_MEZANINO", "Guarda-corpo de vidro do andar de cima, com corações", "peça de 4 × 1 que se repete", "vem em pedaços que encaixam lado a lado"),
        ("SHOP_PILAR", "Pilar rosa com corações", "1 × 6", "fica na frente das personagens quando elas passam atrás"),
        ("SHOP_CORACAO_NEON", "Coração de neon", "1,5 × 1,5", "aceso e apagado (dois PNGs) para piscar"),
        ("SHOP_ARVORE_CANTEIRO", "Árvore no canteiro grande de madeira", "2,5 × 3,5", "a do centro do shopping"),
        ("SHOP_CANTEIRO_RETANGULAR", "Canteiro de madeira comprido com plantas e flores", "3 × 1,5", ""),
        ("SHOP_CANTEIRO_QUADRADO", "Canteiro de madeira pequeno com flores", "1,5 × 1,5", ""),
        ("SHOP_CANTEIRO_CANTO", "Canteiro de canto (em L) com folhagens", "2 × 2", ""),
        ("SHOP_LANTERNA", "Lanterna de madeira no chão (poste de luz)", "0,5 × 1,3", "acesa"),
        ("SHOP_LUMINARIA", "Luminária pendente de globo", "0,5 × 1", "pendurada; o jogo põe no alto"),
        ("SHOP_MESA_REDONDA", "Mesa redonda de mármore, sem nada em cima", "1,4 × 1,1", "a mesa do encontro"),
        ("SHOP_VASO_MESA", "Vasinho de flores para cima da mesa", "0,4 × 0,4", ""),
        ("SHOP_BANDEJA_BK", "Bandeja do BK: dois lanches, batata e dois refris", "0,7 × 0,4", "vai em cima da mesa redonda no lanche"),
        ("SHOP_POLTRONA_ROSA", "Poltrona rosa", "1 × 1,3", "4 lados: de frente, de costas, virada para a esquerda e para a direita"),
        ("SHOP_CADEIRA_VERDE", "Cadeira verde-água", "1 × 1,3", "4 lados"),
        ("SHOP_SOFA_MEIA_LUA", "Sofá vermelho em meia-lua (booth)", "3 × 1,5", ""),
        ("SHOP_PUFE", "Banco/pufe vermelho", "1,5 × 0,8", ""),
        ("SHOP_LIXEIRA", "Lixeira", "0,5 × 0,8", ""),
        ("SHOP_PLACA", "Placa de direção (Saída, Banheiros, Praça de alimentação)", "0,8 × 1,5", ""),
        ("SHOP_BANCO_ESPERA", "Banco de espera", "2 × 1", ""),
    ], 1):
        w(f"| {n} | `{linha[0]}` | {linha[1]} | {linha[2]} | {linha[3] or '—'} |")
    w()
    w("**3. O lanche sentadas.** Com a mesa redonda e as poltronas separadas, a cena do BK fica certa com as duas **sentadas nas poltronas**, comendo. Para isso faltam duas animações: `LINE_SIT_CHAIR_EAT` e `BELL_SIT_CHAIR_EAT` (sentada de lado numa poltrona, comendo e rindo, sem mesa e sem poltrona no desenho; a Line virada para a direita e a Bell para a esquerda). Até lá o jogo usa `LINE_BELL_BK`, que já traz a mesa delas.")
    w()
    escrever_dimensoes_cenarios(w, img, M)
    w("### 22.10 Ordem sugerida para produzir")
    w()
    w("1. **Bell jogável** (guarda, estrela, leque, canção, dano, queda) — é o que a jogadora mais vê na Parte 2.")
    w("2. **Os sete chefes** (parado, ataque genérico, cansado, derrota) — depois os golpes um a um.")
    w("3. **Tiles das fases novas** (chão, paredes, lama, vento, abismo de céu) e os objetos de puzzle (cristais de terra, pérolas, faróis).")
    w("4. **Moradores** (Cora, Tião, Brisa e os do vilarejo) e o **dragão amigo**.")
    w("5. **Armaduras** das duas (parada/andar/correr primeiro).")
    w("6. **Retratos** que faltam, ícones de itens e documentos, interface e efeitos.")
    w()


# ---------------------------------------------------------------------------------------------
# Tamanho de cada imagem. O jogo mostra 400 unidades de altura do mundo na tela (ALTURA_VISTA):
# escala = altura da tela em pixels ÷ 400 (em telas retina o navegador dobra, até 2×).
ESCALAS = [("Janela 1280×720", 1.8), ("Tela cheia 1080p", 2.7), ("Tela cheia 1440p", 3.6), ("4K ou retina", 5.4)]

# (grupo, elemento, largura e altura no mundo, recomendado para desenhar, mínimo, observação)
TAMANHOS = [
    ("Personagens", "Line, Bell e as duas juntas (cada quadro)", (74, 74), "512×512", "400×400", "corpo de pé com uns 62 de altura (≈ 85% do quadro), pés sempre na mesma linha. Os 1254×1254 que chegam hoje estão ótimos"),
    ("Personagens", "Line e Bell com armadura", (74, 74), "512×512", "400×400", "mesmo quadro e mesma posição dos pés da versão sem armadura"),
    ("Personagens", "Moradores (Rosa, Bento, Zé, Lurdes, Tobias, Cora, Tião, Brisa) e Mago", (74, 74), "512×512", "400×400", "adulto uns 56 de altura, o Pedrinho uns 42: no mesmo quadro da Line, para ficarem na proporção certa"),
    ("Personagens", "Espírito das Ruínas", (90, 110), "512×640", "400×500", "flutua; deixe espaço embaixo para o brilho"),
    ("Chefes", "Dragão Vermelho (cada quadro)", (215, 215), "1024×1024", "640×640", "o maior desenho do jogo; asas abertas cabem no quadro"),
    ("Chefes", "Colosso, Serpente, Grifo, Titã de Magma, Hidra, Tempestade", (200, 200), "1024×1024", "640×640", "um quadro por pose; o Grifo de asas abertas usa o quadro todo"),
    ("Chefes", "Quimera Primordial", (200, 200), "1280×1280", "800×800", "maior e mais detalhada: pode passar da borda do quadro nos golpes"),
    ("Chefes", "Guardião de Pedra", (110, 110), "640×640", "384×384", ""),
    ("Inimigos", "Sombra, fogos-fátuos (todos os elementos), morcego", (64, 64), "384×384", "256×256", "o bicho ocupa uns 60% do quadro; o resto é brilho"),
    ("Bichos", "Vaca, cavalo", (150, 150), "640×640", "384×384", "vaca uns 71 de altura e cavalo uns 90 (a Line tem 62)"),
    ("Bichos", "Theo, porco, ovelha, gato, pato, galinhas", (72, 72), "384×384", "256×256", "galinha uns 47 de altura, porco e ovelha uns 48, Theo uns 36, pato uns 34, gato uns 31. Andar e correr com as pernas alternando, uma depois da outra"),
    ("Bichos", "Pintinho", (62, 62), "384×384", "256×256", "uns 27 de altura: pode vir no mesmo quadro da galinha, bem menor"),
    ("Cenário", "Tile de chão, parede, água, lama, vento, abismo", (32, 32), "128×128", "96×96", "tem que emendar sem costura dos 4 lados; faça 3 ou 4 variações de cada"),
    ("Cenário", "Árvores (normal, frutífera, cerejeira, pinheiro, árvore morta do pântano)", (62, 75), "384×448", "256×300", "hoje são 97×115: ficam borradas em tela cheia"),
    ("Cenário", "Arbustos, pedras, mato alto, flores", (33, 33), "192×192", "128×128", "hoje uns 55×55"),
    ("Cenário", "Casa da fazenda", (264, 150), "1440×816", "720×408", "hoje 501×280: a arte que mais precisa de resolução"),
    ("Cenário", "Celeiro, casas do vilarejo, casa da Cora e do Tião", (244, 150), "1280×800", "660×400", "a casa ocupa um bloco de 7×5 tiles"),
    ("Cenário", "Galinheiro, carroça, barco, píer", (114, 70), "640×384", "320×192", ""),
    ("Cenário", "Poço, moinho, fonte, bigorna, estação do carrinho", (54, 70), "320×384", "160×192", ""),
    ("Cenário", "Baú, placa, barril, lampião, caixa, poste do gancho", (32, 40), "192×224", "96×112", "o baú precisa de 2 poses: fechado e aberto"),
    ("Cenário", "Cristal, tocha, farol do vento, pérola-cristal (apagado e aceso)", (32, 64), "192×384", "96×192", "o aceso pode ter 4 a 6 quadros de brilho"),
    ("Cenário", "Pilar, altar, pilares dos elementos", (32, 80), "192×448", "96×224", ""),
    ("Cenário", "Barreira de luz, de raízes, parede de água, muro de vento (por tile)", (32, 48), "192×256", "96×128", "emenda lado a lado"),
    ("Cenário", "Jaula da Bell", (70, 90), "384×512", "192×256", ""),
    ("Efeitos", "Impacto, faíscas, poeira, fumaça, brasas, lágrimas", (140, 140), "768×768", "384×384", "o desenho fica no meio; o resto do quadro é transparente"),
    ("Efeitos", "Explosão, ponto fraco do dragão, corações", (300, 300), "1024×1024", "640×640", "explosão é o maior efeito"),
    ("Efeitos", "Projéteis (estrela da Bell, luz, fogo, água, lama, pena, rocha)", (24, 24), "128×128", "64×64", "com o brilho em volta"),
    ("Efeitos", "Aviso no chão (círculo de raiz, raio, bolha, poça de lava, poça de lama)", (96, 96), "512×512", "256×256", "visto de cima, achatado"),
]

INTERFACE = [
    ("Retratos dos diálogos (cada expressão)", "108×108 na tela (76×76 no celular)", "512×512", "256×256"),
    ("Ícones dos itens, documentos e armaduras", "30×30 na mochila, 24×24 no HUD", "128×128", "64×64"),
    ("Corações, escudos, gotas de magia, moeda", "de 18 a 50 px, conforme a tela", "128×128", "64×64"),
    ("Botões de toque (atacar, pular, 🔄…)", "62×62 (celular)", "192×192", "128×128"),
    ("Relógio e moldura do HUD, barra de chefe", "a barra tem até metade da largura da tela", "1600×64 (barra) · 256×64 (relógio)", "800×32 · 128×32"),
    ("Fundos de tela cheia (título, Parte 2, capítulos, fundos do prólogo)", "a tela inteira", "3840×2160", "1920×1080"),
    ("Fundos do prólogo com close", "a câmera aproxima até 1,6×", "3840×2160, sem nada importante a menos de 10% da borda", "2560×1440"),
    ("Mapa do mundo (pergaminho)", "até 900 px de largura na janela da mochila", "2400×1500", "1600×1000"),
]


def escrever_tamanhos(w):
    w("### 22.0 Tamanho de cada imagem (pensando na tela cheia)")
    w()
    w("O jogo sempre mostra **400 unidades de altura** do mundo na tela e aumenta tudo para caber. Por isso o tamanho de cada coisa depende da tela: em **tela cheia num monitor 1080p** tudo aparece **2,7×** maior que no mundo; num monitor **4K** ou num notebook **retina** em tela cheia, **5,4×**. Uma imagem menor que isso é esticada e fica borrada.")
    w()
    w("- **Recomendado:** nítido até em 4K ou retina em tela cheia.")
    w("- **Mínimo:** nítido em tela cheia 1080p (o caso mais comum no PC).")
    w("- No celular deitado o jogo usa uns 780 px de altura (escala ≈ 2×), então o mínimo já basta.")
    w("- Uma unidade do mundo equivale a 1 pixel do tile de 32×32: um tile tem 32 unidades.")
    w()
    cab = " | ".join(n for n, _ in ESCALAS)
    w(f"| Grupo | Imagem | No mundo (L×A) | {cab} | **Recomendado** | Mínimo | Observação |")
    w("|---|---|---|" + "---|" * len(ESCALAS) + "---|---|---|")
    for grupo, nome, (lw, la), rec, minimo, obs in TAMANHOS:
        telas = " | ".join(f"{round(lw * k)}×{round(la * k)}" for _, k in ESCALAS)
        w(f"| {grupo} | {nome} | {lw}×{la} | {telas} | **{rec}** | {minimo} | {obs} |")
    w()
    w("**Interface** (estes não crescem com o mundo, crescem com a tela e com a densidade de pixels):")
    w()
    w("| Imagem | Tamanho na tela | **Recomendado** | Mínimo |")
    w("|---|---|---|---|")
    for nome, tela, rec, minimo in INTERFACE:
        w(f"| {nome} | {tela} | **{rec}** | {minimo} |")
    w()
    w("**Regras que valem para todas:** fundo transparente de verdade (PNG), sem sombra no chão (o jogo desenha), todos os quadros de uma animação do mesmo tamanho, com os pés na mesma linha, e as animações de lado viradas para a direita.")
    w()
    w("> ⚙️ **Observação técnica:** hoje o jogo guarda cada quadro dos personagens em 256×256 e cada quadro do dragão em 448×448. Isso fica nítido até 1440p. Para aproveitar a arte em 4K e retina, dá para subir esses tamanhos (pede só gerar as folhas de novo), com o custo de o jogo carregar um pouco mais devagar.")
    w()


# ---------------------------------------------------------------------------------------------
PARTE_DE = {"fazenda": "Parte 1", "vilarejo": "Parte 1", "floresta": "Parte 1", "gruta": "Parte 1", "ruinas": "Parte 1", "montanha": "Parte 1", "covil": "Parte 1",
            "vale": "Parte 2", "fenda": "Parte 2", "lago": "Parte 2", "pantano": "Parte 2", "picos": "Parte 2", "tempestade": "Parte 2", "coracao": "Parte 2"}
ORDEM_AREAS = ["fazenda", "vilarejo", "floresta", "gruta", "ruinas", "montanha", "covil", "vale", "fenda", "lago", "pantano", "picos", "tempestade", "coracao"]


def escrever_dimensoes_cenarios(w, img, M):
    import math
    mapas = M["mapas"]
    w("### 22.12 Dimensão de cada cenário")
    w()
    w("Cada fase do jogo é uma **grade de tiles** de 32×32 unidades do mundo. A arte do cenário pode chegar de dois jeitos, e as medidas abaixo valem para os dois:")
    w()
    w("- **Jeito A — tiles e objetos (recomendado para as fases):** cada tile de chão, parede, água e afins em **128×128 px** (mínimo 96×96), emendando dos 4 lados, mais os objetos soltos (árvores, casas, baús…) nos tamanhos da seção 22.0. O jogo monta o mapa sozinho a partir da planta. É o jeito mais leve e o que deixa mudar a fase depois sem redesenhar.")
    w("- **Jeito B — cenário pintado inteiro:** uma pintura da fase inteira, na escala de **128 px por tile** (4 px por unidade do mundo). Como fica grande demais para uma imagem só, ela é entregue em **blocos de 2048×2048 px** (16×16 tiles cada), sem sobreposição, com o nome `cenario_<fase>_<coluna>_<linha>.png` contando a partir de 0 no canto de cima à esquerda. Os blocos da última coluna e da última linha ficam menores (o que sobrar). Tudo o que é alto (árvores, casas, pilares) vai numa **camada da frente**, com os mesmos blocos e transparência no resto, para as personagens passarem atrás.")
    w()
    w("O **gabarito** de cada fase (a planta, em `arte/referencias/gabaritos/<fase>.png`, 32 px por tile) mostra a grade, o que é chão (verde), caminho (bege), parede ou mata (escuro), água (azul), lava (laranja), abismo (preto), lama (marrom), vento (branco) e cada objeto (quadradinho colorido), além das **saídas** (verde) e da divisão dos **blocos** de 2048 px (rosa). É só ampliar 4× para ter a medida da entrega. O ponto rosa é onde a heroína chega. Gerado por `tools/gabaritos_mapas.py`.")
    w()
    w("| Fase | Parte | Grade (tiles) | Mundo (unidades) | **Pintura inteira (128 px/tile)** | Mínimo (96 px/tile) | Blocos de 2048 px | Gabarito |")
    w("|---|---|---|---|---|---|---|---|")
    for id_ in ORDEM_AREAS:
        m = mapas.get(id_)
        if not m:
            continue
        tw, th = m["w"], m["h"]
        bc, bl = math.ceil(tw / 16), math.ceil(th / 16)
        w(f"| **{m['nome']}** | {PARTE_DE.get(id_, '')} | {tw}×{th} | {tw * 32}×{th * 32} | **{tw * 128}×{th * 128}** | {tw * 96}×{th * 96} | {bc}×{bl} = {bc * bl} | `gabaritos/{id_}.png` |")
    w()
    w("**Cenas do primeiro encontro (prólogo):** não são grades, são **ilustrações únicas** em pé, sempre na base de 360×640 (9:16), porque as posições da história foram marcadas nessa base (veja a seção 22.11):")
    w()
    w("| Cena | Base | **Entrega recomendada** | 4K | Mínimo | Observação |")
    w("|---|---|---|---|---|---|")
    w("| Minas Shopping (item 140) | 360×640 | **2160×3840** | 2880×5120 | 1440×2560 | gabarito pronto: `arte/referencias/gabarito_minas_shopping_2160x3840.png` |")
    w("| Playground | 360×640 | **2160×3840** | 2880×5120 | 1440×2560 | hoje é desenhado no código; a máquina de soco fica em (204,315) da base e vem à parte (é a da animação `LINE_PUNCH_MACHINE`) |")
    w("| Túnel | 360×640 | **2160×3840** | 2880×5120 | 1440×2560 | o beijo acontece perto de (193,520) da base, com câmera 1,6× |")
    w()
    w("**Telas inteiras** (título, “Parte 2”, capítulos, fim): 3840×2160 (16:9), mínimo 1920×1080, com o importante longe das bordas (em celular a tela corta um pouco dos lados).")
    w()
    w("**Por que 128 px por tile:** em tela cheia num monitor 1080p um tile aparece com 86 px e em 1440p com 115 px, então 128 fica nítido nos dois; em 4K ou retina (173 px) ainda fica bom. Com 96 px fica nítido em 1080p.")
    w()
    for id_ in ORDEM_AREAS:
        if id_ in mapas:
            img(f"gabarito-{id_}", f"Gabarito: {mapas[id_]['nome']} ({mapas[id_]['w']}×{mapas[id_]['h']} tiles)")
