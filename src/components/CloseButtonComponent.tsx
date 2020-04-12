import * as React from 'react';
import { FaTimes } from 'react-icons/fa';

interface Props {
  onClick: () => void;
}

export class CloseButtonComponent extends React.Component<Props> {
  render() {
    return (
      <div className="close-button" onClick={this.props.onClick}>
        <FaTimes className="x-icon"/>
      </div>
    );
  }
}
