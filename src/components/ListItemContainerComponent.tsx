import * as React from 'react';
import { useDrop } from 'react-dnd';
import { connect } from 'react-redux';

import { AppState } from './AppComponent';
import * as DragDropActions from '../actions/DragDropActions';
import { DragDropParams } from '../actions/DragDropActions';

interface ExternalProps {
  children: React.ReactElement;
  rank: number;
  draggableType: string;
}

interface InternalProps extends ExternalProps {
  isOver: (params: DragDropParams) => void;
}

function ListItemContainerComponent(props: InternalProps) {
	const [{ isOver }, drop] = useDrop({
		accept: props.draggableType,
		collect: monitor => {
      const isOver = !!monitor.isOver();
      if (isOver) {
        props.isOver({ rank: props.rank });
      }
      return { isOver };
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

const Component = connect(mapStateToProps, mapActionsToProps)(ListItemContainerComponent);
export { Component as ListItemContainerComponent };
