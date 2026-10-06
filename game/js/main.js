'use strict';

(function (LB) {
  const jogo = new LB.Jogo(document.getElementById('tela'));
  LB.jogo = jogo;

  LB.carregarSprites((p) => { document.getElementById('progresso').style.width = Math.round(p * 100) + '%'; })
    .then(() => {
      document.getElementById('carregando').remove();
      LB.ui.iniciar(jogo);
    });

  // Resolução automática: se o quadro passa de 24 ms (menos de ~40 por segundo) por 3 s seguidos durante o
  // jogo, a resolução de desenho baixa um degrau (até a metade). Trocas de mapa e abas escondidas não contam.
  let antes = performance.now(), media = 16, lento = 0;
  function vigiar(ms) {
    if (jogo.estado !== 'jogo' || ms > 250 || document.hidden) return;
    media += (ms - media) * 0.05;
    lento = media > 24 ? lento + ms : 0;
    if (lento > 3000 && (jogo.qualidade || 1) > 0.5) {
      jogo.qualidade = Math.max(0.5, (jogo.qualidade || 1) - 0.25);
      jogo.redimensionar();
      lento = 0; media = 16;
    }
  }

  function quadro(agora) {
    vigiar(agora - antes);
    const dt = Math.min(0.05, (agora - antes) / 1000);
    antes = agora;
    jogo.atualizar(dt);
    jogo.desenhar();
    requestAnimationFrame(quadro);
  }
  requestAnimationFrame(quadro);
})(window.LB);
