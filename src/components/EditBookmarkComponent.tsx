import * as React from 'react';
import { connect } from 'react-redux';

import { Bookmark } from '../Bookmark';
import * as EditBookmarkActions from '../actions/EditBookmarkActions';
import { EditBookmarkParams } from '../actions/EditBookmarkActions';
import { AppState } from './AppComponent';

interface ExternalProps {
  bookmark: Bookmark;
}

interface InternalProps extends ExternalProps {
  cancel: (params: EditBookmarkParams) => void;
  save: (params: EditBookmarkParams) => void;
}

class EditBookmarkComponent extends React.Component<InternalProps> {
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
    this.props.save({ bookmark: newBookmark });
  }

  onClickCancel = () => {
    this.props.cancel({ bookmark: this.props.bookmark });
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
      <input
        className="edit-bookmark"
        ref={(input) => this.nameInput = input}
        type="text"
        defaultValue={bookmark.displayName()}
        onChange={this.onChangeName}
        onKeyDown={this.onKeyDown}
        onBlur={this.onBlur}
      />
    );
  }
}

const mapStateToProps = (state: AppState, props: ExternalProps) => {
  return {};
};

const mapActionsToProps = {
  cancel: EditBookmarkActions.cancel,
  save: EditBookmarkActions.save,
};

const Component = connect(mapStateToProps, mapActionsToProps)(EditBookmarkComponent);
export { Component as EditBookmarkComponent };
