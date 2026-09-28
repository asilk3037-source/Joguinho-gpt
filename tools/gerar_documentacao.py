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
            w(f"> **{quem or 'Narração'}**{r}: {texto or '*(sem fala, só o retrato)*'}  ")
        elif tipo == "tutorial":
            w(f"> 🎮 *Tutorial na tela:* {texto}  ")
        elif tipo == "titulo":
            w(f"> 🎬 **Título na tela:** {quem}{' — ' + texto if texto else ''}  ")
        elif tipo == "dica":
            w(f"> 💡 *Dica na tela:* {texto}  ")
        elif tipo == "balao":
            w(f"> 💬 *Balão:* “{texto}”  ")
        elif tipo == "anim" and mostrar_anim:
            w(f"> ▶ `{texto}`  ")
    w()

# Totais do catálogo.
tot = sum(len(g["itens"]) for g in inv["grupos"])
NUM_FX = next((k + 1 for k, g in enumerate(inv["grupos"]) if g["nome"].startswith("Efeitos")), 0)
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
secoes = ["1. Visão geral", "2. Personagens", "3. A história", "4. Roteiro completo, cena a cena", "5. O primeiro encontro (prólogo)",
          "6. As fases", "7. Como se joga", "8. Inimigos e chefes", "9. Lista completa de animações", "10. Retratos dos diálogos",
          "11. Cenário e objetos", "12. Efeitos visuais", "13. Como mandar arte nova", "14. Estrutura técnica"]
for s in secoes:
    ancora = s.lower().replace(" ", "-").replace(".", "").replace(",", "").replace("(", "").replace(")", "")
    for a, b in (("ã", "a"), ("á", "a"), ("â", "a"), ("é", "e"), ("ê", "e"), ("í", "i"), ("ó", "o"), ("ô", "o"), ("õ", "o"), ("ú", "u"), ("ç", "c")):
        ancora = ancora.replace(a, b)
    w(f"- [{s}](#{ancora})")
w()

