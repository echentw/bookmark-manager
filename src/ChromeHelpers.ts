import { Bookmark, BookmarkData } from './Bookmark';
import { Folder, FolderData } from './Folder';
import { AppState } from './components/AppComponent';

export interface TabInfo {
  url: string;
  title: string;
  faviconUrl?: string;
}

export class ChromeHelpers {

  public static Keys = {
    AppData: 'AppData',
  };

  public static getOpenTabs = (): Promise<TabInfo[]> => {
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

  public static saveAppState = (appState: AppState): Promise<{}> => {
    const folders = [
      new Folder({
        id: 'cool-folder-id',
        name: 'General',
        bookmarks: appState.bookmarksState.bookmarks,
      }),
    ];

    const folderDatas = folders.map(folder => folder.toData());

    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [ChromeHelpers.Keys.AppData]: folderDatas }, () => {
        // TODO: error handling
        resolve();
      });
    });
  }

  public static loadAppState = (): Promise<Folder[]> => {
    // TODO: error handling
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([ChromeHelpers.Keys.AppData], result => {
        if (result[ChromeHelpers.Keys.AppData]) {
          const folderDatas: FolderData[] = result[ChromeHelpers.Keys.AppData];
          const folders: Folder[] = folderDatas.map(data => Folder.fromData(data));
          return resolve(folders);
        } else {
          const initialFolders: Folder[] = [
            new Folder({
              id: 'cool-folder-id',
              name: 'General',
              bookmarks: [],
            }),
          ];
          return resolve(initialFolders);
        }
      });
    });
  }

  public static addOnChangedListener = (handleNewAppData: (folders: Folder[]) => void): void => {
    chrome.storage.onChanged.addListener((
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === 'local' && changes[ChromeHelpers.Keys.AppData]) {
        const change: chrome.storage.StorageChange = changes[ChromeHelpers.Keys.AppData];
        const datas: FolderData[] = change.newValue;
        const newFolders: Folder[] = datas.map(data => Folder.fromData(data));
        handleNewAppData(newFolders);
      }
    });
  }

  public static printStorageDetails = () => {
    chrome.storage.local.getBytesInUse((bytes: number) => {
      console.log('bytes in use', bytes);
    });
    chrome.storage.local.get([ChromeHelpers.Keys.AppData], result => {
      console.log('data', result);
    });
  }
}
