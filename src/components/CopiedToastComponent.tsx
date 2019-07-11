import * as React from 'react';
import { connect } from 'react-redux';

import { AppState, CopyUrlState } from '../reducers';

interface Props {
  copyUrlState: CopyUrlState;
}

// Copy-pasted from DragLayerComponent.tsx
const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

const itemStyles = ({ x, y }: { x: number, y: number }): React.CSSProperties => {
  const transform = `translate(${x + 20}px, ${y - 12}px)`;
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
      <div className="copied-toast-layer" style={layerStyles}>
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

const asdf = connect(mapStateToProps)(CopiedToastComponent);

export { asdf as CopiedToastComponent };
