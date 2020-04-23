import { AppState } from 'reduxStore';
import { Folder } from 'models/Folder';
import { Note } from 'models/Note';
import {
  StateConverter,
  JsonState,
  JsonStateSyncPartial,
  mergeStates,
} from 'StateConverter';

enum PersistType {
  Sync,
  Load,
  None,
}

export class StateManager {
  private previousState: AppState | null;
  private initialized: boolean;

  constructor() {
    this.previousState = null;
  }

  update = (state: AppState) => {
    this.previousState = mergeStates<AppState>(state, {
      foldersState: {
        folders: state.foldersState.folders.map(folder => folder.copy()),
      },
    });
  }

  maybeGetStateToPersist = (newState: AppState): JsonState | JsonStateSyncPartial | null => {
    if (this.previousState === null) {
      return null;
    }

    const persistType = this.getPersistType(this.previousState, newState);
    switch (persistType) {
      case PersistType.Sync:
        return StateConverter.appStateToJsonStateSyncPartial(newState);
      case PersistType.Load:
        return StateConverter.appStateToJsonState(newState);
      case PersistType.None:
        return null;
      default:
        throw new Error('This should not happen!');
    }
  }

  private getPersistType = (prevState: AppState, nextState: AppState): PersistType => {
    const syncPropertiesSame = this.syncPropertiesAreSame(prevState, nextState);
    const loadOnlyPropertiesSame = this.loadOnlyPropertiesAreSame(prevState, nextState);

    if (!loadOnlyPropertiesSame) {
      return PersistType.Load;
    }
    if (!syncPropertiesSame) {
      return PersistType.Sync;
    }
    return PersistType.None;
  }

  private syncPropertiesAreSame = (state1: AppState, state2: AppState): boolean => {
    return (
      this.usersAreSame(state1, state2) &&
      this.foldersAreSame(state1, state2) &&
      this.notesAreSame(state1, state2) &&
      this.backgroundImageTimestampsAreSame(state1, state2)
    );
  }

  private loadOnlyPropertiesAreSame = (state1: AppState, state2: AppState): boolean => {
    return (
      this.activeTabsAreSame(state1, state2) &&
      this.currentOpenNotesAreSame(state1, state2)
    );
  }

  private usersAreSame = (state1: AppState, state2: AppState): boolean => {
    const user1 = state1.userState.user;
    const user2 = state2.userState.user;
    if (user1 === null) {
      return user2 === null;
    }
    return user1.equals(user2);
  }

  private foldersAreSame = (state1: AppState, state2: AppState): boolean => {
    const folders1 = state1.foldersState.folders;
    const folders2 = state2.foldersState.folders;
    if (folders1.length === folders2.length) {
      return folders1.every((folder1: Folder, index: number) => {
        return folder1.equals(folders2[index]);
      });
    }
    return false;
  }

  private notesAreSame = (state1: AppState, state2: AppState): boolean => {
    const notes1 = state1.notesState.notes;
    const notes2 = state2.notesState.notes;
    if (notes1.length === notes2.length) {
      return notes1.every((note1: Note, index: number) => {
        return note1.equals(notes2[index]);
      });
    }
    return false;
  }

  private backgroundImageTimestampsAreSame = (state1: AppState, state2: AppState): boolean => {
    const backgroundImageTimestamp1 = state1.settingsState.backgroundImageTimestamp;
    const backgroundImageTimestamp2 = state2.settingsState.backgroundImageTimestamp;
    return backgroundImageTimestamp1 === backgroundImageTimestamp2;
  }

  private activeTabsAreSame = (state1: AppState, state2: AppState): boolean => {
    const activeTab1 = state1.utilitiesState.activeTab;
    const activeTab2 = state2.utilitiesState.activeTab;
    return activeTab1 === activeTab2;
  }

  private currentOpenNotesAreSame = (state1: AppState, state2: AppState): boolean => {
    const note1 = state1.notesState.currentOpenNote;
    const note2 = state2.notesState.currentOpenNote;
    if (note1 === null) {
      return note1 === note2;
    } else {
      return note1.equals(note2);
    }
  }
}
