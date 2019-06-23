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

  onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    this.onClickCancel();
  }

  render() {
    const { bookmark } = this.props;
    return (
      <div className="edit-bookmark">
        <img className="bookmark-favicon" src={bookmark.faviconUrl}/>
        <input
          className="edit-bookmark-input"
          ref={(input) => this.nameInput = input}
          type="text"
          defaultValue={bookmark.displayName()}
          onChange={this.onChangeName}
          onKeyDown={this.onKeyDown}
          onBlur={this.onBlur}
        />
        <div className="phantom-icon"/>
        <div className="phantom-icon"/>
      </div>
    );
  }
}
