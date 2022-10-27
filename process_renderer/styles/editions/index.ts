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
  jbitr6WW62clA10q0oZGdXwo2ZSYYfItF5W36ZIabXLMeQ: 강찬밥,
  'HiyJvxssxHPmyusmiYnRDjnZbhehpXn1x3IwZBlD-hT6CLQ': 고수달,
};

export default editions;
