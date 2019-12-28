import { Folder } from 'Folder';
import { Action, FolderActionType as ActionType } from 'actions/constants';

export interface OpenFolderParams {
  folder: Folder;
}

export function openFolder(params: OpenFolderParams): Action<OpenFolderParams> {
  return {
    type: ActionType.openFolder,
    params: params,
  };
}

export function closeFolder(params: {}): Action {
  return {
    type: ActionType.closeFolder,
    params: params,
  };
}
