import { Note } from 'models/Note';
import { Action, NotesActionType as ActionType } from 'actions/constants';

export interface NoteParams {
  note: Note;
}

export function openNote(params: NoteParams): Action<NoteParams> {
  return {
    type: ActionType.openNote,
    params: params,
  };
}

export function addNote(): Action<NoteParams> {
  return {
    type: ActionType.addNote,
    params: {
      note: new Note({ name: 'New Note', text: '' }),
    },
  };
}

export function deleteNote(params: NoteParams): Action<NoteParams> {
  return {
    type: ActionType.deleteNote,
    params: params,
  };
}

export function editNote(params: NoteParams): Action<NoteParams> {
  return {
    type: ActionType.editNote,
    params: params,
  };
}
