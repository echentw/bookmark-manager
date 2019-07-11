import './styles/main.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import { copyUrlReducer, initialCopyUrlState } from './reducers';

import { AppComponent } from './components/AppComponent';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
  }
}

const allReducers = combineReducers({
  copyUrlState: copyUrlReducer,
});

const store = createStore(
  allReducers,
  {
    copyUrlState: initialCopyUrlState,
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const MainComponent = () => (
  <Provider store={store}>
    <AppComponent/>
  </Provider>
);

ReactDOM.render(<MainComponent/>, document.getElementById('main'));
