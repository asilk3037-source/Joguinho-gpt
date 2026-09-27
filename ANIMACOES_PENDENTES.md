# Line & Bell — o que falta criar

O jogo roda do começo ao fim. Tudo o que está abaixo ainda usa uma **substituta** (outra animação parecida, às vezes com um tremor ou pulinho por cima) ou um **desenho provisório** feito no código. Quando a arte chegar e o script de extração rodar, ela entra no jogo sozinha.

Status atual: **72 de 166** animações prontas. A lista sempre atualizada fica no próprio jogo, em **Menu → Animações**.

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
- `BELL_RUN_FRONT/BACK/LEFT/RIGHT`: hoje usa a caminhada mais rápida.

### Dragão vermelho (faltam só estas)
- `DRAGON_IDLE` e `DRAGON_WALK`: parado respirando e andando. Hoje usa a pose parada com movimento de respiração.
- `DRAGON_ROAR`: rugido.
- `DRAGON_CLAW_ATTACK` ou `DRAGON_BITE`: ataque de perto.
- `DRAGON_FIRE_CHARGE` e `DRAGON_FIRE_STREAM`: cuspir fogo **no chão**. A prancha "ataque voando" tinha o fogo misturado com o fundo preto e não recortou bem. Se vier com fundo transparente, eu uso.
- `DRAGON_STUNNED` e `DRAGON_WEAK_POINT_HIT`: atordoado, com o peito brilhando.
- `DRAGON_HIT`, `DRAGON_FINAL_HIT`, `DRAGON_FALL`, `DRAGON_DEFEATED`: tomando dano e caindo.
- `DRAGON_EYE_OPEN_END`: o olho abrindo no escuro, na cena final.

### Line: emoções das cenas
- `LINE_CALL_BELL` (gritando por Bell), `LINE_SCARED`, `LINE_SAD`, `LINE_DETERMINED`, `LINE_RELIEVED`.

## Prioridade 2 — deixam o jogo mais bonito

- **Line e Bell juntas:** `LINE_BELL_HUG_RELEASE`, `LINE_BELL_SIT_DOWN`, `LINE_BELL_SIT_IDLE` (sentadas no pôr do sol do epílogo), `LINE_BELL_RUN_TOGETHER_*`, `LINE_BELL_TALK`, `LINE_BELL_LAUGH`, `LINE_BELL_CELEBRATE`, `BELL_HEAD_ON_LINE`.
- **Abraço animado:** hoje o `LINE_BELL_RESCUE_HUG` tem só 1 quadro.
- **Inimigo Sombra** (floresta): `SHADOW_IDLE`, `SHADOW_MOVE`, `SHADOW_ATTACK`, `SHADOW_HIT`, `SHADOW_DEATH`.
- **Line com a espada na mão:** `LINE_COMBAT_WALK_*` e `LINE_COMBAT_RUN_*`.
- **Mago:** hoje é uma imagem parada que respira e brilha. Animações de falar ou acenar ajudariam.
- **Bichinhos da fazenda:** galinha, pintinho, vaca, ovelha, porco, Theo (cachorro), gato e pato são desenhados no código. Se quiser arte própria: andar, comer e carinho de cada um.

## Prioridade 3 — opcionais
- Efeitos (`FX_*`): hoje são partículas feitas no código.
- `LINE_JUMP_LEFT`, `LINE_LAND_LEFT`: o jogo espelha as versões da direita.

## Cenário

As árvores já usam o tileset da fazenda que você mandou. O resto (casa, celeiro, galinheiro, cercas, poço, moinho, horta, lago) ainda é desenhado no código. Se o tileset vier com as peças separadas e fundo transparente (casa, celeiro, cerca, poço, pedras, flores, píer, barco…), eu troco tudo pela arte.

## Ajustes de arte percebidos
1. **Dois estilos da Line.** Do item 36 em diante, ela aparece mais realista. O resto é chibi.
2. **Deitada flutuando.** Em `LINE_FALL` e `LINE_KNOCKDOWN`, o corpo deitado fica um pouco acima do chão.
3. **Dragão:** as pranchas de voo/pulo e a do golpe de cauda têm tamanhos diferentes. Ajustei a escala no jogo, mas pode ser que mude um pouco entre uma animação e outra.
