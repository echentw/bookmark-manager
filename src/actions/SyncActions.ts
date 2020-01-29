import { ChromeAppState } from 'ChromeHelpers';
import { Action, SyncActionType as ActionType } from 'actions/constants';

export interface LoadParams extends ChromeAppState {}

export function load(params: LoadParams): Action<LoadParams> {
  return {
    type: ActionType.load,
    params: params,
  };
}

export function sync(params: LoadParams): Action<LoadParams> {
  return {
    type: ActionType.sync,
    params: params,
  };
}
