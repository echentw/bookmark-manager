import { Action, DragDropActionType as ActionType } from 'actions/constants';
import { DragParams, DropParams } from 'actions/DragDropActions';
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';

export interface DragDropState {
  draggedRank: number | null;
}

export const initialDragDropState: DragDropState = {
  draggedRank: null,
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
    draggedRank: action.params.rank,
  };
}

function handleEndDrag(state: DragDropState, action: Action<DropParams>): DragDropState {
  return {
    draggedRank: null,
  };
}

function handleDragIsOver(state: DragDropState, action: Action<DragParams>): DragDropState {
  return {
    draggedRank: action.params.rank,
  };
}
