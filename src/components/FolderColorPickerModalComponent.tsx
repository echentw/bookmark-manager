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
import { ModalBackdropComponent, Rect } from './ModalBackdropComponent';

interface ExternalProps {
  folder: Folder;
  referenceRect: Rect;
  cancel: () => void;
}

interface InternalProps extends ExternalProps {
  selectColor: (params: SelectFolderColorParams) => void;
}

class FolderColorPickerModalComponent extends React.Component<InternalProps> {

  private modalRef: React.RefObject<HTMLDivElement> = React.createRef();

  onClickColorOption = (color: FolderColor) => {
    this.props.selectColor({
      folder: this.props.folder,
      color: color,
    });
  }

  render() {
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
      <ModalBackdropComponent
        cancel={this.props.cancel}
        modalRef={this.modalRef}
        referenceRect={this.props.referenceRect}
      >
        <div className="folder-color-picker-modal" ref={this.modalRef}>
          { colorOptions }
        </div>
      </ModalBackdropComponent>
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
