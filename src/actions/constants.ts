export interface Action<Params = {}> {
  type: string;
  params: Params;
}

export const FolderActionType = {
  expand: 'Folder:expand', // write
  collapse: 'Folder:collapse', // write
};

export const EditFolderActionType = {
  addFolder: 'EditFolder:addFolder', // write
  beginEdit: 'EditFolder:beginEdit',
  cancel: 'EditFolder:cancel',
  save: 'EditFolder:save', // write
  showConfirmDeleteModal: 'EditFolder:showConfirmDeleteModal',
  hideConfirmDeleteModal: 'EditFolder:hideConfirmDeleteModal',
};

export const DeleteFolderActionType = {
  beginDelete: 'EditFolder:beginDelete',
  confirmDelete: 'EditFolder:confirmDelete', // write
  cancelDelete: 'EditFolder:cancelDelete',
};

export const AddBookmarksActionType = {
  showModal: 'AddBookmarks:showModal',
  cancel: 'AddBookmarks:cancel',
  save: 'AddBookmarks:save', // write
};

export const CopyUrlActionType = {
  showToast: 'CopyUrl:showToast',
  hideToast: 'CopyUrl:hideToast',
};

export const EditBookmarkActionType = {
  beginEdit: 'EditBookmark:beginEdit',
  cancel: 'EditBookmark:cancel',
  save: 'EditBookmark:save', // write
  deleteBookmark: 'EditBookmark:deleteBookmark', // write
};

export const DragActionType = {
  beginDragBookmark: 'Drag:beginDragBookmark',
  beginDragFolder: 'Drag:beginDragFolder',
  beginDragNote: 'Drag:beginDragNote',
  isOverBookmark: 'Drag:isOverBookmark',
  isOverFolder: 'Drag:isOverFolder',
  isOverNote: 'Drag:isOverNote',
  end: 'Drag:end', // write
};

export const HoverActionType = {
  enter: 'Hover:enter',
  exit: 'Hover:exit',
};

export const UserActionType = {
  setName: 'User:setName', // write
};

export const SettingsActionType = {
  showModal: 'Settings:showModal',
  hideModal: 'Settings:hideModal',
  setBackgroundImage: 'Settings:setBackgroundImage', // write
};

export const SyncActionType = {
  load: 'Sync:load',
  sync: 'Sync:sync',
};

export const UtilitiesActionType = {
  selectBookmarksTab: 'Utilities:selectBookmarksTab', // write
  selectNotesTab: 'Utilities:selectNotesTab', // write
};

export const NotesActionType = {
  openNote: 'Notes:openNote', // write
  closeNote: 'Notes:closeNote', // write
  addNote: 'Notes:addNote', // write
  deleteNote: 'Notes:deleteNote', // write
  editNote: 'Notes:editNote', // write
};
