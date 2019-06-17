import * as React from 'react';
import { GoPencil, GoClippy } from 'react-icons/go';
import { FaPen, FaCopy, FaEdit, FaGripVertical, FaGripLines } from 'react-icons/fa';
import * as CopyToClipboard from 'react-copy-to-clipboard';

import { Link } from '../Link';

import { AppActions, AppState } from './AppComponent';

interface Props {
  link: Link;
  focused: boolean;
  actions: AppActions;
}

export class LinkComponent extends React.Component<Props> {

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
    console.log('url copied!');
  }


  componentDidUpdate = () => {
    if (this.props.focused) {
      console.log('calling focus');
      this.textInput.focus();
    }
  }

  componentDidMount = () => {
    if (this.props.focused) {
      console.log('calling focus 2');
      this.textInput.focus();
    }
  }

  render() {
    return (
      <div className="link">
        <FaGripVertical className="link-icon"/>
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
