import * as React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { Bookmark } from '../Bookmark';

import { BookmarkListComponent } from './BookmarkListComponent';
import { GreetingComponent } from './GreetingComponent';
import { DragLayerComponent } from './DragLayerComponent';
import { CopiedToastComponent } from './CopiedToastComponent';
import { AddBookmarksModalComponent } from './AddBookmarksModalComponent';

export const DraggableTypes = {
  Bookmark: 'bookmark',
};

export class AppComponent extends React.Component {
  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="app">
          <BookmarkListComponent/>
          <GreetingComponent name={'Eric'}/>
          <DragLayerComponent/>
          <CopiedToastComponent/>
          <AddBookmarksModalComponent/>
        </div>
      </DndProvider>
    );
  }
}
