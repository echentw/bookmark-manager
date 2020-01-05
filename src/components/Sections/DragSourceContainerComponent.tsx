import * as React from 'react';

import { useDrag, DragPreviewImage, DragSourceMonitor } from 'react-dnd';

interface Props {
  beginDrag: () => void;
  endDrag: (trueDrop: boolean) => void;
  children: React.ReactElement;
  draggable: boolean;
  draggableType: string;
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
});
