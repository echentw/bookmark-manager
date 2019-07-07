import * as React from 'react';

import { Bookmark } from '../Bookmark';
import { TabInfo } from '../ChromeHelpers';

import { AddBookmarksContext } from './contexts';

interface Props {
  addBookmarksContext: AddBookmarksContext;
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

export class AddBookmarkModalComponent extends React.Component<Props, State> {
  state = {
    selectedTabs: new Map<number, TabInfo>(),
  };

  onClickCancel = () => {
    this.props.addBookmarksContext.service.cancelAddBookmarks();
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
    this.props.addBookmarksContext.service.saveAddBookmarks(bookmarks);
    this.setState({ selectedTabs: new Map<number, TabInfo>() });
  }

  onClickTab = (index: number) => {
    const selectedTabs = new Map(this.state.selectedTabs);
    if (selectedTabs.has(index)) {
      selectedTabs.delete(index);
    } else {
      selectedTabs.set(index, this.props.addBookmarksContext.state.tabs[index]);
    }
    this.setState({ selectedTabs });
  }

  render() {
    const { addBookmarksContext: context } = this.props;

    const tabInfoComponents = context.state.tabs.map((tab: TabInfo, index: number) => {
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
      pointerEvents: context.state.showingModal ? 'auto' : 'none',
    };

    const maybeModalComponent = context.state.showingModal ? (
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
