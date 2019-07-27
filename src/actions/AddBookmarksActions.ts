import { Dispatch } from 'redux';
import { Bookmark } from '../Bookmark';
import { ChromeHelpers, TabInfo } from '../ChromeHelpers';
import { Action, AddBookmarksActionType as ActionType } from './constants';

export interface AddBookmarksSaveParams {
  bookmarks: Bookmark[];
}

export interface ShowModalParams {
  tabs: TabInfo[];
}

function _showModal(params: ShowModalParams): Action<ShowModalParams> {
  return {
    type: ActionType.showModal,
    params: params,
  };
}

export function showModal() {
  return async (dispatch: Dispatch<Action<ShowModalParams>>) => {
    const tabInfos = await ChromeHelpers.getOpenTabs();
    dispatch(_showModal({ tabs: tabInfos }));
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
