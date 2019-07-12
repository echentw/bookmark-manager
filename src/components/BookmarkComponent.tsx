import * as React from 'react';
import { GoPencil, GoClippy } from 'react-icons/go';
import { FaPen, FaCopy, FaEdit, FaGripLines } from 'react-icons/fa';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { useDrag } from 'react-dnd';
import { connect } from 'react-redux';

import * as CopyUrlActions from '../actions/CopyUrlActions';
import * as EditBookmarkActions from '../actions/EditBookmarkActions';
import * as DragDropActions from '../actions/DragDropActions';
import { ShowToastParams, HideToastParams } from '../actions/CopyUrlActions';
import { EditBookmarkParams } from '../actions/EditBookmarkActions';
import { DragDropParams } from '../actions/DragDropActions';
import { Action } from '../actions/constants';
import { AppState } from './AppComponent';

import { EditBookmarkComponent } from './EditBookmarkComponent';
import { Bookmark } from '../Bookmark';
import { DraggableTypes } from './AppComponent';

interface ExternalProps {
  bookmark: Bookmark;
  editing: boolean;
  rank: number;
}

interface PropsBase {
  bookmark: Bookmark;
  editing: boolean;
  beginEdit?: (params: EditBookmarkParams) => void;
  beginDrag?: (params: DragDropParams) => void;
  endDrag?: (params: DragDropParams) => void;
  showCopyUrlToast?: (params: ShowToastParams) => void;
  hideCopyUrlToast?: (params: HideToastParams) => void;
}

export interface Props extends PropsBase {
  editingBookmarkId: string | null;
  rank: number;
}

interface InnerProps extends PropsBase {
  isDragging: boolean;
}

export class InnerBookmarkComponent extends React.Component<InnerProps> {

  onClickEdit = () => {
    this.props.beginEdit({ bookmark: this.props.bookmark });
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

function BookmarkComponent(props: Props) {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: DraggableTypes.Bookmark,
      id: props.bookmark.id,
    },
    canDrag: monitor => props.bookmark.id !== props.editingBookmarkId,
    begin: monitor => {
      props.beginDrag({ rank: props.rank });
      return;
    },
    end: monitor => {
      props.endDrag({ rank: props.rank });
      return;
    },
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
        showCopyUrlToast={props.showCopyUrlToast}
        hideCopyUrlToast={props.hideCopyUrlToast}
        beginEdit={props.beginEdit}
        endDrag={props.endDrag}
      />
    </div>
  );
}

const mapStateToProps = (state: AppState, props: ExternalProps) => {
  return {
    editingBookmarkId: state.editBookmarkState.editingBookmarkId,
  };
};

const mapActionsToProps = {
  showCopyUrlToast: CopyUrlActions.showToast,
  hideCopyUrlToast: CopyUrlActions.hideToast,
  beginEdit: EditBookmarkActions.beginEdit,
  beginDrag: DragDropActions.beginDrag,
  endDrag: DragDropActions.endDrag,
};

const Component = connect(mapStateToProps, mapActionsToProps)(BookmarkComponent);
export { Component as BookmarkComponent };
