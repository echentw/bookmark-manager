import { Action, DragDropActionType as ActionType } from '../actions/constants';
import { DragDropParams } from '../actions/DragDropActions';

export interface DragDropState {
  dragging: boolean;
}

export const initialDragDropState: DragDropState = {
  dragging: false,
};

export function dragDropReducer(state: DragDropState = initialDragDropState, action: Action): DragDropState {
  switch (action.type) {
    case ActionType.beginDrag:
      return handleBeginDrag(state, action as Action<DragDropParams>);
    case ActionType.endDrag:
      return handleEndDrag(state, action as Action<DragDropParams>);
    default:
      return state;
  }
}

function handleBeginDrag(state: DragDropState, action: Action<DragDropParams>): DragDropState {
  return {
    dragging: true,
  };
}

function handleEndDrag(state: DragDropState, action: Action<DragDropParams>): DragDropState {
  return {
    dragging: false,
  };
}
