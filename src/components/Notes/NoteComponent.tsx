import * as React from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';

import { Note } from 'Note';
import { HoverableContainerComponent } from 'components/HoverableContainerComponent';


interface Props {
  note: Note;
  hovering: boolean;
}

export class NoteComponent extends React.Component<Props> {
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
      <div className="note-preview-text-line">
        { line }
      </div>
    ));

    return (
      <HoverableContainerComponent className={classes} itemId={this.props.note.id}>
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
