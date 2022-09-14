import { N8KalKcO0HaCtfH2NUOLITasx3RIlazuiyHP5dOVmlVNQA } from './강찬밥';

interface IProfile{
  nickname: string,
  profile: string,
}

interface ITier{
    unranked?:IProfile
    iron?: IProfile,
    bronze?: IProfile,
    silver?: IProfile,
    gold?: IProfile,
    platinum?: IProfile,
    diamond?: IProfile,
    master?: IProfile,
    grandmaster?: IProfile,
    challenger?: IProfile,
}

export interface IEdition{
  [index:string]:any,
  themeMain: string,
  team: string,
  tier: ITier
}

const editions:IEdition = Object.assign(
  N8KalKcO0HaCtfH2NUOLITasx3RIlazuiyHP5dOVmlVNQA,
);

export default editions;
