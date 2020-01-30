import * as React from 'react';
import { FaPlus } from 'react-icons/fa';
import { connect } from 'react-redux';

import * as EditFolderActions from 'actions/EditFolderActions';
import { AppState } from 'reduxStore';

interface Props {
  addFolder: (params: {}) => void;
}

class AddFolderButtonComponent extends React.Component<Props> {
  render() {
    return (
      <div className="add-folder-button" onClick={this.props.addFolder}>
        <FaPlus className="add-folder-icon"/>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {};
};

const mapActionsToProps = {
  addFolder: EditFolderActions.addFolder,
};

const Component = connect(mapStateToProps, mapActionsToProps)(AddFolderButtonComponent);
export { Component as AddFolderButtonComponent };
