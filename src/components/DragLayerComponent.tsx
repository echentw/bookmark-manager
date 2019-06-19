import * as React from 'react';
import { DragLayerMonitor, useDragLayer, XYCoord } from 'react-dnd';

import { AppState } from './AppComponent';
import { InnerLinkComponent } from './LinkComponent';

interface Props {
  state: AppState;
}

interface CollectedProps {
  isDragging: boolean;
  currentOffset?: XYCoord;
  item: { type: string, id: string },
}

const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

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
}

export function DragLayerComponent(props: Props) {
  const { isDragging, currentOffset, item }: CollectedProps = useDragLayer(
    (monitor: DragLayerMonitor) => ({
      isDragging: !!monitor.isDragging(),
      currentOffset: monitor.getSourceClientOffset(),
      item: monitor.getItem(),
    })
  );

  let dragPreviewComponent: React.ReactElement = null;

  if (isDragging) {
    const linkId = item.id;
    const link = props.state.links.find((link) => link.id === linkId);

    dragPreviewComponent = (
      <InnerLinkComponent
        link={link}
        focused={false}
        isDragging={false}
      />
    );
  }

  return (
    <div className="drag-layer" style={layerStyles}>
      <div className="drag-layer-item" style={itemStyles(currentOffset)}>
        { dragPreviewComponent }
      </div>
    </div>
  );
}
