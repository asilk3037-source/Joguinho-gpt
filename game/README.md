# Line & Bell — o jogo

Aventura com visão de cima para navegador (PC e celular). Começa com a vidinha da Line e da Bell na fazenda: tarefas do dia, bichinhos, almoço e passeio de mãos dadas até o lago. No pôr do sol um dragão leva a Bell, e a Line atravessa a floresta, conversa com o mago, encontra uma espada e enfrenta o dragão no covil.

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
| Defender (segurar) | I / V | LB / RB | 🛡 |
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
| `js/cenas.js` | Diálogos e a história (prólogo, floresta, covil, final) |
| `js/jogo.js` | Laço principal, câmera, colisão, HUD, salvar |
| `js/ui.js` | Menu, pausa, controles e galeria de animações |
| `tools/extrair_sprites.py` | Extrai os quadros dos HTMLs para o jogo |

## Editar os mapas

Os mapas ficam em `js/mapas.js`, como texto. Cada letra é um tile:

`B` celeiro · `K` galinheiro · `f` cerca · `h`/`c` horta · `u` lama · `P` poço · `M` moinho · `n` feno · `k` casinha do cachorro · `m` mesa · `v` varal · `T` árvore · `.` grama · `,` mato alto · `F` flores · `:` caminho · `r` raízes · `w` riacho (dá para pular) · `~` água funda · `R` pedra · `H`/`D` casa e porta · `X` espinheiro (corta com a espada) · `C` baú · `S` placa · `#` parede da caverna · `_` chão da caverna · `L` lava · `o` estalagmite
