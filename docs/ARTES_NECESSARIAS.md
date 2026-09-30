# Line & Bell — Arte necessária

*Gerado a partir do jogo por `tools/doc_parte2.py`. O documento completo está em `LINE_E_BELL_DOCUMENTACAO.md`.*

## Arte necessária — lista completa

> Esta é a lista de **tudo o que precisa de arte** no jogo, das duas partes: personagens, armaduras, moradores, inimigos, chefes, cenário de cada fase, objetos, itens, interface, efeitos e dia/noite. Tudo que está hoje no jogo é **temporário** (emojis, desenhos no código ou arte provisória) e é trocado sozinho quando a arte com o código certo chega.

### Tamanho de cada imagem (pensando na tela cheia)

O jogo sempre mostra **400 unidades de altura** do mundo na tela e aumenta tudo para caber. Por isso o tamanho de cada coisa depende da tela: em **tela cheia num monitor 1080p** tudo aparece **2,7×** maior que no mundo; num monitor **4K** ou num notebook **retina** em tela cheia, **5,4×**. Uma imagem menor que isso é esticada e fica borrada.

- **Recomendado:** nítido até em 4K ou retina em tela cheia.
- **Mínimo:** nítido em tela cheia 1080p (o caso mais comum no PC).
- No celular deitado o jogo usa uns 780 px de altura (escala ≈ 2×), então o mínimo já basta.
- Uma unidade do mundo equivale a 1 pixel do tile de 32×32: um tile tem 32 unidades.

| Grupo | Imagem | No mundo (L×A) | Janela 1280×720 | Tela cheia 1080p | Tela cheia 1440p | 4K ou retina | **Recomendado** | Mínimo | Observação |
|---|---|---|---|---|---|---|---|---|---|
| Personagens | Line, Bell e as duas juntas (cada quadro) | 74×74 | 133×133 | 200×200 | 266×266 | 400×400 | **512×512** | 400×400 | corpo de pé com uns 62 de altura (≈ 85% do quadro), pés sempre na mesma linha. Os 1254×1254 que chegam hoje estão ótimos |
| Personagens | Line e Bell com armadura | 74×74 | 133×133 | 200×200 | 266×266 | 400×400 | **512×512** | 400×400 | mesmo quadro e mesma posição dos pés da versão sem armadura |
| Personagens | Moradores (Rosa, Bento, Zé, Lurdes, Tobias, Cora, Tião, Brisa) e Mago | 74×74 | 133×133 | 200×200 | 266×266 | 400×400 | **512×512** | 400×400 | adulto uns 56 de altura, o Pedrinho uns 42: no mesmo quadro da Line, para ficarem na proporção certa |
| Personagens | Espírito das Ruínas | 90×110 | 162×198 | 243×297 | 324×396 | 486×594 | **512×640** | 400×500 | flutua; deixe espaço embaixo para o brilho |
| Chefes | Dragão Vermelho (cada quadro) | 215×215 | 387×387 | 580×580 | 774×774 | 1161×1161 | **1024×1024** | 640×640 | o maior desenho do jogo; asas abertas cabem no quadro |
| Chefes | Colosso, Serpente, Grifo, Titã de Magma, Hidra, Tempestade | 200×200 | 360×360 | 540×540 | 720×720 | 1080×1080 | **1024×1024** | 640×640 | um quadro por pose; o Grifo de asas abertas usa o quadro todo |
| Chefes | Quimera Primordial | 200×200 | 360×360 | 540×540 | 720×720 | 1080×1080 | **1280×1280** | 800×800 | maior e mais detalhada: pode passar da borda do quadro nos golpes |
| Chefes | Guardião de Pedra | 110×110 | 198×198 | 297×297 | 396×396 | 594×594 | **640×640** | 384×384 |  |
| Inimigos | Sombra, fogos-fátuos (todos os elementos), morcego | 64×64 | 115×115 | 173×173 | 230×230 | 346×346 | **384×384** | 256×256 | o bicho ocupa uns 60% do quadro; o resto é brilho |
| Bichos | Vaca, cavalo | 58×58 | 104×104 | 157×157 | 209×209 | 313×313 | **384×384** | 256×256 | vaca uns 40 de altura, cavalo uns 50 |
| Bichos | Theo, porco, ovelha, gato, pato, galinhas | 36×36 | 65×65 | 97×97 | 130×130 | 194×194 | **256×256** | 160×160 | galinha uns 26 de altura; o Theo sentado uns 24 |
| Bichos | Pintinho | 36×36 | 65×65 | 97×97 | 130×130 | 194×194 | **256×256** | 128×128 | uns 14 de altura: pode vir no mesmo quadro da galinha, bem menor |
| Cenário | Tile de chão, parede, água, lama, vento, abismo | 32×32 | 58×58 | 86×86 | 115×115 | 173×173 | **128×128** | 96×96 | tem que emendar sem costura dos 4 lados; faça 3 ou 4 variações de cada |
| Cenário | Árvores (normal, frutífera, cerejeira, pinheiro, árvore morta do pântano) | 62×75 | 112×135 | 167×202 | 223×270 | 335×405 | **384×448** | 256×300 | hoje são 97×115: ficam borradas em tela cheia |
| Cenário | Arbustos, pedras, mato alto, flores | 33×33 | 59×59 | 89×89 | 119×119 | 178×178 | **192×192** | 128×128 | hoje uns 55×55 |
| Cenário | Casa da fazenda | 264×150 | 475×270 | 713×405 | 950×540 | 1426×810 | **1440×816** | 720×408 | hoje 501×280: a arte que mais precisa de resolução |
| Cenário | Celeiro, casas do vilarejo, casa da Cora e do Tião | 244×150 | 439×270 | 659×405 | 878×540 | 1318×810 | **1280×800** | 660×400 | a casa ocupa um bloco de 7×5 tiles |
| Cenário | Galinheiro, carroça, barco, píer | 114×70 | 205×126 | 308×189 | 410×252 | 616×378 | **640×384** | 320×192 |  |
| Cenário | Poço, moinho, fonte, bigorna, estação do carrinho | 54×70 | 97×126 | 146×189 | 194×252 | 292×378 | **320×384** | 160×192 |  |
| Cenário | Baú, placa, barril, lampião, caixa, poste do gancho | 32×40 | 58×72 | 86×108 | 115×144 | 173×216 | **192×224** | 96×112 | o baú precisa de 2 poses: fechado e aberto |
| Cenário | Cristal, tocha, farol do vento, pérola-cristal (apagado e aceso) | 32×64 | 58×115 | 86×173 | 115×230 | 173×346 | **192×384** | 96×192 | o aceso pode ter 4 a 6 quadros de brilho |
| Cenário | Pilar, altar, pilares dos elementos | 32×80 | 58×144 | 86×216 | 115×288 | 173×432 | **192×448** | 96×224 |  |
| Cenário | Barreira de luz, de raízes, parede de água, muro de vento (por tile) | 32×48 | 58×86 | 86×130 | 115×173 | 173×259 | **192×256** | 96×128 | emenda lado a lado |
| Cenário | Jaula da Bell | 70×90 | 126×162 | 189×243 | 252×324 | 378×486 | **384×512** | 192×256 |  |
| Efeitos | Impacto, faíscas, poeira, fumaça, brasas, lágrimas | 140×140 | 252×252 | 378×378 | 504×504 | 756×756 | **768×768** | 384×384 | o desenho fica no meio; o resto do quadro é transparente |
| Efeitos | Explosão, ponto fraco do dragão, corações | 300×300 | 540×540 | 810×810 | 1080×1080 | 1620×1620 | **1024×1024** | 640×640 | explosão é o maior efeito |
| Efeitos | Projéteis (estrela da Bell, luz, fogo, água, lama, pena, rocha) | 24×24 | 43×43 | 65×65 | 86×86 | 130×130 | **128×128** | 64×64 | com o brilho em volta |
| Efeitos | Aviso no chão (círculo de raiz, raio, bolha, poça de lava, poça de lama) | 96×96 | 173×173 | 259×259 | 346×346 | 518×518 | **512×512** | 256×256 | visto de cima, achatado |

