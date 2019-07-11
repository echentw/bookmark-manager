import * as React from 'react';
import { GoPencil, GoClippy } from 'react-icons/go';
import { FaPen, FaCopy, FaEdit, FaGripLines } from 'react-icons/fa';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { useDrag } from 'react-dnd';
import { connect } from 'react-redux';

import * as CopyUrlActions from '../actions/CopyUrlActions';
import { Action } from '../actions/constants';
import { AppState } from '../reducers';

import { EditBookmarkComponent } from './EditBookmarkComponent';
import { Bookmark } from '../Bookmark';
import { DragDropService, DraggableTypes } from './AppComponent';
import { EditBookmarkContext } from './contexts';

interface PropsBase {
  bookmark: Bookmark;
  editing: boolean;
  editBookmarkContext?: EditBookmarkContext;
  showCopyUrlToast?: (params: CopyUrlActions.ShowToastParams) => Action<CopyUrlActions.ShowToastParams>;
  hideCopyUrlToast?: (params: CopyUrlActions.HideToastParams) => Action<CopyUrlActions.HideToastParams>;
}

export interface Props extends PropsBase {
  dragDropService: DragDropService;
  rank: number;
}

interface InnerProps extends PropsBase {
  isDragging: boolean;
}

export class InnerBookmarkComponent extends React.Component<InnerProps> {

  onClickEdit = () => {
    this.props.editBookmarkContext.service.clickEditBookmarkButton(this.props.bookmark);
  }

  onClickCopy = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    const { clientX, clientY } = event;

    const timeoutId = setTimeout(() => {
      this.props.hideCopyUrlToast({ timeoutId: timeoutId });
    }, 1000);

    this.props.showCopyUrlToast({
      timeoutId: timeoutId,
      position: {
        x: clientX,
        y: clientY,
      },
    });
  }

  render() {
    if (this.props.editing) {
      return (
        <EditBookmarkComponent
          bookmark={this.props.bookmark}
          editBookmarkContext={this.props.editBookmarkContext}
        />
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

function BookmarkComponent(props: Props) {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: DraggableTypes.LINK,
      id: props.bookmark.id,
    },
    canDrag: monitor => props.bookmark.id !== props.editBookmarkContext.state.editingBookmarkId,
    begin: monitor => props.dragDropService.beginDrag(props.rank),
    end: monitor => props.dragDropService.endDrag(props.rank),
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  return (
    <div ref={drag}>
      <InnerBookmarkComponent
        bookmark={props.bookmark}
        editing={props.editing}
        isDragging={isDragging}
        editBookmarkContext={props.editBookmarkContext}
        showCopyUrlToast={props.showCopyUrlToast}
        hideCopyUrlToast={props.hideCopyUrlToast}
      />
    </div>
  );
}

const mapStateToProps = (state: AppState, props: Props) => {
  return {
    copyUrlState: state.copyUrlState,
  };
};

const mapActionsToProps = {
  showCopyUrlToast: CopyUrlActions.showToast,
  hideCopyUrlToast: CopyUrlActions.hideToast,
};

const asdf = connect(mapStateToProps, mapActionsToProps)(BookmarkComponent);

export { asdf as BookmarkComponent };
