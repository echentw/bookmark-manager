import * as React from 'react';
import { connect } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import ContentEditable from 'react-contenteditable';
import { Editor, EditorState } from 'draft-js';

import { AppState } from 'reduxStore';
import { Note } from 'models/Note';
import { HoverableContainerComponent } from 'components/HoverableContainerComponent';
import * as NotesActions from 'actions/NotesActions';
import { NoteParams } from 'actions/NotesActions';


interface ExternalProps {
  note: Note;
  dragging: boolean;
  hovering: boolean;
  isDragPreview?: boolean;
}

interface InternalProps extends ExternalProps {
  openNote: (params: NoteParams) => void;
  deleteNote: (params: NoteParams) => void;
}

class NotePreviewComponent extends React.Component<InternalProps> {
  onClickDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    this.props.deleteNote({ note: this.props.note });
  }

  render() {
    const { note, dragging, hovering, isDragPreview } = this.props;
    const shouldShowButtons = hovering || isDragPreview;
    const shouldShowBoxShadow = shouldShowButtons;

    const maybeButtonsComponent = shouldShowButtons ? (
      <div className="note-buttons-container" onClick={this.onClickDelete}>
        <FaTrash className="note-button"/>
      </div>
    ) : null;

    let classes = 'note';
    if (dragging) {
      classes += ' vanished';
    }
    if (shouldShowBoxShadow) {
      classes += ' with-shadow';
    }

    const editorState = EditorState.createWithContent(this.props.note.editorState.getCurrentContent());

    return (
      <HoverableContainerComponent
        className={classes}
        itemId={this.props.note.id}
        onClick={() => this.props.openNote({ note: this.props.note })}
      >
        <div className="note-name-and-buttons-container">
          <ContentEditable
            className="note-name"
            html={this.props.note.name}
            disabled={true}
            onChange={() => {}}
          />
          { maybeButtonsComponent }
        </div>
        <div className="note-preview-text">
          <Editor
            editorState={editorState}
            readOnly={true}
            onChange={() => {}}
          />
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
  deleteNote: NotesActions.deleteNote,
};

const Component = connect(mapStateToProps, mapActionsToProps)(NotePreviewComponent);
export { Component as NotePreviewComponent };
