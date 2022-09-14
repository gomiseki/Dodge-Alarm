export interface RerollPoints {
    currentPoints: number;
    maxRolls: number;
    numberOfRolls: number;
    pointsCostToRoll: number;
    pointsToReroll: number;
}

export interface userInfo_type{
    accountId: number;
    displayName: string;
    internalName: string;
    nameChangeFlag: boolean;
    percentCompleteForNextLevel: number;
    privacy: string;
    profileIconId: number;
    puuid: string;
    rerollPoints: RerollPoints;
    summonerId: number;
    summonerLevel: number;
    unnamed: boolean;
    xpSinceLastLevel: number;
    xpUntilNextLevel: number;
}

export interface userInfoAPI_type{
    id: string;
    accountId: string;
    puuid: string;
    name: string;
    profileIconId: number;
    revisionDate: number;
    summonerLevel: number;
}

export interface apiStatus_type{
    league?:boolean,
    summoner?:boolean
}

export interface userLeague_type {
    leagueId: string;
    queueType: string;
    tier: string;
    rank: string;
    summonerId: string;
    summonerName: string;
    leaguePoints: number;
    wins: number;
    losses: number;
    veteran: boolean;
    inactive: boolean;
    freshBlood: boolean;
    hotStreak: boolean;
}

export interface user_type{
    localUserInfo: userInfo_type,
    apiUserInfo: userInfoAPI_type,
    leagueUserInfo: userLeague_type,
    apiStatus: apiStatus_type
}

export const emptyUserInfoAPi = {
  localUserInfo: {
    accountId: 0,
    displayName: '',
    internalName: '',
    nameChangeFlag: false,
    percentCompleteForNextLevel: 0,
    privacy: '',
    profileIconId: 0,
    puuid: '',
    rerollPoints: {
      currentPoints: 0,
      maxRolls: 0,
      numberOfRolls: 0,
      pointsCostToRoll: 0,
      pointsToReroll: 0,
    },
    summonerId: 0,
    summonerLevel: 0,
    unnamed: false,
    xpSinceLastLevel: 0,
    xpUntilNextLevel: 0,
  },
  apiUserInfo: {
    id: '',
    accountId: '',
    puuid: '',
    name: '',
    profileIconId: 0,
    revisionDate: 0,
    summonerLevel: 0,
  },
  leagueUserInfo: {
    leagueId: '',
    queueType: '',
    tier: '',
    rank: '',
    summonerId: '',
    summonerName: '',
    leaguePoints: 0,
    wins: 0,
    losses: 0,
    veteran: false,
    inactive: false,
    freshBlood: false,
    hotStreak: false,
  },
  apiStatus: {
    league: false,
    summoner: false,
  },
};
