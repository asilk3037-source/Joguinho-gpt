#!/usr/bin/env python3
"""Gera docs/LINE_E_BELL_DOCUMENTACAO.md a partir do estado atual do jogo.

Precisa de dois arquivos JSON exportados do jogo rodando (ver docs/README na seção
"Como atualizar este documento"):
  - inventario.json: catálogo de animações (LB.inventario() + dados de cada sprite)
  - roteiro.json: falas, títulos, balões e animações de cada cena (tools/extrair_roteiro)

Uso: python3 tools/gerar_documentacao.py inventario.json roteiro.json
"""
import json
import os
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(RAIZ, "docs", "LINE_E_BELL_DOCUMENTACAO.md")

inv = json.load(open(sys.argv[1], encoding="utf-8"))
rot = json.load(open(sys.argv[2], encoding="utf-8"))

L = []
def w(s=""):
    L.append(s)

def img(nome, legenda):
    w(f"![{legenda}](imagens/{nome}.jpg)")
    w(f"*{legenda}*")
    w()

ROSTO = {"neutro": "neutro", "sorriso": "sorrindo", "riso": "rindo", "surpresa": "surpresa", "apaixonada": "apaixonada",
         "maroto": "marota", "bravo": "brava", "chorando": "chorando", "envergonhada": "envergonhada"}

def roteiro(cena, mostrar_anim=True):
    for tipo, quem, texto, rosto in rot.get(cena, []):
        if tipo == "fala":
            r = f" *({ROSTO.get(rosto, rosto)})*" if rosto else ""
            w(f"> **{quem or 'Narração'}**{r}: {texto}  ")
        elif tipo == "tutorial":
            w(f"> 🎮 *Tutorial na tela:* {texto}  ")
        elif tipo == "titulo":
            w(f"> 🎬 **Título na tela:** {quem}{' — ' + texto if texto else ''}  ")
        elif tipo == "balao":
            w(f"> 💬 *Balão:* “{texto}”  ")
        elif tipo == "anim" and mostrar_anim:
            w(f"> ▶ `{texto}`  ")
    w()

# Totais do catálogo.
tot = sum(len(g["itens"]) for g in inv["grupos"])
prontas = sum(i["existe"] for g in inv["grupos"] for i in g["itens"])
subst = sum(1 for g in inv["grupos"] for i in g["itens"] if not i["existe"] and i["via"])
faltam = tot - prontas

# =====================================================================
w("# Line & Bell — Documentação completa do jogo")
w()
w("> ⚠️ **Aviso importante: todas as animações e artes usadas hoje são TEMPORÁRIAS.**")
w("> Elas estão no jogo só para dar vida à aventura enquanto a criação da arte final não termina.")
w("> Quando cada animação definitiva ficar pronta, ela substitui a temporária com o mesmo código.")
w("> Isso vale para os sprites, os retratos, o cenário e os desenhos feitos no código.")
w()
img("01-menu", "Tela inicial, com a escolha de dificuldade")
w("**Jogar:** https://line-e-bell.vercel.app · **Código:** pasta `game/` deste repositório")
w()
w("## Sumário")
w()
secoes = ["1. Visão geral", "2. Personagens", "3. A história", "4. Roteiro completo, cena a cena", "5. As fases",
          "6. Como se joga", "7. Inimigos e chefes", "8. Lista completa de animações", "9. Retratos dos diálogos",
          "10. Cenário e objetos", "11. Efeitos visuais", "12. Como mandar arte nova", "13. Estrutura técnica"]
for s in secoes:
    ancora = s.lower().replace(" ", "-").replace(".", "").replace(",", "")
    for a, b in (("ã", "a"), ("á", "a"), ("â", "a"), ("é", "e"), ("ê", "e"), ("í", "i"), ("ó", "o"), ("ô", "o"), ("õ", "o"), ("ú", "u"), ("ç", "c")):
        ancora = ancora.replace(a, b)
    w(f"- [{s}](#{ancora})")
w()

# =====================================================================
w("## 1. Visão geral")
w()
w("**Line & Bell** é uma aventura de ação vista de cima, para navegador (PC e celular). A Line e a Bell são namoradas e vivem numa fazendinha com o cachorro Theo. Um dragão leva a Bell, e a Line atravessa uma floresta, ruínas mágicas e uma montanha de lava para resgatá-la.")
w()
w("| | |")
w("|---|---|")
w("| Gênero | Aventura / ação com exploração, visão de cima |")
w("| Plataformas | Navegador no PC (teclado ou controle) e no celular (toque) |")
w("| Duração | Cerca de 30 a 45 minutos |")
w("| Áreas | 5: Fazendinha, Floresta Sussurrante, Ruínas Encantadas, Montanha de Brasa e Covil do Dragão |")
w("| Chefes | Guardião de Pedra e o Dragão Vermelho |")
w("| Dificuldade | Fácil, Normal ou Difícil (menu inicial e pausa) |")
w("| Salvamento | Automático, no navegador, ao entrar em cada área e nas fontes |")
w(f"| Animações catalogadas | **{tot}**: {prontas} com arte (temporária), {subst} usando uma substituta, {faltam - subst} desenhadas no código ou sem imagem |")
w()

