import * as React from 'react';

interface Props {
  name: string,
}

export class GreetingComponent extends React.Component<Props> {
  render() {
    return (
      <div className="greeting">
        <div className="greeting-top">
          <p>Hello, {this.props.name}.</p>
          <p>The time is 9:43pm.</p>
        </div>
        <div className="greeting-bottom">
          <p>Tuesday, June 18, 2019.</p>
        </div>
      </div>
    );
  }
}
