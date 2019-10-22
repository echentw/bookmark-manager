import { ChromeAppState } from './ChromeHelpers';
import { Folder } from './Folder';

// Tells you whether two ChromeAppStates are the same or not.
export class StateDiffer {
  private previousState: ChromeAppState | null;
  private initialized: boolean;

  constructor() {
    this.previousState = null;
    this.initialized = false;
  }

  shouldPersistState = (state: ChromeAppState): boolean => {
    if (!this.initialized) {
      return false;
    }
    if (this.statesAreDifferent(this.previousState, state)) {
      return true;
    }
    return false;
  }

  update = (state: ChromeAppState) => {
    this.previousState = {
      user: state.user,
      folders: state.folders.map(folder => folder.copy()),
      currentFolderId: state.currentFolderId,
      backgroundImageTimestamp: state.backgroundImageTimestamp,
    };
    this.initialized = true;
  }

  private statesAreDifferent = (state1: ChromeAppState, state2: ChromeAppState): boolean => {
    return (
      this.userStatesAreDifferent(state1, state2) ||
      this.currentFolderIdStatesAreDifferent(state1, state2) ||
      this.folderStatesAreDifferent(state1, state2) ||
      this.settingsStatesAreDifferent(state1, state2)
    );
  }

  private userStatesAreDifferent = (state1: ChromeAppState, state2: ChromeAppState): boolean => {
    if (state1.user === null) {
      return state2.user !== null;
    }
    return !state1.user.equals(state2.user);
  }

  private currentFolderIdStatesAreDifferent = (state1: ChromeAppState, state2: ChromeAppState): boolean => {
    if (state1.currentFolderId !== state2.currentFolderId) {
      return true;
    }
  }
  private folderStatesAreDifferent = (state1: ChromeAppState, state2: ChromeAppState): boolean => {
    if (state1.folders.length !== state2.folders.length) {
      return true;
    }
    return !state1.folders.every((folder1: Folder, index: number) => {
      return folder1.equals(state2.folders[index]);
    });
  }

  private settingsStatesAreDifferent = (state1: ChromeAppState, state2: ChromeAppState): boolean => {
    return state1.backgroundImageTimestamp !== state2.backgroundImageTimestamp;
  }
}
