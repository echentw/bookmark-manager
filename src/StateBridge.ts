// To act as a bridge between react state and persisted state.

import { AppState } from 'reduxStore';
import { ChromeAppState } from 'ChromeHelpers';
import { User } from 'User';
import { Folder } from 'Folder';

// If this state changes, then we want to update all open new tabs with this state.
export interface HollowAppState {
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
      backgroundImageTimestamp: appState.settingsState.backgroundImageTimestamp,
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
      loadedState: {
        loaded: true,
      },
      settingsState: {
        backgroundImageTimestamp: chromeAppState.backgroundImageTimestamp,
      },
    };
  }
}
