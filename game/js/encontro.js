'use strict';

// Prólogo jogável: "O primeiro encontro" (09/05/2024), fiel ao HTML Bell-Line-Primeiro-Encontro-v26.
// Três lugares — Minas Shopping, Playground e Túnel — e depois a transição para a fazenda.
// As coordenadas vêm do HTML (tela de 360×640) e são multiplicadas por K para o mundo do jogo.
(function (LB) {
  const TILE = LB.TILE;
  const K = 4 / 3;
  const P = (x, y) => ({ x: x * K, y: y * K });
  const DATA = '09/05/2024';
  const LIMITES = [28 * K, 130 * K, 332 * K, 545 * K]; // mesma área andável do HTML
  const LINHAS = Array.from({ length: 27 }, () => '.'.repeat(15));

  const MAPAS = {
    shopping: { nome: 'Minas Shopping', lugar: 'Minas Shopping', fundo: 'shopping_base' },
    playground: { nome: 'Playground', lugar: 'Playground', fundo: 'playground_fundo' },
    tunel: { nome: 'Túnel', lugar: 'Túnel', fundo: 'encontro_tunel' },
  };
  for (const [id, m] of Object.entries(MAPAS)) {
    const ini = id === 'shopping' ? P(178, 528) : id === 'playground' ? P(42, 520) : P(25, 520);
    // No shopping o fundo é a fila de lojas: só se anda do balcão para baixo.
    const lim = id === 'shopping' ? [LIMITES[0], 200 * K, LIMITES[2], LIMITES[3]] : LIMITES;
    LB.MAPAS[id] = Object.assign({ tema: 'encontro', linhas: LINHAS, saidas: [], placas: {}, limites: lim, semBanner: true, inicio: { x: ini.x / TILE, y: ini.y / TILE, dir: 'BACK' } }, m);
  }

  const ehEncontro = (jogo) => jogo.mapa && jogo.mapa.tema === 'encontro';

  // ---------------- Cenário ----------------
  const borrados = {};
  function borrado(nome) {
    if (borrados[nome]) return borrados[nome];
    const img = LB.personagem(nome);
    if (!img) return null;
    const c = document.createElement('canvas'); c.width = 24; c.height = 43;
    c.getContext('2d').drawImage(img, 0, 0, 24, 43);
    return (borrados[nome] = c);
  }

  // Fundo da área (antes do chão): ilustração do HTML + bordas borradas para telas largas.
  function desenharFundo(g, jogo, cx, cy) {
    const m = jogo.mapa, nome = m.def.fundo;
    g.fillStyle = '#1c1524'; g.fillRect(cx - 2, cy - 2, jogo.vw + 4, jogo.vh + 4);
    const img = LB.personagem(nome), b = borrado(nome);
    const W = 360 * K, H = 640 * K;
    if (b) {
      g.save(); g.globalAlpha = 0.5; g.imageSmoothingEnabled = true;
      g.drawImage(b, cx - 20, cy - 20, jogo.vw + 40, jogo.vh + 40);
      g.globalAlpha = 0.45; g.fillStyle = '#140f1c'; g.fillRect(cx - 20, cy - 20, jogo.vw + 40, jogo.vh + 40);
      g.restore();
    }
    if (!img) return;
    g.save(); g.imageSmoothingEnabled = false; g.drawImage(img, 0, 0, W, H); g.restore();
    if (nome === 'shopping_base') {
      const sh = g.createLinearGradient(0, 0, 0, H);
      sh.addColorStop(0, 'rgba(255,244,235,.05)'); sh.addColorStop(0.72, 'rgba(82,39,57,.04)'); sh.addColorStop(1, 'rgba(48,24,38,.14)');
      g.fillStyle = sh; g.fillRect(0, 0, W, H);
    } else {
      const gl = g.createRadialGradient(180 * K, 330 * K, 30 * K, 180 * K, 330 * K, 300 * K);
      gl.addColorStop(0, 'rgba(255,220,181,.04)'); gl.addColorStop(1, 'rgba(20,12,38,.18)');
      g.fillStyle = gl; g.fillRect(0, 0, W, H);
    }
  }

  // Playground montado em peças (itens 235 a 240): fundo vazio + cada móvel na régua de tamanhos
  // (LB.LARGURA_OBJETOS), na posição do guia do item 240 (base de 360×640). `base` é onde a peça
  // encosta no chão; a ordem de desenho segue essa linha, então a Line e a Bell passam na frente e atrás.
  // O fliperama rosa é espelhado para a tela olhar para dentro da sala.
  // O shopping também é montado assim: a base (piso do item 218 com o teto de madeira e a coluna do
  // modelo da praça de alimentação) e, por cima, as lojas, as mesas e os canteiros da praça.

  // Mesa redonda da praça com 4 cadeiras viradas para ela: duas de frente atrás da mesa e uma de cada
  // lado, na altura da mesa (a da esquerda virada para a direita, a da direita virada para a esquerda).
  // `solido` é o pé do grupo (largura e fundo, a partir da base) onde a Line não entra.
  // `grupo` marca as cadeiras da mesa do BK: na cena do lanche, as cadeiras que a arte das duas já
  // traz desenhadas saem de cena (primeiro as dos lados, frente a frente; depois as de trás, juntinhas).
  function mesaComCadeiras(x, base, mesa, grupo) {
    const tras = grupo && grupo + '_tras', lados = grupo && grupo + '_lados';
    return [
      { nome: 'shop_praca_cadeira_madeira_front', x: x - 11, base: base - 12, grupo: tras },
      { nome: 'shop_praca_cadeira_madeira_front', x: x + 11, base: base - 12, grupo: tras },
      { nome: 'shop_praca_cadeira_madeira_right', x: x - 23, base: base - 3, grupo: lados },
      { nome: 'shop_praca_cadeira_madeira_left', x: x + 23, base: base - 3, grupo: lados },
      { nome: mesa || 'shop_praca_mesa_redonda', x, base, solido: [72, 26] },
    ];
  }

  const PECAS = {
    // Playground com as peças separadas (zip PLAYGROUND_ITENS_SEPARADOS): neon de coração, guirlanda e
    // pôster na parede do fundo; neon de raio e de estrela saindo das paredes do lado (o suporte fica na
    // parede); garra, balcão de prêmios, cápsulas, caixa de som e planta no fundo; fliperamas na esquerda;
    // lixeira e banco na direita. O caminho da história (entrada, máquina de soco e saída) fica livre.
    playground: [
      { nome: 'playground_parede_guirlanda_ingressos', x: 180, base: 70, parede: true },
      { nome: 'playground_painel_premios', x: 180, base: 122, parede: true },
      { nome: 'playground_parede_neon_coracao_rosa', x: 86, base: 112, parede: true },
      { nome: 'playground_parede_poster_espacial', x: 274, base: 120, parede: true },
      { nome: 'playground_parede_neon_raio_bicolor', x: 34, base: 215, parede: true },
      { nome: 'playground_parede_neon_estrela_azul', x: 326, base: 225, parede: true, flip: true },
      { nome: 'playground_parede_caixa_som_roxa', x: 52, base: 158 },
      { nome: 'playground_maquina_garra_rosa', x: 96, base: 170 },
      { nome: 'playground_balcao_premios_rosa', x: 188, base: 168 },
      { nome: 'playground_maquina_capsulas_rosa', x: 270, base: 166 },
      { nome: 'playground_decoracao_planta_vaso_roxo', x: 312, base: 160 },
      { nome: 'playground_maquina_fliperama_rosa', x: 54, base: 262 },
      { nome: 'playground_maquina_fliperama_azul', x: 54, base: 345 },
      { nome: 'playground_decoracao_lixeira_roxa', x: 330, base: 300 },
      { nome: 'playground_movel_banco_azul', x: 300, base: 385 },
      { nome: 'playground_maquina_soco', x: 231, base: 438, frente: 14 },
    ],
    // Praça de alimentação no modelo da arte/referencias/minas_shopping_praca_modelo.png: a base é a do zip
    // de essenciais (teto de madeira e parede vazia), as duas lojas apoiadas na parede, o pilar branco na
    // frente da coluna, 6 mesas com 4 cadeiras (uma com o lanche do BK), a estação de bandejas e os
    // canteiros na direita. O corredor do meio fica livre para a história.
    shopping: [
      { nome: 'shop_praca_loja_hamburguer', x: 112, base: 186 },
      { nome: 'shop_praca_loja_frango', x: 270, base: 186 },
      { nome: 'shop_praca_pilar_branco', x: 346, base: 196 },
      ...[[84, 300], [276, 300], [84, 396], [84, 492], [276, 492]].flatMap(([x, b]) => mesaComCadeiras(x, b)),
      ...mesaComCadeiras(276, 396, 'shop_praca_mesa_bk', 'bk'),
      { nome: 'shop_praca_lixeira_bandejas', x: 330, base: 236, solido: [44, 14] },
      { nome: 'shop_praca_canteiro_retangular', x: 352, base: 300, solido: [70, 16] },
      { nome: 'shop_praca_canteiro_curto', x: 350, base: 445, solido: [56, 14] },
    ],
  };
  // Onde a Line fica para socar: o punho do quadro do golpe alcança o saco da máquina.
  const SOCO = P(203, 428);
  // Saco de pancada (centro), para a faísca do impacto.
  const SACO = P(226, 396);
  function objetos(jogo) {
    const pecas = PECAS[jogo.mapa.id];
    if (!pecas) return [];
    const placar = jogo.encontro && jogo.encontro.placar === '038' ? '038' : '000';
    const nomeDe = (p) => p.nome === 'playground_maquina_soco' ? p.nome + '_' + placar
      : p.quadros ? p.nome + '_frame_0' + (1 + Math.floor(jogo.tempo * 6) % p.quadros) : p.nome;
    const sentadas = jogo.encontro && jogo.encontro.sentadas;
    return pecas.filter((p) => !p.grupo || p.grupo !== sentadas).map((p) => ({
      // A plataforma da máquina fica sob os pés da Line: a peça vai para trás dela (`frente`).
      y: p.parede ? 0 : (p.base - (p.frente || 0)) * K,
      desenhar: (g) => desenharPeca(g, p, nomeDe(p)),
    }));
  }

  function desenharPeca(g, p, nome) {
    const img = LB.personagem(nome), L = (LB.LARGURA_OBJETOS || {})[nome] || (LB.LARGURA_OBJETOS || {})[nome.replace(/_frame_\d+$/, '_frame_01')];
    if (!img || !L) return;
    const w = L, h = w * img.height / img.width, x = p.x * K, y = p.base * K;
    g.save(); g.imageSmoothingEnabled = true;
    g.beginPath(); g.rect(0, 0, 360 * K, 640 * K); g.clip();
    if (p.flip) { g.translate(x, 0); g.scale(-1, 1); g.drawImage(img, -w / 2, y - h, w, h); }
    else g.drawImage(img, x - w / 2, y - h, w, h);
    g.restore();
  }

  // ---------------- Interação ----------------
  function acoes(jogo, lista, perto) {
    const e = jogo.encontro;
    if (!ehEncontro(jogo) || !e) return;
    const b = jogo.bell;
    if (e.etapa === 'explorar' && b && perto(b.x, b.y, 110)) {
      lista.push({ texto: 'Falar com a Bell', x: b.x, y: b.y - 100, prio: 1, fazer: () => { e.etapa = 'conversa'; document.getElementById('dica').classList.add('oculto'); jogo.iniciarCena(LB.HISTORIA.encontroConversa); } });
    }
    if (e.etapa === 'soco') {
      lista.push({ texto: 'Tentar!', x: SOCO.x + 17, y: SOCO.y - 110, px: jogo.line.x, py: jogo.line.y, prio: 2, fazer: () => { e.etapa = 'socando'; jogo.iniciarCena(LB.HISTORIA.encontroSoco); } });
    }
  }

  function bloqueia(jogo, x, y) {
    const lim = jogo.mapa.def.limites;
    if (lim && (x < lim[0] || x > lim[2] || y < lim[1] || y > lim[3])) return true;
    for (const p of PECAS[jogo.mapa.id] || []) {
      if (p.solido && Math.abs(x - p.x * K) < p.solido[0] * K / 2 && y <= p.base * K && y > (p.base - p.solido[1]) * K) return true;
    }
    const b = jogo.bell;
    if (ehEncontro(jogo) && b && b.visivel !== false && Math.hypot(x - b.x, y - b.y) < 70) return true;
    return false;
  }

  // Etiquetas do topo (lugar e data), como no HTML.
  function mostrarEtiquetas(jogo) {
    const el = document.getElementById('etiquetas');
    if (!el) return;
    const on = ehEncontro(jogo) && jogo.estado === 'jogo';
    el.classList.toggle('oculto', !on);
    if (on) document.getElementById('etiqueta-lugar').textContent = jogo.mapa.def.lugar;
  }

  // ---------------- Fluxo ----------------
  function iniciar(jogo) {
    jogo.encontro = { etapa: 'intro', placar: '000' };
    jogo.iniciarArea('shopping', null, true);
    jogo.iniciarCena(LB.HISTORIA.encontroInicio);
  }

  // Troca de lugar (Shopping → Playground → Túnel) e começa a cena de chegada.
  function irPara(jogo, id, cena) {
    jogo.iniciarArea(id, null, true);
    jogo.fade = 1;
    jogo.iniciarCena(cena);
  }

  function prepararArea(jogo, id) {
    const e = jogo.encontro || (jogo.encontro = { etapa: 'intro', placar: '000' });
    jogo.line.modoPasseio = true;
    jogo.line.temEspada = false;
    if (id === 'shopping') {
      const b = P(182, 355);
      jogo.bell = new LB.Bell(b.x, b.y, 'LEFT'); jogo.bell.lado = -1; jogo.bell.anim.tocar('BELL_WAIT', true);
      jogo.line.dir = 'BACK';
    }
    e.placar = '000'; e.socando = false; e.sentadas = null;
    mostrarEtiquetas(jogo);
  }

  // Lugar de cada uma nas cadeiras dos lados da mesa do BK (o desenho é centrado na célula da arte,
  // então o ponto fica onde a cadeira desenhada cai em cima da cadeira da mesa).
  const LUGAR_BK = { line: P(253, 393), bell: P(299, 393) };
  function sentar(quem, lugar, anim, lado) {
    quem.x = lugar.x; quem.y = lugar.y; quem.lado = lado; quem.dir = lado < 0 ? 'LEFT' : 'RIGHT';
    quem.anim.tocar(anim, true);
  }

  // Duas personagens andando juntas até (x, y) de cada uma (em unidades do mundo).
  function andarJuntas(c, line, bell, pl, pb, vel) {
    c.junto(c.andar(bell, pb.x / TILE, pb.y / TILE, { vel: vel || 82, parar: 'BELL_IDLE' }));
    return c.andar(line, pl.x / TILE, pl.y / TILE, { vel: vel || 82, parar: 'LINE_IDLE' });
  }

  const T = (n) => n / TILE;

  const HISTORIA = {
    *encontroInicio(c, j) {
      const line = j.line;
      j.fade = 1;
      line.dir = 'BACK'; line.anim.tocar('LINE_IDLE', true);
      j.cameraEm(line.x, line.y - 60);
      yield c.escurecer(0, 1.2);
      yield c.titulo('O primeiro encontro', `Minas Shopping · ${DATA}`, 2.6);
      line.anim.tocar('LINE_ADMIRE', true);
      yield c.fala('Line', 'puxa ela é tão linda', 'apaixonada');
      line.anim.tocar('LINE_IDLE', true);
      j.encontro.etapa = 'explorar';
      j.dica('encontro', LB.entrada.usandoToque() ? 'Aproxime-se da Bell e toque no botão para falar com ela.' : 'Aproxime-se da Bell e pressione E para falar com ela.');
    },

    *encontroConversa(c, j) {
      const line = j.line, bell = j.bell;
      // A Line chega perto da Bell.
      yield c.andar(line, T(bell.x - 46 * K), T(bell.y), { vel: 82, parar: 'LINE_IDLE' });
      line.dir = 'RIGHT'; line.lado = 1; bell.dir = 'LEFT'; bell.lado = -1;
      const meio = { x: (line.x + bell.x) / 2, y: bell.y };
      j.camAlvo = { x: meio.x, y: meio.y - 40 }; j.zoomAlvo = 1.6;
      c.duo('LINE_BELL_MEET', meio.x, meio.y);
      yield c.fala('Line', 'esse shopping é muito grande', 'sorriso');
      c.fimDuo(); c.duo('LINE_BELL_GREET_HUG', meio.x, meio.y);
      yield c.fala('Bell', 'Você tá atrasada', 'maroto');
      c.fimDuo(); c.duo('LINE_BELL_MEET', meio.x, meio.y);
      yield c.fala('Line', 'oq vamos comer?', 'sorriso');
      yield c.fala('Bell', 'BK.', 'sorriso');
      c.fimDuo(); j.zoomAlvo = 1;
      document.getElementById('etiquetas').classList.add('oculto');
      // Vão até a mesa do BK e sentam frente a frente, nas cadeiras dos lados (cada arte já traz a
      // cadeira): a Line à esquerda, virada para a direita, e a Bell à direita, virada para a esquerda.
      yield andarJuntas(c, line, bell, P(250, 420), P(302, 420));
      yield c.quando(() => !bell.alvoCena);
      const assento = P(276, 384), mesa = P(276, 420);
      j.encontro.sentadas = 'bk_lados';
      sentar(line, LUGAR_BK.line, 'LINE_SIT_CHAIR_EAT', 1);
      sentar(bell, LUGAR_BK.bell, 'BELL_SIT_CHAIR_EAT', -1);
      j.camAlvo = { x: mesa.x, y: assento.y - 10 }; j.zoomAlvo = 1.6;
      yield c.espera(1.6);
      yield c.fala('Bell', 'você parece estar tímida', 'neutro');
      yield c.fala('Line', 'é que você é muito linda', 'apaixonada');
      yield c.fala('Bell', '', 'apaixonada');
      // Depois da declaração, as duas aparecem juntinhas, do mesmo lado da mesa (nas cadeiras de trás).
      yield c.escurecer(1, 0.45);
      j.encontro.sentadas = 'bk_tras';
      c.duo('LINE_BELL_BK', assento.x, assento.y);
      yield c.escurecer(0, 0.45);
      j.particulas.emitir('coracao', assento.x, assento.y - 70, 5, { vel: 25, vida: 1.6 });
      yield c.espera(2);
      c.fimDuo(); j.encontro.sentadas = null; c.duo('LINE_BELL_MEET', mesa.x, mesa.y);
      yield c.fala('Narradora', 'As duas sorriem. Bell segura a mão da Line e elas saem juntas do shopping.');
      c.fimDuo(); j.zoomAlvo = 1;
      document.getElementById('etiquetas').classList.add('oculto');
      // Saem de mãos dadas.
      // Pela frente da mesa até o corredor do meio e depois descendo até a saída (sem atravessar mesas).
      c.duo('LINE_BELL_WALK_HANDS', mesa.x, mesa.y, 'LEFT');
      const duo = j.duo, corredor = P(180, 436), saida = P(180, 610);
      j.camAlvo = null;
      if (duo) {
        c.junto(c.tween(duo, 'y', corredor.y, 1.1));
        yield c.tween(duo, 'x', corredor.x, 1.1);
        duo.dir = 'RIGHT';
        yield c.tween(duo, 'y', saida.y, 2);
      }
      yield transicao(c, j);
      irPara(j, 'playground', LB.HISTORIA.encontroPlayground);
    },

    *encontroPlayground(c, j) {
      const line = j.line;
      const ib = P(82, 520);
      const bell = j.bell = new LB.Bell(ib.x, ib.y, 'RIGHT');
      line.dir = 'RIGHT'; line.lado = 1;
      j.cameraEm(line.x, line.y - 60);
      j.tint = { cor: '247,178,200', a: 0.35 };
      c.junto(c.escurecer(0, 0.6));
      c.junto(c.tingir('247,178,200', 0, 0.9));
      yield andarJuntas(c, line, bell, SOCO, P(135, 442));
      yield c.quando(() => !bell.alvoCena);
      line.dir = 'RIGHT'; line.lado = 1; bell.dir = 'RIGHT'; bell.lado = 1;
      j.encontro.etapa = 'soco';
      line.travada = true;
      j.dica('soco', LB.entrada.usandoToque() ? 'Toque no botão para a Line tentar.' : 'Pressione E para a Line tentar.');
    },

    *encontroSoco(c, j) {
      const line = j.line, bell = j.bell, e = j.encontro;
      document.getElementById('dica').classList.add('oculto');
      line.dir = 'RIGHT'; line.lado = 1;
      e.socando = true;
      line.anim.tocar('LINE_PUNCH_MACHINE', true);
      bell.anim.tocar('BELL_LAUGH_AT_LINE', true);
      yield c.quando(() => line.anim.estado(line.dir, line.lado).progresso > 0.55);
      e.placar = '038';
      j.tremer(3, 0.25);
      j.particulas.emitir('impacto', SACO.x, SACO.y, 1, { r: 4, vida: 0.25, vel: 0 });
      yield c.animacao(line);
      e.socando = false;
      line.anim.tocar('LINE_IDLE', true);
      yield c.fala('Bell', 'HAHAHAHA! Você viu isso?', 'maroto');
      yield c.fala('Line', 'Eu não consegui bater direito… aquela coisa estava estragada.', 'sorriso');
      bell.anim.tocar('BELL_IDLE', true);
      yield c.fala('Narradora', 'Elas saem do playground com a barriga doendo de tanto rir.');
      line.travada = false;
      yield andarJuntas(c, line, bell, P(258, 500), P(302, 500));
      yield c.quando(() => !bell.alvoCena);
      yield transicao(c, j);
      irPara(j, 'tunel', LB.HISTORIA.encontroTunel);
    },

    *encontroTunel(c, j) {
      const line = j.line;
      const ib = P(65, 520);
      const bell = j.bell = new LB.Bell(ib.x, ib.y, 'RIGHT');
      line.dir = 'RIGHT'; line.lado = 1;
      j.cameraEm(line.x + 60, line.y - 80);
      j.tint = { cor: '247,178,200', a: 0.35 };
      c.junto(c.escurecer(0, 0.6));
      c.junto(c.tingir('247,178,200', 0, 0.9));
      yield andarJuntas(c, line, bell, P(173, 520), P(213, 520));
      yield c.quando(() => !bell.alvoCena);
      const meio = P(193, 520);
      j.camAlvo = { x: meio.x, y: meio.y - 50 }; j.zoomAlvo = 1.6;
      c.duo('LINE_BELL_TUNNEL_KISS', meio.x, meio.y);
      for (let i = 0; i < 4; i++) { j.particulas.emitir('coracao', meio.x, meio.y - 70, 2, { vel: 25, vida: 1.6 }); yield c.espera(0.4); }
      yield c.fala('Bell & Line', '♥');
      // Transição para a fazenda.
      yield c.fala('Narradora', 'E foi assim, entre um BK, uma máquina de soco “estragada” e um beijo no túnel, que a história delas começou.');
      yield c.escurecer(1, 1.6);
      c.fimDuo(); j.zoomAlvo = 1;
      document.getElementById('etiquetas').classList.add('oculto');
      yield c.fala('Narradora', 'O tempo passou... e o sonho das duas virou uma fazendinha, um cachorrinho chamado Theo e muitas manhãs juntas.');
      j.flags.encontroFeito = true;
      j.encontro = null;
      j.iniciarArea('fazenda', null, true);
      j.iniciarCapitulo();
    },
  };

  // Brilho rosa e escurecer, como a transição entre lugares do HTML.
  function transicao(c, j) {
    c.junto(c.tingir('247,178,200', 0.35, 0.8));
    return c.escurecer(1, 0.9);
  }

  Object.assign(LB.HISTORIA, HISTORIA);
  LB.encontro = { iniciar, prepararArea, desenharFundo, objetos, acoes, bloqueia, mostrarEtiquetas, K, DATA };
})(window.LB);
