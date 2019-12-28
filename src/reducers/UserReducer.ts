import { Action, UserActionType  as ActionType } from 'actions/constants';
import { UserParams } from 'actions/UserActions';
import { AppState } from 'reduxStore';
import { User } from 'User';
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
    case ActionType.setName:
      newState = handleSetName(state, action as Action<UserParams>);
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
