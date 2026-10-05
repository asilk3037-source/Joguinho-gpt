'use strict';

(function (LB) {
  const TILE = 32;

  // Legenda: T árvore · . grama · , mato alto · F flores · : caminho · r raízes (correr derruba)
  // w riacho (dá para pular) · ~ água funda · R pedra · H casa · D porta · X espinheiro (corta com espada)
  // C baú · S placa · # parede da caverna · _ chão da caverna · L lava · o estalagmite · j fenda
  // g porta trancada (chave antiga) · q cogumelo luminoso (gruta) · Q cristal · Y tocha · U fonte · Z barreira · A altar · I pilar
  // % parede/pedra rachada (bomba) · p poste do gancho · E estação do carrinho · = trilho · l brasa rasa (queima sem armadura de brasa)
  // b barraca da feira · W bigorna da ferraria
  // Parte 2: > < corrente de vento (empurra para o lado) · u lama (deixa lenta) · j nos picos é abismo de céu
  const MAPAS = {
    fazenda: {
      nome: 'Fazendinha',
      tema: 'fazenda',
      // Terreno do item 144 (grama, estradas, canteiros e lago) por baixo; a lama do chiqueiro vai por cima.
      base: 'base_fazenda', sobreBase: 'u',
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
        'TT....HHHDHHH.k...,...::..n...:...n......C..TT',
        'TT::::::::::::::::::::::::::::::::::::::::::::',
        'TT....................::..........F.F......TTT',
        'TT..v....v........,..,::..,...F.,........M..TT',
        'TT.ffffffffff..,.P....::...F.,........,.,...TT',
        'TT.fKKK.....f.cccccccF::..Ffffffffffffffff..TT',
        'TT.fKKK.....f.hhhhhhh.::,.Ff.,,..........f..TT',
        'TT.f..........ccccccc,::...f............,f..TT',
        'TT.f..........hhhhhhh,::...f.,..F........f..TT',
        'TT.f........f.ccccccc.::,..f......F....,.f..TT',
        'TT.f........f.........::....,,.......,...f..TT',
        'TT.ffffffffff.........::T..............,.f..TT',
        'TT....................::...f...........F.fF.TT',
        'TT.......~~~~~~.......::mm.f....,,....,..f..TT',
        'TT.....~~~~~~~~~~~....::.,.f........FF...f..TT',
        'TT,....~~~~~~~~~~~...,.....f..,..........f..TT',
        'TT.T....~~~~~~~~~~.........fffffffffffffff,,TT',
        'TT.......~~~~~~~~~~~~..,.....,..........,...TT',
        'TT...T,.~~~~~~~~~~~~~,,,............,....T,.TT',
        'TT......~~~~~~~~~~~~~~...T...T.F...,,T......TT',
        'TTFF.....~~~~~~~~~~~~............T........F.TT',
        'TT...,.F...~~~~~~~~..........,.......,F...F.TT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
      ],
      saidas: [
        { x: 22, y: 0, w: 2, h: 1, para: 'floresta', chegada: { x: 17.5, y: 27.6, dir: 'BACK' } },
        { x: 45, y: 11, w: 1, h: 1, para: 'vilarejo', requer: 'prologo', chegada: { x: 2.2, y: 20.2, dir: 'RIGHT' } },
      ],
      inicio: { x: 22.5, y: 3.6, dir: 'FRONT' },
      porta: { x: 10.7, y: 11.2 },
      // Objetos da fazenda, poucos e agrupados: cada grupo encosta numa construção ou cerca e as passagens
      // ficam livres (os caminhos de terra, a faixa entre a casa e a horta, a beira do lago, as portas e porteiras).
      // [nome, x, y (base, em tiles), largura (0 = régua de tamanhos), pegada [larg, alt] em tiles, alto, espelhar]
      moveis: [
        // Entrada norte: arco de jardim com a placa de boas-vindas.
        ['farm_garden_arch', 23.0, 3.05, 0], ['farm_welcome_sign', 23.0, 3.07, 0, null, 40],
        // Casa: lenha encostada na parede da esquerda, caixa de correio na beira do caminho; na varanda, cadeira de
        // balanço, galochas e sino; capacho no pé da escada. Colmeia com mel no canto do pomar.
        ['farm_woodpile', 4.5, 9.0, 0, [2, 1]], ['farm_mailbox', 5.3, 11.05, 0, [1, 1]],
        ['farm_rocking_chair', 12.7, 11.02, 0, null, 12], ['farm_rain_boots', 9.3, 11.02, 0, null, 10],
        ['farm_hand_bell', 13.45, 11.0, 0, null, 38], ['farm_doormat', 10.9, 11.6, 0],
        ['farm_beehive_box', 3.6, 6.0, 0, [1, 1]], ['farm_bee_smoker', 4.5, 6.15, 0], ['farm_honey_jar', 2.7, 6.2, 0],
        // Jardim da frente (o terreiro de terra à direita da casa): bancada de mudas, duas floreiras e o banho de passarinho.
        ['farm_potting_bench', 14.6, 7.5, 0, [1, 1]], ['farm_seedling_tray', 14.45, 7.52, 0, null, 30],
        ['farm_garden_gloves', 15.05, 7.53, 0, null, 30], ['farm_pruning_shears', 14.0, 7.54, 0, null, 30],
        ['farm_planter_box', 16.3, 7.3, 0, [1, 1]], ['farm_planter_box', 16.3, 9.2, 0, [1, 1], 0, true],
        ['farm_birdbath', 17.0, 8.6, 0, [1, 1]], ['farm_birdhouse', 19.6, 6.4, 0, [1, 1]],
        // Varal com o cesto de prendedores.
        ['farm_clothespin_basket', 6.9, 13.95, 0],
        // Galinheiro (dentro da cerca): ninho, cesto de ovos, comedouro e bebedouro.
        ['farm_chicken_nest', 10.6, 15.9, 0, [1, 1]], ['farm_egg_basket', 9.3, 16.3, 0],
        ['farm_chicken_feeder', 6.4, 20.6, 0, [1, 1]], ['farm_chicken_waterer', 8.0, 20.7, 0, [1, 1]],
        // Horta: o poço e o regador (desenhado à parte, some quando a Line pega) ficam sozinhos na faixa de cima;
        // o espantalho fica dentro da horta, entre os canteiros; a colheita (carrinho, cesto e abóboras) embaixo.
        ['farm_scarecrow', 17.2, 18.25, 0],
        ['farm_wheelbarrow', 15.0, 21.2, 0, [1, 1]], ['farm_harvest_basket', 17.4, 20.9, 0], ['farm_pumpkin_cluster', 19.7, 21.2, 0],
        // Celeiro: silo e barril de chuva encostados na parede da esquerda; roda de carroça, ferraduras e latão de leite
        // na da direita; ferradura e cabresto na parede e cata-vento no telhado.
        ['farm_grain_bin', 25.6, 8.9, 0, [1, 1]], ['farm_grain_scoop', 26.4, 9.4, 0], ['farm_rain_barrel', 26.4, 10.1, 0, [1, 1]],
        ['farm_wagon_wheel', 33.9, 10.05, 0], ['farm_horseshoe_set', 33.1, 10.6, 0], ['farm_milk_can', 34.9, 10.7, 0],
        ['farm_horseshoe_sign', 31.7, 10.02, 0, null, 44], ['farm_bridle', 30.4, 10.02, 0, null, 30], ['farm_weather_vane', 29.0, 10.03, 0, null, 140],
        // Pasto: tudo encostado na cerca de cima (o campo fica livre para os bichos): cavalete com sela e escova,
        // cocho de feno, bebedouro, cocho de ração com balde, banquinho e balde de ordenha; tosquia e sal no canto de baixo.
        ['farm_saddle_stand', 29.0, 17.4, 0, [1, 1]], ['farm_saddle', 29.0, 17.42, 0, null, 26], ['farm_horse_brush', 29.9, 17.6, 0],
        ['farm_hay_rack', 31.8, 17.3, 0, [2, 1]], ['farm_water_trough', 34.6, 17.3, 0, [2, 1]],
        ['farm_feed_trough', 37.6, 17.3, 0, [2, 1]], ['farm_animal_feed_bucket', 39.2, 17.5, 0],
        ['farm_milking_stool', 40.1, 18.6, 0], ['farm_milking_pail', 40.4, 19.3, 0],
        ['farm_wool_basket', 29.2, 24.6, 0], ['farm_shearing_scissors', 30.0, 24.8, 0], ['farm_salt_lick', 39.6, 24.6, 0, [1, 1]],
        // Piquenique: cesto de maçãs debaixo da macieira.
        ['farm_apple_basket', 25.7, 20.3, 0],
        // Lago: banco (visto de frente) virado para a fogueira (acesa à noite), no gramado da esquerda;
        // taboas na margem, vitórias-régias na água, corda e caixote na ponta do píer; cogumelos debaixo das árvores.
        ['farm_garden_bench', 4.9, 24.4, 0, [2, 1]], ['farm_campfire', 4.9, 26.0, 0, [1, 1]],
        ['farm_reeds', 7.4, 24.4, 0], ['farm_reeds', 20.9, 27.0, 0, null, 0, true], ['farm_reeds', 10.2, 30.7, 0],
        ['farm_lily_pads', 11.8, 26.6, 0], ['farm_lily_pads', 16.8, 29.4, 0, null, 0, true],
        ['farm_rope_coil', 20.3, 28.75, 0], ['farm_crate', 22.1, 29.15, 0],
        ['farm_mushroom_cluster', 4.4, 30.4, 0], ['farm_mushroom_cluster', 31.6, 29.6, 0, null, 0, true],
      ],
      placas: {},
      pontos: {
        tigela: { x: 15.7, y: 10.85 },
        racao: { x: 30.5, y: 10.4 },
        regador: { x: 18.6, y: 14.7 },
        mesa: { x: 25, y: 23.9 },
        lago: { x: 22.3, y: 27.6 },
      },
      canteiros: ['15,15', '18,17', '14,19', '20,19'],
      // Porteira do pasto (item 147), no meio da cerca de baixo.
      porteiras: [{ x: 33, y: 26, w: 3 }],
      // Porta da casa: entra na casa por dentro (item 145).
      entradas: [{ x: 9, y: 10, para: 'casa_fazenda', chegada: { x: 15.5, y: 18.6, dir: 'BACK' } }],
      baus: { '41,10': { moedas: 20, depoisDe: 'prologo' } },
      chao: [{ x: 5, y: 12, moedas: 5, requer: 'prologo' }],
      exames: [{ id: 'pegadas', x: 22, y: 26, texto: 'Examinar as marcas', doc: 'pegadas', requer: 'prologo' }],
      // Objetos soltos do pacote de arte: [nome, x, y (base, em tiles), largura, raio de colisão].
      decoracoes: [
        ['carroca', 35.5, 12.9, 70, 16], ['placa2', 21.3, 3.9, 30, 6],
        ['arbusto_c', 2.6, 13.9, 26, 8], ['arbusto_d', 26.5, 30.9, 28, 8],
        ['girassol_0', 5.5, 10.9, 16, 0], ['girassol_1', 13.2, 10.9, 16, 0], ['girassol_2', 32.5, 13.9, 16, 0],
        ['milho_1', 24.5, 17.9, 15, 0], ['trigo_1', 24.5, 19.9, 15, 0], ['pedra1', 8.5, 31.9, 24, 8], ['moita', 41.5, 31.9, 26, 0],
        ['pier', 19.6, 28.9, 120, 0], ['barco', 14.6, 29.6, 38, 0],
      ],
      areas: {
        galinhas: { x0: 4, y0: 17, x1: 11, y1: 20 },
        pasto: { x0: 28, y0: 16, x1: 40, y1: 25 },
        chiqueiro: { x0: 37, y0: 5, x1: 41, y1: 8 },
        lago: { x0: 9, y0: 24, x1: 19, y1: 30 },
      },
    },

    // Casa da fazenda por dentro (item 145, planta de 32×24 tiles) com os móveis dos itens 148 a 152.
    casa_fazenda: {
      nome: 'Casa da fazenda',
      tema: 'casa',
      base: 'base_casa_fazenda',
      interior: true,
      linhas: [
        '################################',
        '################################',
        '################################',
        '################################',
        '################################',
        '##________#__________#________##',
        '##________#__________#________##',
        '##___________________#________##',
        '##____________________________##',
        '##______________________########',
        '##________#__________###______##',
        '##________#__________###______##',
        '##________#__________###______##',
        '##________#___________________##',
        '##############____######______##',
        '##############____##############',
        '##############____##############',
        '##############____##############',
        '###########__________###########',
        '###############__###############',
        '###############__###############',
        '##############____##############',
        '#############______#############',
        '#############______#############',
      ],
      saidas: [
        { x: 13, y: 23, w: 6, h: 1, para: 'fazenda', chegada: { x: 9.5, y: 11.7, dir: 'FRONT' } },
      ],
      inicio: { x: 15.5, y: 18.6, dir: 'BACK' },
      placas: {},
      // [nome, x, y (base, em tiles), largura no mundo, pegada [larg, alt] em tiles, altura na parede]
      moveis: [
        // Cozinha (piso de terracota)
        ['farmhouse_fridge', 2.9, 6.5, 51, [1, 1]], ['farmhouse_stove', 4.7, 6.3, 57, [2, 1]], ['farmhouse_sink_counter', 7.5, 6.3, 92, [3, 1]],
        ['farmhouse_towel_rack', 9.3, 4.95, 30, null, 18], ['farmhouse_dining_table', 5.8, 12.7, 110, [3, 2]],
        ['farmhouse_kitchen_island', 5.6, 8.7, 88, [3, 1]], ['farmhouse_bar_stool', 4.8, 9.6, 18], ['farmhouse_bar_stool', 6.4, 9.6, 18],
        ['farmhouse_pantry_cabinet', 9.3, 10.9, 34, [1, 1]], ['farmhouse_spice_shelf', 7.5, 4.95, 44, null, 43],
        ['farmhouse_wall_clock', 2.9, 4.95, 22, null, 59], ['farmhouse_botanical_frame', 4.7, 4.95, 18, null, 46],
        ['farmhouse_flower_vase', 5.8, 12.72, 16, null, 26],
        // Sala. Sofá, estante e lareira vistos de frente: encostados na parede do fundo, virados para a sala.
        // A poltrona sem espelhar olha para a esquerda: a da esquerda é espelhada para as duas ficarem de frente
        // uma para a outra, diante da lareira. A mesinha fica na frente do sofá.
        ['farmhouse_sofa', 12.6, 6.5, 0, [3, 1]], ['farmhouse_fireplace', 16.0, 5.9, 0, [3, 1]], ['farmhouse_bookshelf', 19.9, 6.0, 0, [1, 1]],
        ['farmhouse_coffee_table', 12.6, 8.4, 0, [2, 1]],
        ['farmhouse_armchair', 14.7, 8.7, 0, [1, 1], 0, true], ['farmhouse_armchair', 18.6, 8.7, 0, [1, 1]],
        ['farmhouse_potted_plant', 11.6, 13.2, 0, [1, 1]], ['farmhouse_potted_plant', 18.3, 13.2, 0, [1, 1], 0, true],
        // Corredor da entrada: sapateira e a caminha do Theo.
        ['farm_boot_rack', 13.6, 18.9, 0], ['farmhouse_theo_bed', 19.6, 18.95, 0, [1, 1]],
        // Quarto (o espelho fica na parede do fundo)
        ['farmhouse_bathroom_mirror', 22.7, 4.95, 24, null, 22], ['farmhouse_nightstand', 23.0, 6.5, 34, [1, 1]], ['farmhouse_bed', 25.4, 8.5, 115, [3, 3]],
        ['farmhouse_nightstand', 27.8, 6.5, 34, [1, 1]], ['farmhouse_wardrobe', 29.2, 6.4, 53, [1, 1]],
        // Banheiro (azulejo verde-água). A porta é a abertura na parede da esquerda (linha 13), pelo corredor que sai da sala.
        ['farmhouse_toilet', 25.0, 11.6, 35, [1, 1]], ['farmhouse_bathroom_vanity', 26.8, 11.5, 48, [1, 1]], ['farmhouse_shower', 28.9, 11.8, 46, [1, 1]],
        ['farmhouse_laundry_basket', 29.0, 14.9, 32, [1, 1]],
      ],
    },

    floresta: {
      nome: 'Floresta Sussurrante',
      tema: 'floresta',
      linhas: [
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT::TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
        'TTTT....,,......TTTTT.........::..TTTTTTTTTTTTTTTTTTTTTTTTT...............TT',
        'TT........,,,.........TT......::..TTTTTTTTTTTTTTTTTTTTTTTT..T..............T',
        'T..........F..........TT......::...TTTTTTTTTTTTTTTTTTTTTTT...T...HHHHHH....T',
        'T....TT.....R.............,,..::...TTTTTTTTTTTTTTTTTTTTTTT.......HHHHHH....T',
        'T....TT..........::::::::::::::..TTTTTTTTTTTTTTTTTTTTTTTTT.......HHHDHH....T',
        'TT....,,.........::..........,,...TTTTTTTTTTTTTTTTTTTT..................TTTT',
        'TTTTTTTTTTTTT....::....TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT...........F........TTT',
        'TTTTTTTTTTTTTTXXXXXXXXTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT.....T............T...TT',
        'TTTTTTTTTTTTTT...::...TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT..T...........T.......TT',
        'TTTTT.....TTTT...::...TTTT......TTTTTTTT.....TTTTTTT....F......,....R.....TT',
        'TT...F...........::...............TTTT....,....TTTTT...,....T........,....TT',
        'TT.C:............::....,,................R......T.....S..........F........TT',
        'TT..:......F.....::.......................F..C...:::...:::::::::::::::::::::',
        'T...:....,,......::....R.................,.......:::...:::::::::::::::::::::',
        'T...:TTTT........::........TTTT.......R........,T........R.............::.TT',
        'T...:::::::::::::::........TTTT....TTT.........TTTTT.T........p........::.TT',
        'T.C..TTTT........::........TTTT....TTTT.......TTTTTT...................::.TT',
        'T.....,,.........::.........,,.....TTTTTTTTTTTTTTTTT....~~~~~~~~~~~~~..::.TT',
        'T~~~wwwwwwwwwwwwwwwwwwwwwwwwwwww~~~TTTTTTTTTTTTTTTTT...~~~~~~~~~~~~~~~F::.TT',
        'T..............S.::................TTTTTTTTTTTTTTTTT...~~~~~~~~~~~~~~~.::.TT',
        'T................::.........F......TTTTTTTTTTTTTTTTT...~~~~...p...~~~~.::.TT',
        'T....R.......rrrr::rrrr.......TT...TTTTTTTTTTTTTTTTT.T.~~~~.......~~~~.::.TT',
        'T............rrrrrrrrrr.......TT...TTTTTTTTTTTTTTTTT...~~~~...C...~~~~.::.TT',
        'T..F.........rrrr::rrrr............TTTTTTTTTTTTTTTTT...~~~~.......~~~~.::.TT',
        'T................::................TTTTTTTTTTTTTTTTT...~~~~.......~~~~.::.TT',
        'T....TT........S.::.......TT...F...TTTTTTTTTTTTTTTTT.T.~~~~~~~~~~~~~~~.::.TT',
        'T....TT..........::.......TT.......TTTTTTTTTTTTTTTTT.....~~~~~~~~~~~...::.TT',
        'TT...,,..........::..........,,...TTTTTTTTTTTTTTTTTT...................::.TT',
        'TTTTTTTTTTTTTTTTT::TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT.....,.............::.TT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT......T........T..R::.TT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT..T...F......,.....::.TT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT.................T.::.TT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT........,.....F....::.TT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT....T.....:::::::::::.TT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT.........:::::::::::.TT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT........::.........TTT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT.::.TTTTTT%TTTT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT.::.TTT......TT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT.::.TTT....C.TT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT.::.TTT......TT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT.::.TTTTTTTTTTT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT.::.TTTTTTTTTTT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT.::.TTTTTTTTTTT',
      ],
      saidas: [
        { x: 17, y: 29, w: 2, h: 1, para: 'fazenda', chegada: { x: 22.5, y: 3.6, dir: 'FRONT' } },
        { x: 30, y: 0, w: 2, h: 1, para: 'ruinas', requer: 'espada', chegada: { x: 19.5, y: 34.2, dir: 'BACK' } },
        { x: 75, y: 13, w: 1, h: 2, para: 'gruta', chegada: { x: 1.6, y: 14.4, dir: 'RIGHT' } },
        { x: 62, y: 43, w: 2, h: 1, para: 'vilarejo', chegada: { x: 30, y: 2.4, dir: 'FRONT' } },
      ],
      // Cabana do caçador: lenha, suporte de ferramentas e balde.
      moveis: [['farm_woodpile', 63.4, 5.9, 0, [2, 1]], ['farm_tool_rack', 71.6, 5.9, 0, [1, 1]], ['farm_wooden_bucket', 72.6, 6.0, 0]],
      inicio: { x: 17.5, y: 27.6, dir: 'BACK' },
      placas: {
        '15,26': 'Cuidado com as raízes! Correndo por cima delas você pode tropeçar. Ande devagar (solte o correr).',
        '15,20': 'Riacho à frente. Para atravessar, pule! (Espaço ou botão Pular). Correndo, o pulo vai mais longe.',
        '54,12': 'Leste: Gruta dos Ecos. Sul: Vilarejo do Riacho, onde dá para comprar poções, bombas e armaduras.',
      },
      baus: { '3,12': 'espada', '2,17': { pistas: ['carta'], moedas: 10 }, '45,13': { moedas: 25 }, '62,23': { itens: [['pocao', 1]], moedas: 30 }, '72,39': { itens: [['bomba', 2]], moedas: 45 } },
      chao: [{ x: 5, y: 3, moedas: 8 }, { x: 57, y: 33, moedas: 6 }],
      exames: [{ id: 'cacador', x: 68, y: 6, texto: 'Ler o bilhete na porta', doc: 'cacador' }],
      inimigos: [
        { x: 8, y: 3, depoisDe: 'espada' }, { x: 25, y: 3, depoisDe: 'espada' }, { x: 20, y: 6, depoisDe: 'espada' },
        { x: 9, y: 13, depoisDe: 'espada' }, { x: 26, y: 12, depoisDe: 'espada' }, { x: 41, y: 14, depoisDe: 'espada' },
        { x: 58, y: 9, depoisDe: 'espada' }, { x: 66, y: 31, depoisDe: 'espada' }, { x: 56, y: 33, depoisDe: 'espada' }, { x: 69, y: 24, depoisDe: 'espada' },
      ],
    },

    vilarejo: {
      nome: 'Vilarejo do Riacho',
      tema: 'vilarejo',
      linhas: [
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTT::TTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTT::TTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
        'TT...........................::...........................TT',
        'TT......T....................::...........................TT',
        'TT..T.................T......::.....T...............T.....TT',
        'TT...........................::...........................TT',
        'TT...........................::..,........................TT',
        'TT.........HHHHHHH.......T...::.........HHHHHHH...,.......TT',
        'TT.....,...HHHHHHH...........::.........HHHHHHH........T..TT',
        'TT.........HHHHDHH...T.......::......T..HHHHDHH...........TT',
        'TT.............:.............::...P.........:...W.........TT',
        'TT..........b..:..b..........::.............:.............TT',
        'TT....T........:...F.........::.........F...:..F..........TT',
        'TT.........F...:::::::::S:::::::::::::::::::::::::::::::::::',
        'TT....................:::::::::::::::::...............T.::::',
        'TT.......T............:::::::::::::::::...................TT',
        'TT...................F:::::::::::::::::F.....,............TT',
        'TT..S.................:::::::::::::::::...................TT',
        'TT........R...........:::::::::::::::::...................TT',
        '::::::::::::::::::::::::::::::U:::::::::::::::::::::......TT',
        '::::::::::::::::::::::::::::::::::::::::::::::::::::E=======',
        'TT....................:::::::::::::::::...................TT',
        'TT...F.........,......:::::::::::::::::...................TT',
        'TT........T..........F:::::::::::::::::F..................TT',
        'TT.T..................:::::::::::::::::..........R........TT',
        'TT..........F.........:::::::::::::::::.........T.........TT',
        'TT........................::..................F...........TT',
        'TT........................::..F.......................T...TT',
        'TT...HHHHHH....HHHHHH.....::...........HHHHHH.............TT',
        'TT...HHHHHH....HHHHHH...,.::.......T...HHHHHH.............TT',
        'TT...HHHDHH....HHHDHH.....::...........HHHDHH........,....TT',
        'TT......:.........:.......::..............:...............TT',
        'TT......:::::::::::::::::::::::::::::::::::...............TT',
        'TT........................................................TT',
        'TTwwwwwwwwwwwwwwwwwwwwwwww::wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwTT',
        'TT....,.....................................F.............TT',
        'TT...........T......F............F......T.........C.....T.TT',
        'TT..................................,.....................TT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
      ],
      saidas: [
        { x: 0, y: 19, w: 1, h: 2, para: 'fazenda', chegada: { x: 43.4, y: 11.8, dir: 'LEFT' } },
        { x: 29, y: 0, w: 2, h: 1, para: 'floresta', chegada: { x: 62.9, y: 41.6, dir: 'BACK' } },
        { x: 59, y: 13, w: 1, h: 2, para: 'vale', requer: 'parte2', chegada: { x: 2.5, y: 21.2, dir: 'RIGHT' } },
      ],
      inicio: { x: 2.2, y: 20.2, dir: 'RIGHT' },
      placas: {
        '4,17': 'Vilarejo do Riacho. Ao norte, a Loja da Dona Rosa. A nordeste, a Ferraria do Seu Bento. A leste, a Estação do Carrinho. A fonte da praça cura e guarda o caminho de volta.',
        '24,13': 'Quadro de avisos do vilarejo. Tem um cartaz novo pregado...',
      },
      baus: { '50,36': { itens: [['bomba', 2]], moedas: 30 } },
      exames: [{ id: 'cartaz', x: 25, y: 14, texto: 'Ler o cartaz', doc: 'cartaz' }],
      estacao: { x: 52, y: 20, id: 'vilarejo', nome: 'Estação do Vilarejo' },
      letreiros: { '15,9': 'Loja da Rosa', '44,9': 'Ferraria' },
      npcs: [
        { id: 'ze', x: 34.5, y: 21.8 },
        { id: 'lurdes', x: 12.5, y: 32.9 },
        { id: 'pedro', x: 47.5, y: 21.8 },
      ],
      decoracoes: [['carroca', 7.5, 24.9, 70, 16], ['feno_pilha', 51.5, 11.9, 40, 12], ['arbusto_b', 38.5, 27.9, 24, 8]],
      // Objetos do vilarejo (régua de tamanhos), por zona: praça, feira da loja, ferraria, casas e beira do riacho.
      moveis: [
        // Praça: postes nas quatro esquinas, bancos virados para a fonte e floreiras dos lados.
        ['farm_lantern_post', 21.5, 14.95, 0, [1, 1]], ['farm_lantern_post', 39.5, 14.95, 0, [1, 1], 0, true],
        ['farm_lantern_post', 21.5, 24.95, 0, [1, 1]], ['farm_lantern_post', 39.5, 24.95, 0, [1, 1], 0, true],
        ['farm_garden_bench', 26.5, 16.6, 0, [2, 1, 1]], ['farm_garden_bench', 34.5, 16.6, 0, [2, 1, 1]],
        ['farm_planter_box', 26.5, 23.4, 0, [1, 1, 1]], ['farm_planter_box', 34.5, 23.4, 0, [1, 1, 1]],
        // Feira na frente da loja da Dona Rosa: frutas, abóboras e caixotes junto das barracas.
        ['farm_apple_basket', 10.6, 12.0, 0], ['farm_pumpkin_cluster', 9.0, 12.3, 0], ['farm_crate', 19.6, 12.0, 0, [1, 1]],
        ['farm_harvest_basket', 20.6, 12.2, 0], ['farm_flower_cart', 9.2, 9.7, 0, [1, 1]],
        // Ferraria do Seu Bento: lenha, barril de chuva, ferradura na parede e balde junto da bigorna.
        ['farm_woodpile', 38.6, 9.7, 0, [2, 1]], ['farm_rain_barrel', 47.6, 8.9, 0, [1, 1]],
        ['farm_horseshoe_sign', 42.0, 9.97, 0, null, 52], ['farm_wooden_bucket', 49.2, 10.6, 0],
        // Casas: caixa de correio na beira do caminho e capacho em cada porta.
        ['farm_mailbox', 10.6, 31.95, 0, [1, 1]], ['farm_doormat', 8.5, 31.55, 0],
        ['farm_mailbox', 20.6, 31.95, 0, [1, 1]], ['farm_doormat', 18.5, 31.55, 0],
        ['farm_mailbox', 44.6, 31.95, 0, [1, 1]], ['farm_doormat', 42.5, 31.55, 0],
        ['farm_doormat', 15.5, 10.55, 0], ['farm_doormat', 44.5, 10.55, 0],
        // Beira do riacho: taboas.
        ['farm_reeds', 12.0, 33.9, 0], ['farm_reeds', 37.0, 33.9, 0, null, 0, true], ['farm_reeds', 52.0, 33.9, 0],
      ],
      inimigos: [],
    },

    // Gruta dos Ecos: caverna a leste da floresta. Cogumelos ('q') brilham, a porta ('g') precisa de chave.
    gruta: {
      nome: 'Gruta dos Ecos',
      tema: 'gruta',
      linhas: [
        '#######################################################___######',
        '##########______######_______#########____________________######',
        '########__________####____C____#####_______________________#####',
        '#######_____o_______##________________C___________o_____q__#####',
        '######_______________________o_____________________________#####',
        '######___q_____________________________________________________#',
        '#######_______~~~~~______________###________E===================',
        '#######______~~~~~~~____o________###___o_______________________#',
        '######_______~~~~~~~_____________###_____S___________o_____#####',
        '#####_________~~~~~____q_____########_____________________######',
        '####_C_________________________#########___#####################',
        '###_____o____________#########__########___#####################',
        '##_____________U_____#________C_########___#####################',
        ':______S______________________#_########___#####################',
        ':_____________________________#_########___#####################',
        '##________q____________#______#_########___#####################',
        '###___________________#####____########______________________###',
        '####____~~~~~___________________#####_________________________##',
        '#####___~~~~~~______o___________#####___________o_____________##',
        '######___~~~~______________q____#####_____o___________________##',
        '#######________________________######__________________oC_____##',
        '########______________________#######_______q_________________##',
        '##############g######################__q__________o___________##',
        '##########_________##################_________________________##',
        '##########___C_____##################________o___________q___%__',
        '##########______q__##################________________________%__',
        '##########_________##################_______________o_________##',
        '#####################################___o_________________o___##',
        '#####################################_________==============__##',
        '#####################################_________________________##',
        '######################################______________________####',
        '##########################################__p__#################',
        '##########################################jjjjj#################',
        '##########################################jjjjj#################',
        '##########################################jjjjj#################',
        '##########################################jjjjj#################',
        '##########################################jjjjj#################',
        '##########################################__p__#################',
        '######################################_____________#############',
        '######################################___________q_#############',
        '######################################__o__________#############',
        '######################################______C______#############',
        '######################################_____________#############',
        '################################################################',
      ],
      saidas: [
        { x: 0, y: 13, w: 1, h: 2, para: 'floresta', chegada: { x: 74.2, y: 14.4, dir: 'LEFT' } },
        { x: 55, y: 0, w: 3, h: 1, para: 'ruinas', chegada: { x: 60.9, y: 34.4, dir: 'BACK' } },
        { x: 63, y: 24, w: 1, h: 2, para: 'montanha', chegada: { x: 69.4, y: 35.3, dir: 'LEFT' } },
      ],
      inicio: { x: 1.6, y: 14.4, dir: 'RIGHT' },
      placas: {
        '7,13': 'Gruta dos Ecos. Fale baixo: os cogumelos acordam com barulho. A sala ao sul está trancada há cem anos.',
        '41,8': 'Minas de Cristal. A linha do carrinho liga o Vilarejo, as Minas e a Forja da Montanha. Lá embaixo é escuro: não desça sem luz!',
      },
      baus: {
        '26,2': { itens: [['bussola', 1]] }, '5,10': { itens: [['elixir', 1]] }, '30,12': { itens: [['chave', 1]] }, '13,24': 'coracao',
        '38,3': { itens: [['lanterna', 1]] }, '56,20': { itens: [['bomba', 3]] }, '44,41': { itens: [['pena', 1]], moedas: 40 },
      },
      chao: [{ x: 17, y: 13, doc: 'lenda' }, { x: 15, y: 25, doc: 'mapa' }, { x: 48, y: 3, doc: 'minerador' }, { x: 24, y: 4, moedas: 6 }, { x: 52, y: 29, moedas: 12 }],
      estacao: { x: 44, y: 6, id: 'minas', nome: 'Estação das Minas' },
      // Galerias escuras: sem lanterna a Line quase não enxerga.
      escuro: [[36, 10, 63, 43]],
      inimigos: [
        { x: 20, y: 5, depoisDe: 'espada' }, { x: 28, y: 16, depoisDe: 'espada' }, { x: 12, y: 20, depoisDe: 'espada' },
        { x: 24, y: 8, tipo: 'luz', depoisDe: 'magia' }, { x: 24, y: 19, tipo: 'luz', depoisDe: 'magia' },
        { x: 45, y: 20, tipo: 'morcego', depoisDe: 'espada' }, { x: 55, y: 24, tipo: 'morcego', depoisDe: 'espada' }, { x: 41, y: 27, tipo: 'morcego', depoisDe: 'espada' }, { x: 58, y: 18, tipo: 'morcego', depoisDe: 'espada' },
        { x: 50, y: 24, depoisDe: 'espada' }, { x: 44, y: 40, tipo: 'morcego', depoisDe: 'espada' }, { x: 52, y: 4, depoisDe: 'espada' },
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
        '###################..#################################################',
        '###################ZZ#################################################',
        '####................................##################..............##',
        '####.,........I..........I........,.#################............F...#',
        '####....I......................I....#################..I......C......#',
        '####................................#################....F...........#',
        '####................................#################.............I..#',
        '####................................#################................#',
        '####................................#################.......p........#',
        '####....I......................I....#################jjjjjjjjjjjjjjjj#',
        '####.,......,..............,......,.#################jjjjjjjjjjjjjjjj#',
        '####................................#################jjjjjjjjjjjjjjjj#',
        '##################::::###############################jjjjjjjjjjjjjjjj#',
        '##################ZZZZ###############################.......p........#',
        '###..F.........................F..###################................#',
        '###.,...........................,.#######I....I....##..I..........I..#',
        '###...~~~~~~~......Q....~~~~~~~.Q.......g......C...##..........U.....#',
        '###...~~~~~~~..I.......I~~~~~~~...#######...S......##....C...........#',
        '###..U~~~Q~~~...........~~~Q~~~...###################...........F....#',
        '###...~~~~~~~...........~~~~~~~...Z.C################.....F..........#',
        '###...~~~~~~~...........~~~~~~~...Z..#################..............##',
        '###.,..........I.......I........,.##############################..####',
        '###..........,.......,............##############################..####',
        '##################::::##########################################..####',
        '##################ZZZZ################################..............##',
        '########...........::...........#.........I......I.##................#',
        '##.......,.........::.........,.#..................##...I........I...#',
        '##..A.......Q......::......Q....#..............C...##................#',
        '##........F........::........F.......................................#',
        '##.................::.........................,......................#',
        '##.,..F....I.......::.......I......................##...I........I...#',
        '##.................::...........#.........I......I.##.....Q..........#',
        '########...........::..U........#............F.....###...............#',
        '########.,.......S.::.........,.#..................#########ZZ########',
        '########......,....::....,......############################..########',
        '###################::#######################################..########',
      ],
      saidas: [
        { x: 19, y: 35, w: 2, h: 1, para: 'floresta', chegada: { x: 30.5, y: 1.8, dir: 'FRONT' } },
        { x: 19, y: 0, w: 2, h: 1, para: 'montanha', chegada: { x: 17.5, y: 37.4, dir: 'BACK' } },
        { x: 60, y: 35, w: 2, h: 1, para: 'gruta', chegada: { x: 56, y: 1.7, dir: 'FRONT' } },
      ],
      inicio: { x: 19.5, y: 34.2, dir: 'BACK' },
      placas: {
        '17,33': 'Ruínas Encantadas. Só a luz atravessa as barreiras. O altar da luz fica na sala a oeste.',
        '44,17': 'Biblioteca das Ruínas. Os livros viraram pó, mas o diário do Guardião resistiu ao tempo.',
      },
      baus: {
        '36,19': 'coracao', '47,27': { itens: [['chave', 1]], moedas: 20 }, '47,16': { pistas: ['diario2'], itens: [['elixir', 1]] },
        '57,17': { itens: [['gancho', 1]] }, '62,4': { itens: [['elixir', 1]], moedas: 60 },
      },
      chao: [{ x: 6, y: 28, doc: 'diario1' }, { x: 29, y: 32, moedas: 8 }],
      barreiras: [
        { id: 'sul', fontes: ['12,27', '27,27'], tiles: [[18, 24, 21, 24]] },
        { id: 'meio', fontes: ['9,18', '27,18', '19,16'], tiles: [[18, 13, 21, 13]] },
        { id: 'bau', fontes: ['32,16'], tiles: [[34, 19, 34, 20]] },
        { id: 'golem', fontes: [], tiles: [[19, 1, 20, 1]] },
        { id: 'gruta', fontes: ['58,31'], tiles: [[60, 33, 61, 33]] },
      ],
      golem: { x: 19.5, y: 7.2 },
      inimigos: [
        { x: 14, y: 31, depoisDe: 'magia' }, { x: 25, y: 31, depoisDe: 'magia' },
        { x: 10, y: 15, tipo: 'luz', depoisDe: 'magia' }, { x: 28, y: 21, tipo: 'luz', depoisDe: 'magia' },
        { x: 20, y: 20, depoisDe: 'magia' }, { x: 14, y: 15, depoisDe: 'magia' }, { x: 30, y: 15, tipo: 'luz', depoisDe: 'magia' },
        { x: 38, y: 27, depoisDe: 'magia' }, { x: 45, y: 31, depoisDe: 'magia' }, { x: 44, y: 16, tipo: 'luz', depoisDe: 'magia' },
        { x: 61, y: 27, depoisDe: 'magia' }, { x: 66, y: 29, tipo: 'luz', depoisDe: 'magia' }, { x: 58, y: 15, depoisDe: 'magia' }, { x: 66, y: 18, tipo: 'luz', depoisDe: 'magia' },
      ],
    },

    montanha: {
      nome: 'Montanha de Brasa',
      tema: 'montanha',
      linhas: [
        '################::::####################################################',
        '################::::####################################################',
        '###############......###############################..................##',
        '###############......#############################.......#########.....#',
        '###############ZZZZZZ#############################.......#.......#.....#',
        '##.........###........###.........################.......#...C...#.....#',
        '##............R...................################....U..#.......#.....#',
        '##jjjjjjjj..................R.....################.......#lllllll#.....#',
        '##.......j........................################......lllllllllll....#',
        '##...C...j........Y...............################......lllllllllll..o.#',
        '##.......j...............R........################......lllllllllll....#',
        '##.......j..R.................o...################..R...lllllllllll....#',
        '##.......j............o...........################......lllllllllll....#',
        '##jjjjjjjj........................################...........W.........#',
        '##jjjjjjjjjjjjj......jjjjjjjjjjjjj################.....................#',
        '##................................#####......#####...o..............C..#',
        '##......................................j.......................R......#',
        '##......................................j..R......................o....#',
        '##................................####..j...C.####..S..................#',
        '##.........................LLLLLLL####..j.....####.....................#',
        '##.........LLLL.R..........LLLLLLL####..j.....#####...................##',
        '##.........LLLL............LL...LL####..j.....############..############',
        '##.........................LL.Y.LL####..j.....############..############',
        '##....................R....LL...LL#######g##########...................#',
        '##LLLLLLL...o..............LLLLLLL####........######...................#',
        '##LLLLLLL..................LLLLLLL####.LL.....######........E===========',
        '##LLLLLLLU........................####.LL..C..######...................#',
        '##LLLLLLL.........R...............####......o.######...o...............#',
        '##LLLLLLL.S.............o.........####........######..............R....#',
        '##LLLLLLL.........................##################...................#',
        '##................................#####################..###############',
        '######........................#########################..###############',
        '##jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj###################..................#',
        '##....................R...........################........jjjjjjj......#',
        '##........R....................R..################......................',
        '##....Y........S............o.....################...o..................',
        '##.R.....................R........################...........o.....o...#',
        '##..........o.....................#################....................#',
        '################::::####################################################',
        '################::::####################################################',
      ],
      saidas: [
        { x: 16, y: 39, w: 4, h: 1, para: 'ruinas', chegada: { x: 19.5, y: 2.4, dir: 'FRONT' } },
        { x: 16, y: 0, w: 4, h: 1, para: 'covil', chegada: { x: 13, y: 18.5, dir: 'BACK' } },
        { x: 71, y: 34, w: 1, h: 2, para: 'gruta', chegada: { x: 62.4, y: 25.3, dir: 'LEFT' } },
      ],
      inicio: { x: 17.5, y: 37.4, dir: 'BACK' },
      placas: {
        '15,35': 'Fendas na rocha! Pule para atravessar (Espaço). Correndo, o pulo vai mais longe.',
        '10,28': 'Fonte das brasas: beba para recuperar vida e magia. Se cair, você volta para cá.',
        '52,18': 'Forja Antiga. O chão em brasa queima quem não veste a Armadura de Brasa. A estação do carrinho fica ao sul.',
      },
      baus: {
        '5,9': 'coracao', '44,18': { itens: [['chave', 1]], moedas: 20 }, '43,26': { itens: [['pocao', 1]], moedas: 30 },
        '68,15': { itens: [['alavanca', 1]] }, '61,5': { itens: [['elixir', 1]], moedas: 90 },
      },
      chao: [{ x: 22, y: 6, doc: 'fita' }, { x: 40, y: 27, doc: 'escama' }, { x: 64, y: 14, doc: 'receita' }, { x: 30, y: 30, moedas: 10 }],
      estacao: { x: 60, y: 25, id: 'forja', nome: 'Estação da Forja' },
      // O caçador Tobias, com o pé torcido, perto da fonte das brasas.
      npcs: [{ id: 'tobias', x: 11.5, y: 26.9 }],
      barreiras: [
        { id: 'portao', fontes: ['6,35', '30,22', '18,9'], tiles: [[15, 4, 20, 4]] },
      ],
      inimigos: [
        { x: 24, y: 34, tipo: 'fogo' }, { x: 9, y: 34 },
        { x: 18, y: 25, tipo: 'fogo' }, { x: 14, y: 28 }, { x: 23, y: 18 },
        { x: 10, y: 17, tipo: 'fogo' }, { x: 26, y: 12, tipo: 'fogo' }, { x: 14, y: 9 }, { x: 22, y: 7 },
        { x: 42, y: 20, tipo: 'fogo' }, { x: 42, y: 25 },
        { x: 56, y: 14, tipo: 'fogo' }, { x: 66, y: 17 }, { x: 55, y: 4 }, { x: 64, y: 27, tipo: 'fogo' }, { x: 60, y: 35 }, { x: 67, y: 33, tipo: 'fogo' },
      ],
    },

    // ---------------- Parte 2: O Coração dos Elementos ----------------
    vale: {
      nome: 'Vale das Raízes',
      tema: 'vale',
      linhas: [
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT::TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT::TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
        'TT.T......F...............F...::.T...,..RRRRRRRRRRRRRRRRRRRRRRTT',
        'TT...........,................::....,...R....................RTT',
        'TT............................::..:.....R....................RTT',
        'TTT,HHHHHH..............,.....::::::C...R....................RTT',
        'TT.THHHHHH.....Q..........T.T.::..:.....R....................RTT',
        'TT..HHHDHH.............T......::..:.....R........uuuu........RTT',
        'TT.....:...................T..::..:...T.R.......uuuuuu.......RTT',
        'TT.....:....cccccc............::..:.....R.......uuuuuu.......RTT',
        'TT.....:....cccccc.........F,.::..:..F..R........uuuu........RTT',
        'TT.....:....cccccc.F.T........::..:.....R....................RTT',
        'TT.....:....cccccc............::..:..,..R....................RTT',
        'TT.....:.................,....::T.:.F...R....................RTT',
        'TT..T..:.........,..F.........::..:...TTR....................RTT',
        'TT.....:.......T.........,..T.::..:.F...RRRRRRRRRRZZZRRRRRRRRRTT',
        'TT.,...:......,.......T.F.....::..:........F..,....::....F....TT',
        'TT.....:..T..,.............U..::.....FF............::.....T...TT',
        'TT.S...:.,F...,.........F.....::...............TS..::.........TT',
        'TT....,:..........F.....S.....::...................::.....,...TT',
        ':::::::::::::::::::::::::::::::::::::::::::::::::::::...T.....TT',
        ':::::::::::::::::::::::::::::::::::::::::::::::::::::.........TT',
        'TT.,.......:..................::..........F........::.........TT',
        'TT.........:,....,.,.T........::.............,.....::.........TT',
        'TT.........:..................::............,......::.........TT',
        'TT,........:............,.....::............F.F....::.........TT',
        'TT.........:................T.:.T..................::....,....TT',
        'TT..rrrr.rr:r.rrrr.r........u.:.........T....,.T...::.........TT',
        'TTT........:............uuuuuu:uu..................:::::::::::::',
        'TT..rr.rrrr:rrrr.rrr..uuuuuuuu:uuuu...F......,..FF.:::::::::::::',
        'TT.........:..........uuuuuuuu:uuuu.......,...F.......F.......TT',
        'TT...rrrr.r:rr.rrrr..uuuuuuuuu:uuuuu...............T....T.....TT',
        'TT.........:..........uuuuuuuu:uuuu..................RRRR%RRRRTT',
        'TT..rrr.rrr:.rrrr.rr..uuuuuuuu:uuuu...F..............R........TT',
        'TT.........:...Q........uuuuuu:uu.......::::::::::::.R........TT',
        'TT..r.rrrr.:rrr.rrrr........u.:..............Q.......R........TT',
        'TT.........:.............,....:......................R....C...TT',
        'TT..rCrr.rr:r.rrrr.r..,.....T.:,.C................,..R........TT',
        'TT.........:..................:...,..................R........TT',
        'TT.........:..................:......................R........TT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
      ],
      saidas: [
        { x: 0, y: 20, w: 1, h: 2, para: 'vilarejo', chegada: { x: 57.4, y: 14.2, dir: 'LEFT' } },
        { x: 30, y: 0, w: 2, h: 1, para: 'lago', requer: 'fusaoMagma', chegada: { x: 30.5, y: 39.4, dir: 'BACK' } },
        { x: 63, y: 28, w: 1, h: 2, para: 'fenda', requer: 'chefeTerra', chegada: { x: 2.5, y: 14.2, dir: 'RIGHT' } },
      ],
      // Casa da Dona Cora (jardineira): cesto, regador, sementes e o cantinho de jardinagem em volta da horta.
      moveis: [
        ['farm_harvest_basket', 10.7, 8.4, 0], ['farm_watering_can', 11.6, 8.5, 0], ['farm_seed_sacks', 10.6, 10.3, 0],
        // Cantinho de jardinagem da Cora: mangueira, pá e enxada à esquerda da horta; treliça e composteira à direita.
        ['farm_garden_hose', 10.6, 12.6, 0], ['farm_shovel', 11.0, 11.5, 0], ['farm_hoe', 10.4, 11.9, 0, null, 0, true],
        ['farm_wooden_trellis', 19.0, 9.9, 0, [1, 1]], ['farm_compost_bin', 19.0, 12.6, 0, [1, 1]],
      ],
      inicio: { x: 2.5, y: 21.2, dir: 'RIGHT' },
      placas: { '3,18': 'Vale das Raízes. A terra aqui respira devagar. Desde que o Colosso adoeceu, as raízes andam soltas: correndo por cima delas, a gente tropeça.', '24,19': 'Fonte do Vale: beba para recuperar vida e magia (das duas). À noite dá para descansar até de manhã.', '48,18': 'A barreira de raízes só se abre com os três cristais de terra acesos: um na horta da Dona Cora, um no campo de raízes e um no bosque do leste.' },
      baus: { '5,37': { itens: [['pocao', 1]], moedas: 30 }, '33,37': { itens: [['bomba', 2]], moedas: 20 }, '58,36': { itens: [['elixir', 1]], moedas: 60 }, '36,5': { moedas: 45 } },
      chao: [{ x: 22, y: 10, doc: 'diarioCora' }, { x: 44, y: 24, moedas: 10 }],
      barreiras: [{ id: 'raizes', fontes: ['15,6', '15,34', '45,35'], tiles: [[50, 15, 52, 15]] }],
      npcs: [{ id: 'cora', x: 9.5, y: 9.7 }],
      chefe: { id: 'colosso', x: 50.5, y: 9, arena: [41, 3, 60, 14] },
      inimigos: [
        { x: 16, y: 21 },
        { x: 38, y: 22 },
        { x: 44, y: 18, tipo: 'terra' },
        { x: 9, y: 30 },
        { x: 17, y: 37, tipo: 'terra' },
        { x: 26, y: 36 },
        { x: 43, y: 33, tipo: 'terra' },
        { x: 47, y: 37 },
        { x: 57, y: 24 },
        { x: 38, y: 9, tipo: 'terra' },
        { x: 20, y: 8 },
      ],
    },

    fenda: {
      nome: 'Fenda de Magma',
      tema: 'fenda',
      linhas: [
        '####################################',
        '####################################',
        '####################################',
        '####################.###############',
        '##########LLLLLl..........###L######',
        '#########LLLLLLLl.........lLLLLL####',
        '##########LLLLLl.........lLLLLLLL###',
        '##########lllll...........lLLLLL####',
        '#########.................lllLll####',
        '##.....................o....lll.####',
        '##...U...........................###',
        '##...............................###',
        '##..........................o....###',
        '::.......:.......................###',
        '::.......:.......................###',
        '##...............................###',
        '##.S.........o................o..###',
        '##...............................###',
        '#########....................lll####',
        '#########....o.........o...lllLl####',
        '##########lllll............lLLLLL###',
        '##########LLLLLl..........lLLLLLLL##',
        '#########LLLLLLLl..........lLLLLL###',
        '##########LLLLLl..........####L#####',
        '####################.###############',
        '####################################',
        '####################################',
        '####################################',
      ],
      saidas: [
        { x: 0, y: 13, w: 1, h: 2, para: 'vale', chegada: { x: 61.5, y: 29.2, dir: 'LEFT' } },
      ],
      inicio: { x: 2.5, y: 14.2, dir: 'RIGHT' },
      placas: { '3,16': 'Aqui a pedra do Guardião e o fogo do dragão se juntaram. O chão em brasa (vermelho escuro) queima sem Armadura de Brasa (Line) ou da Aurora (Bell).' },
      chefe: { id: 'magma', x: 21, y: 13.5, arena: [10, 5, 31, 22] },
      inimigos: [
      ],
    },

    lago: {
      nome: 'Lago Espelhado',
      tema: 'lago',
      linhas: [
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT::TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT::TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
        'TT....................F..,....::...,..........................TT',
        'TT.......:::::::::::::::::::::::.,............................TT',
        'TT.......:::::::::::::::::::::::T...............,..,......F.,.TT',
        'TTF..T...::...........C...,..,...F..........T..........,.,....TT',
        'TT.......::.Q..F....F........,...F............................TT',
        'TT.T.....::............,......,.~.....,.......,...............TT',
        'TT.......::....T.........~~~~~~~~~~~~~~~......T...............TT',
        'TT.....T.::...........~~~~~~~~~~~~~~~~~~~~~..F................TT',
        'TT.......::.........~~~~~~~~~~~~~~~~~~~~~~~~~..T.......Q......TT',
        'TT....F..::....T..~~~~~~~~~~~~~~~~~~~~~~~~~~~~~...............TT',
        'TTwwwwwww::wwwwwww~~~~~~~~~~~.......~~~~~~~~~~~~........:.....TT',
        'TTwwwwwww::wwwwwww~~~~~~~~.............~~~~~~~~~~.......:..T..TT',
        'TT.......::....~~~~~~~~~~...............~~~~~~~~~~......:....,TT',
        'TT....,..::....~~~~~~~~~.................~~~~~~~~~......:.....TT',
        'TT.......::....~~~~~~~~...................~~~~~~~~......:.....TT',
        'TT.......::...~~~~~~~~~...................~~~~~~~~~F....:.....TT',
        'TT.......::....~~~~~~~~...................~~~~~~~~......:.....TT',
        'TT.......::....~~~~~~~~~.................~~~~~~~~~....F.:.....TT',
        'TT..C....::....~~~~~~~~~~...............~~~~~~~~~~.....T:.....TT',
        'TT.......::,....~~~~~~~~~~.............~~~~~~~~~~...T.,.:.....TT',
        'TT......,::......~~~~~~~~~~~~..::...~~~~~~~~~~~~F....F..:....FTT',
        'TT.......::...TT..~~~~~~~~~~~~~ZZ~~~~~~~~~~~~~~.........:.....TT',
        'TT.......::.........~~~~~~~~~~~::~~~~~~~~~~~~.......F...:.....TT',
        'TT.......::...........~~~~~~~~~::~~~~~~~~~~,....TFF.....:...T.TT',
        'TT.......::.....,........~~~~~~::~~~~~~~.....F.........T:.....TT',
        'TT.T.....::......,.............::....FT.....T...........:.....TT',
        'TT.......::..........F.........::..T....................:.....TT',
        'TT.......::....T...............::...........ww...F......:.....TT',
        'TT.......::::::::::::::::::::::::...T.....F.ww..........:T....TT',
        'TT.......:::::::::::::::::::::::::::::::::::::::::::::::::::::::',
        'TTT......................U.S..::...,........ww......,...::::::::',
        'TT,.............ww.......,....::............ww..,...........F.TT',
        'TT,HHHHHH.......ww............::............ww................TT',
        'TT.HHHHHH.......ww...FF.F.....::............ww...T.........CF.TT',
        'TTFHHHDHH.......ww............::F....T.F....ww................TT',
        'TT....:.....Q...ww.......F....::............ww................TT',
        'TT....:.........ww............::...,..,.....ww................TT',
        'TT.............Tww........,.T.::.S..........ww................TT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT::TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT::TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
      ],
      saidas: [
        { x: 30, y: 41, w: 2, h: 1, para: 'vale', chegada: { x: 30.5, y: 1.6, dir: 'FRONT' } },
        { x: 63, y: 31, w: 1, h: 2, para: 'pantano', requer: 'chefeAgua', chegada: { x: 2.5, y: 14.2, dir: 'RIGHT' } },
        { x: 30, y: 0, w: 2, h: 1, para: 'picos', requer: 'fusaoLama', chegada: { x: 30.5, y: 39.4, dir: 'BACK' } },
      ],
      // Pontezinha (item 168) no riacho que a estrada atravessa.
      // Pontezinha no riacho e, na casa do pescador Tião, corda e caixote.
      moveis: [['farm_small_bridge', 45.0, 32.3, 0], ['farm_rope_coil', 9.4, 35.8, 0], ['farm_crate', 2.6, 38.0, 0, [1, 1]]],
      inicio: { x: 30.5, y: 39.4, dir: 'BACK' },
      placas: { '27,32': 'Fonte do Lago. O lago era tão limpo que refletia as estrelas de dia. Agora a água anda turva e brava.', '33,39': 'Lago Espelhado. A ponte da ilha está fechada por uma parede de água: acenda as três pérolas-cristal da margem.' },
      baus: { '4,20': { itens: [['pocao', 1]], moedas: 35 }, '59,35': { itens: [['bomba', 3]], moedas: 25 }, '22,5': { itens: [['elixir', 1]], moedas: 40 } },
      chao: [{ x: 40, y: 36, doc: 'cancaoLago' }, { x: 50, y: 20, moedas: 15 }],
      barreiras: [{ id: 'onda', fontes: ['12,37', '12,6', '55,10'], tiles: [[31, 23, 32, 23]] }],
      npcs: [{ id: 'tiao', x: 10.5, y: 36.9 }],
      chefe: { id: 'serpente', x: 32, y: 17, arena: [24, 13, 40, 21] },
      inimigos: [
        { x: 20, y: 31, tipo: 'agua' },
        { x: 38, y: 33 },
        { x: 9, y: 22 },
        { x: 12, y: 16, tipo: 'agua' },
        { x: 16, y: 5 },
        { x: 26, y: 4, tipo: 'agua' },
        { x: 52, y: 12, tipo: 'agua' },
        { x: 56, y: 24 },
        { x: 50, y: 36 },
        { x: 58, y: 31, tipo: 'agua' },
      ],
    },

    pantano: {
      nome: 'Pântano Sombrio',
      tema: 'pantano',
      linhas: [
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
        'TT..................................TT',
        'TT........u.........u...............TT',
        'TT......u..~~~.T.u.u...u......u.....TT',
        'TT.TuT....~~~~~u....u..........~~~..TT',
        'TT......T..~~~..........u.....~~~~~.TT',
        'TT........u......u.u...........~~~..TT',
        'TT................u.......u.........TT',
        'TTT.........u..........u............TT',
        'TT......u.......u...u........u......TT',
        'TT...U..................u...........TT',
        'TT...............u..................TT',
        '::::::::::..........................TT',
        '::::::::::................u.u.......TT',
        'TT..T...uuu............u........u.u.TT',
        'TT.S.........u......................TT',
        'TT..................u...............TT',
        'TT.................................uTT',
        'TT..................................TT',
        'TT..u...u....u....u............~~~..TT',
        'TT......u..~~~..u..u......u...~~~~~.TT',
        'TT.....u..~~~~~..........u.....~~~.uTT',
        'TT.........~~~.u....uu..............TT',
        'TT...u...u...u..uu..u............C..TT',
        'TT..................T....T..........TT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
      ],
      saidas: [
        { x: 0, y: 13, w: 1, h: 2, para: 'lago', chegada: { x: 61.5, y: 32.2, dir: 'LEFT' } },
      ],
      inicio: { x: 2.5, y: 14.2, dir: 'RIGHT' },
      placas: { '3,16': 'Onde a terra encharcou de água ruim, nasceu uma coisa com muitas cabeças. A lama (marrom) deixa as pernas pesadas.' },
      baus: { '33,24': { itens: [['pocao', 2]], moedas: 50 } },
      chefe: { id: 'hidra', x: 22, y: 12.5, arena: [11, 5, 32, 22] },
      inimigos: [
      ],
    },

    picos: {
      nome: 'Picos do Vento',
      tema: 'picos',
      linhas: [
        '###########################...::...#############################',
        '###########################........#############################',
        '###########################........#############################',
        '####...................####..R.....#########..................##',
        '####...................####........#########........R.........##',
        '####................R..####...o....#########..................##',
        '####.................o.####........#########..............Y...##',
        '####...................####........#########..................##',
        '####...................####........#########................::::',
        '####...................####........#########................::::',
        '####...................####........#########..............R...##',
        '####...................####........#########..................##',
        '####...................#...................j..................##',
        '####........o..........#........R..........j..................##',
        '####...................#..........R.S...C..j.............o....##',
        '####...................#...................j..........R.......##',
        '############ZZZ#########...................j..................##',
        '############ZZZ#########...................j..................##',
        '###########j...j########...................j..................##',
        '###########j<<<j########...................########j>>>j########',
        '###########j<<<j########....R..............########j>>>j########',
        '###########j<<<j########...................########j>>>j########',
        '###########j<<<j########..R................########j>>>j########',
        '###########j<<<j########...................########j>>>j########',
        '####................####.............R.....#.................###',
        '####................####...................#.................###',
        '####................####...................#.................###',
        '####................##jjjjjjjj>>>jjjjjjjj###.................###',
        '####....Y...........##jjjjjjjj>>>jjjjjjjj###...Y.............###',
        '####................##########>>>###########...........o.....###',
        '####................jj...................jjj.................###',
        '####................jj.....R.............jjj.................###',
        '####................jj.................R.jjj.................###',
        '####................jj...................jjj.................###',
        '####................jj.......S.U.........jjj.................###',
        '####................jj...................jjj................o###',
        '####..C.............jj...................jjj..............C..###',
        '####................jj...................jjj.................###',
        '####................jj...................jjj......R......R...###',
        '######################...................#######################',
        '######################........::.........#######################',
        '######################........::.........#######################',
      ],
      saidas: [
        { x: 30, y: 41, w: 2, h: 1, para: 'lago', chegada: { x: 30.5, y: 1.6, dir: 'FRONT' } },
        { x: 63, y: 8, w: 1, h: 2, para: 'tempestade', requer: 'chefeAr', chegada: { x: 2.5, y: 14.2, dir: 'RIGHT' } },
        { x: 30, y: 0, w: 2, h: 1, para: 'coracao', requer: 'portalCoracao', chegada: { x: 19.5, y: 29.4, dir: 'BACK' } },
      ],
      inicio: { x: 30.5, y: 39.4, dir: 'BACK' },
      placas: { '29,34': 'Picos do Vento. Onde o chão tem riscos brancos, o vento empurra. Abismo não tem fundo: cair custa um tombo e a volta para a beirada.', '36,14': 'Os três faróis do vento estão apagados. Acesos, eles abrem o ninho do Grifo, a noroeste (a ponte de vento sai do platô oeste). Um farol fica no platô oeste, um no leste e um no pico nordeste.' },
      baus: { '6,36': { itens: [['pocao', 1]], moedas: 40 }, '58,36': { itens: [['elixir', 1]], moedas: 30 }, '40,14': { itens: [['bomba', 2]], moedas: 50 } },
      chao: [{ x: 50, y: 30, doc: 'penaGrifo' }, { x: 26, y: 20, moedas: 20 }],
      barreiras: [{ id: 'farois', fontes: ['47,28', '8,28', '58,6'], tiles: [[12, 16, 14, 17]] }],
      npcs: [{ id: 'brisa', x: 12.5, y: 31.9 }],
      chefe: { id: 'grifo', x: 13, y: 9, arena: [5, 4, 21, 14] },
      inimigos: [
        { x: 35, y: 36, tipo: 'ar' },
        { x: 14, y: 26 },
        { x: 16, y: 35, tipo: 'ar' },
        { x: 50, y: 26 },
        { x: 56, y: 33, tipo: 'ar' },
        { x: 30, y: 18 },
        { x: 38, y: 22, tipo: 'ar' },
        { x: 48, y: 10 },
        { x: 55, y: 14, tipo: 'ar' },
      ],
    },

    tempestade: {
      nome: 'Olho da Tempestade',
      tema: 'tempestade',
      linhas: [
        '####################################',
        '#jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj#',
        '#jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj#',
        '#jjjjjjjjjjjjjjjjjj.jjjjjjjjjjjjjjj#',
        '#jjjjjjjjjjjjj...........jjjjjjjjjj#',
        '#jjjjjjjjjjj...............jjjjjjjj#',
        '#jjjjjjjjj...................jjjjjj#',
        '#jjjjjjjj.....................jjjjj#',
        '#jjjjjjj.......................jjjj#',
        '#jjjjjjj.......................jjjj#',
        '#j..............................jjj#',
        '#j..U...........................jjj#',
        '#j..............................jjj#',
        '::......:.......................jjj#',
        '::......:.......................jjj#',
        '#j..............................jjj#',
        '#j.S............................jjj#',
        '#j..............................jjj#',
        '#jjjjjjj.......................jjjj#',
        '#jjjjjjj.......................jjjj#',
        '#jjjjjjjj.....................jjjjj#',
        '#jjjjjjjjj...................jjjjjj#',
        '#jjjjjjjjjjj...............jjjjjjjj#',
        '#jjjjjjjjjjjjj...........jjjjjjjjjj#',
        '#jjjjjjjjjjjjjjjjjj.jjjjjjjjjjjjjjj#',
        '#jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj#',
        '#jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj#',
        '####################################',
      ],
      saidas: [
        { x: 0, y: 13, w: 1, h: 2, para: 'picos', chegada: { x: 61.5, y: 9.2, dir: 'LEFT' } },
      ],
      inicio: { x: 2.5, y: 14.2, dir: 'RIGHT' },
      placas: { '3,16': 'Chuva que sobe, vento que chove. Aqui a água do lago e o vento dos picos viraram uma coisa só.' },
      chefe: { id: 'tempestade', x: 20, y: 12, arena: [9, 5, 30, 22] },
      inimigos: [
      ],
    },

    coracao: {
      nome: 'Coração dos Elementos',
      tema: 'coracao',
      linhas: [
        '########################################',
        '########################################',
        '########################################',
        '####################I###################',
        '##############.............#############',
        '###########...................##########',
        '########I#.....................#I#######',
        '########.........................#######',
        '#######...........................######',
        '######.............................#####',
        '######.............................#####',
        '#####...............................####',
        '#####...............................####',
        '#####...............................####',
        '####.................................###',
        '#####...............................####',
        '#####...............................####',
        '#####...............................####',
        '######.............................#####',
        '######.............................#####',
        '#######...........................######',
        '########I.......................I#######',
        '##########.....................#########',
        '###########...................##########',
        '##############.............#############',
        '#################......#################',
        '#################......#################',
        '#################......#################',
        '#################U....S#################',
        '#################......#################',
        '#################..::..#################',
        '#################..::..#################',
      ],
      saidas: [
        { x: 19, y: 31, w: 2, h: 1, para: 'picos', chegada: { x: 30.5, y: 1.6, dir: 'FRONT' } },
      ],
      inicio: { x: 19.5, y: 29.4, dir: 'BACK' },
      placas: { '22,28': 'Aqui dorme o que sobrou de tudo: pedra, fogo, terra, água e ar. Juntas, as duas brilham mais do que qualquer um deles.' },
      chefe: { id: 'quimera', x: 20, y: 13, arena: [6, 5, 34, 23] },
      inimigos: [
      ],
    },
  };

  // 'O': chão ocupado por um móvel (interiores).
  const SOLIDOS = new Set(['T', 'R', 'H', 'D', '~', 'w', 'X', 'C', 'S', '#', 'L', 'o', 'B', 'K', 'f', 'P', 'M', 'n', 'm', 'k', 'v', 'I', 'Q', 'A', 'Y', 'U', 'Z', 'j', 'g', 'q', '%', 'p', 'E', 'b', 'W', 'O']);
  const CAVERNA = new Set(['covil', 'ruinas', 'montanha', 'gruta', 'fenda', 'picos', 'tempestade', 'coracao']);
  // Temas desenhados com o chão de pedra (paredes '#', lajes, lava e abismos).
  const PEDRA = new Set(['ruinas', 'montanha', 'fenda', 'picos', 'tempestade', 'coracao']);
  // Fases com textura de chão (game/assets/texturas) e os tiles que continuam desenhados por cima dela.
  const TEXTURA = { vilarejo: 'vilarejo', floresta: 'floresta', ruinas: 'ruinas', montanha: 'montanha' };
  const SOBRE_TEXTURA = '#:uhcr=Ew~lLj><Q';

  // Gerador pseudoaleatório estável por posição (o cenário não "pisca" entre quadros).
  function ruido(x, y, s) {
    let h = (x * 374761393 + y * 668265263 + (s || 0) * 982451653) | 0;
    h = (h ^ (h >>> 13)) * 1274126177;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  const CORES = {
    campo: { grama: '#6aa84f', grama2: '#5b9642', grama3: '#7dbb5e', caminho: '#d2b07a', caminho2: '#b8955f' },
    vilarejo: { grama: '#6fab50', grama2: '#5f9d44', grama3: '#83bf60', caminho: '#cdb58f', caminho2: '#b39a72' },
    fazenda: { grama: '#72ae52', grama2: '#62a046', grama3: '#86c162', caminho: '#d8b47c', caminho2: '#bf9862' },
    floresta: { grama: '#4f8a3f', grama2: '#437a35', grama3: '#5e9c4b', caminho: '#b99867', caminho2: '#9c7c50' },
    covil: { chao: '#4b403c', chao2: '#3d3431', parede: '#241c1a', parede2: '#352b28' },
    ruinas: { chao: '#6f7a68', chao2: '#626d5b', junta: '#566150', musgo: '#6e8f4c', parede: '#343b33', parede2: '#434b40', topo: '#5a6553', caminho: '#8d8a78', margem: '#a3a690' },
    gruta: { chao: '#46545c', chao2: '#3c4950', parede: '#1b2228', parede2: '#2b363d', topo: '#5a6b74', musgo: '#3f7d78' },
    montanha: { chao: '#5c4b44', chao2: '#4f403a', junta: '#3d302b', musgo: '#7a5a3a', parede: '#231b19', parede2: '#33282a', topo: '#6b554b', caminho: '#7a6558', margem: '#8a6f5f' },
    // Parte 2.
    vale: { grama: '#8aa24a', grama2: '#7a9140', grama3: '#a0b85a', caminho: '#c9a06a', caminho2: '#a8804e' },
    lago: { grama: '#5fae6a', grama2: '#4f9c5c', grama3: '#78c07c', caminho: '#d8c79a', caminho2: '#b9a576', agua: '#62b8e8', aguaFunda: '#2a78c0', margem: '#e0d2a0' },
    pantano: { grama: '#4a6a3a', grama2: '#3e5c31', grama3: '#587a44', caminho: '#7a6a4a', caminho2: '#62553a', agua: '#4a7a5a', aguaFunda: '#2f5a40', margem: '#5a5038' },
    fenda: { chao: '#4a3a36', chao2: '#3f312e', junta: '#2a1f1c', musgo: '#8a3a1a', parede: '#1e1412', parede2: '#2e201c', topo: '#5a3a30', caminho: '#6a4a3e', margem: '#7a5040' },
    picos: { chao: '#b8bec8', chao2: '#a8afba', junta: '#8a92a0', musgo: '#e8eef5', parede: '#5a6272', parede2: '#6a7384', topo: '#d8dee8', caminho: '#c8ccd4', margem: '#e0e6ee', ceu: ['#bfe3ff', '#7fbfef'] },
    tempestade: { chao: '#4a5468', chao2: '#434c5f', junta: '#323a4a', musgo: '#6a8ab0', parede: '#1e2432', parede2: '#2a3244', topo: '#5a6680', caminho: '#5a6478', margem: '#6a7690', ceu: ['#2a3450', '#141a2a'], lajes: true },
    coracao: { chao: '#4a3a5a', chao2: '#433452', junta: '#2e2240', musgo: '#9a6ad0', parede: '#1a1226', parede2: '#281c38', topo: '#5a4a72', caminho: '#6a5a82', margem: '#7a6a92', ceu: ['#3a2050', '#10081a'], lajes: true },
  };

  class Mapa {
    constructor(id, flags) {
      const def = MAPAS[id];
      this.id = id;
      this.flags = flags || {};
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
      if (tx < 0 || ty < 0 || tx >= this.w || ty >= this.h) return CAVERNA.has(this.tema) ? '#' : 'T';
      // Enquanto o chão é desenhado, o chão debaixo de um móvel conta como o chão original (sem bordas de grama).
      if (this.desenhandoChao && this.l[ty][tx] === 'O' && this.sobO) return this.sobO[tx + ',' + ty] || '.';
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

    // Chão "vazio" do tema (o que fica no lugar de uma parede rachada que explodiu).
    get chaoVazio() { return this.tema === 'gruta' || this.tema === 'covil' ? '_' : '.'; }

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
      // Móveis dos interiores: [nome, x, y (base, em tiles), largura no mundo, pegada [larg, alt] em tiles, alto, espelhar].
      // A pegada vira chão ocupado ('O'); móvel de parede (espelho, toalheiro) não tem pegada e fica no alto.
      // Também serve ao ar livre (objetos da fazenda): a pegada só ocupa chão livre (piso, grama, flor).
      // Capacho, vitórias-régias e a pontezinha ficam rentes ao chão: a Line passa por cima deles.
      // A largura vem da régua de tamanhos (LB.LARGURA_OBJETOS, tools/extrair_objetos.py); o número da lista só vale
      // para o que não está na régua (barril, caixa, forja desenhados no código).
      const L = LB.LARGURA_OBJETOS || {};
      const regua = (n) => L[n] || L[n + '_off'] || L[n + '_day'] || L[n + '_closed'];
      for (const [nome, x, y, larg, pegada, alto, flip] of this.def.moveis || []) {
        this.props.push({ tipo: 'movel', nome, x: x * TILE, y: y * TILE, larg: regua(nome) || larg, alto: alto || 0, flip: !!flip, plano: /doormat|lily_pads|small_bridge/.test(nome) });
        if (!pegada) continue;
        const [pw, ph] = pegada;
        const tx0 = Math.round(x - pw / 2), ty0 = Math.round(y - ph);
        const livre = pegada[2] ? '_.,:' : '_.,';   // pegada [l, a, 1]: ocupa também a terra (banco na praça)
        for (let ty = ty0; ty < ty0 + ph; ty++) for (let tx = tx0; tx < tx0 + pw; tx++) {
          if (!this.l[ty] || !livre.includes(this.l[ty][tx])) continue;
          (this.sobO || (this.sobO = {}))[tx + ',' + ty] = this.l[ty][tx];   // o chão continua o mesmo por baixo
          this.l[ty][tx] = 'O';
        }
      }
      for (const [nome, x, y, larg, raio] of this.def.decoracoes || []) {
        this.props.push({ tipo: 'decoracao', nome, x: x * TILE, y: y * TILE, larg, raio, balanca: /girassol|milho|trigo|moita|arbusto/.test(nome), flip: ruido(Math.round(x * 3), Math.round(y * 3), 9) > 0.5 && nome !== 'placa2' });
      }
      // Porteiras da arte no lugar de um trecho de cerca (a cerca continua sólida).
      for (const pt of this.def.porteiras || []) this.props.push({ tipo: 'porteira', x: (pt.x + pt.w / 2) * TILE, y: (pt.y + 1) * TILE - 4, w: pt.w * TILE });
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
          const oculta = (this.def.porteiras || []).some((pt) => ty === pt.y && tx >= pt.x && tx < pt.x + pt.w);
          this.props.push({ tipo: 'cerca', tx, ty, x: cx, y: base - 6, oculta, d: liga(this.tile(tx + 1, ty)), e: liga(this.tile(tx - 1, ty)), b: liga(this.tile(tx, ty + 1)), c: liga(this.tile(tx, ty - 1)) });
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
        if (t === 'g') { this.props.push({ tipo: 'porta', tx, ty, x: cx, y: base - 2 }); continue; }
        if (t === 'q') { this.props.push({ tipo: 'cogumelo', tx, ty, x: cx, y: base - 4, v }); continue; }
        if (t === '%') { this.props.push({ tipo: 'rachadura', tx, ty, x: cx, y: base - 1, v, tema: this.tema }); continue; }
        if (t === 'p') { this.props.push({ tipo: 'poste', tx, ty, x: cx, y: base - 4, v }); continue; }
        if (t === 'E') { this.props.push({ tipo: 'estacao', tx, ty, x: cx, y: base - 2, v }); continue; }
        if (t === 'b') { this.props.push({ tipo: 'barraca', tx, ty, x: cx, y: base - 3, v }); continue; }
        if (t === 'W') { this.props.push({ tipo: 'bigorna', tx, ty, x: cx, y: base - 3, v }); continue; }
        if (t === 'T') this.props.push({ tipo: 'arvore', tx, ty, x: cx, y: base - 4, v });
        else if (t === 'R') this.props.push({ tipo: 'pedra', tx, ty, x: cx, y: base - 6, v: ruido(tx, ty, 2) });
        else if (t === 'o') this.props.push({ tipo: 'estalagmite', tx, ty, x: cx, y: base - 4, v: ruido(tx, ty, 3) });
        else if (t === 'X') this.props.push({ tipo: 'espinheiro', tx, ty, x: cx, y: base - 2, v: ruido(tx, ty, 4) });
        else if (t === 'C') {
          const conteudo = (this.def.baus || {})[tx + ',' + ty];
          // Baús que só aparecem depois de certo ponto da história (ex.: na fazenda, depois do rapto).
          if (conteudo && conteudo.depoisDe && !(this.flags || {})[conteudo.depoisDe]) { this.l[ty][tx] = '.'; continue; }
          this.props.push({ tipo: 'bau', tx, ty, x: cx, y: base - 6, conteudo });
        }
        else if (t === 'S') this.props.push({ tipo: 'placa', tx, ty, x: cx, y: base - 6, texto: (this.def.placas || {})[tx + ',' + ty] || '...' });
        else if (t === 'H' || t === 'D') {
          const b = this.bloco(tx, ty, 'HD', casas);
          let porta = tx;
          for (let xx = tx; xx < tx + b.w / TILE; xx++) if (this.tile(xx, ty + b.h / TILE - 1) === 'D') porta = xx;
          this.props.push(Object.assign({ tipo: this.tema === 'fazenda' ? 'casaFazenda' : 'casa', porta: (porta + 0.5) * TILE }, b));
        }
      }
    }

    // Imagem de base (terreno da fazenda, planta das casas): o jogo desenha a imagem por baixo e aqui
    // só entram os tiles que mudam por cima dela (`sobreBase`, ex.: a lama do chiqueiro). Sem a imagem
    // (ainda carregando), o chão é desenhado tile a tile como antes.
    get imagemBase() { return this.def.base ? LB.personagem(this.def.base) : null; }

    // Textura do chão (bases dos cenários): a grama, a mata, a laje ou a rocha da arte cobrem o chão
    // inteiro, e os caminhos usam a terra da mesma arte, com a borda suave. Água, paredes, lava e o
    // resto continuam desenhados por cima, tile a tile.
    get texturas() {
      const id = TEXTURA[this.tema];
      if (!id) return null;
      const chao = LB.personagem('textura_' + id + '_chao'), caminho = LB.personagem('textura_' + id + '_caminho');
      return chao ? { chao, caminho } : null;
    }

    desenharTexturas(g, tx) {
      const RES = 2;
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
      g.fillStyle = g.createPattern(tx.chao, 'repeat'); g.fillRect(0, 0, this.larg * RES, this.alt * RES);
      g.restore();
      if (!tx.caminho) return;
      // Máscara dos caminhos: 4 pixels por tile, ampliada com suavização (a terra entra na grama sem degrau).
      const P = 4, mini = document.createElement('canvas'); mini.width = this.w * P; mini.height = this.h * P;
      const ng = mini.getContext('2d'); ng.fillStyle = '#000';
      for (let ty = 0; ty < this.h; ty++) for (let x = 0; x < this.w; x++) if (this.l[ty][x] === ':' || (this.sobO && this.sobO[x + ',' + ty] === ':')) ng.fillRect(x * P, ty * P, P, P);
      const m = document.createElement('canvas'); m.width = this.larg * RES; m.height = this.alt * RES;
      const mg = m.getContext('2d');
      mg.imageSmoothingEnabled = true; mg.imageSmoothingQuality = 'high';
      mg.drawImage(mini, 0, 0, m.width, m.height);
      mg.globalCompositeOperation = 'source-in';
      mg.fillStyle = mg.createPattern(tx.caminho, 'repeat'); mg.fillRect(0, 0, m.width, m.height);
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(m, 0, 0); g.restore();
    }

    renderizarChao() {
      const RES = 2;
      const c = this.chao || document.createElement('canvas');
      c.width = this.larg * RES; c.height = this.alt * RES;
      const g = c.getContext('2d');
      g.setTransform(RES, 0, 0, RES, 0, 0);
      this.comBase = !!this.imagemBase;
      const sobre = this.def.sobreBase || '';
      const tex = !this.comBase ? this.texturas : null;
      this.comTextura = !!tex;
      if (tex) this.desenharTexturas(g, tex);
      this.desenhandoChao = true;
      for (let ty = 0; ty < this.h; ty++) for (let tx = 0; tx < this.w; tx++) {
        if (tex) { const t = this.l[ty][tx] === 'O' && this.sobO ? this.sobO[tx + ',' + ty] || '.' : this.l[ty][tx]; if (SOBRE_TEXTURA.includes(t) && !(t === ':' && tex.caminho)) this.desenharTile(g, tx, ty, true); }
        else if (!this.comBase) this.desenharTile(g, tx, ty);
        else if (sobre.includes(this.l[ty][tx])) this.desenharTile(g, tx, ty, true);
      }
      this.desenhandoChao = false;
      this.chao = c;
      this.resChao = RES;
    }

    desenharTile(g, tx, ty, soTopo) {
      const t = this.l[ty][tx] === 'O' && this.sobO ? this.sobO[tx + ',' + ty] || '.' : this.l[ty][tx];
      const x = tx * TILE, y = ty * TILE;
      const cor = CORES[this.tema];
      const rnd = (s) => ruido(tx, ty, s);

      if (this.tema === 'encontro') return;
      if (this.tema === 'casa') {
        // Interior sem a imagem da planta: piso de madeira e paredes escuras.
        g.fillStyle = t === '#' ? '#4a2f20' : (tx + ty) % 2 ? '#b07a48' : '#a8713f'; g.fillRect(x, y, TILE, TILE);
        if (t !== '#') { g.fillStyle = 'rgba(70,40,20,.25)'; g.fillRect(x, y + TILE - 2, TILE, 2); }
        return;
      }
      if (PEDRA.has(this.tema)) { this.desenharTilePedra(g, tx, ty, t, x, y, cor, rnd); this.desenharTileExtra(g, tx, ty, t, x, y, rnd); return; }
      if (this.tema === 'gruta') { this.desenharTileGruta(g, tx, ty, t, x, y, cor, rnd); this.desenharTileExtra(g, tx, ty, t, x, y, rnd); return; }
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
      if (!soTopo) {
        g.fillStyle = cor.grama; g.fillRect(x, y, TILE, TILE);
        for (let i = 0; i < 7; i++) {
          g.fillStyle = rnd(i + 20) > 0.5 ? cor.grama2 : cor.grama3;
          g.fillRect(x + rnd(i) * 30, y + rnd(i + 7) * 30, 2, 3);
        }
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
      } else if (t === '=' || t === 'E') {
        this.desenharTileExtra(g, tx, ty, t, x, y, rnd);
      } else if (t === 'w' || t === '~') {
        const funda = t === '~';
        g.fillStyle = funda ? cor.aguaFunda || '#2f6fb2' : cor.agua || '#5aa9e6'; g.fillRect(x, y, TILE, TILE);
        g.fillStyle = funda ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.2)';
        for (let i = 0; i < 3; i++) g.fillRect(x + rnd(i + 100) * 22, y + rnd(i + 110) * 28, 8, 2);
        // Margem com a grama.
        g.fillStyle = cor.margem || '#c9b27d';
        if (!'w~'.includes(this.tile(tx, ty - 1))) g.fillRect(x, y, TILE, 3);
        if (!'w~'.includes(this.tile(tx, ty + 1))) g.fillRect(x, y + TILE - 3, TILE, 3);
        if (!'w~'.includes(this.tile(tx - 1, ty))) g.fillRect(x, y, 3, TILE);
        if (!'w~'.includes(this.tile(tx + 1, ty))) g.fillRect(x + TILE - 3, y, 3, TILE);
      }
    }

    // Tiles que existem em vários temas: trilho do carrinho, brasa rasa e a fenda da gruta.
    desenharTileExtra(g, tx, ty, t, x, y, rnd) {
      if (t === '=' || t === 'E') {
        const horiz = '=E'.includes(this.tile(tx - 1, ty)) || '=E'.includes(this.tile(tx + 1, ty));
        g.fillStyle = '#6b4a2b';
        for (let i = 0; i < 4; i++) { if (horiz) g.fillRect(x + 2 + i * 8, y + 9, 4, 16); else g.fillRect(x + 8, y + 2 + i * 8, 16, 4); }
        g.fillStyle = '#9aa3ad';
        if (horiz) { g.fillRect(x, y + 11, TILE, 2.5); g.fillRect(x, y + 20, TILE, 2.5); } else { g.fillRect(x + 10, y, 2.5, TILE); g.fillRect(x + 19, y, 2.5, TILE); }
        g.fillStyle = 'rgba(255,255,255,.35)';
        if (horiz) { g.fillRect(x, y + 11, TILE, 0.8); g.fillRect(x, y + 20, TILE, 0.8); }
      } else if (t === 'l') {
        g.fillStyle = '#3a1d12'; g.fillRect(x, y, TILE, TILE);
        g.fillStyle = '#7a2a12';
        for (let i = 0; i < 5; i++) { g.beginPath(); g.ellipse(x + 4 + rnd(i + 70) * 24, y + 4 + rnd(i + 71) * 24, 4 + rnd(i) * 3, 2.5, 0, 0, 7); g.fill(); }
        g.fillStyle = '#ff7a2a';
        for (let i = 0; i < 4; i++) g.fillRect(x + rnd(i + 80) * 28, y + rnd(i + 81) * 28, 2.5, 2.5);
      } else if (t === 'j' && this.tema === 'gruta') {
        g.fillStyle = '#05070a'; g.fillRect(x, y, TILE, TILE);
        const gr = g.createLinearGradient(x, y, x, y + TILE); gr.addColorStop(0, 'rgba(90,120,140,.7)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
        if (this.tile(tx, ty - 1) !== 'j') { g.fillStyle = gr; g.fillRect(x, y, TILE, 14); g.fillStyle = '#5a6b74'; g.fillRect(x, y, TILE, 3); }
        g.fillStyle = '#5a6b74';
        if (this.tile(tx, ty + 1) !== 'j') g.fillRect(x, y + TILE - 2, TILE, 2);
        if (this.tile(tx - 1, ty) !== 'j') g.fillRect(x, y, 2, TILE);
        if (this.tile(tx + 1, ty) !== 'j') g.fillRect(x + TILE - 2, y, 2, TILE);
      }
    }

    // Gruta dos Ecos: pedra azulada e úmida, água funda e brilho de cogumelos.
    desenharTileGruta(g, tx, ty, t, x, y, cor, rnd) {
      if (t === '#') {
        g.fillStyle = cor.parede; g.fillRect(x, y, TILE, TILE);
        g.fillStyle = cor.parede2;
        for (let i = 0; i < 3; i++) g.fillRect(x + rnd(i) * 24, y + rnd(i + 5) * 24, 6 + rnd(i + 9) * 6, 4);
        if (this.tile(tx, ty + 1) !== '#') {
          g.fillStyle = cor.topo; g.fillRect(x, y + TILE - 12, TILE, 12);
          g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(x, y + TILE - 12, TILE, 2);
          g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(x, y + TILE - 3, TILE, 3);
          if (rnd(40) > 0.5) { g.fillStyle = cor.musgo; g.fillRect(x + rnd(41) * 20, y + TILE - 12, 6 + rnd(42) * 8, 3); }
        }
        return;
      }
      g.fillStyle = rnd(30) > 0.5 ? cor.chao : cor.chao2; g.fillRect(x, y, TILE, TILE);
      g.fillStyle = 'rgba(0,0,0,.18)';
      for (let i = 0; i < 4; i++) g.fillRect(x + rnd(i + 50) * 28, y + rnd(i + 51) * 28, 3, 2);
      if (rnd(35) > 0.8) { g.fillStyle = 'rgba(120,200,255,.18)'; g.beginPath(); g.ellipse(x + 8 + rnd(36) * 16, y + 8 + rnd(37) * 16, 5, 3, 0, 0, Math.PI * 2); g.fill(); }
      if (t === '~' || t === 'w') {
        g.fillStyle = t === '~' ? '#1f4f6e' : '#2f7a9a'; g.fillRect(x, y, TILE, TILE);
        g.fillStyle = '#2e6a8c'; for (let i = 0; i < 3; i++) g.fillRect(x + rnd(i + 100) * 22, y + rnd(i + 110) * 28, 8, 2);
        g.fillStyle = cor.topo;
        if (!'~w'.includes(this.tile(tx, ty - 1))) g.fillRect(x, y, TILE, 4);
        if (!'~w'.includes(this.tile(tx, ty + 1))) g.fillRect(x, y + TILE - 3, TILE, 3);
        if (!'~w'.includes(this.tile(tx - 1, ty))) g.fillRect(x, y, 3, TILE);
        if (!'~w'.includes(this.tile(tx + 1, ty))) g.fillRect(x + TILE - 3, y, 3, TILE);
      } else if (t === ':') {
        g.fillStyle = '#5a6a72'; g.fillRect(x + 1, y + 1, TILE - 2, TILE - 2);
      }
    }

    // Chão de pedra das ruínas e da montanha (paredes, lajes, água, lava e fendas).
    desenharTilePedra(g, tx, ty, t, x, y, cor, rnd) {
      const ruinas = this.tema === 'ruinas' || !!cor.lajes;
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
      // Laje do chão (com a textura da base, a laje já vem da arte).
      if (!this.comTextura) {
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
      } else if (t === 'j' && cor.ceu) {
        // Abismo de céu: nuvens lá embaixo.
        const ceu = g.createLinearGradient(x, y, x, y + TILE); ceu.addColorStop(0, cor.ceu[0]); ceu.addColorStop(1, cor.ceu[1]);
        g.fillStyle = ceu; g.fillRect(x, y, TILE, TILE);
        g.fillStyle = 'rgba(255,255,255,.35)';
        for (let i = 0; i < 2; i++) { g.beginPath(); g.ellipse(x + rnd(i + 60) * TILE, y + 10 + rnd(i + 61) * 18, 8 + rnd(i + 62) * 6, 3, 0, 0, 7); g.fill(); }
        g.fillStyle = cor.topo;
        if (this.tile(tx, ty - 1) !== 'j') { g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x, y, TILE, 8); g.fillStyle = cor.topo; g.fillRect(x, y, TILE, 3); }
        if (this.tile(tx, ty + 1) !== 'j') g.fillRect(x, y + TILE - 2, TILE, 2);
        if (this.tile(tx - 1, ty) !== 'j') g.fillRect(x, y, 2, TILE);
        if (this.tile(tx + 1, ty) !== 'j') g.fillRect(x + TILE - 2, y, 2, TILE);
      } else if (t === '>' || t === '<') {
        // Corrente de vento: riscos brancos na direção do empurrão.
        g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 1.5; g.lineCap = 'round';
        const dir = t === '>' ? 1 : -1;
        for (let i = 0; i < 3; i++) {
          const yy = y + 6 + i * 10, xx = x + 4 + rnd(i + 70) * 10;
          g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx + 14, yy); g.stroke();
          g.beginPath(); g.moveTo(x + 16 + dir * 6, yy + 3); g.lineTo(x + 16 + dir * 10, yy + 6); g.lineTo(x + 16 + dir * 6, yy + 9); g.stroke();
        }
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
        } else if (c === '>' || c === '<') {
          const f = ((c === '>' ? t : -t) * 1.6 + ty * 0.37) % 1, k = (f + 1) % 1;
          g.fillStyle = 'rgba(255,255,255,.5)';
          g.fillRect(tx * TILE + k * 26, ty * TILE + 6 + (tx % 3) * 8, 8, 1.5);
        } else if (c === 'l') {
          const a = 0.1 + 0.12 * Math.sin(t * 4 + tx * 1.7 + ty);
          g.fillStyle = `rgba(255,140,40,${a})`;
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
