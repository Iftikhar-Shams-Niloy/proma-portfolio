/**
 * Portfolio.counters — count-up numbers.
 *
 * Markup: <strong data-count-to="3.64" data-decimals="2">3.64</strong>
 * The final value is written in the HTML (so it reads correctly without JS);
 * on load it counts up from zero over 1.2s with an ease-out-cubic curve.
 */
(function (Portfolio) {
  'use strict';

  const DURATION_MS = 1200;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  function init(elements) {
    const counters = [...elements].map((element) => ({
      element,
      target: Number.parseFloat(element.dataset.countTo),
      decimals: Number.parseInt(element.dataset.decimals || '0', 10),
    })).filter(({ target }) => Number.isFinite(target));

    if (!counters.length) return;

    const render = (eased) => {
      for (const { element, target, decimals } of counters) {
        element.textContent = (target * eased).toFixed(decimals);
      }
    };

    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / DURATION_MS);
      render(easeOutCubic(progress));
      if (progress < 1) requestAnimationFrame(tick);
    };

    render(0);
    requestAnimationFrame(tick);
  }

  Portfolio.counters = { init };
})(window.Portfolio = window.Portfolio || {});
