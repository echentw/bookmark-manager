import * as React from 'react';
import { connect } from 'react-redux';

import { AppState } from './AppComponent';
import { Folder } from '../Folder';
import { OpenFolderParams } from '../actions/FolderActions';
import * as FolderActions from '../actions/FolderActions';
import { isMouseOverElement } from './BookmarkComponent';

interface Props {
  folder: Folder;
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
    return (
      <div className="folder">
        <div className="folder-name" onClick={this.onClick}>
          { this.props.folder.name }
        </div>
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
