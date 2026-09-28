'use strict';

// Carrinho de mina: três estações (Vilarejo, Minas, Forja) ligadas pelos trilhos.
// Ele fica quebrado até a Line trazer a Alavanca de Ferro da Forja Antiga, na montanha.
(function (LB) {
  const T = (n) => n * LB.TILE;
  const $ = (s) => document.querySelector(s);
  const M = () => LB.mochila;

  const ESTACOES = {
    vilarejo: { area: 'vilarejo', nome: 'Estação do Vilarejo', icone: '🏘️' },
    minas: { area: 'gruta', nome: 'Estação das Minas', icone: '⛏️' },
    forja: { area: 'montanha', nome: 'Estação da Forja', icone: '🌋' },
  };

  function estacaoDaArea(j) { return j.mapa && j.mapa.def.estacao; }

  // Chegar perto de uma estação a marca como conhecida.
  function atualizar(j) {
    const e = estacaoDaArea(j);
    if (!e || !j.line) return;
    if (Math.hypot(j.line.x - T(e.x + 0.5), j.line.y - T(e.y + 1)) > 110) return;
    const f = j.flags;
    f.estacoes = f.estacoes || [];
    if (!f.estacoes.includes(e.id)) { f.estacoes.push(e.id); M().aviso(`🛤️ Estação descoberta: ${e.nome}`); j.salvar(); }
  }

  function acoes(j, lista, perto) {
    const e = estacaoDaArea(j);
    if (!e || !perto(T(e.x + 0.5), T(e.y + 1) - 4, 60)) return;
    const texto = j.flags.alavanca ? 'Viajar de carrinho' : M().tem(j, 'alavanca') ? 'Encaixar a alavanca' : 'Ver o carrinho';
    lista.push({ texto, x: T(e.x + 0.5), y: T(e.y) - 50, prio: 1, fazer: () => {
      if (j.flags.alavanca) tela.abrir(j);
      else j.iniciarCena(LB.HISTORIA.carrinhoQuebrado, { semPular: true }, e);
    } });
  }

  // ---------------- Escolha do destino ----------------
  const tela = {
    abrir(j) {
      this.j = j;
      const aqui = estacaoDaArea(j).id;
      const lista = $('#viagem-lista'); lista.innerHTML = '';
      const conhecidas = (j.flags.estacoes || []).filter((id) => id !== aqui);
      for (const id of Object.keys(ESTACOES)) {
        if (id === aqui) continue;
        const e = ESTACOES[id], ok = conhecidas.includes(id);
        const b = document.createElement('button');
        b.className = ok ? '' : 'sec';
        b.disabled = !ok;
        b.textContent = ok ? `${e.icone} ${e.nome}` : `🔒 Estação ainda não descoberta`;
        b.onclick = () => { this.fechar(); viajar(j, id); };
        lista.appendChild(b);
      }
      $('#viagem-msg').textContent = conhecidas.length ? 'Para onde o carrinho vai?' : 'Você ainda não conhece outra estação. As outras ficam nas Minas de Cristal e na Forja da Montanha.';
      j.estado = 'viagem';
      $('#toque').classList.add('oculto');
      $('#viagem').classList.remove('oculto');
    },
    fechar() {
      $('#viagem').classList.add('oculto');
      if (this.j && this.j.estado === 'viagem') this.j.estado = 'jogo';
      LB.entrada.limpar();
    },
  };

  function viajar(j, destino) {
    j.iniciarCena(cenaPartida, { semPular: false }, destino);
  }

  // A Line entra no carrinho e ele desce os trilhos até sair da tela (sempre para leste).
  function* cenaPartida(c, j, destino) {
    const e = estacaoDaArea(j), l = j.line;
    const x0 = T(e.x + 0.5) + 6, y0 = T(e.y + 1) - 2;
    yield c.andar(l, (x0) / LB.TILE, (y0 + 20) / LB.TILE, { vel: 90, parar: 'LINE_IDLE' });
    l.visivel = false;
    j.viagem = { x: x0, y: y0, escondeCarrinho: true, balanco: 0 };
    j.particulas.emitir('poeira', x0, y0, 6, { vel: 40 });
    yield c.espera(0.4);
    const xFim = j.mapa.larg + 80;
    j.camAlvo = { x: x0, y: y0 - 30 };
    let t = 0;
    const dur = Math.max(1.2, (xFim - x0) / 300);
    yield { atualizar: (dt) => { t += dt; const k = Math.min(1, t / dur); j.viagem.x = x0 + (xFim - x0) * k * k; j.camAlvo = { x: Math.min(j.viagem.x, j.mapa.larg - j.vw / 2), y: y0 - 30 }; if (Math.random() < dt * 20) j.particulas.emitir('faisca', j.viagem.x - 14, y0 - 2, 1, { vel: 60, vz: 40, vida: 0.3 }); }, pronto: () => t >= dur, pular: () => { j.viagem.x = xFim; } };
    yield c.escurecer(1, 0.5);
    chegar(j, destino);
  }

  function chegar(j, destino) {
    const d = ESTACOES[destino], def = LB.MAPAS[d.area].estacao;
    j.viagem = null;
    j.iniciarArea(d.area, { x: def.x + 0.7, y: def.y + 1.9, dir: 'FRONT' }, true);
    j.fade = 1;
    j.iniciarCena(cenaChegada, { semPular: false }, destino);
  }

  function* cenaChegada(c, j) {
    const e = estacaoDaArea(j), l = j.line;
    const xs = T(e.x + 0.5) + 6, y0 = T(e.y + 1) - 2;
    const x0 = j.mapa.larg + 60;
    l.visivel = false;
    j.viagem = { x: x0, y: y0, escondeCarrinho: true };
    j.cameraEm(Math.min(x0, j.mapa.larg - j.vw / 2), y0 - 30);
    j.camAlvo = { x: xs, y: y0 - 30 };
    c.junto(c.escurecer(0, 0.5));
    let t = 0;
    const dur = Math.max(1, (x0 - xs) / 300);
    yield { atualizar: (dt) => { t += dt; const k = Math.min(1, t / dur); j.viagem.x = x0 + (xs - x0) * (1 - (1 - k) * (1 - k)); j.camAlvo = { x: Math.min(j.viagem.x, j.mapa.larg - j.vw / 2), y: y0 - 30 }; }, pronto: () => t >= dur, pular: () => { j.viagem.x = xs; } };
    j.particulas.emitir('poeira', xs, y0, 8, { vel: 50 });
    yield c.espera(0.3);
    j.viagem = null;
    l.visivel = true; l.x = xs; l.y = y0 + 26; l.dir = 'FRONT';
    l.anim.tocar('LINE_IDLE', true);
    M().aviso(`🛤️ ${e.nome}`);
    j.salvar();
  }

  // O carrinho (com a Line dentro) enquanto viaja.
  function desenharViagem(g, j) {
    const v = j.viagem;
    if (!v) return;
    const bal = Math.sin(j.tempo * 30) * 0.8;
    const r = LB.resolver('LINE_IDLE', 'FRONT', 1);
    g.save(); g.translate(0, bal);
    if (r.sprite) { g.save(); g.beginPath(); g.rect(v.x - 30, v.y - 120, 60, 100); g.clip(); LB.desenharSprite(g, r, r.sprite.seq[0], v.x, v.y - 8, LB.ALTURA_LINE); g.restore(); }
    LB.mundo.carrinho(g, v.x, v.y, false);
    g.restore();
  }

  function ligar() {
    $('#btn-fechar-viagem').onclick = () => tela.fechar();
    document.addEventListener('keydown', (e) => { if (e.code === 'Escape' && tela.j && tela.j.estado === 'viagem') { e.preventDefault(); e.stopImmediatePropagation(); tela.fechar(); } });
  }

  LB.carrinho = { ESTACOES, atualizar, acoes, tela, viajar, chegar, desenharViagem, ligar, cenaPartida, cenaChegada };
})(window.LB);
