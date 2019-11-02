import * as React from 'react';
import { connect } from 'react-redux';

import { AppState } from '../reduxStore';
import { Bookmark, defaultFaviconUrl } from '../Bookmark';
import { TabInfo } from '../ChromeHelpers';
import * as AddBookmarksActions from '../actions/AddBookmarksActions';
import { AddBookmarksSaveParams } from '../actions/AddBookmarksActions';
import { ModalBackdropComponent } from './ModalBackdropComponent';

interface Props {
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

  private modalRef: React.RefObject<HTMLDivElement> = React.createRef();

  cancel = () => {
    this.setState({ selectedTabs: new Map<number, TabInfo>() }, () => {
      this.props.cancel();
    });
  }

  save = () => {
    const { selectedTabs } = this.state;
    const bookmarks = Array.from(selectedTabs.values()).map((tab: TabInfo) => {
      return new Bookmark({
        url: tab.url,
        title: tab.title,
        faviconUrl: tab.faviconUrl,
      });
    });
    this.setState({ selectedTabs: new Map<number, TabInfo>() }, () => {
      this.props.save({ bookmarks: bookmarks });
    });
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
    const tabInfoComponents = this.props.tabs.map((tab: TabInfo, index: number) => {
      const selected = this.state.selectedTabs.has(index);
      const isLast = (index == this.props.tabs.length - 1);
      const classes = selected ? 'open-tab selected' : 'open-tab';
      const containerClasses = isLast ? 'open-tab-container last' : 'open-tab-container';
      const faviconUrl = tab.faviconUrl ? tab.faviconUrl : defaultFaviconUrl;
      return (
        <div className={containerClasses} key={index}>
          <div className={classes} onClick={() => this.onClickTab(index)}>
            <img className="open-tab-favicon" src={faviconUrl}/>
            <div className="open-tab-name">{tab.title}</div>
          </div>
        </div>
      );
    });

    // If no open tabs are selected, then we disable the save button.
    const saveButtonDisabled = this.state.selectedTabs.size === 0;
    const saveDisabledCss = saveButtonDisabled ? 'disabled' : '';
    const maybeSave = saveButtonDisabled ? null : this.save;

    const modalComponent = (
      <div className="add-bookmarks-modal" ref={this.modalRef}>
        <div className="add-bookmarks-title-container">
          <div className="add-bookmarks-title">Open Tabs</div>
        </div>
        <div className="add-bookmarks-modal-scrollable-area">
          { tabInfoComponents }
        </div>
        <div className="add-bookmarks-buttons">
          <div className="add-bookmarks-cancel-button" onClick={this.cancel}>
            Cancel
          </div>
          <div className={'add-bookmarks-save-button ' + saveDisabledCss} onClick={maybeSave}>
            Save
          </div>
        </div>
      </div>
    );

    return (
      <ModalBackdropComponent
        additionalClasses={'add-bookmarks-layer'}
        save={this.save}
        cancel={this.cancel}
        modalRef={this.modalRef}
      >
        { modalComponent }
      </ModalBackdropComponent>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    tabs: state.addBookmarksState.tabs,
  };
};

const mapActionsToProps = {
  cancel: AddBookmarksActions.cancel,
  save: AddBookmarksActions.save,
};

const Component = connect(mapStateToProps, mapActionsToProps)(AddBookmarksModalComponent);
export { Component as AddBookmarksModalComponent };
