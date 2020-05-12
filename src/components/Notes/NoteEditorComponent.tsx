import * as React from 'react';
import { connect } from 'react-redux';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding } from 'draft-js';

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
  private textEditorRef: React.RefObject<Editor> = React.createRef();

  state = {
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

  focusEditor = () => {
    this.textEditorRef.current.focus();
  }

  onChangeEditor = (editorState: EditorState) => {
    const newNote = this.props.note.withEditorState(editorState);
    this.props.editNote({ note: newNote });
  }

  onChangeText = (editorState: EditorState) => {
    this.onChangeEditor(editorState);
  }

  onKeyDownText = (event: React.KeyboardEvent<{}>): string => {
    if (event.keyCode === 27) {
      // Pressed escape
      this.textEditorRef.current.blur();
      return 'axle-editor-blur';
    } else if (event.keyCode === 9) {
      // Pressed tab
      const newEditorState = RichUtils.onTab(event, this.props.note.editorState, 4);
      if (newEditorState !== this.props.note.editorState) {
        this.onChangeEditor(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(event);
  }

  handleKeyCommand = (command: string, editorState: EditorState) => {
    const newEditorState = RichUtils.handleKeyCommand(editorState, command);
    if (newEditorState) {
      this.onChangeEditor(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  }

  onClickBold = () => {
    const newEditorState = RichUtils.toggleInlineStyle(this.props.note.editorState, 'BOLD');
    this.onChangeEditor(newEditorState);
  }

  onClickItalicize = () => {
    const newEditorState = RichUtils.toggleInlineStyle(this.props.note.editorState, 'ITALIC');
    this.onChangeEditor(newEditorState);
  }

  onClickUnderline = () => {
    const newEditorState = RichUtils.toggleInlineStyle(this.props.note.editorState, 'UNDERLINE');
    this.onChangeEditor(newEditorState);
  }

  onClickStrikethrough = () => {
    const newEditorState = RichUtils.toggleInlineStyle(this.props.note.editorState, 'STRIKETHROUGH');
    this.onChangeEditor(newEditorState);
  }

  onClickCloseButton = () => {
    this.props.closeNote({ note: this.props.note });
  }

  onClickOrderedList = () => {
    this.onChangeEditor(
      RichUtils.toggleBlockType(this.props.note.editorState, 'ordered-list-item')
    );
  }

  onClickUnorderedList = () => {
    this.onChangeEditor(
      RichUtils.toggleBlockType(this.props.note.editorState, 'unordered-list-item')
    );
  }

  handleMouseDown = (e: any) => {
    e.preventDefault();
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
        <div className="note-editable-text" onClick={this.focusEditor}>
          <Editor
            ref={this.textEditorRef}
            editorState={this.props.note.editorState}
            onChange={this.onChangeText}
            handleKeyCommand={this.handleKeyCommand}
            keyBindingFn={this.onKeyDownText}
          />
          <div className="buttons-container">
            <button onMouseDown={this.handleMouseDown} onClick={this.onClickBold}>Bold</button>
            <button onMouseDown={this.handleMouseDown} onClick={this.onClickItalicize}>Italic</button>
            <button onMouseDown={this.handleMouseDown} onClick={this.onClickUnderline}>Underline</button>
            <button onMouseDown={this.handleMouseDown} onClick={this.onClickStrikethrough}>Strikethrough</button>
            <button onMouseDown={this.handleMouseDown} onClick={this.onClickOrderedList}>OrderedList</button>
            <button onMouseDown={this.handleMouseDown} onClick={this.onClickUnorderedList}>UnorderedList</button>
          </div>
        </div>
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