**Interface** (estes não crescem com o mundo, crescem com a tela e com a densidade de pixels):

| Imagem | Tamanho na tela | **Recomendado** | Mínimo |
|---|---|---|---|
| Retratos dos diálogos (cada expressão) | 108×108 na tela (76×76 no celular) | **512×512** | 256×256 |
| Ícones dos itens, documentos e armaduras | 30×30 na mochila, 24×24 no HUD | **128×128** | 64×64 |
| Corações, escudos, gotas de magia, moeda | de 18 a 50 px, conforme a tela | **128×128** | 64×64 |
| Botões de toque (atacar, pular, 🔄…) | 62×62 (celular) | **192×192** | 128×128 |
| Relógio e moldura do HUD, barra de chefe | a barra tem até metade da largura da tela | **1600×64 (barra) · 256×64 (relógio)** | 800×32 · 128×32 |
| Fundos de tela cheia (título, Parte 2, capítulos, fundos do prólogo) | a tela inteira | **3840×2160** | 1920×1080 |
| Fundos do prólogo com close | a câmera aproxima até 1,6× | **3840×2160, sem nada importante a menos de 10% da borda** | 2560×1440 |
| Mapa do mundo (pergaminho) | até 900 px de largura na janela da mochila | **2400×1500** | 1600×1000 |

**Regras que valem para todas:** fundo transparente de verdade (PNG), sem sombra no chão (o jogo desenha), todos os quadros de uma animação do mesmo tamanho, com os pés na mesma linha, e as animações de lado viradas para a direita.

> ⚙️ **Observação técnica:** hoje o jogo guarda cada quadro dos personagens em 256×256 e cada quadro do dragão em 448×448. Isso fica nítido até 1440p. Para aproveitar a arte em 4K e retina, dá para subir esses tamanhos (pede só gerar as folhas de novo), com o custo de o jogo carregar um pouco mais devagar.

### Resumo das animações

| Grupo | Animações | Com arte | Usando substituta | Faltando |
|---|---|---|---|---|
| Primeiro encontro (prólogo) | 8 | 8 | 0 | 0 |
| Line — movimento | 31 | 31 | 0 | 0 |
| Line — combate | 27 | 27 | 0 | 0 |
| Line — emoções | 10 | 10 | 0 | 0 |
| Bell | 34 | 34 | 0 | 0 |
| Line e Bell juntas | 26 | 18 | 8 | 0 |
| Dragão | 27 | 26 | 1 | 0 |
| Magia e criaturas (novo) | 13 | 13 | 0 | 0 |
| Inimigos (novo) | 5 | 5 | 0 | 0 |
| Efeitos | 13 | 13 | 0 | 0 |
| Bichos da fazenda | 67 | 59 | 0 | 8 |
| Personagens de apoio (novo) | 6 | 6 | 0 | 0 |
| Bell jogável (Parte 2) | 18 | 0 | 18 | 0 |
| Chefe: Colosso de Raízes (Parte 2) | 12 | 0 | 0 | 12 |
| Chefe: Serpente das Marés (Parte 2) | 11 | 0 | 0 | 11 |
| Chefe: Grifo da Tempestade (Parte 2) | 11 | 0 | 0 | 11 |
| Chefe: Titã de Magma (Parte 2) | 11 | 0 | 0 | 11 |
| Chefe: Hidra de Lama (Parte 2) | 12 | 0 | 0 | 12 |
| Chefe: Tempestade Viva (Parte 2) | 12 | 0 | 0 | 12 |
| Chefe: Quimera Primordial (Parte 2) | 22 | 0 | 0 | 22 |
| Fogos-fátuos dos elementos (Parte 2) | 9 | 0 | 9 | 0 |
| Moradores (todos, incluindo os da Parte 2) | 30 | 0 | 0 | 30 |
| Dragão amigo (Parte 2) | 3 | 0 | 3 | 0 |
| Line com armadura: Túnica Acolchoada | 23 | 0 | 23 | 0 |
| Line com armadura: Cota de Malha | 23 | 0 | 23 | 0 |
| Line com armadura: Armadura de Brasa | 23 | 0 | 23 | 0 |
| Bell com armadura: Vestido Reforçado | 21 | 0 | 21 | 0 |
| Bell com armadura: Manto Estelar | 21 | 0 | 21 | 0 |
| Bell com armadura: Armadura da Aurora | 21 | 0 | 21 | 0 |
| Outras animações recebidas | 3 | 3 | 0 | 0 |
| **Total** | **553** | **253** | **171** | **129** |

A lista com cada código está na seção 10 e, só com o que falta, em `ANIMACOES_PENDENTES.md`.

### Line e Bell (personagens principais)

