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
  // Móveis de cada casa: [nome, x, y (base, em tiles), largura (0 = régua de tamanhos), pegada [larg, alt] em tiles,
  // altura na parede, espelhar]. O piso começa na linha 5; a porta fica no meio da parede de baixo e o corredor
  // da porta até o meio da casa fica sempre livre. Os móveis encostam nas paredes, cada cômodo num canto.
  const MOVEIS = {
    // Cabana do caçador: lareira e poltrona à esquerda, cama à direita, ferramentas e caminha de cachorro embaixo.
    casa_floresta: [
      ['farmhouse_fireplace', 2.6, 5.95, 0, [3, 1]], ['farmhouse_bookshelf', 4.6, 6.0, 0, [1, 1]], ['farmhouse_wall_clock', 6.0, 4.95, 0, null, 58],
      ['farmhouse_nightstand', 6.6, 6.4, 0, [1, 1]], ['farmhouse_bed', 8.6, 7.9, 0, [3, 3]],
      ['farmhouse_armchair', 2.9, 8.7, 0, [1, 1], 0, true], ['farmhouse_theo_bed', 2.0, 11.0, 0, [1, 1]],
      ['farm_tool_rack', 9.4, 11.1, 0, [1, 1]], ['farm_wooden_bucket', 8.3, 11.3, 0],
    ],
    // Loja da Dona Rosa: prateleiras no fundo, balcão no meio (ela fica atrás) e mercadorias nos cantos da frente.
    casa_loja: [
      ['farmhouse_bookshelf', 2.0, 6.0, 0, [1, 1]], ['farmhouse_bookshelf', 3.7, 6.0, 0, [1, 1]],
      ['farmhouse_bookshelf', 10.3, 6.0, 0, [1, 1]], ['farmhouse_bookshelf', 12.0, 6.0, 0, [1, 1]],
      ['farmhouse_spice_shelf', 7.0, 4.95, 0, null, 43],
      ['farmhouse_kitchen_island', 7.0, 8.3, 0, [3, 1]], ['farmhouse_flower_vase', 6.0, 8.32, 0, null, 30],
      ['barril', 1.8, 10.9, 26, [1, 1]], ['caixa', 2.9, 11.0, 28, [1, 1]], ['farm_seed_sacks', 4.2, 11.2, 0],
      ['farm_apple_basket', 9.8, 11.2, 0], ['farm_harvest_basket', 11.0, 11.1, 0], ['farmhouse_potted_plant', 12.1, 11.0, 0, [1, 1]],
    ],
    // Ferraria do Seu Bento: forja e lenha à esquerda, balcão no meio (ele fica atrás), bigorna e barris na frente.
    casa_ferraria: [
      ['forja', 2.8, 5.95, 106, [3, 1]], ['farm_woodpile', 1.9, 8.2, 0, [1, 1]],
      ['farm_tool_rack', 10.6, 6.0, 0, [1, 1]], ['farm_horseshoe_sign', 8.4, 4.95, 0, null, 46],
      ['farmhouse_kitchen_island', 7.5, 8.3, 0, [3, 1]], ['farm_horseshoe_set', 8.2, 8.33, 0, null, 30],
      ['bigorna', 3.4, 9.9, 0, [1, 1]], ['farm_wooden_bucket', 4.6, 10.2, 0],
      ['barril', 11.6, 9.8, 26, [1, 1]], ['barril', 11.6, 10.9, 26, [1, 1]], ['caixa', 10.4, 11.0, 28, [1, 1]],
    ],
    // Casa A do vilarejo: cozinha à esquerda (fogão, geladeira e mesa), quarto à direita.
    casa_vila_a: [
      ['farmhouse_stove', 1.9, 6.3, 0, [1, 1]], ['farmhouse_fridge', 3.3, 6.5, 0, [1, 1]], ['farmhouse_spice_shelf', 2.6, 4.95, 0, null, 43],
      ['farmhouse_dining_table', 3.0, 9.6, 0, [3, 2]], ['farmhouse_flower_vase', 3.0, 9.62, 0, null, 26],
      ['farmhouse_nightstand', 6.9, 6.4, 0, [1, 1]], ['farmhouse_bed', 8.6, 7.9, 0, [3, 3]], ['farmhouse_potted_plant', 9.7, 10.5, 0, [1, 1]],
    ],
    // Casa B: sala com sofá, mesinha e poltrona à esquerda, estantes à direita, caminha de cachorro.
    casa_vila_b: [
      ['farmhouse_sofa', 3.0, 6.7, 0, [3, 1]], ['farmhouse_coffee_table', 3.0, 8.4, 0, [2, 1]], ['farmhouse_flower_vase', 3.0, 8.42, 0, null, 16],
      ['farmhouse_armchair', 1.6, 9.9, 0, [1, 1], 0, true], ['farmhouse_botanical_frame', 3.0, 4.95, 0, null, 50],
      ['farmhouse_bookshelf', 8.2, 6.0, 0, [1, 1]], ['farmhouse_bookshelf', 9.6, 6.0, 0, [1, 1]], ['farmhouse_theo_bed', 9.0, 10.4, 0, [1, 1]],
      ['farmhouse_potted_plant', 6.9, 6.3, 0, [1, 1]],
    ],
    // Casa C: quarto, com a cama e o criado-mudo à esquerda, cômoda e poltrona à direita.
    casa_vila_c: [
      ['farmhouse_bed', 2.6, 7.9, 0, [3, 3]], ['farmhouse_nightstand', 4.4, 6.4, 0, [1, 1]], ['farmhouse_wall_sconce', 5.6, 4.95, 0, null, 40],
      ['farmhouse_dresser', 8.2, 6.4, 0, [2, 1]], ['farmhouse_armchair', 9.2, 9.0, 0, [1, 1]],
      ['farmhouse_laundry_basket', 9.6, 10.6, 0, [1, 1]], ['farmhouse_potted_plant', 1.7, 10.5, 0, [1, 1]],
    ],
    // Casa da Dona Cora (jardineira): cozinha no fundo, mesa no meio à esquerda, cama à direita, cestos da horta.
    casa_vale: [
      ['farmhouse_stove', 1.9, 6.3, 0, [1, 1]], ['farmhouse_sink_counter', 3.8, 6.3, 0, [2, 1]], ['farmhouse_fridge', 5.6, 6.5, 0, [1, 1]],
      ['farmhouse_spice_shelf', 3.8, 4.95, 0, null, 43], ['farmhouse_bed', 8.7, 7.9, 0, [3, 3]],
      ['farmhouse_dining_table', 3.2, 9.8, 0, [3, 2]],
      ['farm_harvest_basket', 9.4, 11.3, 0], ['farm_seed_sacks', 8.2, 11.4, 0], ['farmhouse_potted_plant', 1.6, 11.2, 0, [1, 1]],
    ],
    // Casa do Seu Tião (pescador): cômoda e cesto no fundo, sala à esquerda, cama à direita, corda e caixote.
    casa_lago: [
      ['farmhouse_dresser', 2.6, 6.3, 0, [2, 1]], ['farmhouse_towel_rack', 4.5, 4.95, 0, null, 30],
      ['farmhouse_armchair', 1.9, 9.0, 0, [1, 1], 0, true], ['farmhouse_coffee_table', 3.6, 9.4, 0, [2, 1]],
      ['farmhouse_bed', 8.6, 7.9, 0, [3, 3]], ['farm_rope_coil', 9.4, 10.5, 0], ['farm_crate', 8.2, 10.6, 0, [1, 1]],
      ['farmhouse_potted_plant', 6.9, 6.3, 0, [1, 1]],
    ],
  };

  // Quem trabalha numa casa fica lá dentro: a Dona Rosa atrás do balcão da loja e o Seu Bento atrás do
  // balcão da ferraria. `balcao`: até onde a Line chega para conversar (na frente do balcão).
  const NPCS = {
    casa_loja: [{ id: 'rosa', x: 7.0, y: 7.95, loja: 'rosa', balcao: 46 }],
    casa_ferraria: [{ id: 'bento', x: 7.5, y: 7.95, loja: 'bento', balcao: 46 }],
  };
  // Lojas fecham à noite: a porta não abre.
  const FECHA_NOITE = { casa_loja: 'Loja da Rosa', casa_ferraria: 'Ferraria' };

  for (const [id, [fora, tx, ty]] of Object.entries(PORTAS)) {
    const g = G[id], def = LB.MAPAS[fora];
    if (!g || !def) continue;
    LB.registrarImagem('base_' + id, 'assets/cenario/base_' + id + '.webp');
    const dentro = { x: g.saida.x + 3, y: 5 + g.fundo - 0.4, dir: 'BACK' };
    LB.MAPAS[id] = {
      nome: g.nome, tema: 'casa', base: 'base_' + id, interior: true, linhas: g.linhas, placas: {},
      saidas: [{ x: g.saida.x, y: g.saida.y, w: g.saida.w, h: 1, para: fora, chegada: { x: tx + 0.5, y: ty + 1.7, dir: 'FRONT' } }],
      inicio: dentro, moveis: MOVEIS[id] || [], npcs: NPCS[id] || [],
    };
    def.entradas = (def.entradas || []).concat({ x: tx, y: ty, para: id, chegada: dentro, fechaNoite: FECHA_NOITE[id] || null, loja: (NPCS[id] || [])[0] && NPCS[id][0].loja });
  }
})(window.LB);
