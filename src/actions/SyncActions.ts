import { ChromeAppState, ChromeAppStateForSync } from 'ChromeHelpers';
import { Action, SyncActionType as ActionType } from 'actions/constants';

export interface LoadParams extends ChromeAppState {}

export interface SyncParams extends ChromeAppStateForSync {}

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
