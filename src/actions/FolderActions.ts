import { Folder } from '../Folder';
import { Action, FolderActionType as ActionType } from './constants';

export interface OpenFolderParams {
  folder: Folder;
}

function openFolder(params: OpenFolderParams): Action<OpenFolderParams> {
  return {
    type: ActionType.openFolder,
    params: params,
  };
}

function closeFolder(params: {}): Action {
  return {
    type: ActionType.closeFolder,
    params: params,
  };
}
