import * as React from 'react';
import { useDrop } from 'react-dnd';
import { connect } from 'react-redux';

import { AppState } from '../reduxStore';
import * as DragDropActions from '../actions/DragDropActions';
import { DragParams } from '../actions/DragDropActions';

interface ExternalProps {
  rank: number;
  draggableType: string;
  children: React.ReactElement;
}

interface InternalProps extends ExternalProps {
  isOver: (params: DragParams) => void;
}

function DroppableListItemContainerComponent(props: InternalProps) {
	const [_, drop] = useDrop({
		accept: props.draggableType,
		collect: monitor => {
      if (monitor.isOver()) {
        props.isOver({ rank: props.rank });
      }
      return {};
		},
	});

  return (
    <div className="list-item-container" ref={drop}>
      { props.children }
    </div>
  );
}

const mapStateToProps = (state: AppState, props: ExternalProps) => {
  return {};
};

const mapActionsToProps = {
  isOver: DragDropActions.isOver,
};

const Component = connect(mapStateToProps, mapActionsToProps)(DroppableListItemContainerComponent);
export { Component as DroppableListItemContainerComponent };
