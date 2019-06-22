import * as React from 'react';

import { Bookmark } from '../Bookmark';
import { BookmarkComponent } from './BookmarkComponent';
import { BookmarkContainerComponent } from './BookmarkContainerComponent';
import { AddBookmarkComponent } from './AddBookmarkComponent';
import { EditBookmarkComponent } from './EditBookmarkComponent';

import { AppService, AppState, DragDropService } from './AppComponent';

interface Props {
  appService: AppService;
  appState: AppState;
  dragDropService: DragDropService;
}

export class BookmarksPaneComponent extends React.Component<Props> {
  render() {
    const { appService, appState, dragDropService } = this.props;

    const bookmarkComponents = appState.bookmarks.map((bookmark: Bookmark, rank: number) => {
      const editing = bookmark.id === appState.editingBookmarkId;
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
          />
        </BookmarkContainerComponent>
      );
    });
    return (
      <div className="bookmarks-pane">
        { bookmarkComponents }
        <AddBookmarkComponent add={appService.clickAddBookmark}/>
      </div>
    );
  }
}
