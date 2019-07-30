import * as React from 'react';
import { IconContext } from 'react-icons';
import { FaPlus } from 'react-icons/fa';
import { connect } from 'react-redux';

import * as EditFolderActions from '../actions/EditFolderActions';
import { AppState } from './AppComponent';

interface Props {
  addFolder: (params: {}) => void;
}

class AddFolderButtonComponent extends React.Component<Props> {
  render() {
    return (
      <div className="add-folder-button" onClick={this.props.addFolder}>
        <IconContext.Provider value={{ className: 'fa-plus' }}>
          <FaPlus/>
        </IconContext.Provider>
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
