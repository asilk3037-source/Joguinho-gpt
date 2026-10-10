'use strict';

// Testes automatizados do Line & Bell.
// Sobe um servidor estático para a pasta game/, abre o jogo num Chromium (Playwright)
// e passa por todas as telas: menu, controles, galeria, prólogo, fazenda, pausa, mochila
// (itens, documentos, mapa), cada área, loja, ferraria, carrinho, bombas, gancho, derrota,
// save/continuar/migração, celular, IA dos inimigos e a conectividade de todos os mapas.
//
// Uso:  cd tests && npm test            (todos)
//       node rodar.js loja carrinho       (só os testes cujo nome contém essas palavras)
// Variáveis: PLAYWRIGHT=/caminho/do/playwright  CHROMIUM=/caminho/do/chromium  FOTOS=1 (salva capturas)

const http = require('http');
const fs = require('fs');
const path = require('path');

function carregarPlaywright() {
  const tentativas = [process.env.PLAYWRIGHT, 'playwright', '@playwright/test', '/opt/node22/lib/node_modules/playwright'].filter(Boolean);
  for (const t of tentativas) { try { return require(t); } catch (e) { /* próxima */ } }
  console.error('Playwright não encontrado. Rode `npm install` dentro de tests/ ou defina PLAYWRIGHT.');
  process.exit(2);
}
const { chromium } = carregarPlaywright();

const RAIZ = path.resolve(__dirname, '..', 'game');
const FOTOS = process.env.FOTOS ? path.join(__dirname, 'fotos') : null;
if (FOTOS) fs.mkdirSync(FOTOS, { recursive: true });

// ---------------- Servidor estático ----------------
const TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.json': 'application/json', '.svg': 'image/svg+xml' };
function servidor() {
  return new Promise((ok) => {
    const s = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split('?')[0]);
      let arq = path.join(RAIZ, url === '/' ? 'index.html' : url);
      if (!arq.startsWith(RAIZ)) { res.writeHead(403); res.end(); return; }
      fs.readFile(arq, (err, dados) => {
        if (err) { res.writeHead(404); res.end('404'); return; }
        res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arq)] || 'application/octet-stream' });
        res.end(dados);
      });
    });
    s.listen(0, '127.0.0.1', () => ok(s));
  });
}

// ---------------- Mini framework ----------------
const testes = [];
const teste = (nome, fn, o) => testes.push({ nome, fn, o: o || {} });

class Falha extends Error {}
function afirmar(cond, msg) { if (!cond) throw new Falha(msg); }
function igual(a, b, msg) { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Falha(`${msg}: esperado ${JSON.stringify(b)}, veio ${JSON.stringify(a)}`); }

let BASE = '';
let navegador = null;

// Abre o jogo numa página nova (armazenamento limpo, a não ser que `save` seja passado).
async function abrir(o) {
  o = o || {};
  const ctx = await navegador.newContext({
    viewport: o.celular ? { width: 844, height: 390 } : { width: 1280, height: 720 },
    hasTouch: !!o.celular, isMobile: !!o.celular, deviceScaleFactor: 1,
  });
  const p = await ctx.newPage();
  const erros = [];
  p.on('pageerror', (e) => erros.push('pageerror: ' + (e.stack || e)));
  p.on('console', (m) => { if (m.type() === 'error' && !/favicon/.test(m.text())) erros.push('console: ' + m.text()); });
  if (o.save) await ctx.addInitScript((s) => { try { localStorage.setItem('lineBell.save.v1', s); } catch (e) { /* ok */ } }, JSON.stringify(o.save));
  await p.goto(BASE + '/');
  await p.waitForFunction(() => window.LB && LB.jogo && !document.querySelector('#menu').classList.contains('oculto'), null, { timeout: 30000 });
  const ev = (fn, arg) => p.evaluate(fn, arg);
  const h = {
    p, erros, ev, ctx,
    espera: (ms) => p.waitForTimeout(ms),
    visivel: (sel) => ev((s) => { const e = document.querySelector(s); return !!e && !e.classList.contains('oculto') && getComputedStyle(e).display !== 'none'; }, sel),
    estado: () => ev(() => LB.jogo.estado),
    // Acelera as cenas até acabarem (ou até `max` passos).
    async avancar(max) {
      for (let i = 0; i < (max || 200); i++) {
        const tem = await ev(() => { const j = LB.jogo; if (j.cena) { j.cena.rapido = true; LB.dialogo.clicou = true; return true; } return false; });
        if (!tem) return;
        await p.waitForTimeout(40);
      }
    },
    // Vai direto para uma área com as flags dadas (pula o prólogo).
    async area(id, flags, chegada) {
      await ev(([id, flags, chegada]) => {
        const j = LB.jogo;
        document.querySelector('#menu').classList.add('oculto');
        j.flags = Object.assign({ encontroFeito: true, manhaVista: true, prologo: true, florestaVista: true, versaoMundo: 2 }, flags || {});
        j.iniciarArea(id, chegada || null, true);
      }, [id, flags, chegada]);
      await p.waitForTimeout(150);
      await h.avancar();
    },
    // Teleporta a Line (em tiles).
    async ir(tx, ty) {
      await ev(([x, y]) => { const j = LB.jogo; j.line.x = x * 32; j.line.y = y * 32; j.line.voltarLivre(); j.cameraEm(j.line.x, j.line.y); }, [tx, ty]);
      await p.waitForTimeout(120);
    },
    prompt: () => ev(() => { const a = LB.jogo.acoesPossiveis(); return a ? a.texto : null; }),
    async interagir() { await ev(() => { const a = LB.jogo.acoesPossiveis(); if (a) a.fazer(); }); await p.waitForTimeout(120); await h.avancar(); await p.waitForTimeout(80); },
    async foto(nome) { if (FOTOS) await p.screenshot({ path: path.join(FOTOS, nome + '.png') }); },
    fechar: () => ctx.close(),
  };
  return h;
}

// ================= Telas do menu =================
teste('menu: botões, dificuldade, controles e galeria', async (h) => {
  afirmar(await h.visivel('#menu'), 'menu deveria aparecer');
  afirmar(await h.visivel('#btn-novo'), 'botão Novo jogo');
  const d0 = await h.ev(() => document.querySelector('#btn-dificuldade').textContent);
  await h.p.click('#btn-dificuldade');
  const d1 = await h.ev(() => document.querySelector('#btn-dificuldade').textContent);
  afirmar(d0 !== d1, 'dificuldade deveria mudar ao clicar');
  await h.p.click('#btn-controles');
  afirmar(await h.visivel('#controles'), 'tela de controles');
  const txt = await h.ev(() => document.querySelector('#controles').textContent);
  afirmar(/item do atalho/.test(txt) && /Mochila/.test(txt), 'controles devem listar mochila e item do atalho');
  await h.p.click('#btn-voltar-controles');
  afirmar(await h.visivel('#menu'), 'volta ao menu');
  await h.p.click('#btn-galeria');
  afirmar(await h.visivel('#galeria'), 'galeria de animações');
  await h.espera(400);
  const n = await h.ev(() => document.querySelectorAll('#galeria-lista button').length);
  afirmar(n > 20, `galeria deveria listar animações (veio ${n})`);
  await h.foto('galeria');
  await h.p.click('#btn-voltar-galeria');
  afirmar(await h.visivel('#menu'), 'volta ao menu depois da galeria');
});

teste('menu: botão de teste leva a qualquer mapa com o jogo zerado e não salva', async (h) => {
  await h.ev(() => localStorage.setItem('lineBell.save.v1', JSON.stringify({ area: 'vilarejo', flags: { prologo: true, marca: 'real' } })));
  await h.p.click('#btn-teste');
  afirmar(await h.visivel('#teste'), 'tela de escolha do mapa');
  const ids = await h.ev(() => [...document.querySelectorAll('#teste-lista button')].map((b) => b.dataset.mapa));
  afirmar(ids.includes('fazenda') && ids.includes('coracao') && ids.includes('casa_ferraria'), 'lista mapas das duas partes e as casas: ' + ids);
  afirmar(!(await h.ev((ids) => ids.some((id) => LB.MAPAS[id].tema === 'encontro'), ids)), 'o Primeiro Encontro fica fora (é só cena)');
  await h.p.click('#teste-lista button[data-mapa="picos"]');
  await h.espera(300);
  const r = await h.ev(() => { const j = LB.jogo, f = j.flags; return { mapa: j.mapa.id, zerado: f.zerado && f.zeradoParte2 && f.quimeraVencida, bell: LB.herois.liberada(j), espada: j.line.temEspada, magia: j.line.temMagia, estrela: j.line.temEstrela,
    gancho: LB.mochila.tem(j, 'gancho'), pistas: LB.mochila.inv(j).pistas.length, total: LB.mochila.totalPistas(), estacoes: f.estacoes.length, aberta: (f.abertas || []).includes('picos:farois'), hp: j.line.hp === j.line.hpMax }; });
  igual(r.mapa, 'picos', 'entrou no mapa escolhido');
  afirmar(r.zerado && r.bell && r.espada && r.magia && r.estrela && r.gancho && r.estacoes === 3 && r.aberta && r.hp, 'tudo liberado: ' + JSON.stringify(r));
  afirmar(r.pistas >= r.total, 'todos os documentos');
  igual(await h.ev(() => JSON.parse(localStorage.getItem('lineBell.save.v1')).flags.marca), 'real', 'o save de verdade fica intacto');
  await h.ev(() => LB.jogo.voltarAoMenu());
  await h.p.click('#btn-continuar');
  await h.espera(300);
  igual(await h.ev(() => [LB.jogo.mapa.id, LB.jogo.teste]), ['vilarejo', false], 'Continuar volta para o save de verdade');
});

// ================= Prólogo e fazenda =================
teste('prólogo: Novo jogo abre o Primeiro Encontro', async (h) => {
  await h.p.click('#btn-novo');
  await h.espera(600);
  const r = await h.ev(() => ({ tema: LB.jogo.mapa.tema, estado: LB.jogo.estado }));
  igual(r.tema, 'encontro', 'tema do prólogo');
  igual(r.estado, 'jogo', 'estado');
  await h.avancar(60);
  await h.espera(300);
  await h.foto('prologo');
});

teste('prólogo: o BK acontece na mesa do BK (frente a frente, depois juntinhas) e a saída vai pelo corredor', async (h) => {
  await h.ev(() => { const j = LB.jogo; document.querySelector('#menu').classList.add('oculto'); j.flags = {}; j.encontro = { etapa: 'conversa', placar: '000' }; j.iniciarArea('shopping', null, true); j.fade = 0; j.iniciarCena(LB.HISTORIA.encontroConversa); });
  const r = await h.ev(async () => {
    const j = LB.jogo, n = () => LB.encontro.objetos(j).length, total = n();
    let bk = null, frente = null, saida = [];
    for (let i = 0; i < 600 && j.mapa.id === 'shopping' && j.cena; i++) {
      const l = j.line, b = j.bell;
      if (!frente && l.anim.base === 'LINE_SIT_CHAIR_EAT') frente = { pecas: n(), line: [l.anim.base, l.lado, l.x], bell: [b.anim.base, b.lado, b.x], duo: !!j.duo };
      if (j.duo && j.duo.anim.base === 'LINE_BELL_BK' && !bk) bk = { pecas: n(), x: j.duo.x, y: j.duo.y };
      if (j.duo && j.duo.anim.base === 'LINE_BELL_WALK_HANDS') saida.push([j.duo.x, j.duo.y]);
      LB.dialogo.clicou = true;
      await new Promise((ok) => setTimeout(ok, 40));
    }
    return { total, bk, frente, saida, depois: j.encontro.sentadas };
  });
  afirmar(r.frente, 'primeiro sentam frente a frente, cada uma na sua cadeira (itens 265 e 266)');
  igual(r.total - r.frente.pecas, 2, 'as duas cadeiras dos lados da mesa do BK saem de cena');
  igual([r.frente.line.slice(0, 2), r.frente.bell.slice(0, 2), r.frente.duo], [['LINE_SIT_CHAIR_EAT', 1], ['BELL_SIT_CHAIR_EAT', -1], false], 'a Line virada para a direita e a Bell para a esquerda');
  afirmar(r.frente.line[2] < r.frente.bell[2], 'a Line à esquerda da mesa e a Bell à direita');
  afirmar(r.bk, 'depois aparecem juntinhas comendo BK');
  igual(r.total - r.bk.pecas, 2, 'as duas cadeiras de trás da mesa do BK saem de cena');
  igual([Math.round(r.bk.x / (4 / 3)), Math.round(r.bk.y / (4 / 3))], [276, 384], 'as duas sentam atrás da mesa do BK');
  afirmar(r.saida.length > 3 && r.saida.every(([x, y]) => y / (4 / 3) <= 437 || Math.abs(x / (4 / 3) - 180) < 2), 'descem pelo corredor do meio: ' + JSON.stringify(r.saida.slice(-3)));
  afirmar(!r.depois, 'as cadeiras voltam depois do lanche');
});

