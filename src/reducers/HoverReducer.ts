import { Action, DragDropActionType, HoverActionType } from '../actions/constants';
import { DragParams } from '../actions/DragDropActions';
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

  if (appState.dragDropState.draggedRank !== null) {
    // If something is currently being dragged, then we don't want to trigger any hover behavior.
    return state;
  }

  let newState = state;
  switch (action.type) {
    case HoverActionType.enter:
      newState = handleEnter(state, action as Action<HoverParams>);
      break;
    case HoverActionType.exit:
      newState = handleExit(state, action as Action<HoverParams>);
      break;
    case DragDropActionType.beginDrag:
      newState = handleBeginDrag(state, action as Action<DragParams>);
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

function handleBeginDrag(state: HoverState, action: Action<DragParams>): HoverState {
  // If something is dragging, then we don't want any hover behavior.
  return {
    hoverRank: null,
  };
}
