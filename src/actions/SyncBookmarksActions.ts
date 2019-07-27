import { Dispatch } from 'redux';

import { Bookmark } from '../Bookmark';
import { Folder } from '../Folder';
import { ChromeHelpers } from '../ChromeHelpers';
import { Action, SyncBookmarksActionType as ActionType } from './constants';

export interface SyncBookmarksParams {
  bookmarks: Bookmark[];
}

export function loadBookmarks(params: {}) {
  return async (dispatch: Dispatch) => {
    const folders: Folder[] = await ChromeHelpers.loadAppState();
    const folder = folders[0];
    dispatch(syncBookmarks({ bookmarks: folder.bookmarks }));
  };
}

export function syncBookmarks(params: SyncBookmarksParams): Action<SyncBookmarksParams> {
  return {
    type: ActionType.sync,
    params: params,
  };
}
