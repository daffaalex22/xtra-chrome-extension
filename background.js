const X_HOME_URL = "https://x.com/home";

chrome.webNavigation.onCompleted.addListener(async (details) => {
  const { removeFY, removeTrends, removeExplore, removePaids } = await chrome.storage.sync.get(["removeFY", "removeTrends", "removeExplore", "removePaids"]);

  if (!removeFY && !removeTrends && !removeExplore && !removePaids) return

  if (removeFY) {
    await chrome.scripting.insertCSS({
      files: ["for-you.css"],
      target: { tabId: details.tabId }
    })

    await chrome.scripting.executeScript({
      func: clickElement,
      args: ['div[role="tablist"] > div[role="presentation"]:last-child > a'],
      target: { tabId: details.tabId }
    })
  }

  if (removeTrends) {
    await chrome.scripting.insertCSS({
      files: ["trends.css"],
      target: { tabId: details.tabId }
    })
  }

  if (removeExplore) {
    await chrome.scripting.insertCSS({
      files: ["explore.css"],
      target: { tabId: details.tabId }
    })
  }

  if (removePaids) {
    await chrome.scripting.insertCSS({
      files: ["paids.css"],
      target: { tabId: details.tabId }
    })
  }

}, { url: [{ urlEquals: X_HOME_URL }] });

chrome.storage.sync.onChanged.addListener(async ({ removeFY, removeTrends, removeExplore, removePaids }) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if(tab?.url !== X_HOME_URL) return

  if (removeFY?.newValue === true) {
    // Deleting the `For you` tab
    await chrome.scripting.insertCSS({
      files: ["for-you.css"],
      target: { tabId: tab.id }
    })

    // Selecting the `Following` tab
    await chrome.scripting.executeScript({
      func: clickElement,
      args: ['div[role="tablist"] > div[role="presentation"]:last-child > a'],
      target: { tabId: tab.id }
    })
  } else if (removeFY?.newValue === false) {
    await chrome.scripting.removeCSS({
      files: ["for-you.css"],
      target: { tabId: tab.id }
    })
  } else if (removeTrends?.newValue === true) {
    await chrome.scripting.insertCSS({
      files: ["trends.css"],
      target: { tabId: tab.id }
    })
  } else if (removeTrends?.newValue === false) {
    await chrome.scripting.removeCSS({
      files: ["trends.css"],
      target: { tabId: tab.id }
    })
  } else if (removeExplore?.newValue === true) {
    await chrome.scripting.insertCSS({
      files: ["explore.css"],
      target: { tabId: tab.id }
    })
  } else if (removeExplore?.newValue === false) {
    await chrome.scripting.removeCSS({
      files: ["explore.css"],
      target: { tabId: tab.id }
    })
  } else if (removePaids?.newValue === true) {
    await chrome.scripting.removeCSS({
      files: ["paids.css"],
      target: { tabId: tab.id }
    })
  } else if (removePaids?.newValue === false) {
    await chrome.scripting.removeCSS({
      files: ["paids.css"],
      target: { tabId: tab.id }
    })
  }
})

// Used to select the `Following` tab
const clickElement = (selector) => {
  const element = document.querySelector(selector);
  if (element) {
    element.click();
  } else {
    console.log(`Element ${selector} not found!`);
  }
}