import * as React from 'react';
import { useDrag, DragPreviewImage, DragSourceMonitor } from 'react-dnd';
import { connect } from 'react-redux';

import { Bookmark } from '../Bookmark';
import { Folder } from '../Folder';
import * as DragDropActions from '../actions/DragDropActions';
import { DragParams, DropParams } from '../actions/DragDropActions';
import { AppState } from '../reduxStore';
import { DraggableType } from './AppComponent';

import { HoverParams } from '../actions/HoverActions';
import * as HoverActions from '../actions/HoverActions';

interface ExternalProps {
  id: string;
  rank: number;
  draggableType: string;
  draggable: boolean;
  children: React.ReactElement;
}

interface InternalProps extends ExternalProps {
  beginDrag: (params: DragParams) => void;
  endDrag: (params: DropParams) => void;
  exitHover: (params: HoverParams) => void;
}

function DraggableListItemContainerComponent(props: InternalProps) {
  const [_, drag, preview] = useDrag({
    item: {
      type: props.draggableType,
      id: props.id,
    },
    begin: () => {
      props.beginDrag({ rank: props.rank });
      return;
    },
    end: (dropResult: number, monitor: DragSourceMonitor) => {
      props.endDrag({
        rank: props.rank,
        trueDrop: monitor.didDrop(),
      });
      return;
    },
    canDrag: () => props.draggable,
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

const Component = connect(mapStateToProps, mapActionsToProps)(DraggableListItemContainerComponent);
export { Component as DraggableListItemContainerComponent };
