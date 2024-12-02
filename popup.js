document.addEventListener('DOMContentLoaded', () => {
  const checkboxes = {
    removeFY: document.getElementById('removeFY')
  };

  // Load saved settings
  chrome.storage.sync.get(['removeFY'], (data) => {
    checkboxes.removeFY.checked = data.removeFY ?? true;
  });

  // Save settings on change
  Object.keys(checkboxes).forEach(key => {
    checkboxes[key].addEventListener('change', () => {
      chrome.storage.sync.set({ [key]: checkboxes[key].checked });
    });
  });
});
