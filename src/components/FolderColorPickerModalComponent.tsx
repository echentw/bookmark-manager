import * as React from 'react';

import { Folder } from '../Folder';

type Rect = DOMRect | ClientRect;

interface Props {
  folder: Folder;
  colorPickerIconBoundingRect: Rect;
  cancel: () => void;
}

const modalPositionStyles = (referenceRect: Rect): React.CSSProperties => {
  const {
    top: referenceTop,
    bottom: referenceBottom,
    left: referenceLeft,
    right: referenceRight,
  } = referenceRect;

  const x = (referenceLeft + referenceRight) / 2;
  const y = (referenceTop + referenceBottom) / 2;

  const transform = `translate(${x}px, ${y}px)`;

  return {
    transform: transform,
    WebkitTransform: transform,
  };
};

export class FolderColorPickerModalComponent extends React.Component<Props> {

  private modalRef: React.RefObject<HTMLDivElement> = React.createRef();

  onClickBackdrop = (event: React.MouseEvent) => {
    if (this.modalRef.current.contains(event.target as Node)) {
      // Clicked inside the modal. Do nothing.
      return;
    }
    this.props.cancel();
  }

  render() {

    const styles = modalPositionStyles(this.props.colorPickerIconBoundingRect);

    return (
      <div className="folder-color-picker-layer" onClick={this.onClickBackdrop}>
        <div className="folder-color-picker-modal"
          ref={this.modalRef}
          style={styles}
        >
          I am the folder color picker for the folder { this.props.folder.name }
        </div>
      </div>
    );
  }
}
