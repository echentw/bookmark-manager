import { Action, EditBookmarkActionType as ActionType } from '../actions/constants';
import { EditBookmarkParams } from '../actions/EditBookmarkActions';

export interface EditBookmarkState {
  editingBookmarkId: string | null;
}

export const initialEditBookmarkState: EditBookmarkState = {
  editingBookmarkId: null,
};

export function editBookmarkReducer(
  state: EditBookmarkState = initialEditBookmarkState,
  action: Action,
): EditBookmarkState {
  switch (action.type) {
    case ActionType.beginEdit:
      return handleBeginEdit(state, action as Action<EditBookmarkParams>);
    case ActionType.cancel:
      return handleCancel(state, action as Action<EditBookmarkParams>);
    case ActionType.save:
      return handleSave(state, action as Action<EditBookmarkParams>);
    case ActionType.deleteBookmark:
      return handleDeleteBookmark(state, action as Action<EditBookmarkParams>);
    default:
      return state;
  }
}

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
