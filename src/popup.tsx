import 'styles/popup.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { Store } from 'redux';
import Select from 'react-select';

import { Action, SyncActionType, AddBookmarksActionType, EditBookmarkActionType } from 'actions/constants';
import * as SyncActions from 'actions/SyncActions';
import { LoadParams, SyncParams } from 'actions/SyncActions';
import * as EditBookmarkActions from 'actions/EditBookmarkActions';
import { EditBookmarkParams } from 'actions/EditBookmarkActions';
import * as AddBookmarksActions from 'actions/AddBookmarksActions';
import { AddBookmarksSaveParams, ExternalShowModalParams } from 'actions/AddBookmarksActions';

import { Bookmark } from 'models/Bookmark';
import { Folder } from 'models/Folder';

import { ChromeHelpers, TabInfo } from 'ChromeHelpers';
import { StateConverter, JsonState } from 'StateConverter';
import { AppState, reduxStore } from 'reduxStore';
import { StateManager } from 'StateManager';

import { ENABLE_NOTES } from 'features';

interface FoundBookmarkInFoldersData {
  found: boolean;
  folderIndex: number | null;
  bookmarkIndex: number | null;
}

// Find the bookmark url in the array of folders, if it exists.
// The active folder is prioritized.
function findBookmarkInFolders(url: string, activeFolder: Folder, folders: Folder[]): FoundBookmarkInFoldersData {
  // First, check if the bookmark is in the active folder.
  for (let j = 0; j < activeFolder.bookmarks.length; ++j) {
    const bookmark = activeFolder.bookmarks[j];
    if (bookmark.url === url) {
      const activeFolderIndex = folders.findIndex(folder => folder.id === activeFolder.id);
      return {
        found: true,
        folderIndex: activeFolderIndex,
        bookmarkIndex: j,
      };
    }
  }

  // Check the rest of the folders.
  for (let i = 0; i < folders.length; ++i) {
    const folder = folders[i];
    for (let j = 0; j < folder.bookmarks.length; ++j) {
      const bookmark = folder.bookmarks[j];
      if (bookmark.url === url) {
        return {
          found: true,
          folderIndex: i,
          bookmarkIndex: j,
        };
      }
    }
  }

  // We didn't find the bookmark in any of the current folders.
  return {
    found: false,
    folderIndex: null,
    bookmarkIndex: null,
  };
}

interface FoundBookmarkInFolderData {
  found: boolean;
  index: number | null;
}

function findBookmarkInFolder(url: string, folder: Folder): FoundBookmarkInFolderData {
  for (let i = 0; i < folder.bookmarks.length; ++i) {
    const bookmark = folder.bookmarks[i];
    if (bookmark.url === url) {
      return {
        found: true,
        index: i,
      };
    }
  }
  return {
    found: false,
    index: null,
  };
}

interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  dataVersion: number;
  appStateLoaded: boolean;
  folders: Folder[];

  deleteBookmark: (params: EditBookmarkParams) => void;
  editBookmark: (params: EditBookmarkParams) => void;
  addBookmarks: (params: AddBookmarksSaveParams) => void;

  showAddBookmarksModal: (params: ExternalShowModalParams) => void;
  loadAppState: (params: LoadParams) => void;
  syncAppState: (params: SyncParams) => void;
}

interface State {
  computed: boolean;
  tabInfo: TabInfo | null;

  bookmarkName: string;
  bookmark: Bookmark | null;
  selectedFolder: Folder | null;

  // Whether the currently selected folder contains the current tab's url.
  alreadyBookmarked: boolean;

  // Whether to flash the title (should be whenever it changes).
  titlePulsing: boolean;
}

class PopupComponent extends React.Component<Props, State> {

  private stateManager: StateManager = new StateManager();

  state: State = {
    computed: false,
    tabInfo: null,
    bookmarkName: '',
    bookmark: null,
    selectedFolder: null,
    alreadyBookmarked: false,
    titlePulsing: false,
  };

