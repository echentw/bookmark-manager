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
      newState = handleIsOver(state, action as Action<DragBookmarkParams>);
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

function handleIsOver(state: DragBookmarkState, action: Action<DragBookmarkParams>): DragBookmarkState {
  let newBookmarkRank: number;
  if (state.folderRank === action.params.folderRank) {
    newBookmarkRank = action.params.bookmarkRank;
  } else {
    if (state.folderRank < action.params.folderRank) {
      // We want to insert the dragged bookmark after the bookmark we're hovering over.
      newBookmarkRank = action.params.bookmarkRank + 1;
    } else {
      // We want to insert the dragged bookmark before the bookmark we're hovering over.
      newBookmarkRank = action.params.bookmarkRank;
    }
  }
  return {
    folderRank: action.params.folderRank,
    bookmarkRank: newBookmarkRank,
  };
}
