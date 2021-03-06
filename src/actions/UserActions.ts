import { Action, UserActionType as ActionType } from 'actions/constants';

export interface UserParams {
  name: string;
}

export function setName(params: UserParams): Action<UserParams> {
  return {
    type: ActionType.setName,
    params: params,
  };
}
