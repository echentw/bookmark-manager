import { AddBookmarksSaveParams, ShowModalParams } from '../actions/AddBookmarksActions';
import { Action, AddBookmarksActionType as ActionType } from '../actions/constants';
import { TabInfo } from '../ChromeHelpers';
import { AppState } from '../reduxStore';
import { Reducer } from './Reducer';

export interface AddBookmarksState {
  showingModal: boolean;
  tabs: TabInfo[];
}

export const initialAddBookmarksState: AddBookmarksState = {
  showingModal: false,
  tabs: [],
};

export const addBookmarksReducer: Reducer<AddBookmarksState> = (
  state: AddBookmarksState,
  action: Action,
  appState: AppState,
): AddBookmarksState => {
  let newState = state;
  switch (action.type) {
    case ActionType.showModal:
      newState = handleShowModal(state, action as Action<ShowModalParams>);
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

function handleShowModal(state: AddBookmarksState, action: Action<ShowModalParams>): AddBookmarksState {
  return {
    showingModal: true,
    tabs: action.params.tabs,
  };
}

function handleCancel(state: AddBookmarksState, action: Action): AddBookmarksState {
  return {
    showingModal: false,
    tabs: [],
  };
}

function handleSave(state: AddBookmarksState, action: Action<AddBookmarksSaveParams>): AddBookmarksState {
  return {
    showingModal: false,
    tabs: [],
  };
}
