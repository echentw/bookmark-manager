import * as React from 'react';
import { connect } from 'react-redux';

import { AppState } from 'reduxStore';
import { Note } from 'Note';
import { NoteComponent } from 'components/Notes/NoteComponent';


class AddNoteButtonComponent extends React.Component {
  render() {
    return (
      <div className="add-note-button">
        This is the button.
      </div>
    );
  }
}

interface Props {
  hoverItemId: string | null;
}

class NotesListComponent extends React.Component<Props> {
  render() {
    const notes: Note[] = [];
    for (let i = 0; i < 10; ++i) {
      notes.push(
        new Note({
          id: `note-id-${i}`,
          name: `Note ${i}`,
          text: [
            'This is a preview of the note.',
            'This is the second line of the preview. And more text here.',
            'Third line gg yy of the note.',
            'Another line, the fourth!',
            'Hopefully this line will ensure that the text preview goes overflow.',
          ].join('\n\n'),
        })
      );
    }

    const noteComponents = notes.map(note => {
      return (
        <div className="note-container">
          <NoteComponent
            note={note}
            hovering={this.props.hoverItemId === note.id}
          />
        </div>
      );
    });

    return (
      <div className="notes-list">
        { noteComponents }
        <div className="note-container">
          <AddNoteButtonComponent/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    hoverItemId: state.hoverState.hoverItemId,
  };
};

const mapActionsToProps = {};

const Component = connect(mapStateToProps, mapActionsToProps)(NotesListComponent);
export { Component as NotesListComponent };
