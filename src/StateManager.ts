import { AppState } from 'reduxStore';
import {
  StateConverter,
  JsonState,
  JsonStateSyncPartial,
} from 'StateConverter';
import { Action } from 'actions/constants';
import { mutationActionTypesToSync, mutationActionTypesForLoadOnly } from 'actions/mutations';

enum PersistType {
  Sync = 'sync',
  Load = 'load',
  None = 'none',
}

export class StateManager {
  private previousDataVersion: number | null;

  constructor() {
    this.previousDataVersion = null;
  }

  update = (state: AppState) => {
    this.previousDataVersion = state.metaState.dataVersion;
  }

  maybeGetStateToPersist = (newState: AppState): JsonState | JsonStateSyncPartial | null => {
    if (this.previousDataVersion === null) {
      return null;
    }

    const persistType = this.getPersistType(newState.metaState.lastAction);

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

  private getPersistType = (action: Action): PersistType => {
    if (mutationActionTypesForLoadOnly.has(action.type)) {
      return PersistType.Load;
    }
    if (mutationActionTypesToSync.has(action.type)) {
      return PersistType.Sync;
    }
    return PersistType.None;
  }
}
