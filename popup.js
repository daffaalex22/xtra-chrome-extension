document.addEventListener('DOMContentLoaded', () => {
  const cb = {
    removeFY: document.getElementById('removeFY'),
    removeTrends: document.getElementById('removeTrends'),
    removeExplore: document.getElementById('removeExplore'),
    blockAds: document.getElementById('blockAds')
  };

  // Load saved settings
  chrome.storage.sync.get(
    ['removeFY', 'removeTrends', 'removeExplore', 'blockAds'], 
    (data) => {
    cb.removeFY.checked = data.removeFY ?? true;
    cb.removeTrends.checked = data.removeTrends ?? true;
    cb.removeExplore.checked = data.removeExplore ?? true;
    cb.blockAds.checked = data.blockAds ?? true;
  });

  // Save settings on change
  Object.keys(cb).forEach(key => {
    cb[key].addEventListener('change', () => {
      chrome.storage.sync.set({ [key]: cb[key].checked });
    });
  });
});
