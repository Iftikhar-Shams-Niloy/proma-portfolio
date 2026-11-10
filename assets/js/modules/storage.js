/**
 * Portfolio.storage — thin, failure-tolerant wrapper around localStorage.
 * Storage can throw (private mode, blocked site data), and the page must
 * keep working without it, so every access is guarded.
 */
(function (Portfolio) {
  'use strict';

  function read(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function write(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Not persisted; the in-page state still updates.
    }
  }

  Portfolio.storage = { read, write };
})(window.Portfolio = window.Portfolio || {});
