import { Action, DragDropActionType as ActionType } from '../actions/constants';
import { DragDropParams } from '../actions/DragDropActions';
import { Reducer } from './Reducer';
import { AppState } from '../reduxStore';

export interface DragDropState {
  draggedRank: number | null;
}

export const initialDragDropState: DragDropState = {
  draggedRank: null,
};

export const dragDropReducer: Reducer<DragDropState> = (
  state: DragDropState,
  action: Action,
  appState: AppState
): DragDropState => {
  let newState = state;
  switch (action.type) {
    case ActionType.beginDrag:
      newState = handleBeginDrag(state, action as Action<DragDropParams>);
      break;
    case ActionType.endDrag:
      newState = handleEndDrag(state, action as Action<DragDropParams>);
      break;
    case ActionType.isOver:
      newState = handleDragIsOver(state, action as Action<DragDropParams>);
      break;
  }
  return newState;
}

function handleBeginDrag(state: DragDropState, action: Action<DragDropParams>): DragDropState {
  return {
    draggedRank: action.params.rank,
  };
}

function handleEndDrag(state: DragDropState, action: Action<DragDropParams>): DragDropState {
  const rank = (state.draggedRank === action.params.rank) ? null : state.draggedRank;
  return {
    draggedRank: rank,
  };
}

function handleDragIsOver(state: DragDropState, action: Action<DragDropParams>): DragDropState {
  return {
    draggedRank: action.params.rank,
  };
}
