import * as React from 'react';
import { useDrop } from 'react-dnd';

import { Bookmark } from 'Bookmark';
import { propsDidNotChange as dragSourcePropsDidNotChange, isDragSourceContainerProps, DragSourceContainerComponent } from 'components/Sections/DragSourceContainerComponent';

interface Props {
  className: string;
  isOver: () => void;
  draggableType: string;
  children: React.ReactElement;

  rerenderProps: any[];
}

// Returns true if the component should NOT re-render.
// Returns false if the component should re-render.
function propsDidNotChange(prevProps: Props, nextProps: Props): boolean {
  if (prevProps.className !== nextProps.className) {
    return false;
  }

  const rerenderPropsSame = prevProps.rerenderProps.every((prevProp: any, i: number) => {
    const nextProp = nextProps.rerenderProps[i];
    const same = prevProp instanceof Bookmark ? prevProp.equals(nextProp) : prevProp === nextProp;
    return same;
  });

  return rerenderPropsSame;
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
}, propsDidNotChange);
