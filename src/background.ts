// Open a new tab immediately after the user installs Axle.
// Welcome!
chrome.runtime.onInstalled.addListener((details: chrome.runtime.InstalledDetails) => {
  if (details.reason === 'install') {
    chrome.tabs.create({
      url: 'chrome://newtab',
      active: true,
    });
  }
});
