import { Store, compose, applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import { addBookmarksReducer, initialAddBookmarksState, AddBookmarksState } from './reducers/AddBookmarksReducer';
import { copyUrlReducer, initialCopyUrlState, CopyUrlState } from './reducers/CopyUrlReducer';
import { dragDropReducer, initialDragDropState, DragDropState } from './reducers/DragDropReducer';
import { editBookmarkReducer, initialEditBookmarkState, EditBookmarkState } from './reducers/EditBookmarkReducer';
import { foldersReducer, initialFoldersState, FoldersState } from './reducers/FoldersReducer';
import { hoverReducer, initialHoverState, HoverState } from './reducers/HoverReducer';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
  }
}

export interface AppState {
  addBookmarksState: AddBookmarksState;
  copyUrlState: CopyUrlState;
  dragDropState: DragDropState;
  editBookmarkState: EditBookmarkState;
  foldersState: FoldersState;
  hoverState: HoverState;
}

const allStoreEnhancers = window.__REDUX_DEVTOOLS_EXTENSION__ ? (
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__()
  )
) : applyMiddleware(thunk);

const initialAppState = {
  addBookmarksState: initialAddBookmarksState,
  copyUrlState: initialCopyUrlState,
  dragDropState: initialDragDropState,
  editBookmarkState: initialEditBookmarkState,
  foldersState: initialFoldersState,
  hoverState: initialHoverState,
};

const allReducers = combineReducers({
  addBookmarksState: addBookmarksReducer,
  copyUrlState: copyUrlReducer,
  dragDropState: dragDropReducer,
  editBookmarkState: editBookmarkReducer,
  foldersState: foldersReducer,
  hoverState: hoverReducer,
});

export const reduxStore = createStore(allReducers, initialAppState, allStoreEnhancers);
