import { Action, DragActionType as ActionType } from 'actions/constants';
import { DraggableType } from 'components/AppComponent';

export interface DragParams {
  draggableType: DraggableType;
  folderRank: number;
  bookmarkRank: number;
}

export interface DropParams {
  trueDrop: boolean;
}

export function begin(params: DragParams): Action<DragParams> {
  return {
    type: ActionType.begin,
    params: params,
  };
}

export function end(params: DropParams): Action<DropParams> {
  return {
    type: ActionType.end,
    params: params,
  };
}

export function isOver(params: DragParams): Action<DragParams> {
  return {
    type: ActionType.isOver,
    params: params,
  };
}
