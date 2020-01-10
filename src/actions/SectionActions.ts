import { Folder } from 'Folder';
import { Action, SectionActionType as ActionType } from 'actions/constants';

export interface SectionParams {
  folder: Folder;
}

export function expandSection(params: SectionParams): Action<SectionParams> {
  return {
    type: ActionType.expand,
    params: params,
  };
}

export function collapseSection(params: SectionParams): Action<SectionParams> {
  return {
    type: ActionType.collapse,
    params: params,
  };
}
