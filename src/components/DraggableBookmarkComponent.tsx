import * as React from 'react';
import { useDrag, DragPreviewImage } from 'react-dnd';
import { connect } from 'react-redux';

import { Bookmark } from '../Bookmark';
import * as DragDropActions from '../actions/DragDropActions';
import { DragDropParams } from '../actions/DragDropActions';
import { AppState } from './AppComponent';
import { DraggableType } from './AppComponent';
import { BookmarkComponent } from './BookmarkComponent';

import { HoverParams } from '../actions/HoverActions';
import * as HoverActions from '../actions/HoverActions';

interface ExternalProps {
  bookmark: Bookmark;
  dragging: boolean;
  editing: boolean;
  hovering: boolean;
  rank: number;
}

interface InternalProps extends ExternalProps {
  editingBookmarkId: string | null;
  beginDrag: (params: DragDropParams) => void;
  endDrag: (params: DragDropParams) => void;
  exitHover: (params: HoverParams) => void;
}

function DraggableBookmarkComponent(props: InternalProps) {
  const [{ isDragging }, drag, preview] = useDrag({
    item: {
      type: DraggableType.Bookmark,
      id: props.bookmark.id,
    },
    canDrag: monitor => props.bookmark.id !== props.editingBookmarkId,
    begin: monitor => {
      // TODO: fix this please
      props.beginDrag({ rank: props.rank });
      props.exitHover({ rank: props.rank });
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

  const emptyImageSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

  return (
    <div>
      <DragPreviewImage connect={preview} src={emptyImageSrc}/>
      <div ref={drag}>
        <BookmarkComponent
          bookmark={props.bookmark}
          editing={props.editing}
          dragging={props.dragging}
          hovering={props.hovering}
          rank={props.rank}
        />
      </div>
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
  exitHover: HoverActions.exit,
};

const Component = connect(mapStateToProps, mapActionsToProps)(DraggableBookmarkComponent);
export { Component as DraggableBookmarkComponent };
