import { Action, SettingsActionType as ActionType } from '../actions/constants';
import { AppState } from '../reduxStore';
import { Reducer } from './Reducer';
import { SetBackgroundImageTimestampParams } from '../actions/SettingsActions';

export interface SettingsState {
  showingModal: boolean;

  // The timestamp which the image was last set.
  // It's used to automatically change the background image on all tabs when a new background image is set.
  // We're doing it this way because LocalStorage doesn't give us listeners.
  // (Unix timestamp in milliseconds)
  backgroundImageTimestamp: string;
}

export const initialSettingsState: SettingsState = {
  showingModal: false,
  backgroundImageTimestamp: '',
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
    case ActionType.setBackgroundImageTimestamp:
      newState = handleSetBackgroundImageTimestamp(state, action as Action<SetBackgroundImageTimestampParams>);
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

function handleSetBackgroundImageTimestamp(
  state: SettingsState,
  action: Action<SetBackgroundImageTimestampParams>
): SettingsState {
  return {
    ...state,
    backgroundImageTimestamp: action.params.backgroundImageTimestamp,
  };
}
