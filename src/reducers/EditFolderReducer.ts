import { Action, EditFolderActionType as ActionType } from 'actions/constants';
import { EditFolderParams, SelectFolderColorParams } from 'actions/EditFolderActions';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';

export interface EditFolderState {
  editingFolderId: string | null;
  showingColorPicker: boolean;
}

export const initialEditFolderState: EditFolderState = {
  editingFolderId: null,
  showingColorPicker: false,
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
    case ActionType.showColorPicker:
      newState = handleShowColorPicker(state, action as Action<EditFolderParams>);
      break;
    case ActionType.hideColorPicker:
      newState = handleHideColorPicker(state, action as Action<EditFolderParams>);
      break;
    case ActionType.selectColor:
      newState = handleSelectColor(state, action as Action<SelectFolderColorParams>);
      break;
  }
  return newState;
};

function handleBeginEdit(state: EditFolderState, action: Action<EditFolderParams>): EditFolderState {
  return {
    editingFolderId: action.params.folder.id,
    showingColorPicker: false,
  };
}

function handleCancel(state: EditFolderState, action: Action<EditFolderParams>): EditFolderState {
  return {
    editingFolderId: null,
    showingColorPicker: false,
  };
}

function handleSave(state: EditFolderState, action: Action<EditFolderParams>): EditFolderState {
  return {
    editingFolderId: null,
    showingColorPicker: false,
  };
}

function handleAddFolder(state: EditFolderState, action: Action<EditFolderParams>): EditFolderState {
  return {
    editingFolderId: action.params.folder.id,
    showingColorPicker: false,
  };
}

function handleShowColorPicker(state: EditFolderState, action: Action<EditFolderParams>): EditFolderState {
  if (state.editingFolderId !== action.params.folder.id) {
    // This should never happen...
    return state;
  }
  return {
    ...state,
    showingColorPicker: true,
  };
}

function handleHideColorPicker(state: EditFolderState, action: Action<EditFolderParams>): EditFolderState {
  if (state.editingFolderId !== action.params.folder.id) {
    // This should never happen...
    return state;
  }
  return {
    ...state,
    showingColorPicker: false,
  };
}

function handleSelectColor(state: EditFolderState, action: Action<SelectFolderColorParams>): EditFolderState {
  return {
    ...state,
    showingColorPicker: false,
  };
}
