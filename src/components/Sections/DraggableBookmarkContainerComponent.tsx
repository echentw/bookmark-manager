import * as React from 'react';
import { useDrag, useDrop, DragPreviewImage, DragSourceMonitor } from 'react-dnd';
import { connect } from 'react-redux';

import { Bookmark } from 'Bookmark';
import { Folder } from 'Folder';
import { AppState } from 'reduxStore';
import * as DragBookmarkActions from 'actions/DragBookmarkActions';
import { DragBookmarkParams, DropBookmarkParams } from 'actions/DragBookmarkActions';
import * as HoverActions from 'actions/HoverActions';
import { HoverParams } from 'actions/HoverActions';
import { DraggableType } from 'components/AppComponent';

interface ExternalProps {
  id: string;
  folderRank: number;
  bookmarkRank: number;
  draggable: boolean;
  children: React.ReactElement;
}

interface InternalProps extends ExternalProps {
  beginDrag: (params: DragBookmarkParams) => void;
  endDrag: (params: DropBookmarkParams) => void;
  exitHover: (params: HoverParams) => void;
  isOver: (params: DragBookmarkParams) => void;
}

// Returns true if the component should NOT re-render.
// Returns false if the component should re-render.
function isSame(prevProps: ExternalProps, nextProps: ExternalProps): boolean {
  const ownPropsSame: boolean = (
    prevProps.id === nextProps.id &&
    prevProps.folderRank === nextProps.folderRank &&
    prevProps.bookmarkRank === nextProps.bookmarkRank &&
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
      } else {
      }
    } else {
      if (prevValue !== nextValue) {
        childPropsSame = false;
      }
    }
  });

  return ownPropsSame && childPropsSame;
}

const DraggableBookmarkContainerComponent = React.memo((props: InternalProps) => {

  const [, drag, preview] = useDrag({
    item: {
      type: DraggableType.Bookmark,
      id: props.id,
    },
    begin: () => {
      console.log('dragging', props.id);
      props.beginDrag({
        folderRank: props.folderRank,
        bookmarkRank: props.bookmarkRank,
      });
      return;
    },
    end: (dropResult: number, monitor: DragSourceMonitor) => {
      props.endDrag({
        folderRank: props.folderRank,
        bookmarkRank: props.bookmarkRank,
        trueDrop: monitor.didDrop(),
      });
      return;
    },
    canDrag: () => props.draggable,
  });

	const [, drop] = useDrop({
		accept: DraggableType.Bookmark,
		collect: monitor => {
      if (monitor.isOver()) {
        props.isOver({
          folderRank: props.folderRank,
          bookmarkRank: props.bookmarkRank,
        });
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
}, isSame);

const mapStateToProps = (state: AppState, props: ExternalProps) => {
  return {};
};

const mapActionsToProps = {
  beginDrag: DragBookmarkActions.begin,
  endDrag: DragBookmarkActions.end,
  exitHover: HoverActions.exit,
  isOver: DragBookmarkActions.isOver,
};

const Component = connect(mapStateToProps, mapActionsToProps)(DraggableBookmarkContainerComponent);
export { Component as DraggableBookmarkContainerComponent };
