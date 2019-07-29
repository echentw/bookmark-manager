import * as React from 'react';
import { connect } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';
import { IconContext } from 'react-icons';
import { FaChevronLeft } from 'react-icons/fa';

import { Bookmark } from '../Bookmark';
import { Folder } from '../Folder';
import { DraggableBookmarkComponent } from './DraggableBookmarkComponent';
import { ListItemContainerComponent } from './ListItemContainerComponent';
import { AddBookmarksButtonComponent } from './AddBookmarksButtonComponent';
import { EditBookmarkComponent } from './EditBookmarkComponent';
import { AppState, DraggableType } from './AppComponent';

interface Props {
  folder: Folder;
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
    const folderName = this.props.folder ? this.props.folder.name : 'This should not appear!';

    const bookmarkComponents = this.props.bookmarks.map((bookmark: Bookmark, rank: number) => {
      const editing = bookmark.id === this.props.editingBookmarkId;
      return (
        <ListItemContainerComponent
          key={bookmark.id}
          rank={rank}
          draggableType={DraggableType.Bookmark}
        >
          <DraggableBookmarkComponent
            bookmark={bookmark}
            editing={editing}
            rank={rank}
            hovering={rank === this.state.hoverRank}
            updateHoverRank={this.updateHoverRank}
          />
        </ListItemContainerComponent>
      );
    });
    return (
      <div className="bookmark-list">
        <div className="bookmark-list-title-container">
          <IconContext.Provider value={{ size: '1.6em' }}>
            <FaChevronLeft/>
          </IconContext.Provider>
          <div className="bookmark-list-title">
            { folderName }
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
    folder: state.foldersState.openFolder,
    bookmarks: state.bookmarksState.bookmarks,
    editingBookmarkId: state.editBookmarkState.editingBookmarkId,
  };
};

const Component = connect(mapStateToProps)(BookmarkListComponent);
export { Component as BookmarkListComponent };
