import * as React from 'react';

import { CopyContext } from './AppComponent';

interface Props {
  copyContext: CopyContext;
}

interface Position {
  x: number;
  y: number;
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

export class CopiedModalComponent extends React.Component<Props> {
  render() {
    const { showingCopiedModal, x, y } = this.props.copyContext;

    const classes = showingCopiedModal ? 'copied-modal animating' : 'copied-modal';

    return (
      <div className="copied-modal-layer" style={layerStyles}>
        <div className={classes} style={itemStyles(x, y)}>
          URL copied!
        </div>
      </div>
    );
  }
}
