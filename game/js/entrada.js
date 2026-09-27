'use strict';

(function (LB) {
  const TECLAS = {
    ArrowUp: 'cima', KeyW: 'cima',
    ArrowDown: 'baixo', KeyS: 'baixo',
    ArrowLeft: 'esquerda', KeyA: 'esquerda',
    ArrowRight: 'direita', KeyD: 'direita',
    ShiftLeft: 'correr', ShiftRight: 'correr',
    KeyJ: 'atacar', KeyZ: 'atacar',
    KeyK: 'especial', KeyX: 'especial',
    KeyL: 'esquivar', KeyC: 'esquivar',
    KeyI: 'defender', KeyV: 'defender',
    KeyQ: 'magia', KeyU: 'magia',
    Space: 'pular',
    KeyE: 'interagir', Enter: 'interagir',
    Escape: 'pausa', KeyP: 'pausa',
  };

  const segurando = new Set();
  const apertou = new Set();
  const joystick = { ativo: false, id: null, x0: 0, y0: 0, dx: 0, dy: 0 };
  // Começa pelo tipo de tela; muda para toque ao tocar e para teclado ao digitar.
  let modoToque = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  window.addEventListener('touchstart', () => { modoToque = true; }, { passive: true, capture: true });
  window.addEventListener('keydown', () => { modoToque = false; }, { capture: true });

  function apertar(acao) {
    if (!segurando.has(acao)) apertou.add(acao);
    segurando.add(acao);
  }

  window.addEventListener('keydown', (e) => {
    const acao = TECLAS[e.code];
    if (!acao) return;
    e.preventDefault();
    if (!e.repeat) apertar(acao);
  });
  window.addEventListener('keyup', (e) => {
    const acao = TECLAS[e.code];
    if (acao) segurando.delete(acao);
  });
  window.addEventListener('blur', () => segurando.clear());

  function ligarToque() {
    const area = document.getElementById('joystick');
    const base = document.getElementById('joystick-base');
    const pino = document.getElementById('joystick-pino');
    const RAIO = 50;

    function mover(t) {
      let dx = t.clientX - joystick.x0, dy = t.clientY - joystick.y0;
      const d = Math.hypot(dx, dy);
      if (d > RAIO) { dx = dx / d * RAIO; dy = dy / d * RAIO; }
      joystick.dx = dx / RAIO; joystick.dy = dy / RAIO;
      pino.style.transform = `translate(${dx}px, ${dy}px)`;
    }

    area.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      Object.assign(joystick, { ativo: true, id: t.identifier, x0: t.clientX, y0: t.clientY, dx: 0, dy: 0 });
      base.style.left = t.clientX + 'px'; base.style.top = t.clientY + 'px';
      base.classList.add('visivel');
    }, { passive: false });
    area.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (const t of e.changedTouches) if (t.identifier === joystick.id) mover(t);
    }, { passive: false });
    const soltar = (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier !== joystick.id) continue;
        Object.assign(joystick, { ativo: false, id: null, dx: 0, dy: 0 });
        pino.style.transform = '';
        base.classList.remove('visivel');
      }
    };
    area.addEventListener('touchend', soltar);
    area.addEventListener('touchcancel', soltar);

    for (const botao of document.querySelectorAll('[data-acao]')) {
      const acao = botao.dataset.acao;
      botao.addEventListener('touchstart', (e) => {
        e.preventDefault();
        apertar(acao); botao.classList.add('ativo');
      }, { passive: false });
      const fim = (e) => { e.preventDefault(); segurando.delete(acao); botao.classList.remove('ativo'); };
      botao.addEventListener('touchend', fim);
      botao.addEventListener('touchcancel', fim);
      botao.addEventListener('mousedown', () => apertar(acao));
      botao.addEventListener('mouseup', () => segurando.delete(acao));
      botao.addEventListener('mouseleave', () => segurando.delete(acao));
    }
  }

  const BOTOES_CONTROLE = { 0: 'atacar', 1: 'esquivar', 2: 'especial', 3: 'pular', 4: 'defender', 5: 'magia', 6: 'correr', 7: 'correr', 9: 'pausa', 8: 'interagir' };
  let controleAnterior = new Set();
  let eixoControle = { x: 0, y: 0 };

  function lerControle() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const agora = new Set();
    eixoControle = { x: 0, y: 0 };
    for (const p of pads) {
      if (!p) continue;
      const x = p.axes[0] || 0, y = p.axes[1] || 0;
      if (Math.hypot(x, y) > 0.2) eixoControle = { x, y };
      p.buttons.forEach((b, i) => { if (b.pressed && BOTOES_CONTROLE[i]) agora.add(BOTOES_CONTROLE[i]); });
      if (p.buttons[12] && p.buttons[12].pressed) eixoControle.y = -1;
      if (p.buttons[13] && p.buttons[13].pressed) eixoControle.y = 1;
      if (p.buttons[14] && p.buttons[14].pressed) eixoControle.x = -1;
      if (p.buttons[15] && p.buttons[15].pressed) eixoControle.x = 1;
    }
    for (const a of agora) if (!controleAnterior.has(a)) apertou.add(a);
    controleAnterior = agora;
    return agora;
  }

  const entrada = {
    ligarToque,
    usandoToque: () => modoToque,
    quadro() { this.controle = lerControle(); },
    segura(acao) { return segurando.has(acao) || (this.controle && this.controle.has(acao)); },
    apertou(acao) { return apertou.has(acao); },
    consumir(acao) { apertou.delete(acao); },
    algumaTecla() { return apertou.size > 0; },
    limpar() { apertou.clear(); },
    // Direção do movimento (-1..1) e se está correndo.
    eixo() {
      let x = 0, y = 0;
      if (this.segura('esquerda')) x -= 1;
      if (this.segura('direita')) x += 1;
      if (this.segura('cima')) y -= 1;
      if (this.segura('baixo')) y += 1;
      let correr = this.segura('correr');
      if (joystick.ativo) {
        x = joystick.dx; y = joystick.dy;
        const m = Math.hypot(x, y);
        if (m < 0.2) { x = 0; y = 0; }
        correr = correr || m > 0.85;
      } else if (eixoControle.x || eixoControle.y) {
        x = eixoControle.x; y = eixoControle.y;
        correr = correr || Math.hypot(x, y) > 0.9;
      }
      const m = Math.hypot(x, y);
      if (m > 1) { x /= m; y /= m; }
      return { x, y, correr };
    },
  };

  LB.entrada = entrada;
})(window.LB);
