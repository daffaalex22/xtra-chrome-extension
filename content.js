const isAdPost = (post) => {
  if (!post) return false

  const span = post.querySelectorAll('article div[dir="ltr"] > span')[3];
  if (span?.textContent === "Ad") return true

  return false
}

const adsRemover = (mutationsList, observer) => {
  for (let mutation of mutationsList) {
    // If the mutation isn't a new post
    if (
      mutation.type !== 'childList' ||
      mutation.addedNodes.length <= 0
    ) continue

    mutation.addedNodes.forEach(node => {
      // If it's an ad post
      if (
        node.nodeType === Node.ELEMENT_NODE && 
        node.getAttribute("data-testid") == "cellInnerDiv" &&
        isAdPost(node)
      ) {
        console.log("[Xtra] An ad is removed")
        node.style.display = "none";
      }
    });
  }
};

const observer = new MutationObserver(adsRemover);
observer.observe(document.body, { childList: true, subtree: true });