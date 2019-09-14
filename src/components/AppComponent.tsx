import * as React from 'react';
import { connect } from 'react-redux';
import { Store } from 'redux';
import { CSSTransitionGroup } from 'react-transition-group';

import { Bookmark } from '../Bookmark';
import { Folder } from '../Folder';
import { User } from '../User';
import { ChromeAppState, ChromeHelpers } from '../ChromeHelpers';
import * as SyncAppActions from '../actions/SyncAppActions';
import { SyncAppParams } from '../actions/SyncAppActions';
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
  user: User | null;
  loaded: boolean;
  currentFolderId: string | null;
  draggedRank: number | null;
  folders: Folder[];
  showAddBookmarksModal: boolean;
  loadAppData: (params: {}) => void;
  syncAppData: (params: SyncAppParams) => void;
  closeFolder: (params: {}) => void;
}

interface State {
  date: Date;
}

class AppComponent extends React.Component<Props, State> {
  state: State = {
    date: new Date(),
  };

  private oldUser: User | null = null;
  private oldFolders: Folder[] | null = null;
  private oldCurrentFolderId: string | null = null;

  componentDidMount = () => {
    this.beginSyncingDate();
    this.beginSyncingStore(reduxStore);
  }

  private beginSyncingDate = () => {
    setInterval(() => {
      this.setState({ date: new Date() });
    }, 2000);
  }

  private stateHasChanged = ({ oldState, newState }: {
    oldState: {
      user: User | null;
      folders: Folder[];
      currentFolderId: string | null;
    };
    newState: {
      user: User | null;
      folders: Folder[];
      currentFolderId: string | null;
    };
  }): boolean => {
    if (oldState.user === null) {
      if (newState.user !== null) {
        return true;
      }
    } else if (!oldState.user.equals(newState.user)) {
      return true;
    }
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
      const { user } = state.userState;

      if (this.oldFolders === null) {
        // Initialize all these attributes
        this.oldUser = user;
        this.oldFolders = folders.map(folder => folder.copy());
        this.oldCurrentFolderId = currentFolderId;
        return;
      }

      if (!dragging) {
        const stateChanged = this.stateHasChanged({
          oldState: {
            user: this.oldUser,
            currentFolderId: this.oldCurrentFolderId,
            folders: this.oldFolders,
          },
          newState: {
            user: user,
            currentFolderId: currentFolderId,
            folders: folders,
          },
        });
        if (stateChanged) {
          this.oldUser = user;
          this.oldFolders = folders.map(folder => folder.copy());
          this.oldCurrentFolderId = currentFolderId;
          try {
            await ChromeHelpers.saveAppState(state);
          } catch (e) {
            if (e.message.startsWith('QUOTA_BYTES')) {
              alert('Not enough storage space left! Please refresh this page, and consider deleting some folders/bookmarks to make room.');
            } else {
              alert(`Unknown error: ${e.message}`);
            }
          }
        }
      }
    });

    ChromeHelpers.addOnChangedListener((appState: ChromeAppState) => {
      this.props.syncAppData({
        user: appState.user,
        folders: appState.folders,
      });
    });

    this.props.loadAppData({});
  }

  render() {
    if (!this.props.loaded) {
      return (
        <div className="app-container">
          <div className="app-background"/>
        </div>
      );
    }

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

    const innerComponent = this.props.user === null ? (
      <NuxComponent key="nux"/>
    ) : (
      <div className="app" key="app">
        <div className="app-list-container">
          { ListComponent }
        </div>
        <div className="app-greeting-container">
          <GreetingComponent user={this.props.user} date={this.state.date}/>
        </div>
        <div className="app-date-container">
          <DateComponent date={this.state.date}/>
        </div>
        { maybeDragLayer }
        { maybeAddBookmarksModal }
        <CopiedToastComponent/>
      </div>
    );

    return (
      <CSSTransitionGroup
        className="app-container loaded"
        transitionName="app-transition"
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={300}
      >
        { innerComponent }
        <div className="app-background"/>
      </CSSTransitionGroup>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    user: state.userState.user,
    loaded: state.loadedState.loaded,
    currentFolderId: state.navigationState.currentFolderId,
    draggedRank: state.dragDropState.draggedRank,
    folders: state.foldersState.folders,
    showAddBookmarksModal: state.addBookmarksState.showingModal,
  };
};

const mapActionsToProps = {
  loadAppData: SyncAppActions.loadAppData,
  syncAppData: SyncAppActions.syncAppData,
  closeFolder: FolderActions.closeFolder,
};

const Component = connect(mapStateToProps, mapActionsToProps)(AppComponent);
export { Component as AppComponent };
