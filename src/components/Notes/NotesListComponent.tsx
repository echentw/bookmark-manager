import * as React from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';


export class NoteComponent extends React.Component {
  maybeButtonsComponent = () => {
    if (true) {
      return (
        <div className="note-buttons-container">
          <FaPen className="note-button"/>
          <FaTrash className="note-button"/>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    const text = [
      'This is a preview of the note.',
      'This is the second line of the preview. And more text here.',
      'Third line gg yy of the note.',
      'Another line, the fourth!',
      'Hopefully this line will ensure that the text preview goes overflow.',
    ].join('\n\n');

    const firstThreeLines = text.split(/\n+/).slice(0, 3);

    const lineElements = firstThreeLines.map(line => (
      <div className="note-preview-text-line">
        { line }
      </div>
    ));

    return (
      <div className="note">
        <div className="note-name-and-buttons-container">
          <div className="note-name">
            Note Name
          </div>
          { this.maybeButtonsComponent() }
        </div>
        <div className="note-preview-text">
          { lineElements }
        </div>
      </div>
    );
  }
}

export class AddNoteButtonComponent extends React.Component {
  render() {
    return (
      <div className="add-note-button">
        This is the button.
      </div>
    );
  }
}

interface Props {
}

export class NotesListComponent extends React.Component<Props> {
  render() {
    const noteComponents: React.ReactElement[] = [];
    for (let i = 0; i < 10; ++i) {
      noteComponents.push(
        <div className="note-container">
          <NoteComponent/>
        </div>
      );
    }

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
