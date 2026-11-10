/**
 * Portfolio.preferences — theme (light / dark) and ambient-motion
 * (playing / paused) toggles.
 *
 * State lives on <html> as data attributes, which the CSS reads:
 *   data-theme="light|dark"      → tokens.css
 *   data-motion="playing|paused" → motion.css, plus the toggle icons
 *
 * Depends on: Portfolio.storage
 */
(function (Portfolio) {
  'use strict';

  // Keep in sync with js/boot.js
  const THEME_KEY = 'portfolio:theme';
  const MOTION_KEY = 'portfolio:motion';

  const root = document.documentElement;

  /** Wires a button that flips between the light and dark themes. */
  function initThemeToggle(button) {
    if (!button) return;

    const isDark = () => root.dataset.theme === 'dark';

    const syncButton = () => {
      button.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme');
    };

    button.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      root.dataset.theme = next;
      Portfolio.storage.write(THEME_KEY, next);
      syncButton();
    });

    syncButton();
  }

  /** Wires a button that pauses / resumes the looping background animations. */
  function initMotionToggle(button) {
    if (!button) return;

    const isPaused = () => root.dataset.motion === 'paused';

    const syncButton = () => {
      const paused = isPaused();
      button.setAttribute('aria-label', paused ? 'Play background motion' : 'Pause background motion');
      button.setAttribute('aria-pressed', String(paused));
    };

    button.addEventListener('click', () => {
      const next = isPaused() ? 'playing' : 'paused';
      root.dataset.motion = next;
      Portfolio.storage.write(MOTION_KEY, next);
      syncButton();
    });

    syncButton();
  }

  Portfolio.preferences = { initThemeToggle, initMotionToggle };
})(window.Portfolio = window.Portfolio || {});
