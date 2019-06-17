export class Link {
  public id: string;
  public url: string;
  public alias?: string;

  constructor({ id, url, alias }: { id?: string, url: string, alias?: string }) {
    this.id = id ? id : this.randomId();
    this.url = url;
    this.alias = alias ? alias : null;
  }

  withUrl = (url: string): Link => {
    return new Link({
      id: this.id,
      url: url,
      alias: this.alias,
    });
  }

  withAlias = (alias: string): Link => {
    return new Link({
      id: this.id,
      url: this.url,
      alias: alias,
    });
  }

  private randomId() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let id = '';
    for (let i = 0; i < 8; ++i) {
      const index = Math.floor(Math.random() * chars.length);
      id += chars[index];
    }
    return id;
  }
}
