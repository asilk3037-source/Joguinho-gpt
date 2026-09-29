# Line & Bell — Arte necessária

*Gerado a partir do jogo por `tools/doc_parte2.py`. O documento completo está em `LINE_E_BELL_DOCUMENTACAO.md`.*

## Arte necessária — lista completa

> Esta é a lista de **tudo o que precisa de arte** no jogo, das duas partes: personagens, armaduras, moradores, inimigos, chefes, cenário de cada fase, objetos, itens, interface, efeitos e dia/noite. Tudo que está hoje no jogo é **temporário** (emojis, desenhos no código ou arte provisória) e é trocado sozinho quando a arte com o código certo chega.

### 1 Resumo das animações

| Grupo | Animações | Com arte | Usando substituta | Faltando |
|---|---|---|---|---|
| Primeiro encontro (prólogo) | 8 | 8 | 0 | 0 |
| Line — movimento | 31 | 29 | 2 | 0 |
| Line — combate | 27 | 19 | 8 | 0 |
| Line — emoções | 10 | 10 | 0 | 0 |
| Bell | 34 | 34 | 0 | 0 |
| Line e Bell juntas | 26 | 13 | 10 | 3 |
| Dragão | 27 | 24 | 3 | 0 |
| Magia e criaturas (novo) | 13 | 0 | 3 | 10 |
| Inimigos (novo) | 5 | 0 | 0 | 5 |
| Efeitos | 13 | 13 | 0 | 0 |
| Bichos da fazenda | 67 | 55 | 0 | 12 |
| Personagens de apoio (novo) | 6 | 0 | 0 | 6 |
| Bell jogável (Parte 2) | 18 | 0 | 18 | 0 |
| Chefe: Colosso de Raízes (Parte 2) | 12 | 0 | 0 | 12 |
| Chefe: Serpente das Marés (Parte 2) | 11 | 0 | 0 | 11 |
| Chefe: Grifo da Tempestade (Parte 2) | 11 | 0 | 0 | 11 |
| Chefe: Titã de Magma (Parte 2) | 11 | 0 | 0 | 11 |
| Chefe: Hidra de Lama (Parte 2) | 12 | 0 | 0 | 12 |
| Chefe: Tempestade Viva (Parte 2) | 12 | 0 | 0 | 12 |
| Chefe: Quimera Primordial (Parte 2) | 22 | 0 | 0 | 22 |
| Fogos-fátuos dos elementos (Parte 2) | 9 | 0 | 0 | 9 |
| Moradores (todos, incluindo os da Parte 2) | 30 | 0 | 0 | 30 |
| Dragão amigo (Parte 2) | 3 | 0 | 3 | 0 |
| Line com armadura: Túnica Acolchoada | 23 | 0 | 23 | 0 |
| Line com armadura: Cota de Malha | 23 | 0 | 23 | 0 |
| Line com armadura: Armadura de Brasa | 23 | 0 | 23 | 0 |
| Bell com armadura: Vestido Reforçado | 21 | 0 | 21 | 0 |
| Bell com armadura: Manto Estelar | 21 | 0 | 21 | 0 |
| Bell com armadura: Armadura da Aurora | 21 | 0 | 21 | 0 |
| Outras animações recebidas | 3 | 3 | 0 | 0 |
| **Total** | **553** | **208** | **179** | **166** |

A lista com cada código está na seção 10 e, só com o que falta, em `ANIMACOES_PENDENTES.md`.

### 2 Line e Bell (personagens principais)

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

### 3 Moradores e personagens de apoio

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

### 4 Inimigos

