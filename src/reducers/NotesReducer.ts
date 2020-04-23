import { Note } from 'models/Note';
import { Action, NotesActionType as ActionType } from 'actions/constants';
import { NoteParams } from 'actions/NotesActions'
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';

import { withItemDeleted, withItemReplaced } from 'utils';

export interface NotesState {
  notes: Note[];
  currentOpenNote: Note | null;
}

export const initialNotesState: NotesState = {
  notes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => new Note({
    id: `note-id-${i}`,
    name: `Note ${i}`,
    text: [
      'This is a preview of the note.',
      'This is the second line of the preview. And more text here.',
      'Third line gg yy of the note.',
      'Another line, the fourth!',
      'Hopefully this line will ensure that the text preview goes overflow.',
    ].join('\n\n'),
  })),
  currentOpenNote: null,
};

export const notesReducer: Reducer<NotesState> = (
  state: NotesState,
  action: Action,
  appState: AppState,
): NotesState => {
  let newState = state;
  switch (action.type) {
    case ActionType.openNote:
      newState = handleOpenNote(state, action as Action<NoteParams>);
      break;
    case ActionType.addNote:
      newState = handleAddNote(state, action as Action<NoteParams>);
      break;
    case ActionType.deleteNote:
      newState = handleDeleteNote(state, action as Action<NoteParams>);
      break;
    case ActionType.editNote:
      newState = handleEditNote(state, action as Action<NoteParams>);
      break;
  }
  return newState;
};

function handleOpenNote(state: NotesState, action: Action<NoteParams>): NotesState {
  return {
    ...state,
    currentOpenNote: action.params.note,
  };
}

function handleAddNote(state: NotesState, action: Action<NoteParams>): NotesState {
  const notes = state.notes.concat([action.params.note]);
  return {
    notes: notes,
    currentOpenNote: action.params.note,
  };
}

function handleDeleteNote(state: NotesState, action: Action<NoteParams>): NotesState {
  const notes = withItemDeleted<Note>(state.notes, action.params.note);
  const currentOpenNoteId = state.currentOpenNote === null ? null : state.currentOpenNote.id;
  const newOpenNoteId = currentOpenNoteId === action.params.note.id ? null : state.currentOpenNote;
  return {
    notes,
    currentOpenNote: newOpenNoteId,
  };
}

function handleEditNote(state: NotesState, action: Action<NoteParams>): NotesState {
  const notes = withItemReplaced<Note>(state.notes, action.params.note);
  return {
    ...state,
    notes: notes,
  };
}
