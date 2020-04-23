import { Action, DragActionType as ActionType } from 'actions/constants';
import { DragBookmarkParams, DragFolderParams, DragNoteParams, DropParams } from 'actions/DragActions';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';
import { DraggableType } from 'components/AppComponent';

export interface DragState {
  draggableType: DraggableType | null;
  folderRank: number | null;
  bookmarkRank: number | null;
  noteRank: number | null;
}

export const initialDragState: DragState = {
  draggableType: null,
  folderRank: null,
  bookmarkRank: null,
  noteRank: null,
};

export const dragReducer: Reducer<DragState> = (
  state: DragState,
  action: Action,
  appState: AppState,
): DragState => {
  let newState = state;
  switch (action.type) {
    case ActionType.beginDragBookmark:
      newState = handleBeginDragBookmark(state, action as Action<DragBookmarkParams>);
      break;
    case ActionType.beginDragFolder:
      newState = handleBeginDragFolder(state, action as Action<DragFolderParams>);
      break;
    case ActionType.beginDragNote:
      newState = handleBeginDragNote(state, action as Action<DragNoteParams>);
      break;
    case ActionType.isOverBookmark:
      newState = handleIsOverBookmark(state, action as Action<DragBookmarkParams>, appState);
      break;
    case ActionType.isOverFolder:
      newState = handleIsOverFolder(state, action as Action<DragFolderParams>);
      break;
    case ActionType.isOverNote:
      newState = handleIsOverNote(state, action as Action<DragNoteParams>);
      break;
    case ActionType.end:
      newState = handleEnd(state, action as Action<DropParams>);
      break;
  }
  return newState;
}

function handleBeginDragBookmark(state: DragState, action: Action<DragBookmarkParams>): DragState {
  return {
    draggableType: DraggableType.Bookmark,
    folderRank: action.params.folderRank,
    bookmarkRank: action.params.bookmarkRank,
    noteRank: null,
  };
}

function handleBeginDragFolder(state: DragState, action: Action<DragFolderParams>): DragState {
  return {
    draggableType: DraggableType.Folder,
    folderRank: action.params.folderRank,
    bookmarkRank: null,
    noteRank: null,
  };
}

function handleBeginDragNote(state: DragState, action: Action<DragNoteParams>): DragState {
  return {
    draggableType: DraggableType.Note,
    folderRank: null,
    bookmarkRank: null,
    noteRank: action.params.noteRank,
  };
}

function handleIsOverBookmark(
  state: DragState,
  action: Action<DragBookmarkParams>,
  appState: AppState
): DragState {
  const targetFolder = appState.foldersState.folders[action.params.folderRank];

  let newFolderRank = state.folderRank;
  let newBookmarkRank = state.bookmarkRank;
  if (state.folderRank === action.params.folderRank) {
    if (action.params.bookmarkRank >= 0 && action.params.bookmarkRank < targetFolder.bookmarks.length) {
      newFolderRank = action.params.folderRank;
      newBookmarkRank = action.params.bookmarkRank;
    }
  } else if (state.folderRank < action.params.folderRank) {
    // We are moving the Bookmark from a Folder above to a Folder below.
    if (action.params.bookmarkRank < targetFolder.bookmarks.length) {
      // Insert the dragged bookmark after the bookmark we're hovering over.
      newFolderRank = action.params.folderRank;
      newBookmarkRank = action.params.bookmarkRank + 1;
    }
  } else {
    // We are moving the Bookmark from a Folder below to a Folder above.
    if (action.params.bookmarkRank > -1) {
      // Insert the dragged bookmark before the bookmark we're hovering over.
      newFolderRank = action.params.folderRank;
      newBookmarkRank = action.params.bookmarkRank;
    }
  }

  return {
    ...state,
    folderRank: newFolderRank,
    bookmarkRank: newBookmarkRank,
  };
}

function handleIsOverFolder(state: DragState, action: Action<DragFolderParams>): DragState {
  return {
    ...state,
    folderRank: action.params.folderRank,
  };
}

function handleIsOverNote(state: DragState, action: Action<DragNoteParams>): DragState {
  return {
    ...state,
    noteRank: action.params.noteRank,
  };
}

function handleEnd(state: DragState, action: Action<DropParams>): DragState {
  return {
    draggableType: null,
    folderRank: null,
    bookmarkRank: null,
    noteRank: null,
  };
}
