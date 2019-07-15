import * as React from 'react';
import { connect } from 'react-redux';

import { AppState } from './AppComponent';
import { EditBookmarkComponent } from './EditBookmarkComponent';
import { BookmarkButtonsComponent } from './BookmarkButtonsComponent';
import { Bookmark } from '../Bookmark';

interface ExternalProps {
  bookmark: Bookmark;
  editing: boolean;
  isDragging: boolean;
  isDragPreview?: boolean;
}

interface InternalProps extends ExternalProps {
  somethingIsDragging: boolean; // whether the user is dragging anything at all
}

interface State {
  mouseHover: boolean;
}

class BookmarkComponent extends React.Component<InternalProps, State> {
  state = {
    mouseHover: false,
  };

  onMouseEnter = () => {
    if (!this.props.somethingIsDragging) {
      this.setState({ mouseHover: true });
    }
  }

  onMouseLeave = () => {
    if (!this.props.somethingIsDragging) {
      this.setState({ mouseHover: false });
    }
  }

  render() {
    const { editing, isDragging, bookmark } = this.props;

    const bookmarkName = editing ? (
      <EditBookmarkComponent bookmark={bookmark}/>
    ) : (
      <a className="bookmark-text" href={bookmark.url}>{bookmark.displayName()}</a>
    );

    const maybeButtons = (this.props.isDragPreview || (this.state.mouseHover && !editing)) ? (
      <BookmarkButtonsComponent bookmark={bookmark}/>
    ) : null;

    const classes = isDragging ? 'bookmark dragging' : 'bookmark';

    return (
      <div className={classes} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <img className="bookmark-favicon" src={bookmark.faviconUrl}/>
        { bookmarkName }
        { maybeButtons }
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: ExternalProps) => {
  return {
    somethingIsDragging: state.dragDropState.dragging,
  };
};

const Component = connect(mapStateToProps)(BookmarkComponent);
export { Component as BookmarkComponent };
