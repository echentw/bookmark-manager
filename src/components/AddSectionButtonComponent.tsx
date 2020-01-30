import * as React from 'react';
import { FaPlus } from 'react-icons/fa';
import { connect } from 'react-redux';

import * as EditFolderActions from 'actions/EditFolderActions';
import { AppState } from 'reduxStore';

interface Props {
  addFolder: (params: {}) => void;
}

class AddSectionButtonComponent extends React.Component<Props> {
  render() {
    return (
      <div className="add-section-button" onClick={this.props.addFolder}>
        <FaPlus className="add-section-icon"/>
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

const Component = connect(mapStateToProps, mapActionsToProps)(AddSectionButtonComponent);
export { Component as AddSectionButtonComponent };
