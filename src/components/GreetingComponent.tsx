import * as React from 'react';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface Props {
  name: string,
}

interface State {
  date: Date;
}

export class GreetingComponent extends React.Component<Props, State> {
  state = {
    date: new Date(),
  };

  componentDidMount = () => {
    setInterval(() => {
      this.setState({ date: new Date() });
    }, 2000);
  }

  getTime = (date: Date): string => {
    const hoursNumber = date.getHours() <= 12 ? date.getHours() : date.getHours() - 12;
    const minutesNumber = date.getMinutes();

    const hours = hoursNumber === 0 ? '12' : `${hoursNumber}`;
    const minutes = minutesNumber < 10 ? `0${minutesNumber}` : `${minutesNumber}`;
    const period = date.getHours() < 12 ? 'am' : 'pm';

    return `${hours}:${minutes}${period}`;
  }

  getDay = (date: Date): string => {
    const dayOfWeek = DAYS_OF_WEEK[date.getDay()];
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();
    const dayOfMonth = date.getDate();
    return `${dayOfWeek}, ${month} ${dayOfMonth}, ${year}`;
  }

  render() {
    const time = this.getTime(this.state.date);
    const day = this.getDay(this.state.date);

    return (
      <div className="greeting">
        <div className="greeting-top">
          <p>Hello, {this.props.name}.</p>
          <p>The time is {time}.</p>
        </div>
        <div className="greeting-bottom">
          <p>{day}.</p>
        </div>
      </div>
    );
  }
}
