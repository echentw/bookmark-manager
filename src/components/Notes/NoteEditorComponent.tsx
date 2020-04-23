import * as React from 'react';
import { connect } from 'react-redux';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

import * as NotesActions from 'actions/NotesActions';
import { AppState } from 'reduxStore';
import { Note } from 'models/Note';


interface Props {
  note: Note;
}

interface State {
  name: string;
  text: string;
}

class NoteEditorComponent extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      name: props.note.name,
      text: props.note.text,
    };
  }

  onChangeName = (event: ContentEditableEvent) => {
    this.setState({ name: event.target.value });
  }

  onChangeText = (event: ContentEditableEvent) => {
    this.setState({ text: event.target.value });
  }

  render() {
    return (
      <div className="note-editor">
        <ContentEditable
          className="note-name"
          html={this.state.name}
          disabled={false}
          onChange={this.onChangeName}
        />
        <ContentEditable
          className="note-editable-text"
          html={this.state.text}
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
