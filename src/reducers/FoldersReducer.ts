import { Folder } from '../Folder';
import { Bookmark } from '../Bookmark';
import { Reducer } from './Reducer';
import { AppState } from '../reduxStore';

import { withItemReplaced, withItemDeleted } from '../utils';
import {
  Action,
  DeleteFolderActionType,
  EditFolderActionType,
  FolderActionType,
  SyncAppActionType,
  AddBookmarksActionType,
  EditBookmarkActionType,
  DragDropActionType,
} from '../actions/constants';
import { SyncFoldersParams } from '../actions/SyncAppActions';
import { DeleteFolderParams } from '../actions/DeleteFolderActions';
import { EditFolderParams, SelectFolderColorParams } from '../actions/EditFolderActions';
import { AddBookmarksSaveParams } from '../actions/AddBookmarksActions';
import { EditBookmarkParams } from '../actions/EditBookmarkActions';
import { DragParams } from '../actions/DragDropActions';

export interface FoldersState {
  folders: Folder[];
  loaded: boolean;
}

export const initialFoldersState: FoldersState = {
  folders: [],
  loaded: false,
}

export const foldersReducer: Reducer<FoldersState> = (
  state: FoldersState,
  action: Action,
  appState: AppState
): FoldersState => {
  let newState = state;
  switch (action.type) {
    case DeleteFolderActionType.confirmDelete:
      newState = handleDeleteFolder(state, action as Action<DeleteFolderParams>);
      break;
    case EditFolderActionType.addFolder:
      newState = handleAddFolder(state, action as Action<EditFolderParams>);
      break;
    case EditFolderActionType.save:
      newState = handleEditFolderSave(state, action as Action<EditFolderParams>);
      break;
    case EditFolderActionType.selectColor:
      newState = handleSelectFolderColor(state, action as Action<SelectFolderColorParams>);
      break;
    case SyncAppActionType.syncFolders:
      newState = handleSyncFolders(state, action as Action<SyncFoldersParams>);
      break;
    case AddBookmarksActionType.save:
      newState = handleAddBookmarksSave(state, action as Action<AddBookmarksSaveParams>, appState);
      break;
    case EditBookmarkActionType.save:
      newState = handleEditBookmarkSave(state, action as Action<EditBookmarkParams>, appState);
      break;
    case EditBookmarkActionType.deleteBookmark:
      newState = handleEditBookmarkDeleteBookmark(state, action as Action<EditBookmarkParams>, appState);
      break;
    case DragDropActionType.isOver:
      newState = handleDragIsOver(state, action as Action<DragParams>, appState);
      break;
  }
  return newState;
}

function handleAddFolder(state: FoldersState, action: Action<EditFolderParams>): FoldersState {
  const folders = state.folders.concat([action.params.folder]);
  return {
    ...state,
    folders: folders,
  };
}

function handleDeleteFolder(state: FoldersState, action: Action<DeleteFolderParams>): FoldersState {
  const newFolders = withItemDeleted(state.folders, action.params.folder);
  return {
    ...state,
    folders: newFolders,
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
  };
}

function handleSelectFolderColor(state: FoldersState, action: Action<SelectFolderColorParams>): FoldersState {
  const index = state.folders.findIndex((folder: Folder) => {
    return folder.id === action.params.folder.id;
  });
  const folders = state.folders.slice(0); // copies the array
  const newFolder = action.params.folder.withColor(action.params.color);
  folders[index] = newFolder;
  return {
    ...state,
    folders: folders,
  };
}

function handleSyncFolders(state: FoldersState, action: Action<SyncFoldersParams>): FoldersState {
  return {
    ...state,
    folders: action.params.folders,
    loaded: true,
  };
}

function handleAddBookmarksSave(
  state: FoldersState,
  action: Action<AddBookmarksSaveParams>,
  appState: AppState
): FoldersState {
  if (appState.navigationState.currentFolderId === null) {
    return state;
  }
  const folder = state.folders.find(folder => folder.id === appState.navigationState.currentFolderId) || null;
  if (folder === null) {
    return state;
  }
  const newBookmarks = folder.bookmarks.concat(action.params.bookmarks);
  const newFolder = folder.withBookmarks(newBookmarks);
  const newFolders = withItemReplaced<Folder>(state.folders, newFolder);
  return {
    ...state,
    folders: newFolders,
  };
}

function handleEditBookmarkSave(
  state: FoldersState,
  action: Action<EditBookmarkParams>,
  appState: AppState
): FoldersState {
  if (appState.navigationState.currentFolderId === null) {
    return state;
  }
  const folder = state.folders.find(folder => folder.id === appState.navigationState.currentFolderId) || null;
  if (folder === null) {
    return state;
  }
  const newBookmarks = withItemReplaced<Bookmark>(folder.bookmarks, action.params.bookmark);
  const newFolder = folder.withBookmarks(newBookmarks);
  const newFolders = withItemReplaced<Folder>(state.folders, newFolder);
  return {
    ...state,
    folders: newFolders,
  };
}

function handleEditBookmarkDeleteBookmark(
  state: FoldersState,
  action: Action<EditBookmarkParams>,
  appState: AppState
): FoldersState {
  if (appState.navigationState.currentFolderId === null) {
    return state;
  }
  const folder = state.folders.find(folder => folder.id === appState.navigationState.currentFolderId) || null;
  if (folder === null) {
    return state;
  }
  const newBookmarks = withItemDeleted<Bookmark>(folder.bookmarks, action.params.bookmark);
  const newFolder = folder.withBookmarks(newBookmarks);
  const newFolders = withItemReplaced<Folder>(state.folders, newFolder);
  return {
    ...state,
    folders: newFolders,
  };
}

// So... we manually set the state in this method, which is bad.
// But we need this for performance.
function handleDragIsOver(
  state: FoldersState,
  action: Action<DragParams>,
  appState: AppState
): FoldersState {
  if (appState.navigationState.currentFolderId === null) {
    return _handleFolderDragIsOver(state, action, appState);
  } else {
    return _handleBookmarkDragIsOver(state, action, appState);
  }
}

function _handleFolderDragIsOver(
  state: FoldersState,
  action: Action<DragParams>,
  appState: AppState
): FoldersState {
  const folders = state.folders;
  const draggedRank = appState.dragDropState.draggedRank;
  const dropTargetRank = action.params.rank;

  const draggedFolder = folders[draggedRank];
  if (draggedRank > dropTargetRank) {
    for (let i = draggedRank; i > dropTargetRank; --i) {
      folders[i] = folders[i - 1];
    }
  } else {
    for (let i = draggedRank; i < dropTargetRank; ++i) {
      folders[i] = folders[i + 1];
    }
  }
  folders[dropTargetRank] = draggedFolder;

  return {
    ...state,
    folders: folders,
  };
}

function _handleBookmarkDragIsOver(
  state: FoldersState,
  action: Action<DragParams>,
  appState: AppState
): FoldersState {
  if (appState.navigationState.currentFolderId === null) {
    return state;
  }
  const folder = state.folders.find(folder => folder.id === appState.navigationState.currentFolderId) || null;
  if (folder === null) {
    return state;
  }
  const bookmarks = folder.bookmarks;
  const draggedRank = appState.dragDropState.draggedRank;
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

  const newFolders = state.folders;

  return {
    ...state,
    folders: newFolders,
  };
}
