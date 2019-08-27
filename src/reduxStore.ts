import { Store, compose, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import { Action } from './actions/constants';

import { addBookmarksReducer, initialAddBookmarksState, AddBookmarksState } from './reducers/AddBookmarksReducer';
import { copyUrlReducer, initialCopyUrlState, CopyUrlState } from './reducers/CopyUrlReducer';
import { deleteFolderReducer, initialDeleteFolderState, DeleteFolderState } from './reducers/DeleteFolderReducer';
import { dragDropReducer, initialDragDropState, DragDropState } from './reducers/DragDropReducer';
import { editBookmarkReducer, initialEditBookmarkState, EditBookmarkState } from './reducers/EditBookmarkReducer';
import { editFolderReducer, initialEditFolderState, EditFolderState } from './reducers/EditFolderReducer';
import { foldersReducer, initialFoldersState, FoldersState } from './reducers/FoldersReducer';
import { hoverReducer, initialHoverState, HoverState } from './reducers/HoverReducer';
import { loadedReducer, initialLoadedState, LoadedState } from './reducers/LoadedReducer';
import { navigationReducer, initialNavigationState, NavigationState } from './reducers/NavigationReducer';
import { userReducer, initialUserState, UserState } from './reducers/UserReducer';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
  }
}

export interface AppState {
  addBookmarksState: AddBookmarksState;
  copyUrlState: CopyUrlState;
  deleteFolderState: DeleteFolderState;
  dragDropState: DragDropState;
  editBookmarkState: EditBookmarkState;
  editFolderState: EditFolderState;
  foldersState: FoldersState;
  hoverState: HoverState;
  loadedState: LoadedState;
  navigationState: NavigationState;
  userState: UserState;
}

const initialAppState: AppState = {
  addBookmarksState: initialAddBookmarksState,
  copyUrlState: initialCopyUrlState,
  deleteFolderState: initialDeleteFolderState,
  dragDropState: initialDragDropState,
  editBookmarkState: initialEditBookmarkState,
  editFolderState: initialEditFolderState,
  foldersState: initialFoldersState,
  hoverState: initialHoverState,
  loadedState: initialLoadedState,
  navigationState: initialNavigationState,
  userState: initialUserState,
};

const reducer = (state: AppState = initialAppState, action: Action): AppState => {
  const newState: AppState = {
    addBookmarksState: addBookmarksReducer(state.addBookmarksState, action, state),
    copyUrlState: copyUrlReducer(state.copyUrlState, action, state),
    deleteFolderState: deleteFolderReducer(state.deleteFolderState, action, state),
    dragDropState: dragDropReducer(state.dragDropState, action, state),
    editBookmarkState: editBookmarkReducer(state.editBookmarkState, action, state),
    editFolderState: editFolderReducer(state.editFolderState, action, state),
    foldersState: foldersReducer(state.foldersState, action, state),
    hoverState: hoverReducer(state.hoverState, action, state),
    loadedState: loadedReducer(state.loadedState, action, state),
    navigationState: navigationReducer(state.navigationState, action, state),
    userState: userReducer(state.userState, action, state),
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
