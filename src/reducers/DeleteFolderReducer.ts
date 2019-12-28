import { Action, DeleteFolderActionType as ActionType } from 'actions/constants';
import { DeleteFolderParams } from 'actions/DeleteFolderActions';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';

export interface DeleteFolderState {
  deletingFolderId: string | null;
}

export const initialDeleteFolderState: DeleteFolderState = {
  deletingFolderId: null,
};

export const deleteFolderReducer: Reducer<DeleteFolderState> = (
  state: DeleteFolderState = initialDeleteFolderState,
  action: Action,
  appState: AppState,
): DeleteFolderState => {
  let newState = state;
  switch (action.type) {
    case ActionType.beginDelete:
      newState = handleBeginDelete(state, action as Action<DeleteFolderParams>);
      break;
    case ActionType.confirmDelete:
      newState = handleConfirmDelete(state, action as Action<DeleteFolderParams>);
      break;
    case ActionType.cancelDelete:
      newState = handleCancelDelete(state, action as Action<DeleteFolderParams>);
      break;
  }
  return newState;
};

function handleBeginDelete(state: DeleteFolderState, action: Action<DeleteFolderParams>): DeleteFolderState {
  return {
    deletingFolderId: action.params.folder.id,
  };
}

function handleConfirmDelete(state: DeleteFolderState, action: Action<DeleteFolderParams>): DeleteFolderState {
  if (state.deletingFolderId !== action.params.folder.id) {
    // This should never happen...
    return state;
  }
  return {
    deletingFolderId: null,
  };
}

function handleCancelDelete(state: DeleteFolderState, action: Action<DeleteFolderParams>): DeleteFolderState {
  return {
    deletingFolderId: null,
  };
}
