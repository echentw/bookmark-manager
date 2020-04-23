import * as React from 'react';
import { connect } from 'react-redux';
import { FaPen, FaTrash } from 'react-icons/fa';

import { AppState } from 'reduxStore';
import { Note } from 'models/Note';
import { HoverableContainerComponent } from 'components/HoverableContainerComponent';
import * as NotesActions from 'actions/NotesActions';
import { NoteParams } from 'actions/NotesActions';


interface ExternalProps {
  note: Note;
  hovering: boolean;
}

interface InternalProps extends ExternalProps {
  openNote: (params: NoteParams) => void;
}

class NotePreviewComponent extends React.Component<InternalProps> {
  render() {
    const maybeButtonsComponent = this.props.hovering ? (
      <div className="note-buttons-container">
        <FaPen className="note-button"/>
        <FaTrash className="note-button"/>
      </div>
    ) : null;

    let classes = 'note';
    if (this.props.hovering) {
      classes += ' with-shadow';
    }

    const firstThreeLines = this.props.note.text.split(/\n+/).slice(0, 3);

    const lineElements = firstThreeLines.map(line => (
      <div key={line} className="note-preview-text-line">
        { line }
      </div>
    ));

    return (
      <HoverableContainerComponent
        className={classes}
        itemId={this.props.note.id}
        onClick={() => this.props.openNote({ note: this.props.note })}
      >
        <div className="note-name-and-buttons-container">
          <div className="note-name">
            { this.props.note.name }
          </div>
          { maybeButtonsComponent }
        </div>
        <div className="note-preview-text">
          { lineElements }
        </div>
      </HoverableContainerComponent>
    );
  }
}

const mapStateToProps = (state: AppState, props: ExternalProps) => {
  return {};
};

const mapActionsToProps = {
  openNote: NotesActions.openNote,
};

const Component = connect(mapStateToProps, mapActionsToProps)(NotePreviewComponent);
export { Component as NotePreviewComponent };
