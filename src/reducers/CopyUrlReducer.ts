import { Action, CopyUrlActionType as ActionType } from '../actions/constants';
import { _ShowToastParams, HideToastParams } from '../actions/CopyUrlActions';
import { Reducer } from './Reducer';
import { AppState } from '../reduxStore';

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

export const copyUrlReducer = (
  state: CopyUrlState,
  action: Action,
  appState: AppState
): CopyUrlState => {
  let newState = state;
  switch (action.type) {
    case ActionType.showToast:
      newState = handleShowToast(state, action as Action<_ShowToastParams>);
      break;
    case ActionType.hideToast:
      newState = handleHideToast(state, action as Action<HideToastParams>);
      break;
  }
  return newState;
}

function handleShowToast(state: CopyUrlState, action: Action<_ShowToastParams>): CopyUrlState {
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
