import { Action, HoverActionType as ActionType } from '../actions/constants';
import { HoverParams } from '../actions/HoverActions';

export interface HoverState {
  hoverRank: number | null;
}

export const initialHoverState: HoverState = {
  hoverRank: null,
};

export function hoverReducer(state: HoverState = initialHoverState, action: Action): HoverState {
  switch (action.type) {
    case ActionType.enter:
      return handleEnter(state, action as Action<HoverParams>);
    case ActionType.exit:
      return handleExit(state, action as Action<HoverParams>);
    default:
      return state;
  }
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
