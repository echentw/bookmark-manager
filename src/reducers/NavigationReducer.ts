import { Action, FolderActionType } from 'actions/constants';
import { OpenFolderParams } from 'actions/FolderActions';
import { Folder } from 'Folder';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';

export interface NavigationState {
  currentFolderId: string | null;
}

export const initialNavigationState: NavigationState = {
  currentFolderId: null,
};

export const navigationReducer: Reducer<NavigationState> = (
  state: NavigationState,
  action: Action,
  appState: AppState,
): NavigationState => {
  let newState = state;
  switch (action.type) {
    case FolderActionType.openFolder:
      newState = handleOpenFolder(state, action as Action<OpenFolderParams>);
      break;
    case FolderActionType.closeFolder:
      newState = handleCloseFolder(state, action);
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
