'use strict';

// Vilarejo do Riacho: moradores, a loja da Dona Rosa, a ferraria do Seu Bento e as armaduras.
(function (LB) {
  const TAU = Math.PI * 2;
  const T = (n) => n * LB.TILE;
  const $ = (s) => document.querySelector(s);
  const M = () => LB.mochila;

  // ---------------- Armaduras ----------------
  // Cada escudo (🛡) segura meio coração de dano e volta sozinho depois de um tempo sem apanhar.
  const ARMADURAS = {
    tunica: { nome: 'Túnica Acolchoada', icone: '🥋', escudos: 1, preco: 40, desc: '1 escudo. Leve e barata: segura um golpe antes de doer.' },
    malha: { nome: 'Cota de Malha', icone: '⛓️', escudos: 2, preco: 90, desc: '2 escudos. Anéis de ferro trançados pelo Seu Bento.' },
    brasa: { nome: 'Armadura de Brasa', icone: '🔥', escudos: 3, preco: 160, brasa: true, desc: '3 escudos, e a Line atravessa o chão em brasa sem se queimar. Feita com a receita do Mestre Aurélio.' },
    // Parte 2: armaduras da Bell (mais leves; a última protege dos quatro elementos).
    vestido: { nome: 'Vestido Reforçado', icone: '👗', escudos: 1, preco: 60, bell: true, desc: 'Da Bell. 1 escudo. Tecido duplo com fios de prata, costurado pela Dona Rosa.' },
    estelar: { nome: 'Manto Estelar', icone: '🌟', escudos: 2, preco: 130, bell: true, desc: 'Da Bell. 2 escudos. Pontilhado de estrelas que brilham quando ela canta.' },
    aurora: { nome: 'Armadura da Aurora', icone: '🌈', escudos: 3, preco: 220, bell: true, brasa: true, desc: 'Da Bell. 3 escudos, e atravessa brasa e lama sem perder o passo. Feita com as escamas que os guardiões dão.' },
  };
  const RECARGA_ESCUDO = 6, ESPERA_ESCUDO = 5;
  // Prefixo da arte de cada armadura (LINE_MALHA_WALK, BELL_AURORA_IDLE...).
  const ROUPA = { tunica: 'TUNICA', malha: 'MALHA', brasa: 'BRASA', vestido: 'VESTIDO', estelar: 'ESTELAR', aurora: 'AURORA' };

  function daBell(j) { return !!(LB.herois && LB.herois.ativa(j) === 'bell'); }
  function armadura(j) { return ARMADURAS[daBell(j) ? j.flags.armaduraBell : j.flags.armadura] || null; }
  function escudosMax(j) { const a = armadura(j); return a ? a.escudos : 0; }
  function imuneBrasa(j) { const a = armadura(j); return !!(a && a.brasa); }

  // Aplica a armadura na Line (ao entrar numa área, comprar ou beber da fonte).
  function vestir(j, cheio) {
    const l = j.line;
    if (!l) return;
    const max = escudosMax(j);
    l.escudosMax = max;
    const a = armadura(j);
    l.semLama = !!(a && a.bell && a.brasa);
    l.anim.roupa = a ? ROUPA[j.flags[a.bell ? 'armaduraBell' : 'armadura']] : null;
    l.escudos = cheio ? max : Math.min(max, l.escudos == null ? max : l.escudos);
  }

  // Escudos voltam sozinhos, um por vez, depois de alguns segundos sem apanhar.
  function atualizarEscudos(j, dt) {
    const l = j.line;
    if (!l || !l.escudosMax || l.escudos >= l.escudosMax) return;
    l.semDano = (l.semDano || 0) + dt;
    if (l.semDano < ESPERA_ESCUDO) return;
    l.recargaEscudo = (l.recargaEscudo || 0) + dt;
    if (l.recargaEscudo >= RECARGA_ESCUDO) { l.recargaEscudo = 0; l.escudos++; j.particulas.emitir('brilho', l.x, l.y - 40, 4, { vel: 30, vida: 0.5, r: 3 }); }
  }

  function desenharEscudos(g, j, s) {
    const l = j.line;
    if (!l || !l.escudosMax) return;
    const x0 = (22 + l.hpMax / 2 * 24 + 6) * s, y = 24 * s;
    for (let i = 0; i < l.escudosMax; i++) {
      const x = x0 + i * 20 * s, cheio = i < l.escudos;
      g.save(); g.translate(x, y);
      g.fillStyle = 'rgba(0,0,0,.45)'; forma(g, 9.5 * s); g.fill();
      g.fillStyle = cheio ? '#6fb8ff' : 'rgba(80,110,150,.45)'; forma(g, 7.5 * s); g.fill();
      if (cheio) { g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(-3 * s, -5 * s, 2 * s, 7 * s); }
      g.restore();
    }
  }
  function forma(g, r) { g.beginPath(); g.moveTo(0, -r); g.lineTo(r * 0.85, -r * 0.6); g.lineTo(r * 0.7, r * 0.3); g.lineTo(0, r); g.lineTo(-r * 0.7, r * 0.3); g.lineTo(-r * 0.85, -r * 0.6); g.closePath(); }

  // ---------------- Moradores ----------------
  const MORADORES = {
    rosa: { nome: 'Dona Rosa', papel: 'Mercadora', roupa: '#d65a7a', avental: '#f7efe0', cabelo: '#8a8a8a', pele: '#f0c9a0', coque: true },
    bento: { nome: 'Seu Bento', papel: 'Ferreiro', roupa: '#5a6a7a', avental: '#6e4a2c', cabelo: '#3a2a1a', pele: '#c98a5a', barba: true },
    ze: { nome: 'Seu Zé', papel: 'Morador', roupa: '#6d8f4c', avental: null, cabelo: '#e8e8e8', pele: '#e8b890', bengala: true, chapeu: '#a8743a' },
    lurdes: { nome: 'Dona Lurdes', papel: 'Moradora', roupa: '#8a5a9a', avental: '#f0e2c8', cabelo: '#5a3a2a', pele: '#e0a878' },
    pedro: { nome: 'Pedrinho', papel: 'Menino', roupa: '#e0a83a', avental: null, cabelo: '#2a1a10', pele: '#d99a6a', crianca: true },
    tobias: { nome: 'Tobias', papel: 'Caçador', roupa: '#5a6b3a', avental: '#7a5a3a', cabelo: '#6a4a2a', pele: '#d9a070', barba: true, chapeu: '#4a3a2a' },
  };

  class Morador {
    constructor(def) {
      Object.assign(this, def);
      this.cfg = Object.assign({ altura: MORADORES[def.id].crianca ? 40 : 56 }, MORADORES[def.id]);
      this.x = T(def.x); this.y = T(def.y); this.x0 = this.x;
      this.lado = 1; this.t = Math.random() * 5; this.raio = 12; this.visivel = true; this.morador = true;
    }
    atualizar(dt, j) {
      this.t += dt;
      // À noite os moradores do vilarejo vão para casa dormir (o Tobias, ferido na montanha, fica).
      this.dormindo = j.mapa.id === 'vilarejo' && LB.relogio.ativo(j) && LB.relogio.noite(j);
      const l = j.line;
      if (Math.hypot(l.x - this.x, l.y - this.y) < 140 && Math.abs(l.x - this.x) > 6) this.lado = l.x < this.x ? -1 : 1;
      // O Pedrinho não para quieto.
      if (this.id === 'pedro') { this.x = this.x0 + Math.sin(this.t * 0.7) * 40; this.lado = Math.cos(this.t * 0.7) > 0 ? 1 : -1; }
      if (this.fala > 0) this.fala -= dt;
    }
    desenharSombra(g) { LB.desenho.sombraChao(g, this.x, this.y, 12, 0.25); }
    desenhar(g) {
      const c = this.cfg, x = this.x, y = this.y, k = c.crianca ? 0.75 : 1;
      const resp = Math.sin(this.t * 2) * 1, pulo = this.id === 'pedro' ? Math.abs(Math.sin(this.t * 6)) * 3 : 0;
      g.save(); g.translate(x, y - pulo); g.scale(this.lado * k, k);
      // Pernas e corpo.
      g.fillStyle = '#3a2a2a'; g.fillRect(-6, -14, 5, 14); g.fillRect(2, -14, 5, 14);
      g.fillStyle = c.roupa; g.beginPath(); g.moveTo(-11, -14); g.lineTo(11, -14); g.lineTo(9, -40 + resp); g.lineTo(-9, -40 + resp); g.closePath(); g.fill();
      if (c.avental) { g.fillStyle = c.avental; g.fillRect(-7, -34 + resp, 14, 20); }
      g.fillStyle = c.roupa; g.fillRect(-13, -38 + resp, 5, 16); g.fillRect(8, -38 + resp, 5, 16);
      g.fillStyle = c.pele; g.beginPath(); g.arc(-10.5, -21 + resp, 3, 0, TAU); g.arc(10.5, -21 + resp, 3, 0, TAU); g.fill();
      if (c.bengala) { g.strokeStyle = '#6e4a2c'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(12, -21); g.lineTo(15, 0); g.stroke(); }
      if (this.id === 'bento') { g.fillStyle = '#5a5a66'; g.fillRect(10, -30 + resp, 4, 12); g.fillStyle = '#3a3a44'; g.fillRect(7, -34 + resp, 10, 6); }
      // Cabeça.
      const hy = -52 + resp;
      g.fillStyle = c.pele; g.beginPath(); g.arc(0, hy, 12, 0, TAU); g.fill();
      g.fillStyle = c.cabelo; g.beginPath(); g.arc(0, hy - 3, 12.5, Math.PI * 1.05, Math.PI * 1.95); g.fill();
      if (c.coque) { g.beginPath(); g.arc(-2, hy - 14, 5, 0, TAU); g.fill(); }
      if (c.barba) { g.beginPath(); g.moveTo(-9, hy + 2); g.quadraticCurveTo(0, hy + 16, 9, hy + 2); g.fill(); }
      if (c.chapeu) { g.fillStyle = c.chapeu; g.fillRect(-15, hy - 10, 30, 4); g.fillRect(-9, hy - 18, 18, 9); }
      g.fillStyle = '#2a1a1a'; g.fillRect(3, hy - 2, 2.5, 3); g.fillRect(-4, hy - 2, 2.5, 3);
      g.fillStyle = 'rgba(255,120,120,.5)'; g.beginPath(); g.arc(7, hy + 3, 2.2, 0, TAU); g.arc(-7, hy + 3, 2.2, 0, TAU); g.fill();
      g.restore();
      // Ícone da loja por cima.
      if (this.loja) {
        const b = Math.sin(this.t * 3) * 2;
        g.font = '14px system-ui'; g.textAlign = 'center';
        g.fillText(this.loja === 'rosa' ? '🧪' : '⚒️', x, y - 78 * k - b);
      }
    }
  }

  function criarMoradores(j) {
    return (j.mapa.def.npcs || []).map((d) => new Morador(d));
  }

  // O que cada morador diz, conforme o progresso.
  function falasDe(j, m) {
    const f = j.flags, conversou = (f.conversas || []).includes(m.id);
    const tem = (id) => M().tem(j, id);
    const p2 = LB.parte2 && LB.parte2.falas(j, m);
    if (p2) return p2;
    switch (m.id) {
      case 'rosa':
        if (!conversou) return [['Dona Rosa', 'Ai, menina! Você é a Line, da fazendinha? Fiquei sabendo da Bell... que horror.'], ['Line', 'Eu vou buscar ela, Dona Rosa. Custe o que custar.', 'bravo'], ['Dona Rosa', 'Então leva umas poções, que a estrada é perigosa. E bombas: servem pra abrir parede rachada.']];
        return [['Dona Rosa', tem('bomba') ? 'Bomba é bom pra pedra rachada, mas cuidado com os dedos, viu?' : 'Precisando de alguma coisa? Tenho de tudo um pouco.']];
      case 'bento':
        if (M().temPista(j, 'receita') && !f.receitaMostrada) { f.receitaMostrada = true; return [['Seu Bento', 'Essa letra... é do Mestre Aurélio! Faz cinquenta anos que eu não via.'], ['Seu Bento', 'Ele me ensinou tudo que eu sei. Quando a montanha esquentou, ele desceu pra outra cidade e nunca mais voltou.'], ['Seu Bento', 'Com essa receita eu forjo a Armadura de Brasa pra você. Chão em brasa nunca mais vai te queimar. É o mínimo que eu devo a ele.'], ['Line', 'Obrigada, Seu Bento!', 'sorriso']]; }
        if (!conversou) return [['Seu Bento', 'Hm. Ferreiro Bento, às ordens.'], ['Seu Bento', 'Aprendi o ofício lá em cima, na Forja Antiga da montanha, com o Mestre Aurélio. Faz tempo.'], ['Seu Bento', 'Armadura não é enfeite, moça: cada escudo segura um golpe antes de chegar no coração, e volta sozinho quando você respira um pouco.']];
        return [['Seu Bento', armadura(j) ? `Essa ${armadura(j).nome.toLowerCase()} tá aguentando bem?` : 'Sem armadura por aí? Assim o dragão te assa.']];
      case 'ze':
        if (f.alavanca) return [['Seu Zé', 'O carrinho voltou a andar! Igualzinho à minha época. Vai de estação em estação num piscar de olhos.']];
        if (tem('alavanca')) return [['Seu Zé', 'É a alavanca do freio! Encaixa numa estação e o carrinho anda de novo, menina!']];
        if (conversou) return [['Seu Zé', 'Eu empurrava aquele carrinho quando era moço, sabia? Cinquenta anos atrás. Parece que foi ontem.']];
        return [['Seu Zé', 'Na minha época o carrinho levava a gente do vilarejo até as minas e a forja da montanha.'], ['Seu Zé', 'Faz uns cinquenta anos a montanha começou a esquentar e a respirar de noite. O Mestre Ivo, o capataz, fechou a mina e levou a alavanca do freio lá pra forja.'], ['Seu Zé', 'Nunca mais ninguém viajou. E agora o dragão acordou de vez...'], ['Seu Zé', 'Bebe da fonte da praça, menina: cura, e a gente volta pra cá se cair.']];
      case 'lurdes':
        if (f.tobias && !f.tobiasRecompensa) {
          f.tobiasRecompensa = true;
          M().dar(j, 'pocao', 2);
          return [['Dona Lurdes', 'Você achou o Tobias?! Ele tá bem? Torceu o pé, aquele teimoso?'], ['Line', 'Tá bem, sim. Mandou dizer que já tá descendo.', 'sorriso'], ['Dona Lurdes', 'Ai, graças! Toma, querida: duas poções. Não é nada perto do que você fez.'], ['Dona Lurdes', 'E vai buscar a sua moça. Ninguém devia ficar longe de quem ama.']];
        }
        if (f.tobias) return [['Dona Lurdes', 'O Tobias disse que ouviu a sua moça cantando lá em cima. Ela deve ser muito corajosa.'], ['Line', 'A mais corajosa que eu conheço.', 'apaixonada']];
        if (M().temPista(j, 'cacador')) return [['Dona Lurdes', 'Você leu o bilhete? Ele foi atrás do dragão, montanha acima! Aquele homem não tem juízo.'], ['Dona Lurdes', 'Se você subir a Montanha de Brasa e achar o Tobias, manda ele voltar pra casa?'], ['Line', 'Pode deixar, Dona Lurdes. E a moça que ele viu... ela tava gritando o meu nome.', 'apaixonada']];
        return [['Dona Lurdes', 'Meu marido, o Tobias, é caçador. Mora na cabana a leste da floresta.'], ['Dona Lurdes', 'Ele viu o dragão passar e ainda não voltou pra casa. Deve ter deixado recado na porta da cabana. Ele sempre deixa.']];
      case 'tobias':
        if (!conversou) {
          f.tobias = true;
          return [['Tobias', 'Opa! Calma, moça, sou amigo. Tobias, caçador. Torci o pé subindo atrás do bicho.'],
            ['Line', (f.conversas || []).includes('lurdes') ? 'O senhor é o marido da Dona Lurdes! Ela tá morrendo de preocupação.' : 'O senhor é o caçador do bilhete da cabana?', 'surpresa'],
            ['Tobias', 'Vi o dragão pousar lá no topo, com a moça de óculos. Ela tá viva, moça. Eu escutei.'],
            ['Tobias', 'Escutei uma voz lá de cima a noite inteira. Às vezes falando com o bicho, às vezes cantando. E quando ela canta... o dragão para de rugir.'],
            ['Line', 'É a Bell. Ela canta quando tá com medo, pra ficar corajosa.', 'apaixonada'],
            ['Tobias', 'Então ela é das corajosas. Vai lá. Eu desço devagar e aviso a Lurdes que tô inteiro.']];
        }
        return [['Tobias', 'Três tochas, um portão, e ela tá do outro lado. Vai, moça. E cuidado com o chão em brasa.']];
      case 'pedro':
        if (!(f.rachaduras || []).some((k) => k.startsWith('floresta'))) return [['Pedrinho', 'Moça! Sabia que bomba quebra pedra rachada? Tem uma pedrona rachada lá na floresta, no fundo da clareira do lago!'], ['Pedrinho', 'Meu pai diz que tem tesouro atrás. Eu que não vou lá, tem sombra!']];
        return [['Pedrinho', 'VOCÊ EXPLODIU A PEDRA?! Que demais!'], ['Pedrinho', 'O carrinho da estação tá quebrado desde que eu nasci. Queria tanto andar nele...']];
    }
    return [['...', '...']];
  }

  // ---------------- Lojas ----------------
  const LOJAS = {
    rosa: {
      titulo: 'Loja da Dona Rosa', icone: '🧪', fala: 'Tudo fresquinho, feito aqui no vilarejo!',
      produtos: [
        { id: 'pocao', preco: 20, n: 1 },
        { id: 'elixir', preco: 25, n: 1 },
        { id: 'bomba', preco: 30, n: 3, nome: 'Bombas (3)' },
        { id: 'pena', preco: 80, n: 1, max: 1 },
        { id: 'botas', preco: 60, n: 1, max: 1 },
      ],
    },
    bento: {
      titulo: 'Ferraria do Seu Bento', icone: '⚒️', fala: 'Armadura boa é a que você nem sente que tá usando.',
      produtos: [
        { armadura: 'tunica' },
        { armadura: 'malha' },
        { armadura: 'brasa', requer: (j) => M().temPista(j, 'receita'), falta: 'Precisa da receita do Mestre Aurélio (dizem que está na Forja Antiga, na montanha).' },
        { armadura: 'vestido', parte2: true },
        { armadura: 'estelar', parte2: true },
        { armadura: 'aurora', parte2: true, requer: (j) => ['chefeTerra', 'chefeAgua', 'chefeAr'].filter((f) => j.flags[f]).length >= 2, falta: 'Precisa de escamas de dois guardiões libertados (Terra, Água ou Ar).' },
      ],
    },
  };

  const ORDEM_ARM = ['tunica', 'malha', 'brasa'], ORDEM_BELL = ['vestido', 'estelar', 'aurora'];
  const chaveArm = (id) => (ARMADURAS[id].bell ? 'armaduraBell' : 'armadura');

  function situacao(j, p) {
    if (p.armadura) {
      const a = ARMADURAS[p.armadura], atual = j.flags[chaveArm(p.armadura)], ORDEM = a.bell ? ORDEM_BELL : ORDEM_ARM;
      if (atual === p.armadura) return { pode: false, motivo: 'Vestindo' };
      if (atual && ORDEM.indexOf(atual) > ORDEM.indexOf(p.armadura)) return { pode: false, motivo: a.bell ? 'A Bell já tem uma melhor' : 'Você já tem uma melhor' };
      if (p.requer && !p.requer(j)) return { pode: false, motivo: 'Indisponível', dica: p.falta };
      if (M().moedas(j) < a.preco) return { pode: false, motivo: 'Moedas insuficientes' };
      return { pode: true };
    }
    if (p.max && M().qtd(j, p.id) >= p.max) return { pode: false, motivo: 'Já tem' };
    if (M().moedas(j) < p.preco) return { pode: false, motivo: 'Moedas insuficientes' };
    return { pode: true };
  }

  function comprar(j, lojaId, idx) {
    const p = LOJAS[lojaId].produtos[idx], s = situacao(j, p);
    if (!s.pode) return { ok: false, motivo: s.motivo === 'Moedas insuficientes' ? `Faltam ${(p.armadura ? ARMADURAS[p.armadura].preco : p.preco) - M().moedas(j)} moedas. Derrote inimigos e abra baús para juntar mais.` : s.dica || s.motivo };
    if (p.armadura) {
      const a = ARMADURAS[p.armadura];
      M().darMoedas(j, -a.preco, true);
      j.flags[chaveArm(p.armadura)] = p.armadura;
      vestir(j, true);
      M().aviso(`${a.icone} ${a.nome} ${a.bell && !daBell(j) ? 'guardada para a Bell' : 'vestida'}!`);
    } else {
      const it = M().ITENS[p.id];
      M().darMoedas(j, -p.preco, true);
      M().dar(j, p.id, p.n);
      if (p.id === 'botas') j.line.botas = true;
      if (it.equipavel && p.id === 'bomba') M().equipar(j, 'bomba');
    }
    j.salvar();
    return { ok: true };
  }

  const tela = {
    abrir(j, lojaId) {
      this.j = j; this.id = lojaId;
      j.estado = 'loja';
      $('#toque').classList.add('oculto');
      $('#loja').classList.remove('oculto');
      $('#loja-msg').textContent = LOJAS[lojaId].fala;
      this.atualizar();
    },
    fechar() {
      const j = this.j;
      if (!j || j.estado !== 'loja') return;
      $('#loja').classList.add('oculto');
      j.estado = 'jogo';
      LB.entrada.limpar();
      M().atualizarBotoes(j);
    },
    atualizar() {
      const j = this.j, L = LOJAS[this.id];
      $('#loja-titulo').textContent = `${L.icone} ${L.titulo}`;
      $('#loja-moedas').textContent = `🪙 ${M().moedas(j)}`;
      const lista = $('#loja-lista'); lista.innerHTML = '';
      L.produtos.forEach((p, i) => {
        if (p.parte2 && !(j.flags.bellJogavel)) return;
        const s = situacao(j, p);
        const a = p.armadura && ARMADURAS[p.armadura], it = !a && M().ITENS[p.id];
        const nome = a ? a.nome : p.nome || it.nome, icone = a ? a.icone : it.icone, preco = a ? a.preco : p.preco;
        const desc = a ? a.desc : it.desc;
        const tem = !a && M().qtd(j, p.id) ? ` · você tem ${M().qtd(j, p.id)}` : '';
        const div = document.createElement('div');
        div.className = 'produto' + (s.pode || s.motivo === 'Moedas insuficientes' ? '' : ' bloqueado');
        div.innerHTML = `<span class="ic">${icone}</span><div class="info"><b>${nome}</b><small>${desc}${tem}</small>${s.dica ? `<small class="falta">${s.dica}</small>` : ''}</div>`;
        const b = document.createElement('button');
        b.className = 'comprar';
        const caro = !s.pode && s.motivo === 'Moedas insuficientes';
        b.textContent = s.pode || caro ? `🪙 ${preco}` : s.motivo;
        if (caro) b.classList.add('caro');
        b.disabled = !s.pode && !caro;
        b.onclick = () => { const r = comprar(j, this.id, i); $('#loja-msg').textContent = r.ok ? `Obrigado! ${a ? 'Ficou ótima em você.' : 'Boa viagem!'}` : r.motivo; this.atualizar(); };
        div.appendChild(b);
        lista.appendChild(div);
      });
    },
  };

  function ligar(j) {
    $('#btn-fechar-loja').onclick = () => tela.fechar();
    document.addEventListener('keydown', (e) => { if (e.code === 'Escape' && j.estado === 'loja') { e.preventDefault(); e.stopImmediatePropagation(); tela.fechar(); } });
  }

  // Ações perto dos moradores.
  function acoes(j, lista, perto) {
    // Loja fechada à noite: bater na porta explica e sugere descansar.
    if (j.mapa.id === 'vilarejo' && LB.relogio.ativo(j) && LB.relogio.noite(j)) {
      for (const p of j.mapa.props) {
        if (p.tipo !== 'casa' || !p.letreiro || !perto(p.porta, p.y, 50)) continue;
        lista.push({ texto: 'Loja fechada', x: p.porta, y: p.y - 70, prio: 1, fazer: () => j.iniciarCena(function* (c) { yield c.fala('', `${p.letreiro}: fechada. Abre às 6h.`, 'sistema'); yield c.fala('Line', 'Todo mundo dormindo... Posso descansar na fonte da praça até amanhecer.', 'neutro'); }, { semPular: true }) });
      }
    }
    for (const m of j.moradores || []) {
      if (m.dormindo || !perto(m.x, m.y + (m.balcao || 10), 58)) continue;
      lista.push({ texto: m.loja ? (m.loja === 'rosa' ? 'Comprar / conversar' : 'Armaduras / conversar') : 'Conversar', x: m.x, y: m.y - 92, prio: 1, fazer: () => {
        m.fala = 2;
        j.iniciarCena(LB.HISTORIA.morador, { semPular: true }, m);
      } });
    }
  }

  LB.loja = { ROUPA, ARMADURAS, LOJAS, MORADORES, armadura, escudosMax, imuneBrasa, vestir, atualizarEscudos, desenharEscudos, criarMoradores, falasDe, comprar, situacao, tela, ligar, acoes, Morador };
})(window.LB);
