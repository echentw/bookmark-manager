import { Bookmark, BookmarkData } from './Bookmark';

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
    this.name = name;
    this.id = id ? id : this.randomId();
    this.bookmarks = bookmarks ? bookmarks : [];
  }

  public withName = (name: string) => {
    return new Folder({
      id: this.id,
      bookmarks: this.bookmarks,
      name: name,
    });
  }

  public addBookmarks = (bookmarks: Bookmark[]) => {
    this.bookmarks.push(...bookmarks);
  }

  // Copied from Bookmark.ts
  private randomId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let id = '';
    for (let i = 0; i < 8; ++i) {
      const index = Math.floor(Math.random() * chars.length);
      id += chars[index];
    }
    return id;
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
