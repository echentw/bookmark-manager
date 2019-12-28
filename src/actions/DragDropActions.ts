import { Action, DragDropActionType as ActionType } from 'actions/constants';

export interface DragParams {
  rank: number;
}

export interface DropParams {
  rank: number;
  trueDrop: boolean;
}

export function beginDrag(params: DragParams): Action<DragParams> {
  return {
    type: ActionType.beginDrag,
    params: params,
  };
}

export function endDrag(params: DropParams): Action<DropParams> {
  return {
    type: ActionType.endDrag,
    params: params,
  };
}

export function isOver(params: DragParams): Action<DragParams> {
  return {
    type: ActionType.isOver,
    params: params,
  };
}
