import * as merge from 'deepmerge';

import { AppState } from 'reduxStore';
import { User, UserJson } from 'User';
import { Folder, FolderJson } from 'Folder';
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
  user: UserJson | null;
  folders: FolderJson[];
  backgroundImageTimestamp?: string;
  activeUtilityTab?: string;
}

type UserJsonPick = Pick<JsonState, 'user'>
type FoldersJsonPick = Pick<JsonState, 'folders'>
type SettingsJsonPick = Pick<JsonState, 'backgroundImageTimestamp'>

export type JsonStateSyncPartial = UserJsonPick & FoldersJsonPick & SettingsJsonPick;

type UserPick = Pick2<AppState, 'userState', 'user'>
type FoldersPick = Pick2<AppState, 'foldersState', 'folders'>
type SettingsPick = Pick2<AppState, 'settingsState', 'backgroundImageTimestamp'>
type ActiveUtilityTabPick = Pick2<AppState, 'utilitiesState', 'activeTab'>

export type AppStateSyncPartial = UserPick & FoldersPick & SettingsPick;
export type AppStateLoadPartial = AppStateSyncPartial & ActiveUtilityTabPick;

export class StateConverter {

  public static appStateToJsonState = (appState: AppState): JsonState => {
    return StateConverter.appStateLoadPartialToJsonState(appState);
  }

  public static appStateToJsonStateSyncPartial = (appState: AppState): JsonStateSyncPartial => {
    const jsonState = StateConverter.appStateToJsonState(appState);
    return StateConverter.jsonStateToJsonStateSyncPartial(jsonState);
  }

  public static appStateLoadPartialToJsonState = (appState: AppStateLoadPartial): JsonState => {
    const { user } = appState.userState;
    const { folders } = appState.foldersState;
    const { backgroundImageTimestamp } = appState.settingsState;
    const { activeTab: activeUtilityTab } = appState.utilitiesState;

    const userJson: UserJson | null = user === null ? null : user.toJson();
    const folderJsons: FolderJson[] = folders.map(folder => folder.toJson());

    return {
      user: userJson,
      folders: folderJsons,
      backgroundImageTimestamp: backgroundImageTimestamp,
      activeUtilityTab: activeUtilityTab,
    };
  }

  public static jsonStateToJsonStateSyncPartial = (jsonState: JsonState): JsonStateSyncPartial => {
    const { user, folders, backgroundImageTimestamp } = jsonState;
    return { user, folders, backgroundImageTimestamp };
  }

  public static jsonStateSyncPartialToAppStateSyncPartial = (jsonStateSyncPartial: JsonStateSyncPartial): AppStateSyncPartial => {
    const {
      user: userJson,
      folders: folderJsons,
      backgroundImageTimestamp: maybeBackgroundImageTimestamp,
    } = jsonStateSyncPartial;

    const user: User | null = userJson === null ? null : User.fromJson(userJson);
    const folders: Folder[] = folderJsons.map(json => Folder.fromJson(json));
    const backgroundImageTimestamp: string = maybeBackgroundImageTimestamp || '';

    return {
      userState: { user },
      foldersState: { folders },
      settingsState: { backgroundImageTimestamp },
    };
  }

  private static appStateLoadPartialToAppStateSyncPartial = (appStateLoadPartial: AppStateLoadPartial): AppStateSyncPartial => {
    const { user } = appStateLoadPartial.userState;
    const { folders } = appStateLoadPartial.foldersState;
    const { backgroundImageTimestamp } = appStateLoadPartial.settingsState;

    return {
      userState: { user },
      foldersState: { folders },
      settingsState: { backgroundImageTimestamp },
    };
  }

  public static jsonStateToAppStateLoadPartial = (jsonState: JsonState): AppStateLoadPartial => {
    const syncPartial = StateConverter.jsonStateSyncPartialToAppStateSyncPartial(jsonState);

    const { activeUtilityTab: maybeActiveTabString } = jsonState;
    const activeTab = UtilityTab.create(maybeActiveTabString);

    return {
      ...syncPartial,
      utilitiesState: { activeTab },
    }
  }
}
