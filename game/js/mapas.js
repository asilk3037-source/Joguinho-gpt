'use strict';

(function (LB) {
  const TILE = 32;

  // Legenda: T árvore · . grama · , mato alto · F flores · : caminho · r raízes (correr derruba)
  // w riacho (dá para pular) · ~ água funda · R pedra · H casa · D porta · X espinheiro (corta com espada)
  // C baú · S placa · # parede da caverna · _ chão da caverna · L lava · o estalagmite · G jaula
  const MAPAS = {
    fazenda: {
      nome: 'Fazendinha',
      tema: 'fazenda',
      linhas: [
        'TTTTTTTTTTTTTTTTTTTTTT::TTTTTTTTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTTTTTTTT::TTTTTTTTTTTTTTTTTTTTTT',
        'TT.T.TT.TTTTT.TT...T.T::TTT.T..T.TTT.TT.TT..TT',
        'TT.....F....,.........::....,.......,..F,...TT',
        'TT..F...............T.::.,........,.fffffff.TT',
        'TT....F.,,...,,T.F.,..::...BBBBBBB..fuuuuuf.TT',
        'TT...FHHHHHHHF....,...::.,.BBBBBBB..fuuuuuf.TT',
        'TT....HHHHHHH.....T...::...BBBBBBB..,uuuuuf,TT',
        'TT....HHHHHHH.........::...BBBBBBB..fuuuuuf.TT',
        'TTF...HHHHHHH.........::...BBBBBBB..fffffff.TT',
        'TT....HHHDHHH.k...,...::..n...:...n.........TT',
        'TT..T.FF,:FF,.........::F.....:....n........TT',
        'TT.......::::::::::::::::::::::...F.F......TTT',
        'TT................,..,:...,...F.,........M..TT',
        'TT.vF,.v.F...F.,.P....:....F.,........,.,...TT',
        'TT..F..............,.F:...Ffffffffffffffff..TT',
        'TT...............,....:.,.Ff.,,..........f..TT',
        'TTffffffffff..ccccccc,:....f............,f..TT',
        'TTfKKKF....f..hhhhhhh,:....f.,..F........f..TT',
        'TTfKKK..F..f..ccccccc.:,,..f......F....,.f..TT',
        'TTf...........hhhhhhh.:.....,,.......,...f..TT',
        'TTf.........,Fccccccc.:.T..............,.f..TT',
        'TTf..,.....f..hhhhhhh.:....f...........F.fF.TT',
        'TTf........f.,........:.mm.f....,,....,..f..TT',
        'TTffffffffff..F.......:..,.f........FF...f..TT',
        'TT,........~~~~~~~...,.....f..,..........f..TT',
        'TT.T......~~~~~~~~~........fffffffffffffff,,TT',
        'TT.......~~~~~~~~~~~...,.....,..........,...TT',
        'TT...T,..~~~~~~~~~~~.,,,............,....T,.TT',
        'TT........~~~~~~~~~......T...T.F...,,T......TT',
        'TTFF.......~~~~~~~...............T........F.TT',
        'TT...,.F..........F..........,.......,F...F.TT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
      ],
      saidas: [{ x: 22, y: 0, w: 2, h: 1, para: 'floresta', chegada: { x: 17.5, y: 27.6, dir: 'BACK' } }],
      inicio: { x: 22.5, y: 3.6, dir: 'FRONT' },
      porta: { x: 10.7, y: 11.2 },
      placas: {},
      pontos: {
        tigela: { x: 15.6, y: 11.3 },
        racao: { x: 30.5, y: 10.4 },
        regador: { x: 17.5, y: 15.5 },
        mesa: { x: 25, y: 23.9 },
        lago: { x: 21.2, y: 27.4 },
      },
      canteiros: ['15,17', '18,19', '14,21', '20,21'],
      // Objetos soltos do pacote de arte: [nome, x, y (base, em tiles), largura, raio de colisão].
      decoracoes: [
        ['carroca', 35.5, 12.9, 70, 16], ['lampiao', 13.5, 11.9, 26, 5], ['lampiao', 20.6, 25.4, 26, 5],
        ['barril', 26.4, 11.8, 14, 6], ['caixa', 27.2, 11.9, 16, 6], ['placa2', 21.3, 3.9, 30, 6],
        ['arbusto_c', 4.5, 13.9, 26, 8], ['arbusto_b', 12.5, 15.9, 24, 8], ['arbusto_d', 26.5, 30.9, 28, 8],
        ['girassol_0', 5.5, 11.9, 16, 0], ['girassol_1', 13.2, 10.9, 16, 0], ['girassol_2', 32.5, 13.9, 16, 0],
        ['milho_1', 24.5, 17.9, 15, 0], ['trigo_1', 24.5, 19.9, 15, 0], ['pedra1', 8.5, 31.9, 24, 8], ['moita', 41.5, 31.9, 26, 0],
        ['pier', 17.2, 28.9, 120, 0], ['barco', 13.6, 29.6, 38, 0],
      ],
      areas: {
        galinhas: { x0: 3, y0: 18, x1: 10, y1: 23 },
        pasto: { x0: 28, y0: 16, x1: 40, y1: 25 },
        chiqueiro: { x0: 37, y0: 5, x1: 41, y1: 8 },
        lago: { x0: 10, y0: 25, x1: 19, y1: 30 },
      },
    },

    floresta: {
      nome: 'Floresta Sussurrante',
      tema: 'floresta',
      linhas: [
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT::TTTT',
        'TTTT....,,......TTTTT.........::..TT',
        'TT........,,,.........TT......::..TT',
        'T..........F..........TT......::...T',
        'T....TT.....R.............,,..::...T',
        'T....TT..........::::::::::::::..TTT',
        'TT....,,.........::..........,,...TT',
        'TTTTTTTTTTTTT....::....TTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTXXXXXXXXTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTT...::...TTTTTTTTTTTTTT',
        'TTTTT.....TTTT...::...TTTT......TTTT',
        'TT...F...........::...............TT',
        'TT.C:............::....,,.........TT',
        'TT..:......F.....::...............TT',
        'T...:....,,......::....R...........T',
        'T...:TTTT........::........TTTT....T',
        'T...:::::::::::::::........TTTT....T',
        'T....TTTT........::........TTTT....T',
        'T.....,,.........::.........,,.....T',
        'T~~~wwwwwwwwwwwwwwwwwwwwwwwwwwww~~~T',
        'T..............S.::................T',
        'T................::.........F......T',
        'T....R.......rrrr::rrrr.......TT...T',
        'T............rrrrrrrrrr.......TT...T',
        'T..F.........rrrr::rrrr............T',
        'T................::................T',
        'T....TT........S.::.......TT...F...T',
        'T....TT..........::.......TT.......T',
        'TT...,,..........::..........,,...TT',
        'TTTTTTTTTTTTTTTTT::TTTTTTTTTTTTTTTTT',
      ],
      saidas: [
        { x: 17, y: 29, w: 2, h: 1, para: 'fazenda', chegada: { x: 22.5, y: 3.6, dir: 'FRONT' } },
        { x: 30, y: 0, w: 2, h: 1, para: 'ruinas', requer: 'espada', chegada: { x: 19.5, y: 34.2, dir: 'BACK' } },
      ],
      inicio: { x: 17.5, y: 27.6, dir: 'BACK' },
      placas: {
        '15,26': 'Cuidado com as raízes! Correndo por cima delas você pode tropeçar. Ande devagar (solte o correr).',
        '15,20': 'Riacho à frente. Para atravessar, pule! (Espaço ou botão Pular). Correndo, o pulo vai mais longe.',
      },
      baus: { '3,12': 'espada' },
      inimigos: [
        { x: 8, y: 3, depoisDe: 'espada' }, { x: 25, y: 3, depoisDe: 'espada' }, { x: 20, y: 6, depoisDe: 'espada' },
        { x: 9, y: 13, depoisDe: 'espada' }, { x: 26, y: 12, depoisDe: 'espada' },
      ],
    },

    covil: {
      nome: 'Covil do Dragão',
      tema: 'covil',
      linhas: [
        '##########################',
        '#########________#########',
        '#######____________#######',
        '#####________________#####',
        '####__________________####',
        '###____________________###',
        '##__o________________o__##',
        '##______________________##',
        '#LL____________________LL#',
        '#LL____________________LL#',
        '##______________________##',
        '##__o________________o__##',
        '###____________________###',
        '####__________________####',
        '#####________________#####',
        '######______________######',
        '########__________########',
        '##########______##########',
        '###########____###########',
        '###########____###########',
      ],
      saidas: [],
      inicio: { x: 13, y: 18.5, dir: 'BACK' },
      placas: {},
      jaula: { x: 13, y: 2.6 },
    },

    // Barreiras ('Z') somem quando todos os cristais ('Q') ou tochas ('Y') do grupo acendem.
    ruinas: {
      nome: 'Ruínas Encantadas',
      tema: 'ruinas',
      linhas: [
        '###################..###################',
        '###################ZZ###################',
        '####................................####',
        '####.,........I..........I........,.####',
        '####....I......................I....####',
        '####................................####',
        '####................................####',
        '####................................####',
        '####................................####',
        '####....I......................I....####',
        '####.,......,..............,......,.####',
        '####................................####',
        '##################::::##################',
        '##################ZZZZ##################',
        '###..F.........................F..######',
        '###.,...........................,.######',
        '###...~~~~~~~......Q....~~~~~~~.Q.######',
        '###...~~~~~~~..I.......I~~~~~~~...######',
        '###..U~~~Q~~~...........~~~Q~~~...######',
        '###...~~~~~~~...........~~~~~~~...Z.C###',
        '###...~~~~~~~...........~~~~~~~...Z..###',
        '###.,..........I.......I........,.######',
        '###..........,.......,............######',
        '##################::::##################',
        '##################ZZZZ##################',
        '########...........::...........########',
        '##.......,.........::.........,.########',
        '##..A.......Q......::......Q....########',
        '##........F........::........F..########',
        '##.................::...........########',
        '##.,..F....I.......::.......I...########',
        '##.................::...........########',
        '########...........::..U........########',
        '########.,.......S.::.........,.########',
        '########......,....::....,......########',
        '###################::###################',
      ],
      saidas: [
        { x: 19, y: 35, w: 2, h: 1, para: 'floresta', chegada: { x: 30.5, y: 1.8, dir: 'FRONT' } },
        { x: 19, y: 0, w: 2, h: 1, para: 'montanha', chegada: { x: 17.5, y: 37.4, dir: 'BACK' } },
      ],
      inicio: { x: 19.5, y: 34.2, dir: 'BACK' },
      placas: {
        '17,33': 'Ruínas Encantadas. Só a luz atravessa as barreiras. O altar da luz fica na sala a oeste.',
      },
      baus: { '36,19': 'coracao' },
      barreiras: [
        { id: 'sul', fontes: ['12,27', '27,27'], tiles: [[18, 24, 21, 24]] },
        { id: 'meio', fontes: ['9,18', '27,18', '19,16'], tiles: [[18, 13, 21, 13]] },
        { id: 'bau', fontes: ['32,16'], tiles: [[34, 19, 34, 20]] },
        { id: 'golem', fontes: [], tiles: [[19, 1, 20, 1]] },
      ],
      golem: { x: 19.5, y: 7.2 },
      inimigos: [
        { x: 14, y: 31, depoisDe: 'magia' }, { x: 25, y: 31, depoisDe: 'magia' },
        { x: 10, y: 15, tipo: 'luz', depoisDe: 'magia' }, { x: 28, y: 21, tipo: 'luz', depoisDe: 'magia' },
        { x: 20, y: 20, depoisDe: 'magia' }, { x: 14, y: 15, depoisDe: 'magia' }, { x: 30, y: 15, tipo: 'luz', depoisDe: 'magia' },
      ],
    },

    montanha: {
      nome: 'Montanha de Brasa',
      tema: 'montanha',
      linhas: [
        '################::::################',
        '################::::################',
        '###############......###############',
        '###############......###############',
        '###############ZZZZZZ###############',
        '##.........###........###.........##',
        '##............R...................##',
        '##jjjjjjjj..................R.....##',
        '##.......j........................##',
        '##...C...j........Y...............##',
        '##.......j...............R........##',
        '##.......j..R.................o...##',
        '##.......j............o...........##',
        '##jjjjjjjj........................##',
        '##jjjjjjjjjjjjj......jjjjjjjjjjjjj##',
        '##................................##',
        '##................................##',
        '##................................##',
        '##................................##',
        '##.........................LLLLLLL##',
        '##.........LLLL.R..........LLLLLLL##',
        '##.........LLLL............LL...LL##',
        '##.........................LL.Y.LL##',
        '##....................R....LL...LL##',
        '##LLLLLLL...o..............LLLLLLL##',
        '##LLLLLLL..................LLLLLLL##',
        '##LLLLLLLU........................##',
        '##LLLLLLL.........R...............##',
        '##LLLLLLL.S.............o.........##',
        '##LLLLLLL.........................##',
        '##................................##',
        '######........................######',
        '##jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj##',
        '##....................R...........##',
        '##........R....................R..##',
        '##....Y........S............o.....##',
        '##.R.....................R........##',
        '##..........o.....................##',
        '################::::################',
        '################::::################',
      ],
      saidas: [
        { x: 16, y: 39, w: 4, h: 1, para: 'ruinas', chegada: { x: 19.5, y: 2.4, dir: 'FRONT' } },
        { x: 16, y: 0, w: 4, h: 1, para: 'covil', chegada: { x: 13, y: 18.5, dir: 'BACK' } },
      ],
      inicio: { x: 17.5, y: 37.4, dir: 'BACK' },
      placas: {
        '15,35': 'Fendas na rocha! Pule para atravessar (Espaço). Correndo, o pulo vai mais longe.',
        '10,28': 'Fonte das brasas: beba para recuperar vida e magia. Se cair, você volta para cá.',
      },
      baus: { '5,9': 'coracao' },
      barreiras: [
        { id: 'portao', fontes: ['6,35', '30,22', '18,9'], tiles: [[15, 4, 20, 4]] },
      ],
      inimigos: [
        { x: 24, y: 34, tipo: 'fogo' }, { x: 9, y: 34 },
        { x: 18, y: 25, tipo: 'fogo' }, { x: 14, y: 28 }, { x: 23, y: 18 },
        { x: 10, y: 17, tipo: 'fogo' }, { x: 26, y: 12, tipo: 'fogo' }, { x: 14, y: 9 }, { x: 22, y: 7 },
      ],
    },
  };

  const SOLIDOS = new Set(['T', 'R', 'H', 'D', '~', 'w', 'X', 'C', 'S', '#', 'L', 'o', 'B', 'K', 'f', 'P', 'M', 'n', 'm', 'k', 'v', 'I', 'Q', 'A', 'Y', 'U', 'Z', 'j']);

  // Gerador pseudoaleatório estável por posição (o cenário não "pisca" entre quadros).
  function ruido(x, y, s) {
    let h = (x * 374761393 + y * 668265263 + (s || 0) * 982451653) | 0;
    h = (h ^ (h >>> 13)) * 1274126177;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  const CORES = {
    campo: { grama: '#6aa84f', grama2: '#5b9642', grama3: '#7dbb5e', caminho: '#d2b07a', caminho2: '#b8955f' },
    fazenda: { grama: '#72ae52', grama2: '#62a046', grama3: '#86c162', caminho: '#d8b47c', caminho2: '#bf9862' },
    floresta: { grama: '#4f8a3f', grama2: '#437a35', grama3: '#5e9c4b', caminho: '#b99867', caminho2: '#9c7c50' },
    covil: { chao: '#4b403c', chao2: '#3d3431', parede: '#241c1a', parede2: '#352b28' },
    ruinas: { chao: '#6f7a68', chao2: '#626d5b', junta: '#566150', musgo: '#6e8f4c', parede: '#343b33', parede2: '#434b40', topo: '#5a6553', caminho: '#8d8a78', margem: '#a3a690' },
    montanha: { chao: '#5c4b44', chao2: '#4f403a', junta: '#3d302b', musgo: '#7a5a3a', parede: '#231b19', parede2: '#33282a', topo: '#6b554b', caminho: '#7a6558', margem: '#8a6f5f' },
  };

  class Mapa {
    constructor(id) {
      const def = MAPAS[id];
      this.id = id;
      this.def = def;
      this.tema = def.tema;
      this.l = def.linhas.map((r) => r.split(''));
      this.h = this.l.length;
      this.w = Math.max(...def.linhas.map((r) => r.length));
      for (const r of this.l) while (r.length < this.w) r.push(r === this.l[0] ? 'T' : '.');
      this.larg = this.w * TILE;
      this.alt = this.h * TILE;
      this.props = [];
      this.criarProps();
      this.renderizarChao();
    }

    tile(tx, ty) {
      if (tx < 0 || ty < 0 || tx >= this.w || ty >= this.h) return this.tema === 'covil' || this.tema === 'ruinas' || this.tema === 'montanha' ? '#' : 'T';
      return this.l[ty][tx];
    }

    tileEm(x, y) { return this.tile(Math.floor(x / TILE), Math.floor(y / TILE)); }

    solido(tx, ty, noAr) {
      const t = this.tile(tx, ty);
      if (noAr && (t === 'w' || t === 'j')) return false;
      return SOLIDOS.has(t);
    }

    // Colisão de uma caixa (centro x, y) com os tiles sólidos.
    colide(x, y, meiaL, meiaA, noAr) {
      const x0 = Math.floor((x - meiaL) / TILE), x1 = Math.floor((x + meiaL - 0.01) / TILE);
      const y0 = Math.floor((y - meiaA) / TILE), y1 = Math.floor((y + meiaA - 0.01) / TILE);
      for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) if (this.solido(tx, ty, noAr)) return true;
      return false;
    }

    trocar(tx, ty, c) {
      this.l[ty][tx] = c;
      this.props = this.props.filter((p) => !(p.tx === tx && p.ty === ty));
      this.renderizarChao();
    }

    // Retângulo formado por tiles vizinhos com as letras dadas (a partir do canto superior esquerdo).
    bloco(tx, ty, letras, usados) {
      let x1 = tx, y1 = ty;
      while (letras.includes(this.tile(x1 + 1, ty))) x1++;
      while (letras.includes(this.tile(tx, y1 + 1))) y1++;
      for (let yy = ty; yy <= y1; yy++) for (let xx = tx; xx <= x1; xx++) usados.add(xx + ',' + yy);
      return { tx, ty, x: tx * TILE, y: (y1 + 1) * TILE, w: (x1 - tx + 1) * TILE, h: (y1 - ty + 1) * TILE };
    }

    criarProps() {
      for (const [nome, x, y, larg, raio] of this.def.decoracoes || []) {
        this.props.push({ tipo: 'decoracao', nome, x: x * TILE, y: y * TILE, larg, raio, balanca: /girassol|milho|trigo|moita|arbusto/.test(nome), flip: ruido(Math.round(x * 3), Math.round(y * 3), 9) > 0.5 && nome !== 'placa2' });
      }
      const casas = new Set();
      const canteiros = new Set(this.def.canteiros || []);
      for (let ty = 0; ty < this.h; ty++) for (let tx = 0; tx < this.w; tx++) {
        const t = this.l[ty][tx];
        const cx = (tx + 0.5) * TILE, base = (ty + 1) * TILE;
        const v = ruido(tx, ty, 1);
        if (casas.has(tx + ',' + ty)) continue;
        if (t === 'B') { this.props.push(Object.assign({ tipo: 'celeiro' }, this.bloco(tx, ty, 'B', casas))); continue; }
        if (t === 'K') { this.props.push(Object.assign({ tipo: 'galinheiro' }, this.bloco(tx, ty, 'K', casas))); continue; }
        if (t === 'f') {
          const liga = (c) => c === 'f';
          this.props.push({ tipo: 'cerca', tx, ty, x: cx, y: base - 6, d: liga(this.tile(tx + 1, ty)), e: liga(this.tile(tx - 1, ty)), b: liga(this.tile(tx, ty + 1)), c: liga(this.tile(tx, ty - 1)) });
          continue;
        }
        if (t === ',') { this.props.push({ tipo: 'mato', tx, ty, x: cx, y: base - 8, v }); continue; }
        if (t === 'F') { this.props.push({ tipo: 'flores', tx, ty, x: cx, y: base - 10, v }); continue; }
        if (t === 'c') { this.props.push({ tipo: 'planta', tx, ty, x: cx, y: base - 8, v, canteiro: canteiros.has(tx + ',' + ty) }); continue; }
        if (t === 'P') { this.props.push({ tipo: 'poco', tx, ty, x: cx, y: base - 4 }); continue; }
        if (t === 'M') { this.props.push({ tipo: 'moinho', tx, ty, x: cx, y: base - 2, v }); continue; }
        if (t === 'n') { this.props.push({ tipo: 'feno', tx, ty, x: cx, y: base - 4, v }); continue; }
        if (t === 'k') { this.props.push({ tipo: 'casinha', tx, ty, x: cx, y: base - 3 }); continue; }
        if (t === 'm' && this.tile(tx - 1, ty) !== 'm') { this.props.push(Object.assign({ tipo: 'mesa' }, this.bloco(tx, ty, 'm', casas))); continue; }
        if (t === 'v' && !casas.has(tx + ',' + ty)) {
          let x2 = tx + 1;
          while (x2 < this.w && this.tile(x2, ty) !== 'v') x2++;
          casas.add(x2 + ',' + ty);
          this.props.push({ tipo: 'varal', tx, ty, x: cx, x2: (x2 + 0.5) * TILE, y: base - 4, v });
          continue;
        }
        // Ruínas e montanha: pilares, cristais, altar, tochas, fonte e barreiras mágicas.
        if (t === 'I') { this.props.push({ tipo: 'pilar', tx, ty, x: cx, y: base - 3, v }); continue; }
        if (t === 'Q') { this.props.push({ tipo: 'cristal', tx, ty, x: cx, y: base - 4, v, aceso: false }); continue; }
        if (t === 'A') { this.props.push({ tipo: 'altar', tx, ty, x: cx, y: base - 3 }); continue; }
        if (t === 'Y') { this.props.push({ tipo: 'tocha', tx, ty, x: cx, y: base - 3, v, aceso: false }); continue; }
        if (t === 'U') { this.props.push({ tipo: 'fonte', tx, ty, x: cx, y: base - 3 }); continue; }
        if (t === 'Z') { this.props.push({ tipo: 'barreira', tx, ty, x: cx, y: base - 1, v, tema: this.tema }); continue; }
        if (t === 'T') this.props.push({ tipo: 'arvore', tx, ty, x: cx, y: base - 4, v });
        else if (t === 'R') this.props.push({ tipo: 'pedra', tx, ty, x: cx, y: base - 6, v: ruido(tx, ty, 2) });
        else if (t === 'o') this.props.push({ tipo: 'estalagmite', tx, ty, x: cx, y: base - 4, v: ruido(tx, ty, 3) });
        else if (t === 'X') this.props.push({ tipo: 'espinheiro', tx, ty, x: cx, y: base - 2, v: ruido(tx, ty, 4) });
        else if (t === 'C') this.props.push({ tipo: 'bau', tx, ty, x: cx, y: base - 6, conteudo: (this.def.baus || {})[tx + ',' + ty] });
        else if (t === 'S') this.props.push({ tipo: 'placa', tx, ty, x: cx, y: base - 6, texto: (this.def.placas || {})[tx + ',' + ty] || '...' });
        else if (t === 'H' || t === 'D') {
          const b = this.bloco(tx, ty, 'HD', casas);
          let porta = tx;
          for (let xx = tx; xx < tx + b.w / TILE; xx++) if (this.tile(xx, ty + b.h / TILE - 1) === 'D') porta = xx;
          this.props.push(Object.assign({ tipo: this.tema === 'fazenda' ? 'casaFazenda' : 'casa', porta: (porta + 0.5) * TILE }, b));
        }
      }
    }

    renderizarChao() {
      const RES = 2;
      const c = this.chao || document.createElement('canvas');
      c.width = this.larg * RES; c.height = this.alt * RES;
      const g = c.getContext('2d');
      g.setTransform(RES, 0, 0, RES, 0, 0);
      for (let ty = 0; ty < this.h; ty++) for (let tx = 0; tx < this.w; tx++) this.desenharTile(g, tx, ty);
      this.chao = c;
      this.resChao = RES;
    }

    desenharTile(g, tx, ty) {
      const t = this.l[ty][tx];
      const x = tx * TILE, y = ty * TILE;
      const cor = CORES[this.tema];
      const rnd = (s) => ruido(tx, ty, s);

      if (this.tema === 'ruinas' || this.tema === 'montanha') { this.desenharTilePedra(g, tx, ty, t, x, y, cor, rnd); return; }
      if (this.tema === 'covil') {
        if (t === '#') {
          g.fillStyle = cor.parede; g.fillRect(x, y, TILE, TILE);
          g.fillStyle = cor.parede2;
          for (let i = 0; i < 3; i++) g.fillRect(x + rnd(i) * 26, y + rnd(i + 5) * 26, 6, 4);
          if (this.tile(tx, ty + 1) !== '#') {
            g.fillStyle = '#4a3a34'; g.fillRect(x, y + TILE - 12, TILE, 12);
            g.fillStyle = '#5c4a42'; g.fillRect(x, y + TILE - 12, TILE, 3);
          }
          return;
        }
        g.fillStyle = cor.chao; g.fillRect(x, y, TILE, TILE);
        g.fillStyle = cor.chao2;
        for (let i = 0; i < 4; i++) g.fillRect(x + rnd(i) * 28, y + rnd(i + 9) * 28, 3, 2);
        if (t === 'L') {
          g.fillStyle = '#ff6a1a'; g.fillRect(x, y, TILE, TILE);
          g.fillStyle = '#ffb347';
          for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(x + rnd(i) * TILE, y + rnd(i + 3) * TILE, 3 + rnd(i + 6) * 4, 0, 7); g.fill(); }
          g.fillStyle = 'rgba(60,20,10,.55)';
          for (let i = 0; i < 2; i++) g.fillRect(x + rnd(i + 11) * 24, y + rnd(i + 13) * 24, 9, 5);
        }
        return;
      }

      // Base de grama com variações.
      g.fillStyle = cor.grama; g.fillRect(x, y, TILE, TILE);
      for (let i = 0; i < 7; i++) {
        g.fillStyle = rnd(i + 20) > 0.5 ? cor.grama2 : cor.grama3;
        g.fillRect(x + rnd(i) * 30, y + rnd(i + 7) * 30, 2, 3);
      }

      if (t === ':') {
        g.fillStyle = cor.caminho; g.fillRect(x, y, TILE, TILE);
        g.fillStyle = cor.caminho2;
        for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(x + 3 + rnd(i) * 26, y + 3 + rnd(i + 4) * 26, 1.5, 0, 7); g.fill(); }
        // Bordas suaves com a grama.
        g.fillStyle = cor.grama;
        const viz = [[0, -1], [0, 1], [-1, 0], [1, 0]];
        viz.forEach(([dx, dy], k) => {
          if (':'.includes(this.tile(tx + dx, ty + dy))) return;
          for (let i = 0; i < 5; i++) {
            const p = rnd(k * 10 + i) * TILE;
            const px = dx === 0 ? x + p : (dx < 0 ? x : x + TILE - 3);
            const py = dy === 0 ? y + p : (dy < 0 ? y : y + TILE - 3);
            g.fillRect(px, py, 3 + rnd(k + i) * 3, 3);
          }
        });
      } else if (t === 'u') {
        g.fillStyle = '#7a5536'; g.fillRect(x, y, TILE, TILE);
        g.fillStyle = '#654329';
        for (let i = 0; i < 3; i++) { g.beginPath(); g.ellipse(x + 5 + rnd(i + 120) * 22, y + 5 + rnd(i + 121) * 22, 5 + rnd(i) * 4, 3, 0, 0, 7); g.fill(); }
        g.fillStyle = 'rgba(160,190,210,.35)'; g.beginPath(); g.ellipse(x + 16, y + 18, 6, 2.5, 0, 0, 7); g.fill();
      } else if (t === 'h' || t === 'c') {
        g.fillStyle = '#8a5f3c'; g.fillRect(x, y, TILE, TILE);
        g.fillStyle = '#74492c';
        for (let i = 0; i < 4; i++) g.fillRect(x, y + 3 + i * 8, TILE, 3);
        g.fillStyle = '#9b6e48';
        for (let i = 0; i < 5; i++) g.fillRect(x + rnd(i + 130) * 28, y + rnd(i + 131) * 28, 2, 2);
      } else if (t === 'r') {
        g.fillStyle = cor.caminho2; g.globalAlpha = 0.35; g.fillRect(x, y, TILE, TILE); g.globalAlpha = 1;
        g.strokeStyle = '#6b4a2b'; g.lineWidth = 3.2; g.lineCap = 'round';
        for (let i = 0; i < 2; i++) {
          const y0 = y + 6 + rnd(i + 80) * 20;
          g.beginPath(); g.moveTo(x - 2, y0);
          g.bezierCurveTo(x + 10, y0 - 8 + rnd(i + 90) * 16, x + 20, y0 + 8 - rnd(i + 91) * 16, x + TILE + 2, y0 + rnd(i + 92) * 6 - 3);
          g.stroke();
        }
        g.strokeStyle = '#8a6440'; g.lineWidth = 1;
        g.beginPath(); g.moveTo(x + 4, y + 10); g.lineTo(x + 12, y + 12); g.stroke();
      } else if (t === 'w' || t === '~') {
        const funda = t === '~';
        g.fillStyle = funda ? '#2f6fb2' : '#5aa9e6'; g.fillRect(x, y, TILE, TILE);
        g.fillStyle = funda ? '#3a80c6' : '#7cc0f0';
        for (let i = 0; i < 3; i++) g.fillRect(x + rnd(i + 100) * 22, y + rnd(i + 110) * 28, 8, 2);
        // Margem com a grama.
        g.fillStyle = '#c9b27d';
        if (!'w~'.includes(this.tile(tx, ty - 1))) g.fillRect(x, y, TILE, 3);
        if (!'w~'.includes(this.tile(tx, ty + 1))) g.fillRect(x, y + TILE - 3, TILE, 3);
        if (!'w~'.includes(this.tile(tx - 1, ty))) g.fillRect(x, y, 3, TILE);
        if (!'w~'.includes(this.tile(tx + 1, ty))) g.fillRect(x + TILE - 3, y, 3, TILE);
      }
    }

    // Chão de pedra das ruínas e da montanha (paredes, lajes, água, lava e fendas).
    desenharTilePedra(g, tx, ty, t, x, y, cor, rnd) {
      const ruinas = this.tema === 'ruinas';
      if (t === '#') {
        g.fillStyle = cor.parede; g.fillRect(x, y, TILE, TILE);
        g.fillStyle = cor.parede2;
        if (ruinas) { for (let i = 0; i < 2; i++) g.fillRect(x + 2, y + 2 + i * 16, TILE - 4, 12); g.fillStyle = cor.parede; g.fillRect(x + (ty % 2 ? 10 : 22), y, 2, TILE); }
        else for (let i = 0; i < 3; i++) g.fillRect(x + rnd(i) * 24, y + rnd(i + 5) * 24, 8, 5);
        if (this.tile(tx, ty + 1) !== '#') {
          g.fillStyle = cor.topo; g.fillRect(x, y + TILE - 12, TILE, 12);
          g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(x, y + TILE - 12, TILE, 2);
          g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x, y + TILE - 3, TILE, 3);
          if (ruinas && rnd(40) > 0.55) { g.fillStyle = cor.musgo; g.fillRect(x + rnd(41) * 20, y + TILE - 12, 8 + rnd(42) * 8, 4); }
        }
        return;
      }
      // Laje do chão.
      g.fillStyle = rnd(30) > 0.5 ? cor.chao : cor.chao2; g.fillRect(x, y, TILE, TILE);
      if (ruinas) {
        g.fillStyle = cor.junta; g.fillRect(x, y, TILE, 1.5); g.fillRect(x, y, 1.5, TILE);
        if (rnd(31) > 0.5) g.fillRect(x + 16, y, 1, TILE);
        if (rnd(32) > 0.72) { g.fillStyle = cor.musgo; g.globalAlpha = 0.55; g.beginPath(); g.ellipse(x + 6 + rnd(33) * 20, y + 6 + rnd(34) * 20, 6, 3.5, 0, 0, 7); g.fill(); g.globalAlpha = 1; }
      } else {
        g.fillStyle = cor.junta;
        for (let i = 0; i < 4; i++) g.fillRect(x + rnd(i + 50) * 28, y + rnd(i + 51) * 28, 3, 2);
        if (rnd(35) > 0.7) { g.strokeStyle = cor.junta; g.lineWidth = 1; g.beginPath(); g.moveTo(x + rnd(36) * 10, y + rnd(37) * 32); g.lineTo(x + 16, y + 16); g.lineTo(x + 22 + rnd(38) * 10, y + rnd(39) * 32); g.stroke(); }
      }
      if (t === ':') {
        g.fillStyle = cor.caminho; g.fillRect(x + 1, y + 1, TILE - 2, TILE - 2);
        g.fillStyle = cor.junta;
        for (let i = 0; i < 3; i++) g.fillRect(x + 2, y + 3 + i * 10, TILE - 4, 1.2);
      } else if (t === '~') {
        g.fillStyle = '#2f6f8f'; g.fillRect(x, y, TILE, TILE);
        g.fillStyle = '#3f88a8'; for (let i = 0; i < 3; i++) g.fillRect(x + rnd(i + 100) * 22, y + rnd(i + 110) * 28, 8, 2);
        g.fillStyle = cor.margem;
        if (this.tile(tx, ty - 1) !== '~' && this.tile(tx, ty - 1) !== 'Q') g.fillRect(x, y, TILE, 4);
        if (this.tile(tx, ty + 1) !== '~' && this.tile(tx, ty + 1) !== 'Q') g.fillRect(x, y + TILE - 3, TILE, 3);
        if (this.tile(tx - 1, ty) !== '~' && this.tile(tx - 1, ty) !== 'Q') g.fillRect(x, y, 3, TILE);
        if (this.tile(tx + 1, ty) !== '~' && this.tile(tx + 1, ty) !== 'Q') g.fillRect(x + TILE - 3, y, 3, TILE);
      } else if (t === 'L') {
        g.fillStyle = '#ff6a1a'; g.fillRect(x, y, TILE, TILE);
        g.fillStyle = '#ffb347';
        for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(x + rnd(i) * TILE, y + rnd(i + 3) * TILE, 3 + rnd(i + 6) * 4, 0, 7); g.fill(); }
        g.fillStyle = 'rgba(60,20,10,.55)';
        for (let i = 0; i < 2; i++) g.fillRect(x + rnd(i + 11) * 24, y + rnd(i + 13) * 24, 9, 5);
        g.fillStyle = cor.topo;
        if (this.tile(tx, ty - 1) !== 'L') g.fillRect(x, y, TILE, 3);
        if (this.tile(tx - 1, ty) !== 'L') g.fillRect(x, y, 3, TILE);
        if (this.tile(tx + 1, ty) !== 'L') g.fillRect(x + TILE - 3, y, 3, TILE);
      } else if (t === 'j') {
        g.fillStyle = '#0e0a0c'; g.fillRect(x, y, TILE, TILE);
        // Brasa lá no fundo: deixa claro que é um buraco.
        const fundo = g.createLinearGradient(x, y, x, y + TILE); fundo.addColorStop(0, 'rgba(255,80,20,0)'); fundo.addColorStop(0.7, 'rgba(255,80,20,.28)'); fundo.addColorStop(1, 'rgba(255,140,40,.4)');
        g.fillStyle = fundo; g.fillRect(x + 4, y + 8, TILE - 8, TILE - 10);
        g.fillStyle = 'rgba(255,170,80,.5)'; for (let i = 0; i < 2; i++) g.fillRect(x + 6 + rnd(i + 60) * 18, y + 18 + rnd(i + 61) * 10, 2, 2);
        const gr = g.createLinearGradient(x, y, x, y + TILE); gr.addColorStop(0, 'rgba(60,40,40,.9)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
        if (this.tile(tx, ty - 1) !== 'j') { g.fillStyle = gr; g.fillRect(x, y, TILE, 14); g.fillStyle = cor.topo; g.fillRect(x, y, TILE, 3); }
        g.fillStyle = cor.topo;
        if (this.tile(tx, ty + 1) !== 'j') g.fillRect(x, y + TILE - 2, TILE, 2);
        if (this.tile(tx - 1, ty) !== 'j') g.fillRect(x, y, 2, TILE);
        if (this.tile(tx + 1, ty) !== 'j') g.fillRect(x + TILE - 2, y, 2, TILE);
      }
    }

    // Brilho animado da água e da lava, desenhado por cima do chão.
    desenharAnimado(g, t, vis) {
      const x0 = Math.max(0, Math.floor(vis.x / TILE)), x1 = Math.min(this.w - 1, Math.floor((vis.x + vis.w) / TILE));
      const y0 = Math.max(0, Math.floor(vis.y / TILE)), y1 = Math.min(this.h - 1, Math.floor((vis.y + vis.h) / TILE));
      for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) {
        const c = this.l[ty][tx];
        if (c === 'w' || c === '~') {
          const f = (t * 1.3 + tx * 0.7 + ty * 0.4) % 1;
          g.fillStyle = 'rgba(255,255,255,0.35)';
          g.fillRect(tx * TILE + 4 + f * 18, ty * TILE + 8 + (tx % 3) * 6, 6, 1.5);
        } else if (c === 'L') {
          const a = 0.25 + 0.2 * Math.sin(t * 3 + tx + ty * 2);
          g.fillStyle = `rgba(255,220,120,${a})`;
          g.fillRect(tx * TILE, ty * TILE, TILE, TILE);
        }
      }
    }
  }

  LB.TILE = TILE;
  LB.MAPAS = MAPAS;
  LB.Mapa = Mapa;
  LB.ruido = ruido;
})(window.LB);