| Inimigo | Onde | Arte |
|---|---|---|
| Sombra | floresta, ruínas, montanha, vale, lago, picos (e as que o Colosso chama) | `SHADOW_*` |
| Fogo-fátuo azul e de fogo | ruínas, gruta, montanha | `WISP_*` |
| **Fogo-fátuo de terra** (verde-musgo, cospe torrão) | Vale das Raízes | `WISP_EARTH_IDLE/ATTACK/DEATH` |
| **Fogo-fátuo de água** (azul, cospe gota) | Lago Espelhado | `WISP_WATER_IDLE/ATTACK/DEATH` |
| **Fogo-fátuo de ar** (branco, atira pena) | Picos do Vento | `WISP_AIR_IDLE/ATTACK/DEATH` |
| Morcego | Minas | desenhado no código (sem código de arte ainda) |

### 5 Chefes

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

### 6 Cenário de cada fase

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

### 7 Itens, moedas e documentos

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

### 8 Interface (HUD, menus e telas)

- **Corações** (cheio, meio, vazio), **escudos** (cheio e vazio) e **gotas de magia**.
- **Relógio:** moldura do topo, ícones de sol, sol nascendo/se pondo e lua, e o número do dia.
- **Vida da outra heroína:** mini-retrato da Line e da Bell para o painel pequeno.
- **Botões de toque:** atacar, giro/leque, esquivar, pular, defender, magia/canção, poção, item, mochila, pausa e **🔄 trocar heroína** (com a cara de quem entra).
- **Seta guia do Fácil** (dourada) e o balão de dica 💡.
- **Barra de chefe** com moldura e o ícone do elemento (pedra, fogo, terra, água, ar e o da Quimera), e a versão “núcleo exposto”.
- **Mapa do mundo:** ilustração em pergaminho com as 14 regiões (7 da Parte 1 e 7 da Parte 2), cada uma com um brasão: 🏡 🏘️ 🌲 🕳️ 🏛️ 🌋 🐉 🌾 🌋 🌊 🐸 🏔️ ⛈️ 💠.
- **Mapa da área:** cores/ícones de baú, fonte, placa, altar, cristal, tocha, farol, pérola, porta, estação, morador e alfinete.
- **Telas:** título do jogo, título “Parte 2 — O Coração dos Elementos”, títulos de capítulo, tela de derrota (“As duas caíram…”), loja e ferraria (fundo de balcão), leitor de documentos, “Fim da Parte 2”.

### 9 Efeitos

- **Bell:** estrela rosa (projétil + brilho ao sair), leque de três estrelas de luz, **notas musicais coloridas** da canção, anel rosa da canção, escudo de luz, brilho da troca de heroína.
- **Chefes:** projéteis de lama, água, pena, rocha e bola de fogo; **avisos no chão** de cada estilo (raiz rachando a terra, bolha de água, círculo de raio, anel de espinhos, poça de lava, poça de lama); rajada de vento; relâmpago; poça borbulhando; núcleo exposto brilhando; guardião libertado (luz da cor do elemento); mudança de fase da Quimera; as cinco luzes subindo no final.
- **Fases:** riscos de vento no chão (animado), chuva e respingos, relâmpago na tela, névoa do pântano, brasas da fenda, nuvens passando embaixo dos picos, partículas das cinco cores no Coração.
- **Dia e noite:** vaga-lumes (amarelos, verdes e roxos), estrelas no céu, janelas e lampiões acesos à noite, brilho da fonte ao descansar, tons de amanhecer e entardecer.
- Os efeitos da Parte 1 continuam na seção 13 (`FX_*`).

### 10 Ordem sugerida para produzir

1. **Bell jogável** (guarda, estrela, leque, canção, dano, queda) — é o que a jogadora mais vê na Parte 2.
2. **Os sete chefes** (parado, ataque genérico, cansado, derrota) — depois os golpes um a um.
3. **Tiles das fases novas** (chão, paredes, lama, vento, abismo de céu) e os objetos de puzzle (cristais de terra, pérolas, faróis).
4. **Moradores** (Cora, Tião, Brisa e os do vilarejo) e o **dragão amigo**.
5. **Armaduras** das duas (parada/andar/correr primeiro).
6. **Retratos** que faltam, ícones de itens e documentos, interface e efeitos.

