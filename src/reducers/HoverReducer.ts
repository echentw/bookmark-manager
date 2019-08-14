import {
  Action,
  DeleteFolderActionType,
  DragDropActionType,
  EditBookmarkActionType,
  EditFolderActionType,
  FolderActionType,
  HoverActionType,
} from '../actions/constants';
import { DragParams } from '../actions/DragDropActions';
import { DeleteFolderParams } from '../actions/DeleteFolderActions';
import { EditBookmarkParams } from '../actions/EditBookmarkActions';
import { EditFolderParams } from '../actions/EditFolderActions';
import { OpenFolderParams } from '../actions/FolderActions';
import { HoverParams } from '../actions/HoverActions';
import { Reducer } from './Reducer';
import { AppState } from '../reduxStore';

export interface HoverState {
  hoverRank: number | null;
}

export const initialHoverState: HoverState = {
  hoverRank: null,
};

export const hoverReducer: Reducer<HoverState> = (
  state: HoverState = initialHoverState,
  action: Action,
  appState: AppState,
): HoverState => {

  if (appState.dragDropState.draggedRank !== null) {
    // If something is currently being dragged, then we don't want to trigger any hover behavior.
    return state;
  }

  if (appState.editFolderState.showingColorPicker || appState.deleteFolderState.deletingFolderId !== null) {
    // If a modal is showing, then we don't want to trigger any hover behavior.
    return state;
  }

  let newState = state;
  switch (action.type) {
    case HoverActionType.enter:
      newState = handleEnter(state, action as Action<HoverParams>);
      break;
    case HoverActionType.exit:
      newState = handleExit(state, action as Action<HoverParams>);
      break;
    case DragDropActionType.beginDrag:
      newState = handleBeginDrag(state, action as Action<DragParams>);
      break;
    case EditBookmarkActionType.deleteBookmark:
      newState = handleDeleteBookmark(state, action as Action<EditBookmarkParams>);
      break;
    case EditFolderActionType.showColorPicker:
      newState = handleShowColorPicker(state, action as Action<EditFolderParams>);
      break;
    case DeleteFolderActionType.beginDelete:
      newState = handleBeginDeleteFolder(state, action as Action<DeleteFolderParams>);
      break;
    case DeleteFolderActionType.confirmDelete:
      newState = handleConfirmDeleteFolder(state, action as Action<DeleteFolderParams>);
      break;
    case FolderActionType.openFolder:
      newState = handleOpenFolder(state, action as Action<OpenFolderParams>);
      break;
  }
  return newState;
}

function handleEnter(state: HoverState, action: Action<HoverParams>): HoverState {
  return {
    hoverRank: action.params.rank,
  };
}

function handleExit(state: HoverState, action: Action<HoverParams>): HoverState {
  if (state.hoverRank !== action.params.rank) {
    return state;
  }
  return {
    hoverRank: null,
  };
}

function handleBeginDrag(state: HoverState, action: Action<DragParams>): HoverState {
  // If something is dragging, then we don't want any hover behavior.
  return {
    hoverRank: null,
  };
}

function handleDeleteBookmark(state: HoverState, action: Action<EditBookmarkParams>): HoverState {
  // Deleting something requires that we are hovering over the delete button.
  // After we delete, then that list item will disappear, so there's nothing hovered over.
  // Until the next hover event fires :)
  return {
    hoverRank: null,
  };
}

function handleConfirmDeleteFolder(state: HoverState, action: Action<DeleteFolderParams>): HoverState {
  // See comment in handleDeleteBookmark above.
  return {
    hoverRank: null,
  };
}

function handleShowColorPicker(state: HoverState, action: Action<EditFolderParams>): HoverState {
  // See comment in handleDeleteBookmark above.
  return {
    hoverRank: null,
  };
}

function handleBeginDeleteFolder(state: HoverState, action: Action<DeleteFolderParams>): HoverState {
  // See comment in handleDeleteBookmark above.
  return {
    hoverRank: null,
  };
}

function handleOpenFolder(state: HoverState, action: Action<OpenFolderParams>): HoverState {
  // Right after we open a folder, we're not hovering over anything.
  return {
    hoverRank: null,
  };
}
