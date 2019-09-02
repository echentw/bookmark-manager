import { Dispatch } from 'redux';

import { Bookmark } from '../Bookmark';
import { Folder } from '../Folder';
import { User } from '../User';
import { ChromeAppState, ChromeHelpers } from '../ChromeHelpers';
import { Action, SyncAppActionType as ActionType } from './constants';

export interface LoadAppParams {
  user: User | null;
  folders: Folder[];
  currentFolderId: string | null;
}

export interface SyncAppParams {
  user: User | null;
  folders: Folder[];
}

export function loadAppData(params: {}) {
  return async (dispatch: Dispatch) => {
    const state: ChromeAppState = await ChromeHelpers.loadAppState();
    const maybeFolder = state.folders.find(folder => folder.id === state.currentFolderId);
    const currentFolderId = maybeFolder ? maybeFolder.id : null;
    dispatch(_loadAppData({
      user: state.user,
      folders: state.folders,
      currentFolderId: currentFolderId,
    }));
  };
}

function _loadAppData(params: LoadAppParams): Action<LoadAppParams> {
  return {
    type: ActionType.load,
    params: params,
  };
}

export function syncAppData(params: SyncAppParams): Action<SyncAppParams> {
  return {
    type: ActionType.sync,
    params: params,
  };
}
