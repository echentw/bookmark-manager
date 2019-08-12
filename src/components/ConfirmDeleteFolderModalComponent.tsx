import * as React from 'react';

import { ModalBackdropComponent, Rect } from './ModalBackdropComponent';

interface Props {
  referenceRect: Rect;
  confirmDelete: () => void;
  cancelDelete: () => void;
}

export class ConfirmDeleteFolderModalComponent extends React.Component<Props> {

  private modalRef: React.RefObject<HTMLDivElement> = React.createRef();

  cancel = () => {
    this.props.cancelDelete();
  }

  render() {
    return (
      <ModalBackdropComponent
        cancel={this.cancel}
        modalRef={this.modalRef}
        referenceRect={this.props.referenceRect}
      >
        <div className="confirm-delete-folder-modal" ref={this.modalRef}>
          <div className="confirm-delete-title">
            Are you sure you want to delete this folder?
          </div>
          <div className="confirm-delete-button" onClick={this.props.confirmDelete}>
            Delete
          </div>
          <div className="cancel-delete-button" onClick={this.props.cancelDelete}>
            Cancel
          </div>
        </div>
      </ModalBackdropComponent>
    );
  }
}
