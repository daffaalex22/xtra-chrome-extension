// Function to remove elements based on stored preferences
chrome.storage.sync.get(['removeFY', 'removeTrends', 'removeExplore'], (prefs) => {
  if (prefs.removeFY !== false) {
    observeAndRemove('div[role="tablist"] > div[role="presentation"]:first-child');
  }

  if (prefs.removeTrends !== false) {
    observeAndRemove('div[aria-label="Trending"] > div > div:nth-child(4)');
  }

  if (prefs.removeExplore !== false) {
    observeAndRemove('nav[role="navigation"] > a:nth-child(2)');
  }
});

// Helper function for observing and removing
function observeAndRemove(selector) {
  const observer = new MutationObserver(() => {
    const element = document.querySelector(selector);
    if (element) {
      element.remove();
      if (!selector.includes("Trending")) observer.disconnect(); // Stop observing once removed
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
