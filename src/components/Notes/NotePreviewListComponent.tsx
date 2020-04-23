import * as React from 'react';
import { connect } from 'react-redux';

import { AppState } from 'reduxStore';
import { Note } from 'models/Note';
import { NotePreviewComponent } from 'components/Notes/NotePreviewComponent';
import * as PlusIcon from 'assets/plus_icon.svg';


class AddNoteButtonComponent extends React.Component {
  render() {
    return (
      <div className="add-note-button">
        <img src={PlusIcon} className="add-note-icon"/>
      </div>
    );
  }
}

interface Props {
  hoverItemId: string | null;
  notes: Note[];
}

class NotePreviewListComponent extends React.Component<Props> {
  render() {
    const noteComponents = this.props.notes.map(note => {
      return (
        <div key={note.id} className="note-container">
          <NotePreviewComponent
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
    notes: state.notesState.notes,
  };
};

const mapActionsToProps = {};

const Component = connect(mapStateToProps, mapActionsToProps)(NotePreviewListComponent);
export { Component as NotePreviewListComponent };
