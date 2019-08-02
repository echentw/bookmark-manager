import { Action } from '../actions/constants';
import { AppState } from '../reduxStore';

export type Reducer<SliceState> = (state: SliceState, action: Action, appState: AppState) => SliceState;
