import {
  emptyUserInfoAPi,
  user_type,
  userInfoAPI_type,
  userInfo_type,
  userLeague_type,
  apiStatus_type,
} from '../types/userInfo.type';

// 액션 타입 정의
const SET_USER = 'SET_USER' as const;
const SET_API_USER = 'SET_API_USER' as const;
const SET_LOCAL_USER = 'SET_LOCAL_USER' as const;
const SET_LEAGUE_USER = 'SET_LEAGUE_USER' as const;
const SET_USER_API_STATUS = 'SET_USER_API_STATUS' as const;
const CLEAR_USER = 'CLEAR_USER' as const;

// 액션 생섬함수 정의
export const setUser = (diff: user_type) => ({ type: SET_USER, payload: diff });
export const setApiUser = (diff: userInfoAPI_type) => ({ type: SET_API_USER, payload: diff });
export const setLocalUser = (diff:userInfo_type) => ({ type: SET_LOCAL_USER, payload: diff });
export const setLeagueUser = (diff:userLeague_type) => ({ type: SET_LEAGUE_USER, payload: diff });
export const setUserApiStatus = (diff: apiStatus_type) => (
  { type: SET_USER_API_STATUS, payload: diff });
export const clearUser = () => ({ type: CLEAR_USER, payload: emptyUserInfoAPi });

type userInfoAction =
ReturnType<typeof setUser>|
ReturnType<typeof setApiUser>|
ReturnType<typeof setLocalUser>|
ReturnType<typeof setLeagueUser>|
ReturnType<typeof setUserApiStatus>|
ReturnType<typeof clearUser>

// **** 리듀서 작성
export default function User(state:user_type = emptyUserInfoAPi, action:userInfoAction) {
  switch (action.type) {
    case SET_USER:
      return action.payload;

    case SET_API_USER:
      return {
        ...state,
        apiUserInfo: action.payload,
      };

    case SET_LOCAL_USER:
      return {
        ...state,
        localUserInfo: action.payload,
      };

    case SET_LEAGUE_USER:
      return {
        ...state,
        leagueUserInfo: action.payload,
      };

    case SET_USER_API_STATUS:
      return {
        ...state,
        apiStatus: Object.assign(state.apiStatus, action.payload),
      };

    case CLEAR_USER:
      return action.payload;

    default:
      return state;
  }
}