# =====================================================================
w("## 2. Personagens")
w()
w("### Line")
w("Protagonista. É fazendeira, corajosa e brincalhona, de boné preto, cabelo longo e roupa preta. Aprende a lutar com espada e, nas ruínas, a usar magia de luz. Nos diálogos tem 8 expressões.")
w()
img("arte-line", "Line: algumas das animações atuais (temporárias)")
w("### Bell")
w("Namorada da Line: doce, risonha e mandona na medida certa. Usa óculos, blusa creme e short jeans. É levada pelo dragão no pôr do sol e fica presa numa jaula no covil.")
w()
img("arte-bell", "Bell: animações atuais (temporárias)")
w("### Line e Bell juntas")
w("As animações do casal aparecem nas cenas: mãos dadas, almoço, bitoquinha, dança, abraço do resgate e toca aqui.")
w()
img("arte-casal", "Animações do casal (temporárias)")
w("### Theo")
w("O shih-tzu da família. Late, pede comida, segue a Line pela fazenda depois de comer e fica esperando em casa durante a aventura.")
w()
w("### Bichos da fazenda")
w("Galinhas (brancas e marrons), pintinhos, vacas, cavalo e porcos já têm arte. Ovelhas, patos e o gato ainda são desenhados no código.")
w()
img("arte-bichos", "Theo e bichos da fazenda (temporários)")
w("### Mago")
w("Velho sábio da Floresta Sussurrante. Guarda a espada e explica o caminho. Hoje é uma imagem parada que respira e brilha.")
w()
w("### Espírito das Ruínas")
w("Voz antiga que mora no altar das Ruínas Encantadas e ensina a magia à Line. Ainda não tem visual próprio, só a luz do altar.")
w()
w("### Guardião de Pedra")
w("Chefe das ruínas: um golem de pedra com um cristal azul no peito. Desenhado no código por enquanto.")
w()
w("### Dragão Vermelho")
w("O vilão. Dormia havia cem anos, acorda, rapta a Bell e a leva para o covil no topo da Montanha de Brasa.")
w()
img("arte-dragao", "Dragão vermelho (temporário)")
w("### Criaturas")
w("- **Sombras:** criaturas escuras que surgem depois que a Line pega a espada. Investem contra ela e são fracas contra a luz.")
w("- **Fogos-fátuos:** luzinhas que flutuam, mantêm distância e atiram orbes. São azuis nas ruínas e de fogo na montanha.")
w()

# =====================================================================
w("## 3. A história")
w()
w("**Capítulo 1 — Nossa vidinha.** Amanhece na fazenda. A Bell acorda a Line, e as duas cuidam da fazenda: pegar os ovos, regar a horta, dar ração ao Theo e fazer carinho nos bichinhos. Depois vem o almoço juntas e o passeio de mãos dadas até o lago para ver o pôr do sol. Lá elas dançam e dão uma bitoquinha.")
w()
w("**O rapto.** O céu escurece, os bichos se assustam e um dragão vermelho mergulha do céu e leva a Bell. A Line corre atrás, grita por ela, chora e decide ir buscá-la. Pede ao Theo que cuide da fazenda.")
w()
w("**Capítulo 2 — A floresta.** Na Floresta Sussurrante, um mago conta que o dragão acordou depois de cem anos e entrega uma espada guardada num baú. Sombras aparecem. Espinhos fecham o caminho do norte, e a espada abre passagem.")
w()
w("**Capítulo 3 — Magia.** O dragão selou a montanha com magia antiga. Nas Ruínas Encantadas, o Espírito das Ruínas ensina a Line a lançar luz pela espada. Ela acende cristais para desfazer barreiras, encontra um coração extra e enfrenta o Guardião de Pedra. Vencido, ele entrega a Chuva de Estrelas.")
w()
w("**Capítulo 4 — A montanha.** Na Montanha de Brasa, a Line pula fendas, desvia de lava e acende três tochas antigas para abrir o portão de fogo do covil.")
w()
w("**Capítulo 5 — O covil.** A Bell está presa numa jaula e o dragão pousa para lutar. Quando ele cansa, o peito brilha: é o ponto fraco. A Line vence, dá o golpe final e liberta a Bell. As duas se abraçam.")
w()
w("**Epílogo.** De volta à fazenda, no pôr do sol do lago, as duas dançam. Aparece “Fim”… e, no escuro, um olho de dragão se abre: “Fim?”.")
w()

