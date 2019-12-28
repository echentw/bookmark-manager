import * as React from 'react';
import { IconContext } from 'react-icons';
import { FaLink, FaPen, FaCopy, FaTrash } from 'react-icons/fa';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { connect } from 'react-redux';

import * as CopyUrlActions from 'actions/CopyUrlActions';
import * as EditBookmarkActions from 'actions/EditBookmarkActions';
import { EditBookmarkParams } from 'actions/EditBookmarkActions';

import { Bookmark } from 'Bookmark';
import { ShowToastParams } from 'actions/CopyUrlActions';
import { AppState } from 'reduxStore';

interface ExternalProps {
  bookmark: Bookmark;
}

interface InternalProps extends ExternalProps {
  showCopyUrlToast: (params: ShowToastParams) => void;
  beginEdit: (params: EditBookmarkParams) => void;
  deleteBookmark: (params: EditBookmarkParams) => void;
}

class BookmarkButtonsComponent extends React.Component<InternalProps> {

  onClickDelete = () => {
    this.props.deleteBookmark({ bookmark: this.props.bookmark });
  }

  onClickCopy = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    const { clientX, clientY } = event;
    this.props.showCopyUrlToast({ x: clientX, y: clientY });
  }

  onClickEdit = () => {
    this.props.beginEdit({ bookmark: this.props.bookmark });
  }

  render() {
    return (
      <div className="bookmark-buttons">
        <IconContext.Provider value={{ size: '1.2em' }}>
          <CopyToClipboard text={this.props.bookmark.url}>
            <FaLink className="bookmark-button" onClick={this.onClickCopy}/>
          </CopyToClipboard>
          <FaPen className="bookmark-button" onClick={this.onClickEdit}/>
          <FaTrash className="bookmark-button" onClick={this.onClickDelete}/>
        </IconContext.Provider>
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
  deleteBookmark: EditBookmarkActions.deleteBookmark,
};

const Component = connect(mapStateToProps, mapActionsToProps)(BookmarkButtonsComponent);
export { Component as BookmarkButtonsComponent };
