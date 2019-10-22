// This reducer is unlike the others. It gets called at the very end, and serves to merge
// loaded AppState from Chrome with the current react AppState.

import { AppState } from '../reduxStore';
import { HollowAppStateForLoad, HollowAppStateForSync, StateBridge } from '../StateBridge';
import { Action, SyncActionType as ActionType } from '../actions/constants';
import { LoadParams, SyncParams } from '../actions/SyncActions';

export const syncReducer = (state: AppState, action: Action): AppState => {
  let newState = state;
  switch (action.type) {
    case ActionType.load:
      newState = handleLoad(state, action as Action<LoadParams>);
      break;
    case ActionType.sync:
      newState = handleSync(state, action as Action<SyncParams>);
      break;
  }
  return newState;
};

function handleLoad(state: AppState, action: Action<LoadParams>): AppState {
  const hollowState: HollowAppStateForLoad = StateBridge.toHollowAppStateForLoad(action.params);
  return {
    ...state,
    ...hollowState,
    settingsState: {
      ...state.settingsState,
      ...hollowState.settingsState,
    },
  };
}

function handleSync(state: AppState, action: Action<SyncParams>): AppState {
  const hollowState: HollowAppStateForSync = StateBridge.toHollowAppStateForSync(action.params);
  return {
    ...state,
    ...hollowState,
    settingsState: {
      ...state.settingsState,
      ...hollowState.settingsState,
    },
  };
}
