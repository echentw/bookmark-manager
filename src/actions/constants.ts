export interface Action<Params = {}> {
  type: string;
  params: Params;
}

export const FolderActionType = {
  expand: 'Folder:expand',
  collapse: 'Folder:collapse',
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

export const DragActionType = {
  beginDragBookmark: 'Drag:beginDragBookmark',
  beginDragFolder: 'Drag:beginDragFolder',
  beginDragNote: 'Drag:beginDragNote',
  isOverBookmark: 'Drag:isOverBookmark',
  isOverFolder: 'Drag:isOverFolder',
  isOverNote: 'Drag:isOverNote',
  end: 'Drag:end',
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

export const UtilitiesActionType = {
  selectBookmarksTab: 'Utilities:selectBookmarksTab',
  selectNotesTab: 'Utilities:selectNotesTab',
};

export const NotesActionType = {
  openNote: 'Notes:openNote',
  closeNote: 'Notes:closeNote',
  addNote: 'Notes:addNote',
  deleteNote: 'Notes:deleteNote',
  editNote: 'Notes:editNote',
};
