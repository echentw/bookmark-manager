import * as React from 'react';

interface Props {
  add: () => void;
}

export class AddLinkComponent extends React.Component<Props> {
  render() {
    return (
      <div className="add-link" onClick={this.props.add}>
        +
      </div>
    );
  }
}
