import * as React from 'react';
import { useDrag, DragPreviewImage } from 'react-dnd';
import { connect } from 'react-redux';

import { Bookmark } from '../Bookmark';
import { Folder } from '../Folder';
import * as DragDropActions from '../actions/DragDropActions';
import { DragDropParams } from '../actions/DragDropActions';
import { AppState } from '../reduxStore';
import { DraggableType } from './AppComponent';

import { HoverParams } from '../actions/HoverActions';
import * as HoverActions from '../actions/HoverActions';

interface ExternalProps {
  id: string;
  draggableType: string;
  rank: number;
  children: React.ReactElement;
}

interface InternalProps extends ExternalProps {
  beginDrag: (params: DragDropParams) => void;
  endDrag: (params: DragDropParams) => void;
  exitHover: (params: HoverParams) => void;
}

function DraggableListItemWrapperComponent(props: InternalProps) {
  const [{ isDragging }, drag, preview] = useDrag({
    item: {
      type: props.draggableType,
      id: props.id,
    },
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

  const emptyImageSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

  return (
    <div>
      <DragPreviewImage connect={preview} src={emptyImageSrc}/>
      <div ref={drag}>
        { props.children }
      </div>
    </div>
  );
}

const mapStateToProps = (state: AppState, props: ExternalProps) => {
  return {};
};

const mapActionsToProps = {
  beginDrag: DragDropActions.beginDrag,
  endDrag: DragDropActions.endDrag,
  exitHover: HoverActions.exit,
};

const Component = connect(mapStateToProps, mapActionsToProps)(DraggableListItemWrapperComponent);
export { Component as DraggableListItemWrapperComponent };
