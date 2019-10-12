import { Action, SettingsActionType as ActionType } from './constants';

export interface SetImageTimestampParams {
  imageTimestamp: string;
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

export function setImageTimestamp(params: SetImageTimestampParams): Action<SetImageTimestampParams> {
  return {
    type: ActionType.setImageTimestamp,
    params: params,
  };
}
