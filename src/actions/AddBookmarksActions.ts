import { Bookmark } from '../Bookmark';
import { Action, AddBookmarksActionType as ActionType } from './constants';

export interface AddBookmarksSaveParams {
  bookmarks: Bookmark[];
}

export function showModal(): Action {
  return {
    type: ActionType.showModal,
    params: {},
  };
}

export function cancel(): Action {
  return {
    type: ActionType.cancel,
    params: {},
  };
}

export function save(bookmarks: Bookmark[]): Action<AddBookmarksSaveParams> {
  return {
    type: ActionType.save,
    params: { bookmarks },
  };
}