# =====================================================================
w("## 4. Roteiro completo, cena a cena")
w()
w("Todas as falas estão exatamente como aparecem no jogo. Entre parênteses está a expressão do retrato. As linhas com ▶ indicam a animação que toca naquele momento: o código é o mesmo da lista da seção 8.")
w()
CENAS = [
    ("manha", "4.1 Manhã na fazenda", "Começa ao escolher **Novo jogo**. A Line sai de casa e a Bell a espera no quintal.", "02-manha"),
    (None, "4.2 As tarefas do dia", "Parte jogável. O painel no canto mostra as tarefas: **pegar 4 ovos** no galinheiro, **pegar o regador** no poço e **regar os 4 canteiros**, **pegar a ração** no celeiro e **pôr na tigela do Theo**, e **fazer carinho em 3 bichinhos**. A Bell segue a Line e comenta cada tarefa com balões.", "03-tarefas-galinhas"),
    ("almoco", "4.3 Almoço", "Quando todas as tarefas terminam, as duas dão um toca aqui e almoçam juntas na mesa do quintal.", "05-almoco"),
    (None, "4.4 A tarde de mãos dadas", "Parte jogável: a Line anda de mãos dadas com a Bell até o lago.", "04-pasto"),
    ("porDoSol", "4.5 Pôr do sol e o rapto", "No píer do lago. Esta é a cena mais longa do jogo.", "06-por-do-sol-danca"),
    ("floresta", "4.6 Chegada na floresta", "Primeira vez na Floresta Sussurrante.", "09-floresta-mago"),
    ("mago", "4.7 O Mago", "Ao conversar com o Mago. A primeira conversa conta a história, a segunda (depois da espada) aponta para as ruínas e as seguintes sorteiam uma dica.", None),
    ("espinhos", "4.8 Espinhos sem espada", "Ao chegar perto dos espinhos do norte sem a espada.", None),
    ("espada", "4.9 A espada", "Ao abrir o baú ao lado do Mago.", "10-espada"),
    ("ruinas", "4.10 Chegada nas Ruínas Encantadas", "", "12-ruinas-entrada"),
    ("altar", "4.11 O altar da luz", "Ao tocar a luz do altar, na sala a oeste do salão de entrada.", "13-altar-magia"),
    ("golem", "4.12 O Guardião desperta", "Ao se aproximar do Guardião, no salão norte das ruínas.", "16-guardiao-acorda"),
    ("golemVencido", "4.13 O Guardião vencido", "", "19-chuva-de-estrelas"),
    ("montanha", "4.14 Chegada na Montanha de Brasa", "", "20-montanha"),
    ("portaoAberto", "4.15 O portão se abre", "Quando a terceira tocha acende.", "21-tocha-na-lava"),
    ("bauCoracao", "4.16 Baú de coração extra", "Há dois: um na alcova leste das ruínas e outro na plataforma cercada de fendas na montanha.", None),
    ("covil", "4.17 O covil do dragão", "Na primeira vez a cena é completa. Nas próximas tentativas, a luta começa direto.", "22-covil-dragao"),
    ("vitoria", "4.18 Vitória e epílogo", "Depois do golpe final.", "24-epilogo"),
]
for chave, titulo, intro, foto in CENAS:
    w(f"### {titulo}")
    w()
    if intro:
        w(intro)
        w()
    if foto:
        img(foto, titulo.split(" ", 1)[1])
    if chave:
        roteiro(chave)
    if chave == "mago":
        w("**Falas sorteadas do Mago** (mudam conforme o progresso):")
        w()
        for f in rot.get("mago_aleatorias", []):
            w(f"- “{f}”")
        w()
    if chave == "porDoSol":
        img("07-bitoquinha", "A bitoquinha no lago")
        img("08-rapto", "O dragão leva a Bell")

w("### 4.19 Placas")
w()
PLACAS = [
    ("Floresta, perto das raízes", "Cuidado com as raízes! Correndo por cima delas você pode tropeçar. Ande devagar (solte o correr)."),
    ("Floresta, antes do riacho", "Riacho à frente. Para atravessar, pule! (Espaço ou botão Pular). Correndo, o pulo vai mais longe."),
    ("Ruínas, salão de entrada", "Ruínas Encantadas. Só a luz atravessa as barreiras. O altar da luz fica na sala a oeste."),
    ("Montanha, início", "Fendas na rocha! Pule para atravessar (Espaço). Correndo, o pulo vai mais longe."),
    ("Montanha, fonte", "Fonte das brasas: beba para recuperar vida e magia. Se cair, você volta para cá."),
]
w("| Onde | Texto |")
w("|---|---|")
for o, t in PLACAS:
    w(f"| {o} | {t} |")
w()
w("### 4.20 Balões dos bichos e da Bell (na fazenda)")
w()
for b in ["Cocoricóóó! (galo, de manhã)", "Au! / Au! Au! / Au! Au! ♥ / Auuu~ (fome) / Auuu... / AU! AU! AU! (Theo)", "Piu! (pintinhos)",
          "Quatro ovinhos! Vai ter bolo hoje. (Bell)", "Rega as cenouras com carinho! (Bell)", "A horta tá feliz. E eu também! (Bell)",
          "O Theo já tá sentindo o cheiro! (Bell)", "Os bichinhos te amam. Eu entendo eles. (Bell)"]:
    w(f"- {b}")
