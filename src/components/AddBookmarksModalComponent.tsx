import * as React from 'react';
import { connect } from 'react-redux';

import { Bookmark } from '../Bookmark';
import { TabInfo } from '../ChromeHelpers';
import * as AddBookmarksActions from '../actions/AddBookmarksActions';
import { AddBookmarksSaveParams } from '../actions/AddBookmarksActions';
import { AppState } from './AppComponent';

interface Props {
  showingModal: boolean;
  tabs: TabInfo[];
  cancel: () => void;
  save: (params: AddBookmarksSaveParams) => void;
}

interface State {
  selectedTabs: Map<number, TabInfo>;
}

class AddBookmarksModalComponent extends React.Component<Props, State> {
  state = {
    selectedTabs: new Map<number, TabInfo>(),
  };

  private innerNode: HTMLElement = null;

  onClick = (event: React.MouseEvent) => {
    if (this.innerNode !== null && this.innerNode.contains(event.target as Node)) {
      // Clicked inside the modal. Do nothing.
      return;
    }
    this.onClickCancel();
  }

  onClickCancel = () => {
    this.props.cancel();
    this.setState({ selectedTabs: new Map<number, TabInfo>() });
  }

  onClickSave = () => {
    const { selectedTabs } = this.state;
    const bookmarks = Array.from(selectedTabs.values()).map((tab: TabInfo) => {
      return new Bookmark({
        url: tab.url,
        title: tab.title,
        faviconUrl: tab.faviconUrl,
      });
    });
    this.props.save({ bookmarks: bookmarks });
    this.setState({ selectedTabs: new Map<number, TabInfo>() });
  }

  onClickTab = (index: number) => {
    const selectedTabs = new Map(this.state.selectedTabs);
    if (selectedTabs.has(index)) {
      selectedTabs.delete(index);
    } else {
      selectedTabs.set(index, this.props.tabs[index]);
    }
    this.setState({ selectedTabs });
  }

  render() {
    if (!this.props.showingModal) {
      return null;
    }

    const tabInfoComponents = this.props.tabs.map((tab: TabInfo, index: number) => {
      const selected = this.state.selectedTabs.has(index);
      const classes = selected ? 'open-tab selected' : 'open-tab';
      return (
        <div className="open-tab-container" key={index}>
          <div className={classes} onClick={() => this.onClickTab(index)}>
            <img className="open-tab-favicon" src={tab.faviconUrl}/>
            <div className="open-tab-name">{tab.title}</div>
          </div>
        </div>
      );
    });

    return (
      <div className="add-bookmarks-layer" onClick={this.onClick}>
        <div className="add-bookmarks-modal" ref={(element) => this.innerNode = element}>
          <div className="add-bookmarks-modal-scrollable-area">
            { tabInfoComponents }
          </div>
          <div className="add-bookmarks-buttons">
            <div className="add-bookmarks-cancel-button" onClick={this.onClickCancel}>
              Cancel
            </div>
            <div className="add-bookmarks-save-button" onClick={this.onClickSave}>
              Save
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    showingModal: state.addBookmarksState.showingModal,
    tabs: state.addBookmarksState.tabs,
  };
};

const mapActionsToProps = {
  cancel: AddBookmarksActions.cancel,
  save: AddBookmarksActions.save,
};

const Component = connect(mapStateToProps, mapActionsToProps)(AddBookmarksModalComponent);
export { Component as AddBookmarksModalComponent };
