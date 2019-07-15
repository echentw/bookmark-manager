import * as React from 'react';
import { DragLayerMonitor, useDragLayer, XYCoord } from 'react-dnd';
import { connect } from 'react-redux';

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

function DragLayerComponent(props: Props) {
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
      <BookmarkComponent
        bookmark={bookmark}
        editing={false}
        isDragging={false}
        isDragPreview={true}
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

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    bookmarks: state.bookmarksState.bookmarks,
  };
};

const Component = connect(mapStateToProps)(DragLayerComponent);
export { Component as DragLayerComponent };
