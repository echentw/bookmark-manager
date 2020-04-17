import { Folder } from 'models/Folder';
import { Action, EditFolderActionType as ActionType } from 'actions/constants';

export interface EditFolderParams {
  folder: Folder;
}

export function beginEdit(params: EditFolderParams): Action<EditFolderParams> {
  return {
    type: ActionType.beginEdit,
    params: params,
  };
}

export function cancel(params: {}): Action {
  return {
    type: ActionType.cancel,
    params: params,
  };
}

export function save(params: EditFolderParams): Action<EditFolderParams> {
  return {
    type: ActionType.save,
    params: params,
  };
}

export function addFolder(params: {}): Action<EditFolderParams> {
  const folder = new Folder({ name: '' });
  return {
    type: ActionType.addFolder,
    params: {
      folder: folder,
    },
  };
}
