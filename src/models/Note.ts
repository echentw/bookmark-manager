import { randomId } from 'utils';
import {
  EditorState,
  ContentState,
  convertFromHTML,
  convertToRaw,
  convertFromRaw,
  RawDraftContentState,
} from 'draft-js';


export interface NoteJson {
  id: string;
  name: string;
  text?: string; // deprecated
  content?: RawDraftContentState;
}

export class Note {
  public readonly id: string;
  public readonly name: string;
  public readonly editorState: EditorState;

  constructor({ id, name, editorState }: { id?: string, name?: string, editorState?: EditorState }) {
    this.id = id || randomId();
    this.name = name || '';
    this.editorState = editorState || EditorState.createEmpty();
  }

  withName = (name: string): Note => {
    return new Note({
      id: this.id,
      name: name,
      editorState: this.editorState,
    });
  }

  withEditorState = (editorState: EditorState): Note => {
    return new Note({
      id: this.id,
      name: this.name,
      editorState: editorState,
    });
  }

  public equals = (other: Note | null): boolean => {
    if (other === null) {
      return false;
    }
    return (
      this.id === other.id &&
      this.name === other.name &&
      this.editorState === other.editorState
    );
  }

  public copy = (): Note => {
    return new Note({
      id: this.id,
      name: this.name,
      editorState: this.editorState,
    });
  }

  public static fromJson = (json: NoteJson): Note => {
    let contentState: ContentState;
    if (json.content) {
      contentState = convertFromRaw(json.content);
    } else {
      const blocks = convertFromHTML(json.text);
      contentState = ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap);
    }
    return new Note({
      id: json.id,
      name: json.name,
      editorState: EditorState.createWithContent(contentState),
    });
  }

  public toJson = (): NoteJson => {
    const contentState = this.editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    return {
      id: this.id,
      name: this.name,
      content: rawContentState,
    };
  }
}
