import * as React from 'react';
import { GoPencil, GoClippy } from 'react-icons/go';
import { FaPen, FaCopy, FaEdit, FaGripVertical, FaGripLines } from 'react-icons/fa';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { useDrag } from 'react-dnd';
// import { getEmptyImage } from 'react-dnd-html5-backend';

import { Link } from '../Link';
import { AppActions, AppState, DragDropService, DraggableTypes } from './AppComponent';

interface PropsBase {
  link: Link;
  focused: boolean;
  actions?: AppActions;
}

export interface Props extends PropsBase {
  dragDropService: DragDropService;
  rank: number,
}

interface InnerProps extends PropsBase {
  isDragging: boolean;
}

export class InnerLinkComponent extends React.Component<InnerProps> {

  // TODO: what is the type of this supposed to be?
  textInput: any = null;

  onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = event.target.value;
    const newLink = this.props.link.withUrl(newUrl);
    this.props.actions.finishEditingLink(newLink);
  }

  onBlurHandler = () => {
    this.props.actions.blurLink(this.props.link);
  }

  onKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const keyCodes = [
      13, // Enter
      27, // Escape
    ];
    if (keyCodes.find((keyCode) => keyCode === event.keyCode)) {
      this.textInput.blur();
    }
  }

  onClickEdit = () => {
    this.props.actions.clickEditLink(this.props.link);
  }

  onClickCopy = () => {
    // TODO: display a small modal
    console.log('url copied!');
  }

  onClickHandler = (event: React.MouseEvent<HTMLInputElement>) => {
    if (event.target === this.textInput && !this.props.focused) {
      window.open(this.props.link.url);
    }
  }

  componentDidUpdate = () => {
    if (this.props.focused) {
      this.textInput.focus();
    }
  }

  componentDidMount = () => {
    if (this.props.focused) {
      this.textInput.focus();
    }
  }

  render() {
    const classes = this.props.isDragging ? 'link dragging' : 'link';

    return (
      <div className={classes} onClick={this.onClickHandler}>
        <FaGripVertical className="link-icon-grip"/>
        <button className="link-favicon"></button>
        <input
          className="link-text"
          disabled={!this.props.focused}
          onBlur={this.onBlurHandler}
          onKeyDown={this.onKeyDownHandler}
          value={this.props.link.url}
          onChange={this.onChangeHandler}
          ref={(input) => this.textInput = input}
        />
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
        focused={props.focused}
        actions={props.actions}
        isDragging={isDragging}
      />
    </div>
  );
}
