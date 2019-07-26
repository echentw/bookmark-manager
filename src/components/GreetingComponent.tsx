import * as React from 'react';


interface Props {
  name: string,
  date: Date;
}

export class GreetingComponent extends React.Component<Props> {
  dateToTime = (date: Date): string => {
    const hoursNumber = date.getHours() <= 12 ? date.getHours() : date.getHours() - 12;
    const minutesNumber = date.getMinutes();

    const hours = hoursNumber === 0 ? '12' : `${hoursNumber}`;
    const minutes = minutesNumber < 10 ? `0${minutesNumber}` : `${minutesNumber}`;
    const period = date.getHours() < 12 ? 'am' : 'pm';

    return `${hours}:${minutes}${period}`;
  }

  render() {
    const time = this.dateToTime(this.props.date);
    return (
      <div className="greeting">
        <div className="name-text">Hello, {this.props.name}.</div>
        <div className="time-text">The time is {time}.</div>
      </div>
    );
  }
}
