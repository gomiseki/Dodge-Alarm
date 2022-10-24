/* eslint-disable no-plusplus */
import {
  Algorithm_type, AlgorithmDeath_type, algoScoreType, scoreState, AllAlgo_type,
} from '../../types/algorithm.type';
import { inGameDataType } from '../../store/inGame';

const getPositionTwisted = (arr:any[], index:number) => {
  let answer = 0;
  const sum = arr.reduce((p, c) => p + c, 0);
  arr.forEach((v:number) => {
    if (v > arr[index])answer += 1;
  });
  if (answer >= 2 || (arr[index] === 0 || arr[index] < sum * 0.2)) return true;
  return false;
};

const rawToRatioScore = (algoScore:any, algoData:AllAlgo_type) => {
  let score = 0;
  if (typeof algoData !== 'number') {
    switch (algoData.type) {
      case 'AlgorithmNomal_type': {
        let origin;
        if ((algoData.maxScore - algoData.minScore) === 0) {
          origin = (algoScore - algoData.minScore) >= 0 ? 1 : 0;
        } else {
          origin = ((algoScore - algoData.minScore) / (algoData.maxScore - algoData.minScore));
        }
        if (origin <= 0) {
          score = 0;
        } else if (origin < 1) {
          score = origin * algoData.ratio;
        } else {
          score = algoData.ratio;
        }
        break;
      }
      case 'AlgorithmDeath_type': {
        let origin;
        if ((algoData.maxRatio - algoData.minRatio) === 0) {
          origin = (algoScore - algoData.minRatio) >= 0 ? 1 : 0;
        } else {
          origin = ((algoScore - algoData.minRatio) / (algoData.maxRatio - algoData.minRatio));
        }
        if (origin <= 0) {
          score = 0;
        } else if (origin < 1) {
          score = origin * algoData.ratio;
        } else {
          score = algoData.ratio;
        }
        break;
      }
      case 'AlgorithmRatio_type': {
        let origin;
        if ((algoData.maxRatio - algoData.minRatio) === 0) {
          origin = (algoScore - algoData.minRatio) >= 0 ? 1 : 0;
        } else {
          origin = ((algoScore - algoData.minRatio) / (algoData.maxRatio - algoData.minRatio));
        }
        if (origin <= 0) {
          score = 0;
        } else if (origin < 1) {
          score = origin * algoData.ratio;
        } else {
          score = algoData.ratio;
        }
        break;
      }

      case 'PrevSeason_type': {
        score = algoScore ? 0 : algoData.ratio;

        break;
      }
      default:
        break;
    }
  }
  return score;
};

