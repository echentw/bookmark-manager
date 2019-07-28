import { Dispatch } from 'redux';

import { Bookmark } from '../Bookmark';
import { Folder } from '../Folder';
import { ChromeAppState, ChromeHelpers } from '../ChromeHelpers';
import { Action, SyncAppActionType as ActionType } from './constants';

export interface SyncBookmarksParams {
  bookmarks: Bookmark[];
}

export interface SyncFoldersParams {
  folders: Folder[];
  openFolderId: string | null;
}

export function loadAppData(params: {}) {
  return async (dispatch: Dispatch) => {
    const state: ChromeAppState = await ChromeHelpers.loadAppState();

    dispatch(syncFolders({
      folders: state.folders,
      openFolderId: state.openFolderId,
    }));

    const openFolder = state.folders.find(folder => folder.id === state.openFolderId);
    if (openFolder) {
      dispatch(syncBookmarks({ bookmarks: openFolder.bookmarks }));
    }
  };
}

export function syncBookmarks(params: SyncBookmarksParams): Action<SyncBookmarksParams> {
  return {
    type: ActionType.syncBookmarks,
    params: params,
  };
}

export function syncFolders(params: SyncFoldersParams): Action<SyncFoldersParams> {
  return {
    type: ActionType.syncFolders,
    params: params,
  };
}
