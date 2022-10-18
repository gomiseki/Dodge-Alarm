export interface AlgorithmNomal_type{
    type:'AlgorithmNomal_type',
    maxScore:number,
    minScore:number,
    ratio:number
}

export interface AlgorithmDeath_type{
    type:'AlgorithmDeath_type',
    maxDeath:number,
    maxRatio:number,
    minRatio:number,
    ratio:number
}

export interface AlgorithmRatio_type{
    type:'AlgorithmRatio_type',
    maxRatio:number,
    minRatio:number,
    ratio:number
}

export interface PrevSeason_type{
    type:'PrevSeason_type',
    ratio:number
}

export interface Algorithm_type{
    [index: string]:any,
    matchCount:number,
    deathPerMatch?:AlgorithmNomal_type|false,
    KDAPerMatch?:AlgorithmNomal_type|false,
    winRate?: AlgorithmRatio_type|false,
    maxDeathPerCount?:AlgorithmDeath_type|false,
    positionRatio?: AlgorithmRatio_type|false,
    champUseRatio?:AlgorithmRatio_type|false,
    userLevel?:AlgorithmNomal_type|false,
    isPrevSeason?:PrevSeason_type|false
}

export interface Algorithms_type{
    algoName:string,
    algoData: Algorithm_type,
    selected:boolean
}

export interface scoreState{
    score:number,
    state:string
}

export interface essentialProps{
    [index:string]:any
    쌩배:{
        prevTier?:string
        prevLeague?:string
        state?:boolean
        apiStatus:boolean
    },
    포꼬:{
        positionRate:number[]
        state:boolean
    },
    꼴픽:{
        champUse:number
        champ:number
        state:boolean
    }
}

export interface algoScoreType{
    [index:string]:any,
    deathPerMatch:scoreState,
    KDAPerMatch:scoreState,
    winRate:scoreState,
    maxDeathPerCount:scoreState,
    positionRatio:scoreState,
    champUseRatio:scoreState,
    userLevel:scoreState,
    isPrevSeason:scoreState,
    essential?:essentialProps
}

export type AllAlgo_type =
number|
AlgorithmNomal_type|
AlgorithmDeath_type|
AlgorithmRatio_type|
PrevSeason_type

export const initAlgo:Algorithm_type = {
  matchCount: 10,
  deathPerMatch: {
    type: 'AlgorithmNomal_type',
    maxScore: 10,
    minScore: 0,
    ratio: 0,
  },
  KDAPerMatch: {
    type: 'AlgorithmNomal_type',
    maxScore: 0,
    minScore: 5,
    ratio: 0,
  },
  winRate: {
    type: 'AlgorithmRatio_type',
    maxRatio: 0,
    minRatio: 100,
    ratio: 0,
  },
  maxDeathPerCount: {
    type: 'AlgorithmDeath_type',
    maxDeath: 10,
    maxRatio: 100,
    minRatio: 0,
    ratio: 0,
  },
  positionRatio: {
    type: 'AlgorithmRatio_type',
    maxRatio: 0,
    minRatio: 100,
    ratio: 0,
  },
  champUseRatio: {
    type: 'AlgorithmRatio_type',
    maxRatio: 0,
    minRatio: 100,
    ratio: 0,
  },
  userLevel: {
    type: 'AlgorithmNomal_type',
    maxScore: 30,
    minScore: 100,
    ratio: 0,
  },
  isPrevSeason: {
    type: 'PrevSeason_type',
    ratio: 0,
  },
};

export const AlgoPropsToDesc:{[index:string]:any} = {
  matchCount: {
    name: '분석 게임 수',
    description: `유저의 최근 몇 경기 전적을 
분석할 지 정합니다.
숫자가 높을 수록 
속도가 저하될 수 있습니다.`,
    stateDescription: '',
  },
  deathPerMatch: {
    name: '게임 당 데스',
    description: '평균 데스를 분석합니다.',
    example: '매 판 10데스씩 박는 사람을 거르고 싶다면 최대10에 설정해보세요. 평균 10데스 이상부터 만점으로 처리되고, 최소가 0이라면 평균 0데스에서 0점으로 처리합니다.',
    stateDescription: '평균 데스',
  },
  KDAPerMatch: {
    name: '게임 당 KDA',
    description: '평균 KDA를 분석합니다.',
    example: 'KDA가 적어도 2는 넘어야 한다고 생각한다면 최대2에 설정해보세요. 평균KDA 2이상은 0점 처리되고, 최소가 0이라면 평균KDA 0에서 만점 처리합니다.',
    stateDescription: '평균 KDA',
  },
  winRate: {
    name: '랭크 승률',
    description: '랭크 승률을 분석합니다.',
    example: '랭크 승률 50%이하와는 상종도 하기 싫다면 최저 승률을 50%에 놓아보세요. 승률 50%이하는 만점처리되고, 최대가 60이라면 승률 60에서 0점으로 처리됩니다.',
    stateDescription: '최근 승률',
  },
  maxDeathPerCount: {
    name: '경기 당 최대 데스 비율',
    description: `분석 경기 중 기준 데스 이상을 기록한 
게임의 비율을 설정합니다.`,
    example: '10데스 이상 기록한 게임의 비율이 50%이상인 유저를 경계한다면 최대 데스를 10에, 최대 비율을 50에 놓아보세요. 10데스 게임 비율이 50%가 넘는다면 만점처리되고, 최소비율이 30이라면 30%에서 만점처리됩니다.',
    stateDescription: '경기 당 최대 데스 비율',
  },
  positionRatio: {
    name: '포지션 숙련도',
    description: '분석 경기 중 해당 포지션을 경험한 비율을 분석합니다.',
    example: '10경기 중 해당 포지션을 처음 경험하는 유저를 거르고 싶다면 최소 비율을 10에 설정해보세요. 포지션이 꼬였다면 만점처리되고, 최대비율을 넘기면 익숙한 포지션이므로 0점처리됩니다.',
    stateDescription: '포지션 배정 비율',
  },
  champUseRatio: {
    name: '챔피언 숙련도',
    description: '분석 경기 중 해당 챔피언을 플레이한 비율을 분석합니다.',
    example: '10경기 중 해당 챔피언을 처음 사용한 유저를 거르고 싶다면 최소 비율을 10에 설정해보세요. 처음하는 챔피언이라면 만점처리되고, 최대비율을 넘기면 익숙한 챔피언이므로 0점처리됩니다.',
    stateDescription: '챔피언 사용 비율',
  },
  userLevel: {
    name: '유저 레벨',
    description: '유저의 레벨을 분석합니다.',
    example: '레벨이 낮을 수록 플레이어의 멘탈에 치명적인 상처를 줄 가능성이 높아질 수 있습니다.',
    stateDescription: '유저 레벨',
  },
  isPrevSeason: {
    name: '쌩배',
    description: `전 시즌 티어 존재 여부를 분석합니다.
자체 데이터센터가 없어 하자가 있는 
기능입니다. ㅠㅠ`,
    example: '괴물쥐도 쌩배 시 챌린저 1000점 가능해.... - 중국트페장인',
    stateDescription: '전 시즌',
  },
};
