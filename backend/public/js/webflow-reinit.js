(function(){
  function reinitWebflow(){
    try {
      if (window.Webflow) {
        // Trigger Webflow ready
        if (typeof window.Webflow.ready === 'function') {
          try { window.Webflow.ready(); } catch (_) {}
        }
        // Reinitialize IX2 interactions
        if (typeof window.Webflow.require === 'function') {
          try {
            var ix2 = window.Webflow.require('ix2');
            if (ix2 && typeof ix2.init === 'function') {
              ix2.init();
            }
          } catch (_) {}
        }
      }
      // Kick scroll/resize to activate scroll-based animations
      try { window.dispatchEvent(new Event('scroll')); } catch(_){}
      try { window.dispatchEvent(new Event('resize')); } catch(_){}
    } catch (e) { /* noop */ }
  }

  function scheduleReinits(){
    reinitWebflow();
    setTimeout(reinitWebflow, 100);
    setTimeout(reinitWebflow, 300);
    setTimeout(reinitWebflow, 800);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    scheduleReinits();
  } else {
    document.addEventListener('DOMContentLoaded', scheduleReinits);
  }
  window.addEventListener('load', scheduleReinits);
  window.addEventListener('pageshow', scheduleReinits);
})();
