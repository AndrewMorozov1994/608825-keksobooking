'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var lastTimeout;
  var debounce = function (fun) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
  };

  window.debounce = debounce;
})();
