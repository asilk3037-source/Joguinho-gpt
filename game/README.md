# Line & Bell — o jogo

Aventura com visão de cima para navegador (PC e celular). Começa com o prólogo **O primeiro encontro** (09/05/2024): no Minas Shopping, a Line vê a Bell, elas conversam e comem BK, a Line apanha da máquina de soco no playground e as duas dão o primeiro beijo no túnel. O tempo passa e a história segue com a vidinha da Line e da Bell na fazenda: tarefas do dia, bichinhos, almoço e passeio de mãos dadas até o lago. No pôr do sol um dragão leva a Bell. A Line atravessa a floresta, conversa com o mago e encontra uma espada. Nas **Ruínas Encantadas** ela aprende magia (Raio de Luz), acende cristais para desfazer barreiras e enfrenta o **Guardião de Pedra**, que dá a Chuva de Estrelas. Na **Montanha de Brasa** ela pula fendas, acende três tochas e abre o portão do covil, onde enfrenta o dragão.

Pelo caminho: 13 baús (poções, pão, maçãs, elixir, chaves, bússola, Flor da Lua e dois corações extras), 3 portas trancadas, a **Gruta dos Ecos** a leste da floresta, alas novas nas ruínas e na montanha, e fontes que recuperam vida e magia e viram ponto de retorno.

A **mochila** (I) guarda os itens usáveis, o **caderno de pistas** (8 documentos de investigação que contam a história do dragão; com todos, coração extra) e o **mapa** (M), com névoa que vai abrindo conforme a Line explora e um mapa do mundo. Cura rápida com H.

## Como jogar

O jogo não precisa de instalação. Qualquer servidor simples serve:

```bash
cd game
python3 -m http.server 8000
# abra http://localhost:8000
```

Também dá para publicar a pasta `game/` no GitHub Pages, Netlify ou Vercel e jogar pelo link, inclusive no celular (de preferência na horizontal).

O progresso fica salvo no navegador ao entrar em cada área. O botão **Continuar** retoma dali.

## Controles

| Ação | Teclado | Controle | Celular |
|---|---|---|---|
| Andar | WASD / setas | analógico | arrastar no lado esquerdo |
| Correr | Shift | gatilho | arrastar até o fim |
| Atacar (3x = combo) | J / Z | A | ⚔ |
| Giro | K / X | X | 🌀 |
| Esquivar (correndo = dash) | L / C | B | 💨 |
| Defender (segurar) | I / V | LB | 🛡 |
| Magia: Raio de Luz | Q / U | RB | ✨ |
| Chuva de Estrelas (segurar a magia e soltar) | Q / U | RB | ✨ |
| Pular (+ atacar no ar) | Espaço | Y | ⤴ |
| Abrir / ler | E / Enter | Select | botão que aparece |
| Pausar | Esc / P | Start | ⏸ |
| Pular cena | Tab | — | “Pular cena” |

## Como entram as animações novas

1. Coloque o HTML novo na raiz do repositório (`*_ITEM_*.html` ou `*LABORATORIO*.html`) ou crie uma pasta `arte/<grupo>/<CODIGO>/` com os PNGs e um `config.json`.
2. Rode, na raiz:
   ```bash
   pip install pillow
   python3 tools/extrair_sprites.py
   ```
3. O script gera `game/assets/sprites/<CODIGO>.webp` e atualiza `game/assets/sprites.js`. Toda animação cujo código esteja no catálogo (`game/js/animacoes.js`) passa a aparecer no lugar do desenho provisório.

No menu, a tela **Animações** mostra o que já existe, o que falta e uma prévia de cada uma.

## Organização do código

| Arquivo | O que faz |
|---|---|
| `js/animacoes.js` | Catálogo de todas as animações (velocidade, loop, substituta) e o sistema que acha a arte certa para cada direção |
| `js/entrada.js` | Teclado, toque (joystick e botões) e controle |
| `js/mapas.js` | Os três mapas (em texto, fáceis de editar) e o desenho do chão |
| `js/cenario.js` | Construções da fazenda, vento nas plantas, borboletas, pássaros, nuvens, vaga-lumes |
| `js/bichos.js` | Bichinhos da fazenda e o mago da floresta |
| `js/fazenda.js` | Capítulo da fazenda: tarefas, balões de fala, interações |
| `js/desenhos.js` | Desenhos provisórios: Bell, dragão, sombras, árvores, casa, baú, jaula… |
| `js/entidades.js` | Line (movimento e combate), inimigos Sombra, Bell e partículas |
| `js/dragao.js` | O chefe: ataques, avisos no chão, atordoamento e ponto fraco |
| `js/mochila.js` | Mochila: itens usáveis, caderno de pistas, mapa com névoa (área e mundo), painel de objetivo e avisos |
| `js/encontro.js` | Prólogo *O primeiro encontro*: Minas Shopping, Playground, Túnel e a transição para a fazenda |
| `js/cenas.js` | Diálogos e a história da aventura (fazenda, floresta, ruínas, montanha, covil, final) |
| `js/jogo.js` | Laço principal, câmera, colisão, HUD, salvar |
| `js/ui.js` | Menu, pausa, controles e galeria de animações |
| `tools/extrair_sprites.py` | Extrai os quadros dos HTMLs para o jogo |

## Editar os mapas

Os mapas ficam em `js/mapas.js`, como texto. Cada letra é um tile:

`B` celeiro · `K` galinheiro · `f` cerca · `h`/`c` horta · `u` lama · `P` poço · `M` moinho · `n` feno · `k` casinha do cachorro · `m` mesa · `v` varal · `T` árvore · `.` grama · `,` mato alto · `F` flores · `:` caminho · `r` raízes · `w` riacho (dá para pular) · `~` água funda · `R` pedra · `H`/`D` casa e porta · `X` espinheiro (corta com a espada) · `C` baú · `S` placa · `#` parede da caverna · `_` chão da caverna · `L` lava · `o` estalagmite
