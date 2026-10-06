'use strict';

// HUD com as molduras da arte (UI_HUD_COMPONENTES 01 a 06): retrato da heroína, barras de vida e magia,
// contador de moedas com o item do atalho, minimapa com a névoa e o retrato da outra heroína.
// O painel de objetivo e o selo "!" da mochila usam as molduras pelo CSS (estilo.css).
// Medidas em unidades da tela (o jogo multiplica por `escala`); as posições de dentro de cada moldura
// (círculo do retrato, miolo das barras) foram medidas na arte e ficam em frações da imagem.
(function (LB) {
  const TAU = Math.PI * 2;
  const ARTE = {
    retrato: { src: 'assets/interface/hud_portrait_frame.webp', cx: 0.5, cy: 0.513, r: 0.33 },
    barra: { src: 'assets/interface/hud_status_bar_frame.webp', x0: 0.092, x1: 0.934, y0: 0.215, y1: 0.77 },
    contador: { src: 'assets/interface/hud_resource_counter_frame.webp', x0: 0.25, x1: 0.79, y0: 0.26, y1: 0.76, esq: { cx: 0.154, cy: 0.5, r: 0.058 }, dir: { cx: 0.861, cy: 0.5, r: 0.047 } },
    minimapa: { src: 'assets/interface/minimap_frame.webp', cx: 0.5, cy: 0.516, r: 0.33 },
  };
  for (const a of Object.values(ARTE)) { a.img = new Image(); a.img.src = a.src; }
  const pronta = (a) => a.img.complete && a.img.naturalWidth > 0;
  const retratos = {};
  function retrato(quem) {
    const r = window.RETRATOS && window.RETRATOS[quem];
    if (!r) return null;
    if (!retratos[quem]) { retratos[quem] = new Image(); retratos[quem].src = r.src; }
    const img = retratos[quem];
    return img.complete && img.naturalWidth ? { img, cell: img.naturalWidth / (r.colunas || 3) } : null;
  }

  function ativo(j) { return LB.herois && LB.herois.ativa ? LB.herois.ativa(j) : 'line'; }

  // ---------------- Peças ----------------
  function moldura(g, a, x, y, w) {
    const h = w * a.img.naturalHeight / a.img.naturalWidth;
    g.drawImage(a.img, x, y, w, h);
    return h;
  }

  // Retrato num círculo (a moldura por cima). `cinza` quando a heroína está caída.
  function desenharRetrato(g, quem, x, y, w, cinza) {
    const a = ARTE.retrato, h = w * a.img.naturalHeight / a.img.naturalWidth;
    const cx = x + a.cx * w, cy = y + a.cy * h, r = a.r * w;
    g.save();
    g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fillStyle = quem === 'bell' ? '#3a2433' : '#1f2433'; g.fill(); g.clip();
    const p = retrato(quem);
    if (p) {
      if (cinza) g.filter = 'grayscale(1) brightness(.7)';
      const lado = r * 2.25;
      g.imageSmoothingEnabled = true;
      g.drawImage(p.img, 0, 0, p.cell, p.cell, cx - lado / 2, cy - lado * 0.44, lado, lado);
    }
    g.restore();
    moldura(g, a, x, y, w);
    return h;
  }

  // Barra de status: `frac` cheio, cor e marcas de divisão (um coração = 2 de vida, um losango = 1 de magia).
  function desenharBarra(g, x, y, w, frac, cores, partes, piscar) {
    const a = ARTE.barra, h = w * a.img.naturalHeight / a.img.naturalWidth;
    const bx = x + a.x0 * w, by = y + a.y0 * h, bw = (a.x1 - a.x0) * w, bh = (a.y1 - a.y0) * h;
    g.fillStyle = piscar ? 'rgba(255,80,80,.55)' : '#15131b'; g.fillRect(bx, by, bw, bh);
    if (frac > 0) {
      const gr = g.createLinearGradient(0, by, 0, by + bh);
      gr.addColorStop(0, cores[0]); gr.addColorStop(0.55, cores[1]); gr.addColorStop(1, cores[2]);
      g.fillStyle = gr; g.fillRect(bx, by, bw * Math.min(1, frac), bh);
      g.fillStyle = 'rgba(255,255,255,.28)'; g.fillRect(bx, by + bh * 0.12, bw * Math.min(1, frac), Math.max(1, bh * 0.16));
    }
    if (partes > 1) {
      g.fillStyle = 'rgba(0,0,0,.45)';
      for (let i = 1; i < partes; i++) g.fillRect(bx + bw * i / partes - 0.5, by, 1, bh);
    }
    moldura(g, a, x, y, w);
    return h;
  }

  function desenharContador(g, j, x, y, w, s) {
    const a = ARTE.contador, h = w * a.img.naturalHeight / a.img.naturalWidth;
    g.fillStyle = '#15131b'; g.fillRect(x + a.x0 * w, y + a.y0 * h, (a.x1 - a.x0) * w, (a.y1 - a.y0) * h);
    moldura(g, a, x, y, w);
    const M = LB.mochila;
    // Moeda no círculo da esquerda e o total na barra.
    const ex = x + a.esq.cx * w, ey = y + a.esq.cy * h, er = a.esq.r * w;
    g.fillStyle = '#f2c14e'; g.beginPath(); g.arc(ex, ey, er * 0.78, 0, TAU); g.fill();
    g.fillStyle = '#b8862a'; g.beginPath(); g.arc(ex, ey, er * 0.48, 0, TAU); g.fill();
    g.fillStyle = '#ffe9c7'; g.font = `700 ${h * 0.4}px system-ui, sans-serif`; g.textAlign = 'left'; g.textBaseline = 'middle';
    g.fillText(String(M.moedas(j)), x + (a.x0 + 0.03) * w, y + h * 0.52);
    // Item do atalho no círculo da direita (ou a poção, se nada estiver equipado), com a quantidade.
    const i = M.inv(j), eq = i.equipado && M.qtd(j, i.equipado) ? i.equipado : M.qtd(j, 'pocao') ? 'pocao' : null;
    if (eq) {
      const dx = x + a.dir.cx * w, dy = y + a.dir.cy * h, dr = a.dir.r * w;
      g.font = `${dr * 1.5}px system-ui, sans-serif`; g.textAlign = 'center';
      g.fillText(M.ITENS[eq].icone, dx, dy + dr * 0.08);
      const n = String(M.qtd(j, eq));
      g.font = `700 ${h * 0.34}px system-ui, sans-serif`; g.textAlign = 'right';
      g.fillStyle = '#ffe9c7'; g.fillText(n, x + (a.x1 - 0.04) * w, y + h * 0.52);
    }
    g.textBaseline = 'alphabetic';
    return h;
  }

  // ---------------- Minimapa ----------------
  // A área (1 pixel por tile, com a névoa) vai para um canvas pequeno, refeito a cada meio segundo;
  // o minimapa mostra um recorte em volta da heroína dentro do círculo da moldura.
  const mini = { cv: document.createElement('canvas'), id: null, t: 0 };
  function atualizarMini(j) {
    const m = j.mapa, M = LB.mochila;
    if (mini.id === m.id && performance.now() - mini.t < 500) return;
    mini.id = m.id; mini.t = performance.now();
    const cv = mini.cv; cv.width = m.w; cv.height = m.h;
    const g = cv.getContext('2d'), gr = M.grade(j), img = g.createImageData(m.w, m.h), d = img.data;
    const cache = {};
    for (let ty = 0; ty < m.h; ty++) for (let tx = 0; tx < m.w; tx++) {
      const k = (ty * m.w + tx) * 4;
      if (gr && !M.visto(j, gr, tx, ty)) { d[k] = 24; d[k + 1] = 19; d[k + 2] = 32; d[k + 3] = 255; continue; }
      const c = m.l[ty][tx], cor = cache[c] || (cache[c] = hex(M.corTile(c, m.tema)));
      d[k] = cor[0]; d[k + 1] = cor[1]; d[k + 2] = cor[2]; d[k + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  }
  function hex(c) {
    if (!c || c[0] !== '#') return [90, 120, 80];
    const n = c.length === 4 ? c.slice(1).split('').map((v) => parseInt(v + v, 16)) : [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
    return n;
  }

  function desenharMinimapa(g, j, x, y, w) {
    const a = ARTE.minimapa, h = w * a.img.naturalHeight / a.img.naturalWidth;
    const cx = x + a.cx * w, cy = y + a.cy * h, r = a.r * w;
    atualizarMini(j);
    const TILE = LB.TILE, l = j.line, porTile = r * 2 / 26;
    g.save();
    g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fillStyle = '#18131f'; g.fill(); g.clip();
    g.imageSmoothingEnabled = false;
    g.drawImage(mini.cv, cx - (l.x / TILE) * porTile, cy - (l.y / TILE) * porTile, mini.cv.width * porTile, mini.cv.height * porTile);
    // Saídas conhecidas (verde) e a outra heroína (rosa).
    for (const sd of j.mapa.def.saidas || []) {
      const px = cx + (sd.x + sd.w / 2 - l.x / TILE) * porTile, py = cy + (sd.y + sd.h / 2 - l.y / TILE) * porTile;
      g.fillStyle = '#7dde92'; g.fillRect(px - porTile, py - porTile, porTile * 2, porTile * 2);
    }
    const c = j.companheira || j.bell;
    if (c && c.visivel !== false) { g.fillStyle = '#ff9ecf'; g.beginPath(); g.arc(cx + (c.x - l.x) / TILE * porTile, cy + (c.y - l.y) / TILE * porTile, porTile * 1.1, 0, TAU); g.fill(); }
    g.fillStyle = '#fff'; g.beginPath(); g.arc(cx, cy, porTile * 1.4, 0, TAU); g.fill();
    g.fillStyle = ativo(j) === 'bell' ? '#ff6fa8' : '#5aa9ff'; g.beginPath(); g.arc(cx, cy, porTile, 0, TAU); g.fill();
    g.restore();
    moldura(g, a, x, y, w);
    return h;
  }

  // ---------------- HUD inteiro ----------------
  const L = { retrato: 58, barra: 132, mana: 112, contador: 120, mini: 76, outra: 32 };

  function pronto() { return Object.values(ARTE).every(pronta); }

  // Altura (em unidades) ocupada pelo HUD da esquerda: o painel de objetivo começa logo abaixo.
  function fundo(j) {
    const yCont = j.flags.magia || ativo(j) === 'bell' ? 49 : 31;
    let y = Math.max(6 + L.retrato * 0.93, yCont + L.contador * 0.21);
    if (LB.herois && LB.herois.liberada(j)) y += L.outra + 4;
    return y;
  }

  function desenhar(g, j, s) {
    if (!pronto()) return false;
    const l = j.line, quem = ativo(j);
    g.save(); g.scale(s, s);
    desenharRetrato(g, quem, 6, 6, L.retrato);
    // Vida: uma marca por coração (2 de vida).
    desenharBarra(g, 60, 9, L.barra, l.hp / l.hpMax, ['#ff8a9b', '#e8344f', '#a61d36'], l.hpMax / 2, false);
    let yCont = 31;
    if (j.flags.magia || quem === 'bell') {
      const aviso = j.avisoMana > 0 && Math.floor(j.tempo * 12) % 2;
      desenharBarra(g, 60, 29, L.mana, l.mana / l.manaMax, ['#c6f0ff', '#58b7f0', '#2d6fb0'], l.manaMax, aviso);
      yCont = 49;
    }
    desenharContador(g, j, 60, yCont, L.contador, s);
    // A outra heroína: retrato pequeno (cinza se caída) e a vida dela.
    if (LB.herois && LB.herois.liberada(j)) {
      const outra = quem === 'bell' ? 'line' : 'bell', st = LB.herois.estado ? LB.herois.estado(j)[outra] : null;
      const hp = st ? st.hp : l.hpMax, y = fundo(j) - L.outra - 2;
      desenharRetrato(g, outra, 10, y, L.outra, hp <= 0);
      desenharBarra(g, 10 + L.outra + 2, y + L.outra * 0.3, 70, hp / l.hpMax, ['#ffb3c0', '#e86a83', '#a83a52'], l.hpMax / 2, false);
      if (!LB.entrada.usandoToque()) { g.fillStyle = 'rgba(255,233,199,.8)'; g.font = '700 8px system-ui, sans-serif'; g.textAlign = 'left'; g.fillText('T troca', 10 + L.outra + 76, y + L.outra * 0.47); }
    }
    // Minimapa no canto de cima, à direita (no celular, abaixo dos botões da mochila e da pausa).
    if (j.mapa && j.mapa.tema !== 'encontro') {
      const W = j.canvas.width / s, topo = LB.entrada.usandoToque() ? 56 : 8;
      const h = desenharMinimapa(g, j, W - L.mini - 8, topo, L.mini);
      posicionarAvisos(j, (topo + h + 6) * s);
    }
    g.restore();
    // Escudos da armadura: logo depois da barra de vida.
    LB.loja.desenharEscudos(g, j, s, (60 + L.barra + 10) * s, 19 * s);
    return true;
  }

  // Os avisos de item novo descem para baixo do minimapa.
  function posicionarAvisos(j, yCanvas) {
    const el = document.getElementById('avisos');
    if (!el) return;
    const topo = Math.round(yCanvas / j.dpr) + 'px';
    if (el.style.top !== topo) el.style.top = topo;
  }

  LB.hud = { desenhar, fundo, pronto, ARTE };
})(window.LB);
