import { Action, DragActionType as ActionType } from 'actions/constants';
import { DragParams, DropParams } from 'actions/DragActions';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';
import { DraggableType } from 'components/AppComponent';

export interface DragState {
  draggableType: DraggableType | null;
  folderRank: number | null;
  bookmarkRank: number | null;
}

export const initialDragState: DragState = {
  draggableType: null,
  folderRank: null,
  bookmarkRank: null,
};

export const dragReducer: Reducer<DragState> = (
  state: DragState,
  action: Action,
  appState: AppState,
): DragState => {
  let newState = state;
  switch (action.type) {
    case ActionType.begin:
      newState = handleBegin(state, action as Action<DragParams>);
      break;
    case ActionType.end:
      newState = handleEnd(state, action as Action<DropParams>, appState);
      break;
    case ActionType.isOver:
      if (state.draggableType === DraggableType.Bookmark) {
        newState = handleIsOverBookmark(state, action as Action<DragParams>, appState);
      } else if (state.draggableType === DraggableType.Folder) {
        newState = handleIsOverFolder(state, action as Action<DragParams>, appState);
      }
      break;
  }
  return newState;
}

function handleBegin(state: DragState, action: Action<DragParams>): DragState {
  return {
    draggableType: action.params.draggableType,
    folderRank: action.params.folderRank,
    bookmarkRank: action.params.bookmarkRank,
  };
}

function handleEnd(
  state: DragState,
  action: Action<DropParams>,
  appState: AppState
): DragState {
  return {
    draggableType: null,
    folderRank: null,
    bookmarkRank: null,
  };
}

function handleIsOverBookmark(
  state: DragState,
  action: Action<DragParams>,
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

function handleIsOverFolder(
  state: DragState,
  action: Action<DragParams>,
  appState: AppState
): DragState {
  return {
    ...state,
    folderRank: action.params.folderRank,
  };
}
