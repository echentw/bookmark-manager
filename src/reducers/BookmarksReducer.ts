import { AddBookmarksSaveParams } from '../actions/AddBookmarksActions';
import {
  Action,
  AddBookmarksActionType,
  DragDropActionType,
  EditBookmarkActionType,
  SyncAppActionType,
} from '../actions/constants';
import { DragDropParams } from '../actions/DragDropActions';
import { EditBookmarkParams } from '../actions/EditBookmarkActions';
import { SyncBookmarksParams } from '../actions/SyncAppActions';
import { Bookmark } from '../Bookmark';

export interface BookmarksState {
  bookmarks: Bookmark[];
  draggedRank: number | null;
  loaded: boolean;
}

export const initialBookmarksState: BookmarksState = {
  bookmarks: [],
  draggedRank: null,
  loaded: false,
};

export function bookmarksReducer(state: BookmarksState = initialBookmarksState, action: Action): BookmarksState {
  switch (action.type) {
    case AddBookmarksActionType.save:
      return handleAddBookmarksSave(state, action as Action<AddBookmarksSaveParams>);
    case DragDropActionType.beginDrag:
      return handleBeginDrag(state, action as Action<DragDropParams>);
    case DragDropActionType.endDrag:
      return handleEndDrag(state, action as Action<DragDropParams>);
    case DragDropActionType.isOver:
      return handleDragIsOver(state, action as Action<DragDropParams>);
    case EditBookmarkActionType.save:
      return handleEditBookmarkSave(state, action as Action<EditBookmarkParams>);
    case EditBookmarkActionType.deleteBookmark:
      return handleEditBookmarkDeleteBookmark(state, action as Action<EditBookmarkParams>);
    case SyncAppActionType.syncBookmarks:
      return handleSyncBookmarks(state, action as Action<SyncBookmarksParams>);
    default:
      return state;
  }
}

function handleAddBookmarksSave(state: BookmarksState, action: Action<AddBookmarksSaveParams>): BookmarksState {
  const bookmarks = state.bookmarks.concat(action.params.bookmarks);
  return {
    ...state,
    bookmarks: bookmarks,
  };
}

function handleBeginDrag(state: BookmarksState, action: Action<DragDropParams>): BookmarksState {
  return {
    ...state,
    draggedRank: action.params.rank,
  };
}

function handleEndDrag(state: BookmarksState, action: Action<DragDropParams>): BookmarksState {
  return {
    ...state,
    draggedRank: action.params.rank,
  };
}

function handleDragIsOver(state: BookmarksState, action: Action<DragDropParams>): BookmarksState {
  const bookmarks = state.bookmarks.splice(0); // copies the array
  const draggedRank = state.draggedRank;
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

  return {
    ...state,
    bookmarks: bookmarks,
    draggedRank: dropTargetRank,
  };
}

function handleEditBookmarkSave(state: BookmarksState, action: Action<EditBookmarkParams>): BookmarksState {
  const index = state.bookmarks.findIndex((bookmark: Bookmark) => {
    return bookmark.id === action.params.bookmark.id;
  });
  const bookmarks = state.bookmarks.slice(0); // copies the array
  bookmarks[index] = action.params.bookmark;
  return {
    ...state,
    bookmarks: bookmarks,
  };
}

function handleEditBookmarkDeleteBookmark(state: BookmarksState, action: Action<EditBookmarkParams>): BookmarksState {
  const index = state.bookmarks.findIndex((bookmark: Bookmark) => {
    return bookmark.id === action.params.bookmark.id;
  });
  const bookmarks = state.bookmarks.slice(0); // copies the array
  bookmarks.splice(index, 1);
  return {
    ...state,
    bookmarks: bookmarks,
  };
}

function handleSyncBookmarks(state: BookmarksState, action: Action<SyncBookmarksParams>): BookmarksState {
  return {
    ...state,
    bookmarks: action.params.bookmarks,
    loaded: true,
  };
}
