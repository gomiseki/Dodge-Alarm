import { Algorithms_type } from '../types/algorithm.type';

// 액션 타입 정의
const SET_ALGORITHM = 'SET_ALGORITHM' as const;
const SELECT_ALGORITHM = 'SELECT_ALGORITHM' as const;

// 액션 생섬함수 정의
export const setAlgorithm = (diff: Algorithms_type[]) => ({ type: SET_ALGORITHM, payload: diff });
export const selectAlgorithm = (diff:string) => ({ type: SELECT_ALGORITHM, payload: diff });

type AlgorithmAction =
ReturnType<typeof setAlgorithm>|
ReturnType<typeof selectAlgorithm>

// **** 초기상태 정의
const initialState:Algorithms_type[] = [];

// **** 리듀서 작성
export default function Algorithm(state = initialState, action:AlgorithmAction) {
  switch (action.type) {
    case SET_ALGORITHM:
      return action.payload;

    case SELECT_ALGORITHM:
      return state.map((algo) => {
        if (algo.algoName === action.payload) {
          return Object.assign(algo, { selected: true });
        }
        return Object.assign(algo, { selected: false });
      });

    default:
      return state;
  }
}
