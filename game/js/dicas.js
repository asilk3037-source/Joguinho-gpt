'use strict';

// Dicas do modo Fácil: uma seta dourada em volta da heroína aponta para o próximo objetivo (ou
// para a saída que leva até ele), cada chefe explica o próprio padrão durante a luta, a vida baixa
// lembra da poção e da troca de heroína, e a tela de derrota diz o que tentar da próxima vez.
(function (LB) {
  const T = (n) => n * LB.TILE;
  const TAU = Math.PI * 2;

  const ligado = () => LB.dificuldade && LB.dificuldade.id === 'facil';

  // Mostra uma dica agora (mesmo que parecida já tenha aparecido antes).
  function mostrar(j, texto, dur) {
    const el = document.querySelector('#dica');
    if (!el) return;
    el.textContent = '💡 ' + texto;
    el.classList.remove('oculto');
    clearTimeout(j.timerDica);
    j.timerDica = setTimeout(() => el.classList.add('oculto'), (dur || 7) * 1000);
  }

  // Durante a luta: n = 0 ao acordar, 1 quando cansa pela primeira vez, 2 ao mudar de fase.
  function chefe(j, ch, n) {
    if (!ligado() || !ch.def.dicas) return;
    const lista = ch.def.dicas;
    mostrar(j, `${ch.nome}: ${lista[Math.min(n, lista.length - 1)]}`, 8);
  }

  // ---------------- Para onde ir ----------------
  // Área e ponto (em tiles) do objetivo atual. Sem ponto: basta chegar na área.
  function alvo(j) {
    const f = j.flags;
    if (!f.prologo) return null;
    const barreira = (area, id) => ({ area, barreira: id });
    const chefe = (area) => ({ area, chefe: true });
    if (f.parte2) {
      if (f.quimeraVencida) return null;
      if (!f.chefeTerra) return (f.abertas || []).includes('vale:raizes') ? chefe('vale') : barreira('vale', 'raizes');
      if (!f.fusaoMagma) return chefe('fenda');
      if (!f.chefeAgua) return (f.abertas || []).includes('lago:onda') ? chefe('lago') : barreira('lago', 'onda');
      if (!f.fusaoLama) return chefe('pantano');
      if (!f.chefeAr) return (f.abertas || []).includes('picos:farois') ? chefe('picos') : barreira('picos', 'farois');
      if (!f.fusaoTempestade) return chefe('tempestade');
      return chefe('coracao');
    }
    if (f.zerado) return null;
    if (!f.magoVisto) return { area: 'floresta', x: 7.5, y: 14.4, rotulo: 'Clareira do Mago' };
    if (!f.espada) return { area: 'floresta', espada: true, x: 7.5, y: 14.4, rotulo: 'Baú da espada' };
    if (!f.ruinasVistas) return { area: 'ruinas' };
    if (!f.magia) return { area: 'ruinas', prop: 'altar' };
    if (!f.golem) return { area: 'ruinas', golem: true };
    if (!f.montanhaVista) return { area: 'montanha' };
    if (!(f.abertas || []).includes('montanha:portao')) return barreira('montanha', 'portao');
    return { area: 'covil' };
  }

  // Menor caminho entre áreas pelas saídas já abertas: devolve a saída a usar nesta área.
  function proximaSaida(j, destino) {
    const origem = j.mapa.id, f = j.flags;
    if (origem === destino) return null;
    const pode = (s) => !s.requer || f[s.requer];
    const antes = { [origem]: null }, fila = [origem];
    while (fila.length) {
      const a = fila.shift();
      if (a === destino) break;
      for (const s of (LB.MAPAS[a].saidas || [])) {
        if (!pode(s) || !LB.MAPAS[s.para] || s.para in antes) continue;
        antes[s.para] = { de: a, saida: s };
        fila.push(s.para);
      }
    }
    if (!(destino in antes)) return null;
    let n = destino;
    while (antes[n] && antes[n].de !== origem) n = antes[n].de;
    return antes[n] ? antes[n].saida : null;
  }

  // ---------------- Guia: trilha dourada pelo caminho de verdade ----------------
  // Candidatos na área atual: lugares (em px) para onde a jogadora precisa ir agora. O caminho
  // vai até o mais perto que dá para alcançar andando (com pulos, espinhos e gancho).
  function candidatos(j) {
    const m = j.mapa, f = j.flags, lista = [];
    const px = (x, y, rotulo) => lista.push({ x, y, rotulo });
    // Capítulo da fazenda (antes do rapto): as tarefas do dia.
    if (!f.prologo) {
      if (m.id !== 'fazenda') return lista;
      if (f.etapa === 'tarde') { const lago = j.pontoMapa('lago'); px(lago.x, lago.y, 'Lago: ver o pôr do sol'); return lista; }
      const tf = f.tarefas || { ovos: 0, regados: [], carinhos: [] };
      for (const it of j.itens) if (it.tipo === 'ovo') px(it.x, it.y, 'Ovo escondido');
      if (!tf.regador) { const p = j.pontoMapa('regador'); px(p.x, p.y + 6, 'Pegar o regador no poço'); }
      else for (const k of m.def.canteiros || []) if (!tf.regados.includes(k)) { const [x, y] = k.split(',').map(Number); px(T(x + 0.5), T(y + 0.9), 'Regar a horta'); }
      if (!tf.theo) { const p = j.pontoMapa(tf.racao ? 'tigela' : 'racao'); px(p.x, p.y, tf.racao ? 'Pôr a ração na tigela' : 'Pegar a ração no celeiro'); }
      if ((tf.carinhos || []).length < 3) for (const b of j.bichos) if (!(tf.carinhos || []).includes(b.tipo)) { const n = (b.cfg && b.cfg.nome) || b.tipo; px(b.x, b.y, n === 'Theo' ? 'Fazer carinho no Theo' : `Fazer carinho: ${n}`); }
      return lista;
    }
    const a = alvo(j);
    if (!a) return lista;
    if (m.id !== a.area) {
      const s = proximaSaida(j, a.area);
      if (s) for (let y = s.y; y < s.y + s.h; y++) for (let x = s.x; x < s.x + s.w; x++) px(T(x + 0.5), T(y + 0.9), 'Caminho para ' + LB.MAPAS[s.para].nome);
      return lista;
    }
    if (a.barreira) {
      const b = (m.def.barreiras || []).find((x) => x.id === a.barreira);
      if (b) {
        const acesas = b.fontes.filter((k) => { const [x, y] = k.split(',').map(Number); const p = m.props.find((o) => o.tx === x && o.ty === y); return p && p.aceso; }).length;
        for (const k of b.fontes) {
          const [x, y] = k.split(',').map(Number), p = m.props.find((o) => o.tx === x && o.ty === y);
          if (p && !p.aceso) px(p.x, p.y + 4, `${NOME_FONTE[p.tipo] || 'Cristal'} apagado (${acesas}/${b.fontes.length} acesos)`);
        }
        if (lista.length) return lista;
      }
    }
    if (a.chefe && m.def.chefe) { px(T(m.def.chefe.x), T(m.def.chefe.y), LB.chefes.CHEFES[m.def.chefe.id].nome); return lista; }
    if (a.golem) { const g = j.inimigos.find((e) => e.golem && e.vivo); if (g) px(g.x, g.y, 'Guardião de Pedra'); return lista; }
    if (a.prop) { const p = m.props.find((o) => o.tipo === a.prop); if (p) px(p.x, p.y + 6, 'Altar da luz'); return lista; }
    if (a.espada) { const p = m.props.find((o) => o.tipo === 'bau' && o.conteudo === 'espada'); if (p && !p.aberto) { px(p.x, p.y + 6, 'Baú da espada'); return lista; } }
    if (a.x != null) px(T(a.x), T(a.y), a.rotulo || 'Objetivo');
    return lista;
  }
  const NOME_FONTE = { tocha: 'Tocha', cristal: 'Cristal' };

  // Caminho em tiles da heroína até o candidato mais perto (busca em largura).
  function caminho(j, lista) {
    const m = j.mapa, l = j.line, W = m.w, H = m.h;
    const f = j.flags, espada = !!(l.temEspada || f.espada), gancho = LB.mochila.tem(j, 'gancho');
    const idx = (x, y) => y * W + x;
    const alvos = new Map();
    for (const c of lista) {
      const tx = Math.floor(c.x / LB.TILE), ty = Math.floor((c.y - 4) / LB.TILE);
      // O alvo pode ser sólido (baú, cristal): chegar do lado já vale.
      for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) { const x = tx + dx, y = ty + dy; if (x >= 0 && y >= 0 && x < W && y < H && !alvos.has(idx(x, y))) alvos.set(idx(x, y), c); }
    }
    const passa = (x, y) => x >= 0 && y >= 0 && x < W && y < H && (!m.solido(x, y) || (espada && m.l[y][x] === 'X'));
    const x0 = Math.floor(l.x / LB.TILE), y0 = Math.floor((l.y - 4) / LB.TILE);
    const antes = new Int32Array(W * H).fill(-2), como = new Uint8Array(W * H);
    const fila = [idx(x0, y0)]; antes[fila[0]] = -1;
    let achou = -1;
    for (let i = 0; i < fila.length; i++) {
      const k = fila[i], x = k % W, y = (k - x) / W;
      if (alvos.has(k)) { achou = k; break; }
      const ir = (nx, ny, tipo) => { const n = idx(nx, ny); if (antes[n] !== -2) return; antes[n] = k; como[n] = tipo; fila.push(n); };
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        if (passa(nx, ny)) { ir(nx, ny, m.l[ny][nx] === 'X' ? 2 : 0); continue; }
        if (alvos.has(idx(nx, ny))) { ir(nx, ny, 0); continue; }
        // Pulo por cima de até 3 tiles de riacho ou fenda.
        if ('wj'.includes(m.l[ny][nx])) for (let d = 2; d <= 4; d++) { const px = x + dx * d, py = y + dy * d; if (passa(px, py)) { ir(px, py, 1); break; } if (!(py >= 0 && py < H && px >= 0 && px < W && 'wj'.includes(m.l[py][px]))) break; }
      }
      // Gancho: do lado de um poste até o outro lado do par.
      if (gancho) for (const p of m.props) {
        if (p.tipo !== 'poste' || Math.abs(p.tx - x) + Math.abs(p.ty - y) !== 1) continue;
        const par = LB.mundo.parDoPoste(m, p);
        if (par && passa(par.tx + par.dx, par.ty + par.dy)) ir(par.tx + par.dx, par.ty + par.dy, 3);
      }
    }
    if (achou < 0) return null;
    const pts = [];
    for (let k = achou; k !== -1; k = antes[k]) pts.push({ tx: k % W, ty: Math.floor(k / W), como: como[k] });
    pts.reverse();
    return { pts, alvo: alvos.get(achou) };
  }

  // Tudo o que o guia precisa agora (recalculado duas vezes por segundo ou ao mudar de tile).
  let cache = { t: -1, chave: '', g: null };
  function guia(j) {
    const l = j.line;
    // Muda de tile, de área ou de progresso (acendeu, abriu, pegou algo): recalcula na hora.
    const f = j.flags, tf = f.tarefas || {};
    const chave = [j.mapa.id, Math.floor(l.x / LB.TILE), Math.floor((l.y - 4) / LB.TILE), (f.luz || []).length, (f.abertas || []).length, j.itens.length, Object.keys(f).length, tf.ovos, tf.regador, (tf.regados || []).length, tf.racao, tf.theo, (tf.carinhos || []).length, f.etapa].join(',');
    if (j.tempo - cache.t < 0.5 && chave === cache.chave && cache.mapa === j.mapa) return cache.g;
    let g = null;
    const lista = candidatos(j);
    if (lista.length) {
      const c = caminho(j, lista);
      if (c) g = { alvo: c.alvo, pts: c.pts };
      else {
        // Não dá para chegar ainda: talvez falte acender a barreira do caminho.
        const extra = [];
        for (const b of j.mapa.def.barreiras || []) for (const k of b.fontes) { const [x, y] = k.split(',').map(Number), p = j.mapa.props.find((o) => o.tx === x && o.ty === y); if (p && !p.aceso) extra.push({ x: p.x, y: p.y + 4, rotulo: (NOME_FONTE[p.tipo] || 'Cristal') + ' apagado: abre o caminho' }); }
        const c2 = extra.length ? caminho(j, extra) : null;
        g = c2 ? { alvo: c2.alvo, pts: c2.pts } : { alvo: lista[0], pts: null };
      }
    }
    cache = { t: j.tempo, chave, g, mapa: j.mapa };
    return g;
  }
  function pontoAlvo(j) { const g = j.mapa && j.line ? guia(j) : null; return g ? g.alvo : null; }

  function ativo(j) {
    return ligado() && !j.cena && j.line && j.line.estado !== 'morta' && j.estado === 'jogo' && j.mapa && j.mapa.tema !== 'encontro' && !(j.chefeArena && !j.chefeArena.dormindo) && !j.chefeAtivo;
  }

  // O que vem logo adiante no caminho (pulo, espinhos, gancho), para avisar na plaquinha.
  function proximoObstaculo(g) {
    if (!g || !g.pts) return null;
    for (let i = 1; i < Math.min(g.pts.length, 7); i++) {
      const c = g.pts[i].como;
      if (c === 1) return LB.entrada.usandoToque() ? 'pule (⤴) por cima' : 'pule (Espaço) por cima';
      if (c === 2) return LB.entrada.usandoToque() ? 'corte os espinhos (⚔)' : 'corte os espinhos (J)';
      if (c === 3) return 'use o gancho no poste';
    }
    return null;
  }

  // Tudo bem discreto: brilho branco-creme, transparente, que some aos poucos.
  const COR = '255,248,232';

  // Trilha no chão (camada de baixo): pontinhos claros e fracos só nos próximos passos,
  // com um brilho que corre devagar na direção do objetivo.
  function desenharTrilha(g, j) {
    if (!ativo(j)) return;
    const gu = guia(j);
    if (!gu || !gu.pts) return;
    const pts = gu.pts, n = Math.min(pts.length, 16), t = j.tempo;
    g.save();
    for (let i = 2; i < n; i++) {
      const p = pts[i];
      const onda = Math.max(0, Math.sin(i * 0.8 - t * 3));
      const fade = Math.min(1, (n - i) / 6);
      g.globalAlpha = (0.12 + 0.28 * onda) * fade;
      g.fillStyle = `rgb(${COR})`;
      g.beginPath(); g.ellipse(T(p.tx + 0.5), T(p.ty + 0.6), 2.2, 1.4, 0, 0, TAU); g.fill();
    }
    g.restore();
  }

  // Um brilhinho suave em cima do objetivo (o nome só aparece de perto) e uma setinha
  // transparente perto da heroína.
  function desenharMarcas(g, j) {
    if (!ativo(j)) return;
    const gu = guia(j);
    if (!gu) return;
    const l = j.line, alvo = gu.alvo, t = j.tempo;
    const dist = Math.hypot(alvo.x - l.x, alvo.y - l.y);
    // Brilho no objetivo: uma estrelinha que pisca devagar e um anel fino no chão.
    g.save();
    const k = 0.5 + 0.5 * Math.sin(t * 2.2);
    g.globalAlpha = 0.18 + 0.2 * k;
    g.strokeStyle = `rgb(${COR})`; g.lineWidth = 1.2;
    g.beginPath(); g.ellipse(alvo.x, alvo.y - 2, 14 + k * 3, 5 + k, 0, 0, TAU); g.stroke();
    g.globalAlpha = 0.35 + 0.35 * k;
    g.fillStyle = `rgb(${COR})`;
    LB.desenho.estrela(g, alvo.x, alvo.y - 52 - k * 3, 3.5 + k * 1.5);
    if (dist < 220) {
      g.globalAlpha = 0.75;
      g.font = '600 8px system-ui, sans-serif'; g.textAlign = 'center';
      g.fillStyle = 'rgba(20,16,30,.45)';
      const w = g.measureText(alvo.rotulo).width + 8;
      g.fillRect(alvo.x - w / 2, alvo.y - 72 - 8, w, 11);
      g.fillStyle = `rgb(${COR})`; g.fillText(alvo.rotulo, alvo.x, alvo.y - 72);
    }
    g.restore();
    // Brilho fraquinho nos baús fechados e documentos por perto.
    for (const p of j.mapa.props) {
      if (p.tipo !== 'bau' || p.aberto || Math.hypot(p.x - l.x, p.y - l.y) > 260) continue;
      g.fillStyle = `rgba(${COR},${0.15 + 0.2 * Math.max(0, Math.sin(t * 2 + p.x))})`; LB.desenho.estrela(g, p.x + 9, p.y - 30, 3);
    }
    for (const it of j.itens) if (it.tipo === 'chao' && it.doc && Math.hypot(it.x - l.x, it.y - l.y) < 260) { g.fillStyle = `rgba(${COR},${0.15 + 0.2 * Math.max(0, Math.sin(t * 2 + it.x))})`; LB.desenho.estrela(g, it.x + 7, it.y - 24, 3); }
    // Setinha perto dos pés, apontando alguns passos adiante no caminho.
    let ax = alvo.x, ay = alvo.y;
    if (gu.pts && gu.pts.length > 1) { const p = gu.pts[Math.min(3, gu.pts.length - 1)]; ax = T(p.tx + 0.5); ay = T(p.ty + 0.6); }
    const dx = ax - l.x, dy = ay - l.y;
    if (dist < 70 || Math.hypot(dx, dy) < 4) return;
    const ang = Math.atan2(dy, dx), R = 26;
    g.save(); g.translate(l.x + Math.cos(ang) * R, l.y - 2 + Math.sin(ang) * R * 0.55); g.rotate(ang);
    g.globalAlpha = 0.35 + 0.15 * Math.sin(t * 3);
    g.strokeStyle = `rgb(${COR})`; g.lineWidth = 1.6; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(-3, -4.5); g.lineTo(3, 0); g.lineTo(-3, 4.5); g.stroke();
    g.restore();
  }

  // Legenda pequena e transparente embaixo da tela: o que procurar e quantos passos faltam.
  function desenharHud(g, j, s) {
    if (!ativo(j)) return;
    const gu = guia(j);
    if (!gu) return;
    const passos = gu.pts ? gu.pts.length - 1 : null, obst = proximoObstaculo(gu);
    let txt = gu.alvo.rotulo;
    if (passos != null && passos > 1) txt += ` · ${passos} passos`;
    if (obst) txt += ` · ${obst}`;
    const W = j.canvas.width, x = W / 2, y = j.canvas.height - 16 * s;
    g.save();
    g.font = `600 ${9 * s}px system-ui, sans-serif`; g.textAlign = 'center';
    const w = Math.min(W - 20 * s, g.measureText(txt).width + 16 * s);
    g.fillStyle = 'rgba(20,16,30,.38)';
    g.beginPath(); g.roundRect ? g.roundRect(x - w / 2, y - 9 * s, w, 15 * s, 7 * s) : g.rect(x - w / 2, y - 9 * s, w, 15 * s); g.fill();
    g.fillStyle = `rgba(${COR},.85)`; g.fillText(txt, x, y + 2.5 * s, w - 10 * s);
    g.restore();
  }

  // No mapa da área (M): o caminho e uma estrela no objetivo.
  function desenharNoMapa(g, j, id, P, r) {
    if (!ligado() || !j.mapa || j.mapa.id !== id || !j.line) return;
    const gu = guia(j);
    if (!gu) return;
    if (gu.pts) {
      g.save(); g.strokeStyle = 'rgba(255,248,232,.55)'; g.lineWidth = Math.max(1.5, r * 0.4); g.setLineDash([r * 0.6, r * 0.8]);
      g.beginPath(); gu.pts.forEach((p, i) => { const [x, y] = P(p.tx, p.ty); if (i) g.lineTo(x, y); else g.moveTo(x, y); }); g.stroke(); g.restore();
    }
    const [x, y] = P(gu.alvo.x / LB.TILE - 0.5, gu.alvo.y / LB.TILE - 1);
    const k = 1 + 0.2 * Math.sin(performance.now() / 200);
    g.fillStyle = 'rgba(255,248,232,.9)';
    LB.desenho.estrela(g, x, y, r * 1.5 * k);
  }

  // Área do mundo para onde ir (para destacar no mapa do mundo).
  function areaAlvo(j) { if (!ligado()) return null; const a = alvo(j); return a ? a.area : (!j.flags.prologo ? 'fazenda' : null); }

  // Vida baixa: lembra das saídas (uma vez por área).
  function atualizar(j) {
    if (!ligado() || j.cena || !j.line || j.estado !== 'jogo') return;
    const l = j.line;
    if (l.hp > 0 && l.hp <= 2 && !j['dicaVida_' + j.mapa.id]) {
      j['dicaVida_' + j.mapa.id] = true;
      const partes = [];
      if (LB.mochila.qtd(j, 'pocao')) partes.push(LB.entrada.usandoToque() ? 'use uma poção (🧪)' : 'use uma poção (H)');
      if (LB.herois && LB.herois.liberada(j)) partes.push(LB.entrada.usandoToque() ? 'troque de heroína (🔄)' : 'troque de heroína (T)');
      partes.push('ou volte a uma fonte');
      mostrar(j, `Vida baixa! ${partes.join(', ')}.`, 6);
    }
  }

  // Tela de derrota: uma dica do que fazer diferente.
  function aoCair(j) {
    const el = document.querySelector('#derrota .sub');
    if (!el) return;
    const quem = LB.herois && LB.herois.ativa(j) === 'bell' ? 'Bell' : 'Line';
    document.querySelector('#derrota h2').textContent = `${LB.herois && LB.herois.liberada(j) ? 'As duas caíram' : 'A ' + quem + ' caiu'}…`;
    if (!ligado()) { el.textContent = j.flags.parte2 ? 'Mas o mundo ainda precisa das duas.' : 'Mas a Bell ainda está esperando.'; return; }
    const ch = j.inimigos.find((e) => e.chefeElemental && e.vivo && !e.dormindo);
    let dica;
    if (ch) dica = ch.def.dicas[Math.floor(Math.random() * ch.def.dicas.length)];
    else if (j.dragao && j.chefeAtivo) dica = 'Quando o dragão cansar e pousar, o peito dele brilha: é lá que a espada machuca. A Chuva de Estrelas apaga o fogo dele.';
    else if (j.inimigos.some((e) => e.golem && e.vivo)) dica = 'A espada não arranha o Guardião: acerte o cristal do peito com a magia (Raio de Luz) para abrir a guarda.';
    else dica = ['Segure a defesa quando um inimigo avançar: a armadura e o escudo seguram o golpe.', 'Beba de uma fonte antes de lutar: se cair, você volta para ela.', 'A Dona Rosa vende poções no vilarejo, e o Seu Bento forja armaduras.'][Math.floor(Math.random() * 3)];
    el.textContent = '💡 ' + dica;
  }

  LB.dicas = { ligado, mostrar, chefe, alvo, proximaSaida, candidatos, caminho, guia, pontoAlvo, desenharTrilha, desenharMarcas, desenharHud, desenharNoMapa, areaAlvo, atualizar, aoCair };
})(window.LB);