w()
w("### 4.21 Dicas que aparecem durante o jogo")
w()
DICAS = [
    ("Primeiros passos", "WASD ou setas para andar, Shift para correr, E para interagir. As tarefas ficam no canto da tela."),
    ("Tarde", "Leve a Bell até o lago, de mãos dadas."),
    ("Depois do rapto", "Siga pelo caminho ao norte, até a floresta. (Shift para correr)"),
    ("Sem espada", "A Line ainda não tem uma arma. Explore a floresta!"),
    ("Raízes", "Ops! Correndo sobre raízes a Line tropeça. Atravesse andando."),
    ("Água", "Caiu na água! Pule (Espaço) para atravessar o riacho."),
    ("Fenda", "Caiu na fenda! Pule (Espaço) para atravessar. Correndo, o pulo vai mais longe."),
    ("Sem magia", "A Line ainda não sabe magia. Dizem que as Ruínas Encantadas guardam uma luz antiga..."),
    ("Sem mana", "Sem magia! Ela volta sozinha aos poucos, e os cristais azuis que os inimigos soltam recarregam."),
    ("Barreira", "Uma barreira de luz se desfez! Acenda todos os cristais de cada sala para abrir caminho."),
    ("Fonte", "Vida e magia renovadas! Se a Line cair nesta área, ela volta para esta fonte."),
    ("Guardião", "Acerte o cristal do peito com a magia (Q) para abrir a guarda. Pule a onda do pisão!"),
    ("Guardião, espada na pedra", "Clang! A espada não arranha a pedra. Acerte o cristal do peito com a magia (Q) para abrir a guarda!"),
    ("Guardião tonto", "O cristal rachou e o guardião ficou tonto! Agora a espada funciona: ataque!"),
    ("Guardião, cristal recarregando", "O cristal do guardião ainda está brilhando forte. Desvie e tente de novo daqui a pouco!"),
    ("Dragão: fogo", "Fogo! Saia da frente ou esquive (L/C). Defender não segura as chamas."),
    ("Dragão: fogo em círculo", "Fogo em círculo! Fique colada no dragão ou esquive através das chamas."),
    ("Dragão: cauda", "Golpe de cauda! Pule (Espaço) quando o anel laranja piscar forte, ou corra para longe."),
    ("Dragão: mergulho", "Ele vai mergulhar! Corra da sombra dele ou pule no último instante."),
    ("Dragão: ponto fraco", "O dragão está atordoado! Ataque o ponto fraco brilhando no peito dele."),
    ("Dragão: fim", "O dragão não aguenta mais! Chegue perto e aperte ATACAR para o golpe final."),
]
w("| Quando | Texto |")
w("|---|---|")
for o, t in DICAS:
    w(f"| {o} | {t} |")
w()

# =====================================================================
w("## 5. As fases")
w()
w("### 5.1 Fazendinha")
w("Casa com varanda e duas chaminés, celeiro, galinheiro, horta, poço, moinho, pasto, chiqueiro, lago com píer e barco, varal, casinha do Theo, mesa de piquenique, árvores frutíferas e flores. Tem borboletas, pássaros, nuvens, folhas caindo e fumaça nas chaminés. De manhã, a luz é clara. À tarde, o céu fica alaranjado, e depois do rapto vira noite com vaga-lumes.")
w()
img("04-pasto", "Pasto com vacas, cavalo e ovelhas")
w("### 5.2 Floresta Sussurrante")
w("Trilha com raízes (correr sobre elas faz a Line tropeçar), riacho para pular, a clareira do Mago com o baú da espada, espinhos que fecham o norte e sombras depois que a espada é pega.")
w()
img("11-floresta-sombras", "Sombras na floresta")
w("### 5.3 Ruínas Encantadas (nova)")
w("Um templo antigo de pedra e musgo, organizado em salas:")
w()
w("- **Salão sul (entrada):**")
w("  - A placa, uma fonte e dois cristais que abrem a barreira do meio.")
w("  - A oeste fica a **sala do altar**, onde a Line aprende a magia.")
w("- **Salão do meio:**")
w("  - Dois lagos com um cristal numa ilhota em cada um. Eles só podem ser acesos de longe, com o Raio de Luz.")
w("  - Mais um cristal, pilares, sombras e fogos-fátuos.")
w("  - A leste fica uma **alcova com o baú de coração extra**, aberta por um cristal próprio.")
w("  - Tem uma fonte.")
w("- **Salão norte:** arena com pilares onde dorme o **Guardião de Pedra**. Vencido, ele desfaz a última barreira, que leva à montanha.")
w()
img("15-barreira-aberta", "Cristais acesos e barreira desfeita")
w("### 5.4 Montanha de Brasa (nova)")
w("Rocha vulcânica, rios de lava e brasas subindo:")
w()
w("- **Início:** uma fenda atravessa o caminho e precisa ser pulada. Ali fica a primeira tocha.")
w("- **Meio:**")
w("  - Lava dos dois lados.")
w("  - A **fonte das brasas**, que é o ponto de retorno.")
w("  - A segunda tocha, numa **ilha no meio da lava**, que só pode ser acesa de longe.")
w("- **Topo:**")
w("  - A terceira tocha, na praça central.")
w("  - Uma **plataforma cercada de fendas com o segundo baú de coração**.")
w("  - O **portão de fogo**, que abre com as três tochas acesas.")
w()
w("### 5.5 Covil do Dragão")
w("Caverna escura com lava nas laterais e estalagmites. A Bell fica numa jaula ao fundo. Quando a Line entra, a entrada desmorona e a luta começa.")
w()
img("23-dragao-fogo", "O dragão cospe fogo no covil")

