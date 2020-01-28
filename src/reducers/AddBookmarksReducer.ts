import { AddBookmarksSaveParams, ShowModalParams } from 'actions/AddBookmarksActions';
import { Action, AddBookmarksActionType as ActionType } from 'actions/constants';
import { TabInfo } from 'ChromeHelpers';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';
import { Folder } from 'Folder';

export interface AddBookmarksState {
  showingModal: boolean;
  tabs: TabInfo[];
  folder: Folder | null;
}

export const initialAddBookmarksState: AddBookmarksState = {
  showingModal: false,
  tabs: [],
  folder: null,
};

export const addBookmarksReducer: Reducer<AddBookmarksState> = (
  state: AddBookmarksState,
  action: Action,
  appState: AppState,
): AddBookmarksState => {
  let newState = state;
  switch (action.type) {
    case ActionType.showModal:
      newState = handleShowModal(state, action as Action<ShowModalParams>, appState);
      break;
    case ActionType.cancel:
      newState = handleCancel(state, action);
      break;
    case ActionType.save:
      newState = handleSave(state, action as Action<AddBookmarksSaveParams>);
      break;
  }
  return newState;
};

function handleShowModal(
  state: AddBookmarksState,
  action: Action<ShowModalParams>,
  appState: AppState
): AddBookmarksState {
  return {
    showingModal: true,
    tabs: action.params.tabs,
    folder: action.params.folder,
  };
}

function handleCancel(state: AddBookmarksState, action: Action): AddBookmarksState {
  return {
    showingModal: false,
    tabs: [],
    folder: null,
  };
}

function handleSave(state: AddBookmarksState, action: Action<AddBookmarksSaveParams>): AddBookmarksState {
  return {
    showingModal: false,
    tabs: [],
    folder: null,
  };
}