- **Line:** todas as animações `LINE_*` da seção 10 (andar, correr, combate, magia, emoções, cenas).
- **Bell:** as animações `BELL_*` de antes (cenas, jaula, emoções) **e as novas da Bell jogável**: guarda, estrela, leque, estrela no ar, canção, escudo de luz, esquiva, arrancada, dano, queda, cansada, agachar, decidida, comemoração e falando (grupo *Bell jogável (Parte 2)*). Enquanto não chegam, o jogo usa outras poses dela (ex.: o “toca aqui” para atirar a estrela, a dança para o leque).
- **Retratos dos diálogos:** as 9 expressões de cada uma (seção 11) — faltam Bell brava, Bell chorando e Line envergonhada. **Opcional:** um retrato de cada com armadura.

**Com armadura** — cada armadura precisa do mesmo conjunto de animações principais, com o nome da armadura no código (ex.: `LINE_MALHA_WALK_RIGHT`). Primeiro as de andar/correr/parada nas 4 direções, depois as de combate:

| Heroína | Armadura | Prefixo | Animações pedidas |
|---|---|---|---|
| Line | Túnica Acolchoada | `LINE_TUNICA_…` | 23: `ATTACK_COMBO`, `ATTACK_HORIZONTAL`, `ATTACK_SPIN`, `ATTACK_VERTICAL`, `BLOCK`, `CAST_SPELL`, `COMBAT_IDLE`, `DODGE`, `HIT_LIGHT`, `IDLE`, `JUMP`, `KNOCKDOWN`, `RUN`, `WALK` |
| Line | Cota de Malha | `LINE_MALHA_…` | 23: `ATTACK_COMBO`, `ATTACK_HORIZONTAL`, `ATTACK_SPIN`, `ATTACK_VERTICAL`, `BLOCK`, `CAST_SPELL`, `COMBAT_IDLE`, `DODGE`, `HIT_LIGHT`, `IDLE`, `JUMP`, `KNOCKDOWN`, `RUN`, `WALK` |
| Line | Armadura de Brasa | `LINE_BRASA_…` | 23: `ATTACK_COMBO`, `ATTACK_HORIZONTAL`, `ATTACK_SPIN`, `ATTACK_VERTICAL`, `BLOCK`, `CAST_SPELL`, `COMBAT_IDLE`, `DODGE`, `HIT_LIGHT`, `IDLE`, `JUMP`, `KNOCKDOWN`, `RUN`, `WALK` |
| Bell | Vestido Reforçado | `BELL_VESTIDO_…` | 21: `ATTACK_SPREAD`, `ATTACK_STAR`, `BLOCK`, `COMBAT_IDLE`, `DODGE`, `HIT`, `IDLE`, `JUMP`, `KNOCKDOWN`, `RUN`, `SING`, `WALK` |
| Bell | Manto Estelar | `BELL_ESTELAR_…` | 21: `ATTACK_SPREAD`, `ATTACK_STAR`, `BLOCK`, `COMBAT_IDLE`, `DODGE`, `HIT`, `IDLE`, `JUMP`, `KNOCKDOWN`, `RUN`, `SING`, `WALK` |
| Bell | Armadura da Aurora | `BELL_AURORA_…` | 21: `ATTACK_SPREAD`, `ATTACK_STAR`, `BLOCK`, `COMBAT_IDLE`, `DODGE`, `HIT`, `IDLE`, `JUMP`, `KNOCKDOWN`, `RUN`, `SING`, `WALK` |

Descrição visual de cada armadura: seção 19.3. **Ícones** de cada armadura para a loja e o HUD (6 ícones).

### Moradores e personagens de apoio

| Personagem | Onde | Como é | Animações |
|---|---|---|---|
| **Dona Cora** | Parte 2 · Vale das Raízes | Jardineira idosa, irmã do Seu Zé. Coque branco, chapéu de palha, vestido marrom com avental cor de trigo sujo de terra, pele morena, sorriso largo. Segura uma pá pequena. | `CORA_IDLE`, `CORA_TALK`, `CORA_SLEEP` (+ extras na seção 10) · retrato |
| **Seu Tião** | Parte 2 · Lago Espelhado | Pescador de barba grisalha, chapéu de palha claro, camisa azul arregaçada, vara de pescar no ombro, balde ao lado. Fala alto e ri fácil. | `TIAO_IDLE`, `TIAO_TALK`, `TIAO_SLEEP` (+ extras na seção 10) · retrato |
| **Vó Brisa** | Parte 2 · Picos do Vento | Pastora bem velhinha e firme, cabelo branco solto voando com o vento, xale lilás-claro, avental branco, cajado de pastor. Ovelhas por perto (pode reaproveitar `SHEEP_*`). | `BRISA_IDLE`, `BRISA_TALK`, `BRISA_SLEEP` (+ extras na seção 10) · retrato |
| **Dona Rosa** | Vilarejo · loja | Mercadora de coque grisalho, vestido rosa com avental creme. Barraca com potes de poção. | `ROSA_IDLE`, `ROSA_TALK`, `ROSA_SLEEP` (+ extras na seção 10) · retrato |
| **Seu Bento** | Vilarejo · ferraria | Ferreiro de barba escura, avental de couro, martelo na mão, braços fortes. | `BENTO_IDLE`, `BENTO_TALK`, `BENTO_SLEEP` (+ extras na seção 10) · retrato |
| **Seu Zé** | Vilarejo | Idoso de cabelo branco, chapéu de palha, bengala, camisa verde. | `ZE_IDLE`, `ZE_TALK`, `ZE_SLEEP` (+ extras na seção 10) · retrato |
| **Dona Lurdes** | Vilarejo | Mulher do caçador, vestido lilás com avental, cabelo castanho preso. | `LURDES_IDLE`, `LURDES_TALK`, `LURDES_SLEEP` (+ extras na seção 10) · retrato |
| **Pedrinho** | Vilarejo | Menino de camiseta amarela, cabelo escuro bagunçado, corre o tempo todo. | `PEDRO_IDLE`, `PEDRO_TALK`, `PEDRO_SLEEP` (+ extras na seção 10) · retrato |
| **Tobias** | Montanha de Brasa | Caçador de barba, chapéu marrom, colete de couro, pé enfaixado. | `TOBIAS_IDLE`, `TOBIAS_TALK`, `TOBIAS_SLEEP` (+ extras na seção 10) · retrato |
| **Mago** | Floresta | (Parte 1) | `MAGO_*` · retrato |
| **Espírito das Ruínas** | Ruínas | (Parte 1) | `SPIRIT_*` · retrato |
| **Dragão amigo** | Fazenda (Parte 2) | O mesmo dragão, com olhar calmo | `DRAGON_TALK`, `DRAGON_BOW`, `DRAGON_CURL_SLEEP` · retrato |
| **Guardiões libertados** | Vale, lago, picos | Colosso, Serpente e Grifo nas cores verdadeiras | `COLOSSO_FREED`, `SERPENTE_FREED`, `GRIFO_FREED` · retratos |

