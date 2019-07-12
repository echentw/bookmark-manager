import './styles/main.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import { Bookmark } from './Bookmark';
import { addBookmarksReducer, initialAddBookmarksState, AddBookmarksState } from './reducers/AddBookmarksReducer';
import { bookmarksReducer, initialBookmarksState, BookmarksState } from './reducers/BookmarksReducer';
import { copyUrlReducer, initialCopyUrlState, CopyUrlState } from './reducers/CopyUrlReducer';
import { editBookmarkReducer, initialEditBookmarkState, EditBookmarkState } from './reducers/EditBookmarkReducer';

import { AppComponent } from './components/AppComponent';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
  }
}

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

const MainComponent = () => (
  <Provider store={store}>
    <AppComponent/>
  </Provider>
);

ReactDOM.render(<MainComponent/>, document.getElementById('main'));
