import * as React from 'react';
import { connect } from 'react-redux';

import { CopyUrlState } from '../reducers/CopyUrlReducer';
import { AppState } from './AppComponent';

interface Props {
  copyUrlState: CopyUrlState;
}

const itemStyles = ({ x, y }: { x: number, y: number }): React.CSSProperties => {
  const transform = `translate(${x + 6}px, ${y - 28}px)`;
  return {
    transform: transform,
    WebkitTransform: transform,
  };
};

class CopiedToastComponent extends React.Component<Props> {
  render() {
    const { showingToast, position } = this.props.copyUrlState;

    const InnerElement = showingToast ? (
      <div className="copied-toast animating" style={itemStyles(position)}>
        URL copied!
      </div>
    ) : null;

    return (
      <div className="copied-toast-layer">
        { InnerElement }
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    copyUrlState: state.copyUrlState,
  };
};

const Component = connect(mapStateToProps)(CopiedToastComponent);
export { Component as CopiedToastComponent };
