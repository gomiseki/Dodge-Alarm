export const LCU_ENDPOINT_USER_STATUS = '/lol-summoner/v1/current-summoner';
export const LCU_ENDPOINT_CHAMP_SELECT = '/lol-champ-select/v1/session';
export const LCU_ENDPOINT_CHAT_SESSION = '/lol-chat/v1/conversations';

export const LCU_ENDPOINT_PARTICIPANTS = (id:string) => `/lol-chat/v1/conversations/${id}/participants`;

export const LCU_RUNEBOOK = (summonerId:string) => `/lol-collections/v1/inventories/${summonerId}/rune-book`;
