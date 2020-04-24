import { Action, SyncActionType } from 'actions/constants';
import { LoadParams, SyncParams } from 'actions/SyncActions';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';

export interface MetaState {
  dataVersion: number;
  loaded: boolean;
}

export const initialMetaState: MetaState = {
  dataVersion: 0,
  loaded: false,
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
      };
  }
  return newState;
};

function handleLoad(state: MetaState, action: Action<LoadParams>): MetaState {
  return {
    dataVersion: action.params.state.metaState.dataVersion,
    loaded: true,
  };
}

function handleSync(state: MetaState, action: Action<SyncParams>): MetaState {
  return {
    dataVersion: action.params.state.metaState.dataVersion,
    loaded: true,
  };
}
