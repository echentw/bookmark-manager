import * as React from 'react';
import { DragLayerMonitor, useDragLayer, XYCoord } from 'react-dnd';

import { Bookmark } from '../Bookmark';
import { BookmarkComponent } from './BookmarkComponent';
import { AppState } from '../reduxStore';

interface Props {
  children: React.ReactElement;
}

interface CollectedProps {
  currentOffset?: XYCoord;
}

const itemStyles = (currentOffset?: XYCoord): React.CSSProperties => {
  if (!currentOffset) {
    return {
      display: 'none',
    }
  }
  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform: transform,
    WebkitTransform: transform,
  }
};

export function DragLayerComponent(props: Props) {
  const { currentOffset }: CollectedProps = useDragLayer(
    (monitor: DragLayerMonitor) => ({
      currentOffset: monitor.getSourceClientOffset(),
    })
  );

  return (
    <div className="drag-layer">
      <div className="drag-layer-item" style={itemStyles(currentOffset)}>
        { props.children }
      </div>
    </div>
  );
}
