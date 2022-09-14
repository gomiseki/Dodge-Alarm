import { algoScoreType } from '../types/algorithm.type';
// 액션 타입 정의
const SET_INGAMESCORE = 'SET_INGAMESCORE' as const;
const SET_CLEARSCORE = 'SET_CLEARSCORE' as const;

// 액션 생섬함수 정의
export const setIngameScore = (diff: algoScoreType[]) => ({ type: SET_INGAMESCORE, payload: diff });
export const clearScore = () => ({ type: SET_CLEARSCORE });

type IngameScoreAction =
ReturnType<typeof setIngameScore>|
ReturnType<typeof clearScore>

// **** 초기상태 정의
const initialState:algoScoreType[]|[] = [];

// **** 리듀서 작성
export default function IngameScore(state = initialState, action:IngameScoreAction) {
  switch (action.type) {
    case SET_INGAMESCORE:
      return action.payload;

    case SET_CLEARSCORE:
      return [];

    default:
      return state;
  }
}
