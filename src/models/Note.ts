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
