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
      CATALOGO[codigo] = Object.assign({ fps: 12, loop: false, face: 'R', quadros: 12, desc }, opcoes || {});
    }
  }

  const LADOS = ['LEFT', 'RIGHT'];
  const QUATRO = ['FRONT', 'BACK', 'LEFT', 'RIGHT'];

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
    ['LINE_FALL', 'Cair', { fps: 14, chao: 236 }],
    ['LINE_GROUND_STAND', 'Levantar do chão', { fps: 14, quadros: 14, chao: 236 }],
  ]);

  grupo('Line — combate', [
    ['LINE_SWORD_DRAW', 'Sacar espada', { fps: 24 }],
    ['LINE_SWORD_SHEATHE', 'Guardar espada', { fps: 20, quadros: 14 }],
    ['LINE_COMBAT_IDLE', 'Postura de combate', { fps: 10, loop: true, quadros: 16 }],
    ['LINE_COMBAT_WALK', 'Andar com a espada em mãos', { dir: QUATRO, fps: 14, loop: true, alt: 'LINE_WALK', nova: true }],
    ['LINE_COMBAT_RUN', 'Correr com a espada em mãos', { dir: QUATRO, fps: 20, loop: true, alt: 'LINE_RUN', nova: true }],
    ['LINE_ATTACK_HORIZONTAL', 'Ataque horizontal', { fps: 34, quadros: 16 }],
    ['LINE_ATTACK_VERTICAL', 'Ataque vertical', { fps: 34, quadros: 18 }],
    ['LINE_ATTACK_DIAGONAL', 'Ataque diagonal', { fps: 38, quadros: 22 }],
    ['LINE_ATTACK_COMBO', 'Combo', { fps: 32, quadros: 22 }],
    ['LINE_ATTACK_SPIN', 'Ataque giratório', { fps: 30, quadros: 18 }],
    ['LINE_ATTACK_AIR', 'Ataque aéreo', { fps: 28, quadros: 20 }],
    ['LINE_BLOCK', 'Bloquear', { fps: 24, quadros: 16 }],
    ['LINE_DODGE', 'Esquivar', { fps: 30, quadros: 16 }],
    ['LINE_DASH', 'Dash', { fps: 30, quadros: 16 }],
    ['LINE_HIT_LIGHT', 'Receber dano leve', { fps: 32, quadros: 16 }],
    ['LINE_HIT_HEAVY', 'Receber golpe forte', { fps: 22, quadros: 14 }],
    ['LINE_THROWN', 'Ser arremessada', { fps: 22, quadros: 14, chao: 235 }],
    ['LINE_KNOCKDOWN', 'Cair após golpe', { fps: 26, quadros: 24, chao: 235 }],
    ['LINE_INJURED_STAND', 'Levantar machucada', { fps: 26, quadros: 28, chao: 235 }],
    ['LINE_EXHAUSTED_IDLE', 'Exausta', { fps: 10, loop: true, quadros: 20 }],
    ['LINE_DRAGON_FINAL_ATTACK', 'Ataque final contra o dragão', { fps: 14, quadros: 32 }],
    ['LINE_PUNCH_MACHINE', 'Soco na máquina (primeiro encontro)', { fps: 10, face: 'F', quadros: 16, nova: true }],
  ]);

  grupo('Line — emoções', [
    ['LINE_HAPPY', 'Feliz', { fps: 12, face: 'F', quadros: 20 }],
    ['LINE_LAUGH', 'Rindo', { fps: 12, face: 'F', quadros: 24 }],
    ['LINE_DETERMINED', 'Determinada', { loop: true, alt: 'LINE_COMBAT_IDLE' }],
    ['LINE_ANGRY', 'Brava', { loop: true, alt: 'LINE_COMBAT_IDLE' }],
    ['LINE_SCARED', 'Assustada', { loop: true, face: 'F', alt: 'LINE_IDLE_FRONT' }],
    ['LINE_SAD', 'Triste', { loop: true, face: 'F', alt: 'LINE_IDLE_FRONT' }],
    ['LINE_CRY', 'Chorando', { loop: true, face: 'F', alt: 'LINE_SAD' }],
    ['LINE_CALL_BELL', 'Gritando por Bell', { fps: 10, face: 'F', quadros: 16, alt: 'LINE_IDLE_BACK' }],
    ['LINE_RELIEVED', 'Aliviada', { face: 'F', quadros: 16, alt: 'LINE_HAPPY' }],
  ]);

  // Enquanto não houver arte própria, cada animação da Bell usa a mais parecida que já existe.
  grupo('Bell', [
    ['BELL_IDLE', 'Parada', { dir: QUATRO, fps: 8, loop: true, quadros: 16 }],
    ['BELL_BLINK_FRONT', 'Piscar', { face: 'F', alt: 'BELL_IDLE_FRONT' }],
    ['BELL_LOOK_SIDES_FRONT', 'Olhar para os lados', { face: 'F', fps: 8, quadros: 24, alt: 'BELL_IDLE_FRONT' }],
    ['BELL_WALK', 'Andar', { dir: QUATRO, fps: 10, loop: true, quadros: 8 }],
    ['BELL_RUN', 'Correr', { dir: QUATRO, fps: 16, loop: true, quadros: 8, alt: 'BELL_WALK' }],
    ['BELL_LAUGH', 'Gargalhada', { fps: 10, loop: true, face: 'F', quadros: 16, nova: true }],
    ['BELL_JUMP', 'Pular', { alt: 'BELL_IDLE' }],
    ['BELL_LAND', 'Aterrissar', { alt: 'BELL_IDLE' }],
    ['BELL_GROUND_STAND', 'Levantar do chão', { alt: 'BELL_IDLE' }],
    ['BELL_SCARED', 'Assustada', { loop: true, face: 'F', alt: 'BELL_IDLE', tremer: true }],
    ['BELL_FLEE', 'Fugir', { loop: true, alt: 'BELL_RUN' }],
    ['BELL_FALL', 'Cair', { alt: 'BELL_IDLE' }],
    ['BELL_CAPTURED', 'Ser capturada', { alt: 'BELL_IDLE_FRONT', tremer: true }],
    ['BELL_DRAGON_CARRIED', 'Ser carregada pelo dragão', { loop: true, alt: 'BELL_IDLE_FRONT', balancar: true }],
    ['BELL_TRAPPED', 'Presa', { loop: true, face: 'F', alt: 'BELL_IDLE_FRONT' }],
    ['BELL_ESCAPE_ATTEMPT', 'Tentar escapar', { loop: true, face: 'F', alt: 'BELL_IDLE_FRONT', tremer: true }],
    ['BELL_BREAK_FREE', 'Conseguir se libertar', { face: 'F', alt: 'BELL_LAUGH' }],
    ['BELL_CALL_LINE', 'Chamar Line', { loop: true, face: 'F', alt: 'BELL_IDLE_FRONT', pular: true }],
    ['BELL_HELP_LINE', 'Ajudar Line', { alt: 'BELL_IDLE' }],
    ['BELL_HAPPY', 'Feliz', { loop: true, face: 'F', alt: 'BELL_LAUGH' }],
    ['BELL_RELIEVED', 'Aliviada', { face: 'F', alt: 'BELL_LAUGH' }],
    ['BELL_CRY', 'Chorando', { loop: true, face: 'F', alt: 'BELL_IDLE_FRONT' }],
  ]);

  grupo('Line e Bell juntas', [
    ['LINE_BELL_WALK_TOGETHER', 'Andando lado a lado', { dir: QUATRO, loop: true }],
    ['LINE_BELL_WALK_HANDS', 'Andando de mãos dadas', { dir: QUATRO, fps: 10, loop: true, quadros: 10 }],
    ['LINE_BELL_RUN_TOGETHER', 'Correndo juntas', { dir: QUATRO, loop: true }],
    ['LINE_BELL_TALK', 'Conversando', { loop: true }],
    ['LINE_BELL_LAUGH', 'Rindo juntas', { loop: true }],
    ['LINE_BELL_EAT', 'Almoçando juntas', { fps: 6, loop: true, face: 'F', quadros: 24, nova: true }],
    ['LINE_BELL_KISS', 'Bitoquinha', { fps: 5, face: 'F', quadros: 8, nova: true }],
    ['BELL_LEAN_ON_LINE', 'Bell encostando na Line'],
    ['LINE_BELL_HOLD_HANDS', 'Segurando as mãos', { loop: true, face: 'F' }],
    ['LINE_BELL_RESCUE_HUG', 'Abraço do resgate', { quadros: 24, loop: true, face: 'F' }],
    ['LINE_BELL_HUG_RELEASE', 'Separação do abraço'],
    ['LINE_BELL_CELEBRATE', 'Comemorando a vitória', { loop: true }],
    ['LINE_BELL_SIT_DOWN', 'Sentando juntas'],
    ['BELL_HEAD_ON_LINE', 'Bell apoiando a cabeça na Line'],
    ['LINE_BELL_SIT_IDLE', 'Idle das duas sentadas', { loop: true }],
  ]);

  grupo('Dragão', [
    ['DRAGON_IDLE', 'Parado respirando', { loop: true, fps: 8, quadros: 9 }],
    ['DRAGON_BLINK', 'Piscar', { alt: 'DRAGON_IDLE' }],
    ['DRAGON_WALK', 'Andar', { loop: true, fps: 10, quadros: 8 }],
    ['DRAGON_RUN', 'Correr', { loop: true, fps: 12, quadros: 7 }],
    ['DRAGON_TURN', 'Virar', { alt: 'DRAGON_IDLE' }],
    ['DRAGON_WINGS_OPEN', 'Abrir asas', { alt: 'DRAGON_TAKEOFF' }],
    ['DRAGON_TAKEOFF', 'Decolar', { fps: 12, quadros: 8 }],
    ['DRAGON_FLY', 'Voar', { loop: true, fps: 10, quadros: 6 }],
    ['DRAGON_GLIDE', 'Planar', { loop: true, alt: 'DRAGON_FLY' }],
    ['DRAGON_LAND', 'Pousar', { fps: 12, quadros: 8, chao: 'fim' }],
    ['DRAGON_ROAR', 'Rugir', { alt: 'DRAGON_FIRE_CHARGE' }],
    ['DRAGON_BITE', 'Morder', { alt: 'DRAGON_CLAW_ATTACK' }],
    ['DRAGON_CLAW_ATTACK', 'Ataque de garra', { fps: 5.5, quadros: 7 }],
    ['DRAGON_TAIL_ATTACK', 'Golpe de cauda', { fps: 4, quadros: 7, alt: 'DRAGON_CLAW_ATTACK' }],
    ['DRAGON_FIRE_CHARGE', 'Preparar fogo', { fps: 3, quadros: 3 }],
    ['DRAGON_FIRE_BREATH', 'Cuspir fogo', { fps: 10, quadros: 12 }],
    ['DRAGON_FIRE_STREAM', 'Fogo contínuo', { loop: true, fps: 6, quadros: 2 }],
    ['DRAGON_AIR_ATTACK', 'Ataque aéreo', { fps: 12, quadros: 8 }],
    ['DRAGON_HIT', 'Receber dano', { fps: 14, quadros: 6 }],
    ['DRAGON_WEAK_POINT_HIT', 'Ponto fraco atingido', { alt: 'DRAGON_HIT' }],
    ['DRAGON_STUNNED', 'Atordoado', { loop: true, fps: 6, quadros: 4 }],
    ['DRAGON_DESPERATE_ATTACK', 'Ataque desesperado', { alt: 'DRAGON_FIRE_STREAM' }],
    ['DRAGON_FINAL_HIT', 'Receber golpe final', { alt: 'DRAGON_HIT' }],
    ['DRAGON_FALL', 'Cair', { fps: 6, quadros: 6 }],
    ['DRAGON_DEFEATED', 'Derrotado', { loop: true, quadros: 1 }],
    ['DRAGON_SLEEP', 'Dormir', { loop: true, fps: 4, quadros: 6, nova: true }],
    ['DRAGON_EYE_OPEN_END', 'Ressurgir no final', { fps: 5, quadros: 6 }],
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

  class Animador {
    constructor(base) { this.base = base || null; this.t = 0; }

    tocar(base, reiniciar) {
      if (reiniciar || base !== this.base) { this.base = base; this.t = 0; }
    }

    atualizar(dt) { this.t += dt; }

    estado(dir, lado) {
      const r = resolver(this.base, dir, lado);
      const inf = info(this.base);
      const n = r.sprite ? r.sprite.seq.length : inf.quadros;
      const pos = this.t * inf.fps;
      let i = Math.floor(pos);
      const acabou = !inf.loop && i >= n;
      i = inf.loop ? i % n : Math.min(i, n - 1);
      return {
        r, n, i,
        quadro: r.sprite ? r.sprite.seq[i] : i,
        progresso: inf.loop ? (pos % n) / n : Math.min(1, pos / n),
        acabou,
        duracao: n / inf.fps,
      };
    }

    duracao(dir, lado) {
      const r = resolver(this.base, dir, lado);
      const inf = info(this.base);
      return (r.sprite ? r.sprite.seq.length : inf.quadros) / inf.fps;
    }

    irPara(progresso, dir, lado) { this.t = progresso * this.duracao(dir, lado); }
  }

  const imagens = {};

  // Personagens de imagem única (animados por movimento no código).
  const PERSONAGENS = { dragao: 'assets/personagens/dragao.png', mago: 'assets/personagens/mago.png' };
  for (const n of ['arbusto_a', 'arbusto_b', 'arbusto_c', 'arbusto_d', 'arbusto_e', 'arbusto_f', 'arvore_a', 'arvore_b', 'arvore_c', 'arvore_d', 'barco', 'barril', 'cachoeira', 'caixa', 'carroca', 'casa', 'celeiro', 'cenoura_0', 'cenoura_1', 'cenoura_2', 'cenoura_3', 'cerca', 'cerejeira_a', 'cerejeira_b', 'feno', 'feno_pilha', 'florida', 'galinheiro', 'girassol_0', 'girassol_1', 'girassol_2', 'lago', 'lampiao', 'macieira_a', 'macieira_b', 'macieira_c', 'milho_0', 'milho_1', 'milho_2', 'moinho', 'moita', 'pedra1', 'pedra2', 'pier', 'pinheiro_a', 'pinheiro_b', 'pinheiro_c', 'placa', 'placa2', 'poco', 'porteira', 'tomate_0', 'tomate_1', 'tomate_2', 'tomate_3', 'tomate_4', 'tomate_5', 'trigo_0', 'trigo_1', 'trigo_2']) PERSONAGENS[n] = 'assets/cenario/' + n + '.webp';
  const personagens = {};
  function personagem(nome) {
    const img = personagens[nome];
    return img && img.complete && img.naturalWidth ? img : null;
  }

  function carregarSprites(aoProgredir) {
    for (const [nome, src] of Object.entries(PERSONAGENS)) { const img = new Image(); img.src = src; personagens[nome] = img; }
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
    const esc = (s.mundo ? s.mundo : altura * (s.escala || 1)) / s.cell;
    const inf = info(r.codigo);
    const chao = inf.chao === 'fim' ? s.groundEnd : typeof inf.chao === 'number' ? inf.chao : s.ground;
    ctx.save();
    ctx.translate(x, y);
    if (r.flip) ctx.scale(-1, 1);
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
        for (const c of codigos) itens.push({ codigo: c, desc: inf.desc, nova: !!inf.nova, existe: !!sprite(c) });
      }
      saida.push({ nome: g.nome, itens });
    }
    const conhecidos = new Set(saida.flatMap((g) => g.itens.map((i) => i.codigo)));
    const extras = Object.keys(window.SPRITES || {}).filter((c) => !conhecidos.has(c));
    if (extras.length) saida.push({ nome: 'Outras animações recebidas', itens: extras.map((c) => ({ codigo: c, desc: window.SPRITES[c].label, existe: true })) });
    return saida;
  }

  Object.assign(LB, { CATALOGO, info, sprite, resolver, Animador, carregarSprites, desenharSprite, inventario, imagens, personagem });
})(window.LB);
