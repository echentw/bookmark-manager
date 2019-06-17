import './style.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { LinksPaneComponent } from './components/LinksPaneComponent';

class App extends React.Component {
  render() {
    return <LinksPaneComponent/>;
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);
