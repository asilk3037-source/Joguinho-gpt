'use strict';

// Relógio do jogo: 1 segundo real = 1 minuto no jogo (1 minuto real = 1 hora; um dia = 24 minutos).
// Só anda durante o jogo (para na pausa, mochila, loja e cenas). Dá o dia e a noite das áreas
// abertas, acende vaga-lumes, põe os moradores para dormir e deixa descansar na fonte à noite.
(function (LB) {
  const DIA = 24 * 60;
  const INICIO = 8 * 60;              // save antigo ou área aberta direto: 8h do dia 1
  const APOS_RAPTO = 19 * 60 + 30;   // a aventura começa ao anoitecer, logo depois do rapto
  // Quanto a noite escurece cada tema (0 = lugar fechado, não muda).
  const CEU = { fazenda: 1, floresta: 1, vilarejo: 1, vale: 1, lago: 1, picos: 0.9, montanha: 0.6, ruinas: 0.7, pantano: 0.9, tempestade: 0.5 };

  function ativo(j) { return !!(j && j.flags && j.flags.prologo && j.mapa && j.mapa.tema !== 'encontro'); }
  function minutos(j) { if (j.flags.minutos == null) j.flags.minutos = INICIO; return j.flags.minutos; }
  function hora(j) { return (minutos(j) % DIA) / 60; }
  function dia(j) { return Math.floor(minutos(j) / DIA) + 1; }
  function texto(j) {
    const m = Math.floor(minutos(j)) % DIA;
    return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  }

  // Luz do dia de 0 (noite) a 1 (dia claro). Amanhece das 5h às 7h, anoitece das 17h às 20h.
  function luz(j) {
    const h = hora(j);
    if (h >= 7 && h < 17) return 1;
    if (h >= 5 && h < 7) return (h - 5) / 2;
    if (h >= 17 && h < 20) return 1 - (h - 17) / 3;
    return 0;
  }
  function noite(j) { const h = hora(j); return h >= 20 || h < 5; }
  function pode(j) { return ativo(j) && !(j.mapa.def && j.mapa.def.semRelogio); }

  function comecarAventura(j) { if (j.flags.minutos == null || j.flags.minutos < APOS_RAPTO) j.flags.minutos = APOS_RAPTO; }

  function atualizar(j, dt) {
    if (!pode(j) || j.cena || j.estado !== 'jogo') return;
    const antes = noite(j);
    j.flags.minutos = minutos(j) + dt;
    const agora = noite(j);
    // Vaga-lumes nas áreas abertas à noite (a floresta e as ruínas já têm os seus).
    const amb = j.ambiente, ceu = CEU[j.mapa.tema] || 0;
    if (amb && ceu && !['floresta', 'ruinas'].includes(j.mapa.tema)) {
      if (agora && !amb.luzes.length) amb.anoitecer();
      else if (!agora && luz(j) > 0.6 && amb.luzes.length && !j.duo) amb.luzes = [];
    }
    if (antes !== agora && ceu) {
      LB.mochila.aviso(agora ? `🌙 Anoiteceu (${texto(j)})` : `☀️ Amanheceu · Dia ${dia(j)}`);
      if (agora) j.dica('noite', 'À noite fica mais escuro e os moradores do vilarejo vão dormir. Dá para descansar em qualquer fonte até de manhã.');
    }
  }

  // Céu por cima do mundo (em coordenadas de tela): azul-escuro à noite, laranja ao entardecer,
  // rosado ao amanhecer, com um círculo de luz em volta da heroína.
  function desenharCeu(g, j) {
    if (!pode(j)) return;
    const forca = CEU[j.mapa.tema] || 0;
    if (!forca) return;
    const L = luz(j), h = hora(j), W = j.canvas.width, H = j.canvas.height;
    if (L >= 1) return;
    const escuro = (1 - L) * 0.55 * forca;
    const l = j.line, s = j.escala;
    if (l) {
      const px = (l.x - j.cam.x) * s, py = (l.y - 30 - j.cam.y) * s;
      const r0 = (LB.mochila.tem(j, 'lanterna') ? 150 : 90) * s, r1 = r0 * 2.4;
      const gr = g.createRadialGradient(px, py, r0 * 0.4, px, py, r1);
      gr.addColorStop(0, `rgba(12,16,48,${escuro * 0.25})`); gr.addColorStop(1, `rgba(12,16,48,${escuro})`);
      g.fillStyle = gr;
    } else g.fillStyle = `rgba(12,16,48,${escuro})`;
    g.fillRect(0, 0, W, H);
    // Entardecer e amanhecer.
    const tarde = h >= 16.5 && h < 20 ? Math.sin(Math.min(1, (h - 16.5) / 3.5) * Math.PI) : 0;
    const manha = h >= 4.5 && h < 7.5 ? Math.sin(((h - 4.5) / 3) * Math.PI) : 0;
    if (tarde > 0) { g.fillStyle = `rgba(255,120,50,${0.16 * tarde * forca})`; g.fillRect(0, 0, W, H); }
    if (manha > 0) { g.fillStyle = `rgba(255,170,190,${0.12 * manha * forca})`; g.fillRect(0, 0, W, H); }
  }

  // Relógio no HUD: hora, dia e sol/lua.
  function desenharHud(g, j, s) {
    if (!ativo(j)) return;
    const W = j.canvas.width, x = W / 2, y = 16 * s;
    const txt = `${noite(j) ? '🌙' : luz(j) < 1 ? '🌅' : '☀️'} ${texto(j)} · Dia ${dia(j)}`;
    g.font = `700 ${10 * s}px system-ui, sans-serif`; g.textAlign = 'center';
    const w = g.measureText(txt).width + 16 * s;
    g.fillStyle = 'rgba(20,16,30,.6)';
    g.beginPath(); g.roundRect ? g.roundRect(x - w / 2, y - 9 * s, w, 17 * s, 8 * s) : g.rect(x - w / 2, y - 9 * s, w, 17 * s); g.fill();
    g.fillStyle = '#ffe9c7'; g.fillText(txt, x, y + 3.5 * s);
  }

  // Descansar na fonte à noite: pula para as 7h do dia seguinte, com vida e magia cheias.
  function* cenaDescansar(c, j) {
    const l = j.line;
    l.anim.tocar('LINE_CROUCH', true);
    yield c.escurecer(1, 1);
    const m = minutos(j), hoje = Math.floor(m / DIA) * DIA;
    j.flags.minutos = (m % DIA >= 7 * 60 ? hoje + DIA : hoje) + 7 * 60;
    l.hp = l.hpMax; l.mana = l.manaMax;
    if (LB.herois) LB.herois.descansar(j);
    if (j.ambiente && CEU[j.mapa.tema]) j.ambiente.luzes = j.mapa.tema === 'floresta' ? j.ambiente.luzes : [];
    yield c.titulo('Bom dia!', `Dia ${dia(j)} · ${texto(j)}`, 1.8);
    l.anim.tocar('LINE_IDLE', true);
    yield c.escurecer(0, 1);
    j.salvar();
  }

  function acoes(j, lista, perto) {
    if (!ativo(j) || !noite(j)) return;
    for (const p of j.mapa.props) {
      if (p.tipo !== 'fonte' || !perto(p.x, p.y + 14, 60)) continue;
      lista.push({ texto: 'Descansar até de manhã', x: p.x, y: p.y - 76, prio: 0.5, fazer: () => { j.beberFonte(p); j.iniciarCena(cenaDescansar, { semPular: true }); } });
    }
  }

  LB.relogio = { DIA, INICIO, APOS_RAPTO, ativo, pode, minutos, hora, dia, texto, luz, noite, comecarAventura, atualizar, desenharCeu, desenharHud, acoes, cenaDescansar, CEU };
})(window.LB);
