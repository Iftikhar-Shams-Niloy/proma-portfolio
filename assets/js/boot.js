/*
 * Boot — runs synchronously in <head>, before first paint.
 * Restores the visitor's saved theme and motion preference so the page
 * never flashes the wrong theme. Kept as a classic (non-module) script on
 * purpose; the storage keys must match js/modules/preferences.js.
 */
(function applySavedPreferences() {
  var root = document.documentElement;

  try {
    var theme = localStorage.getItem('portfolio:theme');
    var motion = localStorage.getItem('portfolio:motion');

    if (theme === 'light' || theme === 'dark') {
      root.setAttribute('data-theme', theme);
    }
    if (motion === 'paused' || motion === 'playing') {
      root.setAttribute('data-motion', motion);
    }
  } catch (error) {
    // Storage can be unavailable (private mode, blocked cookies): keep the defaults.
  }
})();
