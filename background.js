const X_HOME_URL = "https://x.com/home";

chrome.webNavigation.onCompleted.addListener(async (details) => {
  const { removeFY } = await chrome.storage.sync.get("removeFY");
  if (!removeFY) return

  await chrome.scripting.insertCSS({
    files: ["for-you.css"],
    target: { tabId: details.tabId }
  })
}, { url: [{ urlEquals: X_HOME_URL }] });

chrome.storage.sync.onChanged.addListener(async ({ removeFY }) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if(tab?.url !== X_HOME_URL) return

  if (removeFY.newValue) {
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
  } else {
    await chrome.scripting.removeCSS({
      files: ["for-you.css"],
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