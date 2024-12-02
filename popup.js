document.addEventListener('DOMContentLoaded', () => {
  const cb = {
    removeFY: document.getElementById('removeFY'),
    removeTrends: document.getElementById('removeTrends')
  };

  // Load saved settings
  chrome.storage.sync.get(['removeFY', 'removeTrends'], (data) => {
    cb.removeFY.checked = data.removeFY ?? true;
    cb.removeTrends.checked = data.removeTrends ?? true;
  });

  // Save settings on change
  Object.keys(cb).forEach(key => {
    cb[key].addEventListener('change', () => {
      chrome.storage.sync.set({ [key]: cb[key].checked });
    });
  });
});
