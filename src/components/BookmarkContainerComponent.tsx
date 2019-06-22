import * as React from 'react';
import { useDrop } from 'react-dnd';

import { DragDropService, DraggableTypes } from './AppComponent';

interface Props {
  children: React.ReactElement;
  dragDropService: DragDropService;
  rank: number;
}

export function BookmarkContainerComponent(props: Props) {
	const [{ isOver }, drop] = useDrop({
		accept: DraggableTypes.LINK,
		collect: monitor => {
      const isOver = !!monitor.isOver();
      if (isOver) {
        props.dragDropService.isOver(props.rank);
      }
      return { isOver };
		},
	});

  return (
    <div className="bookmark-container" ref={drop}>
      { props.children }
    </div>
  );
}
