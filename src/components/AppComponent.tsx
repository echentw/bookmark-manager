import * as React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import { Bookmark } from '../Bookmark';
import { addBookmarksReducer, initialAddBookmarksState, AddBookmarksState } from '../reducers/AddBookmarksReducer';
import { bookmarksReducer, initialBookmarksState, BookmarksState } from '../reducers/BookmarksReducer';
import { copyUrlReducer, initialCopyUrlState, CopyUrlState } from '../reducers/CopyUrlReducer';
import { editBookmarkReducer, initialEditBookmarkState, EditBookmarkState } from '../reducers/EditBookmarkReducer';

import { BookmarkListComponent } from './BookmarkListComponent';
import { GreetingComponent } from './GreetingComponent';
import { DragLayerComponent } from './DragLayerComponent';
import { CopiedToastComponent } from './CopiedToastComponent';
import { AddBookmarksModalComponent } from './AddBookmarksModalComponent';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
  }
}

export const DraggableTypes = {
  Bookmark: 'bookmark',
};

export interface AppState {
  bookmarks: Bookmark;
  addBookmarksState: AddBookmarksState;
  bookmarksState: BookmarksState;
  copyUrlState: CopyUrlState;
  editBookmarkState: EditBookmarkState;
}

const allReducers = combineReducers({
  addBookmarksState: addBookmarksReducer,
  bookmarksState: bookmarksReducer,
  copyUrlState: copyUrlReducer,
  editBookmarkState: editBookmarkReducer,
});

const store = createStore(
  allReducers,
  {
    addBookmarksState: initialAddBookmarksState,
    bookmarksState: initialBookmarksState,
    copyUrlState: initialCopyUrlState,
    editBookmarkState: initialEditBookmarkState,
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export class AppComponent extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <div className="app">
            <BookmarkListComponent/>
            <GreetingComponent name={'Eric'}/>
            <DragLayerComponent/>
            <CopiedToastComponent/>
            <AddBookmarksModalComponent/>
          </div>
        </DndProvider>
      </Provider>
    );
  }
}
