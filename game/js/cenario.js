'use strict';

// Construções da fazenda, plantas que balançam com o vento e a vida ambiente
// (borboletas, pássaros, nuvens, folhas caindo, vaga-lumes, brasas).
(function (LB) {
  const TAU = Math.PI * 2;
  const E = (g, x, y, rx, ry, cor) => { g.fillStyle = cor; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, TAU); g.fill(); };

  // Vento suave: varia com o tempo e com a posição, como rajadas passando pelo mapa.
  function vento(t, x, y) {
    return Math.sin(t * 1.2 + x * 0.012 + y * 0.004) * 0.65 + Math.sin(t * 2.7 + y * 0.03 + x * 0.007) * 0.35;
  }

  // ---------- Plantas ----------
  function mato(g, p, t) {
    const w = vento(t, p.x, p.y);
    for (let i = 0; i < 7; i++) {
      const bx = p.x - 12 + ((p.v * 97 + i * 37) % 24), by = p.y + ((i * 13 + p.v * 50) % 8);
      const h = 9 + ((i * 7 + p.v * 30) % 6);
      g.strokeStyle = i % 2 ? '#3f7a31' : '#4f913d'; g.lineWidth = 1.8; g.lineCap = 'round';
      g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(bx + w * 2, by - h * 0.6, bx + w * 4 + (i % 3 - 1) * 2, by - h); g.stroke();
    }
  }

  const CORES_FLOR = ['#ff8fb1', '#ffe066', '#ffffff', '#c9a0ff', '#ff9f68'];
  function flores(g, p, t) {
    const w = vento(t, p.x, p.y);
    for (let i = 0; i < 5; i++) {
      const bx = p.x - 11 + ((p.v * 71 + i * 29) % 22), by = p.y + 6 + ((i * 11) % 7);
      const h = 7 + (i * 5 % 5);
      const fx = bx + w * 2.5, fy = by - h;
      g.strokeStyle = '#4a8a3a'; g.lineWidth = 1.2;
      g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(bx, by - h / 2, fx, fy); g.stroke();
      g.fillStyle = CORES_FLOR[Math.floor((p.v * 10 + i) % CORES_FLOR.length)];
      for (let k = 0; k < 5; k++) { const a = k * TAU / 5 + t * 0.2; g.beginPath(); g.arc(fx + Math.cos(a) * 2, fy + Math.sin(a) * 2, 1.6, 0, TAU); g.fill(); }
      g.fillStyle = '#f7c948'; g.beginPath(); g.arc(fx, fy, 1.2, 0, TAU); g.fill();
    }
  }

  function planta(g, p, t, estado) {
    const w = vento(t, p.x, p.y) * 1.5;
    const regada = estado && estado.regada;
    const tipo = (p.ty % 4 === 1 ? 'tomate_' : 'cenoura_'), max = tipo === 'tomate_' ? 5 : 3;
    const fase = regada ? max : Math.floor(p.v * (max - 1));
    if (objeto(g, tipo + fase, p.x, p.y + 10, 24, { inclina: w * 0.03 })) {
      if (estado && estado.marcar && !regada) {
        const b = Math.sin(t * 4 + p.x) * 2;
        g.fillStyle = '#5ab4ff'; g.beginPath(); g.moveTo(p.x, p.y - 30 + b); g.quadraticCurveTo(p.x + 6, p.y - 20 + b, p.x, p.y - 17 + b); g.quadraticCurveTo(p.x - 6, p.y - 20 + b, p.x, p.y - 30 + b); g.fill();
      }
      if (regada && Math.sin(t * 3 + p.x) > 0.95) { g.fillStyle = 'rgba(255,255,255,.8)'; LB.desenho.estrela(g, p.x + 8, p.y - 14, 3); }
      return;
    }
    if (regada) E(g, p.x, p.y + 4, 14, 5, 'rgba(60,40,25,.45)');
    const verde = regada ? '#3fa34d' : '#5a9a3c', verde2 = regada ? '#58c25f' : '#78b04a';
    for (let i = 0; i < 3; i++) {
      const bx = p.x - 9 + i * 9;
      for (let f = 0; f < 4; f++) {
        const a = -Math.PI / 2 + (f - 1.5) * 0.45;
        g.strokeStyle = f % 2 ? verde : verde2; g.lineWidth = 3; g.lineCap = 'round';
        g.beginPath(); g.moveTo(bx, p.y + 4); g.quadraticCurveTo(bx + Math.cos(a) * 5 + w, p.y - 2, bx + Math.cos(a) * 7 + w * 1.5, p.y + 4 + Math.sin(a) * 10); g.stroke();
      }
      if ((p.v * 10 + i) % 3 < 1) { g.fillStyle = '#f08a2c'; g.beginPath(); g.moveTo(bx - 2, p.y + 5); g.lineTo(bx + 2, p.y + 5); g.lineTo(bx, p.y + 11); g.fill(); }
    }
    if (estado && estado.marcar && !regada) {
      const b = Math.sin(t * 4 + p.x) * 2;
      g.fillStyle = '#5ab4ff'; g.beginPath(); g.moveTo(p.x, p.y - 26 + b); g.quadraticCurveTo(p.x + 6, p.y - 16 + b, p.x, p.y - 13 + b); g.quadraticCurveTo(p.x - 6, p.y - 16 + b, p.x, p.y - 26 + b); g.fill();
    }
    if (regada && Math.sin(t * 3 + p.x) > 0.95) { g.fillStyle = 'rgba(255,255,255,.8)'; LB.desenho.estrela(g, p.x + 8, p.y - 10, 3); }
  }

  // Árvores do tileset (pixel art), balançando: a copa inclina com o vento e o tronco fica firme.
  const ARVORES = {
    fazenda: ['arvore_a', 'arvore_b', 'arvore_c', 'arvore_d', 'arvore_a', 'arvore_c', 'macieira_a', 'macieira_b', 'macieira_c', 'cerejeira_a', 'cerejeira_b', 'florida'],
    floresta: ['pinheiro_a', 'pinheiro_b', 'pinheiro_c', 'arvore_a', 'arvore_b', 'arvore_d', 'pinheiro_a', 'pinheiro_b'],
  };
  const img = (n) => LB.personagem(n);

  // Desenha uma imagem do pacote com a base (pés) em (x, y) e largura `larg` no mundo.
  function objeto(g, nome, x, y, larg, o) {
    const im = img(nome);
    if (!im) return false;
    o = o || {};
    const W = larg, H = im.naturalHeight * larg / im.naturalWidth;
    g.save();
    g.translate(x, y);
    if (o.inclina) g.transform(1, 0, o.inclina, 1, 0, 0);
    if (o.flip) g.scale(-1, 1);
    g.drawImage(im, -W / 2, -H + (o.baixo || 0), W, H);
    g.restore();
    return true;
  }

  function arvoreImagem(g, p, tema, t) {
    const lista = ARVORES[tema] || ARVORES.fazenda;
    const nome = lista[Math.floor(p.v * 997) % lista.length];
    const img = LB.personagem(nome);
    if (!img) return false;
    const w = vento(t, p.x, p.y);
    const esc = (tema === 'floresta' ? 0.66 : 0.6) + (p.v * 7 % 1) * 0.1;
    const W = img.naturalWidth * esc, H = img.naturalHeight * esc;
    E(g, p.x, p.y, W * 0.32, 5, 'rgba(0,0,0,.28)');
    g.save();
    g.translate(p.x, p.y + 2);
    g.transform(1, 0, w * 0.045, 1, 0, 0);
    if (p.v > 0.5) g.scale(-1, 1);
    g.drawImage(img, -W / 2, -H, W, H);
    g.restore();
    return true;
  }

  function arvore(g, p, tema, t) {
    if (arvoreImagem(g, p, tema, t)) return;
    const escura = tema === 'floresta';
    const w = vento(t, p.x, p.y);
    const x = p.x, y = p.y, v = p.v;
    g.fillStyle = escura ? '#5a3b22' : '#6e4a2c'; g.fillRect(x - 5, y - 20, 10, 20);
    g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(x + 1, y - 20, 4, 20);
    E(g, x, y, 12, 4, 'rgba(0,0,0,.25)');
    const r = 21 + v * 6, dx = w * 2.2, dy = Math.abs(w) * 0.6;
    const c1 = escura ? '#2f6b2c' : '#3f8a35', c2 = escura ? '#3b7f35' : '#51a043', c3 = escura ? '#4d9443' : '#6bbd55';
    E(g, x + dx * 0.6, y - 34 + dy, r, r * 0.92, c1);
    E(g, x - 7 + dx, y - 40 + dy, r * 0.7, r * 0.62, c2);
    E(g, x - 9 + dx * 1.3, y - 46 + dy, r * 0.36, r * 0.3, c3);
    // Folhinhas que "piscam" com o vento.
    g.fillStyle = c3;
    for (let i = 0; i < 4; i++) {
      const a = v * 20 + i * 1.7, k = Math.sin(t * 3 + a) > 0.3;
      if (k) { g.beginPath(); g.ellipse(x + Math.cos(a) * r * 0.7 + dx, y - 36 + Math.sin(a) * r * 0.5, 3, 2, a, 0, TAU); g.fill(); }
    }
    if (v > 0.7) { g.fillStyle = '#e8434b'; g.beginPath(); g.arc(x + 8 + dx, y - 30, 2.5, 0, TAU); g.arc(x - 12 + dx, y - 26, 2.5, 0, TAU); g.fill(); }
  }

  // ---------- Construções ----------
  function casaFazenda(g, p, t) {
    const larg = p.w + 40;
    if (objeto(g, 'casa', p.x + p.w / 2, p.y + 6, larg)) {
      // Topo das duas chaminés, em pixels da imagem da casa.
      const im = img('casa'), esc = larg / im.naturalWidth, x0 = p.x + p.w / 2 - larg / 2, y0 = p.y + 6 - im.naturalHeight * esc;
      p.chamines = [[252, 2], [432, 60]].map(([cx, cy]) => ({ x: x0 + cx * esc, y: y0 + cy * esc }));
      p.chamine = p.chamines[0];
      return;
    }
    const x = p.x, y = p.y, w = p.w, h = p.h, topo = y - h;
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x + 6, y - 6, w, 10);
    // Paredes de tábuas.
    const paredeY = topo + h * 0.30;
    g.fillStyle = '#d9a86c'; g.fillRect(x + 6, paredeY, w - 12, y - paredeY);
    g.fillStyle = '#c4935a'; for (let yy = paredeY + 6; yy < y; yy += 9) g.fillRect(x + 6, yy, w - 12, 2);
    // Telhado.
    g.fillStyle = '#8c3b2e';
    g.beginPath(); g.moveTo(x - 6, paredeY + 8); g.lineTo(x + 20, topo - 18); g.lineTo(x + w - 20, topo - 18); g.lineTo(x + w + 6, paredeY + 8); g.closePath(); g.fill();
    g.fillStyle = '#a4493a'; for (let i = 1; i < 5; i++) { const yy = topo - 18 + i * ((paredeY + 8 - topo + 18) / 5); g.fillRect(x - 2 + i * 1.5, yy, w + 4 - i * 3, 2.5); }
    // Chaminé.
    g.fillStyle = '#7d6a60'; g.fillRect(x + w - 44, topo - 34, 14, 26); g.fillStyle = '#5f4f47'; g.fillRect(x + w - 46, topo - 36, 18, 5);
    p.chamine = { x: x + w - 37, y: topo - 38 };
    // Janelas com floreiras.
    for (const jx of [x + 22, x + w - 48]) {
      g.fillStyle = '#fff4d6'; g.fillRect(jx, paredeY + 16, 26, 22);
      g.fillStyle = '#8ecae6'; g.fillRect(jx + 3, paredeY + 19, 9, 16); g.fillRect(jx + 14, paredeY + 19, 9, 16);
      g.fillStyle = '#7b4a2a'; g.fillRect(jx - 2, paredeY + 38, 30, 6);
      for (let i = 0; i < 5; i++) { g.fillStyle = ['#ff6f9f', '#ffd166', '#ff9f68'][i % 3]; g.beginPath(); g.arc(jx + 2 + i * 6, paredeY + 37 + Math.sin(t * 2 + i) * 0.6, 2.4, 0, TAU); g.fill(); }
    }
    // Varanda.
    const vy = y - 16;
    g.fillStyle = '#b57f4a'; g.fillRect(x + 2, vy, w - 4, 16);
    g.fillStyle = '#9c6a3c'; for (let xx = x + 4; xx < x + w - 4; xx += 10) g.fillRect(xx, vy, 2, 16);
    g.fillStyle = '#6e4a2c'; for (const px of [x + 4, x + w - 10]) g.fillRect(px, paredeY + 44, 6, vy - paredeY - 44 + 2);
    g.fillStyle = '#8c3b2e'; g.fillRect(x, paredeY + 40, w, 7);
    // Porta.
    const pxp = p.porta - 13;
    g.fillStyle = '#6b3f22'; g.fillRect(pxp, paredeY + 50, 26, vy - paredeY - 50);
    g.fillStyle = '#e0b04a'; g.beginPath(); g.arc(pxp + 20, paredeY + 50 + (vy - paredeY - 50) / 2, 2, 0, TAU); g.fill();
    // Cadeira de balanço.
    const b = Math.sin(t * 1.5) * 1.5;
    g.strokeStyle = '#5a3a20'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(x + 18, vy + 4 + b); g.lineTo(x + 18, vy - 14 + b); g.moveTo(x + 18, vy + 4 + b); g.lineTo(x + 34, vy + 4 - b); g.stroke();
    g.beginPath(); g.arc(x + 26, vy + 10, 12, Math.PI * 1.15, Math.PI * 1.85, true); g.stroke();
  }

  function celeiro(g, p) {
    if (objeto(g, 'celeiro', p.x + p.w / 2, p.y + 4, p.w + 20)) return;
    const x = p.x, y = p.y, w = p.w, h = p.h, topo = y - h;
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x + 6, y - 6, w, 10);
    const paredeY = topo + h * 0.25;
    g.fillStyle = '#b8352c'; g.fillRect(x + 4, paredeY, w - 8, y - paredeY);
    g.fillStyle = '#a02d25'; for (let xx = x + 10; xx < x + w - 6; xx += 10) g.fillRect(xx, paredeY, 2, y - paredeY);
    g.fillStyle = '#5b5250';
    g.beginPath(); g.moveTo(x - 6, paredeY + 6); g.lineTo(x + w * 0.2, topo - 20); g.lineTo(x + w * 0.8, topo - 20); g.lineTo(x + w + 6, paredeY + 6); g.closePath(); g.fill();
    g.fillStyle = '#6e6461'; for (let i = 1; i < 4; i++) g.fillRect(x + i * 6, topo - 20 + i * 11, w - i * 12, 2);
    g.strokeStyle = '#f5ede0'; g.lineWidth = 4;
    g.strokeRect(x + 4, paredeY, w - 8, y - paredeY);
    // Portão com X.
    const dw = 56, dx = x + w / 2 - dw / 2, dy = y - 60;
    g.fillStyle = '#8e2a22'; g.fillRect(dx, dy, dw, 60);
    g.strokeStyle = '#f5ede0'; g.lineWidth = 3; g.strokeRect(dx, dy, dw, 60);
    g.beginPath(); g.moveTo(dx, dy); g.lineTo(dx + dw / 2, dy + 60); g.moveTo(dx + dw / 2, dy); g.lineTo(dx, dy + 60);
    g.moveTo(dx + dw / 2, dy); g.lineTo(dx + dw, dy + 60); g.moveTo(dx + dw, dy); g.lineTo(dx + dw / 2, dy + 60); g.moveTo(dx + dw / 2, dy); g.lineTo(dx + dw / 2, dy + 60); g.stroke();
    // Janela do feno.
    g.fillStyle = '#3a2418'; g.fillRect(x + w / 2 - 12, paredeY + 8, 24, 20);
    g.fillStyle = '#e8c65a'; g.fillRect(x + w / 2 - 10, paredeY + 20, 20, 8);
    g.strokeStyle = '#f5ede0'; g.lineWidth = 2; g.strokeRect(x + w / 2 - 12, paredeY + 8, 24, 20);
  }

  function galinheiro(g, p) {
    if (objeto(g, 'galinheiro', p.x + p.w / 2, p.y + 6, p.w + 18)) return;
    const x = p.x, y = p.y, w = p.w, h = p.h;
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x + 4, y - 4, w, 8);
    g.fillStyle = '#c99a62'; g.fillRect(x + 4, y - h + 12, w - 8, h - 12);
    g.fillStyle = '#b3854f'; for (let yy = y - h + 18; yy < y; yy += 8) g.fillRect(x + 4, yy, w - 8, 2);
    g.fillStyle = '#7a5a8a'; g.beginPath(); g.moveTo(x - 4, y - h + 16); g.lineTo(x + w / 2, y - h - 10); g.lineTo(x + w + 4, y - h + 16); g.closePath(); g.fill();
    g.fillStyle = '#3a2418'; g.beginPath(); g.arc(x + w / 2, y - 16, 9, Math.PI, 0); g.fillRect(x + w / 2 - 9, y - 16, 18, 16); g.fill();
    g.strokeStyle = '#8a6440'; g.lineWidth = 4; g.beginPath(); g.moveTo(x + w / 2, y); g.lineTo(x + w / 2 + 20, y + 14); g.stroke();
    g.fillStyle = '#fff'; g.font = 'bold 7px sans-serif'; g.textAlign = 'center'; g.fillText('♥', x + w / 2, y - h + 8);
  }

  function cerca(g, p) {
    const x = p.x, y = p.y;
    g.fillStyle = '#8b5e34'; g.fillRect(x - 3, y - 18, 6, 20);
    g.fillStyle = '#a8764a'; g.fillRect(x - 3, y - 18, 6, 3);
    g.fillStyle = '#a8764a';
    if (p.d) { g.fillRect(x, y - 14, 32, 3.5); g.fillRect(x, y - 6, 32, 3.5); }
    if (p.b) { g.fillStyle = '#9a6a3f'; g.fillRect(x - 1.5, y - 10, 3, 32); }
  }

  function poco(g, p, t) {
    if (objeto(g, 'poco', p.x, p.y + 4, 40)) return;
    const x = p.x, y = p.y;
    E(g, x, y + 2, 16, 6, 'rgba(0,0,0,.25)');
    g.fillStyle = '#8f8f97'; g.fillRect(x - 14, y - 14, 28, 14);
    g.fillStyle = '#a7a7af'; for (let i = 0; i < 4; i++) g.fillRect(x - 14 + i * 7, y - 14 + (i % 2) * 7, 6, 6);
    E(g, x, y - 14, 14, 5, '#3c4f63');
    g.fillStyle = '#6e4a2c'; g.fillRect(x - 14, y - 40, 3, 26); g.fillRect(x + 11, y - 40, 3, 26);
    g.fillStyle = '#8c3b2e'; g.beginPath(); g.moveTo(x - 18, y - 36); g.lineTo(x, y - 48); g.lineTo(x + 18, y - 36); g.closePath(); g.fill();
    const b = Math.sin(t * 2) * 1.5;
    g.strokeStyle = '#5a3a20'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y - 36); g.lineTo(x, y - 26 + b); g.stroke();
    g.fillStyle = '#8b5e34'; g.fillRect(x - 4, y - 26 + b, 8, 7);
  }

  function moinho(g, p, t) {
    if (objeto(g, 'moinho', p.x, p.y + 3, 54)) return;
    const x = p.x, y = p.y;
    E(g, x, y + 2, 16, 5, 'rgba(0,0,0,.25)');
    g.strokeStyle = '#8a8a92'; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(x - 12, y); g.lineTo(x - 3, y - 90); g.moveTo(x + 12, y); g.lineTo(x + 3, y - 90); g.stroke();
    g.lineWidth = 1.2;
    for (let i = 0; i < 6; i++) { const yy = y - i * 15, k = 12 - i * 1.5; g.beginPath(); g.moveTo(x - k, yy); g.lineTo(x + k - 1.5, yy - 15); g.moveTo(x + k, yy); g.lineTo(x - k + 1.5, yy - 15); g.stroke(); }
    const cx = x, cy = y - 94, a0 = t * 2.2;
    for (let i = 0; i < 12; i++) {
      const a = a0 + i * TAU / 12;
      g.fillStyle = i % 2 ? '#e8e2d6' : '#c94f3d';
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a - 0.12) * 24, cy + Math.sin(a - 0.12) * 24); g.lineTo(cx + Math.cos(a + 0.12) * 24, cy + Math.sin(a + 0.12) * 24); g.closePath(); g.fill();
    }
    E(g, cx, cy, 4, 4, '#555');
    g.fillStyle = '#c94f3d'; g.beginPath(); g.moveTo(cx + 4, cy); g.lineTo(cx + 22, cy - 6); g.lineTo(cx + 22, cy + 6); g.closePath(); g.fill();
  }

  function feno(g, p) {
    if (objeto(g, p.v > 0.5 ? 'feno_pilha' : 'feno', p.x, p.y + 4, p.v > 0.5 ? 40 : 30)) return;
    const x = p.x, y = p.y;
    E(g, x, y + 1, 16, 5, 'rgba(0,0,0,.25)');
    E(g, x, y - 12, 16, 14, '#e2bd55');
    g.strokeStyle = '#c79d3a'; g.lineWidth = 1.5;
    for (let i = -2; i <= 2; i++) { g.beginPath(); g.ellipse(x, y - 12, 16 - Math.abs(i) * 3, 14, 0, Math.PI * 0.1, Math.PI * 0.9); g.stroke(); }
    g.strokeStyle = '#f2d77a'; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(x - 12 + i * 5, y - 24 + (i % 2) * 3); g.lineTo(x - 10 + i * 5, y - 20); g.stroke(); }
  }

  function mesa(g, p, t, oculta) {
    if (oculta) return;
    const x = p.x + p.w / 2, y = p.y - 6;
    E(g, x, y + 4, 34, 8, 'rgba(0,0,0,.25)');
    g.fillStyle = '#8b5e34'; g.fillRect(x - 30, y - 6, 60, 5); g.fillRect(x - 30, y + 8, 60, 5);
    g.fillStyle = '#6e4a2c'; g.fillRect(x - 24, y - 18, 3, 14); g.fillRect(x + 21, y - 18, 3, 14);
    g.fillStyle = '#fff'; g.fillRect(x - 28, y - 26, 56, 12);
    g.fillStyle = '#e45b6e'; for (let i = 0; i < 7; i++) for (let j = 0; j < 2; j++) if ((i + j) % 2 === 0) g.fillRect(x - 28 + i * 8, y - 26 + j * 6, 8, 6);
    g.fillStyle = '#c49a5c'; g.fillRect(x + 8, y - 36, 14, 10); g.strokeStyle = '#8b5e34'; g.lineWidth = 2; g.beginPath(); g.arc(x + 15, y - 36, 6, Math.PI, 0); g.stroke();
    g.fillStyle = '#e8434b'; g.beginPath(); g.arc(x - 10, y - 29, 3, 0, TAU); g.arc(x - 4, y - 29, 3, 0, TAU); g.fill();
  }

  function casinha(g, p) {
    const x = p.x, y = p.y;
    E(g, x, y + 1, 16, 5, 'rgba(0,0,0,.25)');
    g.fillStyle = '#e8c9a0'; g.fillRect(x - 13, y - 22, 26, 22);
    g.fillStyle = '#c0392b'; g.beginPath(); g.moveTo(x - 17, y - 20); g.lineTo(x, y - 36); g.lineTo(x + 17, y - 20); g.closePath(); g.fill();
    g.fillStyle = '#3a2418'; g.beginPath(); g.arc(x, y - 8, 7, Math.PI, 0); g.fillRect(x - 7, y - 8, 14, 8); g.fill();
    g.fillStyle = '#5a3a20'; g.font = 'bold 6px sans-serif'; g.textAlign = 'center'; g.fillText('THEO', x, y - 17);
  }

  function varal(g, p, t) {
    const x1 = p.x, x2 = p.x2, y = p.y;
    for (const x of [x1, x2]) { g.fillStyle = '#6e4a2c'; g.fillRect(x - 2, y - 40, 4, 40); E(g, x, y, 5, 2, 'rgba(0,0,0,.2)'); }
    g.strokeStyle = '#ddd'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(x1, y - 38); g.quadraticCurveTo((x1 + x2) / 2, y - 30, x2, y - 38); g.stroke();
    const roupas = [['#6fa8dc', 16, 14], ['#ffffff', 14, 18], ['#f4a6c0', 18, 16], ['#222', 14, 20]];
    roupas.forEach(([cor, w, h], i) => {
      const k = (i + 1) / (roupas.length + 1), rx = x1 + (x2 - x1) * k, ry = y - 38 + Math.sin(k * Math.PI) * 8;
      const bal = vento(t, rx, y) * 3;
      g.fillStyle = cor;
      g.beginPath(); g.moveTo(rx - w / 2, ry); g.lineTo(rx + w / 2, ry); g.lineTo(rx + w / 2 + bal, ry + h); g.lineTo(rx - w / 2 + bal, ry + h); g.closePath(); g.fill();
      g.fillStyle = '#b9b9b9'; g.fillRect(rx - w / 2 + 2, ry - 2, 2, 4); g.fillRect(rx + w / 2 - 4, ry - 2, 2, 4);
    });
  }

  // ---------- Vida ambiente ----------
  // Temas sem céu aberto (sem nuvens nem pássaros).
  const SEM_CEU = ['covil', 'montanha', 'encontro', 'gruta', 'fenda', 'coracao'];
  class Ambiente {
    constructor(mapa) {
      this.mapa = mapa;
      this.tema = mapa.tema;
      this.borboletas = [];
      this.passaros = [];
      this.nuvens = [];
      this.luzes = [];
      this.t = 0;
      const n = this.tema === 'fazenda' ? 12 : this.tema === 'floresta' ? 5 : this.tema === 'ruinas' ? 3 : 0;
      for (let i = 0; i < n; i++) this.borboletas.push(this.novaBorboleta());
      if (!SEM_CEU.includes(this.tema)) for (let i = 0; i < 5; i++) this.nuvens.push({ x: Math.random() * mapa.larg, y: Math.random() * mapa.alt, r: 90 + Math.random() * 90, v: 12 + Math.random() * 10 });
      const nl = { floresta: 26, ruinas: 22, gruta: 34, pantano: 30, coracao: 24 }[this.tema] || 0;
      // Chuva: forte no Olho da Tempestade, garoa no pântano.
      this.chuva = this.tema === 'tempestade' ? 1 : this.tema === 'pantano' ? 0.35 : 0;
      this.proximoRaio = 4 + Math.random() * 5;
      for (let i = 0; i < nl; i++) this.luzes.push({ x: Math.random() * mapa.larg, y: Math.random() * mapa.alt, f: Math.random() * TAU, z: 10 + Math.random() * 30 });
      this.proximoBando = 3;
    }

    novaBorboleta() {
      const flores = this.mapa.props.filter((p) => p.tipo === 'flores');
      const base = flores.length ? flores[Math.floor(Math.random() * flores.length)] : { x: Math.random() * this.mapa.larg, y: Math.random() * this.mapa.alt };
      const cores = ['#ffd166', '#ff8fb1', '#9ad0ff', '#ffffff', '#c9a0ff', '#ff9f68'];
      return { x: base.x, y: base.y, z: 14, alvo: null, cor: cores[Math.floor(Math.random() * cores.length)], f: Math.random() * TAU, v: 26 + Math.random() * 16 };
    }

    // Ativa os vaga-lumes (entardecer na fazenda / epílogo).
    anoitecer() {
      if (this.luzes.length) return;
      for (let i = 0; i < 30; i++) this.luzes.push({ x: Math.random() * this.mapa.larg, y: Math.random() * this.mapa.alt, f: Math.random() * TAU, z: 8 + Math.random() * 30 });
    }

    atualizar(dt, jogo) {
      this.t += dt;
      const m = this.mapa, l = jogo.line;
      for (const b of this.borboletas) {
        b.f += dt * 18;
        if (!b.alvo || Math.hypot(b.alvo.x - b.x, b.alvo.y - b.y) < 6) b.alvo = { x: b.x + (Math.random() - 0.5) * 140, y: b.y + (Math.random() - 0.5) * 90 };
        if (l && Math.hypot(l.x - b.x, l.y - b.y) < 40) b.alvo = { x: b.x + (b.x - l.x) * 2, y: b.y + (b.y - l.y) * 2 };
        const dx = b.alvo.x - b.x, dy = b.alvo.y - b.y, d = Math.hypot(dx, dy) || 1;
        b.x += dx / d * b.v * dt + Math.sin(b.f * 0.3) * 0.3; b.y += dy / d * b.v * dt;
        b.z = 16 + Math.sin(b.f * 0.25) * 6;
        b.x = Math.max(40, Math.min(m.larg - 40, b.x)); b.y = Math.max(40, Math.min(m.alt - 40, b.y));
      }
      for (const n of this.nuvens) { n.x += n.v * dt; if (n.x - n.r > m.larg) { n.x = -n.r; n.y = Math.random() * m.alt; } }
      for (const f of this.luzes) { f.f += dt; f.x += Math.sin(f.f * 0.7) * 10 * dt; f.y += Math.cos(f.f * 0.5) * 8 * dt; }
      // Bando de pássaros atravessando o céu de vez em quando.
      if (!SEM_CEU.includes(this.tema) && this.tema !== 'tempestade') {
        this.proximoBando -= dt;
        if (this.proximoBando <= 0) {
          this.proximoBando = 9 + Math.random() * 10;
          const y = (jogo.cam.y || 0) + Math.random() * jogo.vh, esq = Math.random() < 0.5;
          const x0 = esq ? jogo.cam.x - 60 : jogo.cam.x + jogo.vw + 60;
          const n = 3 + Math.floor(Math.random() * 4);
          for (let i = 0; i < n; i++) this.passaros.push({ x: x0 - (esq ? 1 : -1) * i * 18, y: y + (i % 2 ? 10 : -10) * Math.ceil(i / 2), z: 90 + Math.random() * 20, vx: esq ? 70 : -70, f: Math.random() * TAU, vida: 0 });
        }
        for (const p of this.passaros) { p.x += p.vx * dt; p.f += dt * 10; p.vida += dt; }
        this.passaros = this.passaros.filter((p) => p.vida < 30);
      }
      // Folhas caindo das árvores visíveis.
      if (this.tema !== 'covil' && this.tema !== 'gruta' && Math.random() < dt * (this.tema === 'floresta' ? 4 : 2.2)) {
        const vis = m.props.filter((p) => p.tipo === 'arvore' && p.x > jogo.cam.x && p.x < jogo.cam.x + jogo.vw && p.y > jogo.cam.y && p.y < jogo.cam.y + jogo.vh + 60);
        if (vis.length) {
          const a = vis[Math.floor(Math.random() * vis.length)];
          const cor = this.tema === 'floresta' ? ['#3b7f35', '#7a8c2e', '#b0772f'] : ['#51a043', '#9ccc5a', '#e3a33c'];
          jogo.particulas.emitir('folhaCai', a.x + (Math.random() - 0.5) * 30, a.y + 6, 1, { z: 30 + Math.random() * 16, vz: -14, vel: 10, vida: 4, cor: cor[Math.floor(Math.random() * cor.length)] });
        }
      }
      // Brasas subindo da lava.
      // Raios no Olho da Tempestade.
      if (this.tema === 'tempestade' && !jogo.cena) {
        this.proximoRaio -= dt;
        if (this.proximoRaio <= 0) { this.proximoRaio = 5 + Math.random() * 6; jogo.flashTela = Math.max(jogo.flashTela, 0.35); jogo.tremer(2, 0.3); }
      }
      if ((this.tema === 'covil' || this.tema === 'montanha' || this.tema === 'fenda') && Math.random() < dt * 8) {
        const lavas = [];
        for (let ty = 0; ty < m.h; ty++) for (let tx = 0; tx < m.w; tx++) if (m.l[ty][tx] === 'L') lavas.push([tx, ty]);
        if (lavas.length) { const [tx, ty] = lavas[Math.floor(Math.random() * lavas.length)]; jogo.particulas.emitir('brasa', (tx + Math.random()) * LB.TILE, (ty + Math.random()) * LB.TILE, 1, { vz: 30, vel: 8, vida: 2.4, r: 1.6 }); }
      }
      // Fumaça da chaminé.
      const casa = m.props.find((p) => p.tipo === 'casaFazenda' && p.chamine);
      if (casa) for (const ch of casa.chamines || [casa.chamine]) {
        if (Math.random() < dt * 4) jogo.particulas.emitir('fumaca', ch.x + (Math.random() - 0.5) * 4, ch.y + 60, 1, { z: 60, vz: 18, vel: 6, vida: 2.6, r: 4 });
      }
    }

    // Sombras das nuvens (por baixo dos personagens).
    desenharChao(g) {
      for (const n of this.nuvens) {
        const gr = g.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        gr.addColorStop(0, 'rgba(20,30,40,.12)'); gr.addColorStop(1, 'rgba(20,30,40,0)');
        g.fillStyle = gr; g.beginPath(); g.ellipse(n.x, n.y, n.r, n.r * 0.6, 0, 0, TAU); g.fill();
      }
      for (const p of this.passaros) E(g, p.x, p.y + 60, 4, 1.5, 'rgba(0,0,0,.12)');
    }

    // Chuva inclinada só na parte visível da tela (coordenadas do mundo).
    desenharChuva(g, jogo) {
      const n = Math.round(90 * this.chuva), x0 = jogo.cam.x, y0 = jogo.cam.y, w = jogo.vw, h = jogo.vh;
      g.strokeStyle = this.tema === 'pantano' ? 'rgba(200,230,210,.35)' : 'rgba(190,210,255,.45)'; g.lineWidth = 1;
      g.beginPath();
      for (let i = 0; i < n; i++) {
        const k = (i * 0.618 + this.t * (1.4 + (i % 5) * 0.12)) % 1;
        const x = x0 + ((i * 97.3) % w) - k * 40, y = y0 + k * (h + 40) - 20;
        g.moveTo(x, y); g.lineTo(x - 5, y + 14);
      }
      g.stroke();
    }

    // Borboletas, pássaros e vaga-lumes (por cima de tudo).
    desenharCeu(g, jogo) {
      if (this.chuva && jogo) this.desenharChuva(g, jogo);
      for (const b of this.borboletas) {
        const a = Math.abs(Math.sin(b.f)) * 4 + 1, x = b.x, y = b.y - b.z;
        E(g, x, b.y, 2.5, 1, 'rgba(0,0,0,.12)');
        g.fillStyle = b.cor;
        g.beginPath(); g.ellipse(x - a / 2 - 1, y, a, 3, -0.3, 0, TAU); g.ellipse(x + a / 2 + 1, y, a, 3, 0.3, 0, TAU); g.fill();
        g.fillStyle = '#333'; g.fillRect(x - 0.5, y - 2, 1, 4);
      }
      for (const p of this.passaros) {
        const x = p.x, y = p.y - p.z, a = Math.sin(p.f) * 4;
        g.strokeStyle = '#3a3340'; g.lineWidth = 1.6; g.lineCap = 'round';
        g.beginPath(); g.moveTo(x - 6, y - a); g.quadraticCurveTo(x - 3, y - 2, x, y); g.quadraticCurveTo(x + 3, y - 2, x + 6, y - a); g.stroke();
      }
      for (const f of this.luzes) {
        const a = 0.3 + 0.7 * Math.max(0, Math.sin(f.f * 2.3));
        const x = f.x, y = f.y - f.z;
        const gr = g.createRadialGradient(x, y, 0, x, y, 8);
        const cor = { gruta: '140,220,255', pantano: '170,255,120', coracao: '220,160,255' }[this.tema] || '230,255,140';
        gr.addColorStop(0, `rgba(${cor},${a})`); gr.addColorStop(1, `rgba(${cor},0)`);
        g.fillStyle = gr; g.beginPath(); g.arc(x, y, 8, 0, TAU); g.fill();
      }
    }
  }

  // Objetos soltos do pacote (carroça, lampião, píer, barco...).
  function decoracao(g, p, t) {
    const o = { inclina: p.balanca ? vento(t, p.x, p.y) * 0.02 : 0, flip: p.flip };
    if (p.nome === 'lampiao') {
      objeto(g, 'lampiao', p.x, p.y, p.larg, o);
      const lx = p.x + (p.flip ? -1 : 1) * p.larg * 0.18, ly = p.y - p.larg * 0.95, k = 0.55 + 0.1 * Math.sin(t * 7);
      const gr = g.createRadialGradient(lx, ly, 0, lx, ly, 26); gr.addColorStop(0, `rgba(255,210,120,${k})`); gr.addColorStop(1, 'rgba(255,210,120,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(lx, ly, 26, 0, TAU); g.fill();
      return;
    }
    if (p.nome === 'barco') { objeto(g, 'barco', p.x, p.y + Math.sin(t * 1.6) * 1.2, p.larg, o); return; }
    objeto(g, p.nome, p.x, p.y, p.larg, o);
  }

  LB.cenario = { decoracao, objeto, vento, mato, flores, planta, arvore, casaFazenda, celeiro, galinheiro, cerca, poco, moinho, feno, mesa, casinha, varal, Ambiente };
})(window.LB);