# =====================================================================
w("## 6. Como se joga")
w()
w("### 6.1 Controles")
w()
w("| Ação | Teclado | Controle | Celular |")
w("|---|---|---|---|")
for l in [("Andar", "WASD / setas", "analógico", "arrastar no lado esquerdo"), ("Correr", "Shift (segurar)", "gatilho / analógico até o fim", "arrastar até o fim"),
          ("Atacar (3x = combo)", "J / Z", "A", "⚔"), ("Ataque giratório", "K / X", "X", "🌀"), ("Esquivar (correndo = dash)", "L / C", "B", "💨"),
          ("Defender (segurar)", "I / V", "LB", "🛡"), ("Pular (+ atacar no ar)", "Espaço", "Y", "⤴"), ("Magia: Raio de Luz", "Q / U", "RB", "✨"),
          ("Chuva de Estrelas", "segurar Q / U e soltar", "segurar RB", "segurar ✨"), ("Interagir / ler / abrir", "E / Enter", "Select", "botão que aparece"),
          ("Pausar", "Esc / P", "Start", "⏸"), ("Pular cena", "Tab", "—", "Pular cena")]:
    w("| " + " | ".join(l) + " |")
w()
w("### 6.2 Combate com espada")
w()
w("| Golpe | Animação | Dano | Observação |")
w("|---|---|---|---|")
w("| 1º golpe | `LINE_ATTACK_HORIZONTAL` | 1 | começa o combo |")
w("| 2º golpe | `LINE_ATTACK_VERTICAL` | 1 | apertar de novo durante o 1º |")
w("| 3º golpe | `LINE_ATTACK_COMBO` | 1 + 1 | acerta duas vezes |")
w("| Ataque correndo | `LINE_ATTACK_DIAGONAL` | 2 | com investida para frente |")
w("| Giro | `LINE_ATTACK_SPIN` | 2 | acerta em volta |")
w("| Ataque aéreo | `LINE_ATTACK_AIR` | 2 | pular + atacar, com onda de choque ao cair |")
w("| Golpe final | `LINE_DRAGON_FINAL_ATTACK` | — | só no fim da luta com o dragão |")
w()
w("- **Defesa:** segurar bloqueia golpes físicos (não bloqueia fogo). Leva a `LINE_BLOCK`.")
w("- **Esquiva e dash:** a Line fica invencível por um instante (`LINE_DODGE` e `LINE_DASH`).")
w("- **Guardar a espada:** depois de 4 segundos sem inimigos por perto, ela guarda a espada sozinha (`LINE_SWORD_SHEATHE`).")
w()
w("### 6.3 Magia")
w()
w("- **Raio de Luz** (aprendido no altar das ruínas):")
w("  - Custa 1 ◆.")
w("  - A mira vai sozinha no inimigo ou cristal mais perto à frente. O Guardião é mira certa.")
w("  - As sombras levam dano extra.")
w("  - Acende cristais e tochas e queima espinhos.")
w("- **Chuva de Estrelas** (depois de vencer o Guardião):")
w("  - Segurar o botão até a Line brilhar e soltar. Custa 3 ◆.")
w("  - Explosão em volta que atinge todos os inimigos e acende cristais e tochas próximos.")
w("- **Barra de magia:** 6 ◆ embaixo dos corações.")
w("  - Recarrega sozinha, cerca de 1 ◆ a cada 2,6 s no Normal.")
w("  - Os cristais azuis que os inimigos soltam dão +2 ◆.")
w()
img("14-raio-de-luz", "Raio de Luz acendendo um cristal")
img("18-carregando-estrelas", "Carregando a Chuva de Estrelas")
w("### 6.4 Vida, itens e progresso")
w()
w("- **Corações:**")
w("  - Começam em 3 (6 metades), e cada baú de coração extra dá mais 1.")
w("  - No Fácil, a Line ganha 1 coração a mais.")
w("  - Com 1 coração ou menos, ela fica com a animação de exausta.")
w("- **Coração no chão:** cura 1 coração. Às vezes cai dos inimigos.")
w("- **Cristal azul:** +2 ◆ de magia. Também cai dos inimigos.")
w("- **Fontes:** curam tudo, enchem a magia e viram ponto de retorno. Se a Line cair, ela volta para a última fonte bebida naquela área.")
w("- **Água e fendas:** cair tira meio coração e devolve a Line para o último lugar seguro.")
w("- **Salvamento automático:** ao entrar em cada área, ao abrir baús, acender cristais e beber das fontes. O botão **Continuar** retoma dali.")
w()
w("### 6.5 Dificuldade")
w()
w("| | Fácil 🌸 | Normal ⚔ | Difícil 🔥 |")
w("|---|---|---|---|")
w("| Vida dos chefes | 60% | 100% | 135% |")
w("| Velocidade dos ataques | mais lentos (1,35×) | normal | mais rápidos (0,85×) |")
w("| Corações extras | +1 | — | — |")
w("| Chance de cair coração | 55% | 35% | 20% |")
w("| Recarga da magia | 1,7× | 1× | 0,75× |")
w("| Guarda aberta do Guardião | +30% | normal | −20% |")
w("| Espada no Guardião com a guarda fechada | arranha um pouco | não | não |")
w()
w("A dificuldade fica salva no navegador e pode ser trocada a qualquer momento, também pela pausa.")
w()