**Retratos que faltam (personagens):** Mago, Espírito, Guardião de Pedra, Dragão, Dona Rosa, Seu Bento, Seu Zé, Dona Lurdes, Pedrinho, Tobias, Dona Cora, Seu Tião, Vó Brisa, Colosso, Serpente, Grifo, Titã de Magma, Hidra, Tempestade Viva e Quimera.

### Inimigos

| Inimigo | Onde | Arte |
|---|---|---|
| Sombra | floresta, ruínas, montanha, vale, lago, picos (e as que o Colosso chama) | `SHADOW_*` |
| Fogo-fátuo azul e de fogo | ruínas, gruta, montanha | `WISP_*` |
| **Fogo-fátuo de terra** (verde-musgo, cospe torrão) | Vale das Raízes | `WISP_EARTH_IDLE/ATTACK/DEATH` |
| **Fogo-fátuo de água** (azul, cospe gota) | Lago Espelhado | `WISP_WATER_IDLE/ATTACK/DEATH` |
| **Fogo-fátuo de ar** (branco, atira pena) | Picos do Vento | `WISP_AIR_IDLE/ATTACK/DEATH` |
| Morcego | Minas | desenhado no código (sem código de arte ainda) |

### Chefes

Cada chefe tem: dormindo, parado, acordando, um ataque genérico, **uma animação por golpe**, cansado (núcleo exposto), dano, derrota e — nos guardiões — libertado. Tamanho sugerido: quadros de 512×512 com o corpo ocupando uns 400 px (como o dragão); a Quimera pode ser maior. Não precisa desenhar sombra no chão: o jogo desenha (inclusive a dos chefes voadores).

| Chefe | Códigos | Aparência |
|---|---|---|
| **Colosso de Raízes** | `COLOSSO_SLEEP`, `COLOSSO_IDLE`, `COLOSSO_WAKE`, `COLOSSO_ATTACK`, `COLOSSO_ROOTS`, `COLOSSO_THORNS`, `COLOSSO_MUD`, `COLOSSO_SUMMON`, `COLOSSO_STUNNED`, `COLOSSO_HIT`, `COLOSSO_DEATH`, `COLOSSO_FREED` | Gigante de terra e madeira do tamanho de uma casa: tronco de árvore como corpo, braços de raízes grossas, musgo nos ombros e uma **flor no peito** (o núcleo) que se abre quando ele cansa. **Corrompido:** folhas pretas nas costas, olhos roxos e fumaça colorida saindo das rachaduras. **Libertado (`COLOSSO_FREED`):** folhas verdes, flores brancas brotando, olhos âmbar, sorriso tranquilo. |
| **Serpente das Marés** | `SERPENTE_SLEEP`, `SERPENTE_IDLE`, `SERPENTE_WAKE`, `SERPENTE_ATTACK`, `SERPENTE_DIVE`, `SERPENTE_WATER_JET`, `SERPENTE_WAVE`, `SERPENTE_STUNNED`, `SERPENTE_HIT`, `SERPENTE_DEATH`, `SERPENTE_FREED` | Serpente-marinha longa, azul com barriga turquesa, barbatanas translúcidas nas costas e uma crista de coral. Mergulha e só a cabeça e parte do corpo aparecem. **Corrompida:** água turva marrom escorrendo, manchas escuras nas escamas, olhos brancos sem pupila. **Libertada:** escamas brilhando como espelho, olhos azul-claro. |
| **Grifo da Tempestade** | `GRIFO_SLEEP`, `GRIFO_IDLE`, `GRIFO_WAKE`, `GRIFO_ATTACK`, `GRIFO_GUST`, `GRIFO_FEATHERS`, `GRIFO_LIGHTNING`, `GRIFO_STUNNED`, `GRIFO_HIT`, `GRIFO_DEATH`, `GRIFO_FREED` | Águia-leão cinza e branca com asas enormes (abertas ocupam 2× o corpo), penas das asas com faíscas elétricas nas pontas, garras douradas. Voa a maior parte da luta e pousa quando cansa. **Corrompido:** penas eriçadas cinza-chumbo, olhos vermelhos, raios roxos. **Libertado:** penas brancas, olhos dourados, brisa suave em volta. |
| **Titã de Magma** | `MAGMA_SLEEP`, `MAGMA_IDLE`, `MAGMA_WAKE`, `MAGMA_ATTACK`, `MAGMA_SLAM`, `MAGMA_FIRE_RAIN`, `MAGMA_THROW`, `MAGMA_FIRE_FAN`, `MAGMA_STUNNED`, `MAGMA_HIT`, `MAGMA_DEATH` | Titã de pedra do Guardião (mesmo estilo das ruínas) todo rachado, com **lava escorrendo pelas rachaduras** e um **coração de fogo** no peito (o núcleo). Braços de rocha que batem no chão, pedaços de pedra flutuando nos ombros. Cheio de brasas subindo. Quando cansa, a casca se abre e o coração fica exposto, pulsando. |
| **Hidra de Lama** | `HIDRA_SLEEP`, `HIDRA_IDLE`, `HIDRA_WAKE`, `HIDRA_ATTACK`, `HIDRA_ROOTS`, `HIDRA_WATER_JET`, `HIDRA_WAVE`, `HIDRA_DIVE`, `HIDRA_MUD`, `HIDRA_STUNNED`, `HIDRA_HIT`, `HIDRA_DEATH` | Três cabeças de serpente feitas de lama e raízes saindo de um charco. O corpo fica afundado; as cabeças se mexem separadas (uma cospe lama, outra água, a do meio morde). Olhos amarelos, bocas escorrendo lama. Quando cansa, as três cabeças afundam e só o núcleo (uma bolha de lama brilhante) aparece. |
| **Tempestade Viva** | `TEMPESTADE_SLEEP`, `TEMPESTADE_IDLE`, `TEMPESTADE_WAKE`, `TEMPESTADE_ATTACK`, `TEMPESTADE_LIGHTNING`, `TEMPESTADE_GUST`, `TEMPESTADE_WATER_JET`, `TEMPESTADE_WAVE`, `TEMPESTADE_FEATHERS`, `TEMPESTADE_STUNNED`, `TEMPESTADE_HIT`, `TEMPESTADE_DEATH` | Uma nuvem escura com rosto (olhos brancos brilhantes e boca de trovão), braços de vento em espiral, chuva caindo por baixo e raios entre as nuvens. Paira no ar. No centro fica o **olho da tempestade**, um redemoinho claro que é o núcleo. Quando cansa, desce ao chão e o olho abre. |
| **Quimera Primordial** | `QUIMERA_SLEEP`, `QUIMERA_IDLE`, `QUIMERA_WAKE`, `QUIMERA_ATTACK`, `QUIMERA_SLAM`, `QUIMERA_THROW`, `QUIMERA_FIRE_RAIN`, `QUIMERA_FIRE_FAN`, `QUIMERA_ROOTS`, `QUIMERA_THORNS`, `QUIMERA_MUD`, `QUIMERA_DIVE`, `QUIMERA_WATER_JET`, `QUIMERA_WAVE`, `QUIMERA_GUST`, `QUIMERA_FEATHERS`, `QUIMERA_LIGHTNING`, `QUIMERA_STUNNED`, `QUIMERA_HIT`, `QUIMERA_DEATH`, `QUIMERA_PHASE`, `QUIMERA_CALM` | A fera final, feita de pedaços roubados de todos os guardiões: corpo de pedra com rachaduras de lava (pedra + fogo), juba de raízes e folhas pretas (terra), cauda de serpente d’água (água), asas de grifo (ar) e um **núcleo no peito que muda de cor** a cada fase — cinza/laranja (pedra e fogo), verde/azul (terra e água) e arco-íris pulsando (todos). Maior que o dragão. No final, acalmada (`QUIMERA_CALM`), encolhe e fica parecendo um filhote triste, quase fofo. |
| Guardião de Pedra (Parte 1) | `GOLEM_*` | já catalogado |
| Dragão Vermelho (Parte 1) | `DRAGON_*` | arte nova recebida |

