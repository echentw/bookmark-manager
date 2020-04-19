import * as React from 'react';
import { connect } from 'react-redux';

import * as NotesActions from 'actions/NotesActions';
import { AppState } from 'reduxStore';


class QuickAddNoteButtonComponent extends React.Component {
  render() {
    return (
      <div className="quick-add-note-button">
        + New Note
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {};
};

const mapActionsToProps = {
  addNote: NotesActions.addNote,
};

const Component = connect(mapStateToProps, mapActionsToProps)(QuickAddNoteButtonComponent);
export { Component as QuickAddNoteButtonComponent };
