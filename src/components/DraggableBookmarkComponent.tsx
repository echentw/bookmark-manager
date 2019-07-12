import * as React from 'react';
import { useDrag } from 'react-dnd';
import { connect } from 'react-redux';

import { Bookmark } from '../Bookmark';
import * as DragDropActions from '../actions/DragDropActions';
import { DragDropParams } from '../actions/DragDropActions';
import { AppState } from './AppComponent';
import { DraggableTypes } from './AppComponent';
import { BookmarkComponent } from './BookmarkComponent';

interface ExternalProps {
  bookmark: Bookmark;
  editing: boolean;
  rank: number;
}

interface InternalProps extends ExternalProps {
  editingBookmarkId: string | null;
  beginDrag: (params: DragDropParams) => void;
  endDrag: (params: DragDropParams) => void;
}

function DraggableBookmarkComponent(props: InternalProps) {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: DraggableTypes.Bookmark,
      id: props.bookmark.id,
    },
    canDrag: monitor => props.bookmark.id !== props.editingBookmarkId,
    begin: monitor => {
      props.beginDrag({ rank: props.rank });
      return;
    },
    end: monitor => {
      props.endDrag({ rank: props.rank });
      return;
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  return (
    <div ref={drag}>
      <BookmarkComponent
        bookmark={props.bookmark}
        editing={props.editing}
        isDragging={isDragging}
      />
    </div>
  );
}

const mapStateToProps = (state: AppState, props: ExternalProps) => {
  return {
    editingBookmarkId: state.editBookmarkState.editingBookmarkId,
  };
};

const mapActionsToProps = {
  beginDrag: DragDropActions.beginDrag,
  endDrag: DragDropActions.endDrag,
};

const Component = connect(mapStateToProps, mapActionsToProps)(DraggableBookmarkComponent);
export { Component as DraggableBookmarkComponent };