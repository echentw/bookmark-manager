import { Bookmark, BookmarkData } from 'Bookmark';
import { randomId } from 'utils';

export interface FolderData {
  id: string;
  name: string;
  bookmarks: BookmarkData[];
  collapsed: boolean;
}

export class Folder {
  public readonly id: string;
  public readonly name: string;
  public readonly bookmarks: Bookmark[];
  public readonly collapsed: boolean;

  constructor({ name, id, bookmarks, collapsed }: {
    name: string,
    id?: string,
    bookmarks?: Bookmark[],
    collapsed?: boolean,
  }) {
    this.id = (id !== undefined) ? id : randomId();
    this.name = name;
    this.bookmarks = (bookmarks !== undefined) ? bookmarks : [];
    this.collapsed = collapsed || false;
  }

  public withName = (name: string) => {
    return new Folder({
      id: this.id,
      name: name,
      bookmarks: this.bookmarks,
      collapsed: this.collapsed,
    });
  }

  public withBookmarks = (bookmarks: Bookmark[]) => {
    return new Folder({
      id: this.id,
      name: this.name,
      bookmarks: bookmarks,
      collapsed: this.collapsed,
    });
  }

  public withCollapsed = (collapsed: boolean) => {
    return new Folder({
      id: this.id,
      name: this.name,
      bookmarks: this.bookmarks,
      collapsed: collapsed,
    });
  }

  public equals = (other: Folder | null): boolean => {
    if (other === null) {
      return false;
    }
    if (this.id !== other.id ||
        this.name !== other.name ||
        this.bookmarks.length !== other.bookmarks.length ||
        this.collapsed !== other.collapsed) {
      return false;
    }
    return this.bookmarks.every((bookmark: Bookmark, index: number) => {
      return bookmark.equals(other.bookmarks[index]);
    });
  }

  public copy = (): Folder => {
    return new Folder({
      id: this.id,
      name: this.name,
      bookmarks: this.bookmarks.slice(0),
      collapsed: this.collapsed,
    });
  }

  public static fromData = (data: FolderData): Folder => {
    const bookmarks = data.bookmarks.map(bookmarkData => Bookmark.fromData(bookmarkData));
    return new Folder({
      id: data.id,
      name: data.name,
      bookmarks: bookmarks,
      collapsed: data.collapsed === undefined ? true : data.collapsed,
    });
  }

  public toData = (): FolderData => {
    const bookmarkDatas = this.bookmarks.map(bookmark => bookmark.toData());
    return {
      id: this.id,
      name: this.name,
      bookmarks: bookmarkDatas,
      collapsed: this.collapsed,
    };
  }
}
