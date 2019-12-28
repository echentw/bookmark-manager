import { Action, DragDropActionType as ActionType } from 'actions/constants';
import { DragParams, DropParams } from 'actions/DragDropActions';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';

export interface DragDropState {
  draggedRank: number | null;

  // This is set to the rank at which the last-dropped item was "properly" dropped,
  // meaning the item was dropped while the mouse was inside the drop container.
  // If the item wasn't properly dropped, then this is set to null.
  lastDroppedRank: number | null;
}

export const initialDragDropState: DragDropState = {
  draggedRank: null,
  lastDroppedRank: null,
};

export const dragDropReducer: Reducer<DragDropState> = (
  state: DragDropState,
  action: Action,
  appState: AppState,
): DragDropState => {
  let newState = state;
  switch (action.type) {
    case ActionType.beginDrag:
      newState = handleBeginDrag(state, action as Action<DragParams>);
      break;
    case ActionType.endDrag:
      newState = handleEndDrag(state, action as Action<DropParams>);
      break;
    case ActionType.isOver:
      newState = handleDragIsOver(state, action as Action<DragParams>);
      break;
  }
  return newState;
};

function handleBeginDrag(state: DragDropState, action: Action<DragParams>): DragDropState {
  return {
    ...state,
    draggedRank: action.params.rank,
  };
}

function handleEndDrag(state: DragDropState, action: Action<DropParams>): DragDropState {
  let newDraggedRank = state.draggedRank;
  let lastDroppedRank = null;
  if (state.draggedRank === action.params.rank) {
    newDraggedRank = null;
    if (action.params.trueDrop) {
      lastDroppedRank = state.draggedRank;
    }
  }
  return {
    draggedRank: newDraggedRank,
    lastDroppedRank: lastDroppedRank,
  };
}

function handleDragIsOver(state: DragDropState, action: Action<DragParams>): DragDropState {
  return {
    ...state,
    draggedRank: action.params.rank,
  };
}
