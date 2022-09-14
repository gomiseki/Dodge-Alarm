export interface gamePhase{
    actorCellId: number,
    championId: number,
    completed: boolean,
    id: number,
    isAllyAction: boolean,
    isInProgress: boolean,
    type: string
  }

export interface PickAPI_type {
    actions:              Array<Action[]>;
    allowBattleBoost:     boolean;
    allowDuplicatePicks:  boolean;
    allowLockedEvents:    boolean;
    allowRerolling:       boolean;
    allowSkinSelection:   boolean;
    bans:                 Bans;
    benchChampionIds:     any[];
    benchEnabled:         boolean;
    boostableSkinCount:   number;
    chatDetails:          ChatDetails;
    counter:              number;
    entitledFeatureState: EntitledFeatureState;
    gameId:               number;
    hasSimultaneousBans:  boolean;
    hasSimultaneousPicks: boolean;
    isCustomGame:         boolean;
    isSpectating:         boolean;
    localPlayerCellId:    number;
    lockedEventIndex:     number;
    myTeam:               Team[];
    recoveryCounter:      number;
    rerollsRemaining:     number;
    skipChampionSelect:   boolean;
    theirTeam:            Team[];
    timer:                Timer;
    trades:               any[];
}
export interface Action {
    actorCellId:  number;
    championId:   number;
    completed:    boolean;
    id:           number;
    isAllyAction: boolean;
    isInProgress: boolean;
    type:         Type;
}

export enum Type {
    Ban = "ban",
    Pick = "pick",
    TenBansReveal = "ten_bans_reveal",
}

export interface Bans {
    myTeamBans:    any[];
    numBans:       number;
    theirTeamBans: any[];
}

export interface ChatDetails {
    chatRoomName:     string;
    chatRoomPassword: null;
}

export interface EntitledFeatureState {
    additionalRerolls: number;
    unlockedSkinIds:   any[];
}

export interface Team {
    assignedPosition:    string;
    cellId:              number;
    championId:          number;
    championPickIntent:  number;
    entitledFeatureType: string;
    selectedSkinId:      number;
    spell1Id:            number;
    spell2Id:            number;
    summonerId:          number;
    team:                number;
    wardSkinId:          number;
}

export interface Timer {
    adjustedTimeLeftInPhase: number;
    internalNowInEpochMs:    number;
    isInfinite:              boolean;
    phase:                   string;
    totalTimeInPhase:        number;
}
