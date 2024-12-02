const X_HOME_URL = "https://x.com/home";

chrome.webNavigation.onCompleted.addListener(async (details) => {
  const { removeFY, removeTrends, removeExplore } = await chrome.storage.sync.get(["removeFY", "removeTrends", "removeExplore"]);

  if (!removeFY && !removeTrends && !removeExplore) return

  if (removeFY) {
    await chrome.scripting.insertCSS({
      files: ["for-you.css"],
      target: { tabId: details.tabId }
    })
  }

  if (removeTrends) {
    await chrome.scripting.insertCSS({
      files: ["trends.css"],
      target: { tabId: details.tabId }
    })
  }

  if (removeTrends) {
    await chrome.scripting.insertCSS({
      files: ["explore.css"],
      target: { tabId: details.tabId }
    })
  }

}, { url: [{ urlEquals: X_HOME_URL }] });

chrome.storage.sync.onChanged.addListener(async ({ removeFY, removeTrends, removeExplore }) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if(tab?.url !== X_HOME_URL) return

  // Debugging
  await chrome.scripting.executeScript({
    func: logger,
    args: [{removeFY, removeTrends, removeExplore}],
    target: { tabId: tab.id }
  })

  if (removeFY?.newValue === true) {
    // Deleting the `For you` tab
    await chrome.scripting.insertCSS({
      files: ["for-you.css"],
      target: { tabId: tab.id }
    })

    // Selecting the `Following` tab
    await chrome.scripting.executeScript({
      func: clickFollowingTab,
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
  }
})

// Used to select the `Following` tab
const clickFollowingTab = (selector) => {
  const element = document.querySelector(selector);
  if (element) {
    element.click();
  } else {
    console.log(`Element ${selector} not found!`);
  }
}

const logger = ({ var1, var2, var3 }) => {
  console.log("var1", var1);
  console.log("var2", var2);
  console.log("var3", var3);
}