teste('duas juntas: lado a lado no shopping, de mãos dadas no túnel e correndo de mãos dadas na fazenda', async (h) => {
  const andou = async (prep, base) => h.ev(async ([prep, base]) => {
    const j = LB.jogo; document.querySelector('#menu').classList.add('oculto');
    j.flags = {}; j.encontro = { etapa: prep === 'shopping' ? 'conversa' : 'intro', placar: '038' }; j.iniciarArea(prep, null, true); j.fade = 0;
    j.iniciarCena(prep === 'shopping' ? LB.HISTORIA.encontroConversa : LB.HISTORIA.encontroTunel);
    const xs = [];
    for (let i = 0; i < 400 && j.cena; i++) {
      if (j.duo && j.duo.anim.base === base) xs.push([j.duo.x, j.duo.anim.estado(j.duo.dir, 1).r.codigo]);
      else if (xs.length) break;
      if (!j.duo || j.duo.anim.base !== base) LB.dialogo.clicou = true;
      await new Promise((ok) => setTimeout(ok, 40));
    }
    return xs;
  }, [prep, base]);
  const shop = await andou('shopping', 'LINE_BELL_WALK_TOGETHER');
  afirmar(shop.length > 5 && shop[shop.length - 1][0] > shop[0][0], 'no shopping as duas vão lado a lado até a mesa do BK: ' + JSON.stringify(shop.slice(-1)));
  igual(shop[0][1], 'LINE_BELL_WALK_TOGETHER_RIGHT', 'arte nova de lado (item 279)');
  const tunel = await andou('tunel', 'LINE_BELL_WALK_HANDS');
  afirmar(tunel.length > 5 && tunel[tunel.length - 1][0] > tunel[0][0], 'no túnel elas entram de mãos dadas');
  igual(tunel[0][1], 'LINE_BELL_WALK_HANDS_RIGHT', 'arte nova de mãos dadas para a direita (item 281)');
  // Fazenda à tarde: de mãos dadas dá para correr (a Line puxando a Bell).
  await h.ev(() => { const j = LB.jogo; j.flags = { encontroFeito: true, manhaVista: true, etapa: 'tarde' }; j.iniciarArea('fazenda', null, true); j.iniciarCapitulo(); for (let k = 0; k < 5 && j.cena; k++) j.terminarCena(); j.comecarTarde(); });
  await h.espera(300);
  await h.p.keyboard.down('ArrowLeft'); await h.espera(400);
  const andando = await h.ev(() => { const l = LB.jogo.line; return [l.modoDuo, l.correndo, l.animDuo && l.animDuo.base]; });
  await h.p.keyboard.down('ShiftLeft'); await h.espera(400);
  const correndo = await h.ev(() => { const l = LB.jogo.line; return [l.correndo, l.animDuo && l.animDuo.base, l.animDuo && l.animDuo.estado(l.dir, l.lado).r.codigo]; });
  await h.p.keyboard.up('ShiftLeft'); await h.p.keyboard.up('ArrowLeft');
  igual(andando, [true, false, 'LINE_BELL_WALK_HANDS'], 'andando de mãos dadas');
  igual(correndo, [true, 'LINE_BELL_RUN_TOGETHER', 'LINE_BELL_RUN_TOGETHER_LEFT'], 'correndo juntas (item 283)');
});

teste('prólogo: playground montado em peças e o soco vira 038', async (h) => {
  await h.ev(() => { const j = LB.jogo; document.querySelector('#menu').classList.add('oculto'); j.flags = {}; j.encontro = { etapa: 'intro', placar: '000' }; j.iniciarArea('playground', null, true); j.fade = 0; j.iniciarCena(LB.HISTORIA.encontroPlayground); });
  for (let i = 0; i < 80 && (await h.ev(() => LB.jogo.encontro.etapa)) !== 'soco'; i++) await h.espera(150);
  const r = await h.ev(() => {
    const pecas = LB.encontro.objetos(LB.jogo);
    const nomes = ['playground_fundo', 'playground_painel_premios', 'playground_maquina_fliperama_rosa', 'playground_maquina_fliperama_azul', 'playground_balcao_premios_rosa',
      'playground_maquina_garra_rosa', 'playground_maquina_capsulas_rosa', 'playground_parede_neon_coracao_rosa', 'playground_parede_guirlanda_ingressos', 'playground_maquina_soco_000', 'playground_maquina_soco_038'];
    return { pecas: pecas.length, faltando: nomes.filter((n) => !LB.personagem(n)), quadros: [SPRITES.LINE_PUNCH_MACHINE.count, SPRITES.BELL_LAUGH_AT_LINE.count] };
  });
  igual(r.pecas, 16, 'peças do playground');
  igual(r.faltando, [], 'artes do playground carregadas');
  igual(r.quadros, [6, 12], 'quadros do soco e da risada (item 263, com 12)');
  await h.ev(() => LB.jogo.iniciarCena(LB.HISTORIA.encontroSoco));
  for (let i = 0; i < 60 && (await h.ev(() => LB.jogo.encontro.placar)) !== '038'; i++) await h.espera(50);
  igual(await h.ev(() => LB.jogo.encontro.placar), '038', 'placar depois do soco');
});

teste('fazenda: capítulo da manhã começa com a Bell', async (h) => {
  await h.ev(() => { const j = LB.jogo; document.querySelector('#menu').classList.add('oculto'); j.flags = { encontroFeito: true }; j.iniciarArea('fazenda', null, true); j.iniciarCapitulo(); });
  await h.espera(300);
  await h.avancar();
  const r = await h.ev(() => ({ area: LB.jogo.mapa.id, bell: !!LB.jogo.bell, etapa: LB.jogo.flags.etapa, manha: LB.jogo.flags.manhaVista }));
  igual(r.area, 'fazenda', 'área');
  afirmar(r.bell, 'a Bell deveria estar na fazenda');
  igual(r.etapa, 'manha', 'etapa');
  afirmar(r.manha, 'cena da manhã deveria marcar manhaVista');
  await h.foto('fazenda');
});

teste('fazenda: estrada do vilarejo fica fechada antes do rapto', async (h) => {
  await h.area('fazenda', { prologo: false });
  const bloqueado = await h.ev(() => LB.jogo.bloqueia(44.9 * 32, 11.9 * 32, LB.jogo.line));
  afirmar(bloqueado, 'a saída leste deveria bloquear antes do prólogo');
  await h.area('fazenda', {});
  const livre = await h.ev(() => LB.jogo.bloqueia(44.9 * 32, 11.9 * 32, LB.jogo.line));
  afirmar(!livre, 'depois do rapto a estrada abre');
  await h.ir(45.3, 11.7);
  await h.espera(300);
  igual(await h.ev(() => LB.jogo.mapa.id), 'vilarejo', 'a estrada leva ao vilarejo');
});

// ================= Pausa =================
teste('pausa: abre, abre a mochila e volta', async (h) => {
  await h.area('floresta', { espada: true, magoVisto: true });
  await h.ev(() => LB.ui.pausar());
  afirmar(await h.visivel('#pausa'), 'tela de pausa');
  igual(await h.estado(), 'pausa', 'estado pausa');
  await h.foto('pausa');
  await h.p.click('#btn-pausa-mochila');
  afirmar(await h.visivel('#mochila'), 'mochila pela pausa');
  await h.p.keyboard.press('Escape');
  await h.espera(100);
  afirmar(await h.visivel('#pausa'), 'fechar a mochila volta para a pausa');
  await h.p.click('#btn-retomar');
  igual(await h.estado(), 'jogo', 'retomou');
});

// ================= Mochila =================
teste('mochila: itens, equipar, usar, documentos, conclusões e mapa', async (h) => {
  await h.area('floresta', { espada: true, magoVisto: true, magia: true });
  await h.ev(() => { const j = LB.jogo, M = LB.mochila; M.dar(j, 'pocao', 2); M.dar(j, 'bomba', 3); M.dar(j, 'elixir', 1); M.dar(j, 'lanterna', 1); M.darMoedas(j, 50); j.line.hp = 2; });
  await h.p.keyboard.press('KeyI');
  await h.espera(200);
  afirmar(await h.visivel('#mochila'), 'I abre a mochila');
  igual(await h.estado(), 'mochila', 'estado mochila');
  const slots = await h.ev(() => document.querySelectorAll('#itens-grade .slot').length);
  igual(slots, 4, 'quatro itens diferentes');
  afirmar(/50/.test(await h.ev(() => document.querySelector('#equip-moedas').textContent)), 'moedas no painel');
  // Seleciona a bomba e equipa.
  await h.ev(() => { [...document.querySelectorAll('#itens-grade .slot')].find((b) => /Bomba/.test(b.textContent)).click(); });
  await h.p.click('#btn-equipar-item');
  igual(await h.ev(() => LB.mochila.inv(LB.jogo).equipado), 'bomba', 'bomba no atalho');
  // Usa a poção pela mochila.
  await h.ev(() => { [...document.querySelectorAll('#itens-grade .slot')].find((b) => /Poção/.test(b.textContent)).click(); });
  await h.p.click('#btn-usar-item');
  const r = await h.ev(() => ({ hp: LB.jogo.line.hp, pocao: LB.mochila.qtd(LB.jogo, 'pocao') }));
  igual(r.hp, 6, 'poção cura 2 corações');
  igual(r.pocao, 1, 'sobra uma poção');
  await h.foto('mochila-itens');
  // Documentos e conclusões.
  await h.ev(() => { const j = LB.jogo, M = LB.mochila; M.darPista(j, 'pegadas'); M.darPista(j, 'cacador'); M.verificarConclusoes(j); });
  await h.p.click('#mochila nav button[data-aba="pistas"]');
  const docs = await h.ev(() => ({ n: document.querySelectorAll('#pistas-lista .pista').length, falta: document.querySelectorAll('#pistas-lista .pista.falta').length, conc: document.querySelectorAll('#conclusoes-lista .conclusao').length, ok: document.querySelectorAll('#conclusoes-lista .conclusao.ok').length, tipo: document.querySelector('#pista-tipo').textContent }));
  igual(docs.n, 15, 'quinze documentos no caderno (12 da Parte 1 + 3 da Parte 2)');
  igual(docs.falta, 13, 'treze ainda faltam');
  igual(docs.conc, 9, 'nove conclusões');
  igual(docs.ok, 1, 'uma conclusão formada (pegadas + bilhete do caçador)');
  afirmar(docs.tipo.length > 0, 'leitor mostra o tipo do documento');
  await h.foto('mochila-documentos');
  // Mapa: área e mundo.
  await h.p.keyboard.press('KeyM');
  await h.espera(200);
  afirmar(await h.visivel('#aba-mapa'), 'M abre o mapa');
  const cv = await h.ev(() => document.querySelector('#mapa-canvas').width);
  afirmar(cv > 0, 'canvas do mapa desenhado');
  await h.p.click('#btn-mapa-mundo');
  await h.espera(150);
  await h.foto('mochila-mapa-mundo');
  await h.p.keyboard.press('Escape');
  await h.espera(100);
  igual(await h.estado(), 'jogo', 'Esc fecha a mochila');
  // Atalhos H e F.
  await h.ev(() => { LB.jogo.line.hp = 2; });
  await h.p.keyboard.press('KeyH');
  igual(await h.ev(() => LB.jogo.line.hp), 6, 'H usa a poção');
  await h.p.keyboard.press('KeyF');
  igual(await h.ev(() => LB.jogo.bombas.length), 1, 'F coloca a bomba equipada');
});

teste('mapa: só acende as áreas visitadas', async (h) => {
  await h.area('floresta', { espada: true });
  const vistos = await h.ev(() => Object.keys(LB.jogo.flags.vistos || {}));
  afirmar(vistos.includes('floresta'), 'a floresta foi vista');
  afirmar(!vistos.includes('montanha') && !vistos.includes('gruta'), 'áreas não visitadas continuam apagadas');
  // Um documento põe alfinete, mas não acende a área.
  await h.ev(() => { LB.mochila.darPista(LB.jogo, 'cacador'); });
  const depois = await h.ev(() => Object.keys(LB.jogo.flags.vistos || {}));
  afirmar(!depois.includes('montanha'), 'documento não acende a montanha');
});

// ================= Todas as áreas =================
const TODAS = { espada: true, magoVisto: true, magoRuinas: true, ruinasVistas: true, magia: true, golem: true, estrela: true, montanhaVista: true };
for (const area of ['fazenda', 'vilarejo', 'floresta', 'gruta', 'ruinas', 'montanha', 'covil']) {
  teste(`área: ${area} carrega, desenha e roda sem erros`, async (h) => {
    await h.area(area, TODAS);
    await h.espera(700);
    await h.avancar();
    const r = await h.ev(() => {
      const j = LB.jogo, l = j.line;
      return { id: j.mapa.id, preso: j.mapa.colide(l.x, l.y - 4, 6, 4), w: j.mapa.w, h: j.mapa.h, inimigos: j.inimigos.length, nome: j.mapa.def.nome };
    });
    igual(r.id, area, 'área');
    afirmar(!r.preso, 'a Line não pode nascer dentro de parede');
    await h.foto('area-' + area);
  });
}

teste('fases maiores: tamanhos das áreas', async (h) => {
  const t = await h.ev(() => Object.fromEntries(Object.entries(LB.MAPAS).filter(([, d]) => d.tema !== 'encontro').map(([id, d]) => [id, [Math.max(...d.linhas.map((l) => l.length)), d.linhas.length]])));
  afirmar(t.floresta[0] >= 70 && t.floresta[1] >= 40, 'floresta grande');
  afirmar(t.gruta[0] >= 60, 'minas grandes');
  afirmar(t.montanha[0] >= 70, 'montanha grande');
  afirmar(t.ruinas[0] >= 65, 'ruínas grandes');
  afirmar(t.vilarejo, 'vilarejo existe');
  // Todas as linhas com a mesma largura.
  const tortas = await h.ev(() => Object.entries(LB.MAPAS).filter(([, d]) => new Set(d.linhas.map((l) => l.length)).size > 1).map(([id]) => id));
  igual(tortas, [], 'mapas com linhas de larguras diferentes');
});

