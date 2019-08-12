import { Folder, FolderColor } from '../Folder';
import { Action, EditFolderActionType as ActionType } from './constants';

export interface EditFolderParams {
  folder: Folder;
}

export interface SelectFolderColorParams extends EditFolderParams {
  color: FolderColor;
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

export function showColorPicker(params: EditFolderParams): Action<EditFolderParams> {
  return {
    type: ActionType.showColorPicker,
    params: params,
  };
}

export function hideColorPicker(params: EditFolderParams): Action<EditFolderParams> {
  return {
    type: ActionType.hideColorPicker,
    params: params,
  };
}

export function selectColor(params: SelectFolderColorParams): Action<SelectFolderColorParams> {
  return {
    type: ActionType.selectColor,
    params: params,
  };
}
