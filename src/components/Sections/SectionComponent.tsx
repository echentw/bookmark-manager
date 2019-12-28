import * as React from 'react';
import { connect } from 'react-redux';
import { FaPlus } from 'react-icons/fa';

import { AppState } from 'reduxStore';
import { Folder } from 'Folder';
import { Bookmark } from 'Bookmark';
import { DraggableType } from 'components/AppComponent';
import { BookmarkComponent } from 'components/BookmarkComponent';

interface Props {
  folder: Folder;
}

class SectionComponent extends React.Component<Props> {
  render() {
    const { folder } = this.props;

    const bookmarkComponents = folder.bookmarks.map((bookmark: Bookmark, rank: number) => {
      // const editing = bookmark.id === this.props.editingBookmarkId;
      // const dragging = rank === this.props.draggedRank;
      // const hovering = rank === this.props.hoverRank;
      // const draggable = !editing;
      return (
        <div className="list-item-container">
          <BookmarkComponent
            bookmark={bookmark}
            editing={false}
            dragging={false}
            hovering={false}
            rank={rank}
          />
        </div>
      );
    });

    return (
      <div className="section">
        <div className="section-name">
          { folder.name }
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
  return {};
};

const Component = connect(mapStateToProps)(SectionComponent);
export { Component as SectionComponent };
