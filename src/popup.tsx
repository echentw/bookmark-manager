import './styles/popup.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Select from 'react-select';

import { Bookmark } from './Bookmark';
import { Folder } from './Folder';
import { ChromeAppState, ChromeHelpers, TabInfo } from './ChromeHelpers';

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

function findBookmarkInFolder(url: string, folder: Folder) {
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

interface State {
  loaded: boolean;
  bookmarkName: string;
  bookmark: Bookmark | null;
  folders: Folder[] | null;
  selectedFolder: Folder | null;

  // Whether the currently selected folder contains the current tab's url.
  alreadyBookmarked: boolean;
}

class AppComponent extends React.Component<{}, State> {

  state: State = {
    loaded: false,
    bookmarkName: '',
    bookmark: null,
    folders: null,
    selectedFolder: null,
    alreadyBookmarked: false,
  };

  componentDidMount = async () => {
    const [tabInfo, state]: [TabInfo, ChromeAppState] = await Promise.all([
      ChromeHelpers.getCurrentActiveTab(),
      ChromeHelpers.loadAppState(),
    ]);

    // Designate a folder as the active folder.
    let activeFolder = state.folders.find(folder => folder.id === state.currentFolderId);
    if (activeFolder === undefined) {
      // TODO: enforce that there must be at least one folder
      activeFolder = state.folders[0];
    }

    let selectedFolder: Folder | null = null;
    let bookmark: Bookmark | null = null;
    let alreadyBookmarked = false;

    // Check if the bookmark has already been saved. Find the first match.
    const foundData: FoundBookmarkInFoldersData = findBookmarkInFolders(tabInfo.url, activeFolder, state.folders);

    if (foundData.found) {
      const { folderIndex, bookmarkIndex } = foundData;
      selectedFolder = state.folders[folderIndex];
      bookmark = selectedFolder.bookmarks[bookmarkIndex];
      alreadyBookmarked = true;
    } else {
      selectedFolder = activeFolder;
      bookmark = new Bookmark({
        url: tabInfo.url,
        title: tabInfo.title,
        faviconUrl: tabInfo.faviconUrl,
      });
      alreadyBookmarked = false;
    }

    this.setState({
      loaded: true,
      bookmarkName: bookmark.displayName(),
      bookmark: bookmark,
      folders: state.folders,
      selectedFolder: selectedFolder,
      alreadyBookmarked: alreadyBookmarked,
    });
  }

  onChangeBookmarkName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ bookmarkName: event.target.value });
  }

  onChangeSelect = (option: SelectOption) => {
    const folder = this.state.folders.find(folder => folder.id === option.value);
    if (folder !== undefined) {
      const foundData: FoundBookmarkInFolderData = findBookmarkInFolder(this.state.bookmark.url, folder);
      if (foundData.found) {
        const bookmark = folder.bookmarks[foundData.index];
        this.setState({
          selectedFolder: folder,
          bookmarkName: bookmark.displayName(),
          bookmark: bookmark,
          alreadyBookmarked: true,
        });
      } else {
        this.setState({
          selectedFolder: folder,
          alreadyBookmarked: false,
        });
      }
    }
  }

  onClickCancel = () => {
    window.close();
  }

  onClickRemove = () => {
    if (this.state.alreadyBookmarked) {
      // TODO: implement me!
      console.log('you are trying to remove this bookmark from this folder');
    }
  }

  onClickSave = () => {
    if (this.state.loaded) {
      const bookmark = this.state.bookmark.withName(this.state.bookmarkName);
      console.log('about to save bookmark', bookmark.title, 'in folder', this.state.selectedFolder.name);
    }
    window.close();
  }

  render() {
    let options: SelectOption[] = [];
    let selectedOption: SelectOption | null = null;

    if (this.state.loaded) {
      options = this.state.folders.map(folder => ({
        value: folder.id,
        label: folder.name,
      }));
      selectedOption = {
        value: this.state.selectedFolder.id,
        label: this.state.selectedFolder.name,
      };
    }

    const title = this.state.alreadyBookmarked ? 'Edit Bookmark' : 'Add Bookmark';

    return (
      <div className="app">
        <div className="title">{title}</div>
        <div className="name">Name</div>
        <input className="name-text-field"
          type="text"
          value={this.state.bookmarkName}
          onChange={this.onChangeBookmarkName}
        />
        <Select
          value={selectedOption}
          options={options}
          onChange={this.onChangeSelect}
        />
        <div className="folder">Folder</div>
        <button className="cancel-button" onClick={this.onClickCancel}>Cancel</button>
        <button className="remove-button" onClick={this.onClickRemove}>Remove</button>
        <button className="save-button" onClick={this.onClickSave}>Save</button>
      </div>
    );
  }
};

ReactDOM.render(<AppComponent/>, document.getElementById('main'));
