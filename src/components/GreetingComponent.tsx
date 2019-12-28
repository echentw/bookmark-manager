import * as React from 'react';
import { connect } from 'react-redux';
import { FaPen } from 'react-icons/fa';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

import { User } from 'User';
import * as UserActions from 'actions/UserActions';
import { UserParams } from 'actions/UserActions';
import * as SettingsActions from 'actions/SettingsActions';
import { AppState } from 'reduxStore';
import { SettingsCogComponent } from 'components/SettingsCogComponent';

// Given an HTML element, if that element is focused, then this function will
// move the cursor to the end of the text.
function placeCaretAtEnd(element: HTMLDivElement) {
  // Chrome supports these methods
  if (window.getSelection && document.createRange) {
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

interface ExternalProps {
  user: User;
  date: Date;
}

interface InternalProps extends ExternalProps {
  setUserName: (params: UserParams) => void;
  showSettingsModal: (params: {}) => void;
}

interface State {
  editing: boolean;
  hovering: boolean;
  name: string;

  // Whether the name should be pulsing.
  // Happens when the text starts or stops being editable.
  pulsing: boolean;
}

class GreetingComponent extends React.Component<InternalProps, State> {

  private nameTextRef: React.RefObject<HTMLDivElement> = React.createRef();

  state: State = {
    editing: false,
    hovering: false,
    name: this.props.user.name,
    pulsing: false,
  };

  componentDidUpdate(prevProps: InternalProps) {
    if (prevProps.user.name !== this.props.user.name) {
      this.setState({ name: this.props.user.name });
    }
  }

  pulse = () => {
    this.setState({ pulsing: true }, () => {
      setTimeout(() => {
        if (this.state.pulsing) {
          this.setState({ pulsing: false });
        }
      }, 600);
    });
  }

  dateToTime = (date: Date): string => {
    const hoursNumber = date.getHours() <= 12 ? date.getHours() : date.getHours() - 12;
    const minutesNumber = date.getMinutes();

    const hours = hoursNumber === 0 ? '12' : `${hoursNumber}`;
    const minutes = minutesNumber < 10 ? `0${minutesNumber}` : `${minutesNumber}`;
    const period = date.getHours() < 12 ? 'AM' : 'PM';

    return `${hours}:${minutes} ${period}`;
  }

  dateToPeriod = (date: Date): string => {
    const hour = date.getHours();
    if (hour >= 5 && hour <= 11) {
      return 'morning';
    } else if (hour >= 12 && hour <= 17) {
      return 'afternoon';
    } else {
      return 'evening';
    }
  }

  onMouseOver = () => {
    if (!this.state.editing) {
      this.setState({ hovering: true });
    }
  }

  onMouseLeave = () => {
    if (!this.state.editing) {
      this.setState({ hovering: false });
    }
  }

  onClickEdit = () => {
    this.setState({
      editing: true,
      hovering: false,
    }, () => {
      this.nameTextRef.current.focus();
      placeCaretAtEnd(this.nameTextRef.current);
    });
    this.pulse();
  }

  onChange = (event: ContentEditableEvent) => {
    // This should get rid of all html tags, i.e. everything that looks like <...>
    const sanitizedText = event.target.value.replace(/<.*?>/g, '');
    this.setState({ name: sanitizedText });
  }

  onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const strippedName = this.state.name.replace(/&nbsp;/g, ' ').trim();
    if (event.keyCode === 13) {
      // Pressed enter
      if (strippedName === '') {
        this.setState({ editing: false, name: this.props.user.name });
      } else {
        this.setState({ editing: false, name: strippedName }, () => {
          this.props.setUserName({ name: strippedName });
        });
      }
      this.pulse();
    } else if (event.keyCode === 27) {
      // Pressed escape
      this.setState({ editing: false, name: this.props.user.name });
      this.pulse();
    }
  }

  onBlur = () => {
    this.setState({ editing: false, name: this.props.user.name });
    this.pulse();
  }

  onClickSettings = () => {
    this.props.showSettingsModal({});
  }

  render() {
    const time = this.dateToTime(this.props.date);
    const period = this.dateToPeriod(this.props.date);

    const greetingText = this.props.user.name === '' ? `Good ${period}.` : `Good ${period},`;

    const maybeEditButton = this.state.hovering ? (
      <FaPen className="edit-name-button" onClick={this.onClickEdit}/>
    ) : null;

    const maybeBar = this.state.editing ? <div className="bar"/> : null;

    const maybePulseCssClass = this.state.pulsing ? 'pulse' : '';

    const nameComponent = (
      <div className="name-text-container"
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
      >
        <ContentEditable
          innerRef={this.nameTextRef}
          className={'name-text ' + maybePulseCssClass}
          spellCheck={false}
          disabled={!this.state.editing}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onKeyDown={this.onKeyDown}
          html={this.state.name}
        />
        <div className="punctuation">.</div>
        { maybeBar }
        { maybeEditButton }
      </div>
    );

    return (
      <div className="greeting">
        <div className="time-text">{time}</div>
        <div className="greeting-and-name-text-container">
          <div className={'greeting-text ' + period}>{greetingText}</div>
          { nameComponent }
        </div>
        <SettingsCogComponent onClick={this.onClickSettings}/>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, props: ExternalProps) => {
  return {};
};

const mapActionsToProps = {
  setUserName: UserActions.setName,
  showSettingsModal: SettingsActions.showModal,
};

const Component = connect(mapStateToProps, mapActionsToProps)(GreetingComponent);
export { Component as GreetingComponent };
