import { Action, UserActionType, SyncActionType } from 'actions/constants';
import { UserParams } from 'actions/UserActions';
import { LoadParams, SyncParams } from 'actions/SyncActions';
import { AppState } from 'reduxStore';
import { User } from 'models/User';
import { Reducer } from 'reducers/Reducer';

export interface UserState {
  user: User | null;
}

export const initialUserState: UserState = {
  user: null,
};

export const userReducer: Reducer<UserState> = (
  state: UserState,
  action: Action,
  appState: AppState,
): UserState => {
  let newState = state;
  switch (action.type) {
    case UserActionType.setName:
      newState = handleSetName(state, action as Action<UserParams>);
      break;
    case SyncActionType.load:
      newState = handleLoad(state, action as Action<LoadParams>);
      break;
    case SyncActionType.sync:
      newState = handleSync(state, action as Action<SyncParams>);
      break;
  }
  return newState;
};

function handleSetName(state: UserState, action: Action<UserParams>): UserState {
  const user = new User({ name: action.params.name });
  return {
    user: user,
  };
}

function handleLoad(state: UserState, action: Action<LoadParams>): UserState {
  return {
    user: action.params.state.userState.user,
  };
}

function handleSync(state: UserState, action: Action<SyncParams>): UserState {
  return {
    user: action.params.state.userState.user,
  };
}
