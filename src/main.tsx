import './styles/main.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';

import { AppComponent, store } from './components/AppComponent';

const MainComponent = () => {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <AppComponent/>
      </DndProvider>
    </Provider>
  );
};

ReactDOM.render(<MainComponent/>, document.getElementById('main'));
