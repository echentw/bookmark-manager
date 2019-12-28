import * as React from 'react';
import { connect } from 'react-redux';
import { FaPlus } from 'react-icons/fa';

import { AppState } from 'reduxStore';
import { Folder } from 'Folder';
import { Bookmark } from 'Bookmark';
import { DraggableType } from 'components/AppComponent';
import { BookmarkComponent } from 'components/BookmarkComponent';

interface ExternalProps {
  folder: Folder;
}

interface InternalProps extends ExternalProps {
  editingBookmarkId: string | null;
  hoverItemId: string | null;
}

class SectionComponent extends React.Component<InternalProps> {
  render() {
    const { folder } = this.props;

    const bookmarkComponents = folder.bookmarks.map((bookmark: Bookmark, rank: number) => {
      const editing = bookmark.id === this.props.editingBookmarkId;
      // const dragging = rank === this.props.draggedRank;
      const hovering = bookmark.id === this.props.hoverItemId;
      // const draggable = !editing;
      return (
        <div className="list-item-container" key={bookmark.id}>
          <BookmarkComponent
            bookmark={bookmark}
            editing={editing}
            dragging={false}
            hovering={hovering}
            rank={rank}
          />
        </div>
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
          <div className="add-bookmark-button">
            <FaPlus className="add-bookmark-icon" onClick={() => console.log('you clicked')}/>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {
    editingBookmarkId: state.editBookmarkState.editingBookmarkId,
    hoverItemId: state.hoverState.hoverItemId,
  };
};

const Component = connect(mapStateToProps)(SectionComponent);
export { Component as SectionComponent };
