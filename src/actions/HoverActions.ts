import { Action, HoverActionType as ActionType } from 'actions/constants';

export interface HoverParams {
  rank: number;
}

export function enter(params: HoverParams): Action<HoverParams> {
  return {
    type: ActionType.enter,
    params: params,
  };
}

export function exit(params: HoverParams): Action<HoverParams> {
  return {
    type: ActionType.exit,
    params: params,
  };
}
