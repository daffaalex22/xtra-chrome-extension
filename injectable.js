const originalXHR = window.XMLHttpRequest;

window.XMLHttpRequest = function() {
  const xhr = new originalXHR();

  const originalSend = xhr.send;
  xhr.send = function(...args) {
    xhr.addEventListener('load', function() {
      if (!this.responseURL.includes("HomeLatestTimeline")) return;

      const contentType = xhr.getResponseHeader('Content-Type');
      if (!contentType.includes('application/json')) return

      const responseBody = JSON.parse(this.responseText);

      const adsPosts = responseBody.data.home.home_timeline_urt.instructions[0].entries.filter((post) => {
        return post.entryId.includes('promoted-tweet');
      });

      window.postMessage({
        type: "ADS_POST",
        adsPosts
      }, "*")
    });

    originalSend.apply(this, args);
  };

  return xhr;
};