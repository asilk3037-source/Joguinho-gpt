'use strict';

// Parte 2: a Bell também joga. As duas andam juntas (a outra segue atrás) e dá para trocar com T
// (ou o botão 🔄). Cada uma tem a sua vida; se a heroína ativa cai e a outra ainda está de pé, a
// outra assume. A Bell usa o mesmo corpo de jogo da Line (andar, pular, esquivar, defender) com as
// animações dela e ataques próprios: estrela (à distância), leque de estrelas (luz: acende cristais
// e abre a guarda dos chefes) e a canção (acalma os inimigos em volta e cura um pouco).
(function (LB) {

  // Animação da Line → animação da Bell (sem arte ainda, o catálogo usa a substituta da Bell).
  const TRADUCAO = {
    LINE_IDLE: 'BELL_IDLE', LINE_WALK: 'BELL_WALK', LINE_RUN: 'BELL_RUN', LINE_RUN_START: 'BELL_RUN', LINE_RUN_STOP: 'BELL_IDLE',
    LINE_COMBAT_IDLE: 'BELL_COMBAT_IDLE', LINE_COMBAT_WALK: 'BELL_WALK', LINE_COMBAT_RUN: 'BELL_RUN',
    LINE_LOOK_SIDES_FRONT: 'BELL_LOOK_SIDES_FRONT', LINE_BLINK_FRONT: 'BELL_BLINK_FRONT',
    LINE_JUMP: 'BELL_JUMP', LINE_LAND: 'BELL_LAND', LINE_ATTACK_AIR: 'BELL_ATTACK_AIR',
    LINE_ATTACK_HORIZONTAL: 'BELL_ATTACK_STAR', LINE_ATTACK_VERTICAL: 'BELL_ATTACK_STAR', LINE_ATTACK_COMBO: 'BELL_ATTACK_STAR', LINE_ATTACK_DIAGONAL: 'BELL_ATTACK_STAR',
    LINE_ATTACK_SPIN: 'BELL_ATTACK_SPREAD', LINE_CAST_SPELL: 'BELL_SING', LINE_CAST_CHARGE: 'BELL_SING', LINE_CAST_STARS: 'BELL_SING',
    LINE_BLOCK: 'BELL_BLOCK', LINE_DODGE: 'BELL_DODGE', LINE_DASH: 'BELL_DASH',
    LINE_HIT_LIGHT: 'BELL_HIT', LINE_HIT_HEAVY: 'BELL_HIT', LINE_THROWN: 'BELL_FALL', LINE_KNOCKDOWN: 'BELL_KNOCKDOWN', LINE_INJURED_STAND: 'BELL_GROUND_STAND',
    LINE_EXHAUSTED_IDLE: 'BELL_EXHAUSTED_IDLE', LINE_STUMBLE: 'BELL_FALL', LINE_FALL: 'BELL_FALL', LINE_GROUND_STAND: 'BELL_GROUND_STAND',
    LINE_CROUCH: 'BELL_CROUCH', LINE_CROUCH_STAND: 'BELL_IDLE', LINE_SWORD_DRAW: 'BELL_COMBAT_IDLE', LINE_SWORD_SHEATHE: 'BELL_IDLE',
    LINE_HAPPY: 'BELL_HAPPY', LINE_LAUGH: 'BELL_LAUGH', LINE_CRY: 'BELL_CRY', LINE_SAD: 'BELL_CRY', LINE_RELIEVED: 'BELL_RELIEVED', LINE_SCARED: 'BELL_SCARED',
    LINE_DETERMINED: 'BELL_DETERMINED', LINE_ANGRY: 'BELL_DETERMINED', LINE_CALL_BELL: 'BELL_CALL_LINE', LINE_VICTORY: 'BELL_CELEBRATE',
  };
  const traduzir = (b) => TRADUCAO[b] || (b && b.startsWith('BELL_') ? b : 'BELL_IDLE');

  const CUSTO_LEQUE = 1, CUSTO_CANCAO = 2;

  function liberada(j) { return !!(j.flags && j.flags.bellJogavel); }
  function ativa(j) { return liberada(j) && j.flags.heroina === 'bell' ? 'bell' : 'line'; }
  function estado(j) {
    // Fica nas flags para ir junto no save.
    if (!j.flags.herois) j.flags.herois = { line: null, bell: null };
    return j.flags.herois;
  }

  // Aplica a heroína ativa no corpo de jogo (ao entrar numa área ou trocar).
  function aplicar(j, manterVida) {
    const l = j.line;
    if (!l) return;
    if (manterVida) j.companheira = null;
    const bell = ativa(j) === 'bell';
    l.perfil = bell ? PERFIL_BELL : null;
    l.anim.traduzir = bell ? traduzir : null;
    l.velPerfil = bell ? 1.05 : 1;
    if (bell) { l.temEspada = true; l.temMagia = true; l.armada = true; }
    else { l.temEspada = !!j.flags.espada; l.temMagia = !!j.flags.magia; }
    l.temEstrela = bell ? false : !!j.flags.estrela;
    if (LB.loja) LB.loja.vestir(j, false);
    const s = !manterVida && estado(j)[ativa(j)];
    if (s) { l.hp = Math.min(l.hpMax, s.hp); l.mana = Math.min(l.manaMax, s.mana); l.escudos = Math.min(l.escudosMax || 0, s.escudos || 0); }
    if (l.estado === 'livre' || l.estado === 'cena') l.anim.tocar(l.animParada(), true);
    criarCompanheira(j);
  }

  function guardar(j) {
    const l = j.line;
    if (!l) return;
    estado(j)[ativa(j)] = { hp: l.hp, mana: l.mana, escudos: l.escudos || 0 };
  }

  function outra(j) { return ativa(j) === 'bell' ? 'line' : 'bell'; }
  function vidaDaOutra(j) { const s = estado(j)[outra(j)]; return s ? s.hp : j.line.hpMax; }

  function trocar(j, forcar) {
    const l = j.line;
    if (!liberada(j) || !l) return false;
    if (!forcar && (j.cena || l.estado !== 'livre' || (j.trocaEspera || 0) > 0)) return false;
    if (!forcar && vidaDaOutra(j) <= 0) { LB.mochila.aviso(`💤 ${outra(j) === 'bell' ? 'A Bell' : 'A Line'} precisa descansar numa fonte.`); return false; }
    guardar(j);
    j.flags.heroina = outra(j);
    aplicar(j);
    if (!estado(j)[ativa(j)]) { l.hp = l.hpMax; l.mana = l.manaMax; l.escudos = l.escudosMax || 0; }
    l.invul = Math.max(l.invul, 0.6);
    j.trocaEspera = 0.8;
    j.particulas.emitir('brilho', l.x, l.y - 36, 14, { vel: 90, vida: 0.5, r: 4 });
    LB.mochila.aviso(ativa(j) === 'bell' ? '💖 Jogando com a Bell' : '⚔️ Jogando com a Line');
    LB.mochila.atualizarBotoes(j);
    return true;
  }

  // Quando a heroína ativa cai: se a outra está de pé, ela assume.
  function aoCair(j) {
    if (!liberada(j) || vidaDaOutra(j) <= 0) return false;
    const quem = ativa(j) === 'bell' ? 'A Bell' : 'A Line';
    guardar(j);
    estado(j)[ativa(j)].hp = 0;
    trocar(j, true);
    const l = j.line;
    l.voltarLivre(); l.invul = 1.5;
    LB.mochila.aviso(`💫 ${quem} caiu! ${ativa(j) === 'bell' ? 'A Bell' : 'A Line'} assume.`);
    j.dica('troca', 'Quando uma cai, a outra assume. Beba de uma fonte para as duas voltarem com a vida cheia.');
    return true;
  }

  function descansar(j) {
    const s = estado(j), l = j.line;
    for (const k of ['line', 'bell']) s[k] = { hp: l.hpMax, mana: l.manaMax, escudos: 99 };
    if (l) { l.hp = l.hpMax; l.mana = l.manaMax; }
  }

  function atualizar(j, dt) {
    j.trocaEspera = Math.max(0, (j.trocaEspera || 0) - dt);
    if (liberada(j) && !j.cena && j.estado === 'jogo' && LB.entrada.apertou('trocar')) trocar(j);
    const c = j.companheira;
    if (c) c.atualizar(dt, j);
    // A heroína que está descansando recupera magia devagar.
    const o = estado(j)[outra(j)];
    if (o && o.hp > 0 && o.mana < j.line.manaMax) o.mana = Math.min(j.line.manaMax, o.mana + dt / 4);
  }

  // ---------------- A Bell lutando ----------------
  const PERFIL_BELL = {
    nome: 'Bell',
    // Chamado pela Line.livre: devolve true se a Bell tratou o botão.
    livre(l, jogo, E) {
      if (E.apertou('atacar')) {
        if (jogo.interagir(l, true)) return true;
        l.mirar(jogo); l.mudar('tiro', 'LINE_ATTACK_HORIZONTAL'); l.feitoTiro = false; return true;
      }
      if (E.apertou('especial')) {
        if (l.mana < CUSTO_LEQUE) { jogo.avisoMana = 0.6; jogo.dica('semManaBell', 'Sem magia para o leque de estrelas. Ela volta sozinha aos poucos.'); return true; }
        l.mana -= CUSTO_LEQUE; l.mirar(jogo); l.mudar('leque', 'LINE_ATTACK_SPIN'); l.feitoTiro = false; return true;
      }
      if (E.apertou('magia')) {
        if (l.mana < CUSTO_CANCAO) { jogo.avisoMana = 0.6; jogo.dica('semManaBell', 'Sem magia para cantar. Ela volta sozinha aos poucos.'); return true; }
        l.mana -= CUSTO_CANCAO; l.mudar('cancao', 'LINE_CAST_SPELL'); l.feitoTiro = false; return true;
      }
      return false;
    },
    passo(l, dt, jogo, st) {
      const E = LB.entrada;
      if (l.estado === 'tiro') {
        if (!l.feitoTiro && st.progresso >= 0.35) { l.feitoTiro = true; estrela(jogo, l, 0, 'estrelaBell', 1); }
        if (st.progresso > 0.5 && E.apertou('atacar')) { l.mirar(jogo); l.mudar('tiro', 'LINE_ATTACK_HORIZONTAL'); l.feitoTiro = false; return; }
        if (st.acabou || st.progresso > 0.75) l.voltarLivre();
      } else if (l.estado === 'leque') {
        if (!l.feitoTiro && st.progresso >= 0.35) { l.feitoTiro = true; for (const a of [-0.35, 0, 0.35]) estrela(jogo, l, a, 'luz', 1); }
        if (st.acabou) l.voltarLivre();
      } else if (l.estado === 'cancao') {
        if (Math.random() < dt * 14) jogo.particulas.emitir('nota', l.x + (Math.random() - 0.5) * 30, l.y - 50, 1, { vz: 40, vel: 20, vida: 0.9, cor: ['#ff9ecf', '#ffd166', '#9ad0ff'][Math.floor(Math.random() * 3)] });
        if (!l.feitoTiro && st.progresso >= 0.4) { l.feitoTiro = true; cancao(jogo, l); }
        if (st.acabou) l.voltarLivre();
      }
    },
  };

  function estrela(jogo, l, desvio, tipo, dano) {
    const v = LB.magia.alvoDoRaio(jogo, l), m = Math.hypot(v.x, v.y) || 1;
    const ang = Math.atan2(v.y / m, v.x / m) + desvio;
    const ox = l.x + Math.cos(ang) * 16, oy = l.y + Math.sin(ang) * 8;
    LB.magia.lancar(jogo, { dono: 'line', tipo, x: ox, y: oy, vx: Math.cos(ang) * 330, vy: Math.sin(ang) * 330, r: tipo === 'luz' ? 6 : 5, max: 0.85, dano });
    jogo.particulas.emitir('brilho', ox, oy - 30, 3, { vel: 50, vida: 0.3, r: 3 });
  }

  // Canção: acalma os inimigos em volta (eles param), cura um pouco as duas.
  function cancao(jogo, l) {
    const R = 170;
    jogo.efeitos.push({ tipo: 'estrela', x: l.x, y: l.y, t: 0, dur: 0.8, r: R, cor: '255,170,220' });
    for (const e of jogo.inimigos) {
      if (!e.vivo || Math.hypot(e.x - l.x, (e.y - l.y) * 1.2) > R + (e.raio || 12)) continue;
      if (e.chefeElemental) { if (e.estado === 'exausto') e.exposto += 1; else e.encantado = 1.4; }
      else e.encantado = 2.4;
    }
    l.hp = Math.min(l.hpMax, l.hp + 1);
    const o = estado(jogo)[outra(jogo)]; if (o && o.hp > 0) o.hp = Math.min(l.hpMax, o.hp + 1);
    jogo.dica('cancao', 'A canção da Bell acalma os inimigos por alguns segundos e cura um pouquinho as duas.');
  }

  // ---------------- A outra heroína, andando junto ----------------
  class Companheira {
    constructor(quem, x, y) { this.quem = quem; this.x = x; this.y = y; this.dir = 'FRONT'; this.lado = 1; this.anim = new LB.Animador(quem === 'bell' ? 'BELL_IDLE' : 'LINE_IDLE'); this.visivel = true; }
    atualizar(dt, j) {
      const l = j.line, pref = this.quem === 'bell' ? 'BELL' : 'LINE';
      this.anim.atualizar(dt);
      const alvoX = l.x - l.lado * 30, alvoY = l.y + 6;
      const dx = alvoX - this.x, dy = alvoY - this.y, d = Math.hypot(dx, dy);
      if (d > 320) { this.x = alvoX; this.y = alvoY; }
      const vel = d > 90 ? 175 : d > 30 ? 95 : 0;
      if (vel) {
        this.x += dx / d * vel * dt; this.y += dy / d * vel * dt;
        this.dir = LB.dirDe(dx, dy, this.dir); if (Math.abs(dx) > 2) this.lado = dx < 0 ? -1 : 1;
        this.anim.tocar(pref + (vel > 100 ? '_RUN' : '_WALK'));
      } else { this.anim.tocar(pref + '_IDLE'); if (Math.abs(l.x - this.x) > 4) this.lado = l.x < this.x ? -1 : 1; }
      this.visivel = l.visivel !== false && !j.duo && !j.viagem;
      this.caida = vidaDaOutra(j) <= 0;
    }
    desenharSombra(g) { if (this.visivel) LB.desenho.sombraChao(g, this.x, this.y, 13, 0.25); }
    desenhar(g) {
      if (!this.visivel) return;
      const st = this.anim.estado(this.dir, this.lado);
      g.save(); if (this.caida) g.globalAlpha = 0.5;
      LB.desenharSprite(g, st.r, st.quadro, this.x, this.y, LB.ALTURA_LINE);
      g.restore();
    }
  }

  function criarCompanheira(j) {
    if (!liberada(j) || !j.line) { j.companheira = null; return; }
    const quem = outra(j), l = j.line;
    if (j.companheira && j.companheira.quem === quem) return;
    j.companheira = new Companheira(quem, l.x - 30, l.y + 6);
  }

  // Vida da outra heroína, pequena, embaixo das moedas.
  function desenharHud(g, j, s) {
    if (!liberada(j) || !j.line || !j.flags.prologo) return;
    const quem = outra(j), st = estado(j)[quem], max = j.line.hpMax, hp = st ? st.hp : max;
    const y = (j.flags.magia || ativa(j) === 'bell' ? 66 : 46) * s + 40 * s, x = 22 * s;
    g.font = `700 ${9 * s}px system-ui, sans-serif`; g.textAlign = 'left';
    g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(x - 9 * s, y - 8 * s, (26 + max / 2 * 11) * s, 15 * s);
    g.fillStyle = '#ffe9c7'; g.fillText(quem === 'bell' ? 'Bell' : 'Line', x - 5 * s, y + 3 * s);
    for (let i = 0; i < max / 2; i++) {
      const v = Math.max(0, Math.min(2, hp - i * 2));
      LB.desenho.coracaoForma(g, x + (24 + i * 11) * s, y - 1 * s, 4.5 * s, v === 2 ? '#ff4d6d' : v === 1 ? '#ff9db0' : 'rgba(255,255,255,.2)');
    }
    if (!LB.entrada.usandoToque()) { g.fillStyle = 'rgba(255,233,199,.7)'; g.fillText('T troca', x + (30 + max / 2 * 11) * s, y + 3 * s); }
  }

  LB.herois = { TRADUCAO, traduzir, liberada, ativa, aplicar, guardar, trocar, aoCair, descansar, atualizar, desenharHud, criarCompanheira, Companheira, CUSTO_LEQUE, CUSTO_CANCAO };
})(window.LB);