  componentDidMount = async () => {
    const tabInfo: TabInfo = await ChromeHelpers.getCurrentActiveTab();
    this.setState({ tabInfo }, () => {
      this.beginSyncingStore(reduxStore);
    });
  }

  private beginSyncingStore = async (store: Store<AppState, Action>) => {
    store.subscribe(async () => {
      const state = store.getState();

      if ([SyncActionType.load, SyncActionType.sync].includes(state.metaState.lastAction.type)) {
        this.recomputeFolderAndBookmark(this.state.selectedFolder);
      }

      if (
        [
          AddBookmarksActionType.save,
          EditBookmarkActionType.save,
          EditBookmarkActionType.deleteBookmark,
        ]
        .includes(state.metaState.lastAction.type)
      ) {
        const maybeJsonPartialState: Partial<JsonState> = this.stateManager.maybeGetStateToPersist(state);
        if (maybeJsonPartialState !== null) {
          try {
            await ChromeHelpers.save(maybeJsonPartialState);
            window.close();
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
      if (ENABLE_NOTES && jsonState.dataVersion <= this.props.dataVersion) {
        return;
      }
      const appStateSyncPartial = StateConverter.jsonStateToAppStateSyncPartial(jsonState);
      this.props.syncAppState({ state: appStateSyncPartial });
    });

    // Do the initial load of state.
    const jsonState: JsonState = await ChromeHelpers.load();
    const appStateLoadPartial = StateConverter.jsonStateToAppStateLoadPartial(jsonState);
    this.props.loadAppState({ state: appStateLoadPartial });
  };

  private recomputeFolderAndBookmark = (maybeFolder: Folder | null) => {
    const activeFolder = maybeFolder
      ?? this.props.folders.find(folder => !folder.collapsed)
      ?? this.props.folders[0];

    let selectedFolder: Folder | null = null;
    let bookmark: Bookmark | null = null;
    let alreadyBookmarked = false;

    // Check if the bookmark has already been saved. Find the first match.
    const foundData = findBookmarkInFolders(this.state.tabInfo.url, activeFolder, this.props.folders);

    if (foundData.found) {
      const { folderIndex, bookmarkIndex } = foundData;
      selectedFolder = this.props.folders[folderIndex];
      bookmark = selectedFolder.bookmarks[bookmarkIndex];
      alreadyBookmarked = true;
    } else {
      selectedFolder = activeFolder;
      bookmark = new Bookmark({
        url: this.state.tabInfo.url,
        title: this.state.tabInfo.title,
        faviconUrl: this.state.tabInfo.faviconUrl,
      });
      alreadyBookmarked = false;
    }

    this.props.showAddBookmarksModal({ folder: selectedFolder });

    this.setState({
      computed: true,
      bookmarkName: bookmark.displayName(),
      bookmark: bookmark,
      selectedFolder: selectedFolder,
      alreadyBookmarked: alreadyBookmarked,
    });
  }

  onChangeBookmarkName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ bookmarkName: event.target.value });
  }

  onChangeSelect = (option: SelectOption) => {
    const folder = this.props.folders.find(folder => folder.id === option.value);
    if (folder === undefined) {
      return;
    }

    this.props.showAddBookmarksModal({ folder });

    const foundData: FoundBookmarkInFolderData = findBookmarkInFolder(this.state.bookmark.url, folder);
    if (foundData.found) {
      if (!this.state.alreadyBookmarked) {
        this.pulseTitle();
      }
      const bookmark = folder.bookmarks[foundData.index];
      this.setState({
        selectedFolder: folder,
        bookmarkName: bookmark.displayName(),
        bookmark: bookmark,
        alreadyBookmarked: true,
      });
    } else {
      if (this.state.alreadyBookmarked) {
        this.pulseTitle();
      }
      this.setState({
        selectedFolder: folder,
        bookmark: new Bookmark({
          url: this.state.tabInfo.url,
          title: this.state.tabInfo.title,
          faviconUrl: this.state.tabInfo.faviconUrl,
        }),
        alreadyBookmarked: false,
      });
    }
  }

