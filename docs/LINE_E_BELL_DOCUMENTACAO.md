# Line & Bell — Documentação completa do jogo

> ⚠️ **Aviso importante: todas as animações e artes usadas hoje são TEMPORÁRIAS.**
> Elas estão no jogo só para dar vida à aventura enquanto a criação da arte final não termina.
> Quando cada animação definitiva ficar pronta, ela substitui a temporária com o mesmo código.
> Isso vale para os sprites, os retratos, o cenário e os desenhos feitos no código.

> 🆕 **Novidades desta versão:**
> - **Fases bem maiores e interligadas**: a floresta, a gruta, as ruínas e a montanha dobraram de tamanho e ganharam atalhos entre si (seções 6 e 7.1).
> - **Vilarejo do Riacho**, área nova com cinco moradores, a **loja da Dona Rosa** e a **ferraria do Seu Bento** (seções 6.2, 7.3 e 7.4).
> - **Moedas** e **armaduras** que dão escudos (seções 7.2 e 7.3).
> - **Carrinho de mina** entre três estações, que só anda depois de achar a Alavanca de Ferro na montanha (seção 7.7).
> - **Dez itens, cada um com uma função**: poção, elixir, bomba, Pena de Fênix, chave, lanterna, gancho, bússola, botas e alavanca, com atalho **F** para o item equipado (seção 7.5).
> - **Bombas, gancho, chão em brasa e galerias escuras** que abrem caminhos novos (seção 7.8).
> - **12 documentos de investigação** com tipo, autor e data, que se juntam em **8 conclusões**; algumas ajudam contra o dragão (seção 7.6).
> - O **mapa só acende os lugares visitados** (seção 7.9).
> - **Menos vida espalhada**: sem comida de cura pelo chão e corações caindo bem menos (seção 7.5).
> - **Inimigos mais espertos**: contornam paredes, avisam os vizinhos, flanqueiam e fogem; morcegos novos nas Minas (seção 9).
> - **Testes automatizados** de todas as telas (seção 15).

![Tela inicial, com a escolha de dificuldade](imagens/01-menu.jpg)
*Tela inicial, com a escolha de dificuldade*

**Jogar:** https://line-e-bell.vercel.app · **Código:** pasta `game/` deste repositório

## Sumário

