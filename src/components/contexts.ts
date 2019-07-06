import { Bookmark } from '../Bookmark';
import { TabInfo } from '../ChromeHelpers';

export interface CopyUrlState {
  showingToast: boolean;
  position: {
    x: number;
    y: number;
  };
}

export interface CopyUrlService {
  showToast: (x: number, y: number) => void;
}

export interface CopyUrlContext {
  state: CopyUrlState;
  service: CopyUrlService;
}


export interface AddBookmarksState {
  showingModal: boolean;
  tabs: TabInfo[];
}

export interface AddBookmarksService {
  clickAddBookmarksButton: () => void;
  cancelAddBookmarks: () => void;
  saveAddBookmarks: (bookmarks: Bookmark[]) => void;
}

export interface AddBookmarksContext {
  state: AddBookmarksState;
  service: AddBookmarksService;
}


export interface EditBookmarkState {
  editingBookmarkId: string | null;
}

export interface EditBookmarkService {
  clickEditBookmarkButton: (bookmark: Bookmark) => void;
  cancelEditBookmark: (bookmark: Bookmark) => void;
  saveEditBookmark: (bookmark: Bookmark) => void;
  deleteBookmark: (bookmark: Bookmark) => void;
}

export interface EditBookmarkContext {
  state: EditBookmarkState;
  service: EditBookmarkService;
}
