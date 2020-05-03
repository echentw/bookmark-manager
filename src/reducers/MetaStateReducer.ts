import { Action, SyncActionType } from 'actions/constants';
import { LoadParams, SyncParams } from 'actions/SyncActions';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';

export interface MetaState {
  codeVersion: number;
  dataVersion: number;
  loaded: boolean;
  lastAction: Action | null;
}

// Increment this number when new code version is backwards-incompatible,
// and old sessions need to refresh the page.
const CODE_VERSION = 2;

export const initialMetaState: MetaState = {
  codeVersion: CODE_VERSION,
  dataVersion: 0,
  loaded: false,
  lastAction: null,
};

export const metaStateReducer: Reducer<MetaState> = (
  state: MetaState,
  action: Action,
  appState: AppState,
): MetaState => {
  let newState = state;
  switch (action.type) {
    case SyncActionType.load:
      newState = handleLoad(state, action as Action<LoadParams>);
      break;
    case SyncActionType.sync:
      newState = handleSync(state, action as Action<SyncParams>);
      break;
    default:
      newState = {
        ...state,
        dataVersion: state.dataVersion + 1,
        lastAction: action,
      };
  }
  return newState;
};

function handleLoad(state: MetaState, action: Action<LoadParams>): MetaState {
  return {
    ...state,
    dataVersion: action.params.state.metaState.dataVersion,
    loaded: true,
    lastAction: action,
  };
}

function handleSync(state: MetaState, action: Action<SyncParams>): MetaState {
  return {
    ...state,
    dataVersion: action.params.state.metaState.dataVersion,
    lastAction: action,
  };
}
