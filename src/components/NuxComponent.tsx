import * as React from 'react';

export class NuxComponent extends React.Component {

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
      console.log(`your name is ${this.text}`);
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
