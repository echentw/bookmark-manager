import * as React from 'react';
import { connect } from 'react-redux';
import { Store } from 'redux';

import { Bookmark } from '../Bookmark';
import { Folder } from '../Folder';
import { ChromeHelpers } from '../ChromeHelpers';
import * as SyncAppActions from '../actions/SyncAppActions';
import { SyncFoldersParams } from '../actions/SyncAppActions';
import * as FolderActions from '../actions/FolderActions';
import { AppState, reduxStore } from '../reduxStore';
import { Action } from '../actions/constants';

import { BookmarkListComponent } from './BookmarkListComponent';
import { FolderListComponent } from './FolderListComponent';
import { GreetingComponent } from './GreetingComponent';
import { DragLayerComponent } from './DragLayerComponent';
import { CopiedToastComponent } from './CopiedToastComponent';
import { AddBookmarksModalComponent } from './AddBookmarksModalComponent';
import { DateComponent } from './DateComponent';

const backgroundImage = require('../blue_stars.jpg');

export const DraggableType = {
  Bookmark: 'bookmark',
  Folder: 'folder',
};

interface Props {
  loaded: boolean;
  currentFolderId: string | null;
  folders: Folder[];
  loadAppData: (params: {}) => void;
  syncFolders: (params: SyncFoldersParams) => void;
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
        this.oldFolders = folders;
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
          this.oldFolders = folders;
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
    const classes = this.props.loaded ? 'app loaded' : 'app';

    const currentFolder = this.props.folders.find(folder => folder.id === this.props.currentFolderId) || null;

    const ListComponent = currentFolder === null ? (
      <FolderListComponent/>
    ) : (
      <BookmarkListComponent folder={currentFolder}/>
    );

    const maybeDragLayer = currentFolder === null ? null : (
      <DragLayerComponent bookmarks={currentFolder.bookmarks}/>
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
    currentFolderId: state.navigationState.currentFolderId,
    folders: state.foldersState.folders,
  };
};

const mapActionsToProps = {
  loadAppData: SyncAppActions.loadAppData,
  syncFolders: SyncAppActions.syncFolders,
  closeFolder: FolderActions.closeFolder,
};

const Component = connect(mapStateToProps, mapActionsToProps)(AppComponent);
export { Component as AppComponent };
