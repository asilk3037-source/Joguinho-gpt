# Line & Bell — o que falta criar

O jogo roda do começo ao fim. Tudo o que está abaixo ainda usa uma **substituta** (outra animação parecida, às vezes com um tremor ou pulinho por cima) ou um **desenho provisório** feito no código. Quando a arte chegar e o script de extração rodar, ela entra no jogo sozinha.

Status atual: **160** animações prontas (Line, Bell, dragão vermelho, Theo (shih-tzu), galinhas, vacas, porcos e cavalo). A prancha "Line & Bell" trouxe a corrida, o pulo, a reverência e o "toca aqui" da Bell, a pose de vitória da Line, a dança e o "toca aqui" das duas, além dos rostos novos: Line brava e chorando, Bell envergonhada. A lista sempre atualizada fica no próprio jogo, em **Menu → Animações**.

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
O dragão agora é o **vermelho** da última prancha. Ela trouxe: parado, andar, decolar, voar, fogo e rugido. O resto usa quadros dessas mesmas animações:
- `DRAGON_CLAW_ATTACK` (garra): usa o rugido + agachar.
- `DRAGON_TAIL_ATTACK` (golpe de cauda): usa a garra.
- `DRAGON_HIT`, `DRAGON_STUNNED` (dano, atordoado): usam o agachar.
- `DRAGON_FALL`, `DRAGON_DEFEATED` (cair, derrotado): usam o pouso e o agachar. Falta ele **caído no chão** de verdade.
- `DRAGON_SLEEP`: usa ele sentado. Falta de olho fechado.
- `DRAGON_AIR_ATTACK` (mergulho com as garras): usa a decolagem.

A prancha tem o dragão com ~130 px de altura. O ideal é **~400 px de corpo, em quadros de 512×512**.

### Line: emoções das cenas
- Completas! Itens 43–49: determinada, brava, assustada, triste, chorando, gritando por Bell e aliviada.

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
1. **Estilo da Line:** os itens 35–42 foram refeitos no estilo chibi. Agora todas as animações da Line estão no mesmo estilo.
2. **Tamanho da Bell.** Na prancha "Line & Bell", as duas têm quase a mesma altura. No jogo, a Bell é menor. Nas animações do casal, deixei como está na prancha.
3. **Quedas:** nas quedas, cada quadro agora encosta no chão sozinho. Assim a Line deitada não fica mais flutuando.
