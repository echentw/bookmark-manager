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
      chrome.storage.local.set({ [ChromeHelpers.Keys.Bookmarks]: data }, () => {
        // TODO: error handling
        resolve();
      });
    });
  }

  public static loadBookmarks = (): Promise<Bookmark[]> => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([ChromeHelpers.Keys.Bookmarks], result => {
        if (result[ChromeHelpers.Keys.Bookmarks]) {
          const datas: BookmarkData[] = result[ChromeHelpers.Keys.Bookmarks];
          const bookmarks: Bookmark[] = datas.map(data => new Bookmark(data));
          // TODO: error handling
          return resolve(bookmarks);
        } else {
          return resolve([]);
        }
      });
    });
  }

  public static addOnChangedListener = (handleNewBookmarks: (bookmarks: Bookmark[]) => void): void => {
    chrome.storage.onChanged.addListener((
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === 'local' && changes[ChromeHelpers.Keys.Bookmarks]) {
        const change: chrome.storage.StorageChange = changes[ChromeHelpers.Keys.Bookmarks];
        const datas: BookmarkData[] = change.newValue;
        const newBookmarks: Bookmark[] = datas.map(data => new Bookmark(data));
        handleNewBookmarks(newBookmarks);
      }
    });
  }

  public static printStorageDetails = () => {
    chrome.storage.local.getBytesInUse((bytes: number) => {
      console.log('bytes in use', bytes);
    });
    chrome.storage.local.get([ChromeHelpers.Keys.Bookmarks], result => {
      console.log('data', result);
    });
  }
}
