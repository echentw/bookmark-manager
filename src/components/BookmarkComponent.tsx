import * as React from 'react';
import { connect } from 'react-redux';

import { ChromeHelpers } from 'ChromeHelpers';
import { AppState } from 'reduxStore';
import { EditTextFieldComponent } from 'components/EditTextFieldComponent';
import { BookmarkButtonsComponent } from 'components/BookmarkButtonsComponent';
import { HoverableContainerComponent } from 'components/HoverableContainerComponent';
import { Bookmark } from 'Bookmark';
import { EditBookmarkParams } from 'actions/EditBookmarkActions';
import * as EditBookmarkActions from 'actions/EditBookmarkActions';

import { USE_SECTIONSSS } from 'components/AppComponent';

interface ExternalProps {
  bookmark: Bookmark;
  editing: boolean;
  dragging: boolean;
  hovering: boolean;

  isDragPreview?: boolean;

  // This just gets passed down to HoverableContainerComponent
  rank: number;
}

interface InternalProps extends ExternalProps {
  cancelEdit: (params: {}) => void;
  saveEdit: (params: EditBookmarkParams) => void;
}

class BookmarkComponent extends React.Component<InternalProps> {

  private textInputRef: React.RefObject<HTMLInputElement> = React.createRef();

  // These are not always accurate, since we only update the state on keydown and keyup events.
  // For example, the use can right click and then let go of the command key.
  // For this reason, we only rely on these attributes for special case bookmarks that don't begin with
  // 'http://' or 'https://'.
  private holdingCommandKey: boolean = false;
  private holdingControlKey: boolean = false;

  componentDidMount = () => {
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === 17) {
      // Started pressing control key.
      this.holdingControlKey = true;
    } else if (event.keyCode === 91 || event.keyCode === 93) {
      // Started pressing command key.
      this.holdingCommandKey = true;
    }
  }

  onKeyUp = (event: KeyboardEvent) => {
    if (event.keyCode === 17) {
      // Let go of control key.
      this.holdingControlKey = false;
    } else if (event.keyCode === 91 || event.keyCode === 93) {
       // Let go of command key.
      this.holdingCommandKey = false;
    }
  }

  onMouseDown = (event: MouseEvent) => {
    if (!this.props.editing) {
      return;
    }
    if (this.textInputRef.current.contains(event.target as Node)) {
      return;
    }
    // Clicked on something else.
    this.cancelEdit();
  }

  onClickBookmark = async (event: React.MouseEvent) => {
    const url = this.props.bookmark.url;
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      // For security reasons, Google Chrome won't open these a tags.
      // We'll have to do it manually via the API.
      event.preventDefault();
      const os = await ChromeHelpers.getPlatformOS();
      const openInNewTab = os === 'mac' ? this.holdingCommandKey : this.holdingControlKey;
      ChromeHelpers.openTabWithUrl(url, openInNewTab);
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
    const { bookmark, dragging, editing, hovering } = this.props;

    const bookmarkName = editing ? (
      <EditTextFieldComponent
        textInputRef={this.textInputRef}
        initialText={bookmark.displayName()}
        save={this.saveEdit}
        cancel={this.cancelEdit}
      />
    ) : (
      <a className="bookmark-name" href={bookmark.url} onClick={this.onClickBookmark}>
        {bookmark.displayName()}
      </a>
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

    const itemId = USE_SECTIONSSS ? bookmark.id : String(this.props.rank);

    return (
      <HoverableContainerComponent className={classes} itemId={itemId}>
        <img className="bookmark-favicon" src={bookmark.faviconUrl}/>
        { bookmarkName }
        { maybeButtons }
      </HoverableContainerComponent>
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
