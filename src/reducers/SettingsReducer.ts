import { Action, SettingsActionType, SyncActionType } from 'actions/constants';
import { AppState } from 'reduxStore';
import { LocalStorageHelpers } from 'LocalStorageHelpers';
import { Reducer } from 'reducers/Reducer';
import { SetBackgroundImageParams } from 'actions/SettingsActions';
import { LoadParams, SyncParams } from 'actions/SyncActions';

export interface SettingsState {
  showingModal: boolean;

  // The timestamp which the image was last set.
  // It's used to automatically change the background image on all tabs when a new background image is set.
  // We're doing it this way because LocalStorage doesn't give us listeners.
  // (Unix timestamp in milliseconds)
  backgroundImageTimestamp: string;

  backgroundImageUrl: string;
}

export const initialSettingsState: SettingsState = {
  showingModal: false,
  backgroundImageTimestamp: '',
  backgroundImageUrl: '',
};

export const settingsReducer: Reducer<SettingsState> = (
  state: SettingsState,
  action: Action,
  appState: AppState,
): SettingsState => {
  let newState = state;
  switch (action.type) {
    case SettingsActionType.showModal:
      newState = handleShowModal(state, action);
      break;
    case SettingsActionType.hideModal:
      newState = handleHideModal(state, action);
      break;
    case SettingsActionType.setBackgroundImage:
      newState = handleSetBackgroundImage(state, action as Action<SetBackgroundImageParams>);
      break;
    case SyncActionType.load:
      newState = handleLoad(state, action as Action<LoadParams>);
      break;
    case SyncActionType.sync:
      newState = handleSync(state, action as Action<SyncParams>);
      break;
  }
  return newState;
}

function handleShowModal(state: SettingsState, action: Action): SettingsState {
  return {
    ...state,
    showingModal: true,
  };
}

function handleHideModal(state: SettingsState, action: Action): SettingsState {
  return {
    ...state,
    showingModal: false,
  };
}

function handleSetBackgroundImage(state: SettingsState, action: Action<SetBackgroundImageParams>): SettingsState {
  return {
    ...state,
    backgroundImageTimestamp: action.params.timestamp,
    backgroundImageUrl: action.params.url,
  };
}

function handleLoad(state: SettingsState, action: Action<LoadParams>): SettingsState {
  const backgroundImageUrl = _loadBackgroundImageUrl();
  const { backgroundImageTimestamp } = action.params.state.settingsState;
  return {
    ...state,
    backgroundImageTimestamp,
    backgroundImageUrl,
  };
}

function handleSync(state: SettingsState, action: Action<SyncParams>): SettingsState {
  const newTimestamp = action.params.state.settingsState.backgroundImageTimestamp;
  const newBackgroundImageUrl = state.backgroundImageTimestamp === newTimestamp ?
    state.backgroundImageUrl : _loadBackgroundImageUrl();

  return {
    ...state,
    backgroundImageTimestamp: newTimestamp,
    backgroundImageUrl: newBackgroundImageUrl,
  };
}

function _loadBackgroundImageUrl(): string {
  // It can be null, undefined, or empty string
  return LocalStorageHelpers.getBackgroundImageUrl() || require('assets/wallpapers/moon.json').url;
}
