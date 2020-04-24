import { Action, SyncActionType as ActionType } from 'actions/constants';
import { AppStateLoadPartial, AppStateSyncPartial } from 'StateConverter';

export interface LoadParams {
  state: AppStateLoadPartial;
}

export interface SyncParams {
  state: AppStateSyncPartial;
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
