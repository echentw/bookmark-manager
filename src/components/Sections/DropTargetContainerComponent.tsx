import * as React from 'react';
import { useDrop } from 'react-dnd';

interface Props {
  className: string;
  isOver: () => void;
  draggableType: string;
  children: React.ReactElement;
}

export const DropTargetContainerComponent = React.memo((props: Props) => {
	const [, drop] = useDrop({
		accept: props.draggableType,
		collect: monitor => {
      if (monitor.isOver()) {
        props.isOver();
      }
      return {};
		},
	});

  return (
    <div className={props.className} ref={drop}>
      { props.children }
    </div>
  );
});
