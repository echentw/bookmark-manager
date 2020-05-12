import * as React from 'react';
import { connect } from 'react-redux';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { Editor, EditorState, RichUtils, KeyBindingUtil, getDefaultKeyBinding } from 'draft-js';
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaListUl, FaListOl } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';

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
    } else if (event.keyCode === 88 && event.shiftKey && KeyBindingUtil.hasCommandModifier(event)) {
      // ctrl (windows) / cmd (mac) + shift + 'X'
      this.toggleStrikethrough();
      return 'axle-editor-strikethrough';
    } else if (event.keyCode === 55 && event.shiftKey && KeyBindingUtil.hasCommandModifier(event)) {
      // ctrl (windows) / cmd (mac) + shift + '7'
      this.toggleOrderedList();
      return 'axle-editor-ordered-list';
    } else if (event.keyCode === 56 && event.shiftKey && KeyBindingUtil.hasCommandModifier(event)) {
      // ctrl (windows) / cmd (mac) + shift + '8'
      this.toggleUnorderedList();
      return 'axle-editor-unordered-list';
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

  private getToggleEditorStyleFunc = (key: string) => {
    return () => {
      const { editorState } = this.props.note;
      if (['BOLD', 'ITALIC', 'UNDERLINE', 'STRIKETHROUGH'].includes(key)) {
        this.onChangeEditor(
          RichUtils.toggleInlineStyle(editorState, key)
        );
      } else {
        this.onChangeEditor(
          RichUtils.toggleBlockType(editorState, key)
        );
      }

      const editorFocused = editorState.getSelection().getHasFocus();
      if (!editorFocused) {
        this.focusEditor();
      }
    };
  }

  toggleBold = this.getToggleEditorStyleFunc('BOLD');
  toggleItalic = this.getToggleEditorStyleFunc('ITALIC');
  toggleUnderline = this.getToggleEditorStyleFunc('UNDERLINE');
  toggleStrikethrough = this.getToggleEditorStyleFunc('STRIKETHROUGH');
  toggleOrderedList = this.getToggleEditorStyleFunc('ordered-list-item');
  toggleUnorderedList = this.getToggleEditorStyleFunc('unordered-list-item');

  render() {
    const { note } = this.props;

    const maybeCloseButton = this.state.hovering ? (
      <CloseButtonComponent
        onClick={this.onClickCloseButton}
        minus={true}
      />
    ) : null;

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

    const commandModifier = window.navigator.platform.toLowerCase().includes('mac')
      ? String.fromCharCode(0x02318)
      : 'Ctrl';

    const boldTooltipText = `Bold (${commandModifier} + B)`;
    const italicTooltipText = `Italics (${commandModifier} + I)`;
    const underlineTooltipText = `Underline (${commandModifier} + U)`;
    const strikethroughTooltipText = `Strikethrough (${commandModifier} + Shift + X)`;
    const orderedListTooltipText = `Numbered list (${commandModifier} + Shift + 7)`;
    const unorderedListTooltipText = `Bulleted list (${commandModifier} + Shift + 8)`;

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
        <div className="note-editable-text-container">
          <div className="note-editable-text">
            <Editor
              ref={this.textEditorRef}
              editorState={note.editorState}
              onChange={this.onChangeText}
              handleKeyCommand={this.handleKeyCommand}
              keyBindingFn={this.onKeyDownText}
            />
          </div>
          <div
            className={'editor-buttons-container' + (editorFocused ? '' : ' hidden')}
            onMouseDown={this.handleMouseDown}
          >
            <FaBold
              className={editorButtonClass(boldActive)}
              onClick={this.toggleBold}
              data-tip data-for='tooltip-bold'
            />
            <FaItalic
              className={editorButtonClass(italicActive)}
              onClick={this.toggleItalic}
              data-tip data-for='tooltip-italic'
            />
            <FaUnderline
              className={editorButtonClass(underlineActive)}
              onClick={this.toggleUnderline}
              data-tip data-for='tooltip-underline'
            />
            <FaStrikethrough
              className={editorButtonClass(strikethroughActive)}
              onClick={this.toggleStrikethrough}
              data-tip data-for='tooltip-strikethrough'
            />
            <div className="editor-buttons-divider"/>
            <FaListOl
              className={editorButtonClass(orderedListActive)}
              onClick={this.toggleOrderedList}
              data-tip data-for='tooltip-orderedlist'
            />
            <FaListUl
              className={editorButtonClass(unorderedListActive)}
              onClick={this.toggleUnorderedList}
              data-tip data-for='tooltip-unorderedlist'
            />
            <ReactTooltip id='tooltip-bold' effect='solid'>{ boldTooltipText }</ReactTooltip>
            <ReactTooltip id='tooltip-italic' effect='solid'>{ italicTooltipText }</ReactTooltip>
            <ReactTooltip id='tooltip-underline' effect='solid'>{ underlineTooltipText }</ReactTooltip>
            <ReactTooltip id='tooltip-strikethrough' effect='solid'>{ strikethroughTooltipText }</ReactTooltip>
            <ReactTooltip id='tooltip-orderedlist' effect='solid'>{ orderedListTooltipText }</ReactTooltip>
            <ReactTooltip id='tooltip-unorderedlist' effect='solid'>{ unorderedListTooltipText }</ReactTooltip>
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
