// This reducer is unlike the others. It gets called at the very end, and serves to merge
// loaded AppState from Chrome with the current react AppState.

import { AppState } from 'reduxStore';
import { LocalStorageHelpers } from 'LocalStorageHelpers';
import { HollowAppState, StateBridge } from 'StateBridge';
import { Action, SyncActionType as ActionType } from 'actions/constants';
import { LoadParams } from 'actions/SyncActions';

export const syncReducer = (state: AppState, action: Action): AppState => {
  let newState = state;
  switch (action.type) {
    case ActionType.load:
      newState = handleLoad(state, action as Action<LoadParams>);
      break;
    case ActionType.sync:
      newState = handleSync(state, action as Action<LoadParams>);
      break;
  }
  return newState;
};

function handleLoad(state: AppState, action: Action<LoadParams>): AppState {
  const hollowState: HollowAppState = StateBridge.toHollowAppState(action.params);
  const backgroundImageUrl = _loadBackgroundImageUrl();
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

function handleSync(state: AppState, action: Action<LoadParams>): AppState {
  const hollowState: HollowAppState = StateBridge.toHollowAppState(action.params);
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

function _getBackgroundImageUrl(state: AppState, loadedState: HollowAppState): string {
  let imageUrl: string;
  if (state.settingsState.backgroundImageTimestamp === loadedState.settingsState.backgroundImageTimestamp) {
    imageUrl = state.settingsState.backgroundImageUrl;
  } else {
    imageUrl = _loadBackgroundImageUrl();
  }
  return imageUrl;
}

function _loadBackgroundImageUrl(): string {
  return LocalStorageHelpers.getBackgroundImageUrl() || require('assets/wallpapers/moon.json').url;
}
