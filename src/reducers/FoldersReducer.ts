import { Bookmark } from 'models/Bookmark';
import { Folder } from 'models/Folder';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';

import { AddBookmarksSaveParams } from 'actions/AddBookmarksActions';
import {
  Action,
  AddBookmarksActionType,
  DeleteFolderActionType,
  DragActionType,
  EditBookmarkActionType,
  EditFolderActionType,
  FolderActionType,
  SyncActionType,
} from 'actions/constants';
import { FolderParams } from 'actions/FolderActions';
import { DeleteFolderParams } from 'actions/DeleteFolderActions';
import { DragBookmarkParams, DragFolderParams } from 'actions/DragActions';
import { EditBookmarkParams } from 'actions/EditBookmarkActions';
import { EditFolderParams } from 'actions/EditFolderActions';
import { LoadParams, SyncParams } from 'actions/SyncActions';
import { withItemDeleted, withItemReplaced } from 'utils';

import { DraggableType } from 'components/AppComponent';

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
    case AddBookmarksActionType.save:
      newState = handleAddBookmarksSave(state, action as Action<AddBookmarksSaveParams>, appState);
      break;
    case EditBookmarkActionType.save:
      newState = handleEditBookmarkSave(state, action as Action<EditBookmarkParams>, appState);
      break;
    case EditBookmarkActionType.deleteBookmark:
      newState = handleEditBookmarkDeleteBookmark(state, action as Action<EditBookmarkParams>, appState);
      break;
    case DragActionType.isOverBookmark:
      newState = handleDragIsOverBookmark(state, action as Action<DragBookmarkParams>, appState);
      break;
    case DragActionType.isOverFolder:
      newState = handleDragIsOverFolder(state, action as Action<DragFolderParams>, appState);
      break;
    case FolderActionType.expand:
      newState = handleExpandFolder(state, action as Action<FolderParams>);
      break;
    case FolderActionType.collapse:
      newState = handleCollapseFolder(state, action as Action<FolderParams>);
      break;
    case SyncActionType.load:
      newState = handleLoad(state, action as Action<LoadParams>);
      break;
    case SyncActionType.sync:
      newState = handleSync(state, action as Action<SyncParams>);
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

function handleAddBookmarksSave(
  state: FoldersState,
  action: Action<AddBookmarksSaveParams>,
  appState: AppState,
): FoldersState {
  let folder = appState.addBookmarksState.folder;
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

function handleDragIsOverBookmark(
  state: FoldersState,
  action: Action<DragBookmarkParams>,
  appState: AppState,
): FoldersState {
  const { folderRank: draggedFolderRank, bookmarkRank: draggedBookmarkRank } = appState.dragState;
  const { folderRank: targetFolderRank, bookmarkRank: targetBookmarkRank } = action.params;

  const startFolder = state.folders[draggedFolderRank];
  const draggedBookmark = startFolder.bookmarks[draggedBookmarkRank];

  const targetFolder = state.folders[targetFolderRank];

  if (draggedFolderRank === targetFolderRank) {
    if (targetBookmarkRank >= 0 && targetBookmarkRank < startFolder.bookmarks.length) {
      const bookmarks = startFolder.bookmarks;
      if (draggedBookmarkRank > targetBookmarkRank) {
        for (let i = draggedBookmarkRank; i > targetBookmarkRank; --i) {
          bookmarks[i] = bookmarks[i - 1];
        }
      } else {
        for (let i = draggedBookmarkRank; i < targetBookmarkRank; ++i) {
          bookmarks[i] = bookmarks[i + 1];
        }
      }
      bookmarks[targetBookmarkRank] = draggedBookmark;
    }
  } else if (draggedFolderRank < targetFolderRank) {
    // We are moving the Bookmark from a Folder above to a Folder below.
    if (targetBookmarkRank < targetFolder.bookmarks.length) {
      // Insert the dragged bookmark after the bookmark we're hovering over.
      startFolder.bookmarks.splice(draggedBookmarkRank, 1);
      targetFolder.bookmarks.splice(targetBookmarkRank + 1, 0, draggedBookmark);
    }
  } else {
    // We are moving the Bookmark from a Folder below to a Folder above.
    if (targetBookmarkRank > -1) {
      // Insert the dragged bookmark before the bookmark we're hovering over.
      startFolder.bookmarks.splice(draggedBookmarkRank, 1);
      targetFolder.bookmarks.splice(targetBookmarkRank, 0, draggedBookmark);
    }
  }

  const newFolders = state.folders;
  return {
    folders: newFolders,
  };
}

function handleDragIsOverFolder(
  state: FoldersState,
  action: Action<DragFolderParams>,
  appState: AppState,
): FoldersState {
  const newFolders = state.folders;

  const draggedRank = appState.dragState.folderRank;
  const dropTargetRank = action.params.folderRank;

  const draggedFolder = newFolders[draggedRank];
  if (draggedRank > dropTargetRank) {
    for (let i = draggedRank; i > dropTargetRank; --i) {
      newFolders[i] = newFolders[i - 1];
    }
  } else {
    for (let i = draggedRank; i < dropTargetRank; ++i) {
      newFolders[i] = newFolders[i + 1];
    }
  }
  newFolders[dropTargetRank] = draggedFolder;

  return {
    folders: newFolders,
  };
}

function handleExpandFolder(state: FoldersState, action: Action<FolderParams>): FoldersState {
  const folder = state.folders.find(folder => folder.id === action.params.folder.id) ?? null;
  if (folder === null) {
    return state;
  }
  const newFolder = folder.withCollapsed(false);
  const newFolders = withItemReplaced<Folder>(state.folders, newFolder);
  return {
    folders: newFolders,
  };
}

function handleCollapseFolder(state: FoldersState, action: Action<FolderParams>): FoldersState {
  const folder = state.folders.find(folder => folder.id === action.params.folder.id) ?? null;
  if (folder === null) {
    return state;
  }
  const newFolder = folder.withCollapsed(true);
  const newFolders = withItemReplaced<Folder>(state.folders, newFolder);
  return {
    folders: newFolders,
  };
}

function handleLoad(state: FoldersState, action: Action<LoadParams>): FoldersState {
  return {
    folders: action.params.state.foldersState.folders,
  };
}

function handleSync(state: FoldersState, action: Action<SyncParams>): FoldersState {
  return {
    folders: action.params.state.foldersState.folders,
  };
}
