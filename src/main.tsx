import './styles/main.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { AppComponent } from './components/AppComponent';

const MainComponent = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <AppComponent/>
    </DndProvider>
  );
};

ReactDOM.render(<MainComponent/>, document.getElementById('main'));
