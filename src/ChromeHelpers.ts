import { Bookmark, BookmarkData } from './Bookmark';
import { Folder, FolderData } from './Folder';
import { User, UserData } from './User';
import { AppState } from './reduxStore';

// What gets returned by some methods in this class
export interface ChromeAppState {
  user: User | null;
  folders: Folder[];
  currentFolderId: string | null;
}

export interface ChromeData {
  appData: AppData;
}

export interface AppData {
  user: UserData | null;
  folders: FolderData[];
  currentFolderId: string | null;
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

  public static getCurrentActiveTab = (): Promise<TabInfo> => {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        const activeTab = tabs[0];
        const info: TabInfo = {
          url: activeTab.url,
          title: activeTab.title,
          faviconUrl: activeTab.favIconUrl,
        };
        resolve(info);
      });
    });
  }

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
    // uncomment when doing dangerous operations
    // return new Promise((resolve) => resolve());
    const { user } = appState.userState;
    const { folders } = appState.foldersState;
    const { currentFolderId } = appState.navigationState;

    const userData: UserData | null = user === null ? null : user.toData();
    const folderDatas: FolderData[] = folders.map(folder => folder.toData());

    const appData: AppData = {
      user: user,
      folders: folderDatas,
      currentFolderId: currentFolderId,
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

          const userData: UserData | null = result.appData.user;
          const user: User | null = userData === null ? null : User.fromData(userData);

          const state: ChromeAppState = {
            user: user,
            folders: folders,
            currentFolderId: result.appData.currentFolderId,
          };
          return resolve(state);
        } else {
          const firstFolder = new Folder({
            name: 'General',
            bookmarks: [],
          });
          const initialState: ChromeAppState = {
            user: null,
            folders: [firstFolder],
            currentFolderId: firstFolder.id,
          };
          return resolve(initialState);
        }
      });
    });
  }

  public static addOnChangedListener = (handleNewAppData: (appState: ChromeAppState) => void): void => {
    chrome.storage.onChanged.addListener((
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === 'local' && changes[ChromeHelpers.Keys.AppData]) {
        const change: chrome.storage.StorageChange = changes[ChromeHelpers.Keys.AppData];
        const appData: AppData = change.newValue;

        const folderDatas: FolderData[] = appData.folders;
        const folders: Folder[] = folderDatas.map(data => Folder.fromData(data));

        const userData: UserData | null = appData.user;
        const user: User | null = userData === null ? null : User.fromData(userData);

        handleNewAppData({
          user: user,
          folders: folders,
          currentFolderId: appData.currentFolderId,
        });
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
