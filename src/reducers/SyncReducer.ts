// This reducer is unlike the others. It gets called at the very end, and serves to merge
// loaded AppState from Chrome with the current react AppState.

import { AppState } from 'reduxStore';
import { LocalStorageHelpers } from 'LocalStorageHelpers';
import { StateConverter, mergeStates, AppStateSyncPartial } from 'StateConverter';
import { Action, SyncActionType as ActionType } from 'actions/constants';
import { LoadParams, SyncParams } from 'actions/SyncActions';

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
  const appStateLoadPartial = StateConverter.jsonStateToAppStateLoadPartial(action.params.state);
  const backgroundImageUrl = _loadBackgroundImageUrl();

  const merged1 = mergeStates<AppState>(state, appStateLoadPartial);
  const merged2 = mergeStates<AppState>(merged1, {
    settingsState: {
      backgroundImageUrl: backgroundImageUrl,
    },
    loadedState: {
      loaded: true,
    },
  });
  return merged2;
}

function handleSync(state: AppState, action: Action<SyncParams>): AppState {
  const appStateSyncPartial = StateConverter.jsonStateSyncPartialToAppStateSyncPartial(action.params.state);
  const backgroundImageUrl: string = _getBackgroundImageUrl(state, appStateSyncPartial);

  const merged1 = mergeStates<AppState>(state, appStateSyncPartial);
  const merged2 = mergeStates<AppState>(merged1, {
    settingsState: {
      backgroundImageUrl: backgroundImageUrl,
    },
  });
  return merged2;
}

function _getBackgroundImageUrl(state: AppState, syncedState: AppStateSyncPartial): string {
  let imageUrl: string;
  if (state.settingsState.backgroundImageTimestamp === syncedState.settingsState.backgroundImageTimestamp) {
    imageUrl = state.settingsState.backgroundImageUrl;
  } else {
    imageUrl = _loadBackgroundImageUrl();
  }
  return imageUrl;
}

function _loadBackgroundImageUrl(): string {
  // It can be null, undefined, or empty string
  return LocalStorageHelpers.getBackgroundImageUrl() || require('assets/wallpapers/moon.json').url;
}
