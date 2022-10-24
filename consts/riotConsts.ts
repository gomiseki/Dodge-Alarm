const CHAMP_BUGS:any = {
  FiddleSticks: 'Fiddlesticks',
};

// URL
export const RIOT_API_URL = 'https://kr.api.riotgames.com/lol/';
export const RIOT_API_URL_ASIA = 'https://asia.api.riotgames.com/lol/';

// endpoint
export const GET_SUMMONER_BY_NAME = 'summoner/v4/summoners/by-name/';
export const GET_MATCHES_BY_PUUID = 'match/v5/matches/by-puuid/';
export const GET_MATCH_BY_MATCHID = 'match/v5/matches/';
export const GET_ENTRIES_BY_ID = 'league/v4/entries/by-summoner/';

// Data Dragon
export const GET_PATCH_VERSION = 'https://ddragon.leagueoflegends.com/api/versions.json';
export const PROFILE_ICON = (version:string, number:number) => `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${number}.png`;
export const PATCH_TO_CHAMP = (version:string) => `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/champion.json`;
export const CHAMP_ICON = (version:string, name:string) => `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${name in CHAMP_BUGS ? CHAMP_BUGS[name] : name}.png`;

// Community Dragon
export const RANK_PLATE = 'https://raw.communitydragon.org/12.5/plugins/rcp-fe-lol-postgame/global/default/generic-progression-plate.png';
export const RANK_EMBLEM = (tier:string) => `https://raw.communitydragon.org/12.5/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/${tier}.png`;
export const 꿀벌 = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/loadouts/summoneremotes/flairs/em_bee_happy_inventory.png';
export const POSITION = (position:string) => `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champ-select/global/default/svg/position-${position}.svg`;
