import { Bookmark } from './Bookmark';

import { Action, CopyUrlActionType as ActionType } from './actions/constants';
import { ShowToastParams, HideToastParams } from './actions/CopyUrlActions';

export interface AppState {
  bookmarks: Bookmark[];
  copyUrlState: CopyUrlState;
}

export interface CopyUrlState {
  showingToast: boolean;
  timeoutId: NodeJS.Timeout | null;
  position: {
    x: number;
    y: number;
  } | null;
}

export const initialCopyUrlState: CopyUrlState = {
  showingToast: false,
  timeoutId: null,
  position: null,
};

export function copyUrlReducer(state: CopyUrlState = initialCopyUrlState, action: Action): CopyUrlState {
  switch(action.type) {
    case ActionType.showToast:
      return handleShowToast(state, action as Action<ShowToastParams>);
    case ActionType.hideToast:
      return handleHideToast(state, action as Action<HideToastParams>);
    default:
      return state;
  }
}

function handleShowToast(state: CopyUrlState, action: Action<ShowToastParams>): CopyUrlState {
  return {
    showingToast: true,
    timeoutId: action.params.timeoutId,
    position: action.params.position,
  };
}

function handleHideToast(state: CopyUrlState, action: Action<HideToastParams>): CopyUrlState {
  if (action.params.timeoutId !== state.timeoutId) {
    return state;
  } else {
    return {
      showingToast: false,
      timeoutId: null,
      position: null,
    };
  }
}
