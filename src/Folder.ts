import { Bookmark, BookmarkData } from './Bookmark';
import { randomId } from './utils';

export interface FolderData {
  id: string;
  name: string;
  bookmarks: BookmarkData[];
  color: FolderColor;
}

export enum FolderColor {
  Black = 1,
  Red,
  Blue,
  Green,
  Yellow,
  Purple,
}

export class Folder {
  public readonly id: string;
  public readonly name: string;
  public readonly bookmarks: Bookmark[];
  public readonly color: FolderColor;

  constructor({ name, id, bookmarks, color }: {
    name: string,
    id?: string,
    bookmarks?: Bookmark[],
    color?: FolderColor,
  }) {
    this.id = id ? id : randomId();
    this.name = name;
    this.bookmarks = bookmarks ? bookmarks : [];
    this.color = color ? color : FolderColor.Black;
  }

  public withName = (name: string) => {
    return new Folder({
      id: this.id,
      name: name,
      bookmarks: this.bookmarks,
      color: this.color,
    });
  }

  public withBookmarks = (bookmarks: Bookmark[]) => {
    return new Folder({
      id: this.id,
      name: this.name,
      bookmarks: bookmarks,
      color: this.color,
    });
  }

  public withColor = (color: FolderColor) => {
    return new Folder({
      id: this.id,
      name: this.name,
      bookmarks: this.bookmarks,
      color: color,
    });
  }

  public equals = (other: Folder | null): boolean => {
    if (other === null) {
      return false;
    }
    if (this.id !== other.id ||
        this.name !== other.name ||
        this.bookmarks.length !== other.bookmarks.length ||
        this.color !== other.color) {
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
      color: this.color,
    });
  }

  public static fromData = (data: FolderData): Folder => {
    const bookmarks = data.bookmarks.map(bookmarkData => Bookmark.fromData(bookmarkData));
    return new Folder({
      id: data.id,
      name: data.name,
      bookmarks: bookmarks,
      color: data.color,
    });
  }

  public toData = (): FolderData => {
    const bookmarkDatas = this.bookmarks.map(bookmark => bookmark.toData());
    return {
      id: this.id,
      name: this.name,
      bookmarks: bookmarkDatas,
      color: this.color,
    };
  }
}
