import * as React from 'react';
import { DragLayerMonitor, useDragLayer, XYCoord } from 'react-dnd';

import { Bookmark } from '../Bookmark';
import { BookmarkComponent } from './BookmarkComponent';
import { AppState } from './AppComponent';

interface Props {
  bookmarks: Bookmark[],
}

interface CollectedProps {
  isDragging: boolean;
  currentOffset?: XYCoord;
  item: { type: string, id: string },
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
    const bookmarkId = item.id;
    const bookmark = props.bookmarks.find((bookmark) => bookmark.id === bookmarkId);

    dragPreviewComponent = (
      <div className="drag-layer-item" style={itemStyles(currentOffset)}>
        <BookmarkComponent
          bookmark={bookmark}
          editing={false}
          isDragging={false}
          isDragPreview={true}
          rank={-1}
        />
      </div>
    );
  }

  return (
    <div className="drag-layer">
      { dragPreviewComponent }
    </div>
  );
}
