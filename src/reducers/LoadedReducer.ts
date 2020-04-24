import { Action, SyncActionType } from 'actions/constants';
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
  let newState = state;
  switch (action.type) {
    case SyncActionType.load:
      newState = handleLoad(state, action);
      break;
  }
  return newState;
};

function handleLoad(state: LoadedState, action: Action): LoadedState {
  return {
    loaded: true,
  };
}
