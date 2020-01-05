import * as React from 'react';
import { connect } from 'react-redux';
import { FaPlus } from 'react-icons/fa';

import { AppState } from 'reduxStore';
import { Folder } from 'Folder';
import { Bookmark } from 'Bookmark';
import { DraggableType } from 'components/AppComponent';
import * as AddBookmarksActions from 'actions/AddBookmarksActions';
import { ExternalShowModalParams } from 'actions/AddBookmarksActions';

import { BookmarkComponent } from 'components/BookmarkComponent';
import { DraggableBookmarkContainerComponent } from 'components/Sections/DraggableBookmarkContainerComponent';

interface ExternalProps {
  folder: Folder;
  rank: number;
}

interface InternalProps extends ExternalProps {
  editingBookmarkId: string | null;
  hoverItemId: string | null;
  draggedFolderRank: number | null;
  draggedBookmarkRank: number | null;
  showAddBookmarksModal: (params: ExternalShowModalParams) => void;
}

class SectionComponent extends React.Component<InternalProps> {
  onClickAddBookmarks = () => {
    this.props.showAddBookmarksModal({ folder: this.props.folder });
  }

  render() {
    const { folder } = this.props;

    const bookmarkComponents = folder.bookmarks.map((bookmark: Bookmark, rank: number) => {
      const editing = bookmark.id === this.props.editingBookmarkId;
      const dragging = (
        this.props.rank === this.props.draggedFolderRank && rank === this.props.draggedBookmarkRank
      );
      if (bookmark.id === 'hrIincnr') {
        console.log(`bookmark: ${bookmark.id}, ${this.props.rank}, ${rank}`);
      }
      const hovering = bookmark.id === this.props.hoverItemId;
      const draggable = !editing;
      return (
        <DraggableBookmarkContainerComponent
          key={bookmark.id}
          id={bookmark.id}
          folderRank={this.props.rank}
          bookmarkRank={rank}
          draggable={draggable}
        >
          <BookmarkComponent
            bookmark={bookmark}
            editing={editing}
            dragging={dragging}
            hovering={hovering}
            rank={rank}
          />
        </DraggableBookmarkContainerComponent>
      );
    });

    return (
      <div className="section">
        <div className="section-name-container">
          <div className="section-name">
            { folder.name }
          </div>
        </div>
        <div className="section-bookmarks">
          { bookmarkComponents }
        </div>
        <div className="add-bookmark-button-container">
          <div className="add-bookmark-button" onClick={this.onClickAddBookmarks}>
            <FaPlus className="add-bookmark-icon"/>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    editingBookmarkId: state.editBookmarkState.editingBookmarkId,
    draggedBookmarkRank: state.dragBookmarkState.bookmarkRank,
    draggedFolderRank: state.dragBookmarkState.folderRank,
    hoverItemId: state.hoverState.hoverItemId,
  };
};

const mapActionsToProps = {
  showAddBookmarksModal: AddBookmarksActions.showModal,
};

const Component = connect(mapStateToProps, mapActionsToProps)(SectionComponent);
export { Component as SectionComponent };
