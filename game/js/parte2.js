'use strict';

// Parte 2 — O Coração dos Elementos. Depois do “Fim?” da Parte 1 o dragão acorda de novo, mas
// para pedir ajuda: a Quimera, uma fera sem forma que se alimenta do que sobra, bebeu a luz da
// pedra e do fogo e agora envenena os guardiões da Terra, da Água e do Ar. A Bell ganhou uma parte
// da luz que a Line dividiu com o dragão e vira jogável. Cada fase tem um guardião (Terra, Água,
// Ar) e, depois dele, a junção de dois elementos (Magma, Hidra, Tempestade). No fim, a Quimera.
(function (LB) {
  const T = (n) => n * LB.TILE;
  const HISTORIA = LB.HISTORIA;
  const M = () => LB.mochila;

  // ---------------- Moradores novos ----------------
  Object.assign(LB.loja.MORADORES, {
    cora: { nome: 'Dona Cora', papel: 'Jardineira do vale', roupa: '#8a6a3a', avental: '#d8c890', cabelo: '#d8d8d0', pele: '#c98a5a', coque: true, chapeu: '#c9a24a' },
    tiao: { nome: 'Seu Tião', papel: 'Pescador do lago', roupa: '#3a6a8a', avental: null, cabelo: '#6a6a6a', pele: '#d9a070', barba: true, chapeu: '#e0c890' },
    brisa: { nome: 'Vó Brisa', papel: 'Pastora dos picos', roupa: '#b0b8d8', avental: '#f0f0f0', cabelo: '#ffffff', pele: '#f0c9a0', bengala: true },
  });

  const vencidos = (f) => ['fusaoMagma', 'fusaoLama', 'fusaoTempestade'].filter((k) => f[k]).length;

  // Falas da Parte 2 (novos moradores e os do vilarejo, que agora veem as duas juntas).
  function falas(j, m) {
    const f = j.flags, conversou = (f.conversas || []).includes(m.id);
    if (m.id === 'cora') {
      if (f.chefeTerra) return [['Dona Cora', 'As raízes voltaram a dormir quietinhas. E a minha horta nunca deu tanta cenoura!'], ['Dona Cora', 'Levem essa escama de terra com vocês. O Bento sabe o que fazer com ela.']];
      if (!conversou) return [['Dona Cora', 'Duas meninas no meu vale? Faz tempo que ninguém passa por aqui sem correr.'], ['Dona Cora', 'Desde que aquela sombra colorida desceu do céu, o Colosso ficou bravo. Ele cuidava das raízes, sabe? Agora elas saem do chão e derrubam quem corre.'], ['Bell', 'A gente vai ajudar ele, Dona Cora. Prometo.', 'sorriso'], ['Dona Cora', 'Os cristais de terra seguram a barreira dele: um na minha horta, um no campo de raízes, um no bosque do leste. Luz neles!']];
      return [['Dona Cora', 'Escrevi tudo no meu diário, deixei cair por aí de nervoso. Se acharem, leiam: ele cansa depois de bater três vezes.']];
    }
    if (m.id === 'tiao') {
      if (f.chefeAgua) return [['Seu Tião', 'O lago voltou a espelhar as estrelas! Hoje à noite eu pesco é constelação.']];
      if (!conversou) return [['Seu Tião', 'Ô de casa! Cuidado com a água, meninas: a Serpente anda brava e o lago virou sopa.'], ['Seu Tião', 'Minha vó cantava uma música pra ela dormir. Acho que ainda tenho a letra... deixei num papel lá pro lado do leste.'], ['Line', 'A Bell canta. Quem sabe a Serpente escuta.', 'sorriso'], ['Seu Tião', 'Se ela escutar, ela para. Toda fera para pra ouvir uma canção boa.']];
      return [['Seu Tião', 'As pérolas-cristal da margem seguram a parede de água da ponte. Acendam as três.']];
    }
    if (m.id === 'brisa') {
      if (f.chefeAr) return [['Vó Brisa', 'O vento voltou a soprar do jeito certo. Minhas ovelhas agradecem, meninas.']];
      if (!conversou) return [['Vó Brisa', 'Subiram até aqui sem voar? Então são das teimosas. Gosto disso.'], ['Vó Brisa', 'O Grifo era o dono do vento bom. Agora ele sopra de lado e quer derrubar todo mundo no abismo.'], ['Vó Brisa', 'Os três faróis abrem o ninho dele. E quando o vento empurrar, andem contra ele, devagar.'], ['Bell', 'Devagar e de mãos dadas. Sempre funciona.', 'apaixonada']];
      return [['Vó Brisa', 'Caiu no abismo? O vento devolve, mas dói. Olhem os riscos brancos no chão: é por onde ele sopra.']];
    }
    if (!f.parte2) return null;
    if (m.id === 'rosa' && !f.falouRosaP2) { f.falouRosaP2 = true; return [['Dona Rosa', 'Olha só! As duas juntas agora. Que coisa mais linda.'], ['Bell', 'E armadas até os dentes, Dona Rosa.', 'riso'], ['Dona Rosa', 'Então levem poção extra. Dizem que o céu anda de cor esquisita lá pro leste.']]; }
    if (m.id === 'bento' && !f.falouBentoP2) { f.falouBentoP2 = true; return [['Seu Bento', 'A moça de óculos também vai lutar? Então precisa de armadura dela.'], ['Seu Bento', 'Tenho um vestido reforçado e um manto estelar. E se me trouxerem escamas dos guardiões, eu forjo a Armadura da Aurora.']]; }
    if (m.id === 'ze' && !f.falouZeP2) { f.falouZeP2 = true; return [['Seu Zé', 'A estrada do leste abriu sozinha hoje de manhã. Faz cinquenta anos que ela tava coberta de raiz.'], ['Seu Zé', 'Lá pra lá fica o Vale das Raízes. Minha irmã, a Cora, mora lá.']]; }
    return null;
  }

  // ---------------- Documentos novos ----------------
  Object.assign(M().PISTAS, {
    diarioCora: { tipo: 'diario', titulo: 'Diário da Dona Cora', icone: '🌱', autor: 'Dona Cora, jardineira do vale', data: 'Semana passada', onde: 'Vale das Raízes, perto da horta', marca: { area: 'vale', x: 50, y: 8, rotulo: 'Ninho do Colosso' }, texto: 'Segunda: uma sombra de muitas cores passou baixinho sobre o vale. Tinha cheiro de pedra queimada.\n\nTerça: o Colosso não veio regar as raízes. Elas acordaram sozinhas e derrubaram o Zeca da carroça.\n\nQuarta: vi o Colosso de longe. Folhas pretas nas costas. Bate no chão três vezes e depois para, ofegando, com a flor do peito aberta. Coitado. Parece que dói.' },
    cancaoLago: { tipo: 'pergaminho', titulo: 'Canção das águas', icone: '🎵', autor: 'Vó do Seu Tião', data: 'Há muito tempo', onde: 'Lago Espelhado, margem leste', marca: { area: 'lago', x: 32, y: 17, rotulo: 'Ilha da Serpente' }, texto: '“Dorme, serpente, que a lua já vem,\nespelha as estrelas, não morde ninguém...”\n\nQuando a Serpente mergulha, ninguém a alcança: olha as bolhas, que ela sai debaixo delas.\n\nMas quando alguém canta pra ela, ela para pra ouvir. Toda fera para.' },
    penaGrifo: { tipo: 'objeto', titulo: 'Pena de tempestade', icone: '🪶', autor: 'Anotação da Bell', data: 'Hoje', onde: 'Picos do Vento, platô leste', marca: { area: 'picos', x: 13, y: 9, rotulo: 'Ninho do Grifo' }, texto: 'Uma pena enorme, cinza por cima e branca por baixo. Dá choquinho quando encosta.\n\nO Grifo voa alto demais pra espada da Line. Mas as minhas estrelas sobem!\n\nE quando cansa, ele pousa. Aí é com ela.' },
  });
  M().ORDEM_PISTAS.push('diarioCora', 'cancaoLago', 'penaGrifo');
  M().CONCLUSOES.push({ id: 'quimera', requer: ['diarioCora', 'cancaoLago', 'penaGrifo'], texto: 'Todos os guardiões adoeceram do mesmo jeito: a sombra de muitas cores. A Quimera morde, rouba a luz e deixa o resto bravo.', efeito: 'Os chefes ficam cansados um ataque mais cedo.' });

  // ---------------- Abertura ----------------
  HISTORIA.parte2Abertura = function* (c, j) {
    const line = j.line;
    const f = j.flags;
    // Manhã seguinte, na fazenda.
    const hoje = Math.floor(LB.relogio.minutos(j) / LB.relogio.DIA) * LB.relogio.DIA;
    f.minutos = hoje + LB.relogio.DIA + 7 * 60;
    const bell = j.criarBell(line.x / LB.TILE + 1.2, line.y / LB.TILE + 0.2, 'LEFT');
    bell.anim.tocar('BELL_IDLE', true);
    line.dir = 'RIGHT'; line.lado = 1;
    j.cameraEm(line.x + 20, line.y - 30);
    yield c.titulo('Parte 2', 'O Coração dos Elementos', 2.8);
    yield c.fala('Bell', 'Line... você sentiu isso? O chão tremeu a noite inteira.', 'surpresa');
    line.anim.tocar('LINE_LOOK_SIDES_FRONT', true);
    yield c.fala('Line', 'E o céu tá de uma cor esquisita. Meio verde, meio roxo...', 'surpresa');
    const dr = j.criarDragaoCena(line.x + 60, line.y - 320, 300);
    dr.anim.tocar('DRAGON_FLY', true); dr.lado = -1;
    j.tremer(3, 1.2);
    yield c.voar(dr, line.x + 150, line.y - 10, 120, 1.8);
    dr.anim.tocar('DRAGON_LAND', true);
    yield c.voar(dr, line.x + 150, line.y - 10, 0, 0.8);
    j.tremer(6, 0.4);
    j.particulas.emitir('poeira', dr.x, dr.y, 24, { vel: 140, vida: 0.8, r: 6 });
    LB.fx.emitir(j, 'FX_DUST', dr.x, dr.y - 10);
    dr.anim.tocar('DRAGON_TALK', true);
    line.anim.tocar('LINE_SWORD_DRAW', true);
    yield c.fala('Line', 'Bell, pra trás de mim!', 'bravo');
    bell.anim.tocar('BELL_CALL_LINE', true);
    yield c.fala('Bell', 'Espera! Olha os olhos dele. Não é o mesmo olhar.', 'neutro');
    yield c.camera(dr.x - 40, dr.y - 80, 1);
    yield c.fala('Dragão', 'Pequena luz... e a moça que canta. Perdão pelo susto.');
    yield c.fala('Dragão', 'Acordei com frio de novo. Mas não é o meu frio. Alguém está roubando o calor do mundo.');
    yield c.fala('Dragão', 'Há mil anos, cinco guardiões cuidavam dos elementos. Pedra, Fogo, Terra, Água e Ar. O Guardião de Pedra das ruínas... e eu, o Fogo.');
    yield c.fala('Dragão', 'Quando vocês nos venceram sem ódio, as nossas luzes ficaram soltas. E uma coisa velha, sem forma, bebeu o que sobrou: a Quimera.');
    yield c.fala('Line', 'Uma Quimera... tipo um monstro feito de pedaços?', 'surpresa');
    yield c.fala('Dragão', 'De pedaços dos outros. Agora ela vai atrás dos três guardiões que faltam: o Colosso, no Vale das Raízes. A Serpente, no Lago Espelhado. O Grifo, nos Picos do Vento.');
    yield c.fala('Dragão', 'Ela morde, envenena, e o que rouba de dois elementos vira uma fera nova. Se juntar todos... o mundo esfria de vez.');
    line.anim.tocar('LINE_DETERMINED', true);
    yield c.fala('Line', 'Então eu liberto os guardiões e paro a Quimera.', 'bravo');
    bell.anim.tocar('BELL_DETERMINED', true);
    yield c.fala('Bell', '“Eu”? Dessa vez eu vou junto.', 'maroto');
    yield c.fala('Line', 'Bell, é perigoso...', 'surpresa');
    yield c.fala('Bell', 'Line. Eu passei três dias numa gaiola cantando pra um dragão. Eu vou junto.', 'bravo');
    yield c.fala('Dragão', 'E ela pode. Quando a pequena luz dividiu a luz comigo, uma parte ficou na moça que canta. Olhe as mãos dela.');
    yield c.camera(bell.x, bell.y - 40, 0.8);
    for (let i = 0; i < 8; i++) { j.particulas.emitir('brilho', bell.x + (Math.random() - 0.5) * 20, bell.y - 36, 3, { vel: 50, vida: 0.6, r: 4 }); yield c.espera(0.12); }
    bell.anim.tocar('BELL_HAPPY', true);
    yield c.fala('Bell', 'Estrelas... Line, eu tô segurando estrelas!', 'riso');
    yield c.fala('Dragão', 'Ela atira estrelas, e a canção dela acalma qualquer fera. Juntas, vocês brilham mais do que qualquer guardião.');
    yield c.fala('Line', 'Tá bom. Juntas. Mas quando eu disser “corre”, você corre.', 'maroto');
    yield c.fala('Bell', 'Quando você disser “corre”, a gente corre. As duas.', 'apaixonada');
    yield c.fala('Dragão', 'Eu ainda estou fraco para lutar. Fico aqui, cuidando da fazenda. Sigam para o leste do vilarejo: a estrada do vale se abriu.');
    dr.anim.tocar('DRAGON_SLEEP', true);
    f.parte2 = true; f.bellJogavel = true; f.heroina = 'line';
    f.herois = { line: null, bell: null };
    line.anim.tocar('LINE_IDLE', true); line.armada = false;
    yield c.camera(line.x + 20, line.y - 30, 0.8);
    yield c.titulo('A Bell agora é jogável!', LB.entrada.usandoToque() ? 'Toque em 🔄 para trocar entre a Line e a Bell' : 'Aperte T para trocar entre a Line e a Bell', 3.2);
    j.bell = null;
    LB.herois.aplicar(j, true);
    j.salvar();
    j.dica('bellJogavel', LB.entrada.usandoToque()
      ? 'Bell: ⚔ atira estrela · segure ⚔ para o leque de 3 estrelas de luz (acende cristais e abre a guarda dos chefes) · ✨ canção (acalma os inimigos e cura). 🔄 troca de heroína.'
      : 'Bell: J atira estrela · K leque de 3 estrelas de luz (acende cristais e abre a guarda dos chefes) · Q canção (acalma os inimigos e cura). T troca de heroína.');
    LB.mochila.atualizarBotoes(j);
  };

  // Na fazenda, depois da abertura, o dragão fica dormindo no gramado aberto ao sul do pasto (longe do celeiro e dos caminhos).
  function prepararArea(j, id) {
    if (!j.flags.parte2 || j.flags.quimeraVencida) return;
    if (id === 'fazenda' && !j.cena) {
      const dr = j.criarDragaoCena(T(34), T(29.4), 0);
      dr.anim.tocar('DRAGON_CURL_SLEEP', true); dr.lado = -1; dr.inimigo = false; dr.dormindoNaFazenda = true;
    }
  }

  // ---------------- Chegadas (primeira vez em cada lugar) ----------------
  const CHEGADAS = {
    vale: [['Bell', 'Que lugar lindo... e que raiz enorme saindo do chão!', 'surpresa'], ['Line', 'Cuidado pra não correr em cima delas. Se tropeçar, cai de cara.', 'maroto'], ['Bell', 'Olha, uma casinha com horta. Vamos perguntar pra quem mora ali.', 'sorriso']],
    fenda: [['Line', 'Tá quente aqui... quente igual à montanha.', 'surpresa'], ['Bell', 'Pedra e fogo, misturados. Line, isso é pedaço do Guardião e do dragão.', 'neutro'], ['Line', 'Então é aqui que a Quimera guardou o que roubou deles.', 'bravo']],
    lago: [['Bell', 'Um lago de verdade! Com ilha no meio e tudo!', 'riso'], ['Line', 'E com uma coisa enorme nadando embaixo da água...', 'surpresa'], ['Bell', 'Ah. Isso. Vamos perguntar pro moço do píer primeiro.', 'maroto']],
    pantano: [['Line', 'Que cheiro... Terra molhada de água ruim.', 'surpresa'], ['Bell', 'A lama tá puxando o meu sapato. Line, não para no meio da lama, tá?', 'neutro']],
    picos: [['Bell', 'A gente tá acima das nuvens, Line! ACIMA DAS NUVENS!', 'riso'], ['Line', 'E o chão acaba do nada. Segura a minha mão.', 'apaixonada'], ['Bell', 'Sempre.', 'apaixonada']],
    tempestade: [['Line', 'Chuva subindo, vento chovendo...', 'surpresa'], ['Bell', 'O lago e o vento viraram uma coisa só. Tá com raiva de tudo.', 'neutro']],
    coracao: [['Bell', 'Line... tá frio aqui. Frio de verdade.', 'surpresa'], ['Line', 'É o coração dela. Todos os elementos roubados batem aqui dentro.', 'bravo'], ['Bell', 'Então vamos devolver. Um por um.', 'bravo']],
  };

  function chegar(j, id) {
    if (!j.flags.parte2 || !CHEGADAS[id] || j.flags['visto_' + id]) return;
    j.flags['visto_' + id] = true;
    j.iniciarCena(function* (c) {
      yield c.espera(0.6);
      for (const [quem, txt, expr] of CHEGADAS[id]) yield c.fala(quem, txt, expr);
    });
  }

  // ---------------- Chefes ----------------
  const INTRO = {
    colosso: [['Colosso', 'Grrr... raízes... secas... VÃO... EMBORA...'], ['Bell', 'Ele tá doente, Line. Olha as folhas pretas nas costas.', 'neutro'], ['Line', 'Então a gente cura ele do único jeito que dá: cansando ele primeiro.', 'bravo']],
    serpente: [['Serpente', 'A água... está... suja... Ninguém... entra... no MEU lago!'], ['Bell', 'Quando ela mergulhar, olha as bolhas!', 'surpresa']],
    grifo: [['Grifo', 'O céu é MEU! Caiam, pequenas, caiam!'], ['Line', 'Bell, ele voa alto demais pra espada. Suas estrelas!', 'bravo'], ['Bell', 'Deixa comigo.', 'maroto']],
    magma: [['Titã de Magma', 'PEDRA... E... FOGO... Eu sou o que sobrou dos seus amigos, pequena luz.'], ['Line', 'Você é o que ela ROUBOU deles. Não é a mesma coisa.', 'bravo']],
    hidra: [['Hidra de Lama', 'Muitas bocas... muita fome... Terra e água vão afogar vocês duas!'], ['Bell', 'Quantas cabeças! Line, eu canto e você bate?', 'surpresa'], ['Line', 'Combinado.', 'maroto']],
    tempestade: [['Tempestade Viva', 'Chuva... vento... EU SOU O CÉU INTEIRO!'], ['Bell', 'E eu sou a que canta mais alto que trovão!', 'bravo']],
    quimera: [['Quimera', 'Então são vocês. A luz que se divide.'], ['Quimera', 'Eu não divido. Eu JUNTO. Pedra, fogo, terra, água, ar... tudo em mim.'], ['Bell', 'Você não junta nada. Você rouba.', 'bravo'], ['Line', 'E luz não se rouba. Se divide.', 'bravo'], ['Quimera', 'Então venham dividir... os pedaços de vocês!']],
  };

  HISTORIA.chefeIntro = function* (c, j, ch) {
    const line = j.line;
    line.anim.tocar(line.animParada(), true);
    yield c.camera(ch.x, ch.y - 70, 1.1);
    ch.flash = 0.3;
    j.tremer(ch.def.final ? 8 : 5, 0.6);
    j.particulas.emitir('brilho', ch.x, ch.y - 70, 20, { vel: 120, vida: 0.8, r: 5, cor: ch.cor.cor });
    yield c.titulo(ch.nome, ch.def.titulo, 2.2);
    for (const [quem, txt, expr] of INTRO[ch.id] || []) yield c.fala(quem, txt, expr);
    yield c.camera(line.x, line.y - 30, 0.7);
    ch.acordar(j);
    j.flags['luta_' + ch.id] = (j.flags['luta_' + ch.id] || 0) + 1;
  };

  // O que cada guardião diz ao ser libertado, e a recompensa.
  const LIBERTOS = {
    colosso: { escama: 'escamaTerra', falas: [['Colosso', 'A névoa... saiu da minha cabeça. Obrigado, meninas.'], ['Colosso', 'A Quimera me mordeu e eu esqueci quem eu era. A sombra que saiu de mim fugiu para o leste, para a Fenda de Magma.'], ['Colosso', 'Lá ela vai juntar a minha pedra velha com o fogo que roubou do dragão. Tomem cuidado.']], proxima: 'A sombra fugiu para a Fenda de Magma, a leste do vale.' },
    serpente: { escama: 'escamaAgua', falas: [['Serpente', 'Aaah... a água ficou limpa. Eu consigo me ver de novo.'], ['Serpente', 'Aquela canção... fazia tanto tempo que ninguém cantava pra mim.'], ['Serpente', 'A parte suja de mim escorreu para o pântano, no leste. Lá ela vai virar lama com o que roubou da terra.']], proxima: 'A sujeira da Serpente escorreu para o Pântano Sombrio, a leste do lago.' },
    grifo: { escama: 'escamaAr', falas: [['Grifo', 'O vento... voltou a soprar do jeito certo. Eu me lembro do céu.'], ['Grifo', 'Pequenas corajosas. A tempestade que eu virei está presa no leste, no Olho da Tempestade.'], ['Grifo', 'Vençam a tempestade, e o caminho para o Coração dos Elementos se abre, ao norte.']], proxima: 'A tempestade que o Grifo virou está no Olho da Tempestade, a leste dos picos.' },
  };

  HISTORIA.chefeVencido = function* (c, j, e) {
    const f = j.flags, line = j.line;
    line.anim.tocar(line.animParada(), true);
    yield c.espera(1);
    if (e.id === 'quimera') { yield* HISTORIA.finalParte2(c, j, e); return; }
    yield c.camera(e.x, e.y - 60, 0.9);
    const lib = LIBERTOS[e.id];
    if (lib) {
      // O guardião volta a ser ele mesmo: luz da cor do elemento.
      for (let i = 0; i < 10; i++) { j.particulas.emitir('brilho', e.x + (Math.random() - 0.5) * 80, e.y - 30 - Math.random() * 80, 3, { vel: 40, vz: 40, vida: 1, r: 5 }); yield c.espera(0.1); }
      for (const [quem, txt, expr] of lib.falas) yield c.fala(quem, txt, expr);
      f.coracoes = (f.coracoes || 0) + 1;
      line.hpMax = j.hpMaxLine(); line.hp = line.hpMax;
      M().dar(j, lib.escama, 1);
      M().aviso('❤️ +1 coração para as duas! Escama de guardião guardada na mochila.');
      yield c.fala('Line', 'Obrigada! A gente vai atrás dela.', 'sorriso');
      if (lib.proxima) j.dica('proxima_' + e.id, lib.proxima);
    } else {
      // Uma junção desfeita: os dois elementos voltam para casa.
      j.flashTela = 0.4;
      for (let i = 0; i < 12; i++) { j.particulas.emitir('brilho', e.x, e.y - 60, 4, { vel: 160, vida: 0.9, r: 5 }); yield c.espera(0.08); }
      yield c.fala('Bell', 'Os pedaços estão voltando pra casa... olha as luzes indo embora!', 'riso');
      f.portalCoracao = vencidos(f) >= 3;
      if (f.portalCoracao) {
        yield c.fala('Line', 'Foi a última junção. Agora só sobrou ela.', 'bravo');
        yield c.fala('Bell', 'O Coração dos Elementos, ao norte dos Picos do Vento. Vamos juntas.', 'bravo');
      } else yield c.fala('Line', 'Uma junção a menos. Vamos em frente.', 'bravo');
    }
    yield c.camera(line.x, line.y - 30, 0.7);
    j.salvar();
  };

  // ---------------- Final da Parte 2 ----------------
  HISTORIA.finalParte2 = function* (c, j, e) {
    const f = j.flags, line = j.line;
    yield c.camera(e.x, e.y - 80, 1);
    j.flashTela = 0.6; j.tremer(8, 1);
    const cores = [['Pedra', '#8a877b'], ['Fogo', '#e0503a'], ['Terra', '#6d8f3a'], ['Água', '#3f8fd6'], ['Ar', '#dfe8f0']];
    for (const [, cor] of cores) { j.particulas.emitir('brilho', e.x, e.y - 70, 14, { vel: 200, vida: 1.2, r: 6, cor }); yield c.espera(0.35); }
    yield c.fala('Quimera', 'Não... não levem... eu só... queria... não ficar sozinha...');
    const bell = j.criarBell(line.x / LB.TILE + 1.1, line.y / LB.TILE, 'LEFT');
    if (j.companheira) { bell.x = j.companheira.x; bell.y = j.companheira.y; j.companheira.visivel = false; }
    const heroiBell = LB.herois.ativa(j) === 'bell';
    if (heroiBell) { f.heroina = 'line'; LB.herois.aplicar(j); j.companheira = null; }
    bell.anim.tocar('BELL_IDLE', true);
    yield c.fala('Bell', 'Ninguém precisa roubar pra não ficar sozinho.', 'neutro');
    yield c.fala('Line', 'É só pedir. A gente divide.', 'apaixonada');
    for (let i = 0; i < 6; i++) { j.particulas.emitir('brilho', e.x, e.y - 60, 3, { vel: 30, vz: -20, vida: 1.4, r: 4 }); yield c.espera(0.2); }
    yield c.fala('Quimera', '...quente. É... quente.');
    yield c.escurecer(1, 1.6);
    // Epílogo: pôr do sol na fazenda, com o dragão e os guardiões no céu.
    j.epilogo();
    const dr = j.criarDragaoCena(j.duo.x + 180, j.duo.y - 20, 0);
    dr.anim.tocar('DRAGON_SLEEP', true); dr.lado = -1;
    yield c.escurecer(0, 1.8);
    yield c.fala('Bell', 'O dragão veio dormir com a gente. Olha o rabo dele enrolado no Theo.', 'riso');
    yield c.fala('Line', 'E lá no céu... cinco luzes. Uma de cada cor.', 'apaixonada');
    yield c.fala('Bell', 'Os guardiões voltaram pra casa. E a gente também.', 'apaixonada');
    yield c.fala('Line', 'Bell... obrigada por vir junto.', 'apaixonada');
    yield c.fala('Bell', 'Da próxima vez, sou eu que salvo você.', 'maroto');
    yield c.fala('Line', 'Combinado. Mas só se for de mãos dadas.', 'riso');
    const par = j.duo;
    if (c.duo('LINE_BELL_DANCE', par.x, par.y)) { yield c.espera(3.2); j.duo = par; }
    j.particulas.emitir('coracao', par.x, par.y - 60, 6, { vel: 25, vida: 2 });
    LB.fx.emitir(j, 'FX_HEARTS', par.x, par.y - 74, { sobe: 12, dur: 2 });
    yield c.espera(2);
    yield c.titulo('Fim da Parte 2', 'O Coração dos Elementos · Obrigada por jogar!', 4);
    f.quimeraVencida = true; f.zeradoParte2 = true; f.heroina = 'line';
    j.salvar();
    yield c.escurecer(1, 1.4);
    j.voltarAoMenu();
  };

  // ---------------- Objetivo ----------------
  function objetivo(j) {
    const f = j.flags;
    if (f.quimeraVencida) return 'O mundo está em paz. Explore, complete o caderno e ache todos os baús.';
    if (!f.chefeTerra) return !f.visto_vale ? 'Ir ao Vale das Raízes, pela estrada a leste do Vilarejo do Riacho.' : `Acender os três cristais de terra (${acesos(f, 'vale', ['15,6', '15,34', '45,35'])}/3) e libertar o Colosso, no nordeste do vale.`;
    if (!f.fusaoMagma) return 'Descer à Fenda de Magma, a leste do vale, e vencer o Titã de Magma (pedra + fogo).';
    if (!f.chefeAgua) return !f.visto_lago ? 'Subir ao Lago Espelhado, pela estrada ao norte do vale.' : `Acender as três pérolas-cristal (${acesos(f, 'lago', ['12,37', '12,6', '55,10'])}/3) e libertar a Serpente, na ilha do lago.`;
    if (!f.fusaoLama) return 'Entrar no Pântano Sombrio, a leste do lago, e vencer a Hidra de Lama (terra + água).';
    if (!f.chefeAr) return !f.visto_picos ? 'Subir aos Picos do Vento, pela estrada ao norte do lago.' : `Acender os três faróis do vento (${acesos(f, 'picos', ['47,28', '8,28', '58,6'])}/3) e libertar o Grifo, no ninho a noroeste.`;
    if (!f.fusaoTempestade) return 'Atravessar para o Olho da Tempestade, a leste dos picos, e vencer a Tempestade Viva (água + ar).';
    return 'Entrar no Coração dos Elementos, ao norte dos Picos do Vento, e vencer a Quimera Primordial.';
  }
  function acesos(f, area, lista) { return (f.luz || []).filter((k) => lista.map((p) => area + ':' + p).includes(k)).length; }

  LB.parte2 = { falas, prepararArea, chegar, objetivo, CHEGADAS, INTRO, LIBERTOS };
})(window.LB);
