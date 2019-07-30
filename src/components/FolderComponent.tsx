import * as React from 'react';
import { connect } from 'react-redux';

import { Folder } from '../Folder';
import { OpenFolderParams } from '../actions/FolderActions';
import * as FolderActions from '../actions/FolderActions';
import { EditFolderParams } from '../actions/EditFolderActions';
import * as EditFolderActions from '../actions/EditFolderActions';

import { isMouseOverElement } from './BookmarkComponent';

import { AppState } from './AppComponent';
import { EditTextFieldComponent } from './EditTextFieldComponent';

interface ExternalProps {
  folder: Folder;
  editing: boolean;
}

interface InternalProps extends ExternalProps {
  openFolder: (params: OpenFolderParams) => void;
  cancelEdit: (params: {}) => void;
  saveEdit: (params: EditFolderParams) => void;
}

interface State {
  isMouseOver: boolean;
}

class FolderComponent extends React.Component<InternalProps> {
  state = {
    isMouseOver: false,
  };

  onClick = () => {
    this.props.openFolder({ folder: this.props.folder });
  }

  saveEdit = (newName: string) => {
    const newFolder = this.props.folder.withName(newName);
    this.props.saveEdit({ folder: newFolder });
  }

  cancelEdit = () => {
    this.props.cancelEdit({});
  }

  render() {
    const { editing, folder } = this.props;

    const folderName = editing ? (
      <EditTextFieldComponent
        initialText={folder.name}
        save={this.saveEdit}
        cancel={this.cancelEdit}
      />
    ) : (
      <div className="folder-name" onClick={this.onClick}>
        { folder.name }
      </div>
    );

    return (
      <div className="folder">
        { folderName }
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: ExternalProps) => {
  return {};
};

const mapActionsToProps = {
  openFolder: FolderActions.openFolder,
  cancelEdit: EditFolderActions.cancel,
  saveEdit: EditFolderActions.save,
};

const Component = connect(mapStateToProps, mapActionsToProps)(FolderComponent);
export { Component as FolderComponent };
