// Exporta o catálogo de animações do jogo rodando (python3 -m http.server 8765 em game/).
// Uso: node tools/exportar_inventario.js inventario.json
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
(async () => {
  const browser = await chromium.launch(); const page = await browser.newPage();
  await page.goto('' + (process.env.URL || 'http://localhost:8765/index.html') + ''); await page.waitForSelector('#menu:not(.oculto)');
  const d = await page.evaluate(() => {
    const grupos = LB.inventario().map((g) => ({ nome: g.nome, itens: g.itens.map((it) => {
      const base = it.codigo.replace(/_(FRONT|BACK|LEFT|RIGHT)$/, '');
      const inf = LB.info(LB.CATALOGO[it.codigo] ? it.codigo : base);
      const s = LB.sprite(it.codigo);
      let via = null;
      if (!s) { const r = LB.resolver(LB.CATALOGO[it.codigo] ? it.codigo : base, (it.codigo.match(/_(FRONT|BACK|LEFT|RIGHT)$/) || [])[1], 1); if (r.sprite) via = r.codigo; }
      return { codigo: it.codigo, desc: it.desc, nova: it.nova, existe: it.existe, quadros: s ? s.count : null, seq: s ? s.seq.length : null, fonte: s ? s.item : null, via, quadrosPedidos: inf.quadros, fps: inf.fps, loop: inf.loop };
    }) }));
    const catalogados = new Set(); for (const g of grupos) for (const i of g.itens) catalogados.add(i.codigo);
    const extras = Object.keys(window.SPRITES).filter((c) => !catalogados.has(c)).map((c) => ({ codigo: c, quadros: SPRITES[c].count, fonte: SPRITES[c].item, label: SPRITES[c].label }));
    // Dados do mundo para a documentação: mapas, baús, itens, documentos, loja e carrinho.
    const M = LB.mochila;
    const mapas = {};
    for (const [id, d] of Object.entries(LB.MAPAS)) {
      if (d.tema === 'encontro') continue;
      const inimigos = {};
      for (const e of d.inimigos || []) { const t = e.tipo || 'sombra'; inimigos[t] = (inimigos[t] || 0) + 1; }
      const conta = (c) => d.linhas.reduce((n, l) => n + [...l].filter((x) => x === c).length, 0);
      mapas[id] = { nome: d.nome, tema: d.tema, w: Math.max(...d.linhas.map((l) => l.length)), h: d.linhas.length,
        saidas: (d.saidas || []).map((x) => ({ para: x.para, requer: x.requer || null })), baus: d.baus || {}, chao: d.chao || [], exames: d.exames || [],
        npcs: d.npcs || [], estacao: d.estacao || null, inimigos, portas: conta('g'), rachaduras: conta('%'), postes: conta('p'), brasa: conta('l'), fontes: conta('U'), escuro: !!d.escuro };
    }
    const fn = (o) => JSON.parse(JSON.stringify(o, (k, v) => (typeof v === 'function' ? undefined : v)));
    const mundo = { mapas, itens: fn(M.ITENS), ordemItens: M.ORDEM_ITENS, pistas: M.PISTAS, ordemPistas: M.ORDEM_PISTAS, conclusoes: M.CONCLUSOES, tiposDoc: M.TIPOS_DOC,
      armaduras: LB.loja.ARMADURAS, lojas: fn(LB.loja.LOJAS), moradores: LB.loja.MORADORES, estacoes: LB.carrinho.ESTACOES, dificuldades: fn(LB.dificuldade.NIVEIS) };
    return { grupos, extras, retratos: window.RETRATOS, total: Object.keys(window.SPRITES).length, mundo };
  });
  require('fs').writeFileSync(process.argv[2] || 'inventario.json', JSON.stringify(d, null, 1));
  console.log('grupos', d.grupos.length, 'extras', d.extras.length, 'total sprites', d.total);
  await browser.close();
})();
