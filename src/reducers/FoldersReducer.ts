import { Folder } from '../Folder';
import { Action, FolderActionType, SyncAppActionType } from '../actions/constants';
import { SyncFoldersParams } from '../actions/SyncAppActions';
import { OpenFolderParams } from '../actions/FolderActions';

export interface FoldersState {
  folders: Folder[];
  draggedRank: number | null;
  loaded: boolean;
  openFolderId: string | null;
}

const firstFolder = new Folder({ name: 'General' });

export const initialFoldersState: FoldersState = {
  folders: [firstFolder],
  draggedRank: null,
  loaded: false,
  openFolderId: firstFolder.id,
}

export function foldersReducer(state: FoldersState = initialFoldersState, action: Action): FoldersState {
  switch (action.type) {
    case FolderActionType.openFolder:
      return handleOpenFolder(state, action as Action<OpenFolderParams>);
    case FolderActionType.closeFolder:
      return handleCloseFolder(state, action);
    case SyncAppActionType.syncFolders:
      return handleSyncFolders(state, action as Action<SyncFoldersParams>);
    default:
      return state;
  }
}

function handleOpenFolder(state: FoldersState, action: Action<OpenFolderParams>): FoldersState {
  return {
    ...state,
    openFolderId: action.params.folder.id,
  };
}

function handleCloseFolder(state: FoldersState, action: Action): FoldersState {
  return {
    ...state,
    openFolderId: null,
  };
}

function handleSyncFolders(state: FoldersState, action: Action<SyncFoldersParams>): FoldersState {
  let openFolderId = state.openFolderId;
  if (openFolderId === null && action.params.openFolderId !== null) {
    openFolderId = action.params.openFolderId;
  }
  return {
    ...state,
    folders: action.params.folders,
    openFolderId: openFolderId,
  };
}