// ================= Conectividade =================
teste('mapas: tudo alcançável e saídas ligadas nos dois sentidos', async (h) => {
  const r = await h.ev(() => {
    const problemas = [];
    const PORTAO = new Set(['Z', 'g', '%', 'X']); // barreira de luz, porta trancada, parede rachada, espinhos: abrem com progresso
    for (const [id, def] of Object.entries(LB.MAPAS)) {
      if (def.tema === 'encontro') continue;
      const m = new LB.Mapa(id, { prologo: true, espada: true });
      const L = m.l, w = m.w, hh = m.h;
      const passa = (x, y) => x >= 0 && y >= 0 && x < w && y < hh && (!m.solido(x, y) || PORTAO.has(L[y][x]));
      const vis = new Set();
      const fila = [];
      const marcar = (x, y) => { const k = x + ',' + y; if (!vis.has(k)) { vis.add(k); fila.push([x, y]); } };
      marcar(Math.floor(def.inicio.x), Math.floor(def.inicio.y));
      // Postes do gancho: pares em linha reta.
      const postes = [];
      for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) if (L[y][x] === 'p') postes.push({ tx: x, ty: y });
      while (fila.length) {
        const [x, y] = fila.shift();
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, ny = y + dy;
          if (passa(nx, ny)) { marcar(nx, ny); continue; }
          // Pulo: por cima de até 3 tiles de riacho/fenda.
          if (L[ny] && 'wj'.includes(L[ny][nx])) for (let s = 2; s <= 4; s++) { const px = x + dx * s, py = y + dy * s; if (passa(px, py)) { marcar(px, py); break; } if (!(L[py] && 'wj'.includes(L[py][px]))) break; }
        }
        // Gancho: de perto de um poste até o lado de lá do par.
        for (const p of postes) {
          if (Math.abs(p.tx - x) + Math.abs(p.ty - y) !== 1) continue;
          const par = LB.mundo.parDoPoste(m, p);
          if (par) { const ax = par.tx + par.dx, ay = par.ty + par.dy; if (passa(ax, ay)) marcar(ax, ay); }
        }
      }
      const perto = (x, y) => vis.has(x + ',' + y) || [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => vis.has((x + dx) + ',' + (y + dy)));
      const falta = (o, x, y) => problemas.push(`${id}: ${o} em (${x},${y}) inalcançável`);
      for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) if ('CSU'.includes(L[y][x]) && !perto(x, y)) falta('objeto ' + L[y][x], x, y);
      for (const it of def.chao || []) if (!perto(it.x, it.y)) falta('item do chão', it.x, it.y);
      for (const e of def.exames || []) if (!perto(e.x, e.y)) falta('exame ' + e.id, e.x, e.y);
      for (const n of def.npcs || []) if (!perto(Math.floor(n.x), Math.floor(n.y))) falta('morador ' + n.id, n.x, n.y);
      if (def.estacao && !perto(def.estacao.x, def.estacao.y + 1)) falta('estação', def.estacao.x, def.estacao.y);
      for (const s of def.saidas || []) {
        let ok = false;
        for (let x = s.x; x < s.x + s.w; x++) for (let y = s.y; y < s.y + s.h; y++) if (perto(x, y)) ok = true;
        if (!ok) falta('saída para ' + s.para, s.x, s.y);
        // A chegada do outro lado: chão livre, fora das saídas de lá, e existe caminho de volta.
        const dest = LB.MAPAS[s.para];
        if (!dest) { problemas.push(`${id}: saída para área inexistente ${s.para}`); continue; }
        if (!s.chegada) continue;
        const md = new LB.Mapa(s.para, { prologo: true, espada: true });
        const cx = s.chegada.x, cy = s.chegada.y;
        if (md.colide(cx * 32, cy * 32 - 4, 6, 4)) problemas.push(`${id} → ${s.para}: chegada (${cx},${cy}) dentro de parede`);
        for (const s2 of dest.saidas || []) if (cx >= s2.x && cx < s2.x + s2.w && (cy * 32 - 4) / 32 >= s2.y - 0.5 && (cy * 32 - 4) / 32 < s2.y + s2.h) problemas.push(`${id} → ${s.para}: chegada cai dentro da saída para ${s2.para}`);
        if (s.para !== 'covil' && !(dest.saidas || []).concat(dest.entradas || []).some((s2) => s2.para === id)) problemas.push(`${s.para} não tem saída de volta para ${id}`);
      }
    }
    return problemas;
  });
  igual(r, [], 'problemas de conectividade');
});

teste('fazenda: estradas e passagens livres de objetos', async (h) => {
  await h.area('fazenda', { espada: true });
  const r = await h.ev(() => {
    const m = LB.jogo.mapa, ruins = [];
    for (let ty = 0; ty < m.h; ty++) for (let tx = 0; tx < m.w; tx++) {
      // Nenhum objeto ocupa a terra das estradas; nem a faixa de grama colada nelas (para não estreitar a passagem).
      const solo = m.sobO && m.sobO[tx + ',' + ty];
      if (m.l[ty][tx] === 'O' && solo === ':') ruins.push(`${tx},${ty} na estrada`);
    }
    // A Line atravessa a estrada leste–oeste inteira e a norte–sul sem bater em nada.
    for (let tx = 2; tx < 45; tx++) if (m.colide(tx * 32 + 16, 11 * 32 + 16, 6, 4)) ruins.push(`${tx},11 bloqueado`);
    for (let ty = 1; ty < 27; ty++) if (m.colide(22.5 * 32, ty * 32 + 16, 6, 4) && m.colide(23.5 * 32, ty * 32 + 16, 6, 4)) ruins.push(`22-23,${ty} bloqueado`);
    return ruins;
  });
  igual(r, [], 'passagens da fazenda');
});

teste('casa da fazenda: banheiro pela porta da esquerda, parede do quarto fechada, sala virada para dentro', async (h) => {
  await h.area('casa_fazenda', { espada: true });
  const r = await h.ev(() => {
    const m = LB.jogo.mapa, livre = (x, y) => !m.solido(x, y);
    // Busca a partir da sala até o meio do banheiro, sem passar pela parede de baixo do quarto (linha 9).
    const vis = new Set(['15,10']), fila = [[15, 10]];
    while (fila.length) { const [x, y] = fila.shift(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = (x + dx) + ',' + (y + dy); if (!vis.has(k) && livre(x + dx, y + dy)) { vis.add(k); fila.push([x + dx, y + dy]); } } }
    const parede = [24, 25, 26, 27, 28, 29].every((x) => m.solido(x, 9));
    const props = m.props.filter((p) => p.tipo === 'movel');
    const sofa = props.find((p) => p.nome === 'farmhouse_sofa'), lareira = props.find((p) => p.nome === 'farmhouse_fireplace');
    const poltronas = props.filter((p) => p.nome === 'farmhouse_armchair').sort((a, b) => a.x - b.x);
    return { banheiro: vis.has('26,12'), parede, sofaNaParede: sofa.y < 7 * 32, olhamJuntas: poltronas[0].flip && !poltronas[1].flip, semLustre: !props.some((p) => /hanging_lamp|farmhouse_window|farmhouse_door/.test(p.nome)) };
  });
  igual(r, { banheiro: true, parede: true, sofaNaParede: true, olhamJuntas: true, semLustre: true }, 'casa da fazenda');
});

teste('casas: toda casa tem interior mobiliado, entra pela porta e sai pelo caminho', async (h) => {
  const portas = await h.ev(() => {
    const r = [];
    for (const [area, d] of Object.entries(LB.MAPAS)) for (const en of d.entradas || []) r.push({ area, para: en.para, x: en.x, y: en.y });
    return r;
  });
  afirmar(portas.length >= 9, `portas com interior (veio ${portas.length})`);
  for (const pt of portas) {
    await h.area(pt.area, { espada: true, exames: ['cacador'] });
    await h.ir(pt.x + 0.5, pt.y + 1.7);
    igual(await h.prompt(), 'Entrar', `prompt na porta de ${pt.para}`);
    await h.interagir();
    const dentro = await h.ev(() => {
      const j = LB.jogo, m = j.mapa;
      const moveis = m.props.filter((p) => p.tipo === 'movel').length;
      return { id: m.id, tema: m.def.tema, base: !!m.imagemBase, moveis, livre: !m.colide(j.line.x, j.line.y - 4, 6, 4) };
    });
    igual(dentro.id, pt.para, `entrou em ${pt.para}`);
    afirmar(dentro.tema === 'casa' && dentro.base, `${pt.para} com piso e paredes desenhados`);
    afirmar(dentro.moveis >= 4, `${pt.para} mobiliada (veio ${dentro.moveis})`);
    afirmar(dentro.livre, `${pt.para}: Line nasce em chão livre`);
    if (pt.para === 'casa_fazenda') await h.foto('interior-fazenda');
    const s = await h.ev(() => LB.jogo.mapa.def.saidas[0]);
    await h.ir(s.x + s.w / 2, s.y + 0.6);
    await h.p.waitForTimeout(250);
    igual(await h.ev(() => LB.jogo.mapa.id), pt.area, `saiu de ${pt.para} para ${pt.area}`);
  }
});

teste('objetos: itens 146 a 227 carregam e aparecem na fazenda e na casa; regador no poço', async (h) => {
  await h.area('fazenda', { espada: true });
  await h.p.waitForTimeout(1500);
  const r = await h.ev(() => {
    const nomes = Object.keys(LB.OBJETOS || {});
    const faltando = nomes.filter((n) => !LB.personagem(n));
    const usados = new Set();
    for (const id of Object.keys(LB.MAPAS)) for (const [n] of LB.MAPAS[id].moveis || []) usados.add(n);
    // As peças do shopping (shop_*) e do playground entram pelo encontro.js (PECAS), não pelos mapas;
    const naoUsados = nomes.filter((n) => !usados.has(n) && !usados.has(n.replace(/_(on|off|day|night|open|closed)$/, '')) && !/^shop_|^playground_|theo_bowl|fence|gate|dog_house|clothesline|picnic|small_flowers|wild_grass|watering_can|hanging_lamp|farmhouse_window|farmhouse_door/.test(n));
    return { total: nomes.length, faltando, naoUsados };
  });
  afirmar(r.total >= 115, `objetos registrados (veio ${r.total})`);
  igual(r.faltando, [], 'imagens que não carregaram');
  igual(r.naoUsados, [], 'objetos que não aparecem em nenhum mapa');
  // Regador no poço até a Line pegar na tarefa da manhã.
  const reg = await h.ev(() => { const j = LB.jogo; j.flags.prologo = false; j.flags.etapa = 'manha'; j.flags.tarefas = { ovos: 0, regador: false, regados: [], racao: false, theo: false, carinhos: [] }; return !!j.pontoMapa('regador'); });
  afirmar(reg, 'ponto do regador');
  await h.foto('fazenda-objetos');
});

teste('ajustes do celular: casa larga não some, Feliz que caía saiu e shopping montado em peças', async (h) => {
  await h.area('fazenda', { espada: true });
  // Câmera com o canto esquerdo da casa fora da tela: ela continua na lista de desenho.
  const casa = await h.ev(() => {
    const j = LB.jogo, p = j.mapa.props.find((q) => q.tipo === 'casaFazenda');
    j.line.x = p.x + p.w + 40; j.line.y = p.y + 40; j.cameraEm(j.line.x, j.line.y);
    j.cam.x = p.x + 160; return { x: p.x, w: p.w };
  });
  afirmar(casa.w > 100, 'casa da fazenda é larga');
  const desenhada = await h.ev(() => {
    const j = LB.jogo; let viu = false; const orig = j.desenharProp.bind(j);
    j.desenharProp = (g, p) => { if (p.tipo === 'casaFazenda') viu = true; return orig(g, p); };
    j.desenhar(); j.desenharProp = orig; return viu;
  });
  afirmar(desenhada, 'a casa é desenhada com o canto esquerdo fora da tela');
  igual(await h.ev(() => { const s = (window.SPRITES || {}).LINE_HAPPY; return s && [s.item, s.count]; }), ['LINE_BELL_ITEM_272.html', 12], 'LINE_HAPPY é a arte nova (item 272), não a corrida com queda');
  // O shopping é montado em peças: a base nova (só chão e teto), sem mesa desenhada no fundo.
  const fundo = await h.ev(() => !!LB.personagem('shopping_base') || new Promise((ok) => setTimeout(() => ok(!!LB.personagem('shopping_base')), 1500)));
  afirmar(fundo, 'base do shopping (chão e teto) carregada');
  const pecas = await h.ev(() => { const j = LB.jogo; j.iniciarArea('shopping', null, true); return LB.encontro.objetos(j).length; });
  igual(pecas, 36, 'peças do shopping (2 lojas, pilar, 6 mesas com 4 cadeiras, bandejas e 2 canteiros)');
  const semMedida = await h.ev(() => {
    const L = LB.LARGURA_OBJETOS, nomes = ['shop_praca_loja_hamburguer', 'shop_praca_loja_frango', 'shop_praca_mesa_redonda', 'shop_praca_canteiro_retangular',
      'shop_praca_cadeira_madeira_front', 'shop_praca_cadeira_madeira_back', 'shop_praca_cadeira_madeira_left', 'shop_praca_cadeira_madeira_right',
      'shop_praca_mesa_bk', 'shop_praca_pilar_branco', 'shop_praca_lixeira_bandejas', 'shop_praca_canteiro_curto'];
    return nomes.filter((n) => !L[n] || !LB.OBJETOS[n]);
  });
  igual(semMedida.join(','), '', 'toda peça da praça de alimentação tem arte e medida na régua');
  // As mesas são sólidas e não dá para entrar nas lojas.
  const passa = await h.ev(() => { const j = LB.jogo, K = 4 / 3; return [LB.encontro.bloqueia(j, 84 * K, 290 * K), LB.encontro.bloqueia(j, 180 * K, 290 * K), LB.encontro.bloqueia(j, 180 * K, 150 * K)]; });
  igual(passa.join(','), 'true,false,true', 'mesa bloqueia, corredor livre, lojas fora da área');
});

teste('casas: bilhete antes de entrar, Rosa e Bento atendem atrás do balcão e a loja fecha à noite', async (h) => {
  await h.area('floresta', { espada: true });
  await h.ir(68.5, 6.7);
  igual(await h.prompt(), 'Ler o bilhete na porta', 'bilhete primeiro');
  await h.area('vilarejo', { espada: true });
  const fora = await h.ev(() => LB.jogo.moradores.map((m) => m.id));
  afirmar(!fora.includes('rosa') && !fora.includes('bento'), `Rosa e Bento não ficam na porta (veio ${fora})`);
  await h.ir(15.5, 10.7);
  igual(await h.prompt(), 'Entrar', 'na porta da loja, entra');
  for (const [casa, quem] of [['casa_loja', 'rosa'], ['casa_ferraria', 'bento']]) {
    await h.area(casa, { espada: true });
    const r = await h.ev((q) => { const j = LB.jogo, m = j.moradores.find((x) => x.id === q), bal = j.mapa.props.find((p) => p.nome === 'farmhouse_kitchen_island'); return { m: !!m, atras: m && bal && m.y < bal.y && Math.abs(m.x - bal.x) < 24, x: m && m.x / 32, y: m && bal && bal.y / 32 }; }, quem);
    afirmar(r.m && r.atras, `${quem} atrás do balcão em ${casa}`);
    await h.ir(r.x, r.y + 0.9);
    afirmar(/conversar/.test(await h.prompt() || ''), `na frente do balcão, fala com ${quem}`);
  }
  // À noite a porta da loja não abre.
  await h.area('vilarejo', { espada: true, minutos: 23 * 60 });
  await h.ir(15.5, 10.7);
  afirmar((await h.prompt()) !== 'Entrar', 'loja fechada à noite');
});

