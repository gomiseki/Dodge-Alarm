import { ChampAsset_type } from '../types/champAsset';
// 액션 타입 정의
const SET_GAMEASSET = 'SET_GAMEASSET' as const;
const SET_CLIENT_STATE = 'SET_CLIENT_STATE' as const;
const SET_FOLD = 'SET_FOLD' as const;

type gameAssetType = {
    patchVersion?:string,
    champIdToName?:ChampAsset_type,
    pickPhase?:any[]|false,
    fold?: boolean,
}

// 액션 생섬함수 정의
export const setGameAsset = (diff: gameAssetType) => ({ type: SET_GAMEASSET, payload: diff });
export const setClientState = (diff:any[]|false) => ({ type: SET_CLIENT_STATE, payload: diff });
export const setFold = (diff:boolean) => ({ type: SET_FOLD, payload: diff });

type IngameScoreAction =
ReturnType<typeof setGameAsset>|
ReturnType<typeof setClientState>|
ReturnType<typeof setFold>

// **** 초기상태 정의
const initialState:gameAssetType = { pickPhase: false, fold: false };

// **** 리듀서 작성
export default function GameAsset(state = initialState, action:IngameScoreAction) {
  switch (action.type) {
    case SET_GAMEASSET:
      return { ...state, ...action.payload };

    case SET_CLIENT_STATE:
      return { ...state, pickPhase: action.payload };

    case SET_FOLD:
      return { ...state, fold: action.payload };
    default:
      return state;
  }
}
