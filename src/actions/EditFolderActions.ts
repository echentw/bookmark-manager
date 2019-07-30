import { Folder } from '../Folder';
import { Action, EditFolderActionType as ActionType } from './constants';

export interface EditFolderParams {
  folder: Folder;
}

export function beginEdit(params: EditFolderParams): Action<EditFolderParams> {
  return {
    type: ActionType.beginEdit,
    params: params,
  };
}

export function cancel(params: EditFolderParams): Action<EditFolderParams> {
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

export function addFolder(params: {}): Action {
  return {
    type: ActionType.addFolder,
    params: params,
  };
}

export function deleteFolder(params: EditFolderParams): Action<EditFolderParams> {
  return {
    type: ActionType.deleteFolder,
    params: params,
  };
}
