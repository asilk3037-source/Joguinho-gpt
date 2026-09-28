'use strict';

// Mochila da Line: itens usáveis, caderno de pistas (investigação para achar a Bell),
// mapa com névoa de exploração (área e mundo), objetivo atual, avisos de item novo.
(function (LB) {
  const TILE = LB.TILE;
  const T = (n) => n * TILE;
  const $ = (s) => document.querySelector(s);
  const TAU = Math.PI * 2;

  // ---------------- Catálogo de itens ----------------
  // usar(jogo) devolve false quando o item não pode ser usado agora (e diz por quê em `motivo`).
  const ITENS = {
    pocao: { nome: 'Poção de Vida', icone: '🧪', cor: '#ff6f9f', desc: 'Cura 2 corações. Também pode ser usada rápido com H (ou o botão 🧪).', usar: (j) => curar(j, 4) },
    pao: { nome: 'Pão da Bell', icone: '🍞', cor: '#e0a85a', desc: 'Um pãozinho que a Bell assou. Cura 1 coração.', usar: (j) => curar(j, 2) },
    maca: { nome: 'Maçã', icone: '🍎', cor: '#e04a4a', desc: 'Colhida nas macieiras da fazenda. Cura meio coração.', usar: (j) => curar(j, 1) },
    elixir: { nome: 'Elixir de Luz', icone: '💧', cor: '#7fd6ff', desc: 'Recupera toda a magia de uma vez.', usar: (j) => {
      const l = j.line;
      if (!l.temMagia) return { ok: false, motivo: 'A Line ainda não sabe magia.' };
      if (l.mana >= l.manaMax) return { ok: false, motivo: 'A magia já está cheia.' };
      l.mana = l.manaMax; j.particulas.emitir('brilho', l.x, l.y - 40, 12, { vel: 60, vida: 0.7, r: 5 });
      return { ok: true };
    } },
    flor: { nome: 'Flor da Lua', icone: '🌸', cor: '#f5b8ff', desc: 'Uma flor rara que só nasce onde a lava encontra a rocha. Cura tudo e enche a magia.', usar: (j) => {
      const l = j.line;
      if (l.hp >= l.hpMax && (!l.temMagia || l.mana >= l.manaMax)) return { ok: false, motivo: 'A Line já está inteira.' };
      l.hp = l.hpMax; if (l.temMagia) l.mana = l.manaMax;
      j.particulas.emitir('coracao', l.x, l.y - 50, 6, { vel: 40, vida: 1.2 }); j.particulas.emitir('brilho', l.x, l.y - 40, 10, { vel: 60, vida: 0.7, r: 5 });
      return { ok: true };
    } },
    chave: { nome: 'Chave antiga', icone: '🗝️', cor: '#d4a93a', desc: 'Abre uma porta trancada. Some depois de usada. Há três portas trancadas pelo mundo.', tipo: 'chave' },
    bussola: { nome: 'Bússola do Mago', icone: '🧭', cor: '#9ec5ff', desc: 'Mostra no mapa os baús que ainda não foram abertos, mesmo nos lugares onde a Line ainda não passou.', tipo: 'especial' },
  };

  function curar(j, qtd) {
    const l = j.line;
    if (l.hp >= l.hpMax) return { ok: false, motivo: 'A vida já está cheia.' };
    l.hp = Math.min(l.hpMax, l.hp + qtd);
    j.particulas.emitir('coracao', l.x, l.y - 50, 4, { vel: 35, vida: 1.1 });
    if (l.estado === 'livre') l.anim.tocar(l.animParada(), true);
    return { ok: true };
  }

  // ---------------- Caderno de pistas (investigação) ----------------
  // Cada pista é um documento que a Line encontra. Juntas, contam a história do dragão e mostram o caminho até a Bell.
  const PISTAS = {
    pegadas: { titulo: 'Marcas de garra no píer', icone: '🐾', onde: 'Fazendinha, no píer do lago', texto: 'Três riscos fundos na madeira do píer, e um rastro de brasa apagada apontando para o norte. Ele passou baixo, pesado... e foi na direção da floresta. A Bell está viva: ele a levou, não a machucou. Eu vou atrás.' },
    carta: { titulo: 'Carta do Mago', icone: '✉️', onde: 'Floresta Sussurrante, baú na clareira do Mago', texto: '“Para quem encontrar esta carta: o dragão vermelho dorme há cem anos na Montanha de Brasa. Quando acorda, leva o que mais brilha aos olhos dele. Selou a montanha com magia antiga; só a luz das Ruínas Encantadas atravessa o selo. Há também uma gruta a leste da floresta, onde guardei coisas que podem ajudar. — O Mago”' },
    lenda: { titulo: 'A lenda da Montanha', icone: '📜', onde: 'Gruta dos Ecos, pergaminho perto da fonte', texto: '“A cada cem anos o dragão desperta com fome de luz. Leva para o covil a pessoa de coração mais brilhante e a guarda numa jaula de ferro. Dizem que o dragão não teme a espada: teme a luz, que o cansa, e quando cansa o peito dele se abre.”' },
    mapa: { titulo: 'Mapa rasgado', icone: '🗺️', onde: 'Gruta dos Ecos, sala trancada', texto: 'Um pedaço de mapa antigo. Mostra a Montanha de Brasa, um portão de fogo com três tochas e, no topo, o covil do dragão. Também marca uma caverna escondida na encosta leste da montanha. Com ele, o mapa do mundo ficou completo.' },
    diario1: { titulo: 'Diário do Guardião, página 1', icone: '📖', onde: 'Ruínas Encantadas, no chão perto do altar', texto: '“Fui feito de pedra para guardar a luz. Os cristais do templo são minhas chaves: acesos, as barreiras caem. Se alguém chegar aqui com um coração corajoso, que a luz do altar o escolha.”' },
    diario2: { titulo: 'Diário do Guardião, página 2', icone: '📖', onde: 'Ruínas Encantadas, biblioteca trancada', texto: '“O dragão tem medo da Chuva de Estrelas. Quando as estrelas caem em volta dele, o fogo dele apaga por um instante. Guardo essa magia no meu peito; só a entrego para quem me vencer sem ódio.”' },
    escama: { titulo: 'Escama vermelha', icone: '🔥', onde: 'Montanha de Brasa, caverna escondida', texto: 'Uma escama do tamanho da minha mão, ainda morna. Está rachada no meio: o peito dele é o lugar mais fraco, exatamente como o Mago disse. E ele perde escamas quando voa alto... então ele se cansa quando mergulha.' },
    fita: { titulo: 'Fita de cabelo da Bell', icone: '🎀', onde: 'Montanha de Brasa, perto do portão de fogo', texto: 'A fita azul que a Bell usava hoje de manhã. Ela deixou cair de propósito, eu sei: é o jeito dela de dizer “tô aqui, vem me buscar”. Falta pouco, amor.' },
  };
  const ORDEM_PISTAS = ['pegadas', 'carta', 'lenda', 'mapa', 'diario1', 'diario2', 'escama', 'fita'];

  // ---------------- Estado (fica dentro de jogo.flags, então é salvo) ----------------
  function inv(j) {
    const f = j.flags;
    if (!f.inv) f.inv = { itens: {}, pistas: [], novos: 0 };
    return f.inv;
  }

  function qtd(j, id) { return inv(j).itens[id] || 0; }

  function dar(j, id, n) {
    const i = inv(j);
    i.itens[id] = (i.itens[id] || 0) + (n || 1);
    i.novos = (i.novos || 0) + 1;
    const it = ITENS[id];
    aviso(`${it.icone} ${it.nome}${(n || 1) > 1 ? ' ×' + n : ''}`);
    atualizarBotoes(j);
  }

  function tirar(j, id, n) {
    const i = inv(j);
    i.itens[id] = Math.max(0, (i.itens[id] || 0) - (n || 1));
    if (!i.itens[id]) delete i.itens[id];
    atualizarBotoes(j);
  }

  function temPista(j, id) { return inv(j).pistas.includes(id); }

  function darPista(j, id) {
    const i = inv(j);
    if (i.pistas.includes(id)) return false;
    i.pistas.push(id);
    i.novos = (i.novos || 0) + 1;
    if (id === 'mapa') j.flags.mapaRevelado = true;
    aviso(`${PISTAS[id].icone} Pista: ${PISTAS[id].titulo}`);
    atualizarBotoes(j);
    return true;
  }

  function totalPistas() { return ORDEM_PISTAS.length; }

  // Usa um item (pela mochila ou pelo atalho). Devolve { ok, motivo }.
  function usar(j, id) {
    const it = ITENS[id];
    if (!it || !it.usar || qtd(j, id) <= 0) return { ok: false, motivo: 'Não dá para usar isso.' };
    const l = j.line;
    if (!l || l.estado === 'morta' || l.estado === 'final') return { ok: false, motivo: 'Agora não.' };
    const r = it.usar(j);
    if (r.ok) { tirar(j, id, 1); j.salvar(); }
    return r;
  }

  // Atalho: usa a melhor cura disponível (poção, pão, maçã, flor).
  function usarCuraRapida(j) {
    const l = j.line;
    if (!l || l.hp >= l.hpMax) { aviso('❤️ A vida já está cheia'); return false; }
    const falta = l.hpMax - l.hp;
    const ordem = falta >= 4 ? ['pocao', 'pao', 'maca', 'flor'] : falta >= 2 ? ['pao', 'pocao', 'maca', 'flor'] : ['maca', 'pao', 'pocao', 'flor'];
    for (const id of ordem) if (qtd(j, id) > 0) { const r = usar(j, id); if (r.ok) { aviso(`${ITENS[id].icone} ${ITENS[id].nome} usada`); return true; } }
    aviso('🎒 Nenhum item de cura na mochila');
    return false;
  }

  // ---------------- Objetivo atual (derivado do progresso) ----------------
  function objetivo(j) {
    const f = j.flags;
    if (!f.prologo) return null;
    if (f.zerado) return 'A Bell está em casa. Explore o mundo e complete o caderno de pistas.';
    if (!f.magoVisto) return 'Atravessar a Floresta Sussurrante. Uma luz azul brilha na clareira a oeste.';
    if (!f.espada) return 'Pegar a espada no baú ao lado do Mago.';
    if (!f.ruinasVistas) return 'Cortar os espinhos ao norte da floresta e chegar às Ruínas Encantadas.';
    if (!f.magia) return 'Encontrar o altar da luz, na sala a oeste das ruínas.';
    if (!f.golem) return 'Acender os cristais das ruínas e vencer o Guardião de Pedra.';
    if (!f.montanhaVista) return 'Subir até a Montanha de Brasa.';
    if (!(f.abertas || []).includes('montanha:portao')) {
      const n = (f.luz || []).filter((k) => ['montanha:6,35', 'montanha:30,22', 'montanha:18,9'].includes(k)).length;
      return `Acender as três tochas da montanha para abrir o portão de fogo (${n}/3 acesas). Uma fica perto da entrada, outra numa ilha no meio da lava e a última lá em cima.`;
    }
    return 'Entrar no covil, vencer o dragão e resgatar a Bell.';
  }

  // ---------------- Névoa de exploração ----------------
  // Cada área guarda uma grade de células de 2×2 tiles; a célula fica marcada quando a Line passa perto.
  const CEL = 2, RAIO = 7;
  const grades = {};

  function grade(j) {
    const m = j.mapa;
    if (!m || m.tema === 'encontro') return null;
    const id = m.id;
    if (grades[id] && grades[id].w === Math.ceil(m.w / CEL) && grades[id].salvoDe === j.flags) return grades[id];
    const w = Math.ceil(m.w / CEL), h = Math.ceil(m.h / CEL);
    const g = { w, h, bits: new Uint8Array(w * h), salvoDe: j.flags };
    const hex = (j.flags.vistos || {})[id];
    if (hex) for (let i = 0; i < w * h; i++) g.bits[i] = (parseInt(hex[i >> 2] || '0', 16) >> (i & 3)) & 1;
    grades[id] = g;
    return g;
  }

  function serializar(j, g) {
    let s = '';
    for (let i = 0; i < g.bits.length; i += 4) {
      let v = 0;
      for (let b = 0; b < 4; b++) if (g.bits[i + b]) v |= 1 << b;
      s += v.toString(16);
    }
    j.flags.vistos = j.flags.vistos || {};
    j.flags.vistos[j.mapa.id] = s;
  }

  function explorar(j, dt) {
    const g = grade(j);
    if (!g || !j.line) return;
    j._tNevoa = (j._tNevoa || 0) + dt;
    if (j._tNevoa < 0.25) return;
    j._tNevoa = 0;
    const cx = j.line.x / TILE / CEL, cy = j.line.y / TILE / CEL, r = RAIO / CEL;
    let mudou = false;
    for (let y = Math.max(0, Math.floor(cy - r)); y <= Math.min(g.h - 1, Math.ceil(cy + r)); y++) {
      for (let x = Math.max(0, Math.floor(cx - r)); x <= Math.min(g.w - 1, Math.ceil(cx + r)); x++) {
        if (g.bits[y * g.w + x] || Math.hypot(x + 0.5 - cx, y + 0.5 - cy) > r) continue;
        g.bits[y * g.w + x] = 1; mudou = true;
      }
    }
    if (mudou) serializar(j, g);
  }

  function visto(j, g, tx, ty) { return !!g && !!g.bits[Math.floor(ty / CEL) * g.w + Math.floor(tx / CEL)]; }

  function porcentagem(j, id) {
    const hex = (j.flags.vistos || {})[id];
    if (!hex) return 0;
    const def = LB.MAPAS[id];
    const m = grades[id] || null;
    let n = 0, tot = 0;
    // Conta só células com chão (paredes não contam).
    const linhas = def.linhas, w = Math.max(...linhas.map((r) => r.length)), h = linhas.length;
    const gw = Math.ceil(w / CEL), gh = Math.ceil(h / CEL);
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
      let chao = false;
      for (let dy = 0; dy < CEL && !chao; dy++) for (let dx = 0; dx < CEL; dx++) { const c = (linhas[y * CEL + dy] || '')[x * CEL + dx]; if (c && !'#T'.includes(c)) { chao = true; break; } }
      if (!chao) continue;
      tot++;
      const i = y * gw + x;
      const bit = m ? m.bits[i] : (parseInt(hex[i >> 2] || '0', 16) >> (i & 3)) & 1;
      if (bit) n++;
    }
    return tot ? Math.round(100 * n / tot) : 0;
  }

  // ---------------- Avisos (toast) ----------------
  function aviso(texto) {
    const el = $('#avisos');
    if (!el) return;
    const d = document.createElement('div');
    d.className = 'aviso'; d.textContent = texto;
    el.appendChild(d);
    setTimeout(() => d.classList.add('sumindo'), 3200);
    setTimeout(() => d.remove(), 3800);
    while (el.children.length > 4) el.firstChild.remove();
  }

  // ---------------- Painel de objetivo e botões ----------------
  function atualizarPainel(j) {
    const el = $('#objetivo');
    if (!el) return;
    const texto = objetivo(j);
    const mostrar = !!texto && j.estado === 'jogo' && !j.cena && j.mapa && j.mapa.tema !== 'encontro' && !(j.chefeAtivo);
    el.classList.toggle('oculto', !mostrar);
    if (!mostrar) return;
    const toque = LB.entrada.usandoToque();
    const dica = toque ? '🎒 mochila e mapa no botão do topo' : '<kbd>I</kbd> mochila · <kbd>M</kbd> mapa · <kbd>H</kbd> poção';
    const html = `<b>Objetivo</b><div>${texto}</div><div class="mini">📜 ${inv(j).pistas.length}/${totalPistas()} pistas · ${dica}</div>`;
    if (html !== el._html) { el.innerHTML = html; el._html = html; }
  }

  function atualizarBotoes(j) {
    const n = inv(j).novos || 0;
    const b = $('#b-mochila');
    if (b) { b.classList.toggle('novo', n > 0); b.dataset.novos = n; }
    const p = $('#b-pocao');
    if (p) {
      const cura = ['pocao', 'pao', 'maca', 'flor'].reduce((s, id) => s + qtd(j, id), 0);
      p.classList.toggle('oculto', cura <= 0 || !(j.flags && j.flags.prologo));
      p.textContent = `🧪${cura}`;
    }
  }

  // HUD no canvas: contador de curas embaixo dos corações/magia.
  function desenharHud(g, j, s) {
    if (!j.flags.prologo) return;
    const cura = ['pocao', 'pao', 'maca', 'flor'].reduce((n, id) => n + qtd(j, id), 0);
    if (!cura) return;
    const y = (j.flags.magia ? 66 : 46) * s, x = 22 * s;
    g.fillStyle = 'rgba(0,0,0,.45)'; g.beginPath(); g.roundRect ? g.roundRect(x - 8 * s, y - 8 * s, 58 * s, 16 * s, 6 * s) : g.rect(x - 8 * s, y - 8 * s, 58 * s, 16 * s); g.fill();
    g.fillStyle = '#ff9fbf'; g.beginPath(); g.roundRect ? g.roundRect(x - 3 * s, y - 5 * s, 6 * s, 10 * s, 2 * s) : g.rect(x - 3 * s, y - 5 * s, 6 * s, 10 * s); g.fill();
    g.fillStyle = '#fff'; g.fillRect(x - 2 * s, y - 7 * s, 4 * s, 2 * s);
    g.font = `700 ${10 * s}px system-ui, sans-serif`; g.textAlign = 'left'; g.fillStyle = '#ffe9c7';
    g.fillText(`×${cura}${LB.entrada.usandoToque() ? '' : '  H'}`, x + 7 * s, y + 4 * s);
  }

  // ---------------- Itens no chão e pontos de exame ----------------
  function desenharItemChao(g, it, t) {
    const x = it.x, y = it.y - 8 - Math.sin(t * 3 + x) * 2;
    LB.desenho.sombraChao(g, it.x, it.y, 7, 0.2);
    if (it.doc) {
      // Papel / pergaminho brilhando.
      g.save(); g.translate(x, y); g.rotate(-0.25);
      g.fillStyle = '#f5e9c8'; g.fillRect(-7, -9, 14, 18);
      g.fillStyle = '#b89b6a'; for (let i = 0; i < 4; i++) g.fillRect(-5, -6 + i * 4, 10 - (i % 2) * 3, 1.3);
      g.restore();
    } else {
      const it2 = ITENS[it.item] || {};
      g.fillStyle = '#5a3d2b'; g.beginPath(); g.ellipse(x, y + 2, 8, 6, 0, 0, TAU); g.fill();
      g.fillStyle = it2.cor || '#fff'; g.beginPath(); g.arc(x, y - 3, 6, 0, TAU); g.fill();
      g.fillStyle = 'rgba(255,255,255,.7)'; g.beginPath(); g.arc(x - 2, y - 5, 2, 0, TAU); g.fill();
    }
    if (Math.sin(t * 4 + x) > 0.85) { g.fillStyle = '#fff'; LB.desenho.estrela(g, x + 8, y - 10, 2.5); }
  }

  function desenharPorta(g, p, t, tema) {
    const x = p.x, y = p.y;
    LB.desenho.sombraChao(g, x, y + 1, 14, 0.3);
    g.fillStyle = tema === 'montanha' ? '#3a2a24' : '#2e3336'; g.fillRect(x - 16, y - 46, 32, 46);
    g.fillStyle = tema === 'montanha' ? '#6b4d3c' : '#5b666b'; g.fillRect(x - 16, y - 46, 4, 46); g.fillRect(x + 12, y - 46, 4, 46); g.fillRect(x - 16, y - 46, 32, 4);
    g.strokeStyle = '#9a9aa6'; g.lineWidth = 3;
    for (let i = 0; i < 4; i++) { const bx = x - 9 + i * 6; g.beginPath(); g.moveTo(bx, y - 40); g.lineTo(bx, y - 2); g.stroke(); }
    g.beginPath(); g.moveTo(x - 13, y - 22); g.lineTo(x + 13, y - 22); g.stroke();
    g.fillStyle = '#d4a93a'; g.beginPath(); g.arc(x, y - 22, 4, 0, TAU); g.fill();
    g.fillStyle = '#2a1e12'; g.fillRect(x - 1, y - 22, 2, 5);
    if (Math.floor(t * 2) % 3 === 0) { g.fillStyle = 'rgba(255,230,120,.8)'; LB.desenho.estrela(g, x + 6, y - 28, 2.5); }
  }

  function desenharCogumelo(g, p, t) {
    const x = p.x, y = p.y, k = 0.5 + 0.5 * Math.sin(t * 2 + p.tx);
    LB.desenho.sombraChao(g, x, y + 1, 10, 0.25);
    const gr = g.createRadialGradient(x, y - 10, 0, x, y - 10, 30); gr.addColorStop(0, `rgba(120,220,255,${0.25 + 0.15 * k})`); gr.addColorStop(1, 'rgba(120,220,255,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y - 10, 30, 0, TAU); g.fill();
    for (const [dx, r, h] of [[-7, 5, 10], [6, 7, 15], [0, 4, 7]]) {
      g.fillStyle = '#c9d8d3'; g.fillRect(x + dx - 1.5, y - h, 3, h);
      g.fillStyle = k > 0.5 ? '#8fe6ff' : '#6fc8e8'; g.beginPath(); g.ellipse(x + dx, y - h, r, r * 0.6, 0, Math.PI, TAU); g.fill();
      g.fillStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.arc(x + dx - r * 0.3, y - h - r * 0.25, 1.2, 0, TAU); g.fill();
    }
  }

  // ---------------- Mapa (área e mundo) ----------------
  const MUNDO = [
    { id: 'fazenda', nome: 'Fazendinha', x: 0.5, y: 0.83 },
    { id: 'floresta', nome: 'Floresta Sussurrante', x: 0.5, y: 0.63 },
    { id: 'gruta', nome: 'Gruta dos Ecos', x: 0.8, y: 0.56 },
    { id: 'ruinas', nome: 'Ruínas Encantadas', x: 0.4, y: 0.43 },
    { id: 'montanha', nome: 'Montanha de Brasa', x: 0.5, y: 0.24 },
    { id: 'covil', nome: 'Covil do Dragão', x: 0.58, y: 0.09 },
  ];
  const LIGACOES = [['fazenda', 'floresta'], ['floresta', 'gruta'], ['floresta', 'ruinas'], ['ruinas', 'montanha'], ['montanha', 'covil']];

  const CORES_TILE = {
    parede: '#2a2334', chao: '#8a8f7a', caminho: '#c9b48a', agua: '#4e93c9', lava: '#ff7a2a', fenda: '#120c10', predio: '#8a5f3c', barreira: '#a58cff', porta: '#d4a93a', grama: '#6aa84f', floresta: '#4f8a3f', ruinas: '#7f8878', montanha: '#6a5750', covil: '#4b403c', gruta: '#4f6470',
  };

  function corTile(c, tema) {
    if (c === '#' || c === 'T') return CORES_TILE.parede;
    if (c === ':' ) return CORES_TILE.caminho;
    if (c === 'w' || c === '~') return CORES_TILE.agua;
    if (c === 'L') return CORES_TILE.lava;
    if (c === 'j') return CORES_TILE.fenda;
    if ('HDBK'.includes(c)) return CORES_TILE.predio;
    if (c === 'Z') return CORES_TILE.barreira;
    if (c === 'g') return CORES_TILE.porta;
    if (c === 'X') return '#5a3a5a';
    if (c === 'R' || c === 'o' || c === 'I') return '#5f5a58';
    return CORES_TILE[tema] || CORES_TILE.chao;
  }

  function desenharMapaArea(cv, j, id) {
    const def = LB.MAPAS[id];
    if (!def) return;
    const g = cv.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = cv.clientWidth, H = cv.clientHeight;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = '#17121f'; g.fillRect(0, 0, W, H);
    const atual = j.mapa && j.mapa.id === id ? j.mapa : null;
    const linhas = atual ? atual.l.map((r) => r.join('')) : def.linhas;
    const mw = Math.max(...linhas.map((r) => r.length)), mh = linhas.length;
    const esc = Math.min((W - 16) / mw, (H - 16) / mh);
    const ox = (W - mw * esc) / 2, oy = (H - mh * esc) / 2;
    const gr = atual ? grade(j) : null;
    const hex = (j.flags.vistos || {})[id];
    const vistoAqui = (tx, ty) => {
      if (gr) return visto(j, gr, tx, ty);
      if (!hex) return false;
      const gw = Math.ceil(mw / CEL), i = Math.floor(ty / CEL) * gw + Math.floor(tx / CEL);
      return !!((parseInt(hex[i >> 2] || '0', 16) >> (i & 3)) & 1);
    };
    const tema = def.tema;
    for (let ty = 0; ty < mh; ty++) for (let tx = 0; tx < mw; tx++) {
      const c = linhas[ty][tx] || '.';
      if (!vistoAqui(tx, ty)) { g.fillStyle = '#1e1826'; g.fillRect(ox + tx * esc, oy + ty * esc, esc + 0.5, esc + 0.5); continue; }
      g.fillStyle = corTile(c, tema); g.fillRect(ox + tx * esc, oy + ty * esc, esc + 0.5, esc + 0.5);
    }
    // Ícones.
    const P = (tx, ty) => [ox + (tx + 0.5) * esc, oy + (ty + 0.5) * esc];
    const r = Math.max(3, esc * 0.9);
    const bussola = qtd(j, 'bussola') > 0;
    const abertos = j.flags.baus || [];
    const icone = (x, y, tipo, extra) => {
      g.save(); g.translate(x, y);
      if (tipo === 'bau') {
        g.fillStyle = extra ? '#6d5a45' : '#ffd166'; g.strokeStyle = '#2a1e12'; g.lineWidth = 1;
        g.fillRect(-r, -r * 0.7, 2 * r, 1.4 * r); g.strokeRect(-r, -r * 0.7, 2 * r, 1.4 * r);
        if (!extra) { g.fillStyle = '#2a1e12'; g.fillRect(-1, -2, 2, 3); }
      } else if (tipo === 'fonte') { g.fillStyle = '#7fd6ff'; g.beginPath(); g.arc(0, 0, r * 0.9, 0, TAU); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(0, -1, r * 0.35, 0, TAU); g.fill(); }
      else if (tipo === 'placa') { g.fillStyle = '#c99a5b'; g.fillRect(-r * 0.7, -r * 0.6, 1.4 * r, r); g.fillStyle = '#6e4a2c'; g.fillRect(-1, 0, 2, r); }
      else if (tipo === 'altar') { g.fillStyle = extra ? '#7fa9bf' : '#e8fbff'; LB.desenho.estrela(g, 0, 0, r * 1.1); }
      else if (tipo === 'cristal') { g.fillStyle = extra ? '#c9f4ff' : '#6f6484'; g.beginPath(); g.moveTo(0, -r); g.lineTo(r * 0.7, 0); g.lineTo(0, r); g.lineTo(-r * 0.7, 0); g.closePath(); g.fill(); }
      else if (tipo === 'tocha') { g.fillStyle = extra ? '#ffb347' : '#7a6558'; g.beginPath(); g.arc(0, 0, r * 0.7, 0, TAU); g.fill(); }
      else if (tipo === 'porta') { g.fillStyle = '#ffd166'; g.beginPath(); g.arc(0, -r * 0.3, r * 0.5, 0, TAU); g.fill(); g.fillRect(-1, -r * 0.3, 2, r); }
      else if (tipo === 'pista') { g.fillStyle = '#f5e9c8'; g.fillRect(-r * 0.6, -r * 0.8, 1.2 * r, 1.6 * r); g.fillStyle = '#b89b6a'; g.fillRect(-r * 0.4, -r * 0.4, 0.8 * r, 1); g.fillRect(-r * 0.4, 0, 0.8 * r, 1); }
      else if (tipo === 'item') { g.fillStyle = extra || '#fff'; g.beginPath(); g.arc(0, 0, r * 0.7, 0, TAU); g.fill(); }
      else if (tipo === 'mago') { g.fillStyle = '#9ec5ff'; LB.desenho.estrela(g, 0, 0, r * 1.2); }
      else if (tipo === 'golem') { g.fillStyle = '#b8b09a'; g.fillRect(-r, -r, 2 * r, 2 * r); g.fillStyle = '#7fd6ff'; g.fillRect(-2, -2, 4, 4); }
      else if (tipo === 'bell') { g.fillStyle = '#ffd166'; g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fill(); LB.desenho.coracaoForma(g, 0, 0, r * 0.7, '#ff4d6d'); }
      g.restore();
    };
    const props = atual ? atual.props : propsDe(def);
    for (const p of props) {
      const [x, y] = P(p.tx, p.ty);
      const vis = vistoAqui(p.tx, p.ty);
      if (p.tipo === 'bau') { const ab = p.aberto || abertos.includes(id + ':' + p.tx + ',' + p.ty) || (p.conteudo === 'espada' && j.flags.espada); if (vis || (bussola && !ab)) icone(x, y, 'bau', ab); }
      else if (p.tipo === 'tocha' && (j.flags.montanhaVista || vis)) { const acesa = p.aceso || (j.flags.luz || []).includes(id + ':' + p.tx + ',' + p.ty); if (!acesa && Math.floor(performance.now() / 400) % 2) { g.strokeStyle = '#ffb347'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, r * 1.8, 0, TAU); g.stroke(); } icone(x, y, 'tocha', acesa); }
      else if (!vis) continue;
      else if (p.tipo === 'fonte') icone(x, y, 'fonte');
      else if (p.tipo === 'placa') icone(x, y, 'placa');
      else if (p.tipo === 'altar') icone(x, y, 'altar', !!j.flags.magia);
      else if (p.tipo === 'cristal') icone(x, y, 'cristal', p.aceso || (j.flags.luz || []).includes(id + ':' + p.tx + ',' + p.ty));
      else if (p.tipo === 'tocha') icone(x, y, 'tocha', p.aceso || (j.flags.luz || []).includes(id + ':' + p.tx + ',' + p.ty));
      else if (p.tipo === 'porta') icone(x, y, 'porta');
    }
    for (const it of def.chao || []) {
      if ((j.flags.pegos || []).includes(id + ':' + it.x + ',' + it.y) || !vistoAqui(it.x, it.y)) continue;
      const [x, y] = P(it.x, it.y);
      icone(x, y, it.doc ? 'pista' : 'item', it.item && ITENS[it.item] && ITENS[it.item].cor);
    }
    for (const e of def.exames || []) {
      if ((j.flags.exames || []).includes(e.id) || !vistoAqui(e.x, e.y) || (e.requer && !j.flags[e.requer])) continue;
      const [x, y] = P(e.x, e.y); icone(x, y, 'pista');
    }
    if (id === 'floresta' && vistoAqui(7, 13)) { const [x, y] = P(7, 13); icone(x, y, 'mago'); }
    if (def.golem && !j.flags.golem && vistoAqui(def.golem.x, def.golem.y)) { const [x, y] = P(def.golem.x, def.golem.y); icone(x, y, 'golem'); }
    if (def.jaula && vistoAqui(def.jaula.x, def.jaula.y)) { const [x, y] = P(def.jaula.x, def.jaula.y); icone(x, y, 'bell'); }
    // Saídas (setas com o nome do lugar).
    g.font = `700 ${Math.max(9, Math.min(12, esc * 1.6))}px system-ui, sans-serif`; g.textAlign = 'center';
    for (const s of def.saidas || []) {
      const cx = s.x + s.w / 2, cy = s.y + s.h / 2;
      if (!vistoAqui(Math.floor(cx), Math.min(mh - 1, Math.max(0, s.y + (s.y === 0 ? 1 : -1))))) continue;
      const [x, y] = P(cx - 0.5, cy - 0.5);
      const cima = s.y === 0, baixo = s.y >= mh - 1, dir = !cima && !baixo && s.x >= mw - 2;
      g.fillStyle = '#ffe9a8';
      g.beginPath();
      if (cima) { g.moveTo(x, y - esc); g.lineTo(x - esc, y + esc * 0.5); g.lineTo(x + esc, y + esc * 0.5); }
      else if (baixo) { g.moveTo(x, y + esc); g.lineTo(x - esc, y - esc * 0.5); g.lineTo(x + esc, y - esc * 0.5); }
      else if (dir) { g.moveTo(x + esc, y); g.lineTo(x - esc * 0.5, y - esc); g.lineTo(x - esc * 0.5, y + esc); }
      else { g.moveTo(x - esc, y); g.lineTo(x + esc * 0.5, y - esc); g.lineTo(x + esc * 0.5, y + esc); }
      g.closePath(); g.fill();
      const nome = (LB.MAPAS[s.para] || {}).nome || s.para;
      g.fillStyle = '#ffe9a8';
      const ty = cima ? y + esc * 2.4 : baixo ? y - esc * 1.4 : y + esc * 2.2;
      const tx = Math.max(40, Math.min(W - 40, x));
      g.fillText(nome + (s.requer && !j.flags[s.requer] ? ' 🔒' : ''), tx, ty);
    }
    // Fonte de retorno.
    const cp = j.flags.checkpoint;
    if (cp && cp.area === id) { const [x, y] = P(cp.x - 0.5, cp.y - 1.3); g.strokeStyle = '#7fd6ff'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, r * 1.6, 0, TAU); g.stroke(); }
    // A Line.
    if (atual && j.line) {
      const x = ox + j.line.x / TILE * esc, y = oy + j.line.y / TILE * esc;
      const k = 0.5 + 0.5 * Math.sin(performance.now() / 250);
      g.fillStyle = `rgba(255,111,159,${0.25 + 0.2 * k})`; g.beginPath(); g.arc(x, y, r * 2.2 + k * 3, 0, TAU); g.fill();
      g.fillStyle = '#ff6f9f'; g.strokeStyle = '#fff'; g.lineWidth = 1.5; g.beginPath(); g.arc(x, y, r * 1.1, 0, TAU); g.fill(); g.stroke();
    }
  }

  // Props de uma área que não está carregada (para ver o mapa de outro lugar).
  const cacheProps = {};
  function propsDe(def) {
    if (cacheProps[def.nome]) return cacheProps[def.nome];
    const lista = [];
    def.linhas.forEach((linha, ty) => { for (let tx = 0; tx < linha.length; tx++) {
      const c = linha[tx];
      const tipo = { C: 'bau', U: 'fonte', S: 'placa', A: 'altar', Q: 'cristal', Y: 'tocha', g: 'porta' }[c];
      if (tipo) lista.push({ tipo, tx, ty, conteudo: tipo === 'bau' ? (def.baus || {})[tx + ',' + ty] : null });
    } });
    return (cacheProps[def.nome] = lista);
  }

  function contagens(j, id) {
    const def = LB.MAPAS[id];
    const props = propsDe(def);
    const baus = props.filter((p) => p.tipo === 'bau');
    const abertos = baus.filter((p) => (j.flags.baus || []).includes(id + ':' + p.tx + ',' + p.ty) || (p.conteudo === 'espada' && j.flags.espada)).length;
    const pistasAqui = ORDEM_PISTAS.filter((k) => (PISTAS[k].onde || '').startsWith(def.nome.split(' ')[0]));
    const achadas = pistasAqui.filter((k) => temPista(j, k)).length;
    return { baus: baus.length, abertos, pistas: pistasAqui.length, achadas, explorado: porcentagem(j, id) };
  }

  function desenharMundo(cv, j) {
    const g = cv.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = cv.clientWidth, H = cv.clientHeight;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Pergaminho.
    g.fillStyle = '#e9d8b4'; g.fillRect(0, 0, W, H);
    g.fillStyle = 'rgba(120,90,50,.08)';
    for (let i = 0; i < 60; i++) { const s = LB.ruido(i, 3, 7); g.beginPath(); g.arc(LB.ruido(i, 1, 7) * W, LB.ruido(i, 2, 7) * H, 10 + s * 40, 0, TAU); g.fill(); }
    const grad = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H); grad.addColorStop(0, 'rgba(0,0,0,0)'); grad.addColorStop(1, 'rgba(90,60,30,.35)');
    g.fillStyle = grad; g.fillRect(0, 0, W, H);
    const vistos = j.flags.vistos || {};
    const conhecido = (id) => !!vistos[id] || (j.flags.mapaRevelado && ['montanha', 'covil', 'gruta'].includes(id)) || id === 'fazenda';
    const pos = (n) => [n.x * W, n.y * H];
    const atual = j.mapa ? j.mapa.id : null;
    // Caminhos.
    g.setLineDash([6, 5]); g.lineWidth = 3; g.strokeStyle = 'rgba(90,60,30,.6)';
    for (const [a, b] of LIGACOES) {
      const na = MUNDO.find((n) => n.id === a), nb = MUNDO.find((n) => n.id === b);
      if (!conhecido(a) && !conhecido(b)) continue;
      const [x1, y1] = pos(na), [x2, y2] = pos(nb);
      g.beginPath(); g.moveTo(x1, y1); g.quadraticCurveTo((x1 + x2) / 2 + 20, (y1 + y2) / 2, x2, y2); g.stroke();
    }
    g.setLineDash([]);
    const pequeno = W < 520;
    for (const n of MUNDO) {
      const [x, y] = pos(n);
      const sabe = conhecido(n.id);
      const vizinho = LIGACOES.some(([a, b]) => (a === n.id && conhecido(b)) || (b === n.id && conhecido(a)));
      if (!sabe && !vizinho) continue;
      const R = pequeno ? 16 : 22;
      if (n.id === atual) { const k = 0.5 + 0.5 * Math.sin(performance.now() / 300); g.strokeStyle = `rgba(255,111,159,${0.5 + 0.4 * k})`; g.lineWidth = 4; g.beginPath(); g.arc(x, y, R + 6 + k * 3, 0, TAU); g.stroke(); }
      g.fillStyle = sabe ? { fazenda: '#8bc36a', floresta: '#4f8a3f', gruta: '#5f7f9a', ruinas: '#9aa691', montanha: '#a06a52', covil: '#5a3d44' }[n.id] : '#c9b58f';
      g.strokeStyle = '#4a3320'; g.lineWidth = 2.5;
      g.beginPath(); g.arc(x, y, R, 0, TAU); g.fill(); g.stroke();
      g.fillStyle = '#3a2718'; g.font = `700 ${pequeno ? 11 : 13}px system-ui, sans-serif`; g.textAlign = 'center';
      if (!sabe) { g.font = `700 ${R}px system-ui`; g.fillText('?', x, y + R * 0.38); g.font = `700 ${pequeno ? 11 : 13}px system-ui, sans-serif`; g.fillText('Lugar desconhecido', x, y + R + 16); continue; }
      const emb = { fazenda: '🏡', floresta: '🌲', gruta: '🕳️', ruinas: '🏛️', montanha: '🌋', covil: '🐉' }[n.id];
      g.font = `${R}px system-ui`; g.fillText(emb, x, y + R * 0.38);
      g.font = `700 ${pequeno ? 11 : 13}px system-ui, sans-serif`; g.fillText(n.nome, x, y + R + 16);
      const c = contagens(j, n.id);
      g.font = `${pequeno ? 10 : 11}px system-ui, sans-serif`; g.fillStyle = '#5a4630';
      const partes = [`${c.explorado}% explorado`];
      if (c.baus) partes.push(`baús ${c.abertos}/${c.baus}`);
      if (c.pistas) partes.push(`pistas ${c.achadas}/${c.pistas}`);
      g.fillText(partes.join(' · '), x, y + R + 30);
    }
    g.fillStyle = '#5a4630'; g.font = `italic ${pequeno ? 10 : 12}px serif`; g.textAlign = 'left';
    g.fillText(j.flags.mapaRevelado ? 'Mapa completo (com o mapa rasgado)' : 'Os lugares aparecem conforme a Line explora.', 12, H - 12);
  }

  // ---------------- Tela da mochila ----------------
  const tela = {
    aba: 'itens', sel: null, pista: null, mapaModo: 'area', mapaArea: null, aberta: false, rodando: false,
    ligar(j) {
      this.j = j;
      for (const b of document.querySelectorAll('#mochila nav button')) b.onclick = () => this.mostrarAba(b.dataset.aba);
      $('#btn-fechar-mochila').onclick = () => this.fechar();
      $('#btn-usar-item').onclick = () => this.usarSelecionado();
      $('#btn-mapa-area').onclick = () => { this.mapaModo = 'area'; this.atualizarMapa(); };
      $('#btn-mapa-mundo').onclick = () => { this.mapaModo = 'mundo'; this.atualizarMapa(); };
      const bm = $('#b-mochila'); if (bm) bm.addEventListener('click', () => { if (j.estado === 'jogo') this.abrir('itens'); });
      const bp = $('#b-pocao'); if (bp) bp.addEventListener('click', () => { if (j.estado === 'jogo' && !j.cena) usarCuraRapida(j); });
      const pm = $('#btn-pausa-mochila'); if (pm) pm.onclick = () => { $('#pausa').classList.add('oculto'); this.abrir('itens', true); };
      const pmap = $('#btn-pausa-mapa'); if (pmap) pmap.onclick = () => { $('#pausa').classList.add('oculto'); this.abrir('mapa', true); };
    },

    podeAbrir() { const j = this.j; return j.mapa && j.mapa.tema !== 'encontro' && (j.estado === 'jogo' || j.estado === 'pausa') && !(j.line && j.line.estado === 'morta'); },

    abrir(aba, daPausa) {
      const j = this.j;
      if (!this.podeAbrir()) return;
      this.daPausa = !!daPausa;
      j.estado = 'mochila';
      this.aberta = true;
      inv(j).novos = 0; atualizarBotoes(j);
      $('#mochila').classList.remove('oculto');
      $('#toque').classList.add('oculto');
      this.mostrarAba(aba || 'itens');
      j.salvar();
    },

    fechar() {
      const j = this.j;
      if (!this.aberta) return;
      this.aberta = false; this.rodando = false;
      $('#mochila').classList.add('oculto');
      if (this.daPausa) { j.estado = 'pausa'; $('#pausa').classList.remove('oculto'); }
      else { j.estado = 'jogo'; }
      LB.entrada.limpar();
    },

    alternar(aba) { if (this.aberta) { if (this.aba === aba) this.fechar(); else this.mostrarAba(aba); } else this.abrir(aba); },

    mostrarAba(aba) {
      this.aba = aba;
      for (const b of document.querySelectorAll('#mochila nav button')) b.classList.toggle('sel', b.dataset.aba === aba);
      for (const s of document.querySelectorAll('#mochila .aba')) s.classList.toggle('oculto', s.id !== 'aba-' + aba);
      if (aba === 'itens') this.atualizarItens();
      else if (aba === 'pistas') this.atualizarPistas();
      else this.atualizarMapa();
      this.rodando = aba === 'mapa';
      if (this.rodando) { const passo = () => { if (!this.rodando || !this.aberta) return; this.desenharMapa(); requestAnimationFrame(passo); }; requestAnimationFrame(passo); }
    },

    atualizarItens() {
      const j = this.j, i = inv(j);
      const grid = $('#itens-grade'); grid.innerHTML = '';
      const ids = Object.keys(ITENS).filter((id) => i.itens[id] > 0);
      if (!ids.length) grid.innerHTML = '<p class="vazio">A mochila está vazia. Procure baús e itens brilhando pelo caminho.</p>';
      if (this.sel && !i.itens[this.sel]) this.sel = null;
      if (!this.sel && ids.length) this.sel = ids[0];
      for (const id of ids) {
        const it = ITENS[id];
        const b = document.createElement('button');
        b.className = 'slot' + (id === this.sel ? ' sel' : '');
        b.innerHTML = `<span class="ic">${it.icone}</span><span class="nm">${it.nome}</span><span class="qt">×${i.itens[id]}</span>`;
        b.onclick = () => { this.sel = id; this.atualizarItens(); };
        grid.appendChild(b);
      }
      const det = $('#item-detalhe');
      if (!this.sel) { det.classList.add('oculto'); return; }
      det.classList.remove('oculto');
      const it = ITENS[this.sel];
      $('#item-nome').textContent = `${it.icone} ${it.nome}`;
      $('#item-desc').textContent = it.desc;
      const bu = $('#btn-usar-item');
      bu.classList.toggle('oculto', !it.usar);
      bu.textContent = 'Usar';
      $('#item-msg').textContent = it.tipo === 'chave' ? 'Use nas portas trancadas: chegue perto e aperte o botão que aparecer.' : it.tipo === 'especial' ? 'Funciona sozinha, só de estar na mochila.' : '';
      const l = j.line;
      $('#item-vida').textContent = l ? `Vida: ${Math.ceil(l.hp / 2 * 10) / 10}/${l.hpMax / 2} ❤ ${j.flags.magia ? ` · Magia: ${Math.floor(l.mana)}/${l.manaMax} ◆` : ''}` : '';
    },

    usarSelecionado() {
      const j = this.j;
      if (!this.sel) return;
      const r = usar(j, this.sel);
      $('#item-msg').textContent = r.ok ? `${ITENS[this.sel].nome} usada!` : r.motivo;
      this.atualizarItens();
      if (r.ok) $('#item-msg').textContent = `${ITENS[this.sel] ? ITENS[this.sel].nome : 'Item'} usada!`;
    },

    atualizarPistas() {
      const j = this.j, i = inv(j);
      $('#pistas-objetivo').innerHTML = `<b>Objetivo agora</b><div>${objetivo(j) || 'Cuidar da fazendinha com a Bell.'}</div>`;
      $('#pistas-total').textContent = `${i.pistas.length} de ${totalPistas()} pistas encontradas` + (i.pistas.length >= totalPistas() ? ' · Caderno completo!' : '');
      const lista = $('#pistas-lista'); lista.innerHTML = '';
      for (const id of ORDEM_PISTAS) {
        const p = PISTAS[id], tem = i.pistas.includes(id);
        const b = document.createElement('button');
        b.className = 'pista' + (tem ? '' : ' falta') + (this.pista === id ? ' sel' : '');
        b.innerHTML = `<span class="ic">${tem ? p.icone : '❔'}</span><span class="nm">${tem ? p.titulo : 'Pista não encontrada'}</span><span class="onde">${tem ? p.onde : '???'}</span>`;
        if (tem) b.onclick = () => { this.pista = id; this.atualizarPistas(); };
        lista.appendChild(b);
      }
      const leitor = $('#pista-leitor');
      if (!this.pista || !i.pistas.includes(this.pista)) { this.pista = i.pistas[i.pistas.length - 1] || null; }
      if (!this.pista) { leitor.classList.add('oculto'); return; }
      leitor.classList.remove('oculto');
      const p = PISTAS[this.pista];
      $('#pista-titulo').textContent = `${p.icone} ${p.titulo}`;
      $('#pista-onde').textContent = p.onde;
      $('#pista-texto').textContent = p.texto;
    },

    atualizarMapa() {
      const j = this.j;
      if (!this.mapaArea || !(j.flags.vistos || {})[this.mapaArea]) this.mapaArea = j.mapa ? j.mapa.id : 'fazenda';
      $('#btn-mapa-area').classList.toggle('sel', this.mapaModo === 'area');
      $('#btn-mapa-mundo').classList.toggle('sel', this.mapaModo === 'mundo');
      const sel = $('#mapa-areas'); sel.innerHTML = '';
      const vistos = j.flags.vistos || {};
      for (const n of MUNDO) {
        if (!vistos[n.id] && !(j.mapa && j.mapa.id === n.id)) continue;
        const b = document.createElement('button');
        b.className = 'chip' + (this.mapaArea === n.id ? ' sel' : ''); b.textContent = n.nome;
        b.onclick = () => { this.mapaArea = n.id; this.mapaModo = 'area'; this.atualizarMapa(); };
        sel.appendChild(b);
      }
      sel.classList.toggle('oculto', this.mapaModo !== 'area');
      $('#mapa-legenda').classList.toggle('oculto', this.mapaModo !== 'area');
      const c = this.mapaModo === 'area' ? contagens(j, this.mapaArea) : null;
      $('#mapa-info').textContent = c ? `${LB.MAPAS[this.mapaArea].nome}: ${c.explorado}% explorado · baús ${c.abertos}/${c.baus}${c.pistas ? ` · pistas ${c.achadas}/${c.pistas}` : ''}${qtd(j, 'bussola') ? ' · 🧭 bússola ativa' : ''}` : 'Mapa do mundo';
      this.desenharMapa();
    },

    desenharMapa() {
      const cv = $('#mapa-canvas');
      if (this.mapaModo === 'area') desenharMapaArea(cv, this.j, this.mapaArea); else desenharMundo(cv, this.j);
    },
  };

  // Teclas: I (itens), M (mapa), Esc fecha, H usa cura rápida.
  document.addEventListener('keydown', (e) => {
    const j = tela.j;
    if (!j) return;
    if (e.code === 'KeyI' || e.code === 'KeyM') {
      if (j.estado === 'jogo' && j.cena) return;
      if (j.estado !== 'jogo' && j.estado !== 'mochila') return;
      e.preventDefault(); tela.alternar(e.code === 'KeyI' ? 'itens' : 'mapa');
    } else if (e.code === 'Escape' && j.estado === 'mochila') { e.preventDefault(); e.stopPropagation(); tela.fechar(); }
    else if (e.code === 'KeyH' && j.estado === 'jogo' && !j.cena && j.line && j.line.estado !== 'morta' && j.flags.prologo) { e.preventDefault(); usarCuraRapida(j); }
  });

  LB.mochila = { ITENS, PISTAS, ORDEM_PISTAS, inv, qtd, dar, tirar, usar, usarCuraRapida, temPista, darPista, totalPistas, objetivo, explorar, grade, visto, porcentagem, aviso, atualizarPainel, atualizarBotoes, desenharHud, desenharItemChao, desenharPorta, desenharCogumelo, tela, contagens };
})(window.LB);
