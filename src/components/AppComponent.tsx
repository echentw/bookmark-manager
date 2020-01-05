import * as React from 'react';
import { connect } from 'react-redux';
import { Store } from 'redux';
import { CSSTransitionGroup } from 'react-transition-group';

import { Bookmark } from 'Bookmark';
import { Folder } from 'Folder';
import { User } from 'User';
import { ChromeAppState, ChromeAppStateForSync, ChromeHelpers } from 'ChromeHelpers';
import { StateBridge } from 'StateBridge';
import { StateDiffer } from 'StateDiffer';
import { LocalStorageHelpers } from 'LocalStorageHelpers';
import * as FolderActions from 'actions/FolderActions';
import * as SyncActions from 'actions/SyncActions';
import { LoadParams, SyncParams } from 'actions/SyncActions';
import { AppState, reduxStore } from 'reduxStore';
import { DragBookmarkState } from 'reducers/DragBookmarkReducer';
import { Action } from 'actions/constants';

import { BookmarkComponent } from 'components/BookmarkComponent';
import { FolderComponent } from 'components/FolderComponent';
import { BookmarkListComponent } from 'components/BookmarkListComponent';
import { FolderListComponent } from 'components/FolderListComponent';
import { GreetingComponent } from 'components/GreetingComponent';
import { DragLayerComponent } from 'components/DragLayerComponent';
import { CopiedToastComponent } from 'components/CopiedToastComponent';
import { AddBookmarksModalComponent } from 'components/AddBookmarksModalComponent';
import { DateComponent } from 'components/DateComponent';
import { NuxComponent } from 'components/NuxComponent';
import { SettingsModalComponent } from 'components/SettingsModalComponent';
import { SectionListComponent } from 'components/Sections/SectionListComponent';

export const DraggableType = {
  Bookmark: 'bookmark',
  Folder: 'folder',
};

export const USE_SECTIONSSS = true;

interface Props {
  user: User | null;
  loaded: boolean;
  currentFolderId: string | null;
  backgroundImageUrl: string;
  draggedRank: number | null;
  dragBookmarkState: DragBookmarkState;
  folders: Folder[];
  showAddBookmarksModal: boolean;
  showSettingsModal: boolean;
  closeFolder: (params: {}) => void;
  loadAppState: (params: LoadParams) => void;
  syncAppState: (params: SyncParams) => void;
}

interface State {
  date: Date;
  backgroundImageLoaded: boolean;
}

class AppComponent extends React.Component<Props, State> {
  state: State = {
    date: new Date(),
    backgroundImageLoaded: true,
  };

  private stateDiffer: StateDiffer = new StateDiffer();

  componentDidMount = () => {
    this.beginSyncingDate();
    this.beginSyncingStore(reduxStore);
  }

  componentDidUpdate = (prevProps: Props) => {
    // This is to prevent the background image from fading in until it's fully loaded.
    // Without this, the image will look super ugly if it's loading slowly.
    if (!prevProps.loaded && this.props.loaded) {
      const image = new Image();
      image.src = this.props.backgroundImageUrl;
      image.onload = () => {
        this.setState({ backgroundImageLoaded: true });
      }
    }
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

      const dragging = USE_SECTIONSSS ? (
        state.dragBookmarkState.folderRank !== null &&
        state.dragBookmarkState.bookmarkRank !== null
      ) : (
        state.dragDropState.draggedRank !== null
      );
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
      return <div className="app-container"/>;
    }

    let currentFolder: Folder | null;
    let ListComponent;

    if (USE_SECTIONSSS) {
      currentFolder = null;
      ListComponent = <SectionListComponent/>;
    } else {
      currentFolder = this.props.folders.find(folder => folder.id === this.props.currentFolderId) || null;
      ListComponent = currentFolder === null ? (
        <FolderListComponent/>
      ) : (
        <BookmarkListComponent folder={currentFolder}/>
      );
    }

    let maybeDragLayer: React.ReactElement = null;
    if (USE_SECTIONSSS) {
      const { folderRank, bookmarkRank } = this.props.dragBookmarkState;
      if (folderRank !== null && bookmarkRank !== null) {
        const folder = this.props.folders[folderRank];
        const bookmark = folder.bookmarks[bookmarkRank];
        maybeDragLayer = (
          <DragLayerComponent>
            <BookmarkComponent
              bookmark={bookmark}
              editing={false}
              dragging={false}
              hovering={false}
              isDragPreview={true}
              rank={-1}
            />
          </DragLayerComponent>
        );
      }
    } else {
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

    const backgroundStyles = {
      background: `url(${this.props.backgroundImageUrl}) center center / cover no-repeat fixed`,
    };

    const loadedCssClass = this.state.backgroundImageLoaded ? 'loaded' : '';

    // CSSTransitionGroup is to help transition between the NuxComponent and the main app components.
    return (
      <CSSTransitionGroup
        className={'app-container ' + loadedCssClass}
        transitionName="app-transition"
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={300}
      >
        { innerComponent }
        <div className="app-background" style={backgroundStyles}/>
      </CSSTransitionGroup>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    backgroundImageUrl: state.settingsState.backgroundImageUrl,
    currentFolderId: state.navigationState.currentFolderId,
    draggedRank: state.dragDropState.draggedRank,
    dragBookmarkState: state.dragBookmarkState,
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
