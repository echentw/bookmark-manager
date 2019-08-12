import * as React from 'react';

import { ModalBackdropComponent } from './ModalBackdropComponent';

interface Props {
  triggerRef: React.RefObject<HTMLDivElement>;
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
        triggerRef={this.props.triggerRef}
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
