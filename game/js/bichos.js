'use strict';

// Bichinhos da fazenda: cada um anda na sua área, faz barulho e aceita carinho.
(function (LB) {
  const TAU = Math.PI * 2;
  const T = (n) => n * LB.TILE;
  const E = (g, x, y, rx, ry, cor) => { g.fillStyle = cor; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, TAU); g.fill(); };

  const ESPECIES = {
    galinha: { vel: 28, fuga: 95, sons: ['Cocó!', 'Pó-pó-pó...', 'Cocoricó?'], nome: 'galinha', altura: 22 },
    pintinho: { vel: 34, fuga: 80, sons: ['Piu!', 'Piu piu!'], nome: 'pintinho', altura: 12 },
    vaca: { vel: 13, fuga: 0, sons: ['Muuuu!', 'Muu...'], nome: 'vaca', altura: 42 },
    ovelha: { vel: 17, fuga: 60, sons: ['Béééé!', 'Bé!'], nome: 'ovelha', altura: 30 },
    porco: { vel: 15, fuga: 0, sons: ['Oinc!', 'Oinc oinc!'], nome: 'porco', altura: 26 },
    cachorro: { vel: 70, fuga: 0, sons: ['Au! Au!', 'Au!', 'Auuu~'], nome: 'Theo', altura: 28 },
    gato: { vel: 0, fuga: 0, sons: ['Miau~', 'Rrrrr...'], nome: 'gato', altura: 22 },
    pato: { vel: 16, fuga: 0, sons: ['Quack!', 'Quack quack!'], nome: 'pato', altura: 20 },
  };

  class Bicho {
    constructor(tipo, x, y, area, o) {
      this.tipo = tipo; this.cfg = ESPECIES[tipo];
      this.x = x; this.y = y; this.area = area;
      this.lado = Math.random() < 0.5 ? -1 : 1;
      this.t = Math.random() * 3; this.f = Math.random() * 10;
      this.estado = 'parado'; this.alvo = null; this.espera = Math.random() * 2;
      this.bicho = true; this.raio = tipo === 'vaca' ? 22 : 12;
      Object.assign(this, o || {});
    }

    livre(jogo, x, y) {
      const m = jogo.mapa;
      if (this.tipo === 'pato') return m.tileEm(x, y) === '~';
      if (m.colide(x, y - 4, 6, 4)) return false;
      const a = this.area;
      return !a || (x >= T(a.x0) && x <= T(a.x1 + 1) && y >= T(a.y0) + 8 && y <= T(a.y1 + 1));
    }

    sortearAlvo(jogo) {
      for (let i = 0; i < 12; i++) {
        const a = this.area;
        const x = a ? T(a.x0) + Math.random() * T(a.x1 - a.x0 + 1) : this.x + (Math.random() - 0.5) * 120;
        const y = a ? T(a.y0) + 10 + Math.random() * (T(a.y1 - a.y0 + 1) - 10) : this.y + (Math.random() - 0.5) * 80;
        if (this.livre(jogo, x, y)) return { x, y };
      }
      return null;
    }

    andarPara(alvo, vel, dt, jogo) {
      const dx = alvo.x - this.x, dy = alvo.y - this.y, d = Math.hypot(dx, dy);
      if (d < 3) return true;
      const p = Math.min(d, vel * dt), nx = this.x + dx / d * p, ny = this.y + dy / d * p;
      if (Math.abs(dx) > 1) this.lado = dx < 0 ? -1 : 1;
      if (this.livre(jogo, nx, ny) || this.ignorarColisao) { this.x = nx; this.y = ny; return false; }
      return true;
    }

    atualizar(dt, jogo) {
      this.t += dt; this.f += dt;
      const l = jogo.line, c = this.cfg;
      const dl = Math.hypot(l.x - this.x, l.y - this.y);
      if (this.pulo > 0) this.pulo = Math.max(0, this.pulo - dt);

      // Fuga: correr perto assusta as aves e as ovelhas.
      if (c.fuga && dl < 55 && l.correndo && this.estado !== 'fugindo' && !this.assustado) {
        this.estado = 'fugindo'; this.t = 0;
        const d = dl || 1;
        this.alvo = { x: this.x + (this.x - l.x) / d * 60, y: this.y + (this.y - l.y) / d * 40 };
        if (Math.random() < 0.6) jogo.balao(this, this.tipo === 'ovelha' ? 'BÉÉ!' : 'Có!!', 0.8);
      }
      if (this.assustado) { // Quando o dragão chega todo mundo corre.
        this.estado = 'fugindo';
        if (!this.alvo || this.t > 1) { this.t = 0; this.alvo = this.sortearAlvo(jogo) || { x: this.x, y: this.y }; }
        this.andarPara(this.alvo, (c.vel || 20) * 2.5 + 20, dt, jogo);
        return;
      }

      if (this.tipo === 'cachorro') return this.cachorro(dt, jogo, dl);
      if (this.tipo === 'gato') { if (this.estado === 'carinho' && this.t > 1.5) { this.estado = 'dormindo'; } return; }
      if (this.tipo === 'pintinho' && this.mae) {
        const alvo = { x: this.mae.x - this.mae.lado * (10 + this.ordem * 8), y: this.mae.y + 4 + (this.ordem % 2) * 5 };
        const d = Math.hypot(alvo.x - this.x, alvo.y - this.y);
        this.estado = d > 5 ? 'andando' : 'parado';
        if (d > 5) this.andarPara(alvo, Math.min(60, d * 3), dt, jogo);
        if (Math.random() < dt * 0.05) jogo.balao(this, 'Piu!', 0.8);
        return;
      }

      switch (this.estado) {
        case 'parado': case 'comendo':
          this.espera -= dt;
          if (this.espera <= 0) {
            const r = Math.random();
            if (r < 0.55) { this.alvo = this.sortearAlvo(jogo); this.estado = this.alvo ? 'andando' : 'parado'; }
            else { this.estado = this.tipo === 'pato' ? 'parado' : 'comendo'; }
            this.espera = 1.5 + Math.random() * 3;
          }
          if (Math.random() < dt * (this.tipo === 'galinha' ? 0.06 : 0.035)) jogo.balao(this, c.sons[Math.floor(Math.random() * c.sons.length)], 1.2);
          break;
        case 'andando':
          if (!this.alvo || this.andarPara(this.alvo, c.vel, dt, jogo)) { this.estado = 'parado'; this.espera = 1 + Math.random() * 2; }
          break;
        case 'fugindo':
          if (!this.alvo || this.andarPara(this.alvo, c.fuga || 40, dt, jogo) || this.t > 1.2) { this.estado = 'parado'; this.espera = 1; }
          break;
        case 'carinho':
          if (this.t > 1.4) { this.estado = 'parado'; this.espera = 1.5; }
          break;
      }
    }

    cachorro(dt, jogo, dl) {
      const l = jogo.line;
      const tigela = jogo.pontoMapa('tigela');
      if (this.estado === 'indoComer' && tigela) {
        if (this.andarPara(tigela, 120, dt, jogo)) { this.estado = 'comendo'; this.t = 0; }
        return;
      }
      if (this.estado === 'comendo') {
        if (Math.random() < dt * 2) jogo.particulas.emitir('poeira', this.x + this.lado * 8, this.y, 1, { vel: 10, vida: 0.3, r: 1.5 });
        if (this.t > 3.5) { this.estado = 'parado'; this.comeu = true; jogo.balao(this, 'Au! Au! ♥', 1.4); }
        return;
      }
      if (this.estado === 'carinho') { if (this.t > 1.4) this.estado = 'parado'; return; }
      if (this.seguir && !jogo.cenaAtiva) {
        // Segue a Line de pertinho (sem atravessar paredes: pula para perto se ficar preso).
        const alvo = { x: l.x - (l.lado || 1) * 34, y: l.y + 14 };
        const d = Math.hypot(alvo.x - this.x, alvo.y - this.y);
        if (d > 260) { this.x = alvo.x; this.y = alvo.y; }
        if (d > 26) {
          this.ignorarColisao = true;
          this.andarPara(alvo, d > 90 ? 150 : 80, dt, jogo);
          this.estado = 'andando';
        } else this.estado = 'parado';
        if (Math.random() < dt * 0.03) jogo.balao(this, 'Au!', 0.8);
      } else if (!this.comeu && Math.random() < dt * 0.1) jogo.balao(this, 'Auuu~ (fome)', 1.2);
    }

    carinho(jogo) {
      this.estado = this.tipo === 'gato' ? 'carinho' : 'carinho'; this.t = 0; this.pulo = 0.4;
      jogo.balao(this, this.cfg.sons[0], 1.2);
      jogo.particulas.emitir('coracao', this.x, this.y - this.cfg.altura - 4, 3, { vel: 20, vida: 1.2 });
    }

    desenharSombra(g) {
      const r = { vaca: 24, ovelha: 15, porco: 15, cachorro: 13, galinha: 8, pintinho: 4, gato: 11, pato: 0 }[this.tipo];
      if (r) LB.desenho.sombraChao(g, this.x, this.y, r, 0.22);
    }

    desenhar(g, jogo) {
      const t = jogo.tempo + this.f;
      const hop = this.pulo > 0 ? Math.sin((0.4 - this.pulo) / 0.4 * Math.PI) * 8 : 0;
      g.save();
      g.translate(this.x, this.y - hop);
      g.scale(this.lado, 1);
      const andando = this.estado === 'andando' || this.estado === 'fugindo' || this.estado === 'indoComer';
      DESENHOS[this.tipo](g, t, this.estado, andando);
      g.restore();
    }
  }

  // ---------- Desenhos (virados para a direita; o espelho cuida da esquerda) ----------
  function pernas(g, t, andando, xs, y, h, cor, vel) {
    g.strokeStyle = cor; g.lineWidth = 2.2; g.lineCap = 'round';
    xs.forEach((x, i) => { const s = andando ? Math.sin(t * (vel || 12) + i * Math.PI) * 3 : 0; g.beginPath(); g.moveTo(x, y - h); g.lineTo(x + s, y); g.stroke(); });
  }

  const DESENHOS = {
    galinha(g, t, estado, andando) {
      const bica = estado === 'comendo' ? Math.max(0, Math.sin(t * 7)) * 6 : 0;
      pernas(g, t, andando, [-2, 2], 0, 6, '#e8a33c', 16);
      E(g, -1, -10, 8, 6.5, '#fbfbf7');
      g.fillStyle = '#e9e5da'; g.beginPath(); g.moveTo(-7, -12); g.lineTo(-13, -19); g.lineTo(-10, -9); g.fill();
      E(g, -2, -9, 4, 3, '#ecece6');
      const hx = 6, hy = -15 + bica;
      E(g, hx, hy, 4, 4, '#fbfbf7');
      g.fillStyle = '#e23b3b'; g.beginPath(); g.arc(hx - 1, hy - 4, 1.8, 0, TAU); g.arc(hx + 1.2, hy - 4.5, 1.8, 0, TAU); g.fill();
      g.beginPath(); g.ellipse(hx + 2.5, hy + 3, 1, 1.8, 0, 0, TAU); g.fill();
      g.fillStyle = '#f2b233'; g.beginPath(); g.moveTo(hx + 3.5, hy - 0.5); g.lineTo(hx + 7, hy + 0.8); g.lineTo(hx + 3.5, hy + 1.8); g.fill();
      g.fillStyle = '#222'; g.fillRect(hx + 1, hy - 1.5, 1.4, 1.4);
    },
    pintinho(g, t, estado, andando) {
      pernas(g, t, andando, [-1, 1], 0, 3, '#e8a33c', 20);
      E(g, 0, -5, 4.2, 3.8, '#ffe066');
      E(g, 3, -8, 2.6, 2.6, '#ffe36e');
      g.fillStyle = '#f2a033'; g.beginPath(); g.moveTo(5, -8.5); g.lineTo(7.5, -8); g.lineTo(5, -7); g.fill();
      g.fillStyle = '#222'; g.fillRect(3.5, -9.2, 1, 1);
    },
    vaca(g, t, estado, andando) {
      const pasta = estado === 'comendo' ? 6 : 0;
      pernas(g, t, andando, [-13, -8, 8, 13], 0, 13, '#f2f2f2', 5);
      g.fillStyle = '#333'; for (const x of [-13, -8, 8, 13]) g.fillRect(x - 1.2, -2, 2.4, 2);
      E(g, 0, -20, 20, 11, '#fafafa');
      g.fillStyle = '#2b2b2b'; g.beginPath(); g.ellipse(-8, -22, 6, 5, 0.4, 0, TAU); g.ellipse(6, -17, 5, 4, -0.3, 0, TAU); g.ellipse(-2, -27, 4, 3, 0, 0, TAU); g.fill();
      E(g, 2, -10, 5, 3, '#f4a6b8');
      const cauda = Math.sin(t * 3) * 0.4;
      g.strokeStyle = '#eee'; g.lineWidth = 2; g.beginPath(); g.moveTo(-19, -24); g.quadraticCurveTo(-25, -18 + cauda * 6, -23, -10 + cauda * 4); g.stroke();
      E(g, -23, -9 + cauda * 4, 2, 3, '#333');
      const hx = 21, hy = -22 + pasta;
      E(g, hx, hy, 7, 7.5, '#fafafa');
      E(g, hx + 4, hy + 5, 5, 3.6, '#f4a6b8');
      g.fillStyle = '#333'; g.fillRect(hx + 2, hy + 4, 1.2, 1.2); g.fillRect(hx + 5, hy + 4, 1.2, 1.2); g.fillRect(hx + 1, hy - 3, 1.6, 1.6);
      g.fillStyle = '#e8dcc0'; g.beginPath(); g.moveTo(hx - 3, hy - 6); g.lineTo(hx - 5, hy - 11); g.lineTo(hx - 1, hy - 7); g.fill();
      E(g, hx - 5, hy - 4, 3.5, 2, '#2b2b2b');
    },
    ovelha(g, t, estado, andando) {
      pernas(g, t, andando, [-6, -2, 3, 7], 0, 7, '#2e2a2a', 9);
      g.fillStyle = '#f7f5ef';
      for (const [x, y, r] of [[-7, -12, 6], [0, -15, 7], [7, -12, 6], [-3, -9, 6], [4, -9, 6], [0, -11, 7]]) { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
      const pasta = estado === 'comendo' ? 4 : 0;
      E(g, 12, -14 + pasta, 4.5, 5.5, '#2e2a2a');
      E(g, 9, -17 + pasta, 3, 1.6, '#2e2a2a');
      g.fillStyle = '#fff'; g.fillRect(13, -15 + pasta, 1.4, 1.4);
    },
    porco(g, t, estado, andando) {
      pernas(g, t, andando, [-7, -3, 4, 8], 0, 5, '#e9899c', 9);
      E(g, 0, -11, 13, 8, '#f5a3b5');
      E(g, -2, -14, 8, 3, '#f8b8c6');
      g.strokeStyle = '#e9899c'; g.lineWidth = 1.5; g.beginPath(); g.arc(-14, -12, 2.5, 0, TAU * 0.8); g.stroke();
      E(g, 12, -12, 6, 6, '#f5a3b5');
      E(g, 17, -11, 3, 2.6, '#e57f95');
      g.fillStyle = '#9c3f55'; g.fillRect(16, -11.5, 0.9, 1.4); g.fillRect(18, -11.5, 0.9, 1.4);
      g.fillStyle = '#222'; g.fillRect(13, -15, 1.3, 1.3);
      g.fillStyle = '#e9899c'; g.beginPath(); g.moveTo(9, -17); g.lineTo(11, -21); g.lineTo(13, -16); g.fill();
      if (estado === 'comendo') { g.fillStyle = 'rgba(122,85,54,.8)'; g.beginPath(); g.ellipse(0, -5, 10, 3, 0, 0, TAU); g.fill(); }
    },
    cachorro(g, t, estado, andando) {
      const sentado = !andando && estado !== 'comendo';
      const abana = Math.sin(t * (estado === 'carinho' || estado === 'comendo' ? 20 : 10)) * 0.6;
      if (sentado) {
        E(g, -2, -9, 8, 8, '#c98a4b');
        pernas(g, t, false, [4, 7], 0, 8, '#c98a4b');
        E(g, -6, -2, 6, 3, '#c98a4b');
      } else {
        pernas(g, t, andando, [-7, -3, 5, 8], 0, 7, '#c98a4b', 16);
        E(g, 0, -11, 11, 6.5, '#c98a4b');
        E(g, 1, -9, 7, 3.5, '#e8c39a');
      }
      g.strokeStyle = '#c98a4b'; g.lineWidth = 3; g.lineCap = 'round';
      g.beginPath(); g.moveTo(-10, sentado ? -6 : -13); g.lineTo(-15 + Math.cos(abana) * 2, (sentado ? -12 : -19) + Math.sin(abana) * 3); g.stroke();
      const hx = sentado ? 5 : 11, hy = (sentado ? -19 : -17) + (estado === 'comendo' ? 7 : 0);
      E(g, hx, hy, 6, 5.5, '#c98a4b');
      E(g, hx + 4.5, hy + 2, 3.5, 2.6, '#e8c39a');
      E(g, hx + 7.5, hy + 1, 1.5, 1.2, '#2a1a10');
      g.fillStyle = '#7a4a24'; g.beginPath(); g.ellipse(hx - 3, hy + 1, 2.5, 5, 0.3, 0, TAU); g.fill();
      g.fillStyle = '#222'; g.fillRect(hx + 1.5, hy - 2, 1.6, 1.6);
      g.fillStyle = '#d63a3a'; g.fillRect(hx - 5, hy + 4, 7, 2);
      if (estado === 'carinho') { g.fillStyle = '#ff8fa3'; g.beginPath(); g.ellipse(hx + 6, hy + 5.5, 1.5, 2.5, 0, 0, TAU); g.fill(); }
    },
    gato(g, t, estado) {
      const dorme = estado === 'dormindo';
      if (dorme) {
        E(g, 0, -6, 10, 6, '#8a8a8a');
        E(g, 7, -8, 5, 4.5, '#8a8a8a');
        g.fillStyle = '#8a8a8a'; g.beginPath(); g.moveTo(5, -11); g.lineTo(6, -15); g.lineTo(8, -11.5); g.moveTo(8.5, -11.5); g.lineTo(10.5, -14.5); g.lineTo(11, -10); g.fill();
        g.strokeStyle = '#6d6d6d'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.arc(0, -3, 9, 0.3, Math.PI * 0.95); g.stroke();
        g.strokeStyle = '#333'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(8, -8); g.lineTo(10, -8); g.stroke();
        const z = (t * 0.8) % 1;
        g.fillStyle = `rgba(255,255,255,${1 - z})`; g.font = 'bold 7px sans-serif'; g.fillText('z', 12 + z * 4, -16 - z * 10);
      } else {
        E(g, 0, -8, 6, 8, '#8a8a8a');
        E(g, 1, -18, 5, 4.6, '#8a8a8a');
        g.fillStyle = '#8a8a8a'; g.beginPath(); g.moveTo(-2, -21); g.lineTo(-2, -26); g.lineTo(1, -22); g.moveTo(2, -22); g.lineTo(5, -26); g.lineTo(5, -21); g.fill();
        g.fillStyle = '#9be27a'; g.fillRect(-1, -19, 1.5, 1.8); g.fillRect(2.5, -19, 1.5, 1.8);
        g.strokeStyle = '#6d6d6d'; g.lineWidth = 2.5; g.lineCap = 'round'; g.beginPath(); g.moveTo(-5, -3); g.quadraticCurveTo(-12, -6, -10, -14 + Math.sin(t * 3) * 2); g.stroke();
      }
    },
    pato(g, t) {
      const b = Math.sin(t * 2) * 0.8;
      g.strokeStyle = `rgba(255,255,255,${0.35 + 0.2 * Math.sin(t * 3)})`; g.lineWidth = 1;
      g.beginPath(); g.ellipse(0, 0, 11 + Math.sin(t * 2) * 2, 3.5, 0, 0, TAU); g.stroke();
      E(g, 0, -4 + b, 9, 4.5, '#fbfbf7');
      g.fillStyle = '#ecece6'; g.beginPath(); g.moveTo(-7, -5 + b); g.lineTo(-11, -9 + b); g.lineTo(-9, -3 + b); g.fill();
      E(g, 6, -11 + b, 3.6, 3.6, '#fbfbf7');
      g.fillStyle = '#f2a033'; g.beginPath(); g.moveTo(8.5, -11.5 + b); g.lineTo(13, -10.5 + b); g.lineTo(8.5, -9.5 + b); g.fill();
      g.fillStyle = '#222'; g.fillRect(6.5, -12.5 + b, 1.2, 1.2);
    },
  };

  // Monta a bicharada da fazenda a partir das áreas do mapa.
  function povoar(jogo) {
    const m = jogo.mapa, a = m.def.areas || {};
    const lista = [];
    const em = (area) => ({ x: T(area.x0 + 1 + Math.random() * (area.x1 - area.x0 - 1)), y: T(area.y0 + 1 + Math.random() * (area.y1 - area.y0 - 1)) });
    if (a.galinhas) {
      for (let i = 0; i < 5; i++) { const p = em(a.galinhas); lista.push(new Bicho('galinha', p.x, p.y, a.galinhas)); }
      const mae = lista[0];
      for (let i = 0; i < 4; i++) lista.push(new Bicho('pintinho', mae.x - 12 - i * 8, mae.y + 4, a.galinhas, { mae, ordem: i }));
    }
    if (a.pasto) {
      for (let i = 0; i < 2; i++) { const p = em(a.pasto); lista.push(new Bicho('vaca', p.x, p.y, a.pasto)); }
      for (let i = 0; i < 4; i++) { const p = em(a.pasto); lista.push(new Bicho('ovelha', p.x, p.y, a.pasto)); }
    }
    if (a.chiqueiro) for (let i = 0; i < 2; i++) { const p = em(a.chiqueiro); lista.push(new Bicho('porco', p.x, p.y, a.chiqueiro)); }
    if (a.lago) for (let i = 0; i < 4; i++) {
      for (let k = 0; k < 20; k++) { const p = em(a.lago); if (m.tileEm(p.x, p.y) === '~') { lista.push(new Bicho('pato', p.x, p.y, a.lago)); break; } }
    }
    const casinha = m.props.find((p) => p.tipo === 'casinha');
    if (casinha) lista.push(new Bicho('cachorro', casinha.x + 26, casinha.y + 10, null, { estado: 'parado' }));
    const casa = m.props.find((p) => p.tipo === 'casaFazenda');
    if (casa) lista.push(new Bicho('gato', casa.x + casa.w - 22, casa.y + 6, null, { estado: 'dormindo' }));
    return lista;
  }

  // O velho mago da floresta (ilustração única animada no código).
  class Mago {
    constructor(x, y) {
      this.x = x; this.y = y; this.lado = 1; this.t = 0; this.fala = 0; this.raio = 14; this.visivel = true;
    }

    atualizar(dt, jogo) {
      this.t += dt; this.fala = Math.max(0, this.fala - dt);
      const l = jogo.line;
      if (Math.abs(l.x - this.x) > 8) this.lado = l.x < this.x ? -1 : 1;
      if (Math.random() < dt * 3) jogo.particulas.emitir('brilho', this.x + this.lado * -17 + (Math.random() - 0.5) * 8, this.y - 64, 1, { vel: 12, vz: 10, vida: 0.9, r: 2.5 });
    }

    desenharSombra(g) { LB.desenho.sombraChao(g, this.x, this.y, 16, 0.28); }

    desenhar(g, jogo) {
      const img = LB.personagem('mago');
      const t = this.t;
      if (!img) { LB.desenho.lineProvisoria(g, this.x, this.y, { base: 'MAGO' }); return; }
      const ESC = 76 / 220, PES = 240, CRISTAL = [47, 48];
      const resp = Math.sin(t * 1.8);
      const aceno = this.fala > 0 ? Math.sin(t * 8) * 0.03 : 0;
      g.save();
      g.translate(this.x, this.y);
      g.scale(-this.lado, 1); // a ilustração olha para a esquerda
      g.rotate(aceno);
      g.scale(1 - resp * 0.008, 1 + resp * 0.016);
      g.imageSmoothingEnabled = false;
      const ox = -128 * ESC, oy = -PES * ESC;
      g.drawImage(img, ox, oy, 256 * ESC, 256 * ESC);
      g.imageSmoothingEnabled = true;
      const cx = ox + CRISTAL[0] * ESC, cy = oy + CRISTAL[1] * ESC, k = 0.55 + 0.45 * Math.sin(t * 3);
      const gr = g.createRadialGradient(cx, cy, 0, cx, cy, 16);
      gr.addColorStop(0, `rgba(190,240,255,${0.9 * k})`); gr.addColorStop(1, 'rgba(90,180,255,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, 16, 0, TAU); g.fill();
      g.restore();
    }
  }

  LB.Mago = Mago;
  LB.Bicho = Bicho;
  LB.bichos = { povoar, ESPECIES, DESENHOS };
})(window.LB);
