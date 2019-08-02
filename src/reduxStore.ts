import { Store, compose, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import { Action } from './actions/constants';

import { addBookmarksReducer, initialAddBookmarksState, AddBookmarksState } from './reducers/AddBookmarksReducer';
import { copyUrlReducer, initialCopyUrlState, CopyUrlState } from './reducers/CopyUrlReducer';
import { dragDropReducer, initialDragDropState, DragDropState } from './reducers/DragDropReducer';
import { editBookmarkReducer, initialEditBookmarkState, EditBookmarkState } from './reducers/EditBookmarkReducer';
import { editFolderReducer, initialEditFolderState, EditFolderState } from './reducers/EditFolderReducer';
import { foldersReducer, initialFoldersState, FoldersState } from './reducers/FoldersReducer';
import { hoverReducer, initialHoverState, HoverState } from './reducers/HoverReducer';
import { navigationReducer, initialNavigationState, NavigationState } from './reducers/NavigationReducer';

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
  editFolderState: EditFolderState;
  foldersState: FoldersState;
  hoverState: HoverState;
  navigationState: NavigationState;
}

const initialAppState: AppState = {
  addBookmarksState: initialAddBookmarksState,
  copyUrlState: initialCopyUrlState,
  dragDropState: initialDragDropState,
  editBookmarkState: initialEditBookmarkState,
  editFolderState: initialEditFolderState,
  foldersState: initialFoldersState,
  hoverState: initialHoverState,
  navigationState: initialNavigationState,
};

const reducer = (state: AppState = initialAppState, action: Action): AppState => {
  const newState: AppState = {
    addBookmarksState: addBookmarksReducer(state.addBookmarksState, action, state),
    copyUrlState: copyUrlReducer(state.copyUrlState, action, state),
    dragDropState: dragDropReducer(state.dragDropState, action, state),
    editBookmarkState: editBookmarkReducer(state.editBookmarkState, action, state),
    editFolderState: editFolderReducer(state.editFolderState, action, state),
    foldersState: foldersReducer(state.foldersState, action, state),
    hoverState: hoverReducer(state.hoverState, action, state),
    navigationState: navigationReducer(state.navigationState, action, state),
  };
  return newState;
};

const enhancers = window.__REDUX_DEVTOOLS_EXTENSION__ ? (
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__()
  )
) : applyMiddleware(thunk);

export const reduxStore = createStore(reducer, initialAppState, enhancers);
