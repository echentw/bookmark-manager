import * as React from 'react';

interface Props {
  textInputRef: React.RefObject<HTMLInputElement>;
  initialText: string;
  save: (text: string) => void;
  cancel: () => void;
}

export class EditTextFieldComponent extends React.Component<Props> {

  private text: string = '';

  componentDidMount = () => {
    this.text = this.props.initialText;
    this.props.textInputRef.current.focus();
  }

  onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.text = event.target.value;
  }

  onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      // Pressed enter
      this.props.save(this.text);
    } else if (event.keyCode === 27) {
      // Pressed escape
      this.props.cancel();
    }
  }

  render() {
    return (
      <input
        className="edit-text-field"
        ref={this.props.textInputRef}
        type="text"
        defaultValue={this.props.initialText}
        onChange={this.onChangeText}
        onKeyDown={this.onKeyDown}
      />
    );
  }
}
