import * as React from 'react';
import { GoPencil, GoClippy } from 'react-icons/go';
import { FaPen, FaCopy, FaEdit, FaGripVertical, FaGripLines } from 'react-icons/fa';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { useDrag } from 'react-dnd';
import { EditLinkComponent } from './EditLinkComponent';

import { Link } from '../Link';
import { AppService, AppState, DragDropService, DraggableTypes } from './AppComponent';

interface PropsBase {
  link: Link;
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

export class InnerLinkComponent extends React.Component<InnerProps> {

  onClickEdit = () => {
    this.props.appService.clickEditLink(this.props.link);
  }

  onClickCopy = () => {
    // TODO: display a small modal
    console.log('url copied!');
  }

  onClickUrl = (event: React.MouseEvent<HTMLInputElement>) => {
    if (!this.props.editing) {
      window.open(this.props.link.url);
    }
  }

  render() {
    const classes = this.props.isDragging ? 'link dragging' : 'link';

    if (this.props.editing) {
      return (
        <EditLinkComponent link={this.props.link} appService={this.props.appService}/>
      );
    }

    return (
      <div className={classes}>
        <FaGripVertical className="link-icon-grip"/>
        <button className="link-favicon"></button>
        <div className="link-text" onClick={this.onClickUrl}>{this.props.link.url}</div>
        <FaPen className="link-icon" onClick={this.onClickEdit}/>
        <CopyToClipboard text={this.props.link.url} onCopy={this.onClickCopy}>
          <FaCopy className="link-icon"/>
        </CopyToClipboard>
      </div>
    );
  }
}

export function LinkComponent(props: Props) {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: DraggableTypes.LINK,
      id: props.link.id,
    },
    canDrag: monitor => props.link.id !== props.appState.editingLinkId,
    begin: monitor => props.dragDropService.beginDrag(props.rank),
    end: monitor => props.dragDropService.endDrag(props.rank),
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  return (
    <div ref={drag}>
      <InnerLinkComponent
        link={props.link}
        editing={props.editing}
        appService={props.appService}
        isDragging={isDragging}
      />
    </div>
  );
}
