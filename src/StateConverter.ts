import * as merge from 'deepmerge';

import { AppState } from 'reduxStore';
import { User, UserJson } from 'models/User';
import { Folder, FolderJson } from 'models/Folder';
import { Note, NoteJson } from 'models/Note';
import { UtilityTab } from 'reducers/UtilitiesReducer';


type RecursivePartial<T> = {
  [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object ? RecursivePartial<T[P]> :
    T[P];
};

type Pick2<T, K1 extends keyof T, K2 extends keyof T[K1]> = {
  [P1 in K1]: {
    [P2 in K2]: (T[K1])[P2];
  };
};

const overwriteMerge = (destinationArray: any[], sourceArray: any[], options: merge.Options): any[] => sourceArray;

// T is either JsonState or AppState
export function mergeStates<T>(state1: T, state2: RecursivePartial<T>): T {
  return merge(
    state1,
    state2 as Partial<T>, // This is a hack because the type definitions of the deepmerge library are wrong.
    { arrayMerge: overwriteMerge }
  );
}

export type JsonState = {
  dataVersion: number;
  user: UserJson | null;
  folders: FolderJson[];
  notes: NoteJson[];
  backgroundImageTimestamp: string;
  activeUtilityTab: string;
  currentOpenNoteId: string | null;
}

type DataVersionJsonPick = Pick<JsonState, 'dataVersion'>
type UserJsonPick = Pick<JsonState, 'user'>
type FoldersJsonPick = Pick<JsonState, 'folders'>
type NotesJsonPick = Pick<JsonState, 'notes'>
type SettingsJsonPick = Pick<JsonState, 'backgroundImageTimestamp'>

export type JsonStateSyncPartial = (
  DataVersionJsonPick
  & UserJsonPick
  & FoldersJsonPick
  & NotesJsonPick
  & SettingsJsonPick
);

type DataVersionPick = Pick2<AppState, 'metaState', 'dataVersion'>
type UserPick = Pick2<AppState, 'userState', 'user'>
type FoldersPick = Pick2<AppState, 'foldersState', 'folders'>
type NotesPick = Pick2<AppState, 'notesState', 'notes'>
type SettingsPick = Pick2<AppState, 'settingsState', 'backgroundImageTimestamp'>
type ActiveUtilityTabPick = Pick2<AppState, 'utilitiesState', 'activeTab'>
type CurrentOpenNotePick = Pick2<AppState, 'notesState', 'currentOpenNote'>

export type AppStateSyncPartial = DataVersionPick & UserPick & FoldersPick & NotesPick & SettingsPick;
export type AppStateLoadPartial = AppStateSyncPartial & ActiveUtilityTabPick & CurrentOpenNotePick;

export class StateConverter {

  public static appStateToJsonState = (appState: AppState): JsonState => {
    return StateConverter.appStateLoadPartialToJsonState(appState);
  }

  public static appStateToJsonStateSyncPartial = (appState: AppState): JsonStateSyncPartial => {
    const jsonState = StateConverter.appStateToJsonState(appState);
    return StateConverter.jsonStateToJsonStateSyncPartial(jsonState);
  }

  public static appStateLoadPartialToJsonState = (appState: AppStateLoadPartial): JsonState => {
    const { dataVersion } = appState.metaState;
    const { user } = appState.userState;
    const { folders } = appState.foldersState;
    const { notes, currentOpenNote } = appState.notesState;
    const { backgroundImageTimestamp } = appState.settingsState;
    const { activeTab: activeUtilityTab } = appState.utilitiesState;

    const userJson: UserJson | null = user === null ? null : user.toJson();
    const folderJsons: FolderJson[] = folders.map(folder => folder.toJson());
    const noteJsons: NoteJson[] = notes.map(note => note.toJson());

    const currentOpenNoteId = currentOpenNote?.id ?? null;

    return {
      dataVersion: dataVersion,
      user: userJson,
      folders: folderJsons,
      notes: noteJsons,
      backgroundImageTimestamp: backgroundImageTimestamp,
      activeUtilityTab: activeUtilityTab,
      currentOpenNoteId: currentOpenNoteId,
    };
  }

  public static jsonStateToJsonStateSyncPartial = (jsonState: JsonState): JsonStateSyncPartial => {
    const { dataVersion, user, folders, notes, backgroundImageTimestamp } = jsonState;
    return { dataVersion, user, folders, notes, backgroundImageTimestamp };
  }

  public static jsonStateToAppStateSyncPartial = (jsonState: JsonState): AppStateSyncPartial => {
    const jsonStateSyncPartial = StateConverter.jsonStateToJsonStateSyncPartial(jsonState);
    return StateConverter.jsonStateSyncPartialToAppStateSyncPartial(jsonStateSyncPartial);
  }

  public static jsonStateSyncPartialToAppStateSyncPartial = (jsonStateSyncPartial: JsonStateSyncPartial): AppStateSyncPartial => {
    const {
      dataVersion,
      user: userJson,
      folders: folderJsons,
      notes: noteJsons,
      backgroundImageTimestamp: maybeBackgroundImageTimestamp,
    } = jsonStateSyncPartial;

    const user: User | null = userJson === null ? null : User.fromJson(userJson);
    const folders: Folder[] = folderJsons.map(json => Folder.fromJson(json));
    const notes: Note[] = noteJsons.map(json => Note.fromJson(json));
    const backgroundImageTimestamp: string = maybeBackgroundImageTimestamp ?? '';

    return {
      metaState: { dataVersion },
      userState: { user },
      foldersState: { folders },
      notesState: { notes },
      settingsState: { backgroundImageTimestamp },
    };
  }

  private static appStateLoadPartialToAppStateSyncPartial = (appStateLoadPartial: AppStateLoadPartial): AppStateSyncPartial => {
    const { dataVersion } = appStateLoadPartial.metaState;
    const { user } = appStateLoadPartial.userState;
    const { folders } = appStateLoadPartial.foldersState;
    const { notes } = appStateLoadPartial.notesState;
    const { backgroundImageTimestamp } = appStateLoadPartial.settingsState;

    return {
      metaState: { dataVersion },
      userState: { user },
      foldersState: { folders },
      notesState: { notes },
      settingsState: { backgroundImageTimestamp },
    };
  }

  public static jsonStateToAppStateLoadPartial = (jsonState: JsonState): AppStateLoadPartial => {
    const syncPartial = StateConverter.jsonStateSyncPartialToAppStateSyncPartial(jsonState);

    const { activeUtilityTab: maybeActiveTabString, currentOpenNoteId } = jsonState;

    const currentOpenNote = currentOpenNoteId === null ? null : (
      syncPartial.notesState.notes.find(note => note.id === currentOpenNoteId) ?? null
    );

    const activeTab = UtilityTab.create(maybeActiveTabString);

    return {
      ...syncPartial,
      utilitiesState: { activeTab },
      notesState: {
        ...syncPartial.notesState,
        currentOpenNote,
      },
    }
  }
}
