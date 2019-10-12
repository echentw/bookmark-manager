import { Action, SettingsActionType as ActionType } from '../actions/constants';
import { AppState } from '../reduxStore';
import { Reducer } from './Reducer';
import { SetImageTimestampParams } from '../actions/SettingsActions';

interface Settings {
  // The timestamp which the image was last set.
  // It's used to automatically change the background image on all tabs when a new background image is set.
  // We're doing it this way because LocalStorage doesn't give us listeners.
  // (Unix timestamp in milliseconds)
  imageTimestamp: string;
}

export interface SettingsState {
  showingModal: boolean;
  settings: Settings;
}

export const initialSettingsState: SettingsState = {
  showingModal: false,
  settings: {
    imageTimestamp: '',
  },
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
    case ActionType.setImageTimestamp:
      newState = handleSetImageTimestamp(state, action as Action<SetImageTimestampParams>);
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

function handleSetImageTimestamp(state: SettingsState, action: Action<SetImageTimestampParams>): SettingsState {
  return {
    ...state,
    settings: {
      ...state.settings,
      imageTimestamp: action.params.imageTimestamp,
    },
  };
}
