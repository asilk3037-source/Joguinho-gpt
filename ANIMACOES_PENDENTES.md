# Line & Bell — o que falta criar

O jogo já roda completo, do começo ao fim. Tudo o que está abaixo aparece hoje como **desenho provisório** (formas simples feitas no código) ou usa outra animação no lugar. Quando a arte chegar num HTML `*_ITEM_*.html` e o script de extração rodar, ela entra no jogo **sozinha**, sem mexer no código.

Status atual: **50 de 162** animações prontas. A lista sempre atualizada fica no próprio jogo, em **Menu → Animações**.

Regras para as novas artes (iguais às atuais):
- Um PNG transparente por quadro, 1254×1254, com os pés no mesmo lugar das animações da Line.
- O código de cada animação deve ser **exatamente** o da lista (ex.: `BELL_WALK_RIGHT`). É por ele que o jogo encontra a arte.
- Animações de lado podem vir só viradas para a **direita**. O jogo espelha para a esquerda (se vier a versão `_LEFT`, ela passa a ser usada).

## Prioridade 1 — aparecem o tempo todo na história

### Bell (desenho provisório hoje)
- `BELL_IDLE_FRONT`, `BELL_IDLE_BACK`, `BELL_IDLE_LEFT`, `BELL_IDLE_RIGHT` — parada
- `BELL_HAPPY` — feliz (prólogo e final)
- `BELL_SCARED` — assustada (quando o dragão aparece)
- `BELL_CAPTURED` — sendo agarrada pelo dragão
- `BELL_DRAGON_CARRIED` — carregada pelo dragão
- `BELL_TRAPPED` — presa na jaula
- `BELL_CALL_LINE` — chamando a Line da jaula
- `BELL_BREAK_FREE` — saindo da jaula
- `BELL_RUN_LEFT` / `BELL_RUN_RIGHT` — correndo até a Line
- `BELL_RELIEVED` — aliviada

### Dragão (desenho provisório hoje)
Sugestão de tamanho: a mesma célula 1254×1254, com o dragão ocupando o quadro todo (no jogo ele é desenhado cerca de 3,5× maior que a Line).
- `DRAGON_IDLE`, `DRAGON_WALK`
- `DRAGON_ROAR`
- `DRAGON_CLAW_ATTACK`, `DRAGON_TAIL_ATTACK`
- `DRAGON_FIRE_CHARGE`, `DRAGON_FIRE_STREAM`
- `DRAGON_WINGS_OPEN`, `DRAGON_TAKEOFF`, `DRAGON_FLY`, `DRAGON_GLIDE`, `DRAGON_AIR_ATTACK`, `DRAGON_LAND`
- `DRAGON_HIT`, `DRAGON_STUNNED`, `DRAGON_WEAK_POINT_HIT`
- `DRAGON_DESPERATE_ATTACK`
- `DRAGON_FINAL_HIT`, `DRAGON_FALL`, `DRAGON_DEFEATED`
- `DRAGON_EYE_OPEN_END` — cena final (olho abrindo no escuro)

### Line — emoções usadas nas cenas (hoje usa outra animação no lugar)
- `LINE_CALL_BELL` — gritando por Bell (hoje: parada de costas)
- `LINE_SCARED` — assustada (hoje: parada de frente)
- `LINE_SAD` — triste (hoje: parada de frente)
- `LINE_DETERMINED` — determinada (hoje: postura de combate)
- `LINE_RELIEVED` — aliviada (hoje: feliz)

## Prioridade 2 — deixam o jogo mais bonito

### Line e Bell juntas (hoje as duas aparecem separadas)
- `LINE_BELL_RESCUE_HUG` — abraço do resgate
- `LINE_BELL_HUG_RELEASE` — separação do abraço
- `LINE_BELL_SIT_DOWN`, `LINE_BELL_SIT_IDLE` — sentadas no pôr do sol (epílogo)
- `LINE_BELL_WALK_HANDS_*` — de mãos dadas (4 direções)
- `LINE_BELL_WALK_TOGETHER_*`, `LINE_BELL_RUN_TOGETHER_*` (4 direções cada)
- `LINE_BELL_TALK`, `LINE_BELL_LAUGH`, `LINE_BELL_HOLD_HANDS`, `LINE_BELL_CELEBRATE`, `BELL_LEAN_ON_LINE`, `BELL_HEAD_ON_LINE`

