import * as React from 'react';
import { connect } from 'react-redux';

import { AppState } from '../reduxStore';
import { Folder } from '../Folder';
import { ModalBackdropComponent } from './ModalBackdropComponent';

interface ExternalProps {
  triggerRef: React.RefObject<HTMLDivElement>;
  folder: Folder;
  confirmDelete: () => void;
  cancelDelete: () => void;
}

interface InternalProps extends ExternalProps {
  folders: Folder[];
}

class ConfirmDeleteFolderModalComponent extends React.Component<InternalProps> {

  private modalRef: React.RefObject<HTMLDivElement> = React.createRef();

  cancel = () => {
    this.props.cancelDelete();
  }

  render() {
    const canDelete = this.props.folders.length > 0;

    const title = canDelete ? (
      `Are you sure you want to delete ${this.props.folder.name}?`
    ) : (
      "You cannot delete this folder because it's your only folder!"
    );

    const buttons = canDelete ? (
      <>
        <div className="cancel-delete-button" onClick={this.props.cancelDelete}>
          Cancel
        </div>
        <div className="confirm-delete-button" onClick={this.props.confirmDelete}>
          Delete
        </div>
      </>
    ) : (
      <div className="cancel-delete-button solo" onClick={this.props.cancelDelete}>
        Cancel
      </div>
    );

    return (
      <ModalBackdropComponent
        cancel={this.cancel}
        modalRef={this.modalRef}
        triggerRef={this.props.triggerRef}
      >
        <div className="confirm-delete-folder-modal" ref={this.modalRef}>
          <div className="confirm-delete-title">
            { title }
          </div>
          <div className="delete-modal-buttons">
            { buttons }
          </div>
        </div>
      </ModalBackdropComponent>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    folders: state.foldersState.folders,
  };
};

const Component = connect(mapStateToProps)(ConfirmDeleteFolderModalComponent);
export { Component as ConfirmDeleteFolderModalComponent };
