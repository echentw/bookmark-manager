import { Action, HoverActionType as ActionType } from '../actions/constants';
import { HoverParams } from '../actions/HoverActions';
import { Reducer } from './Reducer';
import { AppState } from '../reduxStore';

export interface HoverState {
  hoverRank: number | null;
}

export const initialHoverState: HoverState = {
  hoverRank: null,
};

export const hoverReducer: Reducer<HoverState> = (
  state: HoverState = initialHoverState,
  action: Action,
  appState: AppState,
): HoverState => {
  let newState = state;
  switch (action.type) {
    case ActionType.enter:
      newState = handleEnter(state, action as Action<HoverParams>);
      break;
    case ActionType.exit:
      newState = handleExit(state, action as Action<HoverParams>);
      break;
  }
  return newState;
}

function handleEnter(state: HoverState, action: Action<HoverParams>): HoverState {
  return {
    hoverRank: action.params.rank,
  };
}

function handleExit(state: HoverState, action: Action<HoverParams>): HoverState {
  if (state.hoverRank !== action.params.rank) {
    return state;
  }
  return {
    hoverRank: null,
  };
}
