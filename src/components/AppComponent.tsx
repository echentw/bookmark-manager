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

import { EditBookmarkState, EditBookmarkService, EditBookmarkContext } from './contexts';
import { AddBookmarksState, AddBookmarksService, AddBookmarksContext } from './contexts';

import * as dummyBookmarkData from './bookmarks.json';

export interface AddBookmarkContext {
  addingBookmark: boolean;
  tabs: TabInfo[];
}

export interface AppState {
  bookmarks: Bookmark[];
  addBookmarksState: AddBookmarksState;
  editBookmarkState: EditBookmarkState;
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

    editBookmarkState: {
      // TODO: I want to set this to null
      editingBookmarkId: '',
    },

    addBookmarksState: {
      showingModal: false,
      tabs: [] as TabInfo[],
    },
  };

  private draggedRank: number | null = null;

  addBookmarksService: AddBookmarksService = {
    clickAddBookmarksButton: async () => {
      // TODO: unimplemented
      try {
        const tabInfos = await ChromeHelpers.getTabInfos();
        this.setState({
          addBookmarksState: {
            showingModal: true,
            tabs: tabInfos,
          },
        });
      } catch(e) {
        console.log('something went wrong!');
      }
    },
    cancelAddBookmarks: () => {
      this.setState({
        addBookmarksState: {
          showingModal: false,
          tabs: [],
        },
      });
    },
    saveAddBookmarks: (bookmarks: Bookmark[]) => {
      const allBookmarks = this.state.bookmarks.concat(bookmarks);
      this.setState({
        bookmarks: allBookmarks,
        addBookmarksState: {
          showingModal: false,
          tabs: [],
        },
      });
    },
  };

  editBookmarkService: EditBookmarkService = {
    clickEditBookmarkButton: (bookmark: Bookmark) => {
      this.setState({
        editBookmarkState: {
          editingBookmarkId: bookmark.id,
        },
      });
    },
    cancelEditBookmark: (bookmark: Bookmark) => {
      if (this.state.editBookmarkState.editingBookmarkId === bookmark.id) {
        this.setState({
          editBookmarkState: {
            editingBookmarkId: null,
          },
        });
      }
    },
    saveEditBookmark: (newBookmark: Bookmark) => {
      const index = this.state.bookmarks.findIndex((bookmark: Bookmark) => {
        return bookmark.id === newBookmark.id;
      });
      this.state.bookmarks[index] = newBookmark;
      // TODO: what's the proper way to do this?
      this.setState({
        bookmarks: this.state.bookmarks,
        editBookmarkState: {
          editingBookmarkId: null,
        },
      });
    },
    deleteBookmark: (bookmark: Bookmark) => {
      const index = this.state.bookmarks.findIndex((thisBookmark: Bookmark) => {
        return thisBookmark.id === bookmark.id;
      });
      this.state.bookmarks.splice(index, 1);
      this.setState({
        bookmarks: this.state.bookmarks,
        editBookmarkState: {
          editingBookmarkId: null,
        },
      });
    },
  };


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

  render() {
    const editBookmarkContext: EditBookmarkContext = {
      state: this.state.editBookmarkState,
      service: this.editBookmarkService,
    };

    const addBookmarksContext: AddBookmarksContext = {
      state: this.state.addBookmarksState,
      service: this.addBookmarksService,
    };

    const dragDropService: DragDropService = {
      isOver: this.isOver,
      beginDrag: this.beginDrag,
      endDrag: this.endDrag,
    };

    return (
      <div className="app">
        <BookmarkListComponent
          appState={this.state}
          dragDropService={dragDropService}
          addBookmarksContext={addBookmarksContext}
          editBookmarkContext={editBookmarkContext}
        />
        <GreetingComponent name={'Eric'}/>
        <DragLayerComponent appState={this.state}/>
        <CopiedToastComponent/>
        <AddBookmarkModalComponent
          addBookmarksContext={addBookmarksContext}
        />
      </div>
    );
  }
}
