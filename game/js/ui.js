'use strict';

(function (LB) {
  const $ = (s) => document.querySelector(s);
  let jogo = null;

  function mostrar(id) {
    for (const el of document.querySelectorAll('.overlay')) el.classList.add('oculto');
    if (id) $(id).classList.remove('oculto');
  }

  const ui = {
    iniciar(j) {
      jogo = j;
      $('#btn-novo').onclick = () => {
        if (jogo.temSave() && !confirm('Começar do zero? O progresso salvo será apagado.')) return;
        mostrar(null); jogo.novoJogo();
      };
      $('#btn-continuar').onclick = () => { mostrar(null); jogo.continuar(); };
      $('#btn-galeria').onclick = () => { mostrar('#galeria'); galeria.abrir(); };
      $('#btn-controles').onclick = () => { this.voltarPara = '#menu'; mostrar('#controles'); };
      $('#btn-voltar-controles').onclick = () => mostrar(this.voltarPara || '#menu');
      $('#btn-voltar-galeria').onclick = () => { galeria.fechar(); mostrar('#menu'); };
      $('#btn-retomar').onclick = () => this.retomar();
      $('#btn-pausa-controles').onclick = () => { this.voltarPara = '#pausa'; mostrar('#controles'); };
      $('#btn-pausa-menu').onclick = () => { mostrar(null); jogo.voltarAoMenu(); };
      $('#btn-tentar').onclick = () => { jogo.line.hp = jogo.line.hpMax; jogo.tentarDeNovo(); };
      $('#btn-derrota-menu').onclick = () => { $('#derrota').classList.add('oculto'); jogo.voltarAoMenu(); };
      $('#btn-pausar').addEventListener('click', () => { if (jogo.estado === 'jogo') this.pausar(); });
      $('#pular-cena').addEventListener('click', () => { if (jogo.cena) jogo.cena.pular(); });
      $('#btn-tela-cheia').onclick = () => {
        const el = document.documentElement;
        if (document.fullscreenElement) document.exitFullscreen();
        else if (el.requestFullscreen) el.requestFullscreen().then(() => screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape').catch(() => {})).catch(() => {});
      };
      document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && jogo.estado === 'pausa') this.retomar();
        else if (e.code === 'Tab' && jogo.cena) { e.preventDefault(); jogo.cena.pular(); }
      });
      LB.entrada.ligarToque();
      LB.dialogo.ligar();
      this.mostrarMenu();
    },

    mostrarMenu() {
      $('#btn-continuar').style.display = jogo.temSave() ? '' : 'none';
      $('#toque').classList.add('oculto');
      $('#pular-cena').classList.add('oculto');
      $('#dica').classList.add('oculto');
      mostrar('#menu');
    },

    pausar() {
      if (jogo.estado !== 'jogo') return;
      jogo.estado = 'pausa';
      mostrar('#pausa');
    },

    retomar() {
      mostrar(null);
      jogo.estado = 'jogo';
      LB.entrada.limpar();
    },

    atualizarToque(j) {
      const toque = LB.entrada.usandoToque();
      $('#toque').classList.toggle('oculto', !toque || j.estado !== 'jogo');
      const l = j.line;
      const botoesCombate = l && l.temEspada;
      for (const id of ['#b-especial', '#b-defender']) $(id).classList.toggle('apagado', !botoesCombate);
      $('#b-magia').classList.toggle('oculto', !(l && l.temMagia));
      $('#b-interagir').classList.toggle('oculto', !(j.textoPrompt && !j.promptFinal));
      if (j.textoPrompt) $('#b-interagir').textContent = j.textoPrompt;
      $('#toque').classList.toggle('em-cena', !!j.cena);
    },
  };

  // ---------- Galeria de animações ----------
  const galeria = {
    abrir() {
      const inv = LB.inventario();
      let prontas = 0, total = 0;
      const lista = $('#galeria-lista');
      lista.innerHTML = '';
      for (const g of inv) {
        const sec = document.createElement('section');
        const feitas = g.itens.filter((i) => i.existe).length;
        prontas += feitas; total += g.itens.length;
        sec.innerHTML = `<h3>${g.nome} <small>${feitas}/${g.itens.length}</small></h3>`;
        const ul = document.createElement('div'); ul.className = 'itens';
        for (const it of g.itens) {
          const b = document.createElement('button');
          b.className = 'item ' + (it.existe ? 'pronta' : 'falta');
          b.innerHTML = `<span class="st">${it.existe ? '✔' : '○'}</span><span class="cod">${it.codigo}</span><span class="desc">${it.desc || ''}${it.nova ? ' · <em>sugestão nova</em>' : ''}</span>`;
          b.onclick = () => {
            for (const x of lista.querySelectorAll('.item.sel')) x.classList.remove('sel');
            b.classList.add('sel');
            this.previa(it.codigo);
          };
          ul.appendChild(b);
        }
        sec.appendChild(ul);
        lista.appendChild(sec);
      }
      $('#galeria-total').textContent = `${prontas} de ${total} animações prontas`;
      this.previa('LINE_IDLE_FRONT');
      this.rodando = true;
      let antes = performance.now();
      const passo = (agora) => {
        if (!this.rodando) return;
        this.anim.atualizar(Math.min(0.1, (agora - antes) / 1000)); antes = agora;
        this.desenhar();
        requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    },

    fechar() { this.rodando = false; },

    previa(codigo) {
      const m = codigo.match(/^(.*)_(FRONT|BACK|LEFT|RIGHT)$/);
      const familia = m && LB.CATALOGO[m[1]] && LB.CATALOGO[m[1]].dir;
      this.codigo = codigo;
      this.base = familia ? m[1] : codigo;
      this.dir = familia ? m[2] : null;
      this.lado = this.dir === 'LEFT' ? -1 : 1;
      this.anim = new LB.Animador(this.base);
      if (!LB.info(this.base).loop) {
        const original = this.anim.estado.bind(this.anim);
        this.anim.estado = (d, l) => { const s = original(d, l); if (s.acabou) this.anim.t = 0; return s; };
      }
      const r = LB.resolver(this.base, this.dir, this.lado);
      $('#galeria-nome').textContent = codigo;
      let info;
      if (r.sprite && r.codigo === codigo) info = `${r.sprite.seq.length} quadros · ${r.sprite.item}`;
      else if (r.sprite) info = `Ainda não existe. Enquanto isso o jogo usa ${r.codigo}${r.flip ? ' espelhada' : ''}.`;
      else info = 'Ainda não existe. O jogo usa um desenho provisório.';
      $('#galeria-info').textContent = info;
    },

    desenhar() {
      const cv = $('#galeria-previa'), g = cv.getContext('2d');
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = cv.clientWidth, h = cv.clientHeight;
      if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      const st = this.anim.estado(this.dir, this.lado);
      const x = w / 2, y = h * 0.88;
      LB.desenho.sombraChao(g, x, y, 22, 0.3);
      const t = performance.now() / 1000;
      const c = this.codigo;
      if (st.r.sprite) { LB.desenharSprite(g, st.r, st.quadro, x, y, h * 0.82); return; }
      g.save(); g.translate(x, y);
      if (c.startsWith('DRAGON')) { g.scale(0.55, 0.55); LB.desenho.dragao(g, 0, 0, { base: c, t, progresso: st.progresso, lado: 1, alturaVoo: 0 }); }
      else if (c.startsWith('SHADOW')) { g.scale(2.2, 2.2); LB.desenho.sombra(g, 0, 0, { t, estado: c.includes('ATTACK') ? 'preparar' : 'vagar' }); }
      else if (c.includes('BELL') && !c.startsWith('LINE_BELL')) { g.scale(2.2, 2.2); LB.desenho.bell(g, 0, 0, { base: c, t, dir: this.dir || 'FRONT' }); }
      else { g.fillStyle = 'rgba(255,255,255,.75)'; g.font = '600 14px system-ui'; g.textAlign = 'center'; g.fillText('Sem prévia provisória', 0, -h * 0.4); }
      g.restore();
    },
  };

  LB.ui = ui;
})(window.LB);
