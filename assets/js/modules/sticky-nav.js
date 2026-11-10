/**
 * Portfolio.stickyNav — keeps the primary nav pinned to the top of the
 * viewport once the header scrolls away.
 *
 * The nav lives in a `.site-nav-slot` inside the header, so CSS
 * `position: sticky` cannot work (the header scrolls off-screen). Instead:
 * when the slot's top passes the pin offset, the nav gets `.is-stuck`
 * (position: fixed, see css/sections.css) at the same horizontal position and
 * width it had, and the slot keeps that size so the header layout never shifts.
 */
(function (Portfolio) {
  'use strict';

  const STUCK_CLASS = 'is-stuck';
  // Gap above the pinned nav, in rem; matches `top: var(--space-4)` in sections.css.
  const PIN_OFFSET_REM = 1;

  const remInPx = () => Number.parseFloat(getComputedStyle(document.documentElement).fontSize);

  function init(slot) {
    const nav = slot && slot.querySelector('.site-nav');
    if (!nav) return;

    let stuck = false;
    let frame = 0;

    const pin = () => {
      const { left, width, height } = slot.getBoundingClientRect();
      slot.style.width = `${width}px`;
      slot.style.height = `${height}px`;
      nav.style.setProperty('--nav-left', `${left}px`);
      nav.style.setProperty('--nav-width', `${width}px`);
      nav.classList.add(STUCK_CLASS);
      stuck = true;
    };

    const unpin = () => {
      nav.classList.remove(STUCK_CLASS);
      slot.style.removeProperty('width');
      slot.style.removeProperty('height');
      stuck = false;
    };

    const update = () => {
      frame = 0;
      const shouldStick = slot.getBoundingClientRect().top < PIN_OFFSET_REM * remInPx();
      if (shouldStick !== stuck) (shouldStick ? pin : unpin)();
    };

    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // The nav's size and position change with the layout (resize, fluid rem,
    // web fonts loading), so measure again from its natural place.
    const remeasure = () => {
      if (stuck) unpin();
      update();
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', remeasure);
    if (document.fonts) document.fonts.ready.then(remeasure);
    update();
  }

  Portfolio.stickyNav = { init };
})(window.Portfolio = window.Portfolio || {});
