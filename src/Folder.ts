import { Bookmark, BookmarkJson } from 'Bookmark';
import { randomId } from 'utils';

export interface FolderJson {
  id: string;
  name: string;
  bookmarks: BookmarkJson[];
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
    this.id = id ?? randomId();
    this.name = name;
    this.bookmarks = bookmarks ?? [];
    this.collapsed = collapsed ?? false;
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

  public static fromJson = (json: FolderJson): Folder => {
    const bookmarks = json.bookmarks.map(bookmarkJson => Bookmark.fromJson(bookmarkJson));
    return new Folder({
      id: json.id,
      name: json.name,
      bookmarks: bookmarks,
      collapsed: json.collapsed === undefined ? true : json.collapsed,
    });
  }

  public toJson = (): FolderJson => {
    const bookmarkJsons = this.bookmarks.map(bookmark => bookmark.toJson());
    return {
      id: this.id,
      name: this.name,
      bookmarks: bookmarkJsons,
      collapsed: this.collapsed,
    };
  }
}
