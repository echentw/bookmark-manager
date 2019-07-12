import { AddBookmarksSaveParams, ShowModalParams } from '../actions/AddBookmarksActions';
import { Action, AddBookmarksActionType as ActionType } from '../actions/constants';
import { TabInfo } from '../ChromeHelpers';

export interface AddBookmarksState {
  showingModal: boolean;
  tabs: TabInfo[];
}

export const initialAddBookmarksState: AddBookmarksState = {
  showingModal: false,
  tabs: [],
};

export function addBookmarksReducer(
  state: AddBookmarksState = initialAddBookmarksState,
  action: Action,
): AddBookmarksState {
  switch (action.type) {
    case ActionType.showModal:
      return handleShowModal(state, action as Action<ShowModalParams>);
    case ActionType.cancel:
      return handleCancel(state, action);
    case ActionType.save:
      return handleSave(state, action as Action<AddBookmarksSaveParams>);
    default:
      return state;
  }
}

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
