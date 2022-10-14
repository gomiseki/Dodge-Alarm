import { Team } from '../types/champSelect.type';
import { Participant_type } from '../types/participant.type';
import { ParticipantMatchData_type } from '../types/matchData.type';

// 액션 타입 정의
const SET_INGAME = 'SET_INGAME' as const;
const SET_PICK_STATUS = 'SET_PICK_STATUS' as const;
const SET_SUMMONER_FEATURE = 'SET_SUMMONER_FEATURE' as const;
const SET_SUMMONER_MATCH_DATA = 'SET_SUMMONER_MATCH_DATA' as const;
const CLEAR_INGAME = 'CLEAR_INGAME' as const;

export interface inGameDataType extends Team{
  summonerMatchData:ParticipantMatchData_type,
}

// 액션 생섬함수 정의
export const setInGame = (diff: inGameDataType[]) => ({ type: SET_INGAME, payload: diff });
export const setInGameStatus = (diff: inGameDataType[]) => ({ type: SET_INGAME, payload: diff });
export const setPickStatus = (diff:Team[]) => ({ type: SET_PICK_STATUS, payload: diff });
export const setSummonerFeature = (diff:Participant_type[]) => (
  { type: SET_SUMMONER_FEATURE, payload: diff });
export const setSummonerMatchData = (diff:ParticipantMatchData_type[]) => (
  { type: SET_SUMMONER_MATCH_DATA, payload: diff });
export const clearInGame = () => ({ type: CLEAR_INGAME });

type userInfoAction =
ReturnType<typeof setInGame>|
ReturnType<typeof setPickStatus>|
ReturnType<typeof setSummonerFeature>|
ReturnType<typeof setSummonerMatchData>|
ReturnType<typeof clearInGame>

const inGameDataState:inGameDataType[]|[] = [];

// **** 리듀서 작성
export default function InGame(state = ingame, action:userInfoAction):inGameDataType[]|[] {
  switch (action.type) {
    case SET_INGAME:
      return action.payload;

    case SET_PICK_STATUS:
      return action.payload.map((member, index) => (
        { ...state[index], ...member }
      ));

    case SET_SUMMONER_MATCH_DATA:
      if (!state) {
        return state;
      }
      return state.map((member, index) => ({
        ...member,
        summonerMatchData: action.payload[index],
      }));

    case CLEAR_INGAME:
      return [];

    default:
      return state;
  }
}
