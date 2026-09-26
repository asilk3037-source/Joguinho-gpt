'use strict';

// Desenhos provisórios feitos no código. Cada um é trocado automaticamente pela arte
// definitiva assim que a animação correspondente aparecer em assets/sprites.js.
(function (LB) {
  const TAU = Math.PI * 2;

  function elipse(g, x, y, rx, ry, cor) {
    g.fillStyle = cor; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, TAU); g.fill();
  }

  function sombraChao(g, x, y, r, a) {
    elipse(g, x, y, r, r * 0.38, `rgba(0,0,0,${a == null ? 0.28 : a})`);
  }

  // ---------- Cenário ----------
  function arvore(g, p, tema) {
    const escura = tema === 'floresta';
    const x = p.x, y = p.y, v = p.v;
    const tronco = escura ? '#5a3b22' : '#6e4a2c';
    g.fillStyle = tronco; g.fillRect(x - 5, y - 20, 10, 20);
    elipse(g, x, y, 12, 4, 'rgba(0,0,0,.25)');
    const r = 21 + v * 6;
    const c1 = escura ? '#2f6b2c' : '#3f8a35', c2 = escura ? '#3b7f35' : '#51a043', c3 = escura ? '#4d9443' : '#6bbd55';
    elipse(g, x, y - 34, r, r * 0.92, c1);
    elipse(g, x - 7, y - 40, r * 0.7, r * 0.62, c2);
    elipse(g, x - 9, y - 46, r * 0.36, r * 0.3, c3);
    if (v > 0.7) { g.fillStyle = '#e8434b'; g.beginPath(); g.arc(x + 8, y - 30, 2.5, 0, TAU); g.arc(x - 12, y - 26, 2.5, 0, TAU); g.fill(); }
  }

  function pedra(g, p) {
    elipse(g, p.x, p.y + 2, 14, 5, 'rgba(0,0,0,.25)');
    g.fillStyle = '#8d8d95';
    g.beginPath(); g.moveTo(p.x - 14, p.y); g.quadraticCurveTo(p.x - 12, p.y - 20, p.x, p.y - 21); g.quadraticCurveTo(p.x + 14, p.y - 18, p.x + 14, p.y); g.closePath(); g.fill();
    g.fillStyle = '#a9a9b2'; g.beginPath(); g.ellipse(p.x - 4, p.y - 14, 6, 4, -0.4, 0, TAU); g.fill();
  }

  function estalagmite(g, p) {
    elipse(g, p.x, p.y + 2, 13, 5, 'rgba(0,0,0,.35)');
    g.fillStyle = '#5d4a42';
    g.beginPath(); g.moveTo(p.x - 13, p.y); g.lineTo(p.x - 2, p.y - 46); g.lineTo(p.x + 3, p.y - 40); g.lineTo(p.x + 13, p.y); g.closePath(); g.fill();
    g.fillStyle = '#76625a'; g.beginPath(); g.moveTo(p.x - 6, p.y - 4); g.lineTo(p.x - 2, p.y - 40); g.lineTo(p.x, p.y - 4); g.fill();
  }

  function espinheiro(g, p, t) {
    const x = p.x, y = p.y;
    elipse(g, x, y, 17, 5, 'rgba(0,0,0,.3)');
    g.strokeStyle = '#2d3b1f'; g.lineWidth = 3; g.lineCap = 'round';
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i - 2) * 0.45 + Math.sin(t * 1.5 + p.v * 9 + i) * 0.04;
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * 14, y - 16, x + Math.cos(a) * 20, y + Math.sin(a) * 30); g.stroke();
    }
    g.fillStyle = '#9b4fb0';
    for (let i = 0; i < 7; i++) { const a = i * 0.9 + p.v * 5; g.beginPath(); g.arc(x + Math.cos(a) * 13, y - 14 + Math.sin(a) * 9, 2, 0, TAU); g.fill(); }
  }

  function casa(g, p) {
    const x = p.x, y = p.y, w = p.w, h = p.h;
    const topo = y - h;
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x + 4, y - 4, w, 8);
    g.fillStyle = '#e9d8b4'; g.fillRect(x + 4, topo + h * 0.42, w - 8, h * 0.58);
    g.fillStyle = '#d4bf95'; for (let i = 0; i < 4; i++) g.fillRect(x + 4, topo + h * 0.42 + i * 16, w - 8, 2);
    g.fillStyle = '#b5523b';
    g.beginPath(); g.moveTo(x - 6, topo + h * 0.48); g.lineTo(x + w / 2, topo - 18); g.lineTo(x + w + 6, topo + h * 0.48); g.closePath(); g.fill();
    g.fillStyle = '#9a4230'; for (let i = 1; i < 5; i++) { g.fillRect(x + 2, topo + h * 0.48 - i * 13, w - 4, 2); }
    g.fillStyle = '#7b4a2a'; g.fillRect(x + 2 * 32 - 14 + 4 - 4, y - 42, 28, 42);
    g.fillStyle = '#e0b04a'; g.beginPath(); g.arc(x + 2 * 32 + 6 - 4, y - 20, 2, 0, TAU); g.fill();
    g.fillStyle = '#8ecae6'; g.fillRect(x + 18, y - 64, 22, 18); g.fillRect(x + w - 42, y - 64, 22, 18);
    g.strokeStyle = '#7b4a2a'; g.lineWidth = 2; g.strokeRect(x + 18, y - 64, 22, 18); g.strokeRect(x + w - 42, y - 64, 22, 18);
  }

  function bau(g, x, y, aberto, t) {
    elipse(g, x, y + 1, 15, 5, 'rgba(0,0,0,.3)');
    g.fillStyle = '#8a5a2b'; g.fillRect(x - 14, y - 16, 28, 16);
    g.fillStyle = '#d4a93a'; g.fillRect(x - 14, y - 11, 28, 3); g.fillRect(x - 2, y - 13, 4, 7);
    if (aberto) {
      g.fillStyle = '#6d4520'; g.fillRect(x - 14, y - 26, 28, 10);
    } else {
      g.fillStyle = '#9c6a35'; g.beginPath(); g.moveTo(x - 14, y - 16); g.quadraticCurveTo(x, y - 30, x + 14, y - 16); g.fill();
      const brilho = 0.4 + 0.4 * Math.sin(t * 4);
      g.fillStyle = `rgba(255,230,120,${brilho})`; g.beginPath(); g.arc(x + 10, y - 22, 2.5, 0, TAU); g.fill();
    }
  }

  function placa(g, x, y) {
    elipse(g, x, y + 1, 10, 4, 'rgba(0,0,0,.25)');
    g.fillStyle = '#6e4a2c'; g.fillRect(x - 2, y - 16, 4, 16);
    g.fillStyle = '#a8784a'; g.fillRect(x - 13, y - 30, 26, 16);
    g.fillStyle = '#6e4a2c'; for (let i = 0; i < 3; i++) g.fillRect(x - 9, y - 26 + i * 4, 18 - i * 4, 1.5);
  }

  function jaula(g, x, y, aberta, t) {
    elipse(g, x, y + 2, 30, 8, 'rgba(0,0,0,.35)');
    g.strokeStyle = '#8f8f99'; g.lineWidth = 3;
    const w = 50, h = 74;
    if (!aberta) {
      for (let i = 0; i <= 6; i++) { const bx = x - w / 2 + i * (w / 6); g.beginPath(); g.moveTo(bx, y); g.lineTo(bx, y - h); g.stroke(); }
    } else {
      for (let i = 0; i <= 6; i++) { if (i > 1 && i < 5) continue; const bx = x - w / 2 + i * (w / 6); g.beginPath(); g.moveTo(bx, y); g.lineTo(bx + (i < 3 ? -6 : 6), y - h); g.stroke(); }
    }
    g.lineWidth = 4; g.strokeStyle = '#6b6b75';
    g.beginPath(); g.ellipse(x, y - h, w / 2, 7, 0, 0, TAU); g.stroke();
    g.beginPath(); g.ellipse(x, y, w / 2, 7, 0, 0, Math.PI); g.stroke();
    g.beginPath(); g.moveTo(x, y - h - 7); g.lineTo(x, y - h - 60); g.stroke();
  }

  function coracaoForma(g, x, y, s, cor) {
    g.fillStyle = cor;
    g.beginPath();
    g.moveTo(x, y + s * 0.35);
    g.bezierCurveTo(x - s, y - s * 0.3, x - s * 0.45, y - s, x, y - s * 0.45);
    g.bezierCurveTo(x + s * 0.45, y - s, x + s, y - s * 0.3, x, y + s * 0.35);
    g.fill();
  }

  // ---------- Bell (provisória) ----------
  // e: { base, progresso, t, dir, lado }
  function bell(g, x, y, e) {
    const b = e.base || 'BELL_IDLE';
    const t = e.t || 0;
    const dir = e.dir || 'FRONT';
    const andando = /WALK|FLEE|ESCAPE/.test(b), correndo = /RUN/.test(b);
    const assustada = /SCARED|CALL_LINE|TRAPPED|ESCAPE/.test(b);
    const feliz = /HAPPY|RELIEVED|CELEBRATE|LAUGH/.test(b);
    const chorando = /CRY/.test(b);
    const carregada = /CARRIED|CAPTURED/.test(b);
    const vel = correndo ? 14 : 9;
    const passo = (andando || correndo) ? Math.sin(t * vel) : 0;
    let bob = (andando || correndo) ? Math.abs(Math.sin(t * vel)) * 2.5 : Math.sin(t * 2) * 0.8;
    if (feliz) bob = Math.abs(Math.sin(t * 6)) * 4;
    const tremor = assustada ? Math.sin(t * 40) * 0.9 : 0;
    const X = x + tremor, Y = y - bob;
    const lado = dir === 'LEFT' ? -1 : dir === 'RIGHT' ? 1 : 0;

    const pele = '#f3c9a5', cabelo = '#c1622f', cabelo2 = '#a44f22', vestido = '#f4c542', vestido2 = '#dba92a';

    // Pernas
    g.fillStyle = '#f3c9a5';
    if (carregada) {
      g.fillRect(X - 6, Y - 14 + Math.sin(t * 8) * 3, 4, 14); g.fillRect(X + 2, Y - 14 - Math.sin(t * 8) * 3, 4, 14);
    } else {
      g.fillRect(X - 6 + passo * 3, Y - 16, 4, 14); g.fillRect(X + 2 - passo * 3, Y - 16, 4, 14);
    }
    g.fillStyle = '#7a3b8f';
    g.fillRect(X - 7 + (carregada ? 0 : passo * 3), Y - 3, 6, 3); g.fillRect(X + 1 - (carregada ? 0 : passo * 3), Y - 3, 6, 3);

    // Cabelo de trás
    if (dir !== 'FRONT' || true) { g.fillStyle = cabelo2; g.beginPath(); g.ellipse(X, Y - 36, 15, 20, 0, 0, TAU); g.fill(); }

    // Vestido
    g.fillStyle = vestido;
    g.beginPath(); g.moveTo(X - 8, Y - 34); g.lineTo(X + 8, Y - 34); g.lineTo(X + 13, Y - 14); g.lineTo(X - 13, Y - 14); g.closePath(); g.fill();
    g.fillStyle = vestido2; g.fillRect(X - 13, Y - 17, 26, 3);

    // Braços
    g.strokeStyle = pele; g.lineWidth = 3.5; g.lineCap = 'round';
    const braco = (sx, ang) => { g.beginPath(); g.moveTo(X + sx, Y - 31); g.lineTo(X + sx + Math.sin(ang) * 9, Y - 31 + Math.cos(ang) * 11); g.stroke(); };
    if (assustada || carregada || feliz) {
      const s = feliz ? Math.sin(t * 6) * 0.3 : 0;
      braco(-8, Math.PI - 0.5 + s); braco(8, Math.PI + 0.5 - s);
    } else {
      braco(-8, 0.25 + passo * 0.5); braco(8, -0.25 - passo * 0.5);
    }

    // Cabeça
    elipse(g, X, Y - 44, 12, 12, pele);
    g.fillStyle = cabelo;
    if (dir === 'BACK') {
      g.beginPath(); g.ellipse(X, Y - 45, 13.5, 13.5, 0, 0, TAU); g.fill();
    } else {
      g.beginPath(); g.ellipse(X - lado * 2, Y - 50, 13.5, 8.5, 0, Math.PI, TAU); g.fill();
      g.fillRect(X - 13.5 - lado * 2, Y - 51, 5, 20); if (lado <= 0) g.fillRect(X + 8.5 - lado * 2, Y - 51, 5, 20);
      // Rosto
      g.fillStyle = '#3b2a20';
      const olho = (ox) => {
        if (feliz) { g.strokeStyle = '#3b2a20'; g.lineWidth = 1.5; g.beginPath(); g.arc(X + ox, Y - 43, 2.2, Math.PI, TAU); g.stroke(); }
        else g.fillRect(X + ox - 1.2, Y - 45, 2.4, 3.4);
      };
      if (lado === 0) { olho(-4.5); olho(4.5); } else olho(lado * 5);
      g.fillStyle = '#e88a8a'; if (lado === 0) { g.fillRect(X - 8, Y - 40, 3, 1.5); g.fillRect(X + 5, Y - 40, 3, 1.5); }
      if (assustada) { g.fillStyle = '#3b2a20'; g.beginPath(); g.arc(X + lado * 4, Y - 37.5, 1.8, 0, TAU); g.fill(); }
      else if (feliz || lado === 0) { g.strokeStyle = '#3b2a20'; g.lineWidth = 1.2; g.beginPath(); g.arc(X + lado * 4, Y - 39, 2.2, 0.2, Math.PI - 0.2); g.stroke(); }
      if (chorando) { g.fillStyle = '#7cc8ff'; g.fillRect(X - 5, Y - 42 + (t * 30) % 10, 1.5, 3); g.fillRect(X + 4, Y - 42 + (t * 30 + 5) % 10, 1.5, 3); }
    }
    // Laço com sininho
    g.fillStyle = '#e04f7a'; g.beginPath(); g.ellipse(X + 8, Y - 55, 4, 2.5, 0.5, 0, TAU); g.ellipse(X + 12, Y - 52, 4, 2.5, -0.3, 0, TAU); g.fill();
    g.fillStyle = '#ffd34d'; g.beginPath(); g.arc(X + 10, Y - 50, 2, 0, TAU); g.fill();
  }

  // ---------- Sombra (inimigo provisório) ----------
  function sombra(g, x, y, e) {
    const t = e.t || 0;
    const estica = e.estado === 'preparar' ? 1 + Math.sin(t * 30) * 0.08 : e.estado === 'investir' ? 1.25 : 1 + Math.sin(t * 5) * 0.06;
    const w = 15 / Math.sqrt(estica), h = 22 * estica;
    g.save();
    if (e.flash > 0) g.globalAlpha = 0.5 + 0.5 * Math.sin(t * 60);
    if (e.morrendo != null) { g.globalAlpha = Math.max(0, 1 - e.morrendo * 2); }
    const cor = e.estado === 'preparar' ? '#5b1f4f' : '#2c1e3d';
    g.fillStyle = cor;
    g.beginPath();
    g.moveTo(x - w, y);
    g.quadraticCurveTo(x - w * 1.1, y - h, x, y - h * 1.15);
    g.quadraticCurveTo(x + w * 1.1, y - h, x + w, y);
    for (let i = 3; i >= 0; i--) g.lineTo(x - w + (i + 0.5) * (w / 2), y + 3 * Math.sin(t * 8 + i));
    g.closePath(); g.fill();
    // Fiapos de fumaça
    g.fillStyle = 'rgba(80,50,110,.5)';
    for (let i = 0; i < 3; i++) { const a = t * 2 + i * 2.1; g.beginPath(); g.arc(x + Math.cos(a) * w, y - h + Math.sin(a * 1.3) * 5 - 4, 3, 0, TAU); g.fill(); }
    const olhos = e.estado === 'preparar' ? '#ff4d6d' : '#ffe066';
    g.fillStyle = olhos;
    const ol = (e.lado || 1) * 2;
    g.beginPath(); g.ellipse(x - 5 + ol, y - h * 0.62, 2.4, 3.4, 0, 0, TAU); g.ellipse(x + 5 + ol, y - h * 0.62, 2.4, 3.4, 0, 0, TAU); g.fill();
    g.restore();
  }

  // ---------- Dragão (provisório) ----------
  // e: { base, t, progresso, lado, fogo, fraco, flash, alturaVoo, caido }
  function dragao(g, x, y, e) {
    const t = e.t || 0;
    const b = e.base || 'DRAGON_IDLE';
    const voando = /FLY|GLIDE|TAKEOFF|AIR_ATTACK/.test(b);
    const caido = /DEFEATED|FALL/.test(b);
    const rugindo = /ROAR|FIRE|DESPERATE/.test(b);
    const garra = /CLAW|BITE/.test(b);
    const cauda = /TAIL/.test(b);
    const atordoado = /STUNNED|WEAK_POINT/.test(b);
    const p = e.progresso || 0;
    const z = e.alturaVoo || 0;
    const resp = Math.sin(t * 2) * 2;

    const corpo = '#7d1f2b', corpo2 = '#5e1520', barriga = '#d9895a', barriga2 = '#bf6d44', asa = '#9b2c3a', asa2 = '#6a1824', chifre = '#e8dcc0';

    g.save();
    if (e.flash > 0) g.filter = 'brightness(2.2)';
    const Y = y - z;

    if (caido) {
      const s = b === 'DRAGON_FALL' ? Math.min(1, p * 1.2) : 1;
      g.translate(x, y); g.scale(1 + s * 0.15, 1 - s * 0.45); g.translate(-x, -y);
    }

    // Cauda (atrás)
    const giro = cauda ? Math.sin(p * Math.PI) * 2.2 : Math.sin(t * 1.4) * 0.25;
    g.strokeStyle = corpo2; g.lineCap = 'round';
    g.lineWidth = 22;
    g.beginPath(); g.moveTo(x, Y - 30);
    const cx1 = x + Math.cos(0.6 + giro) * 70, cy1 = Y - 10 + Math.sin(0.6 + giro) * 30;
    const cx2 = x + Math.cos(0.9 + giro) * 120, cy2 = Y + Math.sin(0.9 + giro) * 40;
    g.quadraticCurveTo(cx1, cy1, cx2, cy2); g.stroke();
    g.fillStyle = corpo2; g.beginPath(); g.moveTo(cx2, cy2 - 14); g.lineTo(cx2 + 22 * Math.cos(0.9 + giro), cy2 + 18 * Math.sin(0.9 + giro)); g.lineTo(cx2 - 4, cy2 + 14); g.fill();

    // Asas
    const bat = voando ? Math.sin(t * 9) * 0.6 : (/WINGS_OPEN|ROAR/.test(b) ? 0.35 : Math.sin(t * 1.2) * 0.08 - 0.25);
    for (const s of [-1, 1]) {
      g.save(); g.translate(x + s * 30, Y - 78); g.rotate(s * (-0.2 - bat)); g.scale(s, 1);
      g.fillStyle = asa;
      g.beginPath(); g.moveTo(0, 0); g.lineTo(95, -55); g.lineTo(120, 10); g.quadraticCurveTo(95, 5, 88, 30); g.quadraticCurveTo(70, 20, 60, 45); g.quadraticCurveTo(40, 30, 10, 40); g.closePath(); g.fill();
      g.strokeStyle = asa2; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(95, -55); g.moveTo(40, -20); g.lineTo(88, 30); g.moveTo(30, -10); g.lineTo(60, 45); g.stroke();
      g.restore();
    }

    // Pernas traseiras
    elipse(g, x - 40, Y - 16, 20, 18, corpo2); elipse(g, x + 40, Y - 16, 20, 18, corpo2);
    g.fillStyle = chifre; for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(x + s * 40 - 10 + i * 8, Y - 2); g.lineTo(x + s * 40 - 8 + i * 8, Y + 6); g.lineTo(x + s * 40 - 5 + i * 8, Y - 2); g.fill(); }

    // Corpo
    elipse(g, x, Y - 58 + resp, 52, 48, corpo);
    elipse(g, x, Y - 50 + resp, 32, 38, barriga);
    g.strokeStyle = barriga2; g.lineWidth = 2;
    for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(x - 28 + i * 2, Y - 74 + i * 11 + resp); g.lineTo(x + 28 - i * 2, Y - 74 + i * 11 + resp); g.stroke(); }

    // Ponto fraco (gema no peito)
    const brilho = e.fraco ? 0.6 + 0.4 * Math.sin(t * 10) : 0.25;
    g.fillStyle = `rgba(90,220,255,${brilho})`;
    g.beginPath(); g.moveTo(x, Y - 70 + resp); g.lineTo(x + 9, Y - 58 + resp); g.lineTo(x, Y - 46 + resp); g.lineTo(x - 9, Y - 58 + resp); g.closePath(); g.fill();
    if (e.fraco) { g.strokeStyle = `rgba(160,240,255,${brilho})`; g.lineWidth = 2; g.beginPath(); g.arc(x, Y - 58 + resp, 16 + Math.sin(t * 10) * 3, 0, TAU); g.stroke(); }

    // Braços / garras
    const ergue = garra ? Math.sin(Math.min(1, p * 1.4) * Math.PI) : 0;
    for (const s of [-1, 1]) {
      const lev = (s === (e.lado || 1) ? ergue : 0);
      const ax = x + s * 44, ay = Y - 60 + resp - lev * 40;
      g.strokeStyle = corpo; g.lineWidth = 14; g.beginPath(); g.moveTo(x + s * 30, Y - 70 + resp); g.lineTo(ax, ay + 20); g.stroke();
      g.fillStyle = chifre; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(ax - 7 + i * 7, ay + 24); g.lineTo(ax - 5 + i * 7 + s * lev * 6, ay + 36); g.lineTo(ax - 2 + i * 7, ay + 24); g.fill(); }
    }

    // Pescoço e cabeça
    const inclina = atordoado ? Math.sin(t * 3) * 0.25 : caido ? 0.9 : 0;
    const hx = x + Math.sin(inclina) * 30, hy = Y - 118 + resp + (atordoado ? 10 : 0) - (rugindo ? 6 : 0);
    g.strokeStyle = corpo; g.lineWidth = 26; g.beginPath(); g.moveTo(x, Y - 90 + resp); g.lineTo(hx, hy + 14); g.stroke();
    g.fillStyle = chifre;
    for (const s of [-1, 1]) { g.beginPath(); g.moveTo(hx + s * 12, hy - 14); g.quadraticCurveTo(hx + s * 30, hy - 30, hx + s * 26, hy - 44); g.quadraticCurveTo(hx + s * 22, hy - 28, hx + s * 6, hy - 18); g.fill(); }
    elipse(g, hx, hy, 26, 22, corpo);
    // Focinho / mandíbula
    const boca = rugindo ? 0.5 + 0.5 * Math.sin(Math.min(1, p * 2) * Math.PI / 2) : 0;
    elipse(g, hx, hy + 14 + boca * 6, 18, 11, corpo2);
    if (boca > 0.1) { elipse(g, hx, hy + 14, 13, 4 + boca * 7, '#3a0b12'); if (/FIRE/.test(b)) elipse(g, hx, hy + 15, 8, 3 + boca * 4, '#ffb347'); }
    g.fillStyle = '#2a0a10'; g.fillRect(hx - 7, hy + 8, 3, 2); g.fillRect(hx + 4, hy + 8, 3, 2);
    // Olhos
    if (caido) {
      g.strokeStyle = '#ffd34d'; g.lineWidth = 2;
      for (const s of [-1, 1]) { g.beginPath(); g.moveTo(hx + s * 11 - 4, hy - 8); g.lineTo(hx + s * 11 + 4, hy - 2); g.moveTo(hx + s * 11 + 4, hy - 8); g.lineTo(hx + s * 11 - 4, hy - 2); g.stroke(); }
    } else {
      for (const s of [-1, 1]) {
        elipse(g, hx + s * 11, hy - 5, 6, 4.5, atordoado ? '#fff3b0' : '#ffd34d');
        g.fillStyle = '#1a0508'; g.fillRect(hx + s * 11 - 1, hy - 9, 2, 8);
      }
      if (atordoado) {
        g.fillStyle = '#fff176';
        for (let i = 0; i < 3; i++) { const a = t * 4 + i * 2.1; estrela(g, hx + Math.cos(a) * 30, hy - 30 + Math.sin(a) * 8, 5); }
      }
    }
    g.restore();
  }

  function estrela(g, x, y, r) {
    g.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    g.closePath(); g.fill();
  }

  // Olho do dragão abrindo no escuro (cena final).
  function olhoDragao(g, cx, cy, abertura, t) {
    g.save();
    const w = 90, h = 38 * abertura;
    g.fillStyle = '#ffcc33';
    g.shadowColor = '#ff9900'; g.shadowBlur = 40 * abertura;
    g.beginPath(); g.ellipse(cx, cy, w, Math.max(0.5, h), 0, 0, TAU); g.fill();
    g.shadowBlur = 0;
    g.fillStyle = '#1a0508';
    g.beginPath(); g.ellipse(cx + Math.sin(t) * 4, cy, 7, Math.max(0.3, h * 0.95), 0, 0, TAU); g.fill();
    g.restore();
  }

  // Line provisória: só aparece se o sprite ainda não existir (ex.: família nova).
  function lineProvisoria(g, x, y, e) {
    elipse(g, x, y - 30, 12, 28, '#222');
    elipse(g, x, y - 58, 11, 11, '#b07850');
    g.fillStyle = '#111'; g.fillRect(x - 13, y - 70, 26, 7);
    g.fillStyle = '#fff'; g.font = '8px sans-serif'; g.textAlign = 'center'; g.fillText(e.base, x, y + 10);
  }

  LB.desenho = { arvore, pedra, estalagmite, espinheiro, casa, bau, placa, jaula, coracaoForma, bell, sombra, dragao, olhoDragao, sombraChao, lineProvisoria, estrela, elipse };
})(window.LB);
