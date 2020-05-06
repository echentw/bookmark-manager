import * as React from 'react';
import { FaTimes, FaMinus } from 'react-icons/fa';

interface Props {
  onClick: () => void;
  minus?: boolean;
}

export class CloseButtonComponent extends React.Component<Props> {
  render() {
    const icon = this.props.minus ? (
      <FaMinus className="x-icon"/>
    ) : (
      <FaTimes className="x-icon"/>
    );
    return (
      <div className="close-button" onClick={this.props.onClick}>
        { icon }
      </div>
    );
  }
}
