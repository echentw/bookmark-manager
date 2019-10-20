// To act as a bridge between react state and persisted state.

import { AppState } from './reduxStore';
import { ChromeAppState } from './ChromeHelpers';
import { User } from './User';
import { Folder } from './Folder';

// When a user opens a new tab, this is the state that we want to load.
export interface HollowAppStateForLoading extends HollowAppStateForSyncing {
  navigationState: {
    currentFolderId: string | null;
  };
}

// If this state changes, then we want to update all open new tabs with this state.
export interface HollowAppStateForSyncing {
  userState: {
    user: User | null;
  };
  foldersState: {
    folders: Folder[];
  };
}

export class StateBridge {
  // Transforms react state to persisted state.
  public static toPersistedState = (appState: AppState): ChromeAppState => {
    return {
      user: appState.userState.user,
      folders: appState.foldersState.folders,
      currentFolderId: appState.navigationState.currentFolderId,
    };
  }

  // Transforms persisted state to react state.
  public static toHollowAppState = (chromeAppState: ChromeAppState): HollowAppStateForLoading => {
    return {
      userState: {
        user: chromeAppState.user,
      },
      foldersState: {
        folders: chromeAppState.folders,
      },
      navigationState: {
        currentFolderId: chromeAppState.currentFolderId,
      },
    };
  }
}
