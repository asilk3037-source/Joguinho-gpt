'use strict';

// História costurada: "Enquanto isso, no covil..." (a Bell presa com o dragão, entre os capítulos),
// chegadas nos lugares novos (vilarejo, gruta, minas, forja) e o tema que atravessa o jogo:
// luz não se rouba, se divide.
(function (LB) {
  const TAU = Math.PI * 2;
  const T = (n) => n * LB.TILE;

  // Cada fala: [quem, texto, rosto, { bell: animação, dragao: animação, brasa: 0..1 }]
  const INTERLUDIOS = {
    1: {
      sub: 'No topo da Montanha de Brasa', bell: 'BELL_TRAPPED', dragao: 'DRAGON_SLEEP', brasa: 0.15,
      falas: [
        ['Bell', 'Ai... minha cabeça. Onde eu tô?', 'surpresa'],
        ['Bell', 'Uma jaula. Sério, dragão? Uma JAULA?', 'bravo', { bell: 'BELL_ESCAPE_ATTEMPT' }],
        ['Dragão', '...zzz... frio... tanto frio...', null, { bell: 'BELL_TRAPPED' }],
        ['Bell', 'Frio? Você é um dragão de FOGO.', 'riso'],
        ['Bell', '...Igualzinho ao do meu sonho. Tremendo.', 'surpresa'],
        ['Bell', 'Tudo bem, Bell. Respira. Minha fita caiu lá embaixo, perto do portão. Eu deixei cair de propósito.', 'neutro', { bell: 'BELL_WAIT' }],
        ['Bell', 'A Line sempre acha as coisas que eu perco. Ela vem.', 'apaixonada'],
      ],
    },
    2: {
      sub: 'No covil do dragão', bell: 'BELL_WAIT', dragao: 'DRAGON_IDLE', brasa: 0.2, clarao: true,
      falas: [
        ['Bell', 'Olha lá, longe, pra baixo das nuvens... uma luz azul. Nas ruínas.', 'surpresa', { bell: 'BELL_LOOK_SIDES_FRONT' }],
        ['Bell', 'Line... é você, né?', 'apaixonada', { bell: 'BELL_WAIT' }],
        ['Dragão', 'Pequena... luz. Não... fale.'],
        ['Bell', 'Eu falo, sim. Por que você me pegou?', 'bravo'],
        ['Dragão', 'Cem anos... dormindo. O fogo... esfria. Por dentro... frio.', null, { dragao: 'DRAGON_BLINK' }],
        ['Dragão', 'Coração brilhante... aquece. Sempre... aqueceu.', null, { dragao: 'DRAGON_IDLE' }],
        ['Bell', 'Então é isso... Você não quer me machucar. Você tá com frio.', 'surpresa'],
        ['Bell', 'Mas não é assim que se esquenta alguém, sabia? Prendendo não funciona.', 'neutro'],
        ['Dragão', '...'],
      ],
    },
    3: {
      sub: 'No covil do dragão', bell: 'BELL_WAIT', dragao: 'DRAGON_IDLE', brasa: 0.35,
      falas: [
        ['Dragão', 'GRRR... frio... FRIO...', null, { dragao: 'DRAGON_ROAR' }],
        ['Bell', 'Shh... calma. Quer que eu cante? Minha vó cantava isso quando eu tinha medo do escuro.', 'sorriso', { dragao: 'DRAGON_IDLE' }],
        ['Bell', '♪ Dorme, fogo pequenino, que a noite vai passar... ♪', 'apaixonada'],
        ['Bell', '♪ Quem tem alguém do lado não precisa se apagar. ♪', 'apaixonada', { dragao: 'DRAGON_SLEEP', brasa: 0.5 }],
        ['Dragão', '...Quente. Um pouco... quente.'],
        ['Bell', 'Viu? Luz não se rouba, dragão. Se divide.', 'sorriso'],
        ['Bell', 'Quando a Line chegar, você vai entender. Ela brilha muito mais que eu.', 'apaixonada'],
      ],
    },
    4: {
      sub: 'No covil do dragão', bell: 'BELL_TRAPPED', dragao: 'DRAGON_WINGS_OPEN', brasa: 0.45,
      falas: [
        ['Dragão', 'O portão... abriu. Alguém... subindo. Espada... de luz.'],
        ['Bell', 'É ela! Eu falei que ela vinha!', 'riso', { bell: 'BELL_CALL_LINE' }],
        ['Dragão', 'Ela vai... levar... a minha luz.', null, { dragao: 'DRAGON_IDLE', bell: 'BELL_TRAPPED' }],
        ['Bell', 'Ela vai me levar pra casa. E se você deixar... ela divide um pouquinho com você.', 'neutro'],
        ['Dragão', 'Ninguém... divide. Todos... correm.'],
        ['Bell', 'A Line não corre. Você vai ver.', 'apaixonada'],
      ],
    },
  };

  function* interludio(c, j, n) {
    const d = INTERLUDIOS[n];
    const vistos = j.flags.interludios = j.flags.interludios || [];
    if (!d || vistos.includes(n)) return;
    vistos.push(n);
    j.salvar();
    const l = j.line;
    if (l) { l.correndo = false; l.anim.tocar(l.armada ? 'LINE_COMBAT_IDLE' : 'LINE_IDLE', true); }
    yield c.escurecer(1, 0.8);
    j.interludio = { n, t: 0, brasa: d.brasa, clarao: d.clarao ? 1.5 : 0, bell: new LB.Animador(d.bell), dragao: new LB.Animador(d.dragao) };
    yield c.titulo('Enquanto isso...', d.sub, 2.2);
    yield c.escurecer(0, 0.9);
    for (const [quem, texto, rosto, o] of d.falas) {
      const it = j.interludio;
      if (o && it) {
        if (o.bell) it.bell.tocar(o.bell, true);
        if (o.dragao) it.dragao.tocar(o.dragao, true);
        if (o.brasa != null) it.brasa = o.brasa;
      }
      yield c.fala(quem, texto, rosto || undefined);
    }
    yield c.espera(0.4);
    yield c.escurecer(1, 0.8);
    j.interludio = null;
    yield c.escurecer(0, 0.8);
  }

  function atualizar(j, dt) {
    const it = j.interludio;
    if (!it) return;
    it.t += dt; it.clarao = Math.max(0, it.clarao - dt * 0.35);
    it.bell.atualizar(dt); it.dragao.atualizar(dt);
  }

  // O covil visto de perto: rocha, lava, o dragão enrolado e a Bell na jaula.
  function desenhar(g, j) {
    const it = j.interludio;
    if (!it) return;
    const s = j.escala, W = j.canvas.width, H = j.canvas.height, t = it.t;
    g.save();
    g.setTransform(1, 0, 0, 1, 0, 0);
    const fundo = g.createLinearGradient(0, 0, 0, H);
    fundo.addColorStop(0, '#0c0609'); fundo.addColorStop(0.6, '#24100f'); fundo.addColorStop(1, '#3a140c');
    g.fillStyle = fundo; g.fillRect(0, 0, W, H);
    // Janela da caverna, com o céu da noite (e o clarão azul das ruínas).
    g.setTransform(s, 0, 0, s, 0, 0);
    const vw = W / s, vh = H / s, cx = vw / 2, chao = vh * 0.68;
    g.fillStyle = '#131a33'; g.beginPath(); g.ellipse(cx + 150, vh * 0.2, 60, 34, 0, 0, TAU); g.fill();
    g.fillStyle = 'rgba(255,255,255,.8)';
    for (let i = 0; i < 9; i++) g.fillRect(cx + 105 + ((i * 37) % 90), vh * 0.2 - 20 + ((i * 23) % 36), 1.4, 1.4);
    if (it.clarao > 0) { g.fillStyle = `rgba(127,214,255,${Math.min(0.9, it.clarao)})`; g.beginPath(); g.arc(cx + 132, vh * 0.2 + 16, 5 + Math.sin(t * 9) * 2, 0, TAU); g.fill(); }
    // Estalactites e estalagmites.
    g.fillStyle = '#1a0d0c';
    for (let i = 0; i < 14; i++) { const x = (i / 13) * vw, h = 30 + ((i * 53) % 50); g.beginPath(); g.moveTo(x - 18, 0); g.lineTo(x, h); g.lineTo(x + 18, 0); g.fill(); }
    for (let i = 0; i < 9; i++) { const x = (i / 8) * vw + 20, h = 24 + ((i * 41) % 40); g.beginPath(); g.moveTo(x - 16, chao + 20); g.lineTo(x, chao + 20 - h); g.lineTo(x + 16, chao + 20); g.fill(); }
    // Chão e lava ao fundo.
    g.fillStyle = '#2a1512'; g.fillRect(0, chao, vw, vh - chao);
    const k = 0.5 + 0.5 * Math.sin(t * 2.2);
    const lava = g.createLinearGradient(0, vh - 26, 0, vh);
    lava.addColorStop(0, `rgba(255,120,30,${0.55 + 0.25 * k})`); lava.addColorStop(1, 'rgba(255,60,10,.9)');
    g.fillStyle = lava; g.fillRect(0, vh - 26, vw, 26);
    // O dragão, à esquerda, olhando para a jaula.
    const dx = cx - 70, dy = chao + 14;
    const sd = it.dragao.estado('RIGHT', 1);
    LB.desenho.sombraChao(g, dx, dy, 90, 0.4);
    if (sd.r.sprite) LB.desenharSprite(g, sd.r, sd.quadro, dx, dy, 230);
    // O fogo dentro do peito: fraco no começo, mais quente conforme a Bell conversa com ele.
    const b = it.brasa, r = 14 + b * 30;
    const peito = g.createRadialGradient(dx + 30, dy - 70, 0, dx + 30, dy - 70, r);
    peito.addColorStop(0, `rgba(255,${150 + b * 60},80,${0.25 + b * 0.5})`); peito.addColorStop(1, 'rgba(255,90,30,0)');
    g.fillStyle = peito; g.beginPath(); g.arc(dx + 30, dy - 70, r, 0, TAU); g.fill();
    // A Bell na jaula, à direita.
    const bx = cx + 120, by = chao + 6;
    const sb = it.bell.estado('LEFT', -1);
    LB.desenho.sombraChao(g, bx, by, 16, 0.3);
    if (sb.r.sprite) LB.desenharSprite(g, sb.r, sb.quadro, bx, by, LB.ALTURA_LINE || 74);
    LB.desenho.jaula(g, bx, by + 2, false, t);
    // Brasas subindo.
    for (let i = 0; i < 18; i++) {
      const fase = (t * 0.25 + i * 0.137) % 1;
      g.fillStyle = `rgba(255,${140 + (i % 3) * 30},60,${(1 - fase) * 0.8})`;
      g.beginPath(); g.arc(((i * 71) % vw) + Math.sin(t + i) * 8, vh - fase * vh * 0.8, 1.6, 0, TAU); g.fill();
    }
    // Vinheta.
    g.setTransform(1, 0, 0, 1, 0, 0);
    const vin = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.95);
    vin.addColorStop(0, 'rgba(0,0,0,0)'); vin.addColorStop(1, 'rgba(0,0,0,.6)');
    g.fillStyle = vin; g.fillRect(0, 0, W, H);
    g.restore();
  }

  // ---------------- Chegadas nos lugares novos ----------------
  const CHEGADAS = {
    *vilarejo(c, j) {
      j.flags.vilarejoVisto = true;
      yield c.espera(0.4);
      yield c.fala('Line', 'O Vilarejo do Riacho... A Bell ama a feira daqui. Toda semana ela volta com uma planta nova.', 'sorriso');
      yield c.fala('Line', 'Alguém aqui deve ter visto pra onde o dragão foi.', 'neutro');
      j.salvar();
    },
    *gruta(c, j) {
      j.flags.grutaVista = true;
      yield c.espera(0.4);
      if (LB.mochila.temPista(j, 'carta')) yield c.fala('Line', 'A Gruta dos Ecos... a gruta da carta do Mago.', 'neutro');
      else yield c.fala('Line', 'Uma gruta... e que friozinho aqui dentro.', 'neutro');
      yield c.fala('Line', 'Beeell?', 'surpresa');
      yield c.fala('', '...Bell... ell... ll...', 'sistema');
      yield c.fala('Line', 'Só o eco. Óbvio, né, Line.', 'maroto');
      j.salvar();
    },
    *minas(c, j) {
      j.flags.minasVistas = true;
      yield c.fala('Line', 'Trilhos... carrinhos velhos... Isso aqui era uma mina.', 'surpresa');
      if (LB.mochila.tem(j, 'lanterna')) yield c.fala('Line', 'Ainda bem que eu trouxe a lanterna.', 'sorriso');
      else yield c.fala('Line', 'Lá pra dentro tá escuro demais. Uma lanterna ia bem agora.', 'neutro');
      j.salvar();
    },
    *forja(c, j) {
      j.flags.forjaVista = true;
      yield c.fala('Line', 'Uma forja... A bigorna ainda tá morna. Faz tempo que ninguém bate ferro aqui, mas a montanha não deixa esfriar.', 'surpresa');
      if ((j.flags.conversas || []).includes('bento')) yield c.fala('Line', 'Será que foi aqui que o Seu Bento aprendeu o ofício?', 'neutro');
      j.salvar();
    },
  };

  // Confere se a Line chegou num lugar que tem cena de chegada.
  function gatilhos(j) {
    if (j.cena || !j.line || j.line.estado !== 'livre' || !j.flags.prologo) return;
    const f = j.flags, id = j.mapa.id, l = j.line;
    if (id === 'vilarejo' && !f.vilarejoVisto) j.iniciarCena(CHEGADAS.vilarejo);
    else if (id === 'gruta' && !f.grutaVista) j.iniciarCena(CHEGADAS.gruta);
    else if (id === 'gruta' && !f.minasVistas && l.x > T(35)) j.iniciarCena(CHEGADAS.minas);
    else if (id === 'montanha' && !f.forjaVista) {
      const bigorna = j.mapa.props.find((p) => p.tipo === 'bigorna');
      if (bigorna && Math.hypot(bigorna.x - l.x, bigorna.y - l.y) < 150) j.iniciarCena(CHEGADAS.forja);
    }
  }

  LB.interludio = { INTERLUDIOS, CHEGADAS, interludio, atualizar, desenhar, gatilhos };
  LB.HISTORIA.interludio = interludio;
  Object.assign(LB.HISTORIA, { chegadaVilarejo: CHEGADAS.vilarejo, chegadaGruta: CHEGADAS.gruta, chegadaMinas: CHEGADAS.minas, chegadaForja: CHEGADAS.forja });
})(window.LB);
