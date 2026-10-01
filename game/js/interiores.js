'use strict';

// Interior de toda casa com porta. A planta de cada uma (paredes, piso, porta) é montada por
// tools/gerar_interiores.py com pedaços da planta da casa da fazenda (item 145); aqui ficam a porta
// do lado de fora, a saída e os móveis (itens 148 a 152). A casa da fazenda está em mapas.js.
(function (LB) {
  const G = LB.INTERIORES_GERADOS || {};

  // Interior: [área de fora, coluna e linha da porta lá fora]
  const PORTAS = {
    casa_floresta: ['floresta', 68, 5],
    casa_loja: ['vilarejo', 15, 9],
    casa_ferraria: ['vilarejo', 44, 9],
    casa_vila_a: ['vilarejo', 8, 30],
    casa_vila_b: ['vilarejo', 18, 30],
    casa_vila_c: ['vilarejo', 42, 30],
    casa_vale: ['vale', 7, 7],
    casa_lago: ['lago', 6, 36],
  };

  // [nome, x, y (base, em tiles), largura no mundo, pegada [larg, alt] em tiles, altura na parede, espelhar].
  // O piso começa na linha 5; a porta fica no meio da parede de baixo.
  const MOVEIS = {
    casa_floresta: [
      ['farmhouse_fireplace', 2.8, 5.9, 96, [3, 1]], ['farmhouse_bookshelf', 5.2, 6.0, 53, [1, 1]], ['farmhouse_nightstand', 6.6, 6.5, 34, [1, 1]],
      ['farmhouse_bed', 8.6, 8.5, 110, [3, 3]], ['farmhouse_armchair', 3.0, 9.0, 57, [1, 1]], ['farmhouse_theo_bed', 1.8, 11.7, 46, [1, 1]],
      ['farmhouse_laundry_basket', 9.6, 11.6, 32, [1, 1]],
      ['farm_tool_rack', 3.2, 11.6, 38, [1, 1]], ['farm_wooden_bucket', 4.1, 11.7, 18], ['farmhouse_wall_clock', 6.6, 4.95, 20, null, 58],
    ],
    casa_loja: [
      ['farmhouse_bookshelf', 2.0, 6.0, 53, [1, 1]], ['farmhouse_bookshelf', 3.7, 6.0, 53, [1, 1]], ['farmhouse_bookshelf', 10.3, 6.0, 53, [1, 1]],
      ['farmhouse_bookshelf', 12.0, 6.0, 53, [1, 1]], ['farmhouse_dresser', 7.0, 8.2, 92, [3, 1]], ['barril', 1.8, 10.8, 26, [1, 1]],
      ['caixa', 3.0, 10.9, 28, [1, 1]], ['farmhouse_laundry_basket', 11.5, 10.8, 32, [1, 1]],
      ['farm_seed_sacks', 9.2, 11.6, 30], ['farm_harvest_basket', 10.4, 11.6, 26], ['farmhouse_potted_plant', 1.9, 8.5, 28, [1, 1]],
      ['farmhouse_hanging_lamp', 7.0, 8.25, 20, null, 64], ['farmhouse_flower_vase', 7.4, 8.22, 12, null, 26],
    ],
    casa_ferraria: [
      ['forja', 3.0, 5.9, 106, [3, 1]], ['farmhouse_bookshelf', 10.5, 6.0, 53, [1, 1]], ['bigorna', 6.5, 8.6, 0, [1, 1]],
      ['barril', 11.6, 9.8, 26, [1, 1]], ['barril', 11.6, 10.9, 26, [1, 1]], ['caixa', 1.9, 10.9, 28, [1, 1]], ['farmhouse_dresser', 8.9, 6.3, 80, [2, 1]],
      ['farm_tool_rack', 4.8, 10.9, 38, [1, 1]], ['farm_wooden_bucket', 8.2, 9.3, 18], ['farm_woodpile', 2.2, 8.4, 40, [1, 1]],
    ],
    casa_vila_a: [
      ['farmhouse_stove', 2.0, 6.3, 57, [2, 1]], ['farmhouse_fridge', 3.8, 6.5, 51, [1, 1]], ['farmhouse_nightstand', 6.7, 6.5, 34, [1, 1]],
      ['farmhouse_bed', 8.6, 8.4, 110, [3, 3]], ['farmhouse_dining_table', 3.0, 9.4, 96, [3, 2]],
      ['farmhouse_potted_plant', 10.2, 10.6, 28, [1, 1]], ['farmhouse_hanging_lamp', 3.0, 9.45, 20, null, 80], ['farmhouse_flower_vase', 3.0, 9.47, 14, null, 24],
    ],
    casa_vila_b: [
      ['farmhouse_wardrobe', 1.8, 6.4, 53, [1, 1]], ['farmhouse_sofa', 5.5, 7.0, 100, [3, 1]], ['farmhouse_bookshelf', 9.4, 6.0, 53, [1, 1]],
      ['farmhouse_armchair', 2.2, 8.6, 57, [1, 1]], ['farmhouse_coffee_table', 5.5, 8.7, 72, [2, 1]], ['farmhouse_theo_bed', 8.8, 10.6, 46, [1, 1]],
      ['farmhouse_potted_plant', 1.8, 10.6, 28, [1, 1]], ['farmhouse_flower_vase', 5.5, 8.72, 12, null, 16], ['farmhouse_hanging_lamp', 5.5, 8.75, 20, null, 50],
    ],
    casa_vila_c: [
      ['farmhouse_bed', 2.6, 8.4, 110, [3, 3]], ['farmhouse_nightstand', 4.6, 6.5, 34, [1, 1]], ['farmhouse_dresser', 8.2, 6.3, 80, [2, 1]],
      ['farmhouse_armchair', 8.4, 9.3, 57, [1, 1], 0, true], ['farmhouse_laundry_basket', 9.6, 10.7, 32, [1, 1]],
      ['farmhouse_potted_plant', 6.0, 6.6, 26, [1, 1]], ['farmhouse_wall_sconce', 4.6, 4.95, 16, null, 40],
    ],
    casa_vale: [
      ['farmhouse_stove', 1.9, 6.3, 57, [2, 1]], ['farmhouse_sink_counter', 4.6, 6.3, 92, [3, 1]], ['farmhouse_fridge', 6.9, 6.5, 51, [1, 1]],
      ['farmhouse_bed', 8.9, 8.5, 110, [3, 3]], ['farmhouse_dining_table', 4.3, 9.6, 104, [3, 2]], ['farmhouse_laundry_basket', 1.8, 11.6, 32, [1, 1]],
      ['farmhouse_hanging_lamp', 4.3, 9.65, 20, null, 80], ['farmhouse_potted_plant', 10.3, 11.6, 26, [1, 1]], ['farmhouse_spice_shelf', 4.6, 4.95, 40, null, 43],
    ],
    casa_lago: [
      ['farmhouse_dresser', 2.6, 6.3, 80, [2, 1]], ['farmhouse_laundry_basket', 4.4, 6.6, 32, [1, 1]], ['farmhouse_towel_rack', 5.6, 4.95, 30, null, 18],
      ['farmhouse_bed', 8.6, 8.4, 110, [3, 3]], ['farmhouse_armchair', 2.4, 9.2, 57, [1, 1]], ['farmhouse_coffee_table', 4.4, 10.0, 66, [2, 1]],
      ['farmhouse_potted_plant', 10.2, 10.6, 26, [1, 1]], ['farm_wooden_bucket', 6.4, 6.7, 18], ['farmhouse_hanging_lamp', 4.4, 10.05, 20, null, 56],
    ],
  };

  for (const [id, [fora, tx, ty]] of Object.entries(PORTAS)) {
    const g = G[id], def = LB.MAPAS[fora];
    if (!g || !def) continue;
    LB.registrarImagem('base_' + id, 'assets/cenario/base_' + id + '.webp');
    const dentro = { x: g.saida.x + 3, y: 5 + g.fundo - 0.4, dir: 'BACK' };
    LB.MAPAS[id] = {
      nome: g.nome, tema: 'casa', base: 'base_' + id, interior: true, linhas: g.linhas, placas: {},
      saidas: [{ x: g.saida.x, y: g.saida.y, w: g.saida.w, h: 1, para: fora, chegada: { x: tx + 0.5, y: ty + 1.7, dir: 'FRONT' } }],
      inicio: dentro, moveis: MOVEIS[id] || [],
    };
    def.entradas = (def.entradas || []).concat({ x: tx, y: ty, para: id, chegada: dentro });
  }
})(window.LB);
