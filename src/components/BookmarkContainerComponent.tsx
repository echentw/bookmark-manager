import * as React from 'react';
import { useDrop } from 'react-dnd';
import { connect } from 'react-redux';

import { AppState } from '../main';
import { DraggableTypes } from './AppComponent';
import * as DragDropActions from '../actions/DragDropActions';
import { DragDropParams } from '../actions/DragDropActions';

interface Props {
  children: React.ReactElement;
  isOver: (params: DragDropParams) => void;
  rank: number;
}

function BookmarkContainerComponent(props: Props) {
	const [{ isOver }, drop] = useDrop({
		accept: DraggableTypes.Bookmark,
		collect: monitor => {
      const isOver = !!monitor.isOver();
      if (isOver) {
        props.isOver({ rank: props.rank });
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

const mapStateToProps = (state: AppState, props: {}) => {
  return {};
};

const mapActionsToProps = {
  isOver: DragDropActions.isOver,
};

const asdf = connect(mapStateToProps, mapActionsToProps)(BookmarkContainerComponent);

export { asdf as BookmarkContainerComponent };
