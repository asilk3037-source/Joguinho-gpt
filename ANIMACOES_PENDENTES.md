# Line & Bell — o que falta criar

> Lista gerada a partir do jogo (`tools/gerar_pendentes.py`). A lista completa, com todas as animações e o status de cada uma, está na seção 10 da **[documentação](docs/LINE_E_BELL_DOCUMENTACAO.md)** e no próprio jogo, em **Menu → Animações**. Toda a arte atual é temporária até a criação completa.

**Status:** 208 de 270 animações com arte · 26 usando uma substituta · 36 desenhadas no código.

## ⚠️ Reenviar ou mandar

- **Item 96**: chegou com 2 imagem(ns) vazia(s) em `DRAGON_FALL`, `DRAGON_DEFEATED`. As animações funcionam sem esses quadros, mas ficam incompletas.
- **Item 106**: chegou com 1 imagem(ns) vazia(s) em `BELL_LAUGH_AT_LINE`. As animações funcionam sem esses quadros, mas ficam incompletas.
- **Item 108**: chegou com 3 imagem(ns) vazia(s) em `BELL_LAUGH`, `BELL_HIGH_FIVE`, `BELL_DANCE`. As animações funcionam sem esses quadros, mas ficam incompletas.
- **Itens que ainda não chegaram:** 77, 78, 79, 80.
- **`DRAGON_IDLE`** está provisório: usa o 1º quadro do rugido (`DRAGON_ROAR`) até chegar a arte do dragão parado.

## Ainda sem arte

