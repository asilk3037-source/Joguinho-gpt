'use strict';

// Magia da Line (Raio de Luz e Chuva de Estrelas), cristais, tochas, barreiras,
// fontes e as criaturas das Ruínas Encantadas e da Montanha de Brasa.
(function (LB) {
  const TAU = Math.PI * 2;
  const TILE = LB.TILE;
  const T = (n) => n * TILE;
  const D = () => LB.desenho;
  // A luz passa por cima de água, lava e fendas, mas para em paredes e objetos altos.
  const BLOQUEIA_LUZ = new Set(['#', 'T', 'I', 'Z', 'R', 'H', 'D', 'B', 'K', 'o', 'A', 'U', 'C', 'S', 'P', 'M', 'f', 'n', 'm', 'k', 'v', 'g', 'q']);
  const CUSTO_RAIO = 1, CUSTO_ESTRELA = 3;

  // ---------------- Projéteis ----------------
  function lancar(jogo, o) {
    jogo.projeteis.push(Object.assign({ t: 0, z: 30, r: 6, max: 1.4, dano: 1 }, o));
  }

  // Alvo do Raio de Luz: o inimigo ou cristal apagado mais perto, à frente da Line.
  function alvoDoRaio(jogo, line) {
    const fx = line.dir === 'LEFT' || line.dir === 'RIGHT' ? line.lado : 0;
    const fy = line.dir === 'BACK' ? -1 : line.dir === 'FRONT' ? 1 : 0;
    // O Guardião é alvo certo: com ele por perto, a luz vai nele mesmo com a Line virada para outro lado.
    const cand = jogo.alvos().map((e) => ({ x: e.x, y: e.y - (e.chefe ? 20 : 0), sempre: !!e.golem }));
    for (const p of jogo.mapa.props) if ((p.tipo === 'cristal' || p.tipo === 'tocha') && !p.aceso) cand.push({ x: p.x, y: p.y - 2 });
    let melhor = null, md = 330;
    for (const c of cand) {
      const dx = c.x - line.x, dy = c.y - line.y, d = Math.hypot(dx, dy);
      if (d < 8 || d > md) continue;
      if (!c.sempre && (dx * fx + dy * fy) / d < 0.35) continue;
      md = d; melhor = c;
    }
    return melhor ? { x: melhor.x - line.x, y: melhor.y - line.y } : { x: fx, y: fy };
  }

  function raio(jogo, line) {
    const v = alvoDoRaio(jogo, line), m = Math.hypot(v.x, v.y) || 1;
    const ox = line.x + (v.x / m) * 18, oy = line.y + (v.y / m) * 10;
    lancar(jogo, { dono: 'line', tipo: 'luz', x: ox, y: oy, vx: (v.x / m) * 360, vy: (v.y / m) * 360, r: 7, max: 1.0 });
    jogo.particulas.emitir('brilho', ox, oy - 30, 5, { vel: 60, vida: 0.4, r: 4 });
  }

  // Chuva de Estrelas: explosão em volta da Line que atinge tudo por perto.
  function estrela(jogo, line) {
    const R = 150;
    jogo.efeitos.push({ tipo: 'estrela', x: line.x, y: line.y, t: 0, dur: 0.8, r: R });
    jogo.particulas.emitir('brilho', line.x, line.y - 20, 30, { vel: 220, vida: 0.8, r: 7 });
    jogo.tremer(5, 0.25); jogo.flashTela = Math.max(jogo.flashTela, 0.18);
    for (const e of jogo.alvos()) {
      const d = Math.hypot(e.x - line.x, (e.y - line.y) * 1.2);
      if (d > R + (e.chefe ? 60 : e.raio || 12)) continue;
      acertarComLuz(jogo, e, 3, line.x, line.y);
    }
    for (const p of jogo.mapa.props) if ((p.tipo === 'cristal' || p.tipo === 'tocha') && !p.aceso && Math.hypot(p.x - line.x, p.y - line.y) < R) acender(jogo, p);
  }

  function acertarComLuz(jogo, e, dano, ox, oy) {
    const ok = e.receberMagia ? e.receberMagia(jogo, dano, ox, oy) : e.receberGolpe(jogo, dano, ox, oy, 90);
    if (ok) jogo.particulas.emitir('brilho', e.x, e.y - (e.chefe ? 60 : 24), 8, { vel: 90, vida: 0.5, r: 5 });
    return ok;
  }

  function atualizarProjeteis(jogo, dt) {
    const l = jogo.line, m = jogo.mapa;
    for (const p of jogo.projeteis) {
      p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.tipo === 'pedra') p.z = Math.max(0, 40 + 60 * Math.sin(Math.min(1, p.t / p.max) * Math.PI) - p.t * 20);
      if (p.t > p.max) { p.morto = true; estourar(jogo, p); continue; }
      if (p.tipo === 'luz' && Math.random() < 0.7) jogo.particulas.emitir('brilho', p.x, p.y - p.z, 1, { vel: 15, vida: 0.35, r: 3 });
      if (p.tipo === 'fogo' && Math.random() < 0.6) jogo.particulas.emitir('brasa', p.x, p.y - p.z, 1, { vel: 10, vida: 0.4, r: 2 });
      // Paredes, cristais, tochas e espinhos.
      const tx = Math.floor(p.x / TILE), ty = Math.floor((p.y - 2) / TILE), c = m.tile(tx, ty);
      if (p.dono === 'line' && (c === 'Q' || c === 'Y')) {
        const alvo = m.props.find((o) => o.tx === tx && o.ty === ty);
        if (alvo && !alvo.aceso) acender(jogo, alvo);
        p.morto = true; estourar(jogo, p); continue;
      }
      if (p.dono === 'line' && c === 'X') { jogo.cortarEspinho(tx, ty); p.morto = true; estourar(jogo, p); continue; }
      if (BLOQUEIA_LUZ.has(c) && p.tipo !== 'pedra') { p.morto = true; estourar(jogo, p); continue; }
      if (p.dono === 'line') {
        for (const e of jogo.alvos()) {
          const alcance = e.chefe ? (e.alturaVoo > 80 ? 0 : 70) : (e.raio || 12) + 10;
          if (Math.hypot(e.x - p.x, (e.y - (e.chefe ? 10 : 0) - p.y) * 1.2) < alcance) {
            acertarComLuz(jogo, e, p.dano, p.x - p.vx * 0.05, p.y - p.vy * 0.05);
            p.morto = true; estourar(jogo, p); break;
          }
        }
      } else if (l && l.estado !== 'morta' && Math.hypot(l.x - p.x, (l.y - p.y) * 1.3) < 16) {
        const r = l.receberDano(jogo, p.dano, false, p.x, p.y, { pulavel: p.tipo !== 'pedra' });
        if (r) { p.morto = true; estourar(jogo, p); }
      }
    }
    jogo.projeteis = jogo.projeteis.filter((p) => !p.morto);
  }

  function estourar(jogo, p) {
    const tipo = p.tipo === 'luz' ? 'brilho' : p.tipo === 'fogo' ? 'brasa' : p.tipo === 'pedra' ? 'pedra' : 'agua';
    jogo.particulas.emitir(tipo, p.x, p.y - p.z, 8, { vel: 80, vida: 0.4, r: tipo === 'brilho' ? 5 : 3, vz: tipo === 'pedra' ? 90 : 0 });
    if (p.tipo === 'pedra') jogo.particulas.emitir('poeira', p.x, p.y, 5, { vel: 50 });
  }

  function desenharProjetil(g, p, t) {
    const X = p.x, Y = p.y - p.z;
    if (p.tipo === 'pedra') {
      D().sombraChao(g, p.x, p.y, 8, 0.3);
      g.fillStyle = '#6d6a60'; g.beginPath(); g.ellipse(X, Y, 9, 8, t * 6, 0, TAU); g.fill();
      g.fillStyle = '#8a877b'; g.beginPath(); g.ellipse(X - 2, Y - 2, 4, 3, 0, 0, TAU); g.fill();
      return;
    }
    const cores = { luz: ['255,255,255', '140,220,255'], orbe: ['230,245,255', '90,160,255'], fogo: ['255,240,170', '255,110,40'] }[p.tipo] || ['255,255,255', '200,200,255'];
    D().sombraChao(g, p.x, p.y, 5, 0.18);
    const R = p.r * (1 + 0.15 * Math.sin(t * 30 + p.x));
    const gr = g.createRadialGradient(X, Y, 0, X, Y, R * 2.6);
    gr.addColorStop(0, `rgba(${cores[0]},1)`); gr.addColorStop(0.35, `rgba(${cores[1]},.85)`); gr.addColorStop(1, `rgba(${cores[1]},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(X, Y, R * 2.6, 0, TAU); g.fill();
    if (p.tipo === 'luz') {
      const a = Math.atan2(p.vy, p.vx);
      g.strokeStyle = 'rgba(160,230,255,.6)'; g.lineWidth = R; g.lineCap = 'round';
      g.beginPath(); g.moveTo(X, Y); g.lineTo(X - Math.cos(a) * 26, Y - Math.sin(a) * 26 * 0.8); g.stroke();
    }
  }

  // ---------------- Cristais, tochas e barreiras ----------------
  function chave(jogo, p) { return jogo.mapa.id + ':' + p.tx + ',' + p.ty; }

  function acender(jogo, p, silencioso) {
    if (p.aceso) return;
    p.aceso = true;
    const f = jogo.flags;
    f.luz = f.luz || [];
    if (!f.luz.includes(chave(jogo, p))) f.luz.push(chave(jogo, p));
    if (silencioso) return;
    const fogo = p.tipo === 'tocha';
    jogo.particulas.emitir(fogo ? 'brasa' : 'brilho', p.x, p.y - 36, 16, { vel: 90, vz: 60, vida: 0.8, r: fogo ? 2.5 : 5 });
    jogo.flashTela = Math.max(jogo.flashTela, 0.08);
    const grupo = (jogo.mapa.def.barreiras || []).find((b) => b.fontes.includes(p.tx + ',' + p.ty));
    if (grupo && LB.mochila) {
      const n = contarAcesas(jogo, grupo);
      LB.mochila.aviso(`${fogo ? '🔥 Tocha acesa' : '💎 Cristal aceso'} (${n}/${grupo.fontes.length})`);
      if (fogo && n < grupo.fontes.length) jogo.dica('tochas' + n, `Tocha acesa! ${grupo.fontes.length - n === 1 ? 'Falta 1' : 'Faltam ' + (grupo.fontes.length - n)}. As tochas apagadas soltam fumaça: procure no mapa (M).`);
    }
    verificarBarreiras(jogo);
    jogo.salvar();
  }

  // Quantas fontes de luz de uma barreira já estão acesas.
  function contarAcesas(jogo, b) {
    return b.fontes.filter((k) => { const [x, y] = k.split(',').map(Number); const p = jogo.mapa.props.find((o) => o.tx === x && o.ty === y); return p && p.aceso; }).length;
  }

  function verificarBarreiras(jogo, silencioso) {
    const m = jogo.mapa;
    for (const b of m.def.barreiras || []) {
      if (!b.fontes.length || aberta(jogo, b.id)) continue;
      const tudo = b.fontes.every((k) => { const [x, y] = k.split(',').map(Number); const p = m.props.find((o) => o.tx === x && o.ty === y); return p && p.aceso; });
      if (tudo) abrirBarreira(jogo, b.id, silencioso);
    }
  }

  function aberta(jogo, id) { return (jogo.flags.abertas || []).includes(jogo.mapa.id + ':' + id); }

  function abrirBarreira(jogo, id, silencioso) {
    const m = jogo.mapa, b = (m.def.barreiras || []).find((x) => x.id === id);
    if (!b) return;
    const f = jogo.flags;
    f.abertas = f.abertas || [];
    if (!f.abertas.includes(m.id + ':' + id)) f.abertas.push(m.id + ':' + id);
    for (const [x0, y0, x1, y1] of b.tiles) for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      if (m.l[y][x] !== 'Z') continue;
      m.l[y][x] = m.tema === 'ruinas' && m.tile(x, y - 1) === ':' ? ':' : '.';
      if (!silencioso) {
        jogo.particulas.emitir('brilho', T(x + 0.5), T(y + 0.9), 6, { vel: 80, vz: 90, vida: 0.9, r: 5 });
        jogo.particulas.emitir(m.tema === 'montanha' ? 'brasa' : 'agua', T(x + 0.5), T(y + 0.9), 6, { vel: 60, vz: 120, vida: 0.9, r: 2.5 });
      }
    }
    m.props = m.props.filter((p) => !(p.tipo === 'barreira' && m.l[p.ty][p.tx] !== 'Z'));
    m.renderizarChao();
    if (silencioso) return;
    jogo.tremer(4, 0.4);
    jogo.salvar();
    if (id === 'portao') jogo.iniciarCena(LB.HISTORIA.portaoAberto, { semPular: true });
    else if (id !== 'golem') jogo.dica('barreira', 'Uma barreira de luz se desfez! Acenda todos os cristais de cada sala para abrir caminho.');
  }

  // Ao entrar numa área: aplica o que já foi aceso, aberto e coletado.
  function prepararArea(jogo, id) {
    const m = jogo.mapa, f = jogo.flags;
    for (const k of f.luz || []) {
      const [area, pos] = k.split(':');
      if (area !== id) continue;
      const [x, y] = pos.split(',').map(Number);
      const p = m.props.find((o) => o.tx === x && o.ty === y);
      if (p) p.aceso = true;
    }
    for (const k of f.abertas || []) { const [area, grupo] = k.split(':'); if (area === id) abrirBarreira(jogo, grupo, true); }
    verificarBarreiras(jogo, true);
    if (id === 'ruinas') {
      if (!f.golem) jogo.inimigos.push(new Golem(T(m.def.golem.x), T(m.def.golem.y)));
      if (!f.ruinasVistas) jogo.iniciarCena(LB.HISTORIA.ruinas);
    }
    if (id === 'montanha' && !f.montanhaVista) jogo.iniciarCena(LB.HISTORIA.montanha);
  }

  // ---------------- Desenho dos objetos ----------------
  function brilho(g, x, y, r, cor, a) {
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(${cor},${a})`); gr.addColorStop(1, `rgba(${cor},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  }

  function pilar(g, p) {
    const x = p.x, y = p.y;
    D().sombraChao(g, x, y + 2, 16, 0.3);
    g.fillStyle = '#4c5448'; g.fillRect(x - 15, y - 10, 30, 10);
    g.fillStyle = '#7d8775'; g.fillRect(x - 11, y - 70, 22, 60);
    g.fillStyle = '#687261'; g.fillRect(x + 3, y - 70, 8, 60);
    g.fillStyle = '#5a6353'; for (let i = 0; i < 3; i++) g.fillRect(x - 11, y - 56 + i * 16, 22, 2);
    g.fillStyle = '#8f9986'; g.fillRect(x - 15, y - 78, 30, 9);
    g.fillStyle = '#6e8f4c'; g.beginPath(); g.ellipse(x - 8, y - 70, 6, 3, 0, 0, TAU); g.fill();
    if (p.v > 0.5) { g.fillStyle = '#5f8a43'; g.fillRect(x - 11, y - 40, 3, 26); g.fillRect(x - 9, y - 30, 5, 3); }
  }

  function cristal(g, p, t) {
    const x = p.x, y = p.y, flut = Math.sin(t * 2 + p.tx) * 3;
    D().sombraChao(g, x, y + 2, 13, 0.3);
    g.fillStyle = '#5b6157'; g.fillRect(x - 12, y - 12, 24, 12); g.fillStyle = '#737a6e'; g.fillRect(x - 12, y - 14, 24, 4);
    const cy = y - 38 + flut;
    if (p.aceso) { brilho(g, x, cy, 46, '140,230,255', 0.45 + 0.1 * Math.sin(t * 5)); }
    g.fillStyle = p.aceso ? '#c9f4ff' : '#6f6484';
    g.beginPath(); g.moveTo(x, cy - 18); g.lineTo(x + 10, cy); g.lineTo(x, cy + 16); g.lineTo(x - 10, cy); g.closePath(); g.fill();
    g.fillStyle = p.aceso ? '#7fdcff' : '#51476a';
    g.beginPath(); g.moveTo(x, cy - 18); g.lineTo(x + 10, cy); g.lineTo(x, cy + 16); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.moveTo(x - 3, cy - 10); g.lineTo(x - 7, cy); g.lineTo(x - 3, cy + 2); g.closePath(); g.fill();
    if (!p.aceso && Math.floor(t * 2 + p.tx) % 4 === 0) brilho(g, x, cy, 14, '200,170,255', 0.25);
  }

  function altar(g, p, t, aprendido) {
    const x = p.x, y = p.y;
    D().sombraChao(g, x, y + 2, 22, 0.3);
    g.fillStyle = '#596152'; g.fillRect(x - 22, y - 18, 44, 18);
    g.fillStyle = '#7b846f'; g.fillRect(x - 26, y - 24, 52, 8);
    g.fillStyle = '#9fd8ff'; for (let i = 0; i < 3; i++) g.fillRect(x - 16 + i * 14, y - 12, 4, 4);
    const oy = y - 46 + Math.sin(t * 2) * 3;
    brilho(g, x, oy, aprendido ? 18 : 40, '150,230,255', aprendido ? 0.3 : 0.7);
    g.fillStyle = aprendido ? '#7fa9bf' : '#e8fbff'; g.beginPath(); g.arc(x, oy, 8, 0, TAU); g.fill();
    if (!aprendido) for (let i = 0; i < 3; i++) { const a = t * 2 + i * 2.1; D().estrela(g, x + Math.cos(a) * 18, oy + Math.sin(a) * 8, 3); }
  }

  function tocha(g, p, t) {
    const x = p.x, y = p.y;
    D().sombraChao(g, x, y + 2, 12, 0.3);
    g.fillStyle = '#3d302b'; g.fillRect(x - 6, y - 34, 12, 34);
    g.fillStyle = '#5a4640'; g.fillRect(x - 13, y - 42, 26, 9);
    g.fillStyle = '#2a201d'; g.fillRect(x - 10, y - 46, 20, 5);
    if (!p.aceso) {
      // Apagada: carvão em brasa fraca, fumaça subindo e um anel que pulsa, para achar de longe.
      const k = 0.5 + 0.5 * Math.sin(t * 3 + p.tx);
      brilho(g, x, y - 46, 26, '255,120,50', 0.18 + 0.14 * k);
      g.fillStyle = '#4a2a1c'; g.beginPath(); g.ellipse(x, y - 46, 9, 3.5, 0, 0, TAU); g.fill();
      g.fillStyle = `rgba(255,${110 + 60 * k},40,${0.55 + 0.35 * k})`;
      for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(x - 5 + i * 5, y - 47, 1.8, 0, TAU); g.fill(); }
      for (let i = 0; i < 3; i++) {
        const f = (t * 0.45 + i / 3) % 1;
        g.fillStyle = `rgba(150,140,140,${0.45 * (1 - f)})`;
        g.beginPath(); g.arc(x + Math.sin(t * 2 + i * 2) * 5 * f, y - 52 - f * 38, 3 + f * 6, 0, TAU); g.fill();
      }
      g.strokeStyle = `rgba(255,190,110,${0.25 + 0.3 * k})`; g.lineWidth = 2;
      g.beginPath(); g.ellipse(x, y + 1, 18 + 4 * k, 7 + 1.5 * k, 0, 0, TAU); g.stroke();
      return;
    }
    brilho(g, x, y - 56, 54, '255,170,70', 0.45 + 0.08 * Math.sin(t * 9));
    for (let i = 0; i < 3; i++) {
      const h = 18 + 6 * Math.sin(t * 12 + i * 2), dx = (i - 1) * 5;
      g.fillStyle = ['#ff6a1a', '#ffb347', '#fff1b0'][i];
      g.beginPath(); g.moveTo(x + dx - 6 + i * 2, y - 46); g.quadraticCurveTo(x + dx + Math.sin(t * 8 + i) * 4, y - 46 - h, x + dx + 6 - i * 2, y - 46); g.fill();
    }
  }

  function fonte(g, p, t) {
    const x = p.x, y = p.y;
    D().sombraChao(g, x, y + 2, 20, 0.3);
    g.fillStyle = '#6d7568'; g.beginPath(); g.ellipse(x, y - 8, 20, 9, 0, 0, TAU); g.fill();
    g.fillStyle = '#4fc3e8'; g.beginPath(); g.ellipse(x, y - 10, 15, 6, 0, 0, TAU); g.fill();
    g.fillStyle = '#6d7568'; g.fillRect(x - 4, y - 30, 8, 20);
    brilho(g, x, y - 32, 22, '150,235,255', 0.5 + 0.2 * Math.sin(t * 3));
    for (let i = 0; i < 4; i++) { const k = (t * 0.8 + i / 4) % 1; g.fillStyle = `rgba(200,245,255,${1 - k})`; g.beginPath(); g.arc(x + Math.sin(i * 2.4) * 8 * k, y - 32 + k * 20, 1.8, 0, TAU); g.fill(); }
  }

  function barreira(g, p, t) {
    const x = p.x - TILE / 2, y = p.y, h = 58;
    const fogo = p.tema === 'montanha';
    const cor = fogo ? '255,120,60' : '150,120,255';
    const gr = g.createLinearGradient(0, y - h, 0, y);
    gr.addColorStop(0, `rgba(${cor},0)`); gr.addColorStop(0.3, `rgba(${cor},${0.35 + 0.1 * Math.sin(t * 3 + p.tx)})`); gr.addColorStop(1, `rgba(${cor},.6)`);
    g.fillStyle = gr; g.fillRect(x, y - h, TILE, h);
    g.strokeStyle = fogo ? 'rgba(255,220,150,.8)' : 'rgba(210,200,255,.8)'; g.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      const yy = y - ((t * 22 + i * 19 + p.tx * 7) % h);
      g.beginPath(); g.moveTo(x + 4, yy); g.lineTo(x + TILE - 4, yy - 3); g.stroke();
    }
    g.fillStyle = fogo ? '#ffd27a' : '#e6dcff';
    const ry = y - 30 + Math.sin(t * 2 + p.tx) * 4;
    g.font = '12px serif'; g.textAlign = 'center'; g.fillText('ᚱᛟᚾᛊ'[(p.tx + p.ty) % 4], p.x, ry);
  }

  function desenharProp(g, p, jogo) {
    const t = jogo.tempo;
    switch (p.tipo) {
      case 'pilar': pilar(g, p); break;
      case 'cristal': cristal(g, p, t); break;
      case 'altar': altar(g, p, t, !!jogo.flags.magia); break;
      case 'tocha': tocha(g, p, t); break;
      case 'fonte': fonte(g, p, t); break;
      case 'barreira': barreira(g, p, t); break;
    }
  }

  function desenharItemMana(g, it, t) {
    const x = it.x, y = it.y - 12 - Math.sin(t * 4) * 3;
    if (it.t > 11 && Math.floor(t * 8) % 2) return;
    brilho(g, x, y, 14, '120,200,255', 0.5);
    g.fillStyle = '#8fd8ff'; g.beginPath(); g.moveTo(x, y - 8); g.lineTo(x + 6, y); g.lineTo(x, y + 8); g.lineTo(x - 6, y); g.closePath(); g.fill();
    g.fillStyle = '#e8f8ff'; g.fillRect(x - 1.5, y - 4, 3, 4);
  }

  function desenharEfeito(g, f, jogo) {
    if (f.tipo === 'estrela') {
      const k = f.t / f.dur, a = 1 - k;
      g.save(); g.globalCompositeOperation = 'lighter';
      g.strokeStyle = `rgba(180,230,255,${a * 0.9})`; g.lineWidth = 10 * a;
      g.beginPath(); g.ellipse(f.x, f.y - 10, f.r * k, f.r * k * 0.45, 0, 0, TAU); g.stroke();
      g.fillStyle = `rgba(255,250,210,${a})`;
      for (let i = 0; i < 10; i++) { const ang = i / 10 * TAU + k; D().estrela(g, f.x + Math.cos(ang) * f.r * k, f.y - 10 + Math.sin(ang) * f.r * k * 0.45 - 30 * (1 - k), 6 * a + 2); }
      g.restore();
    } else if (f.tipo === 'carga') {
      const l = jogo.line, k = Math.min(1, f.carga || 0);
      g.save(); g.globalCompositeOperation = 'lighter';
      brilho(g, l.x, l.y - 34, 20 + 30 * k, k >= 1 ? '255,250,200' : '140,210,255', 0.25 + 0.35 * k);
      g.restore();
    }
  }

  // HUD: magia em losangos embaixo dos corações.
  function desenharHudMana(g, jogo, s) {
    const l = jogo.line;
    if (!jogo.flags.magia || !l) return;
    const aviso = jogo.avisoMana > 0 && Math.floor(jogo.tempo * 12) % 2;
    for (let i = 0; i < l.manaMax; i++) {
      const x = (24 + i * 17) * s, y = 46 * s, r = 6 * s;
      const val = Math.max(0, Math.min(1, l.mana - i));
      const losango = () => { g.beginPath(); g.moveTo(x, y - r); g.lineTo(x + r * 0.75, y); g.lineTo(x, y + r); g.lineTo(x - r * 0.75, y); g.closePath(); };
      g.fillStyle = aviso ? 'rgba(255,80,80,.6)' : 'rgba(0,0,0,.45)'; losango(); g.fill();
      if (val > 0) {
        g.save(); losango(); g.clip();
        g.fillStyle = val >= 1 ? '#7fd6ff' : '#3d82b8'; g.fillRect(x - r, y + r - val * 2 * r, 2 * r, val * 2 * r);
        g.restore();
      }
    }
  }

  // ---------------- Fogo-fátuo ----------------
  // Luzinha que flutua, mantém distância e atira orbes. Azul nas ruínas, de fogo na montanha.
  class FogoFatuo {
    constructor(x, y, tipo) {
      this.x = x; this.y = y; this.x0 = x; this.y0 = y;
      this.tipo = tipo === 'fogo' ? 'fogo' : 'luz';
      this.hp = 2; this.raio = 12; this.vivo = true; this.inimigo = true;
      this.estado = 'vagar'; this.t = Math.random() * 2; this.f = Math.random() * TAU;
      this.cd = 1.2 + Math.random() * 1.2; this.flash = 0; this.vx = 0; this.vy = 0; this.lado = 1; this.alvo = null;
      this.anim = new LB.Animador('WISP_IDLE');
    }

    mover(dx, dy, jogo) {
      const bloqueado = (x, y) => BLOQUEIA_LUZ.has(jogo.mapa.tileEm(x, y - 4));
      if (!bloqueado(this.x + dx, this.y)) this.x += dx;
      if (!bloqueado(this.x, this.y + dy)) this.y += dy;
    }

    atualizar(dt, jogo) {
      this.t += dt; this.f += dt; this.flash = Math.max(0, this.flash - dt);
      this.anim.atualizar(dt);
      this.anim.tocar(this.estado === 'morrendo' ? 'WISP_DEATH' : this.estado === 'mirar' ? 'WISP_ATTACK' : 'WISP_IDLE');
      if (jogo.cena) return;
      const l = jogo.line, dx = l.x - this.x, dy = l.y - this.y, d = Math.hypot(dx, dy) || 1;
      if (Math.abs(dx) > 2) this.lado = dx < 0 ? -1 : 1;
      switch (this.estado) {
        case 'vagar': {
          if (!this.alvo || this.t > 2.4) { this.t = 0; this.alvo = { x: this.x0 + (Math.random() - 0.5) * 120, y: this.y0 + (Math.random() - 0.5) * 80 }; }
          const ax = this.alvo.x - this.x, ay = this.alvo.y - this.y, ad = Math.hypot(ax, ay);
          if (ad > 4) this.mover(ax / ad * 28 * dt, ay / ad * 28 * dt, jogo);
          if (d < 210 && l.estado !== 'morta') { this.estado = 'cacar'; this.t = 0; }
          break;
        }
        case 'cacar': {
          if (d > 320) { this.estado = 'vagar'; break; }
          const k = d > 170 ? 1 : d < 110 ? -1 : 0;
          const lat = Math.sin(this.f * 1.3);
          this.mover((dx / d * k * 55 - dy / d * lat * 30) * dt, (dy / d * k * 55 + dx / d * lat * 30) * dt, jogo);
          this.cd -= dt;
          if (this.cd <= 0 && d < 280) { this.estado = 'mirar'; this.t = 0; }
          break;
        }
        case 'mirar':
          if (this.t > 0.6) {
            lancar(jogo, { dono: 'inimigo', tipo: this.tipo === 'fogo' ? 'fogo' : 'orbe', x: this.x, y: this.y, z: 26, vx: dx / d * 140, vy: dy / d * 140, r: 5, max: 2.6 });
            this.cd = (2 + Math.random() * 1) * LB.dif().ritmo; this.estado = 'cacar'; this.t = 0;
          }
          break;
        case 'atordoado':
          this.mover(this.vx * dt, this.vy * dt, jogo); this.vx *= 0.88; this.vy *= 0.88;
          if (this.t > 0.4) { this.estado = 'cacar'; this.t = 0; }
          break;
        case 'morrendo':
          if (this.t > 0.4) { this.vivo = false; jogo.aoDerrotarInimigo(this); }
          break;
      }
    }

    receberGolpe(jogo, dano, ox, oy, empurra) {
      if (this.estado === 'morrendo') return false;
      this.hp -= dano; this.flash = 0.2;
      const d = Math.hypot(this.x - ox, this.y - oy) || 1;
      this.vx = (this.x - ox) / d * (empurra || 100) * 1.6; this.vy = (this.y - oy) / d * (empurra || 100) * 1.6;
      if (this.hp <= 0) { this.estado = 'morrendo'; this.t = 0; } else { this.estado = 'atordoado'; this.t = 0; }
      return true;
    }

    desenharSombra(g) { D().sombraChao(g, this.x, this.y, 8, 0.18); }

    desenhar(g, jogo) {
      const t = jogo.tempo, fogo = this.tipo === 'fogo';
      const y = this.y - 30 + Math.sin(this.f * 3) * 5;
      // Arte própria (quando chegar) tem prioridade sobre o desenho no código.
      const st = this.anim.estado(null, this.lado);
      if (st.r.sprite && !st.r.via) { LB.desenharSprite(g, st.r, st.quadro, this.x, y + 30, 64); return; }
      const mor = this.estado === 'morrendo' ? 1 - this.t / 0.4 : 1;
      const carga = this.estado === 'mirar' ? this.t / 0.6 : 0;
      const cor = fogo ? ['255,240,180', '255,120,40'] : ['230,250,255', '110,180,255'];
      const R = (10 + carga * 5) * mor;
      brilho(g, this.x, y, R * 3.2, cor[1], 0.35 * mor);
      for (let i = 1; i <= 4; i++) {
        const k = i / 4;
        g.fillStyle = `rgba(${cor[1]},${0.35 * (1 - k) * mor})`;
        g.beginPath(); g.arc(this.x - this.lado * i * 4 + Math.sin(t * 8 + i) * 2, y + i * 3, R * (1 - k * 0.6), 0, TAU); g.fill();
      }
      const gr = g.createRadialGradient(this.x, y, 0, this.x, y, R);
      gr.addColorStop(0, this.flash > 0 ? '#fff' : `rgba(${cor[0]},1)`); gr.addColorStop(1, `rgba(${cor[1]},.9)`);
      g.fillStyle = gr; g.beginPath(); g.arc(this.x, y, R, 0, TAU); g.fill();
      g.fillStyle = fogo ? '#5a1a08' : '#1c2c55';
      g.fillRect(this.x + this.lado * 2 - 4, y - 2, 2.5, 3.5); g.fillRect(this.x + this.lado * 2 + 2, y - 2, 2.5, 3.5);
    }
  }

  // ---------------- Guardião de Pedra (chefe das ruínas) ----------------
  // A espada não arranha a pedra: o Raio de Luz no cristal do peito abre a guarda por alguns segundos.
  class Golem {
    constructor(x, y) {
      this.x = x; this.y = y; this.x0 = x; this.y0 = y;
      this.hpMax = Math.round(14 * LB.dif().vidaChefe); this.hp = this.hpMax; this.recarga = 0; this.raio = 30; this.vivo = true; this.inimigo = true;
      this.estado = 'dormindo'; this.dormindo = true; this.t = 0; this.exposto = 0; this.flash = 0; this.lado = 1;
      this.ondas = []; this.nome = 'Guardião de Pedra'; this.golem = true; this.passo = 0;
      this.anim = new LB.Animador('GOLEM_SLEEP');
    }

    acordar() { this.dormindo = false; this.estado = 'observar'; this.t = 0; }

    mover(dx, dy, jogo) {
      const m = jogo.mapa;
      if (!m.colide(this.x + dx, this.y - 8, 20, 8)) this.x += dx;
      if (!m.colide(this.x, this.y + dy - 8, 20, 8)) this.y += dy;
    }

    atualizar(dt, jogo) {
      this.t += dt; this.flash = Math.max(0, this.flash - dt);
      this.anim.atualizar(dt);
      this.anim.tocar(this.dormindo ? 'GOLEM_SLEEP' : ({ pisao: 'GOLEM_SLAM', pedra: 'GOLEM_THROW', atordoado: 'GOLEM_STUNNED', morrendo: 'GOLEM_DEATH' })[this.estado] || 'GOLEM_IDLE');
      const l = jogo.line;
      for (const o of this.ondas) {
        o.r += 150 * dt;
        const d = Math.hypot(l.x - o.x, (l.y - o.y) * 1.6);
        if (!o.acertou && Math.abs(d - o.r) < 16) { if (l.receberDano(jogo, 1, false, o.x, o.y, { pulavel: true, bloqueavel: false })) o.acertou = true; }
      }
      this.ondas = this.ondas.filter((o) => o.r < 230);
      this.recarga = Math.max(0, this.recarga - dt);
      if (this.dormindo) {
        if (!jogo.cena && l.estado === 'livre' && Math.hypot(l.x - this.x, l.y - this.y) < 190) jogo.iniciarCena(LB.HISTORIA.golem, { semPular: false }, this);
        return;
      }
      if (jogo.cena && this.estado !== 'morrendo') return;
      const dx = l.x - this.x, dy = l.y - this.y, d = Math.hypot(dx, dy) || 1;
      if (Math.abs(dx) > 6 && this.estado === 'observar') this.lado = dx < 0 ? -1 : 1;
      const raiva = this.hp <= this.hpMax / 2;
      switch (this.estado) {
        case 'observar':
          if (d > 80) { this.mover(dx / d * (raiva ? 42 : 34) * dt, dy / d * (raiva ? 42 : 34) * dt, jogo); this.passo += dt; }
          if (this.t > (raiva ? 1.8 : 2.3) * LB.dif().ritmo) { this.t = 0; this.estado = d < 130 || Math.random() < 0.45 ? 'pisao' : 'pedra'; this.tiros = 1; }
          break;
        case 'pisao':
          if (this.t > 1.15 && !this.bateu) {
            this.bateu = true;
            this.ondas.push({ x: this.x, y: this.y, r: 24 });
            jogo.tremer(6, 0.3);
            jogo.particulas.emitir('poeira', this.x, this.y, 16, { vel: 120, vida: 0.6, r: 5 });
            jogo.particulas.emitir('pedra', this.x, this.y, 8, { vel: 90, vz: 140, vida: 0.8 });
          }
          if (this.t > 1.8) { this.bateu = false; this.estado = 'observar'; this.t = 0; }
          break;
        case 'pedra':
          if (this.t > 0.7) {
            const ang = Math.atan2(dy, dx) + (this.tiros === 2 ? 0.18 : 0);
            lancar(jogo, { dono: 'inimigo', tipo: 'pedra', x: this.x + this.lado * 20, y: this.y - 4, vx: Math.cos(ang) * 170, vy: Math.sin(ang) * 170, z: 60, r: 8, max: Math.min(1.8, d / 170 + 0.2) });
            this.tiros--;
            if (this.tiros > 0) this.t = 0.35;
            else { this.estado = 'observar'; this.t = -0.4; }
          }
          break;
        case 'atordoado':
          this.exposto -= dt;
          if (Math.random() < dt * 6) jogo.particulas.emitir('brilho', this.x + (Math.random() - 0.5) * 30, this.y - 70, 1, { vel: 20, vida: 0.5, r: 3 });
          if (this.exposto <= 0) {
            // Volta a si devagar e deixa um presentinho para a Line.
            this.exposto = 0; this.recarga = 0.8; this.estado = 'observar'; this.t = -0.8; this.bateu = false;
            jogo.itens.push({ tipo: 'mana', x: this.x - this.lado * 50, y: this.y + 20, t: 0 });
            if (jogo.line.hp <= jogo.line.hpMax / 2) jogo.itens.push({ tipo: 'coracao', x: this.x + this.lado * 50, y: this.y + 20, t: 0 });
            jogo.particulas.emitir('brilho', this.x, this.y - 50, 8, { vel: 60, vida: 0.5 });
          }
          break;
        case 'morrendo':
          if (Math.random() < dt * 14) jogo.particulas.emitir('pedra', this.x + (Math.random() - 0.5) * 40, this.y - 40 * Math.random(), 1, { vel: 70, vz: 120, vida: 0.9 });
          if (this.t > 1.6) { this.vivo = false; jogo.aoDerrotarInimigo(this); }
          break;
      }
    }

    receberGolpe(jogo, dano) {
      if (this.dormindo || this.estado === 'morrendo') return false;
      if (this.estado !== 'atordoado' && LB.dif().golemEspada) {
        // Fácil: a espada arranha a pedra mesmo com a guarda fechada (sem derrubar de vez).
        jogo.particulas.emitir('faisca', this.x - this.lado * 10, this.y - 40, 6, { vel: 100, vz: 60, vida: 0.3 });
        this.hp = Math.max(1, this.hp - 0.5); this.flash = 0.1;
        return true;
      }
      if (this.estado !== 'atordoado') {
        jogo.particulas.emitir('faisca', this.x - this.lado * 10, this.y - 40, 8, { vel: 120, vz: 80, vida: 0.35 });
        jogo.dica('golemPedra', 'Clang! A espada não arranha a pedra. Acerte o cristal do peito com a magia (Q) para abrir a guarda!');
        return true;
      }
      this.hp -= dano; this.flash = 0.15;
      if (this.hp <= 0) { this.hp = 0; this.estado = 'morrendo'; this.t = 0; jogo.tremer(8, 1.2); }
      return true;
    }

    // A luz não fere a pedra: só racha o cristal e abre a guarda (a Chuva de Estrelas arranha um pouco).
    receberMagia(jogo, dano) {
      if (this.dormindo || this.estado === 'morrendo') return false;
      this.flash = 0.2;
      if (dano >= 3) this.hp = Math.max(1, this.hp - 1);
      if (this.estado === 'atordoado') return true;
      if (this.recarga > 0) {
        jogo.particulas.emitir('faisca', this.x, this.y - 56, 6, { vel: 90, vz: 60, vida: 0.3 });
        jogo.dica('golemRecarga', 'O cristal do guardião ainda está brilhando forte. Desvie e tente de novo daqui a pouco!');
        return true;
      }
      this.estado = 'atordoado'; this.t = 0; this.exposto = 4.5 * LB.dif().guarda; this.bateu = false;
      jogo.dica('golemAberto', 'O cristal rachou e o guardião ficou tonto! Agora a espada funciona: ataque!');
      return true;
    }

    desenharSombra(g) {
      D().sombraChao(g, this.x, this.y, 34, 0.35);
    }

    desenharAvisos(g, jogo) {
      for (const o of this.ondas) {
        const a = 1 - o.r / 230;
        g.strokeStyle = `rgba(230,200,150,${a})`; g.lineWidth = 10 * a + 3;
        g.beginPath(); g.ellipse(o.x, o.y, o.r, o.r / 1.6, 0, 0, TAU); g.stroke();
      }
      if (this.estado === 'pisao' && this.t < 1.15) {
        const p = 0.25 + 0.2 * Math.sin(jogo.tempo * 18);
        g.strokeStyle = `rgba(255,90,60,${p + 0.2})`; g.lineWidth = 4;
        g.beginPath(); g.ellipse(this.x, this.y, 70, 44, 0, 0, TAU); g.stroke();
      }
    }

    desenhar(g, jogo) {
      const t = jogo.tempo, x = this.x, y = this.y;
      const st = this.anim.estado(null, this.lado);
      if (st.r.sprite && !st.r.via) { if (this.flash > 0) g.filter = 'brightness(2)'; LB.desenharSprite(g, st.r, st.quadro, x, y, 110); g.filter = 'none'; return; }
      const morte = this.estado === 'morrendo' ? Math.min(1, this.t / 1.6) : 0;
      const ergue = this.estado === 'pisao' && this.t < 1.15 ? Math.max(0, this.t) / 1.15 : 0;
      const tonto = this.estado === 'atordoado';
      const anda = Math.sin(this.passo * 6) * 2;
      const resp = this.dormindo ? Math.sin(t * 1.2) * 1 : Math.sin(t * 2) * 1.5;
      g.save();
      if (tonto) { g.translate(x, y); g.rotate(Math.sin(t * 6) * 0.04); g.translate(-x, -y); }
      if (morte) { g.globalAlpha = 1 - morte * 0.8; g.translate(0, morte * 18); }
      const pedra = this.flash > 0 ? '#e8e2d0' : '#8b8676', pedra2 = this.flash > 0 ? '#fff' : '#a19b89', escuro = '#5f5a4d', musgo = '#6e8f4c';
      // Pernas.
      g.fillStyle = escuro; g.fillRect(x - 24, y - 26 + anda, 18, 26 - anda); g.fillRect(x + 6, y - 26 - anda, 18, 26 + anda);
      // Tronco.
      const ty = y - 26 - resp;
      g.fillStyle = pedra; g.fillRect(x - 32, ty - 50, 64, 52);
      g.fillStyle = pedra2; g.fillRect(x - 32, ty - 50, 64, 8);
      g.fillStyle = escuro; g.fillRect(x - 32, ty - 18, 64, 3); g.fillRect(x - 4, ty - 50, 3, 52);
      g.fillStyle = musgo; g.fillRect(x - 30, ty - 50, 20, 5); g.fillRect(x + 12, ty - 8, 16, 4);
      // Braços (sobem antes do pisão).
      const by = ty - 44 - ergue * 34;
      g.fillStyle = pedra; g.fillRect(x - 50, by, 18, 46); g.fillRect(x + 32, by, 18, 46);
      g.fillStyle = escuro; g.fillRect(x - 52, by + 40, 22, 14); g.fillRect(x + 30, by + 40, 22, 14);
      // Cabeça.
      const hy = ty - 72;
      g.fillStyle = pedra; g.fillRect(x - 18, hy, 36, 24);
      g.fillStyle = pedra2; g.fillRect(x - 18, hy, 36, 5);
      const olho = this.dormindo ? 'rgba(80,80,80,.8)' : tonto ? '#9aa' : '#ffb347';
      g.fillStyle = olho; g.fillRect(x - 11 + this.lado * 3, hy + 10, 7, 4); g.fillRect(x + 4 + this.lado * 3, hy + 10, 7, 4);
      if (!this.dormindo && !tonto) brilho(g, x + this.lado * 3, hy + 12, 18, '255,180,70', 0.3);
      // Cristal do peito: brilha protegido; rachado e fraco quando tonto.
      const cx = x, cy = ty - 30;
      if (!tonto && !this.dormindo) brilho(g, cx, cy, 26, '120,220,255', 0.45 + 0.15 * Math.sin(t * 4));
      g.fillStyle = tonto ? '#4d6d80' : this.dormindo ? '#5a6e78' : '#bff0ff';
      g.beginPath(); g.moveTo(cx, cy - 12); g.lineTo(cx + 9, cy); g.lineTo(cx, cy + 12); g.lineTo(cx - 9, cy); g.closePath(); g.fill();
      if (tonto) {
        g.strokeStyle = '#1d2a33'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(cx - 4, cy - 8); g.lineTo(cx + 2, cy); g.lineTo(cx - 2, cy + 8); g.stroke();
        for (let i = 0; i < 3; i++) { const a = t * 4 + i * 2.1; D().estrela(g, x + Math.cos(a) * 28, hy - 10 + Math.sin(a) * 8, 5); }
      }
      if (this.dormindo) { g.fillStyle = 'rgba(230,230,255,.7)'; g.font = '12px system-ui'; g.textAlign = 'center'; g.fillText('z', x + 24, hy - 6 - (t * 8 % 10)); }
      g.restore();
    }
  }

  LB.magia = { contarAcesas, CUSTO_RAIO, CUSTO_ESTRELA, raio, estrela, acender, abrirBarreira, aberta, prepararArea, atualizarProjeteis, desenharProjetil, desenharProp, desenharItemMana, desenharEfeito, desenharHudMana };
  LB.FogoFatuo = FogoFatuo;
  LB.Golem = Golem;
})(window.LB);
