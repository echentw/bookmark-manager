import { Bookmark } from 'Bookmark';
import { Folder } from 'Folder';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';

import { AddBookmarksSaveParams } from 'actions/AddBookmarksActions';
import {
  Action,
  AddBookmarksActionType,
  DeleteFolderActionType,
  DragDropActionType,
  EditBookmarkActionType,
  EditFolderActionType,
} from 'actions/constants';
import { DeleteFolderParams } from 'actions/DeleteFolderActions';
import { DragParams } from 'actions/DragDropActions';
import { EditBookmarkParams } from 'actions/EditBookmarkActions';
import { EditFolderParams, SelectFolderColorParams } from 'actions/EditFolderActions';
import { withItemDeleted, withItemReplaced } from 'utils';

export interface FoldersState {
  folders: Folder[];
}

export const initialFoldersState: FoldersState = {
  folders: [],
};

export const foldersReducer: Reducer<FoldersState> = (
  state: FoldersState,
  action: Action,
  appState: AppState,
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
};

function handleAddFolder(state: FoldersState, action: Action<EditFolderParams>): FoldersState {
  const folders = state.folders.concat([action.params.folder]);
  return {
    folders: folders,
  };
}

function handleDeleteFolder(state: FoldersState, action: Action<DeleteFolderParams>): FoldersState {
  const newFolders = withItemDeleted(state.folders, action.params.folder);
  if (newFolders.length === 0) {
    // Enforce that there is always at least one folder. But this should be guarded against
    // on the UI side, so ideally this code never gets run.
    return state;
  }
  return {
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
    folders: folders,
  };
}

function handleAddBookmarksSave(
  state: FoldersState,
  action: Action<AddBookmarksSaveParams>,
  appState: AppState,
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
    folders: newFolders,
  };
}

function handleEditBookmarkSave(
  state: FoldersState,
  action: Action<EditBookmarkParams>,
  appState: AppState,
): FoldersState {
  const folder = state.folders.find(folder =>
    folder.bookmarks.some(bookmark => bookmark.id === action.params.bookmark.id)
  );
  const newBookmarks = withItemReplaced<Bookmark>(folder.bookmarks, action.params.bookmark);
  const newFolder = folder.withBookmarks(newBookmarks);
  const newFolders = withItemReplaced<Folder>(state.folders, newFolder);
  return {
    folders: newFolders,
  };
}

function handleEditBookmarkDeleteBookmark(
  state: FoldersState,
  action: Action<EditBookmarkParams>,
  appState: AppState,
): FoldersState {
  const folder = state.folders.find(folder =>
    folder.bookmarks.some(bookmark => bookmark.id === action.params.bookmark.id)
  );
  const newBookmarks = withItemDeleted<Bookmark>(folder.bookmarks, action.params.bookmark);
  const newFolder = folder.withBookmarks(newBookmarks);
  const newFolders = withItemReplaced<Folder>(state.folders, newFolder);
  return {
    folders: newFolders,
  };
}

// So... we manually set the state in this method, which is bad.
// But we need this for performance.
function handleDragIsOver(
  state: FoldersState,
  action: Action<DragParams>,
  appState: AppState,
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
  appState: AppState,
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
    folders: folders,
  };
}

function _handleBookmarkDragIsOver(
  state: FoldersState,
  action: Action<DragParams>,
  appState: AppState,
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
    folders: newFolders,
  };
}