// ================= Vilarejo, loja e ferraria =================
teste('loja da Dona Rosa: conversa abre a loja e compra funciona', async (h) => {
  await h.area('casa_loja', { espada: true, moedas: 100 });
  await h.ir(7.0, 9.2);
  const pr = await h.prompt();
  afirmar(/Comprar/.test(pr || ''), `prompt da Dona Rosa (veio ${pr})`);
  await h.interagir();
  afirmar(await h.visivel('#loja'), 'loja aberta depois da conversa');
  igual(await h.estado(), 'loja', 'estado loja');
  const n = await h.ev(() => document.querySelectorAll('#loja-lista .produto').length);
  igual(n, 5, 'cinco produtos na Dona Rosa');
  await h.foto('loja-rosa');
  await h.ev(() => document.querySelectorAll('#loja-lista .comprar')[0].click()); // poção 20
  const r = await h.ev(() => ({ moedas: LB.mochila.moedas(LB.jogo), pocao: LB.mochila.qtd(LB.jogo, 'pocao') }));
  igual(r, { moedas: 80, pocao: 1 }, 'comprou uma poção');
  await h.ev(() => document.querySelectorAll('#loja-lista .comprar')[4].click()); // botas 60
  igual(await h.ev(() => LB.jogo.line.botas), true, 'botas calçadas');
  await h.ev(() => document.querySelectorAll('#loja-lista .comprar')[3].click()); // pena 80 (sem dinheiro)
  afirmar(/Faltam 60 moedas/.test(await h.ev(() => document.querySelector('#loja-msg').textContent)), 'avisa quando falta dinheiro');
  await h.p.keyboard.press('Escape');
  await h.espera(100);
  igual(await h.estado(), 'jogo', 'Esc sai da loja');
  afirmar(!(await h.visivel('#pausa')), 'Esc da loja não abre a pausa');
});

teste('ferraria do Seu Bento: armaduras dão escudos que seguram golpes', async (h) => {
  await h.area('casa_ferraria', { espada: true, moedas: 200 });
  await h.ir(7.5, 9.2);
  await h.interagir();
  afirmar(await h.visivel('#loja'), 'ferraria aberta');
  const bloq = await h.ev(() => document.querySelectorAll('#loja-lista .produto')[2].classList.contains('bloqueado'));
  afirmar(bloq, 'Armadura de Brasa bloqueada sem a receita');
  await h.ev(() => document.querySelectorAll('#loja-lista .comprar')[1].click()); // malha 90
  const r = await h.ev(() => ({ arm: LB.jogo.flags.armadura, esc: LB.jogo.line.escudos, max: LB.jogo.line.escudosMax, moedas: LB.mochila.moedas(LB.jogo) }));
  igual(r, { arm: 'malha', esc: 2, max: 2, moedas: 110 }, 'cota de malha');
  const tunica = await h.ev(() => document.querySelectorAll('#loja-lista .comprar')[0].textContent);
  afirmar(/melhor/.test(tunica), 'túnica fica indisponível depois da malha');
  await h.foto('loja-bento');
  await h.ev(() => LB.loja.tela.fechar());
  // Escudo absorve o golpe.
  const d = await h.ev(() => { const j = LB.jogo, l = j.line; const hp = l.hp; l.invul = 0; l.receberDano(j, 1, false, l.x + 10, l.y); return { hp: l.hp, antes: hp, esc: l.escudos }; });
  igual(d.hp, d.antes, 'vida intacta: o escudo segurou');
  igual(d.esc, 1, 'um escudo gasto');
  // E a receita libera a Armadura de Brasa.
  await h.ev(() => { LB.mochila.darPista(LB.jogo, 'receita'); LB.loja.tela.abrir(LB.jogo, 'bento'); });
  const brasa = await h.ev(() => ({ bloq: document.querySelectorAll('#loja-lista .produto')[2].classList.contains('bloqueado'), txt: document.querySelectorAll('#loja-lista .comprar')[2].textContent }));
  afirmar(!brasa.bloq && /160/.test(brasa.txt), `com a receita a Armadura de Brasa aparece (${brasa.txt})`);
  await h.ev(() => document.querySelectorAll('#loja-lista .comprar')[2].click());
  afirmar(/Faltam 50 moedas/.test(await h.ev(() => document.querySelector('#loja-msg').textContent)), 'diz quanto falta');
});

teste('moradores do vilarejo conversam', async (h) => {
  await h.area('vilarejo', { espada: true });
  for (const id of ['ze', 'lurdes', 'pedro']) {
    const pos = await h.ev((id) => { const m = LB.jogo.moradores.find((x) => x.id === id); return [m.x / 32, m.y / 32]; }, id);
    await h.ir(pos[0], pos[1] + 0.9);
    const pr = await h.prompt();
    igual(pr, 'Conversar', `prompt de ${id}`);
    await h.interagir();
  }
  const conv = await h.ev(() => LB.jogo.flags.conversas);
  igual(conv.sort(), ['lurdes', 'pedro', 'ze'], 'conversas registradas');
});

// ================= Carrinho =================
teste('carrinho: quebrado sem alavanca, conserta e viaja entre estações', async (h) => {
  await h.area('vilarejo', { espada: true });
  await h.ir(52.7, 21.9);
  const p1 = await h.prompt();
  igual(p1, 'Ver o carrinho', 'sem alavanca');
  await h.interagir();
  igual(await h.ev(() => !!LB.jogo.flags.alavanca), false, 'continua quebrado');
  await h.ev(() => { const j = LB.jogo; LB.mochila.dar(j, 'alavanca', 1); j.flags.estacoes = ['vilarejo', 'minas']; });
  igual(await h.prompt(), 'Encaixar a alavanca', 'com a alavanca');
  await h.interagir();
  const r = await h.ev(() => ({ ok: LB.jogo.flags.alavanca, tem: LB.mochila.tem(LB.jogo, 'alavanca') }));
  igual(r, { ok: true, tem: false }, 'alavanca encaixada');
  igual(await h.prompt(), 'Viajar de carrinho', 'agora viaja');
  await h.ev(() => LB.jogo.acoesPossiveis().fazer());
  afirmar(await h.visivel('#viagem'), 'tela de destino');
  const botoes = await h.ev(() => [...document.querySelectorAll('#viagem-lista button')].map((b) => [b.textContent, b.disabled]));
  igual(botoes.length, 2, 'duas outras estações');
  afirmar(botoes.some(([t, d]) => /Minas/.test(t) && !d), 'Minas liberada');
  afirmar(botoes.some(([, d]) => d), 'Forja ainda não descoberta');
  await h.foto('carrinho-destinos');
  await h.ev(() => [...document.querySelectorAll('#viagem-lista button')].find((b) => /Minas/.test(b.textContent)).click());
  for (let i = 0; i < 60 && (await h.ev(() => LB.jogo.mapa.id)) !== 'gruta'; i++) { await h.avancar(5); await h.espera(100); }
  await h.avancar();
  igual(await h.ev(() => LB.jogo.mapa.id), 'gruta', 'chegou nas Minas de carrinho');
  const l = await h.ev(() => ({ vis: LB.jogo.line.visivel !== false, viagem: LB.jogo.viagem }));
  afirmar(l.vis && !l.viagem, 'a Line desce do carrinho');
});

// ================= Bombas, gancho, brasa, escuro =================
teste('bomba quebra a parede rachada e fica salvo', async (h) => {
  await h.area('floresta', { espada: true });
  const alvo = await h.ev(() => { const m = LB.jogo.mapa; for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) if (m.tile(x, y) === '%') return [x, y]; return null; });
  afirmar(alvo, 'a floresta tem uma parede rachada');
  await h.ev(([x, y]) => { const j = LB.jogo; LB.mochila.dar(j, 'bomba', 1); j.bombas.push({ x: x * 32 + 16, y: y * 32 + 40, t: 1.9 }); }, alvo);
  await h.espera(500);
  const r = await h.ev(([x, y]) => ({ tile: LB.jogo.mapa.tile(x, y), salvo: (LB.jogo.flags.rachaduras || []).includes('floresta:' + x + ',' + y) }), alvo);
  afirmar(r.tile !== '%', 'a parede sumiu');
  afirmar(r.salvo, 'a parede quebrada fica salva');
  await h.area('floresta', { espada: true, rachaduras: ['floresta:' + alvo.join(',')] });
  afirmar((await h.ev(([x, y]) => LB.jogo.mapa.tile(x, y), alvo)) !== '%', 'continua quebrada ao voltar');
});

teste('gancho atravessa entre dois postes', async (h) => {
  await h.area('floresta', { espada: true });
  const postes = await h.ev(() => LB.jogo.mapa.props.filter((p) => p.tipo === 'poste').map((p) => [p.tx, p.ty]));
  afirmar(postes.length >= 2, 'postes na floresta');
  const [a, b] = postes.sort((p, q) => p[1] - q[1]);
  await h.ir(a[0] + 0.5, a[1] - 0.2);
  igual(await h.prompt(), 'Poste de gancho', 'sem gancho');
  await h.interagir();
  await h.ev(() => LB.mochila.dar(LB.jogo, 'gancho', 1));
  igual(await h.prompt(), 'Usar o gancho', 'com gancho');
  await h.interagir();
  const y = await h.ev(() => LB.jogo.line.y / 32);
  afirmar(y > b[1], `a Line atravessou para depois do outro poste (y=${y.toFixed(1)}, poste em ${b[1]})`);
});

teste('brasa queima sem a Armadura de Brasa', async (h) => {
  await h.area('montanha', TODAS);
  const t = await h.ev(() => { const m = LB.jogo.mapa; for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) if (m.tile(x, y) === 'l') return [x, y]; return null; });
  afirmar(t, 'a montanha tem brasa rasa');
  await h.ir(t[0] + 0.5, t[1] + 0.6);
  const hp0 = await h.ev(() => LB.jogo.line.hp);
  await h.espera(1400);
  afirmar((await h.ev(() => LB.jogo.line.hp)) < hp0, 'perdeu vida na brasa');
  await h.area('montanha', Object.assign({ armadura: 'brasa' }, TODAS));
  await h.ir(t[0] + 0.5, t[1] + 0.6);
  const hp1 = await h.ev(() => ({ hp: LB.jogo.line.hp, esc: LB.jogo.line.escudos }));
  await h.espera(1400);
  igual(await h.ev(() => ({ hp: LB.jogo.line.hp, esc: LB.jogo.line.escudos })), hp1, 'com a armadura não queima');
});

teste('galerias escuras das minas precisam da lanterna', async (h) => {
  await h.area('gruta', { espada: true });
  const def = await h.ev(() => LB.jogo.mapa.def.escuro[0]);
  const esc = await h.ev(([x, y]) => LB.mundo.noEscuro(LB.jogo, x * 32, y * 32), [def[0] + 2, def[1] + 2]);
  afirmar(esc, 'ponto dentro da galeria está no escuro');
});

// ================= Combate, IA, moedas, derrota =================
teste('IA: sombra contorna parede, alerta vizinhos e larga moedas', async (h) => {
  await h.area('floresta', { espada: true });
  const cam = await h.ev(() => { const m = LB.jogo.mapa; return LB.ia.caminho(m, 5 * 32, 3 * 32, 25 * 32, 3 * 32, 3000); });
  afirmar(Array.isArray(cam) && cam.length > 5, 'encontra caminho pela grade');
  const alerta = await h.ev(() => {
    const j = LB.jogo;
    j.inimigos = [new LB.Sombra(10 * 32, 10 * 32), new LB.Sombra(12 * 32, 10 * 32)];
    j.inimigos.forEach((e) => { e.estado = 'vagar'; });
    LB.ia.alertar(j, j.inimigos[0], 220);
    return j.inimigos[1].estado;
  });
  afirmar(alerta !== 'vagar', `vizinho alertado (estado ${alerta})`);
  const m0 = await h.ev(() => LB.mochila.moedas(LB.jogo));
  await h.ev(() => { const j = LB.jogo, e = j.inimigos[0]; e.vivo = false; j.aoDerrotarInimigo(e); const it = j.itens.find((i) => i.tipo === 'moeda'); j.line.x = it.x; j.line.y = it.y; });
  await h.espera(300);
  afirmar((await h.ev(() => LB.mochila.moedas(LB.jogo))) > m0, 'moedas coletadas');
});

teste('morcego acorda e ataca', async (h) => {
  await h.area('gruta', { espada: true });
  const r = await h.ev(() => { const j = LB.jogo; const b = new LB.Morcego(j.line.x + 60, j.line.y); j.inimigos = [b]; return b.estado; });
  igual(r, 'dormindo', 'começa dormindo');
  await h.espera(400);
  const e = await h.ev(() => LB.jogo.inimigos[0] && LB.jogo.inimigos[0].estado);
  afirmar(e && e !== 'dormindo', `acordou (estado ${e})`);
});

teste('menos vida espalhada: coração nunca cai com a vida cheia', async (h) => {
  await h.area('floresta', { espada: true });
  const n = await h.ev(() => { const j = LB.jogo; let c = 0; for (let i = 0; i < 200; i++) { const e = new LB.Sombra(100, 100); e.vivo = false; j.inimigos.push(e); j.aoDerrotarInimigo(e); } c = j.itens.filter((i) => i.tipo === 'coracao').length; return c; });
  igual(n, 0, 'nenhum coração com a vida cheia');
  const dif = await h.ev(() => LB.dif().drop);
  afirmar(dif <= 0.12, `chance de coração baixa no normal (${dif})`);
});

