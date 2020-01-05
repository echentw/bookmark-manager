import * as React from 'react';
import { connect } from 'react-redux';
import { FaPlus } from 'react-icons/fa';

import { AppState } from 'reduxStore';
import { Folder } from 'Folder';
import { Bookmark } from 'Bookmark';
import { DraggableType } from 'components/AppComponent';

import * as AddBookmarksActions from 'actions/AddBookmarksActions';
import { ExternalShowModalParams } from 'actions/AddBookmarksActions';
import * as DragBookmarkActions from 'actions/DragBookmarkActions';
import { DragBookmarkParams, DropBookmarkParams } from 'actions/DragBookmarkActions';

import { BookmarkComponent } from 'components/BookmarkComponent';
import { DragSourceContainerComponent } from 'components/Sections/DragSourceContainerComponent';
import { DropTargetContainerComponent } from 'components/Sections/DropTargetContainerComponent';

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
  beginDrag: (params: DragBookmarkParams) => void;
  endDrag: (params: DropBookmarkParams) => void;
  isOver: (params: DragBookmarkParams) => void;
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
      const hovering = bookmark.id === this.props.hoverItemId;
      const draggable = !editing;
      return (
        <DropTargetContainerComponent
          key={bookmark.id}
          className="list-item-container"
          draggableType={DraggableType.Bookmark}
          isOver={() => this.props.isOver({ folderRank: this.props.rank, bookmarkRank: rank })}
        >
          <DragSourceContainerComponent
            draggableType={DraggableType.Bookmark}
            beginDrag={() => this.props.beginDrag({ folderRank: this.props.rank, bookmarkRank: rank })}
            endDrag={(trueDrop: boolean) => this.props.endDrag({ trueDrop })}
            draggable={draggable}
          >
            <BookmarkComponent
              bookmark={bookmark}
              editing={editing}
              dragging={dragging}
              hovering={hovering}
              rank={rank}
            />
          </DragSourceContainerComponent>
        </DropTargetContainerComponent>
      );
    });

    return (
      <div className="section">
        <DropTargetContainerComponent
          className="section-name-container"
          draggableType={DraggableType.Bookmark}
          isOver={() => this.props.isOver({ folderRank: this.props.rank, bookmarkRank: -1 })}
        >
          <div className="section-name">
            { folder.name }
          </div>
        </DropTargetContainerComponent>
        <div className="section-bookmarks">
          { bookmarkComponents }
        </div>
        <DropTargetContainerComponent
          className="add-bookmark-button-container"
          draggableType={DraggableType.Bookmark}
          isOver={() => this.props.isOver({ folderRank: this.props.rank, bookmarkRank: folder.bookmarks.length })}
        >
          <div className="add-bookmark-button" onClick={this.onClickAddBookmarks}>
            <FaPlus className="add-bookmark-icon"/>
          </div>
        </DropTargetContainerComponent>
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
  beginDrag: DragBookmarkActions.begin,
  endDrag: DragBookmarkActions.end,
  isOver: DragBookmarkActions.isOver,
};

const Component = connect(mapStateToProps, mapActionsToProps)(SectionComponent);
export { Component as SectionComponent };