| Grupo | Código | O que é | Hoje usa |
|---|---|---|---|
| Line — movimento | `LINE_JUMP_LEFT` | Pular | `LINE_JUMP_RIGHT` |
| Line — movimento | `LINE_LAND_LEFT` | Aterrissar | `LINE_LAND_RIGHT` |
| Line — combate | `LINE_COMBAT_WALK_FRONT` | Andar com a espada em mãos | `LINE_WALK_FRONT` |
| Line — combate | `LINE_COMBAT_WALK_BACK` | Andar com a espada em mãos | `LINE_WALK_BACK` |
| Line — combate | `LINE_COMBAT_WALK_LEFT` | Andar com a espada em mãos | `LINE_WALK_LEFT` |
| Line — combate | `LINE_COMBAT_WALK_RIGHT` | Andar com a espada em mãos | `LINE_WALK_RIGHT` |
| Line — combate | `LINE_COMBAT_RUN_FRONT` | Correr com a espada em mãos | `LINE_RUN_FRONT` |
| Line — combate | `LINE_COMBAT_RUN_BACK` | Correr com a espada em mãos | `LINE_RUN_BACK` |
| Line — combate | `LINE_COMBAT_RUN_LEFT` | Correr com a espada em mãos | `LINE_RUN_LEFT` |
| Line — combate | `LINE_COMBAT_RUN_RIGHT` | Correr com a espada em mãos | `LINE_RUN_RIGHT` |
| Line e Bell juntas | `LINE_BELL_WALK_TOGETHER_FRONT` | Andando lado a lado | `LINE_BELL_WALK_TOGETHER` |
| Line e Bell juntas | `LINE_BELL_WALK_TOGETHER_BACK` | Andando lado a lado | `LINE_BELL_WALK_TOGETHER` |
| Line e Bell juntas | `LINE_BELL_WALK_TOGETHER_LEFT` | Andando lado a lado | `LINE_BELL_WALK_TOGETHER` |
| Line e Bell juntas | `LINE_BELL_WALK_TOGETHER_RIGHT` | Andando lado a lado | `LINE_BELL_WALK_TOGETHER` |
| Line e Bell juntas | `LINE_BELL_WALK_HANDS_LEFT` | Andando de mãos dadas | `LINE_BELL_WALK_HANDS` |
| Line e Bell juntas | `LINE_BELL_WALK_HANDS_RIGHT` | Andando de mãos dadas | `LINE_BELL_WALK_HANDS` |
| Line e Bell juntas | `LINE_BELL_RUN_TOGETHER_FRONT` | Correndo juntas | `LINE_BELL_RUN_TOGETHER` |
| Line e Bell juntas | `LINE_BELL_RUN_TOGETHER_BACK` | Correndo juntas | `LINE_BELL_RUN_TOGETHER` |
| Line e Bell juntas | `LINE_BELL_RUN_TOGETHER_LEFT` | Correndo juntas | `LINE_BELL_RUN_TOGETHER` |
| Line e Bell juntas | `LINE_BELL_RUN_TOGETHER_RIGHT` | Correndo juntas | `LINE_BELL_RUN_TOGETHER` |
| Line e Bell juntas | `LINE_BELL_SIT_DOWN` | Sentando juntas | desenho no código |
| Line e Bell juntas | `BELL_HEAD_ON_LINE` | Bell apoiando a cabeça na Line | desenho no código |
| Line e Bell juntas | `LINE_BELL_SIT_IDLE` | Idle das duas sentadas | desenho no código |
| Dragão | `DRAGON_BLINK` | Piscar | `DRAGON_IDLE` |
| Dragão | `DRAGON_RUN` | Correr | `DRAGON_WALK` |
| Dragão | `DRAGON_SLEEP` | Dormir | `DRAGON_DEFEATED` |
| Magia e criaturas (novo) | `LINE_CAST_SPELL` | Line lança o Raio de Luz | `LINE_ATTACK_VERTICAL` |
| Magia e criaturas (novo) | `LINE_CAST_CHARGE` | Line carregando a Chuva de Estrelas | `LINE_COMBAT_IDLE` |
| Magia e criaturas (novo) | `LINE_CAST_STARS` | Line solta a Chuva de Estrelas | `LINE_ATTACK_SPIN` |
| Magia e criaturas (novo) | `GOLEM_SLEEP` | Guardião de Pedra dormindo | desenho no código |
| Magia e criaturas (novo) | `GOLEM_IDLE` | Guardião parado | desenho no código |
| Magia e criaturas (novo) | `GOLEM_WALK` | Guardião andando | desenho no código |
| Magia e criaturas (novo) | `GOLEM_SLAM` | Guardião: pisão (onda no chão) | desenho no código |
| Magia e criaturas (novo) | `GOLEM_THROW` | Guardião: arremessar pedra | desenho no código |
| Magia e criaturas (novo) | `GOLEM_STUNNED` | Guardião tonto (cristal rachado) | desenho no código |
| Magia e criaturas (novo) | `GOLEM_DEATH` | Guardião desmoronando | desenho no código |
| Magia e criaturas (novo) | `WISP_IDLE` | Fogo-fátuo flutuando | desenho no código |
| Magia e criaturas (novo) | `WISP_ATTACK` | Fogo-fátuo atirando | desenho no código |
| Magia e criaturas (novo) | `WISP_DEATH` | Fogo-fátuo apagando | desenho no código |
| Inimigos (novo) | `SHADOW_IDLE` | Sombra — parada | desenho no código |
| Inimigos (novo) | `SHADOW_MOVE` | Sombra — andar | desenho no código |
| Inimigos (novo) | `SHADOW_ATTACK` | Sombra — investida | desenho no código |
| Inimigos (novo) | `SHADOW_HIT` | Sombra — receber dano | desenho no código |
| Inimigos (novo) | `SHADOW_DEATH` | Sombra — desaparecer | desenho no código |
| Bichos da fazenda | `SHEEP_IDLE` | Ovelha — Parado | desenho no código |
| Bichos da fazenda | `SHEEP_WALK` | Ovelha — Andar | desenho no código |
| Bichos da fazenda | `SHEEP_RUN` | Ovelha — Correr | desenho no código |
| Bichos da fazenda | `SHEEP_EAT` | Ovelha — Comer grama | desenho no código |
| Bichos da fazenda | `DUCK_IDLE` | Pato — Parado | desenho no código |
| Bichos da fazenda | `DUCK_WALK` | Pato — Andar | desenho no código |
| Bichos da fazenda | `DUCK_SWIM` | Pato — Nadando | desenho no código |
| Bichos da fazenda | `DUCK_RUN` | Pato — Correr | desenho no código |
| Bichos da fazenda | `CAT_IDLE` | Gato — Parado | desenho no código |
| Bichos da fazenda | `CAT_WALK` | Gato — Andar | desenho no código |
| Bichos da fazenda | `CAT_SLEEP` | Gato — Dormindo | desenho no código |
| Bichos da fazenda | `CAT_PURR` | Gato — Carinho (ronronando) | desenho no código |
| Personagens de apoio (novo) | `MAGO_IDLE` | Mago parado, respirando | desenho no código |
| Personagens de apoio (novo) | `MAGO_TALK` | Mago falando / gesticulando | desenho no código |
| Personagens de apoio (novo) | `MAGO_CAST` | Mago fazendo um feitiço | desenho no código |
| Personagens de apoio (novo) | `SPIRIT_APPEAR` | Espírito das Ruínas aparecendo no altar | desenho no código |
| Personagens de apoio (novo) | `SPIRIT_IDLE` | Espírito das Ruínas flutuando | desenho no código |
| Personagens de apoio (novo) | `SPIRIT_TALK` | Espírito das Ruínas falando | desenho no código |

## Como mandar arte nova

Qualquer um destes formatos funciona:

1. **HTML de item** (`LINE_BELL_ITEM_NN.html`), nos dois formatos já usados: `const animations` (PNG por quadro) ou `const payload` (lista de imagens e, para cada animação, a ordem dos quadros, o fps e uma descrição). Quadros 1254×1254 com fundo transparente.
2. **HTML de laboratório** (`*LABORATORIO*.html`).
3. **Pasta em `arte/`**: `arte/<grupo>/<CODIGO>/00.png, 01.png…` com um `config.json` (`{"unidades_por_px": 0.62}`).

Depois, `python3 tools/extrair_sprites.py` gera as folhas e registra tudo no jogo. O código de cada animação precisa ser **exatamente** o da lista. Animações de lado podem vir só viradas para a **direita**: o jogo espelha. O tamanho de cada personagem é igualado sozinho entre as animações.

## ⭐ Theo: layout oficial

A arte do Theo que está hoje no jogo (`arte/referencias/theo_shihtzu.png`) é o **layout oficial** para a arte final: só melhorar, sem perder os traços. Detalhes na seção 2 da [documentação](docs/LINE_E_BELL_DOCUMENTACAO.md).
