import { randomId } from 'utils';

export interface NoteJson {
  id: string;
  name: string;
  text: string;
}

export class Note {
  public readonly id: string;
  public readonly name: string;
  public readonly text: string;

  constructor({ id, name, text }: { id?: string, name?: string, text?: string }) {
    this.id = id || randomId();
    this.name = name || '';
    this.text = text || '';
  }

  withName = (name: string): Note => {
    return new Note({
      id: this.id,
      name: name,
      text: this.text,
    });
  }

  withText = (text: string): Note => {
    return new Note({
      id: this.id,
      name: this.name,
      text: text,
    });
  }

  public equals = (other: Note | null): boolean => {
    if (other === null) {
      return false;
    }
    return (
      this.id === other.id &&
      this.name === other.name &&
      this.text === other.text
    );
  }

  public static fromJson = (json: NoteJson): Note => {
    return new Note(json);
  }

  public toJson = (): NoteJson => {
    return {
      id: this.id,
      name: this.name,
      text: this.text,
    };
  }
}
