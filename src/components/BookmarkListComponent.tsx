import * as React from 'react';
import { connect } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';
import { IconContext } from 'react-icons';
import { FaChevronLeft } from 'react-icons/fa';

import { Bookmark } from '../Bookmark';
import { Folder } from '../Folder';
import * as NavigationActions from '../actions/NavigationActions';
import { DragDropListItemContainerComponent } from './DragDropListItemContainerComponent';
import { AddBookmarksButtonComponent } from './AddBookmarksButtonComponent';
import { BookmarkComponent } from './BookmarkComponent';
import { DraggableType } from './AppComponent';
import { AppState } from '../reduxStore';

interface ExternalProps {
  folder: Folder;
}

interface InternalProps extends ExternalProps {
  editingBookmarkId: string | null;
  closeFolder: (params: {}) => void;
  draggedRank: number | null;
  hoverRank: number | null;
}

interface State {
  hoveringFolderTitle: boolean;
}

class BookmarkListComponent extends React.Component<InternalProps, State> {

  state: State = {
    hoveringFolderTitle: false,
  };

  onClickFolderName = () => {
    this.props.closeFolder({});
  }

  onMouseEnterFolderTitle = () => {
    this.setState({ hoveringFolderTitle: true });
  }

  onMouseLeaveFolderTitle = () => {
    this.setState({ hoveringFolderTitle: false });
  }

  render() {
    const { folder } = this.props;

    const bookmarkComponents = folder.bookmarks.map((bookmark: Bookmark, rank: number) => {
      const editing = bookmark.id === this.props.editingBookmarkId;
      const dragging = rank === this.props.draggedRank;
      const hovering = rank === this.props.hoverRank;
      const draggable = !editing;
      return (
        <DragDropListItemContainerComponent
          key={bookmark.id}
          id={bookmark.id}
          rank={rank}
          draggableType={DraggableType.Bookmark}
          draggable={draggable}
        >
          <BookmarkComponent
            bookmark={bookmark}
            editing={editing}
            dragging={dragging}
            hovering={hovering}
            rank={rank}
          />
        </DragDropListItemContainerComponent>
      );
    });

    const maybeHoveringCssClass = this.state.hoveringFolderTitle ? ' hovering' : '';

    return (
      <div className="bookmark-list">
        <div className="bookmark-list-title-outer-container">
          <div className="bookmark-list-title-inner-container">
            <div className="hover-container"
              onClick={this.onClickFolderName}
              onMouseEnter={this.onMouseEnterFolderTitle}
              onMouseLeave={this.onMouseLeaveFolderTitle}
            >
              <div className={'back-icon' + maybeHoveringCssClass}>
                <IconContext.Provider value={{ size: '1.0em' }}>
                  <FaChevronLeft/>
                </IconContext.Provider>
              </div>
              <div className={'bookmark-list-title' + maybeHoveringCssClass}>
                { folder.name }
              </div>
            </div>
          </div>
        </div>
        <Scrollbars>
          <div className="bookmark-list-scrollable-area">
            { bookmarkComponents }
            <AddBookmarksButtonComponent/>
          </div>
        </Scrollbars>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    editingBookmarkId: state.editBookmarkState.editingBookmarkId,
    draggedRank: state.dragDropState.draggedRank,
    hoverRank: state.hoverState.hoverRank,
  };
};

const mapActionsToProps = {
  closeFolder: NavigationActions.closeFolder,
};

const Component = connect(mapStateToProps, mapActionsToProps)(BookmarkListComponent);
export { Component as BookmarkListComponent };
