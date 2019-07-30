import * as React from 'react';

interface Props {
  initialText: string;
  save: (text: string) => void;
  cancel: () => void;
}

export class EditTextFieldComponent extends React.Component<Props> {

  private text: string = '';
  private textInput: HTMLInputElement = null;

  componentDidMount = () => {
    this.text = this.props.initialText;
    this.textInput.focus();
  }

  save = () => {
    this.props.save(this.text);
  }

  cancel = () => {
    this.props.cancel();
  }

  onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.text = event.target.value;
  }

  onBlur = () => {
    this.cancel();
  }

  onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      // Pressed enter
      this.save();
    } else if (event.keyCode === 27) {
      // Pressed escape
      this.cancel();
    }
  }


  render() {
    return (
      <input
        className="edit-text-field"
        ref={input => this.textInput = input}
        type="text"
        defaultValue={this.props.initialText}
        onChange={this.onChangeText}
        onKeyDown={this.onKeyDown}
        onBlur={this.onBlur}
      />
    );
  }
}
