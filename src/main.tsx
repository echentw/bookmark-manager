import './styles/main.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';

import { AppComponent } from './components/AppComponent';
import { reduxStore } from './reduxStore';

// This is to prevent the background image from fading in until it's fully loaded.
// Without this, the image will look super ugly if it's loading slowly.
function waitForAssetsToLoad() {
  document.body.classList.add('assets-loading');
  window.addEventListener('load', showPage);
  function showPage() {
    document.body.classList.remove('assets-loading');
  }
}

waitForAssetsToLoad();

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
