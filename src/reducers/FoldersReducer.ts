import { Folder } from '../Folder';
import { Action, FolderActionType, SyncAppActionType } from '../actions/constants';
import { SyncFoldersParams } from '../actions/SyncAppActions';
import { OpenFolderParams } from '../actions/FolderActions';

export interface FoldersState {
  folders: Folder[];
  draggedRank: number | null;
  loaded: boolean;
  openFolder: Folder | null;
}

export const initialFoldersState: FoldersState = {
  folders: [],
  draggedRank: null,
  loaded: false,
  openFolder: null,
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
    openFolder: action.params.folder,
  };
}

function handleCloseFolder(state: FoldersState, action: Action): FoldersState {
  return {
    ...state,
    openFolder: null,
  };
}

function handleSyncFolders(state: FoldersState, action: Action<SyncFoldersParams>): FoldersState {
  let openFolder = state.openFolder;
  if (openFolder === null && action.params.openFolder !== null) {
    openFolder = action.params.openFolder;
  }

  return {
    ...state,
    folders: action.params.folders,
    openFolder: openFolder,
  };
}
