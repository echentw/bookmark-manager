// This reducer is unlike the others. It gets called at the very end, and serves to merge
// loaded AppState from Chrome with the current react AppState.

import { AppState } from '../reduxStore';
import { LocalStorageHelpers } from '../LocalStorageHelpers';
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
  const backgroundImageUrl: string = LocalStorageHelpers.getBackgroundImageUrl();
  return {
    ...state,
    ...hollowState,
    settingsState: {
      ...state.settingsState,
      ...hollowState.settingsState,
      backgroundImageUrl: backgroundImageUrl,
    },
  };
}

function handleSync(state: AppState, action: Action<SyncParams>): AppState {
  const hollowState: HollowAppStateForSync = StateBridge.toHollowAppStateForSync(action.params);
  const backgroundImageUrl: string = _getBackgroundImageUrl(state, hollowState);
  return {
    ...state,
    ...hollowState,
    settingsState: {
      ...state.settingsState,
      ...hollowState.settingsState,
      backgroundImageUrl: backgroundImageUrl,
    },
  };
}

function _getBackgroundImageUrl(state: AppState, loadedState: HollowAppStateForSync): string {
  let imageUrl: string;
  if (state.settingsState.backgroundImageTimestamp === loadedState.settingsState.backgroundImageTimestamp) {
    imageUrl = state.settingsState.backgroundImageUrl;
  } else {
    imageUrl = LocalStorageHelpers.getBackgroundImageUrl();
  }
  return imageUrl;
}
