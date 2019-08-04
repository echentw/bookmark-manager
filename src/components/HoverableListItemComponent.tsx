import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import { AppState } from '../reduxStore';
import { HoverParams } from '../actions/HoverActions';
import * as HoverActions from '../actions/HoverActions';

interface ExternalProps {
  className: string;
  rank: number;
  children: React.ReactElement[];
}

interface InternalProps extends ExternalProps {
  somethingIsDragging: boolean;
  lastDroppedRank: number | null;
  enterHover: (params: HoverParams) => void;
  exitHover: (params: HoverParams) => void;
}

class HoverableListItemComponent extends React.Component<InternalProps> {

  private element: HTMLDivElement = null;

  componentDidUpdate = (prevProps: InternalProps) => {
    if (prevProps.somethingIsDragging && !this.props.somethingIsDragging) {
      // We just stopped dragging. Time to check for hover behavior.
      this.props.enterHover({ rank: this.props.lastDroppedRank });
    }
  }

  onMouseEnter = () => {
    this.props.enterHover({ rank: this.props.rank });
  }

  onMouseLeave = () => {
    this.props.exitHover({ rank: this.props.rank });
  }

  render() {
    return (
      <div className={this.props.className}
        ref={(elem) => this.element = elem}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        { this.props.children }
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: ExternalProps) => {
  return {
    somethingIsDragging: state.dragDropState.draggedRank !== null,
    lastDroppedRank: state.dragDropState.lastDroppedRank,
  };
};

const mapActionsToProps = {
  enterHover: HoverActions.enter,
  exitHover: HoverActions.exit,
};

const Component = connect(mapStateToProps, mapActionsToProps)(HoverableListItemComponent);
export { Component as HoverableListItemComponent };
