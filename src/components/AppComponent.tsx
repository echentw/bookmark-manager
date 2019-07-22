import * as React from 'react';
import { Provider } from 'react-redux';
import { Store, compose, applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import { Bookmark } from '../Bookmark';
import { addBookmarksReducer, initialAddBookmarksState, AddBookmarksState } from '../reducers/AddBookmarksReducer';
import { bookmarksReducer, initialBookmarksState, BookmarksState } from '../reducers/BookmarksReducer';
import { copyUrlReducer, initialCopyUrlState, CopyUrlState } from '../reducers/CopyUrlReducer';
import { dragDropReducer, initialDragDropState, DragDropState } from '../reducers/DragDropReducer';
import { editBookmarkReducer, initialEditBookmarkState, EditBookmarkState } from '../reducers/EditBookmarkReducer';
import { ChromeHelpers } from '../ChromeHelpers';

import { BookmarkListComponent } from './BookmarkListComponent';
import { GreetingComponent } from './GreetingComponent';
import { DragLayerComponent } from './DragLayerComponent';
import { CopiedToastComponent } from './CopiedToastComponent';
import { AddBookmarksModalComponent } from './AddBookmarksModalComponent';

const backgroundImage = require('../blue_stars.jpg');

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
  dragDropState: DragDropState;
  editBookmarkState: EditBookmarkState;
}

const allReducers = combineReducers({
  addBookmarksState: addBookmarksReducer,
  bookmarksState: bookmarksReducer,
  copyUrlState: copyUrlReducer,
  dragDropState: dragDropReducer,
  editBookmarkState: editBookmarkReducer,
});

const allStoreEnhancers = window.__REDUX_DEVTOOLS_EXTENSION__ ? (
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__()
  )
) : applyMiddleware(thunk);

const initialAppState = {
  addBookmarksState: initialAddBookmarksState,
  bookmarksState: initialBookmarksState,
  copyUrlState: initialCopyUrlState,
  dragDropState: initialDragDropState,
  editBookmarkState: initialEditBookmarkState,
};

const initialStore = createStore(allReducers, initialAppState, allStoreEnhancers);

interface State {
  loaded: boolean;
  store: Store | null;
}

export class AppComponent extends React.Component<{}, State> {
  state: State = {
    loaded: false,
    store: null,
  };

  oldBookmarks: Bookmark[] = [];

  componentDidMount = async () => {
    const bookmarks = await ChromeHelpers.loadBookmarks();

    const loadedBookmarksState = {
      bookmarks: bookmarks,
    };

    const loadedAppState = {
      ...initialAppState,
      bookmarksState: loadedBookmarksState,
    };

    const store = createStore(allReducers, loadedAppState, allStoreEnhancers);

    this.setState({
      loaded: true,
      store: store,
    });

    this.oldBookmarks = bookmarks;

    store.subscribe(async () => {
      const dragging = store.getState().dragDropState.dragging;
      const bookmarks = store.getState().bookmarksState.bookmarks;
      if (!dragging && bookmarks !== this.oldBookmarks) {
        await ChromeHelpers.saveBookmarks(bookmarks);
        this.oldBookmarks = bookmarks;
      }
    });
  }

  render() {
    const store = this.state.loaded ? this.state.store : initialStore;
    const classes = this.state.loaded ? 'app loaded' : 'app';
    return (
      <Provider store={store}>
        <div className={classes}>
          <BookmarkListComponent/>
          <GreetingComponent name={'Eric'}/>
          <DragLayerComponent/>
          <CopiedToastComponent/>
          <AddBookmarksModalComponent/>
        </div>
      </Provider>
    );
  }
}
