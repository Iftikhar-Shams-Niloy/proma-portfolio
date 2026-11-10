/**
 * Portfolio.scrollSpy — marks the nav link of the section in view with
 * aria-current="location", which the CSS shows as "punched down".
 *
 * A section becomes current once its top passes an activation line 40% down
 * the viewport (above the first section, nothing is current); at the very
 * bottom of the page the last section wins. After a nav click the clicked
 * link is marked straight away and the spy waits for the smooth scroll to end,
 * so it doesn't flicker through the sections in between.
 */
(function (Portfolio) {
  'use strict';

  const ACTIVATION_LINE = 0.4;
  const CLICK_LOCK_MAX_MS = 1500;

  function init(links) {
    const targets = [...links]
      .map((link) => ({ link, section: document.querySelector(link.hash) }))
      .filter(({ section }) => section);
    if (!targets.length) return;

    let current = null;
    let locked = false;
    let unlockTimer = 0;
    let frame = 0;

    const setCurrent = (target) => {
      if (target === current) return;
      if (current) current.link.removeAttribute('aria-current');
      if (target) target.link.setAttribute('aria-current', 'location');
      current = target;
    };

    const findCurrent = () => {
      const page = document.documentElement;
      if (window.innerHeight + window.scrollY >= page.scrollHeight - 2) {
        return targets[targets.length - 1];
      }
      const line = window.innerHeight * ACTIVATION_LINE;
      let found = null;
      for (const target of targets) {
        if (target.section.getBoundingClientRect().top <= line) found = target;
      }
      return found;
    };

    const update = () => {
      frame = 0;
      if (!locked) setCurrent(findCurrent());
    };

    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const unlock = () => {
      locked = false;
      clearTimeout(unlockTimer);
      window.removeEventListener('scrollend', unlock);
      scheduleUpdate();
    };

    for (const target of targets) {
      target.link.addEventListener('click', () => {
        setCurrent(target);
        locked = true;
        clearTimeout(unlockTimer);
        // `scrollend` ends the lock where supported; the timer covers the rest
        // (and clicks that don't scroll at all).
        unlockTimer = setTimeout(unlock, CLICK_LOCK_MAX_MS);
        window.addEventListener('scrollend', unlock, { once: true });
      });
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    update();
  }

  Portfolio.scrollSpy = { init };
})(window.Portfolio = window.Portfolio || {});
