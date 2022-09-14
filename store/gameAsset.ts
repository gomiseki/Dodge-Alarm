import { ChampAsset_type } from '../types/champAsset';
// 액션 타입 정의
const SET_GAMEASSET = 'SET_GAMEASSET' as const;
const SET_CLIENT_STATE = 'SET_CLIENT_STATE' as const;

type gameAssetType = {
    patchVersion?:string,
    champIdToName?:ChampAsset_type,
    pickPhase?:any[]|false
}

// 액션 생섬함수 정의
export const setGameAsset = (diff: gameAssetType) => ({ type: SET_GAMEASSET, payload: diff });
export const setClientState = (diff:any[]|false) => ({ type: SET_CLIENT_STATE, payload: diff });

type IngameScoreAction =
ReturnType<typeof setGameAsset>|
ReturnType<typeof setClientState>

// **** 초기상태 정의
const initialState:gameAssetType = { pickPhase: false };
// **** 리듀서 작성
export default function GameAsset(state = initialState, action:IngameScoreAction) {
  switch (action.type) {
    case SET_GAMEASSET:
      return { ...state, ...action.payload };

    case SET_CLIENT_STATE:
      console.log(action.payload);
      return { ...state, pickPhase: action.payload };

    default:
      return state;
  }
}
