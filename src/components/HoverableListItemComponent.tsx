import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import { AppState } from '../reduxStore';
import { HoverParams } from '../actions/HoverActions';
import * as HoverActions from '../actions/HoverActions';

const isMouseOverElement = (element: Element, x: number, y: number) => {
  const { left, right, bottom, top } = element.getBoundingClientRect();
  return x > left && x < right && y > top && y < bottom;
}

interface ExternalProps {
  className: string;
  rank: number;
  children: React.ReactElement[];
}

interface InternalProps extends ExternalProps {
  somethingIsDragging: boolean; // whether the user is dragging anything at all
  enterHover: (params: HoverParams) => void;
  exitHover: (params: HoverParams) => void;
}

class HoverableListItemComponent extends React.Component<InternalProps> {

  private element: HTMLDivElement = null;

  onMouseEnter = () => {
    if (!this.props.somethingIsDragging) {
      this.props.enterHover({ rank: this.props.rank });
    }
  }

  onMouseLeave = () => {
    if (!this.props.somethingIsDragging) {
      this.props.exitHover({ rank: this.props.rank });
    }
  }

  onDragEnter = () => {
    if (!this.props.somethingIsDragging) {
      this.props.enterHover({ rank: this.props.rank });
    }
  }

  onDragLeave = () => {
    if (!this.props.somethingIsDragging) {
      this.props.exitHover({ rank: this.props.rank });
    }
  }

  onDragEnd = (event: React.DragEvent) => {
    const { clientX, clientY } = event;
    const element = findDOMNode(this.element) as Element;
    const isMouseOver = isMouseOverElement(element, clientX, clientY);
    if (isMouseOver) {
      this.props.enterHover({ rank: this.props.rank });
    } else {
      this.props.exitHover({ rank: this.props.rank });
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
    somethingIsDragging: state.dragDropState.draggedRank !== null,
  };
};

const mapActionsToProps = {
  enterHover: HoverActions.enter,
  exitHover: HoverActions.exit,
};

const Component = connect(mapStateToProps, mapActionsToProps)(HoverableListItemComponent);
export { Component as HoverableListItemComponent };
