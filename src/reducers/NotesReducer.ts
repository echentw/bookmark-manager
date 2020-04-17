import { Note } from 'models/Note';
import { Action, NotesActionType as ActionType } from 'actions/constants';
import { NoteParams } from 'actions/NotesActions'
import { AppState } from 'reduxStore';
import { Reducer } from 'reducers/Reducer';

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
      // TODO: implement me!
      throw new Error('unimplemented!');
      break;
    case ActionType.deleteNote:
      // TODO: implement me!
      throw new Error('unimplemented!');
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
