import * as actionTypes from 'actions/constants';


export const mutationActionTypesToSync = new Set([
  actionTypes.FolderActionType.expand,
  actionTypes.FolderActionType.collapse,

  actionTypes.EditFolderActionType.addFolder,
  actionTypes.EditFolderActionType.save,

  actionTypes.DeleteFolderActionType.confirmDelete,

  actionTypes.AddBookmarksActionType.save,

  actionTypes.EditBookmarkActionType.save,
  actionTypes.EditBookmarkActionType.deleteBookmark,

  actionTypes.DragActionType.end,

  actionTypes.UserActionType.setName,

  actionTypes.SettingsActionType.setBackgroundImage,

  actionTypes.NotesActionType.addNote,
  actionTypes.NotesActionType.deleteNote,
  actionTypes.NotesActionType.editNote,
]);


export const mutationActionTypesForLoadOnly = new Set([
  actionTypes.UtilitiesActionType.selectBookmarksTab,
  actionTypes.UtilitiesActionType.selectNotesTab,

  actionTypes.NotesActionType.openNote,
  actionTypes.NotesActionType.closeNote,
]);


export const allMutationActionTypes = new Set([
  ...mutationActionTypesToSync,
  ...mutationActionTypesForLoadOnly,
]);