- [1. Visão geral](#1-visao-geral)
- [2. Personagens](#2-personagens)
- [3. A história](#3-a-historia)
- [4. Roteiro completo, cena a cena](#4-roteiro-completo-cena-a-cena)
- [5. O primeiro encontro (prólogo)](#5-o-primeiro-encontro-prologo)
- [6. As fases](#6-as-fases)
- [7. Exploração: mundo interligado, vilarejo, loja, carrinho, itens, documentos e mapa](#7-exploracao-mundo-interligado-vilarejo-loja-carrinho-itens-documentos-e-mapa)
  - [7.1 Como as fases se ligam](#71-como-as-fases-se-ligam)
  - [7.2 Moedas](#72-moedas)
  - [7.3 Loja e ferraria](#73-loja-da-dona-rosa-e-ferraria-do-seu-bento)
  - [7.4 Moradores](#74-moradores-do-vilarejo)
  - [7.5 Mochila e itens](#75-mochila-e-itens-um-item-uma-funcao)
  - [7.6 Documentos e conclusões](#76-documentos-de-investigacao-e-conclusoes)
  - [7.7 Carrinho de mina](#77-carrinho-de-mina)
  - [7.8 Bombas, gancho, brasa e escuro](#78-bombas-gancho-chao-em-brasa-e-galerias-escuras)
  - [7.9 Mapa](#79-mapa-so-acende-onde-a-line-passou)
  - [7.10 Todos os baús](#710-todos-os-baus)
  - [7.11 Tochas e cristais](#711-tochas-e-cristais-como-achar)
  - [7.12 Arte necessária](#712-arte-necessaria-para-a-exploracao)
- [8. Como se joga](#8-como-se-joga)
- [9. Inimigos e chefes](#9-inimigos-e-chefes)
- [10. Lista completa de animações](#10-lista-completa-de-animacoes)
- [11. Retratos dos diálogos](#11-retratos-dos-dialogos)
- [12. Cenário e objetos](#12-cenario-e-objetos)
- [13. Efeitos visuais](#13-efeitos-visuais)
- [14. Como mandar arte nova](#14-como-mandar-arte-nova)
- [15. Estrutura técnica](#15-estrutura-tecnica)

## 1. Visão geral

**Line & Bell** é uma aventura de ação vista de cima, para navegador (PC e celular). Tudo começa com um prólogo jogável, **O primeiro encontro**, que conta como as duas se conheceram em 09/05/2024. Depois, a Line e a Bell já são namoradas e vivem numa fazendinha com o cachorro Theo. Um dragão leva a Bell, e a Line atravessa um vilarejo, uma floresta, uma gruta com minas abandonadas, ruínas mágicas e uma montanha de lava para resgatá-la. No caminho ela junta documentos de investigação, tira conclusões, compra armaduras, conserta um carrinho de mina e usa os itens da mochila para abrir caminhos novos.

| | |
|---|---|
| Gênero | Aventura / ação com exploração, visão de cima |
| Plataformas | Navegador no PC (teclado ou controle) e no celular (toque) |
| Duração | Cerca de 1h30 a 2h explorando tudo (o prólogo leva uns 3 minutos) |
| Prólogo | *O primeiro encontro* (09/05/2024): Minas Shopping, Playground e Túnel |
| Áreas | 3 do prólogo e 7 da aventura, todas interligadas: Fazendinha, Vilarejo do Riacho, Floresta Sussurrante, Gruta dos Ecos e Minas de Cristal, Ruínas Encantadas, Montanha de Brasa e Covil do Dragão |
| Chefes | Guardião de Pedra e o Dragão Vermelho |
| Exploração | 24 baús, 3 portas trancadas, paredes rachadas, postes do gancho, chão em brasa, galerias escuras, carrinho de mina entre 3 estações |
| Investigação | 12 documentos (com tipo, autor e data) e 8 conclusões |
| Vilarejo | 5 moradores, loja de itens e ferraria com 3 armaduras; moedas caem dos inimigos e saem dos baús |
| Mochila | 10 itens, cada um com uma função, item no atalho (F), caderno de documentos e mapa que só acende onde a Line passou |
| Dificuldade | Fácil, Normal ou Difícil (menu inicial e pausa) |
| Salvamento | Automático, no navegador, ao entrar em cada área e nas fontes |
| Animações catalogadas | **267**: 160 com arte (temporária), 47 usando uma substituta, 60 desenhadas no código ou sem imagem |

## 2. Personagens

### Line
Protagonista. É fazendeira, corajosa e brincalhona, de boné preto, cabelo longo e roupa preta. Aprende a lutar com espada e, nas ruínas, a usar magia de luz. Nos diálogos tem 8 expressões.

![Line: algumas das animações atuais (temporárias)](imagens/arte-line.jpg)
*Line: algumas das animações atuais (temporárias)*

### Bell
Namorada da Line: doce, risonha e mandona na medida certa. Usa óculos, blusa creme e short jeans. É levada pelo dragão no pôr do sol e fica presa numa jaula no covil.

![Bell: animações atuais (temporárias)](imagens/arte-bell.jpg)
*Bell: animações atuais (temporárias)*

### Line e Bell juntas
As animações do casal aparecem nas cenas: mãos dadas, almoço, bitoquinha, dança, abraço do resgate e toca aqui.

![Animações do casal (temporárias)](imagens/arte-casal.jpg)
*Animações do casal (temporárias)*

### Theo
O shih-tzu da família. Late, pede comida, segue a Line pela fazenda depois de comer e fica esperando em casa durante a aventura.

#### ⭐ Theo: layout oficial para a arte final

> 💛 **Este é o Theo aprovado.** A arte que está no jogo hoje é **o layout oficial** para criar a arte final do Theo. A versão final deve **só melhorar** esta arte, **sem perder os traços**. Não é para redesenhar o personagem.

![O Theo como está no jogo hoje: o layout oficial](imagens/theo-no-jogo.jpg)
*O Theo como está no jogo hoje: o layout oficial*

**O que precisa continuar igual (os traços do Theo):**
- **Raça e formato:** shih-tzu fofinho, corpo baixo e redondo, pernas curtas e cabeça grande em relação ao corpo, no estilo chibi do jogo.
- **Pelagem:** marrom-caramelo, com mechas mais escuras nas orelhas e nas costas. O peito, as patas, a barba e o rabo são creme.
- **Cabeça:** topete arrepiado, orelhas longas e peludas caindo dos lados, franja por cima dos olhos.
- **Rosto:** olhos pretos, grandes e brilhantes, focinho curto com nariz preto e boquinha aberta com a língua rosa aparecendo.
- **Rabo:** enrolado para cima, bem peludo e claro.
- **Estilo:** pixel art detalhada, com contorno escuro e textura de pelo desenhada fio a fio.
- **Acessórios e cenas:** a caminha bege, a tigela azul com patinha, a bolinha azul, o osso, a banheira com o patinho, os corações e os sinais de ! e ?.

**O que pode melhorar:**
- Deixar todos os quadros no **mesmo tamanho**, com as patas sempre na mesma linha do chão.
- **Fundo transparente de verdade**, sem a sombra marrom da prancha e sem sombra no chão (o jogo desenha a sombra).
- Deixar o contorno mais limpo e as animações mais suaves, com mais quadros em andar, correr e brincar.
- Manter as 4 direções coerentes: frente, costas e lado direito. O lado esquerdo o jogo espelha.

A prancha original fica em `arte/referencias/theo_shihtzu.png`, e os quadros recortados em `arte/theo/`.

![Prancha original do Theo (layout oficial, referência para a arte final)](imagens/theo-layout-oficial.jpg)
*Prancha original do Theo (layout oficial, referência para a arte final)*

### Bichos da fazenda
Galinhas (brancas e marrons), pintinhos, vacas, cavalo e porcos já têm arte. Ovelhas, patos e o gato ainda são desenhados no código.

![Theo e bichos da fazenda (temporários)](imagens/arte-bichos.jpg)
*Theo e bichos da fazenda (temporários)*

### Mago
Velho sábio da Floresta Sussurrante. Guarda a espada e explica o caminho. Hoje é uma imagem parada que respira e brilha.

### Espírito das Ruínas
Voz antiga que mora no altar das Ruínas Encantadas e ensina a magia à Line. Ainda não tem visual próprio, só a luz do altar.

### Guardião de Pedra
Chefe das ruínas: um golem de pedra com um cristal azul no peito. Desenhado no código por enquanto.

### Dragão Vermelho
O vilão. Dormia havia cem anos, acorda, rapta a Bell e a leva para o covil no topo da Montanha de Brasa.

![Dragão vermelho (temporário)](imagens/arte-dragao.jpg)
*Dragão vermelho (temporário)*

### Criaturas
- **Sombras:** criaturas escuras que surgem depois que a Line pega a espada. Investem contra ela e são fracas contra a luz.
- **Fogos-fátuos:** luzinhas que flutuam, mantêm distância e atiram orbes. São azuis nas ruínas e de fogo na montanha.

## 3. A história

**Prólogo — O primeiro encontro (09/05/2024).** No Minas Shopping, a Line vê a Bell de longe e fica encantada. Elas conversam, a Bell diz que a Line está atrasada e as duas comem BK. A Line confessa que está tímida porque a Bell é muito linda. De mãos dadas, vão ao playground, onde a Line tenta a máquina de soco, faz só 038 pontos e a Bell morre de rir. No túnel, dão o primeiro beijo. O tempo passa, e o sonho das duas vira uma fazendinha.

**Capítulo 1 — Nossa vidinha.** Amanhece na fazenda. A Bell acorda a Line, e as duas cuidam da fazenda: pegar os ovos, regar a horta, dar ração ao Theo e fazer carinho nos bichinhos. Depois vem o almoço juntas e o passeio de mãos dadas até o lago para ver o pôr do sol. Lá elas dançam e dão uma bitoquinha.

**O rapto.** O céu escurece, os bichos se assustam e um dragão vermelho mergulha do céu e leva a Bell. A Line corre atrás, grita por ela, chora e decide ir buscá-la. Pede ao Theo que cuide da fazenda.

**A investigação.** Desde o rapto, a Line junta documentos: as marcas de garra no píer, o cartaz do vilarejo, a carta do Mago, o bilhete do caçador Tobias, a lenda da montanha, o mapa rasgado, o relatório do capataz das minas, as páginas do diário do Guardião, a receita do Mestre Aurélio, uma escama vermelha e a fita de cabelo da Bell. Quando dois documentos combinam, ela tira uma conclusão: que a Bell está viva, que o dragão teme a luz, onde está a alavanca do carrinho, quem forja a Armadura de Brasa, onde fica o ponto fraco do dragão. Com os doze, a Line entende tudo e ganha um coração extra.

**O vilarejo.** A leste da fazenda fica o Vilarejo do Riacho. A Dona Rosa vende poções e bombas, o Seu Bento forja armaduras, o Seu Zé conta que o carrinho de mina parou quando o capataz levou a alavanca do freio para a Forja Antiga, a Dona Lurdes aponta a cabana do marido caçador e o Pedrinho conta de uma pedra rachada na floresta. Achando a alavanca na montanha, a Line conserta o carrinho e passa a viajar entre o vilarejo, as minas e a forja.

**Capítulo 2 — A floresta.** Na Floresta Sussurrante, um mago conta que o dragão acordou depois de cem anos e entrega uma espada guardada num baú. Sombras aparecem. Espinhos fecham o caminho do norte, e a espada abre passagem. A leste da floresta fica a **Gruta dos Ecos**, onde o Mago guardou uma bússola, um elixir e uma sala trancada com um coração extra e o mapa rasgado.

**Capítulo 3 — Magia.** O dragão selou a montanha com magia antiga. Nas Ruínas Encantadas, o Espírito das Ruínas ensina a Line a lançar luz pela espada. Ela acende cristais para desfazer barreiras, encontra um coração extra e enfrenta o Guardião de Pedra. Vencido, ele entrega a Chuva de Estrelas.

**Capítulo 4 — A montanha.** Na Montanha de Brasa, a Line pula fendas, desvia de lava e acende três tochas antigas para abrir o portão de fogo do covil.

**Capítulo 5 — O covil.** A Bell está presa numa jaula e o dragão pousa para lutar. Quando ele cansa, o peito brilha: é o ponto fraco. A Line vence, dá o golpe final e liberta a Bell. As duas se abraçam.

**Epílogo.** De volta à fazenda, no pôr do sol do lago, as duas dançam. Aparece “Fim”… e, no escuro, um olho de dragão se abre: “Fim?”.

## 4. Roteiro completo, cena a cena

Todas as falas estão exatamente como aparecem no jogo. Entre parênteses está a expressão do retrato. As linhas com ▶ indicam a animação que toca naquele momento: o código é o mesmo da lista da seção 10.

### 4.1 Prólogo 1: o Minas Shopping

Começa ao escolher **Novo jogo**, antes de tudo. A Line entra no shopping de costas para a câmera e vê a Bell esperando perto das mesas. Depois a Line anda livremente até a Bell.

![Prólogo 1: o Minas Shopping](imagens/p01-titulo.jpg)
*Prólogo 1: o Minas Shopping*

> ▶ `LINE_IDLE`  
> 🎬 **Título na tela:** O primeiro encontro — Minas Shopping · …  
> ▶ `LINE_ADMIRE`  
> **Line** *(apaixonada)*: puxa ela é tão linda  
> ▶ `LINE_IDLE`  
> 💡 *Dica na tela:* Aproxime-se da Bell e pressione E para falar com ela.  

![Explorando o shopping: o botão Falar com a Bell aparece perto dela](imagens/p04-perto-bell.jpg)
*Explorando o shopping: o botão Falar com a Bell aparece perto dela*

### 4.2 Prólogo 2: a conversa e o BK

Ao chegar perto da Bell e apertar **Falar com a Bell**. A câmera se aproxima (zoom) e cada fala usa uma animação das duas juntas. Depois elas andam até a mesa e comem BK.

![Prólogo 2: a conversa e o BK](imagens/p06-atrasada.jpg)
*Prólogo 2: a conversa e o BK*

> ▶ `LINE_BELL_MEET`  
> **Line** *(sorrindo)*: esse shopping é muito grande  
> ▶ `LINE_BELL_GREET_HUG`  
> **Bell** *(marota)*: Você tá atrasada  
> ▶ `LINE_BELL_MEET`  
> **Line** *(sorrindo)*: oq vamos comer?  
> **Bell** *(sorrindo)*: BK.  
> ▶ `LINE_BELL_BK`  
> **Bell** *(neutro)*: você parece estar tímida  
> **Line** *(apaixonada)*: é que você é muito linda  
> **Bell** *(apaixonada)*: *(sem fala, só o retrato)*  
> ▶ `LINE_BELL_MEET`  
> **Narradora**: As duas sorriem. Bell segura a mão da Line e elas saem juntas do shopping.  
> ▶ `LINE_BELL_WALK_HANDS`  

![BK no shopping: “você parece estar tímida”](imagens/p08-timida.jpg)
*BK no shopping: “você parece estar tímida”*

![Saindo do shopping de mãos dadas](imagens/p11-saindo-maos-dadas.jpg)
*Saindo do shopping de mãos dadas*

### 4.3 Prólogo 3: o Playground

As duas chegam de mãos dadas. A Line vai até a máquina de soco e a Bell fica olhando.

![Prólogo 3: o Playground](imagens/p13-pronta-para-socar.jpg)
*Prólogo 3: o Playground*

> 💡 *Dica na tela:* Pressione E para a Line tentar.  

### 4.4 Prólogo 4: a máquina de soco

Ao apertar **Tentar!**. O placar vai de 000 para 038, a tela treme e a Bell gargalha.

![Prólogo 4: a máquina de soco](imagens/p14-soco.jpg)
*Prólogo 4: a máquina de soco*

> ▶ `LINE_PUNCH_MACHINE`  
> ▶ `BELL_LAUGH_AT_LINE`  
> ▶ `LINE_IDLE`  
> **Bell** *(marota)*: HAHAHAHA! Você viu isso?  
> **Line** *(sorrindo)*: Eu não consegui bater direito… aquela coisa estava estragada.  
> ▶ `BELL_IDLE`  
> **Narradora**: Elas saem do playground com a barriga doendo de tanto rir.  

![A Bell gargalhando do soco da Line](imagens/p15-hahaha.jpg)
*A Bell gargalhando do soco da Line*

### 4.5 Prólogo 5: o túnel e a transição para a fazenda

As duas atravessam o túnel iluminado e se beijam. A tela escurece, a narração conta que o tempo passou e o jogo segue direto para a manhã na fazenda.

![Prólogo 5: o túnel e a transição para a fazenda](imagens/p17-tunel.jpg)
*Prólogo 5: o túnel e a transição para a fazenda*

> ▶ `LINE_BELL_TUNNEL_KISS`  
> **Bell & Line**: ♥  
> **Narradora**: E foi assim, entre um BK, uma máquina de soco “estragada” e um beijo no túnel, que a história delas começou.  
> **Narradora**: O tempo passou... e o sonho das duas virou uma fazendinha, um cachorrinho chamado Theo e muitas manhãs juntas.  

![O primeiro beijo no túnel](imagens/p18-beijo.jpg)
*O primeiro beijo no túnel*

![Transição: “O tempo passou…”](imagens/p21-tempo-passou.jpg)
*Transição: “O tempo passou…”*

### 4.6 Manhã na fazenda

Começa logo depois do prólogo. A Line sai de casa e a Bell a espera no quintal.

![Manhã na fazenda](imagens/02-manha.jpg)
*Manhã na fazenda*

> ▶ `BELL_IDLE`  
> 🎬 **Título na tela:** Line & Bell — Capítulo 1 — Nossa vidinha  
> 💬 *Balão:* “Cocoricóóó!”  
> ▶ `LINE_IDLE`  
> ▶ `BELL_IDLE`  
> **Bell** *(rindo)*: Bom dia, dorminhoca! O galo já cantou três vezes.  
> **Line** *(marota)*: Bom dia, amor... só mais cinco minutinhos?  
> ▶ `BELL_LAUGH`  
> **Bell** *(sorrindo)*: Nada disso! Tem ovo pra pegar, horta pra regar e o Theo tá morrendo de fome.  
> 💬 *Balão:* “Au! Au!”  
> ▶ `LINE_LAUGH`  
> **Line** *(rindo)*: Tá bom, tá bom. Bora, fazendeira.  
> ▶ `BELL_CURTSY`  
> **Bell** *(apaixonada)*: E faz carinho nos bichinhos, que eles ficam com ciúme de mim.  
> ▶ `BELL_IDLE`  

### 4.7 As tarefas do dia

Parte jogável. O painel no canto mostra as tarefas: **pegar 4 ovos** no galinheiro, **pegar o regador** no poço e **regar os 4 canteiros**, **pegar a ração** no celeiro e **pôr na tigela do Theo**, e **fazer carinho em 3 bichinhos**. A Bell segue a Line e comenta cada tarefa com balões.

![As tarefas do dia](imagens/03-tarefas-galinhas.jpg)
*As tarefas do dia*

### 4.8 Almoço

Quando todas as tarefas terminam, as duas dão um toca aqui e almoçam juntas na mesa do quintal.

![Almoço](imagens/05-almoco.jpg)
*Almoço*

> ▶ `BELL_LAUGH`  
> ▶ `LINE_BELL_CELEBRATE`  
> **Bell** *(rindo)*: Missão cumprida, fazendeira! Bora almoçar?  
> ▶ `LINE_BELL_EAT`  
> **Bell** *(rindo)*: Não é BK... mas tá uma delícia.  
> **Line** *(apaixonada)*: Tudo fica mais gostoso com você do lado.  
> **Bell** *(envergonhada)*: Para, boba!  
> **Line** *(sorrindo)*: Depois do almoço... bora ver o pôr do sol lá no lago?  
> **Bell** *(apaixonada)*: Só se for de mãos dadas.  

### 4.9 A tarde de mãos dadas

Parte jogável: a Line anda de mãos dadas com a Bell até o lago.

![A tarde de mãos dadas](imagens/04-pasto.jpg)
*A tarde de mãos dadas*

### 4.10 Pôr do sol e o rapto

No píer do lago. Esta é a cena mais longa do jogo.

![Pôr do sol e o rapto](imagens/06-por-do-sol-danca.jpg)
*Pôr do sol e o rapto*

> ▶ `LINE_BELL_HOLD_HANDS`  
> **Bell** *(apaixonada)*: O pôr do sol daqui é o meu favorito. Promete que amanhã a gente volta?  
> **Line** *(apaixonada)*: Prometo. Amanhã, depois de amanhã... todo dia que você quiser.  
> ▶ `LINE_BELL_DANCE`  
> ▶ `LINE_BELL_KISS`  
> ▶ `LINE_BELL_HOLD_HANDS`  
> **Bell** *(rindo)*: Boba...  
> ▶ `LINE_IDLE`  
> ▶ `BELL_SCARED`  
> 💬 *Balão:* “AU! AU! AU!”  
> **Bell** *(surpresa)*: Line... que barulho foi esse?  
> ▶ `DRAGON_FLY`  
> ▶ `LINE_SCARED`  
> **Line** *(surpresa)*: BELL! CORRE!  
> ▶ `DRAGON_AIR_ATTACK`  
> ▶ `BELL_CAPTURED`  
> ▶ `BELL_DRAGON_CARRIED`  
> ▶ `DRAGON_TAKEOFF`  
> **Bell** *(surpresa)*: LIIINE!  
> ▶ `DRAGON_FLY`  
> ▶ `LINE_CALL_BELL`  
> **Line** *(surpresa)*: BELL!!!  
> ▶ `LINE_CRY`  
> 💬 *Balão:* “Auuu...”  
> **Line** *(chorando)*: Ele voou pra montanha, do outro lado da floresta...  
> ▶ `LINE_DETERMINED`  
> **Line** *(brava)*: Theo, cuida da fazenda pra mim. Eu vou buscar a Bell.  

![A bitoquinha no lago](imagens/07-bitoquinha.jpg)
*A bitoquinha no lago*

![O dragão leva a Bell](imagens/08-rapto.jpg)
*O dragão leva a Bell*

### 4.11 Chegada na floresta

Primeira vez na Floresta Sussurrante.

![Chegada na floresta](imagens/09-floresta-mago.jpg)
*Chegada na floresta*

> **Line** *(neutro)*: A Floresta Sussurrante... O dragão foi pra montanha, do outro lado.  
> **Line** *(surpresa)*: Tem uma luz azul ali na clareira, a oeste. Será que mora alguém aqui?  

### 4.12 O Mago

Ao conversar com o Mago. A primeira conversa conta a história, a segunda (depois da espada) aponta para as ruínas e as seguintes sorteiam uma dica.

> **Mago**: Ora, ora... uma fazendeira na Floresta Sussurrante?  
> **Line** *(surpresa)*: Um dragão levou a Bell! Eu preciso chegar na montanha.  
> **Mago**: O dragão vermelho acordou, então... Fazia cem anos que ele dormia.  
> **Mago**: Naquele baú aqui do lado guardei uma espada que espera por um coração corajoso. Ela é sua.  
> **Mago**: E lembre-se: quando o dragão se cansa, o peito dele brilha. É ali que você deve acertar.  
> **Line** *(sorrindo)*: Obrigada! Eu vou trazer ela de volta.  
> **Mago**: O baú, menina! A espada está no baú.  
> **Mago**: Espere! Tem mais uma coisa. O dragão selou o caminho da montanha com magia antiga.  
> **Mago**: Depois dos espinhos ficam as Ruínas Encantadas. No altar da luz, a sua espada pode aprender a brilhar.  
> **Line** *(surpresa)*: Magia? Eu? Eu só sei plantar cenoura...  
> **Mago**: Quem atravessa uma floresta por amor já tem o que a magia pede. Vá!  
> **Mago**: Ah, e na gruta a leste desta floresta deixei umas coisinhas úteis. Uma bússola, quem sabe... Aperte I para ver a mochila e M para o mapa.  

**Falas sorteadas do Mago** (mudam conforme o progresso):

- “Os espinhos ao norte não resistem a uma boa lâmina.”
- “As barreiras das ruínas só se desfazem com luz. Procure o altar na sala a oeste.”
- “Pule o riacho, corte os espinhos, ache o altar. Simples, não?”
- “Baús trancados? Não. Portas trancadas! Três, pelo mundo. E três chaves antigas escondidas em baús.”
- “Cada documento que você guarda conta um pedaço da história. Junte dois que combinam e você entende mais do que imagina.”
- “Cristais apagados, barreiras de pé. Acenda todos e o caminho se abre.”
- “O Guardião de Pedra não sente a espada... mas a luz, ah, a luz ele sente.”
- “Sua magia volta sozinha, devagarinho. Não gaste tudo de uma vez!”
- “Três tochas guardam o portão da montanha. Acenda as três.”
- “Segure a magia até brilhar e solte: chuva de estrelas! Eu mesmo não faria melhor.”
- “O peito do dragão, lembre-se: quando ele cansar, o peito brilha.”
- “Quando ele encher o peito de ar, saia da frente. Fogo de dragão não se segura com espada.”

### 4.13 Espinhos sem espada

Ao chegar perto dos espinhos do norte sem a espada.

> **Line** *(neutro)*: Espinhos demais pra passar... Preciso de algo afiado para abrir caminho.  

### 4.14 A espada

Ao abrir o baú ao lado do Mago.

![A espada](imagens/10-espada.jpg)
*A espada*

> ▶ `LINE_CROUCH`  
> ▶ `LINE_CROUCH_STAND`  
> ▶ `LINE_SWORD_DRAW`  
> ▶ `LINE_HAPPY`  
> 🎬 **Título na tela:** Espada encontrada! — Agora a Line pode lutar  
> **Line** *(rindo)*: Uma espada! Com isso eu consigo cortar os espinhos no caminho do norte.  
> 🎮 *Tutorial na tela:* J ou Z: atacar (3x = combo) · K ou X: giro · L ou C: esquivar (correndo = dash) · V ou B: defender (segure) · Espaço e depois J: ataque aéreo  
> ▶ `LINE_COMBAT_IDLE`  
> **Line** *(surpresa)*: Sombras?! Só podem ser coisa do dragão... Vem!  

### 4.15 Chegada nas Ruínas Encantadas

![Chegada nas Ruínas Encantadas](imagens/12-ruinas-entrada.jpg)
*Chegada nas Ruínas Encantadas*

> **Line** *(surpresa)*: Ruínas... e essas pedras brilhando? Parece que o lugar tá respirando.  
> **Line** *(neutro)*: Paredes de luz fechando o caminho... O mago falou de um altar na sala a oeste.  

### 4.16 O altar da luz

Ao tocar a luz do altar, na sala a oeste do salão de entrada.

![O altar da luz](imagens/13-altar-magia.jpg)
*O altar da luz*

> ▶ `LINE_IDLE`  
> **???**: Coração corajoso... vieste de longe.  
> **Line** *(surpresa)*: Quem tá falando?!  
> **Espírito das Ruínas**: Sou a luz que dorme nesta pedra. Estende a tua espada.  
> ▶ `LINE_SWORD_DRAW`  
> ▶ `LINE_HAPPY`  
> 🎬 **Título na tela:** Magia aprendida! — Raio de Luz  
> **Espírito das Ruínas**: A luz agora corre na tua lâmina. Acende os cristais apagados e as barreiras cairão.  
> 🎮 *Tutorial na tela:* Q ou U: Raio de Luz (mira no inimigo ou cristal mais perto). Gasta 1 ◆ de magia, que volta sozinha. Sombras odeiam a luz!  
> ▶ `LINE_COMBAT_IDLE`  
> **Line** *(marota)*: Ih... as ruínas acordaram junto. Bora, espada brilhante!  

### 4.17 O Guardião desperta

Ao se aproximar do Guardião, no salão norte das ruínas.

![O Guardião desperta](imagens/16-guardiao-acorda.jpg)
*O Guardião desperta*

> ▶ `LINE_IDLE`  
> **Guardião de Pedra**: Quem... acorda... o guardião...?  
> **Line** *(surpresa)*: Desculpa o barulho! Eu só preciso passar. O dragão levou a Bell!  
> **Guardião de Pedra**: Ninguém... passa. Só a luz... atravessa... a pedra.  
> ▶ `LINE_DETERMINED`  
> **Line** *(brava)*: Então vai ser na luz mesmo.  
> 💡 *Dica na tela:* Acerte o cristal do peito com a magia (Q) para abrir a guarda. Pule a onda do pisão!  

### 4.18 O Guardião vencido

![O Guardião vencido](imagens/19-chuva-de-estrelas.jpg)
*O Guardião vencido*

> **Guardião de Pedra**: A luz... é tua... Que ela... te guie... até o céu...  
> ▶ `LINE_RELIEVED`  
> 🎬 **Título na tela:** Nova magia! — Chuva de Estrelas  
> 🎮 *Tutorial na tela:* Segure Q (ou U) até a Line brilhar e solte: estrelas explodem em volta, atingindo tudo por perto. Gasta 3 ◆.  
> ▶ `LINE_HAPPY`  
> **Line** *(rindo)*: O caminho pro norte abriu! Espera só, Bell.  

### 4.19 Chegada na Montanha de Brasa

![Chegada na Montanha de Brasa](imagens/20-montanha.jpg)
*Chegada na Montanha de Brasa*

> **Line** *(neutro)*: A Montanha de Brasa... O covil do dragão fica lá no topo.  
> **Line** *(marota)*: Tem um portão de fogo lá em cima... e três tochas apagadas pelo caminho. Aposto que a luz acende.  
> **Line**: neutro  
> 💡 *Dica na tela:* Acenda as três tochas com a magia (Q). As apagadas soltam fumaça e aparecem no mapa (M).  

### 4.20 O portão se abre

Quando a terceira tocha acende.

![O portão se abre](imagens/21-tocha-na-lava.jpg)
*O portão se abre*

> ▶ `LINE_DETERMINED`  
> **Line** *(brava)*: O portão abriu! Aguenta firme, Bell. Tô chegando.  

### 4.21 Baú de coração extra

Há três: na sala trancada da gruta, na alcova leste das ruínas e na plataforma cercada de fendas na montanha.

> ▶ `LINE_CROUCH`  
> ▶ `LINE_CROUCH_STAND`  
> ▶ `LINE_HAPPY`  
> 🎬 **Título na tela:** Coração extra! — A vida máxima da Line aumentou  

### 4.22 O covil do dragão

Na primeira vez a cena é completa. Nas próximas tentativas, a luta começa direto.

![O covil do dragão](imagens/22-covil-dragao.jpg)
*O covil do dragão*

> ▶ `DRAGON_ROAR`  
> ▶ `LINE_DETERMINED`  
> **Line** *(neutro)*: De novo. Dessa vez eu não caio.  
> ▶ `BELL_CALL_LINE`  
> **Bell** *(surpresa)*: Line?! LINE! Você veio!  
> **Line** *(marota)*: Eu prometi, não prometi?  
> ▶ `BELL_TRAPPED`  
> ▶ `DRAGON_GLIDE`  
> ▶ `DRAGON_LAND`  
> ▶ `DRAGON_ROAR`  
> ▶ `DRAGON_IDLE`  
> ▶ `LINE_SWORD_DRAW`  
> ▶ `LINE_ANGRY`  
> **Line** *(brava)*: Solta ela. AGORA.  
> ▶ `BELL_SCARED`  
> **Bell** *(surpresa)*: Cuidado! Quando ele cansa, o peito dele brilha. Esse é o ponto fraco!  
> ▶ `BELL_TRAPPED`  

### 4.23 Vitória e epílogo

Depois do golpe final.

![Vitória e epílogo](imagens/24-epilogo.jpg)
*Vitória e epílogo*

> ▶ `LINE_SWORD_SHEATHE`  
> ▶ `LINE_VICTORY`  
> ▶ `LINE_EXHAUSTED_IDLE`  
> ▶ `BELL_BREAK_FREE`  
> ▶ `LINE_BELL_RESCUE_HUG`  
> ▶ `LINE_HAPPY`  
> ▶ `BELL_HAPPY`  
> **Bell** *(rindo)*: Eu sabia que você vinha. Eu sabia!  
> ▶ `LINE_RELIEVED`  
> **Line** *(surpresa)*: Você tá bem? Ele te machucou?  
> ▶ `BELL_RELIEVED`  
> **Bell** *(apaixonada)*: Agora que você tá aqui, eu tô ótima.  
> ▶ `LINE_BELL_HUG_RELEASE`  
> ▶ `LINE_LAUGH`  
> **Line** *(marota)*: Então... será que ainda dá tempo de ver o pôr do sol?  
> ▶ `BELL_HAPPY`  
> **Bell** *(apaixonada)*: Só se for de mãos dadas. Sempre.  
> ▶ `LINE_BELL_DANCE`  
> 🎬 **Título na tela:** Fim — Obrigada por jogar!  
> 🎬 **Título na tela:** Fim?  

### 4.24 Baú com itens ou pistas

Todos os baús que não são a espada nem o coração extra. A Line agacha, o baú abre e aparece o que ela encontrou.

> ▶ `LINE_CROUCH`  
> ▶ `LINE_CROUCH_STAND`  
> ▶ `LINE_HAPPY`  
> **Line** *(surpresa)*: Uma bússola! A agulha aponta pra... um baú? Deve mostrar os tesouros que ainda não achei.  
> **Line** *(marota)*: Uma chave antiga. Deve abrir alguma daquelas portas trancadas.  
> **Line** *(sorrindo)*: Uma lanterna! Agora as galerias escuras das minas não me assustam.  
> **Line** *(surpresa)*: Um gancho com corda! Com ele dá pra atravessar de um poste até outro, por cima da água.  
> **Line** *(surpresa)*: Uma alavanca de ferro, pesada... Tem um carrinho desenhado no cabo.  
> **Line** *(sorrindo)*: É a alavanca do freio do carrinho de mina! Se eu encaixar numa estação, ele volta a andar.  
> **Line** *(apaixonada)*: Uma Pena de Fênix... Se eu cair, ela me levanta. Ufa.  
> **Line** *(marota)*: Bombas! Com elas eu quebro aquelas paredes rachadas. Ficam no atalho: é só apertar F (ou o botão do item).  

### 4.25 Documento encontrado

Ao pegar um papel brilhando no chão, examinar um lugar ou abrir um baú com documento. O texto aparece parágrafo por parágrafo; se ele completar uma conclusão, aparece o título “💡 Conclusão!”. Com os 12, coração extra.

> ▶ `LINE_CROUCH`  
> ▶ `LINE_CROUCH_STAND`  
> ▶ `LINE_IDLE`  
> 🎬 **Título na tela:** Pista encontrada! — … …  
> **Line**: surpresa  
> ▶ `LINE_HAPPY`  
> 🎬 **Título na tela:** Caderno completo! — A Line entendeu tudo: coração extra  
> **Line** *(brava)*: Agora eu sei tudo sobre esse dragão. Segura, Bell, que eu tô indo.  
> **Line** *(surpresa)*: Com esse pedaço de mapa, agora eu sei onde fica o covil. E tem uma caverna escondida na montanha!  
> **Line** *(chorando)*: Bell...  
> **Line** *(neutro)*: Vou guardar isso no caderno. … de … documentos.  

### 4.26 Examinar um lugar

Pontos de exame: as marcas de garra no píer, o cartaz do vilarejo e o bilhete na porta da cabana do caçador.

> ▶ `LINE_CROUCH`  
> ▶ `LINE_CROUCH_STAND`  

### 4.27 Porta trancada

Nas três portas trancadas: sem chave a Line comenta; com chave, a porta abre e a chave some.

> **Line** *(neutro)*: Trancada. Tem uma fechadura antiga... preciso de uma chave.  
> ▶ `LINE_HAPPY`  
> **Line** *(marota)*: Abriu! Vamos ver o que tem aí dentro.  

### 4.28 Poste de gancho sem o gancho

Ao chegar num poste do gancho antes de achar o gancho (sala leste das ruínas).

> **Line** *(neutro)*: Um poste com uma argola de ferro... e outro igual do outro lado. Com um gancho e corda eu passaria.  

### 4.29 Conversa com os moradores

Ao falar com qualquer morador do vilarejo. As falas mudam com o progresso e estão na seção 7.4. Com a Dona Rosa e o Seu Bento, a conversa termina abrindo a loja.


### 4.30 O carrinho de mina

Numa estação, antes de consertar o carrinho. Sem a alavanca, a Line comenta o que falta; com ela, encaixa a alavanca e o carrinho volta a andar.

![O carrinho de mina](imagens/40-estacao.jpg)
*O carrinho de mina*

> **Line** *(neutro)*: Um carrinho de mina nos trilhos. Falta a alavanca do freio... sem ela não sai do lugar.  
> **Line** *(neutro)*: Alguém deve saber onde foi parar essa alavanca.  
> **Line** *(neutro)*: O relatório do capataz disse que a alavanca ficou na Forja Antiga, na montanha.  
> ▶ `LINE_CROUCH`  
> ▶ `LINE_CROUCH_STAND`  
> ▶ `LINE_HAPPY`  
> 🎬 **Título na tela:** Carrinho consertado! — Agora dá para viajar entre as estações descobertas  
> **Line** *(sorrindo)*: Clique! Encaixou. Agora o carrinho me leva de estação em estação.  

### 4.31 Placas

| Onde | Texto |
|---|---|
| Floresta, perto das raízes | Cuidado com as raízes! Correndo por cima delas você pode tropeçar. Ande devagar (solte o correr). |
| Floresta, antes do riacho | Riacho à frente. Para atravessar, pule! (Espaço ou botão Pular). Correndo, o pulo vai mais longe. |
| Ruínas, salão de entrada | Ruínas Encantadas. Só a luz atravessa as barreiras. O altar da luz fica na sala a oeste. |
| Montanha, início | Fendas na rocha! Pule para atravessar (Espaço). Correndo, o pulo vai mais longe. |
| Montanha, fonte | Fonte das brasas: beba para recuperar vida e magia. Se cair, você volta para cá. |

### 4.32 Balões dos bichos e da Bell (na fazenda)

- Cocoricóóó! (galo, de manhã)
- Au! / Au! Au! / Au! Au! ♥ / Auuu~ (fome) / Auuu... / AU! AU! AU! (Theo)
- Piu! (pintinhos)
- Quatro ovinhos! Vai ter bolo hoje. (Bell)
- Rega as cenouras com carinho! (Bell)
- A horta tá feliz. E eu também! (Bell)
- O Theo já tá sentindo o cheiro! (Bell)
- Os bichinhos te amam. Eu entendo eles. (Bell)

### 4.33 Dicas que aparecem durante o jogo

| Quando | Texto |
|---|---|
| Item novo | Aviso no canto: “🧪 Poção de Vida ×2”, “📜 Pista: Carta do Mago”… |
| Cura rápida sem item | 🎒 Nenhum item de cura na mochila / ❤️ A vida já está cheia |
| Prólogo, no shopping | Aproxime-se da Bell e pressione E para falar com ela. (No celular: toque no botão.) |
| Prólogo, no playground | Pressione E para a Line tentar. (No celular: toque no botão.) |
| Primeiros passos | WASD ou setas para andar, Shift para correr, E para interagir. As tarefas ficam no canto da tela. |
| Tarde | Leve a Bell até o lago, de mãos dadas. |
| Depois do rapto | Siga pelo caminho ao norte, até a floresta. (Shift para correr) |
| Sem espada | A Line ainda não tem uma arma. Explore a floresta! |
| Raízes | Ops! Correndo sobre raízes a Line tropeça. Atravesse andando. |
| Água | Caiu na água! Pule (Espaço) para atravessar o riacho. |
| Fenda | Caiu na fenda! Pule (Espaço) para atravessar. Correndo, o pulo vai mais longe. |
| Sem magia | A Line ainda não sabe magia. Dizem que as Ruínas Encantadas guardam uma luz antiga... |
| Sem mana | Sem magia! Ela volta sozinha aos poucos, e os cristais azuis que os inimigos soltam recarregam. |
| Barreira | Uma barreira de luz se desfez! Acenda todos os cristais de cada sala para abrir caminho. |
| Fonte | Vida e magia renovadas! Se a Line cair nesta área, ela volta para esta fonte. |
| Guardião | Acerte o cristal do peito com a magia (Q) para abrir a guarda. Pule a onda do pisão! |
| Guardião, espada na pedra | Clang! A espada não arranha a pedra. Acerte o cristal do peito com a magia (Q) para abrir a guarda! |
| Guardião tonto | O cristal rachou e o guardião ficou tonto! Agora a espada funciona: ataque! |
| Guardião, cristal recarregando | O cristal do guardião ainda está brilhando forte. Desvie e tente de novo daqui a pouco! |
| Dragão: fogo | Fogo! Saia da frente ou esquive (L/C). Defender não segura as chamas. |
| Dragão: fogo em círculo | Fogo em círculo! Fique colada no dragão ou esquive através das chamas. |
| Dragão: cauda | Golpe de cauda! Pule (Espaço) quando o anel laranja piscar forte, ou corra para longe. |
| Dragão: mergulho | Ele vai mergulhar! Corra da sombra dele ou pule no último instante. |
| Dragão: ponto fraco | O dragão está atordoado! Ataque o ponto fraco brilhando no peito dele. |
| Dragão: fim | O dragão não aguenta mais! Chegue perto e aperte ATACAR para o golpe final. |

## 5. O primeiro encontro (prólogo)

> ⚠️ **As animações e artes do prólogo também são temporárias.** Várias usam uma animação substituta, e o playground ainda é desenhado no código.

O prólogo é a história de como a Line e a Bell se conheceram. Ele vem **antes de tudo**: ao escolher **Novo jogo**, o jogo começa no Minas Shopping, em 09/05/2024. Tudo segue o HTML *Bell-Line-Primeiro-Encontro-v26*: os três lugares, as posições, as falas (com a mesma grafia), as expressões dos retratos, a narradora, as dicas, o placar da máquina de soco e as etiquetas de lugar e data. O menu do HTML não foi usado: o jogo mantém o próprio menu. As ilustrações de close-up do HTML viraram animações das duas juntas com a câmera se aproximando (zoom).

### 5.1 O fluxo completo

| # | Lugar | O que acontece | Jogável? | Animações | Câmera |
|---|---|---|---|---|---|
| 1 | Minas Shopping | Título *O primeiro encontro* e *Minas Shopping · 09/05/2024*. A Line admira a Bell de longe: “puxa ela é tão linda”. | não | `LINE_IDLE` (de costas), `LINE_ADMIRE`, `BELL_WAIT` | normal |
| 2 | Minas Shopping | A Line anda até a Bell. Perto dela aparece o botão **Falar com a Bell**. | sim, só andar | `LINE_WALK_*`, `BELL_WAIT` | segue a Line |
| 3 | Minas Shopping | A Line se aproxima e as duas conversam: shopping grande, “Você tá atrasada”, “oq vamos comer?”, “BK.”. | não | `LINE_BELL_MEET`, `LINE_BELL_GREET_HUG` | zoom 1,6× |
| 4 | Minas Shopping (mesa) | As duas andam até a mesa e comem BK. “você parece estar tímida” / “é que você é muito linda”. | não | `LINE_WALK_*`, `BELL_WALK_*`, `LINE_BELL_BK` | zoom na mesa |
| 5 | Minas Shopping | A Bell segura a mão da Line e as duas saem juntas do shopping. | não | `LINE_BELL_MEET`, `LINE_BELL_WALK_HANDS` | volta ao normal |
| — | transição | Brilho rosa e a tela escurece. | — | — | — |
| 6 | Playground | As duas chegam. A Line para na máquina de soco, a Bell fica ao lado. Aparece o botão **Tentar!**. | só o botão | `LINE_WALK_*`, `BELL_WALK_*`, `LINE_IDLE`, `BELL_IDLE` | normal |
| 7 | Playground | A Line soca: o placar vai de 000 para **038**, a tela treme e a Bell gargalha. “HAHAHAHA! Você viu isso?” / “Eu não consegui bater direito… aquela coisa estava estragada.” | não | `LINE_PUNCH_MACHINE`, `BELL_LAUGH_AT_LINE` | tremor no impacto |
| 8 | Playground | Narradora: elas saem com a barriga doendo de tanto rir. | não | `LINE_WALK_*`, `BELL_WALK_*` | normal |
| — | transição | Brilho rosa e a tela escurece. | — | — | — |
| 9 | Túnel | As duas atravessam o túnel e se beijam, com corações subindo. “Bell & Line ♥”. | não | `LINE_WALK_RIGHT`, `BELL_WALK_RIGHT`, `LINE_BELL_TUNNEL_KISS` | zoom 1,6× |
| 10 | Túnel → fazenda | Narradora fecha a história. A tela escurece: “O tempo passou... e o sonho das duas virou uma fazendinha…”. Começa a manhã na fazenda. | não | — | escurece |

### 5.2 Ambientação de cada lugar

![Os três lugares: Minas Shopping, Playground e Túnel (temporários)](imagens/encontro-fundos.jpg)
*Os três lugares: Minas Shopping, Playground e Túnel (temporários)*

A tela do HTML é vertical (360×640). No jogo, o lugar ocupa essa mesma área, centralizado, e em telas largas as laterais mostram o próprio cenário borrado e escurecido. A área onde dá para andar é a mesma do HTML.

**Minas Shopping**
- **Fundo:** ilustração vertical do shopping, com piso claro de losangos rosados, mesinhas redondas com flores, cadeiras rosas e verdes, plantas, vitrines de doces e cafés, escada rolante ao fundo e luz quente. É a imagem do próprio HTML (720×1280), com o mesmo sombreado suave por cima.
- **Posições:** a Line entra por baixo, à esquerda, de costas. A Bell espera à direita, perto do sofá vermelho, olhando para a esquerda. A mesa do BK fica no centro.
- **Precisa de arte final:** a ilustração do shopping, feita a partir do **modelo real** abaixo, e uma versão da mesa com o lanche do BK, se o casal comendo não vier com a mesa desenhada.

#### ⭐ Minas Shopping: modelo real para a arte final

> 💛 **Este é o cenário de verdade do Minas Shopping**: a praça de alimentação onde as duas se encontraram. A ilustração final do shopping deve usar esta foto como **modelo**, no estilo do jogo. A ilustração que está no jogo hoje (vinda do HTML) é **temporária**.

![Praça de alimentação do Minas Shopping: modelo para a arte final](imagens/encontro-modelo-minas-shopping.jpg)
*Praça de alimentação do Minas Shopping: modelo para a arte final*

**O que a arte precisa ter, seguindo a foto:**
- **Praça de alimentação**, não um corredor de lojas.
- **Burger King** ao fundo, com o letreiro vermelho e bege sobre o balcão marrom, as telas de cardápio e os pôsteres de lanche. É onde elas comem o BK.
- Ao lado, outra lanchonete com letreiro amarelo e laranja (na foto é o Popeyes).
- **Teto** de madeira ripada, com luzes embutidas e uma faixa clara iluminada.
- **Pilar branco** grande do lado direito.
- Um **balcão** comprido de pedra na frente das lojas e uma **floreira** com plantas à direita.
- **Piso** claro de porcelanato, bem polido, refletindo as luzes.
- **Mesas redondas** com o tampo claro estampado de desenhos e pé central metálico.
- **Cadeiras** de madeira curvada, cor caramelo, com pernas finas de metal. Algumas mesas têm banco estofado encostado.
- **Luz quente e aconchegante**, com tons de madeira, bege, caramelo e o vermelho do BK.

**Como encaixar no jogo:**
- A tela é vertical (360×640), vista um pouco de cima. As lojas ficam no alto e as mesas se espalham pela área onde dá para andar.
- A Line entra por baixo, à esquerda. A Bell espera à direita, perto das mesas. A mesa do BK fica no centro e as duas se sentam nela.
- As setas, o ícone de hambúrguer e coxinha e o triângulo que aparecem na foto são do app onde ela foi tirada e **não fazem parte do cenário**.

A foto também fica salva em `arte/referencias/minas_shopping_modelo.jpg`.

**Playground**
- **Fundo:** desenhado no código igual ao HTML. Tem o piso xadrez roxo, parede escura, dois fliperamas à esquerda (um rosa com tela azul-piscina e um azul com tela rosa), um painel rosa no alto e um balcão de prêmios embaixo.
- **Máquina de soco:** a mesma que aparece na animação `LINE_PUNCH_MACHINE`, parada no lugar do soco. Em cima dela há um **placar** rosa com números amarelos que mostra **000** e vira **038** no impacto.
- **Precisa de arte final:** a ilustração do playground (fliperamas, balcão, luzes, piso) e a máquina de soco separada, parada e com o placar.

#### Playground: o cenário como está no jogo

> Este é o playground que aparece hoje no jogo, desenhado no código a partir do HTML do primeiro encontro. Ele é **temporário** e serve de **mapa** para a ilustração final: onde fica cada coisa e onde as duas se posicionam.

![Playground no jogo hoje, com cada parte numerada e o placar antes e depois do soco](imagens/encontro-playground.jpg)
*Playground no jogo hoje, com cada parte numerada e o placar antes e depois do soco*

| # | Parte | Como está hoje | O que a arte final deve mostrar |
|---|---|---|---|
| 1 | Fliperama rosa | alto, à esquerda: letreiro rosa, tela azul-piscina e dois botões amarelos | máquina de fliperama com tela acesa, controles e luzes |
| 2 | Fliperama azul | logo abaixo do primeiro: letreiro azul e tela rosa | outro fliperama, com cores diferentes do primeiro |
| 3 | Painel rosa | no alto, ao centro | letreiro luminoso ou painel de prêmios do playground |
| 4 | Máquina de soco e placar | no meio da sala, com o saco vermelho. O placar mostra 000 e vira 038 no soco | a mesma máquina da `LINE_PUNCH_MACHINE`, parada, com o placar digital em cima |
| 5 | Balcão de prêmios | embaixo, à direita, com sete prêmios rosa | balcão com bichinhos de pelúcia e brindes |
| 6 | Piso | xadrez roxo em quadrados de 32 px | piso de playground colorido, que combine com as luzes |
| 7 | Paredes | faixas rosadas nas laterais e embaixo | paredes com luzes neon e decoração |
| 8 | Fundo | roxo bem escuro em cima e embaixo | teto e entrada do playground, com luz baixa e clima de fliperama |

**Posições (na tela de 360×640 do HTML):**
- **A Line** para em frente à máquina de soco (x 204, y 315).
- **A Bell** fica olhando do lado esquerdo (x 150, y 340).
- As duas **entram por baixo, à esquerda**, e saem pela direita, embaixo.

**Clima:** playground de shopping, com luz baixa roxa e rosa, telas brilhando e um ar divertido. É onde a Bell morre de rir.


**Túnel**
- **Fundo:** ilustração vertical do túnel em arco, com lampiões, trepadeiras com flores, corações de luz no chão e a cidade à noite ao fundo. É a imagem do HTML, com uma vinheta roxa leve.
- **Posições:** as duas entram pela esquerda e se encontram no meio do túnel para o beijo.
- **Precisa de arte final:** a ilustração do túnel.

**Cores e clima:** as transições entre lugares têm um brilho rosa (247, 178, 200) antes de escurecer. O túnel começa com esse tom rosa, que some aos poucos. No prólogo não há nuvens, pássaros, bichos, corações de vida, magia nem painel de tarefas: a Line anda sem espada.

### 5.3 Interface do prólogo

- **Etiquetas no alto, à esquerda**, como no HTML: o nome do lugar (*Minas Shopping*, *Playground* ou *Túnel*) e *♥ 09/05/2024*. Elas somem na transição para a fazenda.
- **Faixa de dica** no alto: “Aproxime-se da Bell e pressione E para falar com ela.” e “Pressione E para a Line tentar.” No celular, o texto fala em tocar no botão.
- **Botão de ação:** *Falar com a Bell* e *Tentar!*. No celular, os botões de luta, pulo e magia ficam escondidos durante o prólogo.
- **Caixa de diálogo** com retrato, igual ao resto do jogo. A *Narradora* aparece sem retrato.
- **Pular cena (Tab):** pula cada cena. Pulando tudo, o jogo passa pelos três lugares e chega na fazenda.

### 5.4 Transições

- **Entre lugares** (shopping → playground → túnel): brilho rosa por 0,8 s enquanto a tela escurece em 0,9 s. O novo lugar surge clareando.
- **Do túnel para a fazenda:** depois do beijo, a tela escurece em 1,6 s, a câmera volta ao normal e a narradora fala sobre o tempo que passou, com a tela preta. Então a fazenda aparece e começa a cena *Manhã na fazenda* (Capítulo 1).

### 5.5 Todas as animações do prólogo

Estas são as animações próprias do prólogo, no grupo **Primeiro encontro (prólogo)** da seção 10. As que ainda não têm arte usam uma substituta parecida.

| Código | Quando aparece e o que precisa mostrar | Quadros | Status hoje |
|---|---|---:|---|
| `LINE_ADMIRE` | Início: a Line vê a Bell de longe. Precisa da Line de costas ou de lado, com a mão no peito, corações e o corpo balançando. | 20 | 🔁 usa `LINE_HAPPY` |
| `BELL_WAIT` | A Bell esperando no shopping: olha para os lados, mexe no cabelo, confere o celular. Virada para a esquerda. | 16 | 🔁 usa `BELL_IDLE_RIGHT` |
| `LINE_BELL_MEET` | As duas frente a frente, conversando e sorrindo. Usada no “esse shopping é muito grande”, no “oq vamos comer?” e antes de saírem. | 16 | 🔁 usa `LINE_BELL_HOLD_HANDS` |
| `LINE_BELL_GREET_HUG` | Abraço de chegada no “Você tá atrasada”. O HTML mostra a Bell pulando no abraço com uma perna levantada. | 24 | 🔁 usa `LINE_BELL_RESCUE_HUG` |
| `LINE_BELL_BK` | As duas sentadas à mesa comendo BK (hambúrguer, batata e refri), com a mesa desenhada. O HTML tem 3 quadros. | 24 | 🔁 usa `LINE_BELL_EAT` |
| `LINE_PUNCH_MACHINE` | A Line soca a máquina, com a máquina e o placar na mesma animação. O impacto é por volta da metade. | 16 | ✅ temporária |
| `BELL_LAUGH_AT_LINE` | A Bell gargalhando da Line: se dobra de rir, bate na perna, enxuga as lágrimas. | 16 | 🔁 usa `BELL_LAUGH` |
| `LINE_BELL_TUNNEL_KISS` | O primeiro beijo: as duas se aproximam de mãos dadas, se beijam e se afastam sorrindo. O HTML tem 8 quadros. | 8 | 🔁 usa `LINE_BELL_KISS` |

**Animações que o prólogo reaproveita** (já existem, também temporárias): `LINE_IDLE`, `LINE_IDLE_BACK`, `LINE_WALK_RIGHT`, `LINE_WALK_LEFT`, `LINE_WALK_FRONT`, `LINE_WALK_BACK`, `BELL_IDLE`, `BELL_WALK_RIGHT`, `BELL_WALK_LEFT`, `BELL_WALK_FRONT`, `BELL_WALK_BACK` e `LINE_BELL_WALK_HANDS` (saindo do shopping de mãos dadas).

**Efeitos do prólogo** (feitos no código): corações subindo no beijo, anel de impacto e tremor de tela no soco, brilho rosa das transições, zoom da câmera e escurecer.

### 5.6 Retratos usados no prólogo

| Personagem | Expressões | Onde |
|---|---|---|
| Line | `apaixonada`, `sorriso` | “puxa ela é tão linda”, “é que você é muito linda” / conversa, soco |
| Bell | `maroto`, `sorriso`, `neutro`, `apaixonada` | “Você tá atrasada”, “HAHAHAHA!” / “BK.” / “você parece estar tímida” / o olhar apaixonado sem fala |
| Narradora | sem retrato | três falas: saída do shopping, saída do playground e o fim no túnel |
| Bell & Line | sem retrato | o “♥” depois do beijo |

### 5.7 Arte que já existe no HTML

O HTML do primeiro encontro já traz ilustrações das duas juntas: o abraço, o BK na mesa, as duas de mãos dadas, o beijo (tira de 8 quadros), a caminhada e o BK animado. Hoje o jogo usa as animações que já tinha no lugar delas, mas essas ilustrações são a melhor referência (ou até a base) para a arte final de `LINE_BELL_GREET_HUG`, `LINE_BELL_BK`, `LINE_BELL_MEET`, `LINE_BELL_TUNNEL_KISS` e `LINE_BELL_WALK_HANDS`.

![Ilustrações do HTML do primeiro encontro (referência para a arte final)](imagens/encontro-referencia-html.jpg)
*Ilustrações do HTML do primeiro encontro (referência para a arte final)*

### 5.8 O que falta para a versão final do prólogo

- [ ] `LINE_ADMIRE`, `BELL_WAIT`, `LINE_BELL_MEET`, `LINE_BELL_GREET_HUG`, `LINE_BELL_BK`, `BELL_LAUGH_AT_LINE` e `LINE_BELL_TUNNEL_KISS` com arte própria.
- [ ] `LINE_PUNCH_MACHINE` final e a máquina de soco parada, com o mesmo desenho.
- [ ] Ilustração do Playground (hoje desenhada no código).
- [ ] Ilustração final do Minas Shopping seguindo a foto-modelo da praça de alimentação (seção 5.2), com o Burger King.
- [ ] Versão final da ilustração do Túnel.
- [ ] Line parada de costas (`LINE_IDLE_BACK`) caprichada para a entrada no shopping.
- [ ] Opcional: música e sons (passos no shopping, fliperamas, o soco, o beijo).

### 5.9 Progresso e salvamento

- **Novo jogo** sempre começa pelo prólogo.
- Se o jogador fechar o jogo **no meio do prólogo**, **Continuar** recomeça o prólogo do início (ele é curto).
- Terminado o prólogo, o jogo marca `encontroFeito` e salva já na fazenda. Jogos salvos antes do prólogo existir continuam de onde pararam.

## 6. As fases

Os três lugares do prólogo (Minas Shopping, Playground e Túnel) estão na seção 5. A aventura tem **sete áreas**, todas ligadas entre si (a seção 7.1 mostra como). As áreas ficaram bem maiores nesta versão:

| Área | Tamanho (tiles) | Baús | Inimigos | Novidades |
|---|---|---|---|---|
| Fazendinha | 46 × 34 | 1 | — | estrada nova para o vilarejo, a leste |
| Vilarejo do Riacho | 60 × 40 | 1 | — | área nova: moradores, loja, ferraria, fonte e estação do carrinho |
| Floresta Sussurrante | 76 × 44 | 5 | 10 sombras | cabana do caçador, lago com ilha (gancho), pedra rachada (bomba), saída para o vilarejo |
| Gruta dos Ecos | 64 × 44 | 7 | 5 sombras, 2 fogos-fátuos azuis, 5 morcegos | metade nova: as **Minas de Cristal**, escuras, com morcegos, trilhos, estação e abismo (gancho) |
| Ruínas Encantadas | 70 × 36 | 5 | 8 sombras, 6 fogos-fátuos azuis | torre nordeste (gancho), sala leste, atalho para as Minas |
| Montanha de Brasa | 72 × 40 | 5 | 8 fogos-fátuos de fogo, 9 sombras | Forja Antiga, estação, chão em brasa, atalho para as Minas |
| Covil do Dragão | 26 × 20 | 0 | — | — |

### 6.1 Fazendinha
Casa com varanda e duas chaminés, celeiro, galinheiro, horta, poço, moinho, pasto, chiqueiro, lago com píer e barco, varal, casinha do Theo, mesa de piquenique, árvores frutíferas e flores. Tem borboletas, pássaros, nuvens, folhas caindo e fumaça nas chaminés. De manhã, a luz é clara. À tarde, o céu fica alaranjado, e depois do rapto vira noite com vaga-lumes.

Depois do rapto, abre a **estrada do leste**, que leva ao Vilarejo do Riacho. Antes disso a estrada fica fechada: a Line não sai da fazenda no meio do dia com a Bell.

![Pasto com vacas, cavalo e ovelhas](imagens/04-pasto.jpg)
*Pasto com vacas, cavalo e ovelhas*

![Mapa da fazendinha: saída norte para a floresta e estrada leste para o vilarejo](imagens/mapa-fazenda.jpg)
*Mapa da fazendinha: saída norte para a floresta e estrada leste para o vilarejo*

### 6.2 Vilarejo do Riacho (área nova)
Um vilarejo pequeno a leste da fazenda, com uma praça de terra batida no meio, fonte, quadro de avisos, casinhas de telhado colorido, barraca de feira, um riacho ao sul e a estação do carrinho de mina a leste. Não tem inimigos: é o lugar seguro da aventura.

- **Praça:** a fonte (cura e vira ponto de retorno) e o **cartaz do vilarejo**, que é um documento de investigação.
- **Loja da Dona Rosa** (casa do oeste, com letreiro): vende poções, elixir, bombas, a Pena de Fênix e as Botas de Andarilha.
- **Ferraria do Seu Bento** (casa do leste, com letreiro e bigorna): vende as armaduras.
- **Estação do Vilarejo:** o carrinho de mina parado nos trilhos, esperando a alavanca do freio.
- **Moradores:** Dona Rosa, Seu Bento, Seu Zé (o mais velho, conta a história do carrinho), Dona Lurdes (mulher do caçador) e o Pedrinho (que corre de um lado para o outro e conta da pedra rachada).
- **Saídas:** oeste para a fazenda e norte para a floresta.

![O Vilarejo do Riacho: praça, fonte e moradores](imagens/37-vilarejo.jpg)
*O Vilarejo do Riacho: praça, fonte e moradores*

![Mapa do vilarejo: loja (oeste), ferraria (leste), praça, riacho e estação](imagens/mapa-vilarejo.jpg)
*Mapa do vilarejo: loja (oeste), ferraria (leste), praça, riacho e estação*

### 6.3 Floresta Sussurrante
Trilha com raízes (correr sobre elas faz a Line tropeçar, a não ser com as Botas de Andarilha), riacho para pular, a clareira do Mago com o baú da espada, espinhos que fecham o norte e sombras depois que a espada é pega. Ela cresceu para o leste e para o sul:

- **Clareira do Mago (oeste):** o Mago, o baú da espada e o baú da **Carta do Mago**.
- **Trilha leste:** leva à entrada da Gruta dos Ecos.
- **Cabana do caçador (nordeste):** na porta está pregado o **bilhete do caçador** Tobias.
- **Clareira do lago (sudeste):** um lago com uma **ilha no meio**, alcançada com o **gancho** entre dois postes. Mais ao sul, uma **pedra rachada** esconde um baú: precisa de **bomba**.
- **Saídas:** sul para a fazenda, norte para as ruínas (depois da espada), leste para a gruta e sudeste para o vilarejo.

![Sombras na floresta](imagens/11-floresta-sombras.jpg)
*Sombras na floresta*

![O poste do gancho na beira do lago: do outro lado fica a ilha](imagens/45-gancho.jpg)
*O poste do gancho na beira do lago: do outro lado fica a ilha*

![Mapa da floresta: clareira do Mago, cabana do caçador, lago com ilha e as quatro saídas](imagens/mapa-floresta.jpg)
*Mapa da floresta: clareira do Mago, cabana do caçador, lago com ilha e as quatro saídas*

### 6.4 Gruta dos Ecos e Minas de Cristal
A gruta ficou com o dobro do tamanho. A metade oeste é a caverna azulada de antes; a metade leste são as **Minas de Cristal**, abandonadas desde que o dragão acordou.

- **Gruta (oeste):** fonte, pergaminho da **Lenda da Montanha**, a bússola, um elixir, uma chave e a sala trancada com o coração extra e o **Mapa rasgado**.
- **Salão de entrada das Minas:** o baú da **lanterna**, a placa das minas, a **Estação das Minas** e o **relatório do capataz**.
- **Galerias escuras:** sem a lanterna, a Line só enxerga um pouquinho em volta; com ela, a luz fica bem maior. Moram ali os **morcegos**. No meio, um baú de bombas.
- **Abismo:** uma fenda funda que só se atravessa com o **gancho**. Do outro lado, a **Pena de Fênix**.
- **Paredes rachadas:** duas, que abrem com **bomba** o atalho para a **Montanha de Brasa** (leste).
- **Saídas:** oeste para a floresta, norte para as ruínas (um atalho que só abre acendendo o cristal do lado das ruínas) e leste para a montanha (depois das paredes rachadas).

![A Gruta dos Ecos: fonte, cogumelos luminosos e o pergaminho da lenda](imagens/26-gruta.jpg)
*A Gruta dos Ecos: fonte, cogumelos luminosos e o pergaminho da lenda*

![Galeria escura sem lanterna: a Line quase não enxerga](imagens/43-minas-escuro.jpg)
*Galeria escura sem lanterna: a Line quase não enxerga*

![A mesma galeria com a lanterna](imagens/44-minas-lanterna.jpg)
*A mesma galeria com a lanterna*

![Mapa da gruta e das Minas: a gruta azul a oeste, as minas a leste, a estação, o abismo e os atalhos](imagens/mapa-gruta.jpg)
*Mapa da gruta e das Minas: a gruta azul a oeste, as minas a leste, a estação, o abismo e os atalhos*

### 6.5 Ruínas Encantadas
Um templo antigo de pedra e musgo, organizado em salas:

- **Salão sul (entrada):** a placa, uma fonte e dois cristais que abrem a barreira do meio. A oeste fica a **sala do altar**, onde a Line aprende a magia, e no chão, perto dele, a **página 1 do diário do Guardião**.
- **Salão do meio:** dois lagos com um cristal numa ilhota em cada um (só acendem de longe, com o Raio de Luz), mais um cristal, pilares, sombras e fogos-fátuos. A leste fica a **alcova com o coração extra**.
- **Salão norte:** arena com pilares onde dorme o **Guardião de Pedra**. Vencido, ele desfaz a última barreira, que leva à montanha.
- **Ala leste da entrada:** pilares, sombras e um baú com **chave antiga** e moedas.
- **Biblioteca (trancada):** o baú com a **página 2 do diário** e um elixir.
- **Sala leste (nova):** o baú do **gancho**.
- **Torre nordeste (nova):** do outro lado de um fosso, alcançada com o gancho entre dois postes. Tem um baú com elixir e 60 moedas.
- **Atalho sudeste (novo):** um corredor fechado por uma barreira de luz; acendendo o cristal da sala do lado, ele abre a passagem para as Minas.
- **Saídas:** sul para a floresta, norte para a montanha (depois do Guardião) e sudeste para as Minas.

![A biblioteca trancada das ruínas](imagens/33-biblioteca.jpg)
*A biblioteca trancada das ruínas*

![Cristais acesos e barreira desfeita](imagens/15-barreira-aberta.jpg)
*Cristais acesos e barreira desfeita*

![Mapa das ruínas: salões, biblioteca, torre do gancho e o atalho para as Minas](imagens/mapa-ruinas.jpg)
*Mapa das ruínas: salões, biblioteca, torre do gancho e o atalho para as Minas*

### 6.6 Montanha de Brasa
Rocha vulcânica, rios de lava e brasas subindo:

- **Início:** uma fenda para pular e a **primeira tocha**, perto da placa.
- **Meio:** lava dos dois lados, a **fonte das brasas** e a segunda tocha, numa **ilha no meio da lava**, que só acende de longe.
- **Topo:** a **terceira tocha**, a **plataforma com o coração extra** e o **portão de fogo**, que abre com as três tochas. Perto dele, a **fita de cabelo da Bell**.
- **Encosta leste:** um baú com **chave antiga** e a porta de ferro da **caverna escondida**, onde estão a **escama vermelha** e uma poção.
- **Forja Antiga (nova):** a sala do X vermelho do mapa rasgado. Tem a bigorna do Mestre Aurélio, a **receita da Armadura de Brasa** e o baú da **Alavanca de Ferro**.
- **Estação da Forja (nova):** a terceira estação do carrinho.
- **Chão em brasa (novo):** um caminho de brasa rasa que queima a Line (meio coração a cada meio segundo). Só com a **Armadura de Brasa** dá para atravessar até o baú do fundo, com 90 moedas e um elixir.
- **Saídas:** sul para as ruínas, norte para o covil (pelo portão de fogo) e leste para as Minas.

![A tocha da ilha de lava, que só acende de longe](imagens/21-tocha-na-lava.jpg)
*A tocha da ilha de lava, que só acende de longe*

![O chão em brasa da montanha](imagens/47-brasa.jpg)
*O chão em brasa da montanha*

![Mapa da montanha: as três tochas, o portão, a Forja Antiga, a estação e o chão em brasa](imagens/mapa-montanha.jpg)
*Mapa da montanha: as três tochas, o portão, a Forja Antiga, a estação e o chão em brasa*

### 6.7 Covil do Dragão
Caverna escura com lava nas laterais e estalagmites. A Bell fica numa jaula ao fundo. Quando a Line entra, a entrada desmorona e a luta começa. É a única área sem volta.

![O dragão cospe fogo no covil](imagens/23-dragao-fogo.jpg)
*O dragão cospe fogo no covil*

## 7. Exploração: mundo interligado, vilarejo, loja, carrinho, itens, documentos e mapa

> ⚠️ Tudo desta seção também é **temporário**: os itens aparecem como emojis e os objetos novos (moradores, carrinho, postes, bombas, paredes rachadas) são desenhados no código até a arte final chegar.

Depois do rapto, o jogo vira uma aventura de exploração: sete áreas ligadas por vários caminhos, um vilarejo com loja e ferraria, moedas, armaduras, dez itens (cada um com uma função), doze documentos de investigação que se juntam em oito conclusões, um carrinho de mina que liga três estações e um mapa que só acende onde a Line já passou.

### 7.1 Como as fases se ligam

```
                         [ Covil ]
                             │ portão de fogo (3 tochas)
                    [ Montanha de Brasa ]══ estação da Forja
                     │               │ paredes rachadas (bomba)
        Guardião ─── │               │
                [ Ruínas ]──atalho──[ Gruta dos Ecos + Minas ]══ estação das Minas
                     │  (cristal)     │
         espinhos ── │                │
                [ Floresta Sussurrante ]
                     │           │
               [ Fazendinha ]──[ Vilarejo do Riacho ]══ estação do Vilarejo
                        estrada leste (depois do rapto)
```

| De | Para | O que abre o caminho |
|---|---|---|
| Fazendinha | Floresta | livre |
| Fazendinha | Vilarejo | depois do rapto |
| Vilarejo | Floresta | livre |
| Floresta | Gruta | livre |
| Floresta | Ruínas | cortar os espinhos com a espada |
| Gruta (Minas) | Ruínas | acender o cristal da sala sudeste das ruínas; antes disso a barreira fecha a passagem |
| Gruta (Minas) | Montanha | explodir as duas paredes rachadas com bombas |
| Ruínas | Montanha | vencer o Guardião de Pedra |
| Montanha | Covil | acender as três tochas |
| Vilarejo · Minas · Forja | (carrinho) | encaixar a Alavanca de Ferro numa estação e descobrir as outras |

Toda saída tem caminho de volta (menos o covil), e os testes automatizados conferem isso em cada mudança (seção 15).

### 7.2 Moedas

- **De onde vêm:** inimigos derrotados soltam moedas (sombra 1 a 3, fogo-fátuo 2 a 3, morcego 1 a 2, Guardião 30); quase todos os baús têm moedas; e há montinhos brilhando pelo chão.
- As moedas soltas voam até a Line quando ela chega perto e somem depois de 25 segundos.
- **HUD:** o total fica embaixo dos corações e da magia.
- **Para que servem:** comprar na loja da Dona Rosa e na ferraria do Seu Bento.

### 7.3 Loja da Dona Rosa e ferraria do Seu Bento

Falando com a Dona Rosa ou com o Seu Bento, a conversa termina com a janela da loja. Cada produto mostra o preço, a descrição e quanto a Line já tem. Se faltar dinheiro, a loja diz quanto falta. **Esc** ou **Sair** fecha.

![A loja da Dona Rosa](imagens/38-loja-rosa.jpg)
*A loja da Dona Rosa*

| Loja | Produto | Preço | Observação |
|---|---|---|---|
| Loja da Dona Rosa | 🧪 Poção de Vida | 20 | — |
| Loja da Dona Rosa | 💧 Elixir de Luz | 25 | — |
| Loja da Dona Rosa | 💣 Bombas (3) | 30 | vem com 3 |
| Loja da Dona Rosa | 🪶 Pena de Fênix | 80 | máximo 1 |
| Loja da Dona Rosa | 👢 Botas de Andarilha | 60 | máximo 1 |
| Ferraria do Seu Bento | 🥋 Túnica Acolchoada | 40 | 1 escudo |
| Ferraria do Seu Bento | ⛓️ Cota de Malha | 90 | 2 escudos |
| Ferraria do Seu Bento | 🔥 Armadura de Brasa | 160 | 3 escudos · não queima na brasa · só com a receita do Mestre Aurélio |

**Armaduras e escudos 🛡:** cada escudo segura um golpe inteiro antes de chegar nos corações. Os escudos aparecem em azul ao lado dos corações e voltam sozinhos, um por vez (6 segundos cada), depois de 5 segundos sem apanhar. Beber de uma fonte enche todos. Só dá para comprar uma armadura melhor que a atual.

![A ferraria do Seu Bento com as três armaduras](imagens/39-ferraria.jpg)
*A ferraria do Seu Bento com as três armaduras*

![HUD: corações, escudos da armadura, magia, moedas e o item do atalho](imagens/48-hud-escudos.jpg)
*HUD: corações, escudos da armadura, magia, moedas e o item do atalho*

### 7.4 Moradores do vilarejo

| Morador | Quem é | O que conta |
|---|---|---|
| Dona Rosa 🧪 | mercadora | fica sabendo da Bell e oferece poções e bombas; depois lembra para que servem as bombas |
| Seu Bento ⚒️ | ferreiro | explica os escudos; ao ver a receita do Mestre Aurélio, reconhece a letra do mestre e passa a forjar a Armadura de Brasa |
| Seu Zé | o morador mais velho | a história do carrinho de mina e da alavanca levada para a Forja; depois comemora o carrinho andando |
| Dona Lurdes | mulher do caçador Tobias | aponta a cabana do caçador, na floresta, onde está o bilhete |
| Pedrinho | menino curioso | conta da pedra rachada da floresta; depois que ela explode, fica encantado |

As falas mudam conforme o progresso (itens, documentos e o carrinho), e o jogo guarda com quem a Line já conversou.

### 7.5 Mochila e itens (um item, uma função)

A mochila abre com **I** (ou o botão 🎒 no celular, que mostra quantos itens novos chegaram) e pausa o jogo. Tem três abas: **Itens**, **Pistas** e **Mapa**. Também dá para abrir pela pausa.

No topo da aba Itens fica o **equipamento**: moedas, armadura e o item que está no **atalho**. Itens usáveis podem ser equipados no atalho e usados a qualquer momento com **F** (ou o botão do item no celular). A **poção** tem o atalho próprio **H** (botão 🧪).

![A aba de itens: equipamento no topo, grade de itens e o detalhe do item escolhido](imagens/49-mochila-itens.jpg)
*A aba de itens: equipamento no topo, grade de itens e o detalhe do item escolhido*

| Item | Tipo | O que faz | Onde achar |
|---|---|---|---|
| 🧪 Poção de Vida | gasta ao usar · vai no atalho F | Cura 2 corações. Use pela mochila, pela cura rápida (H) ou deixe equipada (F). | loja da Dona Rosa (20); baús da floresta e da montanha |
| 💧 Elixir de Luz | gasta ao usar · vai no atalho F | Enche toda a magia de uma vez. | loja (25); baús da gruta, biblioteca, torre das ruínas e montanha |
| 💣 Bomba | gasta ao usar · vai no atalho F | Explode 2 segundos depois de colocada: quebra paredes e pedras rachadas e fere inimigos em volta. Afaste-se! Equipe e use com F. | loja (3 por 30); baús da floresta, vilarejo e Minas |
| 🪶 Pena de Fênix | gasta ao usar | Se a Line cair, a pena queima e ela se levanta com metade da vida. Funciona sozinha. | loja (80); do outro lado do abismo das Minas |
| 🗝️ Chave antiga | chave (some ao abrir) | Abre uma porta trancada e some. Há três portas trancadas pelo mundo. | baús da gruta, das ruínas e da montanha |
| 🏮 Lanterna | ferramenta (fica para sempre) | Clareia as galerias escuras das Minas de Cristal. Funciona sozinha. | salão de entrada das Minas |
| 🪝 Gancho | ferramenta (fica para sempre) | Perto de um poste de gancho, puxa a Line até o outro poste, por cima de rios e abismos. | sala leste das ruínas |
| 🧭 Bússola do Mago | ferramenta (fica para sempre) | Marca no mapa os baús que ainda não foram abertos, mesmo onde a Line ainda não passou. | salão norte da gruta |
| 👢 Botas de Andarilha | ferramenta (fica para sempre) | A Line corre mais rápido e não tropeça mais nas raízes. | loja da Dona Rosa (60) |
| ⚙️ Alavanca de Ferro | item da história | A alavanca do freio do carrinho de mina. Com ela encaixada, o carrinho volta a andar entre as estações. | Forja Antiga, na montanha |

**Menos vida espalhada:** não existem mais pães, maçãs nem flores de cura pelo mapa. A vida volta nas **fontes**, nas **poções** (compradas ou achadas) e em corações que caem dos inimigos só de vez em quando (e nunca com a vida cheia). A chance de cair coração baixou para 25% no Fácil, 10% no Normal e 4% no Difícil.

### 7.6 Documentos de investigação e conclusões

A aba **Pistas** virou um caderno de investigação. São **12 documentos**, cada um com **tipo** (anotação, cartaz, carta, diário, pergaminho, mapa, relatório, receita, objeto), **autor**, **data**, o lugar onde foi achado e o texto completo em parágrafos. Cada tipo tem cara de papel diferente no leitor (o relatório é datilografado, o diário tem lombada, o cartaz tem moldura). Alguns documentos **marcam um lugar no mapa** com um alfinete 📍, sem acender a área.

Quando dois documentos combinam, a Line tira uma **conclusão** (aparece um título “💡 Conclusão!” e ela fica anotada no caderno). Algumas conclusões mudam o jogo.

![O caderno de investigação com o relatório do capataz aberto](imagens/50-documento-relatorio.jpg)
*O caderno de investigação com o relatório do capataz aberto*

| # | Documento | Tipo | Autor | Onde | Marca no mapa |
|---|---|---|---|---|---|
| 1 | 🐾 Marcas de garra no píer | Anotação | Anotação da Line | Fazendinha, no píer do lago | — |
| 2 | 📌 Cartaz do vilarejo | Cartaz | Conselho do Vilarejo do Riacho | Vilarejo do Riacho, no quadro de avisos | 📍 Clareira do Mago |
| 3 | ✉️ Carta do Mago | Carta | O Mago | Floresta Sussurrante, baú na clareira do Mago | 📍 Gruta dos Ecos |
| 4 | 🪓 Bilhete do caçador | Anotação | Tobias, caçador da floresta | Floresta Sussurrante, na porta da cabana a leste | 📍 Topo da montanha |
| 5 | 📜 A lenda da Montanha | Pergaminho | Autor desconhecido | Gruta dos Ecos, pergaminho perto da fonte | — |
| 6 | 🗺️ Mapa rasgado | Mapa | Cartógrafo das minas | Gruta dos Ecos, sala trancada | 📍 X vermelho da Forja |
| 7 | 🛤️ Relatório do capataz | Relatório | Mestre Ivo, capataz das Minas de Cristal | Minas de Cristal, perto da estação | 📍 Alavanca de Ferro |
| 8 | 📖 Diário do Guardião, página 1 | Diário | O Guardião de Pedra | Ruínas Encantadas, no chão perto do altar | — |
| 9 | 📖 Diário do Guardião, página 2 | Diário | O Guardião de Pedra | Ruínas Encantadas, biblioteca trancada | — |
| 10 | 📋 Receita da Armadura de Brasa | Receita | Mestre Aurélio, ferreiro da forja | Montanha de Brasa, Forja Antiga | 📍 Ferraria do Seu Bento |
| 11 | 🔥 Escama vermelha | Objeto encontrado | Anotação da Line | Montanha de Brasa, caverna escondida | — |
| 12 | 🎀 Fita de cabelo da Bell | Objeto encontrado | Anotação da Line | Montanha de Brasa, perto do portão de fogo | — |

**Conclusões:**

| Conclusão | Junta | Efeito no jogo |
|---|---|---|
| 💡 A Bell está viva: o dragão a levou para o topo da Montanha de Brasa. | Marcas de garra no píer + Bilhete do caçador | — |
| 💡 O dragão teme a luz. A magia das Ruínas é a arma certa contra ele. | Carta do Mago + A lenda da Montanha | — |
| 💡 Os cristais são as chaves das barreiras, e o Guardião guarda a Chuva de Estrelas no peito. | Diário do Guardião, página 1 + Diário do Guardião, página 2 | — |
| 💡 A Alavanca de Ferro está na Forja Antiga. Encaixada numa estação, o carrinho volta a andar. | Relatório do capataz + Mapa rasgado | — |
| 💡 O Seu Bento, do vilarejo, sabe forjar a Armadura de Brasa: com ela, o chão em brasa não queima. | Receita da Armadura de Brasa + Cartaz do vilarejo | A Armadura de Brasa aparece na ferraria. |
| 💡 Quando o dragão cansa, o peito racha e fica exposto. | A lenda da Montanha + Escama vermelha | Golpes no peito do dragão tiram 1 de vida a mais. |
| 💡 A Chuva de Estrelas apaga o fogo do dragão por um instante. | Diário do Guardião, página 2 + Escama vermelha | A Chuva de Estrelas interrompe o fogo do dragão. |
| 💡 A Bell deixou a fita de propósito: ela está logo depois do portão de fogo. | Fita de cabelo da Bell + Mapa rasgado | — |

![As conclusões da Line, embaixo da lista de documentos](imagens/51-conclusoes.jpg)
*As conclusões da Line, embaixo da lista de documentos*

Ao juntar os 12 documentos: título **Caderno completo!**, coração extra e a fala “Agora eu sei tudo sobre esse dragão. Segura, Bell, que eu tô indo.”

**Textos completos dos documentos:**

> **🐾 Marcas de garra no píer** · *Anotação · Anotação da Line · Ontem, depois do pôr do sol*  
> Três riscos fundos na madeira do píer, e um rastro de brasa apagada apontando para o norte, na direção da floresta.  
>
> Não tem sangue em lugar nenhum. Ele levou a Bell, não machucou. Ela está viva.  
>
> Anotei a direção. Eu vou atrás.  
>
> *Encontrado em: Fazendinha, no píer do lago*

> **📌 Cartaz do vilarejo** · *Cartaz · Conselho do Vilarejo do Riacho · Pregado hoje de manhã*  
> PROCURA-SE quem viu um dragão vermelho voando baixo sobre o riacho ontem, ao pôr do sol.  
>
> Os mais velhos contam que isso já aconteceu há cem anos, e que só o velho Mago da Floresta Sussurrante sabe o que fazer. Ele mora na clareira a oeste da trilha.  
>
> A Dona Rosa vende poções e bombas para a viagem. O Seu Bento forja armaduras. Coragem, vizinhos!  
>
> *Encontrado em: Vilarejo do Riacho, no quadro de avisos*

> **✉️ Carta do Mago** · *Carta · O Mago · Sem data*  
> Para quem encontrar esta carta:  
>
> O dragão vermelho dorme há cem anos na Montanha de Brasa. Quando acorda, leva o que mais brilha aos olhos dele. Selou a montanha com magia antiga: só a luz das Ruínas Encantadas atravessa o selo.  
>
> Há também uma gruta a leste desta floresta, onde guardei coisas que podem ajudar.  
>
> — O Mago  
>
> *Encontrado em: Floresta Sussurrante, baú na clareira do Mago*

> **🪓 Bilhete do caçador** · *Anotação · Tobias, caçador da floresta · Ontem à noite*  
> Vi de novo o clarão vermelho. Ao pôr do sol ele passou por cima da cabana carregando alguém: uma moça de óculos, gritando um nome. Foi direto para o topo da Montanha de Brasa.  
>
> Fui avisar no vilarejo.  
>
> Se alguém ler isto: o caminho mais curto até a montanha passa pelas Ruínas. As Minas, a leste, também chegam lá, para quem tiver luz e coragem.  
>
> *Encontrado em: Floresta Sussurrante, na porta da cabana a leste*

> **📜 A lenda da Montanha** · *Pergaminho · Autor desconhecido · Há cem anos*  
> A cada cem anos o dragão desperta com fome de luz. Leva para o covil a pessoa de coração mais brilhante e a guarda numa jaula de ferro.  
>
> Dizem que o dragão não teme a espada: teme a luz, que o cansa. E quando cansa, o peito dele se abre.  
>
> *Encontrado em: Gruta dos Ecos, pergaminho perto da fonte*

> **🗺️ Mapa rasgado** · *Mapa · Cartógrafo das minas · Há cem anos*  
> Um pedaço de mapa antigo. Mostra a Montanha de Brasa: um portão de fogo guardado por três tochas e, depois dele, o covil no topo.  
>
> Na encosta leste, uma porta de ferro esconde uma caverna. E há um X vermelho numa sala chamada Forja Antiga.  
>
> *Encontrado em: Gruta dos Ecos, sala trancada*

> **🛤️ Relatório do capataz** · *Relatório · Mestre Ivo, capataz das Minas de Cristal · Há cem anos*  
> RELATÓRIO FINAL.  
>
> A linha do carrinho liga três estações: Vilarejo, Minas e Forja.  
>
> Depois que o dragão acordou, fechamos a mina. Levei a Alavanca de Ferro do freio para a Forja Antiga, na montanha, para ninguém se arriscar nos trilhos.  
>
> Quem a trouxer de volta pode viajar de novo: basta encaixar a alavanca numa estação.  
>
> *Encontrado em: Minas de Cristal, perto da estação*

> **📖 Diário do Guardião, página 1** · *Diário · O Guardião de Pedra · Há mil anos*  
> Fui feito de pedra para guardar a luz.  
>
> Os cristais do templo são minhas chaves: acesos, as barreiras caem.  
>
> Se alguém chegar aqui com um coração corajoso, que a luz do altar o escolha.  
>
> *Encontrado em: Ruínas Encantadas, no chão perto do altar*

> **📖 Diário do Guardião, página 2** · *Diário · O Guardião de Pedra · Há mil anos*  
> O dragão tem medo da Chuva de Estrelas. Quando as estrelas caem em volta dele, o fogo dele apaga por um instante.  
>
> Guardo essa magia no meu peito. Só a entrego para quem me vencer sem ódio.  
>
> *Encontrado em: Ruínas Encantadas, biblioteca trancada*

> **📋 Receita da Armadura de Brasa** · *Receita · Mestre Aurélio, ferreiro da forja · Há cem anos*  
> Receita da Armadura de Brasa: cota de malha temperada no calor da montanha, com placas de cobre por cima.  
>
> Resiste à brasa rasa: quem a veste atravessa o chão em brasa sem se queimar.  
>
> Meu aprendiz, o jovem Bento, sabe fazer. Se ainda estiver vivo, mostrem esta receita a ele no vilarejo.  
>
> *Encontrado em: Montanha de Brasa, Forja Antiga*

> **🔥 Escama vermelha** · *Objeto encontrado · Anotação da Line · Hoje*  
> Uma escama do tamanho da minha mão, ainda morna.  
>
> Está rachada no meio. O peito dele é o lugar mais fraco, exatamente como a lenda diz.  
>
> E ele perde escamas quando voa alto: então ele se cansa quando mergulha.  
>
> *Encontrado em: Montanha de Brasa, caverna escondida*

> **🎀 Fita de cabelo da Bell** · *Objeto encontrado · Anotação da Line · Hoje*  
> A fita azul que a Bell usava hoje de manhã.  
>
> Ela deixou cair de propósito, eu sei: é o jeito dela de dizer “tô aqui, vem me buscar”.  
>
> Falta pouco, amor.  
>
> *Encontrado em: Montanha de Brasa, perto do portão de fogo*

### 7.7 Carrinho de mina

Três estações ligadas por trilhos: **Vilarejo**, **Minas** (na gruta) e **Forja** (na montanha). O carrinho começa quebrado: falta a **Alavanca de Ferro** do freio, que o capataz levou para a Forja Antiga quando o dragão acordou.

1. Chegar perto de uma estação a marca como **descoberta** (aviso “🛤️ Estação descoberta”).
2. Sem a alavanca, o botão diz **Ver o carrinho** e a Line comenta o que falta (e, se já leu o relatório do capataz, lembra onde a alavanca está).
3. Com a alavanca, o botão diz **Encaixar a alavanca**: a Line encaixa, aparece “Carrinho consertado!” e a alavanca sai da mochila.
4. Daí em diante, **Viajar de carrinho** abre a escolha do destino. Só aparecem as estações já descobertas; as outras ficam com cadeado.
5. A viagem é uma cena: a Line entra no carrinho, ele desce os trilhos e sai da tela, e chega na outra estação do mesmo jeito.

![A estação do vilarejo com a alavanca encaixada](imagens/40-estacao.jpg)
*A estação do vilarejo com a alavanca encaixada*

![Escolha do destino](imagens/41-carrinho-destinos.jpg)
*Escolha do destino*

![A Line andando de carrinho](imagens/42-carrinho-andando.jpg)
*A Line andando de carrinho*

### 7.8 Bombas, gancho, chão em brasa e galerias escuras

- **Paredes e pedras rachadas 🪨:** têm rachaduras desenhadas. Uma **bomba** (atalho **F**) explode 2 segundos depois de colocada, quebra as rachaduras num raio de 2 tiles, fere inimigos em volta (o Guardião só quando está tonto) e machuca a Line se ela ficar perto. Cabem 2 bombas acesas ao mesmo tempo. O que explodiu fica salvo. Há uma pedra rachada na floresta e duas paredes nas Minas.
- **Postes do gancho 🪝:** vêm em pares, um de cada lado da água ou do abismo. Com o **gancho** na mochila, perto de um poste aparece **Usar o gancho** e a Line é puxada pela corda até depois do outro poste. Dá para ir e voltar. Pares: lago da floresta, fosso das ruínas e abismo das Minas.
- **Chão em brasa 🔥:** queima meio coração a cada meio segundo, sem defesa. Só a **Armadura de Brasa** protege.
- **Galerias escuras:** nas Minas, a tela escurece em volta da Line. Sem a lanterna ela enxerga um círculo pequeno e o mapa abre bem devagar; com a lanterna, a luz fica quente e bem maior.

![Bomba acesa perto da pedra rachada da floresta](imagens/46-bomba.jpg)
*Bomba acesa perto da pedra rachada da floresta*

### 7.9 Mapa: só acende onde a Line passou

A aba **Mapa** (tecla **M**) tem duas visões:

- **Área:** o lugar atual em miniatura. **Só aparece o que a Line já viu**: a névoa abre num raio de 7 tiles enquanto ela anda (3 no escuro sem lanterna), e o que foi explorado fica salvo. Ícones: baús, fontes, cristais e tochas, portas trancadas, documentos, paredes rachadas, postes do gancho, estações, lojas, placas, moradores, saídas e a Line (bolinha rosa). Com a **Bússola do Mago**, os baús fechados aparecem mesmo na névoa. Os documentos põem **alfinetes 📍** nos lugares que citam, mesmo em áreas ainda apagadas, **sem acender a área**.
- **Mundo:** um pergaminho com os lugares ligados por trilhas. **Só acendem os lugares visitados** (e a fazenda); os vizinhos aparecem como “Lugar desconhecido”. Depois que o carrinho é consertado, a linha dos trilhos aparece ligando as três estações. Embaixo de cada lugar: porcentagem explorada, baús abertos e documentos achados.

![Mapa do mundo: só os lugares visitados acendem](imagens/52-mapa-mundo.jpg)
*Mapa do mundo: só os lugares visitados acendem*

### 7.10 Todos os baús

| Área | Onde | O que tem |
|---|---|---|
| Fazendinha | atrás do chiqueiro (aparece depois do rapto) | 🪙 20 moedas |
| Vilarejo do Riacho | canto sudeste do vilarejo, perto do riacho | 💣 Bomba ×2 + 🪙 30 moedas |
| Floresta Sussurrante | clareira do Mago | ⚔️ a espada |
| Floresta Sussurrante | clareira do Mago, mais ao sul | ✉️ Carta do Mago + 🪙 10 moedas |
| Floresta Sussurrante | meio da trilha leste | 🪙 25 moedas |
| Floresta Sussurrante | ilha no lago da clareira leste (só com o **gancho**) | 🧪 Poção de Vida + 🪙 30 moedas |
| Floresta Sussurrante | canto sudeste, atrás da **pedra rachada** (precisa de **bomba**) | 💣 Bomba ×2 + 🪙 45 moedas |
| Gruta dos Ecos | salão norte | 🧭 Bússola do Mago |
| Gruta dos Ecos | canto oeste | 💧 Elixir de Luz |
| Gruta dos Ecos | nicho leste | 🗝️ Chave antiga |
| Gruta dos Ecos | sala trancada do sul (precisa de **chave**) | ❤️ coração extra |
| Gruta dos Ecos | salão de entrada das Minas | 🏮 Lanterna |
| Gruta dos Ecos | galeria escura das Minas (precisa de **lanterna** para achar) | 💣 Bomba ×3 |
| Gruta dos Ecos | do outro lado do abismo das Minas (só com o **gancho**) | 🪶 Pena de Fênix + 🪙 40 moedas |
| Ruínas Encantadas | alcova do salão do meio (abre com um cristal) | ❤️ coração extra |
| Ruínas Encantadas | ala leste da entrada | 🗝️ Chave antiga + 🪙 20 moedas |
| Ruínas Encantadas | biblioteca trancada (precisa de **chave**) | 💧 Elixir de Luz + 📖 Diário do Guardião, página 2 |
| Ruínas Encantadas | sala leste nova | 🪝 Gancho |
| Ruínas Encantadas | torre nordeste, do outro lado do fosso (só com o **gancho**) | 💧 Elixir de Luz + 🪙 60 moedas |
| Montanha de Brasa | plataforma cercada de fendas, no topo | ❤️ coração extra |
| Montanha de Brasa | encosta leste | 🗝️ Chave antiga + 🪙 20 moedas |
| Montanha de Brasa | caverna escondida (precisa de **chave**) | 🧪 Poção de Vida + 🪙 30 moedas |
| Montanha de Brasa | Forja Antiga (sala do X vermelho do mapa) | ⚙️ Alavanca de Ferro |
| Montanha de Brasa | depois do chão em brasa (só com a **Armadura de Brasa**) | 💧 Elixir de Luz + 🪙 90 moedas |

São **24 baús** (3 com coração extra), **3 portas trancadas** e **3 chaves** (qualquer chave abre qualquer porta e some depois de usada).

### 7.11 Tochas e cristais: como achar

- **Tochas apagadas** têm brasa fraca, soltam fumaça e têm um anel laranja pulsando no chão.
- Ao chegar na montanha pela primeira vez, a câmera mostra as **três tochas**.
- Cada luz acesa mostra a contagem: **🔥 Tocha acesa (1/3)**, **💎 Cristal aceso (1/2)**. O painel **Objetivo** mostra **(n/3 acesas)**.
- No mapa, as tochas da montanha aparecem mesmo onde a Line ainda não passou, e as apagadas piscam.

| Grupo | Onde | Luzes | Abre |
|---|---|---|---|
| Barreira sul | Ruínas, salão de entrada | 2 cristais | o salão do meio |
| Barreira do meio | Ruínas, salão do meio (2 nas ilhotas dos lagos) | 3 cristais | o salão norte (Guardião) |
| Alcova | Ruínas, salão do meio (leste) | 1 cristal | o baú de coração extra |
| Atalho das Minas | Ruínas, sala sudeste | 1 cristal | o corredor para as Minas |
| Portão de fogo | Montanha: entrada, ilha de lava e topo | 3 tochas | o caminho para o covil |

### 7.12 Arte necessária para a exploração

| Objeto | Como está hoje | Arte final sugerida |
|---|---|---|
| Itens da mochila (10) | emojis + bolinha colorida no chão | ícone 64×64 de cada item e versão pequena no chão |
| Moedas | moedinhas amarelas desenhadas no código | moeda dourada com brilho girando (4 a 6 quadros) |
| Moradores (5) | bonecos simples desenhados no código | sprites parados e andando (frente/lado/costas) no estilo da Line e da Bell; retratos para os diálogos |
| Casas do vilarejo, loja e ferraria | casa genérica com letreiro | casas de telhado colorido; loja com toldo e prateleira; ferraria com fornalha |
| Barraca de feira, bigorna | desenho simples | barraca com toldo listrado e frutas; bigorna com brasa animada |
| Carrinho de mina e estação | caixa com rodas, placa e alavanca | carrinho de madeira com ferragens; estação com plataforma; animação do carrinho andando e da Line dentro |
| Trilhos | tiles desenhados no código | tiles de trilho retos e curvos |
| Parede e pedra rachada | rachaduras desenhadas | versão de caverna (gruta, ruínas, montanha) e de floresta; animação de desmoronar |
| Bomba | bolinha preta com pavio | bomba redonda com pavio aceso piscando e explosão (6 a 8 quadros) |
| Poste do gancho e corda | poste de madeira com argola | poste com argola de ferro; corda e gancho; Line pendurada atravessando (`LINE_GRAPPLE`, sugestão nova) |
| Chão em brasa | tiles com brasa pulsando | tiles de brasa rasa com brilho animado |
| Morcego | desenhado no código | morcego dormindo pendurado, voando e dando rasante |
| Escuro e lanterna | gradiente em volta da Line | a própria Line segurando a lanterna (`LINE_LANTERN_WALK`, sugestão nova) |
| Escudos da armadura | escudos azuis no HUD | ícone de escudo cheio e vazio |
| Armaduras na Line | não aparecem no sprite | variações de roupa da Line para túnica, malha e brasa (opcional) |
| Documentos no chão | papel com linhas | um ícone por tipo: bilhete, pergaminho, mapa, relatório, receita, objeto |

## 8. Como se joga

### 8.1 Controles

| Ação | Teclado | Controle | Celular |
|---|---|---|---|
| Andar | WASD / setas | analógico | arrastar no lado esquerdo |
| Correr | Shift (segurar) | gatilho / analógico até o fim | arrastar até o fim |
| Atacar (3x = combo) | J / Z | A | ⚔ |
| Ataque giratório | K / X | X | 🌀 |
| Esquivar (correndo = dash) | L / C | B | 💨 |
| Defender (segurar) | V / B | LB | 🛡 |
| Pular (+ atacar no ar) | Espaço | Y | ⤴ |
| Magia: Raio de Luz | Q / U | RB | ✨ |
| Chuva de Estrelas | segurar Q / U e soltar | segurar RB | segurar ✨ |
| Interagir / ler / abrir | E / Enter | Select | botão que aparece |
| Mochila (itens e documentos) | I | — | 🎒 |
| Mapa | M | — | 🎒 → Mapa |
| Usar poção | H | — | 🧪 |
| Usar o item do atalho (bomba, elixir…) | F | — | botão do item (💣) |
| Pausar | Esc / P | Start | ⏸ |
| Pular cena | Tab | — | Pular cena |

### 8.2 Combate com espada

| Golpe | Animação | Dano | Observação |
|---|---|---|---|
| 1º golpe | `LINE_ATTACK_HORIZONTAL` | 1 | começa o combo |
| 2º golpe | `LINE_ATTACK_VERTICAL` | 1 | apertar de novo durante o 1º |
| 3º golpe | `LINE_ATTACK_COMBO` | 1 + 1 | acerta duas vezes |
| Ataque correndo | `LINE_ATTACK_DIAGONAL` | 2 | com investida para frente |
| Giro | `LINE_ATTACK_SPIN` | 2 | acerta em volta |
| Ataque aéreo | `LINE_ATTACK_AIR` | 2 | pular + atacar, com onda de choque ao cair |
| Golpe final | `LINE_DRAGON_FINAL_ATTACK` | — | só no fim da luta com o dragão |

- **Defesa:** segurar bloqueia golpes físicos (não bloqueia fogo). Leva a `LINE_BLOCK`.
- **Esquiva e dash:** a Line fica invencível por um instante (`LINE_DODGE` e `LINE_DASH`).
- **Guardar a espada:** depois de 4 segundos sem inimigos por perto, ela guarda a espada sozinha (`LINE_SWORD_SHEATHE`).

### 8.3 Magia

- **Raio de Luz** (aprendido no altar das ruínas):
  - Custa 1 ◆.
  - A mira vai sozinha no inimigo ou cristal mais perto à frente. O Guardião é mira certa.
  - As sombras levam dano extra.
  - Acende cristais e tochas e queima espinhos.
- **Chuva de Estrelas** (depois de vencer o Guardião):
  - Segurar o botão até a Line brilhar e soltar. Custa 3 ◆.
  - Explosão em volta que atinge todos os inimigos e acende cristais e tochas próximos.
- **Barra de magia:** 6 ◆ embaixo dos corações.
  - Recarrega sozinha, cerca de 1 ◆ a cada 2,6 s no Normal.
  - Os cristais azuis que os inimigos soltam dão +2 ◆.

![Raio de Luz acendendo um cristal](imagens/14-raio-de-luz.jpg)
*Raio de Luz acendendo um cristal*

![Carregando a Chuva de Estrelas](imagens/18-carregando-estrelas.jpg)
*Carregando a Chuva de Estrelas*

### 8.4 Vida, itens e progresso

- **Corações:**
  - Começam em 3 (6 metades), e cada baú de coração extra dá mais 1.
  - No Fácil, a Line ganha 1 coração a mais.
  - Com 1 coração ou menos, ela fica com a animação de exausta.
- **Coração no chão:** cura 1 coração. Cai dos inimigos só de vez em quando (e nunca com a vida cheia).
- **Escudos (armadura):** cada escudo segura um golpe antes dos corações e volta sozinho depois de um tempo sem apanhar (seção 7.3).
- **Moedas:** caem dos inimigos e saem dos baús; servem na loja e na ferraria (seção 7.2).
- **Pena de Fênix:** se estiver na mochila quando a Line cair, ela queima e a Line levanta com metade da vida.
- **Cristal azul:** +2 ◆ de magia. Também cai dos inimigos.
- **Fontes:** curam tudo, enchem a magia e viram ponto de retorno. Se a Line cair, ela volta para a última fonte bebida naquela área.
- **Água e fendas:** cair tira meio coração e devolve a Line para o último lugar seguro.
- **Portas trancadas:** três portas de ferro (gruta, ruínas e montanha). Chegue perto: com uma chave antiga aparece **Abrir com a chave**; sem chave, **Trancada**.
- **Salvamento automático:** ao entrar em cada área, ao abrir baús, pegar itens e documentos, comprar, abrir portas, explodir paredes, acender cristais, descobrir estações e beber das fontes, e ao abrir a mochila. O botão **Continuar** retoma dali, com a mochila, as moedas, a armadura, os documentos e o mapa explorado. Saves de versões antigas são convertidos sozinhos (pães e maçãs viram moedas, a Flor da Lua vira poção, e as áreas que cresceram recomeçam do zero).

### 8.5 Dificuldade

| | Fácil 🌸 | Normal ⚔ | Difícil 🔥 |
|---|---|---|---|
| Vida dos chefes | 60% | 100% | 135% |
| Velocidade dos ataques | mais lentos (1,35×) | normal | mais rápidos (0,85×) |
| Corações extras | +1 | — | — |
| Chance de cair coração (só com a vida incompleta) | 25% | 10% | 4% |
| Recarga da magia | 1,7× | 1× | 0,75× |
| Guarda aberta do Guardião | +30% | normal | −20% |
| Espada no Guardião com a guarda fechada | arranha um pouco | não | não |

A dificuldade fica salva no navegador e pode ser trocada a qualquer momento, também pela pausa.

## 9. Inimigos e chefes

**Inteligência dos inimigos (nova):** todos enxergam de verdade, com linha de visão, e não veem a Line através de paredes, árvores e casas. Quando perdem a Line de vista, procuram um caminho pela grade do mapa e contornam os obstáculos. Quem vê a Line primeiro **avisa os vizinhos**, e eles não se amontoam uns em cima dos outros. Ninguém entra no chão em brasa.

### Sombra
- **Vida:** 3.
- **Comportamento:** vaga até ver a Line. Então persegue pelo caminho mais curto, tenta **chegar pelo lado** quando há outra sombra atacando de frente, se prepara e dá uma investida. Com 1 de vida, **foge** e volta depois. Se a Line some por muito tempo, volta para o seu canto.
- **Defesa:** bloquear a investida deixa a sombra tonta.
- **Fraqueza:** leva dano extra da luz.
- **Onde aparece:** na floresta (depois da espada), nas ruínas (depois da magia) e na montanha.

### Fogo-fátuo
- **Vida:** 2.
- **Comportamento:** flutua, mantém distância, se prepara brilhando e atira um orbe lento, que dá para pular ou bloquear.
- **Onde aparece:** nas ruínas e na gruta (azul) e na montanha (de fogo).
- **Novo:** só atira quando enxerga a Line; se ela se esconde atrás de uma parede, ele contorna até achar um ângulo.

### Morcego (novo)
- **Vida:** 1.
- **Comportamento:** dorme pendurado nas galerias escuras das Minas. Acorda quando a Line chega perto (de mais longe se ela estiver com a lanterna), voa em círculos em volta dela e dá **rasantes**. Se ela se afasta, volta a dormir no mesmo lugar.
- **Onde aparece:** nas Minas de Cristal, depois da espada.

### Guardião de Pedra (chefe das ruínas)
- **Vida:** 14 no Normal.
- **Guarda:** a espada não fere a pedra. O Raio de Luz racha o cristal do peito e deixa o Guardião **tonto por 4,5 s**. Só então a espada funciona.
- **Ataques:**
  - **Pisão:** levanta os braços, com um círculo vermelho de aviso, e solta uma onda no chão. Precisa pular.
  - **Arremesso de pedra:** uma por vez. Dá para desviar ou bloquear.
- **Ajuda:** ao sair do atordoamento, ele solta um cristal de magia (e um coração, se a Line estiver com metade da vida ou menos). Vencido, dá 30 moedas.

![Guardião de Pedra durante a luta](imagens/17-guardiao-tonto.jpg)
*Guardião de Pedra durante a luta*

### Dragão Vermelho (chefe final)
- **Vida:** 70 no Normal.
- **Ataques:**
  - **Garra:** círculo vermelho no chão antes do golpe.
  - **Cauda:** anel laranja que precisa ser pulado.
  - **Fogo em cone:** não dá para bloquear.
  - **Voo e mergulho:** a sombra dele segue a Line.
  - **Poeira.**
  - **Fogo em círculo desesperado:** quando está com pouca vida.
- **Ponto fraco:** depois de levar dano suficiente, ele fica atordoado e o peito brilha em azul. É o ponto fraco. Com a conclusão **do peito** (lenda + escama), cada golpe ali tira 1 a mais.
- **Fogo:** com a conclusão **das estrelas** (diário pág. 2 + escama), a Chuva de Estrelas apaga o fogo dele no meio do sopro.
- **Fim da luta:** aparece o botão **GOLPE FINAL**.

## 10. Lista completa de animações

> ⚠️ **Lembrete: toda a arte atual é temporária** e vai ser trocada pela versão final, mantendo o mesmo código.

Esta é a lista de **todas** as animações que o jogo usa ou vai usar. O código é o nome exato que a arte precisa ter para entrar sozinha no jogo. Animações de lado podem vir só viradas para a **direita**: o jogo espelha para a esquerda.

**Legenda do status:**
- ✅ **Tem arte (temporária):** já aparece no jogo, mas ainda será trocada pela final.
- 🔁 **Substituta:** ainda não tem arte própria. O jogo usa outra animação parecida no lugar (indicada na tabela).
- ✏️ **Desenho no código:** ainda não tem arte. O jogo desenha uma forma provisória ou usa uma imagem parada.

**Resumo:** 267 animações. ✅ 160 com arte temporária, 🔁 47 com substituta e ✏️ 60 desenhadas no código.

| Grupo | Total | ✅ | 🔁 | ✏️ |
|---|---:|---:|---:|---:|
| Primeiro encontro (prólogo) | 8 | 1 | 7 | 0 |
| Line — movimento | 31 | 29 | 2 | 0 |
| Line — combate | 27 | 19 | 8 | 0 |
| Line — emoções | 10 | 10 | 0 | 0 |
| Bell | 34 | 16 | 18 | 0 |
| Line e Bell juntas | 26 | 12 | 0 | 14 |
| Dragão | 27 | 18 | 9 | 0 |
| Magia e criaturas (novo) | 13 | 0 | 3 | 10 |
| Inimigos (novo) | 5 | 0 | 0 | 5 |
| Efeitos | 13 | 0 | 0 | 13 |
| Bichos da fazenda | 67 | 55 | 0 | 12 |
| Personagens de apoio (novo) | 6 | 0 | 0 | 6 |

### 10.1 Primeiro encontro (prólogo)

| Código | O que é | Quadros | Loop | Status | Origem da arte atual |
|---|---|---:|:---:|---|---|
| `LINE_ADMIRE` | Line vê a Bell de longe (“puxa ela é tão linda”) *(sugestão nova)* | 20 |  | 🔁 usa `LINE_HAPPY` |  |
| `BELL_WAIT` | Bell esperando a Line no shopping *(sugestão nova)* | 16 | sim | 🔁 usa `BELL_IDLE_RIGHT` |  |
| `LINE_BELL_MEET` | Frente a frente, sorrindo (conversa no shopping) *(sugestão nova)* | 16 | sim | 🔁 usa `LINE_BELL_HOLD_HANDS` |  |
| `LINE_BELL_GREET_HUG` | Abraço de chegada (“Você tá atrasada”) *(sugestão nova)* | 24 | sim | 🔁 usa `LINE_BELL_RESCUE_HUG` |  |
| `LINE_BELL_BK` | Comendo BK juntas no shopping *(sugestão nova)* | 24 | sim | 🔁 usa `LINE_BELL_EAT` |  |
| `LINE_PUNCH_MACHINE` | Soco na máquina (primeiro encontro) | 16 |  | ✅ temporária | Laboratório v7 |
| `BELL_LAUGH_AT_LINE` | Bell gargalhando do soco da Line *(sugestão nova)* | 16 | sim | 🔁 usa `BELL_LAUGH` |  |
| `LINE_BELL_TUNNEL_KISS` | O primeiro beijo, no túnel *(sugestão nova)* | 8 |  | 🔁 usa `LINE_BELL_KISS` |  |

### 10.2 Line — movimento

| Código | O que é | Quadros | Loop | Status | Origem da arte atual |
|---|---|---:|:---:|---|---|
| `LINE_IDLE_FRONT` | Parada | 7 | sim | ✅ temporária | LINE_BELL_ITEM_01 |
| `LINE_IDLE_BACK` | Parada | 2 | sim | ✅ temporária | LINE_BELL_ITEM_04 |
| `LINE_IDLE_LEFT` | Parada | 3 | sim | ✅ temporária | LINE_BELL_ITEM_03 |
| `LINE_IDLE_RIGHT` | Parada | 8 | sim | ✅ temporária | LINE_BELL_ITEM_04 |
| `LINE_LOOK_SIDES_FRONT` | Olhar para os lados | 7 |  | ✅ temporária | LINE_BELL_ITEM_02 |
| `LINE_BLINK_FRONT` | Piscar | 5 |  | ✅ temporária | LINE_BELL_ITEM_03 |
| `LINE_WALK_FRONT` | Andar | 4 | sim | ✅ temporária | LINE_BELL_ITEM_07 |
| `LINE_WALK_BACK` | Andar | 4 | sim | ✅ temporária | LINE_BELL_ITEM_07 |
| `LINE_WALK_LEFT` | Andar | 14 | sim | ✅ temporária | LINE_BELL_ITEM_06 |
| `LINE_WALK_RIGHT` | Andar | 8 | sim | ✅ temporária | LINE_BELL_ITEM_05 |
| `LINE_RUN_FRONT` | Correr | 8 | sim | ✅ temporária | LINE_BELL_ITEM_11 |
| `LINE_RUN_BACK` | Correr | 4 | sim | ✅ temporária | LINE_BELL_ITEM_11 |
| `LINE_RUN_LEFT` | Correr | 14 | sim | ✅ temporária | LINE_BELL_ITEM_10 |
| `LINE_RUN_RIGHT` | Correr | 8 | sim | ✅ temporária | LINE_BELL_ITEM_09 |
| `LINE_RUN_START_FRONT` | Começar a correr | 7 |  | ✅ temporária | LINE_BELL_ITEM_13 |
| `LINE_RUN_START_BACK` | Começar a correr | 7 |  | ✅ temporária | LINE_BELL_ITEM_13 |
| `LINE_RUN_START_LEFT` | Começar a correr | 7 |  | ✅ temporária | LINE_BELL_ITEM_13 |
| `LINE_RUN_START_RIGHT` | Começar a correr | 5 |  | ✅ temporária | LINE_BELL_ITEM_08 |
| `LINE_RUN_STOP_FRONT` | Parar de correr | 7 |  | ✅ temporária | LINE_BELL_ITEM_13 |
| `LINE_RUN_STOP_BACK` | Parar de correr | 7 |  | ✅ temporária | LINE_BELL_ITEM_14 |
| `LINE_RUN_STOP_LEFT` | Parar de correr | 6 |  | ✅ temporária | LINE_BELL_ITEM_12 |
| `LINE_RUN_STOP_RIGHT` | Parar de correr | 4 |  | ✅ temporária | LINE_BELL_ITEM_12 |
| `LINE_JUMP_LEFT` | Pular | 12 |  | 🔁 usa `LINE_JUMP_RIGHT` |  |
| `LINE_JUMP_RIGHT` | Pular | 11 |  | ✅ temporária | LINE_BELL_ITEM_15 |
| `LINE_LAND_LEFT` | Aterrissar | 10 |  | 🔁 usa `LINE_LAND_RIGHT` |  |
| `LINE_LAND_RIGHT` | Aterrissar | 5 |  | ✅ temporária | LINE_BELL_ITEM_16 |
| `LINE_CROUCH` | Agachar | 3 |  | ✅ temporária | LINE_BELL_ITEM_17 |
| `LINE_CROUCH_STAND` | Levantar do agachamento | 3 |  | ✅ temporária | LINE_BELL_ITEM_18 |
| `LINE_STUMBLE` | Tropeçar | 4 |  | ✅ temporária | LINE_BELL_ITEM_19 |
| `LINE_FALL` | Cair | 4 |  | ✅ temporária | LINE_BELL_ITEM_20 |
| `LINE_GROUND_STAND` | Levantar do chão | 6 |  | ✅ temporária | LINE_BELL_ITEM_21 |

### 10.3 Line — combate

| Código | O que é | Quadros | Loop | Status | Origem da arte atual |
|---|---|---:|:---:|---|---|
| `LINE_SWORD_DRAW` | Sacar espada | 4 |  | ✅ temporária | LINE_BELL_ITEM_22 |
| `LINE_SWORD_SHEATHE` | Guardar espada | 6 |  | ✅ temporária | LINE_BELL_ITEM_23 |
| `LINE_COMBAT_IDLE` | Postura de combate | 3 | sim | ✅ temporária | LINE_BELL_ITEM_24 |
| `LINE_COMBAT_WALK_FRONT` | Andar com a espada em mãos *(sugestão nova)* | 12 | sim | 🔁 usa `LINE_WALK_FRONT` |  |
| `LINE_COMBAT_WALK_BACK` | Andar com a espada em mãos *(sugestão nova)* | 12 | sim | 🔁 usa `LINE_WALK_BACK` |  |
| `LINE_COMBAT_WALK_LEFT` | Andar com a espada em mãos *(sugestão nova)* | 12 | sim | 🔁 usa `LINE_WALK_LEFT` |  |
| `LINE_COMBAT_WALK_RIGHT` | Andar com a espada em mãos *(sugestão nova)* | 12 | sim | 🔁 usa `LINE_WALK_RIGHT` |  |
| `LINE_COMBAT_RUN_FRONT` | Correr com a espada em mãos *(sugestão nova)* | 12 | sim | 🔁 usa `LINE_RUN_FRONT` |  |
| `LINE_COMBAT_RUN_BACK` | Correr com a espada em mãos *(sugestão nova)* | 12 | sim | 🔁 usa `LINE_RUN_BACK` |  |
| `LINE_COMBAT_RUN_LEFT` | Correr com a espada em mãos *(sugestão nova)* | 12 | sim | 🔁 usa `LINE_RUN_LEFT` |  |
| `LINE_COMBAT_RUN_RIGHT` | Correr com a espada em mãos *(sugestão nova)* | 12 | sim | 🔁 usa `LINE_RUN_RIGHT` |  |
| `LINE_ATTACK_HORIZONTAL` | Ataque horizontal | 4 |  | ✅ temporária | LINE_BELL_ITEM_25 |
| `LINE_ATTACK_VERTICAL` | Ataque vertical | 8 |  | ✅ temporária | LINE_BELL_ITEM_26 |
| `LINE_ATTACK_DIAGONAL` | Ataque diagonal | 9 |  | ✅ temporária | LINE_BELL_ITEM_27 |
| `LINE_ATTACK_COMBO` | Combo | 15 |  | ✅ temporária | LINE_BELL_ITEM_28 |
| `LINE_ATTACK_SPIN` | Ataque giratório | 8 |  | ✅ temporária | LINE_BELL_ITEM_29 |
| `LINE_ATTACK_AIR` | Ataque aéreo | 10 |  | ✅ temporária | LINE_BELL_ITEM_30 |
| `LINE_BLOCK` | Bloquear | 6 |  | ✅ temporária | LINE_BELL_ITEM_31 |
| `LINE_DODGE` | Esquivar | 6 |  | ✅ temporária | LINE_BELL_ITEM_32 |
| `LINE_DASH` | Dash | 5 |  | ✅ temporária | LINE_BELL_ITEM_33 |
| `LINE_HIT_LIGHT` | Receber dano leve | 5 |  | ✅ temporária | LINE_BELL_ITEM_34 |
| `LINE_HIT_HEAVY` | Receber golpe forte | 4 |  | ✅ temporária | LINE_BELL_ITEM_35 |
| `LINE_THROWN` | Ser arremessada | 4 |  | ✅ temporária | LINE_BELL_ITEM_36 |
| `LINE_KNOCKDOWN` | Cair após golpe | 6 |  | ✅ temporária | LINE_BELL_ITEM_37 |
| `LINE_INJURED_STAND` | Levantar machucada | 6 |  | ✅ temporária | LINE_BELL_ITEM_38 |
| `LINE_EXHAUSTED_IDLE` | Exausta | 6 | sim | ✅ temporária | LINE_BELL_ITEM_39 |
| `LINE_DRAGON_FINAL_ATTACK` | Ataque final contra o dragão | 7 |  | ✅ temporária | LINE_BELL_ITEM_40 |

### 10.4 Line — emoções

| Código | O que é | Quadros | Loop | Status | Origem da arte atual |
|---|---|---:|:---:|---|---|
| `LINE_HAPPY` | Feliz | 6 |  | ✅ temporária | LINE_BELL_ITEM_41 |
| `LINE_LAUGH` | Rindo | 6 |  | ✅ temporária | LINE_BELL_ITEM_42 |
| `LINE_DETERMINED` | Determinada | 6 | sim | ✅ temporária | LINE_BELL_ITEM_43 |
| `LINE_ANGRY` | Brava | 6 | sim | ✅ temporária | LINE_BELL_ITEM_44 |
| `LINE_SCARED` | Assustada | 4 | sim | ✅ temporária | LINE_BELL_ITEM_45 |
| `LINE_SAD` | Triste | 4 | sim | ✅ temporária | LINE_BELL_ITEM_46 |
| `LINE_CRY` | Chorando | 6 | sim | ✅ temporária | LINE_BELL_ITEM_47 |
| `LINE_CALL_BELL` | Gritando por Bell | 6 |  | ✅ temporária | LINE_BELL_ITEM_48 |
| `LINE_RELIEVED` | Aliviada | 5 |  | ✅ temporária | LINE_BELL_ITEM_49 |
| `LINE_VICTORY` | Comemorando a vitória *(sugestão nova)* | 1 |  | ✅ temporária | arte/linebell/LINE_VICTORY |

### 10.5 Bell

| Código | O que é | Quadros | Loop | Status | Origem da arte atual |
|---|---|---:|:---:|---|---|
| `BELL_IDLE_FRONT` | Parada | 1 | sim | ✅ temporária | Laboratório v7 |
| `BELL_IDLE_BACK` | Parada | 1 | sim | ✅ temporária | Laboratório v7 |
| `BELL_IDLE_LEFT` | Parada | 1 | sim | ✅ temporária | Laboratório v7 |
| `BELL_IDLE_RIGHT` | Parada | 1 | sim | ✅ temporária | Laboratório v7 |
| `BELL_BLINK_FRONT` | Piscar | 12 |  | 🔁 usa `BELL_IDLE_FRONT` |  |
| `BELL_LOOK_SIDES_FRONT` | Olhar para os lados | 24 |  | 🔁 usa `BELL_IDLE_FRONT` |  |
| `BELL_WALK_FRONT` | Andar | 8 | sim | ✅ temporária | Laboratório v7 |
| `BELL_WALK_BACK` | Andar | 8 | sim | ✅ temporária | Laboratório v7 |
| `BELL_WALK_LEFT` | Andar | 8 | sim | ✅ temporária | Laboratório v7 |
| `BELL_WALK_RIGHT` | Andar | 8 | sim | ✅ temporária | Laboratório v7 |
| `BELL_RUN_FRONT` | Correr | 4 | sim | 🔁 usa `BELL_RUN_RIGHT` |  |
| `BELL_RUN_BACK` | Correr | 4 | sim | 🔁 usa `BELL_RUN_RIGHT` |  |
| `BELL_RUN_LEFT` | Correr | 4 | sim | ✅ temporária | arte/linebell/BELL_RUN_LEFT |
| `BELL_RUN_RIGHT` | Correr | 4 | sim | ✅ temporária | arte/linebell/BELL_RUN_RIGHT |
| `BELL_LAUGH` | Gargalhada *(sugestão nova)* | 16 | sim | ✅ temporária | Laboratório v7 |
| `BELL_JUMP` | Pular | 2 |  | ✅ temporária | arte/linebell/BELL_JUMP |
| `BELL_LAND` | Aterrissar | 1 |  | ✅ temporária | arte/linebell/BELL_LAND |
| `BELL_GROUND_STAND` | Levantar do chão | 12 |  | 🔁 usa `BELL_IDLE_RIGHT` |  |
| `BELL_SCARED` | Assustada | 12 | sim | 🔁 usa `BELL_IDLE_RIGHT` |  |
| `BELL_FLEE` | Fugir | 12 | sim | 🔁 usa `BELL_RUN_RIGHT` |  |
| `BELL_FALL` | Cair | 12 |  | 🔁 usa `BELL_IDLE_RIGHT` |  |
| `BELL_CAPTURED` | Ser capturada | 12 |  | 🔁 usa `BELL_IDLE_FRONT` |  |
| `BELL_DRAGON_CARRIED` | Ser carregada pelo dragão | 12 | sim | 🔁 usa `BELL_IDLE_FRONT` |  |
| `BELL_TRAPPED` | Presa | 12 | sim | 🔁 usa `BELL_IDLE_FRONT` |  |
| `BELL_ESCAPE_ATTEMPT` | Tentar escapar | 12 | sim | 🔁 usa `BELL_IDLE_FRONT` |  |
| `BELL_BREAK_FREE` | Conseguir se libertar | 12 |  | 🔁 usa `BELL_LAUGH` |  |
| `BELL_CALL_LINE` | Chamar Line | 12 | sim | 🔁 usa `BELL_IDLE_FRONT` |  |
| `BELL_HELP_LINE` | Ajudar Line | 12 |  | 🔁 usa `BELL_IDLE_RIGHT` |  |
| `BELL_HAPPY` | Feliz | 12 | sim | 🔁 usa `BELL_LAUGH` |  |
| `BELL_RELIEVED` | Aliviada | 12 |  | 🔁 usa `BELL_LAUGH` |  |
| `BELL_CRY` | Chorando | 12 | sim | 🔁 usa `BELL_IDLE_FRONT` |  |
| `BELL_CURTSY` | Reverência *(sugestão nova)* | 1 |  | ✅ temporária | arte/linebell/BELL_CURTSY |
| `BELL_HIGH_FIVE` | Toca aqui *(sugestão nova)* | 1 |  | ✅ temporária | arte/linebell/BELL_HIGH_FIVE |
| `BELL_DANCE` | Dançando (giro) *(sugestão nova)* | 4 | sim | ✅ temporária | arte/linebell/BELL_DANCE |

### 10.6 Line e Bell juntas

| Código | O que é | Quadros | Loop | Status | Origem da arte atual |
|---|---|---:|:---:|---|---|
| `LINE_BELL_WALK_TOGETHER_FRONT` | Andando lado a lado | 12 | sim | ✏️ código / falta |  |
| `LINE_BELL_WALK_TOGETHER_BACK` | Andando lado a lado | 12 | sim | ✏️ código / falta |  |
| `LINE_BELL_WALK_TOGETHER_LEFT` | Andando lado a lado | 12 | sim | ✏️ código / falta |  |
| `LINE_BELL_WALK_TOGETHER_RIGHT` | Andando lado a lado | 12 | sim | ✏️ código / falta |  |
| `LINE_BELL_WALK_HANDS_FRONT` | Andando de mãos dadas | 6 | sim | ✅ temporária | Laboratório v7 |
| `LINE_BELL_WALK_HANDS_BACK` | Andando de mãos dadas | 6 | sim | ✅ temporária | Laboratório v7 |
| `LINE_BELL_WALK_HANDS_LEFT` | Andando de mãos dadas | 6 | sim | ✅ temporária | Laboratório v7 |
| `LINE_BELL_WALK_HANDS_RIGHT` | Andando de mãos dadas | 6 | sim | ✅ temporária | Laboratório v7 |
| `LINE_BELL_RUN_TOGETHER_FRONT` | Correndo juntas | 12 | sim | ✏️ código / falta |  |
| `LINE_BELL_RUN_TOGETHER_BACK` | Correndo juntas | 12 | sim | ✏️ código / falta |  |
| `LINE_BELL_RUN_TOGETHER_LEFT` | Correndo juntas | 12 | sim | ✏️ código / falta |  |
| `LINE_BELL_RUN_TOGETHER_RIGHT` | Correndo juntas | 12 | sim | ✏️ código / falta |  |
| `LINE_BELL_TALK` | Conversando | 2 | sim | ✅ temporária | arte/linebell/LINE_BELL_TALK |
| `LINE_BELL_LAUGH` | Rindo juntas | 12 | sim | ✏️ código / falta |  |
| `LINE_BELL_EAT` | Almoçando juntas *(sugestão nova)* | 12 | sim | ✅ temporária | Laboratório v7 |
| `LINE_BELL_KISS` | Bitoquinha *(sugestão nova)* | 8 |  | ✅ temporária | Laboratório v7 |
| `BELL_LEAN_ON_LINE` | Bell encostando na Line | 12 |  | ✏️ código / falta |  |
| `LINE_BELL_HOLD_HANDS` | Segurando as mãos | 1 | sim | ✅ temporária | Laboratório v7 |
| `LINE_BELL_RESCUE_HUG` | Abraço do resgate | 1 | sim | ✅ temporária | Laboratório v7 |
| `LINE_BELL_HUG_RELEASE` | Separação do abraço | 12 |  | ✏️ código / falta |  |
| `LINE_BELL_CELEBRATE` | Comemorando (toca aqui) | 3 |  | ✅ temporária | arte/linebell/LINE_BELL_CELEBRATE |
| `LINE_BELL_HIGH_FIVE` | Toca aqui com brilho *(sugestão nova)* | 1 |  | ✅ temporária | arte/linebell/LINE_BELL_HIGH_FIVE |
| `LINE_BELL_DANCE` | Dançando juntas *(sugestão nova)* | 4 | sim | ✅ temporária | arte/linebell/LINE_BELL_DANCE |
| `LINE_BELL_SIT_DOWN` | Sentando juntas | 12 |  | ✏️ código / falta |  |
| `BELL_HEAD_ON_LINE` | Bell apoiando a cabeça na Line | 12 |  | ✏️ código / falta |  |
| `LINE_BELL_SIT_IDLE` | Idle das duas sentadas | 12 | sim | ✏️ código / falta |  |

### 10.7 Dragão

| Código | O que é | Quadros | Loop | Status | Origem da arte atual |
|---|---|---:|:---:|---|---|
| `DRAGON_IDLE` | Parado respirando | 4 | sim | ✅ temporária | arte/dragao/DRAGON_IDLE |
| `DRAGON_BLINK` | Piscar | 12 |  | 🔁 usa `DRAGON_IDLE` |  |
| `DRAGON_WALK` | Andar | 6 | sim | ✅ temporária | arte/dragao/DRAGON_WALK |
| `DRAGON_RUN` | Correr | 6 | sim | ✅ temporária | arte/dragao/DRAGON_RUN |
| `DRAGON_TURN` | Virar | 12 |  | 🔁 usa `DRAGON_IDLE` |  |
| `DRAGON_WINGS_OPEN` | Abrir asas | 12 |  | 🔁 usa `DRAGON_TAKEOFF` |  |
| `DRAGON_TAKEOFF` | Decolar | 5 |  | ✅ temporária | arte/dragao/DRAGON_TAKEOFF |
| `DRAGON_FLY` | Voar | 5 | sim | ✅ temporária | arte/dragao/DRAGON_FLY |
| `DRAGON_GLIDE` | Planar | 12 | sim | 🔁 usa `DRAGON_FLY` |  |
| `DRAGON_LAND` | Pousar | 5 |  | ✅ temporária | arte/dragao/DRAGON_LAND |
| `DRAGON_ROAR` | Rugir | 2 |  | ✅ temporária | arte/dragao/DRAGON_ROAR |
| `DRAGON_BITE` | Morder | 12 |  | 🔁 usa `DRAGON_CLAW_ATTACK` |  |
| `DRAGON_CLAW_ATTACK` | Ataque de garra | 3 |  | ✅ temporária | arte/dragao/DRAGON_CLAW_ATTACK |
| `DRAGON_TAIL_ATTACK` | Golpe de cauda | 7 |  | 🔁 usa `DRAGON_CLAW_ATTACK` |  |
| `DRAGON_FIRE_CHARGE` | Preparar fogo | 2 |  | ✅ temporária | arte/dragao/DRAGON_FIRE_CHARGE |
| `DRAGON_FIRE_BREATH` | Cuspir fogo | 2 |  | ✅ temporária | arte/dragao/DRAGON_FIRE_BREATH |
| `DRAGON_FIRE_STREAM` | Fogo contínuo | 1 | sim | ✅ temporária | arte/dragao/DRAGON_FIRE_STREAM |
| `DRAGON_AIR_ATTACK` | Ataque aéreo | 2 |  | ✅ temporária | arte/dragao/DRAGON_AIR_ATTACK |
| `DRAGON_HIT` | Receber dano | 2 |  | ✅ temporária | arte/dragao/DRAGON_HIT |
| `DRAGON_WEAK_POINT_HIT` | Ponto fraco atingido | 12 |  | 🔁 usa `DRAGON_HIT` |  |
| `DRAGON_STUNNED` | Atordoado | 2 | sim | ✅ temporária | arte/dragao/DRAGON_STUNNED |
| `DRAGON_DESPERATE_ATTACK` | Ataque desesperado | 12 |  | 🔁 usa `DRAGON_FIRE_STREAM` |  |
| `DRAGON_FINAL_HIT` | Receber golpe final | 12 |  | 🔁 usa `DRAGON_HIT` |  |
| `DRAGON_FALL` | Cair | 3 |  | ✅ temporária | arte/dragao/DRAGON_FALL |
| `DRAGON_DEFEATED` | Derrotado | 1 | sim | ✅ temporária | arte/dragao/DRAGON_DEFEATED |
| `DRAGON_SLEEP` | Dormir *(sugestão nova)* | 1 | sim | ✅ temporária | arte/dragao/DRAGON_SLEEP |
| `DRAGON_EYE_OPEN_END` | Ressurgir no final | 2 |  | ✅ temporária | arte/dragao/DRAGON_EYE_OPEN_END |

### 10.8 Magia e criaturas (novo)

| Código | O que é | Quadros | Loop | Status | Origem da arte atual |
|---|---|---:|:---:|---|---|
| `LINE_CAST_SPELL` | Line lança o Raio de Luz *(sugestão nova)* | 18 |  | 🔁 usa `LINE_ATTACK_VERTICAL` |  |
| `LINE_CAST_CHARGE` | Line carregando a Chuva de Estrelas *(sugestão nova)* | 16 | sim | 🔁 usa `LINE_COMBAT_IDLE` |  |
| `LINE_CAST_STARS` | Line solta a Chuva de Estrelas *(sugestão nova)* | 18 |  | 🔁 usa `LINE_ATTACK_SPIN` |  |
| `GOLEM_SLEEP` | Guardião de Pedra dormindo *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `GOLEM_IDLE` | Guardião parado *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `GOLEM_WALK` | Guardião andando *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `GOLEM_SLAM` | Guardião: pisão (onda no chão) *(sugestão nova)* | 12 |  | ✏️ código / falta |  |
| `GOLEM_THROW` | Guardião: arremessar pedra *(sugestão nova)* | 12 |  | ✏️ código / falta |  |
| `GOLEM_STUNNED` | Guardião tonto (cristal rachado) *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `GOLEM_DEATH` | Guardião desmoronando *(sugestão nova)* | 12 |  | ✏️ código / falta |  |
| `WISP_IDLE` | Fogo-fátuo flutuando *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `WISP_ATTACK` | Fogo-fátuo atirando *(sugestão nova)* | 12 |  | ✏️ código / falta |  |
| `WISP_DEATH` | Fogo-fátuo apagando *(sugestão nova)* | 12 |  | ✏️ código / falta |  |

### 10.9 Inimigos (novo)

| Código | O que é | Quadros | Loop | Status | Origem da arte atual |
|---|---|---:|:---:|---|---|
| `SHADOW_IDLE` | Sombra — parada *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `SHADOW_MOVE` | Sombra — andar *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `SHADOW_ATTACK` | Sombra — investida *(sugestão nova)* | 12 |  | ✏️ código / falta |  |
| `SHADOW_HIT` | Sombra — receber dano *(sugestão nova)* | 12 |  | ✏️ código / falta |  |
| `SHADOW_DEATH` | Sombra — desaparecer *(sugestão nova)* | 12 |  | ✏️ código / falta |  |

### 10.10 Efeitos

| Código | O que é | Quadros | Loop | Status | Origem da arte atual |
|---|---|---:|:---:|---|---|
| `FX_FIRE` | Fogo | 12 | sim | ✏️ código / falta |  |
| `FX_EMBERS` | Brasas | 12 | sim | ✏️ código / falta |  |
| `FX_FIRE_LIGHT` | Iluminação do fogo | 12 | sim | ✏️ código / falta |  |
| `FX_SMOKE` | Fumaça | 12 |  | ✏️ código / falta |  |
| `FX_DUST` | Poeira | 12 |  | ✏️ código / falta |  |
| `FX_IMPACT` | Impacto | 12 |  | ✏️ código / falta |  |
| `FX_SPARKS` | Faíscas | 12 |  | ✏️ código / falta |  |
| `FX_EXPLOSION` | Explosão | 12 |  | ✏️ código / falta |  |
| `FX_SWORD_TRAIL` | Rastro da espada | 12 |  | ✏️ código / falta |  |
| `FX_DRAGON_WEAK_POINT` | Ponto fraco do dragão | 12 | sim | ✏️ código / falta |  |
| `FX_TEARS` | Lágrimas | 12 | sim | ✏️ código / falta |  |
| `FX_HEARTS` | Corações | 12 |  | ✏️ código / falta |  |
| `FX_AMBIENT_PARTICLES` | Partículas ambientais | 12 | sim | ✏️ código / falta |  |

### 10.11 Bichos da fazenda

| Código | O que é | Quadros | Loop | Status | Origem da arte atual |
|---|---|---:|:---:|---|---|
| `THEO_ALERT` | Theo — Theo alerta | 1 |  | ✅ temporária | arte/theo/THEO_ALERT |
| `THEO_BALL` | Theo — Theo com a bolinha | 1 |  | ✅ temporária | arte/theo/THEO_BALL |
| `THEO_BATH` | Theo — Theo no banho | 1 |  | ✅ temporária | arte/theo/THEO_BATH |
| `THEO_BONE` | Theo — Theo com o osso | 1 |  | ✅ temporária | arte/theo/THEO_BONE |
| `THEO_IDLE_BACK` | Theo — idle back | 3 |  | ✅ temporária | arte/theo/THEO_IDLE_BACK |
| `THEO_IDLE_FRONT` | Theo — idle front | 3 |  | ✅ temporária | arte/theo/THEO_IDLE_FRONT |
| `THEO_IDLE_LEFT` | Theo — idle left | 1 |  | ✅ temporária | arte/theo/THEO_IDLE_LEFT |
| `THEO_IDLE_RIGHT` | Theo — idle right | 1 |  | ✅ temporária | arte/theo/THEO_IDLE_RIGHT |
| `THEO_LIE` | Theo — Theo deitado | 1 |  | ✅ temporária | arte/theo/THEO_LIE |
| `THEO_PLAY` | Theo — Theo brincando | 3 |  | ✅ temporária | arte/theo/THEO_PLAY |
| `THEO_QUESTION` | Theo — Theo curioso | 1 |  | ✅ temporária | arte/theo/THEO_QUESTION |
| `THEO_ROLL` | Theo — Theo de barriga pra cima | 3 |  | ✅ temporária | arte/theo/THEO_ROLL |
| `THEO_RUN` | Theo — Correr | 4 |  | ✅ temporária | arte/theo/THEO_RUN |
| `THEO_SIT` | Theo — sit | 4 |  | ✅ temporária | arte/theo/THEO_SIT |
| `THEO_SIT_FRONT` | Theo — Theo comendo | 1 |  | ✅ temporária | arte/theo/THEO_SIT_FRONT |
| `THEO_SIT_IDLE` | Theo — Theo apaixonado | 2 |  | ✅ temporária | arte/theo/THEO_SIT_IDLE |
| `THEO_SLEEP` | Theo — Theo dormindo | 1 |  | ✅ temporária | arte/theo/THEO_SLEEP |
| `THEO_WALK_BACK` | Theo — walk back | 3 |  | ✅ temporária | arte/theo/THEO_WALK_BACK |
| `THEO_WALK_FRONT` | Theo — walk front | 4 |  | ✅ temporária | arte/theo/THEO_WALK_FRONT |
| `THEO_WALK_LEFT` | Theo — walk left | 6 |  | ✅ temporária | arte/theo/THEO_WALK_LEFT |
| `THEO_WALK_RIGHT` | Theo — walk right | 4 |  | ✅ temporária | arte/theo/THEO_WALK_RIGHT |
| `CHICKEN_EAT` | Galinha branca — Comer | 5 |  | ✅ temporária | arte/galinhas/CHICKEN_EAT |
| `CHICKEN_IDLE` | Galinha branca — Parado | 6 |  | ✅ temporária | arte/galinhas/CHICKEN_IDLE |
| `CHICKEN_LAY_EGG` | Galinha branca — Botar ovo | 7 |  | ✅ temporária | arte/galinhas/CHICKEN_LAY_EGG |
| `CHICKEN_PECK` | Galinha branca — Bicar o chão | 7 |  | ✅ temporária | arte/galinhas/CHICKEN_PECK |
| `CHICKEN_RUN` | Galinha branca — Correr | 6 |  | ✅ temporária | arte/galinhas/CHICKEN_RUN |
| `CHICKEN_SCARED` | Galinha branca — Assustada | 4 |  | ✅ temporária | arte/galinhas/CHICKEN_SCARED |
| `CHICKEN_SCRATCH` | Galinha branca — Ciscar | 6 |  | ✅ temporária | arte/galinhas/CHICKEN_SCRATCH |
| `CHICKEN_SLEEP` | Galinha branca — Dormindo | 6 |  | ✅ temporária | arte/galinhas/CHICKEN_SLEEP |
| `CHICKEN_WALK` | Galinha branca — Andar | 7 |  | ✅ temporária | arte/galinhas/CHICKEN_WALK |
| `HEN_BROWN_EAT` | Galinha marrom — Comer | 5 |  | ✅ temporária | arte/galinhas/HEN_BROWN_EAT |
| `HEN_BROWN_IDLE` | Galinha marrom — Parado | 6 |  | ✅ temporária | arte/galinhas/HEN_BROWN_IDLE |
| `HEN_BROWN_LAY_EGG` | Galinha marrom — Botar ovo | 7 |  | ✅ temporária | arte/galinhas/HEN_BROWN_LAY_EGG |
| `HEN_BROWN_PECK` | Galinha marrom — Bicar o chão | 7 |  | ✅ temporária | arte/galinhas/HEN_BROWN_PECK |
| `HEN_BROWN_RUN` | Galinha marrom — Correr | 6 |  | ✅ temporária | arte/galinhas/HEN_BROWN_RUN |
| `HEN_BROWN_SCARED` | Galinha marrom — Assustada | 4 |  | ✅ temporária | arte/galinhas/HEN_BROWN_SCARED |
| `HEN_BROWN_SCRATCH` | Galinha marrom — Ciscar | 6 |  | ✅ temporária | arte/galinhas/HEN_BROWN_SCRATCH |
| `HEN_BROWN_SLEEP` | Galinha marrom — Dormindo | 6 |  | ✅ temporária | arte/galinhas/HEN_BROWN_SLEEP |
| `HEN_BROWN_WALK` | Galinha marrom — Andar | 7 |  | ✅ temporária | arte/galinhas/HEN_BROWN_WALK |
| `CHICK_IDLE` | Pintinho — Parado | 6 |  | ✅ temporária | arte/galinhas/CHICK_IDLE |
| `CHICK_RUN` | Pintinho — Correr | 5 |  | ✅ temporária | arte/galinhas/CHICK_RUN |
| `CHICK_WALK` | Pintinho — Andar | 6 |  | ✅ temporária | arte/galinhas/CHICK_WALK |
| `COW_EAT` | Vaca — Comer | 4 |  | ✅ temporária | arte/bichos/COW_EAT |
| `COW_IDLE` | Vaca — Parado | 2 |  | ✅ temporária | arte/bichos/COW_IDLE |
| `COW_RUN` | Vaca — Correr | 2 |  | ✅ temporária | arte/bichos/COW_RUN |
| `COW_WALK` | Vaca — Andar | 4 |  | ✅ temporária | arte/bichos/COW_WALK |
| `PIG_FRONT` | Porco — De frente | 2 |  | ✅ temporária | arte/bichos/PIG_FRONT |
| `PIG_IDLE` | Porco — Parado | 1 |  | ✅ temporária | arte/bichos/PIG_IDLE |
| `PIG_LIE` | Porco — Deitado | 1 |  | ✅ temporária | arte/bichos/PIG_LIE |
| `PIG_MUD` | Porco — Rolando na lama | 4 |  | ✅ temporária | arte/bichos/PIG_MUD |
| `PIG_WALK` | Porco — Andar | 4 |  | ✅ temporária | arte/bichos/PIG_WALK |
| `HORSE_EAT` | Cavalo — Comer | 1 |  | ✅ temporária | arte/bichos/HORSE_EAT |
| `HORSE_IDLE` | Cavalo — Parado | 1 |  | ✅ temporária | arte/bichos/HORSE_IDLE |
| `HORSE_RUN` | Cavalo — Correr | 3 |  | ✅ temporária | arte/bichos/HORSE_RUN |
| `HORSE_WALK` | Cavalo — Andar | 4 |  | ✅ temporária | arte/bichos/HORSE_WALK |
| `SHEEP_IDLE` | Ovelha — Parado *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `SHEEP_WALK` | Ovelha — Andar *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `SHEEP_RUN` | Ovelha — Correr *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `SHEEP_EAT` | Ovelha — Comer grama *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `DUCK_IDLE` | Pato — Parado *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `DUCK_WALK` | Pato — Andar *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `DUCK_SWIM` | Pato — Nadando *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `DUCK_RUN` | Pato — Correr *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `CAT_IDLE` | Gato — Parado *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `CAT_WALK` | Gato — Andar *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `CAT_SLEEP` | Gato — Dormindo *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `CAT_PURR` | Gato — Carinho (ronronando) *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |

### 10.12 Personagens de apoio (novo)

| Código | O que é | Quadros | Loop | Status | Origem da arte atual |
|---|---|---:|:---:|---|---|
| `MAGO_IDLE` | Mago parado, respirando *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `MAGO_TALK` | Mago falando / gesticulando *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `MAGO_CAST` | Mago fazendo um feitiço *(sugestão nova)* | 12 |  | ✏️ código / falta |  |
| `SPIRIT_APPEAR` | Espírito das Ruínas aparecendo no altar *(sugestão nova)* | 12 |  | ✏️ código / falta |  |
| `SPIRIT_IDLE` | Espírito das Ruínas flutuando *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `SPIRIT_TALK` | Espírito das Ruínas falando *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |

*Na coluna Quadros, as animações ✅ mostram quantos quadros diferentes a arte atual tem. As que faltam mostram quantos quadros o jogo espera (é uma sugestão, pode vir com mais ou menos).*

### 10.13 O que ainda falta ter arte própria, por prioridade

**Aparecem na história (prioridade 1):**
- **Prólogo (primeiro encontro):** `LINE_ADMIRE`, `BELL_WAIT`, `LINE_BELL_MEET`, `LINE_BELL_GREET_HUG`, `LINE_BELL_BK`, `BELL_LAUGH_AT_LINE` e `LINE_BELL_TUNNEL_KISS` (detalhes na seção 5.5).
- **Bell:**
  - `BELL_SCARED`, `BELL_CAPTURED` e `BELL_DRAGON_CARRIED`: assustada, capturada e carregada pelo dragão.
  - `BELL_TRAPPED`, `BELL_CALL_LINE` e `BELL_ESCAPE_ATTEMPT`: presa na jaula, chamando a Line e tentando escapar.
  - `BELL_BREAK_FREE`, `BELL_HAPPY` e `BELL_RELIEVED`: se libertando e feliz.
  - Corrida de frente e de costas.
- **Dragão:** `DRAGON_TAIL_ATTACK`, `DRAGON_CLAW_ATTACK` próprio, `DRAGON_STUNNED`, `DRAGON_FALL`, `DRAGON_DEFEATED`, `DRAGON_SLEEP` e `DRAGON_AIR_ATTACK`.
- **Magia:** `LINE_CAST_SPELL`, `LINE_CAST_CHARGE` e `LINE_CAST_STARS`.
- **Guardião de Pedra:** todos os `GOLEM_*`.
- **Fogo-fátuo:** todos os `WISP_*`.
- **Casal:** `LINE_BELL_HUG_RELEASE`, `LINE_BELL_SIT_DOWN` e `LINE_BELL_SIT_IDLE` (o epílogo no lago).

**Deixam o jogo mais bonito (prioridade 2):**
- Sombras (`SHADOW_*`).
- Line com a espada na mão andando e correndo (`LINE_COMBAT_WALK_*` e `LINE_COMBAT_RUN_*`).
- Mago e Espírito das Ruínas.
- Ovelha, pato e gato.
- O resto das animações do casal.

**Opcionais (prioridade 3):** efeitos `FX_*` (hoje são partículas feitas no código), `LINE_JUMP_LEFT` e `LINE_LAND_LEFT` (o jogo espelha as da direita).

## 11. Retratos dos diálogos

> ⚠️ Os retratos atuais também são temporários.

![Retratos atuais: 6 expressões básicas + tira extra de cada uma](imagens/arte-retratos.jpg)
*Retratos atuais: 6 expressões básicas + tira extra de cada uma*

| Expressão | Código usado no roteiro | Line | Bell |
|---|---|---|---|
| Neutra | `neutro` | ✅ | ✅ |
| Sorrindo | `sorriso` | ✅ | ✅ |
| Rindo | `riso` | ✅ | ✅ |
| Surpresa | `surpresa` | ✅ | ✅ |
| Apaixonada | `apaixonada` | ✅ | ✅ |
| Marota | `maroto` | ✅ | ✅ |
| Brava | `bravo` | ✅ | 🔁 usa neutra |
| Chorando | `chorando` | ✅ | 🔁 usa surpresa |
| Envergonhada | `envergonhada` | 🔁 usa apaixonada | ✅ |

**Retratos que ainda faltam:**
- **Personagens sem retrato:** Mago, Espírito das Ruínas e Guardião de Pedra.
- **Expressões que faltam:** Bell brava, Bell chorando e Line envergonhada.

As fontes são os retratos 3×2 do HTML *Primeiro Encontro* e a prancha “Line & Bell”, que deu as expressões extras.

## 12. Cenário e objetos

> ⚠️ O cenário atual também é temporário: parte vem de pacotes de arte recebidos, parte é desenhada no código.

| Área | Já usa arte (temporária) | Ainda desenhado no código (precisa de arte) |
|---|---|---|
| Minas Shopping (prólogo) | ilustração do shopping, vinda do HTML do primeiro encontro (temporária; a final segue a foto-modelo da seção 5.2) | — |
| Playground (prólogo) | máquina de soco (recortada da animação `LINE_PUNCH_MACHINE`) | piso xadrez, paredes, fliperamas, painel, balcão de prêmios, placar da máquina |
| Túnel (prólogo) | ilustração do túnel, vinda do HTML do primeiro encontro | — |
| Fazendinha | casa (prancha Farmhouse), celeiro, galinheiro, moinho, poço, árvores e frutíferas, cerejeiras, horta (cenoura e tomate), feno, carroça, lampiões, píer, barco, girassóis, milho, trigo, arbustos, pedras, placa | chão de grama, caminho, água do lago, cercas, flores pequenas, mato, varal, mesa, casinha do Theo, tigela |
| Floresta | pinheiros e árvores | chão, raízes, riacho, espinheiros, baú, placas, pedras |
| Gruta dos Ecos | — | chão e paredes azuladas, água funda, estalagmites, cogumelos luminosos, fonte, placa, porta de ferro, baús |
| Ruínas Encantadas | — | chão de lajes, paredes, pilares, cristais (apagado e aceso), altar com orbe, fonte, barreira de luz, lagos, baú |
| Montanha de Brasa | — | chão vulcânico, paredes, fendas, lava, tochas (apagada e acesa), portão de fogo, pedras, estalagmites, fonte, baú |
| Covil | — | chão, paredes, lava, estalagmites, jaula da Bell |

**Objetos novos desenhados no código (precisam de arte):** porta de ferro trancada, cogumelos luminosos, documentos no chão, os 10 itens da mochila (hoje emojis), moedas, tochas, moradores, casas do vilarejo, carrinho, estações e trilhos, postes do gancho, bombas, paredes rachadas, chão em brasa, morcegos e o mapa do mundo. A lista completa, com o que cada um deve mostrar, está na **seção 7.12**.

Pranchas de referência já recebidas ficam em `arte/referencias/`: fazenda, casa, dragões, Theo, pacote Line & Bell e tileset.

## 13. Efeitos visuais

Todos os efeitos são feitos no código por enquanto (temporários):

- **Luta:**
  - Rastro azul da espada.
  - Impacto (anel branco), faíscas de bloqueio e poeira.
  - Onda do ataque aéreo e onda do pisão do Guardião.
- **Magia:**
  - Raio de Luz (bola brilhante com rastro).
  - Carga e explosão da Chuva de Estrelas.
  - Brilho dos cristais e chamas das tochas.
  - Brilho das barreiras e runas.
- **Dragão:**
  - Fogo do dragão (partículas).
  - Brilho do ponto fraco e estrelas de tontura.
- **Ambiente:**
  - Corações, folhas caindo, fumaça das chaminés, brasas da lava, gotas d’água.
  - Vaga-lumes, borboletas, pássaros e sombras das nuvens.
- **Prólogo:**
  - Corações subindo no beijo, impacto e tremor no soco.
  - Brilho rosa nas transições e zoom da câmera nos closes.
- **Tela:**
  - Tremor de tela, flash branco e pausas de impacto.
  - Tons de cor por horário e área.
  - O olho do dragão no final.

Os códigos `FX_*` da seção 10.10 são para quando esses efeitos ganharem arte própria.

## 14. Como mandar arte nova

1. **Formatos aceitos:**
   - HTML de item (`LINE_BELL_ITEM_XX.html`, um PNG por quadro).
   - HTML de laboratório.
   - Pasta `arte/<grupo>/<CÓDIGO>/00.png, 01.png…`.
   - Uma **prancha**: imagem com vários quadros, que eu recorto.
2. **Nome:** o código precisa ser exatamente o da seção 10.
3. **Fundo transparente de verdade.** Nada de quadriculado ou fundo cinza desenhado.
4. **Mesmo tamanho** em todos os quadros de uma animação, com os pés sempre na mesma linha.
5. **Virada para a direita** nas animações de lado.
6. **Sem sombra no chão e sem rótulos** dentro dos quadros. O jogo desenha a sombra.
7. **Theo:** a arte final deve seguir o layout oficial da seção 2, só melhorando, sem perder os traços.
8. **Tamanho recomendado:**
   - Personagens: o corpo com cerca de 200 a 250 px de altura.
   - Dragão: corpo com cerca de 400 px, em quadros de 512×512.
   - Bichos: 100 a 150 px.
9. Quando a arte chega, o extrator (`tools/extrair_sprites.py`) monta as folhas e ela entra no jogo sozinha, no lugar da temporária.

## 15. Estrutura técnica

| Arquivo | O que faz |
|---|---|
| `game/index.html` | página do jogo, menus, controles de toque |
| `game/js/jogo.js` | motor: áreas, câmera, combate, HUD, salvamento |
| `game/js/entidades.js` | Line, Bell, Sombra, partículas |
| `game/js/magia.js` | magia, cristais, tochas, barreiras, fontes, Fogo-fátuo e Guardião |
| `game/js/dragao.js` | o dragão e seus ataques |
| `game/js/bichos.js` | bichos da fazenda e o Mago |
| `game/js/fazenda.js` | capítulo da fazenda e tarefas |
| `game/js/encontro.js` | prólogo *O primeiro encontro*: lugares, máquina de soco, cenas e falas |
| `game/js/cenas.js` | cenas e falas da aventura (roteiro) |
| `game/js/mochila.js` | mochila: itens, moedas, documentos e conclusões, mapa com névoa, objetivo, avisos |
| `game/js/mapas.js` | os mapas das 7 áreas da aventura |
| `game/js/mundo.js` | bombas e paredes rachadas, gancho, chão em brasa, escuro das minas, moedas soltas, casas e objetos novos |
| `game/js/loja.js` | vilarejo: moradores e falas, loja, ferraria, armaduras e escudos |
| `game/js/carrinho.js` | carrinho de mina: estações, escolha do destino e a viagem |
| `game/js/ia.js` | inteligência dos inimigos: linha de visão, caminho pela grade, alerta, separação, e o Morcego |
| `tests/rodar.js` | testes automatizados de todas as telas (Playwright) |
| `tools/fotos_documentacao.js` | tira as capturas das partes novas para este documento |
| `game/js/cenario.js` | árvores, casa, objetos e ambiente |
| `game/js/animacoes.js` | catálogo de animações, substitutas e desenho dos sprites |
| `game/js/entrada.js` | teclado, controle, toque e dificuldade |
| `game/assets/` | folhas de sprites, retratos, cenário (inclui `cenario/encontro_*.webp` do prólogo) |
| `tools/extrair_sprites.py` | converte a arte recebida em folhas para o jogo |
| `tools/gerar_documentacao.py` | gera este documento |

### Testes automatizados

A pasta `tests/` tem um conjunto de testes que abre o jogo num navegador de verdade (Chromium, pelo Playwright) e passa por **todas as telas**. Ele sobe sozinho um servidor para a pasta `game/`. Para rodar: `cd tests && npm install && npm test` (ou `node rodar.js loja carrinho` para rodar só alguns). `npm run fotos` salva uma captura de cada tela em `tests/fotos/`. Um teste falha se qualquer erro aparecer no console.

| Grupo | O que é testado |
|---|---|
| Menu | botões, troca de dificuldade, tela de controles e galeria de animações |
| Prólogo e fazenda | Novo jogo abre o Primeiro Encontro; manhã na fazenda com a Bell; estrada do vilarejo fechada antes do rapto e aberta depois |
| Pausa | abrir, abrir a mochila pela pausa, voltar com Esc, retomar |
| Mochila | itens, equipar no atalho, usar poção, 12 documentos, 8 conclusões, mapa da área e do mundo, teclas I, M, H, F e Esc |
| Mapa | só acende áreas visitadas; documento marca sem acender |
| Todas as áreas | cada uma das 7 áreas carrega, desenha e roda sem erros, e a Line não nasce dentro de parede |
| Tamanho e conectividade | tamanho das fases; todo baú, documento, morador, estação e saída alcançável (contando pulos, gancho, bombas, chaves e barreiras); toda saída chega em chão livre, fora de outra saída, e tem caminho de volta |
| Vilarejo | loja da Dona Rosa (comprar, falta de dinheiro, botas), ferraria (armadura, escudo segurando golpe, Armadura de Brasa liberada pela receita), conversas com os moradores |
| Carrinho | quebrado sem alavanca, encaixar a alavanca, tela de destino só com estações descobertas, viagem até as Minas |
| Bombas, gancho, brasa, escuro | bomba quebra a parede e fica salvo; gancho atravessa; brasa queima sem a armadura e não queima com ela; galeria escura |
| Inimigos | caminho pela grade, alerta aos vizinhos, moedas caindo e sendo pegas, morcego acordando, coração não cai com a vida cheia |
| Derrota | tela de derrota e Tentar de novo; Pena de Fênix levanta a Line |
| Documentos e dragão | a cena de documento forma conclusão; a luta no covil começa |
| Save | Continuar volta com área, moedas e itens; save antigo é convertido |
| Celular | controles de toque, botão da poção e do item, mochila cabendo na tela |

### Como atualizar este documento
As tabelas de animações e o roteiro são gerados a partir do jogo. Para regerar, rode o jogo localmente, exporte o inventário e o roteiro e rode, com o jogo servido na porta 8765: `node tools/exportar_inventario.js inventario.json` (também exporta mapas, baús, itens, documentos e loja), `python3 tools/extrair_roteiro.py roteiro.json`, `node tools/fotos_documentacao.js pasta` (capturas das partes novas, depois convertidas para JPG em `docs/imagens`), `python3 tools/gerar_documentacao.py inventario.json roteiro.json` e, para a versão HTML, `python3 tools/gerar_documentacao_html.py`.

![No jogo, o menu Animações mostra a mesma lista, com prévia de cada uma](imagens/25-galeria.jpg)
*No jogo, o menu Animações mostra a mesma lista, com prévia de cada uma*

---

*Line & Bell: um jogo feito com carinho. Todas as animações e artes atuais são temporárias até a criação completa da arte final.*
