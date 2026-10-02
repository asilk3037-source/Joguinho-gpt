'use strict';

(function (LB) {
  const T = (n) => n * LB.TILE;
  const $ = (sel) => document.querySelector(sel);

  // Expressões dos retratos, na ordem da folha (3 colunas x 2 linhas).
  const ROSTOS = ['neutro', 'sorriso', 'riso', 'surpresa', 'apaixonada', 'maroto'];
  // Rostos avulsos (tira extra); quem não tiver usa o parecido.
  const PARECIDO = { bravo: 'neutro', chorando: 'surpresa', envergonhada: 'apaixonada' };

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
    mostrar(nome, texto, classe, rosto) {
      this.completo = texto; this.pos = 0; this.clicou = false;
      this.nome.textContent = nome || '';
      this.nome.style.display = nome ? '' : 'none';
      const quem = nome === 'Line' ? 'line' : nome === 'Bell' ? 'bell' : null;
      const r = quem && window.RETRATOS && window.RETRATOS[quem];
      const el = this.el.querySelector('.retrato');
      if (r) {
        const extras = r.extras && r.extras.rostos || [];
        const k = extras.indexOf(rosto);
        if (k >= 0) {
          el.style.backgroundImage = `url(${r.extras.src})`;
          el.style.backgroundSize = `${extras.length * 100}% 100%`;
          el.style.backgroundPosition = `${extras.length > 1 ? k / (extras.length - 1) * 100 : 0}% 0%`;
        } else {
          const i = Math.max(0, ROSTOS.indexOf(PARECIDO[rosto] || rosto));
          el.style.backgroundImage = `url(${r.src})`;
          el.style.backgroundSize = '';
          el.style.backgroundPosition = `${(i % 3) * 50}% ${Math.floor(i / 3) * 100}%`;
        }
      }
      this.el.className = 'visivel ' + (classe || '') + (r ? ' com-retrato' : '');
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

      // `rosto`: neutro, sorriso, riso, surpresa, apaixonada, maroto, bravo, chorando ou envergonhada.
      fala(nome, texto, rosto) {
        let ok = false;
        dialogo.mostrar(nome, texto, nome === 'Bell' ? 'bell' : nome === 'Line' ? 'line' : 'sistema', rosto || 'sorriso');
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

      // Espera a animação das duas juntas (duo) chegar ao fim, seja qual for a duração dela.
      animacaoDuo() {
        return { pronto: () => !jogo.duo || jogo.duo.anim.estado(jogo.duo.dir, 1).acabou, pular: () => {} };
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

  // O que a Line diz ao achar cada documento (depois de ler).
  const REACOES = {
    diarioCora: () => ['Ele cansa depois de bater três vezes... e a flor do peito abre. Coitado, deve doer mesmo.', 'neutro'],
    cancaoLago: () => ['Bell, olha: uma canção de ninar pra Serpente. Você canta isso?', 'sorriso'],
    penaGrifo: () => ['A letra é da Bell! “Aí é com ela”... Pode deixar, amor.', 'apaixonada'],
    pegadas: () => ['Aguenta firme, Bell.', 'bravo'],
    cartaz: () => ['Então não fui só eu que vi... O vilarejo inteiro tá assustado.', 'neutro'],
    carta: () => ['O Mago sabia de tudo isso... e mesmo assim me deu uma espada. Ele acredita em mim.', 'surpresa'],
    cacador: () => ['Uma moça de óculos gritando um nome... Era o meu. Ela tava me chamando.', 'chorando'],
    lenda: () => ['Fome de luz... o coração mais brilhante. Claro que ele levou a Bell.', 'apaixonada'],
    mapa: () => ['Com esse pedaço de mapa, agora eu sei onde fica o covil. E tem uma caverna escondida na montanha!', 'surpresa'],
    minerador: () => ['A alavanca do carrinho tá na Forja Antiga... Se eu achar, dá pra cortar caminho pelos trilhos.', 'maroto'],
    diario1: () => ['Os cristais são as chaves... Por isso as barreiras brilham igualzinho a eles.', 'neutro'],
    diario2: () => ['A Chuva de Estrelas tá no peito do Guardião. Vou ter que vencer ele.', 'bravo'],
    receita: (j) => [(j.flags.conversas || []).includes('bento') ? 'Mestre Aurélio... o Seu Bento aprendeu com ele! Preciso mostrar isso pra ele no vilarejo.' : 'Um aprendiz chamado Bento, no vilarejo... tomara que ele ainda more lá.', 'surpresa'],
    escama: () => ['Fria. Um dragão de fogo com escama fria... Igual ao sonho da Bell.', 'surpresa'],
    fita: () => ['Bell... Ela deixou cair de propósito. Eu sei que deixou. Tô chegando, amor.', 'chorando'],
  };

  // ---------- História ----------
  const HISTORIA = {
    // Manhã na fazenda: acorda, conversa com a Bell e recebe as tarefas do dia.
    *manha(c, j) {
      const line = j.line, bell = j.bell;
      const porta = { x: line.x, y: line.y };
      j.fade = 1;
      line.visivel = false;
      bell.dir = 'FRONT'; bell.anim.tocar('BELL_IDLE', true);
      j.cameraEm(line.x + 20, line.y);
      yield c.escurecer(0, 1.4);
      yield c.titulo('Line & Bell', 'Capítulo 1 — Nossa vidinha', 2.6);
      const galo = j.bichos.find((b) => b.tipo === 'galinha');
      if (galo) j.balao(galo, 'Cocoricóóó!', 2.2);
      yield c.espera(1.4);
      line.visivel = true; line.y = porta.y - 12; line.dir = 'FRONT';
      yield c.andar(line, porta.x / LB.TILE, (porta.y + 18) / LB.TILE, { vel: 60, anim: 'LINE_WALK', parar: 'LINE_IDLE' });
      line.dir = 'RIGHT'; line.lado = 1; line.anim.tocar('LINE_IDLE', true);
      bell.dir = 'LEFT'; bell.lado = -1; bell.anim.tocar('BELL_IDLE', true);
      yield c.fala('Bell', 'Bom dia, dorminhoca! O galo já cantou três vezes.', 'riso');
      yield c.fala('Line', 'Bom dia, amor... só mais cinco minutinhos?', 'maroto');
      bell.anim.tocar('BELL_IDLE', true);
      yield c.fala('Bell', 'Sonhei uma coisa tão estranha essa noite... um dragão enorme, vermelho, tremendo de frio.', 'surpresa');
      yield c.fala('Line', 'Dragão com frio? Isso é fome de café, amor.', 'riso');
      bell.anim.tocar('BELL_LAUGH', true);
      yield c.fala('Bell', 'Boba! Agora levanta: tem ovo pra pegar, horta pra regar e o Theo tá morrendo de fome.', 'sorriso');
      const cao = j.bichos.find((b) => b.tipo === 'cachorro');
      if (cao) j.balao(cao, 'Au! Au!', 1.6);
      yield c.espera(0.8);
      line.dir = 'FRONT'; line.anim.tocar('LINE_LAUGH', true);
      yield c.fala('Line', 'Tá bom, tá bom. Bora, fazendeira.', 'riso');
      bell.dir = 'FRONT'; bell.anim.tocar('BELL_CURTSY', true);
      yield c.fala('Bell', 'E faz carinho nos bichinhos, que eles ficam com ciúme de mim.', 'apaixonada');
      bell.anim.tocar('BELL_IDLE', true);
      j.flags.manhaVista = true;
      bell.seguir = true;
      j.salvar();
      j.atualizarPainel(true);
      j.dica('fazenda', LB.entrada.usandoToque()
        ? 'Arraste o dedo à esquerda para andar. Chegue perto das coisas e toque no botão que aparecer. As tarefas ficam no canto.'
        : 'WASD ou setas para andar, Shift para correr, E para interagir. As tarefas ficam no canto da tela.');
    },

    *almoco(c, j) {
      const line = j.line, bell = j.bell;
      bell.seguir = false;
      bell.anim.tocar('BELL_LAUGH', true);
      const meio = { x: line.x + 11, y: line.y };
      if (c.duo('LINE_BELL_CELEBRATE', meio.x, meio.y)) {
        yield c.espera(0.9);
        j.particulas.emitir('faisca', meio.x, meio.y - 62, 10, { vel: 90, vz: 60, vida: 0.5 });
        yield c.animacaoDuo();
      }
      yield c.fala('Bell', 'Missão cumprida, fazendeira! Bora almoçar?', 'riso');
      yield c.escurecer(1, 0.8);
      c.fimDuo();
      const mesa = j.pontoMapa('mesa');
      j.mesaOculta = c.duo('LINE_BELL_EAT', mesa.x, mesa.y + 8);
      if (!j.mesaOculta) { line.x = mesa.x - 24; line.y = mesa.y + 20; bell.x = mesa.x + 24; bell.y = mesa.y + 20; }
      j.cameraEm(mesa.x, mesa.y - 30);
      j.camAlvo = { x: mesa.x, y: mesa.y - 30 };
      yield c.escurecer(0, 0.8);
      yield c.espera(1.6);
      yield c.fala('Bell', 'Não é BK... mas tá uma delícia.', 'riso');
      yield c.fala('Line', 'Tudo fica mais gostoso com você do lado.', 'apaixonada');
      yield c.fala('Bell', 'Para, boba!', 'envergonhada');
      yield c.espera(1.2);
      yield c.fala('Line', 'Depois do almoço... bora ver o pôr do sol lá no lago?', 'sorriso');
      yield c.fala('Bell', 'Só se for de mãos dadas.', 'apaixonada');
      yield c.escurecer(1, 0.9);
      c.fimDuo(); j.mesaOculta = false;
      line.x = mesa.x; line.y = mesa.y + 34; line.dir = 'FRONT';
      bell.x = line.x; bell.y = line.y;
      j.comecarTarde();
      j.salvar();
      yield c.escurecer(0, 0.9);
    },

    // Pôr do sol no lago, o beijo... e o dragão.
    *porDoSol(c, j) {
      const line = j.line, bell = j.bell, lago = j.pontoMapa('lago');
      line.modoDuo = false;
      line.x = lago.x; line.y = lago.y; line.dir = 'LEFT'; line.lado = -1;
      bell.x = lago.x + 22; bell.y = lago.y; bell.dir = 'LEFT'; bell.lado = -1; bell.visivel = true;
      const cx = lago.x + 11;
      c.duo('LINE_BELL_HOLD_HANDS', cx, lago.y);
      j.camAlvo = { x: cx - 40, y: lago.y - 36 };
      $('#tarefas').classList.add('oculto');
      yield c.tingir('255,130,60', 0.26, 2.5);
      yield c.fala('Bell', 'O pôr do sol daqui é o meu favorito. Promete que amanhã a gente volta?', 'apaixonada');
      yield c.fala('Line', 'Prometo. Amanhã, depois de amanhã... todo dia que você quiser.', 'apaixonada');
      c.fimDuo();
      if (c.duo('LINE_BELL_DANCE', cx, lago.y)) {
        yield c.espera(3);
        c.fimDuo();
      }
      if (c.duo('LINE_BELL_KISS', cx, lago.y)) yield c.animacaoDuo();
      j.particulas.emitir('coracao', cx, lago.y - 70, 7, { vel: 30, vida: 1.8 });
      LB.fx.emitir(j, 'FX_HEARTS', cx, lago.y - 78, { sobe: 14 });
      c.fimDuo(); c.duo('LINE_BELL_HOLD_HANDS', cx, lago.y);
      yield c.fala('Bell', 'Boba...', 'riso');
      yield c.espera(0.7);

      j.tremer(3, 1.6);
      yield c.tingir('40,30,60', 0.42, 1.4);
      c.fimDuo();
      line.dir = 'BACK'; line.anim.tocar('LINE_IDLE', true);
      bell.dir = 'BACK'; bell.anim.tocar('BELL_SCARED', true);
      for (const b of j.bichos) b.assustado = true;
      const cao = j.bichos.find((b) => b.tipo === 'cachorro');
      if (cao) j.balao(cao, 'AU! AU! AU!', 2);
      yield c.fala('Bell', 'Line... que barulho foi esse?', 'surpresa');

      const dr = j.criarDragaoCena(bell.x + 10, bell.y - 300, 280);
      dr.anim.tocar('DRAGON_FLY', true); dr.lado = -1;
      yield c.voar(dr, bell.x, bell.y - 60, 110, 1.5);
      yield c.fala('Bell', 'É ele... o dragão do meu sonho...', 'surpresa');
      line.anim.tocar('LINE_SCARED', true);
      yield c.fala('Line', 'BELL! CORRE!', 'surpresa');
      dr.anim.tocar('DRAGON_AIR_ATTACK', true);
      yield c.voar(dr, bell.x, bell.y - 4, 30, 0.45);
      bell.anim.tocar('BELL_CAPTURED', true);
      j.tremer(7, 0.4);
      j.particulas.emitir('poeira', bell.x, bell.y, 16, { vel: 120, vida: 0.7, r: 5 });
      yield c.espera(0.5);
      j.prender(bell, dr);
      // A arte BELL_DRAGON_CARRIED já traz um dragão (o antigo) segurando a Bell: com o dragão da
      // cena ficavam dois. Pendurada nas garras, ela se debate (sem dragão desenhado junto).
      bell.anim.tocar('BELL_ESCAPE_ATTEMPT', true);
      dr.anim.tocar('DRAGON_TAKEOFF', true);
      yield c.voar(dr, bell.x, bell.y - 30, 190, 0.9);
      yield c.fala('Bell', 'LIIINE!', 'surpresa');
      dr.anim.tocar('DRAGON_FLY', true);
      c.junto(c.voar(dr, T(22.5), T(-6), 300, 2.6));
      c.junto(c.andar(line, 22.5, 20, { vel: 168, anim: 'LINE_RUN', parar: 'LINE_RUN_STOP' }));
      yield c.espera(1.8);
      line.anim.tocar('LINE_CALL_BELL', true);
      yield c.fala('Line', 'BELL!!!', 'surpresa');
      yield c.espera(0.8);
      j.soltar(); bell.visivel = false; j.removerDragaoCena();
      for (const b of j.bichos) b.assustado = false;

      yield c.tingir('90,60,130', 0.26, 1.5);
      j.ambiente.anoitecer();
      line.dir = 'FRONT'; line.anim.tocar('LINE_CRY', true);
      LB.fx.emitir(j, 'FX_TEARS', line.x, line.y - 44, { loop: true, dur: 3.2 });
      yield c.espera(1);
      if (cao) { cao.seguir = true; cao.comeu = true; cao.x = line.x + 40; cao.y = line.y + 20; j.balao(cao, 'Auuu...', 2); }
      yield c.espera(1);
      yield c.fala('Line', 'Ele voou pra montanha, do outro lado da floresta...', 'chorando');
      line.anim.tocar('LINE_DETERMINED', true);
      yield c.fala('Line', 'Theo, cuida da fazenda pra mim. Eu vou buscar a Bell.', 'bravo');
      j.bell = null;
      j.flags.prologo = true;
      j.flags.etapa = null;
      LB.relogio.comecarAventura(j);
      j.salvar();
      j.dica('mover', LB.entrada.usandoToque()
        ? 'Siga pelo caminho ao norte, até a floresta.'
        : 'Siga pelo caminho ao norte, até a floresta. (Shift para correr)');
    },

    *floresta(c, j) {
      yield c.espera(0.4);
      yield c.titulo('Capítulo 2', 'Atrás da Bell', 2.4);
      yield c.fala('Line', 'A Floresta Sussurrante... O dragão foi pra montanha, do outro lado.', 'neutro');
      yield c.fala('Line', 'Tem uma luz azul ali na clareira, a oeste. Será que mora alguém aqui?', 'surpresa');
      j.flags.florestaVista = true;
    },

    *mago(c, j) {
      if (!j.flags.espada && !j.flags.magoVisto) {
        yield c.fala('Mago', 'Ora, ora... uma fazendeira na Floresta Sussurrante?');
        yield c.fala('Line', 'Um dragão levou a Bell! Eu preciso chegar na montanha.', 'surpresa');
        yield c.fala('Mago', 'O dragão vermelho acordou, então... Fazia cem anos que ele dormia.');
        yield c.fala('Mago', 'Dizem que o fogo dele esfria enquanto dorme. Ele acorda com frio, procurando o calor de um coração brilhante.');
        yield c.fala('Line', 'A Bell sonhou com isso ontem à noite... um dragão tremendo de frio.', 'surpresa');
        yield c.fala('Mago', 'Os sonhos das pessoas boas às vezes escutam o que ninguém mais escuta.');
        const mg = j.npcs.find((n) => n instanceof LB.Mago);
        if (mg) mg.magia = 1.8;
        yield c.fala('Mago', 'Naquele baú aqui do lado guardei uma espada que espera por um coração corajoso. Ela é sua.');
        yield c.fala('Mago', 'E lembre-se: quando o dragão se cansa, o peito dele brilha. É ali que você deve acertar.');
        yield c.fala('Line', 'Obrigada! Eu vou trazer ela de volta.', 'sorriso');
        j.flags.magoVisto = true;
        j.salvar();
      } else if (!j.flags.espada) {
        yield c.fala('Mago', 'O baú, menina! A espada está no baú.');
      } else {
        if (!j.flags.magoRuinas) {
          yield c.fala('Mago', 'Espere! Tem mais uma coisa. O dragão selou o caminho da montanha com magia antiga.');
          yield c.fala('Mago', 'Depois dos espinhos ficam as Ruínas Encantadas. No altar da luz, a sua espada pode aprender a brilhar.');
          yield c.fala('Line', 'Magia? Eu? Eu só sei plantar cenoura...', 'surpresa');
          yield c.fala('Mago', 'Quem atravessa uma floresta por amor já tem o que a magia pede. Vá!');
          yield c.fala('Mago', 'Ah, e na gruta a leste desta floresta deixei umas coisinhas úteis. Uma bússola, quem sabe... Aperte I para ver a mochila e M para o mapa.');
          yield c.fala('Mago', 'Precisando de poções, o Vilarejo do Riacho fica ao sul daqui. A Dona Rosa tem mão aberta e o Seu Bento, mão pesada. Bom ferreiro.');
          j.flags.magoRuinas = true;
          j.salvar();
          return;
        }
        const falas = !j.flags.magia ? [
          'Os espinhos ao norte não resistem a uma boa lâmina.',
          'As barreiras das ruínas só se desfazem com luz. Procure o altar na sala a oeste.',
          'Pule o riacho, corte os espinhos, ache o altar. Simples, não?',
          'Baús trancados? Não. Portas trancadas! Três, pelo mundo. E três chaves antigas escondidas em baús.',
          'O Tobias, caçador, mora na cabana a leste. Se alguém viu o dragão passar, foi ele.',
          'Cada documento que você guarda conta um pedaço da história. Junte dois que combinam e você entende mais do que imagina.',
        ] : !j.flags.golem ? [
          'Cristais apagados, barreiras de pé. Acenda todos e o caminho se abre.',
          'O Guardião de Pedra não sente a espada... mas a luz, ah, a luz ele sente.',
          'Sua magia volta sozinha, devagarinho. Não gaste tudo de uma vez!',
        ] : [
          'Três tochas guardam o portão da montanha. Acenda as três.',
          'Segure a magia até brilhar e solte: chuva de estrelas! Eu mesmo não faria melhor.',
          'O peito do dragão, lembre-se: quando ele cansar, o peito brilha.',
          'Luz não se rouba, menina. Se divide. Guarde isso: um dia vai fazer sentido.',
          'Quando ele encher o peito de ar, saia da frente. Fogo de dragão não se segura com espada.',
        ];
        yield c.fala('Mago', falas[Math.floor(Math.random() * falas.length)]);
      }
    },

    *espinhos(c, j) {
      yield c.fala('Line', 'Espinhos demais pra passar... Preciso de algo afiado para abrir caminho.', 'neutro');
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
      yield c.fala('Line', 'Uma espada! Com isso eu consigo cortar os espinhos no caminho do norte.', 'riso');
      yield c.fala('', LB.entrada.usandoToque()
        ? 'ATACAR: golpe (aperte 3x para combo; segure para o giro em volta) · ESQUIVA: desvia (correndo vira dash) · DEFESA: segure para bloquear · PULAR + ATACAR: ataque aéreo'
        : 'J ou Z: atacar (3x = combo) · K ou X: giro · L ou C: esquivar (correndo = dash) · V ou B: defender (segure) · Espaço e depois J: ataque aéreo');
      j.flags.espada = true;
      j.salvar();
      yield* HISTORIA.interludio(c, j, 1);
      j.criarInimigos();
      line.dir = 'FRONT'; line.anim.tocar('LINE_COMBAT_IDLE', true);
      yield c.espera(0.6);
      yield c.fala('Line', 'Sombras?! Só podem ser coisa do dragão... Vem!', 'surpresa');
    },

    *ruinas(c, j) {
      yield c.espera(0.4);
      yield c.titulo('Capítulo 3', 'A luz das ruínas', 2.4);
      yield c.fala('Line', 'Ruínas... e essas pedras brilhando? Parece que o lugar tá respirando.', 'surpresa');
      yield c.fala('Line', 'Paredes de luz fechando o caminho... O mago falou de um altar na sala a oeste.', 'neutro');
      j.flags.ruinasVistas = true;
      j.salvar();
    },

    *altar(c, j, p) {
      const line = j.line;
      line.dir = 'BACK';
      line.anim.tocar('LINE_IDLE', true);
      yield c.fala('???', 'Coração corajoso... vieste de longe.');
      yield c.fala('Line', 'Quem tá falando?!', 'surpresa');
      // O Espírito surge em cima do altar e fala com a Line.
      const esp = new LB.Espirito(p.x, p.y + 4, 30);
      if (LB.sprite('SPIRIT_IDLE')) { j.npcs.push(esp); yield c.espera(1.2); }
      esp.fala = 99;
      yield c.fala('Espírito das Ruínas', 'Sou a luz que dorme nesta pedra. Estende a tua espada.');
      line.anim.tocar('LINE_SWORD_DRAW', true);
      yield c.animacao(line);
      line.armada = true;
      for (let i = 0; i < 4; i++) { j.particulas.emitir('brilho', p.x, p.y - 46, 10, { vel: 110, vida: 0.7, r: 6 }); yield c.espera(0.25); }
      j.flashTela = 0.6; j.tremer(4, 0.4);
      j.flags.magia = true;
      line.temMagia = true; line.mana = line.manaMax;
      line.anim.tocar('LINE_HAPPY', true);
      yield c.titulo('Magia aprendida!', 'Raio de Luz', 2.2);
      yield c.fala('Espírito das Ruínas', 'A luz agora corre na tua lâmina. Acende os cristais apagados e as barreiras cairão.');
      yield c.fala('Espírito das Ruínas', 'E lembra: a luz que se divide nunca acaba. A que se prende, apaga.');
      esp.fala = 0;
      j.particulas.emitir('brilho', esp.x, esp.y - 50, 16, { vel: 70, vida: 0.8, r: 5 });
      j.npcs = j.npcs.filter((n) => n !== esp);
      yield c.fala('', LB.entrada.usandoToque()
        ? '✨ MAGIA: lança um Raio de Luz na direção que a Line olha (ou no inimigo/cristal mais perto). Gasta 1 ◆ de magia, que volta sozinha. Sombras odeiam a luz!'
        : 'Q ou U: Raio de Luz (mira no inimigo ou cristal mais perto). Gasta 1 ◆ de magia, que volta sozinha. Sombras odeiam a luz!');
      j.salvar();
      yield* HISTORIA.interludio(c, j, 2);
      j.criarInimigos();
      if (!j.flags.golem) { const gm = j.mapa.def.golem; if (!j.inimigos.some((e) => e.golem)) j.inimigos.push(new LB.Golem(T(gm.x), T(gm.y))); }
      line.dir = 'FRONT'; line.anim.tocar('LINE_COMBAT_IDLE', true);
      yield c.espera(0.5);
      yield c.fala('Line', 'Ih... as ruínas acordaram junto. Bora, espada brilhante!', 'maroto');
    },

    *golem(c, j, gm) {
      const line = j.line;
      line.anim.tocar('LINE_IDLE', true);
      yield c.camera(gm.x, gm.y - 40, 1);
      j.tremer(5, 1.2);
      j.particulas.emitir('pedra', gm.x, gm.y - 30, 14, { vel: 90, vz: 150, vida: 1 });
      yield c.espera(0.8);
      gm.dormindo = false; gm.estado = 'cena';
      yield c.fala('Guardião de Pedra', 'Quem... acorda... o guardião...?');
      yield c.fala('Line', 'Desculpa o barulho! Eu só preciso passar. O dragão levou a Bell!', 'surpresa');
      yield c.fala('Guardião de Pedra', 'Ninguém... passa. Só a luz... atravessa... a pedra.');
      line.anim.tocar('LINE_DETERMINED', true);
      yield c.fala('Line', 'Então vai ser na luz mesmo.', 'bravo');
      j.dica('golem', 'Acerte o cristal do peito com a magia (Q) para abrir a guarda. Pule a onda do pisão!');
      gm.acordar();
    },

    *golemVencido(c, j, gm) {
      const line = j.line;
      yield c.espera(0.6);
      j.particulas.emitir('brilho', gm.x, gm.y - 40, 24, { vel: 120, vida: 1, r: 7 });
      yield c.fala('Guardião de Pedra', 'A luz... é tua... Que ela... te guie... até o céu...');
      yield c.fala('Guardião de Pedra', 'O dragão... também já foi luz... um dia. Lembra... disso...');
      line.anim.tocar('LINE_RELIEVED', true);
      yield c.espera(0.8);
      j.flashTela = 0.6;
      j.flags.estrela = true;
      line.temEstrela = true; line.mana = line.manaMax;
      yield c.titulo('Nova magia!', 'Chuva de Estrelas', 2.2);
      yield c.fala('', LB.entrada.usandoToque()
        ? 'Segure ✨ até a Line brilhar e solte: estrelas explodem em volta, atingindo tudo por perto. Gasta 3 ◆.'
        : 'Segure Q (ou U) até a Line brilhar e solte: estrelas explodem em volta, atingindo tudo por perto. Gasta 3 ◆.');
      line.anim.tocar('LINE_HAPPY', true);
      yield c.fala('Line', 'O caminho pro norte abriu! Espera só, Bell.', 'riso');
      j.salvar();
      yield* HISTORIA.interludio(c, j, 3);
    },

    *montanha(c, j) {
      yield c.espera(0.4);
      yield c.titulo('Capítulo 4', 'A Montanha de Brasa', 2.4);
      yield c.fala('Line', 'A Montanha de Brasa... O covil do dragão fica lá no topo.', 'neutro');
      yield c.fala('Line', 'Tô quase aí, Bell. Aguenta só mais um pouquinho.', 'apaixonada');
      yield c.fala('Line', 'Tem um portão de fogo lá em cima... e três tochas apagadas pelo caminho. Aposto que a luz acende.', 'maroto');
      const nomes = { '6,35': 'Uma aqui perto da entrada...', '30,22': '...outra numa ilha no meio da lava...', '18,9': '...e a última lá em cima, perto do portão.' };
      for (const p of j.mapa.props.filter((o) => o.tipo === 'tocha' && !o.aceso).sort((a, b) => b.ty - a.ty)) {
        yield c.camera(p.x, p.y - 30, 1.3);
        const txt = nomes[p.tx + ',' + p.ty];
        if (txt) yield c.fala('Line', txt, 'neutro');
      }
      yield c.camera(j.line.x, j.line.y - 24, 0.8);
      j.dica('tochas', LB.entrada.usandoToque() ? 'Acenda as três tochas com a magia ✨. As apagadas soltam fumaça e aparecem no mapa (🎒 → Mapa).' : 'Acenda as três tochas com a magia (Q). As apagadas soltam fumaça e aparecem no mapa (M).');
      j.flags.montanhaVista = true;
      j.salvar();
    },

    *portaoAberto(c, j) {
      yield c.camera(T(17.5), T(4), 1.2);
      yield c.espera(0.6);
      yield c.camera(j.line.x, j.line.y - 24, 0.8);
      j.line.anim.tocar('LINE_DETERMINED', true);
      yield c.fala('Line', 'O portão abriu! Aguenta firme, Bell. Tô chegando.', 'bravo');
      yield* HISTORIA.interludio(c, j, 4);
    },

    *bauCoracao(c, j, bau) {
      const line = j.line;
      line.anim.tocar('LINE_CROUCH', true);
      yield c.animacao(line);
      bau.aberto = true;
      j.flags.baus = (j.flags.baus || []).concat(j.mapa.id + ':' + bau.tx + ',' + bau.ty);
      j.flags.coracoes = (j.flags.coracoes || 0) + 1;
      j.particulas.emitir('coracao', bau.x, bau.y - 20, 8, { vel: 50, vida: 1.2 });
      yield c.espera(0.4);
      line.anim.tocar('LINE_CROUCH_STAND', true);
      yield c.animacao(line);
      line.hpMax = j.hpMaxLine(); line.hp = line.hpMax;
      line.anim.tocar('LINE_HAPPY', true);
      yield c.titulo('Coração extra!', 'A vida máxima da Line aumentou', 2);
      j.salvar();
    },

    *placa(c, j, texto) {
      yield c.fala('Placa', texto, 'sistema');
    },

    // Baú com itens e/ou pistas (todos os baús que não são a espada nem o coração).
    *bauItem(c, j, bau) {
      const line = j.line, M = LB.mochila;
      const cont = bau.conteudo || {};
      line.anim.tocar('LINE_CROUCH', true);
      yield c.animacao(line);
      bau.aberto = true;
      j.flags.baus = (j.flags.baus || []).concat(j.mapa.id + ':' + bau.tx + ',' + bau.ty);
      j.particulas.emitir('brilho', bau.x, bau.y - 20, 12, { vel: 70, vida: 0.8, r: 6 });
      yield c.espera(0.4);
      line.anim.tocar('LINE_CROUCH_STAND', true);
      yield c.animacao(line);
      const nomes = [];
      for (const [id, n] of cont.itens || []) { if (!M.ITENS[id]) continue; M.dar(j, id, n); nomes.push(`${M.ITENS[id].icone} ${M.ITENS[id].nome}${n > 1 ? ' ×' + n : ''}`); }
      if (cont.moedas) { M.darMoedas(j, cont.moedas, true); nomes.push(`🪙 ${cont.moedas} moedas`); }
      line.anim.tocar('LINE_HAPPY', true);
      if (nomes.length) yield c.titulo('Encontrou!', nomes.join(' · '), 2);
      for (const id of cont.pistas || []) yield* HISTORIA.pista(c, j, id, true);
      if ((cont.itens || []).some(([id]) => id === 'bussola')) yield c.fala('Line', 'Uma bússola! A agulha aponta pra... um baú? Deve mostrar os tesouros que ainda não achei.', 'surpresa');
      else if ((cont.itens || []).some(([id]) => id === 'chave')) yield c.fala('Line', 'Uma chave antiga. Deve abrir alguma daquelas portas trancadas.', 'maroto');
      else if ((cont.itens || []).some(([id]) => id === 'lanterna')) yield c.fala('Line', 'Uma lanterna! Agora as galerias escuras das minas não me assustam.', 'sorriso');
      else if ((cont.itens || []).some(([id]) => id === 'gancho')) yield c.fala('Line', 'Um gancho com corda! Com ele dá pra atravessar de um poste até outro, por cima da água.', 'surpresa');
      else if ((cont.itens || []).some(([id]) => id === 'alavanca')) {
        yield c.fala('Line', 'Uma alavanca de ferro, pesada... Tem um carrinho desenhado no cabo.', 'surpresa');
        yield c.fala('Line', 'É a alavanca do freio do carrinho de mina! Se eu encaixar numa estação, ele volta a andar.', 'sorriso');
      } else if ((cont.itens || []).some(([id]) => id === 'pena')) yield c.fala('Line', 'Uma Pena de Fênix... Se eu cair, ela me levanta. Ufa.', 'apaixonada');
      else if ((cont.itens || []).some(([id]) => id === 'bomba') && !j.flags.dicaBomba) { j.flags.dicaBomba = true; yield c.fala('Line', 'Bombas! Com elas eu quebro aquelas paredes rachadas. Ficam no atalho: é só apertar F (ou o botão do item).', 'maroto'); }
      j.salvar();
    },

    // Pista encontrada (documento do caderno de investigação).
    *pista(c, j, id, semCrouch) {
      const line = j.line, M = LB.mochila, p = M.PISTAS[id];
      if (!semCrouch) { line.anim.tocar('LINE_CROUCH', true); yield c.animacao(line); line.anim.tocar('LINE_CROUCH_STAND', true); yield c.animacao(line); }
      const nova = M.darPista(j, id);
      line.anim.tocar('LINE_IDLE', true);
      yield c.titulo('Pista encontrada!', `${p.icone} ${p.titulo}`, 2);
      for (const par of p.texto.split('\n\n')) yield c.fala(p.titulo, par, 'sistema');
      if (nova && REACOES[id]) { const [txt, rosto] = REACOES[id](j); yield c.fala('Line', txt, rosto); }
      const n = M.inv(j).pistas.length;
      const novas = nova ? M.verificarConclusoes(j) : [];
      for (const cc of novas) {
        yield c.titulo('💡 Conclusão!', cc.texto, 2.4);
        if (cc.fala) yield c.fala('Line', cc.fala, 'surpresa');
      }
      if (nova && n >= M.totalPistas() && !j.flags.cadernoCompleto) {
        j.flags.cadernoCompleto = true;
        j.flags.coracoes = (j.flags.coracoes || 0) + 1;
        line.hpMax = j.hpMaxLine(); line.hp = line.hpMax;
        j.particulas.emitir('coracao', line.x, line.y - 50, 10, { vel: 50, vida: 1.4 });
        line.anim.tocar('LINE_HAPPY', true);
        yield c.titulo('Caderno completo!', 'A Line entendeu tudo: coração extra', 2.6);
        yield c.fala('Line', 'Agora eu sei tudo sobre esse dragão. Segura, Bell, que eu tô indo.', 'bravo');
      } else if (nova && !novas.length) yield c.fala('Line', `Vou guardar isso no caderno. ${n} de ${M.totalPistas()} documentos.`, 'neutro');
      j.salvar();
    },

    // Ponto de exame (marcas, rastros): a Line olha de perto e anota a pista.
    *exame(c, j, e) {
      const line = j.line;
      j.flags.exames = (j.flags.exames || []).concat(e.id);
      line.anim.tocar('LINE_CROUCH', true);
      yield c.animacao(line);
      yield c.espera(0.5);
      line.anim.tocar('LINE_CROUCH_STAND', true);
      yield c.animacao(line);
      yield* HISTORIA.pista(c, j, e.doc, true);
    },

    // Poste de gancho sem o gancho.
    *semGancho(c, j) {
      yield c.fala('Line', 'Um poste com uma argola de ferro... e outro igual do outro lado. Com um gancho e corda eu passaria.', 'neutro');
    },

    // Conversa com morador do vilarejo; os lojistas abrem a loja no fim.
    *morador(c, j, m) {
      const line = j.line;
      line.dir = LB.dirDe(m.x - line.x, m.y - line.y, line.dir);
      if (m.x !== line.x) line.lado = m.x < line.x ? -1 : 1;
      const falas = LB.loja.falasDe(j, m);
      for (const [quem, texto, humor] of falas) yield c.fala(quem, texto, quem === 'Line' ? humor || 'neutro' : undefined);
      j.flags.conversas = j.flags.conversas || [];
      if (!j.flags.conversas.includes(m.id)) j.flags.conversas.push(m.id);
      j.salvar();
      if (m.loja) { j.terminarCena(); LB.loja.tela.abrir(j, m.loja); }
    },

    // Estação do carrinho sem a alavanca (ou encaixando a alavanca).
    *carrinhoQuebrado(c, j, e) {
      const line = j.line, M = LB.mochila;
      if (!M.tem(j, 'alavanca')) {
        yield c.fala('Line', 'Um carrinho de mina nos trilhos. Falta a alavanca do freio... sem ela não sai do lugar.', 'neutro');
        if (!M.temPista(j, 'minerador')) yield c.fala('Line', 'Alguém deve saber onde foi parar essa alavanca.', 'neutro');
        else yield c.fala('Line', 'O relatório do capataz disse que a alavanca ficou na Forja Antiga, na montanha.', 'neutro');
        return;
      }
      line.anim.tocar('LINE_CROUCH', true);
      yield c.animacao(line);
      M.tirar(j, 'alavanca', 1);
      j.flags.alavanca = true;
      j.flags.estacoes = j.flags.estacoes || [];
      if (!j.flags.estacoes.includes(e.id)) j.flags.estacoes.push(e.id);
      j.particulas.emitir('faisca', LB.TILE * (e.x + 1.2), LB.TILE * (e.y + 0.6), 14, { vel: 90, vz: 70, vida: 0.5 });
      j.tremer(3, 0.3);
      yield c.espera(0.5);
      line.anim.tocar('LINE_CROUCH_STAND', true);
      yield c.animacao(line);
      line.anim.tocar('LINE_HAPPY', true);
      yield c.titulo('Carrinho consertado!', 'Agora dá para viajar entre as estações descobertas', 2.4);
      yield c.fala('Line', 'Clique! Encaixou. Agora o carrinho me leva de estação em estação.', 'sorriso');
      j.salvar();
    },

    // Porta trancada: abre com uma chave antiga.
    *porta(c, j, p) {
      const line = j.line, M = LB.mochila;
      line.dir = LB.dirDe(p.x - line.x, p.y - line.y, line.dir);
      if (M.qtd(j, 'chave') <= 0) {
        yield c.fala('Line', 'Trancada. Tem uma fechadura antiga... preciso de uma chave.', 'neutro');
        return;
      }
      M.tirar(j, 'chave', 1);
      j.particulas.emitir('faisca', p.x, p.y - 22, 10, { vel: 80, vz: 60, vida: 0.4 });
      yield c.espera(0.5);
      j.tremer(3, 0.3);
      j.mapa.trocar(p.tx, p.ty, '.');
      j.flags.portas = (j.flags.portas || []).concat(j.mapa.id + ':' + p.tx + ',' + p.ty);
      j.particulas.emitir('poeira', p.x, p.y, 12, { vel: 70, vida: 0.6, r: 4 });
      line.anim.tocar('LINE_HAPPY', true);
      yield c.fala('Line', 'Abriu! Vamos ver o que tem aí dentro.', 'maroto');
      j.salvar();
    },

    *covil(c, j) {
      const line = j.line, dr = j.dragao, bell = j.bell;
      if (j.flags.covilVisto) {
        // Tentando de novo: vai direto para a luta.
        line.x = T(13); line.y = T(14.6); line.dir = 'BACK'; line.armada = true;
        dr.visivel = true; dr.alturaVoo = 0; dr.y = T(9.2);
        j.selarEntrada();
        dr.anim.tocar('DRAGON_ROAR', true); j.tremer(6, 1);
        line.anim.tocar('LINE_DETERMINED', true);
        yield c.fala('Line', 'De novo. Dessa vez eu não caio.', 'neutro');
        j.iniciarChefe();
        return;
      }
      line.x = T(13); line.y = T(18.4); line.dir = 'BACK';
      j.cameraEm(T(13), T(15));
      yield c.titulo('Capítulo final', 'O coração do dragão', 2.4);
      yield c.andar(line, 13, 14.6, { vel: 80, anim: 'LINE_WALK', parar: 'LINE_IDLE' });
      yield c.camera(T(13), T(4.5), 1.4);
      bell.anim.tocar('BELL_CALL_LINE', true);
      yield c.fala('Bell', 'Line?! LINE! Você veio!', 'surpresa');
      yield c.fala('Line', 'Eu prometi, não prometi?', 'maroto');
      bell.anim.tocar('BELL_TRAPPED', true);
      yield c.camera(T(13), T(9), 0.6);
      dr.visivel = true;
      dr.anim.tocar('DRAGON_GLIDE', true);
      yield c.voar(dr, T(13), T(9.2), 0, 1.4);
      dr.anim.tocar('DRAGON_LAND', true);
      j.tremer(8, 0.5);
      LB.fx.emitir(j, 'FX_DUST', dr.x, dr.y - 10, { tam: 360 });
      j.particulas.emitir('poeira', dr.x, dr.y, 26, { vel: 170, vida: 0.8, r: 6 });
      j.selarEntrada();
      yield c.espera(0.8);
      dr.anim.tocar('DRAGON_ROAR', true);
      j.tremer(7, 1.3);
      yield c.espera(1.4);
      dr.anim.tocar('DRAGON_IDLE', true);
      if (!line.armada) { line.anim.tocar('LINE_SWORD_DRAW', true); yield c.animacao(line); line.armada = true; }
      yield c.fala('Dragão', 'Espada... de luz. Veio... pela minha luz.');
      line.anim.tocar('LINE_ANGRY', true);
      yield c.fala('Line', 'Ela não é SUA luz. É a minha namorada. Solta ela. AGORA.', 'bravo');
      bell.anim.tocar('BELL_SCARED', true);
      yield c.fala('Bell', 'Line! Ele tá com frio, ele não é mau... mas não vai me soltar fácil!', 'surpresa');
      yield c.fala('Bell', 'Quando ele cansa, o peito dele brilha. É ali!', 'surpresa');
      bell.anim.tocar('BELL_TRAPPED', true);
      j.flags.covilVisto = true;
      j.iniciarChefe();
    },

    // Depois da luta: a Bell pede, e a Line divide a luz com o dragão em vez de apagá-lo.
    *dividirLuz(c, j) {
      const line = j.line, bell = j.bell, dr = j.dragao;
      if (!dr) return;
      line.dir = 'BACK'; bell.dir = 'BACK';
      bell.anim.tocar('BELL_IDLE', true);
      yield c.fala('Bell', 'Line... espera. Olha pra ele.', 'neutro');
      yield c.camera(dr.x, dr.y - 60, 1);
      yield c.fala('Dragão', 'Frio... tanto... frio...');
      yield c.fala('Line', 'Ele tá... tremendo?', 'surpresa');
      yield c.fala('Bell', 'O fogo dele tá apagando. Por isso ele leva alguém a cada cem anos: acha que dá pra roubar a luz de um coração.', 'neutro');
      if (LB.mochila.temPista(j, 'escama')) yield c.fala('Line', 'A escama fria... O Guardião disse que ele também já foi luz.', 'surpresa');
      else yield c.fala('Line', 'O Guardião disse que ele também já foi luz, um dia...', 'surpresa');
      line.anim.tocar('LINE_DETERMINED', true);
      yield c.fala('Line', 'Luz não se rouba. Se divide.', 'apaixonada');
      yield c.andar(line, (dr.x - 70) / LB.TILE, (dr.y + 40) / LB.TILE, { vel: 70, anim: 'LINE_WALK', parar: 'LINE_IDLE' });
      line.dir = 'RIGHT'; line.lado = 1;
      line.anim.tocar('LINE_CAST_CHARGE', true);
      for (let i = 0; i < 6; i++) { j.particulas.emitir('brilho', line.x, line.y - 50, 4, { vel: 60, vida: 0.6, r: 4 }); yield c.espera(0.2); }
      line.anim.tocar('LINE_CAST_STARS', true);
      j.flashTela = 0.5;
      for (let i = 0; i < 8; i++) {
        j.particulas.emitir('brilho', dr.x + (Math.random() - 0.5) * 140, dr.y - 120 - Math.random() * 60, 3, { vel: 40, vz: -30, vida: 1, r: 5 });
        yield c.espera(0.15);
      }
      j.particulas.emitir('fogo', dr.x + 30, dr.y - 70, 22, { vel: 50, vida: 1, r: 6 });
      dr.anim.tocar('DRAGON_BLINK', true);
      yield c.espera(0.8);
      yield c.fala('Dragão', 'Quente... Faz cem anos... que não fica quente.');
      yield c.fala('Dragão', 'Obrigado... pequena luz. Agora eu... durmo em paz. Sem levar... ninguém.');
      dr.anim.tocar('DRAGON_SLEEP', true);
      bell.anim.tocar('BELL_HAPPY', true);
      yield c.fala('Bell', 'Boa noite, dragão.', 'sorriso');
      line.anim.tocar('LINE_IDLE', true);
      yield c.andar(bell, (line.x + 22) / LB.TILE, line.y / LB.TILE, { vel: 110, anim: 'BELL_WALK', parar: 'BELL_IDLE' });
      bell.dir = 'LEFT'; bell.lado = -1; line.dir = 'RIGHT'; line.lado = 1;
      yield c.camera(line.x + 11, line.y - 30, 0.8);
      yield c.fala('Bell', 'Eu sabia que você ia entender. Você brilha mais do que eu falei pra ele.', 'apaixonada');
      j.flags.dragaoEmPaz = true;
    },

    *vitoria(c, j) {
      const line = j.line, bell = j.bell;
      yield c.espera(1.8);
      line.dir = 'FRONT';
      line.anim.tocar('LINE_SWORD_SHEATHE', true);
      yield c.animacao(line);
      line.armada = false;
      if (LB.sprite('LINE_VICTORY')) {
        line.anim.tocar('LINE_VICTORY', true);
        j.particulas.emitir('faisca', line.x, line.y - 70, 12, { vel: 110, vz: 80, vida: 0.6 });
        yield c.animacao(line);
      }
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
      LB.fx.emitir(j, 'FX_HEARTS', (line.x + bell.x) / 2, line.y - 72, { sobe: 14 });
      yield c.espera(1.2);
      yield c.fala('Bell', 'Eu sabia que você vinha. Eu sabia!', 'riso');
      line.anim.tocar('LINE_RELIEVED', true);
      yield c.fala('Line', 'Você tá bem? Ele te machucou?', 'surpresa');
      bell.anim.tocar('BELL_RELIEVED', true);
      yield c.fala('Bell', 'Agora que você tá aqui, eu tô ótima.', 'apaixonada');
      if (abraco) { c.fimDuo(); c.duo('LINE_BELL_HUG_RELEASE', (line.x + bell.x) / 2, line.y); yield c.animacaoDuo(); c.fimDuo(); }
      yield* HISTORIA.dividirLuz(c, j);
      line.anim.tocar('LINE_LAUGH', true);
      yield c.fala('Line', 'Então... será que ainda dá tempo de ver o pôr do sol?', 'maroto');
      bell.anim.tocar('BELL_HAPPY', true);
      yield c.fala('Bell', 'Só se for de mãos dadas. Sempre.', 'apaixonada');
      j.particulas.emitir('coracao', (line.x + bell.x) / 2, line.y - 60, 6, { vel: 30, vida: 1.6 });
      yield c.espera(1);
      yield c.escurecer(1, 1.6);

      // Epílogo: de volta à fazenda, no pôr do sol do lago.
      j.epilogo();
      yield c.escurecer(0, 1.8);
      yield c.espera(1.2);
      const cao = j.bichos.find((b) => b.tipo === 'cachorro');
      if (cao) j.balao(cao, 'Au! Au!', 1.6);
      yield c.fala('Bell', 'O Theo cuidou direitinho da fazenda, viu?', 'riso');
      yield c.fala('Bell', 'Promete que amanhã a gente volta aqui?', 'apaixonada');
      yield c.fala('Line', 'Prometo. Amanhã, depois de amanhã...', 'apaixonada');
      yield c.fala('Bell', '...todo dia que a gente quiser.', 'riso');
      const par = j.duo;
      if (c.duo('LINE_BELL_DANCE', par.x, par.y)) { yield c.espera(3.2); j.duo = par; }
      j.particulas.emitir('coracao', (j.line.x + j.bell.x) / 2, j.line.y - 60, 5, { vel: 25, vida: 2 });
      LB.fx.emitir(j, 'FX_HEARTS', (j.line.x + j.bell.x) / 2, j.line.y - 74, { sobe: 12, dur: 2 });
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
  LB.REACOES = REACOES;
})(window.LB);
