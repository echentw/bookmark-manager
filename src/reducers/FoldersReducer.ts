import { Folder } from '../Folder';
import { Action, SyncAppActionType } from '../actions/constants';
import { SyncFoldersParams } from '../actions/SyncAppActions';

export interface FoldersState {
  folders: Folder[];
  draggedRank: number | null;
  loaded: boolean;
  openFolderId: string | null;
}

const firstFolder = new Folder({ name: 'General' });

export const initialFoldersState: FoldersState = {
  folders: [firstFolder],
  draggedRank: null,
  loaded: false,
  openFolderId: firstFolder.id,
}

export function foldersReducer(state: FoldersState = initialFoldersState, action: Action): FoldersState {
  switch (action.type) {
    case SyncAppActionType.syncFolders:
      return handleSyncFolders(state, action as Action<SyncFoldersParams>);
    default:
      return state;
  }
}

function handleSyncFolders(state: FoldersState, action: Action<SyncFoldersParams>): FoldersState {
  let openFolderId = state.openFolderId;
  if (openFolderId === null && action.params.openFolderId !== null) {
    openFolderId = action.params.openFolderId;
  }
  return {
    ...state,
    folders: action.params.folders,
    openFolderId: openFolderId,
  };
}