const algoAnalysis = (algoData:Algorithm_type|boolean, inGameData:inGameDataType) => {
  const algoScore:algoScoreType = {
    deathPerMatch: {
      score: 0,
      state: '',
    },
    KDAPerMatch: {
      score: 0,
      state: '',
    },
    winRate: {
      score: 0,
      state: '',
    },
    maxDeathPerCount: {
      score: 0,
      state: '',
    },
    positionRatio: {
      score: 0,
      state: '',
    },
    champUseRatio: {
      score: 0,
      state: '',
    },
    userLevel: {
      score: 0,
      state: '',
    },
    isPrevSeason: {
      score: 0,
      state: '',
    },
  };
  // 알고리즘 스코어 계산
  if (typeof algoData !== 'boolean') {
    Object.keys(algoData).forEach((e) => {
      if (e !== 'matchCount' && algoData[e] !== false) {
        switch (e) {
          case 'deathPerMatch': {
            inGameData.summonerMatchData.match?.forEach((game) => {
              for (const participant of game.matchData!.info.participants) {
                if (participant.summonerName === inGameData.summonerMatchData.player?.gameName) {
                  algoScore.deathPerMatch.score += participant.deaths;
                  break;
                }
              }
            });
            algoScore.deathPerMatch.score /= inGameData.summonerMatchData.match!.length;
            algoScore.deathPerMatch.state = `평균 데스 : ${algoScore.deathPerMatch.score.toFixed(2)} / ${inGameData.summonerMatchData.match?.length} game`;
            break;
          }
          case 'KDAPerMatch': {
            inGameData.summonerMatchData.match?.forEach((game) => {
              for (const participant of game.matchData!.info.participants) {
                if (participant.summonerName === inGameData.summonerMatchData.player?.gameName) {
                  algoScore.KDAPerMatch.score
                += (participant.kills + participant.assists) / participant.deaths;
                  break;
                }
              }
            });
            algoScore.KDAPerMatch.score /= inGameData.summonerMatchData.match!.length;
            algoScore.KDAPerMatch.state = `평균 KDA : ${algoScore.KDAPerMatch.score.toFixed(2)} / ${inGameData.summonerMatchData.match!.length} game`;
            break;
          }
          case 'winRate': {
            inGameData.summonerMatchData.match?.forEach((game) => {
              for (const participant of game.matchData!.info.participants) {
                if (participant.summonerName === inGameData.summonerMatchData.player?.gameName) {
                  if (participant.win)algoScore.winRate.score += 1;
                  break;
                }
              }
            });

            algoScore.winRate.score /= inGameData.summonerMatchData.match!.length;
            algoScore.winRate.score *= 100;
            algoScore.winRate.state = `최근 승률 : ${algoScore.winRate.score.toFixed(2)}%`;
            break;
          }
          case 'maxDeathPerCount': {
            inGameData.summonerMatchData.match?.forEach((game) => {
              for (const participant of game.matchData!.info.participants) {
                if (participant.summonerName === inGameData.summonerMatchData.player?.gameName) {
                  if (participant.deaths > (<AlgorithmDeath_type>algoData[e]).maxDeath) {
                    algoScore.maxDeathPerCount.score += 1;
                  }
                  break;
                }
              }
            });
            algoScore.maxDeathPerCount.state = `${(<AlgorithmDeath_type>algoData[e]).maxDeath}데스 경기 : ${algoScore.maxDeathPerCount.score}회 / ${inGameData.summonerMatchData.match!.length} game`;
            algoScore.maxDeathPerCount.score /= inGameData.summonerMatchData.match!.length;
            algoScore.maxDeathPerCount.score *= 100;
            break;
          }
          case 'positionRatio': {
            inGameData.summonerMatchData.match?.forEach((game) => {
              for (const participant of game.matchData!.info.participants) {
                if (participant.summonerName === inGameData.summonerMatchData.player?.gameName) {
                  if (participant.individualPosition.toLowerCase()
                  === inGameData.assignedPosition) {
                    algoScore.positionRatio.score += 1;
                  }
                  break;
                }
              }
            });
            algoScore.positionRatio.state = `포지션 배정 : ${algoScore.positionRatio.score}회 / ${inGameData.summonerMatchData.match!.length} game `;
            algoScore.positionRatio.score /= inGameData.summonerMatchData.match!.length;
            algoScore.positionRatio.score *= 100;
            break;
          }
          case 'champUseRatio': {
            let champ = 0;
            if (inGameData.championId) {
              champ = inGameData.championId;
            }
            if (champ) {
              inGameData.summonerMatchData.match?.forEach((game) => {
                for (const participant of game.matchData!.info.participants) {
                  if (participant.summonerName === inGameData.summonerMatchData.player?.gameName) {
                    if (champ === participant.championId)algoScore.champUseRatio.score += 1;
                    break;
                  }
                }
              });
              algoScore.champUseRatio.state = `챔피언 사용 : ${algoScore.champUseRatio.score}회 / ${inGameData.summonerMatchData.match!.length} game `;
              algoScore.champUseRatio.score /= inGameData.summonerMatchData.match!.length;
              algoScore.champUseRatio.score *= 100;
            } else {
              algoScore.champUseRatio.score = 100;
            }
            break;
          }
          case 'userLevel': {
            // eslint-disable-next-line max-len
            algoScore.userLevel.score = parseInt(inGameData.summonerMatchData.player!.lol.level!, 10);
            algoScore.userLevel.state = `유저 레벨 : ${algoScore.userLevel.score}`;
            break;
          }
          case 'isPrevSeason': {
            const tierList = ['CHALLENGER', 'GRANDMASTER', 'MASTER', 'DIAMOND', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'IRON'];
            if (('rankedPrevSeasonTier' in inGameData.summonerMatchData.player!.lol)) {
              if (
                (tierList.includes(inGameData.summonerMatchData.player!.lol.rankedPrevSeasonTier))
              ) {
                algoScore.isPrevSeason.score = 1;
                algoScore.isPrevSeason.state = ' :전 시즌 기록 있음';
              } else {
                algoScore.isPrevSeason.score = 0;
                algoScore.isPrevSeason.state = ' :쌩배로 추정됨';
              }
            } else {
              algoScore.isPrevSeason.score = 1;
              algoScore.isPrevSeason.state = ' :API에러로 불러오지 못했습니다ㅠㅠ';
            }
            break;
          }
          default:
            break;
        }
        if (e !== 'matchCount')(<scoreState>algoScore[e]).score = rawToRatioScore((<scoreState>algoScore[e]).score, algoData[e]);
      }
    });
  }
  // essentialProps(쌩배,포꼬,꼴픽) 계산
  algoScore.essential = {
    쌩배: {
      apiStatus: false,
    },
    포꼬: {
      positionRate: [0, 0, 0, 0, 0],
      state: false,
    },
    꼴픽: {
      champUse: 0,
      champ: inGameData.championId,
      state: false,
    },
  };
  const positionList = ['top', 'jungle', 'middle', 'bottom', 'utility'];
  const tierList = ['CHALLENGER', 'GRANDMASTER', 'MASTER', 'DIAMOND', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'IRON'];
  if (('rankedPrevSeasonTier' in inGameData.summonerMatchData.player!.lol)) {
    algoScore.essential.쌩배 = {
      prevTier: inGameData.summonerMatchData.player!.lol.rankedPrevSeasonTier,
      prevLeague: inGameData.summonerMatchData.player!.lol.rankedPrevSeasonDivision,
      apiStatus: true,
    };
    if (!(tierList.includes(inGameData.summonerMatchData.player!.lol.rankedPrevSeasonTier))) {
      algoScore.essential.쌩배.state = true;
    } else {
      algoScore.essential.쌩배.state = false;
    }
  }
  inGameData.summonerMatchData.match?.forEach((game) => {
    for (const participant of game.matchData!.info.participants) {
      if (participant.summonerName === inGameData.summonerMatchData.player!.gameName
        && algoScore.essential) {
        if (inGameData.championId === participant.championId) {
          algoScore.essential.꼴픽.champUse += 1;
        }
        algoScore.essential.포꼬.positionRate[
          positionList.indexOf(participant.individualPosition.toLowerCase())
        ] += 1;
      }
    }
  });
  // 주, 부포지션 벗어날 경우
  if (getPositionTwisted(
    algoScore.essential.포꼬.positionRate,
    positionList.indexOf(inGameData.assignedPosition),
  )
  )algoScore.essential.포꼬.state = true;
  // 꼴픽일 경우
  if (inGameData.championId && !algoScore.essential.꼴픽.champUse) {
    algoScore.essential.꼴픽.state = true;
  }
  return algoScore;
};

export default algoAnalysis;