# =====================================================================
w("## 1. Visão geral")
w()
w("**Line & Bell** é uma aventura de ação vista de cima, para navegador (PC e celular). Tudo começa com um prólogo jogável, **O primeiro encontro**, que conta como as duas se conheceram em 09/05/2024. Depois, a Line e a Bell já são namoradas e vivem numa fazendinha com o cachorro Theo. Um dragão leva a Bell, e a Line atravessa uma floresta, ruínas mágicas e uma montanha de lava para resgatá-la.")
w()
w("| | |")
w("|---|---|")
w("| Gênero | Aventura / ação com exploração, visão de cima |")
w("| Plataformas | Navegador no PC (teclado ou controle) e no celular (toque) |")
w("| Duração | Cerca de 35 a 50 minutos (o prólogo leva uns 3 minutos) |")
w("| Prólogo | *O primeiro encontro* (09/05/2024): Minas Shopping, Playground e Túnel |")
w("| Áreas | 3 do prólogo e 5 da aventura: Fazendinha, Floresta Sussurrante, Ruínas Encantadas, Montanha de Brasa e Covil do Dragão |")
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
w("#### ⭐ Theo: layout oficial para a arte final")
w()
w("> 💛 **Este é o Theo aprovado.** A arte que está no jogo hoje é **o layout oficial** para criar a arte final do Theo. A versão final deve **só melhorar** esta arte, **sem perder os traços**. Não é para redesenhar o personagem.")
w()
img("theo-no-jogo", "O Theo como está no jogo hoje: o layout oficial")
w("**O que precisa continuar igual (os traços do Theo):**")
w("- **Raça e formato:** shih-tzu fofinho, corpo baixo e redondo, pernas curtas e cabeça grande em relação ao corpo, no estilo chibi do jogo.")
w("- **Pelagem:** marrom-caramelo, com mechas mais escuras nas orelhas e nas costas. O peito, as patas, a barba e o rabo são creme.")
w("- **Cabeça:** topete arrepiado, orelhas longas e peludas caindo dos lados, franja por cima dos olhos.")
w("- **Rosto:** olhos pretos, grandes e brilhantes, focinho curto com nariz preto e boquinha aberta com a língua rosa aparecendo.")
w("- **Rabo:** enrolado para cima, bem peludo e claro.")
w("- **Estilo:** pixel art detalhada, com contorno escuro e textura de pelo desenhada fio a fio.")
w("- **Acessórios e cenas:** a caminha bege, a tigela azul com patinha, a bolinha azul, o osso, a banheira com o patinho, os corações e os sinais de ! e ?.")
w()
w("**O que pode melhorar:**")
w("- Deixar todos os quadros no **mesmo tamanho**, com as patas sempre na mesma linha do chão.")
w("- **Fundo transparente de verdade**, sem a sombra marrom da prancha e sem sombra no chão (o jogo desenha a sombra).")
w("- Deixar o contorno mais limpo e as animações mais suaves, com mais quadros em andar, correr e brincar.")
w("- Manter as 4 direções coerentes: frente, costas e lado direito. O lado esquerdo o jogo espelha.")
w()
w("A prancha original fica em `arte/referencias/theo_shihtzu.png`, e os quadros recortados em `arte/theo/`.")
w()
img("theo-layout-oficial", "Prancha original do Theo (layout oficial, referência para a arte final)")
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
w("**Prólogo — O primeiro encontro (09/05/2024).** No Minas Shopping, a Line vê a Bell de longe e fica encantada. Elas conversam, a Bell diz que a Line está atrasada e as duas comem BK. A Line confessa que está tímida porque a Bell é muito linda. De mãos dadas, vão ao playground, onde a Line tenta a máquina de soco, faz só 038 pontos e a Bell morre de rir. No túnel, dão o primeiro beijo. O tempo passa, e o sonho das duas vira uma fazendinha.")
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
w("Todas as falas estão exatamente como aparecem no jogo. Entre parênteses está a expressão do retrato. As linhas com ▶ indicam a animação que toca naquele momento: o código é o mesmo da lista da seção 9.")
w()
CENAS = [
    ("encontroInicio", "Prólogo 1: o Minas Shopping", "Começa ao escolher **Novo jogo**, antes de tudo. A Line entra no shopping de costas para a câmera e vê a Bell esperando perto das mesas. Depois a Line anda livremente até a Bell.", "p01-titulo"),
    ("encontroConversa", "Prólogo 2: a conversa e o BK", "Ao chegar perto da Bell e apertar **Falar com a Bell**. A câmera se aproxima (zoom) e cada fala usa uma animação das duas juntas. Depois elas andam até a mesa e comem BK.", "p06-atrasada"),
    ("encontroPlayground", "Prólogo 3: o Playground", "As duas chegam de mãos dadas. A Line vai até a máquina de soco e a Bell fica olhando.", "p13-pronta-para-socar"),
    ("encontroSoco", "Prólogo 4: a máquina de soco", "Ao apertar **Tentar!**. O placar vai de 000 para 038, a tela treme e a Bell gargalha.", "p14-soco"),
    ("encontroTunel", "Prólogo 5: o túnel e a transição para a fazenda", "As duas atravessam o túnel iluminado e se beijam. A tela escurece, a narração conta que o tempo passou e o jogo segue direto para a manhã na fazenda.", "p17-tunel"),
    ("manha", "Manhã na fazenda", "Começa logo depois do prólogo. A Line sai de casa e a Bell a espera no quintal.", "02-manha"),
    (None, "As tarefas do dia", "Parte jogável. O painel no canto mostra as tarefas: **pegar 4 ovos** no galinheiro, **pegar o regador** no poço e **regar os 4 canteiros**, **pegar a ração** no celeiro e **pôr na tigela do Theo**, e **fazer carinho em 3 bichinhos**. A Bell segue a Line e comenta cada tarefa com balões.", "03-tarefas-galinhas"),
    ("almoco", "Almoço", "Quando todas as tarefas terminam, as duas dão um toca aqui e almoçam juntas na mesa do quintal.", "05-almoco"),
    (None, "A tarde de mãos dadas", "Parte jogável: a Line anda de mãos dadas com a Bell até o lago.", "04-pasto"),
    ("porDoSol", "Pôr do sol e o rapto", "No píer do lago. Esta é a cena mais longa do jogo.", "06-por-do-sol-danca"),
    ("floresta", "Chegada na floresta", "Primeira vez na Floresta Sussurrante.", "09-floresta-mago"),
    ("mago", "O Mago", "Ao conversar com o Mago. A primeira conversa conta a história, a segunda (depois da espada) aponta para as ruínas e as seguintes sorteiam uma dica.", None),
    ("espinhos", "Espinhos sem espada", "Ao chegar perto dos espinhos do norte sem a espada.", None),
    ("espada", "A espada", "Ao abrir o baú ao lado do Mago.", "10-espada"),
    ("ruinas", "Chegada nas Ruínas Encantadas", "", "12-ruinas-entrada"),
    ("altar", "O altar da luz", "Ao tocar a luz do altar, na sala a oeste do salão de entrada.", "13-altar-magia"),
    ("golem", "O Guardião desperta", "Ao se aproximar do Guardião, no salão norte das ruínas.", "16-guardiao-acorda"),
    ("golemVencido", "O Guardião vencido", "", "19-chuva-de-estrelas"),
    ("montanha", "Chegada na Montanha de Brasa", "", "20-montanha"),
    ("portaoAberto", "O portão se abre", "Quando a terceira tocha acende.", "21-tocha-na-lava"),
    ("bauCoracao", "Baú de coração extra", "Há dois: um na alcova leste das ruínas e outro na plataforma cercada de fendas na montanha.", None),
    ("covil", "O covil do dragão", "Na primeira vez a cena é completa. Nas próximas tentativas, a luta começa direto.", "22-covil-dragao"),
    ("vitoria", "Vitória e epílogo", "Depois do golpe final.", "24-epilogo"),
]
for num, (chave, titulo, intro, foto) in enumerate(CENAS, 1):
    titulo = f"4.{num} {titulo}"
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
    if chave == "encontroInicio":
        img("p04-perto-bell", "Explorando o shopping: o botão Falar com a Bell aparece perto dela")
    if chave == "encontroConversa":
        img("p08-timida", "BK no shopping: “você parece estar tímida”")
        img("p11-saindo-maos-dadas", "Saindo do shopping de mãos dadas")
    if chave == "encontroSoco":
        img("p15-hahaha", "A Bell gargalhando do soco da Line")
    if chave == "encontroTunel":
        img("p18-beijo", "O primeiro beijo no túnel")
        img("p21-tempo-passou", "Transição: “O tempo passou…”")
    if chave == "porDoSol":
        img("07-bitoquinha", "A bitoquinha no lago")
        img("08-rapto", "O dragão leva a Bell")

