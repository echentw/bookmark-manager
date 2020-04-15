export interface UserJson {
  name: string;
}

export class User {
  public readonly name: string;

  constructor({ name }: { name: string }) {
    this.name = name;
  }

  public withName = (name: string) => {
    return new User({ name: name });
  }

  public equals = (other: User | null): boolean => {
    if (other === null) {
      return false;
    }
    return (this.name === other.name);
  }

  public copy = (): User => {
    return new User({ name: this.name });
  }

  public static fromJson = (json: UserJson): User => {
    return new User(json);
  }

  public toJson = (): UserJson => {
    return { name: this.name };
  }
}
