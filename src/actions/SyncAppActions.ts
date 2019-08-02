import { Dispatch } from 'redux';

import { Bookmark } from '../Bookmark';
import { Folder } from '../Folder';
import { ChromeAppState, ChromeHelpers } from '../ChromeHelpers';
import { Action, SyncAppActionType as ActionType } from './constants';

export interface SyncFoldersParams {
  folders: Folder[];
  currentFolderId: string | null;
}

export function loadAppData(params: {}) {
  return async (dispatch: Dispatch) => {
    const state: ChromeAppState = await ChromeHelpers.loadAppState();
    const maybeFolder = state.folders.find(folder => folder.id === state.currentFolderId);
    const currentFolderId = maybeFolder ? maybeFolder.id : null;
    dispatch(syncFolders({
      folders: state.folders,
      currentFolderId: currentFolderId,
    }));
  };
}

export function syncFolders(params: SyncFoldersParams): Action<SyncFoldersParams> {
  return {
    type: ActionType.syncFolders,
    params: params,
  };
}
