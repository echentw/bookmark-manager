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
  editingNewBookmark: boolean;
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
      new Bookmark({ url: 'https://youtu.be/W-ulxMYL3ds', title: 'YouTube' }),
      new Bookmark({ url: 'https://www.skillshare.com/home', title: 'SkillShare' }),
      new Bookmark({ url: 'https://www.w3schools.com/html/html_css.asp', title: 'Something', name: 'HTML CSS' }),
      new Bookmark({
        url: 'https://react-dnd.github.io/react-dnd/examples/drag-around/custom-drag-layer',
        title: 'React DnD',
      }),
    ],

    // TODO: I want to set this to null
    editingBookmarkId: '',
    editingNewBookmark: false,

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
      editingNewBookmark: false,
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
      editingNewBookmark: false,
    });
  }

  clickEditBookmark = (bookmark: Bookmark) => {
    this.setState({
      editingBookmarkId: bookmark.id,
      editingNewBookmark: false,
    });
  }

  cancelEditBookmark = (bookmark: Bookmark) => {
    if (this.state.editingBookmarkId === bookmark.id) {
      if (this.state.editingNewBookmark) {
        const index = this.state.bookmarks.findIndex((thisBookmark: Bookmark) => {
          return thisBookmark.id === bookmark.id;
        });
        this.state.bookmarks.splice(index, 1);
        this.setState({
          bookmarks: this.state.bookmarks,
          editingBookmarkId: null,
          editingNewBookmark: false,
        });
      } else {
        this.setState({
          editingBookmarkId: null,
          editingNewBookmark: false,
        });
      }
    }
  }

  clickAddBookmark = () => {
    const bookmark = new Bookmark({ url: '' });
    const joined = this.state.bookmarks.concat(bookmark);
    this.setState({
      bookmarks: joined,
      editingBookmarkId: bookmark.id,
      editingNewBookmark: true,
    });
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
