import { Bookmark, BookmarkData } from './Bookmark';
import { randomId } from './utils';

export interface FolderData {
  id: string;
  name: string;
  bookmarks: BookmarkData[];
}

export class Folder {
  public readonly id: string;
  public readonly name: string;
  public readonly bookmarks: Bookmark[];

  constructor({ name, id, bookmarks }: {
    name: string,
    id?: string,
    bookmarks?: Bookmark[],
  }) {
    this.id = id ? id : randomId();
    this.name = name;
    this.bookmarks = bookmarks ? bookmarks : [];
  }

  public withName = (name: string) => {
    return new Folder({
      id: this.id,
      name: name,
      bookmarks: this.bookmarks,
    });
  }

  public withBookmarks = (bookmarks: Bookmark[]) => {
    return new Folder({
      id: this.id,
      name: this.name,
      bookmarks: bookmarks,
    });
  }

  public equals = (other: Folder | null): boolean => {
    if (other === null) {
      return false;
    }
    if (this.id !== other.id || this.name !== other.name || this.bookmarks.length !== other.bookmarks.length) {
      return false;
    }
    return this.bookmarks.every((bookmark: Bookmark, index: number) => {
      return bookmark.equals(other.bookmarks[index]);
    });
  }

  public static fromData = (data: FolderData): Folder => {
    const bookmarks = data.bookmarks.map(bookmarkData => Bookmark.fromData(bookmarkData));
    return new Folder({
      id: data.id,
      name: data.name,
      bookmarks: bookmarks,
    });
  }

  public toData = (): FolderData => {
    const bookmarkDatas = this.bookmarks.map(bookmark => bookmark.toData());
    return {
      id: this.id,
      name: this.name,
      bookmarks: bookmarkDatas,
    };
  }
}
