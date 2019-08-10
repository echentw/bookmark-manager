import * as React from 'react';
import { FaFolder } from 'react-icons/fa';

import { Folder, FolderColor } from '../Folder';

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

const colorsToCssClasses = new Map([
  [FolderColor.Red, 'red'],
  [FolderColor.Green, 'green'],
  [FolderColor.Blue, 'blue'],
  [FolderColor.Yellow, 'yellow'],
  [FolderColor.Violet, 'violet'],
  [FolderColor.Orange, 'orange'],
  [FolderColor.Black, 'black'],
  [FolderColor.Grey, 'grey'],
  [FolderColor.LightBlue, 'light-blue'],
]);

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

    const colorOptions = Array.from(colorsToCssClasses.values()).map(color => (
      <div className="color-option-container" key={color}>
        <FaFolder className={'color-option ' + color}/>
      </div>
    ));

    return (
      <div className="folder-color-picker-layer" onClick={this.onClickBackdrop}>
        <div className="folder-color-picker-modal"
          ref={this.modalRef}
          style={styles}
        >
          { colorOptions }
        </div>
      </div>
    );
  }
}
