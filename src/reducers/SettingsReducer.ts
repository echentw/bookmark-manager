import { Action, SettingsActionType as ActionType } from 'actions/constants';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';
import { SetBackgroundImageParams } from 'actions/SettingsActions';

export interface SettingsState {
  showingModal: boolean;

  // The timestamp which the image was last set.
  // It's used to automatically change the background image on all tabs when a new background image is set.
  // We're doing it this way because LocalStorage doesn't give us listeners.
  // (Unix timestamp in milliseconds)
  backgroundImageTimestamp: string;

  // Do not persist this! This could be a big as 5MB worth of pure string.
  // This state is completely managed by SyncReducer, so we don't need to worry about it here.
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
    case ActionType.showModal:
      newState = handleShowModal(state, action);
      break;
    case ActionType.hideModal:
      newState = handleHideModal(state, action);
      break;
    case ActionType.setBackgroundImage:
      newState = handleSetBackgroundImage(state, action as Action<SetBackgroundImageParams>);
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
