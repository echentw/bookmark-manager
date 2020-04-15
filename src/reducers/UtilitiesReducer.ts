import { Action, UtilitiesActionType as ActionType } from 'actions/constants';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';

export enum UtilityTab {
  Bookmarks = 'bookmarks',
  Notes = 'notes',
}

export namespace UtilityTab {
  export const create = (maybeStr: string | undefined): UtilityTab => {
    switch (maybeStr) {
      case UtilityTab.Bookmarks: return UtilityTab.Bookmarks;
      case UtilityTab.Notes: return UtilityTab.Notes;
      default: return UtilityTab.Bookmarks;
    }
  };
}

export interface UtilitiesState {
  activeTab: UtilityTab;
}

export const initialUtilitiesState = {
  activeTab: UtilityTab.Bookmarks,
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
        activeTab: UtilityTab.Bookmarks,
      };
      break;
    case ActionType.selectNotesTab:
      newState = {
        activeTab: UtilityTab.Notes,
      };
      break;
  }
  return newState;
}
