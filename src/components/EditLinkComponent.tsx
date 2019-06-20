import * as React from 'react';

import { Link } from '../Link';
import { AppService } from './AppComponent';

export interface Props {
  link: Link;
  appService: AppService;
}

export class EditLinkComponent extends React.Component<Props> {
  private name: string = '';
  private url: string = '';

  private nameInput: HTMLInputElement = null;
  private urlInput: HTMLInputElement = null;

  componentDidMount = () => {
    this.name = this.props.link.name;
    this.url = this.props.link.url;

    this.urlInput.focus();
  }

  onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.name = event.target.value;
  }

  onChangeUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.url = event.target.value;
  }

  onClickSave = () => {
    const newLink = this.props.link.withName(this.name).withUrl(this.url);
    this.props.appService.saveLink(newLink);
  }

  onClickCancel = () => {
    this.props.appService.cancelEditLink(this.props.link);
  }

  onClickDelete = () => {
    this.props.appService.deleteLink(this.props.link);
  }

  onUrlKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      // Pressed enter
      this.nameInput.focus();
    } else if (event.keyCode === 27) {
      // Pressed escape
      this.onClickCancel();
    }
  }

  onNameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      // Pressed enter
      this.onClickSave();
    } else if (event.keyCode === 27) {
      // Pressed escape
      this.onClickCancel();
    }
  }

  render() {
    return (
      <div className="edit-link">
        <div className="edit-link-label">URL</div>
        <input
          className="edit-link-input"
          ref={(input) => this.urlInput = input}
          type="text"
          defaultValue={this.props.link.url}
          onChange={this.onChangeUrl}
          onKeyDown={this.onUrlKeyDown}
        />
        <div className="edit-link-label">Name</div>
        <input
          className="edit-link-input"
          ref={(input) => this.nameInput = input}
          type="text"
          defaultValue={this.props.link.name}
          onChange={this.onChangeName}
          onKeyDown={this.onNameKeyDown}
        />
        <div className="edit-link-buttons">
          <div className="left-buttons">
            <button className="edit-link-button delete" onClick={this.onClickDelete}>Delete</button>
          </div>
          <div className="right-buttons">
            <button className="edit-link-button cancel" onClick={this.onClickCancel}>Cancel</button>
            <button className="edit-link-button save" onClick={this.onClickSave}>Save</button>
          </div>
        </div>
      </div>
    );
  }
}
