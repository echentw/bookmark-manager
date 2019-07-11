export interface Action<Params = {}> {
  type: string;
  params: Params;
}

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
