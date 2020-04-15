import { Action, UtilitiesActionType as ActionType } from 'actions/constants';

export function selectBookmarksTab(): Action {
  return {
    type: ActionType.selectBookmarksTab,
    params: {},
  };
}

export function selectNotesTab(): Action {
  return {
    type: ActionType.selectNotesTab,
    params: {},
  };
}
