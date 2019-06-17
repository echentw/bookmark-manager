import * as React from 'react';

import { LinksPaneComponent } from './LinksPaneComponent';

export class AppComponent extends React.Component {
  render() {
    return (
      <div className="app">
        <LinksPaneComponent/>
      </div>
    );
  }
}
