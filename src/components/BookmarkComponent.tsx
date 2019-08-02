import * as React from 'react';
import { connect } from 'react-redux';

import { AppState } from './AppComponent';
import { EditTextFieldComponent } from './EditTextFieldComponent';
import { BookmarkButtonsComponent } from './BookmarkButtonsComponent';
import { HoverableListItemComponent } from './HoverableListItemComponent';
import { Bookmark } from '../Bookmark';
import { EditBookmarkParams } from '../actions/EditBookmarkActions';
import * as EditBookmarkActions from '../actions/EditBookmarkActions';

interface ExternalProps {
  bookmark: Bookmark;
  editing: boolean;
  dragging: boolean;
  hovering: boolean;

  isDragPreview?: boolean;

  // This just gets passed down to HoverableListItemComponent
  rank: number;
}

interface InternalProps extends ExternalProps {
  cancelEdit: (params: {}) => void;
  saveEdit: (params: EditBookmarkParams) => void;
}

class BookmarkComponent extends React.Component<InternalProps> {

  saveEdit = (newName: string) => {
    const name = (newName.length === 0) ? null : newName;
    const newBookmark = this.props.bookmark.withName(name);
    this.props.saveEdit({ bookmark: newBookmark });
  }

  cancelEdit = () => {
    this.props.cancelEdit({});
  }

  render() {
    const { editing, hovering, dragging, bookmark } = this.props;

    const bookmarkName = editing ? (
      <EditTextFieldComponent
        initialText={bookmark.displayName()}
        save={this.saveEdit}
        cancel={this.cancelEdit}
      />
    ) : (
      <a className="bookmark-name" href={bookmark.url}>{bookmark.displayName()}</a>
    );

    const shouldShowButtons = this.props.isDragPreview || (hovering && !editing);
    const shouldShowBoxShadow = shouldShowButtons || editing;

    const maybeButtons = shouldShowButtons ? <BookmarkButtonsComponent bookmark={bookmark}/> : null;

    let classes = 'bookmark';
    if (dragging) {
      classes += ' vanished';
    }
    if (shouldShowBoxShadow) {
      classes += ' with-shadow';
    }

    return (
      <HoverableListItemComponent className={classes} rank={this.props.rank}>
        <img className="bookmark-favicon" src={bookmark.faviconUrl}/>
        { bookmarkName }
        { maybeButtons }
      </HoverableListItemComponent>
    );
  }
}

const mapStateToProps = (state: AppState, props: ExternalProps) => {
  return {};
};

const mapActionsToProps = {
  cancelEdit: EditBookmarkActions.cancel,
  saveEdit: EditBookmarkActions.save,
};

const Component = connect(mapStateToProps, mapActionsToProps)(BookmarkComponent);
export { Component as BookmarkComponent };
