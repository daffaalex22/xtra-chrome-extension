document.addEventListener('DOMContentLoaded', () => {
  const checkboxes = {
    removeFY: document.getElementById('removeFY'),
    removeTrends: document.getElementById('removeTrends'),
    removeExplore: document.getElementById('removeExplore')
  };

  // Load saved settings
  chrome.storage.sync.get(['removeFY', 'removeTrends', 'removeExplore'], (data) => {
    checkboxes.removeFY.checked = data.removeFY ?? true;
    checkboxes.removeTrends.checked = data.removeTrends ?? true;
    checkboxes.removeExplore.checked = data.removeExplore ?? true;
  });

  // Save settings on change
  Object.keys(checkboxes).forEach(key => {
    checkboxes[key].addEventListener('change', () => {
      chrome.storage.sync.set({ [key]: checkboxes[key].checked });
    });
  });
});