# =====================================================================
w("## 7. Inimigos e chefes")
w()
w("### Sombra")
w("- **Vida:** 3.")
w("- **Comportamento:** vaga até ver a Line. Então persegue, se prepara e dá uma investida.")
w("- **Defesa:** bloquear a investida deixa a sombra tonta.")
w("- **Fraqueza:** leva dano extra da luz.")
w("- **Onde aparece:** na floresta (depois da espada), nas ruínas (depois da magia) e na montanha.")
w()
w("### Fogo-fátuo")
w("- **Vida:** 2.")
w("- **Comportamento:** flutua, mantém distância, se prepara brilhando e atira um orbe lento, que dá para pular ou bloquear.")
w("- **Onde aparece:** nas ruínas (azul) e na montanha (de fogo).")
w()
w("### Guardião de Pedra (chefe das ruínas)")
w("- **Vida:** 14 no Normal.")
w("- **Guarda:** a espada não fere a pedra. O Raio de Luz racha o cristal do peito e deixa o Guardião **tonto por 4,5 s**. Só então a espada funciona.")
w("- **Ataques:**")
w("  - **Pisão:** levanta os braços, com um círculo vermelho de aviso, e solta uma onda no chão. Precisa pular.")
w("  - **Arremesso de pedra:** uma por vez. Dá para desviar ou bloquear.")
w("- **Ajuda:** ao sair do atordoamento, ele solta um cristal de magia (e um coração, se a Line estiver fraca).")
w()
img("17-guardiao-tonto", "Guardião de Pedra durante a luta")
w("### Dragão Vermelho (chefe final)")
w("- **Vida:** 70 no Normal.")
w("- **Ataques:**")
w("  - **Garra:** círculo vermelho no chão antes do golpe.")
w("  - **Cauda:** anel laranja que precisa ser pulado.")
w("  - **Fogo em cone:** não dá para bloquear.")
w("  - **Voo e mergulho:** a sombra dele segue a Line.")
w("  - **Poeira.**")
w("  - **Fogo em círculo desesperado:** quando está com pouca vida.")
w("- **Ponto fraco:** depois de levar dano suficiente, ele fica atordoado e o peito brilha em azul. É o ponto fraco.")
w("- **Fim da luta:** aparece o botão **GOLPE FINAL**.")
w()

# =====================================================================
w("## 8. Lista completa de animações")
w()
w("> ⚠️ **Lembrete: toda a arte atual é temporária** e vai ser trocada pela versão final, mantendo o mesmo código.")
w()
w("Esta é a lista de **todas** as animações que o jogo usa ou vai usar. O código é o nome exato que a arte precisa ter para entrar sozinha no jogo. Animações de lado podem vir só viradas para a **direita**: o jogo espelha para a esquerda.")
w()
w("**Legenda do status:**")
w("- ✅ **Tem arte (temporária):** já aparece no jogo, mas ainda será trocada pela final.")
w("- 🔁 **Substituta:** ainda não tem arte própria. O jogo usa outra animação parecida no lugar (indicada na tabela).")
w("- ✏️ **Desenho no código:** ainda não tem arte. O jogo desenha uma forma provisória ou usa uma imagem parada.")
w()
w(f"**Resumo:** {tot} animações. ✅ {prontas} com arte temporária, 🔁 {subst} com substituta e ✏️ {faltam - subst} desenhadas no código.")
w()
w("| Grupo | Total | ✅ | 🔁 | ✏️ |")
w("|---|---:|---:|---:|---:|")
for g in inv["grupos"]:
    n = len(g["itens"]); e = sum(i["existe"] for i in g["itens"]); s = sum(1 for i in g["itens"] if not i["existe"] and i["via"])
    w(f"| {g['nome']} | {n} | {e} | {s} | {n - e - s} |")
w()
for g in inv["grupos"]:
    w(f"### 8.{inv['grupos'].index(g) + 1} {g['nome']}")
    w()
    w("| Código | O que é | Quadros | Loop | Status | Origem da arte atual |")
    w("|---|---|---:|:---:|---|---|")
    for i in g["itens"]:
        q = i["quadros"] if i["existe"] else (i.get("quadrosPedidos") or "")
        if i["existe"]:
            st = "✅ temporária"
        elif i["via"]:
            st = f"🔁 usa `{i['via']}`"
        else:
            st = "✏️ código / falta"
        loop = "sim" if i.get("loop") else ""
        fonte = (i.get("fonte") or "").replace("BELL_LINE_LABORATORIO_V7.html", "Laboratório v7").replace(".html", "")
        desc = (i.get("desc") or "").replace("|", "/")
        w(f"| `{i['codigo']}` | {desc}{' *(sugestão nova)*' if i.get('nova') else ''} | {q} | {loop} | {st} | {fonte} |")
    w()