### Inimigo "Sombra" (novo, não estava no plano)
Os inimigos da floresta. Hoje são bolhas roxas com olhos amarelos.
- `SHADOW_IDLE`, `SHADOW_MOVE`, `SHADOW_ATTACK`, `SHADOW_HIT`, `SHADOW_DEATH`

### Line com a espada em mãos (novo, não estava no plano)
Hoje, ao andar ou correr em combate, a espada some e volta ao parar.
- `LINE_COMBAT_WALK_FRONT/BACK/LEFT/RIGHT`
- `LINE_COMBAT_RUN_FRONT/BACK/LEFT/RIGHT`

### Resto da Bell
- `BELL_WALK_*`, `BELL_RUN_FRONT/BACK` (4 direções), `BELL_BLINK_FRONT`, `BELL_LOOK_SIDES_FRONT`
- `BELL_JUMP`, `BELL_LAND`, `BELL_GROUND_STAND`, `BELL_FLEE`, `BELL_FALL`, `BELL_ESCAPE_ATTEMPT`, `BELL_HELP_LINE`, `BELL_CRY`

### Resto do dragão
- `DRAGON_BLINK`, `DRAGON_TURN`, `DRAGON_BITE`, `DRAGON_FIRE_BREATH`

### Line — outras emoções
- `LINE_ANGRY`, `LINE_CRY`

## Prioridade 3 — opcionais

### Efeitos (hoje são partículas feitas no código e já funcionam bem)
`FX_FIRE`, `FX_EMBERS`, `FX_FIRE_LIGHT`, `FX_SMOKE`, `FX_DUST`, `FX_IMPACT`, `FX_SPARKS`, `FX_EXPLOSION`, `FX_SWORD_TRAIL`, `FX_DRAGON_WEAK_POINT`, `FX_TEARS`, `FX_HEARTS`, `FX_AMBIENT_PARTICLES`

### Versões para a esquerda
O jogo já espelha estas; só vale fazer se o espelho ficar estranho (ex.: espada trocando de mão):
`LINE_JUMP_LEFT`, `LINE_LAND_LEFT`

## Ajustes de arte percebidos nas animações atuais

1. **Dois estilos da Line.** Do item 36 em diante (`LINE_THROWN`, `LINE_KNOCKDOWN`, `LINE_INJURED_STAND`, `LINE_EXHAUSTED_IDLE`, `LINE_DRAGON_FINAL_ATTACK`, `LINE_HAPPY`, `LINE_LAUGH`) e em parte do combate, a Line aparece mais realista (cabelo cacheado, proporção adulta). O resto é chibi (cabeça grande, cabelo liso). No jogo a troca fica bem visível, por exemplo quando ela está parada e comemora.
2. **Deitada flutuando.** Em `LINE_FALL` e `LINE_KNOCKDOWN`, o corpo deitado fica ~30 px (de 256) mais alto que os pés em pé, como se ela flutuasse um pouco acima do chão.
3. **Ataques só de lado.** Na visão de cima, quando a Line olha para frente ou para trás e ataca, o golpe sai de lado. Se quiser, dá para criar `LINE_ATTACK_HORIZONTAL_FRONT` / `_BACK` (o jogo já procura essas versões).

## Fora das animações (para o jogo ficar completo)

- **Cenário:** hoje árvores, casa, pedras, água, caverna, baú, placas e jaula são desenhados no código. Se quiser arte própria: tiles 32×32 de grama, caminho, água, raízes, parede e chão de caverna, lava, e objetos soltos.
- **Som e música:** o jogo ainda não tem nenhum. Sugestões: tema da campina, tema da floresta, música da luta, rugido, fogo, espada, passos e passarinhos.
- **Rostos para os diálogos** (opcional): retrato da Line e da Bell com algumas expressões.
