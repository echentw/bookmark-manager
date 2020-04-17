import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import { AppState } from 'reduxStore';
import { HoverParams } from 'actions/HoverActions';
import * as HoverActions from 'actions/HoverActions';

interface ExternalProps {
  className: string;
  itemId: string;
  onClick?: () => void;
  children: React.ReactElement | React.ReactElement[];
}

interface InternalProps extends ExternalProps {
  enterHover: (params: HoverParams) => void;
  exitHover: (params: HoverParams) => void;
}

class HoverableContainerComponent extends React.Component<InternalProps> {

  private element: HTMLDivElement = null;

  onMouseOver = () => {
    this.props.enterHover({ itemId: this.props.itemId });
  }

  onMouseLeave = () => {
    this.props.exitHover({ itemId: this.props.itemId });
  }

  render() {
    const onClickHandler = this.props.onClick ?? (() => {});

    return (
      <div className={this.props.className}
        ref={(elem) => this.element = elem}
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
        onClick={onClickHandler}
      >
        { this.props.children }
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: ExternalProps) => {
  return {};
};

const mapActionsToProps = {
  enterHover: HoverActions.enter,
  exitHover: HoverActions.exit,
};

const Component = connect(mapStateToProps, mapActionsToProps)(HoverableContainerComponent);
export { Component as HoverableContainerComponent };