  pulseTitle = () => {
    this.setState({ titlePulsing: true }, () => {
      setTimeout(() => {
        if (this.state.titlePulsing) {
          this.setState({ titlePulsing: false });
        }
      }, 1000);
    });
  }

  onClickCancel = () => {
    window.close();
  }

  onClickRemove = async () => {
    if (this.state.alreadyBookmarked) {
      this.props.deleteBookmark({ bookmark: this.state.bookmark });
    }
  }

  onClickSave = async () => {
    if (this.state.computed) {
      const newBookmark = this.state.bookmark.withName(this.state.bookmarkName);
      if (this.state.alreadyBookmarked) {
        this.props.editBookmark({ bookmark: newBookmark });
      } else {
        this.props.addBookmarks({ bookmarks: [newBookmark] });
      }
    }
  }

  render() {
    let options: SelectOption[] = [];
    let selectedOption: SelectOption | null = null;

    if (this.state.computed) {
      options = this.props.folders.map(folder => ({
        value: folder.id,
        label: folder.name,
      }));
      selectedOption = {
        value: this.state.selectedFolder.id,
        label: this.state.selectedFolder.name,
      };
    }

    const maybePulseCssClass = this.state.titlePulsing ? 'pulse' : '';
    const titleAction = this.state.alreadyBookmarked ? 'Edit' : 'Add';
    const titleComponent = (
      <div className="title">
        <div className={'title-action ' + maybePulseCssClass}>{titleAction}</div>
        <div className="title-object">Bookmark</div>
      </div>
    );

    // Doesn't look like @types/react-select exports the Theme interface.
    const theme = (theme: any): any => {
      return {
        ...theme,
        colors: {
          ...theme.colors,
          neutral20: 'rgb(150, 150, 150)',
          primary: 'rgb(38, 132, 255)',
        },
      };
    };

    return (
      <div className="app">
        <div className="head">
          { titleComponent }
        </div>
        <div className="body">
          <div className="first-row">
            <div className="folder">Folder</div>
            <Select
              className="react-select-container"
              classNamePrefix="react-select"
              theme={theme}
              value={selectedOption}
              options={options}
              onChange={this.onChangeSelect}
            />
          </div>
          <div className="second-row">
            <div className="name">Name</div>
            <input className="name-text-field"
              type="text"
              value={this.state.bookmarkName}
              onChange={this.onChangeBookmarkName}
            />
          </div>
          <div className="third-row">
            <button className="popup-button" onClick={this.onClickCancel}>Cancel</button>
            <button className={this.state.alreadyBookmarked ? 'popup-button' : 'popup-button disabled'}
              onClick={this.onClickRemove}
              disabled={!this.state.alreadyBookmarked}
            >
              Remove
            </button>
            <button className="popup-button" onClick={this.onClickSave}>Save</button>
          </div>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    dataVersion: state.metaState.dataVersion,
    appStateLoaded: state.metaState.loaded,
    folders: state.foldersState.folders,
  };
};

const mapActionsToProps = {
  deleteBookmark: EditBookmarkActions.deleteBookmark,
  editBookmark: EditBookmarkActions.save,
  addBookmarks: AddBookmarksActions.save,

  showAddBookmarksModal: AddBookmarksActions.showModal,
  loadAppState: SyncActions.load,
  syncAppState: SyncActions.sync,
};

const ReduxedPopupComponent = connect(mapStateToProps, mapActionsToProps)(PopupComponent);

const MainComponent = () => (
  <Provider store={reduxStore}>
    <ReduxedPopupComponent/>
  </Provider>
);

ReactDOM.render(<MainComponent/>, document.getElementById('main'));
