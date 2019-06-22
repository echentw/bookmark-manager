import axios from 'axios';

export class Bookmark {
  public id: string;
  public url: string;
  public title: string | null;
  public name: string | null;

  constructor({ id, url, title, name }: {
    id?: string,
    url: string,
    title?: string,
    name?: string,
  }) {
    this.id = id ? id : this.randomId();
    this.url = url;
    this.title = title ? title : null;
    this.name = name ? name : null;
  }

  clone = ({ url, title, name }: { url?: string, title?: string, name?: string }): Bookmark => {
    return new Bookmark({
      id: this.id,
      url: url === undefined ? this.url : url,
      title: title === undefined ? this.title : title,
      name: name === undefined ? this.name : name,
    });
  }

  static inferTitle = async (url: string): Promise<string> => {
    const endpoint = `http://textance.herokuapp.com/title/${url}`;
    const response: any = await axios.get(endpoint);
    return response.data;
  }

  faviconUrl = (): string => {
    return `https://www.google.com/s2/favicons?domain_url=${this.url}`;
  }

  displayName = (): string => {
    if (this.name !== null) {
      return this.name;
    }
    if (this.title !== null) {
      return this.title;
    }
    return this.url;
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
