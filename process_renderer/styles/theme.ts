import { DefaultTheme } from 'styled-components';
import editions from './editions';

const theme:DefaultTheme = {
  editions,
  buttonSizes: {
    large: {
      height: '30px',
      width: '30px',
    },
    medium: {
      height: '20px',
      width: '20px',
    },
    small: {
      height: '20px',
      width: '20px',
    },
  },
  selectSizes: {
    large: {
      height: '30px',
      width: '260px',
    },
    medium: {
      height: '27px',
      width: '180px',
    },
    small: {
      height: '20px',
      width: '20px',
    },
  },
  palette: {
    themeMain: '#7d4f82',
    winGreen: '#00ff00',
    loseRed: '#e71837',
    string: '#55354f',
    transparent: 'transparent',
    silver: '#dedede',
    LCKBlue: '#6454ed',
    LCKRed: '#f0393b',
  },
  font: {
    light: 'paybooc-Light',
    main: 'paybooc-Medium',
    bold: 'paybooc-Bold',
  },
  tier: {
    unranked: {
      main: '#6454ed',
      sub: '#f0393b',
    },
    iron: {
      main: '#413233',
      sub: '#837374',
    },
    bronze: {
      main: '#5B2B18',
      sub: '#9B744E',
    },
    silver: {
      main: '#3B4946',
      sub: '#8FA0A2',
    },
    gold: {
      main: '#875C1A',
      sub: '#E3C352',
    },
    platinum: {
      main: '#275967',
      sub: '#7AD0B5',
    },
    diamond: {
      main: '#3859A1',
      sub: '#A0B4D4',
    },
    master: {
      main: '#682F6D',
      sub: '#AF7CC6',
    },
    grandmaster: {
      main: '#972A17',
      sub: '#B96162',
    },
    challenger: {
      main: '#703D19',
      sub: '#D1C468',
    },
  },
  essential: {
    포꼬: '#8a1500',
    쌩배: '#8a4e00',
    꼴픽: '#00778a',
    내로남불: '#8a0075',
  },
};

export default theme;
