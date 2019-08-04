import * as React from 'react';
import { connect } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';
import { IconContext } from 'react-icons';
import { FaChevronLeft } from 'react-icons/fa';

import { Bookmark } from '../Bookmark';
import { Folder } from '../Folder';
import * as FolderActions from '../actions/FolderActions';
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

class BookmarkListComponent extends React.Component<InternalProps> {

  onClickFolderName = () => {
    this.props.closeFolder({});
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

    return (
      <div className="bookmark-list">
        <div className="bookmark-list-title-container">
          <IconContext.Provider value={{ size: '1.6em' }}>
            <FaChevronLeft onClick={this.onClickFolderName}/>
          </IconContext.Provider>
          <div className="bookmark-list-title" onClick={this.onClickFolderName}>
            { folder.name }
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
  closeFolder: FolderActions.closeFolder,
};

const Component = connect(mapStateToProps, mapActionsToProps)(BookmarkListComponent);
export { Component as BookmarkListComponent };
