import * as React from 'react';
import { useDrag, DragPreviewImage, DragSourceMonitor } from 'react-dnd';

import { Bookmark } from 'models/Bookmark';

interface Props {
  beginDrag: () => void;
  endDrag: (trueDrop: boolean) => void;
  children: React.ReactElement;
  draggable: boolean;
  draggableType: string;
}

export function isDragSourceContainerProps(props: any): props is Props {
  return (props as Props).beginDrag !== undefined;
}

// Returns true if the component should NOT re-render.
// Returns false if the component should re-render.
export function propsDidNotChange(prevProps: Props, nextProps: Props): boolean {
  const ownPropsSame: boolean = (
    prevProps.draggable === nextProps.draggable &&
    prevProps.draggableType === nextProps.draggableType
  );

  const prevChildProps: any = prevProps.children.props;
  const nextChildProps: any = nextProps.children.props;

  let childPropsSame: boolean = true;
  Object.entries(prevChildProps).forEach(([key, prevValue]) => {
    const nextValue = nextChildProps[key];
    if (prevValue instanceof Bookmark) {
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

export const DragSourceContainerComponent = React.memo((props: Props) => {
  const [, drag, preview] = useDrag({
    item: { type: props.draggableType },
    begin: () => {
      props.beginDrag();
      return;
    },
    end: (dropResult: number, monitor: DragSourceMonitor) => {
      props.endDrag(monitor.didDrop());
      return;
    },
    canDrag: () => props.draggable,
  });

  const emptyImageSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

  return (
    <div ref={drag}>
      <DragPreviewImage connect={preview} src={emptyImageSrc}/>
      { props.children }
    </div>
  );
}, propsDidNotChange);
