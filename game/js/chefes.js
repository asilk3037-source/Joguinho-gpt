'use strict';

// Chefes elementais da Parte 2. Um sistema só: cada elemento traz seus ataques (todos com aviso
// antes), os chefes de junção misturam os ataques dos seus elementos e a Quimera usa todos, em
// três fases. Regra de combate igual para todos: depois de alguns ataques o chefe se cansa e o
// núcleo fica exposto (aí a espada e as estrelas ferem); a luz (magia) também abre a guarda.
(function (LB) {
  const TAU = Math.PI * 2;
  const T = (n) => n * LB.TILE;
  const D = () => LB.desenho;

  const ELEM = {
    pedra: { nome: 'Pedra', cor: '#8a877b', cor2: '#5f5c52', luz: '215,210,195', proj: 'pedra', icone: '🪨' },
    fogo: { nome: 'Fogo', cor: '#e0503a', cor2: '#8a2416', luz: '255,140,60', proj: 'fogo', icone: '🔥' },
    terra: { nome: 'Terra', cor: '#6d8f3a', cor2: '#5a4128', luz: '170,220,90', proj: 'lama', icone: '🌱' },
    agua: { nome: 'Água', cor: '#3f8fd6', cor2: '#1f4f8a', luz: '120,200,255', proj: 'agua', icone: '💧' },
    ar: { nome: 'Ar', cor: '#dfe8f0', cor2: '#8aa0b8', luz: '230,245,255', proj: 'pena', icone: '🌪️' },
  };

  // `codigo`: prefixo das animações de arte (ex.: COLOSSO_IDLE). Sem arte, o chefe é desenhado no código.
  const CHEFES = {
    colosso: {
      nome: 'Colosso de Raízes', titulo: 'Guardião da Terra', codigo: 'COLOSSO', elementos: ['terra'], forma: 'golem', hp: 16, dano: 1, vel: 30, cansaApos: 3,
      ataques: ['raizes', 'espinhosAnel', 'lama', 'invocar'], flag: 'chefeTerra',
      dicas: ['As raízes saem do chão em linha, na sua direção: ande para o lado, não para trás.', 'Depois de três ataques ele se cansa e a flor do peito abre. É a hora de atacar!', 'A magia de luz abre a guarda dele na hora.'],
    },
    serpente: {
      nome: 'Serpente das Marés', titulo: 'Guardiã da Água', codigo: 'SERPENTE', elementos: ['agua'], forma: 'serpente', hp: 16, dano: 1, vel: 55, cansaApos: 3,
      ataques: ['mergulho', 'jatos', 'onda'], flag: 'chefeAgua',
      dicas: ['Quando ela mergulha, fique de olho nas bolhas: ela sai embaixo delas.', 'Pule a onda na hora que ela chegar em você.', 'Depois de três ataques ela boia cansada: ataque a cabeça!'],
    },
    grifo: {
      nome: 'Grifo da Tempestade', titulo: 'Guardião do Ar', codigo: 'GRIFO', elementos: ['ar'], forma: 'ave', hp: 16, dano: 1, vel: 80, cansaApos: 3, voa: true,
      ataques: ['rajada', 'penas', 'raios'], flag: 'chefeAr',
      dicas: ['A rajada empurra para longe dele: ande contra o vento (ou defenda) para não cair.', 'Os raios caem onde aparece o círculo branco: saia de dentro.', 'Cansado, ele pousa no chão. Aproveite!'],
    },
    magma: {
      nome: 'Titã de Magma', titulo: 'Junção de Pedra e Fogo', codigo: 'MAGMA', elementos: ['pedra', 'fogo'], forma: 'golem', hp: 24, dano: 1, vel: 34, cansaApos: 3,
      ataques: ['pisao', 'chuvaFogo', 'rocha', 'lequeFogo'], pocas: 'lava', flag: 'fusaoMagma',
      dicas: ['A chuva de fogo deixa poças de lava por alguns segundos: não pise nelas.', 'Pule a onda do pisão.', 'A luz racha a casca de pedra e deixa o coração de fogo exposto.'],
    },
    hidra: {
      nome: 'Hidra de Lama', titulo: 'Junção de Terra e Água', codigo: 'HIDRA', elementos: ['terra', 'agua'], forma: 'serpente', hp: 24, dano: 1, vel: 50, cansaApos: 3,
      ataques: ['raizes', 'jatos', 'onda', 'mergulho', 'lama'], pocas: 'lama', flag: 'fusaoLama',
      dicas: ['As poças de lama deixam você lenta: fuja delas.', 'Ela mergulha na lama e sai embaixo das bolhas.', 'Cansada, ela afunda a cabeça no chão: ataque!'],
    },
    tempestade: {
      nome: 'Tempestade Viva', titulo: 'Junção de Água e Ar', codigo: 'TEMPESTADE', elementos: ['agua', 'ar'], forma: 'nuvem', hp: 24, dano: 1, vel: 70, cansaApos: 3, voa: true,
      ataques: ['raios', 'rajada', 'jatos', 'onda', 'penas'], flag: 'fusaoTempestade',
      dicas: ['Os raios agora caem em sequência: continue andando.', 'Quando ela chove forte, a rajada vem logo depois: prepare-se para andar contra o vento.', 'Cansada, ela desce e o olho da tempestade fica exposto.'],
    },
    quimera: {
      nome: 'Quimera Primordial', titulo: 'O Coração dos Elementos', codigo: 'QUIMERA', elementos: ['pedra', 'fogo', 'terra', 'agua', 'ar'], forma: 'quimera', hp: 48, dano: 1, vel: 45, cansaApos: 4, final: true,
      fases: [['pedra', 'fogo'], ['terra', 'agua'], ['ar', 'fogo', 'agua', 'terra', 'pedra']],
      ataques: [], flag: 'quimeraVencida',
      dicas: ['A Quimera muda de elemento a cada fase: veja a cor do núcleo para saber o que vem.', 'Na última fase ela usa todos os ataques e bate mais forte. Troque de heroína quando a vida baixar.', 'A luz sempre abre a guarda. Guarde magia para isso.'],
    },
  };
  // Ataques de cada elemento (usados pelos chefes de junção e pela Quimera).
  const POR_ELEMENTO = {
    pedra: ['pisao', 'rocha'], fogo: ['chuvaFogo', 'lequeFogo'], terra: ['raizes', 'espinhosAnel', 'lama'],
    agua: ['mergulho', 'jatos', 'onda'], ar: ['rajada', 'penas', 'raios'],
  };
  const DURACAO = { pisao: 1.9, rocha: 1.4, chuvaFogo: 2.2, lequeFogo: 1.3, raizes: 2.0, espinhosAnel: 1.8, lama: 1.3, invocar: 1.2, mergulho: 2.6, jatos: 1.3, onda: 1.8, rajada: 2.6, penas: 1.4, raios: 2.0 };
  const ELEM_ATAQUE = { pisao: 'pedra', rocha: 'pedra', chuvaFogo: 'fogo', lequeFogo: 'fogo', raizes: 'terra', espinhosAnel: 'terra', lama: 'terra', invocar: 'terra', mergulho: 'agua', jatos: 'agua', onda: 'agua', rajada: 'ar', penas: 'ar', raios: 'ar' };

  class Chefe {
    constructor(id, x, y, arena) {
      const d = CHEFES[id];
      this.id = id; this.def = d; this.nome = d.nome;
      this.x = x; this.y = y; this.x0 = x; this.y0 = y;
      this.arena = arena; // [x0, y0, x1, y1] em tiles
      this.hpMax = Math.round(d.hp * LB.dif().vidaChefe); this.hp = this.hpMax;
      this.raio = d.forma === 'quimera' ? 44 : 34; this.vivo = true; this.inimigo = true; this.grande = true; this.chefeElemental = true;
      this.estado = 'dormindo'; this.dormindo = true; this.t = 0; this.flash = 0; this.lado = -1;
      this.perigos = []; this.cansaco = 0; this.recarga = 0; this.fase = 0; this.alturaVoo = d.voa ? 36 : 0;
      this.anim = new LB.Animador(d.codigo + '_IDLE');
      this.cor = ELEM[d.elementos[0]];
      this.lacaios = [];
    }

    get barra() { return { nome: this.nome, hp: this.hp, hpMax: this.hpMax, cor: this.cor.cor, aberto: this.estado === 'exausto' }; }

    elementosAtuais() { return this.def.fases ? this.def.fases[this.fase] : this.def.elementos; }

    ataquesPossiveis() {
      if (this.def.fases) return this.elementosAtuais().flatMap((e) => POR_ELEMENTO[e]);
      return this.def.ataques;
    }

    acordar(j) {
      this.dormindo = false; this.estado = 'observar'; this.t = 0;
      if (LB.dicas) LB.dicas.chefe(j, this, 0);
    }

    mover(dx, dy, j) {
      const [ax0, ay0, ax1, ay1] = this.arena;
      const nx = Math.max(T(ax0 + 1.5), Math.min(T(ax1 - 0.5), this.x + dx)), ny = Math.max(T(ay0 + 2), Math.min(T(ay1 - 0.2), this.y + dy));
      if (this.def.voa || this.def.forma === 'serpente' || !j.mapa.colide(nx, this.y - 8, 24, 8)) this.x = nx;
      if (this.def.voa || this.def.forma === 'serpente' || !j.mapa.colide(this.x, ny - 8, 24, 8)) this.y = ny;
    }

    atualizar(dt, j) {
      this.t += dt; this.flash = Math.max(0, this.flash - dt); this.recarga = Math.max(0, this.recarga - dt);
      this.encantado = Math.max(0, (this.encantado || 0) - dt);
      this.anim.atualizar(dt);
      this.anim.tocar(this.def.codigo + '_' + ({ atacar: 'ATTACK', exausto: 'STUNNED', morrendo: 'DEATH', submerso: 'DIVE' }[this.estado] || 'IDLE'));
      atualizarPerigos(this, j, dt);
      if (this.dormindo || (j.cena && this.estado !== 'morrendo')) return;
      const l = j.line;
      const dx = l.x - this.x, dy = l.y - this.y, d = Math.hypot(dx, dy) || 1;
      if (Math.abs(dx) > 8 && this.estado !== 'atacar') this.lado = dx < 0 ? -1 : 1;
      if (this.def.voa) this.alturaVoo += ((this.estado === 'exausto' ? 0 : 36) - this.alturaVoo) * Math.min(1, dt * 3);
      if (this.encantado > 0 && this.estado !== 'exausto' && this.estado !== 'morrendo') {
        if (Math.random() < dt * 4) j.particulas.emitir('brilho', this.x + (Math.random() - 0.5) * 40, this.y - 80, 1, { vel: 20, vida: 0.6, r: 3, cor: '#ffc4e4' });
        return;
      }
      const furia = this.def.final && this.fase >= 2;
      const ritmo = LB.dif().ritmo * (furia ? 0.75 : 1);
      switch (this.estado) {
        case 'observar': {
          const alvo = this.def.voa ? 130 : 105;
          const v = this.def.vel * (furia ? 1.3 : 1);
          const lat = Math.sin(this.t * 1.3) * 0.6;
          const k = d > alvo ? 1 : d < alvo * 0.6 ? -0.6 : 0;
          this.mover((dx / d * k - dy / d * lat) * v * dt, (dy / d * k + dx / d * lat) * v * dt, j);
          if (this.t > 1.7 * ritmo) this.escolherAtaque(j);
          break;
        }
        case 'atacar':
          this.passoAtaque(j, dt);
          if (this.t >= this.duracaoAtaque) {
            this.cansaco++;
            const limite = Math.max(2, this.def.cansaApos - (LB.dificuldade.id === 'facil' ? 1 : 0) - (LB.mochila.temConclusao(j, 'quimera') ? 1 : 0));
            if (this.cansaco >= limite) this.cansar(j);
            else { this.estado = 'observar'; this.t = 0; }
          }
          break;
        case 'submerso':
          this.passoAtaque(j, dt);
          if (this.t >= this.duracaoAtaque) { this.estado = 'observar'; this.t = 0; this.intocavel = false; this.cansaco++; }
          break;
        case 'exausto':
          this.exposto -= dt;
          if (Math.random() < dt * 6) j.particulas.emitir('brilho', this.x + (Math.random() - 0.5) * 40, this.y - 70, 1, { vel: 20, vida: 0.5, r: 3 });
          if (this.exposto <= 0) {
            this.estado = 'observar'; this.t = -0.5; this.cansaco = 0; this.recarga = 1.2;
            j.itens.push({ tipo: 'mana', x: this.x - this.lado * 60, y: this.y + 24, t: 0 });
          }
          break;
        case 'morrendo':
          if (Math.random() < dt * 16) j.particulas.emitir('brilho', this.x + (Math.random() - 0.5) * 60, this.y - 60 * Math.random(), 1, { vel: 80, vida: 0.8, r: 5 });
          if (this.t > 1.8) { this.vivo = false; j.aoDerrotarInimigo(this); }
          break;
      }
    }

    escolherAtaque(j) {
      const lista = this.ataquesPossiveis();
      let nome = lista[Math.floor(Math.random() * lista.length)];
      if (nome === this.ultimo && lista.length > 1) nome = lista[(lista.indexOf(nome) + 1) % lista.length];
      if (nome === 'invocar' && this.lacaios.filter((e) => e.vivo).length >= 2) nome = 'raizes';
      this.ultimo = nome;
      this.ataque = nome; this.feito = {}; this.t = 0;
      this.duracaoAtaque = DURACAO[nome] * (this.def.final && this.fase >= 2 ? 0.85 : 1);
      this.estado = nome === 'mergulho' ? 'submerso' : 'atacar';
      if (nome === 'mergulho') { this.intocavel = true; this.alvoMergulho = { x: j.line.x, y: j.line.y }; }
    }

    // Uma vez em cada marca de tempo do ataque.
    uma(chave, quando) { if (this.t >= quando && !this.feito[chave]) { this.feito[chave] = true; return true; } return false; }

    passoAtaque(j, dt) {
      const l = j.line, el = ELEM_ATAQUE[this.ataque], dano = this.danoAtual();
      const lancar = (tipo, ang, vel, o) => LB.magia.lancar(j, Object.assign({ dono: 'inimigo', tipo, x: this.x + Math.cos(ang) * 30, y: this.y - 6 + Math.sin(ang) * 20, vx: Math.cos(ang) * vel, vy: Math.sin(ang) * vel, z: 40, r: 7, max: 2.2, dano }, o || {}));
      const angL = Math.atan2(l.y - this.y, l.x - this.x);
      switch (this.ataque) {
        case 'pisao':
          if (this.uma('p', 1.0)) { this.perigos.push({ tipo: 'anel', x: this.x, y: this.y, r: 26, vel: 150, max: 240, el, dano }); j.tremer(6, 0.3); j.particulas.emitir('poeira', this.x, this.y, 16, { vel: 120, vida: 0.6, r: 5 }); }
          break;
        case 'rocha':
          for (const [k, q] of [[0, 0.5], [1, 0.9]]) if (this.uma('r' + k, q)) LB.magia.lancar(j, { dono: 'inimigo', tipo: 'pedra', x: this.x + this.lado * 24, y: this.y - 4, vx: Math.cos(angL + k * 0.2) * 170, vy: Math.sin(angL + k * 0.2) * 170, z: 60, r: 8, max: Math.min(1.8, Math.hypot(l.x - this.x, l.y - this.y) / 170 + 0.2), dano });
          break;
        case 'chuvaFogo':
          for (let k = 0; k < 3; k++) if (this.uma('c' + k, 0.3 + k * 0.45)) this.perigos.push({ tipo: 'circulo', x: l.x + (Math.random() - 0.5) * 20, y: l.y + (Math.random() - 0.5) * 12, r: 36, aviso: 0.95, t: 0, el: 'fogo', dano, poca: this.def.pocas });
          break;
        case 'lequeFogo':
          if (this.uma('f', 0.6)) for (let k = -2; k <= 2; k++) lancar('fogo', angL + k * 0.22, 190);
          break;
        case 'raizes':
          if (this.uma('r', 0.3)) {
            const n = 7, passo = 42;
            for (let k = 1; k <= n; k++) this.perigos.push({ tipo: 'circulo', x: this.x + Math.cos(angL) * passo * k, y: this.y + Math.sin(angL) * passo * k * 0.8, r: 26, aviso: 0.55 + k * 0.1, t: 0, el: 'terra', dano, estilo: 'raiz' });
          }
          break;
        case 'espinhosAnel':
          if (this.uma('e', 0.2)) for (let k = 0; k < 10; k++) { const a = (k / 10) * TAU; this.perigos.push({ tipo: 'circulo', x: this.x + Math.cos(a) * 80, y: this.y + Math.sin(a) * 56, r: 26, aviso: 0.9, t: 0, el: 'terra', dano, estilo: 'raiz' }); }
          if (this.uma('e2', 0.9)) for (let k = 0; k < 14; k++) { const a = (k / 14) * TAU + 0.2; this.perigos.push({ tipo: 'circulo', x: this.x + Math.cos(a) * 140, y: this.y + Math.sin(a) * 98, r: 24, aviso: 0.9, t: 0, el: 'terra', dano, estilo: 'raiz' }); }
          break;
        case 'lama':
          if (this.uma('l', 0.5)) for (let k = -1; k <= 1; k++) lancar('lama', angL + k * 0.3, 160, { max: 1.6 });
          break;
        case 'invocar':
          if (this.uma('i', 0.6)) {
            for (let k = 0; k < 2; k++) {
              const e = new LB.Sombra(this.x + (k ? 60 : -60), this.y + 30);
              e.estado = 'perseguir'; j.inimigos.push(e); this.lacaios.push(e);
              j.particulas.emitir('sombra', e.x, e.y - 14, 12, { vel: 80, vida: 0.7, r: 5 });
            }
          }
          break;
        case 'mergulho': {
          // Some no chão/água, persegue a Line pelas bolhas e sai embaixo dela.
          const a = this.alvoMergulho;
          if (this.t < 1.4) { a.x += (l.x - a.x) * Math.min(1, dt * 2); a.y += (l.y - a.y) * Math.min(1, dt * 2); this.x += (a.x - this.x) * Math.min(1, dt * 1.6); this.y += (a.y - this.y) * Math.min(1, dt * 1.6); }
          if (Math.random() < dt * 20) j.particulas.emitir(this.def.pocas === 'lama' ? 'poeira' : 'agua', this.x + (Math.random() - 0.5) * 30, this.y, 1, { vz: 60, vel: 20, vida: 0.5, r: 2 });
          if (this.uma('m', 1.4)) this.perigos.push({ tipo: 'circulo', x: this.x, y: this.y, r: 50, aviso: 0.7, t: 0, el: 'agua', dano, estilo: 'bolha' });
          if (this.uma('m2', 2.1)) { this.intocavel = false; j.tremer(5, 0.3); j.particulas.emitir('agua', this.x, this.y - 20, 20, { vel: 140, vz: 160, vida: 0.8 }); }
          break;
        }
        case 'jatos':
          if (this.uma('j', 0.55)) for (let k = -2; k <= 2; k++) lancar('agua', angL + k * 0.2, 210);
          if (this.uma('j2', 0.95) && this.def.elementos.length > 1) for (let k = -1; k <= 1; k++) lancar('agua', angL + k * 0.35 + 0.1, 190);
          break;
        case 'onda':
          if (this.uma('o', 0.9)) { this.perigos.push({ tipo: 'anel', x: this.x, y: this.y, r: 30, vel: 135, max: 260, el: this.def.pocas === 'lama' ? 'terra' : 'agua', dano, lenta: this.def.pocas === 'lama' }); j.tremer(3, 0.2); }
          break;
        case 'rajada': {
          if (this.uma('v', 0.8)) this.perigos.push({ tipo: 'vento', t: 0, dur: 1.6, origem: { x: this.x, y: this.y }, forca: 130 });
          for (let k = 0; k < 3; k++) if (this.uma('vp' + k, 1.0 + k * 0.4)) lancar('pena', angL + (Math.random() - 0.5) * 0.5, 200);
          break;
        }
        case 'penas':
          if (this.uma('p', 0.6)) for (let k = 0; k < 12; k++) lancar('pena', (k / 12) * TAU + this.t, 170);
          break;
        case 'raios':
          for (let k = 0; k < 4; k++) if (this.uma('r' + k, 0.2 + k * 0.38)) this.perigos.push({ tipo: 'circulo', x: l.x + (Math.random() - 0.5) * 16, y: l.y, r: 30, aviso: 0.7, t: 0, el: 'ar', dano, estilo: 'raio' });
          break;
      }
    }

    danoAtual() { return this.def.final && this.fase >= 2 && LB.dificuldade.id !== 'facil' ? 2 : this.def.dano; }

    cansar(j) {
      this.estado = 'exausto'; this.t = 0; this.exposto = 4.2 * LB.dif().guarda; this.cansaco = 0;
      j.particulas.emitir('brilho', this.x, this.y - 60, 14, { vel: 90, vida: 0.7 });
      if (LB.dicas) LB.dicas.chefe(j, this, 1);
    }

    receberGolpe(j, dano, ox, oy) {
      if (this.dormindo || this.estado === 'morrendo' || this.intocavel) return false;
      if (this.estado !== 'exausto') {
        j.particulas.emitir('faisca', this.x - this.lado * 10, this.y - 40, 6, { vel: 110, vz: 70, vida: 0.3 });
        if (LB.dificuldade.id === 'facil') { this.hp = Math.max(1, this.hp - 0.25); this.flash = 0.08; }
        j.dica('chefeGuarda', 'A guarda do chefe está fechada. Espere ele se cansar (o núcleo brilha) ou abra com a magia de luz!');
        return true;
      }
      this.hp -= dano; this.flash = 0.15;
      if (this.hp <= 0) return this.morrer(j);
      this.checarFase(j);
      return true;
    }

    receberMagia(j, dano) {
      if (this.dormindo || this.estado === 'morrendo' || this.intocavel) return false;
      this.flash = 0.2;
      if (this.estado === 'exausto') { this.hp -= dano; if (this.hp <= 0) return this.morrer(j); this.checarFase(j); return true; }
      if (this.recarga > 0) { j.particulas.emitir('faisca', this.x, this.y - 56, 6, { vel: 90, vz: 60, vida: 0.3 }); return true; }
      if (dano >= 3) this.hp = Math.max(1, this.hp - 1);
      this.perigos = this.perigos.filter((p) => p.tipo === 'poca');
      this.cansar(j);
      return true;
    }

    // A Quimera muda de elemento em 2/3 e 1/3 da vida.
    checarFase(j) {
      if (!this.def.fases) return;
      const nova = this.hp <= this.hpMax / 3 ? 2 : this.hp <= this.hpMax * 2 / 3 ? 1 : 0;
      if (nova <= this.fase) return;
      this.fase = nova; this.cor = ELEM[this.elementosAtuais()[0]];
      this.estado = 'observar'; this.t = -1; this.cansaco = 0; this.perigos = [];
      j.tremer(10, 0.8); j.flashTela = 0.5;
      j.particulas.emitir('brilho', this.x, this.y - 60, 30, { vel: 160, vida: 1 });
      this.perigos.push({ tipo: 'anel', x: this.x, y: this.y, r: 30, vel: 180, max: 300, el: this.elementosAtuais()[0], dano: 1 });
      LB.mochila.aviso(`${this.elementosAtuais().map((e) => ELEM[e].icone).join('')} A Quimera mudou: ${this.elementosAtuais().map((e) => ELEM[e].nome).join(', ')}!`);
      if (LB.dicas) LB.dicas.chefe(j, this, 2);
    }

    morrer(j) {
      this.hp = 0; this.estado = 'morrendo'; this.t = 0; this.perigos = [];
      j.tremer(9, 1.4); j.flashTela = 0.4;
      for (const e of this.lacaios) if (e.vivo) { e.vivo = false; j.particulas.emitir('sombra', e.x, e.y - 14, 10, { vel: 80, vida: 0.6, r: 5 }); }
      j.inimigos = j.inimigos.filter((e) => !this.lacaios.includes(e));
      return true;
    }

    desenharSombra(g) { if (!this.intocavel) D().sombraChao(g, this.x, this.y, this.def.forma === 'quimera' ? 50 : 38, 0.35); }
    desenharAvisos(g, j) { desenharPerigos(g, this, j); }
    desenhar(g, j) { desenharChefe(g, this, j); }
  }

  // ---------------- Perigos (círculos com aviso, ondas, poças, vento) ----------------
  function atingir(j, x, y, r, dano, o) {
    const l = j.line;
    if (!l || l.estado === 'morta') return false;
    if (Math.hypot(l.x - x, (l.y - y) * 1.3) > r) return false;
    return !!l.receberDano(j, dano, false, x, y, Object.assign({ bloqueavel: false }, o || {}));
  }

  function atualizarPerigos(ch, j, dt) {
    const l = j.line;
    for (const p of ch.perigos) {
      p.t = (p.t || 0) + dt;
      if (p.tipo === 'circulo') {
        if (!p.feito && p.t >= p.aviso) {
          p.feito = true;
          if (atingir(j, p.x, p.y, p.r, p.dano)) { /* acertou */ }
          const part = { fogo: 'brasa', terra: 'poeira', agua: 'agua', ar: 'brilho', pedra: 'pedra' }[p.el] || 'brilho';
          j.particulas.emitir(part, p.x, p.y - 6, 10, { vel: 90, vz: 120, vida: 0.6, r: 3 });
          if (p.estilo === 'raio') { j.flashTela = Math.max(j.flashTela, 0.15); j.tremer(3, 0.15); }
          if (p.poca) ch.perigos.push({ tipo: 'poca', x: p.x, y: p.y, r: p.r, t: 0, dur: 4.5, efeito: p.poca });
        }
        if (p.t > p.aviso + 0.35) p.morto = true;
      } else if (p.tipo === 'anel') {
        p.r += p.vel * dt;
        if (!p.acertou && l && Math.abs(Math.hypot(l.x - p.x, (l.y - p.y) * 1.5) - p.r) < 16 && !l.noAr) {
          if (l.receberDano(j, p.dano, false, p.x, p.y, { pulavel: true, bloqueavel: false })) p.acertou = true;
          if (p.lenta) l.lentidao = 1.5;
        }
        if (p.r > p.max) p.morto = true;
      } else if (p.tipo === 'poca') {
        if (l && !l.noAr && Math.hypot(l.x - p.x, (l.y - p.y) * 1.3) < p.r) {
          if (p.efeito === 'lava') { p.cd = (p.cd || 0) - dt; if (p.cd <= 0) { p.cd = 0.6; l.receberDano(j, 1, false, p.x, p.y, { bloqueavel: false, ignorarDefesa: true, brasa: true }); } }
          else l.lentidao = 0.4;
        }
        if (p.t > p.dur) p.morto = true;
      } else if (p.tipo === 'vento') {
        if (l && l.estado !== 'morta' && !(l.estado === 'defesa')) {
          const ax = l.x - p.origem.x, ay = l.y - p.origem.y, m = Math.hypot(ax, ay) || 1;
          l.mover(ax / m * p.forca * dt, ay / m * p.forca * 0.7 * dt, j);
        }
        if (Math.random() < dt * 30) j.particulas.emitir('vento', l.x - (l.x - p.origem.x) * 0.5 + (Math.random() - 0.5) * 200, l.y + (Math.random() - 0.5) * 120, 1, { vel: 0, vida: 0.5 });
        if (p.t > p.dur) p.morto = true;
      }
    }
    ch.perigos = ch.perigos.filter((p) => !p.morto);
  }

  function desenharPerigos(g, ch, j) {
    const t = j.tempo;
    for (const p of ch.perigos) {
      const c = ELEM[p.el] || ELEM.terra;
      if (p.tipo === 'circulo') {
        if (!p.feito) {
          const k = p.t / p.aviso, pis = 0.35 + 0.25 * Math.sin(t * 20);
          g.fillStyle = `rgba(${c.luz},${0.12 + 0.18 * k})`; g.beginPath(); g.ellipse(p.x, p.y, p.r, p.r * 0.62, 0, 0, TAU); g.fill();
          g.strokeStyle = p.estilo === 'raio' ? `rgba(255,255,255,${pis + 0.3})` : `rgba(255,80,60,${pis + 0.2})`; g.lineWidth = 2.5;
          g.beginPath(); g.ellipse(p.x, p.y, p.r * (1 - k * 0.3), p.r * 0.62 * (1 - k * 0.3), 0, 0, TAU); g.stroke();
        } else {
          const k = Math.min(1, (p.t - p.aviso) / 0.35);
          if (p.estilo === 'raiz') {
            g.fillStyle = `rgba(90,65,40,${1 - k})`;
            for (let i = 0; i < 4; i++) { const a = i * 1.6; g.beginPath(); g.moveTo(p.x + Math.cos(a) * 10 - 4, p.y); g.lineTo(p.x + Math.cos(a) * 6, p.y - 30 - i * 4); g.lineTo(p.x + Math.cos(a) * 10 + 4, p.y); g.fill(); }
          } else if (p.estilo === 'raio') {
            g.strokeStyle = `rgba(230,245,255,${1 - k})`; g.lineWidth = 4;
            g.beginPath(); g.moveTo(p.x, p.y - 260); g.lineTo(p.x - 10, p.y - 170); g.lineTo(p.x + 8, p.y - 100); g.lineTo(p.x - 4, p.y); g.stroke();
          } else {
            g.fillStyle = `rgba(${c.luz},${0.7 * (1 - k)})`; g.beginPath(); g.ellipse(p.x, p.y - 10, p.r * (0.6 + k * 0.6), p.r * 0.5 * (0.6 + k * 0.6), 0, 0, TAU); g.fill();
          }
        }
      } else if (p.tipo === 'anel') {
        const a = 1 - p.r / p.max;
        g.strokeStyle = `rgba(${c.luz},${a})`; g.lineWidth = 10 * a + 3;
        g.beginPath(); g.ellipse(p.x, p.y, p.r, p.r / 1.5, 0, 0, TAU); g.stroke();
      } else if (p.tipo === 'poca') {
        const a = Math.min(1, (p.dur - p.t) / 0.8);
        g.fillStyle = p.efeito === 'lava' ? `rgba(255,${90 + 40 * Math.sin(t * 6)},30,${0.55 * a})` : `rgba(90,65,40,${0.6 * a})`;
        g.beginPath(); g.ellipse(p.x, p.y, p.r, p.r * 0.6, 0, 0, TAU); g.fill();
      } else if (p.tipo === 'vento' && p.t < 0.8) {
        g.strokeStyle = 'rgba(230,245,255,.5)'; g.lineWidth = 2;
        for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU + t; g.beginPath(); g.arc(p.origem.x, p.origem.y - 30, 40 + p.t * 80, a, a + 0.6); g.stroke(); }
      }
    }
  }

  // ---------------- Desenho provisório (até chegar a arte) ----------------
  function desenharChefe(g, ch, j) {
    if (ch.intocavel && ch.estado === 'submerso') {
      // Só as bolhas e uma sombra escura se movendo.
      g.fillStyle = 'rgba(20,40,60,.35)'; g.beginPath(); g.ellipse(ch.x, ch.y, 34, 14, 0, 0, TAU); g.fill();
      return;
    }
    const r = LB.resolver(ch.anim.base, null, ch.lado);
    const t = j.tempo, y = ch.y - ch.alturaVoo;
    const morrendo = ch.estado === 'morrendo' ? Math.min(1, ch.t / 1.8) : 0;
    g.save();
    if (morrendo) g.globalAlpha = 1 - morrendo * 0.8;
    if (ch.flash > 0) g.filter = 'brightness(2)';
    if (r.sprite) {
      const st = ch.anim.estado(null, ch.lado);
      LB.desenharSprite(g, st.r, st.quadro, ch.x, y, 200);
    } else {
      const f = ch.def.forma, cs = ch.def.fases ? ch.elementosAtuais().map((e) => ELEM[e]) : ch.def.elementos.map((e) => ELEM[e]);
      const c1 = cs[0], c2 = cs[1] || cs[0];
      const resp = Math.sin(t * 2) * 2, cansado = ch.estado === 'exausto';
      g.translate(ch.x, y + (cansado ? 8 : 0)); g.scale(ch.lado < 0 ? -1 : 1, 1);
      if (f === 'golem') golem(g, c1, c2, resp, cansado, t, ch);
      else if (f === 'serpente') serpente(g, c1, c2, resp, cansado, t);
      else if (f === 'ave') ave(g, c1, c2, resp, cansado, t);
      else if (f === 'nuvem') nuvem(g, c1, c2, resp, cansado, t);
      else quimera(g, ch, resp, cansado, t);
    }
    g.restore();
    if (ch.estado === 'exausto') LB.fx.desenharLoop(g, 'FX_DRAGON_WEAK_POINT', ch.x + ch.lado * 6, ch.y - ch.alturaVoo - 56, t, { tam: 200 });
    if (ch.encantado > 0) { g.fillStyle = '#ffb3d9'; g.font = '16px system-ui'; g.textAlign = 'center'; g.fillText('♪', ch.x + Math.sin(t * 4) * 14, y - 110 - (t * 20) % 20); }
  }

  function nucleo(g, x, y, r, c, aberto, t) {
    const k = aberto ? 0.7 + 0.3 * Math.sin(t * 10) : 0.35;
    const gr = g.createRadialGradient(x, y, 0, x, y, r * 2);
    gr.addColorStop(0, `rgba(${c.luz},${k})`); gr.addColorStop(1, `rgba(${c.luz},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r * 2, 0, TAU); g.fill();
    g.fillStyle = aberto ? '#ffffff' : c.cor2; g.beginPath(); g.arc(x, y, r * 0.6, 0, TAU); g.fill();
  }

  function golem(g, c1, c2, resp, cansado, t, ch) {
    g.fillStyle = c2.cor2; g.fillRect(-26, -36, 18, 36); g.fillRect(8, -36, 18, 36);
    g.fillStyle = c1.cor; g.beginPath(); g.moveTo(-40, -30); g.lineTo(40, -30); g.lineTo(34, -96 + resp); g.lineTo(-34, -96 + resp); g.closePath(); g.fill();
    g.fillStyle = c1.cor2; for (let i = 0; i < 5; i++) g.fillRect(-30 + i * 13, -86 + resp + (i % 2) * 20, 9, 7);
    // Braços.
    const braco = ch.estado === 'atacar' ? Math.sin(ch.t * 8) * 10 : 0;
    g.fillStyle = c1.cor; g.fillRect(-58, -86 + resp + braco, 18, 48); g.fillRect(40, -86 + resp - braco, 18, 48);
    // Cabeça.
    g.fillStyle = c1.cor2; g.fillRect(-18, -120 + resp, 36, 26);
    g.fillStyle = cansado ? '#444' : `rgb(${c2.luz})`; g.fillRect(-10, -110 + resp, 6, 5); g.fillRect(6, -110 + resp, 6, 5);
    if (c2 !== c1) { g.fillStyle = c2.cor; for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(-26 + i * 17, -40 + Math.sin(t * 3 + i) * 3, 5, 0, TAU); g.fill(); } }
    if (c1.nome === 'Terra') { g.strokeStyle = '#5a4128'; g.lineWidth = 3; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-30 + i * 20, -30); g.quadraticCurveTo(-36 + i * 22, -10, -40 + i * 26, 0); g.stroke(); } g.fillStyle = '#e86a9a'; g.beginPath(); g.arc(0, -64 + resp, 8 + (cansado ? 4 : 0), 0, TAU); g.fill(); }
    nucleo(g, 0, -62 + resp, 9, c2, cansado, t);
  }

  function serpente(g, c1, c2, resp, cansado, t) {
    const seg = 7;
    for (let i = seg; i >= 0; i--) {
      const x = -i * 16, yy = -20 - Math.sin(t * 3 + i * 0.8) * 8 - (i === 0 ? (cansado ? 0 : 40) : Math.max(0, 30 - i * 6));
      g.fillStyle = i % 2 ? c1.cor : c1.cor2; g.beginPath(); g.ellipse(x, yy, 16 - i, 13 - i * 0.8, 0, 0, TAU); g.fill();
      if (c2 !== c1 && i % 2 === 0) { g.fillStyle = c2.cor; g.beginPath(); g.arc(x, yy - 6, 4, 0, TAU); g.fill(); }
    }
    const hy = cansado ? -24 : -64 + resp;
    g.fillStyle = c1.cor; g.beginPath(); g.ellipse(10, hy, 26, 18, 0.1, 0, TAU); g.fill();
    g.fillStyle = c1.cor2; g.beginPath(); g.moveTo(24, hy + 4); g.lineTo(44, hy + 8); g.lineTo(24, hy + 14); g.fill();
    g.fillStyle = cansado ? '#333' : '#ffe07a'; g.beginPath(); g.arc(18, hy - 6, 3.5, 0, TAU); g.fill();
    g.strokeStyle = c1.cor2; g.lineWidth = 3; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-4 - i * 7, hy - 12); g.lineTo(-10 - i * 7, hy - 26); g.stroke(); }
    nucleo(g, 6, hy + 2, 7, c2, cansado, t);
  }

  function ave(g, c1, c2, resp, cansado, t) {
    const bate = cansado ? 0.2 : Math.sin(t * 9);
    g.fillStyle = c1.cor2;
    for (const s of [-1, 1]) { g.beginPath(); g.moveTo(0, -60); g.quadraticCurveTo(s * 50, -100 - bate * 30, s * 90, -70 - bate * 26); g.quadraticCurveTo(s * 50, -58, 0, -46); g.fill(); }
    g.fillStyle = c1.cor; g.beginPath(); g.ellipse(0, -52 + resp, 26, 20, 0, 0, TAU); g.fill();
    g.fillStyle = '#b8894a'; g.beginPath(); g.ellipse(-4, -30, 16, 10, 0, 0, TAU); g.fill();
    g.fillStyle = c1.cor; g.beginPath(); g.arc(20, -74 + resp, 13, 0, TAU); g.fill();
    g.fillStyle = '#f2c14e'; g.beginPath(); g.moveTo(30, -76 + resp); g.lineTo(44, -70 + resp); g.lineTo(30, -66 + resp); g.fill();
    g.fillStyle = cansado ? '#333' : '#4a90d9'; g.beginPath(); g.arc(24, -78 + resp, 3, 0, TAU); g.fill();
    if (c2 !== c1) { g.fillStyle = c2.cor; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(-18 + i * 12, -42 + Math.sin(t * 5 + i) * 2, 3, 0, TAU); g.fill(); } }
    nucleo(g, 0, -52 + resp, 7, c1, cansado, t);
  }

  function nuvem(g, c1, c2, resp, cansado, t) {
    g.fillStyle = cansado ? '#6a7a8a' : '#4a5a6e';
    for (let i = 0; i < 7; i++) { g.beginPath(); g.arc(-48 + i * 16, -70 + Math.sin(t * 2 + i) * 6 + resp, 20 + (i % 3) * 5, 0, TAU); g.fill(); }
    g.strokeStyle = 'rgba(160,210,255,.7)'; g.lineWidth = 2;
    for (let i = 0; i < 6; i++) { const x = -40 + i * 16; g.beginPath(); g.moveTo(x, -50); g.lineTo(x - 6, -30 + ((t * 120 + i * 13) % 30)); g.stroke(); }
    if (!cansado && Math.sin(t * 7) > 0.9) { g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.moveTo(10, -60); g.lineTo(0, -34); g.lineTo(12, -34); g.lineTo(2, -8); g.stroke(); }
    g.fillStyle = '#e8f4ff'; g.beginPath(); g.arc(-10, -78 + resp, 5, 0, TAU); g.arc(10, -78 + resp, 5, 0, TAU); g.fill();
    nucleo(g, 0, -64 + resp, 9, c2, cansado, t);
  }

  function quimera(g, ch, resp, cansado, t) {
    const todos = ['pedra', 'fogo', 'terra', 'agua', 'ar'].map((e) => ELEM[e]);
    const cor = ch.cor;
    // Corpo de pedra, patas de terra, asas de ar, cauda de água, crina de fogo.
    g.fillStyle = todos[2].cor2; for (const x of [-34, -14, 14, 34]) g.fillRect(x - 7, -34, 14, 34);
    g.fillStyle = todos[4].cor2; const bate = Math.sin(t * 5);
    for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * 10, -86); g.quadraticCurveTo(s * 60, -140 - bate * 20, s * 104, -100); g.quadraticCurveTo(s * 60, -84, s * 10, -70); g.fill(); }
    g.fillStyle = todos[0].cor; g.beginPath(); g.ellipse(0, -62 + resp, 56, 34, 0, 0, TAU); g.fill();
    g.strokeStyle = todos[3].cor; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(-50, -60); g.quadraticCurveTo(-90, -40 + Math.sin(t * 3) * 10, -86, -96); g.stroke();
    g.fillStyle = todos[0].cor2; g.beginPath(); g.ellipse(52, -96 + resp, 24, 20, 0, 0, TAU); g.fill();
    g.fillStyle = todos[1].cor; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(36 + i * 5, -112 + resp); g.lineTo(40 + i * 5, -132 - Math.sin(t * 10 + i) * 6 + resp); g.lineTo(44 + i * 5, -112 + resp); g.fill(); }
    g.fillStyle = cansado ? '#222' : `rgb(${cor.luz})`; g.beginPath(); g.arc(62, -100 + resp, 4, 0, TAU); g.fill();
    // Cinco núcleos: o do elemento atual brilha mais.
    todos.forEach((c, i) => { const ativo = ch.elementosAtuais().includes(['pedra', 'fogo', 'terra', 'agua', 'ar'][i]); g.globalAlpha = ativo ? 1 : 0.4; nucleo(g, -32 + i * 16, -62 + resp, 6, c, cansado && ativo, t); g.globalAlpha = 1; });
  }

  // ---------------- Colocar o chefe da área ----------------
  function prepararArea(j) {
    const d = j.mapa.def.chefe;
    if (!d || j.flags[CHEFES[d.id].flag]) return;
    const ch = new Chefe(d.id, T(d.x), T(d.y), d.arena);
    j.inimigos.push(ch);
    j.chefeArena = ch;
  }

  // Liga o chefe quando a heroína entra na arena, e segura ela lá dentro até o fim da luta.
  function atualizarArena(j) {
    const ch = j.chefeArena;
    if (!ch || !j.line) return;
    const [x0, y0, x1, y1] = ch.arena, l = j.line;
    const dentro = l.x > T(x0) && l.x < T(x1 + 1) && l.y > T(y0) && l.y < T(y1 + 1);
    if (ch.dormindo && dentro && !j.cena && l.estado === 'livre') { j.iniciarCena(LB.HISTORIA.chefeIntro, { semPular: false }, ch); return; }
    if (!ch.vivo) { j.chefeArena = null; return; }
    if (!ch.dormindo && ch.estado !== 'morrendo' && !dentro && !j.cena) {
      l.x = Math.max(T(x0) + 12, Math.min(T(x1 + 1) - 12, l.x));
      l.y = Math.max(T(y0) + 20, Math.min(T(y1 + 1) - 4, l.y));
      j.dica('arena', 'Uma barreira de energia prende você na arena até o fim da luta!');
    }
  }

  function desenharArena(g, j) {
    const ch = j.chefeArena;
    if (!ch || ch.dormindo || !ch.vivo || ch.estado === 'morrendo') return;
    const [x0, y0, x1, y1] = ch.arena;
    g.strokeStyle = `rgba(${ch.cor.luz},${0.35 + 0.15 * Math.sin(j.tempo * 4)})`; g.lineWidth = 3; g.setLineDash([10, 8]);
    g.strokeRect(T(x0), T(y0), T(x1 - x0 + 1), T(y1 - y0 + 1)); g.setLineDash([]);
  }

  LB.chefes = { ELEM, CHEFES, POR_ELEMENTO, Chefe, prepararArea, atualizarArena, desenharArena };
})(window.LB);
