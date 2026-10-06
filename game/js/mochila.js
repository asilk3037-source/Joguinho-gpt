'use strict';

// Mochila da Line: itens (cada um com uma função), moedas, item equipado, documentos de
// investigação com conclusões, mapa com névoa (área e mundo), objetivo atual e avisos.
(function (LB) {
  const TILE = LB.TILE;
  const $ = (s) => document.querySelector(s);
  const TAU = Math.PI * 2;

  // ---------------- Catálogo de itens: um item, uma função ----------------
  // tipo: consumivel (gasta ao usar) · ferramenta (funciona sozinha, fica para sempre) · chave · historia.
  // equipavel: pode ficar no atalho F (ou no botão do item no celular).
  const ITENS = {
    pocao: { nome: 'Poção de Vida', icone: '🧪', cor: '#ff6f9f', tipo: 'consumivel', equipavel: true, desc: 'Cura 2 corações. Use pela mochila, pela cura rápida (H) ou deixe equipada (F).', usar: (j) => curar(j, 4) },
    elixir: { nome: 'Elixir de Luz', icone: '💧', cor: '#7fd6ff', tipo: 'consumivel', equipavel: true, desc: 'Enche toda a magia de uma vez.', usar: (j) => {
      const l = j.line;
      if (!l.temMagia) return { ok: false, motivo: 'A Line ainda não sabe magia.' };
      if (l.mana >= l.manaMax) return { ok: false, motivo: 'A magia já está cheia.' };
      l.mana = l.manaMax; j.particulas.emitir('brilho', l.x, l.y - 40, 12, { vel: 60, vida: 0.7, r: 5 });
      return { ok: true };
    } },
    bomba: { nome: 'Bomba', icone: '💣', cor: '#3a3a44', tipo: 'consumivel', equipavel: true, desc: 'Explode 2 segundos depois de colocada: quebra paredes e pedras rachadas e fere inimigos em volta. Afaste-se! Equipe e use com F.', usar: (j) => LB.mundo.colocarBomba(j) },
    pena: { nome: 'Pena de Fênix', icone: '🪶', cor: '#ff9a3c', tipo: 'consumivel', desc: 'Se a Line cair, a pena queima e ela se levanta com metade da vida. Funciona sozinha.' },
    chave: { nome: 'Chave antiga', icone: '🗝️', cor: '#d4a93a', tipo: 'chave', desc: 'Abre uma porta trancada e some. Há três portas trancadas pelo mundo.' },
    lanterna: { nome: 'Lanterna', icone: '🏮', cor: '#ffcf6b', tipo: 'ferramenta', desc: 'Clareia as galerias escuras das Minas de Cristal. Funciona sozinha.' },
    gancho: { nome: 'Gancho', icone: '🪝', cor: '#b8c2cc', tipo: 'ferramenta', desc: 'Perto de um poste de gancho, puxa a Line até o outro poste, por cima de rios e abismos.' },
    bussola: { nome: 'Bússola do Mago', icone: '🧭', cor: '#9ec5ff', tipo: 'ferramenta', desc: 'Marca no mapa os baús que ainda não foram abertos, mesmo onde a Line ainda não passou.' },
    botas: { nome: 'Botas de Andarilha', icone: '👢', cor: '#a8764a', tipo: 'ferramenta', desc: 'A Line corre mais rápido e não tropeça mais nas raízes.' },
    alavanca: { nome: 'Alavanca de Ferro', icone: '⚙️', cor: '#9aa3ad', tipo: 'historia', desc: 'A alavanca do freio do carrinho de mina. Com ela encaixada, o carrinho volta a andar entre as estações.' },
    // Parte 2: presentes dos guardiões libertados (com duas, o Seu Bento forja a Armadura da Aurora da Bell).
    escamaTerra: { nome: 'Escama da Terra', icone: '🟢', cor: '#6d8f3a', tipo: 'historia', desc: 'Presente do Colosso libertado. Cheira a chuva no mato. O Seu Bento sabe usar escamas de guardião.' },
    escamaAgua: { nome: 'Escama da Água', icone: '🔵', cor: '#3f8fd6', tipo: 'historia', desc: 'Presente da Serpente libertada. Sempre molhadinha e fresca. O Seu Bento sabe usar escamas de guardião.' },
    escamaAr: { nome: 'Pena-escama do Ar', icone: '⚪', cor: '#dfe8f0', tipo: 'historia', desc: 'Presente do Grifo libertado. Leve como nuvem. O Seu Bento sabe usar escamas de guardião.' },
  };
  const ORDEM_ITENS = ['pocao', 'elixir', 'bomba', 'pena', 'chave', 'lanterna', 'gancho', 'bussola', 'botas', 'alavanca', 'escamaTerra', 'escamaAgua', 'escamaAr'];

  function curar(j, qtd) {
    const l = j.line;
    if (l.hp >= l.hpMax) return { ok: false, motivo: 'A vida já está cheia.' };
    l.hp = Math.min(l.hpMax, l.hp + qtd);
    j.particulas.emitir('coracao', l.x, l.y - 50, 4, { vel: 35, vida: 1.1 });
    if (l.estado === 'livre') l.anim.tocar(l.animParada(), true);
    return { ok: true };
  }

  // ---------------- Documentos de investigação ----------------
  // Cada documento conta um pedaço da história do dragão. `marca` põe um alfinete no mapa (sem acender a área).
  const PISTAS = {
    pegadas: { tipo: 'anotacao', titulo: 'Marcas de garra no píer', icone: '🐾', autor: 'Anotação da Line', data: 'Ontem, depois do pôr do sol', onde: 'Fazendinha, no píer do lago', texto: 'Três riscos fundos na madeira do píer, e um rastro de brasa apagada apontando para o norte, na direção da floresta.\n\nNão tem sangue em lugar nenhum. Ele levou a Bell, não machucou. Ela está viva.\n\nAnotei a direção. Eu vou atrás.' },
    cartaz: { tipo: 'cartaz', titulo: 'Cartaz do vilarejo', icone: '📌', autor: 'Conselho do Vilarejo do Riacho', data: 'Pregado hoje de manhã', onde: 'Vilarejo do Riacho, no quadro de avisos', marca: { area: 'floresta', x: 7, y: 13, rotulo: 'Clareira do Mago' }, texto: 'PROCURA-SE quem viu um dragão vermelho voando baixo sobre o riacho ontem, ao pôr do sol.\n\nOs mais velhos contam que isso já aconteceu há cem anos, e que só o velho Mago da Floresta Sussurrante sabe o que fazer. Ele mora na clareira a oeste da trilha.\n\nA Dona Rosa vende poções e bombas para a viagem. O Seu Bento forja armaduras. Coragem, vizinhos!' },
    carta: { tipo: 'carta', titulo: 'Carta do Mago', icone: '✉️', autor: 'O Mago', data: 'Sem data', onde: 'Floresta Sussurrante, baú na clareira do Mago', marca: { area: 'gruta', x: 7, y: 13, rotulo: 'Gruta dos Ecos' }, texto: 'Para quem encontrar esta carta:\n\nO dragão vermelho dorme há cem anos na Montanha de Brasa. Quando acorda, leva o que mais brilha aos olhos dele. Selou a montanha com magia antiga: só a luz das Ruínas Encantadas atravessa o selo.\n\nHá também uma gruta a leste desta floresta, onde guardei coisas que podem ajudar.\n\n— O Mago' },
    cacador: { tipo: 'anotacao', titulo: 'Bilhete do caçador', icone: '🪓', autor: 'Tobias, caçador da floresta', data: 'Ontem à noite', onde: 'Floresta Sussurrante, na porta da cabana a leste', marca: { area: 'montanha', x: 17, y: 2, rotulo: 'Topo da montanha' }, texto: 'Lurdes, se você achar este bilhete antes de mim: não se preocupe.\n\nAo pôr do sol, o clarão vermelho passou por cima da cabana carregando alguém: uma moça de óculos, gritando um nome. Foi direto para o topo da Montanha de Brasa.\n\nVou subir atrás dele para ver onde ele pousa. Volto logo.\n\nSe outra pessoa ler isto: o caminho mais curto até a montanha passa pelas Ruínas. As Minas, a leste, também chegam lá, para quem tiver luz e coragem.' },
    lenda: { tipo: 'pergaminho', titulo: 'A lenda da Montanha', icone: '📜', autor: 'Autor desconhecido', data: 'Há cem anos', onde: 'Gruta dos Ecos, pergaminho perto da fonte', texto: 'A cada cem anos o dragão desperta com fome de luz. Leva para o covil a pessoa de coração mais brilhante e a guarda numa jaula de ferro.\n\nOs antigos diziam que o fogo dele esfria enquanto ele dorme, e que é o frio que o acorda. Ninguém nunca perguntou por quê.\n\nDizem também que o dragão não teme a espada: teme a luz, que o cansa. E quando cansa, o peito dele se abre.' },
    mapa: { tipo: 'mapa', titulo: 'Mapa rasgado', icone: '🗺️', autor: 'Cartógrafo das minas', data: 'Há cem anos', onde: 'Gruta dos Ecos, sala trancada', marca: { area: 'montanha', x: 68, y: 15, rotulo: 'X vermelho da Forja' }, texto: 'Um pedaço de mapa antigo. Mostra a Montanha de Brasa: um portão de fogo guardado por três tochas e, depois dele, o covil no topo.\n\nNa encosta leste, uma porta de ferro esconde uma caverna. E há um X vermelho numa sala chamada Forja Antiga.' },
    minerador: { tipo: 'relatorio', titulo: 'Relatório do capataz', icone: '🛤️', autor: 'Mestre Ivo, capataz das Minas de Cristal', data: 'Há cinquenta anos', onde: 'Minas de Cristal, perto da estação', marca: { area: 'montanha', x: 68, y: 15, rotulo: 'Alavanca de Ferro' }, texto: 'RELATÓRIO FINAL.\n\nA linha do carrinho liga três estações: Vilarejo, Minas e Forja.\n\nA montanha anda quente demais. Nas galerias fundas aparecem sombras, e à noite se ouve alguma coisa enorme respirando lá em cima. Os velhos dizem que é o dragão se revirando no sono, tremendo.\n\nFechei a mina. Levei a Alavanca de Ferro do freio para a Forja Antiga, com o Mestre Aurélio, para ninguém se arriscar nos trilhos.\n\nQuem a trouxer de volta pode viajar de novo: basta encaixar a alavanca numa estação.' },
    diario1: { tipo: 'diario', titulo: 'Diário do Guardião, página 1', icone: '📖', autor: 'O Guardião de Pedra', data: 'Há mil anos', onde: 'Ruínas Encantadas, no chão perto do altar', texto: 'Fui feito de pedra para guardar a luz.\n\nOs cristais do templo são minhas chaves: acesos, as barreiras caem.\n\nSe alguém chegar aqui com um coração corajoso, que a luz do altar o escolha.' },
    diario2: { tipo: 'diario', titulo: 'Diário do Guardião, página 2', icone: '📖', autor: 'O Guardião de Pedra', data: 'Há mil anos', onde: 'Ruínas Encantadas, biblioteca trancada', texto: 'O dragão tem medo da Chuva de Estrelas. Quando as estrelas caem em volta dele, o fogo dele apaga por um instante.\n\nGuardo essa magia no meu peito. Só a entrego para quem me vencer sem ódio.' },
    receita: { tipo: 'receita', titulo: 'Receita da Armadura de Brasa', icone: '📋', autor: 'Mestre Aurélio, ferreiro da forja', data: 'Há cinquenta anos', onde: 'Montanha de Brasa, Forja Antiga', marca: { area: 'vilarejo', x: 44, y: 9, rotulo: 'Ferraria do Seu Bento' }, texto: 'Receita da Armadura de Brasa: cota de malha temperada no calor da montanha, com placas de cobre por cima.\n\nResiste à brasa rasa: quem a veste atravessa o chão em brasa sem se queimar.\n\nVou deixar a forja. A montanha esquentou demais, e o Ivo fechou as minas. Meu aprendiz, o jovem Bento, sabe fazer esta armadura: quem achar esta receita, leve até ele no vilarejo.' },
    escama: { tipo: 'objeto', titulo: 'Escama vermelha', icone: '🔥', autor: 'Anotação da Line', data: 'Hoje', onde: 'Montanha de Brasa, caverna escondida', texto: 'Uma escama do tamanho da minha mão. Fria. Um dragão de fogo, e a escama dele está fria.\n\nEstá rachada no meio. O peito dele é o lugar mais fraco, exatamente como a lenda diz.\n\nE ele perde escamas quando voa alto: então ele se cansa quando mergulha.' },
    fita: { tipo: 'objeto', titulo: 'Fita de cabelo da Bell', icone: '🎀', autor: 'Anotação da Line', data: 'Hoje', onde: 'Montanha de Brasa, perto do portão de fogo', texto: 'A fita azul que a Bell usava hoje de manhã.\n\nEla deixou cair de propósito, eu sei: é o jeito dela de dizer “tô aqui, vem me buscar”.\n\nFalta pouco, amor.' },
  };
  const ORDEM_PISTAS = ['pegadas', 'cartaz', 'carta', 'cacador', 'lenda', 'mapa', 'minerador', 'diario1', 'diario2', 'receita', 'escama', 'fita'];
  const TIPOS_DOC = { anotacao: 'Anotação', cartaz: 'Cartaz', carta: 'Carta', diario: 'Diário', pergaminho: 'Pergaminho', mapa: 'Mapa', relatorio: 'Relatório', receita: 'Receita', objeto: 'Objeto encontrado' };

  // Conclusões: a Line junta pistas e entende algo. Algumas mudam o jogo (efeito).
  const CONCLUSOES = [
    { id: 'viva', requer: ['pegadas', 'cacador'], texto: 'A Bell está viva: o dragão a levou para o topo da Montanha de Brasa.' },
    { id: 'luz', requer: ['carta', 'lenda'], texto: 'O dragão teme a luz. A magia das Ruínas é a arma certa contra ele.' },
    { id: 'guardiao', requer: ['diario1', 'diario2'], texto: 'Os cristais são as chaves das barreiras, e o Guardião guarda a Chuva de Estrelas no peito.' },
    { id: 'trilhos', requer: ['minerador', 'mapa'], texto: 'A Alavanca de Ferro está na Forja Antiga. Encaixada numa estação, o carrinho volta a andar.' },
    { id: 'brasa', requer: ['receita', 'cartaz'], texto: 'O Seu Bento, do vilarejo, sabe forjar a Armadura de Brasa: com ela, o chão em brasa não queima.', efeito: 'A Armadura de Brasa aparece na ferraria.' },
    { id: 'peito', requer: ['lenda', 'escama'], texto: 'Quando o dragão cansa, o peito racha e fica exposto. E o fogo lá dentro está fraco: ele está com frio.', efeito: 'Golpes no peito do dragão tiram 1 de vida a mais.' },
    { id: 'estrelas', requer: ['diario2', 'escama'], texto: 'A Chuva de Estrelas apaga o fogo do dragão por um instante.', efeito: 'A Chuva de Estrelas interrompe o fogo do dragão.' },
    { id: 'bell', requer: ['fita', 'mapa'], texto: 'A Bell deixou a fita de propósito: ela está logo depois do portão de fogo.' },
  ];

  // ---------------- Estado (fica dentro de jogo.flags, então é salvo) ----------------
  function inv(j) {
    const f = j.flags;
    if (!f.inv) f.inv = { itens: {}, pistas: [], novos: 0 };
    if (!f.inv.conclusoes) f.inv.conclusoes = [];
    return f.inv;
  }

  function qtd(j, id) { return inv(j).itens[id] || 0; }
  function tem(j, id) { return qtd(j, id) > 0; }
  function moedas(j) { return j.flags.moedas || 0; }

  function dar(j, id, n, silencioso) {
    const i = inv(j), it = ITENS[id];
    if (!it) return;
    const unico = it.tipo === 'ferramenta' || it.tipo === 'historia';
    i.itens[id] = unico ? 1 : (i.itens[id] || 0) + (n || 1);
    i.novos = (i.novos || 0) + 1;
    if (it.equipavel && !i.equipado) i.equipado = id;
    if (id === 'bomba' && i.equipado !== 'bomba' && !i.bombaVista) { i.equipado = 'bomba'; }
    if (id === 'bomba') i.bombaVista = true;
    if (!silencioso) aviso(`${it.icone} ${it.nome}${(n || 1) > 1 ? ' ×' + n : ''}`);
    atualizarBotoes(j);
  }

  function tirar(j, id, n) {
    const i = inv(j);
    i.itens[id] = Math.max(0, (i.itens[id] || 0) - (n || 1));
    if (!i.itens[id]) delete i.itens[id];
    atualizarBotoes(j);
  }

  function darMoedas(j, n, silencioso) {
    j.flags.moedas = Math.max(0, moedas(j) + n);
    if (!silencioso && n) aviso(`${n > 0 ? '+' : ''}${n} 🪙`);
    atualizarBotoes(j);
  }

  function temPista(j, id) { return inv(j).pistas.includes(id); }

  function darPista(j, id) {
    const i = inv(j);
    if (i.pistas.includes(id) || !PISTAS[id]) return false;
    i.pistas.push(id);
    i.novos = (i.novos || 0) + 1;
    aviso(`${PISTAS[id].icone} Documento: ${PISTAS[id].titulo}`);
    atualizarBotoes(j);
    return true;
  }

  // Confere se alguma conclusão nova se formou. Devolve a lista das novas.
  function verificarConclusoes(j) {
    const i = inv(j), novas = [];
    for (const c of CONCLUSOES) {
      if (i.conclusoes.includes(c.id) || !c.requer.every((d) => i.pistas.includes(d))) continue;
      i.conclusoes.push(c.id); novas.push(c);
      aviso(`💡 Conclusão: ${c.texto}`);
    }
    return novas;
  }

  function temConclusao(j, id) { return inv(j).conclusoes.includes(id); }
  function totalPistas() { return ORDEM_PISTAS.length; }

  // Usa um item (pela mochila ou pelo atalho). Devolve { ok, motivo }.
  function usar(j, id) {
    const it = ITENS[id];
    if (!it || !it.usar || qtd(j, id) <= 0) return { ok: false, motivo: it && it.tipo === 'ferramenta' ? 'Funciona sozinha, só de estar na mochila.' : 'Não dá para usar isso agora.' };
    const l = j.line;
    if (!l || l.estado === 'morta' || l.estado === 'final') return { ok: false, motivo: 'Agora não.' };
    const r = it.usar(j);
    if (r.ok) { tirar(j, id, 1); j.salvar(); }
    return r;
  }

  function equipar(j, id) { const i = inv(j); if (ITENS[id] && ITENS[id].equipavel) { i.equipado = id; atualizarBotoes(j); j.salvar(); } }

  // F (ou o botão do item): usa o item equipado.
  function usarEquipado(j) {
    const i = inv(j), id = i.equipado;
    if (!id || !qtd(j, id)) { aviso('🎒 Nenhum item equipado. Equipe um na mochila (I).'); return false; }
    if (j.line.estado !== 'livre') return false;
    const r = usar(j, id);
    if (!r.ok) aviso(`${ITENS[id].icone} ${r.motivo}`);
    return r.ok;
  }

  // H: usa a Poção de Vida.
  function usarCuraRapida(j) {
    const l = j.line;
    if (!l || l.hp >= l.hpMax) { aviso('❤️ A vida já está cheia'); return false; }
    if (!qtd(j, 'pocao')) { aviso('🧪 Nenhuma Poção de Vida. A Dona Rosa vende no vilarejo.'); return false; }
    const r = usar(j, 'pocao');
    if (r.ok) aviso('🧪 Poção de Vida usada');
    return r.ok;
  }

  // ---------------- Objetivo atual (derivado do progresso) ----------------
  function objetivo(j) {
    const f = j.flags;
    if (!f.prologo) return null;
    if (f.parte2 && LB.parte2) return LB.parte2.objetivo(j);
    if (f.zerado) return 'A Bell está em casa. Explore o mundo, complete o caderno e ache todos os baús.';
    if (!f.magoVisto) return 'Atravessar a Floresta Sussurrante. Uma luz azul brilha na clareira a oeste. (O Vilarejo do Riacho fica a leste da fazenda.)';
    if (!f.espada) return 'Pegar a espada no baú ao lado do Mago.';
    if (!f.ruinasVistas) return 'Cortar os espinhos ao norte da floresta e chegar às Ruínas Encantadas.';
    if (!f.magia) return 'Encontrar o altar da luz, na sala a oeste das ruínas.';
    if (!f.golem) return 'Acender os cristais das ruínas e vencer o Guardião de Pedra, no salão norte.';
    if (!f.montanhaVista) return 'Subir até a Montanha de Brasa, pela saída norte das ruínas.';
    if (!(f.abertas || []).includes('montanha:portao')) {
      const n = (f.luz || []).filter((k) => ['montanha:6,35', 'montanha:30,22', 'montanha:18,9'].includes(k)).length;
      return `Acender as três tochas da montanha para abrir o portão de fogo (${n}/3 acesas). Uma fica perto da entrada, outra numa ilha no meio da lava e a última lá em cima.`;
    }
    return 'Entrar no covil, vencer o dragão e resgatar a Bell.';
  }

  // ---------------- Névoa de exploração ----------------
  // Cada área guarda uma grade de células de 2×2 tiles; a célula acende quando a Line passa perto.
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
    // No escuro sem lanterna a Line enxerga bem menos.
    const raio = LB.mundo && LB.mundo.noEscuro(j, j.line.x, j.line.y) && !tem(j, 'lanterna') ? 3 : RAIO;
    const cx = j.line.x / TILE / CEL, cy = j.line.y / TILE / CEL, r = raio / CEL;
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
    const m = grades[id] && grades[id].salvoDe === j.flags ? grades[id] : null;
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
    const dica = toque ? '🎒 mochila e mapa no botão do topo' : '<kbd>I</kbd> mochila · <kbd>M</kbd> mapa · <kbd>F</kbd> item · <kbd>H</kbd> poção';
    const html = `<b>Objetivo</b><div>${texto}</div><div class="mini">📜 ${inv(j).pistas.length}/${totalPistas()} documentos · ${dica}</div>`;
    if (html !== el._html) { el.innerHTML = html; el._html = html; }
    // Fica logo abaixo do HUD (corações, magia, moedas e itens), que muda de altura.
    const i = inv(j), linhaItens = qtd(j, 'pocao') || (i.equipado && qtd(j, i.equipado));
    const unidades = LB.hud && LB.hud.pronto() ? LB.hud.fundo(j) + 2 : (j.flags.magia ? 66 : 46) + (linhaItens ? 20 : 0) + 14;
    const fim = unidades * j.escala / j.dpr;
    const topo = Math.round(fim + 4) + 'px';
    if (el.style.top !== topo) el.style.top = topo;
  }

  function atualizarBotoes(j) {
    if (!j || !j.flags) return;
    const i = inv(j);
    const n = i.novos || 0;
    const b = $('#b-mochila');
    if (b) { b.classList.toggle('novo', n > 0); b.dataset.novos = n; }
    // Um botão só para o item do atalho (bomba, poção, elixir…): o que estiver equipado na mochila.
    // Se o equipado acabar, passa para outro item equipável que ainda tenha.
    if (i.equipado && !qtd(j, i.equipado)) i.equipado = ORDEM_ITENS.find((id) => ITENS[id] && ITENS[id].equipavel && qtd(j, id)) || i.equipado;
    const bi = $('#b-item');
    if (bi) {
      const eq = i.equipado && qtd(j, i.equipado) ? i.equipado : null;
      bi.classList.toggle('oculto', !eq || !j.flags.prologo);
      if (eq) bi.textContent = `${ITENS[eq].icone}${qtd(j, eq)}`;
    }
    const bt = $('#b-trocar');
    if (bt) { const ok = LB.herois && LB.herois.liberada(j) && j.flags.prologo; bt.classList.toggle('oculto', !ok); if (ok) bt.textContent = LB.herois.ativa(j) === 'bell' ? '🔄⚔' : '🔄💖'; }
  }

  // HUD no canvas: moedas e item equipado, embaixo dos corações/escudos/magia.
  function desenharHud(g, j, s) {
    if (!j.flags.prologo) return;
    let y = (j.flags.magia ? 66 : 46) * s;
    const x = 22 * s;
    const caixa = (w) => { g.fillStyle = 'rgba(0,0,0,.45)'; g.beginPath(); g.roundRect ? g.roundRect(x - 9 * s, y - 8 * s, w * s, 16 * s, 6 * s) : g.rect(x - 9 * s, y - 8 * s, w * s, 16 * s); g.fill(); };
    g.font = `700 ${10 * s}px system-ui, sans-serif`; g.textAlign = 'left';
    // Moedas.
    caixa(58);
    g.fillStyle = '#f2c14e'; g.beginPath(); g.arc(x, y, 5 * s, 0, TAU); g.fill();
    g.fillStyle = '#b8862a'; g.beginPath(); g.arc(x, y, 3 * s, 0, TAU); g.fill();
    g.fillStyle = '#ffe9c7'; g.fillText(String(moedas(j)), x + 9 * s, y + 4 * s);
    // Item equipado e poções.
    const i = inv(j), eq = i.equipado && qtd(j, i.equipado) ? i.equipado : null;
    const tecla = !LB.entrada.usandoToque();
    if (eq || qtd(j, 'pocao')) {
      y += 20 * s;
      const partes = [];
      if (qtd(j, 'pocao')) partes.push(`🧪${qtd(j, 'pocao')}${tecla ? ' H' : ''}`);
      if (eq && eq !== 'pocao') partes.push(`${ITENS[eq].icone}${qtd(j, eq)}${tecla ? ' F' : ''}`);
      const txt = partes.join('  ');
      g.font = `700 ${10 * s}px system-ui, sans-serif`;
      caixa(g.measureText(txt).width / s + 16);
      g.fillStyle = '#ffe9c7'; g.fillText(txt, x - 3 * s, y + 4 * s);
    }
  }

  // ---------------- Itens no chão e objetos ----------------
  function desenharItemChao(g, it, t) {
    const x = it.x, y = it.y - 8 - Math.sin(t * 3 + x) * 2;
    LB.desenho.sombraChao(g, it.x, it.y, 7, 0.2);
    if (it.doc) {
      g.save(); g.translate(x, y); g.rotate(-0.25);
      g.fillStyle = '#f5e9c8'; g.fillRect(-7, -9, 14, 18);
      g.fillStyle = '#b89b6a'; for (let i = 0; i < 4; i++) g.fillRect(-5, -6 + i * 4, 10 - (i % 2) * 3, 1.3);
      g.fillStyle = '#c0392b'; g.beginPath(); g.arc(4, -7, 2, 0, TAU); g.fill();
      g.restore();
    } else if (it.moedas) {
      for (let i = 0; i < Math.min(4, 1 + Math.floor(it.moedas / 4)); i++) {
        const dx = (i % 2 ? 4 : -3), dy = -i * 2.2;
        g.fillStyle = '#b8862a'; g.beginPath(); g.ellipse(x + dx, y + dy + 1, 5, 2.6, 0, 0, TAU); g.fill();
        g.fillStyle = '#f2c14e'; g.beginPath(); g.ellipse(x + dx, y + dy, 5, 2.6, 0, 0, TAU); g.fill();
      }
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
    { id: 'fazenda', nome: 'Fazendinha', x: 0.32, y: 0.88, emb: '🏡', cor: '#8bc36a' },
    { id: 'vilarejo', nome: 'Vilarejo do Riacho', x: 0.55, y: 0.84, emb: '🏘️', cor: '#c9a36a' },
    { id: 'floresta', nome: 'Floresta Sussurrante', x: 0.38, y: 0.64, emb: '🌲', cor: '#4f8a3f' },
    { id: 'gruta', nome: 'Gruta dos Ecos e Minas', x: 0.6, y: 0.52, emb: '🕳️', cor: '#5f7f9a' },
    { id: 'ruinas', nome: 'Ruínas Encantadas', x: 0.2, y: 0.42, emb: '🏛️', cor: '#9aa691' },
    { id: 'montanha', nome: 'Montanha de Brasa', x: 0.42, y: 0.26, emb: '🌋', cor: '#a06a52' },
    { id: 'covil', nome: 'Covil do Dragão', x: 0.24, y: 0.1, emb: '🐉', cor: '#5a3d44' },
    // Parte 2 (só aparecem depois que o dragão acorda).
    { id: 'vale', nome: 'Vale das Raízes', x: 0.8, y: 0.8, emb: '🌾', cor: '#9aa24a', parte2: true },
    { id: 'fenda', nome: 'Fenda de Magma', x: 0.93, y: 0.92, emb: '🌋', cor: '#b0502a', parte2: true },
    { id: 'lago', nome: 'Lago Espelhado', x: 0.82, y: 0.56, emb: '🌊', cor: '#4a9ad0', parte2: true },
    { id: 'pantano', nome: 'Pântano Sombrio', x: 0.94, y: 0.66, emb: '🐸', cor: '#4a6a3a', parte2: true },
    { id: 'picos', nome: 'Picos do Vento', x: 0.78, y: 0.3, emb: '🏔️', cor: '#b8c8d8', parte2: true },
    { id: 'tempestade', nome: 'Olho da Tempestade', x: 0.93, y: 0.18, emb: '⛈️', cor: '#4a5a80', parte2: true },
    { id: 'coracao', nome: 'Coração dos Elementos', x: 0.6, y: 0.08, emb: '💠', cor: '#8a5ac0', parte2: true },
  ];
  const LIGACOES = [['fazenda', 'floresta'], ['fazenda', 'vilarejo'], ['vilarejo', 'floresta'], ['floresta', 'gruta'], ['floresta', 'ruinas'], ['gruta', 'ruinas'], ['gruta', 'montanha'], ['ruinas', 'montanha'], ['montanha', 'covil'],
    ['vilarejo', 'vale'], ['vale', 'fenda'], ['vale', 'lago'], ['lago', 'pantano'], ['lago', 'picos'], ['picos', 'tempestade'], ['picos', 'coracao']];

  const CORES_TILE = {
    parede: '#2a2334', chao: '#8a8f7a', caminho: '#c9b48a', agua: '#4e93c9', lava: '#ff7a2a', fenda: '#120c10', predio: '#8a5f3c', barreira: '#a58cff', porta: '#d4a93a',
    grama: '#6aa84f', fazenda: '#6aa84f', vilarejo: '#6fab50', floresta: '#4f8a3f', ruinas: '#7f8878', montanha: '#6a5750', covil: '#4b403c', gruta: '#4f6470',
    vale: '#8aa24a', lago: '#5fae6a', pantano: '#4a6a3a', picos: '#b8bec8', tempestade: '#4a5468', coracao: '#4a3a5a',
  };

  function corTile(c, tema) {
    if (c === '#' || c === 'T') return CORES_TILE.parede;
    if (c === ':') return CORES_TILE.caminho;
    if (c === 'w' || c === '~') return CORES_TILE.agua;
    if (c === 'L') return CORES_TILE.lava;
    if (c === 'l') return '#9a3a1a';
    if (c === 'j') return ['picos', 'tempestade', 'coracao'].includes(tema) ? '#9ccff0' : CORES_TILE.fenda;
    if (c === '>' || c === '<') return '#e8f4ff';
    if (c === 'u') return '#6a4a2e';
    if ('HDBK'.includes(c)) return CORES_TILE.predio;
    if (c === 'Z') return CORES_TILE.barreira;
    if (c === 'g') return CORES_TILE.porta;
    if (c === '=' || c === 'E') return '#8a7a6a';
    if (c === '%') return '#6f5a4a';
    if (c === 'X') return '#5a3a5a';
    if (c === 'R' || c === 'o' || c === 'I') return '#5f5a58';
    return (tema === 'fenda' ? '#4a3a36' : CORES_TILE[tema]) || CORES_TILE.chao;
  }

  function prepararCanvas(cv) {
    const g = cv.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = cv.clientWidth || 600, H = cv.clientHeight || 400;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { g, W, H };
  }

  function alfinetes(j, area) {
    return inv(j).pistas.map((id) => PISTAS[id].marca).filter((m) => m && (!area || m.area === area));
  }

  function desenharMapaArea(cv, j, id) {
    const def = LB.MAPAS[id];
    if (!def) return;
    const { g, W, H } = prepararCanvas(cv);
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
      g.fillStyle = vistoAqui(tx, ty) ? corTile(c, tema) : '#1e1826';
      g.fillRect(ox + tx * esc, oy + ty * esc, esc + 0.5, esc + 0.5);
    }
    const P = (tx, ty) => [ox + (tx + 0.5) * esc, oy + (ty + 0.5) * esc];
    const r = Math.max(3, esc * 0.9);
    // No Fácil o mapa já mostra os baús (como a Bússola do Mago).
    const bussola = tem(j, 'bussola') || (LB.dicas && LB.dicas.ligado());
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
      else if (tipo === 'estacao') { g.fillStyle = '#9aa3ad'; g.fillRect(-r, -r * 0.5, 2 * r, r); g.fillStyle = '#2a2334'; g.beginPath(); g.arc(-r * 0.5, r * 0.6, r * 0.35, 0, TAU); g.arc(r * 0.5, r * 0.6, r * 0.35, 0, TAU); g.fill(); }
      else if (tipo === 'poste') { g.strokeStyle = '#d8e0e8'; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, r * 0.7, 0, TAU); g.stroke(); g.beginPath(); g.moveTo(0, -r * 0.7); g.lineTo(0, r * 0.7); g.stroke(); }
      else if (tipo === 'rachadura') { g.strokeStyle = '#ffd166'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(-r * 0.6, -r * 0.7); g.lineTo(0, 0); g.lineTo(-r * 0.2, r * 0.7); g.moveTo(0, 0); g.lineTo(r * 0.6, -r * 0.3); g.stroke(); }
      else if (tipo === 'loja') { g.fillStyle = '#ffd166'; g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fill(); g.fillStyle = '#6a4a1a'; g.font = `700 ${r * 1.3}px system-ui`; g.textAlign = 'center'; g.fillText(extra, 0, r * 0.45); }
      else if (tipo === 'mago') { g.fillStyle = '#9ec5ff'; LB.desenho.estrela(g, 0, 0, r * 1.2); }
      else if (tipo === 'golem') { g.fillStyle = '#b8b09a'; g.fillRect(-r, -r, 2 * r, 2 * r); g.fillStyle = '#7fd6ff'; g.fillRect(-2, -2, 4, 4); }
      else if (tipo === 'bell') { g.fillStyle = '#ffd166'; g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fill(); LB.desenho.coracaoForma(g, 0, 0, r * 0.7, '#ff4d6d'); }
      else if (tipo === 'alfinete') {
        g.fillStyle = '#e8434f'; g.beginPath(); g.arc(0, -r * 1.2, r * 0.8, 0, TAU); g.fill();
        g.strokeStyle = '#e8434f'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -r * 0.5); g.lineTo(0, r * 0.4); g.stroke();
        g.fillStyle = '#fff'; g.beginPath(); g.arc(-r * 0.25, -r * 1.35, r * 0.25, 0, TAU); g.fill();
      }
      g.restore();
    };
    const props = atual ? atual.props : propsDe(def);
    for (const p of props) {
      const [x, y] = P(p.tx, p.ty);
      const vis = vistoAqui(p.tx, p.ty);
      if (p.tipo === 'bau') { const ab = p.aberto || abertos.includes(id + ':' + p.tx + ',' + p.ty) || (p.conteudo === 'espada' && j.flags.espada); if (vis || (bussola && !ab)) icone(x, y, 'bau', ab); continue; }
      if (!vis) continue;
      if (p.tipo === 'fonte') icone(x, y, 'fonte');
      else if (p.tipo === 'placa') icone(x, y, 'placa');
      else if (p.tipo === 'altar') icone(x, y, 'altar', !!j.flags.magia);
      else if (p.tipo === 'cristal' || p.tipo === 'tocha') {
        const aceso = p.aceso || (j.flags.luz || []).includes(id + ':' + p.tx + ',' + p.ty);
        if (!aceso && p.tipo === 'tocha' && Math.floor(performance.now() / 400) % 2) { g.strokeStyle = '#ffb347'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, r * 1.8, 0, TAU); g.stroke(); }
        icone(x, y, p.tipo, aceso);
      }
      else if (p.tipo === 'porta') icone(x, y, 'porta');
      else if (p.tipo === 'estacao') icone(x, y, 'estacao');
      else if (p.tipo === 'poste') icone(x, y, 'poste');
      else if (p.tipo === 'rachadura') icone(x, y, 'rachadura');
    }
    for (const it of def.chao || []) {
      if ((j.flags.pegos || []).includes(id + ':' + it.x + ',' + it.y) || !vistoAqui(it.x, it.y)) continue;
      if (it.doc && temPista(j, it.doc)) continue;
      const [x, y] = P(it.x, it.y);
      icone(x, y, it.doc ? 'pista' : 'item', it.moedas ? '#f2c14e' : it.item && ITENS[it.item] && ITENS[it.item].cor);
    }
    for (const e of def.exames || []) {
      if ((j.flags.exames || []).includes(e.id) || !vistoAqui(e.x, e.y) || (e.requer && !j.flags[e.requer])) continue;
      const [x, y] = P(e.x, e.y); icone(x, y, 'pista');
    }
    for (const n of def.npcs || []) {
      if (!vistoAqui(Math.floor(n.x), Math.floor(n.y))) continue;
      const [x, y] = P(n.x - 0.5, n.y - 1);
      if (n.loja) icone(x, y, 'loja', n.loja === 'rosa' ? '🧪' : '⚒');
    }
    // Lojas: o ícone fica na porta (a Dona Rosa e o Seu Bento trabalham lá dentro).
    for (const en of def.entradas || []) {
      if (!en.loja || !vistoAqui(en.x, en.y)) continue;
      const [x, y] = P(en.x, en.y); icone(x, y, 'loja', en.loja === 'rosa' ? '🧪' : '⚒');
    }
    if (id === 'floresta' && vistoAqui(7, 13)) { const [x, y] = P(7, 13); icone(x, y, 'mago'); }
    if (def.golem && !j.flags.golem && vistoAqui(def.golem.x, def.golem.y)) { const [x, y] = P(def.golem.x, def.golem.y); icone(x, y, 'golem'); }
    if (LB.dicas) LB.dicas.desenharNoMapa(g, j, id, P, r);
    if (def.jaula && vistoAqui(def.jaula.x, def.jaula.y)) { const [x, y] = P(def.jaula.x, def.jaula.y); icone(x, y, 'bell'); }
    // Alfinetes dos documentos (não acendem a área: só marcam o ponto).
    g.font = `700 ${Math.max(9, Math.min(12, esc * 1.4))}px system-ui, sans-serif`; g.textAlign = 'center';
    for (const m of alfinetes(j, id)) {
      const [x, y] = P(m.x, m.y);
      icone(x, y, 'alfinete');
      g.fillStyle = '#ffd7d9'; g.fillText(m.rotulo, Math.max(50, Math.min(W - 50, x)), y - r * 2.6);
    }
    // Saídas (setas com o nome do lugar; lugares ainda não visitados ficam como “?”).
    g.font = `700 ${Math.max(9, Math.min(12, esc * 1.6))}px system-ui, sans-serif`;
    const vistos = j.flags.vistos || {};
    for (const s of def.saidas || []) {
      const cx = s.x + s.w / 2, cy = s.y + s.h / 2;
      const perto = [Math.min(mw - 1, Math.max(0, Math.floor(cx) + (s.x >= mw - 1 ? -1 : s.x === 0 ? 1 : 0))), Math.min(mh - 1, Math.max(0, Math.floor(cy) + (s.y >= mh - 1 ? -1 : s.y === 0 ? 1 : 0)))];
      if (!vistoAqui(perto[0], perto[1])) continue;
      const [x, y] = P(cx - 0.5, cy - 0.5);
      const cima = s.y === 0, baixo = s.y >= mh - 1, dir = !cima && !baixo && s.x >= mw - 2;
      g.fillStyle = '#ffe9a8';
      g.beginPath();
      if (cima) { g.moveTo(x, y - esc); g.lineTo(x - esc, y + esc * 0.5); g.lineTo(x + esc, y + esc * 0.5); }
      else if (baixo) { g.moveTo(x, y + esc); g.lineTo(x - esc, y - esc * 0.5); g.lineTo(x + esc, y - esc * 0.5); }
      else if (dir) { g.moveTo(x + esc, y); g.lineTo(x - esc * 0.5, y - esc); g.lineTo(x - esc * 0.5, y + esc); }
      else { g.moveTo(x - esc, y); g.lineTo(x + esc * 0.5, y - esc); g.lineTo(x + esc * 0.5, y + esc); }
      g.closePath(); g.fill();
      const nome = vistos[s.para] ? (LB.MAPAS[s.para] || {}).nome || s.para : '?';
      const ty = cima ? y + esc * 2.4 : baixo ? y - esc * 1.4 : y + esc * 2.2;
      g.fillText(nome + (s.requer && !j.flags[s.requer] ? ' 🔒' : ''), Math.max(40, Math.min(W - 40, x)), ty);
    }
    const cp = j.flags.checkpoint;
    if (cp && cp.area === id) { const [x, y] = P(cp.x - 0.5, cp.y - 1.3); g.strokeStyle = '#7fd6ff'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, r * 1.6, 0, TAU); g.stroke(); }
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
      const tipo = { C: 'bau', U: 'fonte', S: 'placa', A: 'altar', Q: 'cristal', Y: 'tocha', g: 'porta', E: 'estacao', p: 'poste', '%': 'rachadura' }[c];
      if (tipo) lista.push({ tipo, tx, ty, conteudo: tipo === 'bau' ? (def.baus || {})[tx + ',' + ty] : null });
    } });
    return (cacheProps[def.nome] = lista);
  }

  function contagens(j, id) {
    const def = LB.MAPAS[id];
    const baus = propsDe(def).filter((p) => p.tipo === 'bau' && !(p.conteudo && p.conteudo.depoisDe && !j.flags[p.conteudo.depoisDe]));
    const abertos = baus.filter((p) => (j.flags.baus || []).includes(id + ':' + p.tx + ',' + p.ty) || (p.conteudo === 'espada' && j.flags.espada)).length;
    const docs = new Set([...(def.chao || []).filter((c) => c.doc).map((c) => c.doc), ...(def.exames || []).map((e) => e.doc), ...Object.values(def.baus || {}).flatMap((b) => (b && b.pistas) || [])]);
    const achadas = [...docs].filter((k) => temPista(j, k)).length;
    return { baus: baus.length, abertos, pistas: docs.size, achadas, explorado: porcentagem(j, id) };
  }

  function desenharMundo(cv, j) {
    const { g, W, H } = prepararCanvas(cv);
    g.fillStyle = '#e9d8b4'; g.fillRect(0, 0, W, H);
    g.fillStyle = 'rgba(120,90,50,.08)';
    for (let i = 0; i < 60; i++) { const s = LB.ruido(i, 3, 7); g.beginPath(); g.arc(LB.ruido(i, 1, 7) * W, LB.ruido(i, 2, 7) * H, 10 + s * 40, 0, TAU); g.fill(); }
    const grad = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H); grad.addColorStop(0, 'rgba(0,0,0,0)'); grad.addColorStop(1, 'rgba(90,60,30,.35)');
    g.fillStyle = grad; g.fillRect(0, 0, W, H);
    const vistos = j.flags.vistos || {};
    // O mapa só acende onde a Line já esteve (a fazenda é a casa dela).
    // As regiões da Parte 2 só existem no mapa depois que o dragão acorda.
    const existe = (id) => { const n = MUNDO.find((m) => m.id === id); return n && (!n.parte2 || j.flags.parte2); };
    const conhecido = (id) => existe(id) && (!!vistos[id] || id === 'fazenda');
    const pos = (n) => [n.x * W, n.y * H];
    const atual = j.mapa ? j.mapa.id : null;
    g.setLineDash([6, 5]); g.lineWidth = 3; g.strokeStyle = 'rgba(90,60,30,.6)';
    for (const [a, b] of LIGACOES) {
      if ((!conhecido(a) && !conhecido(b)) || !existe(a) || !existe(b)) continue;
      const na = MUNDO.find((n) => n.id === a), nb = MUNDO.find((n) => n.id === b);
      const [x1, y1] = pos(na), [x2, y2] = pos(nb);
      g.beginPath(); g.moveTo(x1, y1); g.quadraticCurveTo((x1 + x2) / 2 + 20, (y1 + y2) / 2, x2, y2); g.stroke();
    }
    g.setLineDash([]);
    // Linha do carrinho (depois de consertado).
    const est = j.flags.estacoes || [];
    if (j.flags.alavanca && est.length > 1) {
      const pontos = { vilarejo: 'vilarejo', minas: 'gruta', forja: 'montanha' };
      const nos = est.map((e) => MUNDO.find((n) => n.id === pontos[e])).filter(Boolean);
      g.strokeStyle = '#7a6a5a'; g.lineWidth = 4;
      for (let i = 1; i < nos.length; i++) { const [x1, y1] = pos(nos[i - 1]), [x2, y2] = pos(nos[i]); g.beginPath(); g.moveTo(x1, y1 + 4); g.lineTo(x2, y2 + 4); g.stroke(); }
    }
    const pequeno = W < 520;
    const pins = alfinetes(j);
    for (const n of MUNDO) {
      if (!existe(n.id)) continue;
      const [x, y] = pos(n);
      const sabe = conhecido(n.id);
      const vizinho = LIGACOES.some(([a, b]) => (a === n.id && conhecido(b)) || (b === n.id && conhecido(a)));
      const temPin = pins.some((m) => m.area === n.id);
      if (!sabe && !vizinho && !temPin) continue;
      const R = pequeno ? 16 : 22;
      if (LB.dicas && LB.dicas.areaAlvo(j) === n.id && n.id !== atual) { const k = 0.5 + 0.5 * Math.sin(performance.now() / 400); g.strokeStyle = `rgba(90,60,30,${0.3 + 0.2 * k})`; g.lineWidth = 2; g.beginPath(); g.arc(x, y, R + 8 + k * 4, 0, TAU); g.stroke(); g.font = `${R * 0.8}px system-ui`; g.textAlign = 'center'; g.fillText('🧭', x - R * 0.9, y - R * 0.6); }
      if (n.id === atual) { const k = 0.5 + 0.5 * Math.sin(performance.now() / 300); g.strokeStyle = `rgba(255,111,159,${0.5 + 0.4 * k})`; g.lineWidth = 4; g.beginPath(); g.arc(x, y, R + 6 + k * 3, 0, TAU); g.stroke(); }
      g.fillStyle = sabe ? n.cor : '#c9b58f';
      g.strokeStyle = '#4a3320'; g.lineWidth = 2.5;
      g.beginPath(); g.arc(x, y, R, 0, TAU); g.fill(); g.stroke();
      g.fillStyle = '#3a2718'; g.textAlign = 'center';
      if (temPin) { g.font = `${R * 0.8}px system-ui`; g.fillText('📍', x + R * 0.9, y - R * 0.6); }
      if (!sabe) { g.font = `700 ${R}px system-ui`; g.fillText('?', x, y + R * 0.38); g.font = `700 ${pequeno ? 11 : 13}px system-ui, sans-serif`; g.fillText('Lugar desconhecido', x, y + R + 16); continue; }
      g.font = `${R}px system-ui`; g.fillText(n.emb, x, y + R * 0.38);
      g.font = `700 ${pequeno ? 11 : 13}px system-ui, sans-serif`; g.fillText(n.nome, x, y + R + 16);
      const c = contagens(j, n.id);
      g.font = `${pequeno ? 10 : 11}px system-ui, sans-serif`; g.fillStyle = '#5a4630';
      const partes = [`${c.explorado}% explorado`];
      if (c.baus) partes.push(`baús ${c.abertos}/${c.baus}`);
      if (c.pistas) partes.push(`docs ${c.achadas}/${c.pistas}`);
      g.fillText(partes.join(' · '), x, y + R + 30);
    }
    g.fillStyle = '#5a4630'; g.font = `italic ${pequeno ? 10 : 12}px serif`; g.textAlign = 'left';
    g.fillText('O mapa acende só onde a Line já passou. 📍 = marcado por um documento.', 12, H - 12);
  }

  // ---------------- Tela da mochila ----------------
  const tela = {
    aba: 'itens', sel: null, pista: null, mapaModo: 'area', mapaArea: null, aberta: false, rodando: false,
    ligar(j) {
      this.j = j;
      for (const b of document.querySelectorAll('#mochila nav button')) b.onclick = () => this.mostrarAba(b.dataset.aba);
      $('#btn-fechar-mochila').onclick = () => this.fechar();
      $('#btn-usar-item').onclick = () => this.usarSelecionado();
      $('#btn-equipar-item').onclick = () => { if (this.sel) { equipar(j, this.sel); this.atualizarItens(); } };
      $('#btn-mapa-area').onclick = () => { this.mapaModo = 'area'; this.atualizarMapa(); };
      $('#btn-mapa-mundo').onclick = () => { this.mapaModo = 'mundo'; this.atualizarMapa(); };
      const bm = $('#b-mochila'); if (bm) bm.addEventListener('click', () => { if (j.estado === 'jogo' && !j.cena) this.abrir('itens'); });
      const bi = $('#b-item'); if (bi) bi.addEventListener('click', () => { if (j.estado === 'jogo' && !j.cena) usarEquipado(j); });
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
      else j.estado = 'jogo';
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
      // Equipamento: moedas, armadura e item no atalho.
      const arm = LB.loja && LB.loja.armadura(j);
      $('#equip-moedas').textContent = `🪙 ${moedas(j)} moedas`;
      $('#equip-armadura').textContent = arm ? `${arm.icone} ${arm.nome} (${arm.escudos} 🛡)` : '👕 Sem armadura (compre no Seu Bento)';
      $('#equip-item').textContent = i.equipado && qtd(j, i.equipado) ? `${ITENS[i.equipado].icone} ${ITENS[i.equipado].nome} no atalho ${LB.entrada.usandoToque() ? '(botão do item)' : '(F)'}` : 'Nenhum item no atalho';
      const grid = $('#itens-grade'); grid.innerHTML = '';
      const ids = ORDEM_ITENS.filter((id) => i.itens[id] > 0);
      if (!ids.length) grid.innerHTML = '<p class="vazio">A mochila está vazia. Procure baús pelo caminho ou visite a loja do vilarejo.</p>';
      if (this.sel && !i.itens[this.sel]) this.sel = null;
      if (!this.sel && ids.length) this.sel = ids[0];
      for (const id of ids) {
        const it = ITENS[id];
        const b = document.createElement('button');
        b.className = 'slot' + (id === this.sel ? ' sel' : '') + (i.equipado === id ? ' equipado' : '');
        const unico = it.tipo === 'ferramenta' || it.tipo === 'historia';
        b.innerHTML = `<span class="ic">${it.icone}</span><span class="nm">${it.nome}</span><span class="qt">${unico ? (it.tipo === 'historia' ? 'item da história' : 'ferramenta') : '×' + i.itens[id]}</span>`;
        b.onclick = () => { this.sel = id; this.atualizarItens(); };
        grid.appendChild(b);
      }
      const det = $('#item-detalhe');
      if (!this.sel) { det.classList.add('oculto'); return; }
      det.classList.remove('oculto');
      const it = ITENS[this.sel];
      $('#item-nome').textContent = `${it.icone} ${it.nome}`;
      $('#item-desc').textContent = it.desc;
      $('#btn-usar-item').classList.toggle('oculto', !it.usar);
      const bEq = $('#btn-equipar-item');
      bEq.classList.toggle('oculto', !it.equipavel);
      bEq.textContent = i.equipado === this.sel ? 'Equipado ✔' : 'Equipar no atalho';
      $('#item-msg').textContent = it.tipo === 'chave' ? 'Chegue perto de uma porta trancada e aperte o botão que aparecer.' : it.tipo === 'ferramenta' ? 'Funciona sozinha, só de estar na mochila.' : it.tipo === 'historia' ? 'Leve até uma estação do carrinho.' : '';
      const l = j.line;
      $('#item-vida').textContent = l ? `Vida: ${Math.ceil(l.hp / 2 * 10) / 10}/${l.hpMax / 2} ❤${l.escudosMax ? ` · Escudos: ${l.escudos}/${l.escudosMax} 🛡` : ''}${j.flags.magia ? ` · Magia: ${Math.floor(l.mana)}/${l.manaMax} ◆` : ''}` : '';
    },

    usarSelecionado() {
      const j = this.j, id = this.sel;
      if (!id) return;
      const nome = ITENS[id].nome;
      const r = usar(j, id);
      if (r.ok && id === 'bomba') { this.fechar(); aviso('💣 Bomba acesa! Afaste-se!'); return; }
      this.atualizarItens();
      $('#item-msg').textContent = r.ok ? `${nome}: usado!` : r.motivo;
    },

    atualizarPistas() {
      const j = this.j, i = inv(j);
      $('#pistas-objetivo').innerHTML = `<b>Objetivo agora</b><div>${objetivo(j) || 'Cuidar da fazendinha com a Bell.'}</div>`;
      $('#pistas-total').textContent = `${i.pistas.length} de ${totalPistas()} documentos · ${i.conclusoes.length} de ${CONCLUSOES.length} conclusões` + (i.pistas.length >= totalPistas() ? ' · Caderno completo!' : '');
      const lista = $('#pistas-lista'); lista.innerHTML = '';
      for (const id of ORDEM_PISTAS) {
        const p = PISTAS[id], temIt = i.pistas.includes(id);
        const b = document.createElement('button');
        b.className = 'pista' + (temIt ? '' : ' falta') + (this.pista === id ? ' sel' : '');
        b.innerHTML = `<span class="ic">${temIt ? p.icone : '❔'}</span><span class="nm">${temIt ? p.titulo : 'Documento não encontrado'}</span><span class="onde">${temIt ? `${TIPOS_DOC[p.tipo]} · ${p.onde}` : '???'}</span>`;
        if (temIt) b.onclick = () => { this.pista = id; this.atualizarPistas(); };
        lista.appendChild(b);
      }
      const cl = $('#conclusoes-lista'); cl.innerHTML = '';
      for (const c of CONCLUSOES) {
        const ok = i.conclusoes.includes(c.id);
        const faltam = c.requer.filter((d) => !i.pistas.includes(d)).length;
        const d = document.createElement('div');
        d.className = 'conclusao' + (ok ? ' ok' : '');
        d.innerHTML = ok ? `<b>💡 ${c.texto}</b>${c.efeito ? `<span>${c.efeito}</span>` : ''}` : `<b>○ Falta${faltam > 1 ? 'm' : ''} ${faltam} documento${faltam > 1 ? 's' : ''} para entender isto</b>`;
        cl.appendChild(d);
      }
      const leitor = $('#pista-leitor');
      if (!this.pista || !i.pistas.includes(this.pista)) this.pista = i.pistas[i.pistas.length - 1] || null;
      if (!this.pista) { leitor.classList.add('oculto'); return; }
      leitor.classList.remove('oculto');
      const p = PISTAS[this.pista];
      leitor.className = 'papel doc-' + p.tipo;
      $('#pista-tipo').textContent = TIPOS_DOC[p.tipo];
      $('#pista-titulo').textContent = `${p.icone} ${p.titulo}`;
      $('#pista-autor').textContent = `${p.autor} · ${p.data}`;
      $('#pista-onde').textContent = `Encontrado em: ${p.onde}`;
      const t = $('#pista-texto'); t.innerHTML = '';
      for (const par of p.texto.split('\n\n')) { const e = document.createElement('p'); e.textContent = par; t.appendChild(e); }
      $('#pista-marca').textContent = p.marca ? `📍 Marcado no mapa: ${p.marca.rotulo} (${LB.MAPAS[p.marca.area].nome})` : '';
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
      $('#mapa-info').textContent = c ? `${LB.MAPAS[this.mapaArea].nome}: ${c.explorado}% explorado · baús ${c.abertos}/${c.baus}${c.pistas ? ` · documentos ${c.achadas}/${c.pistas}` : ''}${tem(j, 'bussola') ? ' · 🧭 bússola ativa' : ''}` : 'Mapa do mundo';
      this.desenharMapa();
    },

    desenharMapa() {
      const cv = $('#mapa-canvas');
      if (this.mapaModo === 'area') desenharMapaArea(cv, this.j, this.mapaArea); else desenharMundo(cv, this.j);
    },
  };

  // Teclas: I (itens), M (mapa), Esc fecha, H usa poção, F usa o item equipado.
  document.addEventListener('keydown', (e) => {
    const j = tela.j;
    if (!j) return;
    if (e.code === 'KeyI' || e.code === 'KeyM') {
      if (j.estado === 'jogo' && j.cena) return;
      if (j.estado !== 'jogo' && j.estado !== 'mochila') return;
      e.preventDefault(); tela.alternar(e.code === 'KeyI' ? 'itens' : 'mapa');
    } else if (e.code === 'Escape' && j.estado === 'mochila') { e.preventDefault(); e.stopImmediatePropagation(); tela.fechar(); }
    else if (j.estado === 'jogo' && !j.cena && j.line && j.line.estado !== 'morta' && j.flags.prologo && j.mapa && j.mapa.tema !== 'encontro') {
      if (e.code === 'KeyH') { e.preventDefault(); usarCuraRapida(j); }
      else if (e.code === 'KeyF' && !e.repeat) { e.preventDefault(); usarEquipado(j); }
    }
  });

  LB.mochila = {
    ITENS, ORDEM_ITENS, PISTAS, ORDEM_PISTAS, CONCLUSOES, TIPOS_DOC, MUNDO, inv, qtd, tem, moedas, dar, tirar, darMoedas, usar, equipar, usarEquipado, usarCuraRapida,
    temPista, darPista, verificarConclusoes, temConclusao, totalPistas, objetivo, explorar, grade, visto, porcentagem, aviso, atualizarPainel, atualizarBotoes,
    desenharHud, desenharItemChao, desenharPorta, corTile, desenharCogumelo, tela, contagens, desenharMapaArea, desenharMundo,
  };
})(window.LB);
