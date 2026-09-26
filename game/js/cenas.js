'use strict';

(function (LB) {
  const T = (n) => n * LB.TILE;

  // ---------- Caixa de diálogo ----------
  const dialogo = {
    el: null, nome: null, texto: null,
    ligar() {
      this.el = document.getElementById('dialogo');
      this.nome = this.el.querySelector('.nome');
      this.texto = this.el.querySelector('.texto');
      this.el.addEventListener('click', () => { this.clicou = true; });
      this.el.addEventListener('touchstart', (e) => { e.preventDefault(); this.clicou = true; }, { passive: false });
    },
    mostrar(nome, texto, classe) {
      this.completo = texto; this.pos = 0; this.clicou = false;
      this.nome.textContent = nome || '';
      this.nome.style.display = nome ? '' : 'none';
      this.el.className = 'visivel ' + (classe || '');
      this.texto.textContent = '';
    },
    esconder() { this.el.className = 'oculto'; },
    // Retorna true quando a pessoa confirma depois do texto terminar.
    atualizar(dt) {
      const E = LB.entrada;
      const confirmou = this.clicou || E.apertou('atacar') || E.apertou('interagir') || E.apertou('pular');
      this.clicou = false;
      if (confirmou) { E.consumir('atacar'); E.consumir('interagir'); E.consumir('pular'); }
      if (this.pos < this.completo.length) {
        this.pos = confirmou ? this.completo.length : Math.min(this.completo.length, this.pos + dt * 48);
        this.texto.textContent = this.completo.slice(0, Math.floor(this.pos));
        this.el.classList.toggle('pronto', this.pos >= this.completo.length);
        return false;
      }
      return confirmou;
    },
  };

  // ---------- Roteiro (cenas com geradores) ----------
  class Roteiro {
    constructor(jogo, fn, opcoes) {
      this.jogo = jogo;
      this.c = criarApi(jogo, this);
      this.gen = fn(this.c, jogo);
      this.espera = null;
      this.paralelos = [];
      this.rapido = false;
      this.fim = false;
      this.podePular = !(opcoes && opcoes.semPular);
    }

    pular() { if (this.podePular) this.rapido = true; }

    atualizar(dt) {
      for (const p of this.paralelos) { if (this.rapido && p.pular) p.pular(); if (p.atualizar) p.atualizar(dt); }
      this.paralelos = this.paralelos.filter((p) => !(this.rapido || p.pronto()));
      let voltas = 0;
      while (!this.fim && voltas++ < 400) {
        if (this.espera) {
          if (this.rapido && this.espera.pular) this.espera.pular();
          else if (this.espera.atualizar) this.espera.atualizar(dt);
          if (!this.rapido && !this.espera.pronto()) return;
          if (this.espera.depois) this.espera.depois();
          this.espera = null;
        }
        const r = this.gen.next();
        if (r.done) { this.fim = true; dialogo.esconder(); return; }
        this.espera = r.value || null;
      }
    }
  }

  function criarApi(jogo, roteiro) {
    const c = {
      espera(seg) { let t = 0; return { atualizar: (dt) => { t += dt; }, pronto: () => t >= seg }; },

      fala(nome, texto, classe) {
        let ok = false;
        dialogo.mostrar(nome, texto, classe || (nome === 'Bell' ? 'bell' : nome === 'Line' ? 'line' : 'sistema'));
        return {
          atualizar: (dt) => { if (dialogo.atualizar(dt)) ok = true; },
          pronto: () => ok,
          pular: () => { ok = true; },
          depois: () => dialogo.esconder(),
        };
      },

      // Anda até (tx, ty) em tiles. `anim` é a animação durante o trajeto; `parar` ao chegar.
      andar(ent, tx, ty, o) {
        o = o || {};
        const alvo = { x: T(tx), y: T(ty), vel: o.vel || 90, anim: o.anim || (ent instanceof LB.Bell ? 'BELL_WALK' : 'LINE_WALK'), parar: o.parar };
        ent.alvoCena = alvo;
        return {
          pronto: () => ent.alvoCena !== alvo,
          pular: () => { ent.x = alvo.x; ent.y = alvo.y; ent.alvoCena = null; if (alvo.parar) ent.anim.tocar(alvo.parar, true); },
        };
      },

      // Espera a animação atual terminar.
      animacao(ent) {
        return { pronto: () => ent.anim.estado(ent.dir, ent.lado).acabou, pular: () => {} };
      },

      animar(ent, base, esperar) {
        ent.anim.tocar(base, true);
        return esperar ? c.animacao(ent) : null;
      },

      // Interpola x, y e altura de voo de uma entidade.
      voar(ent, x, y, altura, dur) {
        const x0 = ent.x, y0 = ent.y, h0 = ent.alturaVoo || 0;
        let t = 0;
        const aplicar = (k) => {
          const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          ent.x = x0 + (x - x0) * e; ent.y = y0 + (y - y0) * e; ent.alturaVoo = h0 + (altura - h0) * e;
        };
        return { atualizar: (dt) => { t += dt; aplicar(Math.min(1, t / dur)); }, pronto: () => t >= dur, pular: () => aplicar(1) };
      },

      tween(obj, prop, alvo, dur) {
        const ini = obj[prop]; let t = 0;
        return {
          atualizar: (dt) => { t += dt; obj[prop] = ini + (alvo - ini) * Math.min(1, t / dur); },
          pronto: () => t >= dur,
          pular: () => { obj[prop] = alvo; },
        };
      },

      escurecer(alvo, dur) { return c.tween(jogo, 'fade', alvo, dur); },

      tingir(cor, alfa, dur) {
        if (!jogo.tint) jogo.tint = { cor, a: 0 };
        const ini = jogo.tint.a;
        jogo.tint.cor = cor;
        let t = 0;
        return { atualizar: (dt) => { t += dt; jogo.tint.a = ini + (alfa - ini) * Math.min(1, t / dur); }, pronto: () => t >= dur, pular: () => { jogo.tint.a = alfa; } };
      },

      camera(x, y, dur) {
        jogo.camAlvo = { x, y };
        return c.espera(dur || 0.8);
      },

      titulo(texto, sub, dur) {
        jogo.mostrarTitulo(texto, sub);
        let t = 0;
        return { atualizar: (dt) => { t += dt; }, pronto: () => t >= dur, pular: () => {}, depois: () => jogo.esconderTitulo() };
      },

      quando(fn) { return { pronto: fn, pular: () => {} }; },

      junto(espera) { if (espera) roteiro.paralelos.push(espera); return null; },

      // Usa a animação conjunta (ex.: abraço) se ela existir; senão mantém as duas separadas.
      duo(base, x, y, dir) {
        const r = LB.resolver(base, dir, 1);
        if (!r.sprite) return false;
        jogo.duo = { anim: new LB.Animador(base), x, y, dir };
        jogo.line.visivel = false; if (jogo.bell) jogo.bell.visivel = false;
        return true;
      },
      fimDuo() { jogo.duo = null; jogo.line.visivel = true; if (jogo.bell) jogo.bell.visivel = true; },
    };
    return c;
  }

  // ---------- História ----------
  const HISTORIA = {
    *prologo(c, j) {
      const line = j.line;
      const bell = j.criarBell(16.3, 14.25, 'LEFT');
      line.x = T(14.7); line.y = T(14.25); line.dir = 'RIGHT'; line.lado = 1;
      line.anim.tocar('LINE_IDLE', true); bell.anim.tocar('BELL_IDLE', true);
      j.cameraEm(T(15.5), T(13));
      j.fade = 1;
      j.tint = { cor: '255,160,80', a: 0.2 };
      yield c.escurecer(0, 1.4);
      yield c.titulo('Line & Bell', 'Capítulo 1 — O resgate', 2.6);
      bell.anim.tocar('BELL_HAPPY', true);
      yield c.fala('Bell', 'O pôr do sol daqui é o meu favorito. Promete que amanhã a gente volta?');
      line.dir = 'FRONT';
      line.anim.tocar('LINE_HAPPY', true);
      yield c.fala('Line', 'Prometo. Amanhã, depois de amanhã... todo dia que você quiser.');
      line.anim.tocar('LINE_LAUGH', true);
      yield c.fala('Bell', 'Boba...');
      yield c.espera(0.6);

      j.tremer(3, 1.6);
      yield c.tingir('40,30,60', 0.42, 1.4);
      bell.dir = 'BACK'; bell.anim.tocar('BELL_SCARED', true);
      line.dir = 'BACK'; line.anim.tocar('LINE_IDLE', true);
      yield c.fala('Bell', 'Line... que barulho foi esse?');

      const dr = j.criarDragaoCena(T(15.5), T(6), 280);
      dr.anim.tocar('DRAGON_FLY', true);
      yield c.voar(dr, T(16.3), T(12.2), 110, 1.5);
      line.anim.tocar('LINE_SCARED', true);
      yield c.fala('Line', 'BELL! CORRE!');
      dr.anim.tocar('DRAGON_AIR_ATTACK', true);
      yield c.voar(dr, bell.x, bell.y - 4, 30, 0.45);
      bell.anim.tocar('BELL_CAPTURED', true);
      j.tremer(7, 0.4);
      j.particulas.emitir('poeira', bell.x, bell.y, 16, { vel: 120, vida: 0.7, r: 5 });
      yield c.espera(0.5);
      j.prender(bell, dr);
      bell.anim.tocar('BELL_DRAGON_CARRIED', true);
      dr.anim.tocar('DRAGON_TAKEOFF', true);
      yield c.voar(dr, bell.x, T(12.5), 190, 0.9);
      yield c.fala('Bell', 'LIIINE!');
      dr.anim.tocar('DRAGON_FLY', true);
      c.junto(c.voar(dr, T(15), T(-5), 300, 2.4));
      c.junto(c.andar(line, 15, 9.2, { vel: 168, anim: 'LINE_RUN', parar: 'LINE_RUN_STOP' }));
      yield c.espera(1.7);
      line.anim.tocar('LINE_CALL_BELL', true);
      yield c.fala('Line', 'BELL!!!');
      yield c.espera(0.8);
      j.soltar(); bell.visivel = false; j.removerDragaoCena();

      yield c.tingir('255,160,80', 0.22, 1.5);
      line.dir = 'FRONT'; line.anim.tocar('LINE_SAD', true);
      yield c.espera(1);
      line.anim.tocar('LINE_DETERMINED', true);
      yield c.fala('Line', 'Ele voou para a montanha, do outro lado da floresta...');
      yield c.fala('Line', 'Aguenta firme, Bell. Eu vou te buscar.');
      j.bell = null;
      j.flags.prologo = true;
      j.salvar();
      j.dica('mover', LB.entrada.usandoToque()
        ? 'Arraste o dedo no lado esquerdo para andar. Empurre até o fim para correr. Siga para o norte!'
        : 'WASD ou setas para andar, Shift para correr. Siga pelo caminho ao norte, até a floresta!');
    },

    *floresta(c, j) {
      yield c.espera(0.4);
      yield c.fala('Line', 'A Floresta Sussurrante... O dragão foi para a montanha, do outro lado.');
      yield c.fala('Line', 'Sem uma arma eu não tenho chance contra aquilo. Deve ter alguma coisa útil por aqui.');
      j.flags.florestaVista = true;
    },

    *espinhos(c, j) {
      yield c.fala('Line', 'Espinhos demais pra passar... Preciso de algo afiado para abrir caminho.');
    },

    *espada(c, j, bau) {
      const line = j.line;
      line.anim.tocar('LINE_CROUCH', true);
      yield c.animacao(line);
      bau.aberto = true;
      j.particulas.emitir('brilho', bau.x, bau.y - 20, 12, { vel: 70, vida: 0.8, r: 6 });
      yield c.espera(0.5);
      line.anim.tocar('LINE_CROUCH_STAND', true);
      yield c.animacao(line);
      line.temEspada = true;
      line.anim.tocar('LINE_SWORD_DRAW', true);
      yield c.animacao(line);
      line.armada = true;
      line.anim.tocar('LINE_HAPPY', true);
      yield c.titulo('Espada encontrada!', 'Agora a Line pode lutar', 2);
      yield c.fala('Line', 'Uma espada! Com isso eu consigo cortar os espinhos no caminho do norte.');
      yield c.fala('', LB.entrada.usandoToque()
        ? 'ATACAR: golpe (aperte 3x para combo) · GIRO: ataque em volta · ESQUIVA: desvia (correndo vira dash) · DEFESA: segure para bloquear · PULAR + ATACAR: ataque aéreo'
        : 'J ou Z: atacar (3x = combo) · K ou X: giro · L ou C: esquivar (correndo = dash) · I ou V: defender (segure) · Espaço e depois J: ataque aéreo');
      j.flags.espada = true;
      j.salvar();
      j.criarInimigos();
      line.dir = 'FRONT'; line.anim.tocar('LINE_COMBAT_IDLE', true);
      yield c.espera(0.6);
      yield c.fala('Line', 'Sombras?! Só podem ser coisa do dragão... Vem!');
    },

    *placa(c, j, texto) {
      yield c.fala('Placa', texto, 'sistema');
    },

    *covil(c, j) {
      const line = j.line, dr = j.dragao, bell = j.bell;
      if (j.flags.covilVisto) {
        // Tentando de novo: vai direto para a luta.
        line.x = T(13); line.y = T(14.6); line.dir = 'BACK'; line.armada = true;
        dr.visivel = true; dr.alturaVoo = 0; dr.y = T(8);
        j.selarEntrada();
        dr.anim.tocar('DRAGON_ROAR', true); j.tremer(6, 1);
        line.anim.tocar('LINE_DETERMINED', true);
        yield c.fala('Line', 'De novo. Dessa vez eu não caio.');
        j.iniciarChefe();
        return;
      }
      line.x = T(13); line.y = T(18.4); line.dir = 'BACK';
      j.cameraEm(T(13), T(15));
      yield c.andar(line, 13, 14.6, { vel: 80, anim: 'LINE_WALK', parar: 'LINE_IDLE' });
      yield c.camera(T(13), T(4.5), 1.4);
      bell.anim.tocar('BELL_CALL_LINE', true);
      yield c.fala('Bell', 'Line?! LINE! Você veio!');
      yield c.fala('Line', 'Eu prometi, não prometi?');
      bell.anim.tocar('BELL_TRAPPED', true);
      yield c.camera(T(13), T(9), 0.6);
      dr.visivel = true;
      dr.anim.tocar('DRAGON_GLIDE', true);
      yield c.voar(dr, T(13), T(8), 0, 1.4);
      dr.anim.tocar('DRAGON_LAND', true);
      j.tremer(8, 0.5);
      j.particulas.emitir('poeira', dr.x, dr.y, 26, { vel: 170, vida: 0.8, r: 6 });
      j.selarEntrada();
      yield c.espera(0.8);
      dr.anim.tocar('DRAGON_ROAR', true);
      j.tremer(7, 1.3);
      yield c.espera(1.4);
      dr.anim.tocar('DRAGON_IDLE', true);
      if (!line.armada) { line.anim.tocar('LINE_SWORD_DRAW', true); yield c.animacao(line); line.armada = true; }
      line.anim.tocar('LINE_DETERMINED', true);
      yield c.fala('Line', 'Solta ela. AGORA.');
      bell.anim.tocar('BELL_SCARED', true);
      yield c.fala('Bell', 'Cuidado! Quando ele cansa, o peito dele brilha. Esse é o ponto fraco!');
      bell.anim.tocar('BELL_TRAPPED', true);
      j.flags.covilVisto = true;
      j.iniciarChefe();
    },

    *vitoria(c, j) {
      const line = j.line, bell = j.bell;
      yield c.espera(1.8);
      line.dir = 'FRONT';
      line.anim.tocar('LINE_SWORD_SHEATHE', true);
      yield c.animacao(line);
      line.armada = false;
      line.anim.tocar('LINE_EXHAUSTED_IDLE', true);
      yield c.espera(0.6);
      j.jaulaAberta = true;
      bell.anim.tocar('BELL_BREAK_FREE', true);
      j.particulas.emitir('faisca', bell.x, bell.y - 30, 14, { vel: 120, vz: 100, vida: 0.5 });
      yield c.animacao(bell);
      const alvoX = (line.x + 22) / LB.TILE, alvoY = line.y / LB.TILE;
      yield c.andar(bell, alvoX, alvoY, { vel: 150, anim: 'BELL_RUN', parar: 'BELL_HAPPY' });
      line.dir = 'RIGHT'; line.lado = 1; bell.dir = 'LEFT'; bell.lado = -1;
      const abraco = c.duo('LINE_BELL_RESCUE_HUG', (line.x + bell.x) / 2, line.y);
      if (!abraco) { line.anim.tocar('LINE_HAPPY', true); bell.anim.tocar('BELL_HAPPY', true); bell.x = line.x + 16; }
      j.particulas.emitir('coracao', (line.x + bell.x) / 2, line.y - 60, 8, { vel: 40, vida: 1.6 });
      yield c.espera(1.2);
      yield c.fala('Bell', 'Eu sabia que você vinha. Eu sabia!');
      line.anim.tocar('LINE_RELIEVED', true);
      yield c.fala('Line', 'Você tá bem? Ele te machucou?');
      bell.anim.tocar('BELL_RELIEVED', true);
      yield c.fala('Bell', 'Agora que você tá aqui, eu tô ótima.');
      if (abraco) { c.fimDuo(); c.duo('LINE_BELL_HUG_RELEASE', (line.x + bell.x) / 2, line.y); yield c.espera(1); c.fimDuo(); }
      line.anim.tocar('LINE_LAUGH', true);
      yield c.fala('Line', 'Então... será que ainda dá tempo de ver o pôr do sol?');
      bell.anim.tocar('BELL_HAPPY', true);
      yield c.fala('Bell', 'Só se for de mãos dadas.');
      j.particulas.emitir('coracao', (line.x + bell.x) / 2, line.y - 60, 6, { vel: 30, vida: 1.6 });
      yield c.espera(1);
      yield c.escurecer(1, 1.6);

      // Epílogo: de volta à campina, no fim da tarde.
      j.epilogo();
      yield c.escurecer(0, 1.8);
      yield c.espera(1.2);
      j.particulas.emitir('coracao', (j.line.x + j.bell.x) / 2, j.line.y - 60, 5, { vel: 25, vida: 2 });
      yield c.espera(2.2);
      yield c.titulo('Fim', 'Obrigada por jogar!', 3.2);
      yield c.escurecer(1, 1.4);
      j.olho = { abertura: 0 };
      yield c.espera(1.2);
      yield c.tween(j.olho, 'abertura', 1, 2.2);
      yield c.espera(1.4);
      yield c.titulo('Fim?', '', 2.6);
      j.flags.zerado = true;
      j.salvar();
      j.voltarAoMenu();
    },
  };

  LB.dialogo = dialogo;
  LB.Roteiro = Roteiro;
  LB.HISTORIA = HISTORIA;
})(window.LB);
