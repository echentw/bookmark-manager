export class Link {
  public id: string;
  public url: string;
  public name: string | null;

  constructor({ id, url, name }: { id?: string, url: string, name?: string }) {
    this.id = id ? id : this.randomId();
    this.url = url;
    this.name = name ? name : null;
  }

  withUrl = (url: string): Link => {
    return new Link({
      id: this.id,
      url: url,
      name: this.name,
    });
  }

  withName = (name: string): Link => {
    return new Link({
      id: this.id,
      url: this.url,
      name: name,
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
