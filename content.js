let observer;

const isAdPost = (post) => {
  if (!post) return false

  if (post.nodeType !== Node.ELEMENT_NODE) return false 
  if (post.getAttribute("data-testid") !== "cellInnerDiv") return false

  const span = post.querySelectorAll('article div[dir="ltr"] > span')[3];
  if (span?.textContent === "Ad") return true

  return false
}

const blockNewAds = (mutationsList, observer) => {
  for (let mutation of mutationsList) {
    // If the mutation isn't a new post
    if (
      mutation.type !== 'childList' ||
      mutation.addedNodes.length <= 0
    ) continue

    mutation.addedNodes.forEach(node => {
      // If it's an ad post
      if (isAdPost(node)) {
        console.log("[Xtra] An ad is removed")
        node.style.display = "none";
      }
    });
  }
};

const removeExistingAds = () => {
  const posts = document.querySelectorAll('div[data-testid="cellInnerDiv"]');
  posts?.forEach(p => {
    if (isAdPost(p)) {
      console.log("[Xtra] An ad is removed")
      p.style.display = "none";
    }
  });
}

const observeAndBlockAds = () => {
  removeExistingAds();

  if (!observer) observer = new MutationObserver(blockNewAds);

  observer.observe(document.body, { childList: true, subtree: true });
  console.log('[Xtra] Adblocker activated');
}

const stopObserver = () => {
  if (!observer) return;
  
  observer.disconnect();
  console.log('[Xtra] Adblocker deactivated')
}

chrome.storage.sync.get('blockAds', ({ blockAds }) => {
  blockAds ? observeAndBlockAds() : null
})

chrome.storage.sync.onChanged.addListener(async ({ blockAds }) => {
  if (typeof blockAds?.newValue != "boolean") return

  blockAds.newValue ? observeAndBlockAds() : stopObserver()
});
