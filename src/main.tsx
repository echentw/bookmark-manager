import 'styles/main.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';

import { AppComponent } from 'components/AppComponent';
import { reduxStore } from 'reduxStore';

const MainComponent = () => {
  return (
    <Provider store={reduxStore}>
      <DndProvider backend={HTML5Backend}>
        <AppComponent/>
      </DndProvider>
    </Provider>
  );
};

ReactDOM.render(<MainComponent/>, document.getElementById('main'));
