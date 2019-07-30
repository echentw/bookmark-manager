import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import { AppState } from './AppComponent';
import { EditTextFieldComponent } from './EditTextFieldComponent';
import { BookmarkButtonsComponent } from './BookmarkButtonsComponent';
import { Bookmark } from '../Bookmark';
import { EditBookmarkParams } from '../actions/EditBookmarkActions';
import * as EditBookmarkActions from '../actions/EditBookmarkActions';

export const isMouseOverElement = (element: Element, x: number, y: number) => {
  const { left, right, bottom, top } = element.getBoundingClientRect();
  return x > left && x < right && y > top && y < bottom;
}

interface ExternalProps {
  bookmark: Bookmark;
  editing: boolean;
  isDragging: boolean;
  isDragPreview?: boolean;
  hovering: boolean;
  updateHoverRank: (rank: number, hovering: boolean) => void;
  rank: number;
}

interface InternalProps extends ExternalProps {
  somethingIsDragging: boolean; // whether the user is dragging anything at all
  cancelEdit: (params: {}) => void;
  saveEdit: (params: EditBookmarkParams) => void;
}

interface State {
  isMouseOver: boolean;
}

class BookmarkComponent extends React.Component<InternalProps, State> {
  state = {
    isMouseOver: false,
  };

  private element: HTMLDivElement = null;

  onMouseEnter = () => {
    if (!this.props.somethingIsDragging) {
      this.props.updateHoverRank(this.props.rank, true);
    }
  }

  onMouseLeave = () => {
    if (!this.props.somethingIsDragging) {
      this.props.updateHoverRank(this.props.rank, false);
    }
  }

  onDragEnter = () => {
    this.props.updateHoverRank(this.props.rank, true);
  }

  onDragLeave = () => {
    this.props.updateHoverRank(this.props.rank, false);
  }

  onDragEnd = (event: React.DragEvent) => {
    const { clientX, clientY } = event;
    const element = findDOMNode(this.element) as Element;
    const isMouseOver = isMouseOverElement(element, clientX, clientY);
    if (isMouseOver !== this.state.isMouseOver) {
      this.props.updateHoverRank(this.props.rank, isMouseOver);
    }
  }

  saveEdit = (newName: string) => {
    const name = (newName.length === 0) ? null : newName;
    const newBookmark = this.props.bookmark.withName(name);
    this.props.saveEdit({ bookmark: newBookmark });
  }

  cancelEdit = () => {
    this.props.cancelEdit({});
  }

  render() {
    const { editing, isDragging, bookmark } = this.props;

    const bookmarkName = editing ? (
      <EditTextFieldComponent
        initialText={bookmark.displayName()}
        save={this.saveEdit}
        cancel={this.cancelEdit}
      />
    ) : (
      <a className="bookmark-name" href={bookmark.url}>{bookmark.displayName()}</a>
    );

    const shouldShowButtons = this.props.isDragPreview || (this.props.hovering && !editing);
    const shouldShowBoxShadow = shouldShowButtons || editing;

    const maybeButtons = shouldShowButtons ? <BookmarkButtonsComponent bookmark={bookmark}/> : null;

    let classes = 'bookmark';
    if (isDragging) {
      classes += ' vanished';
    }
    if (shouldShowBoxShadow) {
      classes += ' with-shadow';
    }

    return (
      <div className={classes}
        ref={(elem) => this.element = elem}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDragEnd={this.onDragEnd}
      >
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

const mapActionsToProps = {
  cancelEdit: EditBookmarkActions.cancel,
  saveEdit: EditBookmarkActions.save,
};

const Component = connect(mapStateToProps, mapActionsToProps)(BookmarkComponent);
export { Component as BookmarkComponent };
