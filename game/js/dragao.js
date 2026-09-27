'use strict';

(function (LB) {
  const TAU = Math.PI * 2;
  const ALTURA_DRAGAO = 260;

  class Dragao {
    constructor(x, y) {
      this.x = x; this.y = y; this.x0 = x; this.y0 = y;
      this.hpMax = 70; this.hp = 70;
      this.anim = new LB.Animador('DRAGON_IDLE');
      this.estado = 'cena'; this.t = 0;
      this.lado = 1; this.flash = 0; this.fraco = false;
      this.alturaVoo = 0; this.acumulado = 0;
      this.raio = 50; this.inimigo = true; this.chefe = true; this.vivo = true; this.visivel = true;
      this.fogoAng = Math.PI / 2; this.fogoTick = 0;
      this.golpeFeito = false;
      this.proximo = 0;
    }

    get ritmo() { return this.hp < this.hpMax * 0.5 ? 0.8 : 1; }
    get noAlto() { return this.alturaVoo > 30; }
    get vulneravel() { return ['observar', 'garra', 'cauda', 'fogo', 'pouso', 'atordoado', 'rugido', 'desesperado'].includes(this.estado) && !this.noAlto; }

    mudar(estado, anim) { this.estado = estado; this.t = 0; this.golpeFeito = false; if (anim) this.anim.tocar(anim, true); }

    limitar() {
      this.x = Math.max(this.x0 - 200, Math.min(this.x0 + 200, this.x));
      this.y = Math.max(this.y0 - 10, Math.min(this.y0 + 230, this.y));
    }

    atualizar(dt, jogo) {
      this.t += dt; this.flash = Math.max(0, this.flash - dt);
      this.anim.atualizar(dt);
      const line = jogo.line;
      const dx = line.x - this.x, dy = line.y - this.y, d = Math.hypot(dx, dy);
      const R = this.ritmo;

      switch (this.estado) {
        case 'cena': case 'derrotado': break;

        case 'observar': {
          if (Math.abs(dx) > 20) this.lado = dx < 0 ? -1 : 1;
          const alvoY = Math.min(line.y - 90, this.y0 + 120);
          const mx = Math.abs(dx) > 40 ? Math.sign(dx) * 45 : 0;
          const my = Math.abs(alvoY - this.y) > 10 ? Math.sign(alvoY - this.y) * 35 : 0;
          this.x += mx * dt; this.y += my * dt; this.limitar();
          this.anim.tocar(mx || my ? 'DRAGON_WALK' : 'DRAGON_IDLE');
          if (this.t > 1.3 * R) this.escolherAtaque(jogo, d);
          break;
        }

        case 'garra':
          if (this.t > 0.7 * R && !this.golpeFeito) {
            this.golpeFeito = true;
            const cx = this.x + this.lado * 62, cy = this.y + 30;
            jogo.particulas.emitir('poeira', cx, cy, 8, { vel: 80 });
            jogo.tremer(3, 0.15);
            if (Math.hypot(line.x - cx, line.y - cy) < 62) line.receberDano(jogo, 1, false, this.x, this.y);
          }
          if (this.t > 1.5 * R) this.mudar('observar');
          break;

        case 'cauda':
          if (this.t > 0.9 * R && this.t < 1.05 * R) {
            if (!this.golpeFeito && d > 40 && d < 150) {
              const r = line.receberDano(jogo, 1, true, this.x, this.y, { pulavel: true });
              if (r) this.golpeFeito = true;
            }
            if (Math.random() < 0.6) jogo.particulas.emitir('poeira', this.x + Math.cos(this.t * 12) * 120, this.y + Math.sin(this.t * 12) * 50, 1, { vel: 30 });
          }
          if (this.t > 1.9 * R) this.mudar('observar');
          break;

        case 'fogo': {
          const carga = 1.0 * R;
          if (this.t < carga) {
            this.fogoAng = Math.atan2(dy, dx);
            if (Math.random() < 0.5) jogo.particulas.emitir('fogo', this.x, this.y - 10, 1, { vel: 10, vida: 0.4, z: 120, r: 3 });
            if (this.t > carga - dt * 1.5) this.anim.tocar('DRAGON_FIRE_STREAM', true);
          } else if (this.t < carga + 1.7) {
            this.cuspirFogo(jogo, dt, 0.9 / R, 0.32);
          } else if (this.t > carga + 2.3) this.mudar('observar');
          break;
        }

        case 'desesperado':
          if (this.t < 0.9) { if (this.t < dt * 2) this.fogoAng = Math.PI / 2 - Math.PI; }
          else if (this.t < 3.9) { this.fogoAng += dt * (TAU / 3); this.cuspirFogo(jogo, dt, 0, 0.3); }
          else if (this.t > 4.4) this.mudar('observar');
          break;

        case 'voo':
          if (this.t < 0.5) this.anim.tocar('DRAGON_WINGS_OPEN');
          else if (this.t < 1.1) { this.anim.tocar('DRAGON_TAKEOFF'); this.alturaVoo = Math.min(140, this.alturaVoo + 320 * dt); }
          else if (this.t < 1.1 + 1.8 * R) {
            this.anim.tocar('DRAGON_FLY');
            this.alturaVoo = 140 + Math.sin(this.t * 3) * 6;
            this.x += (line.x - this.x) * Math.min(1, dt * 1.8); this.y += (line.y - this.y) * Math.min(1, dt * 1.8);
            this.limitar();
          } else { this.mudar('mergulho', 'DRAGON_AIR_ATTACK'); }
          break;

        case 'mergulho':
          this.alturaVoo = Math.max(0, this.alturaVoo - 520 * dt);
          if (this.alturaVoo <= 0 && !this.golpeFeito) {
            this.golpeFeito = true;
            jogo.tremer(9, 0.35);
            jogo.particulas.emitir('onda', this.x, this.y, 1, { r: 20, vida: 0.5, vel: 0 });
            jogo.particulas.emitir('poeira', this.x, this.y, 22, { vel: 160, vida: 0.7, r: 6 });
            jogo.particulas.emitir('pedra', this.x, this.y, 10, { vel: 120, vz: 160, vida: 0.9 });
            if (d < 115) line.receberDano(jogo, 1, true, this.x, this.y, { pulavel: true, bloqueavel: false });
            this.mudar('pouso', 'DRAGON_LAND');
          }
          break;

        case 'pouso':
          if (this.t > 1.1 * R) this.mudar('observar', 'DRAGON_IDLE');
          break;

        case 'atordoado':
          this.fraco = true;
          if (this.anim.base === 'DRAGON_WEAK_POINT_HIT' && this.anim.estado().acabou) this.anim.tocar('DRAGON_STUNNED', true);
          if (this.t > 3.2) { this.fraco = false; this.mudar('rugido', 'DRAGON_ROAR'); jogo.tremer(6, 0.8); }
          break;

        case 'rugido':
          if (this.t < 0.9 && d < 150) line.mover(dx / (d || 1) * 60 * dt, dy / (d || 1) * 60 * dt, jogo);
          if (this.t > 1.3) this.mudar('observar', 'DRAGON_IDLE');
          break;

        case 'vencido':
          this.fraco = true;
          this.anim.tocar('DRAGON_STUNNED');
          break;

        case 'golpeFinal':
          if (this.anim.estado().acabou && this.t > 0.6) { this.mudar('caindo', 'DRAGON_FALL'); jogo.tremer(10, 0.6); jogo.particulas.emitir('poeira', this.x, this.y, 30, { vel: 180, vida: 0.9, r: 7 }); }
          break;

        case 'caindo':
          if (this.t > 1.4) { this.mudar('derrotado', 'DRAGON_DEFEATED'); this.fraco = false; }
          break;
      }

      // Empurra a Line para fora do corpo.
      if (!this.noAlto && this.estado !== 'derrotado') {
        const px = line.x - this.x, py = (line.y - (this.y - 6)) * 1.6, pd = Math.hypot(px, py);
        if (pd < 50 && pd > 0.01) line.mover(px / pd * (50 - pd) * 0.5, py / pd * (50 - pd) * 0.3, jogo);
      }
    }

    escolherAtaque(jogo, d) {
      if (this.hp < this.hpMax * 0.3 && !this.desesperoFeito) {
        this.desesperoFeito = true; this.ultimo = 'desesperado';
        this.mudar('desesperado', 'DRAGON_DESPERATE_ATTACK');
        jogo.dica('fogoGiro', 'Fogo em círculo! Fique colada no dragão ou esquive através das chamas.');
        return;
      }
      const opcoes = d < 120 ? [['garra', 0.45], ['cauda', 0.35], ['voo', 0.2]] : [['fogo', 0.5], ['voo', 0.3], ['aproximar', 0.2]];
      const validas = opcoes.filter(([o]) => o !== this.ultimo);
      const soma = validas.reduce((s, [, p]) => s + p, 0);
      let r = Math.random() * soma, escolha = validas[0][0];
      for (const [o, p] of validas) { if ((r -= p) <= 0) { escolha = o; break; } }
      this.ultimo = escolha;
      switch (escolha) {
        case 'garra': this.mudar('garra', 'DRAGON_CLAW_ATTACK'); break;
        case 'cauda': this.mudar('cauda', 'DRAGON_TAIL_ATTACK'); jogo.dica('cauda', 'Golpe de cauda! Pule (Espaço) quando o anel laranja piscar forte, ou corra para longe.'); break;
        case 'fogo': this.mudar('fogo', 'DRAGON_FIRE_CHARGE'); jogo.dica('fogo', 'Fogo! Saia da frente ou esquive (L/C). Defender não segura as chamas.'); break;
        case 'voo': this.mudar('voo', 'DRAGON_WINGS_OPEN'); jogo.dica('voo', 'Ele vai mergulhar! Corra da sombra dele ou pule no último instante.'); break;
        default: this.mudar('observar'); this.t = 0.6; this.y = Math.min(this.y + 30, this.y0 + 200);
      }
    }

    cuspirFogo(jogo, dt, rastreio, intervalo) {
      const line = jogo.line;
      if (rastreio) {
        const alvo = Math.atan2(line.y - this.y, line.x - this.x);
        let delta = alvo - this.fogoAng;
        while (delta > Math.PI) delta -= TAU; while (delta < -Math.PI) delta += TAU;
        this.fogoAng += Math.max(-rastreio * dt, Math.min(rastreio * dt, delta));
      }
      this.anim.tocar('DRAGON_FIRE_STREAM');
      const boca = LB.sprite('DRAGON_FIRE_STREAM') ? { x: this.x + this.lado * 68, z: 102 } : { x: this.x + Math.cos(this.fogoAng) * 30, z: 70 };
      const ox = boca.x, oy = this.y + Math.sin(this.fogoAng) * 20 + 10;
      for (let i = 0; i < 3; i++) {
        jogo.particulas.emitir('fogo', ox, oy, 1, { angulo: this.fogoAng, abertura: 0.3, vel: 300, plano: true, vida: 0.75, z: boca.z, vz: -boca.z * 1.3, r: 6 });
      }
      this.fogoTick -= dt;
      if (this.fogoTick <= 0 && this.naChama(line.x, line.y)) {
        const r = line.receberDano(jogo, 1, false, ox, oy, { bloqueavel: false });
        if (r) this.fogoTick = intervalo;
      }
    }

    naChama(px, py) {
      const dx = px - this.x, dy = py - (this.y + 10), d = Math.hypot(dx, dy);
      if (d < 60 || d > 290) return false;
      let a = Math.atan2(dy, dx) - this.fogoAng;
      while (a > Math.PI) a -= TAU; while (a < -Math.PI) a += TAU;
      return Math.abs(a) < 0.3;
    }

    // Golpe da Line. Retorna true se acertou.
    receberGolpe(jogo, dano, ox, oy) {
      if (!this.vulneravel && this.estado !== 'atordoado') return false;
      let total = dano;
      const noPonto = this.fraco && Math.hypot(ox - this.x, oy - (this.y + 10)) < 95;
      if (noPonto) {
        total = dano + 1;
        this.anim.tocar('DRAGON_WEAK_POINT_HIT', true);
        jogo.particulas.emitir('brilho', this.x, this.y - 60, 8, { vel: 90, vida: 0.5, r: 5 });
      } else if (this.estado === 'observar') this.anim.tocar('DRAGON_HIT', true);
      this.hp = Math.max(0, this.hp - total);
      this.flash = 0.12;
      jogo.particulas.emitir('faisca', ox + (this.x - ox) * 0.5, this.y - 30, 8, { vel: 140, vz: 100, vida: 0.4 });
      if (this.hp <= 0) {
        this.mudar('vencido', 'DRAGON_STUNNED'); this.alturaVoo = 0;
        jogo.aoVencerDragao();
        return true;
      }
      if (this.estado !== 'atordoado') {
        this.acumulado += total;
        if (this.acumulado >= 14) {
          this.acumulado = 0; this.mudar('atordoado', 'DRAGON_STUNNED'); this.alturaVoo = 0;
          if (jogo.line.hp < jogo.line.hpMax) jogo.itens.push({ tipo: 'coracao', x: this.x + (Math.random() < 0.5 ? -120 : 120), y: this.y + 120, t: 0 });
          jogo.dica('pontoFraco', 'O dragão está atordoado! Ataque o ponto fraco brilhando no peito dele.');
        }
      }
      return true;
    }

    // Avisos no chão antes dos golpes (ficam por baixo dos personagens).
    desenharAvisos(g, jogo) {
      const R = this.ritmo;
      const pisca = 0.25 + 0.2 * Math.sin(jogo.tempo * 18);
      g.save();
      if (this.estado === 'garra' && this.t < 0.7 * R) {
        g.fillStyle = `rgba(255,60,60,${pisca})`;
        g.beginPath(); g.ellipse(this.x + this.lado * 62, this.y + 30, 62, 26, 0, 0, TAU); g.fill();
      } else if (this.estado === 'cauda' && this.t < 1.05 * R) {
        const agora = this.t > 0.55 * R;
        g.strokeStyle = agora ? 'rgba(255,230,90,.85)' : `rgba(255,120,40,${pisca + 0.15})`; g.lineWidth = agora ? 18 : 12;
        g.beginPath(); g.ellipse(this.x, this.y, 110, 46, 0, 0, TAU); g.stroke();
      } else if ((this.estado === 'fogo' && this.t < 1.0 * R) || (this.estado === 'desesperado' && this.t < 0.9)) {
        const rodar = this.estado === 'desesperado';
        g.fillStyle = `rgba(255,120,0,${pisca})`;
        if (rodar) { g.beginPath(); g.ellipse(this.x, this.y + 10, 290, 140, 0, 0, TAU); g.ellipse(this.x, this.y + 10, 60, 28, 0, 0, TAU); g.fill('evenodd'); }
        else {
          g.beginPath(); g.moveTo(this.x, this.y + 10);
          for (let a = -0.3; a <= 0.3; a += 0.1) g.lineTo(this.x + Math.cos(this.fogoAng + a) * 290, this.y + 10 + Math.sin(this.fogoAng + a) * 290);
          g.closePath(); g.fill();
        }
      } else if (this.estado === 'voo' || this.estado === 'mergulho') {
        const k = Math.min(1, this.alturaVoo / 140);
        g.fillStyle = `rgba(0,0,0,${0.45 - k * 0.2})`;
        g.beginPath(); g.ellipse(this.x, this.y, 80 - k * 25, 32 - k * 10, 0, 0, TAU); g.fill();
        if (this.estado === 'voo' && this.t > 1.1 + 1.2 * R) {
          g.strokeStyle = `rgba(255,60,60,${pisca + 0.2})`; g.lineWidth = 4;
          g.beginPath(); g.ellipse(this.x, this.y, 115, 46, 0, 0, TAU); g.stroke();
        }
      }
      g.restore();
    }

    desenharSombra(g) {
      if (!this.visivel || this.noAlto) return;
      LB.desenho.sombraChao(g, this.x, this.y, 90, 0.35);
    }

    desenhar(g, jogo) {
      if (!this.visivel) return;
      const st = this.anim.estado(null, this.lado);
      const y = this.y - this.alturaVoo;
      if (st.r.sprite) {
        if (this.flash > 0) g.filter = 'brightness(2)';
        LB.desenharSprite(g, st.r, st.quadro, this.x, y, ALTURA_DRAGAO);
        g.filter = 'none';
        if (this.fraco) this.brilhoPeito(g, this.x + this.lado * 38, y - 66, jogo.tempo);
        return;
      }
      const img = LB.personagem('dragao');
      if (img) { this.desenharImagem(g, img, jogo, st); return; }
      LB.desenho.dragao(g, this.x, this.y, { base: this.anim.base, t: jogo.tempo, progresso: st.progresso, lado: this.lado, fraco: this.fraco, flash: this.flash, alturaVoo: this.alturaVoo });
    }

    brilhoPeito(g, px, py, t) {
      const k = 0.6 + 0.4 * Math.sin(t * 10);
      const gr = g.createRadialGradient(px, py, 0, px, py, 26);
      gr.addColorStop(0, `rgba(160,245,255,${0.95 * k})`); gr.addColorStop(0.4, `rgba(90,220,255,${0.55 * k})`); gr.addColorStop(1, 'rgba(90,220,255,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(px, py, 26, 0, Math.PI * 2); g.fill();
      g.strokeStyle = `rgba(200,250,255,${k})`; g.lineWidth = 2; g.beginPath(); g.arc(px, py, 14 + Math.sin(t * 10) * 3, 0, Math.PI * 2); g.stroke();
    }

    // Anima a ilustração do dragão (uma imagem só) com movimentos por animação.
    desenharImagem(g, img, jogo, st) {
      const t = jogo.tempo, p = st.progresso, b = this.anim.base;
      const W = img.naturalWidth, H = img.naturalHeight;
      const ESC = 210 / 340;           // corpo do dragão com ~210 unidades de comprimento
      const PES = H - 3, BOCA = [W - 22, H * 0.46], PEITO = [W * 0.62, H * 0.66];
      let rot = 0, sx = 1, sy = 1, dx = 0, dy = 0, tremor = 0, brilhoBoca = 0, flash = this.flash > 0 ? 2.6 : 1;
      const resp = Math.sin(t * 2.2);
      dy = resp * 2.5; sy = 1 + resp * 0.018; sx = 1 - resp * 0.01;
      if (/WALK/.test(b)) { dy += Math.abs(Math.sin(t * 6)) * -4; rot = Math.sin(t * 6) * 0.03; }
      if (/ROAR/.test(b)) { const k = Math.sin(Math.min(1, p * 1.5) * Math.PI); rot = -0.12 * k; sx = sy = 1 + 0.07 * k; tremor = 2.5 * k; }
      if (/CLAW|BITE/.test(b)) { rot = p < 0.45 ? -0.14 * (p / 0.45) : 0.22 * Math.max(0, 1 - (p - 0.45) * 2.2); dx = p < 0.45 ? -8 * p : 26 * Math.max(0, 1 - (p - 0.45) * 2); }
      if (/TAIL/.test(b)) { sx = Math.cos(Math.min(1, p * 1.25) * Math.PI * 2); sy = 1 - Math.abs(Math.sin(p * Math.PI)) * 0.06; if (Math.abs(sx) < 0.15) sx = 0.15 * Math.sign(sx || 1); }
      if (/FIRE_CHARGE/.test(b)) { rot = -0.1 * Math.min(1, p * 1.5); brilhoBoca = p; }
      if (/FIRE_STREAM|FIRE_BREATH|DESPERATE/.test(b)) { rot = 0.07; tremor = /DESPERATE/.test(b) ? 3 : 1.2; brilhoBoca = 1; }
      if (/WINGS_OPEN|TAKEOFF|FLY|GLIDE/.test(b)) { dy += Math.sin(t * 4) * 5; sy *= 1 + Math.sin(t * 9) * 0.035; }
      if (/AIR_ATTACK/.test(b)) { rot = 0.4; }
      if (/LAND/.test(b)) { sy *= 0.88 + 0.12 * p; sx *= 1.06 - 0.06 * p; }
      if (/^DRAGON_HIT$|WEAK_POINT_HIT/.test(b)) { rot = -0.12 * (1 - p); dx = -10 * (1 - p); }
      if (/STUNNED/.test(b)) { rot = Math.sin(t * 2.6) * 0.1 + 0.08; dy += 6; }
      if (/FINAL_HIT/.test(b)) { rot = -0.28; tremor = 4; flash = Math.max(flash, 2.2 - p); }
      if (/FALL/.test(b)) { rot = -1.35 * Math.min(1, p * 1.1); dy += 28 * p; }
      if (/DEFEATED/.test(b)) { rot = -1.4; dy += 30; sy *= 0.97 + Math.sin(t * 1.5) * 0.015; }
      if (tremor) { dx += (Math.random() - 0.5) * tremor * 2; dy += (Math.random() - 0.5) * tremor; }

      const y = this.y - this.alturaVoo;
      g.save();
      g.translate(this.x, y);
      g.scale(this.lado, 1);
      g.translate(dx, dy);
      g.rotate(rot);
      g.scale(sx, sy);
      if (flash > 1) g.filter = `brightness(${flash})`;
      if (/DESPERATE/.test(b)) g.filter = 'saturate(1.6) hue-rotate(-40deg)';
      g.imageSmoothingEnabled = false;
      const ox = -W / 2 * ESC, oy = -PES * ESC;
      g.drawImage(img, ox, oy, W * ESC, H * ESC);
      g.imageSmoothingEnabled = true;
      g.filter = 'none';
      if (brilhoBoca > 0) {
        const bx = ox + BOCA[0] * ESC, by = oy + BOCA[1] * ESC, r = 6 + brilhoBoca * 14;
        const gr = g.createRadialGradient(bx, by, 0, bx, by, r);
        gr.addColorStop(0, `rgba(255,240,160,${0.9 * brilhoBoca})`); gr.addColorStop(1, 'rgba(255,120,0,0)');
        g.fillStyle = gr; g.beginPath(); g.arc(bx, by, r, 0, Math.PI * 2); g.fill();
      }
      if (this.fraco) this.brilhoPeito(g, ox + PEITO[0] * ESC, oy + PEITO[1] * ESC, t);
      g.restore();
      if (/STUNNED/.test(b) && this.estado !== 'derrotado') {
        g.fillStyle = '#fff176';
        for (let i = 0; i < 3; i++) { const a = t * 4 + i * 2.1; LB.desenho.estrela(g, this.x + this.lado * 64 + Math.cos(a) * 30, y - 138 + Math.sin(a) * 8, 5); }
      }
    }
  }

  LB.Dragao = Dragao;
})(window.LB);
