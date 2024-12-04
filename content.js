window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  if (event.data.type && event.data.type === 'ADS_POST') {
    console.log('AdsPost', event.data.adsPosts);

    // TODO: Hide the ad posts
  }
});