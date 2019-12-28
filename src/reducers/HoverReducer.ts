import {
  Action,
  DeleteFolderActionType,
  DragDropActionType,
  EditBookmarkActionType,
  EditFolderActionType,
  FolderActionType,
  HoverActionType,
} from 'actions/constants';
import { DeleteFolderParams } from 'actions/DeleteFolderActions';
import { DragParams } from 'actions/DragDropActions';
import { EditBookmarkParams } from 'actions/EditBookmarkActions';
import { EditFolderParams } from 'actions/EditFolderActions';
import { OpenFolderParams } from 'actions/FolderActions';
import { HoverParams } from 'actions/HoverActions';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';

export interface HoverState {
  hoverItemId: string | null;
}

export const initialHoverState: HoverState = {
  hoverItemId: null,
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
};

function handleEnter(state: HoverState, action: Action<HoverParams>): HoverState {
  return {
    hoverItemId: action.params.itemId,
  };
}

function handleExit(state: HoverState, action: Action<HoverParams>): HoverState {
  if (state.hoverItemId !== action.params.itemId) {
    return state;
  }
  return {
    hoverItemId: null,
  };
}

function handleBeginDrag(state: HoverState, action: Action<DragParams>): HoverState {
  // If something is dragging, then we don't want any hover behavior.
  return {
    hoverItemId: null,
  };
}

function handleDeleteBookmark(state: HoverState, action: Action<EditBookmarkParams>): HoverState {
  // Deleting something requires that we are hovering over the delete button.
  // After we delete, then that list item will disappear, so there's nothing hovered over.
  // Until the next hover event fires :)
  return {
    hoverItemId: null,
  };
}

function handleConfirmDeleteFolder(state: HoverState, action: Action<DeleteFolderParams>): HoverState {
  // See comment in handleDeleteBookmark above.
  return {
    hoverItemId: null,
  };
}

function handleShowColorPicker(state: HoverState, action: Action<EditFolderParams>): HoverState {
  // See comment in handleDeleteBookmark above.
  return {
    hoverItemId: null,
  };
}

function handleBeginDeleteFolder(state: HoverState, action: Action<DeleteFolderParams>): HoverState {
  // See comment in handleDeleteBookmark above.
  return {
    hoverItemId: null,
  };
}

function handleOpenFolder(state: HoverState, action: Action<OpenFolderParams>): HoverState {
  // Right after we open a folder, we're not hovering over anything.
  return {
    hoverItemId: null,
  };
}
