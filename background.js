const X_HOME_URL = "https://x.com/home";

const ICONS = {
  BMIconLight: 'M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z',
  BMIconDark: 'M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z',
  EIconLight: 'M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z',
  EIconDark: 'M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z',
}

// chrome.runtime.onInstalled.addListener(async () => {
//   const { BMIconLight, BMIconDark, EIconLight, EIconDark } = await chrome.storage.sync.get(["BMIconLight", "BMIconDark", "EIconLight", "EIconDark"]);

//   if (!BMIconLight || !BMIconDark || EIconLight || EIconDark) {
//     chrome.storage.sync.set({
//       BMIconLight: ICONS.BMIconLight,
//       BMIconDark: ICONS.BMIconDark,
//       EIconLight: ICONS.EIconLight,
//       EIconDark: ICONS.EIconDark,
//     })
//   }
// })

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

  if (removeExplore) {
    // await chrome.scripting.executeScript({
    //   func: cloneExploreButton,
    //   target: { tabId: details.tabId }
    // })

    await chrome.scripting.executeScript({
      func: toggleBookmarksExplore,
      args: [true, ICONS],
      target: { tabId: details.tabId }
    })
  }

}, { url: [{ urlEquals: X_HOME_URL }] });

chrome.storage.sync.onChanged.addListener(async ({ removeFY, removeTrends, removeExplore }) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if(tab?.url !== X_HOME_URL) return

  // Debugging
  // await chrome.scripting.executeScript({
  //   func: logger,
  //   args: [{
  //     var1: removeFY?.newValue, 
  //     var2: removeTrends?.newValue, 
  //     var3: removeExplore?.newValue
  //   }],
  //   target: { tabId: tab.id }
  // })

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
  } else if (typeof removeExplore === 'object') {
    await chrome.scripting.executeScript({
      func: toggleBookmarksExplore,
      args: [removeExplore.newValue, ICONS],
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

// If `true` insert Bookmarks, if `false` insert Explore
const toggleBookmarksExplore = (removeExplore, icons) => {
  if (!removeExplore) {
    const bookmarksButton = document.querySelector('a[aria-label="Bookmarks"]');
    if (!bookmarksButton) return

    const newExploreButton = bookmarksButton.cloneNode(true);
    newExploreButton.setAttribute("href", "/explore");
    newExploreButton.setAttribute("data-testid", "AppTabBar_Explore_Link");
    newExploreButton.setAttribute("aria-label", "Search and explore");
  
    const exploreText = newExploreButton.querySelector('span');
    exploreText.textContent = "Explore";

    const exploreIcon = newExploreButton.querySelector('path');
    exploreIcon.setAttribute('d', icons.EIconDark);

    bookmarksButton.parentNode.replaceChild(newExploreButton, bookmarksButton);
  } else if (removeExplore) {
    const exploreButton = document.querySelector('a[aria-label="Search and explore"]');
    if (!exploreButton) return

    const newBookmarksButton = exploreButton.cloneNode(true);
    newBookmarksButton.setAttribute("href", "/i/bookmarks");
    newBookmarksButton.setAttribute("data-testid", "AppTabBar_Bookmarks_Link");
    newBookmarksButton.setAttribute("aria-label", "Bookmarks");
  
    const bookmarksText = newBookmarksButton.querySelector('span');
    bookmarksText.textContent = "Bookmarks";

    const bookmarksIcon = newBookmarksButton.querySelector('path');
    bookmarksIcon.setAttribute('d', icons.BMIconDark);

    exploreButton.parentNode.replaceChild(newBookmarksButton, exploreButton);
  }
}

const cloneExploreButton = () => {
  const alreadyCloned = document.querySelector('a[aria-label="Explore Clone"]')
  if (alreadyCloned) return

  const exploreButton = document.querySelector('a[aria-label="Search and explore"]');
  if (!exploreButton) return

  const exploreClone = exploreButton.cloneNode(true);
  exploreClone.setAttribute("aria-label", "Explore Clone");
  exploreClone.style.display = 'none !important';

  exploreButton.insertAdjacentElement('afterend', exploreClone);
}

// const logger = ({ var1, var2, var3 }) => {
//   console.log("var1", var1);
//   console.log("var2", var2);
//   console.log("var3", var3);
// }