### Cenário de cada fase

Chão, paredes e objetos. Cada tile é de 32×32 no jogo (pode vir em 64×64). Objetos com altura (casas, árvores, pilares, faróis) vêm como imagem inteira, com a base na linha de baixo.

**Parte 1:**

| Área | Já tem arte (temporária) | Precisa de arte |
|---|---|---|
| Fazendinha | casa, celeiro, galinheiro, moinho, poço, árvores e frutíferas, cerejeiras, horta, feno, carroça, lampiões, píer, barco, girassóis, milho, trigo, arbustos, pedras, placa | chão de grama, caminho, água do lago, cercas, flores pequenas, mato, varal, mesa, casinha do Theo, tigela; **dragão dormindo enrolado perto da casa** (Parte 2) |
| Vilarejo do Riacho | — | chão, casas coloridas, barraca da feira, bigorna, fonte da praça, quadro de avisos, riacho, estação do carrinho, trilhos, **estrada nova para o leste (Parte 2)**, janelas acesas e lampiões à noite |
| Floresta Sussurrante | pinheiros e árvores | chão, raízes, riacho, espinheiros, baú, placas, pedras, cabana do caçador, lago com ilha, postes do gancho, pedra rachada |
| Gruta dos Ecos e Minas | — | chão e paredes azuladas, água funda, estalagmites, cogumelos luminosos, fonte, porta de ferro, baús, trilhos, estação, abismo |
| Ruínas Encantadas | — | chão de lajes, paredes, pilares, cristais (apagado e aceso), altar com orbe, fonte, barreira de luz, lagos, baú |
| Montanha de Brasa | — | chão vulcânico, paredes, fendas, lava, tochas (apagada e acesa), portão de fogo, bigorna da forja, brasa rasa, estação |
| Covil do Dragão | — | chão, paredes, lava, estalagmites, jaula da Bell |

**Parte 2 (tudo novo, tudo desenhado no código hoje):**

| Fase | Visual geral | Tiles e objetos | Ambientação |
|---|---|---|---|
| **Vale das Raízes (Terra)** | Grama dourada-esverdeada de fim de verão, caminhos de terra batida, bosque de árvores largas. | chão de grama do vale (3 variações) e caminho de terra; raízes grossas atravessando o chão (tile `r`, correr derruba); lama (tile `u`, deixa lenta): charco marrom com reflexo; casa da Dona Cora (telhado de sapê, chaminé) e a horta de raízes; 3 **cristais de terra** (apagado: pedra verde opaca; aceso: verde-limão brilhando); anel de pedras do ninho do Colosso e a **barreira de raízes** (raízes entrelaçadas que recolhem ao abrir); fonte do vale; placas; baús; pedra rachada do recanto sudeste (bomba); flores do campo, mato alto, árvores do vale | borboletas, pássaros, folhas caindo; à noite, vaga-lumes e a janela da casa da Cora acesa |
| **Fenda de Magma (Pedra + Fogo)** | Caverna vulcânica: rocha escura avermelhada, rios de lava nas bordas. | chão de rocha vulcânica e paredes; lava (tile `L`) e **brasa rasa** (tile `l`); estalagmites; fonte das brasas; placa | brasas subindo, calor tremendo o ar, vinheta vermelha |
| **Lago Espelhado (Água)** | Margens verdes, água azul muito limpa (depois da vitória) ou turva (antes), uma ilha no meio. | grama da margem e areia da beira d’água; água rasa (riacho `w`, pula) e funda (`~`); ponte de madeira até a ilha; **parede de água** da ponte (barreira que cai como cachoeira ao abrir); 3 **pérolas-cristal** (conchas com pérola; apagada: cinza; acesa: azul brilhando); casa e píer do Seu Tião, barco, redes; fonte do lago; placas, baús, flores | reflexos animados na água, patos (`DUCK_*`), bolhas onde a Serpente nada; à noite, estrelas refletidas no lago |
| **Pântano Sombrio (Terra + Água)** | Charco verde-escuro, árvores mortas, névoa baixa. | grama escura encharcada; lama (tile `u`); água parada verde-escura; árvores retorcidas sem folhas; fonte, placa, baú | garoa constante, vaga-lumes verdes, névoa, sapos (arte opcional) |
| **Picos do Vento (Ar)** | Platôs de pedra clara acima das nuvens, abismo de céu entre eles. | chão de pedra clara e bordas de penhasco; **abismo de céu** (tile `j`): nuvens lá embaixo, céu azul; **corrente de vento** (tiles `>` e `<`): riscos brancos animados no chão; 3 **faróis do vento** (tocha alta; apagado: pedra; aceso: chama branco-azulada); muro do ninho do Grifo e a barreira; pedras, estalagmites, fonte, placas, baús; ninho do Grifo (galhos e penas) | nuvens passando por baixo, pássaros, penas voando; ovelhas da Vó Brisa |
| **Olho da Tempestade (Água + Ar)** | Ilha de pedra escura cercada de céu de tempestade. | chão de lajes azul-escuras molhadas; abismo de céu escuro com nuvens de chuva; fonte, placa | chuva forte inclinada, relâmpagos que clareiam a tela, poças |
| **Coração dos Elementos (todos)** | Salão de cristal roxo no alto dos picos, com cinco pilares, um por elemento. | chão de lajes roxas; paredes de cristal escuro; 5 **pilares dos elementos** (pedra, fogo, terra, água, ar — cada um com o símbolo e a cor); fonte, placa; portal de entrada (abre depois das três junções) | partículas das cinco cores flutuando, vinheta roxa; no final, as cinco luzes subindo ao céu |

