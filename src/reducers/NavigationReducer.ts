import { Folder } from '../Folder';
import { OpenFolderParams } from '../actions/FolderActions';
import { SyncFoldersParams } from '../actions/SyncAppActions';
import { Reducer } from './Reducer';
import { AppState } from '../reduxStore';
import { Action, FolderActionType, SyncAppActionType } from '../actions/constants';

export interface NavigationState {
  currentFolderId: string | null;
}

export const initialNavigationState: NavigationState = {
  currentFolderId: null,
};

export const navigationReducer: Reducer<NavigationState> = (
  state: NavigationState,
  action: Action,
  appState: AppState
): NavigationState => {
  let newState = state;
  switch(action.type) {
    case FolderActionType.openFolder:
      newState = handleOpenFolder(state, action as Action<OpenFolderParams>);
      break;
    case FolderActionType.closeFolder:
      newState = handleCloseFolder(state, action);
      break;
    case SyncAppActionType.syncFolders:
      newState = handleSyncFolders(state, action as Action<SyncFoldersParams>);
      break;
  }
  return newState;
};

function handleOpenFolder(state: NavigationState, action: Action<OpenFolderParams>): NavigationState {
  return {
    currentFolderId: action.params.folder.id,
  };
}

function handleCloseFolder(state: NavigationState, action: Action): NavigationState {
  return {
    currentFolderId: null,
  };
}

function handleSyncFolders(state: NavigationState, action: Action<SyncFoldersParams>): NavigationState {
  let currentFolderId: string | null = null;
  if (state.currentFolderId === null) {
    currentFolderId = action.params.currentFolderId;
  } else {
    const folderExists = action.params.folders.some((folder: Folder) => folder.id === state.currentFolderId);
    currentFolderId = folderExists ? state.currentFolderId : null;
  }
  return {
    currentFolderId: currentFolderId,
  };
}
