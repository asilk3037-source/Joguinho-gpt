'use strict';

// Inteligência dos inimigos: linha de visão, caminho pela grade (contornam paredes e árvores),
// alerta entre vizinhos, separação para não se amontoarem, e o Morcego das minas.
(function (LB) {
  const TAU = Math.PI * 2;
  const TILE = LB.TILE;
  // O que bloqueia a visão (água, fendas e brasa não bloqueiam).
  const TAPA_VISAO = new Set(['#', 'T', 'H', 'D', 'B', 'K', 'I', 'Z', 'g', '%', 'E', 'W', 'b', 'M', 'P']);

  function linhaDeVisao(mapa, x0, y0, x1, y1) {
    const d = Math.hypot(x1 - x0, y1 - y0), passos = Math.ceil(d / 12);
    for (let i = 1; i < passos; i++) {
      const k = i / passos;
      if (TAPA_VISAO.has(mapa.tileEm(x0 + (x1 - x0) * k, y0 - 12 + (y1 - y0) * k))) return false;
    }
    return true;
  }

  // Caminho em tiles (BFS limitado). Devolve a lista de pontos (centro dos tiles) até o alvo.
  function caminho(mapa, x0, y0, x1, y1, max) {
    const tx0 = Math.floor(x0 / TILE), ty0 = Math.floor((y0 - 4) / TILE);
    const tx1 = Math.floor(x1 / TILE), ty1 = Math.floor((y1 - 4) / TILE);
    if (tx0 === tx1 && ty0 === ty1) return [];
    const w = mapa.w, lim = max || 600;
    const veio = new Map();
    const chave = (x, y) => y * w + x;
    const fila = [[tx0, ty0]];
    veio.set(chave(tx0, ty0), -1);
    let achou = false, n = 0;
    while (fila.length && n++ < lim) {
      const [x, y] = fila.shift();
      if (x === tx1 && y === ty1) { achou = true; break; }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy, k = chave(nx, ny);
        if (veio.has(k) || mapa.solido(nx, ny) || mapa.tile(nx, ny) === 'l') continue;
        veio.set(k, chave(x, y));
        fila.push([nx, ny]);
      }
    }
    if (!achou) return null;
    const pontos = [];
    let k = chave(tx1, ty1);
    while (k !== -1 && k !== chave(tx0, ty0)) { pontos.push({ x: (k % w + 0.5) * TILE, y: (Math.floor(k / w) + 0.8) * TILE }); k = veio.get(k); }
    return pontos.reverse();
  }

  // Anda em direção ao alvo: reto se enxerga, senão pelo caminho da grade (recalculado de vez em quando).
  function seguir(e, jogo, ax, ay, vel, dt) {
    const m = jogo.mapa;
    const dx = ax - e.x, dy = ay - e.y, d = Math.hypot(dx, dy) || 1;
    if (linhaDeVisao(m, e.x, e.y, ax, ay)) {
      e.rota = null;
      e.mover(dx / d * vel * dt, dy / d * vel * dt, jogo);
      return d;
    }
    e.tRota = (e.tRota || 0) - dt;
    if (!e.rota || e.tRota <= 0) { e.rota = caminho(m, e.x, e.y, ax, ay) || []; e.tRota = 0.6; }
    const p = e.rota[0];
    if (!p) { e.mover(dx / d * vel * dt, dy / d * vel * dt, jogo); return d; }
    const px = p.x - e.x, py = p.y - e.y, pd = Math.hypot(px, py);
    if (pd < 6) e.rota.shift();
    else e.mover(px / pd * vel * dt, py / pd * vel * dt, jogo);
    return d;
  }

  // Um inimigo que vê a Line avisa os vizinhos.
  function alertar(jogo, quem, raio) {
    for (const e of jogo.inimigos) {
      if (e === quem || !e.vivo || e.golem || e.estado === 'morrendo') continue;
      if (Math.hypot(e.x - quem.x, e.y - quem.y) > (raio || 220)) continue;
      if (e.aoAlerta) e.aoAlerta(jogo);
    }
  }

  // Empurra inimigos que estão encostados uns nos outros.
  function separar(jogo, dt) {
    const lista = jogo.inimigos.filter((e) => e.vivo && !e.golem && e.estado !== 'morrendo');
    for (let i = 0; i < lista.length; i++) for (let k = i + 1; k < lista.length; k++) {
      const a = lista[i], b = lista[k];
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
      const min = (a.raio || 12) + (b.raio || 12);
      if (d > 0.01 && d < min) {
        const f = (min - d) * 0.5 * Math.min(1, dt * 10);
        if (a.mover) a.mover(-dx / d * f, -dy / d * f, jogo);
        if (b.mover) b.mover(dx / d * f, dy / d * f, jogo);
      }
    }
  }

  // ---------------- Morcego das minas ----------------
  // Dorme pendurado no escuro, acorda com a Line perto e ataca em rasantes curvos.
  class Morcego {
    constructor(x, y) {
      this.x = x; this.y = y; this.x0 = x; this.y0 = y;
      this.hp = 1; this.raio = 10; this.vivo = true; this.inimigo = true;
      this.estado = 'dormindo'; this.t = Math.random() * 2; this.lado = 1; this.flash = 0; this.z = 34;
      this.ang = Math.random() * TAU; this.vx = 0; this.vy = 0;
    }
    mover(dx, dy, jogo) {
      const bloq = (x, y) => TAPA_VISAO.has(jogo.mapa.tileEm(x, y - 4)) || jogo.mapa.tileEm(x, y - 4) === 'o';
      if (!bloq(this.x + dx, this.y)) this.x += dx;
      if (!bloq(this.x, this.y + dy)) this.y += dy;
    }
    aoAlerta() { if (this.estado === 'dormindo') { this.estado = 'voar'; this.t = 0; } }
    atualizar(dt, jogo) {
      this.t += dt; this.flash = Math.max(0, this.flash - dt);
      if (jogo.cena) return;
      const l = jogo.line, dx = l.x - this.x, dy = l.y - this.y, d = Math.hypot(dx, dy) || 1;
      if (Math.abs(dx) > 2) this.lado = dx < 0 ? -1 : 1;
      const lanterna = LB.mochila.tem(jogo, 'lanterna');
      switch (this.estado) {
        case 'dormindo':
          if (d < (lanterna ? 170 : 110) && l.estado !== 'morta') { this.estado = 'voar'; this.t = 0; jogo.balao(this, '!', 0.6); }
          break;
        case 'voar': {
          // Circula em volta da Line e, de tempos em tempos, dá um rasante.
          this.ang += dt * 2.2;
          const ax = l.x + Math.cos(this.ang) * 80, ay = l.y + Math.sin(this.ang) * 50;
          this.mover((ax - this.x) * Math.min(1, dt * 2.5), (ay - this.y) * Math.min(1, dt * 2.5), jogo);
          if (this.t > 1.6 * LB.dif().ritmo && d < 200) { this.estado = 'rasante'; this.t = 0; this.vx = dx / d * 230; this.vy = dy / d * 230; }
          if (d > 360) { this.estado = 'voltar'; this.t = 0; }
          break;
        }
        case 'rasante':
          this.mover(this.vx * dt, this.vy * dt, jogo);
          if (Math.hypot(l.x - this.x, l.y - this.y) < 18) { const r = l.receberDano(jogo, 1, false, this.x, this.y); if (r) { this.estado = 'voar'; this.t = 0; } }
          if (this.t > 0.5) { this.estado = 'voar'; this.t = 0; }
          break;
        case 'voltar':
          seguir(this, jogo, this.x0, this.y0, 90, dt);
          if (Math.hypot(this.x0 - this.x, this.y0 - this.y) < 10) { this.estado = 'dormindo'; }
          if (d < 140) { this.estado = 'voar'; this.t = 0; }
          break;
        case 'atordoado':
          this.mover(this.vx * dt, this.vy * dt, jogo); this.vx *= 0.9; this.vy *= 0.9;
          if (this.t > 0.35) { this.estado = 'voar'; this.t = 0; }
          break;
        case 'morrendo':
          this.z = Math.max(0, this.z - dt * 120);
          if (this.t > 0.4) { this.vivo = false; jogo.aoDerrotarInimigo(this); }
          break;
      }
    }
    receberGolpe(jogo, dano, ox, oy, empurra) {
      if (this.estado === 'morrendo' || this.estado === 'dormindo' && dano < 1) return false;
      this.hp -= dano; this.flash = 0.2;
      const d = Math.hypot(this.x - ox, this.y - oy) || 1;
      this.vx = (this.x - ox) / d * (empurra || 120) * 1.5; this.vy = (this.y - oy) / d * (empurra || 120) * 1.5;
      if (this.hp <= 0) { this.estado = 'morrendo'; this.t = 0; } else { this.estado = 'atordoado'; this.t = 0; }
      return true;
    }
    desenharSombra(g) { LB.desenho.sombraChao(g, this.x, this.y, 7, 0.2); }
    desenhar(g, jogo) {
      const t = jogo.tempo, y = this.y - this.z + (this.estado === 'dormindo' ? 0 : Math.sin(t * 8 + this.x) * 3);
      const bate = this.estado === 'dormindo' ? 0.2 : Math.sin(t * 22) ;
      g.save(); g.translate(this.x, y); g.scale(this.lado, 1);
      if (this.estado === 'dormindo') g.rotate(Math.PI);
      g.fillStyle = this.flash > 0 ? '#fff' : '#3a2a44';
      g.beginPath(); g.ellipse(0, 0, 6, 5, 0, 0, TAU); g.fill();
      for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * 4, -1); g.quadraticCurveTo(s * 12, -8 - bate * 6, s * 18, -2 + bate * 4); g.quadraticCurveTo(s * 12, 1, s * 4, 3); g.fill(); }
      g.beginPath(); g.moveTo(-3, -4); g.lineTo(-2, -8); g.lineTo(0, -4); g.moveTo(1, -4); g.lineTo(3, -8); g.lineTo(3.5, -4); g.fill();
      g.fillStyle = this.estado === 'dormindo' ? '#6a5a74' : '#ff5a5a'; g.fillRect(-3, -2, 1.8, 1.8); g.fillRect(1.5, -2, 1.8, 1.8);
      g.restore();
    }
  }

  LB.ia = { linhaDeVisao, caminho, seguir, alertar, separar, TAPA_VISAO };
  LB.Morcego = Morcego;
})(window.LB);
