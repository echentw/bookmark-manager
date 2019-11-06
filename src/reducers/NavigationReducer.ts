import { Action, NavigationActionType } from '../actions/constants';
import { OpenFolderParams } from '../actions/NavigationActions';
import { Folder } from '../Folder';
import { AppState } from '../reduxStore';
import { Reducer } from './Reducer';

export interface NavigationState {
  currentFolderId: string | null;

  // If the home page is pinned, then a new tab will always open to the home page.
  // (The default behavior is to open to the folder that was last opened, or the home page
  // if the last thing that happened was closing a folder.)
  homePagePinned: boolean;
}

export const initialNavigationState: NavigationState = {
  currentFolderId: null,
  homePagePinned: false,
};

export const navigationReducer: Reducer<NavigationState> = (
  state: NavigationState,
  action: Action,
  appState: AppState,
): NavigationState => {
  let newState = state;
  switch (action.type) {
    case NavigationActionType.openFolder:
      newState = handleOpenFolder(state, action as Action<OpenFolderParams>);
      break;
    case NavigationActionType.closeFolder:
      newState = handleCloseFolder(state, action);
      break;
    case NavigationActionType.toggleHomePagePin:
      newState = handleToggleHomePagePin(state, action);
      break;
  }
  return newState;
};

function handleOpenFolder(state: NavigationState, action: Action<OpenFolderParams>): NavigationState {
  return {
    ...state,
    currentFolderId: action.params.folder.id,
  };
}

function handleCloseFolder(state: NavigationState, action: Action): NavigationState {
  return {
    ...state,
    currentFolderId: null,
  };
}

function handleToggleHomePagePin(state: NavigationState, action: Action): NavigationState {
  return {
    ...state,
    homePagePinned: !state.homePagePinned,
  };
}
