import { Folder } from 'models/Folder';
import { User } from 'models/User';
import { Note } from 'models/Note';
import { Bookmark } from 'models/Bookmark';
import { JsonState, mergeStates } from 'StateConverter';
import { UtilityTab } from 'reducers/UtilitiesReducer'


type StoredJsonState = Partial<JsonState>;

export interface ChromeData {
  appData: StoredJsonState;
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

  public static save = async (jsonState: Partial<JsonState>): Promise<void> => {
    return new Promise((resolve, reject) => {
      ChromeHelpers.load().then(storedJsonState => {
        // console.log(`our version: ${jsonState.codeVersion}, stored version: ${storedJsonState.codeVersion}`);
        if (jsonState.codeVersion < storedJsonState.codeVersion) {
          return reject(
            new Error(
              `OUTDATED_CODE_VERSION: Trying to save version ` +
              `${jsonState.codeVersion} over ${storedJsonState.codeVersion}`
            )
          );
        }

        const mergedJsonState = mergeStates<JsonState>(storedJsonState, jsonState);
        storageEngine.set({ [ChromeHelpers.Keys.AppData]: mergedJsonState }, () => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
          }
          resolve();
        });
      });
    });
  }

  public static load = (): Promise<JsonState> => {
    return new Promise((resolve, reject) => {
      storageEngine.get([ChromeHelpers.Keys.AppData], (result: ChromeData) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        const storedJsonState: StoredJsonState = result.appData ?? {};
        const jsonState = {
          ...ChromeHelpers.freshJsonState(),
          ...storedJsonState,
        };
        return resolve(jsonState);
      });
    });
  }

  public static addOnChangedListener = (receive: (jsonState: JsonState) => void): void => {
    chrome.storage.onChanged.addListener(
      (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
        if (chrome.runtime.lastError) {
          return;
        }
        if (areaName === 'local' && changes[ChromeHelpers.Keys.AppData]) {
          const change: chrome.storage.StorageChange = changes[ChromeHelpers.Keys.AppData];
          const storedJsonState: StoredJsonState = change.newValue;
          const jsonState = {
            ...ChromeHelpers.freshJsonState(),
            ...storedJsonState,
          };
          receive(jsonState);
        }
      }
    );
  }

  private static freshJsonState = (): JsonState => {
    const firstFolder = new Folder({
      name: 'My First Folder',
      bookmarks: [
        new Bookmark({
          url: 'https://www.google.com/',
          title: 'Google',
          faviconUrl: 'https://www.google.com/favicon.ico',
          name: 'My First Bookmark',
        }),
      ],
    });
    const firstNote = new Note({
      name: 'My First Note',
      text: '',
    });
    return {
      codeVersion: 0, // This value gets overridden by MetaStateReducer.ts
      dataVersion: 10, // Some arbitrary number bigger than 1.
      user: null,
      folders: [firstFolder.toJson()],
      notes: [firstNote.toJson()],
      backgroundImageTimestamp: '',
      activeUtilityTab: UtilityTab.Bookmarks,
      currentOpenNoteId: null,
    };
  }

  public static printStorageDetails = () => {
    storageEngine.getBytesInUse((bytes: number) => {
      console.log('bytes in use', bytes);
    });
    storageEngine.get([ChromeHelpers.Keys.AppData], result => {
      console.log('data', result);
    });
  }
}
