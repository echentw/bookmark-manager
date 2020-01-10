import { Bookmark, BookmarkData } from 'Bookmark';
import { randomId } from 'utils';

export interface FolderData {
  id: string;
  name: string;
  bookmarks: BookmarkData[];
  color: FolderColor;
  collapsed: boolean;
}

export enum FolderColor {
  Red,
  Green,
  Blue,
  Yellow,
  Violet,
  Orange,
  Black,
  Grey,
  LightBlue,
}

export const colorsToCssClasses = new Map([
  [FolderColor.Red, 'red'],
  [FolderColor.Green, 'green'],
  [FolderColor.Blue, 'blue'],
  [FolderColor.Yellow, 'yellow'],
  [FolderColor.Violet, 'violet'],
  [FolderColor.Orange, 'orange'],
  [FolderColor.Black, 'black'],
  [FolderColor.Grey, 'grey'],
  [FolderColor.LightBlue, 'light-blue'],
]);

if (Array.from(colorsToCssClasses.entries()).length !== 9) {
  throw new Error('There are too many folder color options!');
}

export class Folder {
  public readonly id: string;
  public readonly name: string;
  public readonly bookmarks: Bookmark[];
  public readonly color: FolderColor;
  public readonly collapsed: boolean;

  constructor({ name, id, bookmarks, color, collapsed }: {
    name: string,
    id?: string,
    bookmarks?: Bookmark[],
    color?: FolderColor,
    collapsed?: boolean,
  }) {
    this.id = (id !== undefined) ? id : randomId();
    this.name = name;
    this.bookmarks = (bookmarks !== undefined) ? bookmarks : [];
    this.color = (color !== undefined) ? color : FolderColor.Black;
    this.collapsed = collapsed || false;
  }

  public withName = (name: string) => {
    return new Folder({
      id: this.id,
      name: name,
      bookmarks: this.bookmarks,
      color: this.color,
      collapsed: this.collapsed,
    });
  }

  public withBookmarks = (bookmarks: Bookmark[]) => {
    return new Folder({
      id: this.id,
      name: this.name,
      bookmarks: bookmarks,
      color: this.color,
      collapsed: this.collapsed,
    });
  }

  public withColor = (color: FolderColor) => {
    return new Folder({
      id: this.id,
      name: this.name,
      bookmarks: this.bookmarks,
      color: color,
      collapsed: this.collapsed,
    });
  }

  public withCollapsed = (collapsed: boolean) => {
    return new Folder({
      id: this.id,
      name: this.name,
      bookmarks: this.bookmarks,
      color: this.color,
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
        this.color !== other.color ||
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
      color: this.color,
      collapsed: this.collapsed,
    });
  }

  public static fromData = (data: FolderData): Folder => {
    const bookmarks = data.bookmarks.map(bookmarkData => Bookmark.fromData(bookmarkData));
    return new Folder({
      id: data.id,
      name: data.name,
      bookmarks: bookmarks,
      color: data.color,
      collapsed: data.collapsed === undefined ? true : data.collapsed,
    });
  }

  public toData = (): FolderData => {
    const bookmarkDatas = this.bookmarks.map(bookmark => bookmark.toData());
    return {
      id: this.id,
      name: this.name,
      bookmarks: bookmarkDatas,
      color: this.color,
      collapsed: this.collapsed,
    };
  }
}