w(f"### 4.{len(CENAS) + 1} Placas")
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
w(f"### 4.{len(CENAS) + 2} Balões dos bichos e da Bell (na fazenda)")
w()
for b in ["Cocoricóóó! (galo, de manhã)", "Au! / Au! Au! / Au! Au! ♥ / Auuu~ (fome) / Auuu... / AU! AU! AU! (Theo)", "Piu! (pintinhos)",
          "Quatro ovinhos! Vai ter bolo hoje. (Bell)", "Rega as cenouras com carinho! (Bell)", "A horta tá feliz. E eu também! (Bell)",
          "O Theo já tá sentindo o cheiro! (Bell)", "Os bichinhos te amam. Eu entendo eles. (Bell)"]:
    w(f"- {b}")
w()
w(f"### 4.{len(CENAS) + 3} Dicas que aparecem durante o jogo")
w()
DICAS = [
    ("Prólogo, no shopping", "Aproxime-se da Bell e pressione E para falar com ela. (No celular: toque no botão.)"),
    ("Prólogo, no playground", "Pressione E para a Line tentar. (No celular: toque no botão.)"),
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
w("## 5. O primeiro encontro (prólogo)")
w()
w("> ⚠️ **As animações e artes do prólogo também são temporárias.** Várias usam uma animação substituta, e o playground ainda é desenhado no código.")
w()
w("O prólogo é a história de como a Line e a Bell se conheceram. Ele vem **antes de tudo**: ao escolher **Novo jogo**, o jogo começa no Minas Shopping, em 09/05/2024. Tudo segue o HTML *Bell-Line-Primeiro-Encontro-v26*: os três lugares, as posições, as falas (com a mesma grafia), as expressões dos retratos, a narradora, as dicas, o placar da máquina de soco e as etiquetas de lugar e data. O menu do HTML não foi usado: o jogo mantém o próprio menu. As ilustrações de close-up do HTML viraram animações das duas juntas com a câmera se aproximando (zoom).")
w()
w("### 5.1 O fluxo completo")
w()
w("| # | Lugar | O que acontece | Jogável? | Animações | Câmera |")
w("|---|---|---|---|---|---|")
for l in [
    ("1", "Minas Shopping", "Título *O primeiro encontro* e *Minas Shopping · 09/05/2024*. A Line admira a Bell de longe: “puxa ela é tão linda”.", "não", "`LINE_IDLE` (de costas), `LINE_ADMIRE`, `BELL_WAIT`", "normal"),
    ("2", "Minas Shopping", "A Line anda até a Bell. Perto dela aparece o botão **Falar com a Bell**.", "sim, só andar", "`LINE_WALK_*`, `BELL_WAIT`", "segue a Line"),
    ("3", "Minas Shopping", "A Line se aproxima e as duas conversam: shopping grande, “Você tá atrasada”, “oq vamos comer?”, “BK.”.", "não", "`LINE_BELL_MEET`, `LINE_BELL_GREET_HUG`", "zoom 1,6×"),
    ("4", "Minas Shopping (mesa)", "As duas andam até a mesa e comem BK. “você parece estar tímida” / “é que você é muito linda”.", "não", "`LINE_WALK_*`, `BELL_WALK_*`, `LINE_BELL_BK`", "zoom na mesa"),
    ("5", "Minas Shopping", "A Bell segura a mão da Line e as duas saem juntas do shopping.", "não", "`LINE_BELL_MEET`, `LINE_BELL_WALK_HANDS`", "volta ao normal"),
    ("—", "transição", "Brilho rosa e a tela escurece.", "—", "—", "—"),
    ("6", "Playground", "As duas chegam. A Line para na máquina de soco, a Bell fica ao lado. Aparece o botão **Tentar!**.", "só o botão", "`LINE_WALK_*`, `BELL_WALK_*`, `LINE_IDLE`, `BELL_IDLE`", "normal"),
    ("7", "Playground", "A Line soca: o placar vai de 000 para **038**, a tela treme e a Bell gargalha. “HAHAHAHA! Você viu isso?” / “Eu não consegui bater direito… aquela coisa estava estragada.”", "não", "`LINE_PUNCH_MACHINE`, `BELL_LAUGH_AT_LINE`", "tremor no impacto"),
    ("8", "Playground", "Narradora: elas saem com a barriga doendo de tanto rir.", "não", "`LINE_WALK_*`, `BELL_WALK_*`", "normal"),
    ("—", "transição", "Brilho rosa e a tela escurece.", "—", "—", "—"),
    ("9", "Túnel", "As duas atravessam o túnel e se beijam, com corações subindo. “Bell & Line ♥”.", "não", "`LINE_WALK_RIGHT`, `BELL_WALK_RIGHT`, `LINE_BELL_TUNNEL_KISS`", "zoom 1,6×"),
    ("10", "Túnel → fazenda", "Narradora fecha a história. A tela escurece: “O tempo passou... e o sonho das duas virou uma fazendinha…”. Começa a manhã na fazenda.", "não", "—", "escurece"),
]:
    w("| " + " | ".join(l) + " |")
w()
w("### 5.2 Ambientação de cada lugar")
w()
img("encontro-fundos", "Os três lugares: Minas Shopping, Playground e Túnel (temporários)")
w("A tela do HTML é vertical (360×640). No jogo, o lugar ocupa essa mesma área, centralizado, e em telas largas as laterais mostram o próprio cenário borrado e escurecido. A área onde dá para andar é a mesma do HTML.")
w()
w("**Minas Shopping**")
w("- **Fundo:** ilustração vertical do shopping, com piso claro de losangos rosados, mesinhas redondas com flores, cadeiras rosas e verdes, plantas, vitrines de doces e cafés, escada rolante ao fundo e luz quente. É a imagem do próprio HTML (720×1280), com o mesmo sombreado suave por cima.")
w("- **Posições:** a Line entra por baixo, à esquerda, de costas. A Bell espera à direita, perto do sofá vermelho, olhando para a esquerda. A mesa do BK fica no centro.")
w("- **Precisa de arte final:** a ilustração do shopping, feita a partir do **modelo real** abaixo, e uma versão da mesa com o lanche do BK, se o casal comendo não vier com a mesa desenhada.")
w()
w("#### ⭐ Minas Shopping: modelo real para a arte final")
w()
w("> 💛 **Este é o cenário de verdade do Minas Shopping**: a praça de alimentação onde as duas se encontraram. A ilustração final do shopping deve usar esta foto como **modelo**, no estilo do jogo. A ilustração que está no jogo hoje (vinda do HTML) é **temporária**.")
w()
img("encontro-modelo-minas-shopping", "Praça de alimentação do Minas Shopping: modelo para a arte final")
w("**O que a arte precisa ter, seguindo a foto:**")
w("- **Praça de alimentação**, não um corredor de lojas.")
w("- **Burger King** ao fundo, com o letreiro vermelho e bege sobre o balcão marrom, as telas de cardápio e os pôsteres de lanche. É onde elas comem o BK.")
w("- Ao lado, outra lanchonete com letreiro amarelo e laranja (na foto é o Popeyes).")
w("- **Teto** de madeira ripada, com luzes embutidas e uma faixa clara iluminada.")
w("- **Pilar branco** grande do lado direito.")
w("- Um **balcão** comprido de pedra na frente das lojas e uma **floreira** com plantas à direita.")
w("- **Piso** claro de porcelanato, bem polido, refletindo as luzes.")
w("- **Mesas redondas** com o tampo claro estampado de desenhos e pé central metálico.")
w("- **Cadeiras** de madeira curvada, cor caramelo, com pernas finas de metal. Algumas mesas têm banco estofado encostado.")
w("- **Luz quente e aconchegante**, com tons de madeira, bege, caramelo e o vermelho do BK.")
w()
w("**Como encaixar no jogo:**")
w("- A tela é vertical (360×640), vista um pouco de cima. As lojas ficam no alto e as mesas se espalham pela área onde dá para andar.")
w("- A Line entra por baixo, à esquerda. A Bell espera à direita, perto das mesas. A mesa do BK fica no centro e as duas se sentam nela.")
w("- As setas, o ícone de hambúrguer e coxinha e o triângulo que aparecem na foto são do app onde ela foi tirada e **não fazem parte do cenário**.")
w()
w("A foto também fica salva em `arte/referencias/minas_shopping_modelo.jpg`.")
w()
w("**Playground**")
w("- **Fundo:** desenhado no código igual ao HTML. Tem o piso xadrez roxo, parede escura, dois fliperamas à esquerda (um rosa com tela azul-piscina e um azul com tela rosa), um painel rosa no alto e um balcão de prêmios embaixo.")
w("- **Máquina de soco:** a mesma que aparece na animação `LINE_PUNCH_MACHINE`, parada no lugar do soco. Em cima dela há um **placar** rosa com números amarelos que mostra **000** e vira **038** no impacto.")
w("- **Precisa de arte final:** a ilustração do playground (fliperamas, balcão, luzes, piso) e a máquina de soco separada, parada e com o placar.")
w()
w("#### Playground: o cenário como está no jogo")
w()
w("> Este é o playground que aparece hoje no jogo, desenhado no código a partir do HTML do primeiro encontro. Ele é **temporário** e serve de **mapa** para a ilustração final: onde fica cada coisa e onde as duas se posicionam.")
w()
img("encontro-playground", "Playground no jogo hoje, com cada parte numerada e o placar antes e depois do soco")
w("| # | Parte | Como está hoje | O que a arte final deve mostrar |")
w("|---|---|---|---|")
for l in [
    ("1", "Fliperama rosa", "alto, à esquerda: letreiro rosa, tela azul-piscina e dois botões amarelos", "máquina de fliperama com tela acesa, controles e luzes"),
    ("2", "Fliperama azul", "logo abaixo do primeiro: letreiro azul e tela rosa", "outro fliperama, com cores diferentes do primeiro"),
    ("3", "Painel rosa", "no alto, ao centro", "letreiro luminoso ou painel de prêmios do playground"),
    ("4", "Máquina de soco e placar", "no meio da sala, com o saco vermelho. O placar mostra 000 e vira 038 no soco", "a mesma máquina da `LINE_PUNCH_MACHINE`, parada, com o placar digital em cima"),
    ("5", "Balcão de prêmios", "embaixo, à direita, com sete prêmios rosa", "balcão com bichinhos de pelúcia e brindes"),
    ("6", "Piso", "xadrez roxo em quadrados de 32 px", "piso de playground colorido, que combine com as luzes"),
    ("7", "Paredes", "faixas rosadas nas laterais e embaixo", "paredes com luzes neon e decoração"),
    ("8", "Fundo", "roxo bem escuro em cima e embaixo", "teto e entrada do playground, com luz baixa e clima de fliperama"),
]:
    w("| " + " | ".join(l) + " |")
w()
w("**Posições (na tela de 360×640 do HTML):**")
w("- **A Line** para em frente à máquina de soco (x 204, y 315).")
w("- **A Bell** fica olhando do lado esquerdo (x 150, y 340).")
w("- As duas **entram por baixo, à esquerda**, e saem pela direita, embaixo.")
w()
w("**Clima:** playground de shopping, com luz baixa roxa e rosa, telas brilhando e um ar divertido. É onde a Bell morre de rir.")
w()
w()
w("**Túnel**")
w("- **Fundo:** ilustração vertical do túnel em arco, com lampiões, trepadeiras com flores, corações de luz no chão e a cidade à noite ao fundo. É a imagem do HTML, com uma vinheta roxa leve.")
w("- **Posições:** as duas entram pela esquerda e se encontram no meio do túnel para o beijo.")
w("- **Precisa de arte final:** a ilustração do túnel.")
w()
w("**Cores e clima:** as transições entre lugares têm um brilho rosa (247, 178, 200) antes de escurecer. O túnel começa com esse tom rosa, que some aos poucos. No prólogo não há nuvens, pássaros, bichos, corações de vida, magia nem painel de tarefas: a Line anda sem espada.")
w()
w("### 5.3 Interface do prólogo")
w()
w("- **Etiquetas no alto, à esquerda**, como no HTML: o nome do lugar (*Minas Shopping*, *Playground* ou *Túnel*) e *♥ 09/05/2024*. Elas somem na transição para a fazenda.")
w("- **Faixa de dica** no alto: “Aproxime-se da Bell e pressione E para falar com ela.” e “Pressione E para a Line tentar.” No celular, o texto fala em tocar no botão.")
w("- **Botão de ação:** *Falar com a Bell* e *Tentar!*. No celular, os botões de luta, pulo e magia ficam escondidos durante o prólogo.")
w("- **Caixa de diálogo** com retrato, igual ao resto do jogo. A *Narradora* aparece sem retrato.")
w("- **Pular cena (Tab):** pula cada cena. Pulando tudo, o jogo passa pelos três lugares e chega na fazenda.")
w()
w("### 5.4 Transições")
w()
w("- **Entre lugares** (shopping → playground → túnel): brilho rosa por 0,8 s enquanto a tela escurece em 0,9 s. O novo lugar surge clareando.")
w("- **Do túnel para a fazenda:** depois do beijo, a tela escurece em 1,6 s, a câmera volta ao normal e a narradora fala sobre o tempo que passou, com a tela preta. Então a fazenda aparece e começa a cena *Manhã na fazenda* (Capítulo 1).")
w()
w("### 5.5 Todas as animações do prólogo")
w()
w("Estas são as animações próprias do prólogo, no grupo **Primeiro encontro (prólogo)** da seção 9. As que ainda não têm arte usam uma substituta parecida.")
w()
USO = {
    "LINE_ADMIRE": "Início: a Line vê a Bell de longe. Precisa da Line de costas ou de lado, com a mão no peito, corações e o corpo balançando.",
    "BELL_WAIT": "A Bell esperando no shopping: olha para os lados, mexe no cabelo, confere o celular. Virada para a esquerda.",
    "LINE_BELL_MEET": "As duas frente a frente, conversando e sorrindo. Usada no “esse shopping é muito grande”, no “oq vamos comer?” e antes de saírem.",
    "LINE_BELL_GREET_HUG": "Abraço de chegada no “Você tá atrasada”. O HTML mostra a Bell pulando no abraço com uma perna levantada.",
    "LINE_BELL_BK": "As duas sentadas à mesa comendo BK (hambúrguer, batata e refri), com a mesa desenhada. O HTML tem 3 quadros.",
    "LINE_PUNCH_MACHINE": "A Line soca a máquina, com a máquina e o placar na mesma animação. O impacto é por volta da metade.",
    "BELL_LAUGH_AT_LINE": "A Bell gargalhando da Line: se dobra de rir, bate na perna, enxuga as lágrimas.",
    "LINE_BELL_TUNNEL_KISS": "O primeiro beijo: as duas se aproximam de mãos dadas, se beijam e se afastam sorrindo. O HTML tem 8 quadros.",
}
w("| Código | Quando aparece e o que precisa mostrar | Quadros | Status hoje |")
w("|---|---|---:|---|")
g_enc = next((g for g in inv["grupos"] if "encontro" in g["nome"].lower()), {"itens": []})
for i in g_enc["itens"]:
    q = i["quadros"] if i["existe"] else (i.get("quadrosPedidos") or "")
    st = "✅ temporária" if i["existe"] else (f"🔁 usa `{i['via']}`" if i["via"] else "✏️ falta")
    w(f"| `{i['codigo']}` | {USO.get(i['codigo'], i.get('desc') or '')} | {q} | {st} |")
w()
w("**Animações que o prólogo reaproveita** (já existem, também temporárias): `LINE_IDLE`, `LINE_IDLE_BACK`, `LINE_WALK_RIGHT`, `LINE_WALK_LEFT`, `LINE_WALK_FRONT`, `LINE_WALK_BACK`, `BELL_IDLE`, `BELL_WALK_RIGHT`, `BELL_WALK_LEFT`, `BELL_WALK_FRONT`, `BELL_WALK_BACK` e `LINE_BELL_WALK_HANDS` (saindo do shopping de mãos dadas).")
w()
w("**Efeitos do prólogo** (feitos no código): corações subindo no beijo, anel de impacto e tremor de tela no soco, brilho rosa das transições, zoom da câmera e escurecer.")
w()
w("### 5.6 Retratos usados no prólogo")
w()
w("| Personagem | Expressões | Onde |")
w("|---|---|---|")
w("| Line | `apaixonada`, `sorriso` | “puxa ela é tão linda”, “é que você é muito linda” / conversa, soco |")
w("| Bell | `maroto`, `sorriso`, `neutro`, `apaixonada` | “Você tá atrasada”, “HAHAHAHA!” / “BK.” / “você parece estar tímida” / o olhar apaixonado sem fala |")
w("| Narradora | sem retrato | três falas: saída do shopping, saída do playground e o fim no túnel |")
w("| Bell & Line | sem retrato | o “♥” depois do beijo |")
w()
w("### 5.7 Arte que já existe no HTML")
w()
w("O HTML do primeiro encontro já traz ilustrações das duas juntas: o abraço, o BK na mesa, as duas de mãos dadas, o beijo (tira de 8 quadros), a caminhada e o BK animado. Hoje o jogo usa as animações que já tinha no lugar delas, mas essas ilustrações são a melhor referência (ou até a base) para a arte final de `LINE_BELL_GREET_HUG`, `LINE_BELL_BK`, `LINE_BELL_MEET`, `LINE_BELL_TUNNEL_KISS` e `LINE_BELL_WALK_HANDS`.")
w()
img("encontro-referencia-html", "Ilustrações do HTML do primeiro encontro (referência para a arte final)")
w("### 5.8 O que falta para a versão final do prólogo")
w()
w("- [ ] `LINE_ADMIRE`, `BELL_WAIT`, `LINE_BELL_MEET`, `LINE_BELL_GREET_HUG`, `LINE_BELL_BK`, `BELL_LAUGH_AT_LINE` e `LINE_BELL_TUNNEL_KISS` com arte própria.")
w("- [ ] `LINE_PUNCH_MACHINE` final e a máquina de soco parada, com o mesmo desenho.")
w("- [ ] Ilustração do Playground (hoje desenhada no código).")
w("- [ ] Ilustração final do Minas Shopping seguindo a foto-modelo da praça de alimentação (seção 5.2), com o Burger King.")
w("- [ ] Versão final da ilustração do Túnel.")
w("- [ ] Line parada de costas (`LINE_IDLE_BACK`) caprichada para a entrada no shopping.")
w("- [ ] Opcional: música e sons (passos no shopping, fliperamas, o soco, o beijo).")
w()
w("### 5.9 Progresso e salvamento")
w()
w("- **Novo jogo** sempre começa pelo prólogo.")
w("- Se o jogador fechar o jogo **no meio do prólogo**, **Continuar** recomeça o prólogo do início (ele é curto).")
w("- Terminado o prólogo, o jogo marca `encontroFeito` e salva já na fazenda. Jogos salvos antes do prólogo existir continuam de onde pararam.")
w()

# =====================================================================
w("## 6. As fases")
w()
w("Os três lugares do prólogo (Minas Shopping, Playground e Túnel) estão na seção 5. Estas são as áreas da aventura:")
w()
w("### 6.1 Fazendinha")
w("Casa com varanda e duas chaminés, celeiro, galinheiro, horta, poço, moinho, pasto, chiqueiro, lago com píer e barco, varal, casinha do Theo, mesa de piquenique, árvores frutíferas e flores. Tem borboletas, pássaros, nuvens, folhas caindo e fumaça nas chaminés. De manhã, a luz é clara. À tarde, o céu fica alaranjado, e depois do rapto vira noite com vaga-lumes.")
w()
img("04-pasto", "Pasto com vacas, cavalo e ovelhas")
w("### 6.2 Floresta Sussurrante")
w("Trilha com raízes (correr sobre elas faz a Line tropeçar), riacho para pular, a clareira do Mago com o baú da espada, espinhos que fecham o norte e sombras depois que a espada é pega.")
w()
img("11-floresta-sombras", "Sombras na floresta")
w("### 6.3 Ruínas Encantadas (nova)")
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
w("### 6.4 Montanha de Brasa (nova)")
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
w("### 6.5 Covil do Dragão")
w("Caverna escura com lava nas laterais e estalagmites. A Bell fica numa jaula ao fundo. Quando a Line entra, a entrada desmorona e a luta começa.")
w()
img("23-dragao-fogo", "O dragão cospe fogo no covil")

# =====================================================================
w("## 7. Como se joga")
w()
w("### 7.1 Controles")
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
w("### 7.2 Combate com espada")
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
w("### 7.3 Magia")
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
w("### 7.4 Vida, itens e progresso")
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
w("### 7.5 Dificuldade")
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
w("## 8. Inimigos e chefes")
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
w("## 9. Lista completa de animações")
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
    w(f"### 9.{inv['grupos'].index(g) + 1} {g['nome']}")
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
w(f"### 9.{len(inv['grupos']) + 1} O que ainda falta ter arte própria, por prioridade")
w()
w("**Aparecem na história (prioridade 1):**")
w("- **Prólogo (primeiro encontro):** `LINE_ADMIRE`, `BELL_WAIT`, `LINE_BELL_MEET`, `LINE_BELL_GREET_HUG`, `LINE_BELL_BK`, `BELL_LAUGH_AT_LINE` e `LINE_BELL_TUNNEL_KISS` (detalhes na seção 5.5).")
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
w("## 10. Retratos dos diálogos")
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
w("## 11. Cenário e objetos")
w()
w("> ⚠️ O cenário atual também é temporário: parte vem de pacotes de arte recebidos, parte é desenhada no código.")
w()
w("| Área | Já usa arte (temporária) | Ainda desenhado no código (precisa de arte) |")
w("|---|---|---|")
w("| Minas Shopping (prólogo) | ilustração do shopping, vinda do HTML do primeiro encontro (temporária; a final segue a foto-modelo da seção 5.2) | — |")
w("| Playground (prólogo) | máquina de soco (recortada da animação `LINE_PUNCH_MACHINE`) | piso xadrez, paredes, fliperamas, painel, balcão de prêmios, placar da máquina |")
w("| Túnel (prólogo) | ilustração do túnel, vinda do HTML do primeiro encontro | — |")
w("| Fazendinha | casa (prancha Farmhouse), celeiro, galinheiro, moinho, poço, árvores e frutíferas, cerejeiras, horta (cenoura e tomate), feno, carroça, lampiões, píer, barco, girassóis, milho, trigo, arbustos, pedras, placa | chão de grama, caminho, água do lago, cercas, flores pequenas, mato, varal, mesa, casinha do Theo, tigela |")
w("| Floresta | pinheiros e árvores | chão, raízes, riacho, espinheiros, baú, placas, pedras |")
w("| Ruínas Encantadas | — | chão de lajes, paredes, pilares, cristais (apagado e aceso), altar com orbe, fonte, barreira de luz, lagos, baú |")
w("| Montanha de Brasa | — | chão vulcânico, paredes, fendas, lava, tochas (apagada e acesa), portão de fogo, pedras, estalagmites, fonte, baú |")
w("| Covil | — | chão, paredes, lava, estalagmites, jaula da Bell |")
w()
w("Pranchas de referência já recebidas ficam em `arte/referencias/`: fazenda, casa, dragões, Theo, pacote Line & Bell e tileset.")
w()

# =====================================================================
w("## 12. Efeitos visuais")
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
w("- **Prólogo:**")
w("  - Corações subindo no beijo, impacto e tremor no soco.")
w("  - Brilho rosa nas transições e zoom da câmera nos closes.")
w("- **Tela:**")
w("  - Tremor de tela, flash branco e pausas de impacto.")
w("  - Tons de cor por horário e área.")
w("  - O olho do dragão no final.")
w()
w(f"Os códigos `FX_*` da seção 9.{NUM_FX} são para quando esses efeitos ganharem arte própria.")
w()

# =====================================================================
w("## 13. Como mandar arte nova")
w()
w("1. **Formatos aceitos:**")
w("   - HTML de item (`LINE_BELL_ITEM_XX.html`, um PNG por quadro).")
w("   - HTML de laboratório.")
w("   - Pasta `arte/<grupo>/<CÓDIGO>/00.png, 01.png…`.")
w("   - Uma **prancha**: imagem com vários quadros, que eu recorto.")
w("2. **Nome:** o código precisa ser exatamente o da seção 9.")
w("3. **Fundo transparente de verdade.** Nada de quadriculado ou fundo cinza desenhado.")
w("4. **Mesmo tamanho** em todos os quadros de uma animação, com os pés sempre na mesma linha.")
w("5. **Virada para a direita** nas animações de lado.")
w("6. **Sem sombra no chão e sem rótulos** dentro dos quadros. O jogo desenha a sombra.")
w("7. **Theo:** a arte final deve seguir o layout oficial da seção 2, só melhorando, sem perder os traços.")
w("8. **Tamanho recomendado:**")
w("   - Personagens: o corpo com cerca de 200 a 250 px de altura.")
w("   - Dragão: corpo com cerca de 400 px, em quadros de 512×512.")
w("   - Bichos: 100 a 150 px.")
w("9. Quando a arte chega, o extrator (`tools/extrair_sprites.py`) monta as folhas e ela entra no jogo sozinha, no lugar da temporária.")
w()

# =====================================================================
w("## 14. Estrutura técnica")
w()
w("| Arquivo | O que faz |")
w("|---|---|")
for a, b in [("game/index.html", "página do jogo, menus, controles de toque"), ("game/js/jogo.js", "motor: áreas, câmera, combate, HUD, salvamento"),
             ("game/js/entidades.js", "Line, Bell, Sombra, partículas"), ("game/js/magia.js", "magia, cristais, tochas, barreiras, fontes, Fogo-fátuo e Guardião"),
             ("game/js/dragao.js", "o dragão e seus ataques"), ("game/js/bichos.js", "bichos da fazenda e o Mago"), ("game/js/fazenda.js", "capítulo da fazenda e tarefas"),
             ("game/js/encontro.js", "prólogo *O primeiro encontro*: lugares, máquina de soco, cenas e falas"), ("game/js/cenas.js", "cenas e falas da aventura (roteiro)"), ("game/js/mapas.js", "os mapas das 5 áreas da aventura"), ("game/js/cenario.js", "árvores, casa, objetos e ambiente"),
             ("game/js/animacoes.js", "catálogo de animações, substitutas e desenho dos sprites"), ("game/js/entrada.js", "teclado, controle, toque e dificuldade"),
             ("game/assets/", "folhas de sprites, retratos, cenário (inclui `cenario/encontro_*.webp` do prólogo)"), ("tools/extrair_sprites.py", "converte a arte recebida em folhas para o jogo"),
             ("tools/gerar_documentacao.py", "gera este documento")]:
    w(f"| `{a}` | {b} |")
w()
w("### Como atualizar este documento")
w("As tabelas de animações e o roteiro são gerados a partir do jogo. Para regerar, rode o jogo localmente, exporte o inventário e o roteiro e rode, com o jogo servido na porta 8765: `node tools/exportar_inventario.js inventario.json`, `python3 tools/extrair_roteiro.py roteiro.json` , `python3 tools/gerar_documentacao.py inventario.json roteiro.json` e, para a versão HTML, `python3 tools/gerar_documentacao_html.py`.")
w()
img("25-galeria", "No jogo, o menu Animações mostra a mesma lista, com prévia de cada uma")
w("---")
w()
w("*Line & Bell: um jogo feito com carinho. Todas as animações e artes atuais são temporárias até a criação completa da arte final.*")

os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
open(SAIDA, "w", encoding="utf-8").write("\n".join(L) + "\n")
print(f"{SAIDA}: {len(L)} linhas")