w("*Na coluna Quadros, as animações ✅ mostram quantos quadros diferentes a arte atual tem. As que faltam mostram quantos quadros o jogo espera (é uma sugestão, pode vir com mais ou menos).*")
w()
w("### 8.12 O que ainda falta ter arte própria, por prioridade")
w()
w("**Aparecem na história (prioridade 1):**")
w("- **Bell:**")
w("  - `BELL_SCARED`, `BELL_CAPTURED` e `BELL_DRAGON_CARRIED`: assustada, capturada e carregada pelo dragão.")
w("  - `BELL_TRAPPED`, `BELL_CALL_LINE` e `BELL_ESCAPE_ATTEMPT`: presa na jaula, chamando a Line e tentando escapar.")
w("  - `BELL_BREAK_FREE`, `BELL_HAPPY` e `BELL_RELIEVED`: se libertando e feliz.")
w("  - Corrida de frente e de costas.")
w("- **Dragão:** `DRAGON_TAIL_ATTACK`, `DRAGON_CLAW_ATTACK` próprio, `DRAGON_STUNNED`, `DRAGON_FALL`, `DRAGON_DEFEATED`, `DRAGON_SLEEP` e `DRAGON_AIR_ATTACK`.")
w("- **Magia:** `LINE_CAST_SPELL`, `LINE_CAST_CHARGE` e `LINE_CAST_STARS`.")
w("- **Guardião de Pedra:** todos os `GOLEM_*`.")
w("- **Fogo-fátuo:** todos os `WISP_*`.")
w("- **Casal:** `LINE_BELL_HUG_RELEASE`, `LINE_BELL_SIT_DOWN` e `LINE_BELL_SIT_IDLE` (o epílogo no lago).")
w()
w("**Deixam o jogo mais bonito (prioridade 2):**")
w("- Sombras (`SHADOW_*`).")
w("- Line com a espada na mão andando e correndo (`LINE_COMBAT_WALK_*` e `LINE_COMBAT_RUN_*`).")
w("- Mago e Espírito das Ruínas.")
w("- Ovelha, pato e gato.")
w("- O resto das animações do casal.")
w()
w("**Opcionais (prioridade 3):** efeitos `FX_*` (hoje são partículas feitas no código), `LINE_JUMP_LEFT` e `LINE_LAND_LEFT` (o jogo espelha as da direita).")
w()

# =====================================================================
w("## 9. Retratos dos diálogos")
w()
w("> ⚠️ Os retratos atuais também são temporários.")
w()
img("arte-retratos", "Retratos atuais: 6 expressões básicas + tira extra de cada uma")
w("| Expressão | Código usado no roteiro | Line | Bell |")
w("|---|---|---|---|")
for nome, cod, l, b in [("Neutra", "neutro", "✅", "✅"), ("Sorrindo", "sorriso", "✅", "✅"), ("Rindo", "riso", "✅", "✅"),
                        ("Surpresa", "surpresa", "✅", "✅"), ("Apaixonada", "apaixonada", "✅", "✅"), ("Marota", "maroto", "✅", "✅"),
                        ("Brava", "bravo", "✅", "🔁 usa neutra"), ("Chorando", "chorando", "✅", "🔁 usa surpresa"),
                        ("Envergonhada", "envergonhada", "🔁 usa apaixonada", "✅")]:
    w(f"| {nome} | `{cod}` | {l} | {b} |")
w()
w("**Retratos que ainda faltam:**")
w("- **Personagens sem retrato:** Mago, Espírito das Ruínas e Guardião de Pedra.")
w("- **Expressões que faltam:** Bell brava, Bell chorando e Line envergonhada.")
w()
w("As fontes são os retratos 3×2 do HTML *Primeiro Encontro* e a prancha “Line & Bell”, que deu as expressões extras.")
w()

# =====================================================================
w("## 10. Cenário e objetos")
w()
w("> ⚠️ O cenário atual também é temporário: parte vem de pacotes de arte recebidos, parte é desenhada no código.")
w()
w("| Área | Já usa arte (temporária) | Ainda desenhado no código (precisa de arte) |")
w("|---|---|---|")
w("| Fazendinha | casa (prancha Farmhouse), celeiro, galinheiro, moinho, poço, árvores e frutíferas, cerejeiras, horta (cenoura e tomate), feno, carroça, lampiões, píer, barco, girassóis, milho, trigo, arbustos, pedras, placa | chão de grama, caminho, água do lago, cercas, flores pequenas, mato, varal, mesa, casinha do Theo, tigela |")
w("| Floresta | pinheiros e árvores | chão, raízes, riacho, espinheiros, baú, placas, pedras |")
w("| Ruínas Encantadas | — | chão de lajes, paredes, pilares, cristais (apagado e aceso), altar com orbe, fonte, barreira de luz, lagos, baú |")
w("| Montanha de Brasa | — | chão vulcânico, paredes, fendas, lava, tochas (apagada e acesa), portão de fogo, pedras, estalagmites, fonte, baú |")
w("| Covil | — | chão, paredes, lava, estalagmites, jaula da Bell |")
w()
w("Pranchas de referência já recebidas ficam em `arte/referencias/`: fazenda, casa, dragões, Theo, pacote Line & Bell e tileset.")
w()

