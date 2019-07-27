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
  date: Date,
}

export class DateComponent extends React.Component<Props> {

  dateToString = (date: Date): string => {
    const dayOfWeek = DAYS_OF_WEEK[date.getDay()];
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();
    const dayOfMonth = date.getDate();
    return `${dayOfWeek}, ${month} ${dayOfMonth}, ${year}`;
  }

  render() {
    const date = this.dateToString(this.props.date);
    return (
      <div className="date">
        <div className="date-text">
          { date }
        </div>
      </div>
    );
  }
}
