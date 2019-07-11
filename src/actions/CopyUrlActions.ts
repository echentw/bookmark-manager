import { Action, CopyUrlActionType as ActionType } from './constants';

export interface ShowToastParams {
  timeoutId: NodeJS.Timeout;
  position: {
    x: number;
    y: number;
  };
}

export interface HideToastParams {
  timeoutId: NodeJS.Timeout;
}

export function showToast(params: ShowToastParams): Action<ShowToastParams> {
  return {
    type: ActionType.showToast,
    params: params,
  };
}

export function hideToast(params: HideToastParams): Action<HideToastParams> {
  return {
    type: ActionType.hideToast,
    params: params,
  };
}
