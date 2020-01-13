import {
  Action,
  DeleteFolderActionType,
  DragActionType,
  DragDropActionType,
  EditBookmarkActionType,
  EditFolderActionType,
  FolderActionType,
  HoverActionType,
} from 'actions/constants';
import { DeleteFolderParams } from 'actions/DeleteFolderActions';
import { DragParams as LegacyDragParams, DropParams as LegacyDropParams } from 'actions/DragDropActions';
import { DragParams, DropParams } from 'actions/DragActions';
import { EditBookmarkParams } from 'actions/EditBookmarkActions';
import { EditFolderParams } from 'actions/EditFolderActions';
import { OpenFolderParams } from 'actions/FolderActions';
import { HoverParams } from 'actions/HoverActions';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';

import { DraggableType, USE_SECTIONSSS } from 'components/AppComponent';

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

  const dragging = USE_SECTIONSSS ? (
    action.type !== DragActionType.end &&
    appState.dragState.draggableType !== null
  ) : (
    action.type !== DragDropActionType.endDrag &&
    appState.dragDropState.draggedRank !== null
  );

  if (dragging) {
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
      newState = handleBeginDrag(state, action as Action<LegacyDragParams>);
      break;
    case DragDropActionType.endDrag:
      newState = handleEndDrag(state, action as Action<LegacyDropParams>);
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

function handleBeginDrag(state: HoverState, action: Action<LegacyDragParams>): HoverState {
  // If something is dragging, then we don't want any hover behavior.
  // TODO: deprecated
  return {
    hoverItemId: null,
  };
}

function handleEndDrag(state: HoverState, action: Action<LegacyDropParams>): HoverState {
  // TODO: deprecated
  let hoverItemId = null;
  if (action.params.trueDrop) {
    hoverItemId = String(action.params.rank);
  }
  return {
    hoverItemId: hoverItemId,
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

function handleOpenFolder(state: HoverState, action: Action<OpenFolderParams>): HoverState {
  // Right after we open a folder, we're not hovering over anything.
  return {
    hoverItemId: null,
  };
}
