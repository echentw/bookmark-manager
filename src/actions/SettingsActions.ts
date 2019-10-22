import { Action, SettingsActionType as ActionType } from './constants';

export interface SetBackgroundImageTimestampParams {
  backgroundImageTimestamp: string;
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

export function setBackgroundImageTimestamp(
  params: SetBackgroundImageTimestampParams
): Action<SetBackgroundImageTimestampParams> {
  return {
    type: ActionType.setBackgroundImageTimestamp,
    params: params,
  };
}
