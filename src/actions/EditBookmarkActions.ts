import { Bookmark } from 'Bookmark';
import { Folder } from 'Folder';
import { Action, EditBookmarkActionType as ActionType } from 'actions/constants';

export interface EditBookmarkParams {
  bookmark: Bookmark;
}

export function beginEdit(params: EditBookmarkParams): Action<EditBookmarkParams> {
  return {
    type: ActionType.beginEdit,
    params: params,
  };
}

export function cancel(params: {}): Action {
  return {
    type: ActionType.cancel,
    params: params,
  };
}

export function save(params: EditBookmarkParams): Action<EditBookmarkParams> {
  return {
    type: ActionType.save,
    params: params,
  };
}

export function deleteBookmark(params: EditBookmarkParams): Action<EditBookmarkParams> {
  return {
    type: ActionType.deleteBookmark,
    params: params,
  };
}
