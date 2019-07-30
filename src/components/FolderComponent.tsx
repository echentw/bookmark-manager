import * as React from 'react';
import { connect } from 'react-redux';

import { Folder } from '../Folder';
import { OpenFolderParams } from '../actions/FolderActions';
import * as FolderActions from '../actions/FolderActions';
import { isMouseOverElement } from './BookmarkComponent';

import { AppState } from './AppComponent';
import { EditFolderComponent } from './EditFolderComponent';

interface Props {
  folder: Folder;
  editing: boolean;
  openFolder: (params: OpenFolderParams) => void;
}

interface State {
  isMouseOver: boolean;
}

class FolderComponent extends React.Component<Props> {
  state = {
    isMouseOver: false,
  };

  onClick = () => {
    this.props.openFolder({ folder: this.props.folder });
  }

  render() {
    const { editing, folder } = this.props;

    const folderName = editing ? (
      <EditFolderComponent folder={folder}/>
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

const mapStateToProps = (state: AppState, props: {}) => {
  return {};
};

const mapActionsToProps = {
  openFolder: FolderActions.openFolder,
};

const Component = connect(mapStateToProps, mapActionsToProps)(FolderComponent);
export { Component as FolderComponent };
