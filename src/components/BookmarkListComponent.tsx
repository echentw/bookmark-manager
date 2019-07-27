import * as React from 'react';
import { connect } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';

import { Bookmark } from '../Bookmark';
import { DraggableBookmarkComponent } from './DraggableBookmarkComponent';
import { BookmarkContainerComponent } from './BookmarkContainerComponent';
import { AddBookmarksButtonComponent } from './AddBookmarksButtonComponent';
import { EditBookmarkComponent } from './EditBookmarkComponent';
import { AppState } from './AppComponent';

interface Props {
  bookmarks: Bookmark[];
  editingBookmarkId: string | null;
}

interface State {
  hoverRank: number | null;
}

class BookmarkListComponent extends React.Component<Props, State> {
  state: State = {
    hoverRank: null,
  };

  updateHoverRank = (rank: number, hovering: boolean) => {
    if (rank === this.state.hoverRank && !hovering) {
      this.setState({ hoverRank: null });
    } else if (rank !== this.state.hoverRank && hovering) {
      this.setState({ hoverRank: rank });
    }
  }

  render() {
    const bookmarkComponents = this.props.bookmarks.map((bookmark: Bookmark, rank: number) => {
      const editing = bookmark.id === this.props.editingBookmarkId;
      return (
        <BookmarkContainerComponent
          key={bookmark.id}
          rank={rank}
        >
          <DraggableBookmarkComponent
            bookmark={bookmark}
            editing={editing}
            rank={rank}
            hovering={rank === this.state.hoverRank}
            updateHoverRank={this.updateHoverRank}
          />
        </BookmarkContainerComponent>
      );
    });
    return (
      <div className="bookmark-list">
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
    bookmarks: state.bookmarksState.bookmarks,
    editingBookmarkId: state.editBookmarkState.editingBookmarkId,
  };
};

const Component = connect(mapStateToProps)(BookmarkListComponent);
export { Component as BookmarkListComponent };
