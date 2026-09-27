# Line & Bell — o que falta criar

O jogo roda do começo ao fim. Tudo o que está abaixo ainda usa uma **substituta** (outra animação parecida, às vezes com um tremor ou pulinho por cima) ou um **desenho provisório** feito no código. Quando a arte chegar e o script de extração rodar, ela entra no jogo sozinha.

Status atual: **152** animações prontas (Line, Bell, dragão chibi, Theo (shih-tzu), galinhas, vacas, porcos e cavalo). A prancha "Line & Bell" trouxe a corrida, o pulo, a reverência e o "toca aqui" da Bell, a pose de vitória da Line, a dança e o "toca aqui" das duas, além dos rostos novos: Line brava e chorando, Bell envergonhada. A lista sempre atualizada fica no próprio jogo, em **Menu → Animações**.

## Como mandar arte nova

Qualquer um destes formatos funciona:

1. **HTML de item** (`*_ITEM_*.html`), igual aos da Line: PNG transparente 1254×1254 por quadro.
2. **HTML de laboratório** (`*LABORATORIO*.html`), igual ao `Bell-Line-Laboratorio-Animacoes-v7`.
3. **Pasta em `arte/`**: `arte/<grupo>/<CODIGO>/00.png, 01.png…` com um `config.json` (`{"unidades_por_px": 0.62}`). Foi assim que entraram as pranchas do dragão vermelho. Se mandar uma prancha (imagem com vários quadros numerados), eu recorto e monto a pasta.

O código de cada animação precisa ser **exatamente** o da lista (ex.: `BELL_SCARED`). Animações de lado podem vir só viradas para a **direita**: o jogo espelha para a esquerda.

## Prioridade 1 — aparecem na história

### Bell
- `BELL_SCARED`: assustada quando o dragão chega. Hoje usa a Bell parada tremendo.
- `BELL_CAPTURED` e `BELL_DRAGON_CARRIED`: sendo agarrada e carregada. Hoje usa a Bell parada balançando.
- `BELL_TRAPPED`, `BELL_CALL_LINE`, `BELL_ESCAPE_ATTEMPT`: presa na jaula chamando a Line. Hoje usa a Bell parada pulando.
- `BELL_BREAK_FREE`, `BELL_HAPPY`, `BELL_RELIEVED`: saindo da jaula e feliz. Hoje usa a gargalhada.
- `BELL_RUN_FRONT/BACK`: a corrida de lado já chegou. De frente e de costas, ainda usa a caminhada.

### Dragão
O dragão chibi já tem quase tudo (parado, andar, correr, voar, decolar, pousar, fogo, ataque aéreo, garras, dano, cair, dormir e ressurgir). Faltam:
- `DRAGON_ROAR`: rugido (hoje usa a preparação do fogo).
- `DRAGON_TAIL_ATTACK`: golpe de cauda (hoje usa o ataque de garra).
- `DRAGON_STUNNED`: atordoado de verdade (hoje usa quadros do "tomar dano" em loop).

### Line: emoções das cenas
- `LINE_CALL_BELL` (gritando por Bell), `LINE_SCARED`, `LINE_SAD`, `LINE_DETERMINED`, `LINE_RELIEVED`.
- Os **rostos** dos diálogos já têm brava e chorando. O que falta é o **corpo** fazendo essas emoções.

## Prioridade 2 — deixam o jogo mais bonito

- **Line e Bell juntas:** `LINE_BELL_HUG_RELEASE`, `LINE_BELL_SIT_DOWN`, `LINE_BELL_SIT_IDLE` (sentadas no pôr do sol do epílogo), `LINE_BELL_RUN_TOGETHER_*`, `LINE_BELL_LAUGH`, `BELL_HEAD_ON_LINE`. (`LINE_BELL_TALK`, `LINE_BELL_CELEBRATE`, `LINE_BELL_DANCE` e `LINE_BELL_HIGH_FIVE` já chegaram.)
- **Abraço animado:** hoje o `LINE_BELL_RESCUE_HUG` tem só 1 quadro.
- **Inimigo Sombra** (floresta): `SHADOW_IDLE`, `SHADOW_MOVE`, `SHADOW_ATTACK`, `SHADOW_HIT`, `SHADOW_DEATH`.
- **Line com a espada na mão:** `LINE_COMBAT_WALK_*` e `LINE_COMBAT_RUN_*`.
- **Mago:** hoje é uma imagem parada que respira e brilha. Animações de falar ou acenar ajudariam.
- **Bichinhos:** galinhas, pintinhos, vacas, porcos, cavalo e o Theo já usam a arte que você mandou. Ainda são desenhados no código: **ovelha, pato e gato**.

## Prioridade 3 — opcionais
- Efeitos (`FX_*`): hoje são partículas feitas no código.
- `LINE_JUMP_LEFT`, `LINE_LAND_LEFT`: o jogo espelha as versões da direita.

## Cenário

A fazenda já usa o pacote: casa, celeiro, galinheiro, moinho, poço, árvores (normais, macieiras, cerejeiras e pinheiros na floresta), horta (cenoura e tomate), feno, carroça, lampiões, píer, barco, girassóis, milho e trigo. Ainda desenhados no código: cercas, chão, água, flores pequenas e o covil.

## Ajustes de arte percebidos
1. **Dois estilos da Line.** Do item 36 em diante, ela aparece mais realista. O resto é chibi.
2. **Tamanho da Bell.** Na prancha "Line & Bell", as duas têm quase a mesma altura. No jogo, a Bell é menor. Nas animações do casal, deixei como está na prancha.
3. **Deitada flutuando.** Em `LINE_FALL` e `LINE_KNOCKDOWN`, o corpo deitado fica um pouco acima do chão.
4. **Dragão:** as pranchas de voo/pulo e a do golpe de cauda têm tamanhos diferentes. Ajustei a escala no jogo, mas pode ser que mude um pouco entre uma animação e outra.
