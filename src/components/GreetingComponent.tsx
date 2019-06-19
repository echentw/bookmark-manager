import * as React from 'react';

interface Props {
  name: string,
}

export class GreetingComponent extends React.Component<Props> {
  render() {
    return (
      <div className="greeting">
        <div className="greeting-top">
          Hello, {this.props.name}.
        </div>
        <div className="greeting-bottom"/>
      </div>
    );
  }
}
