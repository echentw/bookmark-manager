import { Bookmark, BookmarkData } from './Bookmark';
import { Folder, FolderData } from './Folder';
import { AppState } from './components/AppComponent';

// What gets returned by some methods in this class
export interface ChromeAppState {
  folders: Folder[];
  openFolderId: string;
}

export interface ChromeData {
  appData: AppData;
}

export interface AppData {
  folders: FolderData[];
  openFolderId: string;
}

export interface TabInfo {
  url: string;
  title: string;
  faviconUrl?: string;
}

export class ChromeHelpers {

  public static Keys = {
    AppData: 'appData',
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
    const { folders, openFolder } = appState.foldersState;

    const folderDatas: FolderData[] = folders.map(folder => folder.toData());
    const openFolderId = openFolder ? openFolder.id : null;

    const appData: AppData = {
      folders: folderDatas,
      openFolderId: openFolderId,
    };

    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [ChromeHelpers.Keys.AppData]: appData }, () => {
        // TODO: error handling
        resolve();
      });
    });
  }

  public static loadAppState = (): Promise<ChromeAppState> => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([ChromeHelpers.Keys.AppData], (result: ChromeData) => {
        // TODO: error handling
        if (result.appData) {
          const folderDatas: FolderData[] = result.appData.folders;
          const folders: Folder[] = folderDatas.map(data => Folder.fromData(data));
          const state: ChromeAppState = {
            folders: folders,
            openFolderId: result.appData.openFolderId,
          };
          return resolve(state);
        } else {
          const firstFolder = new Folder({
            name: 'General',
            bookmarks: [],
          });
          const initialState: ChromeAppState = {
            folders: [firstFolder],
            openFolderId: firstFolder.id,
          };
          return resolve(initialState);
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
        const newAppData: AppData = change.newValue;
        const newFolderDatas: FolderData[] = newAppData.folders;
        const newFolders: Folder[] = newFolderDatas.map(data => Folder.fromData(data));
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