teste('derrota: tela aparece e Tentar de novo volta à fonte', async (h) => {
  await h.area('floresta', { espada: true });
  await h.ev(() => { const j = LB.jogo, l = j.line; l.hp = 1; l.invul = 0; l.receberDano(j, 2, true, l.x + 10, l.y, { ignorarDefesa: true, bloqueavel: false }); });
  await h.p.waitForFunction(() => !document.querySelector('#derrota').classList.contains('oculto'), null, { timeout: 8000 }).catch(() => {});
  afirmar(await h.visivel('#derrota'), `tela de derrota (estado da Line: ${await h.ev(() => LB.jogo.line.estado + ' ' + LB.jogo.line.anim.base + ' hp ' + LB.jogo.line.hp)})`);
  await h.foto('derrota');
  await h.p.click('#btn-tentar');
  await h.espera(200);
  const r = await h.ev(() => ({ hp: LB.jogo.line.hp, estado: LB.jogo.line.estado }));
  afirmar(r.hp > 0 && r.estado !== 'morta', 'a Line volta viva');
});

teste('pena de fênix levanta a Line', async (h) => {
  await h.area('floresta', { espada: true });
  await h.ev(() => { const j = LB.jogo, l = j.line; LB.mochila.dar(j, 'pena', 1); l.hp = 1; l.invul = 0; l.receberDano(j, 2, true, l.x + 10, l.y, { ignorarDefesa: true, bloqueavel: false }); });
  // A pena queima no fim da queda (golpe forte → arremessada → no chão): espera a queda terminar,
  // em vez de um tempo fixo (a sequência leva uns 2,5 s e mais numa máquina carregada).
  let r;
  for (let i = 0; i < 60; i++) {
    await h.espera(100);
    r = await h.ev(() => ({ hp: LB.jogo.line.hp, pena: LB.mochila.qtd(LB.jogo, 'pena'), morta: LB.jogo.line.estado === 'morta' }));
    if (r.hp > 0 || r.morta) break;
  }
  afirmar(!r.morta && r.hp > 0, 'a Line levantou');
  igual(r.pena, 0, 'a pena queimou');
  afirmar(!(await h.visivel('#derrota')), 'sem tela de derrota');
});

// ================= Documentos e dragão =================
teste('documentos: cena de pista forma conclusão com efeito no dragão', async (h) => {
  await h.area('montanha', TODAS);
  await h.ev(() => { LB.mochila.darPista(LB.jogo, 'lenda'); });
  await h.ev(() => LB.jogo.iniciarCena(LB.HISTORIA.pista, { semPular: true }, 'escama'));
  await h.avancar();
  const c = await h.ev(() => LB.mochila.inv(LB.jogo).conclusoes);
  afirmar(c.includes('peito'), 'conclusão do peito do dragão');
});

teste('covil: luta com o dragão começa', async (h) => {
  await h.area('covil', TODAS);
  await h.avancar(300);
  await h.espera(300);
  const r = await h.ev(() => ({ chefe: LB.jogo.chefeAtivo, dragao: !!LB.jogo.dragao, bell: !!LB.jogo.bell }));
  afirmar(r.dragao && r.bell, 'dragão e Bell no covil');
  afirmar(r.chefe, 'luta ativa depois da cena');
  await h.foto('covil');
});

// ================= Arte nova =================
teste('arte: efeitos em pixel art carregam e aparecem no golpe', async (h) => {
  await h.area('floresta', { espada: true });
  const prontos = await h.ev(() => ['FX_IMPACT', 'FX_SPARKS', 'FX_EXPLOSION', 'FX_HEARTS', 'FX_DRAGON_WEAK_POINT'].filter((k) => LB.fx.pronto(k)));
  igual(prontos.length, 5, `efeitos prontos (${prontos})`);
  const fx = await h.ev(() => {
    const j = LB.jogo, l = j.line, e = new LB.Sombra(l.x + 24, l.y);
    j.inimigos = [e]; l.lado = 1; l.dir = 'RIGHT';
    j.acertar(l, { alcance: 50, largura: 20, dano: 1, empurra: 60 }, new Set());
    return j.efeitos.filter((f) => f.tipo === 'fx').map((f) => f.codigo);
  });
  afirmar(fx.includes('FX_IMPACT'), `impacto em pixel art no golpe (veio ${fx})`);
});

teste('arte: golpes do dragão mantêm a duração com mais quadros', async (h) => {
  const r = await h.ev(() => ['DRAGON_CLAW_ATTACK', 'DRAGON_FIRE_CHARGE', 'DRAGON_TAIL_ATTACK'].map((c) => {
    const inf = LB.info(c), a = new LB.Animador(c);
    return [c, +(inf.quadros / inf.fps).toFixed(2), +a.duracao(null, 1).toFixed(2), (LB.sprite(c) || {}).count || 0];
  }));
  for (const [c, antes, agora] of r) afirmar(Math.abs(antes - agora) < 0.3, `${c}: durava ${antes}s, agora ${agora}s`);
});

// ================= História =================
teste('história: interlúdio mostra a Bell e o dragão no covil', async (h) => {
  await h.area('floresta', { espada: true });
  await h.ev(() => LB.jogo.iniciarCena(LB.HISTORIA.interludio, { semPular: false }, 2));
  await h.p.waitForFunction(() => !!LB.jogo.interludio, null, { timeout: 5000 });
  await h.p.waitForFunction(() => document.querySelector('#dialogo').classList.contains('visivel') && document.querySelector('#dialogo .nome').textContent, null, { timeout: 8000 });
  await h.espera(900);
  await h.foto('interludio');
  const nome = await h.ev(() => document.querySelector('#dialogo .nome').textContent);
  afirmar(['Bell', 'Dragão'].includes(nome), `diálogo do interlúdio (veio ${nome})`);
  await h.avancar();
  await h.espera(200);
  const r = await h.ev(() => ({ it: LB.jogo.interludio, vistos: LB.jogo.flags.interludios }));
  afirmar(!r.it, 'o interlúdio termina e volta ao jogo');
  igual(r.vistos, [2], 'interlúdio marcado como visto');
  await h.ev(() => LB.jogo.iniciarCena(LB.HISTORIA.interludio, {}, 2));
  await h.espera(200);
  afirmar(!(await h.ev(() => LB.jogo.interludio)), 'não repete');
});

teste('história: pegar a espada leva ao primeiro interlúdio', async (h) => {
  await h.area('floresta', { magoVisto: true });
  await h.ir(3.5, 13.2);
  await h.interagir();
  const r = await h.ev(() => ({ espada: LB.jogo.flags.espada, vistos: LB.jogo.flags.interludios || [] }));
  afirmar(r.espada, 'pegou a espada');
  afirmar(r.vistos.includes(1), 'interlúdio 1 visto');
});

teste('história: chegadas no vilarejo, na gruta e nas minas', async (h) => {
  await h.area('vilarejo', {});
  await h.espera(300); await h.avancar();
  afirmar(await h.ev(() => LB.jogo.flags.vilarejoVisto), 'cena de chegada no vilarejo');
  await h.area('gruta', { espada: true });
  await h.espera(300); await h.avancar();
  afirmar(await h.ev(() => LB.jogo.flags.grutaVista), 'cena de chegada na gruta');
  await h.ir(40.5, 6.9);
  await h.espera(300); await h.avancar();
  afirmar(await h.ev(() => LB.jogo.flags.minasVistas), 'cena das minas');
});

teste('história: Tobias na montanha e a recompensa da Dona Lurdes', async (h) => {
  await h.area('montanha', TODAS);
  await h.espera(300); await h.avancar();
  const pos = await h.ev(() => { const m = LB.jogo.moradores.find((x) => x.id === 'tobias'); return m && [m.x / 32, m.y / 32]; });
  afirmar(pos, 'Tobias está na montanha');
  await h.ir(pos[0], pos[1] + 0.9);
  igual(await h.prompt(), 'Conversar', 'prompt do Tobias');
  await h.interagir();
  afirmar(await h.ev(() => LB.jogo.flags.tobias), 'Tobias encontrado');
  const flags = await h.ev(() => LB.jogo.flags);
  await h.area('vilarejo', Object.assign({}, flags, { vilarejoVisto: true }));
  const p0 = await h.ev(() => LB.mochila.qtd(LB.jogo, 'pocao'));
  const lp = await h.ev(() => { const m = LB.jogo.moradores.find((x) => x.id === 'lurdes'); return [m.x / 32, m.y / 32]; });
  await h.ir(lp[0], lp[1] + 0.9);
  await h.interagir();
  igual(await h.ev(() => LB.mochila.qtd(LB.jogo, 'pocao')), p0 + 2, 'Dona Lurdes dá duas poções');
  await h.interagir();
  igual(await h.ev(() => LB.mochila.qtd(LB.jogo, 'pocao')), p0 + 2, 'a recompensa é uma vez só');
});

teste('história: no final a Line divide a luz com o dragão', async (h) => {
  await h.area('covil', TODAS);
  await h.avancar(300);
  await h.ev(() => { const j = LB.jogo; j.chefeAtivo = false; j.promptFinal = false; j.dragao.mudar('derrotado', 'DRAGON_DEFEATED'); j.iniciarCena(LB.HISTORIA.vitoria, { semPular: false }); });
  await h.p.waitForFunction(() => LB.jogo.flags.dragaoEmPaz || LB.jogo.estado === 'menu', null, { timeout: 20000 }).catch(() => {});
  await h.foto('final-dividir-luz');
  await h.avancar(400);
  const r = await h.ev(() => ({ paz: LB.jogo.flags.dragaoEmPaz, zerado: LB.jogo.flags.zerado }));
  afirmar(r.paz, 'o dragão ficou em paz');
  afirmar(r.zerado, 'o jogo chegou ao fim');
});

teste('arte: as duas sentadas no pôr do sol e o dragão parado (itens 77 a 80)', async (h) => {
  const tem = await h.ev(() => ['LINE_BELL_SIT_DOWN', 'LINE_BELL_SIT_IDLE', 'BELL_HEAD_ON_LINE', 'DRAGON_IDLE', 'DRAGON_BLINK'].filter((c) => LB.sprite(c) && !LB.sprite(c).provisorio));
  igual(tem.length, 5, 'as cinco animações novas carregadas: ' + tem);
  await h.area('covil', TODAS);
  await h.avancar(300);
  await h.ev(() => { const j = LB.jogo; j.chefeAtivo = false; j.promptFinal = false; j.dragao.mudar('derrotado', 'DRAGON_DEFEATED'); j.iniciarCena(LB.HISTORIA.vitoria, { semPular: false }); });
  // Vai passando as falas (sem pular a cena) até o epílogo com as duas sentadas.
  for (let i = 0; i < 400; i++) {
    const pronto = await h.ev(() => { const j = LB.jogo; if (j.duo && /SIT|HEAD_ON/.test(j.duo.anim.base) && j.mapa.id === 'fazenda') return true; LB.dialogo.clicou = true; return false; });
    if (pronto) break;
    await h.espera(60);
  }
  await h.espera(800);
  const r = await h.ev(() => LB.jogo.duo && LB.jogo.duo.anim.base);
  afirmar(/SIT/.test(r || ''), 'epílogo com as duas sentadas: ' + r);
  await h.foto('epilogo-sentadas');
});

teste('mago: na conversa a Line olha para ele e ele só gesticula na vez dele', async (h) => {
  await h.area('floresta', { espada: true, magoVisto: true });
  await h.ev(() => { const j = LB.jogo, mg = j.npcs.find((n) => n instanceof LB.Mago); j.inimigos = []; j.line.x = mg.x + 40; j.line.y = mg.y + 10; j.line.lado = 1; j.line.dir = 'RIGHT'; j.line.voltarLivre(); });
  await h.espera(150);
  igual(await h.prompt(), 'Conversar', 'prompt do Mago');
  await h.ev(() => LB.jogo.acoesPossiveis().fazer());
  const r = await h.ev(async () => {
    const j = LB.jogo, mg = j.npcs.find((n) => n instanceof LB.Mago), vistos = [];
    for (let i = 0; i < 200 && j.cena; i++) {
      await new Promise((ok) => setTimeout(ok, 50));
      vistos.push([LB.dialogo.falante, mg.anim.base, j.line.lado]);
      if (i % 12 === 11) LB.dialogo.clicou = true;
    }
    return vistos;
  });
  afirmar(r.length > 5, 'a conversa acontece');
  afirmar(r.every(([, , lado]) => lado === -1), 'a Line fica virada para o Mago (à esquerda dela)');
  afirmar(r.some(([q, a]) => q === 'Mago' && a === 'MAGO_TALK'), 'o Mago gesticula quando fala');
  // Quando a vez passa para a Line, ele termina o gesto (~0,3 s) e fica ouvindo parado.
  const ouvindo = r.filter(([q]) => q && q !== 'Mago');
  afirmar(ouvindo.length && ouvindo.filter(([, a]) => a === 'MAGO_IDLE').length > ouvindo.length / 2, 'e fica parado ouvindo quando a Line fala');
});

teste('arte: Mago e Espírito das Ruínas animados (itens 124 e 125)', async (h) => {
  const tem = await h.ev(() => ['MAGO_IDLE', 'MAGO_TALK', 'MAGO_CAST', 'SPIRIT_APPEAR', 'SPIRIT_IDLE', 'SPIRIT_TALK', 'THEO_WALK_LEFT', 'THEO_IDLE_FRONT'].filter((c) => LB.sprite(c)));
  igual(tem.length, 8, 'arte carregada: ' + tem);
  await h.area('ruinas', Object.assign({}, TODAS, { magia: false, golem: false }));
  const viu = await h.ev(async () => {
    const j = LB.jogo, a = j.mapa.props.find((o) => o.tipo === 'altar');
    j.line.x = a.x; j.line.y = a.y + 40; j.line.voltarLivre();
    j.iniciarCena(LB.HISTORIA.altar, { semPular: true }, a);
    let apareceu = false;
    for (let i = 0; i < 300 && j.cena; i++) { if (j.npcs.some((n) => n.espirito)) apareceu = true; LB.dialogo.clicou = true; await new Promise((r) => setTimeout(r, 40)); }
    return { apareceu, sobrou: j.npcs.some((n) => n.espirito), magia: !!j.flags.magia };
  });
  afirmar(viu.apareceu, 'o Espírito aparece no altar');
  afirmar(!viu.sobrou, 'e vai embora no fim da cena');
  afirmar(viu.magia, 'a Line aprende a magia');
});

