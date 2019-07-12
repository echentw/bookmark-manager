import * as React from 'react';
import { FaPen, FaCopy, FaEdit, FaGripLines } from 'react-icons/fa';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { connect } from 'react-redux';

import * as CopyUrlActions from '../actions/CopyUrlActions';
import * as EditBookmarkActions from '../actions/EditBookmarkActions';
import { ShowToastParams } from '../actions/CopyUrlActions';
import { EditBookmarkParams } from '../actions/EditBookmarkActions';
import { AppState } from './AppComponent';

import { EditBookmarkComponent } from './EditBookmarkComponent';
import { Bookmark } from '../Bookmark';

interface ExternalProps {
  bookmark: Bookmark;
  editing: boolean;
  isDragging: boolean;
}

interface InternalProps extends ExternalProps {
  showCopyUrlToast: (params: ShowToastParams) => void;
  beginEdit: (params: EditBookmarkParams) => void;
}

class BookmarkComponent extends React.Component<InternalProps> {

  onClickEdit = () => {
    this.props.beginEdit({ bookmark: this.props.bookmark });
  }

  onClickCopy = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    const { clientX, clientY } = event;
    this.props.showCopyUrlToast({ x: clientX, y: clientY });
  }

  render() {
    if (this.props.editing) {
      return (
        <EditBookmarkComponent bookmark={this.props.bookmark}/>
      );
    }

    const { isDragging, bookmark } = this.props;

    const classes = isDragging ? 'bookmark dragging' : 'bookmark';

    return (
      <div className={classes}>
        <img className="bookmark-favicon" src={bookmark.faviconUrl}/>
        <a className="bookmark-text" href={bookmark.url}>{bookmark.displayName()}</a>
        <FaPen className="bookmark-icon" onClick={this.onClickEdit}/>
        <CopyToClipboard text={bookmark.url}>
          <FaCopy className="bookmark-icon" onClick={this.onClickCopy}/>
        </CopyToClipboard>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: ExternalProps) => {
  return {};
};

const mapActionsToProps = {
  showCopyUrlToast: CopyUrlActions.showToast,
  beginEdit: EditBookmarkActions.beginEdit,
};

const Component = connect(mapStateToProps, mapActionsToProps)(BookmarkComponent);
export { Component as BookmarkComponent };
