'use strict';
window.LB = window.LB || {};

(function (LB) {
  // Catálogo de tudo o que o jogo pede. Cada código segue o plano de animações.
  // dir: família com _FRONT/_BACK/_LEFT/_RIGHT. face 'R': arte olha para a direita
  // (é espelhada para a esquerda); 'F': de frente (nunca espelha).
  // alt: o que usar enquanto a arte ainda não existe.
  const CATALOGO = {};
  const GRUPOS = [];

  function grupo(nome, lista) {
    GRUPOS.push({ nome, codigos: lista.map(([codigo]) => codigo) });
    for (const [codigo, desc, opcoes] of lista) {
      CATALOGO[codigo] = Object.assign({ fps: 12, loop: false, face: 'R', quadros: 12, desc, codigo }, opcoes || {});
    }
  }

  const LADOS = ['LEFT', 'RIGHT'];
  const QUATRO = ['FRONT', 'BACK', 'LEFT', 'RIGHT'];

  grupo('Primeiro encontro (prólogo)', [
    // Itens 257 a 264: 12 quadros cada, no ritmo da artista (8 e 6 quadros por segundo).
    ['LINE_ADMIRE', 'Line vê a Bell de longe (“puxa ela é tão linda”)', { fpsMax: 8, fps: 8, face: 'F', quadros: 12, alt: 'LINE_HAPPY', nova: true }],
    ['BELL_WAIT', 'Bell esperando a Line no shopping', { fpsMax: 8, fps: 8, loop: true, quadros: 12, alt: 'BELL_IDLE', nova: true }],
    ['LINE_BELL_MEET', 'Frente a frente, sorrindo (conversa no shopping)', { fpsMax: 6, fps: 6, loop: true, face: 'F', quadros: 12, alt: 'LINE_BELL_HOLD_HANDS', nova: true }],
    ['LINE_BELL_GREET_HUG', 'Abraço de chegada (“Você tá atrasada”)', { fpsMax: 6, fps: 6, loop: true, face: 'F', quadros: 12, alt: 'LINE_BELL_RESCUE_HUG', nova: true }],
    ['LINE_BELL_BK', 'Comendo BK juntas, sentadas na mesa da praça', { fpsMax: 6, fps: 6, loop: true, face: 'F', quadros: 12, alt: 'LINE_BELL_EAT', nova: true }],
    // Itens 265 e 266: cada uma na sua cadeira (a arte traz a cadeira), frente a frente na mesa do BK.
    ['LINE_SIT_CHAIR_EAT', 'Line sentada comendo, virada para a direita', { fps: 6, loop: true, face: 'R', quadros: 12, nova: true }],
    ['BELL_SIT_CHAIR_EAT', 'Bell sentada comendo, virada para a esquerda', { fps: 6, loop: true, face: 'F', quadros: 12, nova: true }],
    ['LINE_PUNCH_MACHINE', 'Soco na máquina (primeiro encontro)', { fps: 10, face: 'F', quadros: 16 }],
    ['LINE_PUNCH', 'Soco sem espada (usa a arte do soco na máquina, em 6 quadros)', { fps: 16, face: 'R', quadros: 6 }],
    ['BELL_LAUGH_AT_LINE', 'Bell gargalhando do soco da Line', { fpsMax: 8, fps: 8, loop: true, face: 'F', quadros: 12, alt: 'BELL_LAUGH', nova: true }],
    ['LINE_BELL_TUNNEL_KISS', 'O primeiro beijo, no túnel', { fpsMax: 6, fps: 6, face: 'F', quadros: 12, alt: 'LINE_BELL_KISS', nova: true }],
  ]);

  grupo('Line — movimento', [
    ['LINE_IDLE', 'Parada', { dir: QUATRO, fps: 8, loop: true, quadros: 16 }],
    ['LINE_LOOK_SIDES_FRONT', 'Olhar para os lados', { fps: 8, face: 'F' }],
    ['LINE_BLINK_FRONT', 'Piscar', { fps: 12, face: 'F' }],
    ['LINE_WALK', 'Andar', { dir: QUATRO, fps: 14, loop: true, quadros: 16 }],
    ['LINE_RUN', 'Correr', { dir: QUATRO, fps: 20, loop: true, quadros: 16 }],
    ['LINE_RUN_START', 'Começar a correr', { dir: QUATRO, fps: 26, quadros: 8 }],
    ['LINE_RUN_STOP', 'Parar de correr', { dir: QUATRO, fps: 22, quadros: 8 }],
    ['LINE_JUMP', 'Pular', { dir: LADOS, fps: 20 }],
    ['LINE_LAND', 'Aterrissar', { dir: LADOS, fps: 20, quadros: 10, chao: 'fim' }],
    ['LINE_CROUCH', 'Agachar', { fps: 20, quadros: 10 }],
    ['LINE_CROUCH_STAND', 'Levantar do agachamento', { fps: 20, quadros: 10 }],
    ['LINE_STUMBLE', 'Tropeçar', { fps: 16 }],
    ['LINE_FALL', 'Cair', { fps: 14, chao: 'quadro' }],
    ['LINE_GROUND_STAND', 'Levantar do chão', { fps: 14, quadros: 14, chao: 'quadro' }],
  ]);

  grupo('Line — combate', [
    ['LINE_SWORD_DRAW', 'Sacar espada', { fps: 24 }],
    ['LINE_SWORD_SHEATHE', 'Guardar espada', { fps: 20, quadros: 14 }],
    ['LINE_COMBAT_IDLE', 'Postura de combate', { fps: 10, loop: true, quadros: 16 }],
    ['LINE_COMBAT_WALK', 'Andar com a espada em mãos', { dir: QUATRO, fps: 14, loop: true, quadros: 16, alt: 'LINE_WALK', nova: true }],
    ['LINE_COMBAT_RUN', 'Correr com a espada em mãos', { dir: QUATRO, fps: 20, loop: true, quadros: 16, alt: 'LINE_RUN', nova: true }],
    ['LINE_ATTACK_HORIZONTAL', 'Ataque horizontal', { fps: 34, quadros: 16 }],
    ['LINE_ATTACK_VERTICAL', 'Ataque vertical', { fps: 34, quadros: 18 }],
    ['LINE_ATTACK_DIAGONAL', 'Ataque diagonal', { fps: 38, quadros: 22 }],
    ['LINE_ATTACK_COMBO', 'Combo', { fps: 32, quadros: 22 }],
    // Golpes para baixo (_FRONT) e para cima (_BACK), itens 241 a 246: o jogo usa quando a Line ataca
    // um alvo abaixo ou acima dela; o tempo e o acerto são os do golpe de lado.
    ['LINE_ATTACK_HORIZONTAL_FRONT', 'Ataque horizontal para baixo', { fps: 34, quadros: 16, face: 'F' }],
    ['LINE_ATTACK_HORIZONTAL_BACK', 'Ataque horizontal para cima', { fps: 34, quadros: 16, face: 'F' }],
    ['LINE_ATTACK_VERTICAL_FRONT', 'Ataque vertical para baixo', { fps: 34, quadros: 18, face: 'F' }],
    ['LINE_ATTACK_VERTICAL_BACK', 'Ataque vertical para cima', { fps: 34, quadros: 18, face: 'F' }],
    ['LINE_ATTACK_COMBO_FRONT', 'Combo para baixo', { fps: 32, quadros: 22, face: 'F' }],
    ['LINE_ATTACK_COMBO_BACK', 'Combo para cima', { fps: 32, quadros: 22, face: 'F' }],
    // Itens 247 a 252: investida, soco e Raio de Luz para baixo e para cima.
    ['LINE_ATTACK_DIAGONAL_FRONT', 'Investida para baixo', { fps: 38, quadros: 22, face: 'F' }],
    ['LINE_ATTACK_DIAGONAL_BACK', 'Investida para cima', { fps: 38, quadros: 22, face: 'F' }],
    ['LINE_PUNCH_FRONT', 'Soco sem espada para baixo', { fps: 16, quadros: 6, face: 'F' }],
    ['LINE_PUNCH_BACK', 'Soco sem espada para cima', { fps: 16, quadros: 6, face: 'F' }],
    ['LINE_CAST_SPELL_FRONT', 'Raio de Luz para baixo', { fps: 34, quadros: 18, face: 'F' }],
    ['LINE_CAST_SPELL_BACK', 'Raio de Luz para cima', { fps: 34, quadros: 18, face: 'F' }],
    ['LINE_ATTACK_SPIN', 'Ataque giratório', { fps: 30, quadros: 18 }],
    ['LINE_ATTACK_AIR', 'Ataque aéreo', { fps: 28, quadros: 20 }],
    ['LINE_BLOCK', 'Bloquear', { fps: 24, quadros: 16 }],
    ['LINE_DODGE', 'Esquivar', { fps: 30, quadros: 16 }],
    ['LINE_DASH', 'Dash', { fps: 30, quadros: 16 }],
    ['LINE_HIT_LIGHT', 'Receber dano leve', { fps: 32, quadros: 16 }],
    ['LINE_HIT_HEAVY', 'Receber golpe forte', { fps: 22, quadros: 14, chao: 'quadro' }],
    ['LINE_THROWN', 'Ser arremessada', { fps: 22, quadros: 14, chao: 'quadro' }],
    ['LINE_KNOCKDOWN', 'Cair após golpe', { fps: 20, quadros: 24, chao: 'quadro' }],
    ['LINE_INJURED_STAND', 'Levantar machucada', { fps: 17, quadros: 28, chao: 'quadro' }],
    ['LINE_EXHAUSTED_IDLE', 'Exausta', { fps: 10, loop: true, quadros: 20 }],
    ['LINE_DRAGON_FINAL_ATTACK', 'Ataque final contra o dragão', { fps: 14, quadros: 32 }],
  ]);

  grupo('Line — emoções', [
    ['LINE_HAPPY', 'Feliz (item 272)', { fps: 6, face: 'F', quadros: 12, alt: 'LINE_VICTORY' }],
    ['LINE_LAUGH', 'Rindo', { fps: 12, face: 'F', quadros: 24 }],
    ['LINE_DETERMINED', 'Determinada', { fps: 10, loop: true, quadros: 20, alt: 'LINE_COMBAT_IDLE' }],
    ['LINE_ANGRY', 'Brava', { fps: 10, loop: true, quadros: 20, alt: 'LINE_COMBAT_IDLE' }],
    ['LINE_SCARED', 'Assustada', { fps: 10, loop: true, quadros: 20, alt: 'LINE_IDLE_FRONT' }],
    ['LINE_SAD', 'Triste', { fps: 8, loop: true, quadros: 20, alt: 'LINE_IDLE_FRONT' }],
    ['LINE_CRY', 'Chorando', { fps: 8, loop: true, quadros: 24, alt: 'LINE_SAD' }],
    ['LINE_CALL_BELL', 'Gritando por Bell', { fps: 12, quadros: 24, alt: 'LINE_IDLE_BACK' }],
    ['LINE_RELIEVED', 'Aliviada', { fps: 10, quadros: 20, alt: 'LINE_HAPPY' }],
    ['LINE_VICTORY', 'Comemorando a vitória', { fps: 10, face: 'F', quadros: 20, alt: 'LINE_HAPPY', nova: true }],
  ]);

  // Enquanto não houver arte própria, cada animação da Bell usa a mais parecida que já existe.
  grupo('Bell', [
    ['BELL_IDLE', 'Parada', { dir: QUATRO, fps: 8, loop: true, quadros: 16 }],
    ['BELL_BLINK_FRONT', 'Piscar', { face: 'F', alt: 'BELL_IDLE_FRONT' }],
    ['BELL_LOOK_SIDES_FRONT', 'Olhar para os lados', { face: 'F', fps: 8, quadros: 24, alt: 'BELL_IDLE_FRONT' }],
    // Mesmo passo da Line: andar num ciclo de ~1,1 s e correr em ~0,8 s (antes a Bell andava a 24 quadros por segundo).
    ['BELL_WALK', 'Andar', { dir: QUATRO, fps: 14, loop: true, quadros: 16 }],
    ['BELL_RUN', 'Correr', { dir: QUATRO, fps: 20, loop: true, quadros: 16, alt: 'BELL_WALK' }],
    ['BELL_LAUGH', 'Gargalhada', { fps: 10, loop: true, face: 'F', quadros: 16, nova: true }],
    ['BELL_JUMP', 'Pular', { fps: 16, quadros: 12, alt: 'BELL_IDLE' }],
    ['BELL_LAND', 'Aterrissar', { fps: 16, quadros: 8, alt: 'BELL_IDLE' }],
    ['BELL_GROUND_STAND', 'Levantar do chão', { alt: 'BELL_IDLE' }],
    ['BELL_SCARED', 'Assustada', { loop: true, face: 'F', alt: 'BELL_IDLE', tremer: true }],
    ['BELL_FLEE', 'Fugir', { loop: true, alt: 'BELL_RUN' }],
    ['BELL_FALL', 'Cair', { alt: 'BELL_IDLE' }],
    ['BELL_CAPTURED', 'Ser capturada', { alt: 'BELL_IDLE_FRONT', tremer: true }],
    ['BELL_DRAGON_CARRIED', 'Pendurada nas garras do dragão, de braços para cima (item 275)', { fps: 6, loop: true, face: 'F', quadros: 12, alt: 'BELL_IDLE_FRONT', balancar: true }],
    ['BELL_TRAPPED', 'Presa', { loop: true, face: 'F', alt: 'BELL_IDLE_FRONT' }],
    ['BELL_ESCAPE_ATTEMPT', 'Tentar escapar', { loop: true, face: 'F', alt: 'BELL_IDLE_FRONT', tremer: true }],
    ['BELL_BREAK_FREE', 'Conseguir se libertar', { face: 'F', alt: 'BELL_LAUGH' }],
    ['BELL_CALL_LINE', 'Chamar Line', { loop: true, face: 'F', alt: 'BELL_IDLE_FRONT', pular: true }],
    ['BELL_HELP_LINE', 'Ajudar Line', { alt: 'BELL_IDLE' }],
    ['BELL_HAPPY', 'Feliz (item 273)', { fps: 6, loop: true, face: 'F', quadros: 12, alt: 'BELL_LAUGH' }],
    ['BELL_RELIEVED', 'Aliviada', { face: 'F', alt: 'BELL_LAUGH' }],
    ['BELL_CRY', 'Chorando', { loop: true, face: 'F', alt: 'BELL_IDLE_FRONT' }],
    ['BELL_CURTSY', 'Reverência', { fps: 8, face: 'F', quadros: 12, alt: 'BELL_IDLE_FRONT', nova: true }],
    ['BELL_HIGH_FIVE', 'Toca aqui', { fps: 8, face: 'F', quadros: 7, alt: 'BELL_LAUGH', nova: true }],
    ['BELL_DANCE', 'Dançando (giro)', { fps: 5, loop: true, face: 'F', quadros: 4, alt: 'BELL_LAUGH', nova: true }],
  ]);

  grupo('Line e Bell juntas', [
    ['LINE_BELL_WALK_TOGETHER', 'Andando lado a lado (itens 277 a 279)', { dir: QUATRO, fps: 14, loop: true, quadros: 16 }],
    ['LINE_BELL_WALK_HANDS', 'Andando de mãos dadas (itens 274, 280 e 281)', { dir: QUATRO, fps: 14, loop: true, quadros: 16 }],
    ['LINE_BELL_RUN_TOGETHER', 'Correndo juntas de mãos dadas, a Line puxando (itens 282 a 284)', { dir: QUATRO, fps: 20, loop: true, quadros: 16 }],
    ['LINE_BELL_TALK', 'Conversando', { fps: 6, loop: true, face: 'F', quadros: 12 }],
    ['LINE_BELL_LAUGH', 'Rindo juntas', { loop: true }],
    ['LINE_BELL_EAT', 'Almoçando juntas', { fps: 6, loop: true, face: 'F', quadros: 24, nova: true }],
    ['LINE_BELL_KISS', 'Bitoquinha (item 269)', { fps: 6, face: 'F', quadros: 12, nova: true }],
    ['BELL_LEAN_ON_LINE', 'Bell encostando na Line'],
    ['LINE_BELL_HOLD_HANDS', 'De mãos dadas no pôr do sol (item 267)', { fps: 6, loop: true, face: 'F', quadros: 12 }],
    ['LINE_BELL_RESCUE_HUG', 'Abraço do resgate', { quadros: 24, loop: true, face: 'F' }],
    ['LINE_BELL_HUG_RELEASE', 'Separação do abraço'],
    ['LINE_BELL_CELEBRATE', 'Comemorando (item 270)', { fps: 6, face: 'F', quadros: 12 }],
    ['LINE_BELL_HIGH_FIVE', 'Toca aqui com brilho (item 271)', { fps: 6, face: 'F', quadros: 12, nova: true }],
    ['LINE_BELL_DANCE', 'A Line girando a Bell pela mão (item 268)', { fps: 6, loop: true, face: 'F', quadros: 12, nova: true }],
    ['LINE_BELL_SIT_DOWN', 'Sentando juntas'],
    ['BELL_HEAD_ON_LINE', 'Bell apoiando a cabeça na Line'],
    ['LINE_BELL_SIT_IDLE', 'Idle das duas sentadas', { loop: true }],
  ]);

  grupo('Dragão', [
    ['DRAGON_IDLE', 'Parado respirando', { loop: true, fps: 2.5, quadros: 4 }],
    ['DRAGON_BLINK', 'Piscar', { alt: 'DRAGON_IDLE' }],
    ['DRAGON_WALK', 'Andar', { loop: true, fps: 8, quadros: 6 }],
    ['DRAGON_RUN', 'Correr', { loop: true, fps: 13, quadros: 6, alt: 'DRAGON_WALK' }],
    ['DRAGON_TURN', 'Virar', { alt: 'DRAGON_IDLE' }],
    ['DRAGON_WINGS_OPEN', 'Abrir asas', { alt: 'DRAGON_TAKEOFF' }],
    ['DRAGON_TAKEOFF', 'Decolar', { fps: 7, quadros: 5 }],
    ['DRAGON_FLY', 'Voar', { loop: true, fps: 8, quadros: 5 }],
    ['DRAGON_GLIDE', 'Planar', { loop: true, alt: 'DRAGON_FLY' }],
    ['DRAGON_LAND', 'Pousar', { fps: 7, quadros: 5, chao: 'fim' }],
    ['DRAGON_ROAR', 'Rugir', { fps: 2, quadros: 2, alt: 'DRAGON_FIRE_CHARGE' }],
    ['DRAGON_BITE', 'Morder', { alt: 'DRAGON_CLAW_ATTACK' }],
    ['DRAGON_CLAW_ATTACK', 'Ataque de garra', { fps: 3.2, quadros: 3 }],
    ['DRAGON_TAIL_ATTACK', 'Golpe de cauda', { fps: 4, quadros: 7, alt: 'DRAGON_CLAW_ATTACK' }],
    ['DRAGON_FIRE_CHARGE', 'Preparar fogo', { fps: 2.2, quadros: 2 }],
    ['DRAGON_FIRE_BREATH', 'Cuspir fogo', { fps: 3, quadros: 2 }],
    ['DRAGON_FIRE_STREAM', 'Fogo contínuo', { loop: true, fps: 6, quadros: 1 }],
    ['DRAGON_AIR_ATTACK', 'Ataque aéreo', { fps: 6, quadros: 2 }],
    ['DRAGON_HIT', 'Receber dano', { fps: 8, quadros: 2 }],
    ['DRAGON_WEAK_POINT_HIT', 'Ponto fraco atingido', { alt: 'DRAGON_HIT' }],
    ['DRAGON_STUNNED', 'Atordoado', { loop: true, fps: 2.5, quadros: 2 }],
    ['DRAGON_DESPERATE_ATTACK', 'Ataque desesperado', { alt: 'DRAGON_FIRE_STREAM' }],
    ['DRAGON_FINAL_HIT', 'Receber golpe final', { alt: 'DRAGON_HIT' }],
    ['DRAGON_FALL', 'Cair', { fps: 5, quadros: 3 }],
    ['DRAGON_DEFEATED', 'Derrotado', { loop: true, quadros: 1 }],
    ['DRAGON_SLEEP', 'Dormindo enrolado (item 285, um quadro que respira)', { loop: true, fps: 1, quadros: 1, nova: true, respira: true, alt: 'DRAGON_DEFEATED' }],
    ['DRAGON_EYE_OPEN_END', 'Ressurgir no final', { fps: 2, quadros: 2 }],
  ]);

  grupo('Magia e criaturas (novo)', [
    ['LINE_CAST_SPELL', 'Line lança o Raio de Luz', { fps: 34, quadros: 18, alt: 'LINE_ATTACK_VERTICAL', nova: true }],
    ['LINE_CAST_CHARGE', 'Line carregando a Chuva de Estrelas', { fps: 10, loop: true, quadros: 16, alt: 'LINE_COMBAT_IDLE', nova: true }],
    ['LINE_CAST_STARS', 'Line solta a Chuva de Estrelas', { fps: 30, quadros: 18, alt: 'LINE_ATTACK_SPIN', nova: true }],
    ['GOLEM_SLEEP', 'Guardião de Pedra dormindo', { loop: true, fps: 4, nova: true }],
    ['GOLEM_IDLE', 'Guardião parado', { loop: true, fps: 6, nova: true }],
    ['GOLEM_WALK', 'Guardião andando', { loop: true, fps: 8, nova: true }],
    ['GOLEM_SLAM', 'Guardião: pisão (onda no chão)', { fps: 8, nova: true }],
    ['GOLEM_THROW', 'Guardião: arremessar pedra', { fps: 10, nova: true }],
    ['GOLEM_STUNNED', 'Guardião tonto (cristal rachado)', { loop: true, fps: 6, nova: true }],
    ['GOLEM_DEATH', 'Guardião desmoronando', { fps: 8, nova: true }],
    ['WISP_IDLE', 'Fogo-fátuo flutuando', { loop: true, fps: 8, nova: true }],
    ['WISP_ATTACK', 'Fogo-fátuo atirando', { fps: 10, nova: true }],
    ['WISP_DEATH', 'Fogo-fátuo apagando', { fps: 10, nova: true }],
  ]);

  grupo('Inimigos (novo)', [
    ['SHADOW_IDLE', 'Sombra — parada', { loop: true, nova: true }],
    ['SHADOW_MOVE', 'Sombra — andar', { loop: true, nova: true }],
    ['SHADOW_ATTACK', 'Sombra — investida', { nova: true }],
    ['SHADOW_HIT', 'Sombra — receber dano', { nova: true }],
    ['SHADOW_DEATH', 'Sombra — desaparecer', { nova: true }],
  ]);

  grupo('Efeitos', [
    ['FX_FIRE', 'Fogo', { loop: true }],
    ['FX_EMBERS', 'Brasas', { loop: true }],
    ['FX_FIRE_LIGHT', 'Iluminação do fogo', { loop: true }],
    ['FX_SMOKE', 'Fumaça'],
    ['FX_DUST', 'Poeira'],
    ['FX_IMPACT', 'Impacto'],
    ['FX_SPARKS', 'Faíscas'],
    ['FX_EXPLOSION', 'Explosão'],
    ['FX_SWORD_TRAIL', 'Rastro da espada'],
    ['FX_DRAGON_WEAK_POINT', 'Ponto fraco do dragão', { loop: true }],
    ['FX_TEARS', 'Lágrimas', { loop: true }],
    ['FX_HEARTS', 'Corações'],
    ['FX_AMBIENT_PARTICLES', 'Partículas ambientais', { loop: true }],
  ]);

  grupo('Bichos da fazenda', [
    ['THEO_ALERT', 'Theo — Theo alerta'],
    ['THEO_BALL', 'Theo — Theo com a bolinha'],
    ['THEO_BATH', 'Theo — Theo no banho'],
    ['THEO_BONE', 'Theo — Theo com o osso'],
    ['THEO_IDLE_BACK', 'Theo — idle back'],
    ['THEO_IDLE_FRONT', 'Theo — idle front'],
    ['THEO_IDLE_LEFT', 'Theo — idle left'],
    ['THEO_IDLE_RIGHT', 'Theo — idle right'],
    ['THEO_LIE', 'Theo — Theo deitado'],
    ['THEO_PLAY', 'Theo — Theo brincando'],
    ['THEO_QUESTION', 'Theo — Theo curioso'],
    ['THEO_ROLL', 'Theo — Theo de barriga pra cima'],
    ['THEO_RUN', 'Theo — Correr'],
    ['THEO_SIT', 'Theo — sit'],
    ['THEO_SIT_FRONT', 'Theo — Theo comendo'],
    ['THEO_SIT_IDLE', 'Theo — Theo apaixonado'],
    ['THEO_SLEEP', 'Theo — Theo dormindo'],
    ['THEO_WALK_BACK', 'Theo — walk back'],
    ['THEO_WALK_FRONT', 'Theo — walk front'],
    ['THEO_WALK_LEFT', 'Theo — walk left'],
    ['THEO_WALK_RIGHT', 'Theo — walk right'],
    ['CHICKEN_EAT', 'Galinha branca — Comer'],
    ['CHICKEN_IDLE', 'Galinha branca — Parado'],
    ['CHICKEN_LAY_EGG', 'Galinha branca — Botar ovo'],
    ['CHICKEN_PECK', 'Galinha branca — Bicar o chão'],
    ['CHICKEN_RUN', 'Galinha branca — Correr'],
    ['CHICKEN_SCARED', 'Galinha branca — Assustada'],
    ['CHICKEN_SCRATCH', 'Galinha branca — Ciscar'],
    ['CHICKEN_SLEEP', 'Galinha branca — Dormindo'],
    ['CHICKEN_WALK', 'Galinha branca — Andar'],
    ['HEN_BROWN_EAT', 'Galinha marrom — Comer'],
    ['HEN_BROWN_IDLE', 'Galinha marrom — Parado'],
    ['HEN_BROWN_LAY_EGG', 'Galinha marrom — Botar ovo'],
    ['HEN_BROWN_PECK', 'Galinha marrom — Bicar o chão'],
    ['HEN_BROWN_RUN', 'Galinha marrom — Correr'],
    ['HEN_BROWN_SCARED', 'Galinha marrom — Assustada'],
    ['HEN_BROWN_SCRATCH', 'Galinha marrom — Ciscar'],
    ['HEN_BROWN_SLEEP', 'Galinha marrom — Dormindo'],
    ['HEN_BROWN_WALK', 'Galinha marrom — Andar'],
    ['CHICK_IDLE', 'Pintinho — Parado'],
    ['CHICK_RUN', 'Pintinho — Correr'],
    ['CHICK_WALK', 'Pintinho — Andar'],
    ['COW_EAT', 'Vaca — Comer'],
    ['COW_IDLE', 'Vaca — Parado'],
    ['COW_RUN', 'Vaca — Correr'],
    ['COW_WALK', 'Vaca — Andar'],
    ['PIG_FRONT', 'Porco — De frente'],
    ['PIG_IDLE', 'Porco — Parado'],
    ['PIG_LIE', 'Porco — Deitado'],
    ['PIG_MUD', 'Porco — Rolando na lama'],
    ['PIG_WALK', 'Porco — Andar'],
    ['HORSE_EAT', 'Cavalo — Comer'],
    ['HORSE_IDLE', 'Cavalo — Parado'],
    ['HORSE_RUN', 'Cavalo — Correr'],
    ['HORSE_WALK', 'Cavalo — Andar'],
    ['SHEEP_IDLE', 'Ovelha — Parado', { loop: true, nova: true }],
    ['SHEEP_WALK', 'Ovelha — Andar', { loop: true, nova: true }],
    ['SHEEP_RUN', 'Ovelha — Correr', { loop: true, nova: true }],
    ['SHEEP_EAT', 'Ovelha — Comer grama', { loop: true, nova: true }],
    ['DUCK_IDLE', 'Pato — Parado', { loop: true, nova: true }],
    ['DUCK_WALK', 'Pato — Andar', { loop: true, nova: true }],
    ['DUCK_SWIM', 'Pato — Nadando', { loop: true, nova: true }],
    ['DUCK_RUN', 'Pato — Correr', { loop: true, nova: true }],
    ['CAT_IDLE', 'Gato — Parado', { loop: true, nova: true }],
    ['CAT_WALK', 'Gato — Andar', { loop: true, nova: true }],
    ['CAT_SLEEP', 'Gato — Dormindo', { loop: true, nova: true }],
    ['CAT_PURR', 'Gato — Carinho (ronronando)', { loop: true, nova: true }],
  ]);

  grupo('Personagens de apoio (novo)', [
    // 12 quadros por gesto: a 12 por segundo o gesto repetia a cada segundo e o mago parecia travado.
    ['MAGO_IDLE', 'Mago parado, respirando', { fps: 6, loop: true, nova: true }],
    ['MAGO_TALK', 'Mago falando / gesticulando', { fps: 8, loop: true, nova: true }],
    ['MAGO_CAST', 'Mago fazendo um feitiço', { fps: 10, nova: true }],
    ['SPIRIT_APPEAR', 'Espírito das Ruínas aparecendo no altar', { nova: true }],
    ['SPIRIT_IDLE', 'Espírito das Ruínas flutuando', { loop: true, nova: true }],
    ['SPIRIT_TALK', 'Espírito das Ruínas falando', { loop: true, nova: true }],
  ]);

  grupo('Bell jogável (Parte 2)', [
    ['BELL_COMBAT_IDLE', 'Bell em guarda, estrelas girando na mão (itens 286 a 288)', { dir: QUATRO, loop: true, fps: 8, quadros: 8, alt: 'BELL_IDLE', parte2: true }],
    ['BELL_ATTACK_STAR', 'Bell atira uma estrela (braço à frente)', { fps: 14, quadros: 8, alt: 'BELL_HIGH_FIVE', parte2: true }],
    ['BELL_ATTACK_SPREAD', 'Bell gira e solta o leque de 3 estrelas de luz', { fps: 14, quadros: 10, alt: 'BELL_DANCE', parte2: true }],
    // Itens 253 a 256: a estrela e o leque de frente e de costas (a mira escolhe sozinha).
    ['BELL_ATTACK_STAR_FRONT', 'Bell atira estrela para baixo', { fps: 14, quadros: 8, face: 'F', parte2: true }],
    ['BELL_ATTACK_STAR_BACK', 'Bell atira estrela para cima', { fps: 14, quadros: 8, face: 'F', parte2: true }],
    ['BELL_ATTACK_SPREAD_FRONT', 'Bell solta o leque de estrelas para baixo', { fps: 14, quadros: 10, face: 'F', parte2: true }],
    ['BELL_ATTACK_SPREAD_BACK', 'Bell solta o leque de estrelas para cima', { fps: 14, quadros: 10, face: 'F', parte2: true }],
    ['BELL_ATTACK_AIR', 'Bell atira estrela no ar (pulando)', { fps: 12, quadros: 6, alt: 'BELL_JUMP', parte2: true }],
    ['BELL_SING', 'Bell canta a Canção (notas coloridas saindo)', { fps: 10, loop: true, face: 'F', quadros: 12, alt: 'BELL_HAPPY', parte2: true }],
    ['BELL_BLOCK', 'Bell se protege com um escudo de luz rosa', { fps: 12, quadros: 6, alt: 'BELL_IDLE', parte2: true }],
    ['BELL_DODGE', 'Bell esquiva (pulinho de lado)', { fps: 14, quadros: 6, alt: 'BELL_JUMP', parte2: true }],
    ['BELL_DASH', 'Bell arrancada', { fps: 14, quadros: 6, alt: 'BELL_RUN', parte2: true }],
    ['BELL_HIT', 'Bell recebe dano', { fps: 12, quadros: 4, alt: 'BELL_SCARED', parte2: true }],
    ['BELL_KNOCKDOWN', 'Bell cai no chão (golpe forte)', { fps: 10, quadros: 6, alt: 'BELL_FALL', parte2: true }],
    ['BELL_EXHAUSTED_IDLE', 'Bell cansada, ofegante (pouca vida)', { loop: true, fps: 6, quadros: 8, alt: 'BELL_IDLE', parte2: true }],
    ['BELL_CROUCH', 'Bell agachada (beber na fonte / pegar item)', { face: 'F', quadros: 6, alt: 'BELL_IDLE_FRONT', parte2: true }],
    ['BELL_DETERMINED', 'Bell decidida (punhos fechados)', { face: 'F', loop: true, quadros: 6, alt: 'BELL_IDLE_FRONT', parte2: true }],
    ['BELL_CELEBRATE', 'Bell comemora vitória', { face: 'F', quadros: 12, alt: 'BELL_HAPPY', parte2: true }],
    ['BELL_TALK', 'Bell falando (cenas)', { face: 'F', loop: true, quadros: 8, alt: 'BELL_IDLE_FRONT', parte2: true }],
  ]);

  grupo('Chefe: Colosso de Raízes (Parte 2)', [
    ['COLOSSO_SLEEP', 'Colosso de Raízes — dormindo (antes da luta)', { loop: true, fps: 4, quadros: 8, alt: 'COLOSSO_IDLE', parte2: true }],
    ['COLOSSO_IDLE', 'Colosso de Raízes — parado, respirando', { loop: true, fps: 8, quadros: 8, parte2: true }],
    ['COLOSSO_WAKE', 'Colosso de Raízes — acordando / rugido de apresentação', { fps: 10, quadros: 12, alt: 'COLOSSO_IDLE', parte2: true }],
    ['COLOSSO_ATTACK', 'Colosso de Raízes — ataque genérico (usado quando o golpe não tem arte própria)', { fps: 10, quadros: 10, alt: 'COLOSSO_IDLE', parte2: true }],
    ['COLOSSO_ROOTS', 'Colosso de Raízes — raízes saindo do chão em linha', { fps: 10, quadros: 10, alt: 'COLOSSO_ATTACK', parte2: true }],
    ['COLOSSO_THORNS', 'Colosso de Raízes — anel de espinhos', { fps: 10, quadros: 10, alt: 'COLOSSO_ATTACK', parte2: true }],
    ['COLOSSO_MUD', 'Colosso de Raízes — cuspe de lama', { fps: 10, quadros: 10, alt: 'COLOSSO_ATTACK', parte2: true }],
    ['COLOSSO_SUMMON', 'Colosso de Raízes — chama sombras', { fps: 10, quadros: 10, alt: 'COLOSSO_ATTACK', parte2: true }],
    ['COLOSSO_STUNNED', 'Colosso de Raízes — cansado, núcleo exposto (hora de atacar)', { loop: true, fps: 6, quadros: 8, alt: 'COLOSSO_IDLE', parte2: true }],
    ['COLOSSO_HIT', 'Colosso de Raízes — recebe dano', { fps: 12, quadros: 4, alt: 'COLOSSO_STUNNED', parte2: true }],
    ['COLOSSO_DEATH', 'Colosso de Raízes — derrotado (se desfaz em luz)', { fps: 8, quadros: 14, alt: 'COLOSSO_STUNNED', parte2: true }],
    ['COLOSSO_FREED', 'Colosso de Raízes — libertado, volta às cores verdadeiras e agradece', { loop: true, fps: 6, quadros: 12, alt: 'COLOSSO_IDLE', parte2: true }],
  ]);

  grupo('Chefe: Serpente das Marés (Parte 2)', [
    ['SERPENTE_SLEEP', 'Serpente das Marés — dormindo (antes da luta)', { loop: true, fps: 4, quadros: 8, alt: 'SERPENTE_IDLE', parte2: true }],
    ['SERPENTE_IDLE', 'Serpente das Marés — parado, respirando', { loop: true, fps: 8, quadros: 8, parte2: true }],
    ['SERPENTE_WAKE', 'Serpente das Marés — acordando / rugido de apresentação', { fps: 10, quadros: 12, alt: 'SERPENTE_IDLE', parte2: true }],
    ['SERPENTE_ATTACK', 'Serpente das Marés — ataque genérico (usado quando o golpe não tem arte própria)', { fps: 10, quadros: 10, alt: 'SERPENTE_IDLE', parte2: true }],
    ['SERPENTE_DIVE', 'Serpente das Marés — mergulho (some e reaparece)', { fps: 10, quadros: 10, alt: 'SERPENTE_ATTACK', parte2: true }],
    ['SERPENTE_WATER_JET', 'Serpente das Marés — jatos de água', { fps: 10, quadros: 10, alt: 'SERPENTE_ATTACK', parte2: true }],
    ['SERPENTE_WAVE', 'Serpente das Marés — onda', { fps: 10, quadros: 10, alt: 'SERPENTE_ATTACK', parte2: true }],
    ['SERPENTE_STUNNED', 'Serpente das Marés — cansado, núcleo exposto (hora de atacar)', { loop: true, fps: 6, quadros: 8, alt: 'SERPENTE_IDLE', parte2: true }],
    ['SERPENTE_HIT', 'Serpente das Marés — recebe dano', { fps: 12, quadros: 4, alt: 'SERPENTE_STUNNED', parte2: true }],
    ['SERPENTE_DEATH', 'Serpente das Marés — derrotado (se desfaz em luz)', { fps: 8, quadros: 14, alt: 'SERPENTE_STUNNED', parte2: true }],
    ['SERPENTE_FREED', 'Serpente das Marés — libertado, volta às cores verdadeiras e agradece', { loop: true, fps: 6, quadros: 12, alt: 'SERPENTE_IDLE', parte2: true }],
  ]);

  grupo('Chefe: Grifo da Tempestade (Parte 2)', [
    ['GRIFO_SLEEP', 'Grifo da Tempestade — dormindo (antes da luta)', { loop: true, fps: 4, quadros: 8, alt: 'GRIFO_IDLE', parte2: true }],
    ['GRIFO_IDLE', 'Grifo da Tempestade — parado, respirando', { loop: true, fps: 8, quadros: 8, parte2: true }],
    ['GRIFO_WAKE', 'Grifo da Tempestade — acordando / rugido de apresentação', { fps: 10, quadros: 12, alt: 'GRIFO_IDLE', parte2: true }],
    ['GRIFO_ATTACK', 'Grifo da Tempestade — ataque genérico (usado quando o golpe não tem arte própria)', { fps: 10, quadros: 10, alt: 'GRIFO_IDLE', parte2: true }],
    ['GRIFO_GUST', 'Grifo da Tempestade — rajada de vento', { fps: 10, quadros: 10, alt: 'GRIFO_ATTACK', parte2: true }],
    ['GRIFO_FEATHERS', 'Grifo da Tempestade — leque de penas', { fps: 10, quadros: 10, alt: 'GRIFO_ATTACK', parte2: true }],
    ['GRIFO_LIGHTNING', 'Grifo da Tempestade — chama raios', { fps: 10, quadros: 10, alt: 'GRIFO_ATTACK', parte2: true }],
    ['GRIFO_STUNNED', 'Grifo da Tempestade — cansado, núcleo exposto (hora de atacar)', { loop: true, fps: 6, quadros: 8, alt: 'GRIFO_IDLE', parte2: true }],
    ['GRIFO_HIT', 'Grifo da Tempestade — recebe dano', { fps: 12, quadros: 4, alt: 'GRIFO_STUNNED', parte2: true }],
    ['GRIFO_DEATH', 'Grifo da Tempestade — derrotado (se desfaz em luz)', { fps: 8, quadros: 14, alt: 'GRIFO_STUNNED', parte2: true }],
    ['GRIFO_FREED', 'Grifo da Tempestade — libertado, volta às cores verdadeiras e agradece', { loop: true, fps: 6, quadros: 12, alt: 'GRIFO_IDLE', parte2: true }],
  ]);

  grupo('Chefe: Titã de Magma (Parte 2)', [
    ['MAGMA_SLEEP', 'Titã de Magma — dormindo (antes da luta)', { loop: true, fps: 4, quadros: 8, alt: 'MAGMA_IDLE', parte2: true }],
    ['MAGMA_IDLE', 'Titã de Magma — parado, respirando', { loop: true, fps: 8, quadros: 8, parte2: true }],
    ['MAGMA_WAKE', 'Titã de Magma — acordando / rugido de apresentação', { fps: 10, quadros: 12, alt: 'MAGMA_IDLE', parte2: true }],
    ['MAGMA_ATTACK', 'Titã de Magma — ataque genérico (usado quando o golpe não tem arte própria)', { fps: 10, quadros: 10, alt: 'MAGMA_IDLE', parte2: true }],
    ['MAGMA_SLAM', 'Titã de Magma — pisão (onda no chão)', { fps: 10, quadros: 10, alt: 'MAGMA_ATTACK', parte2: true }],
    ['MAGMA_FIRE_RAIN', 'Titã de Magma — chuva de fogo', { fps: 10, quadros: 10, alt: 'MAGMA_ATTACK', parte2: true }],
    ['MAGMA_THROW', 'Titã de Magma — arremesso de rocha', { fps: 10, quadros: 10, alt: 'MAGMA_ATTACK', parte2: true }],
    ['MAGMA_FIRE_FAN', 'Titã de Magma — leque de fogo', { fps: 10, quadros: 10, alt: 'MAGMA_ATTACK', parte2: true }],
    ['MAGMA_STUNNED', 'Titã de Magma — cansado, núcleo exposto (hora de atacar)', { loop: true, fps: 6, quadros: 8, alt: 'MAGMA_IDLE', parte2: true }],
    ['MAGMA_HIT', 'Titã de Magma — recebe dano', { fps: 12, quadros: 4, alt: 'MAGMA_STUNNED', parte2: true }],
    ['MAGMA_DEATH', 'Titã de Magma — derrotado (se desfaz em luz)', { fps: 8, quadros: 14, alt: 'MAGMA_STUNNED', parte2: true }],
  ]);

  grupo('Chefe: Hidra de Lama (Parte 2)', [
    ['HIDRA_SLEEP', 'Hidra de Lama — dormindo (antes da luta)', { loop: true, fps: 4, quadros: 8, alt: 'HIDRA_IDLE', parte2: true }],
    ['HIDRA_IDLE', 'Hidra de Lama — parado, respirando', { loop: true, fps: 8, quadros: 8, parte2: true }],
    ['HIDRA_WAKE', 'Hidra de Lama — acordando / rugido de apresentação', { fps: 10, quadros: 12, alt: 'HIDRA_IDLE', parte2: true }],
    ['HIDRA_ATTACK', 'Hidra de Lama — ataque genérico (usado quando o golpe não tem arte própria)', { fps: 10, quadros: 10, alt: 'HIDRA_IDLE', parte2: true }],
    ['HIDRA_ROOTS', 'Hidra de Lama — raízes saindo do chão em linha', { fps: 10, quadros: 10, alt: 'HIDRA_ATTACK', parte2: true }],
    ['HIDRA_WATER_JET', 'Hidra de Lama — jatos de água', { fps: 10, quadros: 10, alt: 'HIDRA_ATTACK', parte2: true }],
    ['HIDRA_WAVE', 'Hidra de Lama — onda', { fps: 10, quadros: 10, alt: 'HIDRA_ATTACK', parte2: true }],
    ['HIDRA_DIVE', 'Hidra de Lama — mergulho (some e reaparece)', { fps: 10, quadros: 10, alt: 'HIDRA_ATTACK', parte2: true }],
    ['HIDRA_MUD', 'Hidra de Lama — cuspe de lama', { fps: 10, quadros: 10, alt: 'HIDRA_ATTACK', parte2: true }],
    ['HIDRA_STUNNED', 'Hidra de Lama — cansado, núcleo exposto (hora de atacar)', { loop: true, fps: 6, quadros: 8, alt: 'HIDRA_IDLE', parte2: true }],
    ['HIDRA_HIT', 'Hidra de Lama — recebe dano', { fps: 12, quadros: 4, alt: 'HIDRA_STUNNED', parte2: true }],
    ['HIDRA_DEATH', 'Hidra de Lama — derrotado (se desfaz em luz)', { fps: 8, quadros: 14, alt: 'HIDRA_STUNNED', parte2: true }],
  ]);

  grupo('Chefe: Tempestade Viva (Parte 2)', [
    ['TEMPESTADE_SLEEP', 'Tempestade Viva — dormindo (antes da luta)', { loop: true, fps: 4, quadros: 8, alt: 'TEMPESTADE_IDLE', parte2: true }],
    ['TEMPESTADE_IDLE', 'Tempestade Viva — parado, respirando', { loop: true, fps: 8, quadros: 8, parte2: true }],
    ['TEMPESTADE_WAKE', 'Tempestade Viva — acordando / rugido de apresentação', { fps: 10, quadros: 12, alt: 'TEMPESTADE_IDLE', parte2: true }],
    ['TEMPESTADE_ATTACK', 'Tempestade Viva — ataque genérico (usado quando o golpe não tem arte própria)', { fps: 10, quadros: 10, alt: 'TEMPESTADE_IDLE', parte2: true }],
    ['TEMPESTADE_LIGHTNING', 'Tempestade Viva — chama raios', { fps: 10, quadros: 10, alt: 'TEMPESTADE_ATTACK', parte2: true }],
    ['TEMPESTADE_GUST', 'Tempestade Viva — rajada de vento', { fps: 10, quadros: 10, alt: 'TEMPESTADE_ATTACK', parte2: true }],
    ['TEMPESTADE_WATER_JET', 'Tempestade Viva — jatos de água', { fps: 10, quadros: 10, alt: 'TEMPESTADE_ATTACK', parte2: true }],
    ['TEMPESTADE_WAVE', 'Tempestade Viva — onda', { fps: 10, quadros: 10, alt: 'TEMPESTADE_ATTACK', parte2: true }],
    ['TEMPESTADE_FEATHERS', 'Tempestade Viva — leque de penas', { fps: 10, quadros: 10, alt: 'TEMPESTADE_ATTACK', parte2: true }],
    ['TEMPESTADE_STUNNED', 'Tempestade Viva — cansado, núcleo exposto (hora de atacar)', { loop: true, fps: 6, quadros: 8, alt: 'TEMPESTADE_IDLE', parte2: true }],
    ['TEMPESTADE_HIT', 'Tempestade Viva — recebe dano', { fps: 12, quadros: 4, alt: 'TEMPESTADE_STUNNED', parte2: true }],
    ['TEMPESTADE_DEATH', 'Tempestade Viva — derrotado (se desfaz em luz)', { fps: 8, quadros: 14, alt: 'TEMPESTADE_STUNNED', parte2: true }],
  ]);

  grupo('Chefe: Quimera Primordial (Parte 2)', [
    ['QUIMERA_SLEEP', 'Quimera Primordial — dormindo (antes da luta)', { loop: true, fps: 4, quadros: 8, alt: 'QUIMERA_IDLE', parte2: true }],
    ['QUIMERA_IDLE', 'Quimera Primordial — parado, respirando', { loop: true, fps: 8, quadros: 8, parte2: true }],
    ['QUIMERA_WAKE', 'Quimera Primordial — acordando / rugido de apresentação', { fps: 10, quadros: 12, alt: 'QUIMERA_IDLE', parte2: true }],
    ['QUIMERA_ATTACK', 'Quimera Primordial — ataque genérico (usado quando o golpe não tem arte própria)', { fps: 10, quadros: 10, alt: 'QUIMERA_IDLE', parte2: true }],
    ['QUIMERA_SLAM', 'Quimera Primordial — pisão (onda no chão)', { fps: 10, quadros: 10, alt: 'QUIMERA_ATTACK', parte2: true }],
    ['QUIMERA_THROW', 'Quimera Primordial — arremesso de rocha', { fps: 10, quadros: 10, alt: 'QUIMERA_ATTACK', parte2: true }],
    ['QUIMERA_FIRE_RAIN', 'Quimera Primordial — chuva de fogo', { fps: 10, quadros: 10, alt: 'QUIMERA_ATTACK', parte2: true }],
    ['QUIMERA_FIRE_FAN', 'Quimera Primordial — leque de fogo', { fps: 10, quadros: 10, alt: 'QUIMERA_ATTACK', parte2: true }],
    ['QUIMERA_ROOTS', 'Quimera Primordial — raízes saindo do chão em linha', { fps: 10, quadros: 10, alt: 'QUIMERA_ATTACK', parte2: true }],
    ['QUIMERA_THORNS', 'Quimera Primordial — anel de espinhos', { fps: 10, quadros: 10, alt: 'QUIMERA_ATTACK', parte2: true }],
    ['QUIMERA_MUD', 'Quimera Primordial — cuspe de lama', { fps: 10, quadros: 10, alt: 'QUIMERA_ATTACK', parte2: true }],
    ['QUIMERA_DIVE', 'Quimera Primordial — mergulho (some e reaparece)', { fps: 10, quadros: 10, alt: 'QUIMERA_ATTACK', parte2: true }],
    ['QUIMERA_WATER_JET', 'Quimera Primordial — jatos de água', { fps: 10, quadros: 10, alt: 'QUIMERA_ATTACK', parte2: true }],
    ['QUIMERA_WAVE', 'Quimera Primordial — onda', { fps: 10, quadros: 10, alt: 'QUIMERA_ATTACK', parte2: true }],
    ['QUIMERA_GUST', 'Quimera Primordial — rajada de vento', { fps: 10, quadros: 10, alt: 'QUIMERA_ATTACK', parte2: true }],
    ['QUIMERA_FEATHERS', 'Quimera Primordial — leque de penas', { fps: 10, quadros: 10, alt: 'QUIMERA_ATTACK', parte2: true }],
    ['QUIMERA_LIGHTNING', 'Quimera Primordial — chama raios', { fps: 10, quadros: 10, alt: 'QUIMERA_ATTACK', parte2: true }],
    ['QUIMERA_STUNNED', 'Quimera Primordial — cansado, núcleo exposto (hora de atacar)', { loop: true, fps: 6, quadros: 8, alt: 'QUIMERA_IDLE', parte2: true }],
    ['QUIMERA_HIT', 'Quimera Primordial — recebe dano', { fps: 12, quadros: 4, alt: 'QUIMERA_STUNNED', parte2: true }],
    ['QUIMERA_DEATH', 'Quimera Primordial — derrotado (se desfaz em luz)', { fps: 8, quadros: 14, alt: 'QUIMERA_STUNNED', parte2: true }],
    ['QUIMERA_PHASE', 'Quimera — muda de fase (troca a cor do núcleo e o elemento)', { fps: 10, quadros: 12, alt: 'QUIMERA_WAKE', parte2: true }],
    ['QUIMERA_CALM', 'Quimera — acalmada no final (“é... quente”)', { loop: true, fps: 4, quadros: 8, alt: 'QUIMERA_STUNNED', parte2: true }],
  ]);

  grupo('Fogos-fátuos dos elementos (Parte 2)', [
    ['WISP_EARTH_IDLE', 'Fogo-fátuo de terra (verde-musgo) — flutuando', { loop: true, fps: 8, quadros: 8, alt: 'WISP_IDLE', parte2: true }],
    ['WISP_EARTH_ATTACK', 'Fogo-fátuo de terra (verde-musgo) — atirando', { fps: 8, quadros: 8, alt: 'WISP_ATTACK', parte2: true }],
    ['WISP_EARTH_DEATH', 'Fogo-fátuo de terra (verde-musgo) — apagando', { fps: 8, quadros: 8, alt: 'WISP_DEATH', parte2: true }],
    ['WISP_WATER_IDLE', 'Fogo-fátuo de água (azul) — flutuando', { loop: true, fps: 8, quadros: 8, alt: 'WISP_IDLE', parte2: true }],
    ['WISP_WATER_ATTACK', 'Fogo-fátuo de água (azul) — atirando', { fps: 8, quadros: 8, alt: 'WISP_ATTACK', parte2: true }],
    ['WISP_WATER_DEATH', 'Fogo-fátuo de água (azul) — apagando', { fps: 8, quadros: 8, alt: 'WISP_DEATH', parte2: true }],
    ['WISP_AIR_IDLE', 'Fogo-fátuo de ar (branco) — flutuando', { loop: true, fps: 8, quadros: 8, alt: 'WISP_IDLE', parte2: true }],
    ['WISP_AIR_ATTACK', 'Fogo-fátuo de ar (branco) — atirando', { fps: 8, quadros: 8, alt: 'WISP_ATTACK', parte2: true }],
    ['WISP_AIR_DEATH', 'Fogo-fátuo de ar (branco) — apagando', { fps: 8, quadros: 8, alt: 'WISP_DEATH', parte2: true }],
  ]);

  grupo('Moradores (todos, incluindo os da Parte 2)', [
    ['CORA_IDLE', 'Dona Cora (jardineira do vale) — parado', { loop: true, face: 'F', fps: 6, quadros: 8, parte2: true }],
    ['CORA_TALK', 'Dona Cora (jardineira do vale) — falando', { loop: true, face: 'F', fps: 6, quadros: 8, alt: 'CORA_IDLE', parte2: true }],
    ['CORA_SLEEP', 'Dona Cora (jardineira do vale) — dormindo (noite)', { loop: true, face: 'F', fps: 3, quadros: 4, alt: 'CORA_IDLE', parte2: true }],
    ['TIAO_IDLE', 'Seu Tião (pescador do lago) — parado', { loop: true, face: 'F', fps: 6, quadros: 8, parte2: true }],
    ['TIAO_TALK', 'Seu Tião (pescador do lago) — falando', { loop: true, face: 'F', fps: 6, quadros: 8, alt: 'TIAO_IDLE', parte2: true }],
    ['TIAO_SLEEP', 'Seu Tião (pescador do lago) — dormindo (noite)', { loop: true, face: 'F', fps: 3, quadros: 4, alt: 'TIAO_IDLE', parte2: true }],
    ['BRISA_IDLE', 'Vó Brisa (pastora dos picos) — parado', { loop: true, face: 'F', fps: 6, quadros: 8, parte2: true }],
    ['BRISA_TALK', 'Vó Brisa (pastora dos picos) — falando', { loop: true, face: 'F', fps: 6, quadros: 8, alt: 'BRISA_IDLE', parte2: true }],
    ['BRISA_SLEEP', 'Vó Brisa (pastora dos picos) — dormindo (noite)', { loop: true, face: 'F', fps: 3, quadros: 4, alt: 'BRISA_IDLE', parte2: true }],
    ['ROSA_IDLE', 'Dona Rosa (loja) — parado', { loop: true, face: 'F', fps: 6, quadros: 8, parte2: true }],
    ['ROSA_TALK', 'Dona Rosa (loja) — falando', { loop: true, face: 'F', fps: 6, quadros: 8, alt: 'ROSA_IDLE', parte2: true }],
    ['ROSA_SLEEP', 'Dona Rosa (loja) — dormindo (noite)', { loop: true, face: 'F', fps: 3, quadros: 4, alt: 'ROSA_IDLE', parte2: true }],
    ['BENTO_IDLE', 'Seu Bento (ferraria) — parado', { loop: true, face: 'F', fps: 6, quadros: 8, parte2: true }],
    ['BENTO_TALK', 'Seu Bento (ferraria) — falando', { loop: true, face: 'F', fps: 6, quadros: 8, alt: 'BENTO_IDLE', parte2: true }],
    ['BENTO_SLEEP', 'Seu Bento (ferraria) — dormindo (noite)', { loop: true, face: 'F', fps: 3, quadros: 4, alt: 'BENTO_IDLE', parte2: true }],
    ['ZE_IDLE', 'Seu Zé — parado', { loop: true, face: 'F', fps: 6, quadros: 8, parte2: true }],
    ['ZE_TALK', 'Seu Zé — falando', { loop: true, face: 'F', fps: 6, quadros: 8, alt: 'ZE_IDLE', parte2: true }],
    ['ZE_SLEEP', 'Seu Zé — dormindo (noite)', { loop: true, face: 'F', fps: 3, quadros: 4, alt: 'ZE_IDLE', parte2: true }],
    ['LURDES_IDLE', 'Dona Lurdes — parado', { loop: true, face: 'F', fps: 6, quadros: 8, parte2: true }],
    ['LURDES_TALK', 'Dona Lurdes — falando', { loop: true, face: 'F', fps: 6, quadros: 8, alt: 'LURDES_IDLE', parte2: true }],
    ['LURDES_SLEEP', 'Dona Lurdes — dormindo (noite)', { loop: true, face: 'F', fps: 3, quadros: 4, alt: 'LURDES_IDLE', parte2: true }],
    ['PEDRO_IDLE', 'Pedrinho — parado', { loop: true, face: 'F', fps: 6, quadros: 8, parte2: true }],
    ['PEDRO_TALK', 'Pedrinho — falando', { loop: true, face: 'F', fps: 6, quadros: 8, alt: 'PEDRO_IDLE', parte2: true }],
    ['PEDRO_SLEEP', 'Pedrinho — dormindo (noite)', { loop: true, face: 'F', fps: 3, quadros: 4, alt: 'PEDRO_IDLE', parte2: true }],
    ['TOBIAS_IDLE', 'Tobias (caçador) — parado', { loop: true, face: 'F', fps: 6, quadros: 8, parte2: true }],
    ['TOBIAS_TALK', 'Tobias (caçador) — falando', { loop: true, face: 'F', fps: 6, quadros: 8, alt: 'TOBIAS_IDLE', parte2: true }],
    ['TOBIAS_SLEEP', 'Tobias (caçador) — dormindo (noite)', { loop: true, face: 'F', fps: 3, quadros: 4, alt: 'TOBIAS_IDLE', parte2: true }],
    ['TIAO_FISH', 'Seu Tião — pescando no píer', { loop: true, fps: 6, quadros: 12, alt: 'TIAO_IDLE', parte2: true }],
    ['BENTO_FORGE', 'Seu Bento — martelando na bigorna', { loop: true, fps: 8, quadros: 8, alt: 'BENTO_IDLE', parte2: true }],
    ['PEDRO_RUN', 'Pedrinho — correndo pra lá e pra cá', { loop: true, fps: 10, quadros: 8, alt: 'PEDRO_IDLE', parte2: true }],
  ]);

  grupo('Dragão amigo (Parte 2)', [
    ['DRAGON_TALK', 'Dragão falando calmo (abertura da Parte 2)', { loop: true, fps: 4, quadros: 6, alt: 'DRAGON_IDLE', parte2: true }],
    ['DRAGON_BOW', 'Dragão abaixa a cabeça (pede ajuda / agradece)', { fps: 6, quadros: 8, alt: 'DRAGON_IDLE', parte2: true }],
    ['DRAGON_CURL_SLEEP', 'Dragão dormindo enrolado perto da casa (fazenda), com chifres e espinhos pretos', { loop: true, fps: 2, quadros: 4, alt: 'DRAGON_SLEEP', parte2: true }],
  ]);

  grupo('Line com armadura: Túnica Acolchoada', [
    ['LINE_TUNICA_IDLE', 'Line com Túnica Acolchoada — parada', { dir: QUATRO, alt: 'LINE_IDLE', parte2: true }],
    ['LINE_TUNICA_WALK', 'Line com Túnica Acolchoada — andando', { dir: QUATRO, alt: 'LINE_WALK', parte2: true }],
    ['LINE_TUNICA_RUN', 'Line com Túnica Acolchoada — correndo', { dir: QUATRO, alt: 'LINE_RUN', parte2: true }],
    ['LINE_TUNICA_COMBAT_IDLE', 'Line com Túnica Acolchoada — em guarda', { alt: 'LINE_COMBAT_IDLE', parte2: true }],
    ['LINE_TUNICA_ATTACK_HORIZONTAL', 'Line com Túnica Acolchoada — golpe horizontal', { alt: 'LINE_ATTACK_HORIZONTAL', parte2: true }],
    ['LINE_TUNICA_ATTACK_VERTICAL', 'Line com Túnica Acolchoada — golpe vertical', { alt: 'LINE_ATTACK_VERTICAL', parte2: true }],
    ['LINE_TUNICA_ATTACK_COMBO', 'Line com Túnica Acolchoada — golpe final do combo', { alt: 'LINE_ATTACK_COMBO', parte2: true }],
    ['LINE_TUNICA_ATTACK_SPIN', 'Line com Túnica Acolchoada — giro', { alt: 'LINE_ATTACK_SPIN', parte2: true }],
    ['LINE_TUNICA_CAST_SPELL', 'Line com Túnica Acolchoada — Raio de Luz', { alt: 'LINE_CAST_SPELL', parte2: true }],
    ['LINE_TUNICA_BLOCK', 'Line com Túnica Acolchoada — defesa', { alt: 'LINE_BLOCK', parte2: true }],
    ['LINE_TUNICA_DODGE', 'Line com Túnica Acolchoada — esquiva', { alt: 'LINE_DODGE', parte2: true }],
    ['LINE_TUNICA_JUMP', 'Line com Túnica Acolchoada — pulo', { alt: 'LINE_JUMP', parte2: true }],
    ['LINE_TUNICA_HIT_LIGHT', 'Line com Túnica Acolchoada — recebe dano', { alt: 'LINE_HIT_LIGHT', parte2: true }],
    ['LINE_TUNICA_KNOCKDOWN', 'Line com Túnica Acolchoada — cai no chão', { alt: 'LINE_KNOCKDOWN', parte2: true }],
  ]);

  grupo('Line com armadura: Cota de Malha', [
    ['LINE_MALHA_IDLE', 'Line com Cota de Malha — parada', { dir: QUATRO, alt: 'LINE_IDLE', parte2: true }],
    ['LINE_MALHA_WALK', 'Line com Cota de Malha — andando', { dir: QUATRO, alt: 'LINE_WALK', parte2: true }],
    ['LINE_MALHA_RUN', 'Line com Cota de Malha — correndo', { dir: QUATRO, alt: 'LINE_RUN', parte2: true }],
    ['LINE_MALHA_COMBAT_IDLE', 'Line com Cota de Malha — em guarda', { alt: 'LINE_COMBAT_IDLE', parte2: true }],
    ['LINE_MALHA_ATTACK_HORIZONTAL', 'Line com Cota de Malha — golpe horizontal', { alt: 'LINE_ATTACK_HORIZONTAL', parte2: true }],
    ['LINE_MALHA_ATTACK_VERTICAL', 'Line com Cota de Malha — golpe vertical', { alt: 'LINE_ATTACK_VERTICAL', parte2: true }],
    ['LINE_MALHA_ATTACK_COMBO', 'Line com Cota de Malha — golpe final do combo', { alt: 'LINE_ATTACK_COMBO', parte2: true }],
    ['LINE_MALHA_ATTACK_SPIN', 'Line com Cota de Malha — giro', { alt: 'LINE_ATTACK_SPIN', parte2: true }],
    ['LINE_MALHA_CAST_SPELL', 'Line com Cota de Malha — Raio de Luz', { alt: 'LINE_CAST_SPELL', parte2: true }],
    ['LINE_MALHA_BLOCK', 'Line com Cota de Malha — defesa', { alt: 'LINE_BLOCK', parte2: true }],
    ['LINE_MALHA_DODGE', 'Line com Cota de Malha — esquiva', { alt: 'LINE_DODGE', parte2: true }],
    ['LINE_MALHA_JUMP', 'Line com Cota de Malha — pulo', { alt: 'LINE_JUMP', parte2: true }],
    ['LINE_MALHA_HIT_LIGHT', 'Line com Cota de Malha — recebe dano', { alt: 'LINE_HIT_LIGHT', parte2: true }],
    ['LINE_MALHA_KNOCKDOWN', 'Line com Cota de Malha — cai no chão', { alt: 'LINE_KNOCKDOWN', parte2: true }],
  ]);

  grupo('Line com armadura: Armadura de Brasa', [
    ['LINE_BRASA_IDLE', 'Line com Armadura de Brasa — parada', { dir: QUATRO, alt: 'LINE_IDLE', parte2: true }],
    ['LINE_BRASA_WALK', 'Line com Armadura de Brasa — andando', { dir: QUATRO, alt: 'LINE_WALK', parte2: true }],
    ['LINE_BRASA_RUN', 'Line com Armadura de Brasa — correndo', { dir: QUATRO, alt: 'LINE_RUN', parte2: true }],
    ['LINE_BRASA_COMBAT_IDLE', 'Line com Armadura de Brasa — em guarda', { alt: 'LINE_COMBAT_IDLE', parte2: true }],
    ['LINE_BRASA_ATTACK_HORIZONTAL', 'Line com Armadura de Brasa — golpe horizontal', { alt: 'LINE_ATTACK_HORIZONTAL', parte2: true }],
    ['LINE_BRASA_ATTACK_VERTICAL', 'Line com Armadura de Brasa — golpe vertical', { alt: 'LINE_ATTACK_VERTICAL', parte2: true }],
    ['LINE_BRASA_ATTACK_COMBO', 'Line com Armadura de Brasa — golpe final do combo', { alt: 'LINE_ATTACK_COMBO', parte2: true }],
    ['LINE_BRASA_ATTACK_SPIN', 'Line com Armadura de Brasa — giro', { alt: 'LINE_ATTACK_SPIN', parte2: true }],
    ['LINE_BRASA_CAST_SPELL', 'Line com Armadura de Brasa — Raio de Luz', { alt: 'LINE_CAST_SPELL', parte2: true }],
    ['LINE_BRASA_BLOCK', 'Line com Armadura de Brasa — defesa', { alt: 'LINE_BLOCK', parte2: true }],
    ['LINE_BRASA_DODGE', 'Line com Armadura de Brasa — esquiva', { alt: 'LINE_DODGE', parte2: true }],
    ['LINE_BRASA_JUMP', 'Line com Armadura de Brasa — pulo', { alt: 'LINE_JUMP', parte2: true }],
    ['LINE_BRASA_HIT_LIGHT', 'Line com Armadura de Brasa — recebe dano', { alt: 'LINE_HIT_LIGHT', parte2: true }],
    ['LINE_BRASA_KNOCKDOWN', 'Line com Armadura de Brasa — cai no chão', { alt: 'LINE_KNOCKDOWN', parte2: true }],
  ]);

  grupo('Bell com armadura: Vestido Reforçado', [
    ['BELL_VESTIDO_IDLE', 'Bell com Vestido Reforçado — parada', { dir: QUATRO, alt: 'BELL_IDLE', parte2: true }],
    ['BELL_VESTIDO_WALK', 'Bell com Vestido Reforçado — andando', { dir: QUATRO, alt: 'BELL_WALK', parte2: true }],
    ['BELL_VESTIDO_RUN', 'Bell com Vestido Reforçado — correndo', { dir: QUATRO, alt: 'BELL_RUN', parte2: true }],
    ['BELL_VESTIDO_COMBAT_IDLE', 'Bell com Vestido Reforçado — em guarda', { alt: 'BELL_COMBAT_IDLE', parte2: true }],
    ['BELL_VESTIDO_ATTACK_STAR', 'Bell com Vestido Reforçado — atira estrela', { alt: 'BELL_ATTACK_STAR', parte2: true }],
    ['BELL_VESTIDO_ATTACK_SPREAD', 'Bell com Vestido Reforçado — leque de estrelas', { alt: 'BELL_ATTACK_SPREAD', parte2: true }],
    ['BELL_VESTIDO_SING', 'Bell com Vestido Reforçado — canção', { alt: 'BELL_SING', parte2: true }],
    ['BELL_VESTIDO_BLOCK', 'Bell com Vestido Reforçado — escudo de luz', { alt: 'BELL_BLOCK', parte2: true }],
    ['BELL_VESTIDO_DODGE', 'Bell com Vestido Reforçado — esquiva', { alt: 'BELL_DODGE', parte2: true }],
    ['BELL_VESTIDO_JUMP', 'Bell com Vestido Reforçado — pulo', { alt: 'BELL_JUMP', parte2: true }],
    ['BELL_VESTIDO_HIT', 'Bell com Vestido Reforçado — recebe dano', { alt: 'BELL_HIT', parte2: true }],
    ['BELL_VESTIDO_KNOCKDOWN', 'Bell com Vestido Reforçado — cai no chão', { alt: 'BELL_KNOCKDOWN', parte2: true }],
  ]);

  grupo('Bell com armadura: Manto Estelar', [
    ['BELL_ESTELAR_IDLE', 'Bell com Manto Estelar — parada', { dir: QUATRO, alt: 'BELL_IDLE', parte2: true }],
    ['BELL_ESTELAR_WALK', 'Bell com Manto Estelar — andando', { dir: QUATRO, alt: 'BELL_WALK', parte2: true }],
    ['BELL_ESTELAR_RUN', 'Bell com Manto Estelar — correndo', { dir: QUATRO, alt: 'BELL_RUN', parte2: true }],
    ['BELL_ESTELAR_COMBAT_IDLE', 'Bell com Manto Estelar — em guarda', { alt: 'BELL_COMBAT_IDLE', parte2: true }],
    ['BELL_ESTELAR_ATTACK_STAR', 'Bell com Manto Estelar — atira estrela', { alt: 'BELL_ATTACK_STAR', parte2: true }],
    ['BELL_ESTELAR_ATTACK_SPREAD', 'Bell com Manto Estelar — leque de estrelas', { alt: 'BELL_ATTACK_SPREAD', parte2: true }],
    ['BELL_ESTELAR_SING', 'Bell com Manto Estelar — canção', { alt: 'BELL_SING', parte2: true }],
    ['BELL_ESTELAR_BLOCK', 'Bell com Manto Estelar — escudo de luz', { alt: 'BELL_BLOCK', parte2: true }],
    ['BELL_ESTELAR_DODGE', 'Bell com Manto Estelar — esquiva', { alt: 'BELL_DODGE', parte2: true }],
    ['BELL_ESTELAR_JUMP', 'Bell com Manto Estelar — pulo', { alt: 'BELL_JUMP', parte2: true }],
    ['BELL_ESTELAR_HIT', 'Bell com Manto Estelar — recebe dano', { alt: 'BELL_HIT', parte2: true }],
    ['BELL_ESTELAR_KNOCKDOWN', 'Bell com Manto Estelar — cai no chão', { alt: 'BELL_KNOCKDOWN', parte2: true }],
  ]);

  grupo('Bell com armadura: Armadura da Aurora', [
    ['BELL_AURORA_IDLE', 'Bell com Armadura da Aurora — parada', { dir: QUATRO, alt: 'BELL_IDLE', parte2: true }],
    ['BELL_AURORA_WALK', 'Bell com Armadura da Aurora — andando', { dir: QUATRO, alt: 'BELL_WALK', parte2: true }],
    ['BELL_AURORA_RUN', 'Bell com Armadura da Aurora — correndo', { dir: QUATRO, alt: 'BELL_RUN', parte2: true }],
    ['BELL_AURORA_COMBAT_IDLE', 'Bell com Armadura da Aurora — em guarda', { alt: 'BELL_COMBAT_IDLE', parte2: true }],
    ['BELL_AURORA_ATTACK_STAR', 'Bell com Armadura da Aurora — atira estrela', { alt: 'BELL_ATTACK_STAR', parte2: true }],
    ['BELL_AURORA_ATTACK_SPREAD', 'Bell com Armadura da Aurora — leque de estrelas', { alt: 'BELL_ATTACK_SPREAD', parte2: true }],
    ['BELL_AURORA_SING', 'Bell com Armadura da Aurora — canção', { alt: 'BELL_SING', parte2: true }],
    ['BELL_AURORA_BLOCK', 'Bell com Armadura da Aurora — escudo de luz', { alt: 'BELL_BLOCK', parte2: true }],
    ['BELL_AURORA_DODGE', 'Bell com Armadura da Aurora — esquiva', { alt: 'BELL_DODGE', parte2: true }],
    ['BELL_AURORA_JUMP', 'Bell com Armadura da Aurora — pulo', { alt: 'BELL_JUMP', parte2: true }],
    ['BELL_AURORA_HIT', 'Bell com Armadura da Aurora — recebe dano', { alt: 'BELL_HIT', parte2: true }],
    ['BELL_AURORA_KNOCKDOWN', 'Bell com Armadura da Aurora — cai no chão', { alt: 'BELL_KNOCKDOWN', parte2: true }],
  ]);

  const PADRAO = { fps: 12, loop: false, face: 'R', quadros: 12 };

  function info(base) {
    if (CATALOGO[base]) return CATALOGO[base];
    const semDir = base.replace(/_(FRONT|BACK|LEFT|RIGHT)$/, '');
    return CATALOGO[semDir] || PADRAO;
  }

  function sprite(codigo) {
    return (window.SPRITES || {})[codigo] || null;
  }

  // Encontra a arte para (base, direção). Ordem: a própria direção; o lado oposto espelhado;
  // a versão sem direção; e por fim o `alt` do catálogo. Sem nada disso, devolve `falta`.
  const cache = new Map();
  function resolver(base, dir, lado) {
    const chave = base + '|' + (dir || '') + '|' + (lado < 0 ? -1 : 1);
    if (cache.has(chave)) return cache.get(chave);
    const inf = info(base);
    const esquerda = dir === 'LEFT' || (!dir && lado < 0) || ((dir === 'FRONT' || dir === 'BACK') && lado < 0);
    const tentativas = [];
    if (dir) tentativas.push([base + '_' + dir, false]);
    if (dir === 'LEFT') tentativas.push([base + '_RIGHT', true]);
    if (dir === 'RIGHT') tentativas.push([base + '_LEFT', true]);
    tentativas.push([base, inf.face === 'R' && esquerda]);
    if (dir === 'FRONT' || dir === 'BACK' || !dir) {
      tentativas.push([base + (lado < 0 ? '_LEFT' : '_RIGHT'), false]);
      tentativas.push([base + (lado < 0 ? '_RIGHT' : '_LEFT'), true]);
    }
    let r = null;
    for (const [codigo, flip] of tentativas) {
      const s = sprite(codigo);
      if (s) { r = { codigo, flip: s && info(codigo).face === 'F' ? false : flip, sprite: s }; break; }
    }
    if (!r && inf.alt) {
      const a = resolver(inf.alt, dir, lado);
      r = Object.assign({}, a, { via: base });
    }
    if (!r) r = { codigo: dir && inf.dir ? base + '_' + dir : base, flip: esquerda && inf.face === 'R', sprite: null, falta: true };
    cache.set(chave, r);
    return r;
  }

  // Velocidade da animação. A arte nova (itens 50 em diante) tem mais quadros que a antiga:
  // mantém a duração do catálogo (sincronizada com os golpes); em loop, vale o fps do artista.
  // Golpes, pulos, magias, esquivas, o dragão e os efeitos seguem o tempo do jogo; as outras (cenas,
  // emoções, abraços) não passam de 12 quadros por segundo e, quando a artista deu o fps, usam o dela.
  const NO_TEMPO_DO_JOGO = /ATTACK|DODGE|DASH|BLOCK|HIT|JUMP|LAND|CAST|RUN_START|RUN_STOP|SWORD|THROWN|KNOCKDOWN|STAR|SPREAD|_WALK|_RUN|^DRAGON_|^FX_|^GOLEM|^SHADOW|^WISP/;
  // `fpsMax` no catálogo: teto de velocidade para as cenas com poucos quadros (o prólogo), que ficavam
  // corridas no fps da arte; até chegarem mais quadros, elas andam mais devagar.
  function fpsDe(inf, s, n) {
    const f = fpsBase(inf, s, n);
    return inf.fpsMax ? Math.min(inf.fpsMax, f) : f;
  }

  function fpsBase(inf, s, n) {
    // Andar e correr (em loop): sempre o mesmo ciclo do catálogo, tenha a arte quantos quadros tiver.
    if (s && inf.loop && inf.codigo && /_(WALK|RUN)(_|$)/.test(inf.codigo)) return Math.max(4, Math.min(24, n * inf.fps / inf.quadros));
    if (!s || !s.ritmo) return inf.fps;
    const doJogo = !!inf.codigo && NO_TEMPO_DO_JOGO.test(inf.codigo);
    // Andar e correr seguem o passo do deslocamento (senão o pé escorrega), não o fps da arte.
    const movimento = !!inf.codigo && /_(WALK|RUN)(_|$)/.test(inf.codigo);
    if (s.fpsArte && (inf.loop ? !movimento : !doJogo)) return s.fpsArte;
    const fps = n === inf.quadros ? inf.fps : Math.max(4, Math.min(24, n * inf.fps / inf.quadros));
    return doJogo ? fps : Math.max(6, Math.min(12, fps));
  }

  class Animador {
    constructor(base) { this.base = base || null; this.t = 0; }

    tocar(base, reiniciar) {
      if (reiniciar || base !== this.base) { this.base = base; this.t = 0; }
    }

    atualizar(dt) { this.t += dt; }

    // `traduzir` troca o desenho sem mudar o tempo: a Bell jogável usa o ritmo dos golpes da Line.
    // `roupa` (armadura vestida, ex.: 'MALHA') tenta antes a arte com a armadura: LINE_WALK → LINE_MALHA_WALK.
    resolver(dir, lado) {
      const base = this.traduzir ? this.traduzir(this.base) : this.base;
      if (this.roupa && base) {
        const r = resolver(base.replace(/^(LINE|BELL)_/, '$1_' + this.roupa + '_'), dir, lado);
        if (r.sprite && !r.via) return r;
      }
      return resolver(base, dir, lado);
    }

    estado(dir, lado) {
      const r = this.resolver(dir, lado);
      const inf = info(this.base);
      const n = r.sprite ? r.sprite.seq.length : inf.quadros;
      const pos = this.t * fpsDe(inf, r.sprite, n);
      let i = Math.floor(pos);
      const acabou = !inf.loop && i >= n;
      i = inf.loop ? i % n : Math.min(i, n - 1);
      return {
        r, n, i,
        quadro: r.sprite ? r.sprite.seq[i] : i,
        progresso: inf.loop ? (pos % n) / n : Math.min(1, pos / n),
        acabou,
        duracao: n / fpsDe(inf, r.sprite, n),
      };
    }

    duracao(dir, lado) {
      const r = this.resolver(dir, lado);
      const inf = info(this.base);
      const n = r.sprite ? r.sprite.seq.length : inf.quadros;
      return n / fpsDe(inf, r.sprite, n);
    }

    irPara(progresso, dir, lado) { this.t = progresso * this.duracao(dir, lado); }
  }

  const imagens = {};

  // Personagens de imagem única (animados por movimento no código).
  const PERSONAGENS = { dragao: 'assets/personagens/dragao.png', mago: 'assets/personagens/mago.png' };
  for (const n of ['shopping_base', 'casa_azul', 'casa_roxo', 'casa_verde', 'casa_mostarda', 'casa_cabana', 'encontro_tunel', 'playground_fundo', 'arbusto_b', 'arbusto_c', 'arbusto_d', 'arvore_a', 'arvore_b', 'arvore_c', 'arvore_d', 'barco', 'barril', 'caixa', 'carroca', 'casa', 'celeiro', 'cenoura_0', 'cenoura_1', 'cenoura_2', 'cenoura_3', 'cerca', 'cerejeira_a', 'cerejeira_b', 'feno', 'feno_pilha', 'florida', 'galinheiro', 'girassol_0', 'girassol_1', 'girassol_2', 'lago', 'lampiao', 'macieira_a', 'macieira_b', 'macieira_c', 'milho_1', 'moinho', 'moita', 'pedra1', 'pier', 'pinheiro_a', 'pinheiro_b', 'pinheiro_c', 'placa', 'placa2', 'poco', 'porteira', 'tomate_0', 'tomate_1', 'tomate_2', 'tomate_3', 'tomate_4', 'tomate_5', 'trigo_1']) PERSONAGENS[n] = 'assets/cenario/' + n + '.webp';
  // Lote 144 a 152: bases de cenário (terreno da fazenda e planta da casa), objetos da fazenda e móveis.
  for (const n of ['base_fazenda', 'base_casa_fazenda', 'farm_dog_house', 'farm_theo_bowl', 'farm_theo_bowl_vazia', 'farm_clothesline', 'farm_picnic_table', 'farm_fence', 'farm_gate', 'farm_small_flowers', 'farm_wild_grass']) PERSONAGENS[n] = 'assets/cenario/' + n + '.webp';
  for (const n of ['fridge', 'stove', 'sink_counter', 'dining_table', 'sofa', 'bed', 'theo_bed', 'bathroom_vanity', 'toilet', 'fireplace_off', 'fireplace_on', 'armchair', 'coffee_table', 'dresser', 'wardrobe', 'nightstand', 'bookshelf', 'shower', 'bathroom_mirror', 'towel_rack', 'laundry_basket']) PERSONAGENS['farmhouse_' + n] = 'assets/moveis/farmhouse_' + n + '.webp';
  // Texturas do chão das fases, recortadas das bases dos cenários (itens 218 a 222).
  for (const n of ['vilarejo_chao', 'vilarejo_caminho', 'floresta_chao', 'floresta_caminho', 'ruinas_chao', 'montanha_chao']) PERSONAGENS['textura_' + n] = 'assets/texturas/' + n + '.webp';
  const personagens = {};
  // Objetos avulsos dos itens (tools/extrair_objetos.py): móveis da casa e objetos da fazenda.
  for (const [n, src] of Object.entries(LB.OBJETOS || {})) if (!PERSONAGENS[n]) PERSONAGENS[n] = src;

  function personagem(nome) {
    const img = personagens[nome];
    return img && img.complete && img.naturalWidth ? img : null;
  }

  // Soco sem espada: a mesma arte do soco na máquina (item 238), só o golpe (preparo, avanço, soco, volta).
  if (window.SPRITES && SPRITES.LINE_PUNCH_MACHINE && !SPRITES.LINE_PUNCH) {
    const seq = SPRITES.LINE_PUNCH_MACHINE.count >= 6 ? [1, 2, 3, 3, 4, 5] : [0, 1, 2, 2, 2, 1];
    SPRITES.LINE_PUNCH = Object.assign({}, SPRITES.LINE_PUNCH_MACHINE, { seq, label: 'Soco sem espada' });
    delete SPRITES.LINE_PUNCH.ritmo; delete SPRITES.LINE_PUNCH.fpsArte;
  }

  function carregarSprites(aoProgredir) {
    // Fundos grandes (bases, texturas e lugares do primeiro encontro) já saem decodificados do carregamento:
    // sem isso o navegador decodifica na primeira vez que o mapa aparece e o jogo para por um instante.
    const FUNDO = /^(base_|textura_|shopping_base|playground_fundo|encontro_tunel)/;
    for (const [nome, src] of Object.entries(PERSONAGENS)) {
      const img = new Image(); img.decoding = 'async'; img.src = src; personagens[nome] = img;
      if (FUNDO.test(nome) && img.decode) img.decode().catch(() => {});
    }
    const lista = Object.entries(window.SPRITES || {});
    let prontos = 0;
    return Promise.all(lista.map(([codigo, s]) => new Promise((ok) => {
      const img = new Image();
      img.onload = img.onerror = () => { prontos++; if (aoProgredir) aoProgredir(prontos / lista.length); ok(); };
      img.src = s.src;
      imagens[codigo] = img;
    })));
  }

  // Desenha o quadro com os pés em (x, y). `altura` é o tamanho da célula no mundo.
  function desenharSprite(ctx, r, quadro, x, y, altura) {
    const s = r.sprite, img = imagens[r.codigo];
    if (!s || !img || !img.complete || !img.naturalWidth) return false;
    // `mundo`: tamanho fixo da célula no mundo (arte avulsa), independe da altura pedida.
    // `ajuste`: correção de tamanho da animação (tools/ajuste_cabeca.json), para a Line e a Bell terem o
    // mesmo tamanho em todas as poses.
    const esc = (s.mundo ? s.mundo : altura * (s.escala || 1)) / s.cell * (s.ajuste || 1);
    const inf = info(r.codigo);
    const chao = inf.chao === 'fim' ? s.groundEnd : inf.chao === 'quadro' ? (s.bases ? s.bases[quadro] : s.ground) : typeof inf.chao === 'number' ? inf.chao : s.ground;
    ctx.save();
    ctx.translate(x, y);
    if (r.flip) ctx.scale(-1, 1);
    // `respira`: arte de um quadro só (o dragão dormindo) sobe e desce de leve, a partir dos pés.
    if (inf.respira) { const t = LB.jogo ? LB.jogo.tempo : performance.now() / 1000; ctx.scale(1, 1 + 0.025 * Math.sin(t * 1.8)); }
    ctx.drawImage(img, quadro * s.cell, 0, s.cell, s.cell, -s.cell / 2 * esc, -chao * esc, s.cell * esc, s.cell * esc);
    ctx.restore();
    return true;
  }

  // Lista de códigos esperados (famílias expandidas por direção) com o status de cada um.
  function inventario() {
    const saida = [];
    for (const g of GRUPOS) {
      const itens = [];
      for (const base of g.codigos) {
        const inf = CATALOGO[base];
        const codigos = inf.dir ? inf.dir.map((d) => base + '_' + d) : [base];
        for (const c of codigos) itens.push({ codigo: c, desc: inf.desc, nova: !!inf.nova, parte2: !!inf.parte2, existe: !!sprite(c) });
      }
      saida.push({ nome: g.nome, itens });
    }
    const conhecidos = new Set(saida.flatMap((g) => g.itens.map((i) => i.codigo)));
    const extras = Object.keys(window.SPRITES || {}).filter((c) => !conhecidos.has(c));
    if (extras.length) saida.push({ nome: 'Outras animações recebidas', itens: extras.map((c) => ({ codigo: c, desc: window.SPRITES[c].label, existe: true })) });
    return saida;
  }

  // Imagem avulsa registrada por outro arquivo (ex.: a planta de cada interior); carrega junto com as outras.
  function registrarImagem(nome, src) { PERSONAGENS[nome] = src; }

  Object.assign(LB, { CATALOGO, info, sprite, resolver, Animador, carregarSprites, desenharSprite, inventario, imagens, personagem, registrarImagem });
})(window.LB);
