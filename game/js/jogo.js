'use strict';

(function (LB) {
  const TILE = LB.TILE;
  const T = (n) => n * TILE;
  const ALTURA_VISTA = 400;
  const CHAVE_SAVE = 'lineBell.save.v1';
  const $ = (s) => document.querySelector(s);

  class Jogo {
    constructor(canvas) {
      this.canvas = canvas;
      this.g = canvas.getContext('2d');
      this.tempo = 0;
      this.estado = 'menu';
      this.particulas = new LB.Particulas();
      this.efeitos = [];
      this.flags = {};
      this.dicasVistas = new Set();
      this.cam = { x: 0, y: 0 };
      this.camAlvo = null;
      this.treme = { f: 0, t: 0 };
      this.congelado = 0;
      this.fade = 0;
      this.flashTela = 0;
      this.tint = null;
      this.inimigos = [];
      this.itens = [];
      this.redimensionar();
      window.addEventListener('resize', () => this.redimensionar());
    }

    redimensionar() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth, h = window.innerHeight;
      this.canvas.width = Math.round(w * dpr); this.canvas.height = Math.round(h * dpr);
      this.canvas.style.width = w + 'px'; this.canvas.style.height = h + 'px';
      this.escala = Math.min(h / ALTURA_VISTA, w / 400) * dpr;
      this.vw = this.canvas.width / this.escala; this.vh = this.canvas.height / this.escala;
    }

    // ---------------- Fluxo ----------------
    temSave() { try { return !!localStorage.getItem(CHAVE_SAVE); } catch (e) { return false; } }

    salvar() {
      try { localStorage.setItem(CHAVE_SAVE, JSON.stringify({ area: this.mapa ? this.mapa.id : 'fazenda', flags: this.flags })); } catch (e) { /* sem armazenamento */ }
    }

    novoJogo() {
      try { localStorage.removeItem(CHAVE_SAVE); } catch (e) { /* ok */ }
      this.flags = {};
      this.dicasVistas.clear();
      this.iniciarArea('fazenda', null, true);
      this.iniciarCapitulo();
    }

    continuar() {
      let s = null;
      try { s = JSON.parse(localStorage.getItem(CHAVE_SAVE)); } catch (e) { /* ok */ }
      if (!s) return this.novoJogo();
      this.flags = s.flags || {};
      let area = s.area === 'campina' || !s.area ? 'fazenda' : s.area;
      if (!this.flags.prologo) area = 'fazenda';
      this.iniciarArea(area, null, !this.flags.prologo);
      if (!this.flags.prologo) this.iniciarCapitulo();
    }

    tentarDeNovo() {
      $('#derrota').classList.add('oculto');
      this.iniciarArea(this.mapa.id);
    }

    voltarAoMenu() {
      this.estado = 'menu';
      this.cena = null;
      LB.dialogo.esconder();
      this.esconderTitulo();
      LB.ui.mostrarMenu();
    }

    iniciarArea(id, chegada, semCenaDeEntrada) {
      this.estado = 'jogo';
      this.mapa = new LB.Mapa(id);
      this.particulas.lista = [];
      this.efeitos = [];
      this.inimigos = [];
      this.itens = [];
      this.bell = null; this.dragao = null; this.duo = null; this.olho = null;
      this.chefeAtivo = false; this.promptFinal = false; this.presa = null; this.jaulaAberta = false;
      this.fade = 0; this.flashTela = 0; this.congelado = 0;
      this.tint = id === 'covil' ? { cor: '255,90,30', a: 0.08 } : null;
      this.cena = null;
      this.ambiente = new LB.cenario.Ambiente(this.mapa);
      this.bichos = []; this.npcs = []; this.baloes = []; this.rastroLine = []; this.acaoAtual = null;
      $('#derrota').classList.add('oculto');

      // Mudanças que ficam salvas (espinhos cortados, baú aberto).
      for (const k of this.flags.cortados || []) {
        const [x, y] = k.split(',').map(Number);
        if (id === 'floresta') this.mapa.l[y][x] = '.';
      }
      if (id === 'floresta' && (this.flags.cortados || []).length) {
        this.mapa.props = this.mapa.props.filter((p) => !(p.tipo === 'espinheiro' && this.mapa.l[p.ty][p.tx] === '.'));
        this.mapa.renderizarChao();
      }
      for (const p of this.mapa.props) if (p.tipo === 'bau' && this.flags.espada) p.aberto = true;

      const ini = chegada || this.mapa.def.inicio;
      const hp = this.line ? this.line.hp : 6;
      this.line = new LB.Line(T(ini.x), T(ini.y), ini.dir);
      this.line.temEspada = !!this.flags.espada;
      this.line.hp = id === 'covil' ? this.line.hpMax : Math.max(3, hp);
      if (this.line.dir === 'LEFT') this.line.lado = -1;
      this.line.voltarLivre();
      this.cameraEm(this.line.x, this.line.y - 24);
      this.criarInimigos();
      this.prepararArea(id, semCenaDeEntrada);

      this.flags.area = id;
      this.salvar();
      this.mostrarBanner(this.mapa.def.nome);

      if (id === 'floresta' && !this.flags.florestaVista) this.iniciarCena(LB.HISTORIA.floresta);
      if (id === 'covil') {
        const jl = this.mapa.def.jaula;
        this.bell = new LB.Bell(T(jl.x), T(jl.y) - 4, 'FRONT');
        this.bell.anim.tocar('BELL_TRAPPED', true);
        this.dragao = new LB.Dragao(T(13), T(9.2));
        this.dragao.alturaVoo = 320; this.dragao.visivel = false;
        this.iniciarCena(LB.HISTORIA.covil, { semPular: false });
      }
    }

    criarInimigos() {
      this.inimigos = [];
      for (const d of this.mapa.def.inimigos || []) {
        if (d.depoisDe && !this.flags[d.depoisDe]) continue;
        this.inimigos.push(new LB.Sombra(T(d.x + 0.5), T(d.y + 0.9)));
      }
    }

    iniciarCena(fn, opcoes, arg) {
      const f = arg !== undefined ? (c, j) => fn(c, j, arg) : fn;
      this.cena = new LB.Roteiro(this, f, opcoes);
      if (this.line) { this.line.correndo = false; this.line.sub = null; this.line.noAr = false; this.line.mudar('cena'); }
      $('#pular-cena').classList.toggle('oculto', !this.cena.podePular);
    }

    terminarCena() {
      this.cena = null;
      $('#pular-cena').classList.add('oculto');
      LB.dialogo.esconder();
      this.esconderTitulo();
      if (this.line && this.line.estado === 'cena') this.line.voltarLivre();
    }

    // ---------------- Ajudantes usados pelos roteiros ----------------
    criarBell(tx, ty, dir) { this.bell = new LB.Bell(T(tx), T(ty), dir); if (dir === 'LEFT') this.bell.lado = -1; return this.bell; }

    criarDragaoCena(x, y, altura) {
      this.dragao = new LB.Dragao(x, y);
      this.dragao.alturaVoo = altura;
      return this.dragao;
    }

    removerDragaoCena() { this.dragao = null; }
    prender(bell, dragao) { this.presa = { bell, dragao }; }
    soltar() { this.presa = null; }
    cameraEm(x, y) { this.cam.x = x - this.vw / 2; this.cam.y = y - this.vh / 2; this.limitarCamera(); this.camAlvo = null; }

    selarEntrada() {
      for (let y = 17; y < 20; y++) for (let x = 9; x < 17; x++) this.mapa.l[y][x] = '#';
      this.mapa.renderizarChao();
      this.particulas.emitir('pedra', T(13), T(17.5), 16, { vel: 100, vz: 200, vida: 1, espalha: 90 });
    }

    iniciarChefe() {
      this.chefeAtivo = true;
      this.dragao.mudar('observar', 'DRAGON_IDLE');
      this.dragao.x0 = this.dragao.x; this.dragao.y0 = this.dragao.y;
    }

    epilogo() {
      this.mapa = new LB.Mapa('fazenda');
      this.ambiente = new LB.cenario.Ambiente(this.mapa);
      this.ambiente.anoitecer();
      this.inimigos = []; this.dragao = null; this.chefeAtivo = false; this.promptFinal = false; this.jaulaAberta = false;
      this.particulas.lista = []; this.baloes = [];
      this.bichos = LB.bichos.povoar(this); this.npcs = [];
      const lago = this.pontoMapa('lago');
      this.line.x = lago.x; this.line.y = lago.y; this.line.dir = 'LEFT'; this.line.lado = -1; this.line.visivel = true;
      this.bell = new LB.Bell(lago.x + 20, lago.y, 'LEFT');
      this.tint = { cor: '255,120,60', a: 0.3 };
      const base = LB.resolver('LINE_BELL_SIT_IDLE', null, 1).sprite ? 'LINE_BELL_SIT_IDLE' : 'LINE_BELL_HOLD_HANDS';
      this.duo = { anim: new LB.Animador(base), x: lago.x + 10, y: lago.y };
      this.line.visivel = false; this.bell.visivel = false;
      const cao = this.bichos.find((b) => b.tipo === 'cachorro');
      if (cao) { cao.x = lago.x + 50; cao.y = lago.y + 10; cao.estado = 'parado'; cao.comeu = true; }
      this.cameraEm(lago.x - 30, lago.y - 20);
    }

    // ---------------- Combate ----------------
    alvos() {
      const lista = this.inimigos.filter((e) => e.vivo && e.estado !== 'morrendo');
      if (this.dragao && this.chefeAtivo) lista.push(this.dragao);
      return lista;
    }

    alvoMaisProximo(x, y, raio) {
      let melhor = null, md = raio;
      for (const e of this.alvos()) { const d = Math.hypot(e.x - x, e.y - y); if (d < md) { md = d; melhor = e; } }
      return melhor;
    }

    inimigoPerto(x, y, raio) { return !!this.alvoMaisProximo(x, y, raio) || (this.chefeAtivo && !this.promptFinal); }

    acertar(line, golpe, atingidos) {
      for (const alvo of this.alvos()) {
        if (atingidos.has(alvo)) continue;
        const cy = alvo.chefe ? alvo.y - 10 : alvo.y;
        const tr = alvo.chefe ? 58 : alvo.raio;
        let dentro;
        if (alvo.chefe) {
          // O dragão é grande: vale acertar qualquer parte do corpo à frente da Line.
          const dx = (alvo.x - line.x) * (golpe.raio ? 1 : line.lado);
          dentro = Math.hypot(alvo.x - line.x, (cy - line.y) * 0.9) < (golpe.raio || golpe.alcance) + 72 && (golpe.raio || dx > -50);
        } else if (golpe.raio) dentro = Math.hypot(alvo.x - line.x, (cy - line.y) * 1.4) < golpe.raio + tr;
        else {
          const dx = (alvo.x - line.x) * line.lado, dy = cy - line.y;
          dentro = dx > -14 && dx < golpe.alcance + tr && Math.abs(dy) < golpe.largura + tr * 0.6;
        }
        if (!dentro) continue;
        if (alvo.receberGolpe(this, golpe.dano, line.x, line.y, golpe.empurra)) {
          atingidos.add(alvo);
          this.pausaImpacto(alvo.chefe ? 0.07 : 0.05);
          this.tremer(2, 0.1);
          const px = alvo.chefe ? line.x + line.lado * 36 : alvo.x;
          this.particulas.emitir('impacto', px, (alvo.chefe ? line.y : alvo.y) - 22, 1, { r: 4, vida: 0.25, vel: 0 });
        }
      }
      // Espinheiros: a espada abre caminho.
      const alcance = golpe.raio || golpe.alcance;
      const x0 = Math.floor((line.x - alcance) / TILE), x1 = Math.floor((line.x + alcance) / TILE);
      const y0 = Math.floor((line.y - alcance) / TILE), y1 = Math.floor((line.y + 20) / TILE);
      for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) {
        if (this.mapa.tile(tx, ty) !== 'X') continue;
        const cx = T(tx + 0.5), cy = T(ty + 1) - 4;
        const dx = (cx - line.x) * (golpe.raio ? 1 : line.lado);
        if (Math.hypot(cx - line.x, cy - line.y) > alcance + 20 || (!golpe.raio && dx < -10)) continue;
        this.cortarEspinho(tx, ty);
      }
    }

    cortarEspinho(tx, ty) {
      this.mapa.trocar(tx, ty, '.');
      this.flags.cortados = (this.flags.cortados || []).concat(tx + ',' + ty);
      this.particulas.emitir('folha', T(tx + 0.5), T(ty + 0.8), 10, { vel: 90, vz: 120, vida: 0.9, cor: '#3a5a22' });
      this.particulas.emitir('folha', T(tx + 0.5), T(ty + 0.8), 4, { vel: 70, vz: 100, vida: 0.9, cor: '#9b4fb0' });
      this.salvar();
    }

    bloqueia(x, y, ent) {
      for (const p of this.mapa.props) if (p.tipo === 'decoracao' && p.raio && Math.hypot(x - p.x, (y - p.y) * 1.6) < p.raio + 6) return true;
      for (const n of this.npcs || []) if (Math.hypot(x - n.x, (y - n.y) * 1.5) < n.raio + 8) return true;
      if (this.mapa.id === 'covil' && !this.jaulaAberta) {
        const jl = this.mapa.def.jaula;
        if (Math.hypot(x - T(jl.x), (y - T(jl.y)) * 1.6) < 32) return true;
      }
      return false;
    }

    rastro(line, golpe) {
      this.efeitos.push({ tipo: 'rastro', x: line.x, y: line.y, lado: line.lado, t: 0, dur: 0.22, alcance: golpe.alcance, anim: line.anim.base });
    }

    aoDerrotarInimigo(e) {
      if (Math.random() < 0.4) this.itens.push({ tipo: 'coracao', x: e.x, y: e.y, t: 0 });
      this.particulas.emitir('sombra', e.x, e.y - 14, 12, { vel: 80, vida: 0.7, r: 5 });
      this.inimigos = this.inimigos.filter((i) => i !== e);
    }

    aoVencerDragao() {
      this.promptFinal = true;
      this.dica('final', 'O dragão não aguenta mais! Chegue perto e aperte ATACAR para o golpe final.');
    }

    golpeFinal() {
      const line = this.line, dr = this.dragao;
      this.promptFinal = false;
      line.correndo = false; line.sub = null; line.armada = true;
      line.lado = dr.x >= line.x ? 1 : -1;
      line.dir = line.lado < 0 ? 'LEFT' : 'RIGHT';
      line.inicioFinal = { x: line.x, y: line.y };
      line.alvoFinal = { x: dr.x + line.lado * 70, y: dr.y + 34 };
      line.finalFeito = false;
      line.mudar('final', 'LINE_DRAGON_FINAL_ATTACK');
      $('#pular-cena').classList.add('oculto');
    }

    passoFinal(line, st, dt) {
      const p = st.progresso;
      if (p > 0.22 && p < 0.62) {
        const k = (p - 0.22) / 0.4;
        line.x = line.inicioFinal.x + (line.alvoFinal.x - line.inicioFinal.x) * k;
        line.y = line.inicioFinal.y + (line.alvoFinal.y - line.inicioFinal.y) * k;
      }
      if (!line.finalFeito && p >= 0.52) {
        line.finalFeito = true;
        this.dragao.mudar('golpeFinal', 'DRAGON_FINAL_HIT');
        this.dragao.fraco = false;
        this.pausaImpacto(0.3); this.tremer(12, 0.7); this.flashTela = 0.5;
        this.particulas.emitir('brilho', this.dragao.x, this.dragao.y - 60, 20, { vel: 160, vida: 0.9, r: 7 });
        this.particulas.emitir('faisca', this.dragao.x, this.dragao.y - 40, 30, { vel: 220, vz: 160, vida: 0.7 });
      }
      if (st.acabou) {
        this.chefeAtivo = false;
        this.iniciarCena(LB.HISTORIA.vitoria, { semPular: false });
      }
    }

    derrota() {
      this.cena = null;
      const line = this.line;
      setTimeout(() => { if (this.estado === 'jogo' && this.line === line && line.estado === 'morta') $('#derrota').classList.remove('oculto'); }, 900);
    }

    // ---------------- Interação ----------------
    // Tudo o que dá para fazer perto da Line: { texto, x, y, fazer }.
    acoesPossiveis() {
      const l = this.line, acoes = [];
      const perto = (x, y, r) => Math.hypot(x - l.x, (y - l.y) * 1.2) < (r || 46);
      for (const p of this.mapa.props) {
        if (p.tipo === 'placa' && perto(p.x, p.y + 12)) acoes.push({ texto: 'Ler', x: p.x, y: p.y - 40, fazer: () => this.iniciarCena(LB.HISTORIA.placa, { semPular: true }, p.texto) });
        if (p.tipo === 'bau' && !p.aberto && perto(p.x, p.y + 12)) acoes.push({ texto: 'Abrir', x: p.x, y: p.y - 40, fazer: () => {
          l.dir = LB.dirDe(p.x - l.x, p.y - l.y, l.dir);
          if (p.x !== l.x) l.lado = p.x < l.x ? -1 : 1;
          this.iniciarCena(LB.HISTORIA.espada, { semPular: true }, p);
        } });
      }
      this.acoesExtras(acoes, perto);
      // Tarefas e objetos têm prioridade sobre carinho; entre iguais, vence o mais perto.
      let melhor = null, md = Infinity;
      for (const a of acoes) {
        const d = Math.hypot((a.px != null ? a.px : a.x) - l.x, (a.py != null ? a.py : a.y + 40) - l.y) - (a.prio || 0) * 1000;
        if (d < md) { md = d; melhor = a; }
      }
      return melhor;
    }

    objetoProximo() { return this.acoesPossiveis(); }

    interagir(line, viaAtaque) {
      if (viaAtaque && line.temEspada) return false;
      const acao = this.acoesPossiveis();
      if (!acao) return false;
      acao.fazer();
      return true;
    }

    // ---------------- Efeitos de tela ----------------
    tremer(forca, dur) { if (forca >= this.treme.f || this.treme.t <= 0) this.treme = { f: forca, t: dur }; }
    pausaImpacto(seg) { this.congelado = Math.max(this.congelado, seg); }

    dica(id, texto) {
      if (this.dicasVistas.has(id)) return;
      this.dicasVistas.add(id);
      const el = $('#dica');
      el.textContent = texto;
      el.classList.remove('oculto');
      clearTimeout(this.timerDica);
      this.timerDica = setTimeout(() => el.classList.add('oculto'), 6500);
    }

    mostrarBanner(texto) {
      const el = $('#banner');
      el.textContent = texto;
      el.classList.remove('mostrar'); void el.offsetWidth; el.classList.add('mostrar');
    }

    mostrarTitulo(t, s) {
      $('#cartela h2').textContent = t; $('#cartela p').textContent = s || '';
      $('#cartela').classList.add('visivel');
    }

    esconderTitulo() { $('#cartela').classList.remove('visivel'); }

    // ---------------- Laço principal ----------------
    atualizar(dt) {
      const E = LB.entrada;
      E.quadro();
      if (this.estado !== 'jogo') { E.limpar(); return; }
      if (E.apertou('pausa') && !(this.line && this.line.estado === 'morta')) { LB.ui.pausar(); E.limpar(); return; }

      this.tempo += dt;
      if (this.congelado > 0) { this.congelado -= dt; E.limpar(); return; }

      if (this.cena) {
        this.cena.atualizar(dt);
        if (this.cena && this.cena.fim) this.terminarCena();
      }
      if (this.estado !== 'jogo') { E.limpar(); return; }

      this.line.atualizar(dt, this);
      this.atualizarVida(dt);
      for (const e of this.inimigos) e.atualizar(dt, this);
      if (this.dragao) this.dragao.atualizar(dt, this);
      if (this.bell) this.bell.atualizar(dt, this);
      if (this.duo) this.duo.anim.atualizar(dt);
      if (this.presa) { const { bell, dragao } = this.presa; bell.x = dragao.x; bell.y = dragao.y + 6; bell.z = Math.max(0, dragao.alturaVoo + 10); }
      this.particulas.atualizar(dt);
      for (const f of this.efeitos) f.t += dt;
      this.efeitos = this.efeitos.filter((f) => f.t < f.dur);
      this.flashTela = Math.max(0, this.flashTela - dt);
      if (this.treme.t > 0) this.treme.t -= dt;

      if (!this.cena) this.verificarMundo(dt);
      this.atualizarCamera(dt);
      LB.ui.atualizarToque(this);
      E.limpar();
    }

    verificarMundo(dt) {
      const l = this.line;
      // Saídas da área.
      for (const s of this.mapa.def.saidas) {
        const tx = l.x / TILE, ty = (l.y - 4) / TILE;
        if (tx >= s.x && tx < s.x + s.w && ty >= s.y - 0.5 && ty < s.y + s.h) {
          if (s.para === 'covil' && !this.flags.espada) continue;
          this.iniciarArea(s.para, s.chegada);
          return;
        }
      }
      // Itens.
      for (const it of this.itens) {
        if (it.tipo !== 'coracao') continue;
        it.t += dt;
        if (Math.hypot(it.x - l.x, it.y - l.y) < 20 && l.hp < l.hpMax) {
          it.pego = true; l.hp = Math.min(l.hpMax, l.hp + 2);
          this.particulas.emitir('coracao', it.x, it.y - 20, 3, { vel: 30, vida: 1 });
        }
      }
      this.itens = this.itens.filter((i) => !i.pego && i.t < 14);
      // Espinhos sem espada.
      const perto = this.mapa.tileEm(l.x, l.y - 34) === 'X';
      if (!l.temEspada && perto && !this.avisouEspinhos) { this.avisouEspinhos = true; this.iniciarCena(LB.HISTORIA.espinhos, { semPular: true }); }
      if (!perto) this.avisouEspinhos = false;
      // Golpe final.
      if (this.promptFinal && this.dragao && Math.hypot(this.dragao.x - l.x, this.dragao.y - l.y) < 190 && LB.entrada.apertou('atacar') && l.estado !== 'forte') this.golpeFinal();
    }

    atualizarCamera(dt) {
      let alvoX, alvoY;
      if (this.camAlvo) { alvoX = this.camAlvo.x; alvoY = this.camAlvo.y; }
      else if (this.chefeAtivo && this.dragao) { alvoX = this.line.x * 0.7 + this.dragao.x * 0.3; alvoY = this.line.y * 0.6 + (this.dragao.y - 60 - this.dragao.alturaVoo * 0.8) * 0.4; }
      else { alvoX = this.line.x; alvoY = this.line.y - 24; }
      const k = Math.min(1, dt * (this.cena ? 3 : 6));
      this.cam.x += (alvoX - this.vw / 2 - this.cam.x) * k;
      this.cam.y += (alvoY - this.vh / 2 - this.cam.y) * k;
      if (!this.cena) this.camAlvo = null;
      this.limitarCamera();
    }

    limitarCamera() {
      const m = this.mapa;
      if (!m) return;
      this.cam.x = m.larg < this.vw ? (m.larg - this.vw) / 2 : Math.max(0, Math.min(m.larg - this.vw, this.cam.x));
      this.cam.y = m.alt < this.vh ? (m.alt - this.vh) / 2 : Math.max(0, Math.min(m.alt - this.vh, this.cam.y));
    }

    // ---------------- Desenho ----------------
    desenhar() {
      const g = this.g;
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.fillStyle = '#0d0b12'; g.fillRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.estado === 'menu' || !this.mapa) return;

      let sx = 0, sy = 0;
      if (this.treme.t > 0) { sx = (Math.random() - 0.5) * this.treme.f * 2; sy = (Math.random() - 0.5) * this.treme.f * 2; }
      const cx = this.cam.x + sx, cy = this.cam.y + sy;
      g.setTransform(this.escala, 0, 0, this.escala, -cx * this.escala, -cy * this.escala);
      g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';

      // Chão (só o pedaço visível).
      const m = this.mapa, R = m.resChao;
      const x0 = Math.max(0, cx), y0 = Math.max(0, cy);
      const x1 = Math.min(m.larg, cx + this.vw), y1 = Math.min(m.alt, cy + this.vh);
      if (x1 > x0 && y1 > y0) g.drawImage(m.chao, x0 * R, y0 * R, (x1 - x0) * R, (y1 - y0) * R, x0, y0, x1 - x0, y1 - y0);
      const vis = { x: cx - 40, y: cy - 40, w: this.vw + 80, h: this.vh + 120 };
      m.desenharAnimado(g, this.tempo, vis);
      this.ambiente.desenharChao(g);

      // Avisos e sombras.
      if (this.dragao && this.chefeAtivo) this.dragao.desenharAvisos(g, this);
      for (const it of this.itens) if (it.tipo === 'coracao') LB.desenho.sombraChao(g, it.x, it.y, 6, 0.2);
      const atores = [this.line, ...this.inimigos, ...this.bichos, ...this.npcs];
      if (this.bell) atores.push(this.bell);
      if (this.dragao) atores.push(this.dragao);
      for (const a of atores) if (a.visivel !== false && a.desenharSombra) a.desenharSombra(g);
      if (this.dragao && this.dragao.noAlto && this.dragao.visivel && !this.chefeAtivo) LB.desenho.sombraChao(g, this.dragao.x, this.dragao.y, 70 - Math.min(40, this.dragao.alturaVoo / 8), 0.25);

      // Tudo que tem altura, ordenado pela linha dos pés.
      const lista = [];
      for (const p of m.props) if (p.x > vis.x - 60 && p.x < vis.x + vis.w + 60 && p.y > vis.y && p.y < vis.y + vis.h + 80) lista.push({ y: p.y, p });
      for (const a of atores) lista.push({ y: a.y, a });
      for (const it of this.itens) lista.push({ y: it.y, item: it });
      if (m.def.jaula) lista.push({ y: T(m.def.jaula.y) + 2, jaula: true });
      const tigela = this.pontoMapa('tigela');
      if (tigela) lista.push({ y: tigela.y - 2, tigela });
      if (this.duo) lista.push({ y: this.duo.y, duo: this.duo });
      if (this.presa) { const i = lista.findIndex((o) => o.a === this.presa.bell); if (i >= 0) lista[i].y = this.presa.dragao.y + 1; }
      lista.sort((a, b) => a.y - b.y);
      for (const o of lista) {
        if (o.p) this.desenharProp(g, o.p);
        else if (o.a) o.a.desenhar(g, this);
        else if (o.item && o.item.tipo === 'ovo') this.desenharOvo(g, o.item);
        else if (o.item) LB.desenho.coracaoForma(g, o.item.x, o.item.y - 12 - Math.sin(this.tempo * 4) * 3, 7, o.item.t > 11 && Math.floor(this.tempo * 8) % 2 ? 'rgba(255,93,143,.4)' : '#ff5d8f');
        else if (o.tigela) this.desenharTigela(g, o.tigela);
        else if (o.jaula) LB.desenho.jaula(g, T(m.def.jaula.x), T(m.def.jaula.y) + 2, this.jaulaAberta, this.tempo);
        else if (o.duo) { const st = o.duo.anim.estado(o.duo.dir, 1); LB.desenharSprite(g, st.r, st.quadro, o.duo.x, o.duo.y, LB.ALTURA_LINE); }
      }

      for (const f of this.efeitos) this.desenharEfeito(g, f);
      this.particulas.desenhar(g);
      this.ambiente.desenharCeu(g);
      this.desenharBaloes(g);

      // Camadas de tela.
      g.setTransform(1, 0, 0, 1, 0, 0);
      const W = this.canvas.width, H = this.canvas.height;
      if (this.tint && this.tint.a > 0) { g.fillStyle = `rgba(${this.tint.cor},${this.tint.a})`; g.fillRect(0, 0, W, H); }
      if (m.tema === 'floresta') { const gr = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.9); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,20,0,.35)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
      if (m.tema === 'covil') { const gr = g.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.85); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.6)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
      if (this.flashTela > 0) { g.fillStyle = `rgba(255,255,255,${this.flashTela * 1.6})`; g.fillRect(0, 0, W, H); }

      this.desenharHud(g);
      this.desenharPrompt(g);

      if (this.fade > 0) { g.fillStyle = `rgba(0,0,0,${this.fade})`; g.fillRect(0, 0, W, H); }
      if (this.olho) this.desenharOlho(g, W, H);
    }

    desenharProp(g, p) {
      const d = LB.desenho;
      switch (p.tipo) {
        case 'arvore': LB.cenario.arvore(g, p, this.mapa.tema, this.tempo); break;
        case 'mato': LB.cenario.mato(g, p, this.tempo); break;
        case 'flores': LB.cenario.flores(g, p, this.tempo); break;
        case 'planta': LB.cenario.planta(g, p, this.tempo, this.estadoCanteiro(p)); break;
        case 'casaFazenda': LB.cenario.casaFazenda(g, p, this.tempo); break;
        case 'celeiro': LB.cenario.celeiro(g, p); break;
        case 'galinheiro': LB.cenario.galinheiro(g, p); break;
        case 'cerca': LB.cenario.cerca(g, p); break;
        case 'poco': LB.cenario.poco(g, p, this.tempo); break;
        case 'moinho': LB.cenario.moinho(g, p, this.tempo); break;
        case 'feno': LB.cenario.feno(g, p); break;
        case 'mesa': LB.cenario.mesa(g, p, this.tempo, this.mesaOculta); break;
        case 'casinha': LB.cenario.casinha(g, p); break;
        case 'varal': LB.cenario.varal(g, p, this.tempo); break;
        case 'decoracao': LB.cenario.decoracao(g, p, this.tempo); break;
        case 'pedra': d.pedra(g, p); break;
        case 'estalagmite': d.estalagmite(g, p); break;
        case 'espinheiro': d.espinheiro(g, p, this.tempo); break;
        case 'casa': d.casa(g, p); break;
        case 'bau': d.bau(g, p.x, p.y, p.aberto, this.tempo); break;
        case 'placa': d.placa(g, p.x, p.y); break;
      }
    }

    desenharEfeito(g, f) {
      if (f.tipo !== 'rastro') return;
      const k = f.t / f.dur;
      const vertical = /VERTICAL|DIAGONAL/.test(f.anim);
      const a = 1 - k;
      g.save();
      g.translate(this.line.x, this.line.y - 34);
      g.scale(f.lado, 1);
      g.globalCompositeOperation = 'lighter';
      // Meia-lua azul: várias camadas para o brilho, fina nas pontas e grossa no meio.
      const r = vertical ? f.alcance * 0.62 : f.alcance * 0.78, ry = vertical ? r : 22;
      const ini = (vertical ? -1.7 : -1.25) + k * 0.7, fim = (vertical ? 1.1 : 1.35) + k * 0.7;
      for (const [cor, larg] of [['rgba(40,110,255,', 14], ['rgba(90,170,255,', 8], ['rgba(210,240,255,', 3]]) {
        g.strokeStyle = cor + (0.55 * a) + ')'; g.lineWidth = larg * (0.6 + a * 0.6); g.lineCap = 'round';
        g.beginPath(); g.ellipse(vertical ? 14 : 18, vertical ? 0 : 6, r, ry, 0, ini, fim); g.stroke();
      }
      g.fillStyle = `rgba(170,220,255,${a})`;
      for (let i = 0; i < 5; i++) { const t = ini + (fim - ini) * (i / 4 + 0.05 * Math.sin(this.tempo * 40 + i)); g.beginPath(); g.arc((vertical ? 14 : 18) + Math.cos(t) * (r + 6), (vertical ? 0 : 6) + Math.sin(t) * (ry + 4), 1.4, 0, Math.PI * 2); g.fill(); }
      g.restore();
    }

    desenharHud(g) {
      const s = this.escala;
      const l = this.line;
      if (!l || (this.cena && !this.chefeAtivo && this.line.estado === 'cena')) return;
      if (!this.flags.prologo) return;
      for (let i = 0; i < l.hpMax / 2; i++) {
        const x = (22 + i * 24) * s, y = 24 * s;
        const valor = Math.max(0, Math.min(2, l.hp - i * 2));
        LB.desenho.coracaoForma(g, x, y, 9 * s, 'rgba(0,0,0,.45)');
        if (valor === 2) LB.desenho.coracaoForma(g, x, y, 8 * s, '#ff4d6d');
        else if (valor === 1) { g.save(); g.beginPath(); g.rect(x - 9 * s, y - 12 * s, 9 * s, 24 * s); g.clip(); LB.desenho.coracaoForma(g, x, y, 8 * s, '#ff4d6d'); g.restore(); }
      }
      if (this.chefeAtivo && this.dragao) {
        const W = this.canvas.width;
        const bw = Math.min(W * 0.6, 420 * s), bh = 10 * s, bx = (W - bw) / 2, by = this.canvas.height - 26 * s;
        g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(bx - 3 * s, by - 3 * s, bw + 6 * s, bh + 6 * s);
        g.fillStyle = '#5a1320'; g.fillRect(bx, by, bw, bh);
        g.fillStyle = this.dragao.fraco ? '#5ad8ff' : '#e0334a'; g.fillRect(bx, by, bw * this.dragao.hp / this.dragao.hpMax, bh);
        g.fillStyle = '#fff'; g.font = `600 ${11 * s}px system-ui, sans-serif`; g.textAlign = 'center';
        g.fillText('Dragão', W / 2, by - 6 * s);
      }
    }

    desenharPrompt(g) {
      if (this.cena || !this.line || this.line.estado !== 'livre') { this.textoPrompt = null; return; }
      const obj = this.objetoProximo();
      let texto = null, x, y;
      if (obj) { texto = obj.texto; x = obj.x; y = obj.y; }
      else if (this.promptFinal && this.dragao) { texto = 'GOLPE FINAL!'; x = this.dragao.x; y = this.dragao.y - 170; }
      this.textoPrompt = texto;
      if (!texto) return;
      const s = this.escala;
      const px = (x - this.cam.x) * s, py = (y - this.cam.y) * s;
      const tecla = LB.entrada.usandoToque() ? '' : (obj ? 'E  ' : 'J  ');
      g.font = `700 ${11 * s}px system-ui, sans-serif`; g.textAlign = 'center';
      const w = g.measureText(tecla + texto).width + 14 * s;
      g.fillStyle = 'rgba(20,16,30,.8)';
      g.beginPath(); g.roundRect ? g.roundRect(px - w / 2, py - 11 * s, w, 20 * s, 6 * s) : g.rect(px - w / 2, py - 11 * s, w, 20 * s); g.fill();
      g.fillStyle = obj ? '#ffe9a8' : '#ff9d9d';
      g.fillText(tecla + texto, px, py + 4 * s);
    }

    desenharOlho(g, W, H) {
      g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
      const r = LB.resolver('DRAGON_EYE_OPEN_END', null, 1);
      if (r.sprite) {
        const n = r.sprite.seq.length, i = Math.min(n - 1, Math.floor(this.olho.abertura * (n - 1)));
        g.save(); g.translate(W / 2, H * 0.7); g.scale(this.escala * 1.3, this.escala * 1.3); g.imageSmoothingEnabled = false; LB.desenharSprite(g, r, r.sprite.seq[i], 0, 0, 100); g.restore();
      } else LB.desenho.olhoDragao(g, W / 2, H / 2, this.olho.abertura, this.tempo);
    }
  }

  LB.Jogo = Jogo;
})(window.LB);
