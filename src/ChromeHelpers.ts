import { Bookmark } from './Bookmark';

export interface TabInfo {
  url: string;
  title: string;
  faviconUrl?: string;
}

export interface BookmarkData {
  id: string;
  url: string;
  faviconUrl: string;
  title: string;
  name: string;
}

export class ChromeHelpers {

  public static Keys = {
    Bookmarks: 'bookmarks',
  };

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

  public static saveBookmarks = (bookmarks: Bookmark[]): Promise<{}> => {
    const data: BookmarkData[] = bookmarks.map(bookmark => ({
      id: bookmark.id,
      url: bookmark.url,
      faviconUrl: bookmark.faviconUrl,
      title: bookmark.title,
      name: bookmark.name,
    }));

    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ [ChromeHelpers.Keys.Bookmarks]: data }, () => {
        // TODO: error handling
        resolve();
      });
    });
  }

  public static loadBookmarks = (): Promise<Bookmark[]> => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get([ChromeHelpers.Keys.Bookmarks], result => {
        const datas: BookmarkData[] = result[ChromeHelpers.Keys.Bookmarks];
        const bookmarks: Bookmark[] = datas.map(data => new Bookmark(data));
        // TODO: error handling
        resolve(bookmarks);
      });
    });
  }
}