**Objetos que aparecem em várias fases:** baú (fechado/aberto), placa, fonte (e o brilho de descanso à noite), barreira de luz (e as variações de raízes, parede de água e muro de vento), porta de ferro, parede/pedra rachada, poste do gancho, trilhos e estação, bigorna, documentos no chão, moedas no chão, coração e cristal de magia caídos.

### Itens, moedas e documentos

| Item | Hoje | Precisa |
|---|---|---|
| Poção de Vida | 🧪 (emoji) | ícone 32×32 e 64×64 para a mochila; desenho no chão/na mão |
| Elixir de Luz | 💧 (emoji) | ícone 32×32 e 64×64 para a mochila; desenho no chão/na mão |
| Bomba | 💣 (emoji) | ícone 32×32 e 64×64 para a mochila; desenho no chão/na mão |
| Pena de Fênix | 🪶 (emoji) | ícone 32×32 e 64×64 para a mochila; desenho no chão/na mão |
| Chave antiga | 🗝️ (emoji) | ícone 32×32 e 64×64 para a mochila; ícone na lista |
| Lanterna | 🏮 (emoji) | ícone 32×32 e 64×64 para a mochila; ícone na lista |
| Gancho | 🪝 (emoji) | ícone 32×32 e 64×64 para a mochila; ícone na lista |
| Bússola do Mago | 🧭 (emoji) | ícone 32×32 e 64×64 para a mochila; ícone na lista |
| Botas de Andarilha | 👢 (emoji) | ícone 32×32 e 64×64 para a mochila; ícone na lista |
| Alavanca de Ferro | ⚙️ (emoji) | ícone 32×32 e 64×64 para a mochila; ícone na lista |
| Escama da Terra | 🟢 (emoji) | ícone 32×32 e 64×64 para a mochila; ícone na lista |
| Escama da Água | 🔵 (emoji) | ícone 32×32 e 64×64 para a mochila; ícone na lista |
| Pena-escama do Ar | ⚪ (emoji) | ícone 32×32 e 64×64 para a mochila; ícone na lista |
| Moedas | desenho no código | moeda girando (4 quadros) e o saquinho do HUD |

**Documentos (15):** um ícone para cada (hoje emoji) e, se possível, uma **ilustração do papel** para a tela de leitura (carta dobrada, pergaminho, cartaz, diário, relatório, receita, mapa rasgado, fita, escama, pena…): Marcas de garra no píer, Cartaz do vilarejo, Carta do Mago, Bilhete do caçador, A lenda da Montanha, Mapa rasgado, Relatório do capataz, Diário do Guardião, página 1, Diário do Guardião, página 2, Receita da Armadura de Brasa, Escama vermelha, Fita de cabelo da Bell, Diário da Dona Cora, Canção das águas, Pena de tempestade.

### Interface (HUD, menus e telas)

- **Corações** (cheio, meio, vazio), **escudos** (cheio e vazio) e **gotas de magia**.
- **Relógio:** moldura do topo, ícones de sol, sol nascendo/se pondo e lua, e o número do dia.
- **Vida da outra heroína:** mini-retrato da Line e da Bell para o painel pequeno.
- **Botões de toque:** atacar, giro/leque, esquivar, pular, defender, magia/canção, poção, item, mochila, pausa e **🔄 trocar heroína** (com a cara de quem entra).
- **Seta guia do Fácil** (dourada) e o balão de dica 💡.
- **Barra de chefe** com moldura e o ícone do elemento (pedra, fogo, terra, água, ar e o da Quimera), e a versão “núcleo exposto”.
- **Mapa do mundo:** ilustração em pergaminho com as 14 regiões (7 da Parte 1 e 7 da Parte 2), cada uma com um brasão: 🏡 🏘️ 🌲 🕳️ 🏛️ 🌋 🐉 🌾 🌋 🌊 🐸 🏔️ ⛈️ 💠.
- **Mapa da área:** cores/ícones de baú, fonte, placa, altar, cristal, tocha, farol, pérola, porta, estação, morador e alfinete.
- **Telas:** título do jogo, título “Parte 2 — O Coração dos Elementos”, títulos de capítulo, tela de derrota (“As duas caíram…”), loja e ferraria (fundo de balcão), leitor de documentos, “Fim da Parte 2”.

### Efeitos

- **Bell:** estrela rosa (projétil + brilho ao sair), leque de três estrelas de luz, **notas musicais coloridas** da canção, anel rosa da canção, escudo de luz, brilho da troca de heroína.
- **Chefes:** projéteis de lama, água, pena, rocha e bola de fogo; **avisos no chão** de cada estilo (raiz rachando a terra, bolha de água, círculo de raio, anel de espinhos, poça de lava, poça de lama); rajada de vento; relâmpago; poça borbulhando; núcleo exposto brilhando; guardião libertado (luz da cor do elemento); mudança de fase da Quimera; as cinco luzes subindo no final.
- **Fases:** riscos de vento no chão (animado), chuva e respingos, relâmpago na tela, névoa do pântano, brasas da fenda, nuvens passando embaixo dos picos, partículas das cinco cores no Coração.
- **Dia e noite:** vaga-lumes (amarelos, verdes e roxos), estrelas no céu, janelas e lampiões acesos à noite, brilho da fonte ao descansar, tons de amanhecer e entardecer.
- Os efeitos da Parte 1 continuam na seção 13 (`FX_*`).

### Cenário do Minas Shopping (item 140) — medidas combinadas

> 🔒 **Trava:** cenário **não** passa pelo recorte de animação (os quadros de 1254×1254 que viram células de 256). O extrator deixa o item 140 de fora de propósito; ele entra à mão, com as medidas abaixo.

