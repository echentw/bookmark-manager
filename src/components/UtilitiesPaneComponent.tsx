import * as React from 'react';
import { connect } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';

import { AppState } from 'reduxStore';
import { UtilityTab } from 'reducers/UtilitiesReducer';
import * as UtilitiesActions from 'actions/UtilitiesActions';

import { FolderListComponent } from 'components/FolderListComponent';
import { NotePreviewListComponent } from 'components/Notes/NotePreviewListComponent';


interface Props {
  activeTab: UtilityTab;
  selectBookmarksTab: () => void;
  selectNotesTab: () => void;
}

class UtilitiesPaneComponent extends React.Component<Props> {
  render() {
    let bookmarksActive: string;
    let notesActive: string;
    let utilityComponent: React.ReactElement;

    switch (this.props.activeTab) {
      case UtilityTab.Bookmarks:
        bookmarksActive = 'active-tab';
        notesActive = 'inactive-tab';
        utilityComponent = <FolderListComponent/>;
        break;
      case UtilityTab.Notes:
        bookmarksActive = 'inactive-tab';
        notesActive = 'active-tab';
        utilityComponent = <NotePreviewListComponent/>;
        break;
      default:
        throw new Error('Unknown UtilityTab enum value');
    }

    return (
      <div className="utilities-pane">
        <div className="tabs">
          <div className={`bookmarks-tab ${bookmarksActive}`} onClick={this.props.selectBookmarksTab}>
            Bookmarks
          </div>
          <div className="tab-divider"/>
          <div className={`notes-tab ${notesActive}`} onClick={this.props.selectNotesTab}>
            Notes
          </div>
        </div>
        <div className="pane">
          <Scrollbars>
            { utilityComponent }
          </Scrollbars>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    activeTab: state.utilitiesState.activeTab,
  };
};

const mapActionsToProps = {
  selectBookmarksTab: UtilitiesActions.selectBookmarksTab,
  selectNotesTab: UtilitiesActions.selectNotesTab,
};

const Component = connect(mapStateToProps, mapActionsToProps)(UtilitiesPaneComponent);
export { Component as UtilitiesPaneComponent };
