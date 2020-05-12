import * as React from 'react';
import { connect } from 'react-redux';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding } from 'draft-js';
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaListUl, FaListOl } from 'react-icons/fa';

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

  onClickCloseButton = () => {
    this.props.closeNote({ note: this.props.note });
  }

  handleMouseDown = (e: React.MouseEvent<{}, MouseEvent>) => {
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

    const onClickEditorButtonFunc = (key: string) => {
      return () => {
        if (['BOLD', 'ITALIC', 'UNDERLINE', 'STRIKETHROUGH'].includes(key)) {
          this.onChangeEditor(
            RichUtils.toggleInlineStyle(note.editorState, key)
          );
        } else {
          this.onChangeEditor(
            RichUtils.toggleBlockType(note.editorState, key)
          );
        }

        const editorFocused = note.editorState.getSelection().getHasFocus();
        if (!editorFocused) {
          this.focusEditor();
        }
      };
    };

    const onClickBold = onClickEditorButtonFunc('BOLD');
    const onClickItalic = onClickEditorButtonFunc('ITALIC');
    const onClickUnderline = onClickEditorButtonFunc('UNDERLINE');
    const onClickStrikethrough = onClickEditorButtonFunc('STRIKETHROUGH');
    const onClickOrderedList = onClickEditorButtonFunc('ordered-list-item');
    const onClickUnorderedList = onClickEditorButtonFunc('unordered-list-item');

    const blockType: string = RichUtils.getCurrentBlockType(note.editorState);
    const inlineStyle = note.editorState.getCurrentInlineStyle();

    const boldActive = inlineStyle.contains('BOLD');
    const italicActive = inlineStyle.contains('ITALIC');
    const underlineActive = inlineStyle.contains('UNDERLINE');
    const strikethroughActive = inlineStyle.contains('STRIKETHROUGH');
    const orderedListActive = blockType === 'ordered-list-item';
    const unorderedListActive = blockType === 'unordered-list-item';

    const editorButtonClass = (active: boolean) => {
      return 'editor-button' + (active ? ' active': '');
    };

    const editorFocused = note.editorState.getSelection().getHasFocus();

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
        <div className="note-editable-text">
          <Editor
            ref={this.textEditorRef}
            editorState={note.editorState}
            onChange={this.onChangeText}
            handleKeyCommand={this.handleKeyCommand}
            keyBindingFn={this.onKeyDownText}
          />
          <div
            className={'editor-buttons-container' + (editorFocused ? '' : ' hidden')}
            onMouseDown={this.handleMouseDown}
          >
            <FaBold className={editorButtonClass(boldActive)} onClick={onClickBold}/>
            <FaItalic className={editorButtonClass(italicActive)} onClick={onClickItalic}/>
            <FaUnderline className={editorButtonClass(underlineActive)} onClick={onClickUnderline}/>
            <FaStrikethrough className={editorButtonClass(strikethroughActive)} onClick={onClickStrikethrough}/>
            <div className="editor-buttons-divider"/>
            <FaListOl className={editorButtonClass(orderedListActive)} onClick={onClickOrderedList}/>
            <FaListUl className={editorButtonClass(unorderedListActive)} onClick={onClickUnorderedList}/>
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
