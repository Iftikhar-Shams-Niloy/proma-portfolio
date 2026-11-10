/**
 * Portfolio.scrollReveal — fallback for scroll-triggered reveals.
 *
 * Browsers with scroll-driven animations (`animation-timeline: view()`) reveal
 * `.sr` elements purely in CSS. Elsewhere this adds `.reveal-fallback` to
 * <html>, which hides `.sr` elements until an IntersectionObserver marks them
 * `.is-revealed` as they scroll into view (see css/motion.css).
 */
(function (Portfolio) {
  'use strict';

  const supportsScrollTimeline = () =>
    typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init(elements) {
    const targets = [...elements];
    if (!targets.length || supportsScrollTimeline() || prefersReducedMotion()) return;
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -10% 0px' });

    document.documentElement.classList.add('reveal-fallback');
    targets.forEach((element) => observer.observe(element));
  }

  Portfolio.scrollReveal = { init };
})(window.Portfolio = window.Portfolio || {});
