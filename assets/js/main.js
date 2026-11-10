/**
 * Entry point — wires up the interactive parts of the page.
 * Loaded last with `defer`, so the document is parsed and every
 * Portfolio.* module above has registered itself.
 */
(function (Portfolio) {
  'use strict';

  Portfolio.preferences.initThemeToggle(document.querySelector('[data-theme-toggle]'));
  Portfolio.preferences.initMotionToggle(document.querySelector('[data-motion-toggle]'));
  Portfolio.marquee.init(document.querySelector('[data-marquee]'));
  Portfolio.counters.init(document.querySelectorAll('[data-count-to]'));
  Portfolio.scrollReveal.init(document.querySelectorAll('.sr'));
  Portfolio.stickyNav.init(document.querySelector('[data-sticky-nav]'));
  Portfolio.scrollSpy.init(document.querySelectorAll('.site-nav a[href^="#"]'));
})(window.Portfolio);
