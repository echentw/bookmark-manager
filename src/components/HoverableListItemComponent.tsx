import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import { AppState } from './AppComponent';

const isMouseOverElement = (element: Element, x: number, y: number) => {
  const { left, right, bottom, top } = element.getBoundingClientRect();
  return x > left && x < right && y > top && y < bottom;
}

interface ExternalProps {
  className: string;
  updateHoverRank: (rank: number, hovering: boolean) => void;
  rank: number;
  children: React.ReactElement[];
}

interface InternalProps extends ExternalProps {
  somethingIsDragging: boolean; // whether the user is dragging anything at all
}

interface State {
  isMouseOver: boolean;
}

class HoverableListItemComponent extends React.Component<InternalProps, State> {
  state = {
    isMouseOver: false,
  };

  private element: HTMLDivElement = null;

  onMouseEnter = () => {
    if (!this.props.somethingIsDragging) {
      this.props.updateHoverRank(this.props.rank, true);
    }
  }

  onMouseLeave = () => {
    if (!this.props.somethingIsDragging) {
      this.props.updateHoverRank(this.props.rank, false);
    }
  }

  onDragEnter = () => {
    this.props.updateHoverRank(this.props.rank, true);
  }

  onDragLeave = () => {
    this.props.updateHoverRank(this.props.rank, false);
  }

  onDragEnd = (event: React.DragEvent) => {
    const { clientX, clientY } = event;
    const element = findDOMNode(this.element) as Element;
    const isMouseOver = isMouseOverElement(element, clientX, clientY);
    if (isMouseOver !== this.state.isMouseOver) {
      this.props.updateHoverRank(this.props.rank, isMouseOver);
    }
  }

  render() {
    return (
      <div className={this.props.className}
        ref={(elem) => this.element = elem}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDragEnd={this.onDragEnd}
      >
        { this.props.children }
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: ExternalProps) => {
  return {
    somethingIsDragging: state.dragDropState.dragging,
  };
};

const Component = connect(mapStateToProps)(HoverableListItemComponent);
export { Component as HoverableListItemComponent };