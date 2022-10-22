import { 강찬밥 } from './강찬밥';
import { 고수달 } from './고수달';

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
  name: string,
  themeMain: string,
  team: string,
  tier: ITier
}

const editions = {
  N8KalKcO0HaCtfH2NUOLITasx3RIlazuiyHP5dOVmlVNQA: 강찬밥,
  'RqrhG_wfSKRimnd6ilk8whHdM4-8cOFkUJvRXd71QT3HQLY': 고수달,
};

export default editions;
