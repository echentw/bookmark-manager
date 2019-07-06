import * as React from 'react';

import { CopyUrlContext } from './contexts';

interface Props {
  copyUrlContext: CopyUrlContext;
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

const itemStyles = (x: number, y: number): React.CSSProperties => {
  const transform = `translate(${x + 20}px, ${y - 12}px)`;
  return {
    transform: transform,
    WebkitTransform: transform,
  };
};

export class CopiedToastComponent extends React.Component<Props> {
  render() {
    const { showingToast, position } = this.props.copyUrlContext.state;
    const { x, y } = position;

    const classes = showingToast ? 'copied-toast animating' : 'copied-toast';

    return (
      <div className="copied-toast-layer" style={layerStyles}>
        <div className={classes} style={itemStyles(x, y)}>
          URL copied!
        </div>
      </div>
    );
  }
}
