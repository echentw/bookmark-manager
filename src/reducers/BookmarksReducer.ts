import { Bookmark } from '../Bookmark';
import {
  Action,
  AddBookmarksActionType,
  DragDropActionType,
  EditBookmarkActionType,
} from '../actions/constants';
import { AddBookmarksSaveParams } from '../actions/AddBookmarksActions';
import { EditBookmarkParams } from '../actions/EditBookmarkActions';
import { DragDropParams } from '../actions/DragDropActions';

import * as dummyBookmarkData from './bookmarks.json';

export interface BookmarksState {
  bookmarks: Bookmark[];
  draggedRank: number | null;
}

export const initialBookmarksState: BookmarksState = {
  bookmarks: dummyBookmarkData.bookmarks.map(data => {
    return new Bookmark({
      url: data.url,
      title: data.title,
      faviconUrl: data.faviconUrl,
    });
  }),
  draggedRank: null,
};

export function bookmarksReducer(state: BookmarksState = initialBookmarksState, action: Action): BookmarksState {
  switch(action.type) {
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
