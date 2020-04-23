import * as React from 'react';
import { useDrop } from 'react-dnd';

import { Bookmark } from 'models/Bookmark';
import { Note } from 'models/Note';
import {
  propsDidNotChange as dragSourcePropsDidNotChange,
  isDragSourceContainerProps,
  DragSourceContainerComponent,
} from 'components/DragSourceContainerComponent';

interface Props {
  className: string;
  isOver: () => void;
  draggableType: string;
  children: React.ReactElement | React.ReactElement[];

  // We re-render this component iff these props change or the className changes.
  rerenderProps?: any[];
}

// Returns true if the component should NOT re-render.
// Returns false if the component should re-render.
function propsDidNotChange(prevProps: Props, nextProps: Props): boolean {
  if (prevProps.rerenderProps !== undefined) {
    if (prevProps.className !== nextProps.className) {
      return false;
    }
    const rerenderPropsSame = prevProps.rerenderProps.every((prevProp: any, i: number) => {
      const nextProp = nextProps.rerenderProps[i];
      const same = (prevProp instanceof Bookmark || prevProp instanceof Note) ? prevProp.equals(nextProp) : prevProp === nextProp;
      return same;
    });
    return rerenderPropsSame;
  } else {
    const propsAreSame = Object.entries(prevProps).every(([key, prevValue]) => {
      const nextValue = (nextProps as any)[key];
      return prevValue === nextValue;
    });
    return propsAreSame;
  }
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
