import {
  Action,
  DeleteFolderActionType,
  DragActionType,
  EditBookmarkActionType,
  EditFolderActionType,
  HoverActionType,
} from 'actions/constants';
import { DeleteFolderParams } from 'actions/DeleteFolderActions';
import { DragParams, DropParams } from 'actions/DragActions';
import { EditBookmarkParams } from 'actions/EditBookmarkActions';
import { EditFolderParams } from 'actions/EditFolderActions';
import { HoverParams } from 'actions/HoverActions';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';

import { DraggableType } from 'components/AppComponent';

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

  const dragging = (
    action.type !== DragActionType.end &&
    appState.dragState.draggableType !== null
  );

  if (dragging) {
    // If something is currently being dragged, then we don't want to trigger any hover behavior.
    return state;
  }

  if (appState.deleteFolderState.deletingFolderId !== null) {
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
    case DragActionType.begin:
      newState = handleDragBegin(state, action as Action<DragParams>);
      break;
    case DragActionType.end:
      if (appState.dragState.draggableType === DraggableType.Bookmark) {
        newState = handleDragBookmarkEnd(state, action as Action<DropParams>, appState);
      } else if (appState.dragState.draggableType === DraggableType.Folder) {
        newState = handleDragFolderEnd(state, action as Action<DropParams>, appState);
      }
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

function handleDragBegin(state: HoverState, action: Action<DragParams>): HoverState {
  // If something is dragging, then we don't want any hover behavior.
  return {
    hoverItemId: null,
  };
}

function handleDragBookmarkEnd(
  state: HoverState,
  action: Action<DropParams>,
  appState: AppState
): HoverState {
  // If the drop is a "true" drop (the mouse is inside the drop container), then the user is
  // currently hovered over that item.
  let hoverItemId = null;
  if (action.params.trueDrop) {
    const { folderRank, bookmarkRank } = appState.dragState;
    const folder = appState.foldersState.folders[folderRank];
    const bookmark = folder.bookmarks[bookmarkRank];
    hoverItemId = bookmark.id;
  }
  return {
    hoverItemId: hoverItemId,
  };
}

function handleDragFolderEnd(
  state: HoverState,
  action: Action<DropParams>,
  appState: AppState
): HoverState {
  // If the drop is a "true" drop (the mouse is inside the drop container), then the user is
  // currently hovered over that item.
  let hoverItemId = null;
  if (action.params.trueDrop) {
    const { folderRank } = appState.dragState;
    const folder = appState.foldersState.folders[folderRank];
    hoverItemId = folder.id;
  }
  return {
    hoverItemId: hoverItemId,
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
