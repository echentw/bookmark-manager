import * as React from 'react';

import { EditBookmarkComponent } from './EditBookmarkComponent';
import { BookmarkButtonsComponent } from './BookmarkButtonsComponent';
import { Bookmark } from '../Bookmark';

interface Props {
  bookmark: Bookmark;
  editing: boolean;
  isDragging: boolean;
}

export class BookmarkComponent extends React.Component<Props> {
  render() {
    const { editing, isDragging, bookmark } = this.props;

    const bookmarkName = editing ? (
      <EditBookmarkComponent bookmark={bookmark}/>
    ) : (
      <a className="bookmark-text" href={bookmark.url}>{bookmark.displayName()}</a>
    );

    const maybeButtons = editing ? (
      null
    ) : (
      <BookmarkButtonsComponent bookmark={bookmark}/>
    );

    const classes = isDragging ? 'bookmark dragging' : 'bookmark';

    return (
      <div className={classes}>
        <img className="bookmark-favicon" src={bookmark.faviconUrl}/>
        { bookmarkName }
        { maybeButtons }
      </div>
    );
  }
}
