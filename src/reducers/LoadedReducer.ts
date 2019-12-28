import { Action } from 'actions/constants';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';

export interface LoadedState {
  loaded: boolean;
}

export const initialLoadedState: LoadedState = {
  loaded: false,
};

export const loadedReducer: Reducer<LoadedState> = (
  state: LoadedState,
  action: Action,
  appState: AppState,
): LoadedState => {
  // This state is completely managed by SyncReducer, so we don't need to do anything.
  return state;
};
