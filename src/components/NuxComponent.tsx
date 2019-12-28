import * as React from 'react';
import { connect } from 'react-redux';

import * as UserActions from 'actions/UserActions';
import { UserParams } from 'actions/UserActions';
import { AppState } from 'reduxStore';

interface Props {
  setUserName: (params: UserParams) => void;
}

class NuxComponent extends React.Component<Props> {

  private textInputRef: React.RefObject<HTMLInputElement> = React.createRef();
  private text: string = '';

  componentDidMount = () => {
    this.text = '';
    this.textInputRef.current.focus();
  }

  onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.text = event.target.value;
  }

  onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      // Pressed enter
      this.props.setUserName({ name: this.text });
    }
  }

  render() {
    return (
      <div className="nux">
        <div className="name-input-label">Hi, what is your name?</div>
        <input className="name-input"
          type="text"
          autoComplete="off"
          spellCheck={false}
          required
          ref={this.textInputRef}
          onChange={this.onChangeText}
          onKeyDown={this.onKeyDown}
        />
        <div className="bar"/>
        <div className="app-background"/>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {};
};

const mapActionsToProps = {
  setUserName: UserActions.setName,
};

const Component = connect(mapStateToProps, mapActionsToProps)(NuxComponent);
export { Component as NuxComponent };
