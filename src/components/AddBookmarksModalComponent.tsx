import * as React from 'react';
import { connect } from 'react-redux';

import { Bookmark } from '../Bookmark';
import { TabInfo } from '../ChromeHelpers';
import * as AddBookmarksActions from '../actions/AddBookmarksActions';
import { AppState } from './AppComponent';

interface Props {
  showingModal: boolean;
  tabs: TabInfo[];
  cancel: () => void;
  save: (bookmark: Bookmark[]) => void;
}

interface State {
  selectedTabs: Map<number, TabInfo>;
}

// Copy-pasted from DragLayerComponent.tsx
const layerBaseStyles: React.CSSProperties = {
  position: 'fixed',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

class AddBookmarksModalComponent extends React.Component<Props, State> {
  state = {
    selectedTabs: new Map<number, TabInfo>(),
  };

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
    this.props.save(bookmarks);
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
    const tabInfoComponents = this.props.tabs.map((tab: TabInfo, index: number) => {
      const selected = this.state.selectedTabs.has(index);
      const classes = selected ? 'tab-info selected' : 'tab-info';
      return (
        <div className={classes} key={index} onClick={() => this.onClickTab(index)}>
          { tab.title }
        </div>
      );
    });

    const layerStyles: React.CSSProperties = {
      ...layerBaseStyles,
      pointerEvents: this.props.showingModal ? 'auto' : 'none',
    };

    const maybeModalComponent = this.props.showingModal ? (
      <div className="add-bookmark-modal">
        <div className="tab-infos-outer-container">
          <div className="tab-infos-inner-container">
            { tabInfoComponents }
          </div>
        </div>
        <div className="buttons-container">
          <div className="button cancel-button" onClick={this.onClickCancel}>
            Cancel
          </div>
          <div className="button add-button" onClick={this.onClickSave}>
            Save
          </div>
        </div>
      </div>
    ) : null;

    return (
      <div className="add-bookmark-layer" style={layerStyles}>
        { maybeModalComponent }
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
