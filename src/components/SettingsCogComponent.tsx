import * as React from 'react';
import { FaCog } from 'react-icons/fa';

interface Props {
  onClick: () => void;
}

interface State {
  hovering: boolean;
}

export class SettingsCogComponent extends React.Component<Props, State> {

  state: State = {
    hovering: false,
  };

  onMouseOver = () => {
    this.setState({ hovering: true });
  }

  onMouseLeave = () => {
    this.setState({ hovering: false });
  }

  render() {
    const hoveringClass = this.state.hovering ? 'hovering' : '';
    return (
      <div className="settings-cog-container">
        <FaCog className={'settings-cog-outside-shadow ' + hoveringClass}/>
        <FaCog className={'settings-cog-inside-shadow ' + hoveringClass}/>
        <FaCog
          className={'settings-cog ' + hoveringClass}
          onClick={this.props.onClick}
          onMouseOver={this.onMouseOver}
          onMouseLeave={this.onMouseLeave}
        />
      </div>
    );
  }
}
