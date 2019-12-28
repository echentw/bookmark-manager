import * as React from 'react';
import { useDrag, useDrop, DragPreviewImage, DragSourceMonitor } from 'react-dnd';
import { connect } from 'react-redux';

import { Bookmark } from 'Bookmark';
import { Folder } from 'Folder';
import { AppState } from 'reduxStore';
import * as DragDropActions from 'actions/DragDropActions';
import { DragParams, DropParams } from 'actions/DragDropActions';
import * as HoverActions from 'actions/HoverActions';
import { HoverParams } from 'actions/HoverActions';

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
  isOver: (params: DragParams) => void;
}

// Returns true if the component should NOT re-render.
// Returns false if the component should re-render.
function isSame(prevProps: ExternalProps, nextProps: ExternalProps): boolean {
  const ownPropsSame: boolean = (
    prevProps.id === nextProps.id &&
    prevProps.rank === nextProps.rank &&
    prevProps.draggableType === nextProps.draggableType &&
    prevProps.draggable === nextProps.draggable
  );

  const prevChildProps: any = prevProps.children.props;
  const nextChildProps: any = nextProps.children.props;

  let childPropsSame: boolean = true;
  Object.entries(prevChildProps).forEach(([key, prevValue]) => {
    const nextValue = nextChildProps[key];
    if (prevValue instanceof Bookmark || prevValue instanceof Folder) {
      if (!prevValue.equals(nextValue)) {
        childPropsSame = false;
      }
    } else {
      if (prevValue !== nextValue) {
        childPropsSame = false;
      }
    }
  });

  return ownPropsSame && childPropsSame;
}

const DragDropListItemContainerComponent = React.memo((props: InternalProps) => {

  const [, drag, preview] = useDrag({
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
  });

	const [, drop] = useDrop({
		accept: props.draggableType,
		collect: monitor => {
      if (monitor.isOver()) {
        props.isOver({ rank: props.rank });
      }
      return {};
		},
	});

  const emptyImageSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

  return (
    <div className="list-item-container" ref={drop}>
      <DragPreviewImage connect={preview} src={emptyImageSrc}/>
      <div ref={drag}>
        { props.children }
      </div>
    </div>
  );
// });
}, isSame);

const mapStateToProps = (state: AppState, props: ExternalProps) => {
  return {};
};

const mapActionsToProps = {
  beginDrag: DragDropActions.beginDrag,
  endDrag: DragDropActions.endDrag,
  exitHover: HoverActions.exit,
  isOver: DragDropActions.isOver,
};

const Component = connect(mapStateToProps, mapActionsToProps)(DragDropListItemContainerComponent);
export { Component as DragDropListItemContainerComponent };
