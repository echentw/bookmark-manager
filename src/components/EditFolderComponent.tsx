import * as React from 'react';
import { connect } from 'react-redux';

import { Folder } from '../Folder';
import * as EditFolderActions from '../actions/EditFolderActions';
import { EditFolderParams } from '../actions/EditFolderActions';
import { AppState } from './AppComponent';

interface ExternalProps {
  folder: Folder;
}

interface InternalProps extends ExternalProps {
  cancel: (params: EditFolderParams) => void;
  save: (params: EditFolderParams) => void;
}

class EditFolderComponent extends React.Component<InternalProps> {
  render() {
    const { folder } = this.props;
    return (
      <input
        className="edit-folder"
        type="text"
        defaultValue={folder.name}
      />
    );
  }
}

const mapStateToProps = (state: AppState, props: ExternalProps) => {
  return {};
};

const mapActionsToProps = {
  cancel: EditFolderActions.cancel,
  save: EditFolderActions.save,
};

const Component = connect(mapStateToProps, mapActionsToProps)(EditFolderComponent);
export { Component as EditFolderComponent };
