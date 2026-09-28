// Tira as capturas das partes novas do jogo para a documentação (PNG).
// Precisa do jogo servido em http://localhost:8765 (python3 -m http.server 8765 dentro de game/).
// Uso: node tools/fotos_documentacao.js pasta_de_saida
// Depois, converta para JPG em docs/imagens (o gerador da documentação usa .jpg).
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const path = require('path');
const SAIDA = process.argv[2] || '.';

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const erros = [];
  p.on('pageerror', (e) => erros.push(String(e)));
  await p.goto(process.env.URL || 'http://localhost:8765/');
  await p.waitForSelector('#menu:not(.oculto)');
  const foto = (nome) => p.screenshot({ path: path.join(SAIDA, nome + '.png') });
  const BASE = { encontroFeito: true, manhaVista: true, prologo: true, florestaVista: true, espada: true, magoVisto: true, magoRuinas: true, ruinasVistas: true, magia: true, versaoMundo: 2 };
  // Vai para uma área, põe a Line em (tx, ty) e espera o banner sumir.
  const ir = async (area, tx, ty, flags, antes) => {
    await p.evaluate(([area, tx, ty, flags, BASE]) => {
      const j = LB.jogo;
      document.querySelector('#menu').classList.add('oculto');
      j.flags = Object.assign({}, BASE, flags || {});
      j.iniciarArea(area, null, true);
      j.terminarCena();
      j.line.x = tx * 32; j.line.y = ty * 32; j.line.voltarLivre(); j.cameraEm(j.line.x, j.line.y - 24);
      LB.mochila.explorar(j, 1);
    }, [area, tx, ty, flags, BASE]);
    if (antes) await p.evaluate(antes);
    await p.waitForTimeout(2600);
  };
  const dar = (itens) => p.evaluate((itens) => { for (const [id, n] of itens) LB.mochila.dar(LB.jogo, id, n, true); LB.mochila.inv(LB.jogo).novos = 0; LB.mochila.atualizarBotoes(LB.jogo); }, itens);

  // Vilarejo e moradores.
  await ir('vilarejo', 26, 16.5, { moedas: 45 });
  await foto('37-vilarejo');
  await ir('vilarejo', 15.5, 13.2, { moedas: 60 });
  await p.evaluate(() => LB.loja.tela.abrir(LB.jogo, 'rosa'));
  await p.waitForTimeout(300); await foto('38-loja-rosa');
  await ir('vilarejo', 44.5, 13.2, { moedas: 200, armadura: 'tunica', inv: { itens: {}, pistas: ['receita', 'cartaz'], novos: 0, conclusoes: ['brasa'] } });
  await p.evaluate(() => LB.loja.tela.abrir(LB.jogo, 'bento'));
  await p.waitForTimeout(300); await foto('39-ferraria');
  // Estação e carrinho.
  await ir('vilarejo', 52.7, 22.2, { alavanca: true, estacoes: ['vilarejo', 'minas'] });
  await foto('40-estacao');
  await p.evaluate(() => LB.carrinho.tela.abrir(LB.jogo));
  await p.waitForTimeout(300); await foto('41-carrinho-destinos');
  await p.evaluate(() => LB.carrinho.tela.fechar());
  await p.evaluate(() => { const j = LB.jogo; j.iniciarCena(LB.carrinho.cenaPartida, { semPular: false }, 'minas'); });
  await p.waitForTimeout(1100); await foto('42-carrinho-andando');
  // Minas: escuro sem e com lanterna.
  await ir('gruta', 46.5, 21, {});
  await foto('43-minas-escuro');
  await ir('gruta', 46.5, 21, { inv: { itens: { lanterna: 1 }, pistas: [], novos: 0 } });
  await foto('44-minas-lanterna');
  // Gancho, parede rachada e brasa.
  await ir('floresta', 62.5, 15.6, { inv: { itens: { gancho: 1 }, pistas: [], novos: 0 } });
  await foto('45-gancho');
  const rach = await p.evaluate(() => { const m = LB.MAPAS.floresta.linhas; for (let y = 0; y < m.length; y++) { const x = m[y].indexOf('%'); if (x >= 0) return [x, y]; } return null; });
  await ir('floresta', rach[0] - 1.5, rach[1] + 0.9, { inv: { itens: { bomba: 2 }, pistas: [], novos: 0, equipado: 'bomba' } });
  await p.evaluate(() => { const j = LB.jogo; j.bombas.push({ x: j.line.x + 22, y: j.line.y + 2, t: 0.6 }); });
  await p.waitForTimeout(500); await foto('46-bomba');
  const brasa = await p.evaluate(() => { const m = LB.MAPAS.montanha.linhas; for (let y = 0; y < m.length; y++) { const x = m[y].indexOf('l'); if (x >= 0) return [x, y]; } return null; });
  await ir('montanha', brasa[0] + 0.5, brasa[1] - 1, { golem: true, montanhaVista: true, armadura: 'brasa' });
  await foto('47-brasa');
  // HUD com escudos, moedas e item no atalho.
  await ir('floresta', 41, 14, { moedas: 87, armadura: 'malha', inv: { itens: { pocao: 2, bomba: 3 }, pistas: [], novos: 0, equipado: 'bomba' } });
  await p.evaluate(() => { const l = LB.jogo.line; l.escudos = 1; l.hp = 5; });
  await p.waitForTimeout(400); await foto('48-hud-escudos');
  // Mochila: itens, documentos e conclusões, mapa do mundo.
  const pistas = ['pegadas', 'cartaz', 'carta', 'cacador', 'lenda', 'minerador', 'mapa', 'receita'];
  await ir('floresta', 41, 14, { moedas: 87, armadura: 'malha', inv: { itens: { pocao: 2, elixir: 1, bomba: 3, pena: 1, chave: 1, lanterna: 1, gancho: 1, bussola: 1, botas: 1 }, pistas, novos: 0, equipado: 'bomba', conclusoes: [] } });
  await p.evaluate(() => { LB.mochila.verificarConclusoes(LB.jogo); LB.mochila.tela.abrir('itens'); });
  await p.waitForTimeout(300); await foto('49-mochila-itens');
  await p.evaluate(() => { const t = LB.mochila.tela; t.pista = 'minerador'; t.mostrarAba('pistas'); });
  await p.waitForTimeout(300); await foto('50-documento-relatorio');
  await p.evaluate(() => { const t = LB.mochila.tela; t.pista = 'cartaz'; t.atualizarPistas(); document.querySelector('#conclusoes-lista').scrollIntoView(); });
  await p.waitForTimeout(300); await foto('51-conclusoes');
  await p.evaluate(() => { const j = LB.jogo; j.flags.vistos = Object.assign(j.flags.vistos || {}, { fazenda: 'f'.repeat(900), vilarejo: 'f'.repeat(900), gruta: 'f'.repeat(900) }); const t = LB.mochila.tela; t.mapaModo = 'mundo'; t.mostrarAba('mapa'); });
  await p.waitForTimeout(400); await foto('52-mapa-mundo');
  await p.evaluate(() => LB.mochila.tela.fechar());

  // Mapas completos de cada área (tudo explorado).
  await p.evaluate(() => { const j = LB.jogo; j.estado = 'menu'; j.mapa = { id: '_', tema: '_' }; });
  for (const id of ['fazenda', 'vilarejo', 'floresta', 'gruta', 'ruinas', 'montanha']) {
    await p.evaluate((id) => {
      const j = LB.jogo;
      j.flags.vistos = j.flags.vistos || {};
      j.flags.vistos[id] = 'f'.repeat(4000);
      let cv = document.querySelector('#cv-doc');
      if (!cv) { cv = document.createElement('canvas'); cv.id = 'cv-doc'; cv.style.cssText = 'position:fixed;left:0;top:0;width:1280px;height:720px;z-index:99;background:#17121f'; document.body.appendChild(cv); }
      cv.style.display = 'block';
      LB.mochila.desenharMapaArea(cv, j, id);
    }, id);
    await p.waitForTimeout(150);
    await foto('mapa-' + id);
  }
  console.log('ERROS', erros.length ? erros.join('\n') : 'nenhum');
  await b.close();
})();
