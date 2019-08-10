import * as React from 'react';
import { connect } from 'react-redux';
import { FaFolder } from 'react-icons/fa';

import { AppState } from '../reduxStore';
import {
  Folder,
  FolderColor,
  colorsToCssClasses,
} from '../Folder';
import * as EditFolderActions from '../actions/EditFolderActions';
import { SelectFolderColorParams } from '../actions/EditFolderActions';

type Rect = DOMRect | ClientRect;

interface ExternalProps {
  folder: Folder;
  colorPickerIconBoundingRect: Rect;
  cancel: () => void;
}

interface InternalProps extends ExternalProps {
  selectColor: (params: SelectFolderColorParams) => void;
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

class FolderColorPickerModalComponent extends React.Component<InternalProps> {

  private modalRef: React.RefObject<HTMLDivElement> = React.createRef();

  onClickBackdrop = (event: React.MouseEvent) => {
    if (this.modalRef.current.contains(event.target as Node)) {
      // Clicked inside the modal. Do nothing.
      return;
    }
    this.props.cancel();
  }

  onClickColorOption = (color: FolderColor) => {
    this.props.selectColor({
      folder: this.props.folder,
      color: color,
    });
  }

  render() {
    const styles = modalPositionStyles(this.props.colorPickerIconBoundingRect);

    const colorOptions = Array.from(colorsToCssClasses.entries()).map(entry => {
      const [color, cssClass] = entry;
      return (
        <div className="color-option-container" key={color}>
          <FaFolder className={'color-option ' + cssClass}
            onClick={() => this.onClickColorOption(color)}
          />
        </div>
      );
    });

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

const mapStateToProps = (state: AppState, props: ExternalProps) => {
  return {};
};

const mapActionsToProps = {
  selectColor: EditFolderActions.selectColor,
};

const Component = connect(mapStateToProps, mapActionsToProps)(FolderColorPickerModalComponent);
export { Component as FolderColorPickerModalComponent };
