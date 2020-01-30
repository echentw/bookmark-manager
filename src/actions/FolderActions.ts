import { Folder } from 'Folder';
import { Action, FolderActionType as ActionType } from 'actions/constants';

export interface FolderParams {
  folder: Folder;
}

export function expandFolder(params: FolderParams): Action<FolderParams> {
  return {
    type: ActionType.expand,
    params: params,
  };
}

export function collapseFolder(params: FolderParams): Action<FolderParams> {
  return {
    type: ActionType.collapse,
    params: params,
  };
}
