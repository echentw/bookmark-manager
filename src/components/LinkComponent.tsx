import * as React from 'react';

import { Link } from '../Link';

interface Props {
  link: Link;
  edit: (newLink: Link) => void;
  focused: boolean;
  onClickEdit: (link: Link) => void;
  onBlur: () => void;
}

export class LinkComponent extends React.Component<Props> {

  // TODO: what is the type of this supposed to be?
  textInput: any = null;

  onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = event.target.value;
    const newLink = this.props.link.withUrl(newUrl);
    this.props.edit(newLink);
  }

  onBlurHandler = () => {
    this.props.onBlur();
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
    this.props.onClickEdit(this.props.link);
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
        <button className="link-drag-handle"></button>
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
        <button
          className="link-button"
          onClick={this.onClickEdit}
        >
          Edit
        </button>
        <button className="link-button">Copy</button>
      </div>
    );
  }
}
