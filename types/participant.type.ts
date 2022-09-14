export interface Participant_type {
    availability?:            string;
    gameName?:                string;
    gameTag?:                 string;
    icon?:                    number;
    id?:                      string;
    lastSeenOnlineTimestamp?: null;
    lol?:                     Lol;
    name?:                    string;
    patchline?:               string;
    pid?:                     string;
    platformId?:              string;
    product?:                 string;
    productName?:             string;
    puuid?:                   string;
    statusMessage?:           string;
    summary?:                 string;
    summonerId?:              number;
    time?:                    number;
}

export interface Lol {
    championId?:               string;
    companionId?:              string;
    damageSkinId?:             string;
    gameId?:                   string;
    gameMode?:                 string;
    gameQueueType?:            string;
    gameStatus?:               string;
    iconOverride?:             string;
    isObservable?:             string;
    level?:                    string;
    mapId?:                    string;
    mapSkinId?:                string;
    masteryScore?:             string;
    profileIcon?:              string;
    puuid?:                    string;
    queueId?:                  string;
    rankedLeagueDivision?:     string;
    rankedLeagueQueue?:        string;
    rankedLeagueTier?:         string;
    rankedLosses?:             string;
    rankedPrevSeasonDivision?: string;
    rankedPrevSeasonTier?:     string;
    rankedSplitRewardLevel?:   string;
    rankedWins?:               string;
    regalia?:                  string;
    skinVariant?:              string;
    skinname?:                 string;
    timeStamp?:                string;
}

