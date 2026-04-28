(() => {
  if (window.__scrollControlLoaded) return;

  window.__scrollControlLoaded = true;
  history.scrollRestoration = "manual";

  let previousPath = location.pathname + location.search + location.hash;

  const getNavigationType = () => {
    const navigation = performance.getEntriesByType("navigation")[0];
    return navigation && "type" in navigation ? navigation.type : null;
  };

  const reloadCurrentRoute = () => {
    location.reload();
  };

  window.addEventListener("pageshow", (event) => {
    const navigationType = getNavigationType();

    if (event.persisted || navigationType === "back_forward") {
      reloadCurrentRoute();
      return;
    }

    if (navigationType === "reload") {
      scrollTo(0, 0);
    }
  });

  window.addEventListener("popstate", () => {
    requestAnimationFrame(() => {
      const nextPath = location.pathname + location.search + location.hash;

      if (nextPath !== previousPath) {
        reloadCurrentRoute();
        return;
      }

      previousPath = nextPath;
    });
  });
})();
