import { Folder } from '../Folder';
import { Action, EditFolderActionType, FolderActionType, SyncAppActionType } from '../actions/constants';
import { SyncFoldersParams } from '../actions/SyncAppActions';
import { OpenFolderParams } from '../actions/FolderActions';
import { EditFolderParams } from '../actions/EditFolderActions';

export interface FoldersState {
  folders: Folder[];
  draggedRank: number | null;
  loaded: boolean;
  openFolder: Folder | null;
  editingFolder: Folder | null;
}

export const initialFoldersState: FoldersState = {
  folders: [],
  draggedRank: null,
  loaded: false,
  openFolder: null,
  editingFolder: null,
}

export function foldersReducer(state: FoldersState = initialFoldersState, action: Action): FoldersState {
  switch (action.type) {
    case EditFolderActionType.addFolder:
      return handleAddFolder(state, action);
    case EditFolderActionType.deleteFolder:
      return handleDeleteFolder(state, action as Action<EditFolderParams>);
    case EditFolderActionType.beginEdit:
      return handleEditFolderBegin(state, action as Action<EditFolderParams>);
    case EditFolderActionType.cancel:
      return handleEditFolderCancel(state, action as Action<EditFolderParams>);
    case EditFolderActionType.save:
      return handleEditFolderSave(state, action as Action<EditFolderParams>);
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

function handleAddFolder(state: FoldersState, action: Action): FoldersState {
  const folder = new Folder({ name: '' });
  const folders = state.folders.concat([folder]);
  return {
    ...state,
    editingFolder: folder,
    folders: folders,
  };
}

function handleDeleteFolder(state: FoldersState, action: Action<EditFolderParams>): FoldersState {
  const index = state.folders.findIndex((folder: Folder) => {
    return folder.id === action.params.folder.id;
  });
  const folders = state.folders.slice(0); // copies the array
  folders.splice(index, 1);
  return {
    ...state,
    folders: folders,
  };
}

function handleEditFolderBegin(state: FoldersState, action: Action<EditFolderParams>): FoldersState {
  return {
    ...state,
    editingFolder: action.params.folder,
  };
}

function handleEditFolderCancel(state: FoldersState, action: Action<EditFolderParams>): FoldersState {
  return {
    ...state,
    editingFolder: null,
  };
}

function handleEditFolderSave(state: FoldersState, action: Action<EditFolderParams>): FoldersState {
  const index = state.folders.findIndex((folder: Folder) => {
    return folder.id === action.params.folder.id;
  });
  const folders = state.folders.slice(0); // copies the array
  folders[index] = action.params.folder;
  return {
    ...state,
    folders: folders,
    editingFolder: null,
  };
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
