/**
 * Portfolio.ambient — the frame loop behind the JavaScript-driven ambient
 * demos (the sensor trace and the inbox in the project cards).
 *
 * CSS loops are paused by css/motion.css; JS loops use this so they follow
 * the same rules: nothing runs under prefers-reduced-motion, everything
 * freezes while ambient motion is paused (<html data-motion="paused">), and a
 * demo only runs while it is on screen.
 */
(function (Portfolio) {
  'use strict';

  // Longest step a demo is ever asked to take, so it never jumps ahead after
  // a background tab or a long frame.
  const MAX_STEP_MS = 100;

  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /** Calls `onFrame(deltaMs)` on every animation frame while `element` should animate. */
  function run(element, onFrame) {
    if (!element) return;

    let onScreen = !('IntersectionObserver' in window);
    let frame = 0;
    let last = 0;

    const shouldRun = () =>
      onScreen && root.dataset.motion !== 'paused' && !reducedMotion.matches;

    const tick = (now) => {
      onFrame(Math.max(0, Math.min(now - last, MAX_STEP_MS)));
      last = now;
      frame = requestAnimationFrame(tick);
    };

    const sync = () => {
      const running = frame !== 0;
      if (shouldRun() === running) return;

      if (running) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    if (!onScreen) {
      new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      }).observe(element);
    }

    new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-motion'] });
    reducedMotion.addEventListener('change', sync);
    sync();
  }

  Portfolio.ambient = { run };
})(window.Portfolio = window.Portfolio || {});
