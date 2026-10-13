'use strict';

// Monstros comuns da Parte 1 (além da Sombra, do Morcego e dos Fogos-fátuos), cada um com um jeito
// próprio de lutar. Desenhados no código até chegar a arte (códigos BOAR_*, SHROOM_*, SPIDER_*,
// SLIME_* no catálogo); quando a arte chegar, entra sozinha pelo LB.desenharSprite.
//
// - Javali-de-espinhos: vê a heroína, raspa a pata e dispara em linha reta. Se bater numa parede
//   fica tonto (hora de atacar); se errar, freia e vira.
// - Cogumelo saltador: parece um cogumelo comum até a heroína chegar perto; então pula em cima
//   dela e solta esporos que a deixam lenta.
// - Aranha da gruta: fica pendurada no teto, desce num fio quando a heroína passa e cospe teia
//   (que deixa lenta); foge para o alto quando apanha.
// - Geleia: devagar e pegajosa; quando apanha, se divide em duas geleias pequenas.
(function (LB) {
  const TAU = Math.PI * 2;
  const D = () => LB.desenho;

  // Base comum: andar com colisão, empurrão ao apanhar, morrer soltando fumacinha.
  class Monstro {
    constructor(x, y, hp, raio) {
      this.x = x; this.y = y; this.x0 = x; this.y0 = y;
      this.hp = hp; this.hpMax = hp; this.raio = raio; this.vivo = true; this.inimigo = true;
      this.estado = 'vagar'; this.t = Math.random() * 2; this.lado = 1; this.flash = 0; this.vx = 0; this.vy = 0;
      this.alvo = null;
    }

    livre(x, y, jogo) { return !jogo.mapa.colide(x, y - 5, this.raio * 0.7, 5) && jogo.mapa.tileEm(x, y - 3) !== 'l'; }

    // Devolve se bateu em alguma coisa.
    mover(dx, dy, jogo) {
      let bateu = false;
      if (this.livre(this.x + dx, this.y, jogo)) this.x += dx; else bateu = true;
      if (this.livre(this.x, this.y + dy, jogo)) this.y += dy; else bateu = true;
      return bateu;
    }

    aoAlerta() { if (this.estado === 'vagar') { this.estado = 'perseguir'; this.t = 0; } }

    // Volta e meia anda um pouco perto de onde nasceu.
    vagar(dt, jogo, vel) {
      if (!this.alvo || this.t > 3) { this.t = 0; this.alvo = { x: this.x0 + (Math.random() - 0.5) * 120, y: this.y0 + (Math.random() - 0.5) * 80 }; }
      if (Math.hypot(this.alvo.x - this.x, this.alvo.y - this.y) > 6) LB.ia.seguir(this, jogo, this.alvo.x, this.alvo.y, vel, dt);
    }

    ve(jogo, alcance) {
      const l = jogo.line;
      return l.estado !== 'morta' && Math.hypot(l.x - this.x, l.y - this.y) < alcance && LB.ia.linhaDeVisao(jogo.mapa, this.x, this.y, l.x, l.y);
    }

    tocar(jogo, dano) {
      const l = jogo.line;
      if (Math.hypot(l.x - this.x, l.y - this.y) < this.raio + 10) return l.receberDano(jogo, dano || 1, false, this.x, this.y);
      return null;
    }

    receberGolpe(jogo, dano, ox, oy, empurra) {
      if (this.estado === 'morrendo') return false;
      this.hp -= dano; this.flash = 0.2;
      const d = Math.hypot(this.x - ox, this.y - oy) || 1;
      this.vx = (this.x - ox) / d * (empurra || 110) * 1.4; this.vy = (this.y - oy) / d * (empurra || 110) * 1.4;
      jogo.particulas.emitir('poeira', this.x, this.y - 8, 5, { vel: 60, vida: 0.35 });
      if (this.hp <= 0) { this.estado = 'morrendo'; this.t = 0; } else { this.aoApanhar(jogo); LB.ia.alertar(jogo, this, 240); }
      return true;
    }

    aoApanhar() { this.estado = 'atordoado'; this.t = 0; }

    receberMagia(jogo, dano, ox, oy) { return this.receberGolpe(jogo, dano, ox, oy, 140); }

    morrer(dt, jogo) {
      if (Math.random() < 0.4) jogo.particulas.emitir('fumaca', this.x, this.y - 8, 1, { vel: 20, vz: 20, vida: 0.5, r: 4 });
      if (this.t > 0.45) { this.vivo = false; jogo.aoDerrotarInimigo(this); }
    }

    atordoado(dt, jogo, dur) {
      this.mover(this.vx * dt, this.vy * dt, jogo); this.vx *= 0.88; this.vy *= 0.88;
      if (this.t > (dur || 0.45)) { this.estado = 'perseguir'; this.t = 0; }
    }

    // Arte (quando chegar) pelo catálogo; senão, o desenho do código.
    desenharArte(g, cod, alt) {
      const r = LB.resolver(cod, null, this.lado);
      if (!r.sprite || r.via) return false;
      const st = { r, quadro: r.sprite.seq[Math.floor((this.t * 10) % r.sprite.seq.length)] };
      return LB.desenharSprite(g, st.r, st.quadro, this.x, this.y, alt);
    }
  }

  // ---------------- Javali-de-espinhos ----------------
  class Javali extends Monstro {
    constructor(x, y) { super(x, y, 4, 14); }

    atualizar(dt, jogo) {
      this.t += dt; this.flash = Math.max(0, this.flash - dt);
      if (jogo.cena) return;
      const l = jogo.line, dx = l.x - this.x, dy = l.y - this.y, d = Math.hypot(dx, dy) || 1;
      if (Math.abs(dx) > 3 && this.estado !== 'investir') this.lado = dx < 0 ? -1 : 1;
      switch (this.estado) {
        case 'vagar':
          this.vagar(dt, jogo, 26);
          if (this.ve(jogo, 200)) { this.estado = 'perseguir'; this.t = 0; jogo.balao(this, '!', 0.6); LB.ia.alertar(jogo, this, 220); }
          break;
        case 'perseguir':
          if (d > 380) { this.estado = 'vagar'; this.t = 0; break; }
          // Chega a uma distância boa e se prepara para a investida.
          if (d < 190 && this.t > 0.6 && this.ve(jogo, 220)) { this.estado = 'raspar'; this.t = 0; this.mira = { x: dx / d, y: dy / d }; break; }
          LB.ia.seguir(this, jogo, l.x, l.y, 46, dt);
          break;
        case 'raspar':
          // Raspa a pata no chão (o aviso): a poeira mostra a direção.
          if (Math.random() < dt * 14) jogo.particulas.emitir('poeira', this.x - this.lado * 8, this.y, 1, { vel: 30, vida: 0.4, r: 3 });
          if (this.t > 0.75 * LB.dif().ritmo) { this.estado = 'investir'; this.t = 0; this.lado = this.mira.x < 0 ? -1 : 1; }
          break;
        case 'investir': {
          const bateu = this.mover(this.mira.x * 270 * dt, this.mira.y * 270 * dt, jogo);
          if (Math.random() < dt * 20) jogo.particulas.emitir('poeira', this.x, this.y, 1, { vel: 20, vida: 0.3, r: 3 });
          const r = this.tocar(jogo, 1);
          if (r === 'bloqueado' || bateu) {
            // Bateu na parede ou no escudo: fica tonto (vulnerável).
            this.estado = 'tonto'; this.t = 0; jogo.tremer(3, 0.15);
            jogo.particulas.emitir('estrela', this.x, this.y - 24, 4, { vel: 40, vida: 0.6 });
          } else if (r || this.t > 0.85) { this.estado = 'frear'; this.t = 0; }
          break;
        }
        case 'frear':
          this.mover(this.mira.x * 120 * (1 - this.t * 2) * dt, this.mira.y * 120 * (1 - this.t * 2) * dt, jogo);
          if (this.t > 0.5) { this.estado = 'perseguir'; this.t = 0; }
          break;
        case 'tonto':
          if (this.t > 1.6) { this.estado = 'perseguir'; this.t = 0; }
          break;
        case 'atordoado': this.atordoado(dt, jogo, 0.35); break;
        case 'morrendo': this.morrer(dt, jogo); break;
      }
    }

    // Tonto, apanha em dobro; correndo, o espinho das costas protege de golpe pelas costas.
    receberGolpe(jogo, dano, ox, oy, empurra) {
      if (this.estado === 'tonto') dano *= 2;
      return super.receberGolpe(jogo, dano, ox, oy, this.estado === 'investir' ? 30 : empurra);
    }

    aoApanhar() { if (this.estado !== 'tonto') { this.estado = 'atordoado'; this.t = 0; } }

    desenharSombra(g) { D().sombraChao(g, this.x, this.y, 15, 0.3); }

    desenhar(g, jogo) {
      if (this.desenharArte(g, 'BOAR_' + (this.estado === 'investir' ? 'CHARGE' : this.estado === 'tonto' ? 'DIZZY' : 'IDLE'), 64)) return;
      const t = jogo.tempo, corre = this.estado === 'investir', pulo = corre ? Math.abs(Math.sin(t * 22)) * 2 : 0;
      const morre = this.estado === 'morrendo' ? Math.min(1, this.t / 0.45) : 0;
      g.save(); g.translate(this.x, this.y - pulo); g.scale(this.lado, 1); g.globalAlpha = 1 - morre;
      const corpo = this.flash > 0 ? '#ffffff' : '#7a4a2e', escuro = this.flash > 0 ? '#eeeeee' : '#4e2d1a';
      // Pernas.
      g.fillStyle = escuro;
      const passo = corre ? Math.sin(t * 24) * 3 : Math.sin(t * 6) * 1;
      for (const [px, k] of [[-9, 1], [-4, -1], [5, 1], [10, -1]]) g.fillRect(px, -7 + 0, 3, 7 + k * passo * 0.3);
      // Corpo e espinhos das costas.
      g.fillStyle = corpo; g.beginPath(); g.ellipse(0, -12, 15, 8, 0, 0, TAU); g.fill();
      g.fillStyle = '#d9c7a2';
      for (let i = 0; i < 5; i++) { const x = -10 + i * 4.5; g.beginPath(); g.moveTo(x - 2, -18); g.lineTo(x, -25 - (i % 2) * 2); g.lineTo(x + 2, -18); g.fill(); }
      // Cabeça, focinho e presas.
      g.fillStyle = corpo; g.beginPath(); g.ellipse(13, -11, 7, 6, 0.2, 0, TAU); g.fill();
      g.fillStyle = '#c98f7a'; g.beginPath(); g.ellipse(19, -9, 3, 2.6, 0, 0, TAU); g.fill();
      g.fillStyle = '#fff7e6'; g.beginPath(); g.moveTo(16, -6); g.lineTo(19, -12); g.lineTo(18, -6); g.fill();
      // Olho (bravo quando vai investir; espiral quando tonto).
      if (this.estado === 'tonto') { g.strokeStyle = '#fff'; g.lineWidth = 1; g.beginPath(); g.arc(14, -13, 2, 0, TAU * 0.8); g.stroke(); }
      else { g.fillStyle = this.estado === 'raspar' || corre ? '#ff5a3a' : '#1a0f08'; g.fillRect(13, -14, 2, 2); }
      g.restore();
      if (this.estado === 'tonto') for (let i = 0; i < 3; i++) { const a = t * 4 + i * TAU / 3; g.fillStyle = '#ffe48a'; D().estrela(g, this.x + Math.cos(a) * 12, this.y - 30 + Math.sin(a) * 4, 2.5); }
    }
  }

  // ---------------- Cogumelo saltador ----------------
  class Cogumelo extends Monstro {
    constructor(x, y) { super(x, y, 2, 11); this.estado = 'escondido'; this.z = 0; this.vz = 0; }

    aoAlerta() { /* só acorda quando a heroína chega perto */ }

    atualizar(dt, jogo) {
      this.t += dt; this.flash = Math.max(0, this.flash - dt);
      if (jogo.cena) return;
      const l = jogo.line, dx = l.x - this.x, dy = l.y - this.y, d = Math.hypot(dx, dy) || 1;
      if (Math.abs(dx) > 3) this.lado = dx < 0 ? -1 : 1;
      // Pulo: sobe e desce (z).
      if (this.z > 0 || this.vz > 0) { this.vz -= 520 * dt; this.z = Math.max(0, this.z + this.vz * dt); }
      switch (this.estado) {
        case 'escondido':
          if (d < 70 && l.estado !== 'morta') { this.estado = 'pular'; this.t = 0; jogo.balao(this, '!', 0.5); }
          break;
        case 'pular':
          // Pulos curtos na direção da heroína.
          if (this.z === 0 && this.t > 0.55 * LB.dif().ritmo) { this.t = 0; this.vz = 190; this.dir = { x: dx / d, y: dy / d }; }
          if (this.z > 0) this.mover(this.dir.x * 95 * dt, this.dir.y * 95 * dt, jogo);
          if (this.z === 0 && this.vz < 0) { this.vz = 0; this.pousar(jogo); }
          if (d > 260) { this.estado = 'voltar'; this.t = 0; }
          break;
        case 'voltar':
          if (LB.ia.seguir(this, jogo, this.x0, this.y0, 30, dt) < 8) { this.estado = 'escondido'; this.t = 0; }
          if (d < 70) { this.estado = 'pular'; this.t = 0; }
          break;
        case 'atordoado': this.atordoado(dt, jogo, 0.4); if (this.estado === 'perseguir') this.estado = 'pular'; break;
        case 'morrendo': this.morrer(dt, jogo); break;
      }
    }

    // Ao cair, solta uma nuvem de esporos: perto dela, a heroína fica lenta (e leva dano se estiver em baixo).
    pousar(jogo) {
      const l = jogo.line, d = Math.hypot(l.x - this.x, l.y - this.y);
      jogo.particulas.emitir('fumaca', this.x, this.y - 4, 8, { vel: 50, vida: 0.7, r: 5, cor: '#c9b2e8' });
      if (d < 42 && l.estado !== 'morta') { l.lentidao = Math.max(l.lentidao || 0, 1.4); if (d < 22) l.receberDano(jogo, 1, false, this.x, this.y); }
    }

    receberGolpe(jogo, dano, ox, oy, empurra) {
      if (this.estado === 'escondido') { this.estado = 'pular'; this.t = 0; }
      return super.receberGolpe(jogo, dano, ox, oy, empurra);
    }

    desenharSombra(g) { D().sombraChao(g, this.x, this.y, 9 - Math.min(4, this.z / 10), 0.28); }

    desenhar(g, jogo) {
      if (this.desenharArte(g, this.estado === 'escondido' ? 'SHROOM_HIDDEN' : 'SHROOM_HOP', 48)) return;
      const t = jogo.tempo, morre = this.estado === 'morrendo' ? Math.min(1, this.t / 0.45) : 0;
      const amassa = this.z === 0 && this.estado === 'pular' ? 1 + Math.max(0, 0.15 - this.t) * 2 : 1;
      g.save(); g.translate(this.x, this.y - this.z); g.scale(this.lado * amassa, 1 / amassa); g.globalAlpha = 1 - morre;
      // Pé.
      g.fillStyle = this.flash > 0 ? '#fff' : '#efe2c4'; g.fillRect(-4, -9, 8, 9);
      // Chapéu roxo com pintas.
      g.fillStyle = this.flash > 0 ? '#fff' : '#8e5bc4';
      g.beginPath(); g.ellipse(0, -11, 11, 8, 0, Math.PI, TAU); g.fill(); g.fillRect(-11, -12, 22, 2);
      g.fillStyle = '#f4ecff'; for (const [px, py] of [[-5, -15], [3, -16], [7, -12], [-1, -12]]) { g.beginPath(); g.arc(px, py, 1.5, 0, TAU); g.fill(); }
      // Olhinhos: fechados escondido, abertos e bravos acordado.
      g.fillStyle = '#2a1a30';
      if (this.estado === 'escondido') { g.fillRect(-3, -6, 2, 1); g.fillRect(1, -6, 2, 1); }
      else { g.fillRect(-3, -7, 2, 2.5); g.fillRect(1, -7, 2, 2.5); }
      g.restore();
      if (this.estado === 'escondido' && Math.sin(t * 1.5 + this.x0) > 0.97) jogo.particulas.emitir('brilho', this.x, this.y - 16, 1, { vel: 6, vida: 0.5, r: 2, cor: '#d9c2ff' });
    }
  }

  // ---------------- Aranha da gruta ----------------
  class Aranha extends Monstro {
    constructor(x, y) { super(x, y, 2, 11); this.estado = 'teto'; this.alt = 70; this.cuspe = 1.5; }

    aoAlerta() { if (this.estado === 'teto') { this.estado = 'descer'; this.t = 0; } }

    atualizar(dt, jogo) {
      this.t += dt; this.flash = Math.max(0, this.flash - dt);
      if (jogo.cena) return;
      const l = jogo.line, dx = l.x - this.x, dy = l.y - this.y, d = Math.hypot(dx, dy) || 1;
      if (Math.abs(dx) > 3) this.lado = dx < 0 ? -1 : 1;
      switch (this.estado) {
        case 'teto':
          if (d < 120 && l.estado !== 'morta') { this.estado = 'descer'; this.t = 0; }
          break;
        case 'descer':
          this.alt = Math.max(0, this.alt - 160 * dt);
          if (this.alt === 0) { this.estado = 'perseguir'; this.t = 0; jogo.balao(this, '!', 0.5); }
          break;
        case 'perseguir':
          this.cuspe -= dt;
          if (d > 360) { this.estado = 'subir'; this.t = 0; break; }
          // Mantém distância e cospe teia; se a heroína chega perto, morde.
          if (d < 34) { if (this.t > 0.6) { this.tocar(jogo, 1); this.t = 0; } }
          else if (d < 90) this.mover(-dx / d * 40 * dt, -dy / d * 40 * dt, jogo);
          else LB.ia.seguir(this, jogo, l.x, l.y, 55, dt);
          if (this.cuspe <= 0 && d < 220 && this.ve(jogo, 230)) { this.cuspe = 2.4 * LB.dif().ritmo; this.cuspir(jogo, dx / d, dy / d); }
          break;
        case 'subir':
          // Apanhou ou perdeu a heroína de vista: sobe no fio e espera de novo.
          this.alt = Math.min(70, this.alt + 120 * dt);
          if (this.alt >= 70) { this.estado = 'teto'; this.t = 0; }
          break;
        case 'atordoado': this.atordoado(dt, jogo, 0.35); if (this.estado === 'perseguir' && this.hp === 1 && Math.random() < 0.5) { this.estado = 'subir'; this.cuspe = 1; } break;
        case 'morrendo': this.alt = 0; this.morrer(dt, jogo); break;
      }
    }

    cuspir(jogo, ux, uy) {
      LB.magia.lancar(jogo, { dono: 'inimigo', tipo: 'teia', x: this.x + ux * 10, y: this.y - 4 + uy * 6, vx: ux * 150, vy: uy * 150, z: 14, r: 6, max: 1.6, dano: 0, lenta: 1.6 });
    }

    receberGolpe(jogo, dano, ox, oy, empurra) {
      if (this.estado === 'teto' || this.alt > 30) return false; // lá no alto a espada não alcança
      return super.receberGolpe(jogo, dano, ox, oy, empurra);
    }

    receberMagia(jogo, dano, ox, oy) { if (this.estado === 'teto') { this.estado = 'descer'; this.t = 0; } return super.receberGolpe(jogo, dano, ox, oy, 120); }

    desenharSombra(g) { D().sombraChao(g, this.x, this.y, 9, 0.12 + 0.18 * (1 - this.alt / 70)); }

    desenhar(g, jogo) {
      const t = jogo.tempo, y = this.y - this.alt;
      if (this.alt > 0) { g.strokeStyle = 'rgba(235,235,245,.6)'; g.lineWidth = 1; g.beginPath(); g.moveTo(this.x, y - 120); g.lineTo(this.x, y - 8); g.stroke(); }
      const r = LB.resolver('SPIDER_' + (this.alt > 0 ? 'HANG' : 'WALK'), null, this.lado);
      if (r.sprite && !r.via) { LB.desenharSprite(g, r, r.sprite.seq[Math.floor((this.t * 10) % r.sprite.seq.length)], this.x, y, 48); return; }
      const morre = this.estado === 'morrendo' ? Math.min(1, this.t / 0.45) : 0;
      g.save(); g.translate(this.x, y); g.globalAlpha = 1 - morre;
      const anda = this.alt === 0 ? Math.sin(t * 16) * 2 : Math.sin(t * 3);
      g.strokeStyle = this.flash > 0 ? '#fff' : '#2a2030'; g.lineWidth = 1.6;
      for (const s of [-1, 1]) for (let i = 0; i < 4; i++) {
        const a = -0.9 + i * 0.6, k = (i % 2 ? 1 : -1) * anda;
        g.beginPath(); g.moveTo(s * 4, -8); g.lineTo(s * (10 + i), -12 + i * 2 + k); g.lineTo(s * (14 + i), -2 + a); g.stroke();
      }
      g.fillStyle = this.flash > 0 ? '#fff' : '#3b2f48'; g.beginPath(); g.ellipse(0, -9, 7, 6, 0, 0, TAU); g.fill();
      g.fillStyle = this.flash > 0 ? '#fff' : '#5a4a6e'; g.beginPath(); g.ellipse(0, -16, 5, 4, 0, 0, TAU); g.fill();
      g.fillStyle = '#ff5a6e'; for (const px of [-2.5, -0.8, 0.8, 2.5]) g.fillRect(px - 0.5, -17, 1, 1.2);
      g.fillStyle = '#d4c3ff'; g.fillRect(-1.5, -7, 3, 3);
      g.restore();
    }
  }

  // ---------------- Geleia que se divide ----------------
  class Geleia extends Monstro {
    constructor(x, y, pequena) {
      super(x, y, pequena ? 1 : 3, pequena ? 8 : 13);
      this.pequena = !!pequena; this.pulo = 0;
      if (pequena) { this.estado = 'perseguir'; this.t = 0; }
    }

    atualizar(dt, jogo) {
      this.t += dt; this.flash = Math.max(0, this.flash - dt); this.pulo += dt;
      if (jogo.cena) return;
      const l = jogo.line, dx = l.x - this.x, dy = l.y - this.y, d = Math.hypot(dx, dy) || 1;
      if (Math.abs(dx) > 3) this.lado = dx < 0 ? -1 : 1;
      switch (this.estado) {
        case 'vagar':
          this.vagar(dt, jogo, 18);
          if (this.ve(jogo, 170)) { this.estado = 'perseguir'; this.t = 0; jogo.balao(this, '!', 0.5); }
          break;
        case 'perseguir': {
          if (d > 360) { this.estado = 'vagar'; this.t = 0; break; }
          // Anda aos pulinhos: só avança quando está no ar.
          const fase = (this.pulo * (this.pequena ? 3 : 2)) % 1;
          if (fase < 0.5) LB.ia.seguir(this, jogo, l.x, l.y, this.pequena ? 70 : 48, dt);
          if (this.t > 0.7) { const r = this.tocar(jogo, 1); if (r) this.t = 0; }
          break;
        }
        case 'atordoado': this.atordoado(dt, jogo, 0.4); break;
        case 'morrendo': this.morrer(dt, jogo); break;
      }
    }

    // A grande, quando apanha (e não morre), se divide: vira duas pequenas.
    aoApanhar(jogo) {
      if (!this.pequena) {
        this.vivo = false;
        jogo.inimigos = jogo.inimigos.filter((e) => e !== this);
        for (const s of [-1, 1]) {
          const p = new Geleia(this.x + s * 10, this.y, true);
          p.vx = this.vx + s * 80; p.vy = this.vy; p.estado = 'atordoado';
          jogo.inimigos.push(p);
        }
        jogo.particulas.emitir('agua', this.x, this.y - 8, 10, { vel: 80, vida: 0.4, r: 3, cor: '#8fe08a' });
        return;
      }
      super.aoApanhar(jogo);
    }

    desenharSombra(g) { D().sombraChao(g, this.x, this.y, this.pequena ? 8 : 13, 0.25); }

    desenhar(g, jogo) {
      if (this.desenharArte(g, this.pequena ? 'SLIME_SMALL' : 'SLIME_BIG', this.pequena ? 32 : 48)) return;
      const fase = (this.pulo * (this.pequena ? 3 : 2)) % 1, ar = Math.max(0, Math.sin(fase * TAU)) * (this.pequena ? 4 : 6);
      const k = this.pequena ? 0.6 : 1, morre = this.estado === 'morrendo' ? Math.min(1, this.t / 0.45) : 0;
      const larg = 13 * k * (1 + (ar ? -0.08 : 0.12)), alt = 11 * k * (1 + (ar ? 0.12 : -0.1));
      g.save(); g.translate(this.x, this.y - ar); g.globalAlpha = 0.9 * (1 - morre);
      g.fillStyle = this.flash > 0 ? '#ffffff' : '#62c25a';
      g.beginPath(); g.moveTo(-larg, 0); g.quadraticCurveTo(-larg, -alt * 2, 0, -alt * 2); g.quadraticCurveTo(larg, -alt * 2, larg, 0); g.closePath(); g.fill();
      g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.ellipse(-larg * 0.4, -alt * 1.4, 2.5 * k, 1.6 * k, -0.5, 0, TAU); g.fill();
      g.fillStyle = '#1d3a1a'; g.fillRect(-4 * k * this.lado - 1, -alt * 1.1, 2, 3 * k); g.fillRect(3 * k * this.lado - 1, -alt * 1.1, 2, 3 * k);
      g.restore();
    }
  }

  const TIPOS = { javali: Javali, cogumelo: Cogumelo, aranha: Aranha, geleia: Geleia };
  LB.monstros = { TIPOS, Monstro, Javali, Cogumelo, Aranha, Geleia };
})(window.LB);
