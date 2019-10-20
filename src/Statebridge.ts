// To act as a bridge between react state and persisted state.

import { AppState } from './reduxStore';
import { ChromeAppState } from './ChromeHelpers';
import { User } from './User';
import { Folder } from './Folder';

export interface HollowAppState {
  userState: {
    user: User | null;
  };
  foldersState: {
    folders: Folder[];
  };
  navigationState: {
    currentFolderId: string | null;
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
  public static toHollowAppState = (chromeAppState: ChromeAppState): HollowAppState => {
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
