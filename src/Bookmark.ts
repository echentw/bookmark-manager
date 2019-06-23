export class Bookmark {
  public readonly id: string;
  public readonly url: string;
  public readonly faviconUrl: string;
  public readonly title: string;
  public name: string;

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

    this.id = id ? id : this.randomId();
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

  private randomId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let id = '';
    for (let i = 0; i < 8; ++i) {
      const index = Math.floor(Math.random() * chars.length);
      id += chars[index];
    }
    return id;
  }
}
