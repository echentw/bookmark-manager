import * as React from 'react';
import { connect } from 'react-redux';
import { FaCog } from 'react-icons/fa';

import { AppState } from 'reduxStore';
import * as SettingsActions from 'actions/SettingsActions';

interface Props {
  showSettingsModal: () => void;
}

interface State {
  hovering: boolean;
}

class SettingsCogComponent extends React.Component<Props, State> {

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
          onClick={this.props.showSettingsModal}
          onMouseOver={this.onMouseOver}
          onMouseLeave={this.onMouseLeave}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: {}) => {
  return {};
};

const mapActionsToProps = {
  showSettingsModal: SettingsActions.showModal,
};

const Component = connect(mapStateToProps, mapActionsToProps)(SettingsCogComponent);
export { Component as SettingsCogComponent };
