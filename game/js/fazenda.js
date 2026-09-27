'use strict';

// Capítulo da fazenda: a vidinha da Line e da Bell antes do dragão.
// Acrescenta ao Jogo: preparação das áreas, tarefas, balões de fala, bichos e NPCs.
(function (LB) {
  const T = (n) => n * LB.TILE;
  const $ = (s) => document.querySelector(s);
  const TOTAL_OVOS = 4, TOTAL_CARINHOS = 3;

  const FALAS_BELL = [
    'Que dia lindo, né?',
    'A Mimosa tá cada dia mais gordinha.',
    'Depois a gente toma um café na varanda?',
    'Te amo, sabia?',
    'Cuidado com o galo, ele é ciumento!',
    'O Biscoito não para de te seguir, hein.',
    'Adoro quando você fica toda concentrada.',
    'Olha as borboletas!',
  ];

  Object.defineProperty(LB.Jogo.prototype, 'cenaAtiva', { get() { return !!this.cena; } });

  Object.assign(LB.Jogo.prototype, {

    pontoMapa(nome) {
      const p = this.mapa && this.mapa.def.pontos && this.mapa.def.pontos[nome];
      return p ? { x: T(p.x), y: T(p.y) } : null;
    },

    tarefas() {
      if (!this.flags.tarefas) this.flags.tarefas = { ovos: 0, regador: false, regados: [], racao: false, biscoito: false, carinhos: [] };
      return this.flags.tarefas;
    },

    prepararArea(id, semCena) {
      $('#tarefas').classList.add('oculto');
      if (id === 'fazenda') {
        this.bichos = LB.bichos.povoar(this);
        const cao = this.bichos.find((b) => b.tipo === 'cachorro');
        if (!this.flags.prologo) {
          const tf = this.tarefas();
          const etapa = this.flags.etapa || 'manha';
          this.tint = etapa === 'tarde' ? { cor: '255,180,100', a: 0.14 } : { cor: '255,240,200', a: 0.05 };
          if (cao && tf.biscoito) { cao.comeu = true; cao.seguir = true; }
          const a = this.mapa.def.areas.galinhas;
          for (let i = tf.ovos; i < TOTAL_OVOS; i++) {
            for (let k = 0; k < 30; k++) {
              const x = T(a.x0 + 0.5 + Math.random() * (a.x1 - a.x0)), y = T(a.y0 + 0.7 + Math.random() * (a.y1 - a.y0));
              if (!this.mapa.colide(x, y - 4, 6, 4) && !this.itens.some((o) => Math.hypot(o.x - x, o.y - y) < 30)) { this.itens.push({ tipo: 'ovo', x, y, t: 0 }); break; }
            }
          }
        } else {
          // Depois que o dragão passou: fim de tarde, vaga-lumes e o Biscoito esperando.
          this.tint = { cor: '90,60,130', a: 0.26 };
          this.ambiente.anoitecer();
          if (cao) { cao.comeu = true; cao.seguir = true; }
        }
      } else if (id === 'floresta') {
        this.npcs.push(new LB.Mago(T(7.5), T(13.9)));
      }
    },

    iniciarCapitulo() {
      const tf = this.tarefas();
      this.flags.etapa = this.flags.etapa || 'manha';
      const l = this.line;
      if (this.flags.etapa === 'manha') {
        const porta = this.mapa.def.porta;
        l.x = T(porta.x); l.y = T(porta.y); l.dir = 'FRONT';
        this.bell = new LB.Bell(l.x + 40, l.y + 30, 'LEFT');
        this.bell.lado = -1;
        this.cameraEm(l.x, l.y);
        if (!this.flags.manhaVista) this.iniciarCena(LB.HISTORIA.manha);
        else { this.bell.seguir = true; this.atualizarPainel(true); }
      } else {
        const mesa = this.pontoMapa('mesa');
        l.x = mesa.x; l.y = mesa.y + 30; l.dir = 'FRONT';
        this.bell = new LB.Bell(l.x, l.y, 'FRONT');
        this.comecarTarde();
      }
      return tf;
    },

    comecarTarde() {
      this.flags.etapa = 'tarde';
      this.tint = { cor: '255,180,100', a: 0.14 };
      const l = this.line;
      l.modoDuo = true;
      if (this.bell) { this.bell.visivel = false; this.bell.seguir = false; }
      this.atualizarPainel(true);
      this.dica('maos', LB.entrada.usandoToque() ? 'Leve a Bell até o lago, de mãos dadas.' : 'Leve a Bell até o lago, de mãos dadas (ande com WASD ou setas).');
    },

    estadoCanteiro(p) {
      if (!p.canteiro) return { regada: false };
      const tf = this.tarefas();
      const regada = this.flags.prologo || tf.regados.includes(p.tx + ',' + p.ty);
      return { regada, marcar: !this.flags.prologo && tf.regador && this.flags.etapa === 'manha' };
    },

    // ---------- Laço da vida na fazenda ----------
    atualizarVida(dt) {
      this.ambiente.atualizar(dt, this);
      for (const b of this.bichos) b.atualizar(dt, this);
      for (const n of this.npcs) n.atualizar(dt, this);
      for (const b of this.baloes) b.t += dt;
      this.baloes = this.baloes.filter((b) => b.t < b.dur);
      const l = this.line, r = this.rastroLine, ult = r[r.length - 1];
      if (!ult || Math.hypot(ult.x - l.x, ult.y - l.y) > 4) { r.push({ x: l.x, y: l.y }); if (r.length > 80) r.shift(); }

      if (this.mapa.id !== 'fazenda' || this.flags.prologo || this.cena) return;
      const tf = this.tarefas();
      if (this.bell && this.bell.seguir) {
        this.proximaFala = (this.proximaFala || 10) - dt;
        if (this.proximaFala <= 0) { this.proximaFala = 12 + Math.random() * 10; this.balao(this.bell, FALAS_BELL[Math.floor(Math.random() * FALAS_BELL.length)], 3); }
      }
      if (this.flags.etapa === 'manha') {
        const pronto = tf.ovos >= TOTAL_OVOS && tf.regados.length >= this.mapa.def.canteiros.length && tf.biscoito && tf.carinhos.length >= TOTAL_CARINHOS;
        if (pronto) { this.esperaAlmoco = (this.esperaAlmoco || 0) + dt; if (this.esperaAlmoco > 1.2) { this.esperaAlmoco = 0; this.iniciarCena(LB.HISTORIA.almoco); } }
      } else if (this.flags.etapa === 'tarde') {
        const lago = this.pontoMapa('lago');
        if (Math.random() < dt * 4) this.particulas.emitir('brilho', lago.x + (Math.random() - 0.5) * 30, lago.y - 10, 1, { vel: 10, vz: 20, vida: 1, r: 3 });
        if (Math.hypot(lago.x - l.x, lago.y - l.y) < 44) this.iniciarCena(LB.HISTORIA.porDoSol);
      }
      this.atualizarPainel();
    },

    atualizarPainel(forcar) {
      const el = $('#tarefas');
      if (this.mapa.id !== 'fazenda' || this.flags.prologo || this.cena) { el.classList.add('oculto'); return; }
      const tf = this.tarefas();
      let html;
      if (this.flags.etapa === 'tarde') html = '<b>Fim de tarde</b><div>Levar a Bell até o lago</div>';
      else {
        const nC = this.mapa.def.canteiros.length;
        const item = (ok, txt) => `<div class="${ok ? 'ok' : ''}">${ok ? '✔' : '○'} ${txt}</div>`;
        html = '<b>Tarefas do dia</b>' +
          item(tf.ovos >= TOTAL_OVOS, `Pegar os ovos (${Math.min(tf.ovos, TOTAL_OVOS)}/${TOTAL_OVOS})`) +
          item(tf.regados.length >= nC, tf.regador ? `Regar a horta (${tf.regados.length}/${nC})` : 'Pegar o regador no poço') +
          item(tf.biscoito, tf.racao ? 'Pôr a ração na tigela' : 'Pegar a ração no celeiro') +
          item(tf.carinhos.length >= TOTAL_CARINHOS, `Carinho nos bichinhos (${Math.min(tf.carinhos.length, TOTAL_CARINHOS)}/${TOTAL_CARINHOS})`);
      }
      if (forcar || html !== this.painelHtml) { el.innerHTML = html; this.painelHtml = html; }
      el.classList.remove('oculto');
    },

    // ---------- Ações de interação na fazenda e na floresta ----------
    acoesExtras(acoes, perto) {
      const l = this.line;
      for (const n of this.npcs) if (perto(n.x, n.y + 24, 64)) acoes.push({ texto: 'Conversar', x: n.x, y: n.y - 90, fazer: () => { n.fala = 3; this.iniciarCena(LB.HISTORIA.mago, { semPular: true }); } });
      for (const b of this.bichos) {
        if (b.estado === 'indoComer' || b.estado === 'comendo') continue;
        const r = b.tipo === 'vaca' ? 50 : b.tipo === 'pato' ? 60 : 38;
        if (perto(b.x, b.y, r)) acoes.push({ texto: 'Carinho', x: b.x, y: b.y - b.cfg.altura - 14, px: b.x, py: b.y, prio: 0, fazer: () => this.fazerCarinho(b) });
      }
      if (this.mapa.id !== 'fazenda' || this.flags.prologo) return;
      const tf = this.tarefas();
      if (this.bell && this.bell.visivel && this.bell.seguir && perto(this.bell.x, this.bell.y, 36)) {
        acoes.push({ texto: 'Conversar', x: this.bell.x, y: this.bell.y - 80, fazer: () => {
          this.bell.anim.tocar('BELL_LAUGH', true);
          this.balao(this.bell, FALAS_BELL[Math.floor(Math.random() * FALAS_BELL.length)], 2.6);
          this.particulas.emitir('coracao', this.bell.x, this.bell.y - 70, 2, { vel: 20, vida: 1.2 });
        } });
      }
      if (this.flags.etapa !== 'manha') return;
      for (const it of this.itens) {
        if (it.tipo === 'ovo' && perto(it.x, it.y + 6, 34)) acoes.push({ prio: 1, texto: 'Pegar ovo', x: it.x, y: it.y - 28, fazer: () => l.agachar(() => {
          it.pego = true; this.itens = this.itens.filter((o) => o !== it); tf.ovos++;
          this.particulas.emitir('brilho', it.x, it.y - 10, 5, { vel: 30, vida: 0.6, r: 3 });
          if (tf.ovos >= TOTAL_OVOS && this.bell) this.balao(this.bell, 'Quatro ovinhos! Vai ter bolo hoje.', 2.8);
          this.salvar();
        }) });
      }
      const poco = this.pontoMapa('regador');
      if (!tf.regador && perto(poco.x, poco.y + 6, 44)) acoes.push({ prio: 1, texto: 'Pegar regador', x: poco.x, y: poco.y - 56, fazer: () => {
        tf.regador = true; this.particulas.emitir('gota', poco.x, poco.y - 20, 8, { vel: 40, vz: 60, vida: 0.6, r: 2 });
        if (this.bell) this.balao(this.bell, 'Rega as cenouras com carinho!', 2.4);
      } });
      if (tf.regador) for (const p of this.mapa.props) {
        if (p.tipo !== 'planta' || !p.canteiro) continue;
        const k = p.tx + ',' + p.ty;
        if (tf.regados.includes(k) || !perto(p.x, p.y + 4, 40)) continue;
        acoes.push({ prio: 1, texto: 'Regar', x: p.x, y: p.y - 34, fazer: () => l.agachar(() => {
          tf.regados.push(k);
          this.particulas.emitir('gota', p.x, p.y - 16, 14, { vel: 50, vz: 40, vida: 0.7, r: 2 });
          if (tf.regados.length >= this.mapa.def.canteiros.length && this.bell) this.balao(this.bell, 'A horta tá feliz. E eu também!', 2.6);
          this.salvar();
        }) });
      }
      const racao = this.pontoMapa('racao');
      if (!tf.racao && !tf.biscoito && perto(racao.x, racao.y, 46)) acoes.push({ prio: 1, texto: 'Pegar ração', x: racao.x, y: racao.y - 60, fazer: () => { tf.racao = true; if (this.bell) this.balao(this.bell, 'O Biscoito já tá sentindo o cheiro!', 2.4); } });
      const tigela = this.pontoMapa('tigela');
      if (tf.racao && !tf.biscoito && perto(tigela.x, tigela.y, 44)) acoes.push({ prio: 1, texto: 'Servir ração', x: tigela.x, y: tigela.y - 30, fazer: () => l.agachar(() => {
        tf.racao = false; tf.biscoito = true;
        const cao = this.bichos.find((b) => b.tipo === 'cachorro');
        if (cao) { cao.estado = 'indoComer'; cao.ignorarColisao = true; this.balao(cao, 'AU AU AU!', 1.4); setTimeout(() => { cao.seguir = true; }, 4500); }
        this.salvar();
      }) });
    },

    fazerCarinho(b) {
      b.carinho(this);
      if (this.mapa.id === 'fazenda' && !this.flags.prologo) {
        const tf = this.tarefas();
        if (!tf.carinhos.includes(b.tipo)) {
          tf.carinhos.push(b.tipo);
          if (this.bell && tf.carinhos.length === TOTAL_CARINHOS) this.balao(this.bell, 'Os bichinhos te amam. Eu entendo eles.', 2.8);
        }
      }
    },

    // ---------- Balões de fala ----------
    balao(ent, texto, dur) {
      this.baloes = this.baloes.filter((b) => b.ent !== ent);
      this.baloes.push({ ent, texto, t: 0, dur: dur || 1.5 });
    },

    desenharBaloes(g) {
      for (const b of this.baloes) {
        const e = b.ent;
        if (e.visivel === false) continue;
        const alt = e.cfg ? e.cfg.altura + 10 : 96;
        const x = e.x, y = e.y - alt - (e.z || 0) - Math.min(1, b.t * 6) * 4;
        const a = Math.min(1, b.t * 6, (b.dur - b.t) * 4);
        g.save();
        g.globalAlpha = a;
        g.font = '600 9px system-ui, sans-serif'; g.textAlign = 'center';
        const w = g.measureText(b.texto).width + 12, h = 15;
        g.fillStyle = 'rgba(255,255,255,.95)';
        g.beginPath(); g.roundRect ? g.roundRect(x - w / 2, y - h, w, h, 6) : g.rect(x - w / 2, y - h, w, h); g.fill();
        g.beginPath(); g.moveTo(x - 3, y); g.lineTo(x + 3, y); g.lineTo(x, y + 4); g.fill();
        g.fillStyle = '#3a2940'; g.fillText(b.texto, x, y - 4.5);
        g.restore();
      }
    },

    desenharTigela(g, p) {
      const tf = this.flags.tarefas || {};
      const cheia = tf.biscoito && !(this.bichos.find((b) => b.tipo === 'cachorro') || {}).comeu;
      LB.desenho.sombraChao(g, p.x, p.y + 1, 9, 0.2);
      g.fillStyle = '#d63a3a'; g.beginPath(); g.ellipse(p.x, p.y - 2, 9, 4, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#a82a2a'; g.beginPath(); g.ellipse(p.x, p.y - 3, 7, 2.6, 0, 0, Math.PI * 2); g.fill();
      if (cheia) { g.fillStyle = '#8a5a2b'; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(p.x - 4 + (i % 3) * 4, p.y - 4 - Math.floor(i / 3) * 1.5, 1.6, 0, Math.PI * 2); g.fill(); } }
    },

    desenharOvo(g, it) {
      LB.desenho.sombraChao(g, it.x, it.y, 5, 0.25);
      g.fillStyle = '#fff8ea'; g.beginPath(); g.ellipse(it.x, it.y - 5, 4, 5.2, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.ellipse(it.x - 1.3, it.y - 7, 1.2, 1.6, 0, 0, Math.PI * 2); g.fill();
      if (Math.sin(this.tempo * 3 + it.x) > 0.9) { g.fillStyle = '#fff'; LB.desenho.estrela(g, it.x + 5, it.y - 11, 2.5); }
    },
  });
})(window.LB);
