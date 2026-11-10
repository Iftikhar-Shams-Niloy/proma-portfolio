/**
 * Portfolio.marquee — the infinite skills carousel.
 *
 *  1. Fills the track with enough copies of the items that the loop never
 *     shows a gap, however wide the screen is, and tells the CSS how many
 *     copies there are (--marquee-sets) so the `marq` animation moves by
 *     exactly one copy. Copies are hidden from assistive tech, and dropped
 *     under reduced motion (.dup).
 *  2. Eases the carousel to a stop on hover (and back up to speed on leave)
 *     over 500ms, instead of halting instantly.
 */
(function (Portfolio) {
  'use strict';

  const EASE_DURATION_MS = 500;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  /** Number of copies needed: the track must outlast the marquee by one full copy. */
  function setsNeeded(marquee, track, items) {
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const period = items.reduce((width, item) => width + item.offsetWidth + gap, 0);
    if (period <= 0) return 2;
    return Math.max(2, Math.ceil((marquee.clientWidth + gap) / period) + 1);
  }

  function createFiller(marquee, track) {
    const items = [...track.children];
    let sets = 1;

    return function fill() {
      const needed = setsNeeded(marquee, track, items);
      for (; sets < needed; sets += 1) {
        track.append(...items.map((item) => {
          const copy = item.cloneNode(true);
          copy.classList.add('dup');
          copy.setAttribute('aria-hidden', 'true');
          return copy;
        }));
      }
      track.style.setProperty('--marquee-sets', String(sets));
    };
  }

  function createSpeedEaser(track) {
    let frame = 0;

    return function easeTo(targetRate) {
      cancelAnimationFrame(frame);

      // Absent when animations are disabled (prefers-reduced-motion).
      const [animation] = track.getAnimations();
      if (!animation) return;

      const fromRate = animation.playbackRate;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min(1, (now - start) / EASE_DURATION_MS);
        animation.playbackRate = fromRate + (targetRate - fromRate) * easeOutCubic(progress);
        if (progress < 1) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    };
  }

  function init(marquee) {
    const track = marquee && marquee.querySelector('.track');
    if (!track) return;

    const fill = createFiller(marquee, track);
    fill();
    // Wider window → may need more copies (copies are never removed).
    if ('ResizeObserver' in window) new ResizeObserver(fill).observe(marquee);

    const easeTo = createSpeedEaser(track);
    marquee.addEventListener('mouseenter', () => easeTo(0));
    marquee.addEventListener('mouseleave', () => easeTo(1));
  }

  Portfolio.marquee = { init };
})(window.Portfolio = window.Portfolio || {});
