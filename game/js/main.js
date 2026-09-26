'use strict';

(function (LB) {
  const jogo = new LB.Jogo(document.getElementById('tela'));
  LB.jogo = jogo;

  LB.carregarSprites((p) => { document.getElementById('progresso').style.width = Math.round(p * 100) + '%'; })
    .then(() => {
      document.getElementById('carregando').remove();
      LB.ui.iniciar(jogo);
    });

  let antes = performance.now();
  function quadro(agora) {
    const dt = Math.min(0.05, (agora - antes) / 1000);
    antes = agora;
    jogo.atualizar(dt);
    jogo.desenhar();
    requestAnimationFrame(quadro);
  }
  requestAnimationFrame(quadro);
})(window.LB);
