import { Dispatch } from 'redux';

import { Bookmark } from '../Bookmark';
import { Folder } from '../Folder';
import { User } from '../User';
import { ChromeAppState, ChromeHelpers } from '../ChromeHelpers';
import { Action, SyncAppActionType as ActionType } from './constants';

export interface SyncFoldersParams {
  folders: Folder[];
  currentFolderId: string | null;
}

export interface SyncUserParams {
  user: User | null;
}

export function loadAppData(params: {}) {
  return async (dispatch: Dispatch) => {
    const state: ChromeAppState = await ChromeHelpers.loadAppState();
    const maybeFolder = state.folders.find(folder => folder.id === state.currentFolderId);
    const currentFolderId = maybeFolder ? maybeFolder.id : null;
    dispatch(syncUser({
      user: state.user,
    }));
    dispatch(syncFolders({
      folders: state.folders,
      currentFolderId: currentFolderId,
    }));
    dispatch(markLoaded({}));
  };
}

export function syncFolders(params: SyncFoldersParams): Action<SyncFoldersParams> {
  return {
    type: ActionType.syncFolders,
    params: params,
  };
}

export function syncUser(params: SyncUserParams): Action<SyncUserParams> {
  return {
    type: ActionType.syncUser,
    params: params,
  };
}

export function markLoaded(params: {}): Action {
  return {
    type: ActionType.markLoaded,
    params: params,
  };
}
