import * as React from 'react';
import { useDrop } from 'react-dnd';

import { DraggableTypes } from './AppComponent';

interface Props {
  children: React.ReactElement;
}

export function LinkContainerComponent(props: Props) {
	const [{ isOver }, drop] = useDrop({
		accept: DraggableTypes.LINK,
		drop: () => { console.log('drop function called') },
		collect: monitor => {
      console.log('collect function called');
      console.log('isOver', !!monitor.isOver());
      return {
			  isOver: !!monitor.isOver(),
      };
		},
	})

  return (
    <div className="link-container" ref={drop}>
      { props.children }
    </div>
  );
}
