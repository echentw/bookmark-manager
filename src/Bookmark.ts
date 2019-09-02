import { randomId } from './utils';

export interface BookmarkData {
  id: string;
  url: string;
  faviconUrl: string;
  title: string;
  name: string;
}

export class Bookmark {
  public readonly id: string;
  public readonly url: string;
  public readonly faviconUrl: string;
  public readonly title: string;
  public readonly name: string;

  constructor({ url, title, faviconUrl, id, name }: {
    url: string,
    title: string,
    faviconUrl: string,
    id?: string
    name?: string,
  }) {
    this.url = url;
    this.title = title;
    this.faviconUrl = faviconUrl;

    this.id = id ? id : randomId();
    this.name = name ? name : '';
  }

  public displayName = (): string => {
    if (this.name !== '') {
      return this.name;
    }
    if (this.title !== '') {
      return this.title;
    }
    return this.url;
  }

  public withName = (name: string): Bookmark => {
    return new Bookmark({
      url: this.url,
      title: this.title,
      faviconUrl: this.faviconUrl,
      id: this.id,
      name: name,
    });
  }

  public equals = (other: Bookmark | null): boolean => {
    if (other === null) {
      return false;
    }
    return (
      this.id === other.id &&
      this.name === other.name &&
      this.title === other.title &&
      this.url === other.url &&
      this.faviconUrl === other.faviconUrl
    );
  }

  public static fromData = (data: BookmarkData): Bookmark => {
    return new Bookmark(data);
  }

  public toData = (): BookmarkData => {
    return {
      id: this.id,
      url: this.url,
      faviconUrl: this.faviconUrl,
      title: this.title,
      name: this.name,
    };
  }
}
