import * as React from 'react';
import { connect } from 'react-redux';
import { Store } from 'redux';
import { CSSTransitionGroup } from 'react-transition-group';

import { Bookmark } from 'models/Bookmark';
import { Folder } from 'models/Folder';
import { User } from 'models/User';
import { Note } from 'models/Note';

import { ChromeHelpers } from 'ChromeHelpers';
import * as SyncActions from 'actions/SyncActions';
import { Action, SyncActionType } from 'actions/constants';
import { LoadParams, SyncParams } from 'actions/SyncActions';
import * as NotesActions from 'actions/NotesActions';
import { NoteParams } from 'actions/NotesActions';
import { AppState, reduxStore } from 'reduxStore';
import { DragState } from 'reducers/DragReducer';

import { StateManager } from 'StateManager';
import { StateConverter, JsonState } from 'StateConverter';

import { BookmarkComponent } from 'components/BookmarkComponent';
import { FolderComponent } from 'components/FolderComponent';
import { NotePreviewComponent } from 'components/Notes/NotePreviewComponent';
import { GreetingComponent } from 'components/GreetingComponent';
import { DragLayerComponent } from 'components/DragLayerComponent';
import { CopiedToastComponent } from 'components/CopiedToastComponent';
import { AddBookmarksModalComponent } from 'components/AddBookmarksModalComponent';
import { DateComponent } from 'components/DateComponent';
import { NuxComponent } from 'components/NuxComponent';
import { SettingsModalComponent } from 'components/SettingsModalComponent';
import { UtilitiesPaneComponent } from 'components/UtilitiesPaneComponent';
import { SettingsCogComponent } from 'components/SettingsCogComponent';
import { NoteEditorComponent } from 'components/Notes/NoteEditorComponent';


export enum DraggableType {
  Bookmark = 'bookmark',
  Folder = 'folder',
  Note = 'note',
}

interface Props {
  dataVersion: number;
  user: User | null;
  loaded: boolean;
  backgroundImageUrl: string;
  dragState: DragState;
  folders: Folder[];
  notes: Note[];
  showAddBookmarksModal: boolean;
  showSettingsModal: boolean;
  currentOpenNote: Note | null;
  deletingFolderId: string | null;

  closeNote: (params: NoteParams) => void;
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

  private stateManager: StateManager = new StateManager();

  componentDidMount = () => {
    this.beginSyncingDate();
    this.beginSyncingStore(reduxStore);

    document.addEventListener('keydown', this.handleKeyboardShortcuts);
  }

  handleKeyboardShortcuts = (event: KeyboardEvent) => {
    if (document.activeElement.tagName.toUpperCase() === 'BODY') {
      if (event.keyCode === 72) {
        // 'h' key
        if (
          this.props.currentOpenNote !== null
          && !this.props.showSettingsModal
          && !this.props.showAddBookmarksModal
          && this.props.deletingFolderId === null
        ) {
          this.props.closeNote({ note: this.props.currentOpenNote });
        }
      }
    }
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

      if (![SyncActionType.load, SyncActionType.sync].includes(state.metaState.lastAction.type)) {
        const maybeJsonPartialState: Partial<JsonState> = this.stateManager.maybeGetStateToPersist(state);
        if (maybeJsonPartialState !== null) {
          try {
            await ChromeHelpers.save(maybeJsonPartialState);
          } catch(e) {
            console.log(e.message);
            if (e.message.startsWith('QUOTA_BYTES')) {
              alert('Not enough storage space left! Please refresh this page, and consider deleting some folders/bookmarks/notes to make room.');
            } else if (e.message.startsWith('OUTDATED_CODE_VERSION')) {
              alert('There is a new version of Axle available! Please refresh the page to get the new version.');
            } else {
              alert(`Unknown error: ${e.message}`);
            }
          }
        }
      }

      this.stateManager.update(state);
    });

    // When the persisted state changes, we want to update the current react state.
    ChromeHelpers.addOnChangedListener((jsonState: JsonState) => {
      if (jsonState.dataVersion <= this.props.dataVersion) {
        return;
      }
      const appStateSyncPartial = StateConverter.jsonStateToAppStateSyncPartial(jsonState);
      this.props.syncAppState({ state: appStateSyncPartial });
    });

    // Do the initial load of state.
    const jsonState: JsonState = await ChromeHelpers.load();
    const appStateLoadPartial = StateConverter.jsonStateToAppStateLoadPartial(jsonState);
    this.props.loadAppState({ state: appStateLoadPartial });
  }

  render() {
    if (!this.props.loaded) {
      return <div className="app-container"/>;
    }

    let maybeDragLayer: React.ReactElement = null;
    const { draggableType, folderRank, bookmarkRank, noteRank } = this.props.dragState;
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
          />
        </DragLayerComponent>
      );
    } else if (draggableType === DraggableType.Folder) {
      const folder = this.props.folders[folderRank];
      maybeDragLayer = (
        <DragLayerComponent>
          <FolderComponent
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
    } else if (draggableType === DraggableType.Note) {
      const note = this.props.notes[noteRank];
      maybeDragLayer = (
        <DragLayerComponent>
          <NotePreviewComponent
            note={note}
            dragging={false}
            hovering={false}
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

    const displayingNote = this.props.currentOpenNote !== null;

    let maybeNoteEditor: React.ReactElement = null;
    let maybeWithNoteCssClass = '';

    if (displayingNote) {
      maybeNoteEditor = (
        <div className="note-editor-container">
          <NoteEditorComponent note={this.props.currentOpenNote}/>
        </div>
      );
      maybeWithNoteCssClass = ' with-note';
    }

    const innerComponent = this.props.user === null ? (
      <NuxComponent/>
    ) : (
      <div className={'app' + maybeWithNoteCssClass}>
        <div className="utilities-pane-container">
          <UtilitiesPaneComponent/>
        </div>
        { maybeNoteEditor }
        <div className="app-greeting-container">
          <GreetingComponent user={this.props.user} date={this.state.date}/>
        </div>
        <DateComponent date={this.state.date}/>
        <SettingsCogComponent/>
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
    dataVersion: state.metaState.dataVersion,
    backgroundImageUrl: state.settingsState.backgroundImageUrl,
    dragState: state.dragState,
    folders: state.foldersState.folders,
    notes: state.notesState.notes,
    loaded: state.metaState.loaded,
    showAddBookmarksModal: state.addBookmarksState.showingModal,
    showSettingsModal: state.settingsState.showingModal,
    user: state.userState.user,
    currentOpenNote: state.notesState.currentOpenNote,
    deletingFolderId: state.deleteFolderState.deletingFolderId,
  };
};

const mapActionsToProps = {
  closeNote: NotesActions.closeNote,
  loadAppState: SyncActions.load,
  syncAppState: SyncActions.sync,
};

const Component = connect(mapStateToProps, mapActionsToProps)(AppComponent);
export { Component as AppComponent };
