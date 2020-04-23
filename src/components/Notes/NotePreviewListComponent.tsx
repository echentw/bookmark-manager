import * as React from 'react';
import { connect } from 'react-redux';

import { AppState } from 'reduxStore';
import { Note } from 'models/Note';
import { NotePreviewComponent } from 'components/Notes/NotePreviewComponent';
import { AddNoteButtonComponent } from 'components/Notes/AddNoteButtonComponent';
import { DropTargetContainerComponent } from 'components/DropTargetContainerComponent';
import { DragSourceContainerComponent } from 'components/DragSourceContainerComponent';
import { DraggableType } from 'components/AppComponent';
import * as DragActions from 'actions/DragActions';
import { DragNoteParams, DropParams } from 'actions/DragActions';


interface Props {
  hoverItemId: string | null;
  notes: Note[];
  draggedNoteRank: number | null;

  beginDragNote: (params: DragNoteParams) => void;
  isOverNote: (params: DragNoteParams) => void;
  endDrag: (params: DropParams) => void;
}

class NotePreviewListComponent extends React.Component<Props> {
  render() {
    const noteComponents = this.props.notes.map((note: Note, rank: number) => {
      const dragging = rank === this.props.draggedNoteRank;
      const hovering = note.id === this.props.hoverItemId;

      if (rank === 5) {
        console.log('note at rank 5:', note);
      }

      if (rank === 3) {
        console.log('note at rank 3:', note);
      }

      return (
        <div className="note-container" key={note.id}>
          <DropTargetContainerComponent
            className="note-drop-container"
            draggableType={DraggableType.Note}
            isOver={() =>
              this.props.isOverNote({
                noteRank: rank,
              })
            }
            rerenderProps={[note, dragging, hovering, rank]}
          >
            <DragSourceContainerComponent
              draggableType={DraggableType.Note}
              beginDrag={() =>
                this.props.beginDragNote({
                  noteRank: rank,
                })
              }
              endDrag={(trueDrop: boolean) => this.props.endDrag({ trueDrop })}
              draggable={true}
            >
              <NotePreviewComponent
                note={note}
                dragging={dragging}
                hovering={hovering}
              />
            </DragSourceContainerComponent>
          </DropTargetContainerComponent>
        </div>
      );
    });

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

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    hoverItemId: state.hoverState.hoverItemId,
    notes: state.notesState.notes,
    draggedNoteRank: state.dragState.noteRank,
  };
};

const mapActionsToProps = {
  beginDragNote: DragActions.beginDragNote,
  isOverNote: DragActions.isOverNote,
  endDrag: DragActions.end,
};

const Component = connect(mapStateToProps, mapActionsToProps)(NotePreviewListComponent);
export { Component as NotePreviewListComponent };
