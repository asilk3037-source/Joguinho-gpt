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
    shopping: { nome: 'Minas Shopping', lugar: 'Minas Shopping', fundo: 'encontro_shopping' },
    playground: { nome: 'Playground', lugar: 'Playground', fundo: null },
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

  // Playground desenhado igual ao HTML (fliperamas, balcão, piso xadrez), sem a máquina de soco antiga.
  function playground(g) {
    g.save(); g.scale(K, K); g.imageSmoothingEnabled = false;
    g.fillStyle = '#21182d'; g.fillRect(0, 0, 360, 640); g.fillStyle = '#553b62'; g.fillRect(0, 112, 360, 448);
    for (let y = 112; y < 560; y += 32) for (let x = 0; x < 360; x += 32) { g.fillStyle = ((x + y) / 32) % 2 ? '#4a3457' : '#573d64'; g.fillRect(x, y, 32, 32); }
    g.fillStyle = '#261c31'; g.fillRect(14, 130, 94, 122); g.fillRect(14, 278, 94, 116);
    g.fillStyle = '#df7197'; g.fillRect(24, 140, 74, 18); g.fillStyle = '#6ce0df'; g.fillRect(30, 170, 62, 48);
    g.fillStyle = '#75b9e7'; g.fillRect(24, 288, 74, 18); g.fillStyle = '#f09db7'; g.fillRect(30, 318, 62, 44);
    g.fillStyle = '#f5d06f'; g.fillRect(40, 224, 12, 18); g.fillRect(78, 224, 12, 18); g.fillRect(40, 368, 12, 18); g.fillRect(78, 368, 12, 18);
    g.fillStyle = '#6d4a79'; g.fillRect(120, 136, 102, 58); g.fillStyle = '#f4c3d4'; g.fillRect(130, 146, 82, 38);
    g.fillStyle = '#251b30'; g.fillRect(116, 458, 220, 66); g.fillStyle = '#805a76'; g.fillRect(126, 468, 200, 46);
    g.fillStyle = '#e7a7bf'; for (let x = 136; x < 320; x += 28) g.fillRect(x, 480, 14, 20);
    g.fillStyle = '#a36b8a'; g.fillRect(0, 112, 8, 448); g.fillRect(352, 112, 8, 448); g.fillRect(0, 552, 360, 8);
    g.restore();
  }

  // Fundo da área (antes do chão): ilustração do HTML + bordas borradas para telas largas.
  function desenharFundo(g, jogo, cx, cy) {
    const m = jogo.mapa, nome = m.def.fundo;
    g.fillStyle = '#1c1524'; g.fillRect(cx - 2, cy - 2, jogo.vw + 4, jogo.vh + 4);
    if (!nome) { playground(g); return; }
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
    if (nome === 'encontro_shopping') {
      const sh = g.createLinearGradient(0, 0, 0, H);
      sh.addColorStop(0, 'rgba(255,244,235,.05)'); sh.addColorStop(0.72, 'rgba(82,39,57,.04)'); sh.addColorStop(1, 'rgba(48,24,38,.14)');
      g.fillStyle = sh; g.fillRect(0, 0, W, H);
    } else {
      const gl = g.createRadialGradient(180 * K, 330 * K, 30 * K, 180 * K, 330 * K, 300 * K);
      gl.addColorStop(0, 'rgba(255,220,181,.04)'); gl.addColorStop(1, 'rgba(20,12,38,.18)');
      g.fillStyle = gl; g.fillRect(0, 0, W, H);
    }
  }

  // Máquina de soco: a mesma da animação LINE_PUNCH_MACHINE, no lugar onde a Line vai socar.
  const SOCO = P(204, 315);
  function objetos(jogo) {
    const e = jogo.encontro;
    if (jogo.mapa.id !== 'playground' || !e) return [];
    return [{ y: SOCO.y - 1, desenhar: (g) => desenharMaquina(g, jogo) }];
  }

  function desenharMaquina(g, jogo) {
    const e = jogo.encontro, s = LB.sprite('LINE_PUNCH_MACHINE'), img = LB.personagem('encontro_maquina');
    if (!s) return;
    const aj = s.ajuste || 1, esc = LB.ALTURA_LINE * (s.escala || 1) / s.cell * aj;
    // Enquanto a Line soca, a própria animação desenha a máquina.
    if (!e.socando && img) g.drawImage(img, SOCO.x - s.cell / 2 * esc, SOCO.y - s.ground * esc, s.cell * esc, s.cell * esc);
    // Placar em cima da máquina, como no HTML: 000 → 038.
    const px = SOCO.x + 17 * aj, py = SOCO.y - 70 * aj;
    g.fillStyle = '#18131f'; g.fillRect(px - 17, py - 9, 34, 14);
    g.fillStyle = '#df5c7e'; g.fillRect(px - 15, py - 7, 30, 10);
    g.fillStyle = '#ffd56d'; g.font = 'bold 9px monospace'; g.textAlign = 'center';
    g.fillText(e.placar || '000', px, py + 1);
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
      yield andarJuntas(c, line, bell, P(204, 315), P(150, 340));
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
      j.particulas.emitir('impacto', SOCO.x + 22, SOCO.y - 44, 1, { r: 4, vida: 0.25, vel: 0 });
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
