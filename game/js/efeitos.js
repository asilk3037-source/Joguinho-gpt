'use strict';

// Efeitos em pixel art (itens 98 a 102): impacto, faíscas, explosão, ponto fraco, corações,
// lágrimas, poeira, fumaça e brasas. Cada efeito vem numa célula grande com o desenho no meio;
// `tam` é o tamanho da célula inteira no mundo. Sem a arte, quem chamou usa o efeito antigo.
(function (LB) {
  // Tamanho padrão (célula no mundo) e duração de cada efeito.
  const PADRAO = {
    FX_IMPACT: { tam: 150, dur: 0.35 },
    FX_SPARKS: { tam: 140, dur: 0.45 },
    FX_EXPLOSION: { tam: 300, dur: 0.6 },
    FX_HEARTS: { tam: 170, dur: 1.6 },
    FX_TEARS: { tam: 110, dur: 2.4 },
    FX_DUST: { tam: 120, dur: 0.6 },
    FX_SMOKE: { tam: 90, dur: 1.2 },
    FX_EMBERS: { tam: 110, dur: 1.2 },
    FX_DRAGON_WEAK_POINT: { tam: 230, dur: 1 },
  };

  function pronto(codigo) {
    const s = LB.sprite(codigo), img = LB.imagens[codigo];
    return !!(s && img && img.complete && img.naturalWidth);
  }

  // Desenha o quadro do efeito no tempo `t`, centrado em (x, y).
  function desenharQuadro(g, codigo, x, y, tam, t, o) {
    if (!pronto(codigo)) return false;
    const s = LB.sprite(codigo), img = LB.imagens[codigo];
    const fps = s.fpsArte || 10, n = s.seq.length;
    let i = Math.floor(t * fps);
    i = o && o.loop ? i % n : Math.min(i, n - 1);
    const q = s.seq[i], esc = tam / s.cell;
    g.save();
    g.translate(x, y);
    if (o && o.lado < 0) g.scale(-1, 1);
    if (o && o.alfa != null) g.globalAlpha *= o.alfa;
    g.imageSmoothingEnabled = false;
    g.drawImage(img, q * s.cell, 0, s.cell, s.cell, -s.cell / 2 * esc, -s.cell / 2 * esc, s.cell * esc, s.cell * esc);
    g.restore();
    return true;
  }

  // Um efeito que toca uma vez e some. Devolve false se a arte não existe (para usar o antigo).
  function emitir(j, codigo, x, y, o) {
    if (!pronto(codigo) || !j.efeitos) return false;
    const p = PADRAO[codigo] || { tam: 120, dur: 0.6 };
    j.efeitos.push(Object.assign({ tipo: 'fx', codigo, x, y, t: 0, tam: p.tam, dur: p.dur }, o || {}));
    return true;
  }

  function desenharEfeito(g, f) {
    if (f.tipo !== 'fx') return false;
    const fim = Math.max(0, f.t - f.dur * 0.75) / (f.dur * 0.25);
    desenharQuadro(g, f.codigo, f.x, f.y + (f.sobe ? -f.t * f.sobe : 0), f.tam, f.t, { loop: f.loop, lado: f.lado, alfa: 1 - Math.min(1, fim) });
    return true;
  }

  // Efeito contínuo preso a um objeto (ponto fraco, fumaça da tocha).
  function desenharLoop(g, codigo, x, y, t, o) {
    const p = PADRAO[codigo] || { tam: 120 };
    return desenharQuadro(g, codigo, x, y, (o && o.tam) || p.tam, t, Object.assign({ loop: true }, o || {}));
  }

  LB.fx = { PADRAO, pronto, emitir, desenharEfeito, desenharLoop, desenharQuadro };
})(window.LB);
