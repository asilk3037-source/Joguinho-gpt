'use strict';

// Dicas do modo Fácil: uma seta dourada em volta da heroína aponta para o próximo objetivo (ou
// para a saída que leva até ele), cada chefe explica o próprio padrão durante a luta, a vida baixa
// lembra da poção e da troca de heroína, e a tela de derrota diz o que tentar da próxima vez.
(function (LB) {
  const T = (n) => n * LB.TILE;

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
    if (!f.magoVisto || !f.espada) return { area: 'floresta', x: 7, y: 13 };
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

  // Ponto do mundo (px) para onde a seta aponta agora.
  function pontoAlvo(j) {
    const a = alvo(j);
    if (!a || !j.mapa || !j.line) return null;
    if (j.mapa.id !== a.area) {
      const s = proximaSaida(j, a.area);
      return s ? { x: T(s.x + s.w / 2), y: T(s.y + s.h / 2), rotulo: LB.MAPAS[s.para].nome } : null;
    }
    const m = j.mapa, l = j.line;
    const perto = (lista) => lista.sort((p, q) => Math.hypot(p.x - l.x, p.y - l.y) - Math.hypot(q.x - l.x, q.y - l.y))[0];
    if (a.barreira) {
      const b = (m.def.barreiras || []).find((x) => x.id === a.barreira);
      if (b) {
        const apagadas = b.fontes.map((k) => { const [x, y] = k.split(',').map(Number); return m.props.find((p) => p.tx === x && p.ty === y && !p.aceso); }).filter(Boolean);
        if (apagadas.length) { const p = perto(apagadas); return { x: p.x, y: p.y, rotulo: p.tipo === 'tocha' ? 'Tocha apagada' : 'Cristal apagado' }; }
      }
    }
    if (a.chefe && m.def.chefe) return { x: T(m.def.chefe.x), y: T(m.def.chefe.y), rotulo: LB.chefes.CHEFES[m.def.chefe.id].nome };
    if (a.golem) { const g = j.inimigos.find((e) => e.golem && e.vivo); if (g) return { x: g.x, y: g.y, rotulo: 'Guardião de Pedra' }; }
    if (a.prop) { const p = m.props.find((o) => o.tipo === a.prop); if (p) return { x: p.x, y: p.y, rotulo: 'Altar da luz' }; }
    if (a.x != null) return { x: T(a.x), y: T(a.y) };
    return null;
  }

  let cache = { t: -1, p: null };
  function desenharSeta(g, j) {
    if (!ligado() || j.cena || !j.line || j.line.estado === 'morta' || j.estado !== 'jogo' || !j.mapa || j.mapa.tema === 'encontro') return;
    if (j.chefeArena && !j.chefeArena.dormindo) return;
    if (j.tempo - cache.t > 0.5) cache = { t: j.tempo, p: pontoAlvo(j) };
    const p = cache.p, l = j.line;
    if (!p) return;
    const dx = p.x - l.x, dy = p.y - l.y, d = Math.hypot(dx, dy);
    if (d < 70) return;
    const ang = Math.atan2(dy, dx), R = 46 + Math.sin(j.tempo * 4) * 3;
    const x = l.x + Math.cos(ang) * R, y = l.y - 30 + Math.sin(ang) * R * 0.7;
    g.save(); g.translate(x, y); g.rotate(ang);
    g.globalAlpha = 0.85;
    g.fillStyle = '#ffd166'; g.strokeStyle = '#5a3a10'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(12, 0); g.lineTo(-6, -8); g.lineTo(-2, 0); g.lineTo(-6, 8); g.closePath(); g.fill(); g.stroke();
    g.restore();
    if (p.rotulo && d > 160) {
      g.save(); g.globalAlpha = 0.8;
      g.font = '700 9px system-ui, sans-serif'; g.textAlign = 'center';
      const tx = l.x + Math.cos(ang) * (R + 20), ty = l.y - 30 + Math.sin(ang) * (R + 20) * 0.7 + 3;
      g.fillStyle = 'rgba(20,16,30,.7)'; const w = g.measureText(p.rotulo).width + 8; g.fillRect(tx - w / 2, ty - 9, w, 12);
      g.fillStyle = '#ffe9a8'; g.fillText(p.rotulo, tx, ty);
      g.restore();
    }
  }

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

  LB.dicas = { ligado, mostrar, chefe, alvo, proximaSaida, pontoAlvo, desenharSeta, atualizar, aoCair };
})(window.LB);
