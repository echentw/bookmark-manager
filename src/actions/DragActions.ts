import { Action, DragActionType as ActionType } from 'actions/constants';


export interface DragBookmarkParams {
  folderRank: number;
  bookmarkRank: number;
}

export interface DragFolderParams {
  folderRank: number;
}

export interface DragNoteParams {
  noteRank: number;
}

export interface DropParams {
  trueDrop: boolean;
}

export function beginDragBookmark(params: DragBookmarkParams): Action<DragBookmarkParams> {
  return {
    type: ActionType.beginDragBookmark,
    params: params,
  };
}

export function beginDragFolder(params: DragFolderParams): Action<DragFolderParams> {
  return {
    type: ActionType.beginDragFolder,
    params: params,
  };
}

export function beginDragNote(params: DragNoteParams): Action<DragNoteParams> {
  return {
    type: ActionType.beginDragNote,
    params: params,
  };
}

export function isOverBookmark(params: DragBookmarkParams): Action<DragBookmarkParams> {
  return {
    type: ActionType.isOverBookmark,
    params: params,
  };
}

export function isOverFolder(params: DragFolderParams): Action<DragFolderParams> {
  return {
    type: ActionType.isOverFolder,
    params: params,
  };
}

export function isOverNote(params: DragNoteParams): Action<DragNoteParams> {
  return {
    type: ActionType.isOverNote,
    params: params,
  };
}

export function end(params: DropParams): Action<DropParams> {
  return {
    type: ActionType.end,
    params: params,
  };
}
