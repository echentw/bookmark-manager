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

  render() {
    const time = this.dateToTime(this.props.date);
    const period = this.dateToPeriod(this.props.date);
    return (
      <div className="greeting">
        <div className="time-text">{time}</div>
        <div className="name-text">Good {period}, {this.props.name}.</div>
      </div>
    );
  }
}
