// To act as a bridge between react state and persisted state.

import { AppState } from './reduxStore';
import { ChromeAppState, ChromeAppStateForSync } from './ChromeHelpers';
import { User } from './User';
import { Folder } from './Folder';

// When a user opens a new tab, this is the state that we want to load.
export interface HollowAppStateForLoad extends HollowAppStateForSync {
  navigationState: {
    currentFolderId: string | null;
    homePagePinned: boolean;
  };
}

// If this state changes, then we want to update all open new tabs with this state.
export interface HollowAppStateForSync {
  userState: {
    user: User | null;
  };
  foldersState: {
    folders: Folder[];
  };
  loadedState: {
    loaded: boolean;
  };
  settingsState: {
    backgroundImageTimestamp: string;
  };
}

export class StateBridge {
  // Transforms react state to persisted state.
  public static toPersistedState = (appState: AppState): ChromeAppState => {
    return {
      user: appState.userState.user,
      folders: appState.foldersState.folders,
      currentFolderId: appState.navigationState.currentFolderId,
      backgroundImageTimestamp: appState.settingsState.backgroundImageTimestamp,
      homePagePinned: appState.navigationState.homePagePinned,
    };
  }

  // Transforms persisted state to react state.
  public static toHollowAppStateForLoad = (chromeAppState: ChromeAppState): HollowAppStateForLoad => {
    return {
      userState: {
        user: chromeAppState.user,
      },
      foldersState: {
        folders: chromeAppState.folders,
      },
      navigationState: {
        homePagePinned: chromeAppState.homePagePinned,
        currentFolderId: chromeAppState.currentFolderId,
      },
      loadedState: {
        loaded: true,
      },
      settingsState: {
        backgroundImageTimestamp: chromeAppState.backgroundImageTimestamp,
      },
    };
  }

  public static toHollowAppStateForSync = (chromeAppState: ChromeAppStateForSync): HollowAppStateForSync => {
    return {
      userState: {
        user: chromeAppState.user,
      },
      foldersState: {
        folders: chromeAppState.folders,
      },
      loadedState: {
        loaded: true,
      },
      settingsState: {
        backgroundImageTimestamp: chromeAppState.backgroundImageTimestamp,
      },
    };
  }
}
