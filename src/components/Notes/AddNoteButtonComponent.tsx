import * as React from 'react';
import { connect } from 'react-redux';

import { AppState } from 'reduxStore';
import * as PlusIcon from 'assets/plus_icon.svg';

import * as NotesActions from 'actions/NotesActions';


interface Props {
  addNote: () => void;
}

class AddNoteButtonComponent extends React.Component<Props> {
  render() {
    return (
      <div className="add-note-button" onClick={this.props.addNote}>
        <img src={PlusIcon} className="add-note-icon"/>
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

const Component = connect(mapStateToProps, mapActionsToProps)(AddNoteButtonComponent);
export { Component as AddNoteButtonComponent };
