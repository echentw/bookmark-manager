import { Note } from 'models/Note';
import { Action, NotesActionType, DragActionType } from 'actions/constants';
import { NoteParams } from 'actions/NotesActions'
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';

import { withItemDeleted, withItemReplaced } from 'utils';
import { DragNoteParams } from 'actions/DragActions';
import { DraggableType } from 'components/AppComponent';

export interface NotesState {
  notes: Note[];
  currentOpenNote: Note | null;
}

export const initialNotesState: NotesState = {
  notes: [],
  currentOpenNote: null,
};

export const notesReducer: Reducer<NotesState> = (
  state: NotesState,
  action: Action,
  appState: AppState,
): NotesState => {
  let newState = state;
  switch (action.type) {
    case NotesActionType.openNote:
      newState = handleOpenNote(state, action as Action<NoteParams>);
      break;
    case NotesActionType.closeNote:
      newState = handleCloseNote(state, action as Action<NoteParams>);
      break;
    case NotesActionType.addNote:
      newState = handleAddNote(state, action as Action<NoteParams>);
      break;
    case NotesActionType.deleteNote:
      newState = handleDeleteNote(state, action as Action<NoteParams>);
      break;
    case NotesActionType.editNote:
      newState = handleEditNote(state, action as Action<NoteParams>);
      break;
    case DragActionType.isOverNote:
      newState = handleDragIsOverNote(state, action as Action<DragNoteParams>, appState);
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

function handleCloseNote(state: NotesState, action: Action<NoteParams>): NotesState {
  const newOpenNote = action.params.note.id === state.currentOpenNote?.id ? null : state.currentOpenNote;
  return {
    ...state,
    currentOpenNote: newOpenNote,
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
  const newOpenNote = action.params.note.id === state.currentOpenNote?.id ? null : state.currentOpenNote;
  return {
    notes,
    currentOpenNote: newOpenNote,
  };
}

function handleEditNote(state: NotesState, action: Action<NoteParams>): NotesState {
  const notes = withItemReplaced<Note>(state.notes, action.params.note);
  return {
    notes: notes,
    currentOpenNote: action.params.note,
  };
}

function handleDragIsOverNote(
  state: NotesState,
  action: Action<DragNoteParams>,
  appState: AppState
): NotesState {
  const newNotes = state.notes;

  const draggedRank = appState.dragState.noteRank;
  const dropTargetRank = action.params.noteRank;

  [newNotes[draggedRank], newNotes[dropTargetRank]] = [newNotes[dropTargetRank], newNotes[draggedRank]];

  return {
    ...state,
    notes: newNotes,
  };
}
