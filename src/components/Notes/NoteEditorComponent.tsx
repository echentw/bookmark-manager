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

  private nameRef: React.RefObject<HTMLDivElement> = React.createRef();
  private textRef: React.RefObject<HTMLDivElement> = React.createRef();

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
    // This should get rid of all html tags, i.e. everything that looks like <...>
    const sanitizedName  = event.target.value.replace(/<.*?>/g, '');
    const newNote = this.props.note.withName(sanitizedName);
    this.props.editNote({ note: newNote });
  }

  onKeyDownName = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.keyCode === 13 || event.keyCode === 27) {
      // Pressed enter or escape
      this.nameRef.current.blur();

      // Prevent onChangeName from getting called.
      event.stopPropagation();
    }
  }

  onChangeText = (event: ContentEditableEvent) => {
    const newNote = this.props.note.withText(event.target.value);
    this.props.editNote({ note: newNote });
  }

  onKeyDownText = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.keyCode === 27) {
      // Pressed escape
      this.textRef.current.blur();
    }
  }

  onClickCloseButton = () => {
    this.props.closeNote({ note: this.props.note });
  }

  render() {
    const { note } = this.props;

    const maybeCloseButton = this.state.hovering ? (
      <CloseButtonComponent
        onClick={this.onClickCloseButton}
        minus={true}
      />
    ) : null;

    return (
      <div className="note-editor"
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
      >
        <ContentEditable
          className="note-name"
          html={note.name}
          spellCheck={false}
          disabled={false}
          onChange={this.onChangeName}
          onKeyDown={this.onKeyDownName}
          innerRef={this.nameRef}
        />
        <ContentEditable
          className="note-editable-text"
          html={note.text}
          disabled={false}
          onChange={this.onChangeText}
          onKeyDown={this.onKeyDownText}
          innerRef={this.textRef}
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
