import { Action, SyncAppActionType as ActionType } from '../actions/constants';
import { Reducer } from './Reducer';
import { AppState } from '../reduxStore';

export interface LoadedState {
  loaded: boolean;
}

export const initialLoadedState: LoadedState = {
  loaded: false,
};

export const loadedReducer: Reducer<LoadedState> = (
  state: LoadedState,
  action: Action,
  appState: AppState
): LoadedState => {
  let newState = state;
  switch (action.type) {
    case ActionType.markLoaded:
      newState = handleMarkLoaded(state, action);
      break;
  }
  return newState;
};

function handleMarkLoaded(state: LoadedState, action: Action): LoadedState {
  return {
    loaded: true,
  };
}