teste('animações: mesmo ritmo de passo para a Line e a Bell e nada de cena acelerada', async (h) => {
  const r = await h.ev(() => {
    const dur = (base, dir) => new LB.Animador(base).duracao(dir, 1);
    const cenas = ['LINE_ADMIRE', 'LINE_BELL_TUNNEL_KISS', 'LINE_BELL_KISS', 'LINE_BELL_GREET_HUG', 'LINE_PUNCH_MACHINE', 'BELL_CURTSY', 'BELL_HIGH_FIVE',
      'LINE_BELL_HIGH_FIVE', 'LINE_VICTORY', 'LINE_BELL_CELEBRATE', 'BELL_CAPTURED', 'LINE_BELL_HUG_RELEASE', 'LINE_BELL_SIT_DOWN'].filter((c) => LB.sprite(c));
    return {
      andar: ['LEFT', 'RIGHT', 'FRONT', 'BACK'].map((d) => [dur('LINE_WALK', d), dur('BELL_WALK', d), dur('LINE_COMBAT_WALK', d)]),
      correr: ['LEFT', 'RIGHT', 'FRONT', 'BACK'].map((d) => [dur('LINE_RUN', d), dur('BELL_RUN', d)]),
      cenas: cenas.map((c) => [c, dur(c), LB.sprite(c).seq.length / dur(c)]),
    };
  });
  for (const [l, b, c] of r.andar) afirmar(Math.abs(l - b) < 0.1 && Math.abs(l - c) < 0.1, 'andar no mesmo ritmo: ' + JSON.stringify(r.andar));
  for (const [l, b] of r.correr) afirmar(Math.abs(l - b) < 0.1, 'correr no mesmo ritmo: ' + JSON.stringify(r.correr));
  for (const [c, d, fps] of r.cenas) afirmar(d >= 0.75 && fps <= 12.01, `${c} rápida demais: ${d.toFixed(2)} s a ${fps.toFixed(1)} quadros/s`);
});

teste('animações: Line e Bell do mesmo tamanho (ajuste pela cabeça) e um dragão só no rapto', async (h) => {
  const aj = await h.ev(() => ['LINE_ANGRY', 'LINE_RUN_BACK', 'LINE_BELL_BK', 'LINE_BELL_SIT_IDLE', 'BELL_RUN_LEFT'].map((c) => LB.sprite(c) && LB.sprite(c).ajuste));
  afirmar(aj[0] < 1 && aj[1] > 1 && aj[2] < 1 && aj[3] > 1 && aj[4] < 1, 'ajustes de tamanho carregados: ' + aj);
  await h.ev(() => { const j = LB.jogo; document.querySelector('#menu').classList.add('oculto'); j.flags = { encontroFeito: true, manhaVista: true, etapa: 'tarde' }; j.iniciarArea('fazenda', null, true); j.iniciarCapitulo(); });
  await h.espera(500);
  const r = await h.ev(async () => {
    const j = LB.jogo;
    j.iniciarCena(LB.HISTORIA.porDoSol, { semPular: true });
    const vistos = new Set(); let dragoes = 0;
    for (let i = 0; i < 600 && j.cena; i++) {
      if (j.presa) { vistos.add(j.presa.bell.anim.base); dragoes = Math.max(dragoes, j.presa.bell.visivel ? 1 : 0); if (j.presa.dragao.alturaVoo > 100) break; }
      LB.dialogo.clicou = true; await new Promise((ok) => setTimeout(ok, 30));
    }
    return { vistos: [...vistos], pendurada: j.presa ? j.presa.dragao.alturaVoo - j.presa.bell.z : null, item: (window.SPRITES.BELL_DRAGON_CARRIED || {}).item };
  });
  afirmar(r.vistos.includes('BELL_DRAGON_CARRIED') && r.item === 'LINE_BELL_ITEM_275.html', 'a Bell levada usa a arte nova, só ela pendurada, sem outro dragão desenhado junto (item 275): ' + r.vistos + ' ' + r.item);
  afirmar(r.pendurada > 20, 'a Bell fica pendurada embaixo do dragão: ' + r.pendurada);
});

teste('bichos: maiores, olhando para onde andam e galinha com uma perna depois da outra', async (h) => {
  await h.area('fazenda', {});
  const r = await h.ev(() => {
    const j = LB.jogo, g = j.bichos.find((b) => b.tipo === 'galinha' && !b.marrom);
    const s = LB.sprite('CHICKEN_WALK'), vaca = LB.sprite('COW_WALK');
    const chamadas = [], original = LB.desenharSprite;
    LB.desenharSprite = (ctx, r, quadro) => { chamadas.push({ cod: r.codigo, flip: r.flip, quadro }); return true; };
    const ctx = document.createElement('canvas').getContext('2d');
    g.estado = 'andando'; g.xPasso = null; g.fasePasso = 0;
    const quadros = [];
    try {
      g.lado = 1; g.desenharSprite(ctx, j, 0); const flipDireita = chamadas.pop().flip;
      g.lado = -1; g.desenharSprite(ctx, j, 0); const flipEsquerda = chamadas.pop().flip;
      // Anda meio ciclo em passos pequenos: o quadro avança junto com o chão percorrido.
      const ciclo = s.passo * s.mundo / s.cell, x0 = g.x, t0 = j.tempo;
      for (let k = 0; k <= 12; k++) { j.tempo = t0 + k * 0.05; g.x = x0 + ciclo * 0.5 * k / 12; g.desenharSprite(ctx, j, 0); quadros.push(chamadas.pop().quadro); }
      // Parada no mesmo lugar: o quadro não muda (nada de pés andando no ar).
      const parado = [];
      for (let k = 1; k <= 5; k++) { j.tempo = t0 + 1 + k * 0.05; g.desenharSprite(ctx, j, 0); parado.push(chamadas.pop().quadro); }
      g.x = x0;
      return { flipDireita, flipEsquerda, quadros, parado, galinha: s.mundo, vaca: vaca.mundo, line: LB.ALTURA_LINE };
    } finally { LB.desenharSprite = original; }
  });
  afirmar(r.flipDireita === true && r.flipEsquerda === false, 'a arte da galinha olha para a esquerda: espelha só andando para a direita ' + JSON.stringify(r));
  afirmar(r.galinha > 50 && r.vaca > 110, 'bichos maiores: galinha ' + r.galinha + ', vaca ' + r.vaca);
  const ultimo = r.quadros[r.quadros.length - 1];
  afirmar(ultimo >= 5 && ultimo <= 7, 'meio ciclo andado = meio ciclo de quadros: ' + r.quadros);
  afirmar(new Set(r.parado).size === 1, 'parada, a galinha não mexe as pernas: ' + r.parado);
});

// ================= Save =================
teste('save: continuar volta para a mesma área com os itens', async (h) => {
  await h.area('vilarejo', { espada: true, moedas: 33 });
  await h.ev(() => { LB.mochila.dar(LB.jogo, 'bomba', 2); LB.jogo.salvar(); });
  const save = await h.ev(() => localStorage.getItem('lineBell.save.v1'));
  await h.fechar();
  const h2 = await abrir({ save: JSON.parse(save) });
  try {
    await h2.p.click('#btn-continuar');
    await h2.espera(300);
    await h2.avancar();
    const r = await h2.ev(() => ({ area: LB.jogo.mapa.id, moedas: LB.mochila.moedas(LB.jogo), bomba: LB.mochila.qtd(LB.jogo, 'bomba') }));
    igual(r, { area: 'vilarejo', moedas: 33, bomba: 2 }, 'estado restaurado');
    afirmar(!h2.erros.length, h2.erros.join('\n'));
  } finally { await h2.fechar(); }
}, { semFechar: true });

teste('save antigo: pão, maçã e flor viram moedas e poções', async () => {
  const antigo = { area: 'floresta', flags: { encontroFeito: true, manhaVista: true, prologo: true, espada: true, inv: { itens: { pao: 2, maca: 1, flor: 1, chave: 1 }, pistas: ['carta'], novos: 0, equipado: 'pao' }, baus: ['floresta:3,12', 'fazenda:41,10'], vistos: { floresta: 'ff', fazenda: 'ff' } } };
  const h = await abrir({ save: antigo });
  try {
    await h.p.click('#btn-continuar');
    await h.espera(300);
    await h.avancar();
    const r = await h.ev(() => { const f = LB.jogo.flags; return { itens: f.inv.itens, moedas: f.moedas, eq: f.inv.equipado, baus: f.baus, v: f.versaoMundo, vistos: Object.keys(f.vistos || {}) }; });
    igual(r.itens, { chave: 1, pocao: 1 }, 'itens convertidos');
    igual(r.moedas, 15, 'pão e maçã viram moedas');
    afirmar(r.eq !== 'pao', 'item equipado inválido removido');
    igual(r.baus, ['fazenda:41,10'], 'baús da floresta (mapa novo) recomeçam');
    igual(r.v, 2, 'versão do mundo');
    afirmar(!h.erros.length, h.erros.join('\n'));
  } finally { await h.fechar(); }
}, { semPagina: true });

// ================= Parte 2: O Coração dos Elementos =================
const P2 = Object.assign({}, TODAS, { zerado: true, parte2: true, bellJogavel: true, heroina: 'line' });
for (const area of ['vale', 'fenda', 'lago', 'pantano', 'picos', 'tempestade', 'coracao']) {
  teste(`parte 2: área ${area} carrega, desenha e roda sem erros`, async (h) => {
    await h.area(area, Object.assign({ ['visto_' + area]: true }, P2));
    await h.espera(700);
    await h.avancar();
    const r = await h.ev(() => {
      const j = LB.jogo, l = j.line;
      return { id: j.mapa.id, preso: j.mapa.colide(l.x, l.y - 4, 6, 4), chefe: !!j.chefeArena, comp: !!j.companheira };
    });
    igual(r.id, area, 'área');
    afirmar(!r.preso, 'a heroína não pode nascer dentro de parede');
    afirmar(r.chefe, 'toda fase da Parte 2 tem um chefe esperando');
    afirmar(r.comp, 'a outra heroína anda junto');
    await h.foto('p2-area-' + area);
  });
}

teste('relógio: 1 s real = 1 min no jogo, anoitece e descansa na fonte', async (h) => {
  await h.area('vilarejo', Object.assign({ minutos: 8 * 60 }, TODAS));
  const a = await h.ev(() => LB.relogio.texto(LB.jogo));
  await h.espera(2100);
  const b = await h.ev(() => LB.relogio.minutos(LB.jogo));
  afirmar(b >= 8 * 60 + 1.8 && b <= 8 * 60 + 3, 'andou uns 2 minutos de jogo: ' + b);
  igual(a, '08:00', 'hora inicial');
  // Noite: moradores vão dormir e a fonte oferece descanso.
  await h.ev(() => { LB.jogo.flags.minutos = 22 * 60; });
  await h.espera(300);
  const n = await h.ev(() => ({ noite: LB.relogio.noite(LB.jogo), dormindo: LB.jogo.moradores.filter((m) => m.dormindo).length, total: LB.jogo.moradores.length }));
  afirmar(n.noite, 'é noite às 22h');
  igual(n.dormindo, n.total, 'todos os moradores do vilarejo dormem');
  await h.foto('relogio-noite');
  const f = await h.ev(() => { const p = LB.jogo.mapa.props.find((o) => o.tipo === 'fonte'); return { x: p.x / 32, y: (p.y + 26) / 32 }; });
  await h.ir(f.x, f.y);
  const acoes = await h.ev(() => { const l = []; LB.relogio.acoes(LB.jogo, l, () => true); return l.map((a) => a.texto); });
  afirmar(acoes.includes('Descansar até de manhã'), 'fonte deixa descansar à noite');
  await h.ev(() => { const l = []; LB.relogio.acoes(LB.jogo, l, () => true); l[0].fazer(); });
  await h.avancar();
  const d = await h.ev(() => ({ t: LB.relogio.texto(LB.jogo), dia: LB.relogio.dia(LB.jogo) }));
  igual(d.t.slice(0, 2), '07', 'acorda às 7h');
  igual(d.dia, 2, 'no dia seguinte');
});

teste('parte 2: depois do “Fim?”, Continuar mostra o dragão pedindo ajuda', async () => {
  const save = { area: 'fazenda', flags: Object.assign({ encontroFeito: true, manhaVista: true, prologo: true, florestaVista: true, versaoMundo: 2, dragaoEmPaz: true }, TODAS, { zerado: true }) };
  const h = await abrir({ save });
  try {
    await h.p.click('#btn-continuar');
    await h.espera(600);
    afirmar(await h.ev(() => !!LB.jogo.cena), 'a abertura da Parte 2 começa');
    await h.foto('p2-abertura');
    await h.avancar(400);
    const r = await h.ev(() => { const j = LB.jogo; return { p2: !!j.flags.parte2, bell: !!j.flags.bellJogavel, comp: j.companheira && j.companheira.quem, obj: LB.mochila.objetivo(j), vale: j.mapa.def.saidas.find((s) => s.para === 'vale') }; });
    afirmar(r.p2 && r.bell, 'Parte 2 e Bell jogável liberadas');
    igual(r.comp, 'bell', 'a Bell anda junto da Line');
    afirmar(/Vale das Raízes/.test(r.obj), 'objetivo aponta o vale: ' + r.obj);
    await h.area('vilarejo', await h.ev(() => LB.jogo.flags));
    const aberta = await h.ev(() => !LB.jogo.bloqueia(59 * 32 + 16, 14 * 32));
    afirmar(aberta, 'a estrada do vale abriu no vilarejo');
    afirmar(!h.erros.length, h.erros.join('\n'));
  } finally { await h.fechar(); }
}, { semPagina: true });

teste('parte 2: estrada do vale fechada antes do dragão acordar', async (h) => {
  await h.area('vilarejo', TODAS);
  afirmar(await h.ev(() => LB.jogo.bloqueia(59 * 32 + 16, 14 * 32)), 'saída para o vale bloqueada na Parte 1');
  const mundo = await h.ev(() => LB.mochila.MUNDO.filter((n) => n.parte2).length);
  igual(mundo, 7, 'sete regiões novas no mapa do mundo');
});

