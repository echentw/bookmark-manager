export interface Action<Params = {}> {
  type: string;
  params: Params;
}

export const FolderActionType = {
  openFolder: 'Folder:openFolder',
  closeFolder: 'Folder:closeFolder',
};

export const EditFolderActionType = {
  addFolder: 'EditFolder:addFolder',
  deleteFolder: 'EditFolder:deleteFolder',
  beginEdit: 'EditFolder:beginEdit',
  cancel: 'EditFolder:cancel',
  save: 'EditFolder:save',
};

export const SyncAppActionType = {
  syncBookmarks: 'SyncApp:syncBookmarks',
  syncFolders: 'SyncApp:syncFolders',
};

export const AddBookmarksActionType = {
  showModal: 'AddBookmarks:showModal',
  cancel: 'AddBookmarks:cancel',
  save: 'AddBookmarks:save',
};

export const CopyUrlActionType = {
  showToast: 'CopyUrl:showToast',
  hideToast: 'CopyUrl:hideToast',
};

export const EditBookmarkActionType = {
  beginEdit: 'EditBookmark:beginEdit',
  cancel: 'EditBookmark:cancel',
  save: 'EditBookmark:save',
  deleteBookmark: 'EditBookmark:deleteBookmark',
};

export const DragDropActionType = {
  beginDrag: 'DragDrop:beginDrag',
  endDrag: 'DragDrop:endDrag',
  isOver: 'DragDrop:isOver',
};

export const HoverActionType = {
  enter: 'Hover:enter',
  exit: 'Hover:exit',
};
