import * as React from 'react';
import { connect } from 'react-redux';
import { Store, compose, applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import { Bookmark } from '../Bookmark';
import { Folder } from '../Folder';
import { addBookmarksReducer, initialAddBookmarksState, AddBookmarksState } from '../reducers/AddBookmarksReducer';
import { copyUrlReducer, initialCopyUrlState, CopyUrlState } from '../reducers/CopyUrlReducer';
import { dragDropReducer, initialDragDropState, DragDropState } from '../reducers/DragDropReducer';
import { editBookmarkReducer, initialEditBookmarkState, EditBookmarkState } from '../reducers/EditBookmarkReducer';
import { foldersReducer, initialFoldersState, FoldersState } from '../reducers/FoldersReducer';
import { hoverReducer, initialHoverState, HoverState } from '../reducers/HoverReducer';
import { ChromeHelpers } from '../ChromeHelpers';
import * as SyncAppActions from '../actions/SyncAppActions';
import { SyncFoldersParams } from '../actions/SyncAppActions';
import * as FolderActions from '../actions/FolderActions';

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
  copyUrlState: CopyUrlState;
  dragDropState: DragDropState;
  editBookmarkState: EditBookmarkState;
  foldersState: FoldersState;
  hoverState: HoverState;
}

const allReducers = combineReducers({
  addBookmarksState: addBookmarksReducer,
  copyUrlState: copyUrlReducer,
  dragDropState: dragDropReducer,
  editBookmarkState: editBookmarkReducer,
  foldersState: foldersReducer,
  hoverState: hoverReducer,
});

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

export const store = createStore(allReducers, initialAppState, allStoreEnhancers);

interface Props {
  loaded: boolean;
  loadAppData: (params: {}) => void;
  syncFolders: (params: SyncFoldersParams) => void;
  openFolder: Folder | null;
  closeFolder: (params: {}) => void;
}

interface State {
  date: Date;
}

class AppComponent extends React.Component<Props, State> {
  state: State = {
    date: new Date(),
  };

  private oldFolders: Folder[] | null = null;
  private oldOpenFolder: Folder | null = null;

  componentDidMount = () => {
    this.beginSyncingDate();
    this.beginSyncingStore();
  }

  private beginSyncingDate = () => {
    setInterval(() => {
      this.setState({ date: new Date() });
    }, 2000);
  }

  private stateHasChanged = ({ oldState, newState }: {
    oldState: {
      folders: Folder[];
      openFolder: Folder | null;
    };
    newState: {
      folders: Folder[];
      openFolder: Folder | null;
    };
  }): boolean => {
    if (oldState.openFolder === null && oldState.openFolder !== newState.openFolder) {
      return true;
    }
    if (oldState.openFolder !== null && !oldState.openFolder.equals(newState.openFolder)) {
      return true;
    }
    if (oldState.folders.length !== newState.folders.length) {
      return true;
    }
    return !oldState.folders.every((oldFolder: Folder, index: number) => {
      return oldFolder.equals(newState.folders[index]);
    });
  }

  private beginSyncingStore = () => {
    store.subscribe(async () => {
      const { dragging } = store.getState().dragDropState;
      const { folders, openFolder } = store.getState().foldersState;

      if (this.oldFolders === null) {
        this.oldFolders = folders;
        this.oldOpenFolder = openFolder;
        return;
      }

      if (!dragging) {
        const stateChanged = this.stateHasChanged({
          oldState: {
            openFolder: this.oldOpenFolder,
            folders: this.oldFolders,
          },
          newState: {
            openFolder: openFolder,
            folders: folders,
          },
        });
        if (stateChanged) {
          this.oldFolders = folders;
          this.oldOpenFolder = openFolder;
          await ChromeHelpers.saveAppState(store.getState());
        }
      }
    });

    ChromeHelpers.addOnChangedListener((newFolders: Folder[]) => {
      this.props.syncFolders({
        folders: newFolders,
        openFolder: this.props.openFolder,
      });
    });

    this.props.loadAppData({});
  }

  render() {
    const classes = this.props.loaded ? 'app loaded' : 'app';

    const hasFolderOpen = this.props.openFolder !== null;

    const ListComponent = hasFolderOpen ? (
      <BookmarkListComponent folder={this.props.openFolder}/>
    ) : (
      <FolderListComponent/>
    );

    const maybeDragLayer = hasFolderOpen ? (
      <DragLayerComponent bookmarks={this.props.openFolder.bookmarks}/>
    ) : null;

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
        { maybeDragLayer }
        <CopiedToastComponent/>
        <AddBookmarksModalComponent/>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    loaded: state.foldersState.loaded,
    openFolder: state.foldersState.openFolder,
  };
};

const mapActionsToProps = {
  loadAppData: SyncAppActions.loadAppData,
  syncFolders: SyncAppActions.syncFolders,
  closeFolder: FolderActions.closeFolder,
};

const Component = connect(mapStateToProps, mapActionsToProps)(AppComponent);
export { Component as AppComponent };
