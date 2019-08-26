import * as React from 'react';
import { connect } from 'react-redux';
import { Store } from 'redux';
import { CSSTransitionGroup } from 'react-transition-group';

import { Bookmark } from '../Bookmark';
import { Folder } from '../Folder';
import { ChromeHelpers } from '../ChromeHelpers';
import * as SyncAppActions from '../actions/SyncAppActions';
import { SyncFoldersParams } from '../actions/SyncAppActions';
import * as FolderActions from '../actions/FolderActions';
import { AppState, reduxStore } from '../reduxStore';
import { Action } from '../actions/constants';

import { BookmarkComponent } from './BookmarkComponent';
import { FolderComponent } from './FolderComponent';
import { BookmarkListComponent } from './BookmarkListComponent';
import { FolderListComponent } from './FolderListComponent';
import { GreetingComponent } from './GreetingComponent';
import { DragLayerComponent } from './DragLayerComponent';
import { CopiedToastComponent } from './CopiedToastComponent';
import { AddBookmarksModalComponent } from './AddBookmarksModalComponent';
import { DateComponent } from './DateComponent';
import { NuxComponent } from './NuxComponent';

export const DraggableType = {
  Bookmark: 'bookmark',
  Folder: 'folder',
};

interface Props {
  loaded: boolean;
  currentFolderId: string | null;
  draggedRank: number | null;
  folders: Folder[];
  showAddBookmarksModal: boolean;
  loadAppData: (params: {}) => void;
  syncFolders: (params: SyncFoldersParams) => void;
  closeFolder: (params: {}) => void;
}

interface State {
  date: Date;
  showNux: boolean;
}

class AppComponent extends React.Component<Props, State> {
  state: State = {
    date: new Date(),
    showNux: true,
  };

  private oldFolders: Folder[] | null = null;
  private oldCurrentFolderId: string | null = null;

  componentDidMount = () => {
    this.beginSyncingDate();
    this.beginSyncingStore(reduxStore);

    setTimeout(() => {
      this.setState({ showNux: false });
    }, 2000);
  }

  private beginSyncingDate = () => {
    setInterval(() => {
      this.setState({ date: new Date() });
    }, 2000);
  }

  private stateHasChanged = ({ oldState, newState }: {
    oldState: {
      folders: Folder[];
      currentFolderId: string | null;
    };
    newState: {
      folders: Folder[];
      currentFolderId: string | null;
    };
  }): boolean => {
    if (oldState.currentFolderId !== newState.currentFolderId) {
      return true;
    }
    if (oldState.folders.length !== newState.folders.length) {
      return true;
    }
    return !oldState.folders.every((oldFolder: Folder, index: number) => {
      return oldFolder.equals(newState.folders[index]);
    });
  }

  private beginSyncingStore = (store: Store<AppState, Action>) => {
    store.subscribe(async () => {
      const state = store.getState();

      const dragging = state.dragDropState.draggedRank !== null;
      const { folders } = state.foldersState;
      const { currentFolderId } = state.navigationState;

      if (this.oldFolders === null) {
        this.oldFolders = folders.map(folder => folder.copy());
        this.oldCurrentFolderId = currentFolderId;
        return;
      }

      if (!dragging) {
        const stateChanged = this.stateHasChanged({
          oldState: {
            currentFolderId: this.oldCurrentFolderId,
            folders: this.oldFolders,
          },
          newState: {
            currentFolderId: currentFolderId,
            folders: folders,
          },
        });
        if (stateChanged) {
          this.oldFolders = folders.map(folder => folder.copy());
          this.oldCurrentFolderId = currentFolderId;
          await ChromeHelpers.saveAppState(state);
        }
      }
    });

    ChromeHelpers.addOnChangedListener((newFolders: Folder[]) => {
      this.props.syncFolders({
        folders: newFolders,
        currentFolderId: this.props.currentFolderId,
      });
    });

    this.props.loadAppData({});
  }

  render() {
    const currentFolder = this.props.folders.find(folder => folder.id === this.props.currentFolderId) || null;

    const ListComponent = currentFolder === null ? (
      <FolderListComponent/>
    ) : (
      <BookmarkListComponent folder={currentFolder}/>
    );

    let maybeDragLayer: React.ReactElement = null;
    if (this.props.draggedRank !== null) {
      let dragPreview: React.ReactElement = null;
      if (currentFolder === null) {
        const draggedFolder = this.props.folders[this.props.draggedRank];
        dragPreview = (
          <FolderComponent
            folder={draggedFolder}
            deleting={false}
            editing={false}
            dragging={false}
            hovering={false}
            isDragPreview={true}
            rank={-1}
          />
        );
      } else {
        const draggedBookmark = currentFolder.bookmarks[this.props.draggedRank];
        dragPreview = (
          <BookmarkComponent
            bookmark={draggedBookmark}
            editing={false}
            dragging={false}
            hovering={false}
            isDragPreview={true}
            rank={-1}
          />
        );
      }
      maybeDragLayer = (
        <DragLayerComponent>
          { dragPreview }
        </DragLayerComponent>
      );
    }

    const maybeAddBookmarksModal = this.props.showAddBookmarksModal ? (
      <AddBookmarksModalComponent/>
    ) : null;

    const maybeAppComponent = this.state.showNux ? null : (
      <div className="app" key="app">
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
        { maybeAddBookmarksModal }
        <CopiedToastComponent/>
      </div>
    );

    const maybeNuxComponent = this.state.showNux ? <NuxComponent key="nux"/> : null;

    const classes = this.props.loaded ? 'app-container loaded' : 'app-container';

    return (
      <CSSTransitionGroup
        className={classes}
        transitionName="app-transition"
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={300}
      >
        { maybeAppComponent }
        { maybeNuxComponent }
        <div className="app-background"/>
      </CSSTransitionGroup>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    loaded: state.foldersState.loaded,
    currentFolderId: state.navigationState.currentFolderId,
    draggedRank: state.dragDropState.draggedRank,
    folders: state.foldersState.folders,
    showAddBookmarksModal: state.addBookmarksState.showingModal,
  };
};

const mapActionsToProps = {
  loadAppData: SyncAppActions.loadAppData,
  syncFolders: SyncAppActions.syncFolders,
  closeFolder: FolderActions.closeFolder,
};

const Component = connect(mapStateToProps, mapActionsToProps)(AppComponent);
export { Component as AppComponent };
