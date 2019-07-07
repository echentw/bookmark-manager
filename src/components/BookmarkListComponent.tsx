import * as React from 'react';

import { Bookmark } from '../Bookmark';
import { BookmarkComponent } from './BookmarkComponent';
import { BookmarkContainerComponent } from './BookmarkContainerComponent';
import { AddBookmarkButtonComponent } from './AddBookmarkButtonComponent';
import { EditBookmarkComponent } from './EditBookmarkComponent';

import { AppState, DragDropService } from './AppComponent';
import { AddBookmarksContext, CopyUrlContext, EditBookmarkContext } from './contexts';

interface Props {
  appState: AppState;
  dragDropService: DragDropService;
  addBookmarksContext: AddBookmarksContext;
  editBookmarkContext: EditBookmarkContext;
  copyUrlContext: CopyUrlContext;
}

export class BookmarkListComponent extends React.Component<Props> {
  render() {
    const { appState, dragDropService } = this.props;
    const { addBookmarksContext, copyUrlContext, editBookmarkContext } = this.props;

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
            appState={appState}
            dragDropService={dragDropService}
            rank={rank}
            editBookmarkContext={editBookmarkContext}
            copyUrlContext={copyUrlContext}
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
