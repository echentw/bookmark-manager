import { Action, SyncActionType as ActionType } from 'actions/constants';
import { JsonState, JsonStateSyncPartial } from 'StateConverter';

export interface LoadParams {
  state: JsonState;
}

export interface SyncParams {
  state: JsonStateSyncPartial;
}

export function load(params: LoadParams): Action<LoadParams> {
  return {
    type: ActionType.load,
    params: params,
  };
}

export function sync(params: SyncParams): Action<SyncParams> {
  return {
    type: ActionType.sync,
    params: params,
  };
}
