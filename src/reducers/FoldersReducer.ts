import { Folder } from '../Folder';
import { Bookmark } from '../Bookmark';
import { withItemReplaced, withItemDeleted } from '../utils';
import {
  Action,
  EditFolderActionType,
  FolderActionType,
  SyncAppActionType,
  AddBookmarksActionType,
  EditBookmarkActionType,
  DragDropActionType,
} from '../actions/constants';
import { SyncFoldersParams } from '../actions/SyncAppActions';
import { OpenFolderParams } from '../actions/FolderActions';
import { EditFolderParams } from '../actions/EditFolderActions';
import { AddBookmarksSaveParams } from '../actions/AddBookmarksActions';
import { EditBookmarkParams } from '../actions/EditBookmarkActions';
import { DragDropParams } from '../actions/DragDropActions';

export interface FoldersState {
  folders: Folder[];
  loaded: boolean;
  openFolder: Folder | null;
  editingFolder: Folder | null;
  draggedFolderRank: number | null;
  draggedBookmarkRank: number | null,
}

export const initialFoldersState: FoldersState = {
  folders: [],
  loaded: false,
  openFolder: null,
  editingFolder: null,
  draggedFolderRank: null,
  draggedBookmarkRank: null,
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

    case AddBookmarksActionType.save:
      return handleAddBookmarksSave(state, action as Action<AddBookmarksSaveParams>);
    case EditBookmarkActionType.save:
      return handleEditBookmarkSave(state, action as Action<EditBookmarkParams>);
    case EditBookmarkActionType.deleteBookmark:
      return handleEditBookmarkDeleteBookmark(state, action as Action<EditBookmarkParams>);

    case DragDropActionType.beginDrag:
      return handleBeginDrag(state, action as Action<DragDropParams>);
    case DragDropActionType.endDrag:
      return handleEndDrag(state, action as Action<DragDropParams>);
    case DragDropActionType.isOver:
      return handleDragIsOver(state, action as Action<DragDropParams>);

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
  const newFolders = withItemDeleted(state.folders, action.params.folder);
  return {
    ...state,
    folders: newFolders,
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
  let openFolder: Folder | null = null;
  if (state.openFolder === null) {
    openFolder = action.params.openFolder;
  } else {
    const maybeFolder = action.params.folders.find((folder: Folder) => {
      return folder.id === state.openFolder.id;
    });
    openFolder = maybeFolder ? maybeFolder : null;
  }

  return {
    ...state,
    folders: action.params.folders,
    openFolder: openFolder,
    loaded: true,
  };
}

function handleAddBookmarksSave(state: FoldersState, action: Action<AddBookmarksSaveParams>): FoldersState {
  if (state.openFolder === null) {
    return state;
  }
  const folder = state.openFolder;
  const newBookmarks = folder.bookmarks.concat(action.params.bookmarks);
  const newFolder = folder.withBookmarks(newBookmarks);
  const newFolders = withItemReplaced<Folder>(state.folders, newFolder);
  return {
    ...state,
    folders: newFolders,
    openFolder: newFolder,
  };
}

function handleEditBookmarkSave(state: FoldersState, action: Action<EditBookmarkParams>): FoldersState {
  if (state.openFolder === null) {
    return state;
  }
  const folder = state.openFolder;
  const newBookmarks = withItemReplaced<Bookmark>(folder.bookmarks, action.params.bookmark);
  const newFolder = folder.withBookmarks(newBookmarks);
  const newFolders = withItemReplaced<Folder>(state.folders, newFolder);
  return {
    ...state,
    folders: newFolders,
    openFolder: newFolder,
  };
}

function handleEditBookmarkDeleteBookmark(state: FoldersState, action: Action<EditBookmarkParams>): FoldersState {
  if (state.openFolder === null) {
    return state;
  }
  const folder = state.openFolder;
  const newBookmarks = withItemDeleted<Bookmark>(folder.bookmarks, action.params.bookmark);
  const newFolder = folder.withBookmarks(newBookmarks);
  const newFolders = withItemReplaced<Folder>(state.folders, newFolder);
  return {
    ...state,
    folders: newFolders,
    openFolder: newFolder,
  };
}

function handleBeginDrag(state: FoldersState, action: Action<DragDropParams>): FoldersState {
  if (state.openFolder === null) {
    return state;
  }
  return {
    ...state,
    draggedBookmarkRank: action.params.rank,
  };
}

function handleEndDrag(state: FoldersState, action: Action<DragDropParams>): FoldersState {
  if (state.openFolder === null) {
    return state;
  }
  return {
    ...state,
    draggedBookmarkRank: action.params.rank,
  };
}

function handleDragIsOver(state: FoldersState, action: Action<DragDropParams>): FoldersState {
  if (state.openFolder === null) {
    return state;
  }

  const bookmarks = state.openFolder.bookmarks.splice(0); // copies the array
  const draggedRank = state.draggedBookmarkRank;
  const dropTargetRank = action.params.rank;

  // TODO: do the array operations properly
  const draggedBookmark = bookmarks[draggedRank];
  if (draggedRank > dropTargetRank) {
    for (let i = draggedRank; i > dropTargetRank; --i) {
      bookmarks[i] = bookmarks[i - 1];
    }
  } else {
    for (let i = draggedRank; i < dropTargetRank; ++i) {
      bookmarks[i] = bookmarks[i + 1];
    }
  }
  bookmarks[dropTargetRank] = draggedBookmark;

  const newFolder = state.openFolder.withBookmarks(bookmarks);
  const newFolders = withItemReplaced<Folder>(state.folders, newFolder);

  return {
    ...state,
    folders: newFolders,
    openFolder: newFolder,
    draggedBookmarkRank: dropTargetRank,
  };
}
