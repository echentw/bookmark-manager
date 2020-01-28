import { Action, EditFolderActionType as ActionType } from 'actions/constants';
import { EditFolderParams } from 'actions/EditFolderActions';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';

export interface EditFolderState {
  editingFolderId: string | null;
}

export const initialEditFolderState: EditFolderState = {
  editingFolderId: null,
};

export const editFolderReducer: Reducer<EditFolderState> = (
  state: EditFolderState,
  action: Action,
  appState: AppState,
): EditFolderState => {
  let newState = state;
  switch (action.type) {
    case ActionType.beginEdit:
      newState = handleBeginEdit(state, action as Action<EditFolderParams>);
      break;
    case ActionType.cancel:
      newState = handleCancel(state, action as Action<EditFolderParams>);
      break;
    case ActionType.save:
      newState = handleSave(state, action as Action<EditFolderParams>);
      break;
    case ActionType.addFolder:
      newState = handleAddFolder(state, action as Action<EditFolderParams>);
      break;
  }
  return newState;
};

function handleBeginEdit(state: EditFolderState, action: Action<EditFolderParams>): EditFolderState {
  return {
    editingFolderId: action.params.folder.id,
  };
}

function handleCancel(state: EditFolderState, action: Action<EditFolderParams>): EditFolderState {
  return {
    editingFolderId: null,
  };
}

function handleSave(state: EditFolderState, action: Action<EditFolderParams>): EditFolderState {
  return {
    editingFolderId: null,
  };
}

function handleAddFolder(state: EditFolderState, action: Action<EditFolderParams>): EditFolderState {
  return {
    editingFolderId: action.params.folder.id,
  };
}
