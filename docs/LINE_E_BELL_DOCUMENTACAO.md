# Line & Bell — Documentação completa do jogo

> ⚠️ **Aviso importante: todas as animações e artes usadas hoje são TEMPORÁRIAS.**
> Elas estão no jogo só para dar vida à aventura enquanto a criação da arte final não termina.
> Quando cada animação definitiva ficar pronta, ela substitui a temporária com o mesmo código.
> Isso vale para os sprites, os retratos, o cenário e os desenhos feitos no código.

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
- [7. Como se joga](#7-como-se-joga)
- [8. Inimigos e chefes](#8-inimigos-e-chefes)
- [9. Lista completa de animações](#9-lista-completa-de-animacoes)
- [10. Retratos dos diálogos](#10-retratos-dos-dialogos)
- [11. Cenário e objetos](#11-cenario-e-objetos)
- [12. Efeitos visuais](#12-efeitos-visuais)
- [13. Como mandar arte nova](#13-como-mandar-arte-nova)
- [14. Estrutura técnica](#14-estrutura-tecnica)

## 1. Visão geral

**Line & Bell** é uma aventura de ação vista de cima, para navegador (PC e celular). Tudo começa com um prólogo jogável, **O primeiro encontro**, que conta como as duas se conheceram em 09/05/2024. Depois, a Line e a Bell já são namoradas e vivem numa fazendinha com o cachorro Theo. Um dragão leva a Bell, e a Line atravessa uma floresta, ruínas mágicas e uma montanha de lava para resgatá-la.

| | |
|---|---|
| Gênero | Aventura / ação com exploração, visão de cima |
| Plataformas | Navegador no PC (teclado ou controle) e no celular (toque) |
| Duração | Cerca de 35 a 50 minutos (o prólogo leva uns 3 minutos) |
| Prólogo | *O primeiro encontro* (09/05/2024): Minas Shopping, Playground e Túnel |
| Áreas | 3 do prólogo e 5 da aventura: Fazendinha, Floresta Sussurrante, Ruínas Encantadas, Montanha de Brasa e Covil do Dragão |
| Chefes | Guardião de Pedra e o Dragão Vermelho |
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

**Capítulo 2 — A floresta.** Na Floresta Sussurrante, um mago conta que o dragão acordou depois de cem anos e entrega uma espada guardada num baú. Sombras aparecem. Espinhos fecham o caminho do norte, e a espada abre passagem.

**Capítulo 3 — Magia.** O dragão selou a montanha com magia antiga. Nas Ruínas Encantadas, o Espírito das Ruínas ensina a Line a lançar luz pela espada. Ela acende cristais para desfazer barreiras, encontra um coração extra e enfrenta o Guardião de Pedra. Vencido, ele entrega a Chuva de Estrelas.

**Capítulo 4 — A montanha.** Na Montanha de Brasa, a Line pula fendas, desvia de lava e acende três tochas antigas para abrir o portão de fogo do covil.

**Capítulo 5 — O covil.** A Bell está presa numa jaula e o dragão pousa para lutar. Quando ele cansa, o peito brilha: é o ponto fraco. A Line vence, dá o golpe final e liberta a Bell. As duas se abraçam.

**Epílogo.** De volta à fazenda, no pôr do sol do lago, as duas dançam. Aparece “Fim”… e, no escuro, um olho de dragão se abre: “Fim?”.

## 4. Roteiro completo, cena a cena

Todas as falas estão exatamente como aparecem no jogo. Entre parênteses está a expressão do retrato. As linhas com ▶ indicam a animação que toca naquele momento: o código é o mesmo da lista da seção 9.

### 4.1 Prólogo 1: o Minas Shopping

Começa ao escolher **Novo jogo**, antes de tudo. A Line entra no shopping de costas para a câmera e vê a Bell esperando perto das mesas. Depois a Line anda livremente até a Bell.

![Prólogo 1: o Minas Shopping](imagens/p01-titulo.jpg)
*Prólogo 1: o Minas Shopping*

> ▶ `LINE_IDLE`  
> 🎬 **Título na tela:** O primeiro encontro — Minas Shopping · 09/05/2024  
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

**Falas sorteadas do Mago** (mudam conforme o progresso):

- “Os espinhos ao norte não resistem a uma boa lâmina.”
- “As barreiras das ruínas só se desfazem com luz. Procure o altar na sala a oeste.”
- “Pule o riacho, corte os espinhos, ache o altar. Simples, não?”
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
> 🎮 *Tutorial na tela:* J ou Z: atacar (3x = combo) · K ou X: giro · L ou C: esquivar (correndo = dash) · I ou V: defender (segure) · Espaço e depois J: ataque aéreo  
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

### 4.20 O portão se abre

Quando a terceira tocha acende.

![O portão se abre](imagens/21-tocha-na-lava.jpg)
*O portão se abre*

> ▶ `LINE_DETERMINED`  
> **Line** *(brava)*: O portão abriu! Aguenta firme, Bell. Tô chegando.  

### 4.21 Baú de coração extra

Há dois: um na alcova leste das ruínas e outro na plataforma cercada de fendas na montanha.

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

### 4.24 Placas

| Onde | Texto |
|---|---|
| Floresta, perto das raízes | Cuidado com as raízes! Correndo por cima delas você pode tropeçar. Ande devagar (solte o correr). |
| Floresta, antes do riacho | Riacho à frente. Para atravessar, pule! (Espaço ou botão Pular). Correndo, o pulo vai mais longe. |
| Ruínas, salão de entrada | Ruínas Encantadas. Só a luz atravessa as barreiras. O altar da luz fica na sala a oeste. |
| Montanha, início | Fendas na rocha! Pule para atravessar (Espaço). Correndo, o pulo vai mais longe. |
| Montanha, fonte | Fonte das brasas: beba para recuperar vida e magia. Se cair, você volta para cá. |

### 4.25 Balões dos bichos e da Bell (na fazenda)

- Cocoricóóó! (galo, de manhã)
- Au! / Au! Au! / Au! Au! ♥ / Auuu~ (fome) / Auuu... / AU! AU! AU! (Theo)
- Piu! (pintinhos)
- Quatro ovinhos! Vai ter bolo hoje. (Bell)
- Rega as cenouras com carinho! (Bell)
- A horta tá feliz. E eu também! (Bell)
- O Theo já tá sentindo o cheiro! (Bell)
- Os bichinhos te amam. Eu entendo eles. (Bell)

### 4.26 Dicas que aparecem durante o jogo

| Quando | Texto |
|---|---|
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
- **Precisa de arte final:** a ilustração do shopping e uma versão da mesa com o lanche do BK, se o casal comendo não vier com a mesa desenhada.

**Playground**
- **Fundo:** desenhado no código igual ao HTML. Tem o piso xadrez roxo, parede escura, dois fliperamas à esquerda (um rosa com tela azul-piscina e um azul com tela rosa), um painel rosa no alto e um balcão de prêmios embaixo.
- **Máquina de soco:** a mesma que aparece na animação `LINE_PUNCH_MACHINE`, parada no lugar do soco. Em cima dela há um **placar** rosa com números amarelos que mostra **000** e vira **038** no impacto.
- **Precisa de arte final:** a ilustração do playground (fliperamas, balcão, luzes, piso) e a máquina de soco separada, parada e com o placar.

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

Estas são as animações próprias do prólogo, no grupo **Primeiro encontro (prólogo)** da seção 9. As que ainda não têm arte usam uma substituta parecida.

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
- [ ] Versões finais das ilustrações do Minas Shopping e do Túnel.
- [ ] Line parada de costas (`LINE_IDLE_BACK`) caprichada para a entrada no shopping.
- [ ] Opcional: música e sons (passos no shopping, fliperamas, o soco, o beijo).

### 5.9 Progresso e salvamento

- **Novo jogo** sempre começa pelo prólogo.
- Se o jogador fechar o jogo **no meio do prólogo**, **Continuar** recomeça o prólogo do início (ele é curto).
- Terminado o prólogo, o jogo marca `encontroFeito` e salva já na fazenda. Jogos salvos antes do prólogo existir continuam de onde pararam.

## 6. As fases

Os três lugares do prólogo (Minas Shopping, Playground e Túnel) estão na seção 5. Estas são as áreas da aventura:

### 6.1 Fazendinha
Casa com varanda e duas chaminés, celeiro, galinheiro, horta, poço, moinho, pasto, chiqueiro, lago com píer e barco, varal, casinha do Theo, mesa de piquenique, árvores frutíferas e flores. Tem borboletas, pássaros, nuvens, folhas caindo e fumaça nas chaminés. De manhã, a luz é clara. À tarde, o céu fica alaranjado, e depois do rapto vira noite com vaga-lumes.

![Pasto com vacas, cavalo e ovelhas](imagens/04-pasto.jpg)
*Pasto com vacas, cavalo e ovelhas*

### 6.2 Floresta Sussurrante
Trilha com raízes (correr sobre elas faz a Line tropeçar), riacho para pular, a clareira do Mago com o baú da espada, espinhos que fecham o norte e sombras depois que a espada é pega.

![Sombras na floresta](imagens/11-floresta-sombras.jpg)
*Sombras na floresta*

### 6.3 Ruínas Encantadas (nova)
Um templo antigo de pedra e musgo, organizado em salas:

- **Salão sul (entrada):**
  - A placa, uma fonte e dois cristais que abrem a barreira do meio.
  - A oeste fica a **sala do altar**, onde a Line aprende a magia.
- **Salão do meio:**
  - Dois lagos com um cristal numa ilhota em cada um. Eles só podem ser acesos de longe, com o Raio de Luz.
  - Mais um cristal, pilares, sombras e fogos-fátuos.
  - A leste fica uma **alcova com o baú de coração extra**, aberta por um cristal próprio.
  - Tem uma fonte.
- **Salão norte:** arena com pilares onde dorme o **Guardião de Pedra**. Vencido, ele desfaz a última barreira, que leva à montanha.

![Cristais acesos e barreira desfeita](imagens/15-barreira-aberta.jpg)
*Cristais acesos e barreira desfeita*

### 6.4 Montanha de Brasa (nova)
Rocha vulcânica, rios de lava e brasas subindo:

- **Início:** uma fenda atravessa o caminho e precisa ser pulada. Ali fica a primeira tocha.
- **Meio:**
  - Lava dos dois lados.
  - A **fonte das brasas**, que é o ponto de retorno.
  - A segunda tocha, numa **ilha no meio da lava**, que só pode ser acesa de longe.
- **Topo:**
  - A terceira tocha, na praça central.
  - Uma **plataforma cercada de fendas com o segundo baú de coração**.
  - O **portão de fogo**, que abre com as três tochas acesas.

### 6.5 Covil do Dragão
Caverna escura com lava nas laterais e estalagmites. A Bell fica numa jaula ao fundo. Quando a Line entra, a entrada desmorona e a luta começa.

![O dragão cospe fogo no covil](imagens/23-dragao-fogo.jpg)
*O dragão cospe fogo no covil*

## 7. Como se joga

### 7.1 Controles

| Ação | Teclado | Controle | Celular |
|---|---|---|---|
| Andar | WASD / setas | analógico | arrastar no lado esquerdo |
| Correr | Shift (segurar) | gatilho / analógico até o fim | arrastar até o fim |
| Atacar (3x = combo) | J / Z | A | ⚔ |
| Ataque giratório | K / X | X | 🌀 |
| Esquivar (correndo = dash) | L / C | B | 💨 |
| Defender (segurar) | I / V | LB | 🛡 |
| Pular (+ atacar no ar) | Espaço | Y | ⤴ |
| Magia: Raio de Luz | Q / U | RB | ✨ |
| Chuva de Estrelas | segurar Q / U e soltar | segurar RB | segurar ✨ |
| Interagir / ler / abrir | E / Enter | Select | botão que aparece |
| Pausar | Esc / P | Start | ⏸ |
| Pular cena | Tab | — | Pular cena |

### 7.2 Combate com espada

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

### 7.3 Magia

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

### 7.4 Vida, itens e progresso

- **Corações:**
  - Começam em 3 (6 metades), e cada baú de coração extra dá mais 1.
  - No Fácil, a Line ganha 1 coração a mais.
  - Com 1 coração ou menos, ela fica com a animação de exausta.
- **Coração no chão:** cura 1 coração. Às vezes cai dos inimigos.
- **Cristal azul:** +2 ◆ de magia. Também cai dos inimigos.
- **Fontes:** curam tudo, enchem a magia e viram ponto de retorno. Se a Line cair, ela volta para a última fonte bebida naquela área.
- **Água e fendas:** cair tira meio coração e devolve a Line para o último lugar seguro.
- **Salvamento automático:** ao entrar em cada área, ao abrir baús, acender cristais e beber das fontes. O botão **Continuar** retoma dali.

### 7.5 Dificuldade

| | Fácil 🌸 | Normal ⚔ | Difícil 🔥 |
|---|---|---|---|
| Vida dos chefes | 60% | 100% | 135% |
| Velocidade dos ataques | mais lentos (1,35×) | normal | mais rápidos (0,85×) |
| Corações extras | +1 | — | — |
| Chance de cair coração | 55% | 35% | 20% |
| Recarga da magia | 1,7× | 1× | 0,75× |
| Guarda aberta do Guardião | +30% | normal | −20% |
| Espada no Guardião com a guarda fechada | arranha um pouco | não | não |

A dificuldade fica salva no navegador e pode ser trocada a qualquer momento, também pela pausa.

## 8. Inimigos e chefes

### Sombra
- **Vida:** 3.
- **Comportamento:** vaga até ver a Line. Então persegue, se prepara e dá uma investida.
- **Defesa:** bloquear a investida deixa a sombra tonta.
- **Fraqueza:** leva dano extra da luz.
- **Onde aparece:** na floresta (depois da espada), nas ruínas (depois da magia) e na montanha.

### Fogo-fátuo
- **Vida:** 2.
- **Comportamento:** flutua, mantém distância, se prepara brilhando e atira um orbe lento, que dá para pular ou bloquear.
- **Onde aparece:** nas ruínas (azul) e na montanha (de fogo).

### Guardião de Pedra (chefe das ruínas)
- **Vida:** 14 no Normal.
- **Guarda:** a espada não fere a pedra. O Raio de Luz racha o cristal do peito e deixa o Guardião **tonto por 4,5 s**. Só então a espada funciona.
- **Ataques:**
  - **Pisão:** levanta os braços, com um círculo vermelho de aviso, e solta uma onda no chão. Precisa pular.
  - **Arremesso de pedra:** uma por vez. Dá para desviar ou bloquear.
- **Ajuda:** ao sair do atordoamento, ele solta um cristal de magia (e um coração, se a Line estiver fraca).

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
- **Ponto fraco:** depois de levar dano suficiente, ele fica atordoado e o peito brilha em azul. É o ponto fraco.
- **Fim da luta:** aparece o botão **GOLPE FINAL**.

## 9. Lista completa de animações

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

### 9.1 Primeiro encontro (prólogo)

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

### 9.2 Line — movimento

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

### 9.3 Line — combate

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

### 9.4 Line — emoções

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

### 9.5 Bell

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

### 9.6 Line e Bell juntas

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

### 9.7 Dragão

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

### 9.8 Magia e criaturas (novo)

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

### 9.9 Inimigos (novo)

| Código | O que é | Quadros | Loop | Status | Origem da arte atual |
|---|---|---:|:---:|---|---|
| `SHADOW_IDLE` | Sombra — parada *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `SHADOW_MOVE` | Sombra — andar *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `SHADOW_ATTACK` | Sombra — investida *(sugestão nova)* | 12 |  | ✏️ código / falta |  |
| `SHADOW_HIT` | Sombra — receber dano *(sugestão nova)* | 12 |  | ✏️ código / falta |  |
| `SHADOW_DEATH` | Sombra — desaparecer *(sugestão nova)* | 12 |  | ✏️ código / falta |  |

### 9.10 Efeitos

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

### 9.11 Bichos da fazenda

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

### 9.12 Personagens de apoio (novo)

| Código | O que é | Quadros | Loop | Status | Origem da arte atual |
|---|---|---:|:---:|---|---|
| `MAGO_IDLE` | Mago parado, respirando *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `MAGO_TALK` | Mago falando / gesticulando *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `MAGO_CAST` | Mago fazendo um feitiço *(sugestão nova)* | 12 |  | ✏️ código / falta |  |
| `SPIRIT_APPEAR` | Espírito das Ruínas aparecendo no altar *(sugestão nova)* | 12 |  | ✏️ código / falta |  |
| `SPIRIT_IDLE` | Espírito das Ruínas flutuando *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |
| `SPIRIT_TALK` | Espírito das Ruínas falando *(sugestão nova)* | 12 | sim | ✏️ código / falta |  |

*Na coluna Quadros, as animações ✅ mostram quantos quadros diferentes a arte atual tem. As que faltam mostram quantos quadros o jogo espera (é uma sugestão, pode vir com mais ou menos).*

### 9.13 O que ainda falta ter arte própria, por prioridade

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

## 10. Retratos dos diálogos

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

## 11. Cenário e objetos

> ⚠️ O cenário atual também é temporário: parte vem de pacotes de arte recebidos, parte é desenhada no código.

| Área | Já usa arte (temporária) | Ainda desenhado no código (precisa de arte) |
|---|---|---|
| Minas Shopping (prólogo) | ilustração do shopping, vinda do HTML do primeiro encontro | — |
| Playground (prólogo) | máquina de soco (recortada da animação `LINE_PUNCH_MACHINE`) | piso xadrez, paredes, fliperamas, painel, balcão de prêmios, placar da máquina |
| Túnel (prólogo) | ilustração do túnel, vinda do HTML do primeiro encontro | — |
| Fazendinha | casa (prancha Farmhouse), celeiro, galinheiro, moinho, poço, árvores e frutíferas, cerejeiras, horta (cenoura e tomate), feno, carroça, lampiões, píer, barco, girassóis, milho, trigo, arbustos, pedras, placa | chão de grama, caminho, água do lago, cercas, flores pequenas, mato, varal, mesa, casinha do Theo, tigela |
| Floresta | pinheiros e árvores | chão, raízes, riacho, espinheiros, baú, placas, pedras |
| Ruínas Encantadas | — | chão de lajes, paredes, pilares, cristais (apagado e aceso), altar com orbe, fonte, barreira de luz, lagos, baú |
| Montanha de Brasa | — | chão vulcânico, paredes, fendas, lava, tochas (apagada e acesa), portão de fogo, pedras, estalagmites, fonte, baú |
| Covil | — | chão, paredes, lava, estalagmites, jaula da Bell |

Pranchas de referência já recebidas ficam em `arte/referencias/`: fazenda, casa, dragões, Theo, pacote Line & Bell e tileset.

## 12. Efeitos visuais

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

Os códigos `FX_*` da seção 9.10 são para quando esses efeitos ganharem arte própria.

## 13. Como mandar arte nova

1. **Formatos aceitos:**
   - HTML de item (`LINE_BELL_ITEM_XX.html`, um PNG por quadro).
   - HTML de laboratório.
   - Pasta `arte/<grupo>/<CÓDIGO>/00.png, 01.png…`.
   - Uma **prancha**: imagem com vários quadros, que eu recorto.
2. **Nome:** o código precisa ser exatamente o da seção 9.
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

## 14. Estrutura técnica

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
| `game/js/mapas.js` | os mapas das 5 áreas da aventura |
| `game/js/cenario.js` | árvores, casa, objetos e ambiente |
| `game/js/animacoes.js` | catálogo de animações, substitutas e desenho dos sprites |
| `game/js/entrada.js` | teclado, controle, toque e dificuldade |
| `game/assets/` | folhas de sprites, retratos, cenário (inclui `cenario/encontro_*.webp` do prólogo) |
| `tools/extrair_sprites.py` | converte a arte recebida em folhas para o jogo |
| `tools/gerar_documentacao.py` | gera este documento |

### Como atualizar este documento
As tabelas de animações e o roteiro são gerados a partir do jogo. Para regerar, rode o jogo localmente, exporte o inventário e o roteiro e rode, com o jogo servido na porta 8765: `node tools/exportar_inventario.js inventario.json`, `python3 tools/extrair_roteiro.py roteiro.json` , `python3 tools/gerar_documentacao.py inventario.json roteiro.json` e, para a versão HTML, `python3 tools/gerar_documentacao_html.py`.

![No jogo, o menu Animações mostra a mesma lista, com prévia de cada uma](imagens/25-galeria.jpg)
*No jogo, o menu Animações mostra a mesma lista, com prévia de cada uma*

---

*Line & Bell: um jogo feito com carinho. Todas as animações e artes atuais são temporárias até a criação completa da arte final.*
