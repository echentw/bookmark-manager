import * as React from 'react';
import { IconContext } from 'react-icons';
import { FaPlus } from 'react-icons/fa';
import { connect } from 'react-redux';

import * as AddBookmarksActions from '../actions/AddBookmarksActions';
import { AppState } from '../main';

interface Props {
  showModal: () => void;
}

class AddBookmarksButtonComponent extends React.Component<Props> {
  render() {
    return (
      <div className="add-bookmark" onClick={this.props.showModal}>
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
  showModal: AddBookmarksActions.showModal,
};

const Component = connect(mapStateToProps, mapActionsToProps)(AddBookmarksButtonComponent);
export { Component as AddBookmarksButtonComponent };
