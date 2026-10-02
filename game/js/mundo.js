'use strict';

// Objetos do mundo que ligam as fases: paredes rachadas (bomba), postes do gancho, brasa rasa,
// galerias escuras (lanterna), moedas, casas do vilarejo e os objetos novos de cenário.
(function (LB) {
  const TAU = Math.PI * 2;
  const TILE = LB.TILE;
  const T = (n) => n * TILE;
  const D = () => LB.desenho;
  const M = () => LB.mochila;

  // ---------------- Bombas ----------------
  const PAVIO = 2, RAIO_BOMBA = 62;

  function colocarBomba(j) {
    const l = j.line;
    if (!l || l.noAr) return { ok: false, motivo: 'Agora não.' };
    if ((j.bombas || []).length >= 2) return { ok: false, motivo: 'Espere a outra bomba explodir.' };
    j.bombas = j.bombas || [];
    j.bombas.push({ x: l.x + l.lado * 14, y: l.y + 2, t: 0 });
    j.dica('bomba', 'Bomba acesa! Afaste-se: ela quebra paredes e pedras rachadas e fere quem estiver perto.');
    return { ok: true };
  }

  function explodir(j, b) {
    j.tremer(7, 0.35); j.flashTela = Math.max(j.flashTela, 0.25);
    j.particulas.emitir('fogo', b.x, b.y - 10, 26, { vel: 160, vida: 0.5, r: 7 });
    j.particulas.emitir('poeira', b.x, b.y, 18, { vel: 150, vida: 0.8, r: 6 });
    j.particulas.emitir('pedra', b.x, b.y, 10, { vel: 120, vz: 180, vida: 0.9 });
    if (!LB.fx.emitir(j, 'FX_EXPLOSION', b.x, b.y - 18)) j.particulas.emitir('impacto', b.x, b.y - 16, 1, { r: 14, vida: 0.4, vel: 0 });
    // Inimigos em volta.
    for (const e of j.alvos()) {
      if (Math.hypot(e.x - b.x, (e.y - b.y) * 1.2) > RAIO_BOMBA + (e.raio || 12)) continue;
      if (e.golem && e.estado !== 'atordoado') continue;
      e.receberGolpe(j, e.chefe ? 2 : 3, b.x, b.y, 200);
    }
    // A própria Line, se ficou perto.
    const l = j.line;
    if (Math.hypot(l.x - b.x, (l.y - b.y) * 1.2) < RAIO_BOMBA - 10) l.receberDano(j, 1, true, b.x, b.y, { ignorarDefesa: true, bloqueavel: false });
    // Paredes e pedras rachadas.
    const m = j.mapa;
    const x0 = Math.floor((b.x - RAIO_BOMBA) / TILE), x1 = Math.floor((b.x + RAIO_BOMBA) / TILE);
    const y0 = Math.floor((b.y - RAIO_BOMBA) / TILE), y1 = Math.floor((b.y + RAIO_BOMBA) / TILE);
    let quebrou = false;
    for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) {
      if (m.tile(tx, ty) !== '%') continue;
      if (Math.hypot(T(tx + 0.5) - b.x, T(ty + 0.5) - b.y) > RAIO_BOMBA + 16) continue;
      m.trocar(tx, ty, m.chaoVazio);
      j.flags.rachaduras = (j.flags.rachaduras || []).concat(m.id + ':' + tx + ',' + ty);
      j.particulas.emitir('pedra', T(tx + 0.5), T(ty + 0.8), 14, { vel: 110, vz: 160, vida: 1 });
      quebrou = true;
    }
    if (quebrou) { M().aviso('💥 A parede rachada desmoronou!'); j.salvar(); }
  }

  function atualizarBombas(j, dt) {
    if (!j.bombas || !j.bombas.length) return;
    for (const b of j.bombas) { b.t += dt; if (b.t >= PAVIO && !b.feito) { b.feito = true; explodir(j, b); } }
    j.bombas = j.bombas.filter((b) => !b.feito);
  }

  function desenharBomba(g, b, t) {
    const pisca = b.t > PAVIO * 0.6 ? Math.floor(t * 16) % 2 : Math.floor(t * 5) % 2;
    D().sombraChao(g, b.x, b.y, 9, 0.3);
    g.fillStyle = pisca ? '#c0392b' : '#2b2b33'; g.beginPath(); g.arc(b.x, b.y - 9, 9, 0, TAU); g.fill();
    g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.arc(b.x - 3, b.y - 12, 3, 0, TAU); g.fill();
    g.strokeStyle = '#8a6a3a'; g.lineWidth = 2; g.beginPath(); g.moveTo(b.x + 4, b.y - 16); g.quadraticCurveTo(b.x + 8, b.y - 22, b.x + 6, b.y - 25); g.stroke();
    g.fillStyle = '#ffd166'; LB.desenho.estrela(g, b.x + 6, b.y - 26, 3 + Math.sin(t * 30) * 1);
  }

  // ---------------- Gancho ----------------
  // O poste do outro lado: o primeiro 'p' em linha reta (até 9 tiles) passando só por água, fenda ou chão.
  function parDoPoste(m, p) {
    for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
      for (let k = 2; k <= 9; k++) {
        const c = m.tile(p.tx + dx * k, p.ty + dy * k);
        if (c === 'p') return { tx: p.tx + dx * k, ty: p.ty + dy * k, dx, dy };
        if (!'~wj._:=l'.includes(c)) break;
      }
    }
    return null;
  }

  function acoes(j, lista, perto) {
    const l = j.line;
    for (const p of j.mapa.props) {
      if (p.tipo !== 'poste' || !perto(p.x, p.y + 10, 64)) continue;
      const par = parDoPoste(j.mapa, p);
      if (!par) continue;
      // Só puxa se a Line está do lado de cá (oposto ao outro poste).
      const lado = (l.x - p.x) * par.dx + (l.y - (p.y + 10)) * par.dy;
      if (lado > 4) continue;
      const temGancho = M().tem(j, 'gancho');
      lista.push({ texto: temGancho ? 'Usar o gancho' : 'Poste de gancho', x: p.x, y: p.y - 58, prio: 1, fazer: () => {
        if (!temGancho) { j.iniciarCena(LB.HISTORIA.semGancho, { semPular: true }); return; }
        j.iniciarCena(cenaGancho, { semPular: true }, { p, par });
      } });
    }
  }

  function* cenaGancho(c, j, arg) {
    const { par } = arg, l = j.line;
    const alvo = { x: T(par.tx + 0.5 + par.dx), y: T(par.ty + 0.9 + par.dy) };
    l.dir = par.dx ? (par.dx < 0 ? 'LEFT' : 'RIGHT') : (par.dy < 0 ? 'BACK' : 'FRONT');
    if (par.dx) l.lado = par.dx;
    l.anim.tocar('LINE_JUMP', true);
    const corda = { tipo: 'corda', t: 0, dur: 99, x1: T(par.tx + 0.5), y1: T(par.ty + 1) - 30 };
    j.efeitos.push(corda);
    yield c.espera(0.25);
    l.noAr = true;
    const x0 = l.x, y0 = l.y;
    let t = 0;
    const dur = Math.max(0.35, Math.hypot(alvo.x - x0, alvo.y - y0) / 420);
    yield { atualizar: (dt) => { t += dt; const k = Math.min(1, t / dur); l.x = x0 + (alvo.x - x0) * k; l.y = y0 + (alvo.y - y0) * k; l.noAr = true; }, pronto: () => t >= dur, pular: () => { l.x = alvo.x; l.y = alvo.y; } };
    corda.t = corda.dur;
    l.noAr = false;
    j.particulas.emitir('poeira', l.x, l.y, 8, { vel: 50, vida: 0.4 });
    l.seguro = { x: l.x, y: l.y };
    j.dica('gancho', 'O gancho prende nos postes: dá para ir e voltar por cima da água e dos abismos.');
  }

  function desenharEfeito(g, f, j) {
    if (f.tipo !== 'corda') return false;
    const l = j.line;
    g.strokeStyle = '#d8c79a'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(l.x + l.lado * 6, l.y - 44); g.lineTo(f.x1, f.y1); g.stroke();
    g.fillStyle = '#b8c2cc'; g.beginPath(); g.arc(f.x1, f.y1, 3, 0, TAU); g.fill();
    return true;
  }

  // ---------------- Brasa rasa ----------------
  function atualizarBrasa(j, dt) {
    const l = j.line;
    if (!l || l.noAr || j.cena || l.estado === 'morta') return;
    if (j.mapa.tileEm(l.x, l.y - 3) !== 'l') { j._brasa = 0; return; }
    if (LB.loja && LB.loja.imuneBrasa(j)) return;
    j._brasa = (j._brasa || 0) + dt;
    if (Math.random() < dt * 12) j.particulas.emitir('brasa', l.x + (Math.random() - 0.5) * 16, l.y, 1, { vz: 40, vel: 10, vida: 0.6, r: 2 });
    if (j._brasa > 0.5) {
      j._brasa = 0;
      l.receberDano(j, 1, false, l.x, l.y - 1, { ignorarDefesa: true, bloqueavel: false, brasa: true });
      j.dica('brasa', 'A brasa queima! Só a Armadura de Brasa protege os pés da Line.');
    }
  }

  // ---------------- Escuro (Minas) ----------------
  function noEscuro(j, x, y) {
    const ret = j.mapa && j.mapa.def.escuro;
    if (!ret) return false;
    const tx = x / TILE, ty = y / TILE;
    return ret.some(([x0, y0, x1, y1]) => tx >= x0 && tx <= x1 + 1 && ty >= y0 && ty <= y1 + 1);
  }

  // Desenha a escuridão por cima do mundo (em coordenadas de tela).
  function desenharEscuro(g, j) {
    const l = j.line;
    if (!l || !j.mapa.def.escuro) return;
    const dentro = noEscuro(j, l.x, l.y - 10);
    j._escuro = (j._escuro || 0) + ((dentro ? 1 : 0) - (j._escuro || 0)) * 0.08;
    if (j._escuro < 0.02) return;
    const temLuz = M().tem(j, 'lanterna');
    const s = j.escala, W = j.canvas.width, H = j.canvas.height;
    const px = (l.x - j.cam.x) * s, py = (l.y - 30 - j.cam.y) * s;
    const r0 = (temLuz ? 120 : 34) * s, r1 = (temLuz ? 230 : 95) * s;
    const gr = g.createRadialGradient(px, py, r0, px, py, r1);
    gr.addColorStop(0, 'rgba(4,6,12,0)');
    gr.addColorStop(1, `rgba(4,6,12,${(temLuz ? 0.82 : 0.97) * j._escuro})`);
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    if (temLuz) { const lg = g.createRadialGradient(px, py, 0, px, py, r0); lg.addColorStop(0, `rgba(255,200,120,${0.1 * j._escuro})`); lg.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = lg; g.fillRect(0, 0, W, H); }
    if (dentro && !temLuz) j.dica('escuro', 'Está escuro demais... Com uma lanterna daria para enxergar. Tem um baú no salão de entrada das minas.');
  }

  // ---------------- Moedas soltas (inimigos derrotados) ----------------
  function soltarMoedas(j, x, y, n) {
    if (n <= 0) return;
    j.itens.push({ tipo: 'moeda', x: x + (Math.random() - 0.5) * 10, y: y + (Math.random() - 0.5) * 6, t: 0, moedas: n });
  }

  // ---------------- Desenho dos objetos novos ----------------
  function rachadura(g, p) {
    const x = p.x, y = p.y, caverna = p.tema !== 'floresta' && p.tema !== 'vilarejo';
    if (caverna) {
      const cores = { gruta: ['#2b363d', '#3c4950', '#5a6b74'], montanha: ['#33282a', '#4f403a', '#6b554b'], ruinas: ['#434b40', '#5a6553', '#6f7a68'] }[p.tema] || ['#3a3030', '#4a4040', '#5a5050'];
      g.fillStyle = cores[0]; g.fillRect(x - 16, y - 44, 32, 44);
      g.fillStyle = cores[1]; g.fillRect(x - 14, y - 42, 12, 20); g.fillRect(x + 2, y - 30, 12, 20); g.fillRect(x - 12, y - 18, 10, 16);
      g.fillStyle = cores[2]; g.fillRect(x - 16, y - 12, 32, 12);
    } else {
      D().sombraChao(g, x, y, 17, 0.3);
      g.fillStyle = '#7d7a82'; g.beginPath(); g.moveTo(x - 17, y); g.quadraticCurveTo(x - 16, y - 32, x, y - 34); g.quadraticCurveTo(x + 17, y - 30, x + 17, y); g.closePath(); g.fill();
      g.fillStyle = '#9b98a0'; g.beginPath(); g.ellipse(x - 5, y - 22, 7, 5, -0.4, 0, TAU); g.fill();
    }
    g.strokeStyle = '#1a1210'; g.lineWidth = 2; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x - 8, y - 36); g.lineTo(x - 1, y - 24); g.lineTo(x - 5, y - 14); g.lineTo(x + 2, y - 4);
    g.moveTo(x - 1, y - 24); g.lineTo(x + 9, y - 28); g.moveTo(x - 5, y - 14); g.lineTo(x - 12, y - 10); g.stroke();
  }

  function poste(g, p, t) {
    const x = p.x, y = p.y;
    D().sombraChao(g, x, y + 2, 10, 0.3);
    g.fillStyle = '#6e4a2c'; g.fillRect(x - 4, y - 46, 8, 46);
    g.fillStyle = '#8a5f3c'; g.fillRect(x - 4, y - 46, 3, 46);
    g.strokeStyle = '#b8c2cc'; g.lineWidth = 3; g.beginPath(); g.arc(x, y - 50, 6, 0, TAU); g.stroke();
    g.fillStyle = '#d8c79a'; for (let i = 0; i < 3; i++) g.fillRect(x - 5, y - 36 + i * 9, 10, 2.5);
    if (Math.floor(t * 2 + p.tx) % 4 === 0) { g.fillStyle = 'rgba(255,255,255,.8)'; LB.desenho.estrela(g, x + 7, y - 56, 2.5); }
  }

  function carrinho(g, x, y, vazio) {
    D().sombraChao(g, x, y + 2, 20, 0.3);
    g.fillStyle = '#5a4a3a'; g.fillRect(x - 20, y - 22, 40, 16);
    g.fillStyle = '#7a6a5a'; g.fillRect(x - 22, y - 26, 44, 6);
    g.fillStyle = '#3a3030'; for (const dx of [-12, 12]) { g.beginPath(); g.arc(x + dx, y - 5, 5, 0, TAU); g.fill(); }
    g.fillStyle = '#9aa3ad'; for (const dx of [-12, 12]) { g.beginPath(); g.arc(x + dx, y - 5, 2, 0, TAU); g.fill(); }
    g.fillStyle = '#c9a36a'; g.fillRect(x - 18, y - 20, 36, 2);
    if (vazio) { g.fillStyle = '#4a3a2a'; g.fillRect(x - 17, y - 24, 34, 3); }
  }

  function estacao(g, p, t, j) {
    const x = p.x, y = p.y;
    // Plataforma e placa da estação.
    g.fillStyle = '#6b5a4a'; g.fillRect(x - 18, y - 4, 36, 6);
    g.fillStyle = '#4a3a2a'; g.fillRect(x - 22, y - 58, 4, 56);
    g.fillStyle = '#c99a5b'; g.fillRect(x - 36, y - 64, 32, 14);
    g.fillStyle = '#4a2e18'; g.font = '700 8px system-ui'; g.textAlign = 'center'; g.fillText('🛒', x - 20, y - 54);
    if (!(j && j.viagem && j.viagem.escondeCarrinho)) carrinho(g, x + 6, y, true);
    const consertado = j && j.flags.alavanca;
    // Alavanca do freio (ou o encaixe vazio).
    g.fillStyle = '#3a3030'; g.fillRect(x + 20, y - 12, 8, 12);
    if (consertado) { g.strokeStyle = '#9aa3ad'; g.lineWidth = 3; g.beginPath(); g.moveTo(x + 24, y - 12); g.lineTo(x + 30, y - 28); g.stroke(); g.fillStyle = '#c0392b'; g.beginPath(); g.arc(x + 30, y - 29, 3, 0, TAU); g.fill(); }
    else if (Math.floor(t * 2) % 2) { g.fillStyle = 'rgba(255,200,80,.7)'; g.beginPath(); g.arc(x + 24, y - 14, 3, 0, TAU); g.fill(); }
  }

  function barraca(g, p) {
    const x = p.x, y = p.y, cor = p.v > 0.5 ? ['#e8434f', '#f7f0e0'] : ['#3a7fc4', '#f7f0e0'];
    D().sombraChao(g, x, y + 2, 18, 0.3);
    g.fillStyle = '#8a5f3c'; g.fillRect(x - 16, y - 18, 32, 18);
    g.fillStyle = '#6e4a2c'; g.fillRect(x - 16, y - 18, 32, 3); g.fillRect(x - 16, y - 42, 3, 26); g.fillRect(x + 13, y - 42, 3, 26);
    for (let i = 0; i < 4; i++) { g.fillStyle = cor[i % 2]; g.beginPath(); g.moveTo(x - 20 + i * 10, y - 44); g.lineTo(x - 10 + i * 10, y - 44); g.lineTo(x - 10 + i * 10, y - 38); g.quadraticCurveTo(x - 15 + i * 10, y - 34, x - 20 + i * 10, y - 38); g.fill(); }
    for (const [dx, c] of [[-9, '#ff6f9f'], [-2, '#7fd6ff'], [6, '#f2c14e']]) { g.fillStyle = c; g.beginPath(); g.arc(x + dx, y - 22, 3.5, 0, TAU); g.fill(); }
  }

  function bigorna(g, p, t) {
    const x = p.x, y = p.y;
    D().sombraChao(g, x, y + 2, 16, 0.3);
    g.fillStyle = '#5a4a3a'; g.fillRect(x - 9, y - 12, 18, 12);
    g.fillStyle = '#3a3a44'; g.fillRect(x - 16, y - 22, 28, 10); g.beginPath(); g.moveTo(x + 12, y - 22); g.lineTo(x + 20, y - 20); g.lineTo(x + 12, y - 14); g.fill();
    g.fillStyle = '#5a5a66'; g.fillRect(x - 16, y - 22, 28, 3);
    // Brasa da forja atrás.
    const k = 0.5 + 0.5 * Math.sin(t * 5);
    const gr = g.createRadialGradient(x - 22, y - 10, 0, x - 22, y - 10, 20); gr.addColorStop(0, `rgba(255,140,40,${0.5 + 0.3 * k})`); gr.addColorStop(1, 'rgba(255,90,20,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(x - 22, y - 10, 20, 0, TAU); g.fill();
  }

  // Casa genérica (vilarejo, cabana da floresta): porta no lugar certo e letreiro opcional.
  // Cor do telhado de cada casa (variações da casa em pixel art, tools/variantes_casa.py), pela porta.
  const CORES_CASA = {
    vilarejo: { '15,9': 'roxo', '44,9': 'azul', '8,30': '', '18,30': 'verde', '42,30': 'mostarda' },
    floresta: { '68,5': 'cabana' }, vale: { '7,7': 'verde' }, lago: { '6,36': 'azul' },
  };
  const FRACAO_PORTA = 0.648;   // onde fica a porta na largura da imagem da casa

  function casa(g, p) {
    // Casa em pixel art: a porta da imagem cai na porta de verdade; letreiro acima da varanda.
    const nome = 'casa' + (p.cor ? '_' + p.cor : '');
    if (p.cor != null && LB.cenario.objeto(g, nome, p.porta - (FRACAO_PORTA - 0.5) * p.w, p.y + 6, p.w)) {
      if (p.letreiro) {
        g.font = '700 10px system-ui, sans-serif'; g.textAlign = 'center';
        const lw = g.measureText(p.letreiro).width + 14, ly = p.y + 6 - p.w * 0.36;
        g.fillStyle = 'rgba(40,24,12,.85)'; g.fillRect(p.porta - lw / 2 - 1, ly - 1, lw + 2, 18);
        g.fillStyle = '#7a5230'; g.fillRect(p.porta - lw / 2, ly, lw, 16);
        g.fillStyle = '#f7e7c4'; g.fillText(p.letreiro, p.porta, ly + 12);
      }
      return;
    }
    const x = p.x, y = p.y, w = p.w, h = p.h, topo = y - h;
    const v = LB.ruido(p.tx, p.ty, 5);
    const parede = p.estilo === 'cabana' ? '#8a6a48' : ['#e9d8b4', '#f0e2c8', '#e4cfa8'][Math.floor(v * 3)];
    const telhado = p.estilo === 'cabana' ? '#5a4030' : ['#b5523b', '#6d7fa6', '#8a5a9a', '#a8743a'][Math.floor(v * 4)];
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x + 4, y - 4, w, 8);
    g.fillStyle = parede; g.fillRect(x + 4, topo + h * 0.42, w - 8, h * 0.58);
    g.fillStyle = 'rgba(0,0,0,.08)'; for (let i = 0; i < 4; i++) g.fillRect(x + 4, topo + h * 0.42 + i * 16, w - 8, 2);
    g.fillStyle = telhado;
    g.beginPath(); g.moveTo(x - 6, topo + h * 0.48); g.lineTo(x + w / 2, topo - 18); g.lineTo(x + w + 6, topo + h * 0.48); g.closePath(); g.fill();
    g.fillStyle = 'rgba(0,0,0,.15)'; for (let i = 1; i < 5; i++) g.fillRect(x + 2, topo + h * 0.48 - i * 13, w - 4, 2);
    const px = p.porta || x + w / 2;
    g.fillStyle = '#7b4a2a'; g.fillRect(px - 13, y - 42, 26, 42);
    g.fillStyle = '#e0b04a'; g.beginPath(); g.arc(px + 7, y - 20, 2, 0, TAU); g.fill();
    for (const wx of [x + 12, x + w - 34]) {
      if (Math.abs(wx + 11 - px) < 26) continue;
      g.fillStyle = '#8ecae6'; g.fillRect(wx, y - 64, 22, 18);
      g.strokeStyle = '#7b4a2a'; g.lineWidth = 2; g.strokeRect(wx, y - 64, 22, 18);
    }
    if (p.letreiro) {
      g.font = '700 10px system-ui, sans-serif'; g.textAlign = 'center';
      const lw = g.measureText(p.letreiro).width + 14;
      g.fillStyle = '#6e4a2c'; g.fillRect(px - lw / 2, y - 62 - 16, lw, 16);
      g.fillStyle = '#f7e7c4'; g.fillText(p.letreiro, px, y - 66);
    }
  }
  LB.desenho.casa = casa;

  function desenharProp(g, p, j) {
    const t = j.tempo;
    switch (p.tipo) {
      case 'rachadura': rachadura(g, p); return true;
      case 'poste': poste(g, p, t); return true;
      case 'estacao': estacao(g, p, t, j); return true;
      case 'barraca': barraca(g, p); return true;
      case 'bigorna': bigorna(g, p, t); return true;
    }
    return false;
  }

  // Aplica o que já foi mudado nesta área (paredes quebradas).
  function prepararArea(j, id) {
    let mudou = false;
    for (const k of j.flags.rachaduras || []) {
      const [area, pos] = k.split(':');
      if (area !== id) continue;
      const [x, y] = pos.split(',').map(Number);
      if (j.mapa.l[y] && j.mapa.l[y][x] === '%') { j.mapa.l[y][x] = j.mapa.chaoVazio; mudou = true; }
    }
    if (mudou) { j.mapa.props = j.mapa.props.filter((p) => !(p.tipo === 'rachadura' && j.mapa.l[p.ty][p.tx] !== '%')); j.mapa.renderizarChao(); }
    // Letreiros e estilo das casas.
    for (const p of j.mapa.props) {
      if (p.tipo !== 'casa') continue;
      const porta = Math.floor(p.porta / TILE) + ',' + (p.y / TILE - 1);
      p.letreiro = (j.mapa.def.letreiros || {})[porta];
      if (id === 'floresta') p.estilo = 'cabana';
      const cor = (CORES_CASA[id] || {})[porta];
      if (cor != null) p.cor = cor;
    }
    j.bombas = [];
    j._escuro = noEscuro(j, j.line.x, j.line.y - 10) ? 1 : 0;
  }

  function atualizar(j, dt) {
    atualizarBombas(j, dt);
    atualizarBrasa(j, dt);
  }

  LB.mundo = { colocarBomba, atualizar, atualizarBombas, desenharBomba, acoes, desenharEfeito, noEscuro, desenharEscuro, soltarMoedas, desenharProp, prepararArea, carrinho, parDoPoste, cenaGancho };
})(window.LB);
