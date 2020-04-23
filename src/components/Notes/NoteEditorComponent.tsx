import * as React from 'react';
import { connect } from 'react-redux';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

import * as NotesActions from 'actions/NotesActions';
import { AppState } from 'reduxStore';
import { Note } from 'models/Note';


interface Props {
  note: Note;
}

class NoteEditorComponent extends React.Component<Props> {

  onChangeName = (event: ContentEditableEvent) => {
    console.log(event.target.value);
  }

  onChangeText = (event: ContentEditableEvent) => {
    console.log(event.target.value);
  }

  render() {
    const { note } = this.props;
    return (
      <div className="note-editor">
        <ContentEditable
          className="note-name"
          html={note.name}
          disabled={false}
          onChange={this.onChangeName}
        />
        <ContentEditable
          className="note-editable-text"
          html={note.text}
          disabled={false}
          onChange={this.onChangeText}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {};
};

const mapActionsToProps = {};

const Component = connect(mapStateToProps, mapActionsToProps)(NoteEditorComponent);
export { Component as NoteEditorComponent };
