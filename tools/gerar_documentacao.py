#!/usr/bin/env python3
"""Gera docs/LINE_E_BELL_DOCUMENTACAO.md a partir do estado atual do jogo.

É o único documento do projeto: tudo o que antes ficava em arquivos soltos (pendências,
índice e plano dos itens, lista de arte, layout do Theo, README do jogo) entra aqui
(seções 22 a 26). Precisa de dois arquivos JSON exportados do jogo rodando (seção 26.8):
  - inventario.json: catálogo de animações (LB.inventario() + dados de cada sprite)
  - roteiro.json: falas, títulos, balões e animações de cada cena (tools/extrair_roteiro)

Uso: python3 tools/gerar_documentacao.py inventario.json roteiro.json
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import doc_parte2  # noqa: E402
import doc_apendices  # noqa: E402

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
w("> 🐉 **PARTE 2 — O Coração dos Elementos (novo nesta versão):**")
w("> - Depois do “Fim?”, **Continuar** abre a Parte 2: o dragão acorda para pedir ajuda contra a **Quimera**, que rouba a luz dos guardiões (seção 16).")
w("> - **A Bell é jogável:** troca com **T** / 🔄; ela atira estrelas, solta um leque de luz e canta para acalmar as feras. Cada uma tem a própria vida; quando uma cai, a outra assume (seção 19).")
w("> - **Sete fases novas** com ambientação completa: Vale das Raízes, Fenda de Magma, Lago Espelhado, Pântano Sombrio, Picos do Vento, Olho da Tempestade e Coração dos Elementos — lama, correntes de vento, abismo de céu, chuva e relâmpagos (seção 17).")
w("> - **Sete chefes novos:** os guardiões da **Terra**, da **Água** e do **Ar**, as junções **Pedra + Fogo** (Titã de Magma), **Terra + Água** (Hidra de Lama) e **Água + Ar** (Tempestade Viva), e a **Quimera Primordial**, junção de todos os elementos, em três fases (seção 20).")
w("> - **Relógio do jogo** com dia e noite: 1 minuto real = 1 hora no jogo; os moradores dormem à noite e dá para descansar nas fontes (seção 18).")
w("> - **Dicas no modo Fácil:** seta até o objetivo, dicas de cada chefe, aviso de vida baixa e dica na derrota (seção 21).")
w("> - **Armaduras da Bell** (Vestido Reforçado, Manto Estelar e Armadura da Aurora) e a arte de armadura das duas (seção 19.3).")
w("> - **Novos moradores** (Dona Cora, Seu Tião, Vó Brisa), 3 documentos, 1 conclusão e 3 escamas de guardião.")
w("> - **Lista completa de arte necessária** para o jogo inteiro: personagens, armaduras, moradores, inimigos, chefes, cenário de cada fase, itens, interface, efeitos e dia/noite (seção 22).")
w()
w("> 📋 **Documento novo só com o que falta:** `docs/LINE_E_BELL_PENDENCIAS.md` (e `.html`) reúne todas as regras da arte, as animações que precisam ser refeitas (ataque nas quatro direções, cenas do shopping com mais quadros, pôr do sol, felizes e a Line girando a Bell na proporção dos 20 primeiros itens), as animações pendentes, as armaduras e os ícones dos itens, os botões, o HUD, as telas e os mapas. Gerado por `tools/gerar_pendencias.py`.")
w()
w("> ⚡ **Jogo mais leve:** a troca de mapa não trava mais (a Floresta levava 7 s e o Vilarejo 5 s num celular médio; agora é instantâneo), porque o chão é desenhado em pedaços, só o que aparece na tela. Sombras das nuvens, vinhetas e o brilho da água e da lava ficam prontos em vez de refeitos a cada quadro, os fundos já saem decodificados do carregamento e, em celulares que não dão conta, a resolução de desenho baixa sozinha (seção 26.7).")
w()
w("> 🍔 **Minas Shopping virou a praça de alimentação do modelo:** duas lojas de lanche (hambúrguer e frango) no fundo, sob o teto de madeira com luzes embutidas e a coluna branca, seis mesas redondas com quatro cadeiras de madeira em duas colunas e canteiros na direita (seção 22.11). As mesas são sólidas, a Bell espera no corredor do meio e a Line entra por baixo. As peças da montagem anterior (confeitaria, cafeteria, mezanino, escada rolante, sofás, poltronas) saíram do jogo.")
w()
w("> 🎛️ **HUD e controles com a arte nova (componentes 01 a 09):** retrato da heroína na moldura redonda, barras de vida e magia, contador de moedas com o item do atalho, **minimapa** com a névoa no canto de cima, painel de objetivo com a moldura dourada, selo **!** de novidade na mochila, moldura dourada em todos os botões redondos e o joystick novo. Os ícones de dentro dos botões ainda são emoji (pedido no documento de pendências).")
w()
w("> ⚔️ **Ataque para cima e para baixo:** o golpe (espada ou soco) agora acerta na direção em que a Line está virada, inclusive para cima e para baixo, e a mira vira sozinha para o inimigo mais perto. A arte do golpe de frente e de costas ainda falta (o jogo usa a de lado).")
w()
w("> 🐢 **Cenas do shopping mais calmas:** as animações do prólogo com poucos quadros (a Line admirando, a Bell esperando, a conversa, o abraço, o BK, a risada e o beijo) passaram a tocar mais devagar até chegarem com mais quadros.")
w()
w("> 🕹️ **Playground pronto em peças (itens 235 a 240):** a sala vazia nova, os dois fliperamas, o painel e o balcão de prêmios e a máquina de soco, cada um no tamanho da régua e na posição do guia do item 240 (seção 5.2). O soco da Line (item 238) e a risada da Bell (item 239) chegaram com seis quadros cada e substituem os antigos, inclusive o soco sem espada. Saíram o playground e a máquina antigos (itens 141 e 142).")
w()
w("> 🗺️ **Bases novas em uso (itens 218 a 222):** o chão do Vilarejo, da Floresta, das Ruínas e da Montanha agora é a arte das bases (grama, mata, laje e rocha com brasa), e os caminhos usam a terra da própria base. O **Minas Shopping** passou a ser montado em peças sobre a base nova (teto e piso de losangos), com o mezanino, a escada rolante animada e os pilares; a ilustração antiga saiu. Seção 22.11.2.")
w()
w("> 🧭 **Direções e portas certas:** sofá, banco do lago e poltronas virados para onde fazem sentido (a arte da poltrona olha para a esquerda; a da esquerda é espelhada); saíram os lustres que pareciam flutuar, a janela e a porta soltas no corredor da casa e a placa pendurada que estava no chão do vilarejo; o banheiro da casa da fazenda abre pela porta da esquerda e a parede entre o quarto e o banheiro não deixa mais passar. Seção 23.6.")
w()
w("> 🧹 **Fazenda arrumada:** menos objetos, agrupados junto das construções e cercas; as estradas e as passagens ficaram livres (um teste garante que nada volta a bloquear o caminho). Seção 6.1.")
w()
w("> 🎨 **Revisão geral de design (seção 23.6):** todos os objetos e móveis agora seguem uma **régua de tamanhos** (medida real × a altura da Line); a fazenda, o vilarejo e todos os interiores foram reorganizados por zonas, com os caminhos livres; as casas do vilarejo, da floresta, do vale e do lago usam a casa em pixel art com telhados de cores diferentes; a Dona Rosa e o Seu Bento atendem dentro das lojas, atrás do balcão, e as lojas fecham à noite; os botões do celular formam um arco em volta do ⚔; a biblioteca foi limpa (arte antiga e fotos sem uso saíram) e as fotos foram refeitas.")
w()
w("> 🐴 **Itens 218 a 227 chegaram:** canto do cavalo no pasto (cavalete com sela, cabresto e escova), cesto de lã e tesoura de tosquia perto das ovelhas, bebedouro no galinheiro, concha de grãos no silo, ferraduras no celeiro e balde de ração perto do cocho.")
w()
w("> 🧺 **Itens 203 a 217 chegaram:** bebedouro de passarinho, dois postes de lampião na estrada, roda de carroça no celeiro, carrinho de flores, treliça, mangueira, tesoura de poda, cesto de maçãs, abóboras, banquinho e balde de ordenha no pasto, sapateira e galochas na varanda, cesto de prendedores debaixo do varal e silo de grãos.")
w()
w("> 🎮 **Poção e bomba no mesmo botão:** no celular há um botão só para o item do atalho; equipe na mochila o que quer deixar nele (bomba, poção, elixir…). Se o item equipado acabar, o botão passa sozinho para outro que ainda tenha. Os **ícones de todos os botões** estão na seção 8.1.")
w()
w("> 📱 **Botões do celular:** a poção (🧪), o trocar heroína (🔄) e o item do atalho (💣) subiram para cima dos botões de ação, longe do joystick. O botão do giro (🌀) saiu: **segurar o ⚔** faz o giro da Line (ou o leque de estrelas da Bell). **Sem espada, o ⚔ dá um soco** (seção 8.1).")
w()
w("> 🌻 **Itens 188 a 202 chegaram:** arco de jardim com a placa de boas-vindas na estrada norte da fazenda, cata-vento de galo no telhado do celeiro, sino na varanda, fumigador e pote de mel junto à colmeia, floreira na frente da casa, comedouro no galinheiro, cocho de feno, pedra de sal e bebedouro no pasto, bancada de mudas com luvas e bandeja de mudinhas ao lado da horta e um rolo de corda no píer.")
w()
w("> 🧺 **Itens 154 a 187 chegaram — a fazenda e a casa ganharam vida:** a casa da fazenda tem ilha de cozinha com banquetas, despensa, prateleira de temperos, relógio, quadro, vasos de planta e de flores, luminárias pendentes, arandelas, uma janela e a porta da despensa, que abre quando a Line chega perto. No terreno: caixa de correio, capacho, cadeira de balanço na varanda, lenha, colmeia, casinha de passarinho, espantalho, carrinho de mão, pá, enxada, suporte de ferramentas, sacos de sementes, balde, barril de chuva, cesto de colheita, ninho e cesto de ovos, cocho no pasto, latão de leite, composteira, ferradura no celeiro, banco e fogueira na beira do lago, taboas, vitórias-régias, caixote no píer e cogumelos. O regador da tarefa da manhã agora aparece de verdade no poço, e a pontezinha está no riacho do Lago Espelhado. Luminárias, janela e fogueira acendem sozinhas à noite. O item 153 não veio.")
w()
w("> 📱 **Ajustes do teste no celular (seção 23.5):** a Line não “cai” mais ao pegar a espada (a arte de “Feliz” era uma corrida com queda e saiu do jogo); as duas de mãos dadas e a dança do pôr do sol voltaram ao tamanho certo; a casa da fazenda não some mais da tela; no lanche do shopping aparece só a mesa delas. **Pedido de arte novo:** o Minas Shopping em peças — base só com chão e teto e cada loja, móvel e enfeite separado (seção 22.11.1).")
w()
w("> 🏡 **Itens 137 a 152 chegaram — fazenda nova e todas as casas por dentro:** a fazenda agora é o **terreno oficial** (item 144), com a casinha do Theo, a tigela (cheia e vazia), o varal, a mesa de piquenique, a cerca, a porteira, flores e mato da arte nova (itens 146 e 147). **Toda casa tem interior:** a casa da fazenda (cozinha, sala, quarto e banheiro, item 145, com os móveis dos itens 148 a 152), a cabana do caçador, a loja da Dona Rosa, a ferraria do Seu Bento, as três casas do vilarejo, a casa da Dona Cora e a do Seu Tião (seção 6.8). O prólogo usa o playground e a máquina de soco novos (itens 141 e 142), o pato e o gato entraram (138 e 139); a ovelha reenviada (137) foi recusada.")
w()
w("> 🎞️ **Line e Bell do mesmo tamanho e no mesmo ritmo em todas as animações:** poses inclinadas, agachadas e sentadas não aumentam nem diminuem mais a cabeça (ajuste medido pela cabeça, seção 26.5); a Bell anda e corre no mesmo passo da Line; as cenas do começo tocam no ritmo da artista (o beijo no túnel, a Line admirando a Bell e o soco na máquina estavam acelerados); reverência, toca aqui e vitória não piscam mais em meio segundo. No rapto aparece um dragão só: a arte antiga da Bell carregada já trazia outro dragão desenhado junto.")
w()
w("> 🐄 **Bichos maiores e galinhas andando de verdade:** todos os bichos cresceram (galinha 47 de altura, vaca 71, cavalo 90, porco e ovelha 48, Theo 36, pintinho 27; a Line tem 62). A galinha agora anda com uma perna depois da outra, e cada bicho olha para o lado em que anda (antes a galinha, a vaca, o cavalo e a ovelha andavam de ré).")
w()
w("> 📚 **Tudo num documento só:** o que falta criar (seção 23), o índice dos itens de arte recebidos (seção 24), o plano de criação por item (seção 25) e como rodar, publicar e editar o jogo (seção 26) agora ficam aqui dentro. Os arquivos soltos (`ANIMACOES_PENDENTES.md`, `LINE_BELL_INDICE_PARTES.md`, `LINE_BELL_PLANO_ANIMACOES_POR_ITEM.md`, `docs/ARTES_NECESSARIAS.md`, `arte/theo/LAYOUT_OFICIAL.md`) saíram do repositório.")
w()
w("> 🧙 **Itens 124 a 127 chegaram:** o **Mago** animado (parado, falando e fazendo magia), o **Espírito das Ruínas**, que agora aparece de verdade no altar (surgindo, flutuando e falando), e o **Theo** parado e andando nas 4 direções, alerta e curioso. O Theo está todo com arte nova.")
w("> 📐 **Dimensão de cada cenário:** tabela e gabarito (planta) de cada fase na seção 22.12.")
w("> 🎨 **Itens 108 a 137 chegaram:** vitória, magias, andar e correr em combate e pulo para a esquerda da Line; as duas comendo, beijo, toca aqui e costas das andanças; o dragão correndo; o **Guardião de Pedra completo**; o **fogo-fátuo** (a mesma arte colorida por elemento: azul, laranja, verde e branco) e a **sombra**; o **Theo**, a **galinha branca**, o **porco**, o **cavalo** e a **ovelha** com 12 quadros por animação, no mesmo tamanho dos bichos antigos.")
w("> 🔁 **Para reenviar:** `LINE_BELL_WALK_TOGETHER`, `LINE_BELL_WALK_HANDS` e `LINE_BELL_RUN_TOGETHER` de frente e de lado (itens 110 a 112) vieram com todos os quadros iguais, parados, e o jogo segue com as versões que se mexem; `DRAGON_SLEEP` (item 118) não mostra o dragão dormindo; `LINE_BELL_DANCE` (item 113) perde a Line em alguns quadros; o item 108 veio de novo com 3 quadros vazios.")
w("> 🎬 **Itens 77 a 80 chegaram:** as duas sentando juntas, sentadas paradas e a Bell com a cabeça no ombro da Line (no pôr do sol do epílogo, na proporção certa: sentadas, com uns 75% da altura de pé), e o **dragão parado e piscando** de verdade (saiu o quadro provisório do rugido).")
w("> 🐔 **Arte nova (itens 132 a 134):** galinha marrom completa (9 animações), pintinho (parado, andando e correndo) e vaca (parada, andando, correndo e comendo), com 12 quadros cada, no mesmo tamanho dos bichos antigos.")
w("> 📐 **Tamanho de cada imagem** pensando na tela cheia: tabela na seção 22.0.")
w("> 🧭 **Modo Fácil:** guia discreto com trilha no chão pelo caminho de verdade, também para as tarefas da fazenda (seção 21).")
w()
w("> 🎨 **Arte nova (itens 50 a 108):**")
w("> - **Bell** com arte nova: parada, andando e correndo nas 4 direções, pulo, susto, fuga, queda, captura, jaula, fuga da jaula, chamando e ajudando a Line, feliz, aliviada, chorando, risada, reverência, toca aqui e dança.")
w("> - **Line e Bell juntas:** andando lado a lado, de mãos dadas, correndo, conversando, rindo, encostadas, segurando as mãos, abraço do resgate, fim do abraço, comemoração e as cenas do prólogo (encontro, abraço de chegada, BK, soco na máquina e o beijo no túnel).")
w("> - **Dragão novo** em todos os golpes, no voo, na tontura, na queda e derrotado. O dragão antigo saiu do jogo. As animações novas duram o mesmo tempo que as antigas, porque é essa duração que está sincronizada com os golpes.")
w("> - **Efeitos em pixel art:** impacto, faíscas, explosão, ponto fraco, corações, lágrimas, poeira e fumaça (seção 13).")
w("> - O tamanho de cada personagem agora é **igualado entre as animações** (antes a Line encolhia ao rir, e a Bell nova vinha menor que a Line).")
w("> - ⚠️ Os itens **96, 106 e 108** chegaram com imagens vazias (veja a seção 23).")
w()
w("> 📖 **Novidades da história (esta versão):**")
w("> - Um **tema** que costura a aventura inteira: *luz não se rouba, se divide* (seção 3).")
w("> - O **dragão ganhou motivo e voz**: o fogo dele esfria enquanto dorme, e ele acorda com frio procurando um coração brilhante. A Bell sonha com isso na manhã do rapto.")
w("> - **Quatro interlúdios “Enquanto isso…”** mostram a Bell presa no covil, conversando e cantando para o dragão (seção 4).")
w("> - **Final novo:** depois do golpe final, a Line divide a luz com o dragão em vez de apagá-lo, e o epílogo fecha a promessa do pôr do sol.")
w("> - **Títulos de capítulo**, cenas de chegada no vilarejo, na gruta, nas minas e na forja, e uma fala da Line para cada documento achado.")
w("> - **O caçador Tobias**, personagem novo na montanha, ouviu a Bell cantando; achando ele, a Dona Lurdes agradece.")
w("> - **Linha do tempo corrigida:** as minas e a forja fecharam há cinquenta anos, quando a montanha começou a esquentar (por isso o Seu Zé e o Seu Bento se lembram).")
w()
w("> 🆕 **Novidades da versão anterior (mundo):**")
w("> - **Fases bem maiores e interligadas**: a floresta, a gruta, as ruínas e a montanha dobraram de tamanho e ganharam atalhos entre si (seções 6 e 7.1).")
w("> - **Vilarejo do Riacho**, área nova com cinco moradores, a **loja da Dona Rosa** e a **ferraria do Seu Bento** (seções 6.2, 7.3 e 7.4).")
w("> - **Moedas** e **armaduras** que dão escudos (seções 7.2 e 7.3).")
w("> - **Carrinho de mina** entre três estações, que só anda depois de achar a Alavanca de Ferro na montanha (seção 7.7).")
w("> - **Dez itens, cada um com uma função**: poção, elixir, bomba, Pena de Fênix, chave, lanterna, gancho, bússola, botas e alavanca, com atalho **F** para o item equipado (seção 7.5).")
w("> - **Bombas, gancho, chão em brasa e galerias escuras** que abrem caminhos novos (seção 7.8).")
w("> - **12 documentos de investigação** com tipo, autor e data, que se juntam em **8 conclusões**; algumas ajudam contra o dragão (seção 7.6).")
w("> - O **mapa só acende os lugares visitados** (seção 7.9).")
w("> - **Menos vida espalhada**: sem comida de cura pelo chão e corações caindo bem menos (seção 7.5).")
w("> - **Inimigos mais espertos**: contornam paredes, avisam os vizinhos, flanqueiam e fogem; morcegos novos nas Minas (seção 9).")
w("> - **Testes automatizados** de todas as telas (seção 15).")
w()
img("01-menu", "Tela inicial, com a escolha de dificuldade")
w("**Jogar:** https://line-e-bell.vercel.app · **Código:** pasta `game/` deste repositório")
w()
w("## Sumário")
w()
secoes = ["1. Visão geral", "2. Personagens", "3. A história", "4. Roteiro completo, cena a cena", "5. O primeiro encontro (prólogo)",
          "6. As fases", "7. Exploração: mundo interligado, vilarejo, loja, carrinho, itens, documentos e mapa", "8. Como se joga", "9. Inimigos e chefes", "10. Lista completa de animações", "11. Retratos dos diálogos",
          "12. Cenário e objetos", "13. Efeitos visuais", "14. Como mandar arte nova", "15. Estrutura técnica"] + doc_parte2.SECOES + doc_apendices.SECOES
for s in secoes:
    ancora = s.lower().replace(" ", "-").replace(".", "").replace(",", "").replace("(", "").replace(")", "").replace(":", "").replace("—", "")
    for a, b in (("ã", "a"), ("á", "a"), ("â", "a"), ("é", "e"), ("ê", "e"), ("í", "i"), ("ó", "o"), ("ô", "o"), ("õ", "o"), ("ú", "u"), ("ç", "c")):
        ancora = ancora.replace(a, b)
    w(f"- [{s}](#{ancora})")
    if s.startswith("7. "):
        for sub, anc in [("7.1 Como as fases se ligam", "71-como-as-fases-se-ligam"), ("7.2 Moedas", "72-moedas"), ("7.3 Loja e ferraria", "73-loja-da-dona-rosa-e-ferraria-do-seu-bento"),
                         ("7.4 Moradores", "74-moradores-do-vilarejo"), ("7.5 Mochila e itens", "75-mochila-e-itens-um-item-uma-funcao"), ("7.6 Documentos e conclusões", "76-documentos-de-investigacao-e-conclusoes"),
                         ("7.7 Carrinho de mina", "77-carrinho-de-mina"), ("7.8 Bombas, gancho, brasa e escuro", "78-bombas-gancho-chao-em-brasa-e-galerias-escuras"), ("7.9 Mapa", "79-mapa-so-acende-onde-a-line-passou"),
                         ("7.10 Todos os baús", "710-todos-os-baus"), ("7.11 Tochas e cristais", "711-tochas-e-cristais-como-achar"), ("7.12 Arte necessária", "712-arte-necessaria-para-a-exploracao")]:
            w(f"  - [{sub}](#{anc})")
w()

# =====================================================================
w("## 1. Visão geral")
w()
w("**Line & Bell** é uma aventura de ação vista de cima, para navegador (PC e celular). Tudo começa com um prólogo jogável, **O primeiro encontro**, que conta como as duas se conheceram em 09/05/2024. Depois, a Line e a Bell já são namoradas e vivem numa fazendinha com o cachorro Theo. Um dragão leva a Bell, e a Line atravessa um vilarejo, uma floresta, uma gruta com minas abandonadas, ruínas mágicas e uma montanha de lava para resgatá-la. No caminho ela junta documentos de investigação, tira conclusões, compra armaduras, conserta um carrinho de mina e usa os itens da mochila para abrir caminhos novos.")
w()
w("| | |")
w("|---|---|")
w("| Gênero | Aventura / ação com exploração, visão de cima |")
w("| Plataformas | Navegador no PC (teclado ou controle) e no celular (toque) |")
w("| Duração | Parte 1: cerca de 1h30 a 2h explorando tudo (o prólogo leva uns 3 minutos). Parte 2: mais 2h a 2h30 |")
w("| Prólogo | *O primeiro encontro* (09/05/2024): Minas Shopping, Playground e Túnel |")
w("| Áreas | 3 do prólogo, 7 da Parte 1 (Fazendinha, Vilarejo do Riacho, Floresta Sussurrante, Gruta dos Ecos e Minas de Cristal, Ruínas Encantadas, Montanha de Brasa e Covil do Dragão) e 7 da Parte 2 (Vale das Raízes, Fenda de Magma, Lago Espelhado, Pântano Sombrio, Picos do Vento, Olho da Tempestade e Coração dos Elementos), todas interligadas |")
w("| Chefes | Parte 1: Guardião de Pedra e o Dragão Vermelho. Parte 2: Colosso de Raízes, Serpente das Marés, Grifo da Tempestade, Titã de Magma, Hidra de Lama, Tempestade Viva e Quimera Primordial |")
w("| Heroínas | Line (Parte 1) e Line + Bell, trocando a qualquer momento (Parte 2) |")
w("| Relógio | Dia e noite: 1 minuto real = 1 hora no jogo |")
w(f"| Exploração | {sum(len(m['baus']) for m in inv['mundo']['mapas'].values())} baús, 3 portas trancadas, paredes rachadas, postes do gancho, chão em brasa, galerias escuras, carrinho de mina entre 3 estações |")
w(f"| Investigação | {len(inv['mundo']['ordemPistas'])} documentos (com tipo, autor e data) e {len(inv['mundo']['conclusoes'])} conclusões |")
w("| Vilarejo | 5 moradores, loja de itens e ferraria com 3 armaduras da Line e 3 da Bell; moedas caem dos inimigos e saem dos baús |")
w(f"| Mochila | {len(inv['mundo']['ordemItens'])} itens, cada um com uma função, item no atalho (F), caderno de documentos e mapa que só acende onde a Line passou |")
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
w("Namorada da Line: doce, risonha e mandona na medida certa. Usa óculos, blusa creme e short jeans. É levada pelo dragão no pôr do sol e fica presa numa jaula no covil, mas não fica parada: deixa a fita cair de propósito para a Line achar, conversa com o dragão, descobre que ele está com frio e canta para acalmá-lo. É ela quem entende o dragão primeiro.")
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
w("A prancha original fica em `arte/referencias/theo_shihtzu.png`; a arte do Theo no jogo vem dos itens 126 a 130.")
w()
img("theo-layout-oficial", "Prancha original do Theo (layout oficial, referência para a arte final)")
w("### Bichos da fazenda")
w("Galinhas (brancas e marrons), pintinhos, vacas, cavalo e porcos já têm arte. Ovelhas, patos e o gato ainda são desenhados no código.")
w()
img("arte-bichos", "Theo e bichos da fazenda (temporários)")
w("### Mago")
w("Velho sábio da Floresta Sussurrante. Guarda a espada e explica o caminho. Tem arte animada: parado, falando quando a Line chega perto e fazendo magia antes de entregar a espada.")
w()
w("### Espírito das Ruínas")
w("Voz antiga que mora no altar das Ruínas Encantadas e ensina a magia à Line. Ainda não tem visual próprio, só a luz do altar.")
w()
w("### Guardião de Pedra")
w("Chefe das ruínas: um golem de pedra com um cristal azul no peito. Desenhado no código por enquanto.")
w()
w("### Dragão Vermelho")
w("Dorme cem anos no topo da Montanha de Brasa, e enquanto dorme o fogo dele esfria. É o frio que o acorda. Ele acredita que o calor de um coração brilhante pode ser tomado, e por isso leva alguém a cada século. Fala pouco, em frases partidas (“Cem anos… dormindo. O fogo… esfria.”). Não é mau: está com frio. No fim, a Line divide a luz com ele e ele volta a dormir em paz, sem levar ninguém.")
w()
img("arte-dragao", "Dragão vermelho (temporário)")
w("### Moradores do vilarejo e o caçador Tobias")
w("Dona Rosa (mercadora), Seu Bento (ferreiro, aprendiz do Mestre Aurélio), Seu Zé (o mais velho, empurrava o carrinho de mina cinquenta anos atrás), Dona Lurdes (mulher do caçador) e o Pedrinho. O **Tobias**, caçador, foi atrás do dragão, torceu o pé e está na montanha, perto da fonte das brasas: foi ele quem ouviu a Bell cantando lá em cima. Hoje todos são desenhados no código (seção 7.12).")
w()
w("### Personagens citados nos documentos")
w("- **Mestre Ivo:** o capataz que fechou as Minas de Cristal há cinquenta anos e levou a alavanca do carrinho para a forja.")
w("- **Mestre Aurélio:** o ferreiro da Forja Antiga, mestre do Seu Bento, autor da receita da Armadura de Brasa.")
w()
w("### Criaturas")
w("- **Sombras:** criaturas escuras que surgem depois que a Line pega a espada. Investem contra ela e são fracas contra a luz.")
w("- **Fogos-fátuos:** luzinhas que flutuam, mantêm distância e atiram orbes. São azuis nas ruínas e de fogo na montanha.")
w()

# =====================================================================
w("## 3. A história")
w()
w("> **O fio da história:** *luz não se rouba, se divide.* O dragão acha que pode tomar a luz de um coração para se aquecer. Todo mundo que a Line encontra diz a mesma coisa de um jeito diferente: o Mago (“Luz não se rouba, menina. Se divide.”), o Espírito das Ruínas (“A luz que se divide nunca acaba. A que se prende, apaga.”), o Guardião (“O dragão também já foi luz, um dia.”) e a Bell, que canta para o dragão na jaula. No fim, a Line entende e faz isso.")
w()
w("**Prólogo — O primeiro encontro (09/05/2024).** No Minas Shopping, a Line vê a Bell de longe e fica encantada. Elas conversam, a Bell diz que a Line está atrasada e as duas comem BK. A Line confessa que está tímida porque a Bell é muito linda. De mãos dadas, vão ao playground, onde a Line tenta a máquina de soco, faz só 038 pontos e a Bell morre de rir. No túnel, dão o primeiro beijo. O tempo passa, e o sonho das duas vira uma fazendinha.")
w()
w("**Capítulo 1 — Nossa vidinha.** Amanhece na fazenda. A Bell acorda a Line e conta um sonho estranho: um dragão enorme, vermelho, **tremendo de frio**. A Line brinca que é fome de café. As duas cuidam da fazenda (ovos, horta, ração do Theo, carinho nos bichinhos), almoçam juntas e vão de mãos dadas ver o pôr do sol no lago. A Bell pede: “Promete que amanhã a gente volta?”. A Line promete: “Amanhã, depois de amanhã… todo dia que você quiser.” Elas dançam e dão uma bitoquinha.")
w()
w("**O rapto.** O céu escurece e um dragão vermelho mergulha do céu. A Bell reconhece: “É ele… o dragão do meu sonho.” Ele a leva. A Line corre, grita, chora, e decide ir buscá-la. Pede ao Theo que cuide da fazenda.")
w()
w("**Capítulo 2 — Atrás da Bell.** Na Floresta Sussurrante, o Mago conta a lenda: o dragão dorme cem anos, o fogo dele esfria, e ele acorda procurando o calor de um coração brilhante. A Line lembra do sonho da Bell. O Mago entrega a espada e aponta os caminhos: as ruínas ao norte, a gruta a leste, o Vilarejo do Riacho ao sul. *Enquanto isso*, no covil, a Bell acorda numa jaula; o dragão murmura de frio no sono, e ela se agarra a uma certeza: deixou a fita cair de propósito, e a Line sempre acha o que ela perde.")
w()
w("**O vilarejo e as minas.** No Vilarejo do Riacho, os moradores ajudam como podem: a Dona Rosa com poções e bombas, o Seu Bento com armaduras. O Seu Zé conta que, cinquenta anos atrás, a montanha começou a esquentar e a respirar de noite, e o capataz fechou as minas e levou a alavanca do carrinho para a Forja Antiga. A Dona Lurdes está aflita: o marido, o caçador Tobias, viu o dragão passar e não voltou. Na porta da cabana dele, a Line acha o bilhete: ele subiu a montanha atrás do dragão. Na Gruta dos Ecos, a Line chama pela Bell e só o eco responde. Mais a fundo ficam as Minas de Cristal, escuras e cheias de morcegos.")
w()
w("**Capítulo 3 — A luz das ruínas.** Nas Ruínas Encantadas, o Espírito das Ruínas passa a luz para a espada da Line e ensina: “A luz que se divide nunca acaba. A que se prende, apaga.” *Enquanto isso*, a Bell vê um clarão azul lá longe, nas ruínas, e sabe que é a Line. Ela pergunta ao dragão por que ele a levou, e ele responde em pedaços: cem anos dormindo, o fogo esfria, coração brilhante aquece. A Bell entende: ele não quer machucá-la, ele está com frio. A Line acende cristais, desfaz barreiras e vence o Guardião de Pedra, que entrega a Chuva de Estrelas e deixa uma última frase: “O dragão também já foi luz, um dia.” *Enquanto isso*, o dragão ruge de frio e a Bell canta para ele a cantiga da avó: “Dorme, fogo pequenino, que a noite vai passar… quem tem alguém do lado não precisa se apagar.” O dragão se aquece um pouco.")
w()
w("**Capítulo 4 — A Montanha de Brasa.** Perto da fonte das brasas, a Line encontra o Tobias com o pé torcido. Ele viu o dragão pousar e ouviu uma voz de moça cantando a noite inteira; quando ela canta, o dragão para de rugir. “É a Bell. Ela canta quando tá com medo, pra ficar corajosa.” Na Forja Antiga, a Line acha a receita do Mestre Aurélio e a alavanca do carrinho; na caverna escondida, uma escama **fria**. Ela acende as três tochas e o portão de fogo se abre. *Enquanto isso*, o dragão sente alguém subindo com uma espada de luz. “Ela vai levar a minha luz.” A Bell responde: “Ela vai me levar pra casa. E se você deixar, ela divide um pouquinho com você.”")
w()
w("**Capítulo final — O coração do dragão.** No covil, a Bell grita que a Line veio. O dragão pousa: “Veio… pela minha luz.” A Line responde que a Bell não é luz de ninguém: é a namorada dela. A Bell avisa que ele não é mau, só está com frio, e mostra o ponto fraco. A Line vence e dá o golpe final. As duas se abraçam. Então a Bell pede: “Olha pra ele.” O dragão treme de frio no chão. A Line entende o que todos disseram: **luz não se rouba, se divide.** Ela chama as estrelas sobre ele, e o fogo do peito volta a acender. “Quente… Faz cem anos que não fica quente. Obrigado, pequena luz. Agora eu durmo em paz. Sem levar ninguém.” A Bell dá boa noite a ele.")
w()
w("**Epílogo.** De volta à fazenda, no pôr do sol do lago, com o Theo latindo de alegria. A Bell repete a pergunta do começo: “Promete que amanhã a gente volta aqui?” A Line promete de novo, e dessa vez é a Bell quem completa: “…todo dia que a gente quiser.” Elas dançam. Aparece “Fim”… e, no escuro, um olho de dragão se abre: “Fim?”.")
w()
w("**A investigação.** Ao longo da aventura, a Line junta 12 documentos (marcas de garra, cartaz do vilarejo, carta do Mago, bilhete do Tobias, a lenda, o mapa rasgado, o relatório do capataz, as páginas do diário do Guardião, a receita do Mestre Aurélio, a escama fria e a fita da Bell) e tira 8 conclusões. Várias delas apontam para o mesmo segredo: o dragão está com frio.")
w()

# =====================================================================
w("## 4. Roteiro completo, cena a cena")
w()
w("Todas as falas estão exatamente como aparecem no jogo. Entre parênteses está a expressão do retrato. As linhas com ▶ indicam a animação que toca naquele momento: o código é o mesmo da lista da seção 10.")
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
    ("floresta", "Chegada na floresta", "Primeira vez na Floresta Sussurrante. Começa o Capítulo 2.", "09-floresta-mago"),
    ("mago", "O Mago", "Ao conversar com o Mago. A primeira conversa conta a história, a segunda (depois da espada) aponta para as ruínas e as seguintes sorteiam uma dica.", None),
    ("espinhos", "Espinhos sem espada", "Ao chegar perto dos espinhos do norte sem a espada.", None),
    ("espada", "A espada", "Ao abrir o baú ao lado do Mago. Logo depois vem o primeiro interlúdio, e então aparecem as sombras.", "10-espada"),
    ("interludio:1", "Enquanto isso… (1): a Bell acorda na jaula", "Depois da espada. A tela escurece e mostra o covil: o dragão dormindo, a Bell na jaula.", "53-interludio"),
    ("chegadaVilarejo", "Chegada no Vilarejo do Riacho", "Primeira vez no vilarejo. As conversas com os moradores estão na seção 7.4.", "37-vilarejo"),
    ("chegadaGruta", "Chegada na Gruta dos Ecos", "Primeira vez na gruta. A primeira fala muda se a Line já leu a carta do Mago.", None),
    ("chegadaMinas", "Chegada nas Minas de Cristal", "Ao passar para a metade leste da gruta. A segunda fala muda se a Line já tem a lanterna.", None),
    ("ruinas", "Chegada nas Ruínas Encantadas", "", "12-ruinas-entrada"),
    ("altar", "O altar da luz", "Ao tocar a luz do altar, na sala a oeste do salão de entrada. Termina com o segundo interlúdio.", "13-altar-magia"),
    ("interludio:2", "Enquanto isso… (2): o frio do dragão", "Depois de aprender a magia.", None),
    ("golem", "O Guardião desperta", "Ao se aproximar do Guardião, no salão norte das ruínas.", "16-guardiao-acorda"),
    ("golemVencido", "O Guardião vencido", "Termina com o terceiro interlúdio.", "19-chuva-de-estrelas"),
    ("interludio:3", "Enquanto isso… (3): a cantiga", "Depois de vencer o Guardião.", None),
    ("montanha", "Chegada na Montanha de Brasa", "Começa o Capítulo 4. A câmera mostra as três tochas.", "20-montanha"),
    ("chegadaForja", "A Forja Antiga", "Ao chegar perto da bigorna da Forja Antiga, na montanha.", None),
    ("portaoAberto", "O portão se abre", "Quando a terceira tocha acende. Termina com o último interlúdio.", "21-tocha-na-lava"),
    ("interludio:4", "Enquanto isso… (4): alguém está subindo", "Depois que o portão de fogo abre.", None),
    ("bauCoracao", "Baú de coração extra", "Há três: na sala trancada da gruta, na alcova leste das ruínas e na plataforma cercada de fendas na montanha.", None),
    ("covil", "O covil do dragão", "Começa o Capítulo final. Na primeira vez a cena é completa; nas próximas tentativas, a luta começa direto.", "22-covil-dragao"),
    ("dividirLuz", "A luz dividida", "Logo depois do abraço do resgate, dentro da cena da vitória. A fala sobre a escama só aparece se a Line achou a escama fria.", "54-luz-dividida"),
    ("vitoria", "Vitória e epílogo", "Depois do golpe final. A parte da luz dividida (acima) acontece no meio desta cena, depois do abraço.", "24-epilogo"),
    ("bauItem", "Baú com itens ou pistas", "Todos os baús que não são a espada nem o coração extra. A Line agacha, o baú abre e aparece o que ela encontrou.", None),
    ("pista", "Documento encontrado", "Ao pegar um papel brilhando no chão, examinar um lugar ou abrir um baú com documento. O texto aparece parágrafo por parágrafo; se ele completar uma conclusão, aparece o título “💡 Conclusão!”. Com os 12, coração extra.", None),
    ("exame", "Examinar um lugar", "Pontos de exame: as marcas de garra no píer, o cartaz do vilarejo e o bilhete na porta da cabana do caçador.", None),
    ("porta", "Porta trancada", "Nas três portas trancadas: sem chave a Line comenta; com chave, a porta abre e a chave some.", None),
    ("semGancho", "Poste de gancho sem o gancho", "Ao chegar num poste do gancho antes de achar o gancho (sala leste das ruínas).", None),
    ("morador", "Conversa com os moradores", "Ao falar com qualquer morador do vilarejo. As falas mudam com o progresso e estão na seção 7.4. Com a Dona Rosa e o Seu Bento, a conversa termina abrindo a loja.", None),
    ("carrinhoQuebrado", "O carrinho de mina", "Numa estação, antes de consertar o carrinho. Sem a alavanca, a Line comenta o que falta; com ela, encaixa a alavanca e o carrinho volta a andar.", "40-estacao"),
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
    if chave and chave.startswith("interludio:"):
        d = inv["mundo"]["interludios"][chave.split(":")[1]]
        w(f"> 🎬 **Título na tela:** Enquanto isso... — {d['sub']}  ")
        for f in d["falas"]:
            quem, texto = f[0], f[1]
            rosto = f[2] if len(f) > 2 and f[2] else None
            w(f"> **{quem}**" + (f" *({ROSTO.get(rosto, rosto)})*" if rosto else "") + f": “{texto}”  ")
        w()
    elif chave:
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
    ("Item novo", "Aviso no canto: “🧪 Poção de Vida ×2”, “📜 Pista: Carta do Mago”…"),
    ("Cura rápida sem item", "🎒 Nenhum item de cura na mochila / ❤️ A vida já está cheia"),
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
w("> ⚠️ **Parte das animações e artes do prólogo ainda é temporária** (várias usam uma animação substituta). O **Playground já está pronto em peças** (itens 235 a 237 e 240) e o soco da Line e a risada da Bell têm arte final (itens 238 e 239).")
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
img("encontro-fundos", "Os três lugares: Minas Shopping (praça de alimentação), Playground e Túnel")
w("A tela do HTML é vertical (360×640). No jogo, o lugar ocupa essa mesma área, centralizado, e em telas largas as laterais mostram o próprio cenário borrado e escurecido. A área onde dá para andar é a mesma do HTML.")
w()
w("**Minas Shopping**")
w("- **Fundo (em peças):** a praça de alimentação do modelo (seção 22.11): o piso claro de losangos com o teto de madeira, as luzes embutidas e a coluna branca; por cima, a loja de hambúrguer e a de frango, seis mesas redondas com cadeiras de madeira e dois canteiros.")
w("- **Posições:** a Line entra por baixo, no corredor do meio, de costas. A Bell espera no mesmo corredor, entre as mesas. O lanche do BK acontece no corredor, entre a segunda e a terceira fila de mesas (a animação traz a mesa delas), e as duas saem por baixo.")
w("- **Ainda pode melhorar:** o casal comendo sentado numa das mesas da praça (`LINE_SIT_CHAIR_EAT` e `BELL_SIT_CHAIR_EAT`, no documento de pendências).")
w()
w("#### ⭐ Minas Shopping: modelo real para a arte final")
w()
w("> 💛 **Este é o cenário de verdade do Minas Shopping**: a praça de alimentação onde as duas se encontraram. A praça que está no jogo segue esta foto e o modelo em pixel art que a dona do jogo mandou (seção 22.11).")
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
w("- A Line entra por baixo, no corredor do meio. A Bell espera no corredor, entre as mesas. O lanche do BK acontece no corredor.")
w("- As setas, o ícone de hambúrguer e coxinha e o triângulo que aparecem na foto são do app onde ela foi tirada e **não fazem parte do cenário**.")
w()
w("A foto também fica salva em `arte/referencias/minas_shopping_modelo.jpg`.")
w()
w("**Playground** (pronto, montado em peças)")
w("- **Fundo:** a sala vazia do item 235 (2160×3840): teto com luzes neon rosa e azul, parede roxa ao fundo, paredes laterais com portas iluminadas, piso xadrez roxo brilhante e a saída por um corredor, embaixo à direita.")
w("- **Peças:** cada uma é um PNG à parte (itens 236 e 237), no tamanho da **régua** (medida real × a altura da Line, seção 23.6) e na posição do guia do item 240. O jogo desenha cada peça pela linha em que ela encosta no chão, então a Line e a Bell passam na frente e atrás de tudo.")
w("- **Máquina de soco:** a do item 237, com o placar **000** antes do soco e **038** no impacto. A arte chegou só com o 038; o 000 foi feito copiando o “0” da própria arte por cima do “3” e do “8”.")
w("- **Animações:** `LINE_PUNCH_MACHINE` (item 238) e `BELL_LAUGH_AT_LINE` (item 239), seis quadros cada, já sem a máquina desenhada junto.")
w()
w("#### Playground: o cenário no jogo")
w()
img("encontro-playground", "Playground montado em peças, com cada parte numerada, e o placar antes e depois do soco")
w("| # | Parte | Arte | Tamanho (régua) | Onde fica (tela de 360×640) |")
w("|---|---|---|---|---|")
for l in [
    ("1", "Painel de prêmios", "`PLAYGROUND_PAINEL_PREMIOS`", "4 m de largura", "na parede do fundo, ao centro (x 180, base 122)"),
    ("2", "Fliperama rosa", "`PLAYGROUND_FLIPERAMA_ROSA`", "1,80 m de altura", "à esquerda, no alto (x 62, base 235); **espelhado** para a tela olhar para dentro da sala"),
    ("3", "Balcão de prêmios", "`PLAYGROUND_BALCAO_PREMIOS`", "2,60 m de largura", "à direita, no alto (x 268, base 228)"),
    ("4", "Fliperama azul", "`PLAYGROUND_FLIPERAMA_AZUL`", "1,80 m de altura", "à esquerda, no meio (x 66, base 398)"),
    ("5", "Máquina de soco", "`PLAYGROUND_MAQUINA_SOCO_000` / `_038`", "2,20 m de altura", "no meio, à direita (x 231, base 438); a plataforma fica sob os pés da Line"),
    ("6", "Line", "`LINE_PUNCH_MACHINE`", "—", "em frente ao saco (x 203, y 428): o punho do quadro do golpe alcança o saco"),
    ("7", "Bell", "`BELL_LAUGH_AT_LINE`", "—", "olhando, à esquerda (x 135, y 442)"),
    ("8", "Entrada", "—", "—", "embaixo, à esquerda (as duas chegam por aqui)"),
    ("9", "Saída", "—", "—", "pelo corredor, embaixo à direita"),
]:
    w("| " + " | ".join(l) + " |")
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
w("Estas são as animações próprias do prólogo, no grupo **Primeiro encontro (prólogo)** da seção 10. As que ainda não têm arte usam uma substituta parecida.")
w()
USO = {
    "LINE_ADMIRE": "Início: a Line vê a Bell de longe. Precisa da Line de costas ou de lado, com a mão no peito, corações e o corpo balançando.",
    "BELL_WAIT": "A Bell esperando no shopping: olha para os lados, mexe no cabelo, confere o celular. Virada para a esquerda.",
    "LINE_BELL_MEET": "As duas frente a frente, conversando e sorrindo. Usada no “esse shopping é muito grande”, no “oq vamos comer?” e antes de saírem.",
    "LINE_BELL_GREET_HUG": "Abraço de chegada no “Você tá atrasada”. O HTML mostra a Bell pulando no abraço com uma perna levantada.",
    "LINE_BELL_BK": "As duas sentadas à mesa comendo BK (hambúrguer, batata e refri), com a mesa desenhada. O HTML tem 3 quadros.",
    "LINE_PUNCH_MACHINE": "A Line na máquina de soco (item 238): guarda, preparo, avanço, soco e volta. A máquina é uma peça à parte; o placar vira 038 no quadro do soco. Os mesmos quadros fazem o soco sem espada.",
    "BELL_LAUGH_AT_LINE": "A Bell gargalhando da Line (item 239): tapa a boca, se curva de rir, chora de rir e enxuga a lágrima.",
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
w("- [ ] `LINE_ADMIRE`, `BELL_WAIT`, `LINE_BELL_MEET`, `LINE_BELL_GREET_HUG`, `LINE_BELL_BK` e `LINE_BELL_TUNNEL_KISS` com arte própria.")
w("- [x] `LINE_PUNCH_MACHINE` e `BELL_LAUGH_AT_LINE` finais (itens 238 e 239) e a máquina de soco à parte (item 237).")
w("- [x] Playground em peças (itens 235 a 237 e 240).")
w("- [ ] Máquina de soco com o placar **000** desenhado pela artista (hoje o 000 é feito a partir do 038).")
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
MUNDO = inv["mundo"]
MAPAS_M = MUNDO["mapas"]
ITENS_M = MUNDO["itens"]

def conteudo_bau(c):
    if c == "espada": return "⚔️ a espada"
    if c == "coracao": return "❤️ coração extra"
    partes = []
    for id_, n in c.get("itens", []):
        it = ITENS_M[id_]; partes.append(f"{it['icone']} {it['nome']}" + (f" ×{n}" if n > 1 else ""))
    for d in c.get("pistas", []):
        p = MUNDO["pistas"][d]; partes.append(f"{p['icone']} {p['titulo']}")
    if c.get("moedas"): partes.append(f"🪙 {c['moedas']} moedas")
    return " + ".join(partes)

ONDE_BAU = {
    "fazenda:41,10": "atrás do chiqueiro (aparece depois do rapto)",
    "floresta:3,12": "clareira do Mago", "floresta:2,17": "clareira do Mago, mais ao sul",
    "floresta:45,13": "meio da trilha leste", "floresta:62,23": "ilha no lago da clareira leste (só com o **gancho**)",
    "floresta:72,39": "canto sudeste, atrás da **pedra rachada** (precisa de **bomba**)",
    "vilarejo:50,36": "canto sudeste do vilarejo, perto do riacho",
    "gruta:26,2": "salão norte", "gruta:5,10": "canto oeste", "gruta:30,12": "nicho leste",
    "gruta:13,24": "sala trancada do sul (precisa de **chave**)", "gruta:38,3": "salão de entrada das Minas",
    "gruta:56,20": "galeria escura das Minas (precisa de **lanterna** para achar)", "gruta:44,41": "do outro lado do abismo das Minas (só com o **gancho**)",
    "ruinas:36,19": "alcova do salão do meio (abre com um cristal)", "ruinas:47,27": "ala leste da entrada",
    "ruinas:47,16": "biblioteca trancada (precisa de **chave**)", "ruinas:57,17": "sala leste nova",
    "ruinas:62,4": "torre nordeste, do outro lado do fosso (só com o **gancho**)",
    "montanha:5,9": "plataforma cercada de fendas, no topo", "montanha:44,18": "encosta leste",
    "montanha:43,26": "caverna escondida (precisa de **chave**)", "montanha:68,15": "Forja Antiga (sala do X vermelho do mapa)",
    "montanha:61,5": "depois do chão em brasa (só com a **Armadura de Brasa**)",
}

w("## 6. As fases")
w()
w("Os três lugares do prólogo (Minas Shopping, Playground e Túnel) estão na seção 5. A aventura tem **sete áreas**, todas ligadas entre si (a seção 7.1 mostra como). As áreas ficaram bem maiores nesta versão:")
w()
w("| Área | Tamanho (tiles) | Baús | Inimigos | Novidades |")
w("|---|---|---|---|---|")
NOMES_INIM = {"sombra": "sombras", "fogo": "fogos-fátuos de fogo", "luz": "fogos-fátuos azuis", "morcego": "morcegos"}
NOVIDADE = {
    "fazenda": "estrada nova para o vilarejo, a leste",
    "vilarejo": "área nova: moradores, loja, ferraria, fonte e estação do carrinho",
    "floresta": "cabana do caçador, lago com ilha (gancho), pedra rachada (bomba), saída para o vilarejo",
    "gruta": "metade nova: as **Minas de Cristal**, escuras, com morcegos, trilhos, estação e abismo (gancho)",
    "ruinas": "torre nordeste (gancho), sala leste, atalho para as Minas",
    "montanha": "Forja Antiga, estação, chão em brasa, atalho para as Minas",
    "covil": "—",
}
for id_ in ["fazenda", "vilarejo", "floresta", "gruta", "ruinas", "montanha", "covil"]:
    m = MAPAS_M[id_]
    ini = ", ".join(f"{n} {NOMES_INIM.get(t, t)}" for t, n in m["inimigos"].items()) or "—"
    w(f"| {m['nome']} | {m['w']} × {m['h']} | {len(m['baus'])} | {ini} | {NOVIDADE[id_]} |")
w()
w("### 6.1 Fazendinha")
w("O chão da fazenda é o **terreno oficial** (item 144), uma imagem só, e o mapa foi ajustado em cima dela: a casa fica no noroeste, com a casinha do Theo e a tigela ao lado, o varal e o galinheiro logo abaixo, a horta e o poço no meio, o pasto com porteira a leste e o lago ao sul. A porta da casa leva para dentro (seção 6.8).")
w()
w("**Objetos da fazenda (itens 158 a 227), poucos e agrupados:** cada grupo encosta numa construção ou cerca, e as estradas, a faixa entre a casa e a horta, a beira do lago, as portas e as porteiras ficam livres. **Entrada norte:** arco com a placa de boas-vindas. **Casa:** lenha na parede, caixa de correio, cadeira de balanço, galochas e sino na varanda, capacho; colmeia com mel e fumigador no pomar. **Jardim da frente:** bancada de mudas, duas floreiras, banho e casinha de passarinho. **Varal** com o cesto de prendedores. **Galinheiro:** ninho, ovos, comedouro e bebedouro. **Horta:** o poço e o **regador** (some quando a Line o pega na tarefa da manhã) sozinhos na faixa de cima, o espantalho entre os canteiros e a colheita embaixo (carrinho, cesto e abóboras). **Celeiro:** silo e barril de chuva de um lado, roda de carroça, ferraduras e latão de leite do outro, ferradura e cabresto na parede, cata-vento no telhado. **Pasto:** tudo encostado na cerca de cima (cavalete com sela e escova, cocho de feno, bebedouro, cocho de ração, banquinho e balde de ordenha) e a tosquia e o sal no canto de baixo, deixando o campo livre para os bichos. **Lago:** fogueira e banco no gramado da esquerda, taboas, vitórias-régias, corda e caixote no píer. As ferramentas de jardim que sobravam (mangueira, pá, enxada, treliça, composteira) foram para a horta da Dona Cora, no vale, e a sapateira para dentro de casa.")
w()
img("fazenda-objetos", "Objetos novos perto da casa: caixa de correio, capacho, cadeira de balanço, lenha, colmeia, ferramentas, balde e regador")
w("Casa com varanda e duas chaminés, celeiro, galinheiro, horta, poço, moinho, pasto, chiqueiro, lago com píer e barco, varal, casinha do Theo, mesa de piquenique, árvores frutíferas e flores. Tem borboletas, pássaros, nuvens, folhas caindo e fumaça nas chaminés. De manhã, a luz é clara. À tarde, o céu fica alaranjado, e depois do rapto vira noite com vaga-lumes.")
w()
w("Depois do rapto, abre a **estrada do leste**, que leva ao Vilarejo do Riacho. Antes disso a estrada fica fechada: a Line não sai da fazenda no meio do dia com a Bell.")
w()
img("fazenda-casa", "A casa da fazenda no terreno oficial: casinha do Theo, tigela, varal, galinheiro, horta e poço")
img("fazenda-centro", "Horta, pomar, lago e o pasto com cerca nova")
img("mapa-fazenda", "Mapa da fazendinha: saída norte para a floresta e estrada leste para o vilarejo")
w("### 6.2 Vilarejo do Riacho (área nova)")
w("Um vilarejo pequeno a leste da fazenda, com uma praça de terra batida no meio, fonte, quadro de avisos, casinhas de telhado colorido, barraca de feira, um riacho ao sul e a estação do carrinho de mina a leste. Não tem inimigos: é o lugar seguro da aventura.")
w()
w("- **Praça:** a fonte (cura e vira ponto de retorno) e o **cartaz do vilarejo**, que é um documento de investigação.")
w("- **Loja da Dona Rosa** (casa de telhado roxo, a oeste da praça, com letreiro; a Dona Rosa atende **lá dentro, atrás do balcão**): vende poções, elixir, bombas, a Pena de Fênix e as Botas de Andarilha.")
w("- **Ferraria do Seu Bento** (casa de telhado azul, a leste, com letreiro; a bigorna, a lenha e o barril ficam do lado de fora): o Seu Bento atende **lá dentro, atrás do balcão**, e vende as armaduras. As duas lojas fecham à noite.")
w("- **Estação do Vilarejo:** o carrinho de mina parado nos trilhos, esperando a alavanca do freio.")
w("- **Moradores:** Dona Rosa, Seu Bento, Seu Zé (o mais velho, conta a história do carrinho), Dona Lurdes (mulher do caçador) e o Pedrinho (que corre de um lado para o outro e conta da pedra rachada).")
w("- **Saídas:** oeste para a fazenda e norte para a floresta.")
w()
img("37-vilarejo", "O Vilarejo do Riacho: praça, fonte e moradores")
img("mapa-vilarejo", "Mapa do vilarejo: loja (oeste), ferraria (leste), praça, riacho e estação")
w("### 6.3 Floresta Sussurrante")
w("Trilha com raízes (correr sobre elas faz a Line tropeçar, a não ser com as Botas de Andarilha), riacho para pular, a clareira do Mago com o baú da espada, espinhos que fecham o norte e sombras depois que a espada é pega. Ela cresceu para o leste e para o sul:")
w()
w("- **Clareira do Mago (oeste):** o Mago, o baú da espada e o baú da **Carta do Mago**.")
w("- **Trilha leste:** leva à entrada da Gruta dos Ecos.")
w("- **Cabana do caçador (nordeste):** na porta está pregado o **bilhete do caçador** Tobias.")
w("- **Clareira do lago (sudeste):** um lago com uma **ilha no meio**, alcançada com o **gancho** entre dois postes. Mais ao sul, uma **pedra rachada** esconde um baú: precisa de **bomba**.")
w("- **Saídas:** sul para a fazenda, norte para as ruínas (depois da espada), leste para a gruta e sudeste para o vilarejo.")
w()
img("11-floresta-sombras", "Sombras na floresta")
img("45-gancho", "O poste do gancho na beira do lago: do outro lado fica a ilha")
img("mapa-floresta", "Mapa da floresta: clareira do Mago, cabana do caçador, lago com ilha e as quatro saídas")
w("### 6.4 Gruta dos Ecos e Minas de Cristal")
w("A gruta ficou com o dobro do tamanho. A metade oeste é a caverna azulada de antes; a metade leste são as **Minas de Cristal**, abandonadas desde que o dragão acordou.")
w()
w("- **Gruta (oeste):** fonte, pergaminho da **Lenda da Montanha**, a bússola, um elixir, uma chave e a sala trancada com o coração extra e o **Mapa rasgado**.")
w("- **Salão de entrada das Minas:** o baú da **lanterna**, a placa das minas, a **Estação das Minas** e o **relatório do capataz**.")
w("- **Galerias escuras:** sem a lanterna, a Line só enxerga um pouquinho em volta; com ela, a luz fica bem maior. Moram ali os **morcegos**. No meio, um baú de bombas.")
w("- **Abismo:** uma fenda funda que só se atravessa com o **gancho**. Do outro lado, a **Pena de Fênix**.")
w("- **Paredes rachadas:** duas, que abrem com **bomba** o atalho para a **Montanha de Brasa** (leste).")
w("- **Saídas:** oeste para a floresta, norte para as ruínas (um atalho que só abre acendendo o cristal do lado das ruínas) e leste para a montanha (depois das paredes rachadas).")
w()
img("26-gruta", "A Gruta dos Ecos: fonte, cogumelos luminosos e o pergaminho da lenda")
img("43-minas-escuro", "Galeria escura sem lanterna: a Line quase não enxerga")
img("44-minas-lanterna", "A mesma galeria com a lanterna")
img("mapa-gruta", "Mapa da gruta e das Minas: a gruta azul a oeste, as minas a leste, a estação, o abismo e os atalhos")
w("### 6.5 Ruínas Encantadas")
w("Um templo antigo de pedra e musgo, organizado em salas:")
w()
w("- **Salão sul (entrada):** a placa, uma fonte e dois cristais que abrem a barreira do meio. A oeste fica a **sala do altar**, onde a Line aprende a magia, e no chão, perto dele, a **página 1 do diário do Guardião**.")
w("- **Salão do meio:** dois lagos com um cristal numa ilhota em cada um (só acendem de longe, com o Raio de Luz), mais um cristal, pilares, sombras e fogos-fátuos. A leste fica a **alcova com o coração extra**.")
w("- **Salão norte:** arena com pilares onde dorme o **Guardião de Pedra**. Vencido, ele desfaz a última barreira, que leva à montanha.")
w("- **Ala leste da entrada:** pilares, sombras e um baú com **chave antiga** e moedas.")
w("- **Biblioteca (trancada):** o baú com a **página 2 do diário** e um elixir.")
w("- **Sala leste (nova):** o baú do **gancho**.")
w("- **Torre nordeste (nova):** do outro lado de um fosso, alcançada com o gancho entre dois postes. Tem um baú com elixir e 60 moedas.")
w("- **Atalho sudeste (novo):** um corredor fechado por uma barreira de luz; acendendo o cristal da sala do lado, ele abre a passagem para as Minas.")
w("- **Saídas:** sul para a floresta, norte para a montanha (depois do Guardião) e sudeste para as Minas.")
w()
img("33-biblioteca", "A biblioteca trancada das ruínas")
img("15-barreira-aberta", "Cristais acesos e barreira desfeita")
img("mapa-ruinas", "Mapa das ruínas: salões, biblioteca, torre do gancho e o atalho para as Minas")
w("### 6.6 Montanha de Brasa")
w("Rocha vulcânica, rios de lava e brasas subindo:")
w()
w("- **Início:** uma fenda para pular e a **primeira tocha**, perto da placa.")
w("- **Meio:** lava dos dois lados, a **fonte das brasas** e a segunda tocha, numa **ilha no meio da lava**, que só acende de longe.")
w("- **Topo:** a **terceira tocha**, a **plataforma com o coração extra** e o **portão de fogo**, que abre com as três tochas. Perto dele, a **fita de cabelo da Bell**.")
w("- **Encosta leste:** um baú com **chave antiga** e a porta de ferro da **caverna escondida**, onde estão a **escama vermelha** e uma poção.")
w("- **Forja Antiga (nova):** a sala do X vermelho do mapa rasgado. Tem a bigorna do Mestre Aurélio, a **receita da Armadura de Brasa** e o baú da **Alavanca de Ferro**.")
w("- **Estação da Forja (nova):** a terceira estação do carrinho.")
w("- **Chão em brasa (novo):** um caminho de brasa rasa que queima a Line (meio coração a cada meio segundo). Só com a **Armadura de Brasa** dá para atravessar até o baú do fundo, com 90 moedas e um elixir.")
w("- **Saídas:** sul para as ruínas, norte para o covil (pelo portão de fogo) e leste para as Minas.")
w()
img("21-tocha-na-lava", "A tocha da ilha de lava, que só acende de longe")
img("47-brasa", "O chão em brasa da montanha")
img("mapa-montanha", "Mapa da montanha: as três tochas, o portão, a Forja Antiga, a estação e o chão em brasa")
w("### 6.7 Covil do Dragão")
w("Caverna escura com lava nas laterais e estalagmites. A Bell fica numa jaula ao fundo. Quando a Line entra, a entrada desmorona e a luta começa. É a única área sem volta.")
w()
img("23-dragao-fogo", "O dragão cospe fogo no covil")
w("### 6.8 Casas por dentro")
w("Toda casa do jogo tem interior. Perto da porta aparece **Entrar**; para sair, é só descer pelo caminho de pedra até a porta. Os móveis têm volume: a Line passa na frente e atrás deles, e não atravessa camas, mesas e estantes.")
w()
w("| Casa | Onde fica | Piso | O que tem dentro |")
w("|---|---|---|---|")
for casa, onde, piso, dentro in [
    ("Casa da fazenda", "fazendinha (noroeste)", "madeira, terracota na cozinha, azulejo no banheiro", "cozinha com fogão, geladeira, pia, ilha com banquetas, despensa, temperos, relógio, quadro e mesa com vaso; sala com o sofá e a estante encostados na parede do fundo, a mesinha na frente do sofá e duas poltronas de frente uma para a outra diante da lareira; quarto com cama de casal, criados-mudos, guarda-roupa e espelho; banheiro com vaso, pia e box (entra-se pela abertura na parede da esquerda, pelo corredor que sai da sala); corredor da entrada com a sapateira e a caminha do Theo"),
    ("Cabana do caçador", "floresta (nordeste)", "madeira", "lareira, estante, cama, poltrona, cestos, uma caminha de cachorro, relógio e o suporte de ferramentas com balde"),
    ("Loja da Dona Rosa", "vilarejo (oeste)", "terracota", "estantes cheias, balcão com vaso, barril, caixote, cestos, sacos de sementes, cesto de colheita e planta"),
    ("Ferraria do Seu Bento", "vilarejo (leste)", "lajota de pedra", "forja acesa, bigorna, bancada, barris, caixote, lenha, ferramentas e balde"),
    ("Casas do vilarejo (3)", "vilarejo (sul)", "madeira e terracota", "fogão, geladeira, mesa, camas, sofá, poltronas e estantes"),
    ("Casa da Dona Cora", "Vale das Raízes", "terracota", "cozinha completa, mesa, cama e cesto"),
    ("Casa do Seu Tião", "Lago Espelhado", "azulejo", "cômoda, cama, poltrona, mesinha e cesto"),
]:
    w(f"| {casa} | {onde} | {piso} | {dentro} |")
w()
img("interior-fazenda", "A casa da fazenda por dentro: quarto, sala e banheiro")
img("interior-fazenda-sala", "Cozinha e sala da casa da fazenda")
img("interiores-casas", "As outras casas por dentro: cabana, loja, ferraria, três casas do vilarejo, casa da Cora e casa do Tião")

# =====================================================================
w("## 7. Exploração: mundo interligado, vilarejo, loja, carrinho, itens, documentos e mapa")
w()
w("> ⚠️ Tudo desta seção também é **temporário**: os itens aparecem como emojis e os objetos novos (moradores, carrinho, postes, bombas, paredes rachadas) são desenhados no código até a arte final chegar.")
w()
w("Depois do rapto, o jogo vira uma aventura de exploração: sete áreas ligadas por vários caminhos, um vilarejo com loja e ferraria, moedas, armaduras, dez itens (cada um com uma função), doze documentos de investigação que se juntam em oito conclusões, um carrinho de mina que liga três estações e um mapa que só acende onde a Line já passou.")
w()
w("### 7.1 Como as fases se ligam")
w()
w("```")
w("                         [ Covil ]")
w("                             │ portão de fogo (3 tochas)")
w("                    [ Montanha de Brasa ]══ estação da Forja")
w("                     │               │ paredes rachadas (bomba)")
w("        Guardião ─── │               │")
w("                [ Ruínas ]──atalho──[ Gruta dos Ecos + Minas ]══ estação das Minas")
w("                     │  (cristal)     │")
w("         espinhos ── │                │")
w("                [ Floresta Sussurrante ]")
w("                     │           │")
w("               [ Fazendinha ]──[ Vilarejo do Riacho ]══ estação do Vilarejo")
w("                        estrada leste (depois do rapto)")
w("```")
w()
w("| De | Para | O que abre o caminho |")
w("|---|---|---|")
LIGA = [
    ("Fazendinha", "Floresta", "livre"), ("Fazendinha", "Vilarejo", "depois do rapto"), ("Vilarejo", "Floresta", "livre"),
    ("Floresta", "Gruta", "livre"), ("Floresta", "Ruínas", "cortar os espinhos com a espada"),
    ("Gruta (Minas)", "Ruínas", "acender o cristal da sala sudeste das ruínas; antes disso a barreira fecha a passagem"),
    ("Gruta (Minas)", "Montanha", "explodir as duas paredes rachadas com bombas"),
    ("Ruínas", "Montanha", "vencer o Guardião de Pedra"), ("Montanha", "Covil", "acender as três tochas"),
    ("Vilarejo · Minas · Forja", "(carrinho)", "encaixar a Alavanca de Ferro numa estação e descobrir as outras"),
]
for l in LIGA: w("| " + " | ".join(l) + " |")
w()
w("Toda saída tem caminho de volta (menos o covil), e os testes automatizados conferem isso em cada mudança (seção 15).")
w()
w("### 7.2 Moedas")
w()
w("- **De onde vêm:** inimigos derrotados soltam moedas (sombra 1 a 3, fogo-fátuo 2 a 3, morcego 1 a 2, Guardião 30); quase todos os baús têm moedas; e há montinhos brilhando pelo chão.")
w("- As moedas soltas voam até a Line quando ela chega perto e somem depois de 25 segundos.")
w("- **HUD:** o total fica embaixo dos corações e da magia.")
w("- **Para que servem:** comprar na loja da Dona Rosa e na ferraria do Seu Bento.")
w()
w("### 7.3 Loja da Dona Rosa e ferraria do Seu Bento")
w()
w("Falando com a Dona Rosa ou com o Seu Bento, a conversa termina com a janela da loja. Cada produto mostra o preço, a descrição e quanto a Line já tem. Se faltar dinheiro, a loja diz quanto falta. **Esc** ou **Sair** fecha.")
w()
img("38-loja-rosa", "A loja da Dona Rosa")
w("| Loja | Produto | Preço | Observação |")
w("|---|---|---|---|")
for loja_id, loja in MUNDO["lojas"].items():
    for p in loja["produtos"]:
        if "armadura" in p:
            a = MUNDO["armaduras"][p["armadura"]]
            obs = f"{a['escudos']} escudo" + ("s" if a["escudos"] > 1 else "") + (" · não queima na brasa · só com a receita do Mestre Aurélio" if a.get("brasa") else "")
            w(f"| {loja['titulo']} | {a['icone']} {a['nome']} | {a['preco']} | {obs} |")
        else:
            it = ITENS_M[p["id"]]
            obs = ("máximo 1" if p.get("max") else "") + (f"vem com {p['n']}" if p.get("n", 1) > 1 else "")
            w(f"| {loja['titulo']} | {it['icone']} {p.get('nome') or it['nome']} | {p['preco']} | {obs or '—'} |")
w()
w("**Armaduras e escudos 🛡:** cada escudo segura um golpe inteiro antes de chegar nos corações. Os escudos aparecem em azul ao lado dos corações e voltam sozinhos, um por vez (6 segundos cada), depois de 5 segundos sem apanhar. Beber de uma fonte enche todos. Só dá para comprar uma armadura melhor que a atual.")
w()
img("39-ferraria", "A ferraria do Seu Bento com as três armaduras")
img("48-hud-escudos", "HUD: corações, escudos da armadura, magia, moedas e o item do atalho")
w("### 7.4 Moradores do vilarejo")
w()
w("| Morador | Quem é | O que conta |")
w("|---|---|---|")
for l in [
    ("Dona Rosa 🧪", "mercadora", "fica sabendo da Bell e oferece poções e bombas; depois lembra para que servem as bombas"),
    ("Seu Bento ⚒️", "ferreiro, aprendiz do Mestre Aurélio", "conta que aprendeu o ofício na Forja Antiga e explica os escudos; ao ver a receita, reconhece a letra do mestre depois de cinquenta anos e passa a forjar a Armadura de Brasa"),
    ("Seu Zé", "o morador mais velho", "empurrava o carrinho quando era moço; conta que há cinquenta anos a montanha esquentou e o Mestre Ivo fechou as minas e levou a alavanca; depois comemora o carrinho andando"),
    ("Dona Lurdes", "mulher do caçador Tobias", "está aflita porque o marido não voltou; depois do bilhete, pede para a Line procurá-lo na montanha; quando a Line acha o Tobias, agradece com **2 Poções de Vida** (uma vez)"),
    ("Tobias (na montanha)", "caçador, com o pé torcido perto da fonte das brasas", "viu o dragão pousar e ouviu a Bell cantando; “quando ela canta, o dragão para de rugir”; a Line conta que a Bell canta quando está com medo, para ficar corajosa"),
    ("Pedrinho", "menino curioso", "conta da pedra rachada da floresta; depois que ela explode, fica encantado"),
]:
    w("| " + " | ".join(l) + " |")
w()
w("As falas mudam conforme o progresso (itens, documentos e o carrinho), e o jogo guarda com quem a Line já conversou.")
w()
w("### 7.5 Mochila e itens (um item, uma função)")
w()
w("A mochila abre com **I** (ou o botão 🎒 no celular, que mostra quantos itens novos chegaram) e pausa o jogo. Tem três abas: **Itens**, **Pistas** e **Mapa**. Também dá para abrir pela pausa.")
w()
w("No topo da aba Itens fica o **equipamento**: moedas, armadura e o item que está no **atalho**. Itens usáveis podem ser equipados no atalho e usados a qualquer momento com **F** (ou o botão do item no celular). A **poção** tem o atalho próprio **H** (botão 🧪).")
w()
img("49-mochila-itens", "A aba de itens: equipamento no topo, grade de itens e o detalhe do item escolhido")
w("| Item | Tipo | O que faz | Onde achar |")
w("|---|---|---|---|")
ONDE_ITEM = {
    "pocao": "loja da Dona Rosa (20); baús da floresta e da montanha",
    "elixir": "loja (25); baús da gruta, biblioteca, torre das ruínas e montanha",
    "bomba": "loja (3 por 30); baús da floresta, vilarejo e Minas",
    "pena": "loja (80); do outro lado do abismo das Minas",
    "chave": "baús da gruta, das ruínas e da montanha",
    "lanterna": "salão de entrada das Minas",
    "gancho": "sala leste das ruínas",
    "bussola": "salão norte da gruta",
    "botas": "loja da Dona Rosa (60)",
    "alavanca": "Forja Antiga, na montanha",
}
TIPO_ITEM = {"consumivel": "gasta ao usar", "ferramenta": "ferramenta (fica para sempre)", "chave": "chave (some ao abrir)", "historia": "item da história"}
for id_ in MUNDO["ordemItens"]:
    it = ITENS_M[id_]
    tipo = TIPO_ITEM.get(it["tipo"], it["tipo"]) + (" · vai no atalho F" if it.get("equipavel") else "")
    w(f"| {it['icone']} {it['nome']} | {tipo} | {it['desc']} | {ONDE_ITEM.get(id_, '')} |")
w()
w("**Menos vida espalhada:** não existem mais pães, maçãs nem flores de cura pelo mapa. A vida volta nas **fontes**, nas **poções** (compradas ou achadas) e em corações que caem dos inimigos só de vez em quando (e nunca com a vida cheia). A chance de cair coração baixou para 25% no Fácil, 10% no Normal e 4% no Difícil.")
w()
w("### 7.6 Documentos de investigação e conclusões")
w()
w("A aba **Pistas** virou um caderno de investigação. São **12 documentos**, cada um com **tipo** (anotação, cartaz, carta, diário, pergaminho, mapa, relatório, receita, objeto), **autor**, **data**, o lugar onde foi achado e o texto completo em parágrafos. Cada tipo tem cara de papel diferente no leitor (o relatório é datilografado, o diário tem lombada, o cartaz tem moldura). Alguns documentos **marcam um lugar no mapa** com um alfinete 📍, sem acender a área.")
w()
w("Quando dois documentos combinam, a Line tira uma **conclusão** (aparece um título “💡 Conclusão!” e ela fica anotada no caderno). Algumas conclusões mudam o jogo.")
w()
img("50-documento-relatorio", "O caderno de investigação com o relatório do capataz aberto")
w("| # | Documento | Tipo | Autor | Onde | Marca no mapa |")
w("|---|---|---|---|---|---|")
for k, id_ in enumerate(MUNDO["ordemPistas"], 1):
    p = MUNDO["pistas"][id_]
    marca = f"📍 {p['marca']['rotulo']}" if p.get("marca") else "—"
    w(f"| {k} | {p['icone']} {p['titulo']} | {MUNDO['tiposDoc'][p['tipo']]} | {p['autor']} | {p['onde']} | {marca} |")
w()
w("**Conclusões:**")
w()
w("| Conclusão | Junta | Efeito no jogo |")
w("|---|---|---|")
for c in MUNDO["conclusoes"]:
    junta = " + ".join(MUNDO["pistas"][d]["titulo"] for d in c["requer"])
    w(f"| 💡 {c['texto']} | {junta} | {c.get('efeito') or '—'} |")
w()
img("51-conclusoes", "As conclusões da Line, embaixo da lista de documentos")
w("**O que a Line diz ao achar cada documento** (depois de ler o texto):")
w()
w("| Documento | Fala da Line |")
w("|---|---|")
for id_ in MUNDO["ordemPistas"]:
    p = MUNDO["pistas"][id_]
    w(f"| {p['icone']} {p['titulo']} | “{MUNDO['reacoes'][id_]}” |")
w()
w("Ao juntar os 12 documentos: título **Caderno completo!**, coração extra e a fala “Agora eu sei tudo sobre esse dragão. Segura, Bell, que eu tô indo.”")
w()
w("**Textos completos dos documentos:**")
w()
for id_ in MUNDO["ordemPistas"]:
    p = MUNDO["pistas"][id_]
    w(f"> **{p['icone']} {p['titulo']}** · *{MUNDO['tiposDoc'][p['tipo']]} · {p['autor']} · {p['data']}*  ")
    for par in p["texto"].split("\n\n"):
        w(f"> {par}  ")
        w(">")
    w(f"> *Encontrado em: {p['onde']}*")
    w()
w("### 7.7 Carrinho de mina")
w()
w("Três estações ligadas por trilhos: **Vilarejo**, **Minas** (na gruta) e **Forja** (na montanha). O carrinho começa quebrado: falta a **Alavanca de Ferro** do freio, que o capataz levou para a Forja Antiga quando o dragão acordou.")
w()
w("1. Chegar perto de uma estação a marca como **descoberta** (aviso “🛤️ Estação descoberta”).")
w("2. Sem a alavanca, o botão diz **Ver o carrinho** e a Line comenta o que falta (e, se já leu o relatório do capataz, lembra onde a alavanca está).")
w("3. Com a alavanca, o botão diz **Encaixar a alavanca**: a Line encaixa, aparece “Carrinho consertado!” e a alavanca sai da mochila.")
w("4. Daí em diante, **Viajar de carrinho** abre a escolha do destino. Só aparecem as estações já descobertas; as outras ficam com cadeado.")
w("5. A viagem é uma cena: a Line entra no carrinho, ele desce os trilhos e sai da tela, e chega na outra estação do mesmo jeito.")
w()
img("40-estacao", "A estação do vilarejo com a alavanca encaixada")
img("41-carrinho-destinos", "Escolha do destino")
img("42-carrinho-andando", "A Line andando de carrinho")
w("### 7.8 Bombas, gancho, chão em brasa e galerias escuras")
w()
w("- **Paredes e pedras rachadas 🪨:** têm rachaduras desenhadas. Uma **bomba** (atalho **F**) explode 2 segundos depois de colocada, quebra as rachaduras num raio de 2 tiles, fere inimigos em volta (o Guardião só quando está tonto) e machuca a Line se ela ficar perto. Cabem 2 bombas acesas ao mesmo tempo. O que explodiu fica salvo. Há uma pedra rachada na floresta e duas paredes nas Minas.")
w("- **Postes do gancho 🪝:** vêm em pares, um de cada lado da água ou do abismo. Com o **gancho** na mochila, perto de um poste aparece **Usar o gancho** e a Line é puxada pela corda até depois do outro poste. Dá para ir e voltar. Pares: lago da floresta, fosso das ruínas e abismo das Minas.")
w("- **Chão em brasa 🔥:** queima meio coração a cada meio segundo, sem defesa. Só a **Armadura de Brasa** protege.")
w("- **Galerias escuras:** nas Minas, a tela escurece em volta da Line. Sem a lanterna ela enxerga um círculo pequeno e o mapa abre bem devagar; com a lanterna, a luz fica quente e bem maior.")
w()
img("46-bomba", "Bomba acesa perto da pedra rachada da floresta")
w("### 7.9 Mapa: só acende onde a Line passou")
w()
w("A aba **Mapa** (tecla **M**) tem duas visões:")
w()
w("- **Área:** o lugar atual em miniatura. **Só aparece o que a Line já viu**: a névoa abre num raio de 7 tiles enquanto ela anda (3 no escuro sem lanterna), e o que foi explorado fica salvo. Ícones: baús, fontes, cristais e tochas, portas trancadas, documentos, paredes rachadas, postes do gancho, estações, lojas, placas, moradores, saídas e a Line (bolinha rosa). Com a **Bússola do Mago**, os baús fechados aparecem mesmo na névoa. Os documentos põem **alfinetes 📍** nos lugares que citam, mesmo em áreas ainda apagadas, **sem acender a área**.")
w("- **Mundo:** um pergaminho com os lugares ligados por trilhas. **Só acendem os lugares visitados** (e a fazenda); os vizinhos aparecem como “Lugar desconhecido”. Depois que o carrinho é consertado, a linha dos trilhos aparece ligando as três estações. Embaixo de cada lugar: porcentagem explorada, baús abertos e documentos achados.")
w()
img("52-mapa-mundo", "Mapa do mundo: só os lugares visitados acendem")
w("### 7.10 Todos os baús")
w()
w("| Área | Onde | O que tem |")
w("|---|---|---|")
total_baus = 0
for id_ in ["fazenda", "vilarejo", "floresta", "gruta", "ruinas", "montanha"]:
    m = MAPAS_M[id_]
    for pos, c in m["baus"].items():
        total_baus += 1
        w(f"| {m['nome']} | {ONDE_BAU.get(id_ + ':' + pos, pos)} | {conteudo_bau(c)} |")
w()
w(f"São **{total_baus} baús** (3 com coração extra), **3 portas trancadas** e **3 chaves** (qualquer chave abre qualquer porta e some depois de usada).")
w()
w("### 7.11 Tochas e cristais: como achar")
w()
w("- **Tochas apagadas** têm brasa fraca, soltam fumaça e têm um anel laranja pulsando no chão.")
w("- Ao chegar na montanha pela primeira vez, a câmera mostra as **três tochas**.")
w("- Cada luz acesa mostra a contagem: **🔥 Tocha acesa (1/3)**, **💎 Cristal aceso (1/2)**. O painel **Objetivo** mostra **(n/3 acesas)**.")
w("- No mapa, as tochas da montanha aparecem mesmo onde a Line ainda não passou, e as apagadas piscam.")
w()
w("| Grupo | Onde | Luzes | Abre |")
w("|---|---|---|---|")
for l in [
    ("Barreira sul", "Ruínas, salão de entrada", "2 cristais", "o salão do meio"),
    ("Barreira do meio", "Ruínas, salão do meio (2 nas ilhotas dos lagos)", "3 cristais", "o salão norte (Guardião)"),
    ("Alcova", "Ruínas, salão do meio (leste)", "1 cristal", "o baú de coração extra"),
    ("Atalho das Minas", "Ruínas, sala sudeste", "1 cristal", "o corredor para as Minas"),
    ("Portão de fogo", "Montanha: entrada, ilha de lava e topo", "3 tochas", "o caminho para o covil"),
]:
    w("| " + " | ".join(l) + " |")
w()
w("### 7.12 Arte necessária para a exploração")
w()
w("| Objeto | Como está hoje | Arte final sugerida |")
w("|---|---|---|")
for l in [
    ("Itens da mochila (10)", "emojis + bolinha colorida no chão", "ícone 64×64 de cada item e versão pequena no chão"),
    ("Moedas", "moedinhas amarelas desenhadas no código", "moeda dourada com brilho girando (4 a 6 quadros)"),
    ("Moradores (5)", "bonecos simples desenhados no código", "sprites parados e andando (frente/lado/costas) no estilo da Line e da Bell; retratos para os diálogos"),
    ("Casas do vilarejo, loja e ferraria", "casa genérica com letreiro", "casas de telhado colorido; loja com toldo e prateleira; ferraria com fornalha"),
    ("Barraca de feira, bigorna", "desenho simples", "barraca com toldo listrado e frutas; bigorna com brasa animada"),
    ("Carrinho de mina e estação", "caixa com rodas, placa e alavanca", "carrinho de madeira com ferragens; estação com plataforma; animação do carrinho andando e da Line dentro"),
    ("Trilhos", "tiles desenhados no código", "tiles de trilho retos e curvos"),
    ("Parede e pedra rachada", "rachaduras desenhadas", "versão de caverna (gruta, ruínas, montanha) e de floresta; animação de desmoronar"),
    ("Bomba", "bolinha preta com pavio", "bomba redonda com pavio aceso piscando e explosão (6 a 8 quadros)"),
    ("Poste do gancho e corda", "poste de madeira com argola", "poste com argola de ferro; corda e gancho; Line pendurada atravessando (`LINE_GRAPPLE`, sugestão nova)"),
    ("Chão em brasa", "tiles com brasa pulsando", "tiles de brasa rasa com brilho animado"),
    ("Morcego", "desenhado no código", "morcego dormindo pendurado, voando e dando rasante"),
    ("Escuro e lanterna", "gradiente em volta da Line", "a própria Line segurando a lanterna (`LINE_LANTERN_WALK`, sugestão nova)"),
    ("Escudos da armadura", "escudos azuis no HUD", "ícone de escudo cheio e vazio"),
    ("Armaduras na Line", "não aparecem no sprite", "variações de roupa da Line para túnica, malha e brasa (opcional)"),
    ("Documentos no chão", "papel com linhas", "um ícone por tipo: bilhete, pergaminho, mapa, relatório, receita, objeto"),
]:
    w("| " + " | ".join(l) + " |")
w()

# =====================================================================
w("## 8. Como se joga")
w()
w("### 8.1 Controles")
w()
w("| Ação | Teclado | Controle | Celular |")
w("|---|---|---|---|")
for l in [("Andar", "WASD / setas", "analógico", "arrastar no lado esquerdo"), ("Correr", "Shift (segurar)", "gatilho / analógico até o fim", "arrastar até o fim"),
          ("Atacar (3x = combo; sem espada, soco)", "J / Z", "A", "⚔"), ("Ataque giratório", "K / X", "X", "segurar ⚔"), ("Esquivar (correndo = dash)", "L / C", "B", "💨"),
          ("Defender (segurar)", "V / B", "LB", "🛡"), ("Pular (+ atacar no ar)", "Espaço", "Y", "⤴"), ("Magia: Raio de Luz", "Q / U", "RB", "✨"),
          ("Chuva de Estrelas", "segurar Q / U e soltar", "segurar RB", "segurar ✨"), ("Interagir / ler / abrir", "E / Enter", "Select", "botão que aparece"), ("Mochila (itens e documentos)", "I", "—", "🎒"), ("Mapa", "M", "—", "🎒 → Mapa"), ("Usar poção", "H", "—", "equipe a poção e use o botão do item"), ("Usar o item do atalho (bomba, poção, elixir…)", "F", "—", "botão do item (💣 / 🧪 …)"),
          ("Pausar", "Esc / P", "Start", "⏸"), ("Pular cena", "Tab", "—", "Pular cena")]:
    w("| " + " | ".join(l) + " |")
w()
w("**Posição dos botões no celular:** o joystick fica na metade esquerda da tela. Os botões de ação formam um **arco em volta do ⚔**, no canto direito: ⤴ pular à esquerda, ✨ magia na diagonal, 💨 esquivar em cima e 🛡 defender no arco de fora; o **item do atalho** (bomba, poção, elixir… o que estiver equipado) e o **🔄 trocar heroína** ficam no topo do arco, longe do joystick. O botão de interagir aparece mais acima ainda. Não existe mais o botão 🌀: **segurando o ⚔** sai o giro (Line) ou o leque de estrelas (Bell), emendado no golpe. **Sem espada**, o ⚔ dá um **soco** de alcance curto (a arte do soco na máquina do primeiro encontro).")
w()
w("#### Ícones dos botões do celular")
w()
w("Todos os botões de toque, o que cada um faz e quando aparece. Hoje são emojis: para a arte final, cada ícone vira um desenho em pixel art no mesmo estilo do jogo (tamanhos na tabela).")
w()
w("| Ícone | Botão | O que faz | Quando aparece | Onde fica | Arte final (desenhar) |")
w("|---|---|---|---|---|---|")
for linha in [
    ("—", "Joystick", "arrastar na metade esquerda move a Line; até o fim, corre", "sempre (em jogo)", "metade esquerda da tela", "base 120×120 e pino 52×52 (desenhar em 2×: 240 e 104)"),
    ("⚔", "Atacar", "golpe de espada (3 toques = combo); **segurar** = giro da Line ou leque de estrelas da Bell; **sem espada, soco**; perto de algo, interage", "sempre", "canto inferior direito (o maior)", "ícone 80×80 (desenhar 160×160): espada; com a Bell, estrela"),
    ("⤴", "Pular", "pula; no ar, ⚔ faz o ataque aéreo", "com espada", "à esquerda do ⚔", "62×62 (desenhar 124×124)"),
    ("💨", "Esquivar", "esquiva; correndo vira dash", "com espada", "acima do ⚔", "62×62 (124×124)"),
    ("🛡", "Defender", "segurar para bloquear", "com espada (apagado antes)", "arco de fora, à esquerda", "62×62 (124×124)"),
    ("✨", "Magia", "Raio de Luz; segurar e soltar = Chuva de Estrelas; com a Bell, canção", "depois de aprender a magia", "na diagonal, entre ⤴ e 💨", "62×62 (124×124); com a Bell, nota musical"),
    ("💣 🧪 💧…", "Item do atalho", "usa o item equipado na mochila: bomba, poção, elixir, pena… (mostra o ícone e a quantidade). **Poção e bomba usam o mesmo botão**: equipe na mochila o que quiser deixar ali", "quando há um item equipado com quantidade", "topo do arco", "44×44 (88×88): um ícone por item, os mesmos da mochila"),
    ("🔄", "Trocar heroína", "troca entre a Line e a Bell (mostra quem entra: 💖 Bell ou ⚔ Line)", "Parte 2, com a Bell jogável", "topo do arco, à direita do item", "44×44 (88×88): as duas carinhas com setas"),
    ("🎒", "Mochila", "itens, documentos, conclusões e mapa", "fora das cenas", "canto superior direito", "44×44 (88×88)"),
    ("⏸", "Pausar", "abre a pausa", "fora das cenas", "canto superior direito", "44×44 (88×88)"),
    ("texto", "Interagir", "aparece com o nome da ação (Abrir, Ler, Entrar, Comprar / conversar, Carinho…)", "perto de algo que dá para usar", "acima de todos, à direita", "botão de texto (borda e fundo em pixel art, 9-slice)"),
    ("Pular cena ⏭", "Pular cena", "pula a cena atual", "durante as cenas", "canto superior direito", "botão de texto"),
]:
    w("| " + " | ".join(linha) + " |")
w()
img("botoes-celular", "Os botões no celular: o item do atalho e a troca de heroína em cima; ataque, pulo, esquiva, defesa e magia embaixo")
w("### 8.2 Combate com espada")
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
w("### 8.3 Magia")
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
w("### 8.4 Vida, itens e progresso")
w()
w("- **Corações:**")
w("  - Começam em 3 (6 metades), e cada baú de coração extra dá mais 1.")
w("  - No Fácil, a Line ganha 1 coração a mais.")
w("  - Com 1 coração ou menos, ela fica com a animação de exausta.")
w("- **Coração no chão:** cura 1 coração. Cai dos inimigos só de vez em quando (e nunca com a vida cheia).")
w("- **Escudos (armadura):** cada escudo segura um golpe antes dos corações e volta sozinho depois de um tempo sem apanhar (seção 7.3).")
w("- **Moedas:** caem dos inimigos e saem dos baús; servem na loja e na ferraria (seção 7.2).")
w("- **Pena de Fênix:** se estiver na mochila quando a Line cair, ela queima e a Line levanta com metade da vida.")
w("- **Cristal azul:** +2 ◆ de magia. Também cai dos inimigos.")
w("- **Fontes:** curam tudo, enchem a magia e viram ponto de retorno. Se a Line cair, ela volta para a última fonte bebida naquela área.")
w("- **Água e fendas:** cair tira meio coração e devolve a Line para o último lugar seguro.")
w("- **Portas trancadas:** três portas de ferro (gruta, ruínas e montanha). Chegue perto: com uma chave antiga aparece **Abrir com a chave**; sem chave, **Trancada**.")
w("- **Salvamento automático:** ao entrar em cada área, ao abrir baús, pegar itens e documentos, comprar, abrir portas, explodir paredes, acender cristais, descobrir estações e beber das fontes, e ao abrir a mochila. O botão **Continuar** retoma dali, com a mochila, as moedas, a armadura, os documentos e o mapa explorado. Saves de versões antigas são convertidos sozinhos (pães e maçãs viram moedas, a Flor da Lua vira poção, e as áreas que cresceram recomeçam do zero).")
w()
w("### 8.5 Dificuldade")
w()
w("| | Fácil 🌸 | Normal ⚔ | Difícil 🔥 |")
w("|---|---|---|---|")
w("| Vida dos chefes | 60% | 100% | 135% |")
w("| Velocidade dos ataques | mais lentos (1,35×) | normal | mais rápidos (0,85×) |")
w("| Corações extras | +1 | — | — |")
w("| Chance de cair coração (só com a vida incompleta) | 25% | 10% | 4% |")
w("| Recarga da magia | 1,7× | 1× | 0,75× |")
w("| Guarda aberta do Guardião | +30% | normal | −20% |")
w("| Espada no Guardião com a guarda fechada | arranha um pouco | não | não |")
w()
w("A dificuldade fica salva no navegador e pode ser trocada a qualquer momento, também pela pausa.")
w()

# =====================================================================
w("## 9. Inimigos e chefes")
w()
w("**Inteligência dos inimigos (nova):** todos enxergam de verdade, com linha de visão, e não veem a Line através de paredes, árvores e casas. Quando perdem a Line de vista, procuram um caminho pela grade do mapa e contornam os obstáculos. Quem vê a Line primeiro **avisa os vizinhos**, e eles não se amontoam uns em cima dos outros. Ninguém entra no chão em brasa.")
w()
w("### Sombra")
w("- **Vida:** 3.")
w("- **Comportamento:** vaga até ver a Line. Então persegue pelo caminho mais curto, tenta **chegar pelo lado** quando há outra sombra atacando de frente, se prepara e dá uma investida. Com 1 de vida, **foge** e volta depois. Se a Line some por muito tempo, volta para o seu canto.")
w("- **Defesa:** bloquear a investida deixa a sombra tonta.")
w("- **Fraqueza:** leva dano extra da luz.")
w("- **Onde aparece:** na floresta (depois da espada), nas ruínas (depois da magia) e na montanha.")
w()
w("### Fogo-fátuo")
w("- **Vida:** 2.")
w("- **Comportamento:** flutua, mantém distância, se prepara brilhando e atira um orbe lento, que dá para pular ou bloquear.")
w("- **Onde aparece:** nas ruínas e na gruta (azul) e na montanha (de fogo).")
w("- **Novo:** só atira quando enxerga a Line; se ela se esconde atrás de uma parede, ele contorna até achar um ângulo.")
w()
w("### Morcego (novo)")
w("- **Vida:** 1.")
w("- **Comportamento:** dorme pendurado nas galerias escuras das Minas. Acorda quando a Line chega perto (de mais longe se ela estiver com a lanterna), voa em círculos em volta dela e dá **rasantes**. Se ela se afasta, volta a dormir no mesmo lugar.")
w("- **Onde aparece:** nas Minas de Cristal, depois da espada.")
w()
w("### Guardião de Pedra (chefe das ruínas)")
w("- **Vida:** 14 no Normal.")
w("- **Guarda:** a espada não fere a pedra. O Raio de Luz racha o cristal do peito e deixa o Guardião **tonto por 4,5 s**. Só então a espada funciona.")
w("- **Ataques:**")
w("  - **Pisão:** levanta os braços, com um círculo vermelho de aviso, e solta uma onda no chão. Precisa pular.")
w("  - **Arremesso de pedra:** uma por vez. Dá para desviar ou bloquear.")
w("- **Ajuda:** ao sair do atordoamento, ele solta um cristal de magia (e um coração, se a Line estiver com metade da vida ou menos). Vencido, dá 30 moedas.")
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
w("- **Ponto fraco:** depois de levar dano suficiente, ele fica atordoado e o peito brilha em azul. É o ponto fraco. Com a conclusão **do peito** (lenda + escama), cada golpe ali tira 1 a mais.")
w("- **Fogo:** com a conclusão **das estrelas** (diário pág. 2 + escama), a Chuva de Estrelas apaga o fogo dele no meio do sopro.")
w("- **Fim da luta:** aparece o botão **GOLPE FINAL**.")
w()

# =====================================================================
w("## 10. Lista completa de animações")
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
    w(f"### 10.{inv['grupos'].index(g) + 1} {g['nome']}")
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
w(f"### 10.{len(inv['grupos']) + 1} O que ainda falta ter arte própria, por prioridade")
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
w("## 11. Retratos dos diálogos")
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
w("## 12. Cenário e objetos")
w()
w("> ⚠️ O cenário atual também é temporário: parte vem de pacotes de arte recebidos, parte é desenhada no código.")
w()
w("| Área | Já usa arte (temporária) | Ainda desenhado no código (precisa de arte) |")
w("|---|---|---|")
w("| Minas Shopping (prólogo) | ilustração do shopping, vinda do HTML do primeiro encontro (temporária; a final segue a foto-modelo da seção 5.2) | — |")
w("| Playground (prólogo) | tudo: fundo, fliperamas, painel, balcão de prêmios e máquina de soco com placar (itens 235 a 237) | — |")
w("| Túnel (prólogo) | ilustração do túnel, vinda do HTML do primeiro encontro | — |")
w("| Fazendinha | casa (prancha Farmhouse), celeiro, galinheiro, moinho, poço, árvores e frutíferas, cerejeiras, horta (cenoura e tomate), feno, carroça, lampiões, píer, barco, girassóis, milho, trigo, arbustos, pedras, placa | chão de grama, caminho, água do lago, cercas, flores pequenas, mato, varal, mesa, casinha do Theo, tigela |")
w("| Floresta | pinheiros e árvores | chão, raízes, riacho, espinheiros, baú, placas, pedras |")
w("| Gruta dos Ecos | — | chão e paredes azuladas, água funda, estalagmites, cogumelos luminosos, fonte, placa, porta de ferro, baús |")
w("| Ruínas Encantadas | — | chão de lajes, paredes, pilares, cristais (apagado e aceso), altar com orbe, fonte, barreira de luz, lagos, baú |")
w("| Montanha de Brasa | — | chão vulcânico, paredes, fendas, lava, tochas (apagada e acesa), portão de fogo, pedras, estalagmites, fonte, baú |")
w("| Covil | — | chão, paredes, lava, estalagmites, jaula da Bell |")
w()
w("**Objetos novos desenhados no código (precisam de arte):** porta de ferro trancada, cogumelos luminosos, documentos no chão, os 10 itens da mochila (hoje emojis), moedas, tochas, moradores, casas do vilarejo, carrinho, estações e trilhos, postes do gancho, bombas, paredes rachadas, chão em brasa, morcegos e o mapa do mundo. A lista completa, com o que cada um deve mostrar, está na **seção 7.12**.")
w()
w("Pranchas de referência já recebidas ficam em `arte/referencias/`: fazenda, casa, Theo, galinhas, pacote Line & Bell, tileset, o modelo do Minas Shopping e os gabaritos de cada fase. As referências do dragão antigo saíram (o dragão do jogo vem dos itens 80 a 97).")
w()

# =====================================================================
w("## 13. Efeitos visuais")
w()
w("### 13.1 Efeitos com arte (itens 98 a 102)")
w()
w("Os efeitos em pixel art já entram no jogo. Se a arte de um efeito faltar, o jogo volta sozinho para o efeito desenhado em código.")
w()
w("| Efeito | Item | Onde aparece no jogo |")
w("|---|---|---|")
for l in [
    ("`FX_IMPACT`", "100", "a cada golpe que acerta um inimigo ou chefe"),
    ("`FX_SPARKS`", "100", "quando a Line bloqueia um golpe com a defesa"),
    ("`FX_EXPLOSION`", "100", "na explosão das bombas"),
    ("`FX_DRAGON_WEAK_POINT`", "101", "no peito do dragão, enquanto o ponto fraco está aberto"),
    ("`FX_HEARTS`", "102", "na bitoquinha do pôr do sol, no abraço do resgate e no epílogo"),
    ("`FX_TEARS`", "102", "quando a Line chora depois do rapto"),
    ("`FX_DUST`", "99", "na onda do ataque aéreo e no pouso do dragão no covil"),
    ("`FX_SMOKE`", "99", "saindo das tochas apagadas da montanha"),
    ("`FX_SWORD_TRAIL`, `FX_AMBIENT_PARTICLES`, `FX_FIRE`, `FX_EMBERS`, `FX_FIRE_LIGHT`", "98, 101, 102", "recebidos e carregados, mas ainda não usados: o rastro da espada do jogo muda de forma a cada golpe (horizontal, vertical, giro), e o fogo e a luz do fogo são desenhados junto com as tochas e o dragão; `FX_FIRE_LIGHT` é um octógono opaco, que precisaria de transparência para iluminar o cenário"),
]:
    w("| " + " | ".join(l) + " |")
w()
w("### 13.2 Efeitos desenhados no código")
w()
w("Estes continuam temporários, feitos no código:")
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
w(f"Os códigos `FX_*` da seção 10.{NUM_FX} são para quando esses efeitos ganharem arte própria.")
w()

# =====================================================================
w("## 14. Como mandar arte nova")
w()
w("1. **Formatos aceitos:**")
w("   - HTML de item (`LINE_BELL_ITEM_XX.html`, um PNG por quadro).")
w("   - HTML de laboratório.")
w("   - Pasta `arte/<grupo>/<CÓDIGO>/00.png, 01.png…`.")
w("   - Uma **prancha**: imagem com vários quadros, que eu recorto.")
w("2. **Nome:** o código precisa ser exatamente o da seção 10.")
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
w("## 15. Estrutura técnica")
w()
w("| Arquivo | O que faz |")
w("|---|---|")
for a, b in [("game/index.html", "página do jogo, menus, controles de toque"), ("game/js/jogo.js", "motor: áreas, câmera, combate, HUD, salvamento"),
             ("game/js/entidades.js", "Line, Bell, Sombra, partículas"), ("game/js/magia.js", "magia, cristais, tochas, barreiras, fontes, Fogo-fátuo e Guardião"),
             ("game/js/dragao.js", "o dragão e seus ataques"), ("game/js/bichos.js", "bichos da fazenda e o Mago"), ("game/js/fazenda.js", "capítulo da fazenda e tarefas"),
             ("game/js/encontro.js", "prólogo *O primeiro encontro*: lugares, máquina de soco, cenas e falas"), ("game/js/cenas.js", "cenas e falas da aventura (roteiro)"), ("game/js/mochila.js", "mochila: itens, moedas, documentos e conclusões, mapa com névoa, objetivo, avisos"), ("game/js/mapas.js", "os mapas das 7 áreas da aventura"), ("game/js/mundo.js", "bombas e paredes rachadas, gancho, chão em brasa, escuro das minas, moedas soltas, casas e objetos novos"), ("game/js/loja.js", "vilarejo: moradores e falas, loja, ferraria, armaduras e escudos"), ("game/js/carrinho.js", "carrinho de mina: estações, escolha do destino e a viagem"), ("game/js/ia.js", "inteligência dos inimigos: linha de visão, caminho pela grade, alerta, separação, e o Morcego"), ("tests/rodar.js", "testes automatizados de todas as telas (Playwright)"), ("tools/fotos_documentacao.js", "tira as capturas das partes novas para este documento"), ("game/js/cenario.js", "árvores, casa, objetos e ambiente"),
             ("game/js/animacoes.js", "catálogo de animações, substitutas e desenho dos sprites (com a troca para a arte da Bell jogável e das armaduras)"), ("game/js/relogio.js", "relógio do jogo, dia e noite, descanso na fonte"), ("game/js/chefes.js", "os sete chefes elementais, ataques, perigos e arenas"), ("game/js/herois.js", "Bell jogável, troca de heroína, companheira que segue atrás"), ("game/js/hud.js", "HUD com as molduras da arte: retrato, barras de vida e magia, moedas e item, minimapa"), ("tools/gerar_pendencias.py", "documento só com o que falta (LINE_E_BELL_PENDENCIAS.md)"), ("game/js/parte2.js", "história da Parte 2, moradores e documentos novos, objetivos"), ("game/js/dicas.js", "dicas do modo Fácil: seta guia, dicas de chefe e de derrota"), ("tools/doc_parte2.py", "seções 16 a 22 deste documento"), ("tools/doc_apendices.py", "seções 23 a 26: o que falta, índice e plano dos itens, como rodar e editar o jogo"), ("tools/medir_cabecas.py", "mede o tamanho da cabeça da Line e da Bell em cada animação; os ajustes ficam em `tools/ajuste_cabeca.json`"), ("tools/pernas_alternadas.py", "refaz as pernas da galinha andando e correndo, uma depois da outra"), ("game/js/entrada.js", "teclado, controle, toque e dificuldade"),
             ("game/assets/", "folhas de sprites, retratos, cenário (inclui `cenario/encontro_*.webp` do prólogo)"), ("tools/extrair_sprites.py", "converte a arte recebida em folhas para o jogo"),
             ("tools/gerar_documentacao.py", "gera este documento")]:
    w(f"| `{a}` | {b} |")
w()
w("### Testes automatizados")
w()
w("A pasta `tests/` tem um conjunto de testes que abre o jogo num navegador de verdade (Chromium, pelo Playwright) e passa por **todas as telas**. Ele sobe sozinho um servidor para a pasta `game/`. Para rodar: `cd tests && npm install && npm test` (ou `node rodar.js loja carrinho` para rodar só alguns). `npm run fotos` salva uma captura de cada tela em `tests/fotos/`. Um teste falha se qualquer erro aparecer no console.")
w()
w("| Grupo | O que é testado |")
w("|---|---|")
for l in [
    ("Menu", "botões, troca de dificuldade, tela de controles e galeria de animações"),
    ("Prólogo e fazenda", "Novo jogo abre o Primeiro Encontro; manhã na fazenda com a Bell; estrada do vilarejo fechada antes do rapto e aberta depois"),
    ("Pausa", "abrir, abrir a mochila pela pausa, voltar com Esc, retomar"),
    ("Mochila", "itens, equipar no atalho, usar poção, 12 documentos, 8 conclusões, mapa da área e do mundo, teclas I, M, H, F e Esc"),
    ("Mapa", "só acende áreas visitadas; documento marca sem acender"),
    ("Todas as áreas", "cada uma das 7 áreas carrega, desenha e roda sem erros, e a Line não nasce dentro de parede"),
    ("Tamanho e conectividade", "tamanho das fases; todo baú, documento, morador, estação e saída alcançável (contando pulos, gancho, bombas, chaves e barreiras); toda saída chega em chão livre, fora de outra saída, e tem caminho de volta"),
    ("Objetos e ajustes do celular", "todos os objetos dos itens 146 a 227 carregam; as estradas e passagens da fazenda ficam livres; ⚔ segurado faz o giro; sem espada a Line soca; poção e bomba pelo mesmo botão do item; a fazenda e a casa usam cada um; o regador aparece no poço; a casa não some quando a Line anda para a direita; no lanche do BK o shopping fica sem a mesa redonda; a arte de “Feliz” que caía saiu do jogo"),
    ("Casas por dentro", "todas as portas levam a um interior mobiliado com piso e paredes desenhados; Entrar na porta, sair pelo caminho de pedra; o bilhete da cabana vem antes de entrar; de frente para a Dona Rosa ainda dá para conversar"),
    ("Vilarejo", "loja da Dona Rosa (comprar, falta de dinheiro, botas), ferraria (armadura, escudo segurando golpe, Armadura de Brasa liberada pela receita), conversas com os moradores"),
    ("Carrinho", "quebrado sem alavanca, encaixar a alavanca, tela de destino só com estações descobertas, viagem até as Minas"),
    ("Bombas, gancho, brasa, escuro", "bomba quebra a parede e fica salvo; gancho atravessa; brasa queima sem a armadura e não queima com ela; galeria escura"),
    ("Inimigos", "caminho pela grade, alerta aos vizinhos, moedas caindo e sendo pegas, morcego acordando, coração não cai com a vida cheia"),
    ("Derrota", "tela de derrota e Tentar de novo; Pena de Fênix levanta a Line"),
    ("Documentos e dragão", "a cena de documento forma conclusão; a luta no covil começa"),
    ("Save", "Continuar volta com área, moedas e itens; save antigo é convertido"),
    ("Celular", "controles de toque, botão da poção e do item, mochila cabendo na tela"),
    ("Parte 2 — fases", "as 7 fases novas carregam e rodam, a heroína não nasce na parede, o chefe e a companheira estão lá; vento empurra e lama deixa lenta"),
    ("Parte 2 — história", "Continuar depois do “Fim?” abre a Parte 2; a estrada do vale só abre depois; o mapa do mundo ganha 7 regiões"),
    ("Bell jogável", "troca com T, estrela, leque de 3 luzes gastando magia, canção encantando inimigos, a Line assume quando a Bell cai e a caída não volta"),
    ("Armaduras da Bell", "só aparecem na Parte 2, ficam guardadas para a Bell e dão escudo quando ela está ativa"),
    ("Chefes", "cada um dos 7 chefes acorda com a cena, luta alguns segundos, é vencido e salva a vitória (+1 coração nos guardiões, portal depois da última junção, final depois da Quimera)"),
    ("Relógio", "1 s = 1 min, noite com moradores dormindo, descanso na fonte até as 7h do dia seguinte"),
    ("Dicas do Fácil", "seta para a saída certa, para o cristal apagado e para o chefe; dica de chefe e de derrota"),
]:
    w("| " + " | ".join(l) + " |")
w()
w("### Como atualizar este documento")
w("As tabelas de animações, o roteiro, os mapas e o índice dos itens são gerados a partir do jogo e dos arquivos recebidos. Os comandos estão na seção 26.8.")
w()
img("25-galeria", "No jogo, o menu Animações mostra a mesma lista, com prévia de cada uma")
doc_parte2.escrever(w, img, inv, rot, roteiro)
doc_apendices.escrever(w, inv)
w("---")
w()
w("*Line & Bell: um jogo feito com carinho. Todas as animações e artes atuais são temporárias até a criação completa da arte final.*")

os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
open(SAIDA, "w", encoding="utf-8").write("\n".join(L) + "\n")
print(f"{SAIDA}: {len(L)} linhas")
