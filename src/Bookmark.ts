import { randomId } from 'utils';

export const defaultFaviconUrl = 'assets/world_favicon.ico';

export interface BookmarkJson {
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

  constructor({ id, url, faviconUrl, title, name }: {
    id?: string,
    url: string,
    faviconUrl: string,
    title: string,
    name?: string,
  }) {
    this.id = id ?? randomId();
    this.url = url;
    this.faviconUrl = faviconUrl ?? defaultFaviconUrl;
    this.title = title;
    this.name = name ?? '';
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

  public static fromJson = (json: BookmarkJson): Bookmark => {
    return new Bookmark(json);
  }

  public toJson = (): BookmarkJson => {
    return {
      id: this.id,
      url: this.url,
      faviconUrl: this.faviconUrl,
      title: this.title,
      name: this.name,
    };
  }
}
