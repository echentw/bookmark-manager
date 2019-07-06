import * as React from 'react';

import { Bookmark } from '../Bookmark';
import { BookmarkComponent } from './BookmarkComponent';
import { BookmarkContainerComponent } from './BookmarkContainerComponent';
import { AddBookmarkButtonComponent } from './AddBookmarkButtonComponent';
import { EditBookmarkComponent } from './EditBookmarkComponent';

import { AppService, AppState, DragDropService } from './AppComponent';
import { CopyUrlContext, EditBookmarkContext } from './contexts';

interface Props {
  appService: AppService;
  appState: AppState;
  dragDropService: DragDropService;
  editBookmarkContext: EditBookmarkContext;
  copyUrlContext: CopyUrlContext;
}

export class BookmarkListComponent extends React.Component<Props> {
  render() {
    const { appService, appState, dragDropService } = this.props;
    const { copyUrlContext, editBookmarkContext } = this.props;

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
            appService={appService}
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
        <AddBookmarkButtonComponent add={appService.clickAddBookmark}/>
      </div>
    );
  }
}
