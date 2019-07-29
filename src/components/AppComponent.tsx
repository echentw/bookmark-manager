import * as React from 'react';
import { connect } from 'react-redux';
import { Store, compose, applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import { Bookmark } from '../Bookmark';
import { Folder } from '../Folder';
import { addBookmarksReducer, initialAddBookmarksState, AddBookmarksState } from '../reducers/AddBookmarksReducer';
import { bookmarksReducer, initialBookmarksState, BookmarksState } from '../reducers/BookmarksReducer';
import { copyUrlReducer, initialCopyUrlState, CopyUrlState } from '../reducers/CopyUrlReducer';
import { dragDropReducer, initialDragDropState, DragDropState } from '../reducers/DragDropReducer';
import { editBookmarkReducer, initialEditBookmarkState, EditBookmarkState } from '../reducers/EditBookmarkReducer';
import { foldersReducer, initialFoldersState, FoldersState } from '../reducers/FoldersReducer';
import { ChromeHelpers } from '../ChromeHelpers';
import * as SyncAppActions from '../actions/SyncAppActions';
import { SyncBookmarksParams } from '../actions/SyncAppActions';

import { BookmarkListComponent } from './BookmarkListComponent';
import { FolderListComponent } from './FolderListComponent';
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

export const DraggableType = {
  Bookmark: 'bookmark',
  Folder: 'folder',
};

export interface AppState {
  addBookmarksState: AddBookmarksState;
  bookmarksState: BookmarksState;
  copyUrlState: CopyUrlState;
  dragDropState: DragDropState;
  editBookmarkState: EditBookmarkState;
  foldersState: FoldersState;
}

const allReducers = combineReducers({
  addBookmarksState: addBookmarksReducer,
  bookmarksState: bookmarksReducer,
  copyUrlState: copyUrlReducer,
  dragDropState: dragDropReducer,
  editBookmarkState: editBookmarkReducer,
  foldersState: foldersReducer,
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
  foldersState: initialFoldersState,
};

export const store = createStore(allReducers, initialAppState, allStoreEnhancers);

interface Props {
  loaded: boolean;
  loadAppData: (params: {}) => void;
  syncBookmarks: (params: SyncBookmarksParams) => void;
  openFolder: Folder | null;
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
        await ChromeHelpers.saveAppState(store.getState());
        this.oldBookmarks = bookmarks;
      }
    });

    ChromeHelpers.addOnChangedListener((newFolders: Folder[]) => {
      const folder = newFolders[0];
      this.props.syncBookmarks({ bookmarks: folder.bookmarks });
    });

    this.props.loadAppData({});
  }

  render() {
    const classes = this.props.loaded ? 'app loaded' : 'app';
    const ListComponent = this.props.openFolder === null ? (
      <FolderListComponent/>
    ) : (
      <BookmarkListComponent/>
    );
    return (
      <div className={classes}>
        <div className="app-list-container">
          { ListComponent }
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
    openFolder: state.foldersState.openFolder,
  };
};

const mapActionsToProps = {
  loadAppData: SyncAppActions.loadAppData,
  syncBookmarks: SyncAppActions.syncBookmarks,
};

const Component = connect(mapStateToProps, mapActionsToProps)(AppComponent);
export { Component as AppComponent };