**Como o Minas Shopping funciona no jogo:** é **uma ilustração inteira** (não é feita de tiles), em pé, na proporção **9:16**. Tudo no jogo foi posicionado numa **base de 360×640** (a tela do HTML do primeiro encontro): onde a Line começa, onde a Bell espera, a mesa do BK, a saída e os dois closes. Por isso a nova arte precisa manter **exatamente essa proporção**, só que maior.

| Medida | Valor |
|---|---|
| Base de coordenadas | 360×640 (proporção 9:16, em pé) |
| Tamanho no mundo do jogo | 480×853 unidades (mapa de 15×27 tiles de 32) |
| **Entrega recomendada** | **2160×3840** (6× a base): nítido em tela cheia 1440p e nos closes em 1080p |
| Para 4K | 2880×5120 (8× a base) |
| Mínimo | 1440×2560 (4× a base): nítido em tela cheia 1080p sem close |
| Grade de referência | 1 tile do jogo = 24 px da base = **144 px** na entrega de 2160×3840 (15 colunas; a altura não fecha em tiles inteiros, não precisa) |
| Escala das personagens | a Line de pé tem **47 px da base = 281 px** na entrega de 2160×3840; a mesa, as cadeiras e as portas seguem essa medida |
| Área andável (chão livre) | x 28–332, y 130–545 na base (**x 168–1992, y 780–3270** na entrega de 2160×3840): nada alto no chão dentro dela |
| Fundo (vitrines, escada rolante, andar de cima) | faixa de cima, y 0–130 da base |
| Pontos da história (base) | Line começa (48,520) · Bell espera (274,300) · Line na mesa (142,397) · Bell na mesa (218,397) · mesa do BK (180,397) · saída (280,500) |
| Closes (câmera 1,6×) | o encontro, perto de (251,270), e a mesa do BK, perto de (180,367): os lugares com mais detalhe |
| Telas largas | o jogo preenche os lados com a própria imagem borrada: as bordas esquerda e direita devem continuar o cenário naturalmente (sem moldura) |

**Formato da entrega (o “recorte”):**

1. **Fundo:** uma imagem única, PNG ou WebP, **sem transparência**, sem grade e sem textos, na perspectiva de cima em 3/4 como o resto do jogo.
2. **Camada da frente (opcional):** o que deve passar **na frente** das personagens (pilares, vasos, grade do mezanino, encosto das cadeiras) vem num PNG separado, **do mesmo tamanho do fundo**, com transparência em todo o resto. O jogo desenha essa camada por cima das duas.
3. **Partes animadas (opcional):** luzes piscando, escada rolante e fonte vêm como animação separada, só do pedaço que mexe, com a posição (x, y) no fundo.
4. **Não** entregar em sequência de quadros de 1254×1254 nem como prancha de tiles.

O **gabarito** `arte/referencias/gabarito_minas_shopping_2160x3840.png` já está no tamanho certo, com a grade, a área andável, os pontos da história, os closes e a Line e a Bell em escala, por cima da ilustração atual, para desenhar em cima (gerado por `tools/gabarito_cenario.py`).

![Gabarito do Minas Shopping: área andável (verde), closes (rosa), pontos da história (amarelo) e a Line e a Bell em escala](imagens/gabarito-minas-shopping.jpg)
*Gabarito do Minas Shopping: área andável (verde), closes (rosa), pontos da história (amarelo) e a Line e a Bell em escala*

**Próximo lote:** item 138 (pato: `DUCK_IDLE`, `DUCK_WALK`, `DUCK_RUN`, `DUCK_SWIM`) e item 139 (gato: `CAT_IDLE`, `CAT_WALK`, `CAT_SLEEP`, `CAT_PURR`) já têm lugar no jogo e tamanho definido (pato uns 20 de altura, gato uns 18). Eles entram sozinhos no formato normal de item, como a galinha, o pintinho e a vaca.

### Dimensão de cada cenário

Cada fase do jogo é uma **grade de tiles** de 32×32 unidades do mundo. A arte do cenário pode chegar de dois jeitos, e as medidas abaixo valem para os dois:

- **Jeito A — tiles e objetos (recomendado para as fases):** cada tile de chão, parede, água e afins em **128×128 px** (mínimo 96×96), emendando dos 4 lados, mais os objetos soltos (árvores, casas, baús…) nos tamanhos da seção 22.0. O jogo monta o mapa sozinho a partir da planta. É o jeito mais leve e o que deixa mudar a fase depois sem redesenhar.
- **Jeito B — cenário pintado inteiro:** uma pintura da fase inteira, na escala de **128 px por tile** (4 px por unidade do mundo). Como fica grande demais para uma imagem só, ela é entregue em **blocos de 2048×2048 px** (16×16 tiles cada), sem sobreposição, com o nome `cenario_<fase>_<coluna>_<linha>.png` contando a partir de 0 no canto de cima à esquerda. Os blocos da última coluna e da última linha ficam menores (o que sobrar). Tudo o que é alto (árvores, casas, pilares) vai numa **camada da frente**, com os mesmos blocos e transparência no resto, para as personagens passarem atrás.

O **gabarito** de cada fase (a planta, em `arte/referencias/gabaritos/<fase>.png`, 32 px por tile) mostra a grade, o que é chão (verde), caminho (bege), parede ou mata (escuro), água (azul), lava (laranja), abismo (preto), lama (marrom), vento (branco) e cada objeto (quadradinho colorido), além das **saídas** (verde) e da divisão dos **blocos** de 2048 px (rosa). É só ampliar 4× para ter a medida da entrega. O ponto rosa é onde a heroína chega. Gerado por `tools/gabaritos_mapas.py`.

