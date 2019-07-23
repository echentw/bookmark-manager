import { Dispatch } from 'redux';

import { Bookmark } from '../Bookmark';
import { ChromeHelpers } from '../ChromeHelpers';
import { Action, SyncBookmarksActionType as ActionType } from './constants';

export interface SyncBookmarksParams {
  bookmarks: Bookmark[];
}

export function loadBookmarks(params: {}) {
  return async (dispatch: Dispatch) => {
    const bookmarks: Bookmark[] = await ChromeHelpers.loadBookmarks();
    dispatch(syncBookmarks({ bookmarks }));
  };
}

export function syncBookmarks(params: SyncBookmarksParams): Action<SyncBookmarksParams> {
  return {
    type: ActionType.sync,
    params: params,
  };
}