teste('Bell jogável: troca com T, estrela, leque de luz, canção e assume quando a Line cai', async (h) => {
  await h.area('vale', Object.assign({ visto_vale: true }, P2));
  await h.ir(20, 21);
  await h.p.keyboard.press('KeyT');
  await h.espera(200);
  let r = await h.ev(() => { const j = LB.jogo; return { heroina: LB.herois.ativa(j), trad: !!j.line.anim.traduzir, comp: j.companheira.quem, cod: j.line.anim.resolver(j.line.dir, j.line.lado).codigo }; });
  igual(r.heroina, 'bell', 'trocou para a Bell');
  afirmar(r.trad, 'animações traduzidas para as da Bell');
  igual(r.comp, 'line', 'agora é a Line que acompanha');
  afirmar(r.cod.startsWith('BELL_'), 'desenha a Bell: ' + r.cod);
  await h.foto('bell-jogavel');
  // Estrela (J).
  await h.ev(() => { window.__tiros = []; const l0 = LB.magia.lancar; LB.magia.lancar = (j, o) => { window.__tiros.push(o.tipo); return l0(j, o); }; });
  await h.p.keyboard.press('KeyJ');
  await h.espera(350);
  r = await h.ev(() => ({ tiros: window.__tiros, estado: LB.jogo.line.estado, anim: LB.jogo.line.anim.base }));
  r = r.tiros.length ? r.tiros : [JSON.stringify(r)];
  afirmar(r.includes('estrelaBell'), 'J atira estrela: ' + r);
  // Leque (K): três estrelas de luz, gasta magia.
  await h.espera(500);
  const mana0 = await h.ev(() => LB.jogo.line.mana);
  await h.ev(() => { window.__tiros = []; });
  await h.p.keyboard.press('KeyK');
  await h.espera(500);
  r = await h.ev(() => ({ luz: window.__tiros.filter((t) => t === 'luz').length, mana: LB.jogo.line.mana }));
  igual(r.luz, 3, 'leque solta três estrelas de luz');
  afirmar(r.mana < mana0, 'leque gasta magia');
  // Canção (Q): acalma o inimigo perto.
  await h.espera(600);
  await h.ev(() => { const j = LB.jogo, e = j.inimigos.find((x) => !x.chefeElemental); e.x = j.line.x + 60; e.y = j.line.y; j.line.mana = j.line.manaMax; });
  await h.p.keyboard.press('KeyQ');
  // A canção sai no meio da animação: espera até 3 s, com o inimigo sempre perto (máquina lenta não reprova).
  for (let i = 0; i < 15; i++) {
    await h.espera(200);
    r = await h.ev(() => { const j = LB.jogo, e = j.inimigos.find((x) => !x.chefeElemental); if (e) { e.x = j.line.x + 60; e.y = j.line.y; } return j.inimigos.filter((x) => x.encantado > 0).length; });
    if (r >= 1) break;
  }
  afirmar(r >= 1, 'canção encanta o inimigo');
  await h.foto('bell-cancao');
  // A Bell cai e a Line assume.
  await h.espera(1500);
  await h.ev(() => { const j = LB.jogo; j.line.invul = 0; j.line.escudos = 0; j.line.hp = 1; j.line.receberDano(j, 3, true, j.line.x + 10, j.line.y); });
  await h.p.waitForFunction(() => LB.herois.ativa(LB.jogo) === 'line' || LB.jogo.line.estado === 'morta', null, { timeout: 8000 });
  r = await h.ev(() => ({ heroina: LB.herois.ativa(LB.jogo), estado: LB.jogo.line.estado, hp: LB.jogo.line.hp, derrota: !document.querySelector('#derrota').classList.contains('oculto') }));
  igual(r.heroina, 'line', 'a Line assumiu');
  afirmar(r.hp > 0 && r.estado !== 'morta', 'a Line está de pé');
  // Não dá para trocar de volta para quem caiu.
  await h.espera(1200);
  await h.p.keyboard.press('KeyT');
  await h.espera(200);
  igual(await h.ev(() => LB.herois.ativa(LB.jogo)), 'line', 'a Bell caída não volta sem descansar');
});

teste('ferraria: armaduras da Bell só na Parte 2', async (h) => {
  await h.area('vilarejo', TODAS);
  await h.ev(() => LB.loja.tela.abrir(LB.jogo, 'bento'));
  const antes = await h.ev(() => document.querySelectorAll('#loja-lista .produto').length);
  await h.ev(() => LB.loja.tela.fechar());
  await h.ev(() => { const j = LB.jogo; Object.assign(j.flags, { parte2: true, bellJogavel: true }); LB.mochila.darMoedas(j, 500, true); LB.loja.tela.abrir(j, 'bento'); });
  const depois = await h.ev(() => document.querySelectorAll('#loja-lista .produto').length);
  igual(depois - antes, 3, 'três armaduras da Bell aparecem');
  const r = await h.ev(() => { const j = LB.jogo, i = LB.loja.LOJAS.bento.produtos.findIndex((p) => p.armadura === 'vestido'); const c = LB.loja.comprar(j, 'bento', i); return { ok: c.ok, bell: j.flags.armaduraBell, line: j.flags.armadura || null, escLine: j.line.escudosMax }; });
  afirmar(r.ok, 'comprou o vestido');
  igual(r.bell, 'vestido', 'guardado para a Bell');
  igual(r.line, null, 'a armadura da Line não muda');
  igual(r.escLine, 0, 'a Line (ativa) continua sem escudo');
  await h.ev(() => LB.loja.tela.fechar());
  await h.ev(() => LB.herois.trocar(LB.jogo, true));
  igual(await h.ev(() => LB.jogo.line.escudosMax), 1, 'a Bell veste o vestido (1 escudo)');
});

// Cada chefe: entra na arena, a cena apresenta, luta alguns segundos e é vencido.
const CHEFES_P2 = [['colosso', 'vale', {}], ['magma', 'fenda', { chefeTerra: true }], ['serpente', 'lago', { chefeTerra: true, fusaoMagma: true }], ['hidra', 'pantano', { chefeTerra: true, fusaoMagma: true, chefeAgua: true }],
  ['grifo', 'picos', { chefeTerra: true, fusaoMagma: true, chefeAgua: true, fusaoLama: true }], ['tempestade', 'tempestade', { chefeTerra: true, fusaoMagma: true, chefeAgua: true, fusaoLama: true, chefeAr: true }],
  ['quimera', 'coracao', { chefeTerra: true, fusaoMagma: true, chefeAgua: true, fusaoLama: true, chefeAr: true, fusaoTempestade: true, portalCoracao: true }]];
for (const [id, area, antes] of CHEFES_P2) {
  teste(`chefe: ${id} acorda, luta e é vencido (${area})`, async (h) => {
    await h.area(area, Object.assign({ ['visto_' + area]: true }, P2, antes));
    const c = await h.ev(() => { const d = LB.jogo.mapa.def.chefe; return { x: (d.arena[0] + d.arena[2]) / 2, y: d.arena[3] - 1.2, id: d.id }; });
    igual(c.id, id, 'chefe da área');
    await h.ir(c.x, c.y);
    await h.p.waitForFunction(() => !!LB.jogo.cena, null, { timeout: 3000 }).catch(() => {});
    afirmar(await h.ev(() => !!LB.jogo.cena), 'a apresentação do chefe começa');
    await h.avancar(300);
    let r = await h.ev(() => { const ch = LB.jogo.chefeArena; return { acordado: ch && !ch.dormindo, estado: ch && ch.estado }; });
    afirmar(r.acordado, 'chefe acordou');
    // Deixa ele atacar um pouco (a heroína não morre no teste).
    for (let i = 0; i < 8; i++) { await h.ev(() => { const l = LB.jogo.line; l.hp = l.hpMax; }); await h.espera(600); }
    await h.foto('chefe-' + id);
    r = await h.ev(() => { const ch = LB.jogo.chefeArena; return { hp: ch.hp, hpMax: ch.hpMax, perigos: ch.perigos.length, visto: ch.vistosAtaques || null, estado: ch.estado }; });
    // Vence: cansa e bate até acabar.
    await h.ev(() => {
      const j = LB.jogo, ch = j.chefeArena;
      for (let k = 0; k < 300 && ch.vivo && ch.estado !== 'morrendo'; k++) {
        if (ch.estado !== 'exausto') { ch.estado = 'exausto'; ch.t = 0; ch.dormindo = false; }
        ch.hp = Math.min(ch.hp, 3);
        ch.receberGolpe(j, 3, ch.x - 30, ch.y, 50);
        if (ch.def.fases && ch.checarFase) ch.checarFase(j);
      }
    });
    await h.p.waitForFunction((flag) => LB.jogo.flags[flag], (await h.ev((i) => LB.chefes.CHEFES[i].flag, id)), { timeout: 15000 });
    await h.avancar(400);
    const f = await h.ev((i) => { const j = LB.jogo; return { flag: j.flags[LB.chefes.CHEFES[i].flag], coracoes: j.flags.coracoes || 0, portal: !!j.flags.portalCoracao, estado: j.estado, fim: !!j.flags.quimeraVencida }; }, id);
    afirmar(f.flag, 'flag de vitória salva');
    if (['colosso', 'serpente', 'grifo'].includes(id)) igual(f.coracoes, 1, 'guardião libertado dá +1 coração');
    if (id === 'tempestade') afirmar(f.portal, 'a última junção abre o Coração dos Elementos');
    if (id === 'quimera') afirmar(f.fim, 'final da Parte 2');
  });
}

teste('parte 2: junção desfeita termina com o toca aqui das duas (item 271)', async (h) => {
  await h.area('fenda', Object.assign({ visto_fenda: true, chefeTerra: true }, P2));
  const r = await h.ev(async () => {
    const j = LB.jogo;
    j.inimigos = []; j.flags.fusaoMagma = true;
    j.iniciarCena(LB.HISTORIA.chefeVencido, { semPular: true }, { id: 'magma', x: j.line.x + 120, y: j.line.y - 20 });
    let toca = false, companheira = null;
    for (let i = 0; i < 400 && j.cena; i++) {
      if (j.duo && j.duo.anim.base === 'LINE_BELL_HIGH_FIVE') { toca = true; companheira = j.companheira ? j.companheira.visivel : null; } else if (!j.duo) LB.dialogo.clicou = true;
      await new Promise((ok) => setTimeout(ok, 40));
    }
    return { toca, companheira, fim: !j.cena, line: j.line.visivel };
  });
  afirmar(r.toca, 'as duas batem as mãos depois de desfazer a junção');
  afirmar(r.companheira !== true, 'a companheira some enquanto o duo aparece');
  afirmar(r.fim && r.line, 'a cena termina e a heroína volta');
});

teste('parte 2: a Bell em guarda nas quatro direções (itens 286 a 288) e o dragão dormindo (item 285)', async (h) => {
  await h.area('vale', Object.assign({ visto_vale: true }, P2));
  const r = await h.ev(() => {
    const j = LB.jogo; j.inimigos = []; LB.herois.trocar(j);
    const l = j.line, vistos = {};
    for (const dir of ['FRONT', 'BACK', 'LEFT', 'RIGHT']) {
      l.voltarLivre(); l.armada = true; l.semCombate = 0; l.dir = dir; l.lado = dir === 'LEFT' ? -1 : 1;
      const st = l.estadoAnim(); vistos[dir] = st.r.codigo + (st.r.flip ? '*' : '');
    }
    const s = window.SPRITES.DRAGON_SLEEP;
    return { heroina: LB.herois.ativa(j), vistos, dragao: s && [s.item, s.mundo, LB.info('DRAGON_SLEEP').respira] };
  });
  igual(r.heroina, 'bell', 'a Bell é a heroína');
  igual(r.vistos, { FRONT: 'BELL_COMBAT_IDLE_FRONT', BACK: 'BELL_COMBAT_IDLE_BACK', LEFT: 'BELL_COMBAT_IDLE_LEFT', RIGHT: 'BELL_COMBAT_IDLE_LEFT*' }, 'guarda nas quatro direções (a da direita é a da esquerda espelhada)');
  igual(r.dragao, ['LINE_BELL_ITEM_285.html', 215, true], 'dragão dormindo do item 285, no tamanho dos outros e respirando');
  // A arte veio com chifres, espinhos e garras creme; no jogo eles são pretos, como nas outras animações.
  const cores = await h.ev(async () => {
    const img = new Image(); img.src = window.SPRITES.DRAGON_SLEEP.src; await img.decode();
    const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
    const ctx = cv.getContext('2d'); ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
    let op = 0, creme = 0, cinza = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] <= 128) continue;
      op++;
      const r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255, mx = Math.max(r, g, b), c = mx - Math.min(r, g, b), s = mx ? c / mx : 0;
      const h = !c ? 0 : 60 * (mx === r ? ((g - b) / c + 6) % 6 : mx === g ? (b - r) / c + 2 : (r - g) / c + 4);
      if (h >= 15 && h <= 48 && s < 0.7 && mx > 0.3) creme++;
      if (s < 0.25 && mx > 0.08 && mx < 0.5) cinza++;
    }
    return { creme: +(creme / op).toFixed(3), cinza: +(cinza / op).toFixed(3) };
  });
  afirmar(cores.creme < 0.1 && cores.cinza > 0.06, 'dragão dormindo com chifres e espinhos pretos (creme só na barriga e no queixo): ' + JSON.stringify(cores));
});