| Fase | Parte | Grade (tiles) | Mundo (unidades) | **Pintura inteira (128 px/tile)** | Mínimo (96 px/tile) | Blocos de 2048 px | Gabarito |
|---|---|---|---|---|---|---|---|
| **Fazendinha** | Parte 1 | 46×34 | 1472×1088 | **5888×4352** | 4416×3264 | 3×3 = 9 | `gabaritos/fazenda.png` |
| **Vilarejo do Riacho** | Parte 1 | 60×40 | 1920×1280 | **7680×5120** | 5760×3840 | 4×3 = 12 | `gabaritos/vilarejo.png` |
| **Floresta Sussurrante** | Parte 1 | 76×44 | 2432×1408 | **9728×5632** | 7296×4224 | 5×3 = 15 | `gabaritos/floresta.png` |
| **Gruta dos Ecos** | Parte 1 | 64×44 | 2048×1408 | **8192×5632** | 6144×4224 | 4×3 = 12 | `gabaritos/gruta.png` |
| **Ruínas Encantadas** | Parte 1 | 70×36 | 2240×1152 | **8960×4608** | 6720×3456 | 5×3 = 15 | `gabaritos/ruinas.png` |
| **Montanha de Brasa** | Parte 1 | 72×40 | 2304×1280 | **9216×5120** | 6912×3840 | 5×3 = 15 | `gabaritos/montanha.png` |
| **Covil do Dragão** | Parte 1 | 26×20 | 832×640 | **3328×2560** | 2496×1920 | 2×2 = 4 | `gabaritos/covil.png` |
| **Vale das Raízes** | Parte 2 | 64×42 | 2048×1344 | **8192×5376** | 6144×4032 | 4×3 = 12 | `gabaritos/vale.png` |
| **Fenda de Magma** | Parte 2 | 36×28 | 1152×896 | **4608×3584** | 3456×2688 | 3×2 = 6 | `gabaritos/fenda.png` |
| **Lago Espelhado** | Parte 2 | 64×42 | 2048×1344 | **8192×5376** | 6144×4032 | 4×3 = 12 | `gabaritos/lago.png` |
| **Pântano Sombrio** | Parte 2 | 38×28 | 1216×896 | **4864×3584** | 3648×2688 | 3×2 = 6 | `gabaritos/pantano.png` |
| **Picos do Vento** | Parte 2 | 64×42 | 2048×1344 | **8192×5376** | 6144×4032 | 4×3 = 12 | `gabaritos/picos.png` |
| **Olho da Tempestade** | Parte 2 | 36×28 | 1152×896 | **4608×3584** | 3456×2688 | 3×2 = 6 | `gabaritos/tempestade.png` |
| **Coração dos Elementos** | Parte 2 | 40×32 | 1280×1024 | **5120×4096** | 3840×3072 | 3×2 = 6 | `gabaritos/coracao.png` |

**Cenas do primeiro encontro (prólogo):** não são grades, são **ilustrações únicas** em pé, sempre na base de 360×640 (9:16), porque as posições da história foram marcadas nessa base (veja a seção 22.11):

| Cena | Base | **Entrega recomendada** | 4K | Mínimo | Observação |
|---|---|---|---|---|---|
| Minas Shopping (item 140) | 360×640 | **2160×3840** | 2880×5120 | 1440×2560 | gabarito pronto: `arte/referencias/gabarito_minas_shopping_2160x3840.png` |
| Playground | 360×640 | **2160×3840** | 2880×5120 | 1440×2560 | hoje é desenhado no código; a máquina de soco fica em (204,315) da base e vem à parte (é a da animação `LINE_PUNCH_MACHINE`) |
| Túnel | 360×640 | **2160×3840** | 2880×5120 | 1440×2560 | o beijo acontece perto de (193,520) da base, com câmera 1,6× |

**Telas inteiras** (título, “Parte 2”, capítulos, fim): 3840×2160 (16:9), mínimo 1920×1080, com o importante longe das bordas (em celular a tela corta um pouco dos lados).

**Por que 128 px por tile:** em tela cheia num monitor 1080p um tile aparece com 86 px e em 1440p com 115 px, então 128 fica nítido nos dois; em 4K ou retina (173 px) ainda fica bom. Com 96 px fica nítido em 1080p.

![Gabarito: Fazendinha (46×34 tiles)](imagens/gabarito-fazenda.jpg)
*Gabarito: Fazendinha (46×34 tiles)*

![Gabarito: Vilarejo do Riacho (60×40 tiles)](imagens/gabarito-vilarejo.jpg)
*Gabarito: Vilarejo do Riacho (60×40 tiles)*

![Gabarito: Floresta Sussurrante (76×44 tiles)](imagens/gabarito-floresta.jpg)
*Gabarito: Floresta Sussurrante (76×44 tiles)*

![Gabarito: Gruta dos Ecos (64×44 tiles)](imagens/gabarito-gruta.jpg)
*Gabarito: Gruta dos Ecos (64×44 tiles)*

![Gabarito: Ruínas Encantadas (70×36 tiles)](imagens/gabarito-ruinas.jpg)
*Gabarito: Ruínas Encantadas (70×36 tiles)*

![Gabarito: Montanha de Brasa (72×40 tiles)](imagens/gabarito-montanha.jpg)
*Gabarito: Montanha de Brasa (72×40 tiles)*

![Gabarito: Covil do Dragão (26×20 tiles)](imagens/gabarito-covil.jpg)
*Gabarito: Covil do Dragão (26×20 tiles)*

![Gabarito: Vale das Raízes (64×42 tiles)](imagens/gabarito-vale.jpg)
*Gabarito: Vale das Raízes (64×42 tiles)*

![Gabarito: Fenda de Magma (36×28 tiles)](imagens/gabarito-fenda.jpg)
*Gabarito: Fenda de Magma (36×28 tiles)*

![Gabarito: Lago Espelhado (64×42 tiles)](imagens/gabarito-lago.jpg)
*Gabarito: Lago Espelhado (64×42 tiles)*

![Gabarito: Pântano Sombrio (38×28 tiles)](imagens/gabarito-pantano.jpg)
*Gabarito: Pântano Sombrio (38×28 tiles)*

![Gabarito: Picos do Vento (64×42 tiles)](imagens/gabarito-picos.jpg)
*Gabarito: Picos do Vento (64×42 tiles)*

![Gabarito: Olho da Tempestade (36×28 tiles)](imagens/gabarito-tempestade.jpg)
*Gabarito: Olho da Tempestade (36×28 tiles)*

![Gabarito: Coração dos Elementos (40×32 tiles)](imagens/gabarito-coracao.jpg)
*Gabarito: Coração dos Elementos (40×32 tiles)*

### Ordem sugerida para produzir

1. **Bell jogável** (guarda, estrela, leque, canção, dano, queda) — é o que a jogadora mais vê na Parte 2.
2. **Os sete chefes** (parado, ataque genérico, cansado, derrota) — depois os golpes um a um.
3. **Tiles das fases novas** (chão, paredes, lama, vento, abismo de céu) e os objetos de puzzle (cristais de terra, pérolas, faróis).
4. **Moradores** (Cora, Tião, Brisa e os do vilarejo) e o **dragão amigo**.
5. **Armaduras** das duas (parada/andar/correr primeiro).
6. **Retratos** que faltam, ícones de itens e documentos, interface e efeitos.

