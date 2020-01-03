import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import { AppState } from 'reduxStore';
import { HoverParams } from 'actions/HoverActions';
import * as HoverActions from 'actions/HoverActions';

import { USE_SECTIONSSS } from 'components/AppComponent';

interface ExternalProps {
  className: string;
  itemId: string;
  children: React.ReactElement[];
}

interface InternalProps extends ExternalProps {
  enterHover: (params: HoverParams) => void;
  exitHover: (params: HoverParams) => void;
}

class HoverableListItemComponent extends React.Component<InternalProps> {

  private element: HTMLDivElement = null;

  onMouseOver = () => {
    this.props.enterHover({ itemId: this.props.itemId });
  }

  onMouseLeave = () => {
    this.props.exitHover({ itemId: this.props.itemId });
  }

  render() {
    return (
      <div className={this.props.className}
        ref={(elem) => this.element = elem}
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
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

const Component = connect(mapStateToProps, mapActionsToProps)(HoverableListItemComponent);
export { Component as HoverableListItemComponent };
