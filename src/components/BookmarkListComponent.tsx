import * as React from 'react';

import { Bookmark } from '../Bookmark';
import { BookmarkComponent } from './BookmarkComponent';
import { BookmarkContainerComponent } from './BookmarkContainerComponent';
import { AddBookmarkButtonComponent } from './AddBookmarkButtonComponent';
import { EditBookmarkComponent } from './EditBookmarkComponent';

import { AppState, DragDropService } from './AppComponent';
import { AddBookmarksContext, EditBookmarkContext } from './contexts';

interface Props {
  appState: AppState;
  dragDropService: DragDropService;
  addBookmarksContext: AddBookmarksContext;
  editBookmarkContext: EditBookmarkContext;
}

export class BookmarkListComponent extends React.Component<Props> {
  render() {
    const { appState, dragDropService } = this.props;
    const { addBookmarksContext, editBookmarkContext } = this.props;

    const bookmarkComponents = appState.bookmarks.map((bookmark: Bookmark, rank: number) => {
      const editing = bookmark.id === editBookmarkContext.state.editingBookmarkId;
      return (
        <BookmarkContainerComponent
          key={bookmark.id}
          dragDropService={dragDropService}
          rank={rank}
        >
          <BookmarkComponent
            bookmark={bookmark}
            editing={editing}
            dragDropService={dragDropService}
            rank={rank}
            editBookmarkContext={editBookmarkContext}
          />
        </BookmarkContainerComponent>
      );
    });
    return (
      <div className="bookmark-list">
        { bookmarkComponents }
        <AddBookmarkButtonComponent add={addBookmarksContext.service.clickAddBookmarksButton}/>
      </div>
    );
  }
}
