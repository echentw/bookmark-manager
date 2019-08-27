import { Action, UserActionType, SyncAppActionType } from '../actions/constants';
import { SyncUserParams } from '../actions/SyncAppActions';
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
    case SyncAppActionType.syncUser:
      newState = handleSyncUser(state, action as Action<SyncUserParams>);
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

function handleSyncUser(state: UserState, action: Action<SyncUserParams>): UserState {
  return {
    user: action.params.user,
  };
}
