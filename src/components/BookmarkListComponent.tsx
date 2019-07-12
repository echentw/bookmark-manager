import * as React from 'react';
import { connect } from 'react-redux';

import { Bookmark } from '../Bookmark';
import { BookmarkComponent } from './BookmarkComponent';
import { BookmarkContainerComponent } from './BookmarkContainerComponent';
import { AddBookmarksButtonComponent } from './AddBookmarksButtonComponent';
import { EditBookmarkComponent } from './EditBookmarkComponent';
import { AppState } from '../main';

interface Props {
  bookmarks: Bookmark[];
  editingBookmarkId: string | null;
}

class BookmarkListComponent extends React.Component<Props> {
  render() {
    const bookmarkComponents = this.props.bookmarks.map((bookmark: Bookmark, rank: number) => {
      const editing = bookmark.id === this.props.editingBookmarkId;
      return (
        <BookmarkContainerComponent
          key={bookmark.id}
          rank={rank}
        >
          <BookmarkComponent
            bookmark={bookmark}
            editing={editing}
            rank={rank}
          />
        </BookmarkContainerComponent>
      );
    });
    return (
      <div className="bookmark-list">
        { bookmarkComponents }
        <AddBookmarksButtonComponent/>
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

const asdf = connect(mapStateToProps)(BookmarkListComponent);

export { asdf as BookmarkListComponent };
