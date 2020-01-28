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
import * as SyncActions from 'actions/SyncActions';
import { LoadParams, SyncParams } from 'actions/SyncActions';
import { AppState, reduxStore } from 'reduxStore';
import { DragState } from 'reducers/DragReducer';
import { Action } from 'actions/constants';

import { BookmarkComponent } from 'components/BookmarkComponent';
import { GreetingComponent } from 'components/GreetingComponent';
import { DragLayerComponent } from 'components/DragLayerComponent';
import { CopiedToastComponent } from 'components/CopiedToastComponent';
import { AddBookmarksModalComponent } from 'components/AddBookmarksModalComponent';
import { DateComponent } from 'components/DateComponent';
import { NuxComponent } from 'components/NuxComponent';
import { SettingsModalComponent } from 'components/SettingsModalComponent';
import { SectionListComponent } from 'components/Sections/SectionListComponent';
import { SectionComponent } from 'components/Sections/SectionComponent';

export enum DraggableType {
  Bookmark = 'bookmark',
  Folder = 'folder',
}

interface Props {
  user: User | null;
  loaded: boolean;
  backgroundImageUrl: string;
  dragState: DragState;
  folders: Folder[];
  showAddBookmarksModal: boolean;
  showSettingsModal: boolean;
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

      const dragging = state.dragState.draggableType !== null;
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

    let maybeDragLayer: React.ReactElement = null;
    const { draggableType, folderRank, bookmarkRank } = this.props.dragState;
    if (draggableType === DraggableType.Bookmark) {
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
    } else if (draggableType === DraggableType.Folder) {
      const folder = this.props.folders[folderRank];
      maybeDragLayer = (
        <DragLayerComponent>
          <SectionComponent
            folder={folder}
            editing={false}
            deleting={false}
            hovering={false}
            rank={-1}
            dragging={false}
            draggable={false}
            isDragPreview={true}
          />
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
          <SectionListComponent/>
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
    dragState: state.dragState,
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
};

const Component = connect(mapStateToProps, mapActionsToProps)(AppComponent);
export { Component as AppComponent };
