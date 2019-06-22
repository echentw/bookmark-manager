import * as React from 'react';
import { GoPencil, GoClippy } from 'react-icons/go';
import { FaPen, FaCopy, FaEdit, FaGripLines } from 'react-icons/fa';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { useDrag } from 'react-dnd';
import { EditBookmarkComponent } from './EditBookmarkComponent';

import { Bookmark } from '../Bookmark';
import { AppService, AppState, DragDropService, DraggableTypes } from './AppComponent';

interface PropsBase {
  bookmark: Bookmark;
  editing: boolean;
  appService?: AppService;
}

export interface Props extends PropsBase {
  dragDropService: DragDropService;
  appState: AppState,
  rank: number,
}

interface InnerProps extends PropsBase {
  isDragging: boolean;
}

export class InnerBookmarkComponent extends React.Component<InnerProps> {

  onClickEdit = () => {
    this.props.appService.clickEditBookmark(this.props.bookmark);
  }

  onClickCopy = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    const { clientX, clientY } = event;
    this.props.appService.unleashCopiedModal(clientX, clientY);
  }

  render() {
    if (this.props.editing) {
      return (
        <EditBookmarkComponent bookmark={this.props.bookmark} appService={this.props.appService}/>
      );
    }

    const { isDragging, bookmark } = this.props;

    const classes = isDragging ? 'bookmark dragging' : 'bookmark';

    return (
      <div className={classes}>
        <img className="bookmark-favicon" src={bookmark.faviconUrl()}/>
        <a className="bookmark-text" href={bookmark.url}>{bookmark.displayName()}</a>
        <FaPen className="bookmark-icon" onClick={this.onClickEdit}/>
        <CopyToClipboard text={bookmark.url}>
          <FaCopy className="bookmark-icon" onClick={this.onClickCopy}/>
        </CopyToClipboard>
      </div>
    );
  }
}

export function BookmarkComponent(props: Props) {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: DraggableTypes.LINK,
      id: props.bookmark.id,
    },
    canDrag: monitor => props.bookmark.id !== props.appState.editingBookmarkId,
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
        appService={props.appService}
        isDragging={isDragging}
      />
    </div>
  );
}
