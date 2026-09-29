'use strict';

(function (LB) {
  const TAU = Math.PI * 2;
  const ALTURA_LINE = 74;
  const VEL_ANDAR = 90;
  const VEL_CORRER = 168;
  const D = () => LB.desenho;

  function dirDe(x, y, atual) {
    if (!x && !y) return atual;
    if (Math.abs(x) > Math.abs(y) * 1.1) return x < 0 ? 'LEFT' : 'RIGHT';
    return y < 0 ? 'BACK' : 'FRONT';
  }

  // ---------------- Partículas ----------------
  class Particulas {
    constructor() { this.lista = []; }

    emitir(tipo, x, y, n, o) {
      o = o || {};
      for (let i = 0; i < (n || 1); i++) {
        const a = o.angulo != null ? o.angulo + (Math.random() - 0.5) * (o.abertura || 0.6) : Math.random() * TAU;
        const v = (o.vel || 60) * (0.5 + Math.random());
        this.lista.push({
          tipo, x: x + (Math.random() - 0.5) * (o.espalha || 0), y, z: o.z || 0,
          vx: Math.cos(a) * v, vy: Math.sin(a) * v * (o.plano ? 1 : 0.5), vz: o.vz != null ? o.vz * (0.6 + Math.random() * 0.8) : 0,
          vida: 0, max: (o.vida || 0.6) * (0.7 + Math.random() * 0.6), r: (o.r || 3) * (0.7 + Math.random() * 0.6), cor: o.cor,
        });
      }
    }

    atualizar(dt) {
      for (const p of this.lista) {
        p.vida += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
        if (p.tipo === 'fogo' || p.tipo === 'fumaca') { p.vz += 20 * dt; p.vx *= 0.97; p.vy *= 0.97; }
        else if (p.tipo === 'folha' || p.tipo === 'faisca' || p.tipo === 'pedra') { p.vz -= 260 * dt; if (p.z < 0) { p.z = 0; p.vz *= -0.3; p.vx *= 0.6; p.vy *= 0.6; } }
        else if (p.tipo === 'coracao') { p.vz = 30; p.vx *= 0.98; }
        else if (p.tipo === 'folhaCai') {
          if (p.z > 0) { p.vx = Math.sin(p.vida * 3 + p.r * 5) * 22; p.vy = 4; p.z = Math.max(0, p.z + p.vz * dt); }
          else { p.vx = 0; p.vy = 0; }
        } else if (p.tipo === 'brasa') { p.vx = Math.sin(p.vida * 4 + p.r * 9) * 10; }
        else { p.vx *= 0.92; p.vy *= 0.92; }
      }
      this.lista = this.lista.filter((p) => p.vida < p.max);
    }

    desenhar(g) {
      for (const p of this.lista) {
        const k = p.vida / p.max, a = 1 - k;
        const X = p.x, Y = p.y - p.z;
        switch (p.tipo) {
          case 'poeira': g.fillStyle = `rgba(200,180,150,${a * 0.6})`; g.beginPath(); g.arc(X, Y, p.r * (1 + k * 2), 0, TAU); g.fill(); break;
          case 'fumaca': g.fillStyle = `rgba(90,80,80,${a * 0.5})`; g.beginPath(); g.arc(X, Y, p.r * (1 + k * 2.5), 0, TAU); g.fill(); break;
          case 'fogo': {
            const cor = k < 0.3 ? '255,240,160' : k < 0.6 ? '255,150,40' : '200,50,20';
            g.fillStyle = `rgba(${cor},${a})`; g.beginPath(); g.arc(X, Y, p.r * (1 + k), 0, TAU); g.fill(); break;
          }
          case 'faisca': g.strokeStyle = `rgba(255,230,120,${a})`; g.lineWidth = 1.5; g.beginPath(); g.moveTo(X, Y); g.lineTo(X - p.vx * 0.03, Y - p.vy * 0.03 + p.vz * 0.03); g.stroke(); break;
          case 'impacto': g.strokeStyle = `rgba(255,255,255,${a})`; g.lineWidth = 3 * a; g.beginPath(); g.arc(X, Y, p.r + k * 26, 0, TAU); g.stroke(); break;
          case 'onda': g.strokeStyle = `rgba(230,210,170,${a})`; g.lineWidth = 4 * a; g.beginPath(); g.ellipse(X, Y, p.r + k * 90, (p.r + k * 90) * 0.4, 0, 0, TAU); g.stroke(); break;
          case 'folha': g.fillStyle = p.cor || '#3e7a33'; g.save(); g.translate(X, Y); g.rotate(p.vida * 8); g.fillRect(-3, -1.5, 6, 3); g.restore(); break;
          case 'pedra': g.fillStyle = '#6b5a52'; g.fillRect(X - p.r / 2, Y - p.r / 2, p.r, p.r); break;
          case 'coracao': g.globalAlpha = a; D().coracaoForma(g, X, Y, 6, '#ff5d8f'); g.globalAlpha = 1; break;
          case 'brilho': g.fillStyle = `rgba(255,255,200,${a})`; D().estrela(g, X, Y, p.r * (1 - k * 0.5)); break;
          case 'agua': g.fillStyle = `rgba(160,210,255,${a})`; g.beginPath(); g.arc(X, Y, p.r, 0, TAU); g.fill(); break;
          case 'sombra': g.fillStyle = `rgba(60,30,90,${a * 0.7})`; g.beginPath(); g.arc(X, Y, p.r * (1 + k * 2), 0, TAU); g.fill(); break;
          case 'folhaCai':
            g.globalAlpha = Math.min(1, a * 3); g.fillStyle = p.cor || '#51a043';
            g.save(); g.translate(X, Y); g.rotate(Math.sin(p.vida * 4) * 0.9); g.beginPath(); g.ellipse(0, 0, 3.2, 1.8, 0, 0, TAU); g.fill(); g.restore();
            g.globalAlpha = 1; break;
          case 'brasa': g.fillStyle = `rgba(255,${150 + Math.floor(80 * a)},60,${a})`; g.beginPath(); g.arc(X, Y, p.r, 0, TAU); g.fill(); break;
          case 'gota': g.fillStyle = `rgba(110,180,255,${a})`; g.beginPath(); g.arc(X, Y, p.r, 0, TAU); g.fill(); break;
        }
      }
    }
  }

  // ---------------- Golpes da Line ----------------
  const GOLPES = {
    LINE_ATTACK_HORIZONTAL: { janelas: [[0.3, 0.56]], dano: 1, alcance: 62, largura: 30, empurra: 110, proximo: 0.6 },
    LINE_ATTACK_VERTICAL: { janelas: [[0.38, 0.6]], dano: 1, alcance: 56, largura: 26, empurra: 110, proximo: 0.66 },
    LINE_ATTACK_COMBO: { janelas: [[0.22, 0.4], [0.55, 0.74]], dano: 1, alcance: 66, largura: 34, empurra: 150 },
    LINE_ATTACK_DIAGONAL: { janelas: [[0.28, 0.52]], dano: 2, alcance: 68, largura: 32, empurra: 160, investida: 170 },
    LINE_ATTACK_SPIN: { janelas: [[0.28, 0.76]], dano: 2, raio: 66, empurra: 170 },
    LINE_ATTACK_AIR: { janelas: [[0.5, 0.74]], dano: 2, raio: 60, empurra: 170 },
  };
  const SEQUENCIA = ['LINE_ATTACK_HORIZONTAL', 'LINE_ATTACK_VERTICAL', 'LINE_ATTACK_COMBO'];

  class Line {
    constructor(x, y, dir) {
      this.x = x; this.y = y;
      this.dir = dir || 'FRONT';
      this.lado = 1;
      this.hpMax = 6; this.hp = 6;
      this.anim = new LB.Animador('LINE_IDLE');
      this.estado = 'livre';
      this.t = 0;
      this.temEspada = false;
      this.armada = false;
      this.invul = 0;
      this.vx = 0; this.vy = 0;
      this.noAr = false;
      this.correndo = false;
      this.sub = null;
      this.parada = 0;
      this.semCombate = 0;
      this.seguro = { x, y };
      this.alvosAtingidos = new Set();
      this.janela = -1;
      this.filaAtaque = false;
      this.cooldownGiro = 0;
      this.raio = 12;
      this.visivel = true;
      this.temMagia = false; this.temEstrela = false;
      this.manaMax = 6; this.mana = 6;
    }

    mudar(estado, anim, reiniciar) {
      this.estado = estado; this.t = 0;
      if (anim) this.anim.tocar(anim, reiniciar !== false);
    }

    get dirAnim() { return this.dir; }

    estadoAnim() { return this.anim.estado(this.dirAnim, this.lado); }

    // Movimento com colisão (eixos separados, desliza em quinas).
    mover(dx, dy, jogo) {
      const mapa = jogo.mapa, mw = 9, mh = 5;
      const livre = (x, y) => !mapa.colide(x, y - mh, mw, mh, this.noAr) && !jogo.bloqueia(x, y, this);
      if (dx) {
        if (livre(this.x + dx, this.y)) this.x += dx;
        else if (!dy) { for (const s of [-1, 1]) if (livre(this.x + dx, this.y + s * 3)) { this.y += s * 1.5; break; } }
      }
      if (dy) {
        if (livre(this.x, this.y + dy)) this.y += dy;
        else if (!dx) { for (const s of [-1, 1]) if (livre(this.x + s * 3, this.y + dy)) { this.x += s * 1.5; break; } }
      }
    }

    atualizar(dt, jogo) {
      const E = LB.entrada;
      this.t += dt;
      this.invul = Math.max(0, this.invul - dt);
      this.cooldownGiro = Math.max(0, this.cooldownGiro - dt);
      if (this.temMagia && this.mana < this.manaMax && this.estado !== 'carregar') this.mana = Math.min(this.manaMax, this.mana + dt / 2.6 * LB.dif().regen);
      this.anim.atualizar(dt);
      const st = this.estadoAnim();
      const controlavel = !jogo.cena && this.estado !== 'morta';

      switch (this.estado) {
        case 'livre': this.livre(dt, jogo, E, controlavel); break;

        case 'sacar':
          if (st.acabou) { this.armada = true; this.semCombate = 0; this.voltarLivre(); if (this.filaAtaque) { this.filaAtaque = false; this.atacar(jogo, 0); } }
          break;

        case 'guardar':
          if (controlavel && (E.apertou('atacar') || E.segura('defender'))) { this.armada = true; this.voltarLivre(); break; }
          if (st.acabou) { this.armada = false; this.voltarLivre(); }
          break;

        case 'ataque': {
          const g = GOLPES[this.anim.base];
          if (g.investida && st.progresso < 0.45) this.mover(this.lado * g.investida * dt * (1 - st.progresso * 2), 0, jogo);
          else if (st.progresso < 0.3) this.mover(this.lado * 30 * dt, 0, jogo);
          this.golpear(jogo, g, st.progresso);
          if (controlavel && E.apertou('atacar') && st.progresso > 0.3) this.filaAtaque = true;
          if (controlavel && st.progresso > 0.4) {
            if (E.apertou('esquivar')) { this.esquivar(jogo, E.eixo()); break; }
            if (E.apertou('pular')) { this.pular(jogo, E.eixo()); break; }
          }
          if (this.filaAtaque && g.proximo && st.progresso >= g.proximo && this.passo < SEQUENCIA.length - 1) {
            this.filaAtaque = false; this.atacar(jogo, this.passo + 1); break;
          }
          if (st.acabou) this.voltarLivre();
          break;
        }

        case 'giro':
          this.golpear(jogo, GOLPES.LINE_ATTACK_SPIN, st.progresso);
          if (controlavel && st.progresso > 0.6 && E.apertou('pular')) { this.cooldownGiro = 0.5; this.pular(jogo, E.eixo()); break; }
          if (st.acabou) { this.cooldownGiro = 0.5; this.voltarLivre(); }
          break;

        case 'pulo': {
          this.noAr = st.progresso > 0.12 && st.progresso < 0.86;
          if (st.progresso > 0.12 && st.progresso < 0.9) this.mover(this.vx * dt, this.vy * dt, jogo);
          if (controlavel && this.temEspada && this.noAr && E.apertou('atacar')) {
            this.armada = true; this.mudar('aereo', 'LINE_ATTACK_AIR'); this.anim.irPara(0.3, this.dir, this.lado);
            this.vx *= 0.6; this.vy *= 0.6; this.alvosAtingidos.clear(); this.janela = -1; break;
          }
          if (st.acabou) this.aterrissar(jogo);
          break;
        }

        case 'aereo': {
          this.noAr = st.progresso < 0.68;
          if (st.progresso < 0.7) this.mover(this.vx * dt, this.vy * dt, jogo);
          this.golpear(jogo, GOLPES.LINE_ATTACK_AIR, st.progresso);
          if (!this.ondaFeita && st.progresso > 0.66) {
            this.ondaFeita = true;
            jogo.particulas.emitir('onda', this.x, this.y, 1, { r: 8, vida: 0.4, vel: 0 });
            jogo.particulas.emitir('poeira', this.x, this.y, 10, { vel: 90, vida: 0.5, r: 4 });
            LB.fx.emitir(jogo, 'FX_DUST', this.x, this.y - 6);
            jogo.tremer(3, 0.15);
          }
          if (st.acabou) { this.ondaFeita = false; this.aterrissar(jogo); }
          break;
        }

        case 'queda':
          if (st.acabou) this.voltarLivre();
          break;

        case 'esquiva': {
          const p = st.progresso;
          if (p > 0.12 && p < 0.62) this.mover(this.vx * dt, this.vy * dt, jogo);
          if (p > 0.1 && p < 0.66) this.invul = Math.max(this.invul, 0.05);
          if (st.acabou) this.voltarLivre();
          break;
        }

        case 'dash': {
          const p = st.progresso;
          if (p > 0.08 && p < 0.6) this.mover(this.vx * dt, this.vy * dt, jogo);
          if (p > 0.05 && p < 0.62) this.invul = Math.max(this.invul, 0.05);
          if (p > 0.1 && p < 0.3 && Math.random() < 0.5) jogo.particulas.emitir('poeira', this.x - this.lado * 10, this.y, 1, { vel: 20, vida: 0.4 });
          if (controlavel && this.temEspada && E.apertou('atacar') && p > 0.45) { this.armada = true; this.atacarCorrendo(jogo); break; }
          if (st.acabou) this.voltarLivre();
          break;
        }

        case 'defesa': {
          const segura = controlavel && E.segura('defender');
          if (controlavel && !this.impacto && E.apertou('pular')) { this.pular(jogo, E.eixo()); break; }
          if (controlavel && !this.impacto && E.apertou('esquivar')) { this.esquivar(jogo, E.eixo()); break; }
          if (this.impacto) {
            if (st.progresso >= 0.66) { this.impacto = false; if (segura) this.anim.irPara(0.3, this.dir, this.lado); }
          } else if (segura) {
            if (st.progresso > 0.3) this.anim.irPara(0.3, this.dir, this.lado);
          } else if (st.progresso < 0.7) {
            this.anim.irPara(0.7, this.dir, this.lado);
          }
          this.vx *= 0.85; this.mover(this.vx * dt, 0, jogo);
          if (st.acabou) this.voltarLivre();
          break;
        }

        case 'dano':
          this.mover(this.vx * dt, this.vy * dt, jogo); this.vx *= 0.9; this.vy *= 0.9;
          if (st.acabou) { this.invul = 0.8; this.voltarLivre(); }
          break;

        case 'forte': this.golpeForte(dt, jogo, st); break;

        case 'tropeco': {
          const b = this.anim.base;
          if (b === 'LINE_STUMBLE') { this.mover(this.vx * dt, this.vy * dt, jogo); this.vx *= 0.96; this.vy *= 0.96; }
          if (st.acabou) {
            if (b === 'LINE_STUMBLE') { this.anim.tocar('LINE_FALL', true); jogo.particulas.emitir('poeira', this.x + this.lado * 20, this.y, 8, { vel: 50 }); }
            else if (b === 'LINE_FALL') this.anim.tocar('LINE_GROUND_STAND', true);
            else this.voltarLivre();
          }
          break;
        }

        case 'agachar':
          if (this.anim.base === 'LINE_CROUCH' && st.acabou) {
            if (this.aoAgachar) { const f = this.aoAgachar; this.aoAgachar = null; f(); }
            if (this.estado === 'agachar') this.anim.tocar('LINE_CROUCH_STAND', true);
          } else if (this.anim.base === 'LINE_CROUCH_STAND' && st.acabou) this.voltarLivre();
          break;

        case 'magia':
          if (!this.lancou && st.progresso >= 0.4) { this.lancou = true; LB.magia.raio(jogo, this); }
          if (controlavel && st.progresso > 0.55 && E.apertou('magia')) { this.lancarRaio(jogo); break; }
          if (st.acabou) this.voltarLivre();
          break;

        case 'carregar': {
          // Segurando o botão de magia: carrega a Chuva de Estrelas; soltando cedo vira Raio de Luz.
          const cheia = this.t >= 0.9 && this.mana >= LB.magia.CUSTO_ESTRELA;
          if (!this.efeitoCarga) { this.efeitoCarga = { tipo: 'carga', t: 0, dur: 0.12 }; jogo.efeitos.push(this.efeitoCarga); }
          this.efeitoCarga.carga = this.t / 0.9; this.efeitoCarga.t = 0;
          if (Math.random() < dt * 20) {
            const a = Math.random() * TAU, r = 40;
            jogo.particulas.emitir(cheia ? 'brilho' : 'gota', this.x + Math.cos(a) * r, this.y - 30 + Math.sin(a) * r * 0.5, 1, { angulo: a + Math.PI, abertura: 0.1, vel: 70, vida: 0.4, r: cheia ? 3 : 2 });
          }
          if (!controlavel || !E.segura('magia')) {
            this.efeitoCarga.t = this.efeitoCarga.dur; this.efeitoCarga = null;
            if (cheia) { this.mana -= LB.magia.CUSTO_ESTRELA; this.mudar('estrela', 'LINE_CAST_STARS'); this.estrelaFeita = false; }
            else this.lancarRaio(jogo);
          }
          break;
        }

        case 'estrela':
          if (!this.estrelaFeita && st.progresso >= 0.3) { this.estrelaFeita = true; LB.magia.estrela(jogo, this); }
          if (st.acabou) this.voltarLivre();
          break;

        case 'final': jogo.passoFinal(this, st, dt); break;

        case 'cena': this.cena(dt, jogo, st); break;

        case 'morta': break;
      }

      if (!this.noAr && this.estado !== 'forte' && this.estado !== 'morta') {
        const tile = jogo.mapa.tileEm(this.x, this.y - 3);
        if (tile === 'w' || tile === '~' || tile === 'j') this.cairNaAgua(jogo);
        else if (this.estado === 'livre') this.seguro = { x: this.x, y: this.y };
      }
    }

    voltarLivre() {
      this.estado = 'livre'; this.t = 0; this.noAr = false; this.sub = null;
      this.anim.tocar(this.animParada(), true);
    }

    animParada() {
      if (this.armada) return 'LINE_COMBAT_IDLE';
      if (this.hp <= 2) return 'LINE_EXHAUSTED_IDLE';
      return 'LINE_IDLE';
    }

    livre(dt, jogo, E, controlavel) {
      const eixo = controlavel ? E.eixo() : { x: 0, y: 0, correr: false };
      const movendo = eixo.x !== 0 || eixo.y !== 0;

      if (this.modoDuo || this.modoPasseio) {
        // De mãos dadas ou no primeiro encontro: só anda (sem correr) e interage.
        eixo.correr = false;
        if (this.travada) { eixo.x = 0; eixo.y = 0; }
        if (controlavel && (E.apertou('interagir') || E.apertou('atacar'))) jogo.interagir(this);
      } else if (controlavel) {
        if (E.apertou('interagir') && jogo.interagir(this)) return;
        if (E.apertou('pular')) { this.pular(jogo, eixo); return; }
        if (E.apertou('atacar')) {
          if (jogo.interagir(this, true)) return;
          if (this.temEspada) {
            if (!this.armada) { this.filaAtaque = true; this.mudar('sacar', 'LINE_SWORD_DRAW'); return; }
            if (this.correndo) { this.atacarCorrendo(jogo); return; }
            this.atacar(jogo, 0); return;
          }
          jogo.dica('semEspada', 'A Line ainda não tem uma arma. Explore a floresta!');
        }
        if (E.apertou('especial') && this.temEspada) {
          if (!this.armada) { this.mudar('sacar', 'LINE_SWORD_DRAW'); return; }
          if (this.cooldownGiro <= 0) { this.mirar(jogo); this.mudar('giro', 'LINE_ATTACK_SPIN'); this.alvosAtingidos.clear(); this.janela = -1; return; }
        }
        if (E.apertou('magia')) {
          if (!this.temMagia) { jogo.dica('semMagia', this.temEspada ? 'A Line ainda não sabe magia. Dizem que as Ruínas Encantadas guardam uma luz antiga...' : 'A Line ainda não sabe magia.'); }
          else if (this.temEstrela) { this.armada = this.temEspada; this.efeitoCarga = null; this.mudar('carregar', 'LINE_CAST_CHARGE'); return; }
          else { this.lancarRaio(jogo); return; }
        }
        if (E.apertou('esquivar')) {
          if (this.correndo && movendo) this.dash(jogo, eixo); else this.esquivar(jogo, eixo);
          return;
        }
        if (E.segura('defender') && this.temEspada) {
          if (!this.armada) { this.mudar('sacar', 'LINE_SWORD_DRAW'); return; }
          this.impacto = false; this.vx = 0; this.mudar('defesa', 'LINE_BLOCK'); return;
        }
      }

      const correr = movendo && eixo.correr;
      if (movendo) {
        this.dir = dirDe(eixo.x, eixo.y, this.dir);
        if (eixo.x) this.lado = eixo.x < 0 ? -1 : 1;
        this.parada = 0;
      }

      // Transições de corrida (começar parada / parar).
      if (correr && !this.correndo && !this.moviaAntes) this.sub = { anim: 'LINE_RUN_START', ate: 0 };
      this.moviaAntes = movendo;
      if (!movendo && this.correndo) { this.sub = { anim: 'LINE_RUN_STOP', ate: 0, vx: this.ultVx, vy: this.ultVy }; }
      if (movendo && this.sub && this.sub.anim === 'LINE_RUN_STOP') this.sub = null;
      this.correndo = correr;

      let vel = correr ? (this.botas ? VEL_CORRER * 1.2 : VEL_CORRER) : VEL_ANDAR;
      if (this.sub && this.sub.anim === 'LINE_RUN_START') vel *= 0.55 + 0.45 * Math.min(1, this.anim.t / 0.3);
      if (movendo) {
        this.ultVx = eixo.x * vel; this.ultVy = eixo.y * vel;
        this.mover(eixo.x * vel * dt, eixo.y * vel * dt, jogo);
      } else if (this.sub && this.sub.anim === 'LINE_RUN_STOP') {
        const k = Math.max(0, 1 - this.anim.t / 0.3);
        this.mover(this.sub.vx * 0.5 * k * dt, this.sub.vy * 0.5 * k * dt, jogo);
      }

      if (correr && !this.botas && jogo.mapa.tileEm(this.x, this.y - 3) === 'r') { this.tropecar(jogo); return; }

      // Escolha da animação.
      if (this.sub) {
        const base = this.armada && this.sub.anim === 'LINE_RUN_START' ? null : this.sub.anim;
        if (base) {
          this.anim.tocar(base);
          if (this.anim.estado(this.dir, this.lado).acabou) this.sub = null;
        } else this.sub = null;
      }
      if (!this.sub) {
        if (movendo) this.anim.tocar(this.armada ? (correr ? 'LINE_COMBAT_RUN' : 'LINE_COMBAT_WALK') : (correr ? 'LINE_RUN' : 'LINE_WALK'));
        else this.parado(dt);
      }

      // Guarda a espada sozinha depois de um tempo sem inimigos por perto.
      if (this.armada) {
        this.semCombate = jogo.inimigoPerto(this.x, this.y, 240) ? 0 : this.semCombate + dt;
        if (this.semCombate > 4 && !movendo) { this.semCombate = 0; this.mudar('guardar', 'LINE_SWORD_SHEATHE'); }
      }
    }

    parado(dt) {
      this.parada += dt;
      const base = this.animParada();
      const extra = this.anim.base === 'LINE_LOOK_SIDES_FRONT' || this.anim.base === 'LINE_BLINK_FRONT';
      if (extra) {
        if (!this.anim.estado(this.dir, this.lado).acabou) return;
        this.anim.tocar(base, true); return;
      }
      if (base === 'LINE_IDLE' && this.dir === 'FRONT') {
        if (this.parada > 7) { this.parada = 0; this.anim.tocar('LINE_LOOK_SIDES_FRONT', true); return; }
        if (Math.random() < dt * 0.25) { this.anim.tocar('LINE_BLINK_FRONT', true); return; }
      }
      this.anim.tocar(base);
    }

    mirar(jogo) {
      const alvo = jogo.alvoMaisProximo(this.x, this.y, 110);
      if (alvo && Math.abs(alvo.x - this.x) > 4) this.lado = alvo.x < this.x ? -1 : 1;
      if (this.dir === 'LEFT' || this.dir === 'RIGHT') this.dir = this.lado < 0 ? 'LEFT' : 'RIGHT';
    }

    atacar(jogo, passo) {
      this.passo = passo;
      this.mirar(jogo);
      this.mudar('ataque', SEQUENCIA[passo]);
      this.alvosAtingidos.clear(); this.janela = -1; this.filaAtaque = false;
      this.semCombate = 0;
    }

    lancarRaio(jogo) {
      if (this.mana < LB.magia.CUSTO_RAIO) {
        jogo.avisoMana = 0.6;
        jogo.dica('semMana', 'Sem magia! Ela volta sozinha aos poucos, e os cristais azuis que os inimigos soltam recarregam.');
        this.voltarLivre(); return;
      }
      this.mana -= LB.magia.CUSTO_RAIO;
      this.mirar(jogo);
      this.armada = this.temEspada;
      this.lancou = false;
      this.mudar('magia', 'LINE_CAST_SPELL');
    }

    atacarCorrendo(jogo) {
      this.passo = SEQUENCIA.length - 1;
      this.mirar(jogo);
      this.mudar('ataque', 'LINE_ATTACK_DIAGONAL');
      this.alvosAtingidos.clear(); this.janela = -1; this.filaAtaque = false; this.correndo = false;
    }

    golpear(jogo, g, p) {
      const j = g.janelas.findIndex(([a, b]) => p >= a && p <= b);
      if (j < 0) return;
      if (j !== this.janela) { this.janela = j; this.alvosAtingidos.clear(); if (!g.raio) jogo.rastro(this, g); }
      jogo.acertar(this, g, this.alvosAtingidos);
    }

    pular(jogo, eixo) {
      const movendo = eixo.x || eixo.y;
      const vel = movendo ? (eixo.correr ? 175 : 130) : 0;
      if (eixo.x) this.lado = eixo.x < 0 ? -1 : 1;
      this.dir = this.lado < 0 ? 'LEFT' : 'RIGHT';
      this.vx = eixo.x * vel; this.vy = eixo.y * vel;
      this.correndo = false; this.sub = null;
      this.mudar('pulo', 'LINE_JUMP');
    }

    aterrissar(jogo) {
      this.noAr = false;
      jogo.particulas.emitir('poeira', this.x, this.y, 6, { vel: 50, vida: 0.4 });
      const tile = jogo.mapa.tileEm(this.x, this.y - 3);
      if (tile === 'w' || tile === '~' || tile === 'j') { this.cairNaAgua(jogo); return; }
      this.voltarLivre();
    }

    esquivar(jogo, eixo) {
      let vx = eixo.x, vy = eixo.y;
      if (!vx && !vy) vx = -this.lado;
      const m = Math.hypot(vx, vy) || 1;
      this.vx = vx / m * 240; this.vy = vy / m * 240;
      if (!this.armada && this.temEspada) this.armada = true;
      this.mudar('esquiva', 'LINE_DODGE');
    }

    dash(jogo, eixo) {
      const m = Math.hypot(eixo.x, eixo.y) || 1;
      this.vx = eixo.x / m * 370; this.vy = eixo.y / m * 370;
      if (eixo.x) this.lado = eixo.x < 0 ? -1 : 1;
      this.correndo = false;
      this.mudar('dash', 'LINE_DASH');
    }

    tropecar(jogo) {
      this.correndo = false; this.sub = null;
      const m = Math.hypot(this.ultVx || 0, this.ultVy || 0) || 1;
      this.vx = (this.ultVx || this.lado) / m * 110; this.vy = (this.ultVy || 0) / m * 110;
      this.mudar('tropeco', 'LINE_STUMBLE');
      jogo.dica('raizes', 'Ops! Correndo sobre raízes a Line tropeça. Atravesse andando.');
    }

    agachar(depois) {
      this.aoAgachar = depois;
      this.correndo = false; this.sub = null;
      this.mudar('agachar', 'LINE_CROUCH');
    }

    cairNaAgua(jogo) {
      const fenda = jogo.mapa.tileEm(this.x, this.y - 3) === 'j';
      jogo.particulas.emitir(fenda ? 'poeira' : 'agua', this.x, this.y, 14, { vel: 90, vz: fenda ? 0 : 120, vida: 0.6 });
      this.x = this.seguro.x; this.y = this.seguro.y;
      this.noAr = false;
      this.receberDano(jogo, 1, false, this.x, this.y - 1, { ignorarDefesa: true, agua: true });
      if (fenda) jogo.dica('fenda', 'Caiu na fenda! Pule (Espaço) para atravessar. Correndo, o pulo vai mais longe.');
      else jogo.dica('agua', 'Caiu na água! Pule (Espaço) para atravessar o riacho.');
    }

    // Retorna 'bloqueado', true (tomou dano) ou false (ignorado).
    receberDano(jogo, qtd, forte, ox, oy, o) {
      o = o || {};
      if (this.estado === 'morta' || this.estado === 'final' || this.estado === 'cena') return false;
      if (this.invul > 0 && !o.agua) return false;
      if (this.estado === 'forte') return false;
      if (o.pulavel && this.noAr) return false;
      const ang = Math.atan2(this.y - oy, this.x - ox);
      if (this.estado === 'defesa' && !o.ignorarDefesa && !this.impacto && o.bloqueavel !== false) {
        this.impacto = true; this.anim.irPara(0.42, this.dir, this.lado);
        this.vx = Math.cos(ang) * (forte ? 220 : 120);
        jogo.particulas.emitir('faisca', this.x + this.lado * 16, this.y - 30, 10, { vel: 120, vz: 80, vida: 0.4 });
        LB.fx.emitir(jogo, 'FX_SPARKS', this.x + this.lado * 18, this.y - 32, { lado: this.lado });
        jogo.pausaImpacto(0.05); jogo.tremer(forte ? 4 : 2, 0.12);
        return 'bloqueado';
      }
      this.semDano = 0; this.recargaEscudo = 0;
      if (this.escudos > 0) {
        const seg = Math.min(this.escudos, qtd);
        this.escudos -= seg; qtd -= seg;
        jogo.particulas.emitir('brilho', this.x, this.y - 36, 8, { vel: 90, vida: 0.4, r: 4 });
        jogo.particulas.emitir('faisca', this.x, this.y - 30, 6, { vel: 110, vz: 60, vida: 0.3 });
        if (qtd <= 0) {
          jogo.pausaImpacto(0.05); jogo.tremer(2, 0.12);
          this.invul = 0.8; this.vx = Math.cos(ang) * 110; this.vy = Math.sin(ang) * 110;
          this.noAr = false; this.correndo = false; this.sub = null;
          this.mudar('dano', 'LINE_HIT_LIGHT');
          return true;
        }
      }
      this.hp = Math.max(0, this.hp - qtd);
      jogo.pausaImpacto(0.08); jogo.tremer(forte ? 7 : 4, 0.2);
      jogo.particulas.emitir('impacto', this.x, this.y - 30, 1, { r: 6, vida: 0.3, vel: 0 });
      this.noAr = false; this.correndo = false; this.sub = null;
      if (Math.abs(Math.cos(ang)) > 0.2) this.lado = Math.cos(ang) > 0 ? -1 : 1;
      if (this.lado) this.dir = this.lado < 0 ? 'LEFT' : 'RIGHT';
      if (forte || this.hp <= 0) {
        this.vx = Math.cos(ang) * 190; this.vy = Math.sin(ang) * 190;
        this.mudar('forte', 'LINE_HIT_HEAVY');
      } else {
        this.vx = Math.cos(ang) * 150; this.vy = Math.sin(ang) * 150;
        this.invul = 1.0;
        this.mudar('dano', 'LINE_HIT_LIGHT');
      }
      return true;
    }

    golpeForte(dt, jogo, st) {
      const b = this.anim.base;
      if (b === 'LINE_THROWN') { this.mover(this.vx * dt, this.vy * dt, jogo); this.vx *= 0.985; this.vy *= 0.985; this.noAr = true; }
      else if (b === 'LINE_HIT_HEAVY') { this.mover(this.vx * 0.3 * dt, this.vy * 0.3 * dt, jogo); }
      else this.noAr = false;
      if (!st.acabou) return;
      if (b === 'LINE_HIT_HEAVY') this.anim.tocar('LINE_THROWN', true);
      else if (b === 'LINE_THROWN') {
        this.noAr = false;
        this.anim.tocar('LINE_KNOCKDOWN', true);
        jogo.particulas.emitir('poeira', this.x, this.y, 12, { vel: 70 }); jogo.tremer(4, 0.2);
      } else if (b === 'LINE_KNOCKDOWN') {
        if (this.hp <= 0 && LB.mochila && LB.mochila.qtd(jogo, 'pena') > 0) {
          LB.mochila.tirar(jogo, 'pena', 1);
          this.hp = Math.max(2, Math.round(this.hpMax / 4) * 2);
          jogo.flashTela = 0.5;
          jogo.particulas.emitir('fogo', this.x, this.y - 20, 30, { vel: 120, vz: 80, vida: 0.8, r: 6 });
          jogo.particulas.emitir('coracao', this.x, this.y - 50, 6, { vel: 40, vida: 1.2 });
          LB.mochila.aviso('🪶 A Pena de Fênix queimou: a Line levantou de novo!');
          jogo.salvar();
        }
        if (this.hp <= 0) { this.estado = 'morta'; jogo.derrota(); }
        else this.anim.tocar('LINE_INJURED_STAND', true);
      } else { this.invul = 1.0; this.voltarLivre(); }
    }

    // Controle por roteiro (cenas).
    cena(dt, jogo, st) {
      const alvo = this.alvoCena;
      if (alvo) {
        const dx = alvo.x - this.x, dy = alvo.y - this.y, d = Math.hypot(dx, dy);
        const passo = alvo.vel * dt;
        if (d <= passo) {
          this.x = alvo.x; this.y = alvo.y; this.alvoCena = null;
          if (alvo.parar) this.anim.tocar(alvo.parar, true);
          if (alvo.fim) alvo.fim();
        } else {
          this.x += dx / d * passo; this.y += dy / d * passo;
          this.dir = dirDe(dx, dy, this.dir); if (Math.abs(dx) > 1) this.lado = dx < 0 ? -1 : 1;
          this.anim.tocar(alvo.anim);
        }
      }
    }

    // Sombra no chão e sprite.
    desenharSombra(g) {
      const noAr = this.estado === 'pulo' || this.estado === 'aereo' || (this.estado === 'forte' && this.anim.base === 'LINE_THROWN');
      D().sombraChao(g, this.x, this.y, noAr ? 11 : 15, noAr ? 0.18 : 0.28);
    }

    desenhar(g, jogo) {
      if (!this.visivel) return;
      if (this.invul > 0 && this.estado === 'livre' && Math.floor(jogo.tempo * 20) % 2) g.globalAlpha = 0.45;
      if (this.modoDuo) {
        if (!this.animDuo) this.animDuo = new LB.Animador('LINE_BELL_WALK_HANDS');
        this.animDuo.t = this.moviaAntes ? this.animDuo.t + (jogo.tempo - (this.tDuo || jogo.tempo)) : 0;
        this.tDuo = jogo.tempo;
        const sd = this.animDuo.estado(this.dir, this.lado);
        if (LB.desenharSprite(g, sd.r, sd.quadro, this.x, this.y, ALTURA_LINE)) { g.globalAlpha = 1; return; }
      }
      const st = this.estadoAnim();
      if (!LB.desenharSprite(g, st.r, st.quadro, this.x, this.y, ALTURA_LINE)) D().lineProvisoria(g, this.x, this.y, { base: st.r.codigo });
      g.globalAlpha = 1;
    }
  }

  // ---------------- Sombra (inimigo) ----------------
  // Vaga pela área; ao ver a Line (linha de visão) avisa as vizinhas, persegue contornando paredes,
  // cerca pelos lados quando há outra sombra atacando, investe, recua e foge quando está quase sumindo.
  class Sombra {
    constructor(x, y) {
      this.x = x; this.y = y; this.x0 = x; this.y0 = y;
      this.hp = 3; this.estado = 'vagar'; this.t = Math.random() * 2;
      this.anim = new LB.Animador('SHADOW_IDLE');
      this.raio = 13; this.lado = 1; this.flash = 0; this.vx = 0; this.vy = 0;
      this.inimigo = true; this.vivo = true;
      this.alvo = null; this.visto = null; this.semVer = 0; this.flanco = Math.random() < 0.5 ? -1 : 1;
    }

    mover(dx, dy, jogo) {
      const m = jogo.mapa;
      const livre = (x, y) => !m.colide(x, y - 5, 9, 5) && m.tileEm(x, y - 3) !== 'l';
      if (livre(this.x + dx, this.y)) this.x += dx;
      if (livre(this.x, this.y + dy)) this.y += dy;
    }

    aoAlerta(jogo) {
      if (['vagar', 'voltar'].includes(this.estado)) { this.estado = 'perseguir'; this.t = 0; this.visto = { x: jogo.line.x, y: jogo.line.y }; }
    }

    atualizar(dt, jogo) {
      this.t += dt; this.flash = Math.max(0, this.flash - dt);
      this.anim.atualizar(dt);
      const line = jogo.line, IA = LB.ia;
      const dx = line.x - this.x, dy = line.y - this.y, d = Math.hypot(dx, dy) || 1;
      if (Math.abs(dx) > 2) this.lado = dx < 0 ? -1 : 1;
      if (jogo.cena) { this.anim.tocar('SHADOW_IDLE'); return; }
      const ve = line.estado !== 'morta' && d < 230 && IA.linhaDeVisao(jogo.mapa, this.x, this.y, line.x, line.y);
      if (ve) { this.visto = { x: line.x, y: line.y }; this.semVer = 0; } else this.semVer += dt;

      switch (this.estado) {
        case 'vagar': {
          this.anim.tocar('SHADOW_MOVE');
          if (!this.alvo || this.t > 3) { this.t = 0; this.alvo = { x: this.x0 + (Math.random() - 0.5) * 160, y: this.y0 + (Math.random() - 0.5) * 110 }; }
          if (Math.hypot(this.alvo.x - this.x, this.alvo.y - this.y) > 6) IA.seguir(this, jogo, this.alvo.x, this.alvo.y, 32, dt);
          if (ve && d < 180) { this.estado = 'perseguir'; this.t = 0; jogo.balao(this, '!', 0.6); IA.alertar(jogo, this, 240); }
          break;
        }
        case 'perseguir': {
          this.anim.tocar('SHADOW_MOVE');
          if (this.semVer > 4 || d > 420) { this.estado = 'voltar'; this.t = 0; break; }
          // Se outra sombra já está colada na Line, esta vai pelo lado.
          const outra = jogo.inimigos.find((e) => e !== this && e instanceof Sombra && ['preparar', 'investir'].includes(e.estado) && Math.hypot(e.x - line.x, e.y - line.y) < 90);
          let ax = this.visto ? this.visto.x : line.x, ay = this.visto ? this.visto.y : line.y;
          if (outra && ve) { const k = 1 / d; ax = line.x - dy * k * 70 * this.flanco; ay = line.y + dx * k * 50 * this.flanco; }
          if (ve && d < 72 && this.t > 0.35) { this.estado = 'preparar'; this.t = 0; this.anim.tocar('SHADOW_ATTACK', true); break; }
          IA.seguir(this, jogo, ax, ay, ve ? 64 : 58, dt);
          break;
        }
        case 'preparar':
          if (this.t > 0.55 * LB.dif().ritmo) {
            this.estado = 'investir'; this.t = 0;
            this.vx = dx / d * 250; this.vy = dy / d * 250;
          }
          break;
        case 'investir':
          this.mover(this.vx * dt, this.vy * dt, jogo);
          if (Math.hypot(line.x - this.x, line.y - this.y) < 20) {
            const r = line.receberDano(jogo, 1, false, this.x, this.y);
            if (r === 'bloqueado') { this.vx = -this.vx * 0.8; this.vy = -this.vy * 0.8; this.estado = 'atordoada'; this.t = 0; this.flash = 0.2; break; }
          }
          if (this.t > 0.32) { this.estado = 'recuar'; this.t = 0; this.flanco = -this.flanco; }
          break;
        case 'recuar':
          // Depois do ataque se afasta um pouco, para não ficar colada.
          this.anim.tocar('SHADOW_MOVE');
          if (this.t < 0.5) this.mover(-dx / d * 70 * dt, -dy / d * 70 * dt, jogo);
          if (this.t > 0.8) { this.estado = this.hp === 1 && Math.random() < 0.5 ? 'fugir' : 'perseguir'; this.t = 0; }
          break;
        case 'fugir':
          // Quase sumindo: foge por um tempo e depois volta à carga.
          this.anim.tocar('SHADOW_MOVE');
          this.mover(-dx / d * 80 * dt, -dy / d * 80 * dt, jogo);
          if (this.t > 1.6) { this.estado = 'perseguir'; this.t = 0; }
          break;
        case 'voltar':
          this.anim.tocar('SHADOW_MOVE');
          if (IA.seguir(this, jogo, this.x0, this.y0, 40, dt) < 10) { this.estado = 'vagar'; this.t = 0; this.alvo = null; }
          if (ve && d < 180) { this.estado = 'perseguir'; this.t = 0; }
          break;
        case 'atordoada':
          this.anim.tocar('SHADOW_HIT');
          this.mover(this.vx * dt, this.vy * dt, jogo); this.vx *= 0.88; this.vy *= 0.88;
          if (this.t > 0.45) { this.estado = 'perseguir'; this.t = 0; }
          break;
        case 'morrendo':
          this.anim.tocar('SHADOW_DEATH');
          if (Math.random() < 0.5) jogo.particulas.emitir('sombra', this.x, this.y - 12, 1, { vel: 30, vz: 30, vida: 0.6, r: 4 });
          if (this.t > 0.5) { this.vivo = false; jogo.aoDerrotarInimigo(this); }
          break;
      }
    }

    receberGolpe(jogo, dano, ox, oy, empurra) {
      if (this.estado === 'morrendo') return false;
      this.hp -= dano; this.flash = 0.2;
      const d = Math.hypot(this.x - ox, this.y - oy) || 1;
      this.vx = (this.x - ox) / d * (empurra || 110) * 1.6; this.vy = (this.y - oy) / d * (empurra || 110) * 1.6;
      jogo.particulas.emitir('sombra', this.x, this.y - 14, 6, { vel: 70, vida: 0.4 });
      if (this.hp <= 0) { this.estado = 'morrendo'; this.t = 0; }
      else { this.estado = 'atordoada'; this.t = 0; LB.ia.alertar(jogo, this, 260); }
      return true;
    }

    // Sombras são fracas contra a luz: a magia dói mais.
    receberMagia(jogo, dano, ox, oy) { return this.receberGolpe(jogo, dano + 1, ox, oy, 140); }

    desenharSombra(g) { D().sombraChao(g, this.x, this.y, 13, 0.3); }

    desenhar(g, jogo) {
      const st = this.anim.estado(null, this.lado);
      if (st.r.sprite) { LB.desenharSprite(g, st.r, st.quadro, this.x, this.y, 64); return; }
      D().sombra(g, this.x, this.y, { t: jogo.tempo + this.x0, estado: this.estado, flash: this.flash, lado: this.lado, morrendo: this.estado === 'morrendo' ? this.t : null });
    }
  }

  // ---------------- Bell ----------------
  class Bell {
    constructor(x, y, dir) {
      this.x = x; this.y = y; this.dir = dir || 'FRONT'; this.lado = 1;
      this.anim = new LB.Animador('BELL_IDLE');
      this.visivel = true; this.z = 0; this.alvoCena = null;
    }

    atualizar(dt, jogo) {
      this.anim.atualizar(dt);
      if (this.seguir && jogo && !jogo.cena) { this.acompanhar(dt, jogo); return; }
      const alvo = this.alvoCena;
      if (!alvo) return;
      const dx = alvo.x - this.x, dy = alvo.y - this.y, d = Math.hypot(dx, dy), passo = alvo.vel * dt;
      if (d <= passo) {
        this.x = alvo.x; this.y = alvo.y; this.alvoCena = null;
        if (alvo.parar) this.anim.tocar(alvo.parar, true);
        if (alvo.fim) alvo.fim();
      } else {
        this.x += dx / d * passo; this.y += dy / d * passo;
        this.dir = dirDe(dx, dy, this.dir); if (Math.abs(dx) > 1) this.lado = dx < 0 ? -1 : 1;
        this.anim.tocar(alvo.anim);
      }
    }

    // Segue o rastro da Line (assim contorna casas e cercas do mesmo jeito que ela).
    acompanhar(dt, jogo) {
      const l = jogo.line;
      const rastro = jogo.rastroLine;
      let alvo = null, acum = 0;
      for (let i = rastro.length - 1; i > 0; i--) {
        acum += Math.hypot(rastro[i].x - rastro[i - 1].x, rastro[i].y - rastro[i - 1].y);
        if (acum >= 34) { alvo = rastro[i - 1]; break; }
      }
      const dLine = Math.hypot(l.x - this.x, l.y - this.y);
      if (dLine > 320) { this.x = l.x - (l.lado || 1) * 30; this.y = l.y; }
      if (!alvo || dLine < 30) { this.anim.tocar('BELL_IDLE'); return; }
      const dx = alvo.x - this.x, dy = alvo.y - this.y, d = Math.hypot(dx, dy);
      if (d < 2) { this.anim.tocar('BELL_IDLE'); return; }
      const vel = Math.min(d * 6, l.correndo ? 175 : 95);
      this.x += dx / d * vel * dt; this.y += dy / d * vel * dt;
      this.dir = dirDe(dx, dy, this.dir); if (Math.abs(dx) > 1) this.lado = dx < 0 ? -1 : 1;
      this.anim.tocar(vel > 120 ? 'BELL_RUN' : 'BELL_WALK');
    }

    desenharSombra(g) { if (this.visivel) D().sombraChao(g, this.x, this.y + this.z * 0, this.z > 5 ? 10 : 14, 0.25); }

    desenhar(g, jogo) {
      if (!this.visivel) return;
      const st = this.anim.estado(this.dir, this.lado);
      let x = this.x, y = this.y - this.z;
      if (st.r.sprite) {
        // Enquanto a animação própria não existe, a substituta ganha um movimento que lembra a original.
        const inf = LB.info(this.anim.base);
        if (st.r.via || st.r.codigo !== this.anim.base) {
          if (inf.tremer) x += Math.sin(jogo.tempo * 40) * 1.2;
          if (inf.pular) y -= Math.abs(Math.sin(jogo.tempo * 7)) * 5;
          if (inf.balancar) {
            g.save(); g.translate(x, y - 30); g.rotate(Math.sin(jogo.tempo * 5) * 0.25); g.translate(-x, -(y - 30));
            LB.desenharSprite(g, st.r, st.quadro, x, y, ALTURA_LINE); g.restore(); return;
          }
        }
        LB.desenharSprite(g, st.r, st.quadro, x, y, ALTURA_LINE); return;
      }
      D().bell(g, this.x, y, { base: this.anim.base, t: jogo.tempo, progresso: st.progresso, dir: this.dir === 'FRONT' || this.dir === 'BACK' ? this.dir : this.dir });
    }
  }

  LB.Particulas = Particulas;
  LB.Line = Line;
  LB.Sombra = Sombra;
  LB.Bell = Bell;
  LB.GOLPES = GOLPES;
  LB.ALTURA_LINE = ALTURA_LINE;
  LB.dirDe = dirDe;
})(window.LB);