# =====================================================================
w("## 11. Efeitos visuais")
w()
w("Todos os efeitos são feitos no código por enquanto (temporários):")
w()
w("- **Luta:**")
w("  - Rastro azul da espada.")
w("  - Impacto (anel branco), faíscas de bloqueio e poeira.")
w("  - Onda do ataque aéreo e onda do pisão do Guardião.")
w("- **Magia:**")
w("  - Raio de Luz (bola brilhante com rastro).")
w("  - Carga e explosão da Chuva de Estrelas.")
w("  - Brilho dos cristais e chamas das tochas.")
w("  - Brilho das barreiras e runas.")
w("- **Dragão:**")
w("  - Fogo do dragão (partículas).")
w("  - Brilho do ponto fraco e estrelas de tontura.")
w("- **Ambiente:**")
w("  - Corações, folhas caindo, fumaça das chaminés, brasas da lava, gotas d’água.")
w("  - Vaga-lumes, borboletas, pássaros e sombras das nuvens.")
w("- **Tela:**")
w("  - Tremor de tela, flash branco e pausas de impacto.")
w("  - Tons de cor por horário e área.")
w("  - O olho do dragão no final.")
w()
w("Os códigos `FX_*` da seção 8.9 são para quando esses efeitos ganharem arte própria.")
w()

# =====================================================================
w("## 12. Como mandar arte nova")
w()
w("1. **Formatos aceitos:**")
w("   - HTML de item (`LINE_BELL_ITEM_XX.html`, um PNG por quadro).")
w("   - HTML de laboratório.")
w("   - Pasta `arte/<grupo>/<CÓDIGO>/00.png, 01.png…`.")
w("   - Uma **prancha**: imagem com vários quadros, que eu recorto.")
w("2. **Nome:** o código precisa ser exatamente o da seção 8.")
w("3. **Fundo transparente de verdade.** Nada de quadriculado ou fundo cinza desenhado.")
w("4. **Mesmo tamanho** em todos os quadros de uma animação, com os pés sempre na mesma linha.")
w("5. **Virada para a direita** nas animações de lado.")
w("6. **Sem sombra no chão e sem rótulos** dentro dos quadros. O jogo desenha a sombra.")
w("7. **Tamanho recomendado:**")
w("   - Personagens: o corpo com cerca de 200 a 250 px de altura.")
w("   - Dragão: corpo com cerca de 400 px, em quadros de 512×512.")
w("   - Bichos: 100 a 150 px.")
w("8. Quando a arte chega, o extrator (`tools/extrair_sprites.py`) monta as folhas e ela entra no jogo sozinha, no lugar da temporária.")
w()

# =====================================================================
w("## 13. Estrutura técnica")
w()
w("| Arquivo | O que faz |")
w("|---|---|")
for a, b in [("game/index.html", "página do jogo, menus, controles de toque"), ("game/js/jogo.js", "motor: áreas, câmera, combate, HUD, salvamento"),
             ("game/js/entidades.js", "Line, Bell, Sombra, partículas"), ("game/js/magia.js", "magia, cristais, tochas, barreiras, fontes, Fogo-fátuo e Guardião"),
             ("game/js/dragao.js", "o dragão e seus ataques"), ("game/js/bichos.js", "bichos da fazenda e o Mago"), ("game/js/fazenda.js", "capítulo da fazenda e tarefas"),
             ("game/js/cenas.js", "todas as cenas e falas (roteiro)"), ("game/js/mapas.js", "os mapas das 5 áreas"), ("game/js/cenario.js", "árvores, casa, objetos e ambiente"),
             ("game/js/animacoes.js", "catálogo de animações, substitutas e desenho dos sprites"), ("game/js/entrada.js", "teclado, controle, toque e dificuldade"),
             ("game/assets/", "folhas de sprites, retratos, cenário"), ("tools/extrair_sprites.py", "converte a arte recebida em folhas para o jogo"),
             ("tools/gerar_documentacao.py", "gera este documento")]:
    w(f"| `{a}` | {b} |")
w()
w("### Como atualizar este documento")
w("As tabelas de animações e o roteiro são gerados a partir do jogo. Para regerar, rode o jogo localmente, exporte o inventário e o roteiro e rode, com o jogo servido na porta 8765: `node tools/exportar_inventario.js inventario.json`, `python3 tools/extrair_roteiro.py roteiro.json` e `python3 tools/gerar_documentacao.py inventario.json roteiro.json`.")
w()
img("25-galeria", "No jogo, o menu Animações mostra a mesma lista, com prévia de cada uma")
w("---")
w()
w("*Line & Bell: um jogo feito com carinho. Todas as animações e artes atuais são temporárias até a criação completa da arte final.*")

os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
open(SAIDA, "w", encoding="utf-8").write("\n".join(L) + "\n")
print(f"{SAIDA}: {len(L)} linhas")
