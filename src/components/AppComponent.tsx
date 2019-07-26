import * as React from 'react';
import { connect } from 'react-redux';
import { Store, compose, applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import { Bookmark } from '../Bookmark';
import { addBookmarksReducer, initialAddBookmarksState, AddBookmarksState } from '../reducers/AddBookmarksReducer';
import { bookmarksReducer, initialBookmarksState, BookmarksState } from '../reducers/BookmarksReducer';
import { copyUrlReducer, initialCopyUrlState, CopyUrlState } from '../reducers/CopyUrlReducer';
import { dragDropReducer, initialDragDropState, DragDropState } from '../reducers/DragDropReducer';
import { editBookmarkReducer, initialEditBookmarkState, EditBookmarkState } from '../reducers/EditBookmarkReducer';
import { ChromeHelpers } from '../ChromeHelpers';
import * as SyncBookmarksActions from '../actions/SyncBookmarksActions';
import { SyncBookmarksParams } from '../actions/SyncBookmarksActions';

import { BookmarkListComponent } from './BookmarkListComponent';
import { GreetingComponent } from './GreetingComponent';
import { DragLayerComponent } from './DragLayerComponent';
import { CopiedToastComponent } from './CopiedToastComponent';
import { AddBookmarksModalComponent } from './AddBookmarksModalComponent';
import { DateComponent } from './DateComponent';

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

export const store = createStore(allReducers, initialAppState, allStoreEnhancers);

interface Props {
  loaded: boolean;
  loadBookmarks: (params: {}) => void;
  syncBookmarks: (params: SyncBookmarksParams) => void;
}

interface State {
  date: Date;
}

class AppComponent extends React.Component<Props, State> {
  state = {
    date: new Date(),
  };

  oldBookmarks: Bookmark[] | null = null;

  componentDidMount = () => {
    this.beginSyncingDate();
    this.beginSyncingStore();
  }

  beginSyncingDate = () => {
    setInterval(() => {
      this.setState({ date: new Date() });
    }, 2000);
  }

  beginSyncingStore = () => {
    store.subscribe(async () => {
      const dragging = store.getState().dragDropState.dragging;
      const bookmarks = store.getState().bookmarksState.bookmarks;

      if (this.oldBookmarks === null) {
        this.oldBookmarks = bookmarks;
        return;
      }

      if (!dragging && bookmarks !== this.oldBookmarks) {
        await ChromeHelpers.saveBookmarks(bookmarks);
        this.oldBookmarks = bookmarks;
      }
    });

    ChromeHelpers.addOnChangedListener((newBookmarks: Bookmark[]) => {
      this.props.syncBookmarks({ bookmarks: newBookmarks });
    });

    this.props.loadBookmarks({});
  }

  render() {
    const classes = this.props.loaded ? 'app loaded' : 'app';
    return (
      <div className={classes}>
        <div className="app-list-container">
          <BookmarkListComponent/>
        </div>
        <div className="app-greeting-container">
          <GreetingComponent name={'Eric'} date={this.state.date}/>
        </div>
        <div className="app-date-container">
          <DateComponent date={this.state.date}/>
        </div>
        <DragLayerComponent/>
        <CopiedToastComponent/>
        <AddBookmarksModalComponent/>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    loaded: state.bookmarksState.loaded,
  };
};

const mapActionsToProps = {
  loadBookmarks: SyncBookmarksActions.loadBookmarks,
  syncBookmarks: SyncBookmarksActions.syncBookmarks,
};

const Component = connect(mapStateToProps, mapActionsToProps)(AppComponent);
export { Component as AppComponent };
