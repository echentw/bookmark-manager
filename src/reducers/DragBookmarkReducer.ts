import { Action, DragBookmarkActionType as ActionType } from 'actions/constants';
import { DragBookmarkParams, DropBookmarkParams } from 'actions/DragBookmarkActions';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';

export interface DragBookmarkState {
  folderRank: number | null;
  bookmarkRank: number | null;
}

export const initialDragBookmarkState: DragBookmarkState = {
  folderRank: null,
  bookmarkRank: null,
};

export const dragBookmarkReducer: Reducer<DragBookmarkState> = (
  state: DragBookmarkState,
  action: Action,
  appState: AppState,
): DragBookmarkState => {
  let newState = state;
  switch (action.type) {
    case ActionType.begin:
      newState = handleBegin(state, action as Action<DragBookmarkParams>);
      break;
    case ActionType.end:
      newState = handleEnd(state, action as Action<DropBookmarkParams>, appState);
      break;
    case ActionType.isOver:
      newState = handleIsOver(state, action as Action<DragBookmarkParams>, appState);
      break;
  }
  return newState;
}

function handleBegin(state: DragBookmarkState, action: Action<DragBookmarkParams>): DragBookmarkState {
  return {
    folderRank: action.params.folderRank,
    bookmarkRank: action.params.bookmarkRank,
  };
}

function handleEnd(
  state: DragBookmarkState,
  action: Action<DropBookmarkParams>,
  appState: AppState
): DragBookmarkState {
  return {
    folderRank: null,
    bookmarkRank: null,
  };
}

function handleIsOver(
  state: DragBookmarkState,
  action: Action<DragBookmarkParams>,
  appState: AppState
): DragBookmarkState {
  const targetFolder = appState.foldersState.folders[action.params.folderRank];

  let newFolderRank = state.folderRank;
  let newBookmarkRank = state.bookmarkRank;
  if (state.folderRank === action.params.folderRank) {
    if (action.params.bookmarkRank >= 0 && action.params.bookmarkRank < targetFolder.bookmarks.length) {
      newFolderRank = action.params.folderRank;
      newBookmarkRank = action.params.bookmarkRank;
    }
  } else if (state.folderRank < action.params.folderRank) {
    // We are moving the Bookmark from a Section above to a Section below.
    if (action.params.bookmarkRank < targetFolder.bookmarks.length) {
      // Insert the dragged bookmark after the bookmark we're hovering over.
      newFolderRank = action.params.folderRank;
      newBookmarkRank = action.params.bookmarkRank + 1;
    }
  } else {
    // We are moving the Bookmark from a Section below to a Section above.
    if (action.params.bookmarkRank > -1) {
      // Insert the dragged bookmark before the bookmark we're hovering over.
      newFolderRank = action.params.folderRank;
      newBookmarkRank = action.params.bookmarkRank;
    }
  }

  return {
    folderRank: newFolderRank,
    bookmarkRank: newBookmarkRank,
  };
}
