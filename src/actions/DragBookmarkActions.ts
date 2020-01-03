import { Action, DragBookmarkActionType as ActionType } from 'actions/constants';

export interface DragBookmarkParams {
  folderRank: number;
  bookmarkRank: number;
}

export interface DropBookmarkParams {
  folderRank: number;
  bookmarkRank: number;
  trueDrop: boolean;
}

export function begin(params: DragBookmarkParams): Action<DragBookmarkParams> {
  return {
    type: ActionType.begin,
    params: params,
  };
}

export function end(params: DropBookmarkParams): Action<DropBookmarkParams> {
  return {
    type: ActionType.end,
    params: params,
  };
}

export function isOver(params: DragBookmarkParams): Action<DragBookmarkParams> {
  return {
    type: ActionType.isOver,
    params: params,
  };
}
