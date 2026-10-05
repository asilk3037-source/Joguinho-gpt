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
    const ini = id === 'shopping' ? P(48, 520) : id === 'playground' ? P(42, 520) : P(25, 520);
    LB.MAPAS[id] = Object.assign({ tema: 'encontro', linhas: LINHAS, saidas: [], placas: {}, limites: LIMITES, semBanner: true, inicio: { x: ini.x / TILE, y: ini.y / TILE, dir: 'BACK' } }, m);
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
  // O shopping também é montado assim (base do item 218: chão e teto; mezanino, escada rolante animada
  // e pilares dos itens 230 e 231); as lojas, mesas e plantas entram quando chegarem.
  const PECAS = {
    playground: [
      { nome: 'playground_painel_premios', x: 180, base: 122, parede: true },
      { nome: 'playground_fliperama_rosa', x: 62, base: 235, flip: true },
      { nome: 'playground_balcao_premios', x: 268, base: 228 },
      { nome: 'playground_fliperama_azul', x: 66, base: 398 },
      { nome: 'playground_maquina_soco', x: 231, base: 438, frente: 14 },
    ],
    shopping: [
      { nome: 'shop_mezanino', x: 30, base: 104, parede: true },
      { nome: 'shop_mezanino', x: 180, base: 104, parede: true },
      { nome: 'shop_mezanino', x: 330, base: 104, parede: true },
      { nome: 'shop_escada_rolante', x: 300, base: 196, quadros: 4 },
      { nome: 'shop_pilar', x: 22, base: 330 },
      { nome: 'shop_pilar', x: 338, base: 330 },
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
    return pecas.map((p) => ({
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
      const b = P(274, 300);
      jogo.bell = new LB.Bell(b.x, b.y, 'LEFT'); jogo.bell.lado = -1; jogo.bell.anim.tocar('BELL_WAIT', true);
      jogo.line.dir = 'BACK';
    }
    e.placar = '000'; e.socando = false;
    mostrarEtiquetas(jogo);
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
      // Vão até a mesa.
      yield andarJuntas(c, line, bell, P(142, 397), P(218, 397));
      yield c.quando(() => !bell.alvoCena);
      line.dir = 'BACK'; bell.dir = 'BACK';
      const mesa = P(180, 397);
      j.camAlvo = { x: mesa.x, y: mesa.y - 40 }; j.zoomAlvo = 1.6;
      c.duo('LINE_BELL_BK', mesa.x, mesa.y);
      yield c.espera(1.2);
      yield c.fala('Bell', 'você parece estar tímida', 'neutro');
      yield c.fala('Line', 'é que você é muito linda', 'apaixonada');
      yield c.fala('Bell', '', 'apaixonada');
      c.fimDuo(); c.duo('LINE_BELL_MEET', mesa.x, mesa.y);
      yield c.fala('Narradora', 'As duas sorriem. Bell segura a mão da Line e elas saem juntas do shopping.');
      c.fimDuo(); j.zoomAlvo = 1;
      document.getElementById('etiquetas').classList.add('oculto');
      // Saem de mãos dadas.
      const par = { x: mesa.x, y: mesa.y };
      c.duo('LINE_BELL_WALK_HANDS', par.x, par.y, 'RIGHT');
      const duo = j.duo, saida = P(280, 500);
      j.camAlvo = null;
      c.junto(c.tween(duo, 'x', saida.x, 2.4));
      yield c.tween(duo, 'y', saida.y, 2.4);
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
