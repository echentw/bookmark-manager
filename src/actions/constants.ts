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
  beginEdit: 'EditFolder:beginEdit',
  cancel: 'EditFolder:cancel',
  save: 'EditFolder:save',
  showColorPicker: 'EditFolder:showColorPicker',
  hideColorPicker: 'EditFolder:hideColorPicker',
  selectColor: 'EditFolder:selectColor',
  showConfirmDeleteModal: 'EditFolder:showConfirmDeleteModal',
  hideConfirmDeleteModal: 'EditFolder:hideConfirmDeleteModal',
};

export const DeleteFolderActionType = {
  beginDelete: 'EditFolder:beginDelete',
  confirmDelete: 'EditFolder:confirmDelete',
  cancelDelete: 'EditFolder:cancelDelete',
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

export const DragBookmarkActionType = {
  begin: 'DragBookmark:begin',
  end: 'DragBookmark:end',
  isOver: 'DragBookmark:isOver',
};

export const HoverActionType = {
  enter: 'Hover:enter',
  exit: 'Hover:exit',
};

export const UserActionType = {
  setName: 'User:setName',
};

export const SettingsActionType = {
  showModal: 'Settings:showModal',
  hideModal: 'Settings:hideModal',
  setBackgroundImage: 'Settings:setBackgroundImage',
};

export const SyncActionType = {
  load: 'Sync:load',
  sync: 'Sync:sync',
};
