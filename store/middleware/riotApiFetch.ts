import { ParticipantMatchData_type } from '../../types/matchData.type';
import { Algorithms_type } from '../../types/algorithm.type';

import { setApiUser, setUserApiStatus, setLeagueUser } from '../user';
import { clearInGame, setSummonerMatchData, inGameDataType } from '../inGame';

import type{ RiotAPI } from '../../process_main/apis/riot';

const riotAPiFetch = (RiotConnection: RiotAPI) => (store:any) => (next:any) => (action:any) => {
  const result = next(action);

  switch (action.type) {
    case 'SET_LOCAL_USER':
      RiotConnection.getSummoner(action.payload.internalName)
        .then((data) => {
          store.dispatch(setApiUser(data));
          store.dispatch(setUserApiStatus({ summoner: true }));
          RiotConnection.getLeague(data.id)
            .then((entry) => {
              store.dispatch(setLeagueUser({
                leagueId: 'c8b8e04e-d1c0-4837-a6dd-e291c2be1c94',
                queueType: 'RANKED_SOLO_5x5',
                tier: 'GRANDMASTER',
                rank: 'I',
                summonerId: 'N8KalKcO0HaCtfH2NUOLITasx3RIlazuiyHP5dOVmlVNQA',
                summonerName: '강찬밥',
                leaguePoints: 33,
                wins: 600,
                losses: 585,
                veteran: false,
                inactive: false,
                freshBlood: true,
                hotStreak: false,
              }));
              // store.dispatch(setLeagueUser(entry));
              store.dispatch(setUserApiStatus({ league: true }));
            })
            .catch(() => {
              store.dispatch(setUserApiStatus({ league: false }));
            });
        })
        .catch(() => {
          store.dispatch(setUserApiStatus({ summoner: false }));
        });
      break;
    case 'SET_PICK_STATUS':
      if (action.payload.length === 0) {
        store.dispatch(clearInGame());
      }
      break;
    case 'SET_SUMMONER_FEATURE':

      store.getState().ALGORITHM.forEach((algo:Algorithms_type) => {
        console.log('set summoner feature');
        if (algo.selected && algo.algoData.matchCount) {
          RiotConnection.playerToHistory(action.payload, algo.algoData.matchCount)
            .then((data) => {
              const order:number[] = [];
              if (store.getState().INGAME.length) {
                store.getState().INGAME.forEach((element:inGameDataType) => {
                  order.push(element.summonerId);
                });
                console.log(order);
                data.sort((a:ParticipantMatchData_type, b:ParticipantMatchData_type) => {
                  const aorder = order.indexOf(a.player?.summonerId ? a.player.summonerId : 0);
                  const border = order.indexOf(b.player?.summonerId ? b.player.summonerId : 0);
                  return aorder - border;
                });
                store.dispatch(setSummonerMatchData(data));
              }
            });
        }
      });
      break;
    default:
      break;
  }
  return result;
};

export default riotAPiFetch;
