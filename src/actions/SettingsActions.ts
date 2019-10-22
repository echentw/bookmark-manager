import { Action, SettingsActionType as ActionType } from './constants';

export interface SetBackgroundImageParams {
  timestamp: string;
  url: string;
}

export function showModal(): Action {
  return {
    type: ActionType.showModal,
    params: {},
  };
}

export function hideModal(): Action {
  return {
    type: ActionType.hideModal,
    params: {},
  };
}

export function setBackgroundImage(params: SetBackgroundImageParams): Action<SetBackgroundImageParams> {
  return {
    type: ActionType.setBackgroundImage,
    params: params,
  };
}
