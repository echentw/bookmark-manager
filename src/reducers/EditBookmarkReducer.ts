import { Action, EditBookmarkActionType as ActionType } from 'actions/constants';
import { EditBookmarkParams } from 'actions/EditBookmarkActions';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';

export interface EditBookmarkState {
  editingBookmarkId: string | null;
}

export const initialEditBookmarkState: EditBookmarkState = {
  editingBookmarkId: null,
};

export const editBookmarkReducer: Reducer<EditBookmarkState> = (
  state: EditBookmarkState,
  action: Action,
  appState: AppState,
): EditBookmarkState => {
  let newState = state;
  switch (action.type) {
    case ActionType.beginEdit:
      newState = handleBeginEdit(state, action as Action<EditBookmarkParams>);
      break;
    case ActionType.cancel:
      newState = handleCancel(state, action as Action<EditBookmarkParams>);
      break;
    case ActionType.save:
      newState = handleSave(state, action as Action<EditBookmarkParams>);
      break;
    case ActionType.deleteBookmark:
      newState = handleDeleteBookmark(state, action as Action<EditBookmarkParams>);
      break;
  }
  return newState;
};

function handleBeginEdit(state: EditBookmarkState, action: Action<EditBookmarkParams>): EditBookmarkState {
  return {
    editingBookmarkId: action.params.bookmark.id,
  };
}

function handleCancel(state: EditBookmarkState, action: Action<EditBookmarkParams>): EditBookmarkState {
  return {
    editingBookmarkId: null,
  };
}

function handleSave(state: EditBookmarkState, action: Action<EditBookmarkParams>): EditBookmarkState {
  return {
    editingBookmarkId: null,
  };
}

function handleDeleteBookmark(state: EditBookmarkState, action: Action<EditBookmarkParams>): EditBookmarkState {
  return {
    editingBookmarkId: null,
  };
}
