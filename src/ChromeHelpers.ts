import { Folder, FolderData } from './Folder';
import { User, UserData } from './User';

// We don't want to sync *all* the stuff in ChromeAppState to all existing tabs.
// This is the stuff we want to sync over.
export interface ChromeAppStateForSync {
  user: User | null;
  folders: Folder[];
  backgroundImageTimestamp: string;
}

export interface ChromeAppState extends ChromeAppStateForSync {
  currentFolderId: string | null;
}

export interface ChromeData {
  appData: AppData;
}

export interface AppData {
  user: UserData | null;
  folders: FolderData[];
  currentFolderId: string | null;
  backgroundImageTimestamp: string | null;
}

export interface TabInfo {
  url: string;
  title: string;
  faviconUrl?: string;
}

const storageEngine = chrome.storage.local;
// const storageEngine = chrome.storage.sync;

export class ChromeHelpers {

  public static Keys = {
    AppData: 'appData',
  };

  public static platformOS: string | null = null;
  public static getPlatformOS = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (ChromeHelpers.platformOS !== null) {
        return resolve(ChromeHelpers.platformOS);
      }
      chrome.runtime.getPlatformInfo((info: chrome.runtime.PlatformInfo) => {
        ChromeHelpers.platformOS = info.os;
        resolve(ChromeHelpers.platformOS);
      });
    });
  }

  public static openTabWithUrl = (url: string, openInNewTab: boolean): void => {
    if (openInNewTab) {
      chrome.tabs.create({ url: url, active: false });
    } else {
      chrome.tabs.update({ url: url });
    }
  }

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

  // Note! This filters out the new tab page. We probably don't need it for anything.
  public static getOpenTabs = (): Promise<TabInfo[]> => {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({}, (tabs: chrome.tabs.Tab[]) => {
        const tabInfos: TabInfo[] = tabs.map((tab: chrome.tabs.Tab) => ({
          url: tab.url,
          title: tab.title,
          faviconUrl: tab.favIconUrl,
        }));
        const tabInfosWithoutNewTab = tabInfos.filter(tabInfo => tabInfo.url !== 'chrome://newtab/');
        resolve(tabInfosWithoutNewTab);
      });
    });
  }

  public static saveRawChromeAppState = (appState: ChromeAppState): Promise<{}> => {
    return new Promise((resolve, reject) => {
      storageEngine.set({ [ChromeHelpers.Keys.AppData]: appState }, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  }

  public static saveAppState = (appState: ChromeAppState): Promise<{}> => {
    const appData = ChromeHelpers.toSerializedData(appState);
    return new Promise((resolve, reject) => {
      storageEngine.set({ [ChromeHelpers.Keys.AppData]: appData }, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  }

  public static loadAppState = (): Promise<ChromeAppState> => {
    return new Promise((resolve, reject) => {
      storageEngine.get([ChromeHelpers.Keys.AppData], (result: ChromeData) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        if (result.appData) {
          const appState = ChromeHelpers.toDeserializedState(result.appData);
          return resolve(appState);
        } else {
          const appState = ChromeHelpers.getCleanInitialState();
          return resolve(appState);
        }
      });
    });
  }

  public static addOnChangedListener = (receive: (appState: ChromeAppStateForSync) => void): void => {
    chrome.storage.onChanged.addListener((
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string,
    ) => {
      if (chrome.runtime.lastError) {
        return;
      }
      if (areaName === 'local' && changes[ChromeHelpers.Keys.AppData]) {
        const change: chrome.storage.StorageChange = changes[ChromeHelpers.Keys.AppData];
        const appData: AppData = change.newValue;
        const appState = ChromeHelpers.toDeserializedState(appData);
        receive({
          user: appState.user,
          folders: appState.folders,
          backgroundImageTimestamp: appState.backgroundImageTimestamp,
        });
      }
    });
  }

  public static printStorageDetails = () => {
    storageEngine.getBytesInUse((bytes: number) => {
      console.log('bytes in use', bytes);
    });
    storageEngine.get([ChromeHelpers.Keys.AppData], result => {
      console.log('data', result);
    });
  }

  private static toSerializedData = (chromeAppState: ChromeAppState): AppData => {
    const { user, folders, currentFolderId, backgroundImageTimestamp } = chromeAppState;

    const userData: UserData | null = user === null ? null : user.toData();
    const folderDatas: FolderData[] = folders.map(folder => folder.toData());

    return {
      user: userData,
      folders: folderDatas,
      currentFolderId: currentFolderId,
      backgroundImageTimestamp: backgroundImageTimestamp,
    };
  }

  private static toDeserializedState = (appData: AppData): ChromeAppState => {
    const {
      user: userData,
      folders: folderDatas,
      currentFolderId: currentFolderIdData,
      backgroundImageTimestamp: backgroundImageTimestampData,
    } = appData;

    const user: User | null = userData === null ? null : User.fromData(userData);
    const folders: Folder[] = folderDatas.map(data => Folder.fromData(data));
    const currentFolderId: string | null = currentFolderIdData;
    const backgroundImageTimestamp: string = backgroundImageTimestampData ? backgroundImageTimestampData : '';

    return {
      user: user,
      folders: folders,
      currentFolderId: currentFolderId,
      backgroundImageTimestamp: backgroundImageTimestamp,
    };
  }

  private static getCleanInitialState = (): ChromeAppState => {
    const firstFolder = new Folder({
      name: 'General',
      bookmarks: [],
    });
    return {
      user: null,
      folders: [firstFolder],
      currentFolderId: firstFolder.id,
      backgroundImageTimestamp: '',
    };
  }
}
