import * as React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { Bookmark } from '../Bookmark';
import { BookmarkListComponent } from './BookmarkListComponent';
import { GreetingComponent } from './GreetingComponent';
import { DragLayerComponent } from './DragLayerComponent';
import { CopiedModalComponent } from './CopiedModalComponent';

export interface CopyContext {
  showingCopiedModal: boolean;
  x: number;
  y: number;
}

export interface AppState {
  bookmarks: Bookmark[];
  editingBookmarkId: string | null;
  copyContext: CopyContext;
}

export interface AppService {
  saveBookmark: (bookmark: Bookmark) => void;
  clickEditBookmark: (bookmark: Bookmark) => void;
  cancelEditBookmark: (bookmark: Bookmark) => void;
  deleteBookmark: (bookmark: Bookmark) => void;
  clickAddBookmark: () => void;
  unleashCopiedModal: (x: number, y: number) => void;
}

export interface DragDropService {
  beginDrag: (draggedRank: number) => void;
  endDrag: (draggedRank: number) => void;
  isOver: (dropTargetRank: number) => void;
}

export const DraggableTypes = {
  LINK: 'bookmark',
};

export class AppComponent extends React.Component {
  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <InnerAppComponent/>
      </DndProvider>
    );
  }
}

class InnerAppComponent extends React.Component<{}, AppState> {
  state = {
    bookmarks: [
      new Bookmark({
        url: 'https://developers.chrome.com/extensions/bookmarks',
        title: 'chrome.bookmarks - Google Chrome',
        faviconUrl: 'https://www.google.com/images/icons/product/chrome-32.png',
      }),
      new Bookmark({
        url: 'chrome://extensions/',
        title: 'Extensions',
        faviconUrl: '',
      }),
      new Bookmark({
        url: 'https://www.google.com/search?q=get+favicon+of+web…s=chrome..69i57.6034j0j4&sourceid=chrome&ie=UTF-8',
        title: 'get favicon of website that you are logged into - Google Search',
        faviconUrl: 'https://www.google.com/favicon.ico',
      }),
      new Bookmark({
        url: 'https://stackoverflow.com/questions/1990475/how-can-i-retrieve-the-favicon-of-a-website',
        title: 'web - How can I retrieve the favicon of a website? - Stack Overflow',
        faviconUrl: 'https://cdn.sstatic.net/Sites/stackoverflow/img/favicon.ico?v=4f32ecc8f43d',
      }),
    ],

    // TODO: I want to set this to null
    editingBookmarkId: '',

    copyContext: {
      showingCopiedModal: false,
      x: 0,
      y: 0,
    },
  };

  private draggedRank: number | null = null;

  private copiedModalTimeoutId: NodeJS.Timeout | null = null;

  saveBookmark = (newBookmark: Bookmark) => {
    const index = this.state.bookmarks.findIndex((bookmark: Bookmark) => {
      return bookmark.id === newBookmark.id;
    });
    this.state.bookmarks[index] = newBookmark;
    // TODO: what's the proper way to do this?
    this.setState({
      bookmarks: this.state.bookmarks,
      editingBookmarkId: null,
    });
  }

  deleteBookmark = (bookmark: Bookmark) => {
    const index = this.state.bookmarks.findIndex((thisBookmark: Bookmark) => {
      return thisBookmark.id === bookmark.id;
    });
    this.state.bookmarks.splice(index, 1);
    this.setState({
      bookmarks: this.state.bookmarks,
      editingBookmarkId: null,
    });
  }

  clickEditBookmark = (bookmark: Bookmark) => {
    this.setState({
      editingBookmarkId: bookmark.id,
    });
  }

  cancelEditBookmark = (bookmark: Bookmark) => {
    if (this.state.editingBookmarkId === bookmark.id) {
      this.setState({ editingBookmarkId: null });
    }
  }

  clickAddBookmark = () => {
    // TODO: unimplemented
    console.log('this is unimplemented!');
  }

  isOver = (dropTargetRank: number) => {
    // TODO: do the array operations properly
    const bookmarks: Bookmark[] = this.state.bookmarks.map(bookmark => bookmark);
    const draggedBookmark = bookmarks[this.draggedRank];
    if (this.draggedRank > dropTargetRank) {
      for (let i = this.draggedRank; i > dropTargetRank; --i) {
        bookmarks[i] = bookmarks[i - 1];
      }
    } else {
      for (let i = this.draggedRank; i < dropTargetRank; ++i) {
        bookmarks[i] = bookmarks[i + 1];
      }
    }
    bookmarks[dropTargetRank] = draggedBookmark;

    this.draggedRank = dropTargetRank;

    this.setState({ bookmarks });
  }

  beginDrag = (draggedRank: number) => {
    this.draggedRank = draggedRank;
  }

  endDrag = (draggedRank: number) => {
    this.draggedRank = null;
  }

  unleashCopiedModal = (x: number, y: number) => {
    const hideContext = { showingCopiedModal: false, x: 0, y: 0 };
    const showContext = { showingCopiedModal: true, x, y };

    this.setState({ copyContext: showContext }, () => {
      const copiedModalTimeoutId = setTimeout(() => {
        if (this.copiedModalTimeoutId === copiedModalTimeoutId) {
          this.setState({ copyContext: hideContext });
        }
      }, 1000);
      this.copiedModalTimeoutId = copiedModalTimeoutId;
    });
  }

  render() {
    const appService: AppService = {
      saveBookmark: this.saveBookmark,
      clickEditBookmark: this.clickEditBookmark,
      cancelEditBookmark: this.cancelEditBookmark,
      clickAddBookmark: this.clickAddBookmark,
      deleteBookmark: this.deleteBookmark,
      unleashCopiedModal: this.unleashCopiedModal,
    };

    const dragDropService: DragDropService = {
      isOver: this.isOver,
      beginDrag: this.beginDrag,
      endDrag: this.endDrag,
    };

    return (
      <div className="app">
        <BookmarkListComponent
          appService={appService}
          appState={this.state}
          dragDropService={dragDropService}
        />
        <GreetingComponent name={'Eric'}/>
        <DragLayerComponent appState={this.state}/>
        <CopiedModalComponent copyContext={this.state.copyContext}/>
      </div>
    );
  }
}
