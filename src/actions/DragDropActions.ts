import { Action, DragDropActionType as ActionType } from './constants';

export interface DragDropParams {
  rank: number;
}

export function beginDrag(params: DragDropParams): Action<DragDropParams> {
  return {
    type: ActionType.beginDrag,
    params: params,
  };
}

export function endDrag(params: DragDropParams): Action<DragDropParams> {
  return {
    type: ActionType.endDrag,
    params: params,
  };
}

export function isOver(params: DragDropParams): Action<DragDropParams> {
  return {
    type: ActionType.isOver,
    params: params,
  };
}
