# Line & Bell — o que falta criar

> Lista gerada a partir do jogo (`tools/gerar_pendentes.py`). A lista completa, com todas as animações e o status de cada uma, está na seção 10 da **[documentação](docs/LINE_E_BELL_DOCUMENTACAO.md)** e no próprio jogo, em **Menu → Animações**. Toda a arte atual é temporária até a criação completa.

**Status:** 208 de 553 animações com arte · 179 usando uma substituta · 166 desenhadas no código.

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
| Bell jogável (Parte 2) | `BELL_COMBAT_IDLE_FRONT` | Bell em guarda, estrelas girando na mão | `BELL_IDLE_FRONT` |
| Bell jogável (Parte 2) | `BELL_COMBAT_IDLE_BACK` | Bell em guarda, estrelas girando na mão | `BELL_IDLE_BACK` |
| Bell jogável (Parte 2) | `BELL_COMBAT_IDLE_LEFT` | Bell em guarda, estrelas girando na mão | `BELL_IDLE_LEFT` |
| Bell jogável (Parte 2) | `BELL_COMBAT_IDLE_RIGHT` | Bell em guarda, estrelas girando na mão | `BELL_IDLE_RIGHT` |
| Bell jogável (Parte 2) | `BELL_ATTACK_STAR` | Bell atira uma estrela (braço à frente) | `BELL_HIGH_FIVE` |
| Bell jogável (Parte 2) | `BELL_ATTACK_SPREAD` | Bell gira e solta o leque de 3 estrelas de luz | `BELL_DANCE` |
| Bell jogável (Parte 2) | `BELL_ATTACK_AIR` | Bell atira estrela no ar (pulando) | `BELL_JUMP` |
| Bell jogável (Parte 2) | `BELL_SING` | Bell canta a Canção (notas coloridas saindo) | `BELL_HAPPY` |
| Bell jogável (Parte 2) | `BELL_BLOCK` | Bell se protege com um escudo de luz rosa | `BELL_IDLE_RIGHT` |
| Bell jogável (Parte 2) | `BELL_DODGE` | Bell esquiva (pulinho de lado) | `BELL_JUMP` |
| Bell jogável (Parte 2) | `BELL_DASH` | Bell arrancada | `BELL_RUN_RIGHT` |
| Bell jogável (Parte 2) | `BELL_HIT` | Bell recebe dano | `BELL_SCARED` |
| Bell jogável (Parte 2) | `BELL_KNOCKDOWN` | Bell cai no chão (golpe forte) | `BELL_FALL` |
| Bell jogável (Parte 2) | `BELL_EXHAUSTED_IDLE` | Bell cansada, ofegante (pouca vida) | `BELL_IDLE_RIGHT` |
| Bell jogável (Parte 2) | `BELL_CROUCH` | Bell agachada (beber na fonte / pegar item) | `BELL_IDLE_FRONT` |
| Bell jogável (Parte 2) | `BELL_DETERMINED` | Bell decidida (punhos fechados) | `BELL_IDLE_FRONT` |
| Bell jogável (Parte 2) | `BELL_CELEBRATE` | Bell comemora vitória | `BELL_HAPPY` |
| Bell jogável (Parte 2) | `BELL_TALK` | Bell falando (cenas) | `BELL_IDLE_FRONT` |
| Chefe: Colosso de Raízes (Parte 2) | `COLOSSO_SLEEP` | Colosso de Raízes — dormindo (antes da luta) | desenho no código |
| Chefe: Colosso de Raízes (Parte 2) | `COLOSSO_IDLE` | Colosso de Raízes — parado, respirando | desenho no código |
| Chefe: Colosso de Raízes (Parte 2) | `COLOSSO_WAKE` | Colosso de Raízes — acordando / rugido de apresentação | desenho no código |
| Chefe: Colosso de Raízes (Parte 2) | `COLOSSO_ATTACK` | Colosso de Raízes — ataque genérico (usado quando o golpe não tem arte própria) | desenho no código |
| Chefe: Colosso de Raízes (Parte 2) | `COLOSSO_ROOTS` | Colosso de Raízes — raízes saindo do chão em linha | desenho no código |
| Chefe: Colosso de Raízes (Parte 2) | `COLOSSO_THORNS` | Colosso de Raízes — anel de espinhos | desenho no código |
| Chefe: Colosso de Raízes (Parte 2) | `COLOSSO_MUD` | Colosso de Raízes — cuspe de lama | desenho no código |
| Chefe: Colosso de Raízes (Parte 2) | `COLOSSO_SUMMON` | Colosso de Raízes — chama sombras | desenho no código |
| Chefe: Colosso de Raízes (Parte 2) | `COLOSSO_STUNNED` | Colosso de Raízes — cansado, núcleo exposto (hora de atacar) | desenho no código |
| Chefe: Colosso de Raízes (Parte 2) | `COLOSSO_HIT` | Colosso de Raízes — recebe dano | desenho no código |
| Chefe: Colosso de Raízes (Parte 2) | `COLOSSO_DEATH` | Colosso de Raízes — derrotado (se desfaz em luz) | desenho no código |
| Chefe: Colosso de Raízes (Parte 2) | `COLOSSO_FREED` | Colosso de Raízes — libertado, volta às cores verdadeiras e agradece | desenho no código |
| Chefe: Serpente das Marés (Parte 2) | `SERPENTE_SLEEP` | Serpente das Marés — dormindo (antes da luta) | desenho no código |
| Chefe: Serpente das Marés (Parte 2) | `SERPENTE_IDLE` | Serpente das Marés — parado, respirando | desenho no código |
| Chefe: Serpente das Marés (Parte 2) | `SERPENTE_WAKE` | Serpente das Marés — acordando / rugido de apresentação | desenho no código |
| Chefe: Serpente das Marés (Parte 2) | `SERPENTE_ATTACK` | Serpente das Marés — ataque genérico (usado quando o golpe não tem arte própria) | desenho no código |
| Chefe: Serpente das Marés (Parte 2) | `SERPENTE_DIVE` | Serpente das Marés — mergulho (some e reaparece) | desenho no código |
| Chefe: Serpente das Marés (Parte 2) | `SERPENTE_WATER_JET` | Serpente das Marés — jatos de água | desenho no código |
| Chefe: Serpente das Marés (Parte 2) | `SERPENTE_WAVE` | Serpente das Marés — onda | desenho no código |
| Chefe: Serpente das Marés (Parte 2) | `SERPENTE_STUNNED` | Serpente das Marés — cansado, núcleo exposto (hora de atacar) | desenho no código |
| Chefe: Serpente das Marés (Parte 2) | `SERPENTE_HIT` | Serpente das Marés — recebe dano | desenho no código |
| Chefe: Serpente das Marés (Parte 2) | `SERPENTE_DEATH` | Serpente das Marés — derrotado (se desfaz em luz) | desenho no código |
| Chefe: Serpente das Marés (Parte 2) | `SERPENTE_FREED` | Serpente das Marés — libertado, volta às cores verdadeiras e agradece | desenho no código |
| Chefe: Grifo da Tempestade (Parte 2) | `GRIFO_SLEEP` | Grifo da Tempestade — dormindo (antes da luta) | desenho no código |
| Chefe: Grifo da Tempestade (Parte 2) | `GRIFO_IDLE` | Grifo da Tempestade — parado, respirando | desenho no código |
| Chefe: Grifo da Tempestade (Parte 2) | `GRIFO_WAKE` | Grifo da Tempestade — acordando / rugido de apresentação | desenho no código |
| Chefe: Grifo da Tempestade (Parte 2) | `GRIFO_ATTACK` | Grifo da Tempestade — ataque genérico (usado quando o golpe não tem arte própria) | desenho no código |
| Chefe: Grifo da Tempestade (Parte 2) | `GRIFO_GUST` | Grifo da Tempestade — rajada de vento | desenho no código |
| Chefe: Grifo da Tempestade (Parte 2) | `GRIFO_FEATHERS` | Grifo da Tempestade — leque de penas | desenho no código |
| Chefe: Grifo da Tempestade (Parte 2) | `GRIFO_LIGHTNING` | Grifo da Tempestade — chama raios | desenho no código |
| Chefe: Grifo da Tempestade (Parte 2) | `GRIFO_STUNNED` | Grifo da Tempestade — cansado, núcleo exposto (hora de atacar) | desenho no código |
| Chefe: Grifo da Tempestade (Parte 2) | `GRIFO_HIT` | Grifo da Tempestade — recebe dano | desenho no código |
| Chefe: Grifo da Tempestade (Parte 2) | `GRIFO_DEATH` | Grifo da Tempestade — derrotado (se desfaz em luz) | desenho no código |
| Chefe: Grifo da Tempestade (Parte 2) | `GRIFO_FREED` | Grifo da Tempestade — libertado, volta às cores verdadeiras e agradece | desenho no código |
| Chefe: Titã de Magma (Parte 2) | `MAGMA_SLEEP` | Titã de Magma — dormindo (antes da luta) | desenho no código |
| Chefe: Titã de Magma (Parte 2) | `MAGMA_IDLE` | Titã de Magma — parado, respirando | desenho no código |
| Chefe: Titã de Magma (Parte 2) | `MAGMA_WAKE` | Titã de Magma — acordando / rugido de apresentação | desenho no código |
| Chefe: Titã de Magma (Parte 2) | `MAGMA_ATTACK` | Titã de Magma — ataque genérico (usado quando o golpe não tem arte própria) | desenho no código |
| Chefe: Titã de Magma (Parte 2) | `MAGMA_SLAM` | Titã de Magma — pisão (onda no chão) | desenho no código |
| Chefe: Titã de Magma (Parte 2) | `MAGMA_FIRE_RAIN` | Titã de Magma — chuva de fogo | desenho no código |
| Chefe: Titã de Magma (Parte 2) | `MAGMA_THROW` | Titã de Magma — arremesso de rocha | desenho no código |
| Chefe: Titã de Magma (Parte 2) | `MAGMA_FIRE_FAN` | Titã de Magma — leque de fogo | desenho no código |
| Chefe: Titã de Magma (Parte 2) | `MAGMA_STUNNED` | Titã de Magma — cansado, núcleo exposto (hora de atacar) | desenho no código |
| Chefe: Titã de Magma (Parte 2) | `MAGMA_HIT` | Titã de Magma — recebe dano | desenho no código |
| Chefe: Titã de Magma (Parte 2) | `MAGMA_DEATH` | Titã de Magma — derrotado (se desfaz em luz) | desenho no código |
| Chefe: Hidra de Lama (Parte 2) | `HIDRA_SLEEP` | Hidra de Lama — dormindo (antes da luta) | desenho no código |
| Chefe: Hidra de Lama (Parte 2) | `HIDRA_IDLE` | Hidra de Lama — parado, respirando | desenho no código |
| Chefe: Hidra de Lama (Parte 2) | `HIDRA_WAKE` | Hidra de Lama — acordando / rugido de apresentação | desenho no código |
| Chefe: Hidra de Lama (Parte 2) | `HIDRA_ATTACK` | Hidra de Lama — ataque genérico (usado quando o golpe não tem arte própria) | desenho no código |
| Chefe: Hidra de Lama (Parte 2) | `HIDRA_ROOTS` | Hidra de Lama — raízes saindo do chão em linha | desenho no código |
| Chefe: Hidra de Lama (Parte 2) | `HIDRA_WATER_JET` | Hidra de Lama — jatos de água | desenho no código |
| Chefe: Hidra de Lama (Parte 2) | `HIDRA_WAVE` | Hidra de Lama — onda | desenho no código |
| Chefe: Hidra de Lama (Parte 2) | `HIDRA_DIVE` | Hidra de Lama — mergulho (some e reaparece) | desenho no código |
| Chefe: Hidra de Lama (Parte 2) | `HIDRA_MUD` | Hidra de Lama — cuspe de lama | desenho no código |
| Chefe: Hidra de Lama (Parte 2) | `HIDRA_STUNNED` | Hidra de Lama — cansado, núcleo exposto (hora de atacar) | desenho no código |
| Chefe: Hidra de Lama (Parte 2) | `HIDRA_HIT` | Hidra de Lama — recebe dano | desenho no código |
| Chefe: Hidra de Lama (Parte 2) | `HIDRA_DEATH` | Hidra de Lama — derrotado (se desfaz em luz) | desenho no código |
| Chefe: Tempestade Viva (Parte 2) | `TEMPESTADE_SLEEP` | Tempestade Viva — dormindo (antes da luta) | desenho no código |
| Chefe: Tempestade Viva (Parte 2) | `TEMPESTADE_IDLE` | Tempestade Viva — parado, respirando | desenho no código |
| Chefe: Tempestade Viva (Parte 2) | `TEMPESTADE_WAKE` | Tempestade Viva — acordando / rugido de apresentação | desenho no código |
| Chefe: Tempestade Viva (Parte 2) | `TEMPESTADE_ATTACK` | Tempestade Viva — ataque genérico (usado quando o golpe não tem arte própria) | desenho no código |
| Chefe: Tempestade Viva (Parte 2) | `TEMPESTADE_LIGHTNING` | Tempestade Viva — chama raios | desenho no código |
| Chefe: Tempestade Viva (Parte 2) | `TEMPESTADE_GUST` | Tempestade Viva — rajada de vento | desenho no código |
| Chefe: Tempestade Viva (Parte 2) | `TEMPESTADE_WATER_JET` | Tempestade Viva — jatos de água | desenho no código |
| Chefe: Tempestade Viva (Parte 2) | `TEMPESTADE_WAVE` | Tempestade Viva — onda | desenho no código |
| Chefe: Tempestade Viva (Parte 2) | `TEMPESTADE_FEATHERS` | Tempestade Viva — leque de penas | desenho no código |
| Chefe: Tempestade Viva (Parte 2) | `TEMPESTADE_STUNNED` | Tempestade Viva — cansado, núcleo exposto (hora de atacar) | desenho no código |
| Chefe: Tempestade Viva (Parte 2) | `TEMPESTADE_HIT` | Tempestade Viva — recebe dano | desenho no código |
| Chefe: Tempestade Viva (Parte 2) | `TEMPESTADE_DEATH` | Tempestade Viva — derrotado (se desfaz em luz) | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_SLEEP` | Quimera Primordial — dormindo (antes da luta) | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_IDLE` | Quimera Primordial — parado, respirando | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_WAKE` | Quimera Primordial — acordando / rugido de apresentação | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_ATTACK` | Quimera Primordial — ataque genérico (usado quando o golpe não tem arte própria) | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_SLAM` | Quimera Primordial — pisão (onda no chão) | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_THROW` | Quimera Primordial — arremesso de rocha | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_FIRE_RAIN` | Quimera Primordial — chuva de fogo | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_FIRE_FAN` | Quimera Primordial — leque de fogo | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_ROOTS` | Quimera Primordial — raízes saindo do chão em linha | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_THORNS` | Quimera Primordial — anel de espinhos | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_MUD` | Quimera Primordial — cuspe de lama | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_DIVE` | Quimera Primordial — mergulho (some e reaparece) | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_WATER_JET` | Quimera Primordial — jatos de água | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_WAVE` | Quimera Primordial — onda | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_GUST` | Quimera Primordial — rajada de vento | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_FEATHERS` | Quimera Primordial — leque de penas | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_LIGHTNING` | Quimera Primordial — chama raios | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_STUNNED` | Quimera Primordial — cansado, núcleo exposto (hora de atacar) | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_HIT` | Quimera Primordial — recebe dano | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_DEATH` | Quimera Primordial — derrotado (se desfaz em luz) | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_PHASE` | Quimera — muda de fase (troca a cor do núcleo e o elemento) | desenho no código |
| Chefe: Quimera Primordial (Parte 2) | `QUIMERA_CALM` | Quimera — acalmada no final (“é... quente”) | desenho no código |
| Fogos-fátuos dos elementos (Parte 2) | `WISP_EARTH_IDLE` | Fogo-fátuo de terra (verde-musgo) — flutuando | desenho no código |
| Fogos-fátuos dos elementos (Parte 2) | `WISP_EARTH_ATTACK` | Fogo-fátuo de terra (verde-musgo) — atirando | desenho no código |
| Fogos-fátuos dos elementos (Parte 2) | `WISP_EARTH_DEATH` | Fogo-fátuo de terra (verde-musgo) — apagando | desenho no código |
| Fogos-fátuos dos elementos (Parte 2) | `WISP_WATER_IDLE` | Fogo-fátuo de água (azul) — flutuando | desenho no código |
| Fogos-fátuos dos elementos (Parte 2) | `WISP_WATER_ATTACK` | Fogo-fátuo de água (azul) — atirando | desenho no código |
| Fogos-fátuos dos elementos (Parte 2) | `WISP_WATER_DEATH` | Fogo-fátuo de água (azul) — apagando | desenho no código |
| Fogos-fátuos dos elementos (Parte 2) | `WISP_AIR_IDLE` | Fogo-fátuo de ar (branco) — flutuando | desenho no código |
| Fogos-fátuos dos elementos (Parte 2) | `WISP_AIR_ATTACK` | Fogo-fátuo de ar (branco) — atirando | desenho no código |
| Fogos-fátuos dos elementos (Parte 2) | `WISP_AIR_DEATH` | Fogo-fátuo de ar (branco) — apagando | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `CORA_IDLE` | Dona Cora (jardineira do vale) — parado | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `CORA_TALK` | Dona Cora (jardineira do vale) — falando | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `CORA_SLEEP` | Dona Cora (jardineira do vale) — dormindo (noite) | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `TIAO_IDLE` | Seu Tião (pescador do lago) — parado | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `TIAO_TALK` | Seu Tião (pescador do lago) — falando | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `TIAO_SLEEP` | Seu Tião (pescador do lago) — dormindo (noite) | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `BRISA_IDLE` | Vó Brisa (pastora dos picos) — parado | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `BRISA_TALK` | Vó Brisa (pastora dos picos) — falando | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `BRISA_SLEEP` | Vó Brisa (pastora dos picos) — dormindo (noite) | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `ROSA_IDLE` | Dona Rosa (loja) — parado | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `ROSA_TALK` | Dona Rosa (loja) — falando | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `ROSA_SLEEP` | Dona Rosa (loja) — dormindo (noite) | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `BENTO_IDLE` | Seu Bento (ferraria) — parado | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `BENTO_TALK` | Seu Bento (ferraria) — falando | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `BENTO_SLEEP` | Seu Bento (ferraria) — dormindo (noite) | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `ZE_IDLE` | Seu Zé — parado | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `ZE_TALK` | Seu Zé — falando | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `ZE_SLEEP` | Seu Zé — dormindo (noite) | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `LURDES_IDLE` | Dona Lurdes — parado | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `LURDES_TALK` | Dona Lurdes — falando | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `LURDES_SLEEP` | Dona Lurdes — dormindo (noite) | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `PEDRO_IDLE` | Pedrinho — parado | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `PEDRO_TALK` | Pedrinho — falando | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `PEDRO_SLEEP` | Pedrinho — dormindo (noite) | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `TOBIAS_IDLE` | Tobias (caçador) — parado | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `TOBIAS_TALK` | Tobias (caçador) — falando | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `TOBIAS_SLEEP` | Tobias (caçador) — dormindo (noite) | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `TIAO_FISH` | Seu Tião — pescando no píer | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `BENTO_FORGE` | Seu Bento — martelando na bigorna | desenho no código |
| Moradores (todos, incluindo os da Parte 2) | `PEDRO_RUN` | Pedrinho — correndo pra lá e pra cá | desenho no código |
| Dragão amigo (Parte 2) | `DRAGON_TALK` | Dragão falando calmo (abertura da Parte 2) | `DRAGON_IDLE` |
| Dragão amigo (Parte 2) | `DRAGON_BOW` | Dragão abaixa a cabeça (pede ajuda / agradece) | `DRAGON_IDLE` |
| Dragão amigo (Parte 2) | `DRAGON_CURL_SLEEP` | Dragão dormindo enrolado perto da casa (fazenda) | `DRAGON_DEFEATED` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_IDLE_FRONT` | Line com Túnica Acolchoada — parada | `LINE_IDLE_FRONT` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_IDLE_BACK` | Line com Túnica Acolchoada — parada | `LINE_IDLE_BACK` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_IDLE_LEFT` | Line com Túnica Acolchoada — parada | `LINE_IDLE_LEFT` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_IDLE_RIGHT` | Line com Túnica Acolchoada — parada | `LINE_IDLE_RIGHT` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_WALK_FRONT` | Line com Túnica Acolchoada — andando | `LINE_WALK_FRONT` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_WALK_BACK` | Line com Túnica Acolchoada — andando | `LINE_WALK_BACK` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_WALK_LEFT` | Line com Túnica Acolchoada — andando | `LINE_WALK_LEFT` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_WALK_RIGHT` | Line com Túnica Acolchoada — andando | `LINE_WALK_RIGHT` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_RUN_FRONT` | Line com Túnica Acolchoada — correndo | `LINE_RUN_FRONT` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_RUN_BACK` | Line com Túnica Acolchoada — correndo | `LINE_RUN_BACK` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_RUN_LEFT` | Line com Túnica Acolchoada — correndo | `LINE_RUN_LEFT` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_RUN_RIGHT` | Line com Túnica Acolchoada — correndo | `LINE_RUN_RIGHT` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_COMBAT_IDLE` | Line com Túnica Acolchoada — em guarda | `LINE_COMBAT_IDLE` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_ATTACK_HORIZONTAL` | Line com Túnica Acolchoada — golpe horizontal | `LINE_ATTACK_HORIZONTAL` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_ATTACK_VERTICAL` | Line com Túnica Acolchoada — golpe vertical | `LINE_ATTACK_VERTICAL` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_ATTACK_COMBO` | Line com Túnica Acolchoada — golpe final do combo | `LINE_ATTACK_COMBO` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_ATTACK_SPIN` | Line com Túnica Acolchoada — giro | `LINE_ATTACK_SPIN` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_CAST_SPELL` | Line com Túnica Acolchoada — Raio de Luz | `LINE_ATTACK_VERTICAL` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_BLOCK` | Line com Túnica Acolchoada — defesa | `LINE_BLOCK` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_DODGE` | Line com Túnica Acolchoada — esquiva | `LINE_DODGE` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_JUMP` | Line com Túnica Acolchoada — pulo | `LINE_JUMP_RIGHT` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_HIT_LIGHT` | Line com Túnica Acolchoada — recebe dano | `LINE_HIT_LIGHT` |
| Line com armadura: Túnica Acolchoada | `LINE_TUNICA_KNOCKDOWN` | Line com Túnica Acolchoada — cai no chão | `LINE_KNOCKDOWN` |
| Line com armadura: Cota de Malha | `LINE_MALHA_IDLE_FRONT` | Line com Cota de Malha — parada | `LINE_IDLE_FRONT` |
| Line com armadura: Cota de Malha | `LINE_MALHA_IDLE_BACK` | Line com Cota de Malha — parada | `LINE_IDLE_BACK` |
| Line com armadura: Cota de Malha | `LINE_MALHA_IDLE_LEFT` | Line com Cota de Malha — parada | `LINE_IDLE_LEFT` |
| Line com armadura: Cota de Malha | `LINE_MALHA_IDLE_RIGHT` | Line com Cota de Malha — parada | `LINE_IDLE_RIGHT` |
| Line com armadura: Cota de Malha | `LINE_MALHA_WALK_FRONT` | Line com Cota de Malha — andando | `LINE_WALK_FRONT` |
| Line com armadura: Cota de Malha | `LINE_MALHA_WALK_BACK` | Line com Cota de Malha — andando | `LINE_WALK_BACK` |
| Line com armadura: Cota de Malha | `LINE_MALHA_WALK_LEFT` | Line com Cota de Malha — andando | `LINE_WALK_LEFT` |
| Line com armadura: Cota de Malha | `LINE_MALHA_WALK_RIGHT` | Line com Cota de Malha — andando | `LINE_WALK_RIGHT` |
| Line com armadura: Cota de Malha | `LINE_MALHA_RUN_FRONT` | Line com Cota de Malha — correndo | `LINE_RUN_FRONT` |
| Line com armadura: Cota de Malha | `LINE_MALHA_RUN_BACK` | Line com Cota de Malha — correndo | `LINE_RUN_BACK` |
| Line com armadura: Cota de Malha | `LINE_MALHA_RUN_LEFT` | Line com Cota de Malha — correndo | `LINE_RUN_LEFT` |
| Line com armadura: Cota de Malha | `LINE_MALHA_RUN_RIGHT` | Line com Cota de Malha — correndo | `LINE_RUN_RIGHT` |
| Line com armadura: Cota de Malha | `LINE_MALHA_COMBAT_IDLE` | Line com Cota de Malha — em guarda | `LINE_COMBAT_IDLE` |
| Line com armadura: Cota de Malha | `LINE_MALHA_ATTACK_HORIZONTAL` | Line com Cota de Malha — golpe horizontal | `LINE_ATTACK_HORIZONTAL` |
| Line com armadura: Cota de Malha | `LINE_MALHA_ATTACK_VERTICAL` | Line com Cota de Malha — golpe vertical | `LINE_ATTACK_VERTICAL` |
| Line com armadura: Cota de Malha | `LINE_MALHA_ATTACK_COMBO` | Line com Cota de Malha — golpe final do combo | `LINE_ATTACK_COMBO` |
| Line com armadura: Cota de Malha | `LINE_MALHA_ATTACK_SPIN` | Line com Cota de Malha — giro | `LINE_ATTACK_SPIN` |
| Line com armadura: Cota de Malha | `LINE_MALHA_CAST_SPELL` | Line com Cota de Malha — Raio de Luz | `LINE_ATTACK_VERTICAL` |
| Line com armadura: Cota de Malha | `LINE_MALHA_BLOCK` | Line com Cota de Malha — defesa | `LINE_BLOCK` |
| Line com armadura: Cota de Malha | `LINE_MALHA_DODGE` | Line com Cota de Malha — esquiva | `LINE_DODGE` |
| Line com armadura: Cota de Malha | `LINE_MALHA_JUMP` | Line com Cota de Malha — pulo | `LINE_JUMP_RIGHT` |
| Line com armadura: Cota de Malha | `LINE_MALHA_HIT_LIGHT` | Line com Cota de Malha — recebe dano | `LINE_HIT_LIGHT` |
| Line com armadura: Cota de Malha | `LINE_MALHA_KNOCKDOWN` | Line com Cota de Malha — cai no chão | `LINE_KNOCKDOWN` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_IDLE_FRONT` | Line com Armadura de Brasa — parada | `LINE_IDLE_FRONT` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_IDLE_BACK` | Line com Armadura de Brasa — parada | `LINE_IDLE_BACK` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_IDLE_LEFT` | Line com Armadura de Brasa — parada | `LINE_IDLE_LEFT` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_IDLE_RIGHT` | Line com Armadura de Brasa — parada | `LINE_IDLE_RIGHT` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_WALK_FRONT` | Line com Armadura de Brasa — andando | `LINE_WALK_FRONT` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_WALK_BACK` | Line com Armadura de Brasa — andando | `LINE_WALK_BACK` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_WALK_LEFT` | Line com Armadura de Brasa — andando | `LINE_WALK_LEFT` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_WALK_RIGHT` | Line com Armadura de Brasa — andando | `LINE_WALK_RIGHT` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_RUN_FRONT` | Line com Armadura de Brasa — correndo | `LINE_RUN_FRONT` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_RUN_BACK` | Line com Armadura de Brasa — correndo | `LINE_RUN_BACK` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_RUN_LEFT` | Line com Armadura de Brasa — correndo | `LINE_RUN_LEFT` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_RUN_RIGHT` | Line com Armadura de Brasa — correndo | `LINE_RUN_RIGHT` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_COMBAT_IDLE` | Line com Armadura de Brasa — em guarda | `LINE_COMBAT_IDLE` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_ATTACK_HORIZONTAL` | Line com Armadura de Brasa — golpe horizontal | `LINE_ATTACK_HORIZONTAL` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_ATTACK_VERTICAL` | Line com Armadura de Brasa — golpe vertical | `LINE_ATTACK_VERTICAL` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_ATTACK_COMBO` | Line com Armadura de Brasa — golpe final do combo | `LINE_ATTACK_COMBO` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_ATTACK_SPIN` | Line com Armadura de Brasa — giro | `LINE_ATTACK_SPIN` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_CAST_SPELL` | Line com Armadura de Brasa — Raio de Luz | `LINE_ATTACK_VERTICAL` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_BLOCK` | Line com Armadura de Brasa — defesa | `LINE_BLOCK` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_DODGE` | Line com Armadura de Brasa — esquiva | `LINE_DODGE` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_JUMP` | Line com Armadura de Brasa — pulo | `LINE_JUMP_RIGHT` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_HIT_LIGHT` | Line com Armadura de Brasa — recebe dano | `LINE_HIT_LIGHT` |
| Line com armadura: Armadura de Brasa | `LINE_BRASA_KNOCKDOWN` | Line com Armadura de Brasa — cai no chão | `LINE_KNOCKDOWN` |
| Bell com armadura: Vestido Reforçado | `BELL_VESTIDO_IDLE_FRONT` | Bell com Vestido Reforçado — parada | `BELL_IDLE_FRONT` |
| Bell com armadura: Vestido Reforçado | `BELL_VESTIDO_IDLE_BACK` | Bell com Vestido Reforçado — parada | `BELL_IDLE_BACK` |
| Bell com armadura: Vestido Reforçado | `BELL_VESTIDO_IDLE_LEFT` | Bell com Vestido Reforçado — parada | `BELL_IDLE_LEFT` |
| Bell com armadura: Vestido Reforçado | `BELL_VESTIDO_IDLE_RIGHT` | Bell com Vestido Reforçado — parada | `BELL_IDLE_RIGHT` |
| Bell com armadura: Vestido Reforçado | `BELL_VESTIDO_WALK_FRONT` | Bell com Vestido Reforçado — andando | `BELL_WALK_FRONT` |
| Bell com armadura: Vestido Reforçado | `BELL_VESTIDO_WALK_BACK` | Bell com Vestido Reforçado — andando | `BELL_WALK_BACK` |
| Bell com armadura: Vestido Reforçado | `BELL_VESTIDO_WALK_LEFT` | Bell com Vestido Reforçado — andando | `BELL_WALK_LEFT` |
| Bell com armadura: Vestido Reforçado | `BELL_VESTIDO_WALK_RIGHT` | Bell com Vestido Reforçado — andando | `BELL_WALK_RIGHT` |
| Bell com armadura: Vestido Reforçado | `BELL_VESTIDO_RUN_FRONT` | Bell com Vestido Reforçado — correndo | `BELL_RUN_FRONT` |
| Bell com armadura: Vestido Reforçado | `BELL_VESTIDO_RUN_BACK` | Bell com Vestido Reforçado — correndo | `BELL_RUN_BACK` |
| Bell com armadura: Vestido Reforçado | `BELL_VESTIDO_RUN_LEFT` | Bell com Vestido Reforçado — correndo | `BELL_RUN_LEFT` |
| Bell com armadura: Vestido Reforçado | `BELL_VESTIDO_RUN_RIGHT` | Bell com Vestido Reforçado — correndo | `BELL_RUN_RIGHT` |
| Bell com armadura: Vestido Reforçado | `BELL_VESTIDO_COMBAT_IDLE` | Bell com Vestido Reforçado — em guarda | `BELL_IDLE_RIGHT` |
| Bell com armadura: Vestido Reforçado | `BELL_VESTIDO_ATTACK_STAR` | Bell com Vestido Reforçado — atira estrela | `BELL_HIGH_FIVE` |
| Bell com armadura: Vestido Reforçado | `BELL_VESTIDO_ATTACK_SPREAD` | Bell com Vestido Reforçado — leque de estrelas | `BELL_DANCE` |
| Bell com armadura: Vestido Reforçado | `BELL_VESTIDO_SING` | Bell com Vestido Reforçado — canção | `BELL_HAPPY` |
| Bell com armadura: Vestido Reforçado | `BELL_VESTIDO_BLOCK` | Bell com Vestido Reforçado — escudo de luz | `BELL_IDLE_RIGHT` |
| Bell com armadura: Vestido Reforçado | `BELL_VESTIDO_DODGE` | Bell com Vestido Reforçado — esquiva | `BELL_JUMP` |
| Bell com armadura: Vestido Reforçado | `BELL_VESTIDO_JUMP` | Bell com Vestido Reforçado — pulo | `BELL_JUMP` |
| Bell com armadura: Vestido Reforçado | `BELL_VESTIDO_HIT` | Bell com Vestido Reforçado — recebe dano | `BELL_SCARED` |
| Bell com armadura: Vestido Reforçado | `BELL_VESTIDO_KNOCKDOWN` | Bell com Vestido Reforçado — cai no chão | `BELL_FALL` |
| Bell com armadura: Manto Estelar | `BELL_ESTELAR_IDLE_FRONT` | Bell com Manto Estelar — parada | `BELL_IDLE_FRONT` |
| Bell com armadura: Manto Estelar | `BELL_ESTELAR_IDLE_BACK` | Bell com Manto Estelar — parada | `BELL_IDLE_BACK` |
| Bell com armadura: Manto Estelar | `BELL_ESTELAR_IDLE_LEFT` | Bell com Manto Estelar — parada | `BELL_IDLE_LEFT` |
| Bell com armadura: Manto Estelar | `BELL_ESTELAR_IDLE_RIGHT` | Bell com Manto Estelar — parada | `BELL_IDLE_RIGHT` |
| Bell com armadura: Manto Estelar | `BELL_ESTELAR_WALK_FRONT` | Bell com Manto Estelar — andando | `BELL_WALK_FRONT` |
| Bell com armadura: Manto Estelar | `BELL_ESTELAR_WALK_BACK` | Bell com Manto Estelar — andando | `BELL_WALK_BACK` |
| Bell com armadura: Manto Estelar | `BELL_ESTELAR_WALK_LEFT` | Bell com Manto Estelar — andando | `BELL_WALK_LEFT` |
| Bell com armadura: Manto Estelar | `BELL_ESTELAR_WALK_RIGHT` | Bell com Manto Estelar — andando | `BELL_WALK_RIGHT` |
| Bell com armadura: Manto Estelar | `BELL_ESTELAR_RUN_FRONT` | Bell com Manto Estelar — correndo | `BELL_RUN_FRONT` |
| Bell com armadura: Manto Estelar | `BELL_ESTELAR_RUN_BACK` | Bell com Manto Estelar — correndo | `BELL_RUN_BACK` |
| Bell com armadura: Manto Estelar | `BELL_ESTELAR_RUN_LEFT` | Bell com Manto Estelar — correndo | `BELL_RUN_LEFT` |
| Bell com armadura: Manto Estelar | `BELL_ESTELAR_RUN_RIGHT` | Bell com Manto Estelar — correndo | `BELL_RUN_RIGHT` |
| Bell com armadura: Manto Estelar | `BELL_ESTELAR_COMBAT_IDLE` | Bell com Manto Estelar — em guarda | `BELL_IDLE_RIGHT` |
| Bell com armadura: Manto Estelar | `BELL_ESTELAR_ATTACK_STAR` | Bell com Manto Estelar — atira estrela | `BELL_HIGH_FIVE` |
| Bell com armadura: Manto Estelar | `BELL_ESTELAR_ATTACK_SPREAD` | Bell com Manto Estelar — leque de estrelas | `BELL_DANCE` |
| Bell com armadura: Manto Estelar | `BELL_ESTELAR_SING` | Bell com Manto Estelar — canção | `BELL_HAPPY` |
| Bell com armadura: Manto Estelar | `BELL_ESTELAR_BLOCK` | Bell com Manto Estelar — escudo de luz | `BELL_IDLE_RIGHT` |
| Bell com armadura: Manto Estelar | `BELL_ESTELAR_DODGE` | Bell com Manto Estelar — esquiva | `BELL_JUMP` |
| Bell com armadura: Manto Estelar | `BELL_ESTELAR_JUMP` | Bell com Manto Estelar — pulo | `BELL_JUMP` |
| Bell com armadura: Manto Estelar | `BELL_ESTELAR_HIT` | Bell com Manto Estelar — recebe dano | `BELL_SCARED` |
| Bell com armadura: Manto Estelar | `BELL_ESTELAR_KNOCKDOWN` | Bell com Manto Estelar — cai no chão | `BELL_FALL` |
| Bell com armadura: Armadura da Aurora | `BELL_AURORA_IDLE_FRONT` | Bell com Armadura da Aurora — parada | `BELL_IDLE_FRONT` |
| Bell com armadura: Armadura da Aurora | `BELL_AURORA_IDLE_BACK` | Bell com Armadura da Aurora — parada | `BELL_IDLE_BACK` |
| Bell com armadura: Armadura da Aurora | `BELL_AURORA_IDLE_LEFT` | Bell com Armadura da Aurora — parada | `BELL_IDLE_LEFT` |
| Bell com armadura: Armadura da Aurora | `BELL_AURORA_IDLE_RIGHT` | Bell com Armadura da Aurora — parada | `BELL_IDLE_RIGHT` |
| Bell com armadura: Armadura da Aurora | `BELL_AURORA_WALK_FRONT` | Bell com Armadura da Aurora — andando | `BELL_WALK_FRONT` |
| Bell com armadura: Armadura da Aurora | `BELL_AURORA_WALK_BACK` | Bell com Armadura da Aurora — andando | `BELL_WALK_BACK` |
| Bell com armadura: Armadura da Aurora | `BELL_AURORA_WALK_LEFT` | Bell com Armadura da Aurora — andando | `BELL_WALK_LEFT` |
| Bell com armadura: Armadura da Aurora | `BELL_AURORA_WALK_RIGHT` | Bell com Armadura da Aurora — andando | `BELL_WALK_RIGHT` |
| Bell com armadura: Armadura da Aurora | `BELL_AURORA_RUN_FRONT` | Bell com Armadura da Aurora — correndo | `BELL_RUN_FRONT` |
| Bell com armadura: Armadura da Aurora | `BELL_AURORA_RUN_BACK` | Bell com Armadura da Aurora — correndo | `BELL_RUN_BACK` |
| Bell com armadura: Armadura da Aurora | `BELL_AURORA_RUN_LEFT` | Bell com Armadura da Aurora — correndo | `BELL_RUN_LEFT` |
| Bell com armadura: Armadura da Aurora | `BELL_AURORA_RUN_RIGHT` | Bell com Armadura da Aurora — correndo | `BELL_RUN_RIGHT` |
| Bell com armadura: Armadura da Aurora | `BELL_AURORA_COMBAT_IDLE` | Bell com Armadura da Aurora — em guarda | `BELL_IDLE_RIGHT` |
| Bell com armadura: Armadura da Aurora | `BELL_AURORA_ATTACK_STAR` | Bell com Armadura da Aurora — atira estrela | `BELL_HIGH_FIVE` |
| Bell com armadura: Armadura da Aurora | `BELL_AURORA_ATTACK_SPREAD` | Bell com Armadura da Aurora — leque de estrelas | `BELL_DANCE` |
| Bell com armadura: Armadura da Aurora | `BELL_AURORA_SING` | Bell com Armadura da Aurora — canção | `BELL_HAPPY` |
| Bell com armadura: Armadura da Aurora | `BELL_AURORA_BLOCK` | Bell com Armadura da Aurora — escudo de luz | `BELL_IDLE_RIGHT` |
| Bell com armadura: Armadura da Aurora | `BELL_AURORA_DODGE` | Bell com Armadura da Aurora — esquiva | `BELL_JUMP` |
| Bell com armadura: Armadura da Aurora | `BELL_AURORA_JUMP` | Bell com Armadura da Aurora — pulo | `BELL_JUMP` |
| Bell com armadura: Armadura da Aurora | `BELL_AURORA_HIT` | Bell com Armadura da Aurora — recebe dano | `BELL_SCARED` |
| Bell com armadura: Armadura da Aurora | `BELL_AURORA_KNOCKDOWN` | Bell com Armadura da Aurora — cai no chão | `BELL_FALL` |

## Como mandar arte nova

Qualquer um destes formatos funciona:

1. **HTML de item** (`LINE_BELL_ITEM_NN.html`), nos dois formatos já usados: `const animations` (PNG por quadro) ou `const payload` (lista de imagens e, para cada animação, a ordem dos quadros, o fps e uma descrição). Quadros 1254×1254 com fundo transparente.
2. **HTML de laboratório** (`*LABORATORIO*.html`).
3. **Pasta em `arte/`**: `arte/<grupo>/<CODIGO>/00.png, 01.png…` com um `config.json` (`{"unidades_por_px": 0.62}`).

Depois, `python3 tools/extrair_sprites.py` gera as folhas e registra tudo no jogo. O código de cada animação precisa ser **exatamente** o da lista. Animações de lado podem vir só viradas para a **direita**: o jogo espelha. O tamanho de cada personagem é igualado sozinho entre as animações.

## ⭐ Theo: layout oficial

A arte do Theo que está hoje no jogo (`arte/referencias/theo_shihtzu.png`) é o **layout oficial** para a arte final: só melhorar, sem perder os traços. Detalhes na seção 2 da [documentação](docs/LINE_E_BELL_DOCUMENTACAO.md).
