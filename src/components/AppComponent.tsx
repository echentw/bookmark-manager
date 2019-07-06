import * as React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { Bookmark } from '../Bookmark';
import { ChromeHelpers, TabInfo } from '../ChromeHelpers';

import { BookmarkListComponent } from './BookmarkListComponent';
import { GreetingComponent } from './GreetingComponent';
import { DragLayerComponent } from './DragLayerComponent';
import { CopiedToastComponent } from './CopiedToastComponent';
import { AddBookmarkModalComponent } from './AddBookmarkModalComponent';

import { CopyUrlState, CopyUrlService, CopyUrlContext } from './contexts';
import * as dummyBookmarkData from './bookmarks.json';

export interface AddBookmarkContext {
  addingBookmark: boolean;
  tabs: TabInfo[];
}

export interface AppState {
  bookmarks: Bookmark[];
  editingBookmarkId: string | null;
  copyUrlState: CopyUrlState;
  addBookmarkContext: AddBookmarkContext;
}

export interface AppService {
  saveBookmark: (bookmark: Bookmark) => void;
  clickEditBookmark: (bookmark: Bookmark) => void;
  cancelEditBookmark: (bookmark: Bookmark) => void;
  deleteBookmark: (bookmark: Bookmark) => void;
  clickAddBookmark: () => void;
  cancelAddBookmarks: () => void;
  saveAddBookmarks: (bookmarks: Bookmark[]) => void;
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
    bookmarks: dummyBookmarkData['bookmarks'].map(data => {
      return new Bookmark({
        url: data.url,
        title: data.title,
        faviconUrl: data.faviconUrl,
      });
    }),

    // TODO: I want to set this to null
    editingBookmarkId: '',

    copyUrlState: {
      showingToast: false,
      position: {
        x: 0,
        y: 0,
      },
    },

    addBookmarkContext: {
      addingBookmark: false,
      tabs: [] as TabInfo[],
    },
  };

  private draggedRank: number | null = null;

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

  clickAddBookmark = async () => {
    // TODO: unimplemented
    try {
      const tabInfos = await ChromeHelpers.getTabInfos();
      this.setState({
        addBookmarkContext: {
          addingBookmark: true,
          tabs: tabInfos,
        },
      });
    } catch(e) {
      console.log('something went wrong!');
    }
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

  private copiedToastTimeoutId: NodeJS.Timeout | null = null;
  copyUrlService: CopyUrlService = {
    showToast: (x: number, y: number) => {
      const hideState = { showingToast: false, position: { x: 0, y: 0  } };
      const showState = { showingToast: true, position: { x, y } };

      this.setState({ copyUrlState: showState }, () => {
        const copiedToastTimeoutId = setTimeout(() => {
          if (this.copiedToastTimeoutId === copiedToastTimeoutId) {
            this.setState({ copyUrlState: hideState });
          }
        }, 1000);
        this.copiedToastTimeoutId = copiedToastTimeoutId;
      });
    },
  };

  cancelAddBookmarks = () => {
    this.setState({
      addBookmarkContext: {
        addingBookmark: false,
        tabs: [],
      },
    });
  }

  saveAddBookmarks = (bookmarks: Bookmark[]) => {
    const allBookmarks = this.state.bookmarks.concat(bookmarks);
    this.setState({
      bookmarks: allBookmarks,
      addBookmarkContext: {
        addingBookmark: false,
        tabs: [],
      },
    });
  }

  render() {
    const copyUrlContext: CopyUrlContext = {
      state: this.state.copyUrlState,
      service: this.copyUrlService,
    };

    const appService: AppService = {
      saveBookmark: this.saveBookmark,
      clickEditBookmark: this.clickEditBookmark,
      cancelEditBookmark: this.cancelEditBookmark,
      clickAddBookmark: this.clickAddBookmark,
      deleteBookmark: this.deleteBookmark,
      cancelAddBookmarks: this.cancelAddBookmarks,
      saveAddBookmarks: this.saveAddBookmarks,
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
          copyUrlContext={copyUrlContext}
        />
        <GreetingComponent name={'Eric'}/>
        <DragLayerComponent appState={this.state}/>
        <CopiedToastComponent copyUrlContext={copyUrlContext}/>
        <AddBookmarkModalComponent
          addBookmarkContext={this.state.addBookmarkContext}
          appService={appService}
        />
      </div>
    );
  }
}
