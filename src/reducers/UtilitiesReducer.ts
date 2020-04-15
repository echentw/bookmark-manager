import { Action, UtilitiesActionType as ActionType } from 'actions/constants';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';

enum Tab {
  Bookmarks,
  Notes,
}

export interface UtilitiesState {
  activeTab: Tab;
}

export const initialUtilitiesState = {
  activeTab: Tab.Bookmarks,
};

export const utilitiesReducer: Reducer<UtilitiesState> = (
  state: UtilitiesState,
  action: Action,
  appState: AppState
): UtilitiesState => {
  let newState = state;
  switch (action.type) {
    case ActionType.selectBookmarksTab:
      newState = {
        activeTab: Tab.Bookmarks,
      };
    case ActionType.selectNotesTab:
      newState = {
        activeTab: Tab.Notes,
      };
  }
  return newState;
}
