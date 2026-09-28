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
    return { grupos, extras, retratos: window.RETRATOS, total: Object.keys(window.SPRITES).length };
  });
  require('fs').writeFileSync(process.argv[2] || 'inventario.json', JSON.stringify(d, null, 1));
  console.log('grupos', d.grupos.length, 'extras', d.extras.length, 'total sprites', d.total);
  await browser.close();
})();
