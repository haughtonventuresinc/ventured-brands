(function () {
  function hideOverlays() {
    try {
      var overlaySelectors = ['.preloader', '.menu-overlay'];
      overlaySelectors.forEach(function (selector) {
        var nodes = document.querySelectorAll(selector);
        if (!nodes || nodes.length === 0) return;
        nodes.forEach(function (el) {
          el.style.transition = 'opacity 200ms ease';
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          // Remove from layout shortly after fade
          setTimeout(function () {
            el.style.display = 'none';
            el.setAttribute('aria-hidden', 'true');
          }, 250);
        });
      });
    } catch (e) {
      // noop
    }
  }

  function removeSafetyCss() {
    try {
      var styleEl = document.getElementById('preloader-safety-css');
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    } catch (_) { /* noop */ }
  }

  // Try multiple signals to ensure it hides
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(hideOverlays, 50);
    setTimeout(removeSafetyCss, 60);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(hideOverlays, 50);
      setTimeout(removeSafetyCss, 60);
    });
  }

  window.addEventListener('load', function () {
    hideOverlays();
    // Double-check after a short delay in case animations re-show it
    setTimeout(hideOverlays, 300);
    setTimeout(removeSafetyCss, 350);
  });

  // Handle BFCache restores (back/forward nav)
  window.addEventListener('pageshow', function () {
    setTimeout(hideOverlays, 50);
    setTimeout(hideOverlays, 300);
    setTimeout(removeSafetyCss, 60);
    setTimeout(removeSafetyCss, 320);
  });

  // Fallback retries to be extra robust
  setTimeout(hideOverlays, 1000);
  setTimeout(hideOverlays, 2000);
  setTimeout(removeSafetyCss, 1000);
  setTimeout(removeSafetyCss, 2000);
})();
