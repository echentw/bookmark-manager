import * as React from 'react';
import { connect } from 'react-redux';
import { Store } from 'redux';
import { CSSTransitionGroup } from 'react-transition-group';

import { Bookmark } from '../Bookmark';
import { Folder } from '../Folder';
import { User } from '../User';
import { ChromeAppState, ChromeAppStateForSync, ChromeHelpers } from '../ChromeHelpers';
import { StateBridge } from '../StateBridge';
import { StateDiffer } from '../StateDiffer';
import { LocalStorageHelpers } from '../LocalStorageHelpers';
import * as FolderActions from '../actions/FolderActions';
import * as SyncActions from '../actions/SyncActions';
import { LoadParams, SyncParams } from '../actions/SyncActions';
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
import { SettingsModalComponent } from './SettingsModalComponent';

export const DraggableType = {
  Bookmark: 'bookmark',
  Folder: 'folder',
};

interface Props {
  user: User | null;
  loaded: boolean;
  currentFolderId: string | null;
  backgroundImageUrl: string;
  draggedRank: number | null;
  folders: Folder[];
  showAddBookmarksModal: boolean;
  showSettingsModal: boolean;
  closeFolder: (params: {}) => void;
  loadAppState: (params: LoadParams) => void;
  syncAppState: (params: SyncParams) => void;
}

interface State {
  date: Date;
}

class AppComponent extends React.Component<Props, State> {
  state: State = {
    date: new Date(),
  };

  private stateDiffer: StateDiffer = new StateDiffer();

  componentDidMount = () => {
    this.beginSyncingDate();
    this.beginSyncingStore(reduxStore);
  }

  private beginSyncingDate = () => {
    setInterval(() => {
      this.setState({ date: new Date() });
    }, 2000);
  }

  private beginSyncingStore = async (store: Store<AppState, Action>) => {
    // When the current react state changes, we might want to persist this state.
    store.subscribe(async () => {
      const state = store.getState();

      const dragging = state.dragDropState.draggedRank !== null;
      if (dragging) {
        // If the user is currently dragging, then they haven't finished their action yet.
        return;
      }

      const chromeAppState = StateBridge.toPersistedState(state);

      if (this.stateDiffer.shouldPersistState(chromeAppState)) {
        try {
          await ChromeHelpers.saveAppState(chromeAppState);
        } catch(e) {
          if (e.message.startsWith('QUOTA_BYTES')) {
            alert('Not enough storage space left! Please refresh this page, and consider deleting some folders/bookmarks to make room.');
          } else {
            alert(`Unknown error: ${e.message}`);
          }
        }
      }

      this.stateDiffer.update(chromeAppState);
    });

    // When the persisted state changes, we want to update the current react state.
    ChromeHelpers.addOnChangedListener((appState: ChromeAppStateForSync) => {
      this.props.syncAppState(appState);
    });

    // Do the initial load of state.
    const loadedState: ChromeAppState = await ChromeHelpers.loadAppState();
    this.props.loadAppState(loadedState);
  }

  render() {
    if (!this.props.loaded) {
      const backgroundImageUrl = LocalStorageHelpers.getBackgroundImageUrl();
      const styles = {
        background: `url(${this.props.backgroundImageUrl}) center center / cover no-repeat fixed`,
      };
      return (
        <div className="app-container">
          <div className="app-background" style={styles}/>
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

    const maybeSettingsModal = this.props.showSettingsModal ? (
      <SettingsModalComponent/>
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
        { maybeSettingsModal }
        <CopiedToastComponent/>
      </div>
    );

    const backgroundCustomStyles = this.props.backgroundImageUrl ? {
      background: `url(${this.props.backgroundImageUrl}) center center / cover no-repeat fixed`,
    } : {
      background: `url(${require('../../sandbox/wallpapers/dark_clouds.jpg')}) center center / cover no-repeat fixed`,
    };

    return (
      <CSSTransitionGroup
        className="app-container loaded"
        transitionName="app-transition"
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={300}
      >
        { innerComponent }
        <div className="app-background" style={backgroundCustomStyles}/>
      </CSSTransitionGroup>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    backgroundImageUrl: state.settingsState.backgroundImageUrl,
    currentFolderId: state.navigationState.currentFolderId,
    draggedRank: state.dragDropState.draggedRank,
    folders: state.foldersState.folders,
    loaded: state.loadedState.loaded,
    showAddBookmarksModal: state.addBookmarksState.showingModal,
    showSettingsModal: state.settingsState.showingModal,
    user: state.userState.user,
  };
};

const mapActionsToProps = {
  loadAppState: SyncActions.load,
  syncAppState: SyncActions.sync,
  closeFolder: FolderActions.closeFolder,
};

const Component = connect(mapStateToProps, mapActionsToProps)(AppComponent);
export { Component as AppComponent };
