import { Bookmark } from '../Bookmark';
import { CopyUrlState } from './CopyUrlReducer';

export interface AppState {
  bookmarks: Bookmark[];
  copyUrlState: CopyUrlState;
}
