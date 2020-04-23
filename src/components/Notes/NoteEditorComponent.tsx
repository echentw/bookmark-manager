import * as React from 'react';
import { connect } from 'react-redux';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

import { NoteParams } from 'actions/NotesActions';
import * as NotesActions from 'actions/NotesActions';
import { AppState } from 'reduxStore';
import { Note } from 'models/Note';
import { CloseButtonComponent } from 'components/CloseButtonComponent';


interface Props {
  note: Note;
  closeNote: (params: NoteParams) => void;
  editNote: (params: NoteParams) => void;
}

interface State {
  hovering: boolean;
}

class NoteEditorComponent extends React.Component<Props, State> {

  state: State = {
    hovering: false,
  };

  onMouseOver = () => {
    this.setState({ hovering: true });
  }

  onMouseLeave = () => {
    this.setState({ hovering: false });
  }

  onChangeName = (event: ContentEditableEvent) => {
    const newNote = this.props.note.withName(event.target.value);
    this.props.editNote({ note: newNote });
  }

  onChangeText = (event: ContentEditableEvent) => {
    const newNote = this.props.note.withText(event.target.value);
    this.props.editNote({ note: newNote });
  }

  onClickCloseButton = () => {
    this.props.closeNote({ note: this.props.note });
  }

  render() {
    const { note } = this.props;

    const maybeCloseButton = this.state.hovering ? (
      <CloseButtonComponent onClick={this.onClickCloseButton}/>
    ) : null;

    return (
      <div className="note-editor"
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
      >
        <ContentEditable
          className="note-name"
          html={note.name}
          disabled={false}
          onChange={this.onChangeName}
        />
        <ContentEditable
          className="note-editable-text"
          html={note.text}
          disabled={false} onChange={this.onChangeText}
        />
        { maybeCloseButton }
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {};
};

const mapActionsToProps = {
  closeNote: NotesActions.closeNote,
  editNote: NotesActions.editNote,
};

const Component = connect(mapStateToProps, mapActionsToProps)(NoteEditorComponent);
export { Component as NoteEditorComponent };
