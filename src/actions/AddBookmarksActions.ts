import { Dispatch } from 'redux';

import { Bookmark } from 'Bookmark';
import { Folder } from 'Folder';
import { ChromeHelpers, TabInfo } from 'ChromeHelpers';
import { Action, AddBookmarksActionType as ActionType } from 'actions/constants';

export interface AddBookmarksSaveParams {
  bookmarks: Bookmark[];
}

export interface ShowModalParams extends ExternalShowModalParams {
  tabs: TabInfo[];
}

function _showModal(params: ShowModalParams): Action<ShowModalParams> {
  return {
    type: ActionType.showModal,
    params: params,
  };
}

export interface ExternalShowModalParams {
  folder: Folder;
}

export function showModal(params: ExternalShowModalParams) {
  return async (dispatch: Dispatch<Action<ShowModalParams>>) => {
    const tabInfos = await ChromeHelpers.getOpenTabs();
    dispatch(_showModal({
      folder: params.folder,
      tabs: tabInfos,
    }));
  };
}

export function cancel(): Action {
  return {
    type: ActionType.cancel,
    params: {},
  };
}

export function save(params: AddBookmarksSaveParams): Action<AddBookmarksSaveParams> {
  return {
    type: ActionType.save,
    params: params,
  };
}