teste('dicas do Fácil: seta aponta a saída certa, o cristal apagado e o chefe', async (h) => {
  await h.ev(() => LB.dificuldade.definir('facil'));
  try {
    await h.area('vilarejo', P2);
    let p = await h.ev(() => LB.dicas.pontoAlvo(LB.jogo));
    afirmar(p && /Vale/.test(p.rotulo), 'no vilarejo, a seta aponta a estrada do vale: ' + JSON.stringify(p));
    await h.area('vale', Object.assign({ visto_vale: true }, P2));
    p = await h.ev(() => LB.dicas.pontoAlvo(LB.jogo));
    afirmar(p && /Cristal/.test(p.rotulo), 'no vale, aponta um cristal apagado: ' + JSON.stringify(p));
    await h.ev(() => { const j = LB.jogo; for (const p of j.mapa.props) if (p.tipo === 'cristal') LB.magia.acender ? LB.magia.acender(j, p) : (p.aceso = true); });
    await h.avancar();
    await h.area('vale', await h.ev(() => LB.jogo.flags));
    p = await h.ev(() => LB.dicas.pontoAlvo(LB.jogo));
    afirmar(p && /Colosso/.test(p.rotulo), 'com os cristais acesos, aponta o Colosso: ' + JSON.stringify(p));
    await h.espera(300);
    await h.foto('dicas-seta');
    // Dica de chefe e de derrota.
    await h.ev(() => { const j = LB.jogo; LB.dicas.chefe(j, j.chefeArena, 0); });
    afirmar(/Colosso/.test(await h.ev(() => document.querySelector('#dica').textContent)), 'dica do chefe aparece');
    await h.ev(() => LB.dicas.aoCair(LB.jogo));
    afirmar(/💡/.test(await h.ev(() => document.querySelector('#derrota .sub').textContent)), 'tela de derrota com dica');
  } finally { await h.ev(() => LB.dificuldade.definir('normal')); }
});

teste('guia do Fácil: trilha dourada acha o caminho em todas as fases e nas tarefas da fazenda', async (h) => {
  await h.ev(() => LB.dificuldade.definir('facil'));
  try {
    // Fazenda, antes do rapto: aponta uma tarefa do dia.
    await h.ev(() => { const j = LB.jogo; document.querySelector('#menu').classList.add('oculto'); j.flags = { encontroFeito: true, manhaVista: true, versaoMundo: 2, etapa: 'manha' }; j.iniciarArea('fazenda', null, true); j.iniciarCapitulo(); });
    await h.espera(300); await h.avancar();
    let g = await h.ev(() => { const x = LB.dicas.guia(LB.jogo); return x && { r: x.alvo.rotulo, n: x.pts ? x.pts.length : 0 }; });
    afirmar(g && g.n > 0 && /Ovo|regador|ração|carinho/i.test(g.r), 'fazenda: guia para uma tarefa ' + JSON.stringify(g));
    await h.foto('guia-fazenda');
    // Parte 1 e Parte 2: de cada área, existe caminho até o próximo objetivo.
    const casos = [
      ['fazenda', { prologo: true }], ['floresta', { prologo: true }], ['floresta', { prologo: true, magoVisto: true }],
      ['floresta', { prologo: true, magoVisto: true, espada: true }], ['ruinas', Object.assign({}, TODAS, { magia: false, golem: false, estrela: false, montanhaVista: false })],
      ['ruinas', Object.assign({}, TODAS, { golem: false, estrela: false, montanhaVista: false })], ['montanha', TODAS],
      ['vilarejo', P2], ['vale', Object.assign({ visto_vale: true }, P2)], ['lago', Object.assign({ visto_lago: true, chefeTerra: true, fusaoMagma: true }, P2)],
      ['picos', Object.assign({ visto_picos: true, chefeTerra: true, fusaoMagma: true, chefeAgua: true, fusaoLama: true }, P2)],
      ['picos', Object.assign({ visto_picos: true, chefeTerra: true, fusaoMagma: true, chefeAgua: true, fusaoLama: true, chefeAr: true, fusaoTempestade: true, portalCoracao: true }, P2)],
    ];
    for (const [area, flags] of casos) {
      await h.area(area, flags);
      g = await h.ev(() => { const x = LB.dicas.guia(LB.jogo); return x && { r: x.alvo.rotulo, n: x.pts ? x.pts.length : 0 }; });
      afirmar(g && g.n > 1, `${area} ${JSON.stringify(flags).slice(0, 60)}: sem caminho ${JSON.stringify(g)}`);
    }
    await h.area('vale', Object.assign({ visto_vale: true }, P2));
    await h.espera(400);
    await h.foto('guia-vale');
    await h.ev(() => LB.mochila.tela.abrir('mapa'));
    await h.espera(300);
    await h.foto('guia-mapa');
  } finally { await h.ev(() => LB.dificuldade.definir('normal')); }
});

teste('parte 2: vento empurra, lama deixa lenta', async (h) => {
  await h.area('picos', Object.assign({ visto_picos: true }, P2));
  await h.ir(31.5, 29.5);
  const x0 = await h.ev(() => LB.jogo.line.x);
  await h.espera(500);
  const x1 = await h.ev(() => LB.jogo.line.x);
  afirmar(x1 > x0 + 10, `o vento empurrou para a direita (${x0} → ${x1})`);
  await h.area('vale', Object.assign({ visto_vale: true }, P2));
  await h.ir(28.5, 31.5);
  await h.p.keyboard.down('KeyD'); await h.espera(400); await h.p.keyboard.up('KeyD');
  const lama = await h.ev(() => LB.jogo.line.x);
  await h.ir(20.5, 21.2);
  await h.p.keyboard.down('KeyD'); await h.espera(400); await h.p.keyboard.up('KeyD');
  const chao = await h.ev(() => LB.jogo.line.x);
  afirmar(lama - 28.5 * 32 < (chao - 20.5 * 32) * 0.8, `na lama anda menos (${lama - 28.5 * 32} x ${chao - 20.5 * 32})`);
});

// ================= Celular =================
teste('celular: controles de toque, mochila e botão do item', async () => {
  const h = await abrir({ celular: true });
  try {
    await h.area('floresta', { espada: true });
    await h.ev(() => { LB.mochila.dar(LB.jogo, 'bomba', 2); LB.mochila.dar(LB.jogo, 'pocao', 1); LB.entrada.usandoToque = () => true; LB.ui.atualizarToque(LB.jogo); });
    await h.espera(200);
    afirmar(await h.visivel('#toque'), 'controles de toque visíveis');
    afirmar(await h.visivel('#b-item'), 'botão do item (bomba)');
    afirmar(!(await h.ev(() => !!document.querySelector('#b-pocao'))), 'sem botão separado da poção');
    await h.foto('celular-jogo');
    await h.p.tap('#b-mochila');
    await h.espera(200);
    afirmar(await h.visivel('#mochila'), 'mochila pelo toque');
    await h.foto('celular-mochila');
    const larg = await h.ev(() => document.querySelector('.caixa.mochila').getBoundingClientRect().width);
    afirmar(larg <= 844, 'mochila cabe na tela');
    await h.p.click('#btn-fechar-mochila');
    await h.p.tap('#b-item');
    igual(await h.ev(() => LB.jogo.bombas.length), 1, 'botão do item coloca bomba');
    // A poção usa o mesmo botão: equipa na mochila e aperta.
    await h.ev(() => { const j = LB.jogo; LB.mochila.equipar(j, 'pocao'); j.line.hp = 2; j.line.voltarLivre(); });
    igual(await h.ev(() => document.querySelector('#b-item').textContent), '🧪1', 'botão mostra a poção equipada');
    await h.p.tap('#b-item');
    afirmar(await h.ev(() => LB.jogo.line.hp > 2), 'botão do item usa a poção');
    // Sem o botão do giro: ⚔ segurado faz o giro.
    afirmar(!(await h.ev(() => !!document.querySelector('#b-especial'))), 'botão 🌀 saiu');
    await h.espera(900);
    await h.ev(() => { const j = LB.jogo; j.inimigos = []; j.line.invul = 5; j.line.voltarLivre(); j.line.armada = true; j.line.cooldownGiro = 0; });
    const caixa = await h.ev(() => { const r = document.querySelector('#b-atacar').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    const cdp = await h.p.context().newCDPSession(h.p);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: caixa.x, y: caixa.y }] });
    let giro = false;
    const vistos = [];
    for (let i = 0; i < 12 && !giro; i++) { await h.espera(100); const e = await h.ev(() => LB.jogo.line.estado + ':' + LB.jogo.estado); vistos.push(e); giro = e.startsWith('giro'); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    afirmar(giro, '⚔ segurado faz o giro (' + vistos.join(' ') + ')');
    afirmar(!h.erros.length, h.erros.join('\n'));
  } finally { await h.fechar(); }
}, { semPagina: true });

teste('sem espada, o ataque é um soco que machuca', async (h) => {
  await h.area('floresta', { espada: false });
  await h.espera(300);
  const r0 = await h.ev(() => {
    const j = LB.jogo, l = j.line;
    const s = new LB.Sombra(l.x + 30, l.y); j.inimigos.push(s); l.lado = 1; l.dir = 'RIGHT';
    return { hp: s.hp, espada: l.temEspada };
  });
  afirmar(!r0.espada, 'Line sem espada');
  await h.p.keyboard.press('KeyJ');
  let anim = null;
  for (let i = 0; i < 10 && anim !== 'LINE_PUNCH'; i++) { await h.espera(50); anim = await h.ev(() => LB.jogo.line.anim.base); }
  igual(anim, 'LINE_PUNCH', 'animação do soco');
  await h.espera(600);
  const hp = await h.ev(() => LB.jogo.inimigos[LB.jogo.inimigos.length - 1].hp);
  afirmar(hp < r0.hp, `o soco machuca (hp ${r0.hp} → ${hp})`);
  afirmar(await h.ev(() => !!LB.desenharSprite && !!window.SPRITES.LINE_PUNCH), 'arte do soco carregada');
});

teste('ataque para baixo acerta o inimigo abaixo e a mira vira para ele', async (h) => {
  await h.area('floresta', { espada: true });
  await h.espera(300);
  const r0 = await h.ev(() => {
    const j = LB.jogo, l = j.line;
    j.inimigos = [];
    const s = new LB.Sombra(l.x, l.y + 40); j.inimigos.push(s); l.lado = 1; l.dir = 'RIGHT';
    return s.hp;
  });
  await h.p.keyboard.press('KeyJ');
  // Antes do primeiro golpe a Line saca a espada: espera o golpe acertar (até 2 s).
  let r;
  for (let i = 0; i < 20; i++) {
    await h.espera(100);
    r = await h.ev(() => ({ dir: LB.jogo.line.dir, hp: LB.jogo.inimigos.length ? LB.jogo.inimigos[0].hp : 0 }));
    if (r.hp < r0) break;
  }
  igual(r.dir, 'FRONT', 'virou para baixo');
  afirmar(r.hp < r0, `o golpe para baixo machuca (hp ${r0} → ${r.hp})`);
});

teste('desempenho: chão em pedaços, troca de mapa rápida e tile trocado só refaz os pedaços em volta', async (h) => {
  const r = await h.ev(async () => {
    const j = LB.jogo; j.flags = Object.assign({}, j.flags, { espada: true, prologo: true });
    const criadas = []; const orig = document.createElement.bind(document);
    document.createElement = (t) => { const e = orig(t); if (t === 'canvas') criadas.push(e); return e; };
    const t0 = performance.now(); j.iniciarArea('floresta', null, true); const troca = performance.now() - t0;
    document.createElement = orig;
    await new Promise((ok) => setTimeout(ok, 600));
    const m = j.mapa, antes = m.pedacos.size;
    const maior = Math.max(0, ...[...m.pedacos.values(), ...criadas].map((c) => c.width * c.height));
    const tx = Math.floor(j.line.x / LB.TILE), ty = Math.floor(j.line.y / LB.TILE);
    m.trocar(tx, ty, m.l[ty][tx]);
    return { troca, antes, depois: m.pedacos.size, maior };
  });
  afirmar(r.troca < 400, `troca de mapa rápida (${Math.round(r.troca)} ms)`);
  afirmar(r.antes >= 2, `pedaços do chão desenhados (${r.antes})`);
  afirmar(r.maior <= 600 * 600, `nenhuma imagem gigante do chão (${r.maior} px)`);
  afirmar(r.depois < r.antes && r.depois > 0, `trocar um tile refaz só os pedaços em volta (${r.antes} → ${r.depois})`);
});

teste('HUD com as molduras da arte: retrato, barras, moedas, minimapa e painel', async (h) => {
  await h.area('vilarejo', { espada: true, magia: true });
  await h.espera(800);
  const r = await h.ev(() => ({ pronto: LB.hud.pronto(), fundo: LB.hud.fundo(LB.jogo), painel: getComputedStyle(document.querySelector('#objetivo')).borderImageSource }));
  afirmar(r.pronto, 'molduras carregadas');
  afirmar(r.fundo > 60 && r.fundo < 140, `altura do HUD (${r.fundo})`);
  afirmar(/painel_objetivo/.test(r.painel), 'painel de objetivo com a moldura');
  await h.foto('hud-molduras');
});

// ================= Execução =================
(async () => {
  const filtros = process.argv.slice(2).map((s) => s.toLowerCase());
  const lista = testes.filter((t) => !filtros.length || filtros.some((f) => t.nome.toLowerCase().includes(f)));
  const srv = await servidor();
  BASE = 'http://127.0.0.1:' + srv.address().port;
  navegador = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  let ok = 0;
  const falhas = [];
  const t0 = Date.now();
  for (const t of lista) {
    const ini = Date.now();
    let h = null;
    try {
      if (t.o.semPagina) await t.fn();
      else {
        h = await abrir();
        await t.fn(h);
        afirmar(!h.erros.length, 'erros no console:\n' + h.erros.join('\n'));
      }
      ok++;
      console.log(`  ✔ ${t.nome} (${Date.now() - ini} ms)`);
    } catch (e) {
      falhas.push(t.nome);
      console.log(`  ✘ ${t.nome}\n      ${String(e instanceof Falha ? e.message : e.stack || e).split('\n').join('\n      ')}`);
      if (h && h.erros.length) console.log('      console: ' + h.erros.slice(0, 3).join('\n      '));
    } finally {
      if (h && !t.o.semFechar) await h.fechar().catch(() => {});
    }
  }
  await navegador.close();
  srv.close();
  console.log(`\n${ok}/${lista.length} testes passaram em ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  if (falhas.length) { console.log('Falharam:\n  - ' + falhas.join('\n  - ')); process.exit(1); }
})();
