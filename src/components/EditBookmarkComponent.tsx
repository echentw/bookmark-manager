import * as React from 'react';

import { Bookmark } from '../Bookmark';
import { AppService } from './AppComponent';

export interface Props {
  bookmark: Bookmark;
  appService: AppService;
}

export class EditBookmarkComponent extends React.Component<Props> {
  private name: string = '';

  private nameInput: HTMLInputElement = null;

  componentDidMount = () => {
    this.name = this.props.bookmark.name;
    this.nameInput.focus();
  }

  onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.name = event.target.value;
  }

  onClickSave = async () => {
    const name = this.name ? this.name : null;
    const newBookmark = this.props.bookmark.withName(name);
    this.props.appService.saveBookmark(newBookmark);
  }

  onClickCancel = () => {
    this.props.appService.cancelEditBookmark(this.props.bookmark);
  }

  onClickDelete = () => {
    this.props.appService.deleteBookmark(this.props.bookmark);
  }

  onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
      <div className="edit-bookmark">
        <div className="edit-bookmark-label">Name</div>
        <input
          className="edit-bookmark-input"
          ref={(input) => this.nameInput = input}
          type="text"
          defaultValue={this.props.bookmark.name}
          onChange={this.onChangeName}
          onKeyDown={this.onKeyDown}
        />
        <div className="edit-bookmark-buttons">
          <div className="left-buttons">
            <button className="edit-bookmark-button delete" onClick={this.onClickDelete}>Delete</button>
          </div>
          <div className="right-buttons">
            <button className="edit-bookmark-button cancel" onClick={this.onClickCancel}>Cancel</button>
            <button className="edit-bookmark-button save" onClick={this.onClickSave}>Save</button>
          </div>
        </div>
      </div>
    );
  }
}
