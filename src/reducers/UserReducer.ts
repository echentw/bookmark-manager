import { Action, UserActionType, SyncAppActionType } from '../actions/constants';
import { LoadAppParams, SyncAppParams } from '../actions/SyncAppActions';
import { UserParams } from '../actions/UserActions';
import { Reducer } from './Reducer';
import { AppState } from '../reduxStore';
import { User } from '../User';

export interface UserState {
  user: User | null;
}

export const initialUserState: UserState = {
  user: null,
};

export const userReducer: Reducer<UserState> = (
  state: UserState,
  action: Action,
  appState: AppState
): UserState => {
  let newState = state;
  switch (action.type) {
    case UserActionType.setName:
      newState = handleSetName(state, action as Action<UserParams>);
      break;
    case SyncAppActionType.load:
      newState = handleAppLoad(state, action as Action<LoadAppParams>);
      break;
    case SyncAppActionType.sync:
      newState = handleAppSync(state, action as Action<SyncAppParams>);
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

function handleAppLoad(state: UserState, action: Action<LoadAppParams>): UserState {
  return {
    user: action.params.user,
  };
}

function handleAppSync(state: UserState, action: Action<SyncAppParams>): UserState {
  return {
    user: action.params.user,
  };
}
