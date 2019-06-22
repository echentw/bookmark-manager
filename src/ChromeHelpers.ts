import { Bookmark } from './Bookmark';

export interface TabInfo {
  url: string;
  title: string;
  faviconUrl?: string;
}

export class ChromeHelpers {

  public static getTabInfos = (): Promise<TabInfo[]> => {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({}, (tabs: chrome.tabs.Tab[]) => {
        const infos: TabInfo[] = tabs.map((tab: chrome.tabs.Tab) => ({
          url: tab.url,
          title: tab.title,
          faviconUrl: tab.favIconUrl,
        }));
        resolve(infos);
      });
    });
  }

  public static saveBookmarks = (bookmarks: Bookmark[]): void => {
    // TODO: implement me!
  }

}
