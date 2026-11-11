/**
 * Portfolio.inboxDemo — the spam filter at work, in the Spam Ham Classifier card.
 *
 * Markup: <ol data-inbox-demo> of <li data-verdict="spam|ham"> messages taken
 * from the project's dataset. The first three carry data-row="0|1|2" in the
 * HTML, so the list reads correctly without JavaScript.
 *
 * Every few seconds the next message drops in at the top and is "scanned"
 * (data-state="scanning") before its verdict pops in; the oldest one slides
 * out at the bottom. CSS draws every state (css/project-visuals.css); this
 * module only moves the data-row / data-state attributes along.
 * Runs through Portfolio.ambient (reduced motion, pause, off-screen).
 *
 * Depends on: Portfolio.ambient
 */
(function (Portfolio) {
  'use strict';

  const VISIBLE_ROWS = 3;
  const ARRIVE_EVERY_MS = 2800;
  const SCAN_MS = 1000;

  function init(list) {
    const messages = list ? [...list.children] : [];
    const count = messages.length;
    // Needs one message on its way out and at least one waiting to come in.
    if (count < VISIBLE_ROWS + 2) return;

    let newest = 0;   // index of the message in the top row
    let elapsed = 0;  // since the newest message arrived
    let scanning = false;

    const rowOf = (index) => {
      const row = (index - newest + count) % count;
      if (row < VISIBLE_ROWS) return String(row);
      return row === VISIBLE_ROWS ? 'out' : 'queued';
    };

    const arrive = () => {
      newest = (newest - 1 + count) % count;
      messages.forEach((message, index) => {
        message.dataset.row = rowOf(index);
      });
      messages[newest].dataset.state = 'scanning';
      scanning = true;
    };

    const finishScan = () => {
      delete messages[newest].dataset.state;
      scanning = false;
    };

    Portfolio.ambient.run(list, (deltaMs) => {
      elapsed += deltaMs;
      if (scanning && elapsed >= SCAN_MS) finishScan();
      if (elapsed >= ARRIVE_EVERY_MS) {
        elapsed = 0;
        arrive();
      }
    });
  }

  Portfolio.inboxDemo = { init };
})(window.Portfolio = window.Portfolio || {});
