import { Folder } from 'models/Folder';
import { Action, DeleteFolderActionType as ActionType } from 'actions/constants';

export interface DeleteFolderParams {
  folder: Folder;
}

export function beginDelete(params: DeleteFolderParams): Action<DeleteFolderParams> {
  return {
    type: ActionType.beginDelete,
    params: params,
  };
}

export function confirmDelete(params: DeleteFolderParams): Action<DeleteFolderParams> {
  return {
    type: ActionType.confirmDelete,
    params: params,
  };
}

export function cancelDelete(params: DeleteFolderParams): Action<DeleteFolderParams> {
  return {
    type: ActionType.cancelDelete,
    params: params,
  };
}
