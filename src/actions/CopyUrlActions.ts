import { Dispatch } from 'redux';
import { Action, CopyUrlActionType as ActionType } from './constants';

export interface ShowToastParams {
  x: number;
  y: number;
}

export interface _ShowToastParams {
  timeoutId: NodeJS.Timeout;
  position: {
    x: number;
    y: number;
  };
}

export interface HideToastParams {
  timeoutId: NodeJS.Timeout;
}

export function showToast(params: ShowToastParams) {
  return (dispatch: Dispatch) => {
    const timeoutId: NodeJS.Timeout = setTimeout(() => {
      dispatch(_hideToast({ timeoutId: timeoutId }));
    }, 1000);

    dispatch(_showToast({
      timeoutId: timeoutId,
      position: {
        x: params.x,
        y: params.y,
      },
    }));
  };
}

function _showToast(params: _ShowToastParams): Action<_ShowToastParams> {
  return {
    type: ActionType.showToast,
    params: params,
  };
}

function _hideToast(params: HideToastParams): Action<HideToastParams> {
  return {
    type: ActionType.hideToast,
    params: params,
  };
}
