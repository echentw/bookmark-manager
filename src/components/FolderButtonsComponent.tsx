import * as React from 'react';
import { IconContext } from 'react-icons';
import { FaPen, FaTrash } from 'react-icons/fa';
import { connect } from 'react-redux';

import { Folder } from '../Folder';
import { AppState } from '../reduxStore';
import * as EditFolderActions from '../actions/EditFolderActions';
import { EditFolderParams } from '../actions/EditFolderActions';

interface ExternalProps {
  folder: Folder;
}

interface InternalProps extends ExternalProps {
  beginEdit: (params: EditFolderParams) => void;
  deleteFolder: (params: EditFolderParams) => void;
}

class FolderButtonsComponent extends React.Component<InternalProps> {

  onClickDelete = () => {
    this.props.deleteFolder({ folder: this.props.folder });
  }

  onClickEdit = () => {
    this.props.beginEdit({ folder: this.props.folder });
  }

  render() {
    return (
      <div className="folder-buttons">
        <IconContext.Provider value={{ size: '1.2em' }}>
          <FaPen className="folder-button" onClick={this.onClickEdit}/>
          <FaTrash className="folder-button" onClick={this.onClickDelete}/>
        </IconContext.Provider>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: ExternalProps) => {
  return {};
};

const mapActionsToProps = {
  beginEdit: EditFolderActions.beginEdit,
  deleteFolder: EditFolderActions.deleteFolder,
};

const Component = connect(mapStateToProps, mapActionsToProps)(FolderButtonsComponent);
export { Component as FolderButtonsComponent };
