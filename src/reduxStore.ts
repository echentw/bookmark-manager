import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import { Action } from 'actions/constants';

import { addBookmarksReducer, AddBookmarksState, initialAddBookmarksState } from 'reducers/AddBookmarksReducer';
import { copyUrlReducer, CopyUrlState, initialCopyUrlState } from 'reducers/CopyUrlReducer';
import { deleteFolderReducer, DeleteFolderState, initialDeleteFolderState } from 'reducers/DeleteFolderReducer';
import { dragReducer, DragState, initialDragState } from 'reducers/DragReducer';
import { editBookmarkReducer, EditBookmarkState, initialEditBookmarkState } from 'reducers/EditBookmarkReducer';
import { editFolderReducer, EditFolderState, initialEditFolderState } from 'reducers/EditFolderReducer';
import { foldersReducer, FoldersState, initialFoldersState } from 'reducers/FoldersReducer';
import { hoverReducer, HoverState, initialHoverState } from 'reducers/HoverReducer';
import { initialLoadedState, loadedReducer, LoadedState } from 'reducers/LoadedReducer';
import { initialSettingsState, settingsReducer, SettingsState } from 'reducers/SettingsReducer';
import { initialUserState, userReducer, UserState } from 'reducers/UserReducer';
import { initialUtilitiesState, utilitiesReducer, UtilitiesState } from 'reducers/UtilitiesReducer';
import { initialNotesState, notesReducer, NotesState } from 'reducers/NotesReducer';


declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
  }
}

export interface AppState {
  addBookmarksState: AddBookmarksState;
  copyUrlState: CopyUrlState;
  deleteFolderState: DeleteFolderState;
  dragState: DragState;
  editBookmarkState: EditBookmarkState;
  editFolderState: EditFolderState;
  foldersState: FoldersState;
  hoverState: HoverState;
  loadedState: LoadedState;
  settingsState: SettingsState;
  userState: UserState;
  utilitiesState: UtilitiesState;
  notesState: NotesState;
}

const initialAppState: AppState = {
  addBookmarksState: initialAddBookmarksState,
  copyUrlState: initialCopyUrlState,
  deleteFolderState: initialDeleteFolderState,
  dragState: initialDragState,
  editBookmarkState: initialEditBookmarkState,
  editFolderState: initialEditFolderState,
  foldersState: initialFoldersState,
  hoverState: initialHoverState,
  loadedState: initialLoadedState,
  settingsState: initialSettingsState,
  userState: initialUserState,
  utilitiesState: initialUtilitiesState,
  notesState: initialNotesState,
};

const reducer = (state: AppState = initialAppState, action: Action): AppState => {
  let newState: AppState = {
    addBookmarksState: addBookmarksReducer(state.addBookmarksState, action, state),
    copyUrlState: copyUrlReducer(state.copyUrlState, action, state),
    deleteFolderState: deleteFolderReducer(state.deleteFolderState, action, state),
    dragState: dragReducer(state.dragState, action, state),
    editBookmarkState: editBookmarkReducer(state.editBookmarkState, action, state),
    editFolderState: editFolderReducer(state.editFolderState, action, state),
    foldersState: foldersReducer(state.foldersState, action, state),
    hoverState: hoverReducer(state.hoverState, action, state),
    loadedState: loadedReducer(state.loadedState, action, state),
    settingsState: settingsReducer(state.settingsState, action, state),
    userState: userReducer(state.userState, action, state),
    utilitiesState: utilitiesReducer(state.utilitiesState, action, state),
    notesState: notesReducer(state.notesState, action, state),
  };
  return newState;
};

const enhancers = window.__REDUX_DEVTOOLS_EXTENSION__ ? (
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__(),
  )
) : applyMiddleware(thunk);

export const reduxStore = createStore(reducer, initialAppState, enhancers);
