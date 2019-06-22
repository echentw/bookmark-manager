import './styles/main.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { AppComponent } from './components/AppComponent';

ReactDOM.render(<AppComponent/>, document.getElementById('main'));



import { ChromeHelpers } from './ChromeHelpers';

const testFunc = async () => {
  const tabInfos = await ChromeHelpers.getTabInfos();
  console.log(tabInfos);
};

testFunc();
